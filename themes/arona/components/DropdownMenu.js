'use client'

import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

/**
 * 导航右侧的下拉面板（复刻 Endless647 DropdownMenu.astro）
 * 主题选择（Arona / Plana / System）、搜索、鼠标特效开关、看板娘开关
 */
export const DropdownMenu = ({ show }) => {
  const { updateDarkMode } = useGlobal()
  const [themePref, setThemePref] = useState('system')
  const [cursorOn, setCursorOn] = useState(true)
  const [spineOn, setSpineOn] = useState(true)

  useEffect(() => {
    try {
      setThemePref(localStorage.getItem('arona-theme-pref') || 'system')
      setCursorOn(localStorage.getItem('cursor-effect-enabled') !== 'false')
      setSpineOn(localStorage.getItem('spine-enabled') !== 'false')
    } catch (e) {
      /* ignore */
    }
  }, [])

  const applyTheme = val => {
    setThemePref(val)
    try {
      localStorage.setItem('arona-theme-pref', val)
    } catch (e) {
      /* ignore */
    }
    if (val === 'system') {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
      updateDarkMode?.(dark)
    } else {
      updateDarkMode?.(val === 'dark')
    }
  }

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
          <span className='label'>主题</span>
          <select
            className='arona-theme-select'
            value={themePref}
            onChange={e => applyTheme(e.target.value)}
            aria-label='主题选择'>
            <option value='light'>Arona</option>
            <option value='dark'>Plana</option>
            <option value='system'>System</option>
          </select>
        </div>

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
