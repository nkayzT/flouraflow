import { useEffect, useRef } from 'react'
import { RIDE_DIRECTION } from '../config/locations'
import styles from './RideScreen.module.css'

const RIDE_DURATION = 3500

export default function RideScreen({ direction, onEnd }) {
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setTimeout(onEnd, RIDE_DURATION)
    return () => clearTimeout(timerRef.current)
  }, [onEnd])

  const isRight = direction === RIDE_DIRECTION
  const imgSrc = isRight ? './assets/ride-right.png' : './assets/ride-left.png'

  return (
    <div className={styles.rideScreen}>
      {/* Parallax background (slow sky layer) */}
      <div
        className={`${styles.layer} ${styles.layerSky}`}
        style={{ animationDirection: isRight ? 'normal' : 'reverse' }}
      />

      {/* Mid layer (mountains/sea) */}
      <div
        className={`${styles.layer} ${styles.layerMid}`}
        style={{ animationDirection: isRight ? 'normal' : 'reverse' }}
      />

      {/* Ride image (scooter + scene) */}
      <img
        src={imgSrc}
        alt={`riding ${direction}`}
        className={styles.rideImg}
        draggable={false}
      />

      {/* Road surface scrolling */}
      <div
        className={styles.road}
        style={{ animationDirection: isRight ? 'normal' : 'reverse' }}
      >
        <div className={styles.roadDashes} />
      </div>

      {/* Wheel spin overlays (positioned at approximate wheel spots) */}
      <div className={`${styles.wheel} ${styles.wheelFront}`} />
      <div className={`${styles.wheel} ${styles.wheelRear}`} />

      {/* Headlight beam */}
      <div className={`${styles.headlight} ${isRight ? styles.headlightRight : styles.headlightLeft}`} />

      {/* Taillight */}
      <div className={`${styles.taillight} ${isRight ? styles.taillightRight : styles.taillightLeft}`} />

      {/* Exhaust puff */}
      <div className={`${styles.exhaust} ${isRight ? styles.exhaustRight : styles.exhaustLeft}`} />

      {/* Stars twinkling */}
      <div className={styles.starsLayer}>
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className={styles.rideStar}
            style={{
              left: `${(i * 3.3) % 100}%`,
              top: `${(i * 7.7) % 40}%`,
              animationDelay: `${(i * 0.21) % 2.5}s`,
              width: i % 3 === 0 ? '2px' : '1px',
              height: i % 3 === 0 ? '2px' : '1px',
            }}
          />
        ))}
      </div>

      {/* Bike bob (slight vertical oscillation) */}
    </div>
  )
}
