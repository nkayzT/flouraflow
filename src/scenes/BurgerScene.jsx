import SteamCanvas from '../fx/SteamCanvas'
import Glow from '../fx/Glow'
import Twinkle from '../fx/Twinkle'
import styles from './Scene.module.css'

export default function BurgerScene() {
  return (
    <div className={styles.scene}>
      <img
        src="./assets/burger-stand.png"
        alt="burger stand"
        className={styles.sceneImg}
        draggable={false}
      />

      {/* Warm interior light flicker */}
      <div className={styles.lightFlicker} />

      {/* Steam from counter */}
      <SteamCanvas style={{ bottom: '28%', left: '20%', width: '60%', height: '35%' }} />

      {/* Sign glow */}
      <Glow
        color="rgba(255,150,30,0.35)"
        size={140}
        style={{ top: '12%', left: '50%', transform: 'translate(-50%,-50%)' }}
      />

      {/* Scooter taillight */}
      <Glow
        color="rgba(255,50,50,0.5)"
        size={30}
        style={{ bottom: '14%', left: '35%', transform: 'translate(-50%,-50%)' }}
      />

      {/* Stars in sky */}
      <Twinkle count={14} area={{ top: 0, left: 0, width: '100%', height: '30%' }} />

      {/* Moth looping near light */}
      <div className={styles.moth} />
    </div>
  )
}
