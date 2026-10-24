'use client'

import { useGlobal } from '@/lib/global'
import { useEffect, useRef, useState } from 'react'

/**
 * 专门的深浅色切换按钮（导航右侧，汉堡按钮左边）
 *
 * 它取代了下拉面板里的那个 <select>（Arona / Plana / System 三选一）。
 * 之所以值得单独做一个按钮：主题是高频操作，而原先要「点汉堡 → 面板展开 →
 * 点开下拉 → 选一项」四步才能换，且那个 select 在触屏上还要再弹一层系统选择器。
 *
 * 两处实现细节值得说明：
 *
 * 1) 图标由 CSS 按 <html> 的类切换，不用 JS state 决定显不显示。
 *    _document.js 的内联脚本在首屏绘制**之前**就把 dark/light 类设好了，
 *    所以图标从第一帧就是对的；同时也彻底避开了「服务端渲染一套、
 *    客户端渲染另一套」的 hydration 不一致。JS state 只用来生成
 *    aria-label / title 的文案，晚一帧也无所谓。
 *
 * 2) 点击时要写两个 localStorage 键，只写一个会引出真实 bug：
 *      darkMode          —— _document.js 的内联脚本首屏前读它，
 *                            NotionNext 自己的 initDarkMode 也读它。
 *                            以前下拉菜单从来不写它，导致每位用户
 *                            首次加载都要按 APPEARANCE 默认色闪一下。
 *      arona-theme-pref  —— SpinePlayer 靠它选看板娘角色（arona/plana），
 *                            LayoutBase 首次加载也读它。
 *
 * 3) 切换动画是「以按钮为圆心的圆形揭幕」，用 View Transitions API 实现，
 *    详见 toggleTheme 上方的注释。**不要再退回「全屏遮罩 + clip-path」那套**：
 *    clip-path 的圆半径取「点击点到最远视口角」，这个圆恒等于或大于整个
 *    视口矩形，裁剪边界永远落在盒子外面 —— 遮罩实际上一直是个矩形，
 *    scale() 缩小时看起来就是「一块矩形往按钮里缩」，不是圆形揭幕。
 */
export const ThemeToggle = () => {
  const { isDarkMode, updateDarkMode } = useGlobal()
  /* 仅用于无障碍文案；图标显隐见 CSS。初值取上下文（= blog.config 的
     APPEARANCE），与服务端渲染一致，不会 hydration 报警。 */
  const [dark, setDark] = useState(!!isDarkMode)
  const animTimer = useRef(null)
  /* 揭幕的序号：连点时用它判断「这次回调还是不是最新的那次」，
     避免上一段动画的收尾把新动画要用的类摘掉 */
  const seqRef = useRef(0)

  /* 别人改了主题也要同步文案（例如将来再加别的切换入口）。
     监听 <html> 的 class/theme 属性即可，这是全局唯一的事实来源。 */
  useEffect(() => {
    const sync = () => {
      setDark(
        document.documentElement.classList.contains('dark') ||
          document.documentElement.getAttribute('theme') === 'dark'
      )
    }
    sync()
    const mo = new MutationObserver(sync)
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'theme', 'data-theme']
    })
    return () => mo.disconnect()
  }, [])

  /* 卸载时清掉计时器与可能残留的状态类 */
  useEffect(
    () => () => {
      if (animTimer.current) clearTimeout(animTimer.current)
      document.documentElement.classList.remove('arona-theme-switching')
    },
    []
  )

  /* 预热两张主题背景图（浅 /arona/background.svg、深 /arona/background_dark.svg）。
     揭幕是拿「换肤后的新页面快照」来裁圆的：新背景图若还没解码，快照里就是
     一片纯色，圆扫过去之后图片才补上，等于白做了动画。从样式表里扫
     --theme-background-image 的声明拿 URL，不硬编码。 */
  useEffect(() => {
    try {
      for (const sheet of document.styleSheets) {
        let rules
        try {
          rules = sheet.cssRules
        } catch (e) {
          continue /* 跨域样式表读不了，跳过 */
        }
        for (const rule of rules) {
          const v = rule.style && rule.style.getPropertyValue('--theme-background-image')
          const m = v && /url\(["']?([^"')]+)["']?\)/.exec(v)
          if (m) {
            const img = new Image()
            img.src = m[1]
          }
        }
      }
    } catch (e) {
      /* 预热失败不影响功能，只是第一次切换时圆里可能晚一帧出图 */
    }
  }, [])

  const isDarkNow = () =>
    document.documentElement.classList.contains('dark') ||
    document.documentElement.getAttribute('theme') === 'dark'

  /* 真正换主题（不带动画）。抽出成函数是因为揭幕要在 View Transition 的
     回调里调用它，退化路径也直接调用它。
     animate=false 供揭幕使用：快照拍的就是换肤后的静止画面，颜色过渡
     不但看不见，还会让快照停在中间色上（详见下方 arona-theme-switching）。 */
  const applyTheme = (next, animate = true) => {
    const root = document.documentElement

    try {
      localStorage.setItem('darkMode', String(next))
      localStorage.setItem('arona-theme-pref', next ? 'dark' : 'light')
    } catch (e) {
      /* 隐私模式下写不进去：本次会话仍能正常切换，只是刷新后不保留 */
    }

    /* 同步 <html> 不能等 React 的 effect —— 那要等一整轮渲染+提交，
       中间会有一帧旧主题；而且 SpinePlayer / Banner 的 MutationObserver
       也是靠这个属性变化才收到通知的。 */
    root.classList.remove(next ? 'light' : 'dark')
    root.classList.add(next ? 'dark' : 'light')
    root.setAttribute('theme', next ? 'dark' : 'light')

    /* 再通知全局状态，让 React 侧保持一致。LayoutBase 的 effect 会把
       上面手动设的类原样再设一遍，幂等，不会互相打架。 */
    updateDarkMode?.(next)
    setDark(next)
    window.dispatchEvent(new CustomEvent('arona-theme-change', { detail: { dark: next } }))

    /* 颜色过渡：给 <html> 挂一个短命类，让页面底色平滑变色，
       400ms 后摘掉。快速连点时重置计时器，避免类被过早摘掉。
       这条路径只给「不支持 View Transitions 的浏览器」用。 */
    if (animTimer.current) {
      clearTimeout(animTimer.current)
      animTimer.current = null
    }
    if (animate) {
      root.classList.add('arona-theme-anim')
      animTimer.current = setTimeout(() => {
        root.classList.remove('arona-theme-anim')
        animTimer.current = null
      }, 400)
    } else {
      root.classList.remove('arona-theme-anim')
    }
  }

  /* 主题切换动画：以按钮为圆心的圆形揭幕（View Transitions API）。
     时序：
       1. 把圆心/半径写进 <html> 的 --arona-reveal-*（CSS 关键帧要用）；
       2. 挂 arona-theme-switching：关掉根元素自身 500ms 的背景过渡，
          否则快照会拍在「浅色→深色」的中间态上，圆里是灰的；
       3. startViewTransition(() => applyTheme(next, false))：浏览器在回调
          返回后给旧页面、新页面各拍一张位图，然后把两张图放进顶层叠加；
       4. CSS 里 ::view-transition-old(root) 不参与动画（一直铺着，就是旧页面），
          ::view-transition-new(root) 按 circle(0) → circle(R) 裁切 ——
          新主题随圆边扩张被揭开，旧页面在圆外原样保留，连文字一起；
       5. 过渡结束（finished）后摘掉 switching 类。

     为什么换掉旧实现（全屏遮罩复制旧背景 + transform: scale）：
     那条路有两个硬伤。① 圆是假的：clip 半径取「点击点到最远角」，圆恒大于
     视口矩形，裁剪从不生效，实际渲染是**矩形**在缩小（实测截图）；
     ② 遮罩只复制了背景，页面文字/卡片在点击瞬间就换成新主题了，圆里是
     一块没有内容的底色，看起来像闪了一下。View Transitions 直接把两帧
     真实页面拿来叠，旧内容一直在，圆边扫过才换成新主题。
     成本也低：两张静态位图 + 一个 clip-path 动画，不重绘页面。

     不支持 View Transitions 的浏览器（Safari < 18.2、Firefox < 144）
     退回原来的 400ms 颜色过渡，不会出现「点了没反应」。 */
  const toggleTheme = e => {
    const next = !isDarkNow()

    /* 尊重系统「减少动画」：直接换，不插过渡 */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyTheme(next)
      return
    }

    const root = document.documentElement
    if (typeof document.startViewTransition !== 'function') {
      applyTheme(next)
      return
    }

    /* 点击坐标。键盘触发（Enter/Space）时 clientX/Y 都是 0，
       用按钮中心兜底，圆仍然从按钮位置展开。
       再夹到视口内：万一按钮此刻在视口外（键盘聚焦时页面正在滚动），
       圆心落在屏幕边上，揭幕仍然是从「最靠近按钮的那条边」推进来，
       而不是从屏幕外飘进来。 */
    const btn = e && e.currentTarget
    const rect = btn ? btn.getBoundingClientRect() : null
    const clamp = (v, max) => Math.min(Math.max(v, 0), max)
    const x = clamp(
      e && e.clientX ? e.clientX : rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
      window.innerWidth
    )
    const y = clamp(
      e && e.clientY ? e.clientY : rect ? rect.top + rect.height / 2 : window.innerHeight / 2,
      window.innerHeight
    )

    /* 半径 = 点击点到最远视口角的距离，保证圆扩到最大时盖满整屏。
       多给 24px：快照比 innerWidth/innerHeight 略大（含滚动条与取整误差），
       收尾时右下角若差一条缝，会露出一条旧主题的边。 */
    const R =
      Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      ) + 24

    root.style.setProperty('--arona-reveal-x', `${x}px`)
    root.style.setProperty('--arona-reveal-y', `${y}px`)
    root.style.setProperty('--arona-reveal-r', `${R}px`)

    const seq = ++seqRef.current
    root.classList.add('arona-theme-switching')

    let vt
    try {
      vt = document.startViewTransition(() => applyTheme(next, false))
    } catch (err) {
      /* 极端情况（例如文档不可见）起不了过渡：老老实实换，别把页面卡在
         关掉过渡的状态里 */
      if (seq === seqRef.current) root.classList.remove('arona-theme-switching')
      applyTheme(next)
      return
    }

    const cleanup = () => {
      /* 连点时旧过渡会被新过渡 skip，它的 finished 可能晚于新过渡的启动 ——
         只有「仍然是最新那次」才允许摘类 */
      if (seq === seqRef.current) root.classList.remove('arona-theme-switching')
    }
    /* finished 在过渡被 skip 时会 reject，两个分支都要收尾 */
    vt.finished.then(cleanup, cleanup)
    /* ready 同样可能 reject（被 skip / 无快照），加个空 catch 免控制台红字 */
    vt.ready.catch(() => {})
  }

  const label = dark ? '切换到浅色模式' : '切换到深色模式'

  return (
    <button
      type='button'
      className='theme-toggle'
      onClick={toggleTheme}
      aria-label={label}
      title={label}>
      {/* 太阳：当前深色时显示，点它变浅色 */}
      <svg
        className='icon-sun'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'>
        <circle cx='12' cy='12' r='4' />
        <path d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41' />
      </svg>
      {/* 月亮：当前浅色时显示，点它变深色 */}
      <svg
        className='icon-moon'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'>
        <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
      </svg>
    </button>
  )
}
