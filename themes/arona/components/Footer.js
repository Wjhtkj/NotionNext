'use client'

import { siteConfig } from '@/lib/config'

/**
 * 玻璃拟态页脚（复刻 Endless647 Footer.astro）
 * 版权 / RSS / Powered by / 备案 + 页脚 LOGO
 */
export const Footer = () => {
  const author = siteConfig('AUTHOR') || siteConfig('TITLE')
  const beiAn = siteConfig('BEI_AN')
  const beiAnLink = siteConfig('BEI_AN_LINK') || 'https://beian.miit.gov.cn/'
  const year = new Date().getFullYear()

  return (
    <footer className='arona-footer'>
      <div className='footer-info'>
        <span className='footer-line'>
          © {year} {author}
          <span className='separator'>|</span>
          <a href='/rss/feed.xml' target='_blank' rel='noopener noreferrer'>
            RSS
          </a>
        </span>
        <div className='footer-line'>
          <span>
            Powered by{' '}
            <a href='https://github.com/NotionNext' target='_blank' rel='noopener noreferrer'>
              NotionNext
            </a>{' '}
            & Endless647
          </span>
          {beiAn && (
            <>
              <span className='separator'>|</span>
              <span className='icp'>
                <a href={beiAnLink} target='_blank' rel='noopener noreferrer'>
                  {beiAn}
                </a>
              </span>
            </>
          )}
        </div>
      </div>
      <div className='footer-logo'>
        <img src='/arona/footLogo.png' alt='logo' />
      </div>
    </footer>
  )
}
