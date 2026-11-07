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
 *    进入视口时淡入上移。错峰按「本次一起进入视口的这一批」算，
 *    批内按视口上下顺序排、从 0 开始每级 70ms，最多 5 级 ——
 *    无论滚到列表多靠后的位置，一批里的第一张总是立刻动，
 *    不会像「按 DOM 全局序号」那样越往下越迟钝。
 *    文章卡片与侧栏/标题各走一条独立节奏，避免左右两列互相打断。
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

const STAGGER_MS = 70
const STAGGER_MAX = 5

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
    /* 一批元素一起进场时的统一出口：按它们在视口里的上下顺序排序，
       再从 0 开始逐个给延迟。三条路径（首屏同步判定 / IO 回调 / 滚动兜底）
       全都走这里，节奏才不会分叉。
       排序复用已有的 rect.top、以及 IO 给的 boundingClientRect（缓存值，
       不触发重排），不额外读布局。 */
    const revealBatch = (batch, observer) => {
      /* 主内容卡与侧栏/标题分两条节奏：它们处在不同的列，
         混在一起按 top 排序会让左右两列的进场互相打断 ——
         首屏第一张文章卡可能要排在几张侧栏卡之后才动。
         拆开后两列各自从 0ms 起，形成两条干净的瀑布。 */
      const cards = batch.filter(x => x.el.matches('.arona-post-card'))
      const others = batch.filter(x => !x.el.matches('.arona-post-card'))
      for (const group of [cards, others]) {
        group.sort((a, b) => a.top - b.top)
        group.forEach(({ el }, i) => {
          el.style.setProperty(
            '--arona-reveal-delay',
            `${Math.min(i, STAGGER_MAX) * STAGGER_MS}ms`
          )
          el.classList.add('arona-revealed')
          // 进场后不再观察：元素可能被反复移出视口，
          // 继续观察会让它每次重新播一遍动画。
          if (observer) observer.unobserve(el)
        })
      }
    }

    const io = new IntersectionObserver(
      entries => {
        const batch = []
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          if (entry.target.classList.contains('arona-revealed')) {
            io.unobserve(entry.target)
            continue
          }
          batch.push({ el: entry.target, top: entry.boundingClientRect.top })
        }
        if (batch.length) revealBatch(batch, io)
      },
      {
        // 底部留 8% 的负边距：元素真要「露头」才算进场，
        // 而不是还在视口边缘时就播。
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.06
      }
    )

    /* 「本实例已经处理过的元素」用 WeakSet 记，**不要**写到 DOM 的 data 属性上。
       踩过的坑：effect 会被跑两轮（主题解析完成 / hydration 后整棵树重挂都会触发），
       第一轮 cleanup 只 disconnect 了观察器，data 标记却留在 DOM 上；
       第二轮 scan() 看到标记就把每一个元素都当成「已绑定」跳过去 ——
       既不重新 observe，也不加 arona-revealed，元素被 CSS 的
       html.arona-reveal-on ... { opacity: 0 } 永久藏住。
       线上表现就是首页只有第 1 张卡看得见，其余全空白。
       WeakSet 随实例销毁，重建时会自然重新处理所有元素。 */
    const bound = new WeakSet()

    const scan = () => {
      const immediate = []
      const els = document.querySelectorAll(REVEAL_SELECTOR)
      for (const el of els) {
        if (el.classList.contains('arona-revealed')) continue
        if (bound.has(el)) continue
        bound.add(el)

        /* 已经在视口内的元素必须当场标记为已进场，不能交给 IntersectionObserver。
           原因：html.arona-reveal-on 是本 effect 才加上的，加上的那一刻所有
           进场目标会同时变成 opacity:0；而 IO 的首批回调是异步的，
           首屏内容会先闪一下「可见 → 消失 → 淡入」。
           这里同步读一次 boundingRect 兜住首屏，只有真正在下面的才去观察。
           视口内的收集成一批再统一错峰，delay 由 revealBatch 按视口顺序算。 */
        const rect = el.getBoundingClientRect()
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0
        if (reduceMotion || inViewport) {
          immediate.push({ el, top: rect.top })
        } else {
          io.observe(el)
        }
      }
      if (immediate.length) revealBatch(immediate, io)
    }

    scan()

    /* 兜底：元素明明在视口里、却还是 opacity:0 —— 这时候不能再指望 IO。
       滚动 / 窗口尺寸变化时同步补一次判定，命中就当场亮起来。
       IO 正常工作时这里永远不命中，等于零开销（一次 rAF + 一次读 rect）。 */
    let fallbackRaf = 0
    const revealVisibleNow = () => {
      fallbackRaf = 0
      const batch = []
      for (const el of document.querySelectorAll(REVEAL_SELECTOR)) {
        if (el.classList.contains('arona-revealed')) continue
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          batch.push({ el, top: rect.top })
        }
      }
      /* 兜底也要走批次错峰：IO 因任何原因没回调时，这批卡片不该
         「啪」地一起亮，节奏要和正常进场保持一致。 */
      if (batch.length) revealBatch(batch, io)
    }
    const scheduleFallback = () => {
      if (fallbackRaf) return
      fallbackRaf = requestAnimationFrame(revealVisibleNow)
    }
    window.addEventListener('scroll', scheduleFallback, { passive: true })
    window.addEventListener('resize', scheduleFallback)

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

    /* 高光的绑定标记同样用 WeakSet：data 属性会在重挂后残留，
       导致第二轮 bindSheen 全部跳过 —— 旧监听已被 cleanup 摘掉，
       结果就是「鼠标高光彻底失效」。 */
    const sheenBound = new WeakSet()
    const bindSheen = () => {
      if (reduceMotion) return
      for (const el of document.querySelectorAll(SHEEN_SELECTOR)) {
        if (sheenBound.has(el)) continue
        sheenBound.add(el)
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
      window.removeEventListener('scroll', scheduleFallback)
      window.removeEventListener('resize', scheduleFallback)
      if (rafId) cancelAnimationFrame(rafId)
      if (syncRaf) cancelAnimationFrame(syncRaf)
      if (fallbackRaf) cancelAnimationFrame(fallbackRaf)
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
