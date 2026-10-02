'use client'

import Comment from '@/components/Comment'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { BackToTop } from './components/BackToTop'
import { Banner } from './components/Banner'
import BlogListArchive from './components/BlogListArchive'
import { BlogListPage } from './components/BlogListPage'
import { BlogListScroll } from './components/BlogListScroll'
import Catalog from './components/Catalog'
import ClickFireworks from './components/ClickFireworks'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { PostLock } from './components/PostLock'
import ReadingProgress from './components/ReadingProgress'
import SearchInput from './components/SearchInput'
import { SideBar } from './components/SideBar'
import SpinePlayer from './components/SpinePlayer'
import Splash from './components/Splash'
import CONFIG from './config'
import { Style } from './style'

/**
 * 基础布局框架（AronaNote 风格）
 * 结构：Splash -> Banner(75vh 英雄区) -> Header(粘性玻璃导航) -> main -> Footer -> 回到顶部
 * 额外挂件：点击烟花 / 阅读进度条 / Spine 看板娘
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, post } = props
  const { onLoading, fullWidth, isDarkMode, updateDarkMode } = useGlobal()

  const SHOW_SPLASH = siteConfig('ARONA_SPLASH', true, CONFIG)
  const SHOW_FIREWORKS = siteConfig('ARONA_FIREWORKS', true, CONFIG)
  const SHOW_SPINE = siteConfig('ARONA_SPINE_ENABLE', true, CONFIG)
  const SHOW_PROGRESS = siteConfig('ARONA_READING_PROGRESS', true, CONFIG)
  const SHOW_TOTOP = siteConfig('ARONA_BACK_TO_TOP', true, CONFIG)

  // 将 NotionNext 的深色状态同步到 <html> 的 class 与 theme 属性（供 CSS 变量切换）
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove(isDarkMode ? 'light' : 'dark')
    root.classList.add(isDarkMode ? 'dark' : 'light')
    root.setAttribute('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  // 首次加载应用已保存的主题偏好（Arona / Plana / System）
  useEffect(() => {
    try {
      const pref = localStorage.getItem('arona-theme-pref')
      if (pref === 'light') updateDarkMode?.(false)
      else if (pref === 'dark') updateDarkMode?.(true)
      else if (pref === 'system') {
        updateDarkMode?.(window.matchMedia('(prefers-color-scheme: dark)').matches)
      }
    } catch (e) {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id='theme-arona' className={`${siteConfig('FONT_STYLE')} arona-root scroll-smooth`}>
      <Style />

      {/* 开屏 */}
      {SHOW_SPLASH && <Splash />}
      {/* 点击烟花 */}
      {SHOW_FIREWORKS && <ClickFireworks />}
      {/* 阅读进度条 */}
      {SHOW_PROGRESS && <ReadingProgress />}
      {/* Spine 看板娘 */}
      {SHOW_SPINE && <SpinePlayer />}

      {/* Banner 英雄区 */}
      <Banner {...props} />

      {/* 玻璃导航 */}
      <Header {...props} />

      {/* 主体 */}
      <main className='arona-main'>
        <Transition
          show={!onLoading}
          appear={true}
          enter='transition ease-in-out duration-700 transform'
          enterFrom='opacity-0 translate-y-16'
          enterTo='opacity-100'
          leave='transition ease-in-out duration-300 transform'
          leaveFrom='opacity-100 translate-y-0'
          leaveTo='opacity-0 -translate-y-16'
          unmount={false}>
          {props.slotTop}
          {children}
        </Transition>
      </main>

      {/* 玻璃页脚 */}
      <Footer {...props} />

      {/* 回到顶部 */}
      {SHOW_TOTOP && <BackToTop />}
    </div>
  )
}

/**
 * 首页
 * @param {*} props
 * @returns 此主题首页就是列表
 */
const LayoutIndex = props => {
  return <LayoutPostList {...props} />
}

/**
 * 文章列表
 * @param {*} props
 * @returns
 */
const LayoutPostList = props => {
  const { category, tag } = props
  const { fullWidth } = useGlobal()
  const LIST_STYLE = siteConfig('ARONA_POST_LIST_STYLE', 'scroll', CONFIG)

  const list =
    LIST_STYLE === 'page' ? <BlogListPage {...props} /> : <BlogListScroll {...props} />

  return (
    <div className='arona-container arona-posts-content'>
      {category && (
        <div className='arona-list-heading'>
          <i className='fas fa-folder-open' /> {category}
        </div>
      )}
      {tag && <div className='arona-list-heading'>#{tag}</div>}

      {fullWidth ? (
        list
      ) : (
        <div className='arona-main-flex'>
          <div className='arona-content-col'>{list}</div>
          <div className='arona-sidebar'>
            <SideBar {...props} />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * 文章详情页
 * @param {*} props
 * @returns
 */
const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  const { fullWidth } = useGlobal()
  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000

  useEffect(() => {
    if (!post) {
      setTimeout(() => {
        if (isBrowser) {
          const article = document.querySelector('#article-wrapper #notion-article')
          if (!article) {
            router.push('/404').then(() => {
              console.warn('找不到页面', router.asPath)
            })
          }
        }
      }, waiting404)
    }
  }, [post])

  const hasToc = !fullWidth && post?.toc && post.toc.length > 2

  return (
    <>
      {lock ? (
        <PostLock validPassword={validPassword} />
      ) : (
        post && (
          <>
            <div className={`arona-post-layout ${hasToc ? '' : 'no-toc'}`}>
              <article className='arona-view-box'>
                <div className='arona-content'>
                  <div id='article-wrapper'>
                    <NotionPage post={post} />
                    <ShareBar post={post} />
                  </div>
                </div>
              </article>

              {hasToc && (
                <aside className='arona-toc-sidebar'>
                  <Catalog toc={post.toc} />
                </aside>
              )}
            </div>

            <div className='arona-container'>
              <Comment frontMatter={post} />
            </div>
          </>
        )
      )}
    </>
  )
}

/**
 * 404页
 * @param {*} props
 * @returns
 */
const Layout404 = props => {
  const router = useRouter()
  useEffect(() => {
    setTimeout(() => {
      const article = isBrowser && document.getElementById('article-wrapper')
      if (!article) {
        router.push('/').then(() => {})
      }
    }, 3000)
  }, [])

  return (
    <div className='arona-404'>
      <img src='/arona/NotFound.webp' alt='404' className='arona-404-img' />
      <div className='arona-404-text'>
        <h2>
          <i className='mr-2 fas fa-spinner animate-spin' />
          404
        </h2>
        <p>页面无法加载，即将返回首页</p>
      </div>
    </div>
  )
}

/**
 * 搜索页
 * @param {*} props
 * @returns
 */
const LayoutSearch = props => {
  const { keyword } = props
  const router = useRouter()
  useEffect(() => {
    if (isBrowser) {
      const container = document.getElementById('posts-wrapper')
      if (keyword && container) {
        replaceSearchResult({
          doms: container,
          search: keyword,
          target: {
            element: 'span',
            className: 'text-red-500 border-b border-dashed'
          }
        })
      }
    }
  }, [router])

  return (
    <div className='arona-container arona-posts-content'>
      <div className='arona-search-bar'>
        <SearchInput {...props} />
      </div>
      <LayoutPostList {...props} />
    </div>
  )
}

/**
 * 归档列表
 * @param {*} props
 * @returns
 */
const LayoutArchive = props => {
  const { archivePosts } = props
  return (
    <div className='arona-container arona-posts-content'>
      {Object.keys(archivePosts).map(archiveTitle => (
        <BlogListArchive key={archiveTitle} archiveTitle={archiveTitle} archivePosts={archivePosts} />
      ))}
    </div>
  )
}

/**
 * 分类列表
 * @param {*} props
 * @returns
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  return (
    <div className='arona-container arona-posts-content'>
      <div id='category-list' className='arona-tag-cloud'>
        {categoryOptions?.map(category => (
          <SmartLink key={category.name} href={`/category/${category.name}`} className='arona-cloud-item'>
            <i className='fas fa-folder' />
            {category.name}({category.count})
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

/**
 * 标签列表
 * @param {*} props
 * @returns
 */
const LayoutTagIndex = props => {
  const { tagOptions } = props
  return (
    <div className='arona-container arona-posts-content'>
      <div id='tags-list' className='arona-tag-cloud'>
        {tagOptions?.map(tag => (
          <SmartLink
            key={tag.name}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className={`arona-cloud-item notion-${tag.color}_background`}>
            <i className='fas fa-tag' />
            {tag.name + (tag.count ? `(${tag.count})` : '')}
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
