'use client'

import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 文章页 Banner 内容：标题 + 发布/更新/字数/阅读时长
 * 复刻 AronaNote BlogPost.astro 的 .post-banner
 */
export const PostBanner = ({ post }) => {
  if (!post) return null
  const showReadingTime = siteConfig('ARONA_SHOW_READING_TIME', true, CONFIG)

  const items = []
  const published = post.publishDay || post.date?.start_date
  if (published) items.push(`发布于 ${published}`)
  if (post.lastEditedDay && post.lastEditedDay !== published) items.push(`更新于 ${post.lastEditedDay}`)
  if (showReadingTime && post.wordCount) items.push(`约 ${post.wordCount} 字`)
  if (showReadingTime && post.readTime) items.push(`预计 ${post.readTime} 分钟`)

  return (
    <div className='arona-post-banner'>
      <h1 className='title'>{post.title}</h1>
      {items.length > 0 && <span className='status'>{items.join(' | ')}</span>}
    </div>
  )
}
