import { useEffect, useRef, useState, useCallback } from 'react'
import { Game, DEFAULT_PROJECTS } from './game.js'
import styles from './PokemonPortfolio.module.css'

// --- Touch button hook ---
function useBtn(gameRef, key) {
  const press   = useCallback((e) => { e.preventDefault(); gameRef.current?.pressVirtualKey(key) },   [gameRef, key])
  const release = useCallback((e) => { e.preventDefault(); gameRef.current?.releaseVirtualKey(key) }, [gameRef, key])
  return {
    onPointerDown:   press,
    onPointerUp:     release,
    onPointerLeave:  release,
    onPointerCancel: release,
  }
}

export default function PokemonPortfolio({ projects = DEFAULT_PROJECTS }) {
  const canvasRef = useRef(null)
  const gameRef   = useRef(null)
  const [activeProject, setActiveProject] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    gameRef.current = new Game(canvas, projects, (project) => {
      setActiveProject(project)
    })
    return () => gameRef.current?.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const closeProject = () => {
    setActiveProject(null)
    gameRef.current?.resumeFromModal()
  }

  // D-pad
  const up    = useBtn(gameRef, 'ArrowUp')
  const down  = useBtn(gameRef, 'ArrowDown')
  const left  = useBtn(gameRef, 'ArrowLeft')
  const right = useBtn(gameRef, 'ArrowRight')
  // Action buttons
  const run      = useBtn(gameRef, 'Shift')   // B = run
  const interact = useBtn(gameRef, 'z')       // A = interact

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Touch controls */}
      <div className={styles.controls} aria-hidden="true">

        {/* D-pad */}
        <div className={styles.dpad}>
          <button className={`${styles.dpadBtn} ${styles.dpadUp}`}    {...up}>▲</button>
          <button className={`${styles.dpadBtn} ${styles.dpadLeft}`}  {...left}>◀</button>
          <div    className={styles.dpadCenter} />
          <button className={`${styles.dpadBtn} ${styles.dpadRight}`} {...right}>▶</button>
          <button className={`${styles.dpadBtn} ${styles.dpadDown}`}  {...down}>▼</button>
        </div>

        {/* Action buttons — GBA layout (B left, A right) */}
        <div className={styles.actionBtns}>
          <div className={styles.actionCol}>
            <button className={`${styles.actionBtn} ${styles.btnB}`} {...run}>B</button>
            <span   className={styles.btnLabel}>RUN</span>
          </div>
          <div className={styles.actionCol}>
            <button className={`${styles.actionBtn} ${styles.btnA}`} {...interact}>A</button>
            <span   className={styles.btnLabel}>TALK</span>
          </div>
        </div>

      </div>

      {/* Project modal */}
      {activeProject && (
        <div className={styles.overlay} onClick={closeProject}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeProject} aria-label="Close">✕</button>
            <div className={styles.modalIcon}>{activeProject.icon}</div>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{activeProject.title}</h2>
              {activeProject.subtitle && (
                <span className={styles.modalSubtitle}>{activeProject.subtitle}</span>
              )}
            </div>
            <p className={styles.modalDesc}>{activeProject.description}</p>
            {activeProject.link && activeProject.link !== '#' && (
              <a
                className={styles.modalLink}
                href={activeProject.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Project →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
