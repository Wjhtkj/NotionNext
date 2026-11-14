'use client'

import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 11 细节呼吸：文章卡里「字数 / 阅读时长」这类纯数字的滚动落定
 *
 * 只接管**明确标了 data-arona-count** 的元素。为什么不解析文本：
 * 站点里带数字的文案太多（日期、分类计数、评论数），靠正则去猜
 * 一定会在某个「2026 年」上翻车；让组件显式声明要滚的数字，
 * 边界就永远清楚。
 *
 * 两条不变量：
 *  · 没跑 JS 时元素里就是服务端渲染好的最终值，天然正确 ——
 *    这个组件只负责「从 0 数上去」，不负责提供数据；
 *  · 数字宽度会随位数变化（9 → 10 多一个字符），旁边「字」的
 *    位置会抖。所以开跑前先把 min-width 按目标位数定死，
 *    数完再松掉，全程右端不位移。
 */

const COUNT_SELECTOR = '.arona-count[data-arona-count]'
const DURATION = 700

export const DetailBreath = () => {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const running = new Set()

    const run = el => {
      const target = Number(el.dataset.aronaCount)
      if (!Number.isFinite(target) || target <= 1) return

      el.style.minWidth = `${String(target).length}ch`
      const start = performance.now()
      let raf = 0

      const step = now => {
        const t = Math.min(1, (now - start) / DURATION)
        // 三次缓出：数字先快后慢，最后几位会「停」一下，比线性有落定感
        const v = Math.round(target * (1 - Math.pow(1 - t, 3)))
        el.textContent = String(v)
        if (t < 1) {
          raf = requestAnimationFrame(step)
          running.add(raf)
        } else {
          el.textContent = String(target)
          el.style.minWidth = ''
          running.delete(raf)
        }
      }
      raf = requestAnimationFrame(step)
      running.add(raf)
    }

    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          io.unobserve(entry.target)
          run(entry.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.5 }
    )

    /* 绑定标记用 WeakSet，不用 data 属性 —— 后者在 effect 重挂后会残留，
       导致第二轮全部跳过（ScrollReveal 上出过这个事故）。 */
    const bound = new WeakSet()
    const scan = () => {
      for (const el of document.querySelectorAll(COUNT_SELECTOR)) {
        if (bound.has(el)) continue
        bound.add(el)
        io.observe(el)
      }
    }

    scan()

    /* 无限滚动会不断插入新卡片，交给 MutationObserver 兜（一帧一次） */
    let syncRaf = 0
    const scheduleSync = () => {
      if (syncRaf) return
      syncRaf = requestAnimationFrame(() => {
        syncRaf = 0
        scan()
      })
    }
    const mo = new MutationObserver(scheduleSync)
    mo.observe(document.body, { childList: true, subtree: true })

    const onRoute = () => scheduleSync()
    router.events.on('routeChangeComplete', onRoute)

    return () => {
      io.disconnect()
      mo.disconnect()
      router.events.off('routeChangeComplete', onRoute)
      if (syncRaf) cancelAnimationFrame(syncRaf)
      for (const raf of running) cancelAnimationFrame(raf)
      running.clear()
      /* 正在数的元素要还原成最终值，否则路由切换时会被定格在中间某个数 */
      for (const el of document.querySelectorAll(COUNT_SELECTOR)) {
        const target = Number(el.dataset.aronaCount)
        if (Number.isFinite(target)) el.textContent = String(target)
        el.style.minWidth = ''
      }
    }
  }, [router])

  return null
}

export default DetailBreath
