'use client'

import { useEffect, useRef } from 'react'

/**
 * 开屏加载动画（AronaNote 风格三角呼吸 + 淡出）
 * 首次加载显示，延时淡出后恢复滚动
 */
export default function Splash() {
  const ref = useRef(null)

  useEffect(() => {
    // 同会话内只显示一次
    if (window.__aronaSplashShown) {
      const el = ref.current
      if (el) el.style.display = 'none'
      return
    }
    window.__aronaSplashShown = true
    const el = ref.current
    if (!el) return

    const breath = el.querySelector('.splash-breath')
    let raf
    let opacity = 0.3
    let dir = 1
    const animate = () => {
      opacity += 0.01 * dir
      if (opacity >= 1) dir = -1
      if (opacity <= 0.3) dir = 1
      if (breath) breath.style.opacity = opacity
      raf = requestAnimationFrame(animate)
    }
    animate()

    document.documentElement.classList.add('splash-loading')
    document.body.classList.add('splash-loading')
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    const delay = Math.floor(Math.random() * 300) + 1200
    const timer = setTimeout(() => {
      cancelAnimationFrame(raf)
      el.style.opacity = '0'
      setTimeout(() => {
        el.style.display = 'none'
        document.documentElement.classList.remove('splash-loading')
        document.body.classList.remove('splash-loading')
        document.documentElement.style.overflow = prevHtmlOverflow
        document.body.style.overflow = prevBodyOverflow
      }, 500)
    }, delay)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('splash-loading')
      document.body.classList.remove('splash-loading')
    }
  }, [])

  return (
    <div className='arona-splash' ref={ref}>
      <svg viewBox='0 0 1728 1117' preserveAspectRatio='xMinYMin slice' fill='none'>
        <g clipPath='url(#aronaClip)'>
          <g className='splash-breath'>
            <path
              className='circle'
              fillRule='evenodd'
              clipRule='evenodd'
              d='M864 769C979.98 769 1074 674.98 1074 559C1074 443.02 979.98 349 864 349C748.02 349 654 443.02 654 559C654 674.98 748.02 769 864 769ZM864 749.909C969.436 749.909 1054.91 664.436 1054.91 559C1054.91 453.564 969.436 368.091 864 368.091C758.564 368.091 673.091 453.564 673.091 559C673.091 664.436 758.564 749.909 864 749.909Z'
            />
            <path className='led' d='M934.636 392.273H792.727L757.091 447H970.909L934.636 392.273Z' />
            <path className='led' d='M969.636 450.182H897.727L934.636 504.273L969.636 450.182Z' />
            <path
              className='led'
              d='M792.091 500.455L828.364 447L900.909 555.182L863.364 609.273L792.091 500.455Z'
            />
            <path
              className='led'
              d='M900.909 667.182L865.909 612.455L903.5 558.364L973.455 667.182L937.818 721.909H796.545L760.273 667.182L796.545 612.455L832.818 667.182H900.909Z'
            />
          </g>
        </g>
        <defs>
          <clipPath id='aronaClip'>
            <rect width='1728' height='1117' fill='white' />
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}
