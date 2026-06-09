import styles from './Flame.module.css'

export default function Flame({ style }) {
  return (
    <div className={styles.flameWrap} style={style}>
      <div className={styles.glow} />
      <div className={styles.flame}>
        <div className={styles.inner} />
      </div>
    </div>
  )
}
