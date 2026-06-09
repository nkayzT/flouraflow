import { useEffect, useRef } from 'react'

export default function RainCanvas({ style }) {
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

    const drops = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 18 + 8,
      speed: Math.random() * 6 + 4,
      opacity: Math.random() * 0.4 + 0.15,
      width: Math.random() < 0.3 ? 1.5 : 1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.lineWidth = 1
      for (const d of drops) {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(180,200,255,${d.opacity})`
        ctx.lineWidth = d.width
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x - d.length * 0.15, d.y + d.length)
        ctx.stroke()

        d.y += d.speed
        d.x -= d.speed * 0.15
        if (d.y > canvas.height) {
          d.y = -d.length
          d.x = Math.random() * (canvas.width + 20)
        }
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
