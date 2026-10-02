'use client'

import { useEffect, useRef } from 'react'

/**
 * 阅读进度条（复刻 Endless647 Header.astro 的阅读进度条）
 * 滚动超过 100px 后显示，固定在顶部
 */
const ReadingProgress = () => {
  const barRef = useRef(null)
  const fillRef = useRef(null)

  useEffect(() => {
    const bar = barRef.current
    const fill = fillRef.current
    if (!bar || !fill) return

    let ticking = false
    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      fill.style.width = progress + '%'
      if (scrollTop > 100) bar.classList.add('visible')
      else bar.classList.remove('visible')
    }
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          update()
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className='arona-reading-progress' id='arona-reading-progress' ref={barRef}>
      <div className='fill' id='arona-reading-progress-fill' ref={fillRef} />
    </div>
  )
}

export default ReadingProgress
