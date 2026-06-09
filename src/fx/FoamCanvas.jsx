import { useEffect, useRef } from 'react'

export default function FoamCanvas({ style }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    // Foam particles along the shoreline
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height * 0.45 + Math.random() * canvas.height * 0.1,
      r: Math.random() * 3 + 1,
      life: Math.random(),
      speed: Math.random() * 0.4 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }))

    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.02

      // Rolling foam line
      const waveY = canvas.height * 0.5
      ctx.beginPath()
      for (let x = 0; x <= canvas.width; x += 2) {
        const y = waveY
          + Math.sin(x * 0.03 + t) * 8
          + Math.sin(x * 0.05 - t * 1.3) * 4
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      const grad = ctx.createLinearGradient(0, waveY - 12, 0, waveY + 12)
      grad.addColorStop(0, 'rgba(255,255,255,0)')
      grad.addColorStop(0.4, 'rgba(255,255,255,0.35)')
      grad.addColorStop(0.6, 'rgba(220,240,255,0.25)')
      grad.addColorStop(1, 'rgba(200,230,255,0)')
      ctx.strokeStyle = grad
      ctx.lineWidth = 6
      ctx.stroke()

      // Foam bubbles
      for (const p of particles) {
        p.phase += p.speed * 0.05
        p.life += p.speed * 0.008
        if (p.life > 1) {
          p.x = Math.random() * canvas.width
          p.y = waveY + Math.sin(p.x * 0.03 + t) * 8 + (Math.random() - 0.5) * 20
          p.life = 0
          p.r = Math.random() * 3 + 1
        }
        const opacity = Math.sin(p.life * Math.PI) * 0.5
        ctx.beginPath()
        ctx.arc(p.x + Math.sin(p.phase) * 3, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${opacity})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }}
    />
  )
}
