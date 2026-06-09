import styles from './Twinkle.module.css'

export default function Twinkle({ count = 8, area = { top: 0, left: 0, width: '100%', height: '40%' }, style }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${10 + Math.random() * 80}%`,
    left: `${5 + Math.random() * 90}%`,
    delay: `${(i * 0.37) % 2.4}s`,
    scale: 0.5 + Math.random() * 0.8,
  }))

  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        ...area,
        ...style,
      }}
    >
      {stars.map(s => (
        <div
          key={s.id}
          className={styles.star}
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            transform: `scale(${s.scale})`,
          }}
        />
      ))}
    </div>
  )
}
