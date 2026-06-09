import { useState } from 'react'
import StarField from '../fx/StarField'
import { LOCATIONS } from '../config/locations'
import styles from './MapScreen.module.css'

// Route lines between pins (pairs of location indices)
const ROUTES = [[0,1],[0,2],[1,3],[2,3]]

function routePath(a, b) {
  const mx = (a.pinX + b.pinX) / 2
  const my = (a.pinY + b.pinY) / 2
  return `M ${a.pinX} ${a.pinY} Q ${mx + (Math.random()*10-5)} ${my + (Math.random()*10-5)} ${b.pinX} ${b.pinY}`
}

export default function MapScreen({ onPinClick }) {
  const [hovered, setHovered] = useState(null)
  const [visited, setVisited] = useState([])

  const handleClick = (loc) => {
    setVisited(v => v.includes(loc.id) ? v : [...v, loc.id])
    onPinClick(loc)
  }

  return (
    <div className={styles.map}>
      {/* Gradient background */}
      <div className={styles.bg} />

      {/* Animated starfield */}
      <StarField count={200} />

      {/* City grid overlay */}
      <svg className={styles.city} viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Streets */}
        <line x1="0" y1="48" x2="100" y2="48" stroke="#1a2050" strokeWidth="1.2" strokeOpacity="0.7"/>
        <line x1="0" y1="75" x2="100" y2="75" stroke="#1a2050" strokeWidth="0.8" strokeOpacity="0.5"/>
        <line x1="0" y1="20" x2="100" y2="20" stroke="#1a2050" strokeWidth="0.7" strokeOpacity="0.4"/>
        <line x1="48" y1="0" x2="48" y2="100" stroke="#1a2050" strokeWidth="1" strokeOpacity="0.6"/>
        <line x1="15" y1="0" x2="15" y2="100" stroke="#1a2050" strokeWidth="0.7" strokeOpacity="0.4"/>
        <line x1="82" y1="0" x2="82" y2="100" stroke="#1a2050" strokeWidth="0.7" strokeOpacity="0.4"/>

        {/* City blocks */}
        <rect x="1" y="1" width="12" height="17" rx="0.5" fill="#0d0d22" opacity="0.8"/>
        <rect x="16" y="1" width="30" height="17" rx="0.5" fill="#0d0d22" opacity="0.8"/>
        <rect x="49" y="1" width="30" height="17" rx="0.5" fill="#0d0d22" opacity="0.8"/>
        <rect x="83" y="1" width="16" height="17" rx="0.5" fill="#0d0d22" opacity="0.8"/>
        <rect x="1" y="22" width="45" height="24" rx="0.5" fill="#0c0c20" opacity="0.7"/>
        <rect x="49" y="22" width="31" height="24" rx="0.5" fill="#0c0c20" opacity="0.7"/>
        <rect x="83" y="22" width="16" height="24" rx="0.5" fill="#0c0c20" opacity="0.7"/>
        <rect x="1" y="50" width="13" height="23" rx="0.5" fill="#0d0d22" opacity="0.8"/>
        <rect x="16" y="50" width="30" height="23" rx="0.5" fill="#0d0d22" opacity="0.8"/>
        <rect x="83" y="50" width="16" height="23" rx="0.5" fill="#0d0d22" opacity="0.8"/>

        {/* Water / park area */}
        <ellipse cx="62" cy="62" rx="16" ry="10" fill="#081830" opacity="0.9"/>

        {/* Tiny building windows */}
        {[
          [3,4],[5,4],[7,4],[3,8],[5,8],
          [18,4],[22,4],[26,4],[20,9],[24,9],
          [52,4],[58,4],[64,4],[55,10],
          [85,4],[89,4],[87,8],
          [4,54],[8,54],[4,58],[8,58],
          [18,54],[22,54],[28,54],[20,60],
          [85,54],[89,54],[87,59],
        ].map(([cx, cy], i) => (
          <rect
            key={i}
            x={cx} y={cy}
            width="1.5" height="1.2"
            fill="rgba(255,230,150,0.4)"
            rx="0.2"
          />
        ))}

        {/* Route dotted lines */}
        {ROUTES.map(([ai, bi], i) => {
          const a = LOCATIONS[ai], b = LOCATIONS[bi]
          return (
            <path
              key={i}
              d={routePath(a, b)}
              fill="none"
              stroke="rgba(100,120,200,0.25)"
              strokeWidth="0.8"
              strokeDasharray="2 3"
            />
          )
        })}
      </svg>

      {/* Title */}
      <div className={styles.title}>
        <span className={styles.titleMain}>MIDNIGHT</span>
        <span className={styles.titleSub}>RIDES</span>
      </div>

      {/* Hint */}
      <div className={styles.hint}>tap a pin to ride there</div>

      {/* Home scooter icon */}
      <div className={styles.homeScooter}>
        <svg viewBox="0 0 24 14" width="28" height="16">
          <circle cx="4" cy="11" r="3" fill="#3a3a5a" stroke="#666" strokeWidth="0.5"/>
          <circle cx="20" cy="11" r="3" fill="#3a3a5a" stroke="#666" strokeWidth="0.5"/>
          <path d="M6 9 Q5 6 8 5 L14 4 L18 5 Q21 6 21 9 L20 11 L4 11 Q3 9 6 9Z" fill="#3a3a5a"/>
          <ellipse cx="22" cy="9" rx="1.5" ry="1" fill="#ffe060" opacity="0.9"/>
        </svg>
      </div>

      {/* Location pins */}
      {LOCATIONS.map(loc => (
        <button
          key={loc.id}
          className={`${styles.pinWrap} ${visited.includes(loc.id) ? styles.visited : ''}`}
          style={{ left: `${loc.pinX}%`, top: `${loc.pinY}%` }}
          onClick={() => handleClick(loc)}
          onMouseEnter={() => setHovered(loc.id)}
          onMouseLeave={() => setHovered(null)}
          aria-label={loc.name}
        >
          {/* Pulse ring */}
          <span className={styles.pulse} style={{ '--glow': loc.glowColor }} />
          <span className={styles.pulse2} style={{ '--glow': loc.glowColor }} />

          {/* Pin body */}
          <span className={styles.pin} style={{ '--color': loc.color }}>
            <span className={styles.pinEmoji}>{loc.emoji}</span>
          </span>

          {/* Label */}
          <span className={`${styles.label} ${hovered === loc.id ? styles.labelVisible : ''}`}>
            {loc.name}
          </span>
        </button>
      ))}
    </div>
  )
}
