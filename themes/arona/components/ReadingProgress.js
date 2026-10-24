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
      // 用 scaleX 而不是 width：width 是布局属性，滚动时每帧都要重排一次
      // 顶部那条 3px 的进度条；scaleX 是纯合成变换，不碰布局。
      // 元素本身宽 100%，transform-origin 在左边，视觉上等价。
      fill.style.transform = `scaleX(${progress / 100})`
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
