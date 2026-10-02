'use client'

import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { useEffect, useRef, useState } from 'react'

/**
 * 判断当前是否为深色模式（兼容 class / theme / data-theme 多种写法）
 */
const detectDark = () => {
  if (typeof document === 'undefined') return false
  const el = document.documentElement
  return (
    el.classList.contains('dark') ||
    el.getAttribute('theme') === 'dark' ||
    el.getAttribute('data-theme') === 'dark'
  )
}

/**
 * Banner 底部轻量波浪（Siri 风格双线正弦）
 */
const BannerWave = () => {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = 100 * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = '100px'
    }
    resize()
    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)
      const isDark = detectDark()
      const c1 = isDark ? 'rgba(30,30,50,0.6)' : 'rgba(234,239,245,0.8)'
      const c2 = isDark ? 'rgba(21,21,28,0.4)' : 'rgba(234,239,245,0.5)'
      const t = Date.now() / 1000
      const line = (color, amp, speed, yoff) => {
        ctx.beginPath()
        ctx.moveTo(0, h)
        for (let x = 0; x <= w; x += 6 * dpr) {
          const y = h / 2 + Math.sin(x / (40 * dpr) + t * speed) * amp * dpr + yoff * dpr
          ctx.lineTo(x, y)
        }
        ctx.lineTo(w, h)
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()
      }
      line(c1, 10, 0.8, -10)
      line(c2, 7, 1.2, 6)
      raf = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])
  return <canvas ref={canvasRef} className='wave-canvas' />
}

/**
 * Banner 横幅（AronaNote 风格）
 * 浅色/深色背景图交叉淡入；中央显示站点标题；进场淡入模糊动画；可选波浪
 */
export default function TitleBar(props) {
  const { post } = props
  const { siteInfo } = useGlobal()
  const bannerRef = useRef(null)
  const [dark, setDark] = useState(false)

  const bannerLight = siteConfig('ARONA_BANNER_LIGHT', '', CONFIG)
  const bannerDark = siteConfig('ARONA_BANNER_DARK', '', CONFIG)
  const showTitle = siteConfig('ARONA_BANNER_TITLE', true, CONFIG)
  const showWave = siteConfig('ARONA_BANNER_WAVE', true, CONFIG)

  const lightBg = bannerLight || siteInfo?.pageCover || ''
  const darkBg = bannerDark || siteInfo?.pageCover || ''
  const title = post?.title || siteConfig('TITLE')
  const description = post?.description || siteConfig('AUTHOR')

  useEffect(() => {
    setDark(detectDark())
    const obs = new MutationObserver(() => setDark(detectDark()))
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'theme', 'data-theme']
    })
    const el = bannerRef.current
    if (el) {
      el.classList.remove('loadingComplete')
      // 强制重绘后触发动画
      // eslint-disable-next-line no-unused-expressions
      el.offsetHeight
      el.classList.add('loadingComplete')
    }
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={bannerRef}
      className={`arona-banner ${post ? 'postViewer' : ''}`}>
      {/* 浅色背景层 */}
      <div
        className='bg-layer'
        style={{
          backgroundImage: `url(${lightBg})`,
          opacity: dark ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out'
        }}
      />
      {/* 深色背景层 */}
      <div
        className='bg-layer'
        style={{
          backgroundImage: `url(${darkBg})`,
          opacity: dark ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      />

      <div className='banner-content'>
        {showTitle && (
          <>
            <h1 className='banner-title'>{title}</h1>
            {description && <p className='banner-desc'>{description}</p>}
          </>
        )}
      </div>

      {showWave && <BannerWave />}
    </div>
  )
}
