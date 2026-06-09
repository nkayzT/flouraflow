import FoamCanvas from '../fx/FoamCanvas'
import WaterCanvas from '../fx/WaterCanvas'
import Twinkle from '../fx/Twinkle'
import styles from './Scene.module.css'

export default function BeachScene() {
  return (
    <div className={styles.scene}>
      <img
        src="./assets/beach.png"
        alt="beach"
        className={styles.sceneImg}
        draggable={false}
      />

      {/* Water shimmer - left half (ocean) */}
      <WaterCanvas style={{ top: 0, left: 0, width: '55%', height: '60%' }} />

      {/* Foam at the shoreline */}
      <FoamCanvas style={{ top: '25%', left: 0, width: '60%', height: '50%' }} />

      {/* Ripples around girl's feet */}
      <div className={styles.rippleWrap}>
        <div className={styles.ripple} style={{ animationDelay: '0s' }} />
        <div className={styles.ripple} style={{ animationDelay: '0.6s' }} />
        <div className={styles.ripple} style={{ animationDelay: '1.2s' }} />
      </div>

      {/* Stars in sky (top) */}
      <Twinkle count={12} area={{ top: 0, left: 0, width: '100%', height: '10%' }} />

      {/* Heart rocks subtle bob */}
      <div className={styles.rocksOverlay} />
    </div>
  )
}
