'use client'

import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import { DropdownMenu } from './DropdownMenu'

/**
 * 玻璃拟态顶部导航（复刻 AronaNote Header.astro）
 * LOGO + 导航菜单 + 汉堡按钮 + 下拉面板
 * 菜单沿用 NotionNext 的既有菜单体系（含自定义菜单 customNav / customMenu）。
 */
export const Header = props => {
  const { post } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const navRef = useRef(null)

  // 构建菜单（与 example 主题 MenuList 逻辑一致，保留 NotionNext 功能）
  const buildLinks = () => {
    let links = [
      { icon: 'fas fa-home', name: locale?.NAV?.HOME || '首页', href: '/', show: true },
      {
        icon: 'fas fa-search',
        name: locale?.NAV?.SEARCH || '搜索',
        href: '/search',
        show: siteConfig('ARONA_MENU_SEARCH', true, CONFIG)
      },
      {
        icon: 'fas fa-archive',
        name: locale?.NAV?.ARCHIVE || '归档',
        href: '/archive',
        show: siteConfig('ARONA_MENU_ARCHIVE', true, CONFIG)
      },
      {
        icon: 'fas fa-folder',
        name: locale?.COMMON?.CATEGORY || '分类',
        href: '/category',
        show: siteConfig('ARONA_MENU_CATEGORY', true, CONFIG)
      },
      {
        icon: 'fas fa-tag',
        name: locale?.COMMON?.TAGS || '标签',
        href: '/tag',
        show: siteConfig('ARONA_MENU_TAG', true, CONFIG)
      }
    ]
    if (props.customNav) links = links.concat(props.customNav)
    if (siteConfig('CUSTOM_MENU') && props.customMenu) links = props.customMenu
    return (links || []).filter(l => l && l.show !== false)
  }

  const links = buildLinks()

  const isActive = href => {
    if (!href) return false
    if (href === '/') return router.asPath === '/' || router.asPath === ''
    return router.asPath.startsWith(href)
  }

  // 点击外部关闭
  useEffect(() => {
    const onDocClick = e => {
      if (!open) return
      if (navRef.current && navRef.current.contains(e.target)) {
        // 点击汉堡自身由 onClick 处理，这里只处理面板内部
        if (e.target.closest && e.target.closest('.hamburger')) return
        if (e.target.closest && e.target.closest('.arona-dropdown')) return
      }
      setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [open])

  // 路由变化关闭
  useEffect(() => {
    setOpen(false)
  }, [router.asPath])

  return (
    <header className={`arona-container arona-header ${post ? 'postViewer' : ''}`}>
      <nav ref={navRef}>
        <span className='logo'>
          <SmartLink href='/' aria-label='首页'>
            <img src='/arona/navLogo.svg' alt='Logo' />
          </SmartLink>
        </span>

        <span className='menu'>
          <ul>
            {links.map((link, index) => (
              <li key={index}>
                <SmartLink href={link.href} className={isActive(link.href) ? 'active' : ''}>
                  {link.name}
                </SmartLink>
              </li>
            ))}
          </ul>
        </span>

        <button
          type='button'
          className={`hamburger ${open ? 'active' : ''}`}
          aria-label='菜单'
          aria-expanded={open}
          onClick={e => {
            e.stopPropagation()
            setOpen(v => !v)
          }}>
          <span className='line' />
          <span className='line' />
          <span className='line' />
        </button>

        <DropdownMenu show={open} />
      </nav>
    </header>
  )
}
