import { useEffect, useRef } from 'react'

export default function WaterCanvas({ style }) {
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

    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.025

      const lineCount = 12
      for (let i = 0; i < lineCount; i++) {
        const y = (i / lineCount) * canvas.height
        const opacity = 0.06 + 0.1 * (i / lineCount)
        ctx.beginPath()
        ctx.strokeStyle = `rgba(120,200,255,${opacity})`
        ctx.lineWidth = 1
        for (let x = 0; x <= canvas.width; x += 3) {
          const wave = Math.sin(x * 0.04 + t + i * 0.6) * (4 + i * 0.5)
            + Math.sin(x * 0.02 - t * 0.7 + i) * 2
          if (x === 0) ctx.moveTo(x, y + wave)
          else ctx.lineTo(x, y + wave)
        }
        ctx.stroke()
      }

      // Shimmer dots
      for (let i = 0; i < 6; i++) {
        const sx = (Math.sin(t * 0.8 + i * 1.5) * 0.4 + 0.5) * canvas.width
        const sy = (Math.sin(t * 0.6 + i * 2.1) * 0.4 + 0.5) * canvas.height
        const r = 1.5 + Math.sin(t + i) * 1
        const a = 0.2 + 0.2 * Math.sin(t * 1.2 + i)
        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,240,255,${a})`
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
