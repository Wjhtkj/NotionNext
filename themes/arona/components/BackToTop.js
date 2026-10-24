'use client'

import { useEffect, useRef } from 'react'

/**
 * 回到顶部按钮（复刻 Endless647 BackToTop.astro）
 * 滚动超过 600px 显示；无滚动条则隐藏。
 *
 * 进度环：外圈一圈描边圆环，随页面滚动进度从满到空。
 * 用 SVG 的 stroke-dashoffset 驱动 —— 周长固定（2πr），
 * 只要在 JS 里算一个 0~1 的进度值，浏览器自己插值，比每帧改 width 省。
 */
export const BackToTop = () => {
  const ref = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // r=46 → 周长 289.03。写死而不是运行时算：
    // viewBox 固定为 0 0 100 100，半径是 CSS 里定好的，没有第二种取值。
    const CIRCUMFERENCE = 2 * Math.PI * 46
    const ring = ringRef.current
    if (ring) {
      ring.style.strokeDasharray = `${CIRCUMFERENCE}`
      ring.style.strokeDashoffset = `${CIRCUMFERENCE}`
    }

    const onScroll = () => {
      if (window.scrollY > 600) el.classList.remove('hidden')
      else el.classList.add('hidden')

      if (!ring) return
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      // scrollable <= 0 时页面不可滚动，此时进度无意义，画满环
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 1
      ring.style.strokeDashoffset = `${CIRCUMFERENCE * (1 - progress)}`
    }

    // 无滚动条则隐藏
    const hasScroll = () => {
      const doc = document.documentElement
      const body = document.body
      const sh = Math.max(doc.scrollHeight, doc.offsetHeight, body.scrollHeight, body.offsetHeight)
      return sh > window.innerHeight + 5
    }

    if (!hasScroll()) {
      el.style.display = 'none'
    } else {
      el.style.display = ''
      onScroll()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <a
      href='#'
      className='arona-totop hidden'
      ref={ref}
      aria-label='回到顶部'
      onClick={e => {
        e.preventDefault()
        /* 平滑滚动也是一种「动态效果」：系统要求减少动画时直接跳。
           滚一整页的 smooth 对前庭敏感人群很不友好。 */
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
      }}>
      <span className='arona-totop-ring'>
        <svg viewBox='0 0 100 100' aria-hidden='true' focusable='false'>
          {/* 底环：浅色轨道 */}
          <circle className='ring-track' cx='50' cy='50' r='46' />
          {/* 进度环：JS 改 stroke-dashoffset */}
          <circle className='ring-bar' cx='50' cy='50' r='46' ref={ringRef} />
        </svg>
        <img src='/arona/toTop.svg' alt='' draggable='false' />
      </span>
    </a>
  )
}
