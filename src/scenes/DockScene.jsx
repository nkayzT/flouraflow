import WaterCanvas from '../fx/WaterCanvas'
import Glow from '../fx/Glow'
import Twinkle from '../fx/Twinkle'
import styles from './Scene.module.css'

export default function DockScene() {
  return (
    <div className={styles.scene}>
      <img
        src="./assets/dock.png"
        alt="dock"
        className={styles.sceneImg}
        draggable={false}
      />

      {/* Water shimmer - lower half */}
      <WaterCanvas style={{ top: '35%', left: 0, width: '100%', height: '65%' }} />

      {/* 7-Eleven sign glow */}
      <Glow
        color="rgba(255,60,60,0.3)"
        size={60}
        style={{ top: '22%', right: '12%', transform: 'translateY(-50%)' }}
      />
      <Glow
        color="rgba(30,120,255,0.25)"
        size={40}
        style={{ top: '26%', right: '10%', transform: 'translateY(-50%)' }}
      />

      {/* City lights twinkle on horizon */}
      <Twinkle
        count={18}
        area={{ top: '10%', left: 0, width: '85%', height: '25%' }}
      />

      {/* Distant city lights reflection ripple */}
      <div className={styles.reflectionGlow} />

      {/* Hair/wind sway on girl */}
      <div className={styles.hairSway} />
    </div>
  )
}
