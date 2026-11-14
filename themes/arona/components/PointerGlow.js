'use client'

import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 09 指针柔光跟随 + 玻璃卡片磁吸倾斜
 *
 * 一个指针监听干两件事：
 *   · 把指针坐标写进 --arona-pointer-x / -y，根元素的 ::before 用
 *     radial-gradient 取值，画出一层 520px 的柔光。光斑不移动 DOM，
 *     只是改变渐变中心，所以整条路径上没有任何布局与绘制抖动。
 *   · 指针落在卡片上时，按「指针相对卡片中心」的归一化偏移算两个角度，
 *     写进 --arona-tilt-x / -y（CSS 里由 hover 那条 transform 取用）。
 *
 * 三条硬约束：
 *  · 只在 (pointer: fine) 上启用。触屏设备没有 hover，指针坐标
 *    在手指抬起后就没了，倾斜会卡在最后一个角度上；
 *  · 尊重 prefers-reduced-motion，直接不注册任何监听；
 *  · pointermove 的频率远高于帧率，坐标与角度都攒到一帧里写一次
 *    （单 rAF 合并），绝不在事件回调里读 getBoundingClientRect ——
 *    那等于每帧强制同步布局。
 *
 * 卡片用 document 上的事件委托 + closest()，不逐个绑定：
 * 无限滚动的列表会不断新增卡片，委托天然覆盖，也不需要在
 * MutationObserver 里维护绑定表（这类表出过「标记残留导致全部跳过」的事故）。
 */

const CARD_SELECTOR = '.arona-post-card, .arona-sidebar .arona-side-card'

/* 3deg 是实测下来「能看出来、但不觉得卡片在歪」的上限。
   再大文字会开始发虚，而且长列表里鼠标扫过去会晃得人眼晕。 */
const MAX_TILT = 3

export const PointerGlow = () => {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const root = document.getElementById('theme-arona')
    if (!root) return

    let rafId = 0
    let px = 0
    let py = 0
    /* 当前指针所在的卡片。换卡时要先把上一张的角度归零，
       否则鼠标快速掠过一排卡片，离开过的那几张会一直歪着。 */
    let card = null
    let lastCard = null

    const resetTilt = el => {
      if (!el) return
      el.style.setProperty('--arona-tilt-x', '0deg')
      el.style.setProperty('--arona-tilt-y', '0deg')
    }

    const flush = () => {
      rafId = 0
      root.style.setProperty('--arona-pointer-x', `${px}px`)
      root.style.setProperty('--arona-pointer-y', `${py}px`)
      root.classList.add('arona-pointer-on')

      if (lastCard && lastCard !== card) {
        resetTilt(lastCard)
        lastCard = null
      }
      if (!card) return

      // 读一次布局，且只读当前悬停的那一张
      const rect = card.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      lastCard = card

      /* 归一化到 -1 ~ 1：-1 是左边/上边，1 是右边/下边。
         倾斜方向取「让指针附近的那个角朝读者抬起来」：
           · 指针在上（ny=-1）→ 上缘前倾 → rotateX 负值
           · 指针在右（nx=1） → 右缘前倾 → rotateY 负值 */
      const nx = ((px - rect.left) / rect.width - 0.5) * 2
      const ny = ((py - rect.top) / rect.height - 0.5) * 2
      card.style.setProperty('--arona-tilt-x', `${(ny * MAX_TILT).toFixed(2)}deg`)
      card.style.setProperty('--arona-tilt-y', `${(-nx * MAX_TILT).toFixed(2)}deg`)
    }

    const onMove = e => {
      px = e.clientX
      py = e.clientY
      const target = e.target
      card = target && target.closest ? target.closest(CARD_SELECTOR) : null
      if (!rafId) rafId = requestAnimationFrame(flush)
    }

    /* 指针离开视口（切窗口 / 移出浏览器）就把柔光淡掉，
       否则它会停在上一次的位置，像一块擦不掉的污渍。 */
    const onOut = e => {
      if (e.relatedTarget) return
      root.classList.remove('arona-pointer-on')
      if (lastCard) resetTilt(lastCard)
      lastCard = null
      card = null
    }

    /* 路由切换后卡片是新的，旧引用必须丢掉 */
    const onRoute = () => {
      if (lastCard) resetTilt(lastCard)
      lastCard = null
      card = null
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onOut)
    router.events.on('routeChangeComplete', onRoute)

    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onOut)
      router.events.off('routeChangeComplete', onRoute)
      if (rafId) cancelAnimationFrame(rafId)
      if (lastCard) resetTilt(lastCard)
      root.classList.remove('arona-pointer-on')
    }
  }, [router])

  return null
}

export default PointerGlow
