import BedroomScene from '../scenes/BedroomScene'
import BurgerScene from '../scenes/BurgerScene'
import DockScene from '../scenes/DockScene'
import BeachScene from '../scenes/BeachScene'
import styles from './DestinationScreen.module.css'

const SCENES = {
  bedroom: BedroomScene,
  burger: BurgerScene,
  dock: DockScene,
  beach: BeachScene,
}

export default function DestinationScreen({ location, onBack }) {
  const Scene = SCENES[location.id]

  return (
    <div className={styles.dest}>
      {Scene ? <Scene /> : null}

      {/* Location name overlay */}
      <div className={styles.locationName} style={{ color: location.color }}>
        {location.emoji} {location.name}
      </div>

      {/* Back button */}
      <button className={styles.backBtn} onClick={onBack} aria-label="Go back">
        <span className={styles.backArrow}>◄</span>
        <span className={styles.backText}>back</span>
      </button>
    </div>
  )
}
