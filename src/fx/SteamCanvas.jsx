import { useEffect, useRef } from 'react'

export default function SteamCanvas({ style }) {
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

    const spawn = () => ({
      x: canvas.width * 0.3 + Math.random() * canvas.width * 0.4,
      y: canvas.height,
      vy: -(Math.random() * 1.2 + 0.6),
      vx: (Math.random() - 0.5) * 0.5,
      life: 0,
      maxLife: 80 + Math.random() * 60,
      r: Math.random() * 8 + 4,
    })

    const particles = Array.from({ length: 18 }, () => {
      const p = spawn()
      p.life = Math.random() * p.maxLife
      return p
    })

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.life++
        p.y += p.vy
        p.x += p.vx + Math.sin(p.life * 0.08) * 0.4
        p.r += 0.05
        if (p.life >= p.maxLife) Object.assign(p, spawn())

        const lifeRatio = p.life / p.maxLife
        const opacity = Math.sin(lifeRatio * Math.PI) * 0.25
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
        grad.addColorStop(0, `rgba(255,255,240,${opacity})`)
        grad.addColorStop(1, `rgba(255,255,240,0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = grad
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
