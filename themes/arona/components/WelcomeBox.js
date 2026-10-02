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
    const getAngle = (x, y) => {
      const r = Math.atan2(y, x)
      let a = r * (180 / Math.PI)
      if (a < 0) a += 360
      return a
    }
    const parallax = e => {
      window.requestAnimationFrame(() => {
        const rect = box.getBoundingClientRect()
        const calcY = (e.clientX - rect.x - rect.width / 2) / MULTIPLE
        const calcX = -(e.clientY - rect.y - rect.height / 2) / MULTIPLE
        const angle = Math.floor(
          getAngle(e.clientY - rect.y - rect.height / 2, e.clientX - rect.x - rect.width / 2)
        )
        box.style.transform = `rotateY(${calcY}deg) rotateX(${calcX}deg)`
        info.style.background = `linear-gradient(${angle}deg, var(--infobox-background-initial), var(--infobox-background-final))`
      })
    }
    const reset = () => {
      box.style.transform = 'rotateY(0deg) rotateX(0deg)'
      info.style.background =
        'linear-gradient(0deg, var(--infobox-background-initial), var(--infobox-background-final))'
    }
    box.addEventListener('pointermove', parallax)
    box.addEventListener('mousemove', parallax)
    box.addEventListener('pointerleave', reset)
    box.addEventListener('mouseleave', reset)
    return () => {
      box.removeEventListener('pointermove', parallax)
      box.removeEventListener('mousemove', parallax)
      box.removeEventListener('pointerleave', reset)
      box.removeEventListener('mouseleave', reset)
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
