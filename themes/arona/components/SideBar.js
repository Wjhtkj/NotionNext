'use client'

import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import Catalog from './Catalog'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

/**
 * 侧边栏（玻璃卡片，排布参考 heo 主题的 InfoCard + SideRight）
 * 顺序：个人信息卡 / 目录 / 分类 / 最新文章 / 加入QQ群
 *
 * heo 的做法是把「问候语 + 头像 + 昵称 + 公告 + 社交圆钮 + 了解更多」
 * 合并成一张信息卡，公告是卡内的一段而不是独立卡片 —— 这里沿用该结构。
 */

/** 欢迎语：每次点击随机换一条（与 heo 的 GreetingsWords 行为一致） */
const Greetings = () => {
  const greetings = siteConfig('ARONA_INFO_CARD_GREETINGS', [], CONFIG)
  const list = Array.isArray(greetings) ? greetings.filter(Boolean) : []
  const [index, setIndex] = useState(0)
  if (list.length === 0) return null
  return (
    <button
      type='button'
      className='arona-greeting'
      title='点击换一句'
      onClick={() => setIndex(i => (i + 1) % list.length)}>
      {list[index % list.length]}
    </button>
  )
}

/** 社交圆钮 */
const SocialButtons = () => {
  const social = siteConfig('ARONA_SOCIAL', [], CONFIG)
  if (!Array.isArray(social) || social.length === 0) return null
  return (
    <div className='arona-info-social'>
      {social.map((s, i) => (
        <SmartLink key={i} href={s.url} title={s.name || s.url}>
          <i className={s.icon} aria-hidden='true' />
        </SmartLink>
      ))}
    </div>
  )
}

/** 个人信息卡：问候语 + 头像 / 昵称 / 公告 / 社交圆钮 + 了解更多 */
const InfoCard = ({ notice }) => {
  const author = siteConfig('AUTHOR') || siteConfig('TITLE')
  const avatar = siteConfig('ARONA_AVATAR', siteConfig('AVATAR') || '/arona/avatar.webp', CONFIG)
  const more = siteConfig('ARONA_INFO_CARD_MORE', null, CONFIG)
  const hasNotice = notice && Object.keys(notice).length > 0

  return (
    <aside className='arona-side-card arona-info-card'>
      {/* 问候语 + 头像 */}
      <div className='arona-info-top'>
        <Greetings />
        <img className='arona-info-avatar' src={avatar} alt={author} />
      </div>

      <h2 className='arona-info-name'>{author}</h2>

      {/* 公告：卡内的一段，不再单独占一张卡 */}
      {hasNotice && (
        <div id='announcement-content' className='arona-info-notice'>
          <NotionPage post={notice} />
        </div>
      )}

      {/* 社交圆钮 + 了解更多 */}
      <div className='arona-info-foot'>
        <SocialButtons />
        {more?.url && (
          <SmartLink href={more.url} className='arona-info-more'>
            {more.text || '了解更多'}
            <i className='fas fa-circle-right' aria-hidden='true' />
          </SmartLink>
        )}
      </div>
    </aside>
  )
}

/**
 * 侧边栏
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
      {/* 个人信息卡（含公告） */}
      {!HIDDEN_NOTIFICATION && <InfoCard notice={notice} />}

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

export default SideBar
