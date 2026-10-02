'use client'

import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import BeiAnSite from '@/components/BeiAnSite'
import CopyRightDate from '@/components/CopyRightDate'
import PoweredBy from '@/components/PoweredBy'
import SmartLink from '@/components/SmartLink'

export const Footer = props => {
  return (
    <footer className='arona-footer'>
      <div className='footer-info'>
        <span className='footer-line'>
          <CopyRightDate />
          <span className='separator'> | </span>
          <SmartLink href='/rss.xml' target='_blank' rel='noopener noreferrer'>
            RSS
          </SmartLink>
        </span>
        <div className='footer-line'>
          <div className='flex flex-wrap'>
            <BeiAnSite />
            <BeiAnGongAn />
          </div>
          <PoweredBy />
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className='footer-logo' src='/arona/footLogo.png' alt='logo' />
    </footer>
  )
}
