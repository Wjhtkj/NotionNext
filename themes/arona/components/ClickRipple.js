'use client'

import { useEffect } from 'react'

/** 只在「可交互元素」上起涟漪，避免整页任意点击都冒圈。 */
const HOST_SELECTOR = [
  'button',
  'a',
  '[role="button"]',
  '.arona-cloud-item',
  '.arona-post-card',
  '.arona-side-card'
].join(',')

/**
 * 点击涟漪（05）
 *
 * 与已有的 ClickFireworks 分工：
 *   · 烟花是 document 级 canvas，任意位置点击都会炸一圈碎片；
 *   · 涟漪只落在被点的那个控件内部，一道低透明度的蓝色水波，420ms 消散。
 * 因此同一次点击两者叠加也不会「过花」；涟漪还沿用烟花已有的
 * 「鼠标特效」开关（cursor-effect-enabled），用户关特效时一起关掉。
 *
 * 实现上刻意**不改目标元素的任何样式**：不设 position、不设 overflow。
 * 曾经踩过的坑是给导航加 overflow 会把绝对定位子菜单裁掉，
 * 给控件临时加 position:relative 也会破坏原有定位上下文。
 * 这里改为创建一个 fixed 的透明裁剪层盖在控件矩形上，波纹画在层内，
 * 层和波纹都是我们自己的节点，pointer-events:none 不挡交互。
 *
 * 动画只用 transform / opacity，时长走 --arona-dur-slow；
 * reduced-motion 直接不挂载监听（全局 CSS 压制是第二道保险）。
 */
const ClickRipple = () => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const isEnabled = () => {
      try {
        return localStorage.getItem('cursor-effect-enabled') !== 'false'
      } catch (e) {
        return true
      }
    }

    const onPointerDown = e => {
      // 只响应主键；触摸的 pointerdown 也会带 button=0
      if (e.button !== 0 || !isEnabled()) return
      const host = e.target && e.target.closest && e.target.closest(HOST_SELECTOR)
      if (!host) return
      const rect = host.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const layer = document.createElement('span')
      layer.className = 'arona-ripple-layer'
      layer.style.left = `${rect.left}px`
      layer.style.top = `${rect.top}px`
      layer.style.width = `${rect.width}px`
      layer.style.height = `${rect.height}px`
      layer.style.borderRadius = getComputedStyle(host).borderRadius || '12px'

      const wave = document.createElement('span')
      wave.className = 'arona-ripple-wave'
      const size = Math.max(rect.width, rect.height) * 2.2
      wave.style.left = `${e.clientX - rect.left}px`
      wave.style.top = `${e.clientY - rect.top}px`
      wave.style.width = `${size}px`
      wave.style.height = `${size}px`

      layer.appendChild(wave)
      /* 必须挂在 #theme-arona 内部：--arona-dur-* / --arona-ease-* /
         --color-blue 这些 token 全定义在那个根容器上。挂到 body 时层
         继承不到变量，animation 简写会因值缺失整条失效（实测 computed
         animationName 变成 none、duration 0s），波纹只闪一下就没了。
         根容器只有 position/color 类声明，没有 transform / filter，
         不会把 fixed 的裁剪层变成相对它定位。 */
      const mount = document.getElementById('theme-arona') || document.body
      mount.appendChild(layer)

      let done = false
      const cleanup = () => {
        if (done) return
        done = true
        layer.remove()
      }
      // animationend 会从子元素冒泡上来
      layer.addEventListener('animationend', cleanup, { once: true })
      // 兜底：动画被 reduced-motion 压成 0.001ms 或标签页后台暂停时
      setTimeout(cleanup, 900)
    }

    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return null
}

export default ClickRipple
