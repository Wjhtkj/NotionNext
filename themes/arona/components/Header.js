'use client'

import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import { DropdownMenu } from './DropdownMenu'

/**
 * 玻璃拟态顶部导航（复刻 Endless647 Header.astro）
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

  /* 菜单横向溢出检测：溢出时给 .menu 加 menu-scroll-hint，
     CSS 据此在右侧叠一层渐变，提示「还能往右滑」。
     为什么用实测而不是媒体查询：菜单项数量由用户配置决定，
     同一断点下可能溢出也可能不溢出，写死断点会误报或漏报。 */
  const menuRef = useRef(null)
  const [menuHint, setMenuHint] = useState(false)
  useEffect(() => {
    const el = menuRef.current
    if (!el) return
    const check = () => setMenuHint(el.scrollWidth > el.clientWidth + 2)
    check()
    /* rAF 防抖：resize 触发密集，且布局未稳定时读 clientWidth 会拿到中间值 */
    let raf = 0
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(check)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    /* 菜单项内容变化（Notion 菜单异步加载完）也要重测 */
    const ro = new ResizeObserver(onResize)
    ro.observe(el)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      ro.disconnect()
    }
  }, [links.length])

  return (
    <header className={`arona-container arona-header ${post ? 'postViewer' : ''}`}>
      <nav ref={navRef}>
        <span className='logo'>
          <SmartLink href='/' aria-label='首页'>
            <img src='/arona/navLogo.svg' alt='Logo' />
          </SmartLink>
        </span>

        <span ref={menuRef} className={`menu ${menuHint ? 'menu-scroll-hint' : ''}`}>
          <ul>
            {links.map((link, index) => {
              /* Notion 的父级菜单（如「往期整理」）自身 href 常见为 "/#" 或 "#"，
                 真正可点的是它的 subMenus（如「历史归档」→ /archive）。
                 这里把父项的 href 兜底到第一个子菜单，避免点击后停在原地。 */
              const subs = Array.isArray(link.subMenus) ? link.subMenus.filter(s => s && s.show !== false && s.name) : []
              /* Notion 的父级菜单（如「往期整理」）自身 href 常写成 "/#"、"#"、"/"，是个死链；
                 真正可点的是它的 subMenus（如「历史归档」→ /archive）。
                 若父项是死链，则把 href 兜底到第一个子菜单，点击父项也能真正跳转。 */
              const isDead = /^\/?#?$/.test(link.href || '')
              const parentHref = subs.length > 0 ? (isDead ? subs[0].href : link.href) : link.href
              return (
                <li key={index} className={subs.length > 0 ? 'has-sub' : undefined}>
                  <SmartLink href={parentHref} className={isActive(link.href) ? 'active' : ''}>
                    {subs.length > 0 && <i className={`${link.icon || 'fas fa-angle-right'} sub-arrow`} aria-hidden='true' />}
                    {link.name}
                  </SmartLink>
                  {subs.length > 0 && (
                    <ul className='sub-menu'>
                      {subs.map((sub, i) => (
                        <li key={sub.id || i}>
                          <SmartLink href={sub.href} className={isActive(sub.href) ? 'active' : ''}>
                            {sub.icon && <i className={`${sub.icon} sub-icon`} aria-hidden='true' />}
                            {sub.name}
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
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
