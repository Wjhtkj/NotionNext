'use client'

import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 10 阅读流：段落焦点提亮 + 正文大块落定
 *
 * 两个观察器，职责分开：
 *
 * 1) 焦点带（.is-reading）
 *    只观察正文的文字块（p / li / blockquote），观察区是视口中间
 *    一条约 16vh 高的窄带（rootMargin 上下各收 42%）。
 *    跨过这条带的段落被点亮，离开就恢复 —— 于是滚动时总有一段
 *    「正在读」的文字颜色比周围深一档，视线不会丢。
 *    为什么不整段整段地高亮：长文里同时点亮三段等于没点亮。
 *
 * 2) 大块落定（.is-in）
 *    正文图片 / figure / 代码块进入视口时从 1.02 倍收到原尺寸。
 *    初始隐藏态挂在 html.arona-reading-on 下，而那个类是**扫完一轮
 *    之后**才加的 —— 脚本没跑或中途报错，内容就是正常可见的，
 *    不会出现「图片永远透明」这种灾难。
 *
 * 文字块进焦点带只改 color（CSS 里过渡），大块只改 transform / opacity，
 * 两条路径都不会触发重排。
 */

const FOCUS_SELECTOR = '#article-wrapper p, #article-wrapper li, #article-wrapper blockquote'
const MEDIA_SELECTOR = '#article-wrapper figure, #article-wrapper pre, #article-wrapper img'

export const ReadingFlow = () => {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    /* 系统要求减少动态效果时整块不启用：焦点高亮本身也是「随滚动变化的
       视觉刺激」，一并关掉比只关位移动画更符合这个设置的本意。 */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const root = document.documentElement
    const wrapper = () => document.getElementById('article-wrapper')

    const focusIO = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          entry.target.classList.toggle('is-reading', entry.isIntersecting)
        }
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 }
    )

    const mediaIO = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          mediaIO.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.04 }
    )

    /* 绑定标记用 WeakSet。踩过的坑：写成 data 属性的话，effect 第二轮
       会因为标记残留而整体跳过，元素再也拿不到 is-in，被
       html.arona-reading-on ... { opacity: 0 } 永久藏住。
       WeakSet 随实例销毁，重建时自然重新处理。 */
    const focusBound = new WeakSet()
    const mediaBound = new WeakSet()

    const scan = () => {
      const box = wrapper()
      if (!box) return
      const h = window.innerHeight

      for (const el of box.querySelectorAll(FOCUS_SELECTOR)) {
        if (focusBound.has(el)) continue
        focusBound.add(el)
        focusIO.observe(el)
      }

      for (const el of box.querySelectorAll(MEDIA_SELECTOR)) {
        if (mediaBound.has(el)) continue
        mediaBound.add(el)
        mediaIO.observe(el)
        /* 已经在视口里的必须当场点亮再开隐藏态，
           否则首屏图片会先闪一下「可见 → 消失 → 淡入」。 */
        const rect = el.getBoundingClientRect()
        if (rect.top < h && rect.bottom > 0) el.classList.add('is-in')
      }

      if (!root.classList.contains('arona-reading-on')) {
        /* 本轮扫描已经把视口内的都点亮了，现在才允许 CSS 接管隐藏态 */
        root.classList.add('arona-reading-on')
      }
    }

    scan()

    /* 图片是懒加载的、正文可能随后端补渲染、路由切换会整块替换 ——
       MutationObserver 兜住「后出现的元素」。body 上 subtree 的回调很密，
       合并成一帧一次，避免首屏水合期间几十次 querySelectorAll。 */
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

    const onRoute = () => {
      /* 换页后旧的正文节点已经销毁，但根元素上的类要等到新内容扫完再决定：
         先把类摘掉，scan() 里会重新点亮点亮再挂回去 —— 否则新页面的
         图片会在「还没扫」的窗口里以 opacity:0 存在一小会儿。 */
      root.classList.remove('arona-reading-on')
      scheduleSync()
    }
    router.events.on('routeChangeComplete', onRoute)

    const onResize = () => {
      /* 视口高度变了，焦点带位置跟着变，重算一次（不做动画，只补状态） */
      const box = wrapper()
      if (!box) return
      for (const el of box.querySelectorAll('.is-reading')) {
        const rect = el.getBoundingClientRect()
        const h = window.innerHeight
        const inBand = rect.bottom > h * 0.42 && rect.top < h * 0.58
        if (!inBand) el.classList.remove('is-reading')
      }
    }
    window.addEventListener('resize', onResize)

    /* 兜底：元素明明在视口里、却始终没拿到 is-in（IO 因任何原因没回调，
       比如图片懒加载后尺寸为 0、或容器重排把交叉状态跳过了）。
       这类元素会一直停在 opacity:0，等于内容丢了 —— 滚动时同步补判一次，
       命中就当场点亮。IO 正常工作时这里永远不命中，代价只是一次 rAF。 */
    let sweepRaf = 0
    const sweep = () => {
      sweepRaf = 0
      const box = wrapper()
      if (!box) return
      const h = window.innerHeight
      for (const el of box.querySelectorAll(MEDIA_SELECTOR)) {
        if (el.classList.contains('is-in')) continue
        const rect = el.getBoundingClientRect()
        if (rect.top < h && rect.bottom > 0) el.classList.add('is-in')
      }
    }
    const onScroll = () => {
      if (sweepRaf) return
      sweepRaf = requestAnimationFrame(sweep)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      focusIO.disconnect()
      mediaIO.disconnect()
      mo.disconnect()
      router.events.off('routeChangeComplete', onRoute)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      if (syncRaf) cancelAnimationFrame(syncRaf)
      if (sweepRaf) cancelAnimationFrame(sweepRaf)
      root.classList.remove('arona-reading-on')
      const box = wrapper()
      if (box) {
        for (const el of box.querySelectorAll('.is-reading')) el.classList.remove('is-reading')
      }
    }
  }, [router])

  return null
}

export default ReadingFlow
