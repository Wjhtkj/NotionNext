'use client'

import { useEffect, useRef, useState } from 'react'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * Spine 看板娘（移植自 astro-theme-AronaNote 的 SpinePlayer.vue）
 * 使用 pixi.js v8 + @esotericsoftware/spine-pixi-v8
 * 浅色=arona / 深色=plana（均为全身版骨架）
 * 支持：待机动画、眨眼、眼睛跟随鼠标、点击说话、复制事件
 * 无语音播放：台词与骨架角色一致，按字数估算字幕停留时长。
 */
export default function SpinePlayer() {
  const containerRef = useRef(null)
  const [dialog, setDialog] = useState({ text: '', left: 0, top: 0, show: false })

  useEffect(() => {
    if (!siteConfig('ARONA_SPINE_ENABLE', false, CONFIG)) return
    const characters = siteConfig('ARONA_SPINE_CHARACTERS', {}, CONFIG)
    const lightChar = siteConfig('ARONA_SPINE_LIGHT_CHAR', 'arona', CONFIG)
    const darkChar = siteConfig('ARONA_SPINE_DARK_CHAR', 'plana', CONFIG)

    let disposed = false
    let app = null
    let spine = null
    let blinkTimer = null
    let moveHandler = null
    let resizeObserver = null
    let skeletonAspect = 1
    let bounds = null
    let currentChar = lightChar
    let isPlaying = false
    let isDialogPlaying = false
    let eyeDisabled = false
    let lastIndex = -1
    let skeleton = null
    let animationState = null
    let resetBonesFn = null
    let eyeBones = {}
    let headBones = {}
    let eyeAngle = 76.307
    /* 字幕的关闭定时器。用 ref 持有：playRandomVoice / onCopy 可能交叠
       （连点或复制与点击几乎同时），只清最后一个会把前一个漏掉，
       导致字幕提前消失或永远不消失。 */
    const dialogTimers = new Set()
    /* initSpine 是 async，内部有多个 await（动态 import、fetch、skel 解析），
       而 onMount 与暗色切换的 MutationObserver 可能几乎同时触发它。
       没有守卫时两次调用会交错：后一次的 cleanup() 放掉了前一次的 renderer，
       但前一次仍会继续往下执行并把自己的 spine 挂到已被替换的 app.stage 上，
       结果两个 skeleton 共用同一 stage —— 视觉上就是「两个看板娘重叠」。
       用单调递增的 token 判定「我还是最新那次吗」，不是最新就立即收尾退出。 */
    let initToken = 0

    /* 无语音时，按字数估算字幕停留时间。
       中文口语约 4.2 字/秒，行数多时逐行累加阅读时间；
       上下限各留 2.4s / 9s，避免一句话一闪而过或念完还杵着不走。 */
    const estimateDialogMs = text => {
      const lines = String(text || '').split('\n').filter(Boolean)
      const chars = lines.reduce((n, l) => n + l.length, 0)
      const readMs = (chars / 4.2) * 1000
      const lineMs = lines.length * 700
      return Math.min(9000, Math.max(2400, readMs + lineMs + 600))
    }
    const waitDialog = ms =>
      new Promise(resolve => {
        const t = setTimeout(() => {
          dialogTimers.delete(t)
          resolve()
        }, ms)
        dialogTimers.add(t)
      })
    const clearDialogTimers = () => {
      dialogTimers.forEach(clearTimeout)
      dialogTimers.clear()
    }

    const isDark = () =>
      document.documentElement.classList.contains('dark') ||
      document.documentElement.getAttribute('theme') === 'dark' ||
      document.documentElement.getAttribute('data-theme') === 'dark'

    const cleanup = () => {
      if (blinkTimer) clearTimeout(blinkTimer)
      if (moveHandler) window.removeEventListener('mousemove', moveHandler)
      moveHandler = null
      if (resizeObserver && containerRef.current) {
        resizeObserver.disconnect()
        resizeObserver = null
      }
      if (containerRef.current) containerRef.current.innerHTML = ''
      if (app) {
        app.destroy(true, { children: true, texture: true })
        app = null
        spine = null
      }
      clearDialogTimers()
    }

    const updateDialogPos = () => {
      if (!containerRef.current) return
      const r = containerRef.current.getBoundingClientRect()
      setDialog(d => ({
        ...d,
        left: r.left + r.width / 2 - 120,
        top: r.top + r.height / 2 - 30
      }))
    }

    const showDialogText = text => {
      updateDialogPos()
      setDialog(d => ({ ...d, text, show: true }))
    }
    const hideDialog = () => setDialog(d => ({ ...d, show: false }))

    const rotate = (x, y, a) => ({
      x: x * Math.cos(a) - y * Math.sin(a),
      y: x * Math.sin(a) + y * Math.cos(a)
    })

    const moveBones = e => {
      if (eyeDisabled || !containerRef.current || !skeleton) return
      const rect = containerRef.current.getBoundingClientRect()
      const mx = e.clientX - (rect.right - rect.width / 2)
      const my = e.clientY - (rect.bottom - (rect.height * 4) / 5)
      const r = rotate(mx, my, (-eyeAngle * Math.PI) / 180)
      const dist = Math.sqrt(r.x * r.x + r.y * r.y)
      const ang = Math.atan2(r.y, r.x)
      const maxR = 15
      const dx = -Math.min(dist, maxR) * Math.cos(ang)
      const dy = Math.min(dist, maxR) * Math.sin(ang)
      if (eyeBones.r) { eyeBones.r.x = eyeBones.rcx + dx; eyeBones.r.y = eyeBones.rcy + dy }
      if (eyeBones.l) { eyeBones.l.x = eyeBones.lcx + dx; eyeBones.l.y = eyeBones.lcy + dy }
      skeleton.updateWorldTransform(1)
    }

    const resetBones = () => {
      if (!skeleton) return
      if (eyeBones.r) { eyeBones.r.x = eyeBones.rcx; eyeBones.r.y = eyeBones.rcy }
      if (eyeBones.l) { eyeBones.l.x = eyeBones.lcx; eyeBones.l.y = eyeBones.lcy }
      if (headBones.f) { headBones.f.x = headBones.fcx; headBones.f.y = headBones.fcy }
      if (headBones.b) { headBones.b.x = headBones.bcx; headBones.b.y = headBones.bcy }
      skeleton.updateWorldTransform(1)
    }

    const blink = () => {
      if (isDialogPlaying) {
        blinkTimer = setTimeout(blink, 500)
        return
      }
      const t = Math.random() * 3 + 3
      if (currentCharCfg?.eyeCloseAnimationName) {
        animationState.setAnimation(1, currentCharCfg.eyeCloseAnimationName, false)
        if (Math.random() > 0.5)
          animationState.addAnimation(1, currentCharCfg.eyeCloseAnimationName, false, 0.1)
      }
      blinkTimer = setTimeout(blink, t * 1000)
    }

    let currentCharCfg = null

    const initSpine = async charKey => {
      const cfg = characters[charKey]
      if (!cfg || !containerRef.current) return
      /* 领取本次令牌；cleanup() 会让上一轮持有的令牌失效 */
      const myToken = ++initToken
      const isStale = () => disposed || myToken !== initToken
      cleanup()
      /* 资源全部先放局部变量，确认不过期后再写回共享状态，
         避免过期的那次污染当前角色。 */
      let myApp = null
      let mySpine = null
      let myResizeObserver = null
      try {
        /* 关键：SkeletonBinary / AtlasAttachmentLoader 必须从 @esotericsoftware/spine-pixi-v8 取，
           它与 Spine 共用同一份 spine-core 实例。若从 @esotericsoftware/spine-core 直连引入，
           当 npm 解析出两份不同版本的 spine-core（4.2.x 与 4.3.x 的二进制格式互不兼容，
           资源是 4.2.33）时，解析结果与 Spine 的类身份不一致，角色会静默加载失败。 */
        const PIXI = await import('pixi.js')
        const spinePixi = await import('@esotericsoftware/spine-pixi-v8')
        if (isStale() || !containerRef.current) return

        const scaleFactor = 2
        /* width:auto 的定高容器在内容为空时 clientWidth 为 0，会让 canvas 宽度为 0 而完全不可见。
           先用容器高度占位，待骨架解析出真实宽高比后再修正（下面有 ResizeObserver 兜底）。 */
        const initH = containerRef.current.clientHeight || 300
        const initW = containerRef.current.clientWidth || initH
        if (!containerRef.current.clientWidth) {
          containerRef.current.style.width = initW + 'px'
        }
        myApp = new PIXI.Application()
        await myApp.init({
          width: initW * scaleFactor,
          height: initH * scaleFactor,
          backgroundAlpha: 0,
          antialias: true,
          resolution: 1
        })
        if (isStale() || !containerRef.current) {
          myApp.destroy(true, { children: true, texture: true })
          return
        }
        containerRef.current.appendChild(myApp.canvas)

        const atlas = await PIXI.Assets.load(cfg.atlasUrl)
        if (isStale()) return
        const res = await fetch(cfg.skelUrl)
        if (!res.ok) {
          throw new Error(`骨架文件加载失败 HTTP ${res.status}：${cfg.skelUrl}`)
        }
        const data = new Uint8Array(await res.arrayBuffer())
        if (isStale()) return
        const parser = new spinePixi.SkeletonBinary(new spinePixi.AtlasAttachmentLoader(atlas))
        const skeletonData = parser.readSkeletonData(data)
        if (isStale()) return

        mySpine = new spinePixi.Spine({ skeletonData, autoUpdate: true })
        mySpine.skeleton.updateWorldTransform(1)
        const myBounds = mySpine.skeleton.getBoundsRect()
        const myAspect = (myBounds.width || 500) / (myBounds.height || 500)
        const ch = containerRef.current.clientHeight
        const cw = ch * myAspect
        containerRef.current.style.width = cw + 'px'

        const s = ch / (myBounds.height || 500)
        mySpine.scale.set(s * scaleFactor)
        mySpine.position.set(
          -myBounds.x * s * scaleFactor,
          (ch - (myBounds.y + myBounds.height) * s) * scaleFactor
        )
        mySpine.batched = false
        myApp.stage.addChild(mySpine)

        /* 到这里确认本次仍是最新一次，才提交到共享状态 */
        app = myApp
        spine = mySpine
        bounds = myBounds
        skeletonAspect = myAspect
        currentCharCfg = cfg
        currentChar = charKey
        eyeAngle = cfg.eyeRotationAngle || 76.307

        skeleton = mySpine.skeleton
        animationState = mySpine.state
        if (cfg.idleAnimationName) animationState.setAnimation(0, cfg.idleAnimationName, true)

        const fb = cfg.frontHeadBone ? skeleton.findBone(cfg.frontHeadBone) : null
        const bb = cfg.backHeadBone ? skeleton.findBone(cfg.backHeadBone) : null
        const rb = cfg.rightEyeBone ? skeleton.findBone(cfg.rightEyeBone) : null
        const lb = cfg.leftEyeBone ? skeleton.findBone(cfg.leftEyeBone) : null
        eyeBones = {
          r: rb, l: lb,
          rcx: rb?.data.x || 0, rcy: rb?.data.y || 0,
          lcx: lb?.data.x || 0, lcy: lb?.data.y || 0
        }
        headBones = {
          f: fb, b: bb,
          fcx: fb?.data.x || 0, fcy: fb?.data.y || 0,
          bcx: bb?.data.x || 0, bcy: bb?.data.y || 0
        }
        resetBonesFn = resetBones

        if (window.matchMedia && !window.matchMedia('(hover: none)').matches) {
          moveHandler = moveBones
          window.addEventListener('mousemove', moveHandler)
        }
        blink()

        // ResizeObserver
        myResizeObserver = new ResizeObserver(entries => {
          for (const entry of entries) {
            const nh = entry.contentRect.height
            const nw = nh * myAspect
            if (containerRef.current) containerRef.current.style.width = nw + 'px'
            if (myApp && mySpine) {
              myApp.renderer.resize(nw * scaleFactor, nh * scaleFactor)
              const ns = nh / (myBounds.height || 500)
              mySpine.scale.set(ns * scaleFactor)
              mySpine.position.set(-myBounds.x * ns * scaleFactor, (nh - (myBounds.y + myBounds.height) * ns) * scaleFactor)
            }
            if (dialog.show) updateDialogPos()
          }
        })
        myResizeObserver.observe(containerRef.current)
        resizeObserver = myResizeObserver
      } catch (err) {
        /* 过期的那次不必报警，它是被新一轮主动取消的 */
        if (!isStale()) {
          console.error(`[arona-spine] 角色「${charKey}」初始化失败：`, err, '\n  skelUrl =', cfg.skelUrl)
        }
        if (isStale()) {
          if (myResizeObserver) myResizeObserver.disconnect()
          if (myApp) myApp.destroy(true, { children: true, texture: true })
        }
      }
    }

    const playRandomVoice = async () => {
      if (isPlaying || !currentCharCfg) return
      const list = currentCharCfg.voiceConfig || []
      if (!list.length) return
      isPlaying = true
      isDialogPlaying = true
      eyeDisabled = true
      resetBonesFn && resetBonesFn()
      let idx
      do { idx = Math.floor(Math.random() * list.length) } while (idx === lastIndex && list.length > 1)
      lastIndex = idx
      const pair = list[idx]
      showDialogText(pair.text)
      try {
        if (spine && pair.animation) animationState.setAnimation(2, pair.animation, false)
        await waitDialog(estimateDialogMs(pair.text))
        isPlaying = false
        isDialogPlaying = false
        eyeDisabled = false
        if (spine) animationState.setEmptyAnimation(2, 0)
        hideDialog()
      } catch (e) {
        isPlaying = false
        isDialogPlaying = false
        eyeDisabled = false
        hideDialog()
      }
    }

    const onPlayerClick = e => {
      e.preventDefault()
      e.stopPropagation()
      playRandomVoice()
    }

    const onCopy = async () => {
      if (!currentCharCfg?.copyConfig || isPlaying) return
      const cc = currentCharCfg.copyConfig
      isPlaying = true
      isDialogPlaying = true
      eyeDisabled = true
      resetBonesFn && resetBonesFn()
      try {
        showDialogText(cc.text)
        if (spine && cc.animation) animationState.setAnimation(2, cc.animation, false)
        await waitDialog(Math.max(2400, estimateDialogMs(cc.text)))
        isPlaying = false
        isDialogPlaying = false
        eyeDisabled = false
        if (spine) animationState.setEmptyAnimation(2, 0)
        hideDialog()
      } catch {
        isPlaying = false
        isDialogPlaying = false
        eyeDisabled = false
        hideDialog()
      }
    }

    // 看板娘开关
    const applySpineEnabled = enabled => {
      const el = containerRef.current
      if (el) el.classList.toggle('hidden', !enabled)
    }
    const onSpineToggle = evt => {
      applySpineEnabled(evt?.detail ? evt.detail.enabled : true)
    }

    // 主题切换时切换角色。
    // 注意：currentChar 只在 initSpine 真正加载成功后才更新（见 isStale 守卫），
    // 若像以前那样在 initSpine 开头就赋值，那么「快速来回切换两次」时
    // 第二次会因 want === currentChar 而跳过，但第一次的 init 已被作废，
    // 结果角色实际上一只都没加载出来。
    const observer = new MutationObserver(() => {
      const want = isDark() ? darkChar : lightChar
      if (want !== currentChar) initSpine(want)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'theme', 'data-theme'] })

    const onMount = () => {
      initSpine(isDark() ? darkChar : lightChar)
      const el = containerRef.current
      if (el) {
        /* 只监听 click：移动端触摸也会合成 click，若同时绑 touchstart
           一次点按会进来两次，白白消耗一次随机数并重置动画。 */
        el.addEventListener('click', onPlayerClick)
      }
      window.addEventListener('copy', onCopy, true)
      window.addEventListener('spine-toggle', onSpineToggle)
      try {
        applySpineEnabled(localStorage.getItem('spine-enabled') !== 'false')
      } catch (err) {
        /* ignore */
      }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onMount)
    else onMount()

    return () => {
      disposed = true
      observer.disconnect()
      window.removeEventListener('copy', onCopy, true)
      window.removeEventListener('spine-toggle', onSpineToggle)
      const el = containerRef.current
      if (el) {
        el.removeEventListener('click', onPlayerClick)
        el.removeEventListener('touchstart', onPlayerClick)
      }
      cleanup()
    }
  }, [])

  if (!siteConfig('ARONA_SPINE_ENABLE', false, CONFIG)) return null

  return (
    <>
      <div className='arona-spine-wrap' ref={containerRef} />
      {dialog.show && (
        <div className='arona-spine-dialog' style={{ left: dialog.left, top: dialog.top }}>
          {dialog.text}
        </div>
      )}
    </>
  )
}
