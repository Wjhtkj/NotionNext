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
  const [dialog, setDialog] = useState({ text: '', left: 0, top: 0, width: 240, show: false })

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
    /* 视口重算的清理函数集合（resize / orientationchange 监听）。
       必须是 const + 原地清空：initSpine 每次都会先 cleanup 再重新注册，
       若用 let 重新赋值，旧一轮 push 进去的函数会随数组一起丢失引用而泄漏监听。 */
    const relayoutFns = []
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

    /* ===== 音频 =====
       与语音成对使用：某条配了 audio 就播声音，只写了 text 就出静默字幕。
       音频加载或解码失败不能影响字幕 —— catch 后退回按字数估算。 */
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
      if (!audioCtx) return null
      const res = await fetch(url)
      if (!res.ok) throw new Error(`语音加载失败 HTTP ${res.status}：${url}`)
      const buf = await audioCtx.decodeAudioData(await res.arrayBuffer())
      audioCache.set(url, buf)
      return buf
    }
    const playAudio = buf =>
      new Promise(resolve => {
        /* Safari 的 AudioBufferSourceNode 极��在节点被 GC 后不触发 onended，
           兜一个上限时长，避免字幕永久卡住。 */
        const cap = setTimeout(resolve, Math.max(1000, (buf?.duration || 3) * 1000 + 400))
        const src = audioCtx.createBufferSource()
        src.buffer = buf
        src.connect(gainNode)
        src.onended = () => {
          clearTimeout(cap)
          resolve()
        }
        src.start()
      })

    /* 字幕停留时长：
       1. 配了 duration（实测秒数）就直接用，字幕严格跟录音走；
       2. 否则按字数估算 —— 中文口语约 4.2 字/秒，逐行累加阅读时间，
          上下限 2.4s / 12s（plana_01 有 9.12s 的长录音，9s 上限会截断）。 */
    const estimateDialogMs = text => {
      const lines = String(text || '').split('\n').filter(Boolean)
      const chars = lines.reduce((n, l) => n + l.length, 0)
      const readMs = (chars / 4.2) * 1000
      const lineMs = lines.length * 700
      return Math.min(12000, Math.max(2400, readMs + lineMs + 600))
    }
    const dialogMs = pair =>
      pair.duration ? Math.max(1600, pair.duration * 1000 + 350) : estimateDialogMs(pair.text)

    /* 只挑「已配好台词」的条目：text 为空的条目直接跳过，
       否则用户会听到声音却看到空气。 */
    const usableVoices = cfg =>
      (cfg.voiceConfig || []).filter(v => v && !v.skip && String(v.text || '').trim())

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

    /* ===== 响应式布局 =====
       两个骨架的实测比例不同：arona_spr 1011x2128 = 1:2.10，
       NP0035_spr 1154x2216 = 1:1.92，胖瘦差约 9%。
       原来只按高度（CSS 的 45vh）反算宽度，于是：
         · 同一高度下，plana 会比 arona 宽 9%，换角色时观感体型跳变；
         · 超宽屏上 45vh 很高，宽度也随之膨胀，可能横向溢出屏幕；
         · 竖屏/矮屏上 45vh 虽小，但 min-height:300px 会把角色顶出视口顶部。
       现在改为「高度与宽度双约束」：先按视口算出允许的最大高度，
       再用比例推出宽度；若宽度超过视口允许的份额，就按宽度反推高度。 */
    const LAYOUT = {
      /* 视口高度占比。移动端地址栏会改变可视高度，故上限压低一些更安全 */
      heightRatio: 0.45,
      minHeight: 200,
      /* 高度上限按视口宽度分档：大屏上 45vh 会让角色顶到 900px 以上，
         显得过大且压住正文。分档后 4K 约 760、QHD 约 620、1080p 约 486。 */
      maxHeightByWidth: [[2200, 760], [1700, 620], [0, 560]],
      /* 宽度最多占视口宽度的比例。左侧固定摆放，留 24px 边距 */
      maxWidthRatio: 0.34,
      /* 边距（px） */
      sideMargin: 24,
      bottomMargin: 25
    }

    const layoutFor = (b, aspect) => {
      const vw = Math.max(window.innerWidth || 1280, 320)
      const vh = Math.max(window.innerHeight || 800, 480)
      const capH = LAYOUT.maxHeightByWidth.find(([min]) => vw >= min)[1]
      let h = Math.min(vh * LAYOUT.heightRatio, capH)
      h = Math.max(h, Math.min(LAYOUT.minHeight, vh * 0.6))
      let w = h * aspect
      const wMax = vw * LAYOUT.maxWidthRatio - LAYOUT.sideMargin
      if (w > wMax) {
        w = Math.max(wMax, 120)
        h = w / aspect
      }
      /* 高度也不允许超出「视口减去底边距」，否则角色顶部被裁 */
      const hMax = vh - LAYOUT.bottomMargin - 8
      if (h > hMax) {
        h = Math.max(hMax, 160)
        w = h * aspect
      }
      return { width: Math.round(w), height: Math.round(h), scale: h / (b.height || 500) }
    }

    /* 把布局写回容器与 canvas。CSS 里 canvas 用 100%!important 拉伸，
       这里只负责给容器定尺寸 + 通知 pixi 调整渲染缓冲。
       renderer 必须显式传入：初始化阶段闭包里的 app 还没赋值，
       若在这里读 app 会拿到 null，canvas 缓冲就停留在旧的 300px 占位尺寸。 */
    const applyLayout = (l, b, aspect, scaleFactor, renderer) => {
      const el = containerRef.current
      if (!el) return
      el.style.width = l.width + 'px'
      el.style.height = l.height + 'px'
      el.dataset.aspect = aspect.toFixed(4)
      if (renderer) renderer.resize(l.width * scaleFactor, l.height * scaleFactor)
    }

    const cleanup = () => {
      if (blinkTimer) clearTimeout(blinkTimer)
      if (moveHandler) window.removeEventListener('mousemove', moveHandler)
      moveHandler = null
      relayoutFns.splice(0).forEach(fn => fn())
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
      clearDialogTimers()
    }

    /* 字幕定位：气泡在角色上方居中，但要夹在视口内。
       原来写死 -120px 偏移（假定气泡宽 240px），窄屏下角色本身已缩到很小，
       气泡会往左溢出屏幕；这里按实际容器尺寸与视口宽度算，并夹紧边界。 */
    const updateDialogPos = () => {
      if (!containerRef.current) return
      const r = containerRef.current.getBoundingClientRect()
      const vw = window.innerWidth || 1280
      const vh = window.innerHeight || 800
      const w = Math.min(r.width * 2.2 + 80, vw - 32)
      let left = r.left + r.width / 2 - w / 2
      left = Math.max(16, Math.min(left, vw - w - 16))
      let top = r.top - 12
      /* 顶部空间不够时改放到角色上方更高的位置，仍不够就压到视口内顶部 */
      const hGuess = 92
      if (top - hGuess < 8) top = Math.max(8, r.top - hGuess + 40)
      top = Math.max(8, Math.min(top, vh - hGuess - 8))
      setDialog(d => ({ ...d, left, top, width: w }))
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
        /* 先用 layoutFor 算出初始尺寸。
           不能依赖 clientWidth：容器是 width:auto，在内容为空时宽度为 0，
           曾导致线上出现 <canvas width="0"> 而角色完全不可见。
           骨架比例要等 parse 之后才知道，但骨架尺寸（2128/2216）在 config 里
           可以预置一个缺省比例先行初始化，parse 完成后 applyLayout 会精确修正。 */
        const bootBounds = { height: cfg.boundsHeight || 2100, width: 0 }
        bootBounds.width = bootBounds.height * (cfg.aspectRatio || 0.5)
        const bootLayout = layoutFor(bootBounds, bootBounds.width / bootBounds.height)
        myApp = new PIXI.Application()
        await myApp.init({
          width: bootLayout.width * scaleFactor,
          height: bootLayout.height * scaleFactor,
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
        /* 按视口同时约束高度与宽度，避免超宽屏上角色横向溢出、
           竖屏/矮屏上纵向超出视口。写入容器 CSS 变量供样式层复用。 */
        const myLayout = layoutFor(myBounds, myAspect)
        applyLayout(myLayout, myBounds, myAspect, scaleFactor, myApp.renderer)

        const s = myLayout.scale
        mySpine.scale.set(s * scaleFactor)
        mySpine.position.set(
          -myBounds.x * s * scaleFactor,
          (myLayout.height - (myBounds.y + myBounds.height) * s) * scaleFactor
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

        /* 视口尺寸变化时重算布局。
           只靠 ResizeObserver 不够：容器高度由 vh 决定，
           而 vh 在移动端浏览器地址栏收起/展开时会变，
           且只观察容器自身的 contentRect 会形成「改宽度→触发观察→再改宽度」的回环。
           所以额外监听 window.resize，并加防抖。 */
        let resizeRaf = 0
        const relayout = () => {
          if (resizeRaf) cancelAnimationFrame(resizeRaf)
          resizeRaf = requestAnimationFrame(() => {
            resizeRaf = 0
            if (!myApp || !mySpine || isStale()) return
            const l = layoutFor(myBounds, myAspect)
            applyLayout(l, myBounds, myAspect, scaleFactor, myApp.renderer)
            mySpine.scale.set(l.scale * scaleFactor)
            mySpine.position.set(
              -myBounds.x * l.scale * scaleFactor,
              (l.height - (myBounds.y + myBounds.height) * l.scale) * scaleFactor
            )
            if (dialog.show) updateDialogPos()
          })
        }
        window.addEventListener('resize', relayout)
        window.addEventListener('orientationchange', relayout)
        relayoutFns.push(() => {
          if (resizeRaf) cancelAnimationFrame(resizeRaf)
          window.removeEventListener('resize', relayout)
          window.removeEventListener('orientationchange', relayout)
        })

        myResizeObserver = new ResizeObserver(relayout)
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
      const list = usableVoices(currentCharCfg)
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
        /* 音频与字幕并行：音频通常要几百毫秒才解出来，
           若先 await 音频再计时，字幕会明显滞后于声音。
           这里用 Promise.race 兜底 —— 音频失败/超时就按 duration 或字数收尾。 */
        let audioDone
        if (pair.audio) {
          audioDone = loadAudio(pair.audio)
            .then(buf => (buf ? playAudio(buf) : null))
            .catch(err => {
              /* 音频坏了不该让角色失声，只降级成静默字幕 */
              console.warn('[arona-spine] 语音播放失败，已降级为静默字幕：', err)
              return null
            })
        }
        await Promise.race([audioDone || Promise.resolve(), waitDialog(dialogMs(pair))])
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
        let audioDone
        if (cc.audio) {
          audioDone = loadAudio(cc.audio)
            .then(buf => (buf ? playAudio(buf) : null))
            .catch(err => {
              console.warn('[arona-spine] 复制语音播放失败，已降级为静默字幕：', err)
              return null
            })
        }
        await Promise.race([audioDone || Promise.resolve(), waitDialog(dialogMs(cc))])
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
        <div
          className='arona-spine-dialog'
          style={{ left: dialog.left, top: dialog.top, width: dialog.width }}
        >
          {dialog.text}
        </div>
      )}
    </>
  )
}
