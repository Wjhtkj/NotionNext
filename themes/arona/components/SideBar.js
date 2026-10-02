'use client'

import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import Announcement from './Announcement'
import Catalog from './Catalog'

/**
 * 侧边栏（AronaNote 风格玻璃卡片）
 * 目录 / 分类 / 最新文章 / 公告
 */
export const SideBar = props => {
  const { locale } = useGlobal()
  const { latestPosts, categoryOptions, notice, post } = props

  const HIDDEN_NOTIFICATION =
    post && siteConfig('ARONA_ARTICLE_HIDDEN_NOTIFICATION', false, CONFIG)

  const SideCard = ({ title, children }) => (
    <aside className='side-card'>
      <h3>{title}</h3>
      <div className='side-body'>{children}</div>
    </aside>
  )

  return (
    <>
      {/* 目录 */}
      {post?.toc && post?.toc.length > 2 && (
        <SideCard title={locale?.COMMON?.TABLE_OF_CONTENTS || '目录'}>
          <Catalog toc={post?.toc} />
        </SideCard>
      )}

      {/* 分类 */}
      <SideCard title={locale?.COMMON?.CATEGORY || '分类'}>
        <ul className='list-reset leading-normal'>
          {categoryOptions?.map(category => (
            <li key={category.name} className='py-1'>
              <SmartLink href={`/category/${category.name}`}>
                {category.name}({category.count})
              </SmartLink>
            </li>
          ))}
        </ul>
      </SideCard>

      {/* 最新文章 */}
      <SideCard title={locale?.COMMON?.LATEST_POSTS || '最新文章'}>
        <ul className='list-reset leading-normal'>
          {latestPosts?.map(p => (
            <li key={p.id} className='py-1'>
              <SmartLink href={`/${p.slug}`}>{p.title}</SmartLink>
            </li>
          ))}
        </ul>
      </SideCard>

      {/* 公告 */}
      {!HIDDEN_NOTIFICATION && <Announcement post={notice} />}
    </>
  )
}
