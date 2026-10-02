'use client'

import { useEffect, useRef } from 'react'

/**
 * 回到顶部按钮（复刻 AronaNote BackToTop.astro）
 * 滚动超过 600px 显示；无滚动条则隐藏。
 */
export const BackToTop = () => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onScroll = () => {
      if (window.scrollY > 600) el.classList.remove('hidden')
      else el.classList.add('hidden')
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
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href='#'
      className='arona-totop hidden'
      ref={ref}
      aria-label='回到顶部'
      onClick={e => {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}>
      <img src='/arona/toTop.svg' alt='' draggable='false' />
    </a>
  )
}
