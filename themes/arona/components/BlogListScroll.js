import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { useCallback, useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import BlogItem from './BlogItem'
/**
 * 使用滚动无限加载的博客列表
 * @param {*} props
 * @returns
 */
export const BlogListScroll = props => {
  const { posts } = props
  const { locale, NOTION_CONFIG } = useGlobal()
  const [page, updatePage] = useState(1)
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)

  let hasMore = false
  const postsToShow = posts
    ? Object.assign(posts).slice(0, POSTS_PER_PAGE * page)
    : []

  if (posts) {
    const totalCount = posts.length
    hasMore = page * POSTS_PER_PAGE < totalCount
  }
  const handleGetMore = () => {
    if (!hasMore) return
    updatePage(page + 1)
  }

  const targetRef = useRef(null)

  // 监听滚动自动分页加载
  const scrollTrigger = useCallback(
    throttle(() => {
      const scrollS = window.scrollY + window.outerHeight
      const clientHeight = targetRef
        ? targetRef.current
          ? targetRef.current.clientHeight
          : 0
        : 0
      if (scrollS > clientHeight + 100) {
        handleGetMore()
      }
    }, 500)
  )
  const showPageCover = siteConfig('ARONA_POST_LIST_COVER', true, CONFIG)

  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger, { passive: true })

    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  })

  return (
    <div id='posts-wrapper' className='arona-posts-list' ref={targetRef}>
      {postsToShow?.map(post => (
        <BlogItem key={post.id} post={post} />
      ))}

      <div onClick={handleGetMore} className='arona-load-more'>
        {hasMore ? locale.COMMON.MORE : `${locale.COMMON.NO_MORE} 😰`}
      </div>
    </div>
  )
}
