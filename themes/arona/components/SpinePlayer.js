'use client'

import { useEffect, useRef, useState } from 'react'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * Spine 看板娘（移植自 astro-theme-AronaNote 的 SpinePlayer.vue）
 * 使用 pixi.js v8 + @esotericsoftware/spine-pixi-v8
 * 浅色=arona(aris 资源) / 深色=plana(kei 资源)
 * 支持：待机动画、眨眼、眼睛跟随鼠标、点击播放语音+对话、复制事件
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

    // 音频管理
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    let audioCtx = null
    let gainNode = null
    const audioCache = new Map()
    const initAudio = () => {
      if (!audioCtx && AudioCtx) {
        audioCtx = new AudioCtx()
        gainNode = audioCtx.createGain()
        gainNode.gain.value = 0.5
        gainNode.connect(audioCtx.destination)
      }
    }
    const loadAudio = async url => {
      if (audioCache.has(url)) return audioCache.get(url)
      const res = await fetch(url)
      const buf = await audioCtx.decodeAudioData(await res.arrayBuffer())
      audioCache.set(url, buf)
      return buf
    }
    const playAudio = buf =>
      new Promise(resolve => {
        const src = audioCtx.createBufferSource()
        src.buffer = buf
        src.connect(gainNode)
        src.onended = () => resolve()
        src.start()
      })

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
      audioCache.clear()
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
      currentCharCfg = cfg
      currentChar = charKey
      eyeAngle = cfg.eyeRotationAngle || 76.307
      cleanup()
      try {
        const PIXI = await import('pixi.js')
        const spinePixi = await import('@esotericsoftware/spine-pixi-v8')
        const spineCore = await import('@esotericsoftware/spine-core')
        if (disposed || !containerRef.current) return

        const scaleFactor = 2
        app = new PIXI.Application()
        await app.init({
          width: containerRef.current.clientWidth * scaleFactor,
          height: containerRef.current.clientHeight * scaleFactor,
          backgroundAlpha: 0,
          antialias: true,
          resolution: 1
        })
        containerRef.current.appendChild(app.canvas)

        const atlas = await PIXI.Assets.load(cfg.atlasUrl)
        const res = await fetch(cfg.skelUrl)
        const data = new Uint8Array(await res.arrayBuffer())
        const parser = new spineCore.SkeletonBinary(new spineCore.AtlasAttachmentLoader(atlas))
        const skeletonData = parser.readSkeletonData(data)

        spine = new spinePixi.Spine({ skeletonData, autoUpdate: true })
        spine.skeleton.updateWorldTransform(1)
        bounds = spine.skeleton.getBoundsRect()
        skeletonAspect = (bounds.width || 500) / (bounds.height || 500)
        const ch = containerRef.current.clientHeight
        const cw = ch * skeletonAspect
        containerRef.current.style.width = cw + 'px'

        const s = ch / (bounds.height || 500)
        spine.scale.set(s * scaleFactor)
        spine.position.set(
          -bounds.x * s * scaleFactor,
          (ch - (bounds.y + bounds.height) * s) * scaleFactor
        )
        spine.batched = false
        app.stage.addChild(spine)

        skeleton = spine.skeleton
        animationState = spine.state
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
        resizeObserver = new ResizeObserver(entries => {
          for (const entry of entries) {
            const nh = entry.contentRect.height
            const nw = nh * skeletonAspect
            if (containerRef.current) containerRef.current.style.width = nw + 'px'
            if (app && spine && bounds) {
              app.renderer.resize(nw * scaleFactor, nh * scaleFactor)
              const ns = nh / (bounds.height || 500)
              spine.scale.set(ns * scaleFactor)
              spine.position.set(-bounds.x * ns * scaleFactor, (nh - (bounds.y + bounds.height) * ns) * scaleFactor)
            }
            if (dialog.show) updateDialogPos()
          }
        })
        resizeObserver.observe(containerRef.current)

        initAudio()
      } catch (err) {
        console.error('[arona-spine] init failed:', err)
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
      try {
        const buf = await loadAudio(pair.audio)
        showDialogText(pair.text)
        if (spine && pair.animation) animationState.setAnimation(2, pair.animation, false)
        await playAudio(buf)
        isPlaying = false
        isDialogPlaying = false
        eyeDisabled = false
        if (spine) animationState.setEmptyAnimation(2, 0)
        hideDialog()
      } catch (e) {
        isPlaying = false; isDialogPlaying = false; eyeDisabled = false
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
      isPlaying = true; isDialogPlaying = true; eyeDisabled = true
      resetBonesFn && resetBonesFn()
      try {
        showDialogText(cc.text)
        if (spine && cc.animation) animationState.setAnimation(2, cc.animation, false)
        if (cc.audio) {
          const buf = await loadAudio(cc.audio)
          await playAudio(buf)
        }
        await new Promise(r => setTimeout(r, 2000))
        isPlaying = false; isDialogPlaying = false; eyeDisabled = false
        if (spine) animationState.setEmptyAnimation(2, 0)
        hideDialog()
      } catch {
        isPlaying = false; isDialogPlaying = false; eyeDisabled = false
        hideDialog()
      }
    }

    // 主题切换时切换角色
    const observer = new MutationObserver(() => {
      const want = isDark() ? darkChar : lightChar
      if (want !== currentChar) initSpine(want)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'theme', 'data-theme'] })

    const onMount = () => {
      initSpine(isDark() ? darkChar : lightChar)
      const el = containerRef.current
      if (el) {
        el.addEventListener('click', onPlayerClick)
        el.addEventListener('touchstart', onPlayerClick)
      }
      window.addEventListener('copy', onCopy, true)
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onMount)
    else onMount()

    return () => {
      disposed = true
      observer.disconnect()
      window.removeEventListener('copy', onCopy, true)
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
