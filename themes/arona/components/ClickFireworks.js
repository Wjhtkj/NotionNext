'use client'

import { useEffect, useRef } from 'react'

/**
 * 点击烟花特效（移植自 Endless647 Cursor.astro 的点击特效）
 * 点击处生成三角碎片 + 弧形拖尾
 * 可通过「鼠标特效」开关（localStorage: cursor-effect-enabled / 事件 cursor-effect-toggle）控制
 */
const ClickFireworks = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationId = null
    const effects = []

    const isEnabled = () => {
      try {
        return localStorage.getItem('cursor-effect-enabled') !== 'false'
      } catch (e) {
        return true
      }
    }
    const isDark = () => document.documentElement.classList.contains('dark')
    const themeColors = () => {
      const dark = isDark()
      return {
        primary: dark ? '#9d7bff' : '#77deff',
        secondary: dark ? '#1a1a2e' : '#ffffff',
        outerCircle: dark ? '157, 123, 255' : '74, 144, 217',
        shadow: dark ? '#9d7bff' : '#77deff'
      }
    }
    const config = () => {
      const scale = window.innerWidth / 1600
      const s = Math.max(1, scale)
      return {
        radius: 25 * s,
        duration: 800,
        sizeMin: 8 * s,
        sizeMax: 12 * s,
        speedMin: 30 * s,
        speedMax: 40 * s,
        delayMax: 200,
        shadowBlur: 10 * s,
        tailShadowBlur: 8 * s,
        innerShadowBlur: 20 * s,
        offset: 8 * s,
        outerRadiusOffset: 8 * s,
        radiusGrowth: 6 * s
      }
    }

    class ClickEffect {
      constructor(x, y) {
        const c = config()
        this.x = x
        this.y = y
        this.startTime = Date.now()
        this.duration = c.duration
        this.rotation1 = Math.random() * Math.PI * 2
        this.rotation2 = Math.random() * Math.PI * 2
        this.radius = c.radius
        this.triangles = []
        const count = 3 + Math.floor(Math.random() * 4)
        const colors = themeColors()
        for (let i = 0; i < count; i++) {
          this.triangles.push({
            angle: Math.random() * Math.PI * 2,
            delay: Math.random() * c.delayMax,
            size: c.sizeMin + Math.random() * c.sizeMax,
            speed: c.speedMin + Math.random() * c.speedMax,
            color: Math.random() > 0.5 ? colors.primary : colors.secondary,
            rotationSpeed: (Math.random() - 0.5) * 0.1
          })
        }
      }

      draw(context, currentTime) {
        const c = config()
        const elapsed = currentTime - this.startTime
        const progress = Math.min(elapsed / this.duration, 1)
        context.save()
        context.translate(this.x, this.y)
        const scale = 1 + progress * 0.3
        const alpha = Math.pow(1 - progress, 1.5)
        const currentRadius = this.radius + c.outerRadiusOffset + progress * c.radiusGrowth
        context.globalAlpha = alpha
        context.scale(scale, scale)
        this.drawOuterCircle(context, alpha, currentRadius, c)
        this.drawArcTails(context, progress, currentRadius, c)
        this.drawTriangles(context, elapsed, c)
        context.restore()
        return progress < 1
      }

      drawOuterCircle(context, alpha, currentRadius, c) {
        const centerRadius = currentRadius + c.outerRadiusOffset
        const colors = themeColors()
        context.beginPath()
        context.arc(0, 0, centerRadius, 0, Math.PI * 2)
        const gradient = context.createRadialGradient(0, 0, 0, 0, 0, centerRadius)
        gradient.addColorStop(0, `rgba(${colors.outerCircle}, ${alpha * 0.8})`)
        gradient.addColorStop(0.7, `rgba(${colors.outerCircle}, ${alpha * 0.4})`)
        gradient.addColorStop(1, `rgba(${colors.outerCircle}, 0)`)
        context.fillStyle = gradient
        context.shadowColor = colors.shadow
        context.shadowBlur = c.shadowBlur
        context.fill()
        context.shadowBlur = 0
      }

      drawArcTails(context, progress, currentRadius, c) {
        if (progress < 0.3) return
        const tailProgress = (progress - 0.3) / 0.7
        context.save()
        context.globalAlpha = Math.max(0, 1 - progress * 1.2)
        const tail1Angle = this.rotation1 - tailProgress * 2
        const tail2Angle = this.rotation2 + Math.PI - tailProgress * 2
        const colors = themeColors()
        for (let i = 0; i < 8; i++) {
          const offset = i * c.offset
          context.save()
          context.globalAlpha = (1 - progress) * (1 - i * 0.12)
          context.strokeStyle = colors.primary
          context.lineWidth = Math.max(1, 3 - i * 0.3)
          context.lineCap = 'round'
          context.shadowColor = colors.primary
          context.shadowBlur = c.tailShadowBlur - i
          const sa = tail1Angle - (offset * Math.PI) / 180
          const ea = tail1Angle + Math.PI * 0.6 - (offset * Math.PI) / 180
          context.beginPath()
          context.arc(0, 0, currentRadius, sa, ea)
          context.stroke()
          context.restore()
        }
        for (let i = 0; i < 8; i++) {
          const offset = i * c.offset
          context.save()
          context.globalAlpha = (1 - progress) * (1 - i * 0.12)
          context.strokeStyle = colors.secondary
          context.lineWidth = Math.max(1, 3 - i * 0.3)
          context.lineCap = 'round'
          context.shadowColor = colors.secondary
          context.shadowBlur = c.tailShadowBlur - i
          const sa = tail2Angle - (offset * Math.PI) / 180
          const ea = tail2Angle + Math.PI * 0.4 - (offset * Math.PI) / 180
          context.beginPath()
          context.arc(0, 0, currentRadius, sa, ea)
          context.stroke()
          context.restore()
        }
        context.restore()
      }

      drawTriangles(context, elapsed, c) {
        this.triangles.forEach(t => {
          const tp = Math.max(0, (elapsed - t.delay) / (this.duration - t.delay))
          if (tp <= 0 || tp >= 1) return
          const distance = t.speed * tp
          const size = t.size * (1 - tp * 0.8)
          const brightness = Math.sin(tp * Math.PI * 6) * 0.4 + 0.8
          context.save()
          context.translate(Math.cos(t.angle) * (this.radius + distance), Math.sin(t.angle) * (this.radius + distance))
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
          context.globalAlpha = brightness * 0.3
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

    const initCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const animate = () => {
      const now = Date.now()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = effects.length - 1; i >= 0; i--) {
        if (!effects[i].draw(ctx, now)) effects.splice(i, 1)
      }
      if (effects.length > 0) {
        animationId = requestAnimationFrame(animate)
      } else {
        animationId = null
      }
    }

    const onClick = e => {
      if (!isEnabled()) return
      effects.push(new ClickEffect(e.clientX, e.clientY))
      if (!animationId) animationId = requestAnimationFrame(animate)
    }

    const onResize = () => {
      initCanvas()
      effects.length = 0
    }

    const onToggle = e => {
      if (e.detail && !e.detail.enabled) {
        effects.length = 0
        if (animationId) {
          cancelAnimationFrame(animationId)
          animationId = null
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    initCanvas()
    document.addEventListener('click', onClick, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('cursor-effect-toggle', onToggle)

    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('cursor-effect-toggle', onToggle)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas id='arona-click-canvas' className='arona-click-canvas' ref={canvasRef} />
}

export default ClickFireworks
