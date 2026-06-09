import styles from './Glow.module.css'

export default function Glow({ color = 'rgba(255,220,120,0.35)', size = 80, style }) {
  return (
    <div
      className={styles.glow}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        ...style,
      }}
    />
  )
}
