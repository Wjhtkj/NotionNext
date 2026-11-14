'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 12 链接微交互（ARONA_LINK_MICRO）的 JS 部分：标题 # 锚点点击复制。
 *
 * react-notion-x 已经在每个 .notion-h 里渲染了 .notion-hash-link
 * （href="#<block-id>"），CSS 负责把它挪到标题文字后面并在 hover 时浮现；
 * 这里只做一件事：点击时拦截默认跳转，复制「当前页地址 + 锚点」到剪贴板，
 * 并在标题下弹一条「已复制」提示（arona-copy-tip，动画播完自动移除）。
 *
 * 事件委托 + 动态扫描：正文是 Notion 异步渲染的，路由切换后标题集合
 * 会变，所以 routeChangeComplete 后补扫几轮；委托挂在 document 上
 * 不依赖扫描结果，扫描只是为了给没有 id 的标题去掉无效锚点。
 */
const LinkMicro = () => {
  const router = useRouter()
  useEffect(() => {
    const enabled = siteConfig('ARONA_LINK_MICRO', true, CONFIG)
    if (!enabled || !router) return undefined

    /* 无效锚点清理：极少数标题没有 id，href 会是 "#"，点了只会跳页首。
       直接把这种锚点摘掉，宁可少一个 # 也不留一个坏交互。 */
    const sweep = () => {
      document.querySelectorAll('.notion-h .notion-hash-link').forEach(a => {
        const href = a.getAttribute('href') || ''
        if (href === '#' || !a.closest('.notion-h').querySelector('.notion-header-anchor')?.id) {
          a.style.display = 'none'
        } else {
          a.style.display = ''
        }
      })
    }

    const onNav = () => {
      sweep()
      /* Notion 正文分块异步注水，路由刚完成时后一半标题往往还没出来 */
      for (const ms of [300, 900, 1800]) setTimeout(sweep, ms)
    }
    sweep()
    for (const ms of [300, 900, 1800]) setTimeout(sweep, ms)
    router.events.on('routeChangeComplete', onNav)

    const onCopyClick = e => {
      const link = e.target.closest && e.target.closest('.notion-h .notion-hash-link')
      if (!link) return
      const heading = link.closest('.notion-h')
      const anchorId = heading && heading.querySelector('.notion-header-anchor')
        ? heading.querySelector('.notion-header-anchor').id
        : null
      if (!anchorId) return
      e.preventDefault()
      const url = `${window.location.origin}${window.location.pathname}#${anchorId}`
      const done = () => {
        const tip = document.createElement('span')
        tip.className = 'arona-copy-tip'
        tip.textContent = '已复制链接'
        heading.appendChild(tip)
        setTimeout(() => tip.remove(), 900)
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(() => {})
      } else {
        const ta = document.createElement('textarea')
        ta.value = url
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        try {
          document.execCommand('copy')
          done()
        } catch (err) {
          /* 忽略 */
        }
        ta.remove()
      }
    }
    document.addEventListener('click', onCopyClick)

    return () => {
      document.removeEventListener('click', onCopyClick)
      router.events.off('routeChangeComplete', onNav)
    }
  }, [router])

  return null
}

export default LinkMicro
