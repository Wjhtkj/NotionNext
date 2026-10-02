'use client'

import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import CONFIG from '../config'
import { PostBanner } from './PostBanner'
import { WelcomeBox } from './WelcomeBox'

/**
 * Siri 风格波浪（移植自 Endless647 Banner.astro 的 SiriWave 类）
 */
class SiriWave {
  constructor(canvas) {
    this.K = 1
    this.F = 15
    this.speed = 0.01
    this.noise = 30
    this.phase = 0
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.run = false
    this.raf = null
    this.resize()
  }

  _drawLine(attenuation, color, width, noise, F) {
    this.ctx.moveTo(0, 0)
    this.ctx.beginPath()
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = width || 1
    F = F || this.F
    noise = noise * this.MAX || this.noise
    for (let i = -this.K; i <= this.K; i += 0.01) {
      i = parseFloat(i.toFixed(2))
      const x = this.width * ((i + this.K) / (this.K * 2))
      const y =
        this.height / 2 +
        noise * Math.pow(Math.sin(i * 10 * attenuation), 1) * Math.sin(F * i - this.phase)
      this.ctx.lineTo(x, y)
    }
    this.ctx.lineTo(this.width, this.height)
    this.ctx.lineTo(0, this.height)
    this.ctx.fillStyle = color
    this.ctx.fill()
  }

  _clear() {
    this.ctx.globalCompositeOperation = 'destination-out'
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.globalCompositeOperation = 'source-over'
  }

  _draw() {
    if (!this.run) return
    this.phase = (this.phase + this.speed) % (Math.PI * 64)
    this._clear()
    const root = document.getElementById('theme-arona') || document.documentElement
    const cs = getComputedStyle(root)
    const c1 = cs.getPropertyValue('--wave-color1').trim() || 'rgba(234,239,245,0.8)'
    const c2 = cs.getPropertyValue('--wave-color2').trim() || 'rgba(234,239,245,0.5)'
    this._drawLine(0.5, c1, 1, 0.35, 6)
    this._drawLine(1, c2, 1, 0.25, 6)
    this.raf = requestAnimationFrame(() => this._draw())
  }

  start() {
    if (this.run) return
    this.run = true
    this._draw()
  }

  stop() {
    this.run = false
    this._clear()
    if (this.raf !== null) {
      cancelAnimationFrame(this.raf)
      this.raf = null
    }
  }

  resize() {
    const dpr = window.devicePixelRatio || 1
    this.width = dpr * window.innerWidth
    this.height = dpr * 100
    this.MAX = this.height / 2
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.canvas.style.width = this.width / dpr + 'px'
    this.canvas.style.height = this.height / dpr + 'px'
  }
}

/**
 * Banner 横幅：绝对定位 75vh 英雄区
 * 双背景层平滑切换 + Siri 波浪 + 内容插槽（首页欢迎框 / 文章页标题）
 */
export const Banner = props => {
  const { post, category, tag, keyword } = props
  const router = useRouter()

  const bannerRef = useRef(null)
  const waveRef = useRef(null)
  const bgCurrentRef = useRef(null)
  const bgNextRef = useRef(null)
  const currentUrlRef = useRef(null)
  const waveObjRef = useRef(null)

  const isPost = !!post
  const isHome = router.pathname === '/'

  const cover = post?.pageCover || ''

  // 背景层
  useEffect(() => {
    const isDark = () => document.documentElement.classList.contains('dark')
    const getUrl = () => {
      if (cover) return cover
      const el = bannerRef.current
      if (!el) return ''
      return isDark() ? el.getAttribute('data-banner-dark') : el.getAttribute('data-banner-light')
    }
    const cur = bgCurrentRef.current
    const nxt = bgNextRef.current

    const apply = (url, animate) => {
      if (!cur || !url) return
      if (!animate || currentUrlRef.current === url) {
        cur.style.backgroundImage = `url("${url}")`
        currentUrlRef.current = url
        return
      }
      const img = new Image()
      img.onload = () => {
        if (!nxt) {
          cur.style.backgroundImage = `url("${url}")`
          currentUrlRef.current = url
          return
        }
        nxt.style.backgroundImage = `url("${url}")`
        void nxt.offsetHeight
        nxt.classList.add('transitioning-in')
        setTimeout(() => {
          cur.style.backgroundImage = `url("${url}")`
          currentUrlRef.current = url
          nxt.classList.remove('transitioning-in')
        }, 500)
      }
      img.onerror = () => {
        cur.style.backgroundImage = `url("${url}")`
        currentUrlRef.current = url
      }
      img.src = url
    }

    apply(getUrl(), false)
    const observer = new MutationObserver(() => apply(getUrl(), true))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'theme'] })
    return () => observer.disconnect()
  }, [cover])

  // 波浪
  useEffect(() => {
    if (!siteConfig('ARONA_BANNER_WAVE', true, CONFIG)) return
    const canvas = waveRef.current
    if (!canvas) return
    const wave = new SiriWave(canvas)
    waveObjRef.current = wave
    wave.start()
    let t = null
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(() => wave.resize(), 100)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      wave.stop()
    }
  }, [])

  // 进场动画
  useEffect(() => {
    if (!siteConfig('ARONA_BANNER_INTRO', true, CONFIG)) return
    const el = bannerRef.current
    if (!el) return
    const timer = setTimeout(() => {
      el.classList.remove('loadingComplete')
      void el.offsetHeight
      el.classList.add('loadingComplete')
    }, 260)
    return () => clearTimeout(timer)
  }, [])

  const bannerLight = siteConfig('ARONA_BANNER_LIGHT', '/arona/banner.webp', CONFIG)
  const bannerDark = siteConfig('ARONA_BANNER_DARK', '/arona/banner_dark.webp', CONFIG)

  // Banner 内容
  let content = null
  if (isPost) {
    content = <PostBanner post={post} />
  } else if (isHome && siteConfig('ARONA_WELCOME_ENABLE', true, CONFIG)) {
    content = <WelcomeBox />
  } else {
    const label = category || (tag ? `#${tag}` : '') || keyword || ''
    content = (
      <div className='arona-post-banner'>
        <h1 className='title'>{label || ''}</h1>
      </div>
    )
  }

  return (
    <div
      ref={bannerRef}
      className={`arona-banner ${isPost ? 'postViewer' : ''}`}
      data-banner-light={bannerLight}
      data-banner-dark={bannerDark}>
      <div className='banner-content'>{content}</div>
      <canvas id='arona-wave' ref={waveRef} />
      <div id='arona-bg-current' className='bg-layer' ref={bgCurrentRef} />
      <div id='arona-bg-next' className='bg-layer' ref={bgNextRef} />
    </div>
  )
}
