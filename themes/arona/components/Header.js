'use client'

import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import DarkModeButton from '@/components/DarkModeButton'
import { useRouter } from 'next/router'
import CONFIG from '../config'

/**
 * 玻璃拟态顶部导航（AronaNote 风格）
 * LOGO + 菜单 + 搜索/暗色切换
 */
export const Header = props => {
  const { locale } = useGlobal()
  const router = useRouter()
  const title = siteConfig('TITLE')
  const avatar = siteConfig('AVATAR')

  const links = [
    { name: '首页', href: '/', icon: 'fas fa-home', show: true },
    { name: locale?.NAV?.SEARCH || '搜索', href: '/search', icon: 'fas fa-search', show: siteConfig('ARONA_MENU_SEARCH', true, CONFIG) },
    { name: locale?.NAV?.ARCHIVE || '归档', href: '/archive', icon: 'fas fa-archive', show: siteConfig('ARONA_MENU_ARCHIVE', true, CONFIG) },
    { name: locale?.COMMON?.CATEGORY || '分类', href: '/category', icon: 'fas fa-folder', show: siteConfig('ARONA_MENU_CATEGORY', true, CONFIG) },
    { name: locale?.COMMON?.TAGS || '标签', href: '/tag', icon: 'fas fa-tag', show: siteConfig('ARONA_MENU_TAG', true, CONFIG) }
  ].filter(l => l.show)

  const isActive = href => {
    if (href === '/') return router.asPath === '/'
    return router.asPath.startsWith(href)
  }

  return (
    <header className='arona-header'>
      <nav>
        <span className='logo'>
          <SmartLink href='/' className='nav-link flex items-center'>
            <img src={avatar} alt='logo' className='rounded-full' />
            <span className='logo-text'>{title}</span>
          </SmartLink>
        </span>

        <ul className='menu'>
          {links.map((l, i) => (
            <li key={i}>
              <SmartLink
                href={l.href}
                className={`arona-menu-link ${isActive(l.href) ? 'active' : ''}`}>
                {l.icon && <i className={l.icon} style={{ marginRight: 6 }} />}
                {l.name}
              </SmartLink>
            </li>
          ))}
        </ul>

        <span className='header-tools'>
          <SmartLink href='/search' className='arona-tool-btn' title={locale?.NAV?.SEARCH || '搜索'}>
            <i className='fas fa-search' />
          </SmartLink>
          <DarkModeButton className='arona-tool-btn' />
        </span>
      </nav>
    </header>
  )
}
