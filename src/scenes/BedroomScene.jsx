import RainCanvas from '../fx/RainCanvas'
import Flame from '../fx/Flame'
import Glow from '../fx/Glow'
import styles from './Scene.module.css'

const FAIRY_LIGHTS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${5 + i * 8}%`,
  top: `${4 + (i % 3) * 1.5}%`,
  delay: `${(i * 0.22) % 2}s`,
  color: ['#ffe082','#ff8a65','#80deea','#ce93d8'][i % 4],
}))

export default function BedroomScene() {
  return (
    <div className={styles.scene}>
      <img
        src="./assets/bedroom.png"
        alt="bedroom"
        className={styles.sceneImg}
        draggable={false}
      />

      {/* Rain on the window region (right side, upper half) */}
      <RainCanvas style={{ top: '5%', left: '45%', width: '52%', height: '50%' }} />

      {/* Desk lamp glow */}
      <Glow
        color="rgba(255,210,100,0.3)"
        size={120}
        style={{ top: '38%', left: '52%', transform: 'translate(-50%,-50%)' }}
      />

      {/* Candle flame */}
      <Flame style={{ top: '55%', left: '64%', transform: 'translateX(-50%)' }} />

      {/* Candle glow */}
      <Glow
        color="rgba(255,160,40,0.25)"
        size={80}
        style={{ top: '58%', left: '64%', transform: 'translate(-50%,-50%)' }}
      />

      {/* Fairy lights along top */}
      {FAIRY_LIGHTS.map(l => (
        <div
          key={l.id}
          className={styles.fairyBulb}
          style={{
            left: l.left,
            top: l.top,
            background: l.color,
            animationDelay: l.delay,
          }}
        />
      ))}

      {/* Window stars (faint through the glass) */}
      <div className={styles.windowStars}>
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className={styles.windowStar}
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 70 + 10}%`,
              animationDelay: `${(i * 0.28) % 3}s`,
              width: Math.random() > 0.7 ? '2px' : '1px',
              height: Math.random() > 0.7 ? '2px' : '1px',
            }}
          />
        ))}
      </div>

      {/* Girl breathing sway */}
      <div className={styles.girlSway} />
    </div>
  )
}
