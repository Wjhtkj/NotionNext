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
 */
export const ThemeToggle = () => {
  const { isDarkMode, updateDarkMode } = useGlobal()
  /* 仅用于无障碍文案；图标显隐见 CSS。初值取上下文（= blog.config 的
     APPEARANCE），与服务端渲染一致，不会 hydration 报警。 */
  const [dark, setDark] = useState(!!isDarkMode)
  const animTimer = useRef(null)

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

  useEffect(() => () => {
    if (animTimer.current) clearTimeout(animTimer.current)
  }, [])

  const isDarkNow = () =>
    document.documentElement.classList.contains('dark') ||
    document.documentElement.getAttribute('theme') === 'dark'

  const toggleTheme = () => {
    const root = document.documentElement
    const next = !isDarkNow()

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
