import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import CONFIG from '../config'
import BlogItem from './BlogItem'
/**
 * 使用分页插件的博客列表
 * @param {*} props
 * @returns
 */
export const BlogListPage = props => {
  const { page = 1, posts, postCount } = props
  const { locale, NOTION_CONFIG } = useGlobal()
  const router = useRouter()
  const totalPage = Math.ceil(
    postCount / siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  )
  const currentPage = +page

  const showPrev = currentPage > 1
  const showNext = page < totalPage
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')

  const showPageCover = siteConfig('ARONA_POST_LIST_COVER', true, CONFIG)

  return (
    <div className='arona-posts-list'>
      <div id='posts-wrapper'>
        {posts?.map(post => (
          <BlogItem key={post.id} post={post} />
        ))}
      </div>

      <div className='arona-pagination'>
        <SmartLink
          href={{
            pathname:
              currentPage - 1 === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${currentPage - 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          className={`arona-page-btn ${showPrev ? '' : 'invisible'}`}>
          {locale.PAGINATION.PREV}
        </SmartLink>
        <div className='page-numbers'>
          <span className='page-number active'>{currentPage}</span>
          <span className='page-number'>/ {totalPage || 1}</span>
        </div>
        <SmartLink
          href={{
            pathname: `${pagePrefix}/page/${currentPage + 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          className={`arona-page-btn ${showNext ? '' : 'invisible'}`}>
          {locale.PAGINATION.NEXT}
        </SmartLink>
      </div>
    </div>
  )
}
