'use client'

import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

/**
 * 导航右侧的下拉面板（复刻 Endless647 DropdownMenu.astro）
 * 搜索入口、鼠标特效开关、看板娘开关
 *
 * 主题切换原先也在这里（Arona / Plana / System 三选一的 <select>），
 * 现已改成导航上独立的专用按钮 components/ThemeToggle.js ——
 * 换主题是高频操作，不值得埋四层深。本面板因此不再碰主题，
 * 也不再需要 useGlobal。
 */
export const DropdownMenu = ({ show }) => {
  const [cursorOn, setCursorOn] = useState(true)
  const [spineOn, setSpineOn] = useState(true)

  useEffect(() => {
    try {
      setCursorOn(localStorage.getItem('cursor-effect-enabled') !== 'false')
      setSpineOn(localStorage.getItem('spine-enabled') !== 'false')
    } catch (e) {
      /* ignore */
    }
  }, [])

  const toggleCursor = () => {
    const next = !cursorOn
    setCursorOn(next)
    try {
      localStorage.setItem('cursor-effect-enabled', String(next))
    } catch (e) {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent('cursor-effect-toggle', { detail: { enabled: next } }))
  }

  const toggleSpine = () => {
    const next = !spineOn
    setSpineOn(next)
    /* 读取侧（SpinePlayer.applySpineEnabled）用的是 !== 'false'，
       这里必须写字符串 'false' / 'true' 而不是 String(next) 的其他形式，
       否则两边语义对不上（写 false 而读时 !== 'false' 为真 → 关不掉）。 */
    try {
      localStorage.setItem('spine-enabled', String(next))
    } catch (e) {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent('spine-toggle', { detail: { enabled: next } }))
  }

  return (
    <div className='arona-dropdown' data-show={show ? 'true' : 'false'}>
      <div className='menu-content'>
        {siteConfig('ARONA_MENU_SEARCH', true, CONFIG) && (
          <div className='first-row'>
            <span className='label'>搜索</span>
            <SmartLink href='/search' className='arona-tool' aria-label='搜索'>
              <i className='fas fa-search' />
            </SmartLink>
          </div>
        )}

        <div className='toggle-row'>
          <span className='label'>鼠标特效</span>
          <label className='arona-switch'>
            <input type='checkbox' checked={cursorOn} onChange={toggleCursor} aria-label='鼠标特效开关' />
            <span className='slider' aria-hidden='true' />
          </label>
        </div>

        <div className='toggle-row'>
          <span className='label'>看板娘</span>
          <label className='arona-switch'>
            <input type='checkbox' checked={spineOn} onChange={toggleSpine} aria-label='看板娘开关' />
            <span className='slider' aria-hidden='true' />
          </label>
        </div>
      </div>
    </div>
  )
}
