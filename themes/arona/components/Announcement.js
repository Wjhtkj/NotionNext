'use client'

import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

/**
 * 公告模块（AronaNote 玻璃卡片样式）
 * 其实就是一篇文章（Notion 中类型为 Notice 的页面）
 */
const Announcement = ({ post }) => {
  const { locale } = useGlobal()
  if (!post || Object.keys(post).length === 0) {
    return <></>
  }
  return (
    <aside className='arona-side-card arona-announce'>
      <h3 className='side-title'>
        <i className='fas fa-bullhorn arona-announce-icon' aria-hidden='true' />
        {post?.title || locale?.COMMON?.ANNOUNCEMENT || '公告'}
      </h3>
      <div className='side-body' id='announcement-content'>
        <NotionPage post={post} className='text-center' />
      </div>
    </aside>
  )
}
export default Announcement
