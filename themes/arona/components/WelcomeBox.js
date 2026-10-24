'use client'

import { siteConfig } from '@/lib/config'
import { useEffect, useRef } from 'react'
import CONFIG from '../config'

/**
 * 首页 Banner 中央的玻璃欢迎框
 * 复刻 Endless647 WelcomeBox.astro + WelcomeBoxController.vue
 * - 大标题显示站点简介
 * - 头像 / 站名 / 一言（打字机）/ 社交图标
 * - 鼠标视差（rotateX / rotateY）+ 渐变角度跟随
 */
export const WelcomeBox = () => {
  const boxRef = useRef(null)
  const infoRef = useRef(null)
  const mottoRef = useRef(null)
  const typingRef = useRef(null)

  const title = siteConfig('TITLE')
  const description = siteConfig('DESCRIPTION')
  const avatar = siteConfig('ARONA_AVATAR', siteConfig('AVATAR') || '/arona/avatar.webp', CONFIG)

  const hitokotoEnable = siteConfig('ARONA_HITOKOTO_ENABLE', true, CONFIG)
  const mottos = (() => {
    const list = siteConfig('ARONA_HITOKOTO_LIST', null, CONFIG)
    if (hitokotoEnable && Array.isArray(list) && list.length > 0) return list
    return [description || 'Hello World']
  })()

  const social = siteConfig('ARONA_SOCIAL', [], CONFIG)

  // 视差
  useEffect(() => {
    const box = boxRef.current
    const info = infoRef.current
    if (!box || !info) return
    const MULTIPLE = 30
    /* 渐变角度不用每帧都改。
       .arona-info-box 上有 backdrop-filter，改它自己的背景会让这块
       半透明玻璃每帧重新合成一次背后的模糊 —— 60fps 下这是本页最贵的
       一段绘制。角度本身变化很慢（鼠标平移几十像素才差几度），
       压到 ~10fps 肉眼几乎看不出，绘制次数少 6 倍。 */
    const GRADIENT_INTERVAL = 100
    let lastGradient = 0
    let rect = null
    let ticking = false
    let lastEvent = null

    const getAngle = (x, y) => {
      const r = Math.atan2(y, x)
      let a = r * (180 / Math.PI)
      if (a < 0) a += 360
      return a
    }

    /* 原来每个 pointermove 都直接 getBoundingClientRect()：这是同步布局读，
       鼠标划过时每帧强制一次样式计算。改成缓存，只在 resize/scroll 后失效。 */
    const measure = () => {
      rect = box.getBoundingClientRect()
    }
    measure()

    const frame = () => {
      ticking = false
      const e = lastEvent
      if (!e || !rect) return
      const dx = e.clientX - rect.x - rect.width / 2
      const dy = e.clientY - rect.y - rect.height / 2
      // 倾斜用 transform，纯合成，不重绘
      box.style.transform = `rotateY(${dx / MULTIPLE}deg) rotateX(${-dy / MULTIPLE}deg)`
      const now = performance.now()
      if (now - lastGradient >= GRADIENT_INTERVAL) {
        lastGradient = now
        info.style.background = `linear-gradient(${Math.floor(getAngle(dy, dx))}deg, var(--infobox-background-initial), var(--infobox-background-final))`
      }
    }

    const parallax = e => {
      lastEvent = e
      // 一帧只排一次，避免快速移动时把 rAF 队列塞满
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(frame)
      }
    }

    const reset = () => {
      lastEvent = null
      box.style.transform = 'rotateY(0deg) rotateX(0deg)'
      info.style.background =
        'linear-gradient(0deg, var(--infobox-background-initial), var(--infobox-background-final))'
    }

    /* 只挂 pointer* 系列：鼠标、触控笔、手指都能触发，
       原来同时挂 mousemove 会让鼠标设备上每次移动跑两遍。 */
    box.addEventListener('pointermove', parallax)
    box.addEventListener('pointerleave', reset)
    window.addEventListener('resize', measure, { passive: true })
    window.addEventListener('scroll', measure, { passive: true })
    return () => {
      box.removeEventListener('pointermove', parallax)
      box.removeEventListener('pointerleave', reset)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
    }
  }, [])

  // 打字机
  useEffect(() => {
    const el = mottoRef.current
    if (!el) return
    const text = mottos[Math.floor(Math.random() * mottos.length)] || ''
    let i = 0
    el.textContent = ''
    const tick = () => {
      if (i < text.length) {
        el.textContent += text[i]
        i += 1
        typingRef.current = window.setTimeout(tick, Math.random() * 150 + 50)
      }
    }
    typingRef.current = window.setTimeout(tick, 220)
    return () => clearTimeout(typingRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='arona-welcome-container'>
      <div className='arona-welcome-box' ref={boxRef} style={{ transform: 'rotateY(0deg) rotateX(0deg)' }}>
        {description && <span className='arona-welcome-text'>{description}</span>}
        <div className='arona-info-box' ref={infoRef}>
          <img className='avatar' src={avatar} alt='avatar' loading='lazy' />
          <span className='name'>{title}</span>
          <span className='motto'>
            <span ref={mottoRef} />
            <span className='pointer' />
          </span>
          {Array.isArray(social) && social.length > 0 && (
            <ul>
              {social.map((item, idx) => (
                <li key={idx}>
                  <a href={item.url} target='_blank' rel='noopener noreferrer' aria-label={item.icon}>
                    <i className={`${item.icon} social`} aria-hidden='true' />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
