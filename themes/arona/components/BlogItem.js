import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import SmartLink from '@/components/SmartLink'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 文章列表卡片（复刻 Endless647 PostsList.astro 的 .post）
 * 左侧竖条 + 封面 + 标题 + 元信息 + 标签 + 摘要
 */
const BlogItem = ({ post }) => {
  if (!post) return null

  const showCover = siteConfig('ARONA_POST_LIST_COVER', true, CONFIG) && post?.pageCoverThumbnail
  const showReadingTime = siteConfig('ARONA_SHOW_READING_TIME', true, CONFIG)
  const date = post.publishDay || post.date?.start_date || post.createdTime
  const tags = Array.isArray(post.tags) ? post.tags : []
  const pinned = post.pinned > 0

  return (
    <article className='arona-post-card'>
      {pinned && <span className='pinned' title='置顶文章' />}
      <header className='post-header'>
        {showCover && (
          <div className='cover-container'>
            <SmartLink href={post.href || '#'} aria-label={post.title}>
              <LazyImage src={post.pageCoverThumbnail} alt={`${post.title}-cover`} />
            </SmartLink>
          </div>
        )}
        <div className='header-content'>
          <div className='title'>
            {!showCover && <div className='title-dot' />}
            <h1 className='name'>
              <SmartLink href={post.href || '#'}>
                {siteConfig('POST_TITLE_ICON') && post.pageIcon && <NotionIcon icon={post.pageIcon} />}
                {post.title}
              </SmartLink>
            </h1>
          </div>

          <div className='meta-info-bar'>
            <span className='meta-icon'>
              <i className='fas fa-clock' />
            </span>
            <span>{date}</span>
            {showReadingTime && post.wordCount ? (
              <>
                <span className='sep' />
                <span className='meta-icon'>
                  <i className='fas fa-file-alt' />
                </span>
                <span>{post.wordCount} 字</span>
                <span className='sep' />
                <span className='meta-icon'>
                  <i className='fas fa-mug-hot' />
                </span>
                <span>预计 {post.readTime || 1} 分钟</span>
              </>
            ) : null}
            {post.category && (
              <>
                <span className='sep' />
                <SmartLink href={`/category/${post.category}`}>{post.category}</SmartLink>
              </>
            )}
            <TwikooCommentCount post={post} />
          </div>

          {tags.length > 0 && (
            <ul className='tags'>
              {tags.map(tag => (
                <li key={tag}>
                  <SmartLink href={`/tag/${encodeURIComponent(tag)}`}>
                    <i className='fas fa-tag' />
                    {tag}
                  </SmartLink>
                </li>
              ))}
            </ul>
          )}

          <div className='excerpt'>
            {post.results ? (
              <p>
                {post.results.map((r, index) => (
                  <span key={index}>{r}</span>
                ))}
              </p>
            ) : (
              <p>{post.summary}</p>
            )}
          </div>
        </div>
      </header>
    </article>
  )
}

export default BlogItem
