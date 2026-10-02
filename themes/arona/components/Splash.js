'use client'

import { useEffect, useRef } from 'react'

/**
 * 开屏加载动画（复刻 AronaNote Splash.astro）
 * 三角形矩阵 + 中央 LED 圆圈呼吸，随机 1.2~1.5s 后淡出
 * 每次会话只播放一次（sessionStorage）。
 */
const TRIANGLES = [
  'M606 -123L1061 666H151L606 -123Z',
  'M190.15 144L67.3 -68.94L313 -68.94L190.15 144Z',
  'M1424.17 339L1249.35 35.97L1599 35.97L1424.17 339Z',
  'M-96.7 513.333L-216.4 305.853H23L-96.7 513.333Z',
  'M502.825 603.83L391 410L614.65 410L502.825 603.83Z',
  'M1228.45 648.333L1048.9 337.113L1408 337.113L1228.45 648.333Z',
  'M246.375 925.667L96.75 666.317H396L246.375 925.667Z',
  'M606.375 1048.45L504 871L708.75 871L606.375 1048.45Z',
  'M1376.5 960L1219 687H1534L1376.5 960Z',
  'M365.395 170L503.791 409.885H227L365.395 170Z',
  'M1049.36 337L1198.71 595.886H900L1049.36 337Z',
  'M1248.81 36L1340.61 195.132H1157L1248.81 36Z',
  'M503.99 680.333L614.981 872.716H393L503.99 680.333Z',
  'M870.433 698.333L997.866 919.218H743L870.433 698.333Z',
  'M1419.1 487L1534.2 686.508H1304L1419.1 487Z',
  'M312.914 809L445.828 1039.38H180L312.914 809Z',
  'M1225.51 1053.67L1368.01 1300.68H1083L1225.51 1053.67Z',
  'M1550.51 792L1693.01 1039.01H1408L1550.51 792Z'
]

const Splash = () => {
  const ref = useRef(null)
  const breathRef = useRef(null)

  useEffect(() => {
    const splash = ref.current
    if (!splash) return

    // 一次会话只播放一次
    try {
      if (sessionStorage.getItem('arona-splash-shown')) {
        splash.style.display = 'none'
        return
      }
      sessionStorage.setItem('arona-splash-shown', '1')
    } catch (e) {
      /* ignore */
    }

    let rafId = null
    let fadeTimer = null

    document.documentElement.classList.add('arona-splash-loading')
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    const preventScroll = e => e.preventDefault()
    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventScroll, { passive: false })

    // 呼吸
    let opacity = 0.3
    let direction = 1
    const breathe = () => {
      const parts = breathRef.current
      if (!parts) return
      opacity += 0.01 * direction
      if (opacity >= 1) direction = -1
      if (opacity <= 0.3) direction = 1
      parts.style.opacity = opacity
      rafId = requestAnimationFrame(breathe)
    }
    breathe()

    const fadeOut = () => {
      splash.style.opacity = '0'
      splash.style.transition = 'opacity 500ms ease-in-out'
      fadeTimer = setTimeout(() => {
        splash.style.display = 'none'
        document.documentElement.classList.remove('arona-splash-loading')
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
      }, 500)
    }

    const delay = Math.floor(Math.random() * 300) + 1200
    const showTimer = setTimeout(() => {
      fadeOut()
      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventScroll)
    }, delay)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(fadeTimer)
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventScroll)
    }
  }, [])

  return (
    <div id='arona-splash-container' className='arona-splash' ref={ref}>
      <svg viewBox='0 0 1728 1117' preserveAspectRatio='xMinYMin slice' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <g clipPath='url(#arona-splash-clip)'>
          <g className='triangle-group'>
            {TRIANGLES.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <g ref={breathRef}>
            <path
              className='circle-path'
              fillRule='evenodd'
              clipRule='evenodd'
              d='M864 769C979.98 769 1074 674.98 1074 559C1074 443.02 979.98 349 864 349C748.02 349 654 443.02 654 559C654 674.98 748.02 769 864 769ZM864 749.909C969.436 749.909 1054.91 664.436 1054.91 559C1054.91 453.564 969.436 368.091 864 368.091C758.564 368.091 673.091 453.564 673.091 559C673.091 664.436 758.564 749.909 864 749.909Z'
            />
            <path className='led-path' d='M934.636 392.273H792.727L757.091 447H970.909L934.636 392.273Z' />
            <path className='led-path' d='M969.636 450.182H897.727L934.636 504.273L969.636 450.182Z' />
            <path className='led-path' d='M792.091 500.455L828.364 447L900.909 555.182L863.364 609.273L792.091 500.455Z' />
            <path
              className='led-path'
              d='M900.909 667.182L865.909 612.455L903.5 558.364L973.455 667.182L937.818 721.909H796.545L760.273 667.182L796.545 612.455L832.818 667.182H900.909Z'
            />
          </g>
        </g>
        <defs>
          <clipPath id='arona-splash-clip'>
            <rect width='1728' height='1117' fill='white' />
          </clipPath>
          <filter id='arona-splash-glow'>
            <feGaussianBlur stdDeviation='4' result='blur' />
            <feFlood className='glow-color' floodOpacity='2.5' />
            <feComposite in2='blur' operator='in' />
            <feComposite in='SourceGraphic' />
          </filter>
        </defs>
      </svg>
    </div>
  )
}

export default Splash
