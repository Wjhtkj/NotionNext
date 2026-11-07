'use client'

import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 路由转场（03）
 *
 * 在 Next.js pages router 的客户端跳转里，「旧页淡出」能占用的时间只有
 * routeChangeStart → routeChangeComplete 之间那一小段，React 卸载旧内容后
 * 中间本来是空的。所以这里做两件可靠的事：
 *   · 离开期：整块主内容淡到 0.35 并轻微上收，顶部细线从 0 走到 75%；
 *   · 到达期：新页从 opacity 0 + 10px 下方位淡入落定，进度线补足后淡出。
 *
 * 刻意不用 View Transitions API：主题切换的圆形揭幕已经占用
 * document.startViewTransition()，浏览器同一时刻只允许一个活动过渡。
 * 两者靠「主题切换不产生 router 事件、这里不调用 startViewTransition」
 * 天然互斥，不需要额外的锁。
 *
 * 也不动 headlessui 的 <Transition show={!onLoading}>：那套负责首次加载，
 * 作用元素是 .arona-main 的子节点；这里作用在 .arona-main 本身，
 * 父子相乘不会互相覆盖，且首屏加载时 router 事件不触发，两者不叠加。
 *
 * 所有状态都挂在 <html> 的 class 上，DOM 只多一个进度线 span；
 * reduced-motion 由 style.js 的全局 !important 压制兜住。
 */
const RouteTransition = () => {
  const router = useRouter()

  useEffect(() => {
    const root = document.documentElement
    let leaveTimer = 0
    let enterTimer = 0

    const clearAll = () => {
      root.classList.remove('arona-route-leaving', 'arona-route-entering', 'arona-route-done')
    }

    const onStart = () => {
      clearTimeout(leaveTimer)
      clearTimeout(enterTimer)
      root.classList.remove('arona-route-entering', 'arona-route-done')
      root.classList.add('arona-route-leaving')
      /* 兜底：路由事件因异常没回来（404 / 网络挂起 / 组件卸载）时，
         不能让整页一直停在半透明。1.2s 足够覆盖静态页跳转。 */
      leaveTimer = setTimeout(() => root.classList.remove('arona-route-leaving'), 1200)
    }

    const onComplete = () => {
      clearTimeout(leaveTimer)
      root.classList.remove('arona-route-leaving')
      /* 连续跳转时先摘类再强制重排，动画才会从头播，
         否则第二次跳转只会沿用上一次的 animation 实例。 */
      root.classList.remove('arona-route-entering', 'arona-route-done')
      void root.offsetWidth
      root.classList.add('arona-route-entering')
      root.classList.add('arona-route-done')
      enterTimer = setTimeout(clearAll, 700)
    }

    router.events.on('routeChangeStart', onStart)
    router.events.on('routeChangeComplete', onComplete)
    router.events.on('routeChangeError', onComplete)

    return () => {
      router.events.off('routeChangeStart', onStart)
      router.events.off('routeChangeComplete', onComplete)
      router.events.off('routeChangeError', onComplete)
      clearTimeout(leaveTimer)
      clearTimeout(enterTimer)
      clearAll()
    }
  }, [router])

  return <span className='arona-route-progress' aria-hidden='true' />
}

export default RouteTransition
