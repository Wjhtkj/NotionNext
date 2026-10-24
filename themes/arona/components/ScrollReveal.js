'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'

/**
 * 全局滚动进场 + 鼠标跟随高光
 *
 * 两个职责，放在同一个文件里是因为它们共用同一批「被观察的元素」：
 *
 * 1) 进场（reveal）
 *    列表页/归档页/标签页的内容块（文章卡片、侧栏卡、标签云…）
 *    进入视口时淡入上移。同屏的多个同类元素按 DOM 顺序错峰 60ms，
 *    最多错 6 级，避免长列表最后一张等半年。
 *
 * 2) 高光（sheen）
 *    鼠标在卡片上移动时，一层柔和的高光跟着指针走。
 *    指针坐标写进 CSS 自定义属性 --mx / --my，CSS 里用
 *    radial-gradient 取用 —— 不在 JS 里碰任何样式，
 *    所以移动端没有 pointermove 也不会残留任何痕迹。
 *
 * 两条约定：
 *   · 只在 JS 成功执行后才启用进场 —— 靠给 <html> 加 .arona-reveal-on，
 *     CSS 的初始隐藏态挂在这个类下面。JS 挂了内容就是可见的，
 *     不会因为脚本失败把整站变成空白。
 *   · 尊重 prefers-reduced-motion —— 系统要求减少动画时直接显示，
 *     不做位移也不做高光。
 */

/* 参与进场的元素。只挑「内容块」，不挑导航/按钮这类小件 ——
   小件本来就该立刻可点，进场只会让人以为界面卡了。 */
const REVEAL_SELECTOR = [
  '.arona-post-card',
  '.arona-sidebar .arona-side-card',
  '.arona-tag-cloud .arona-cloud-item',
  '.arona-list-heading',
  '.arona-view-box'
].join(',')

/* 参与鼠标高光的元素。与进场列表不重叠也没关系 —— 各自独立 querySelectorAll。 */
const SHEEN_SELECTOR = ['.arona-post-card', '.arona-sidebar .arona-side-card'].join(',')

const STAGGER_MS = 60
const STAGGER_MAX = 6

export const ScrollReveal = () => {
  const router = useRouter()

  useEffect(() => {
    const root = document.documentElement
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* ---------- 进场 ---------- */
    root.classList.add('arona-reveal-on')

    /* 注意：这里**不能**给「已经滚过头的元素」补判可见。
       第一反应会想写
         if (!entry.isIntersecting && entry.boundingClientRect.bottom <= 0) reveal
       但这是死代码 —— IntersectionObserver 只在交叉状态**发生变化**时回调。
       瞬时跳转（点锚点 / 按 End）时，元素跳转前在视口下方、跳转后在视口上方，
       两边都是 not-intersecting，回调压根不会来，这行永远执行不到。
       实测过：滚动到页尾时 8 张卡有 2 张从未收到回调。

       而实际上也不需要补：被跳过的那些卡在视口之外，用户看不见；
       等往回滚时它们从下方进入视口，IO 正常触发、正常播进场动画。
       真正要守住的不变量是「元素在视口内时绝不透明」，
       这一点由下面 scan() 里的同步首屏判定 + IO 的进入回调共同保证。 */
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('arona-revealed')
          // 进场后不再观察：元素可能被反复移出视口，
          // 继续观察会让它每次重新播一遍动画。
          io.unobserve(entry.target)
        }
      },
      {
        // 底部留 8% 的负边距：元素真要「露头」才算进场，
        // 而不是还在视口边缘时就播。
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.06
      }
    )

    const scan = () => {
      const els = document.querySelectorAll(REVEAL_SELECTOR)
      for (const el of els) {
        if (el.classList.contains('arona-revealed')) continue
        if (el.dataset.aronaRevealBound) continue
        el.dataset.aronaRevealBound = '1'

        // 错峰：按「同层同类元素」里的序号算延迟。
        const parent = el.parentElement
        if (parent) {
          const siblings = Array.from(parent.children).filter(c =>
            c.matches && c.matches(REVEAL_SELECTOR)
          )
          const idx = Math.max(0, siblings.indexOf(el))
          el.style.setProperty('--arona-reveal-delay', `${Math.min(idx, STAGGER_MAX) * STAGGER_MS}ms`)
        }

        /* 已经在视口内的元素必须当场标记为已进场，不能交给 IntersectionObserver。
           原因：html.arona-reveal-on 是本 effect 才加上的，加上的那一刻所有
           进场目标会同时变成 opacity:0；而 IO 的首批回调是异步的，
           首屏内容会先闪一下「可见 → 消失 → 淡入」。
           这里同步读一次 boundingRect 兜住首屏，只有真正在下面的才去观察。 */
        const rect = el.getBoundingClientRect()
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0
        if (reduceMotion || inViewport) {
          el.classList.add('arona-revealed')
        } else {
          io.observe(el)
        }
      }
    }

    scan()

    /* 列表是无限滚动 / 分页动态追加的，路由切换也会整块替换内容 ——
       用 MutationObserver 兜住「后出现的元素」，比在业务组件里
       逐个调 register 省事，也不会漏。

       但 body 上 subtree:true 的观察者回调非常密集（React 每次提交、
       图片插入、字体加载后的重排都会触发），原来每个回调都同步跑一遍
       querySelectorAll —— 首屏水合那几百毫秒里能触发几十次。
       现在合并成「一个观察者 + 一帧一次」：多次变更只会排一次 rAF。 */
    let syncRaf = 0
    const scheduleSync = () => {
      if (syncRaf) return
      syncRaf = requestAnimationFrame(() => {
        syncRaf = 0
        scan()
        bindSheen()
      })
    }

    const mo = new MutationObserver(scheduleSync)
    mo.observe(document.body, { childList: true, subtree: true })

    const onRouteChange = () => requestAnimationFrame(scan)
    router.events.on('routeChangeComplete', onRouteChange)

    /* ---------- 鼠标高光 ---------- */
    let sheenNodes = []
    let rafId = 0
    let pending = null

    const flush = () => {
      rafId = 0
      if (!pending) return
      const { el, clientX, clientY } = pending
      pending = null
      /* 读 rect 放到 rAF 里做：pointermove 的频率远高于帧率，
         原来每个事件都同步读一次布局，等于每帧强制多次样式计算。
         现在每帧最多读一次，而且只读当前悬停的那一个元素。 */
      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      // 用百分比而不是 px：卡片尺寸变化（响应式/字体加载后重排）时不用重算
      el.style.setProperty('--mx', `${((clientX - rect.left) / rect.width) * 100}%`)
      el.style.setProperty('--my', `${((clientY - rect.top) / rect.height) * 100}%`)
    }

    const onMove = e => {
      pending = { el: e.currentTarget, clientX: e.clientX, clientY: e.clientY }
      if (!rafId) rafId = requestAnimationFrame(flush)
    }

    const onLeave = e => {
      const el = e.currentTarget
      // 归位到中心，配合 CSS 的 opacity 过渡淡出，指针不会留下一个亮点
      el.style.setProperty('--mx', '50%')
      el.style.setProperty('--my', '50%')
    }

    const bindSheen = () => {
      if (reduceMotion) return
      for (const el of document.querySelectorAll(SHEEN_SELECTOR)) {
        if (el.dataset.aronaSheenBound) continue
        el.dataset.aronaSheenBound = '1'
        el.addEventListener('pointermove', onMove)
        el.addEventListener('pointerleave', onLeave)
        sheenNodes.push(el)
      }
    }

    bindSheen()
    // 第二个 MutationObserver 已合并进上面的 mo（见 scheduleSync）

    return () => {
      root.classList.remove('arona-reveal-on')
      io.disconnect()
      mo.disconnect()
      router.events.off('routeChangeComplete', onRouteChange)
      if (rafId) cancelAnimationFrame(rafId)
      if (syncRaf) cancelAnimationFrame(syncRaf)
      for (const el of sheenNodes) {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
      }
      sheenNodes = []
    }
  }, [router])

  return null
}

export default ScrollReveal
