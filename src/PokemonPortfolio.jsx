import { useEffect, useRef, useState } from 'react'
import { Game, DEFAULT_PROJECTS } from './game.js'
import styles from './PokemonPortfolio.module.css'

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

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />

      {activeProject && (
        <div className={styles.overlay} onClick={closeProject}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeProject} aria-label="Close">
              ✕
            </button>

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
