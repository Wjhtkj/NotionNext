'use client'

import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import Announcement from './Announcement'
import Catalog from './Catalog'

/**
 * 侧边栏（AronaNote 风格玻璃卡片）
 * 顺序：公告 / 目录 / 分类 / 最新文章 / 加入QQ群
 */
export const SideBar = props => {
  const { locale } = useGlobal()
  const { latestPosts, categoryOptions, notice, post } = props

  const HIDDEN_NOTIFICATION = post && siteConfig('ARONA_ARTICLE_HIDDEN_NOTIFICATION', false, CONFIG)

  // QQ 群卡片（config.js 中可覆盖 / 关闭）
  const qq = siteConfig('ARONA_QQ_CARD', {}, CONFIG)
  const showQQ = qq && qq.enable !== false && qq.url

  const SideCard = ({ title, children }) => (
    <aside className='arona-side-card'>
      <h3 className='side-title'>{title}</h3>
      <div className='side-body'>{children}</div>
    </aside>
  )

  return (
    <>
      {/* 公告（置顶） */}
      {!HIDDEN_NOTIFICATION && <Announcement post={notice} />}

      {/* 目录 */}
      {post?.toc && post?.toc.length > 2 && (
        <SideCard title={locale?.COMMON?.TABLE_OF_CONTENTS || '目录'}>
          <Catalog toc={post?.toc} />
        </SideCard>
      )}

      {/* 分类 */}
      {categoryOptions && categoryOptions.length > 0 && (
        <SideCard title={locale?.COMMON?.CATEGORY || '分类'}>
          <ul className='arona-side-list'>
            {categoryOptions?.map(category => (
              <li key={category.name}>
                <SmartLink href={`/category/${category.name}`}>
                  {category.name}({category.count})
                </SmartLink>
              </li>
            ))}
          </ul>
        </SideCard>
      )}

      {/* 最新文章 */}
      {latestPosts && latestPosts.length > 0 && (
        <SideCard title={locale?.COMMON?.LATEST_POSTS || '最新文章'}>
          <ul className='arona-side-list'>
            {latestPosts?.map((p, i) => (
              <li key={p.id || i}>
                <SmartLink href={`/${p.slug}`}>{p.title}</SmartLink>
              </li>
            ))}
          </ul>
        </SideCard>
      )}

      {/* 加入QQ群 */}
      {showQQ && (
        <aside className='arona-side-card arona-qq-card'>
          <h3 className='side-title'>
            <i className={`${qq.icon || 'fab fa-qq'} arona-qq-icon`} aria-hidden='true' />
            {qq.title || '加入QQ群'}
          </h3>
          <div className='side-body'>
            {qq.text && <p className='arona-qq-text'>{qq.text}</p>}
            <a
              className='arona-qq-btn'
              href={qq.url}
              target='_blank'
              rel='noopener noreferrer'>
              {qq.button || '一键加入'}
            </a>
          </div>
        </aside>
      )}
    </>
  )
}
