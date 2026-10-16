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
 * 3) 切换动画是「以按钮为圆心的圆形揭幕」（详见 toggleTheme 内的时序注释）：
 *    先铺一层与旧页面背景一致的遮罩，在遮罩底下换主题，再把遮罩的
 *    clip-path 圆收回到点击点。四步必须在同一个 JS 任务里同步完成，
 *    浏览器只会画一帧，用户才看不到「旧页面闪一下新颜色」的中间态。
 */
export const ThemeToggle = () => {
  const { isDarkMode, updateDarkMode } = useGlobal()
  /* 仅用于无障碍文案；图标显隐见 CSS。初值取上下文（= blog.config 的
     APPEARANCE），与服务端渲染一致，不会 hydration 报警。 */
  const [dark, setDark] = useState(!!isDarkMode)
  const animTimer = useRef(null)
  /* 正在播放的揭幕遮罩，连点时先移除旧的那个，避免叠多层 */
  const rippleRef = useRef(null)

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

  /* 卸载时清掉计时器与可能残留的遮罩 */
  useEffect(
    () => () => {
      if (animTimer.current) clearTimeout(animTimer.current)
      if (rippleRef.current) {
        rippleRef.current.remove()
        rippleRef.current = null
      }
    },
    []
  )

  const isDarkNow = () =>
    document.documentElement.classList.contains('dark') ||
    document.documentElement.getAttribute('theme') === 'dark'

  /* 真正换主题（不带动画）。抽出成函数是因为圆形揭幕要先铺遮罩、
     再在遮罩底下调用它，减少动画时也直接调用它。 */
  const applyTheme = next => {
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
       400ms 后摘掉。快速连点时重置计时器，避免类被过早摘掉。 */
    root.classList.add('arona-theme-anim')
    if (animTimer.current) clearTimeout(animTimer.current)
    animTimer.current = setTimeout(() => {
      root.classList.remove('arona-theme-anim')
      animTimer.current = null
    }, 400)
  }

  /* 主题切换动画：以按钮为圆心的「圆形揭幕」。
     时序要点 —— 铺遮罩、强制布局、换主题、收缩圆，四步必须在同一个
     JS 任务里跑完，浏览器只会画一帧：
       1. 遮罩底色/背景图复制 #theme-arona **计算后**的背景（此刻 <html>
          还没换类），盖上来的首帧与旧页面逐像素一致，用户感知不到闪；
       2. clip-path 半径取「点击点到最远视口角的距离」，scale(1) 时正好盖满；
       3. void offsetWidth 强制布局，把初始状态提交为过渡起点；
       4. 在遮罩底下换主题，中间态被遮罩盖住；
       5. transform: scale(1) → scale(0)（缩放原点=点击点），
          旧背景圆随缩放向点击点收拢，新主题被一圈圈揭开。

     为什么动画只跑 transform：clip-path 过渡不走合成器，每帧在主线程
     重绘整屏背景图（实测 ~43fps + 90ms 卡顿）；transform: scale() 由
     合成器执行、背景只画一次，稳定 60fps。静态 clip-path 不参与动画。 */
  const toggleTheme = e => {
    const next = !isDarkNow()

    /* 尊重系统「减少动画」：直接换，不插遮罩 */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyTheme(next)
      return
    }

    /* 点击坐标。键盘触发（Enter/Space）时 clientX/Y 都是 0，
       用按钮中心兜底，动画仍然从按钮位置展开。 */
    const btn = e && e.currentTarget
    const rect = btn ? btn.getBoundingClientRect() : null
    const x = e && e.clientX ? e.clientX : rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const y = e && e.clientY ? e.clientY : rect ? rect.top + rect.height / 2 : window.innerHeight / 2

    /* 旧主题的整页背景：直接取 #theme-arona **计算后**的背景，而不是读某个
       CSS 变量。原因是页面根元素真正的 background-color 不一定来自
       --general-background-color —— lib/themeConsoleStyle 会在样式表尾部生成
       一条同特异性但排在后面的 #theme-arona { background-color: var(--arona-console-bg) }，
       线上浅色实际是 #fff、深色是 #000（调色板 BG 令牌），读变量会拿到没生效的
       那个值（#eaeff5 / #0f0f16），遮罩与旧页面差一个色阶、第一帧就会被看出来。
       取计算值还顺带覆盖背景图与它的尺寸/定位参数，遮罩与旧页面逐像素一致。 */
    const themeEl = document.getElementById('theme-arona') || document.documentElement
    const cs = getComputedStyle(themeEl)
    const wasDark = isDarkNow()
    const oldColor = cs.backgroundColor
    const oldImage = cs.backgroundImage

    /* 连点时先撤掉上一段动画的遮罩 */
    if (rippleRef.current) {
      rippleRef.current.remove()
      rippleRef.current = null
    }

    const ripple = document.createElement('div')
    ripple.className = 'arona-theme-ripple'
    /* 静态 clip-path：半径 = 点击点到最远视口角的距离（+2px 余量），
       scale(1) 时圆刚好盖满整屏，从任意点击点出发都成立。 */
    const R = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 2
    ripple.style.clipPath = `circle(${R}px at ${x}px ${y}px)`
    /* 缩放原点 = 圆心，圆才会整体向点击点收拢而不是塌向元素中心 */
    ripple.style.transformOrigin = `${x}px ${y}px`
    /* 底色：计算值里 transparent 的页面不该让遮罩透明（中间态会漏出来），
       此时按当前主题退回写死的两个底色。 */
    if (oldColor && oldColor !== 'rgba(0, 0, 0, 0)' && oldColor !== 'transparent') {
      ripple.style.backgroundColor = oldColor
    } else {
      ripple.style.backgroundColor = wasDark ? '#0f0f16' : '#eaeff5'
    }
    if (oldImage && oldImage !== 'none') {
      /* 背景图连同尺寸/定位参数一起搬过来，遮罩就不只是纯色块，
         而是和旧页面背景逐像素一致。
         附着参数强制 scroll：fixed 的背景不随元素变换缩放（规范层面
         固定在视口），元素一被 scale 背景就会「钉住」不动，圆是缩了、
         内容却没缩，视觉上是割裂的。scroll 下本元素盒子恰等于视口，
         渲染结果与页面的 fixed 完全一致，且会跟着一起缩。 */
      ripple.style.backgroundImage = oldImage
      ripple.style.backgroundSize = cs.backgroundSize
      ripple.style.backgroundRepeat = cs.backgroundRepeat
      ripple.style.backgroundPosition = cs.backgroundPosition
      ripple.style.backgroundAttachment = 'scroll'
    }
    document.body.appendChild(ripple)
    rippleRef.current = ripple
    void ripple.offsetWidth /* 强制布局：让 scale(1) 成为过渡起点 */

    applyTheme(next)

    ripple.classList.add('arona-theme-ripple-shrink')

    const done = () => {
      ripple.remove()
      if (rippleRef.current === ripple) rippleRef.current = null
    }
    ripple.addEventListener('transitionend', done, { once: true })
    /* transitionend 兜底：标签页在后台时过渡不跑，计时器照样清理 */
    setTimeout(done, 900)
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
