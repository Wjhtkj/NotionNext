'use client'

import Comment from '@/components/Comment'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import BlogListArchive from './components/BlogListArchive'
import { BlogListPage } from './components/BlogListPage'
import { BlogListScroll } from './components/BlogListScroll'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { PostLock } from './components/PostLock'
import { PostMeta } from './components/PostMeta'
import SearchInput from './components/SearchInput'
import { SideBar } from './components/SideBar'
import TitleBar from './components/TitleBar'
import ReadingProgress from './components/ReadingProgress'
import Splash from './components/Splash'
import ClickFireworks from './components/ClickFireworks'
import SpinePlayer from './components/SpinePlayer'
import CONFIG from './config'
import { Style } from './style'

/**
 * 基础布局框架（AronaNote 风格）
 * Header(玻璃导航) -> Banner 横幅 -> 正文(主内容 + 侧边栏) -> Footer(玻璃页脚)
 * 额外挂件：阅读进度条 / 开屏动画 / 点击烟花 / Spine 看板娘
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, post } = props
  const { onLoading, fullWidth, locale } = useGlobal()

  // 各挂件开关
  const SHOW_SPLASH = siteConfig('ARONA_SPLASH', false, CONFIG)
  const SHOW_FIREWORKS = siteConfig('ARONA_FIREWORKS', false, CONFIG)
  const SHOW_SPINE = siteConfig('ARONA_SPINE_ENABLE', false, CONFIG)
  const SHOW_PROGRESS = siteConfig('ARONA_READING_PROGRESS', false, CONFIG)

  return (
    <div id='theme-arona' className={`${siteConfig('FONT_STYLE')} arona-root scroll-smooth`}>
      <Style />

      {/* 开屏加载动画 */}
      {SHOW_SPLASH && <Splash />}
      {/* 点击烟花特效 */}
      {SHOW_FIREWORKS && <ClickFireworks />}
      {/* Spine 看板娘 */}
      {SHOW_SPINE && <SpinePlayer />}
      {/* 阅读进度条 */}
      {SHOW_PROGRESS && <ReadingProgress />}

      {/* 玻璃拟态导航 */}
      <Header {...props} />

      {/* Banner 横幅（文章页收缩为 50vh） */}
      <TitleBar {...props} />

      {/* 主体 */}
      <div className='arona-container'>
        <div className='arona-main'>
          <Transition
            show={!onLoading}
            appear={true}
            enter='transition ease-in-out duration-700 transform order-first'
            enterFrom='opacity-0 translate-y-16'
            enterTo='opacity-100'
            leave='transition ease-in-out duration-300 transform'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 -translate-y-16'
            unmount={false}>
            {props.slotTop}
            {children}
          </Transition>
        </div>

        {/* 侧边栏 */}
        {!fullWidth && (
          <div className='arona-sidebar'>
            <SideBar {...props} />
          </div>
        )}
      </div>

      {/* 玻璃拟态页脚 */}
      <Footer {...props} />

      {/* 回顶按钮 */}
      <div
        className='arona-totop'
        title={locale?.POST?.TOP}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className='fas fa-angle-up' />
      </div>
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
  const LIST_STYLE = siteConfig('ARONA_POST_LIST_STYLE', 'scroll', CONFIG)

  return (
    <>
      {category && (
        <div className='pb-12 text-2xl font-bold text-[var(--arona-grey)]'>
          <i className='mr-1 fas fa-folder-open' />
          {category}
        </div>
      )}
      {tag && <div className='pb-12 text-2xl font-bold text-[var(--arona-grey)]'>#{tag}</div>}

      {LIST_STYLE === 'page' ? (
        <BlogListPage {...props} />
      ) : (
        <BlogListScroll {...props} />
      )}
    </>
  )
}

/**
 * 文章详情页
 * @param {*} props
 * @returns
 */
const LayoutSlug = props => {
  const { post, lock, validPassword } = props
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
  return (
    <>
      {lock ? (
        <PostLock validPassword={validPassword} />
      ) : post && (
        <div>
          <PostMeta post={post} />
          <div id='article-wrapper'>
            <NotionPage post={post} />
            <ShareBar post={post} />
          </div>
          <Comment frontMatter={post} />
        </div>
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
    <div className='w-full min-h-[70vh] text-center flex flex-col items-center justify-center'>
      <div className='text-[var(--arona-grey)]'>
        <h2 className='inline-block border-r-2 border-[var(--arona-blue)] mr-2 px-3 py-2 align-top text-3xl'>
          <i className='mr-2 fas fa-spinner animate-spin' />404
        </h2>
        <div className='inline-block text-left leading-10 text-xl'>
          <h2 className='m-0 p-0'>页面无法加载，即将返回首页</h2>
        </div>
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
    <>
      <div className='pb-12'>
        <SearchInput {...props} />
      </div>
      <LayoutPostList {...props} />
    </>
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
    <>
      <div className='mb-10 pb-20 md:py-12 p-3 min-h-screen w-full'>
        {Object.keys(archivePosts).map(archiveTitle => (
          <BlogListArchive
            key={archiveTitle}
            archiveTitle={archiveTitle}
            archivePosts={archivePosts}
          />
        ))}
      </div>
    </>
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
    <>
      <div id='category-list' className='duration-200 flex flex-wrap'>
        {categoryOptions?.map(category => (
          <SmartLink
            key={category.name}
            href={`/category/${category.name}`}
            passHref
            legacyBehavior>
            <div className='hover:text-white px-5 cursor-pointer py-2 hover:bg-[var(--arona-blue)] rounded-lg text-[var(--arona-grey)]'>
              <i className='mr-4 fas fa-folder' />
              {category.name}({category.count})
            </div>
          </SmartLink>
        ))}
      </div>
    </>
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
    <>
      <div id='tags-list' className='duration-200 flex flex-wrap'>
        {tagOptions.map(tag => (
          <div key={tag.name} className='p-2'>
            <SmartLink
              key={tag}
              href={`/tag/${encodeURIComponent(tag.name)}`}
              passHref
              className='cursor-pointer inline-block rounded hover:bg-[var(--arona-blue)] hover:text-white duration-200 mr-2 py-1 px-2 text-xs whitespace-nowrap text-[var(--arona-grey)] notion-${tag.color}_background'>
              <div className='font-light'>
                <i className='mr-1 fas fa-tag' />{' '}
                {tag.name + (tag.count ? `(${tag.count})` : '')}{' '}
              </div>
            </SmartLink>
          </div>
        ))}
      </div>
    </>
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
