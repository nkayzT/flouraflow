import { useAudio } from '../audio/useAudio'
import styles from './AudioButton.module.css'

export default function AudioButton() {
  const { toggleMute, muted, started } = useAudio()

  return (
    <button
      className={styles.btn}
      onClick={toggleMute}
      aria-label={muted ? 'Unmute' : 'Mute'}
      title={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? '🔇' : started ? '🎵' : '🔈'}
    </button>
  )
}
