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

  /* 顶部菜单。
     ★ 关键：默认菜单（首页 / 关于）不是唯一来源 ——
       CUSTOM_MENU 默认为 true，此时以 Notion 后台配置的 customMenu 为主，
       默认项只作为「补充」追加上去。
       若写成 `links = props.customMenu` 整体替换，前面 push 的项会全部失效：
       改了 buildLinks 但线上毫无变化，就是踩过这个坑。

     搜索 / 归档 / 分类 / 标签四项按用户要求移除：这些页并未下掉，
     仍可通过站内链接或直接输网址访问，只是不在顶栏露出入口。 */
  const buildLinks = () => {
    /* 「关于」指向站内 /about。
       用相对路径而非绝对地址：SmartLink 的外链判定是
       `startsWith('http') && !startsWith(LINK)`，写绝对地址时
       只要线上 LINK 配置与该地址不完全一致（尾斜杠、www 等），
       就会被当成外链、在新标签页打开（实测线上就渲染成了
       target="_blank"）。相对路径不参与 startsWith('http') 判定，
       稳定走 Next 路由单页跳转。 */
    const aboutLink = {
      icon: 'fas fa-circle-info',
      name: '关于',
      href: '/about',
      show: true
    }

    let links = [{ icon: 'fas fa-home', name: locale?.NAV?.HOME || '首页', href: '/', show: true }]

    if (props.customNav) links = links.concat(props.customNav)

    if (siteConfig('CUSTOM_MENU') && props.customMenu) {
      /* 走 Notion 后台菜单：整体替换首页，仅在末尾补「关于」 */
      links = links.concat(props.customMenu, [aboutLink])
    } else {
      links.push(aboutLink)
    }

    /* 兜底去重：Notion 后台若已配了同名项（如「关于」），
       追加后会出现两项，href 相同更会让用户以为点不动。 */
    const seen = new Set()
    return (links || []).filter(l => {
      if (!l || l.show === false) return false
      const key = typeof l.href === 'string' && l.href ? l.href : JSON.stringify(l)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  const links = buildLinks()

  const isActive = href => {
    if (!href) return false
    if (href === '/') return router.asPath === '/' || router.asPath === ''
    /* 菜单项可能写绝对地址（如「关于」指向 https://wjhtkjwz.eu.org/about）。
       直接拿它跟 asPath（站内路径 /about）比永远不匹配，当前页就不高亮。
       这里取 pathname 部分再比。 */
    let path = href
    if (typeof href === 'string' && href.startsWith('http')) {
      try {
        path = new URL(href).pathname
      } catch {
        path = href
      }
    }
    if (path === '/') return router.asPath === '/' || router.asPath === ''
    return router.asPath.startsWith(path)
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

  /* 菜单横向溢出检测。
     两个类各司其职，都必须实测而非媒体查询 ——
     菜单项数量由用户配置决定，同一断点下可能溢出也可能不溢出：

       .menu-scroll      加在内部 ul 上 —— 启用 overflow-x:auto，
                          使窄屏下菜单可横向滑动而不撑破布局。
                          之所以要 JS 加：ul 一旦有 overflow（哪怕只写
                          overflow-y: visible），按 CSS 规范 visible 会被
                          计算成 auto，子菜单（挂在 li 上的绝对定位元素）
                          就会被裁切在菜单栏高度内。所以默认不能写死 overflow，
                          只能「确实溢出时才加」。
       .menu-scroll-hint  加在外层 .menu 上 —— CSS 据此在右侧画渐隐提示条。

     测量直接操作 DOM 而不用 React state：setState 是异步的，
     「先摘掉滚动类 → 读 scrollWidth → 按需加回」这一串必须同步完成，
     用 state 会读到还没更新的旧值，导致测量结果始终是「不溢出」。 */
  const menuRef = useRef(null)
  const menuListRef = useRef(null)
  useEffect(() => {
    const box = menuRef.current
    const ul = menuListRef.current
    if (!box || !ul) return
    const check = () => {
      /* 已启用滚动时 scrollWidth == clientWidth 量不出是否该溢出，
         故先同步摘掉类，量完再按需加回。 */
      ul.classList.remove('menu-scroll')
      box.classList.remove('menu-scroll-hint')
      // 强制同步布局，确保上面移除类后的样式已生效
      void ul.offsetWidth
      const need = ul.scrollWidth > ul.clientWidth + 2
      if (need) {
        ul.classList.add('menu-scroll')
        box.classList.add('menu-scroll-hint')
      }
    }
    check()
    /* rAF 防抖：resize 触发密集，且布局未稳定时读 clientWidth 会拿到中间值 */
    let raf = 0
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(check)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    /* 观察 ul：菜单项内容变化（Notion 菜单异步加载完）后宽度会变。
       观察 box 更稳（它由视口决定，尺寸变化更频繁），
       两者都观察以覆盖「视口变化」与「内容变化」两个来源。 */
    const ro = new ResizeObserver(onResize)
    ro.observe(ul)
    ro.observe(box)
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

        {/* 滚动类由上面的 useEffect 实测后直接加在 DOM 上（不走 React state），
            所以这里保持静态 className，不参与重渲染。 */}
        <span ref={menuRef} className='menu'>
          <ul ref={menuListRef}>
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
