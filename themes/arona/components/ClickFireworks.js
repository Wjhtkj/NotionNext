'use client'

import { useEffect, useRef } from 'react'

/**
 * 点击烟花特效（移植自 astro-theme-AronaNote 的 Cursor.astro）
 * 在画布上绘制蓝色/紫色三角与光环爆裂效果
 */
export default function ClickFireworks() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.__aronaClickInit) return
    window.__aronaClickInit = true

    const isEnabled = () => localStorage.getItem('arona-fireworks') !== 'false'
    let canvas = null
    let ctx = null
    let raf = null
    const effects = []

    const isDark = () => {
      const el = document.documentElement
      return (
        el.classList.contains('dark') ||
        el.getAttribute('theme') === 'dark' ||
        el.getAttribute('data-theme') === 'dark'
      )
    }
    const colors = () =>
      isDark()
        ? { primary: '#9d7bff', secondary: '#1a1a2e', outer: '157,123,255', shadow: '#9d7bff' }
        : { primary: '#77deff', secondary: '#ffffff', outer: '74,144,217', shadow: '#77deff' }

    const getConfig = () => {
      const scale = Math.max(1, window.innerWidth / 1600)
      return {
        radius: 25 * scale, duration: 800, sizeMin: 8 * scale, sizeMax: 12 * scale,
        speedMin: 30 * scale, speedMax: 40 * scale, delayMax: 200,
        shadowBlur: 10 * scale, tailShadowBlur: 8 * scale, innerShadowBlur: 20 * scale,
        offset: 8 * scale, outerRadiusOffset: 8 * scale, radiusGrowth: 6 * scale
      }
    }

    class ClickEffect {
      constructor(x, y) {
        const c = getConfig()
        this.x = x; this.y = y
        this.startTime = Date.now()
        this.duration = c.duration
        this.rotation1 = Math.random() * Math.PI * 2
        this.rotation2 = Math.random() * Math.PI * 2
        this.radius = c.radius
        this.triangles = []
        const count = 3 + Math.floor(Math.random() * 4)
        const col = colors()
        for (let i = 0; i < count; i++) {
          this.triangles.push({
            angle: Math.random() * Math.PI * 2,
            delay: Math.random() * c.delayMax,
            size: c.sizeMin + Math.random() * c.sizeMax,
            speed: c.speedMin + Math.random() * c.speedMax,
            color: Math.random() > 0.5 ? col.primary : col.secondary,
            rotationSpeed: (Math.random() - 0.5) * 0.1
          })
        }
      }
      draw(context, now) {
        const c = getConfig()
        const elapsed = now - this.startTime
        const progress = Math.min(elapsed / this.duration, 1)
        context.save()
        context.translate(this.x, this.y)
        const scale = 1 + progress * 0.3
        const alpha = Math.pow(1 - progress, 1.5)
        const currentRadius = this.radius + c.outerRadiusOffset + progress * c.radiusGrowth
        context.globalAlpha = alpha
        context.scale(scale, scale)
        this.drawOuter(context, alpha, currentRadius, c)
        this.drawTails(context, progress, currentRadius, c)
        this.drawTriangles(context, elapsed, c)
        context.restore()
        return progress < 1
      }
      drawOuter(context, alpha, radius, c) {
        const col = colors()
        const center = radius + c.outerRadiusOffset
        context.beginPath()
        context.arc(0, 0, center, 0, Math.PI * 2)
        const g = context.createRadialGradient(0, 0, 0, 0, 0, center)
        g.addColorStop(0, `rgba(${col.outer}, ${alpha * 0.8})`)
        g.addColorStop(0.7, `rgba(${col.outer}, ${alpha * 0.4})`)
        g.addColorStop(1, `rgba(${col.outer}, 0)`)
        context.fillStyle = g
        context.shadowColor = col.shadow
        context.shadowBlur = c.shadowBlur
        context.fill()
        context.shadowBlur = 0
      }
      drawTails(context, progress, radius, c) {
        if (progress < 0.3) return
        const tail = (progress - 0.3) / 0.7
        const col = colors()
        const drawArc = (baseAngle, color) => {
          for (let i = 0; i < 8; i++) {
            const offset = i * c.offset
            const a = alphaTail(progress, i) * (1 - i * 0.12)
            context.save()
            context.globalAlpha = a
            context.strokeStyle = color
            context.lineWidth = Math.max(1, 3 - i * 0.3)
            context.lineCap = 'round'
            context.shadowColor = color
            context.shadowBlur = c.tailShadowBlur - i
            const start = baseAngle - (offset * Math.PI) / 180
            const end = baseAngle + Math.PI * 0.6 - (offset * Math.PI) / 180
            context.beginPath()
            context.arc(0, 0, radius, start, end)
            context.stroke()
            context.restore()
          }
        }
        drawArc(this.rotation1 - tail * 2, col.primary)
        drawArc(this.rotation2 + Math.PI - tail * 2, col.secondary)
      }
      drawTriangles(context, elapsed, c) {
        const col = colors()
        this.triangles.forEach(t => {
          const tp = Math.max(0, (elapsed - t.delay) / (this.duration - t.delay))
          if (tp <= 0 || tp >= 1) return
          const distance = t.speed * tp
          const size = t.size * (1 - tp * 0.8)
          const bright = Math.sin(tp * Math.PI * 6) * 0.4 + 0.8
          context.save()
          context.translate(
            Math.cos(t.angle) * (this.radius + distance),
            Math.sin(t.angle) * (this.radius + distance)
          )
          context.rotate(t.angle + (elapsed * t.rotationSpeed) / 1000)
          context.globalAlpha = 1 - tp
          context.fillStyle = t.color
          context.shadowColor = t.color
          context.shadowBlur = c.shadowBlur
          context.beginPath()
          context.moveTo(0, -size)
          context.lineTo(size * 0.866, size * 0.5)
          context.lineTo(-size * 0.866, size * 0.5)
          context.closePath()
          context.fill()
          context.globalCompositeOperation = 'lighter'
          context.fillStyle = t.color
          context.globalAlpha = bright * 0.3
          context.shadowBlur = c.innerShadowBlur
          context.beginPath()
          context.moveTo(0, -size * 0.8)
          context.lineTo(size * 0.693, size * 0.4)
          context.lineTo(-size * 0.693, size * 0.4)
          context.closePath()
          context.fill()
          context.restore()
        })
      }
    }
    const alphaTail = (progress, i) => (1 - progress) * (1 - i * 0.12)

    const initCanvas = () => {
      canvas = canvasRef.current
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctx = canvas.getContext('2d')
    }
    const animate = () => {
      if (!ctx) return
      const now = Date.now()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = effects.length - 1; i >= 0; i--) {
        if (!effects[i].draw(ctx, now)) effects.splice(i, 1)
      }
      if (effects.length > 0) raf = requestAnimationFrame(animate)
      else raf = null
    }
    const onClick = e => {
      if (!canvas || !isEnabled()) return
      const rect = canvas.getBoundingClientRect()
      effects.push(new ClickEffect(e.clientX - rect.left, e.clientY - rect.top))
      if (!raf) raf = requestAnimationFrame(animate)
    }
    const onResize = () => { initCanvas(); if (raf) { cancelAnimationFrame(raf); raf = null } effects.length = 0 }

    const init = () => {
      initCanvas()
      document.addEventListener('click', onClick, { passive: true })
      window.addEventListener('resize', onResize)
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
    else init()

    return () => {
      window.__aronaClickInit = false
      document.removeEventListener('click', onClick)
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className='arona-click-canvas' />
}
