import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

/**
 * 博客列表的单个卡片（AronaNote 风格）
 * 白底圆角 32px + 左侧描边 + 辉光 + 悬停上浮
 */
const BlogItem = ({ post }) => {
  const showPageCover =
    siteConfig('ARONA_POST_LIST_COVER', true, CONFIG) && post?.pageCoverThumbnail

  const tags = Array.isArray(post?.tags) ? post.tags : []
  const dateText = post?.date?.start_date || post?.createdTime

  return (
    <article className='arona-card mb-12'>
      <div className='card-inner'>
        {showPageCover && (
          <div className='card-cover'>
            <SmartLink href={post?.href} passHref legacyBehavior>
              <LazyImage
                src={post?.pageCoverThumbnail}
                className='w-full h-full'
                alt={post?.title}
              />
            </SmartLink>
          </div>
        )}

        <div className='card-body'>
          <h2 className='card-title'>
            {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post?.pageIcon} />}
            <SmartLink href={post?.href}>{post?.title}</SmartLink>
          </h2>

          <div className='card-meta'>
            <span>{dateText}</span>
            <span className='sep' />
            <span>{siteConfig('AUTHOR')}</span>
            <TwikooCommentCount post={post} />
            {post?.category && (
              <>
                <span className='sep' />
                <SmartLink href={`/category/${post.category}`} className='hover:underline'>
                  {post.category}
                </SmartLink>
              </>
            )}
          </div>

          {tags.length > 0 && (
            <ul className='card-tags'>
              {tags.map((t, i) => (
                <li key={i}>
                  <SmartLink href={`/tag/${encodeURIComponent(t)}`}>
                    <i className='fas fa-tag' /> {t}
                  </SmartLink>
                </li>
              ))}
            </ul>
          )}

          {!post?.results && (
            <p className='card-excerpt line-clamp-3'>{post?.summary}</p>
          )}
          {post?.results && (
            <p className='card-excerpt'>
              {post.results.map((r, index) => (
                <span key={index}>{r}</span>
              ))}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

export default BlogItem
