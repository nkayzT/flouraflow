import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MapScreen from './components/MapScreen'
import RideScreen from './components/RideScreen'
import DestinationScreen from './components/DestinationScreen'
import AudioButton from './components/AudioButton'
import { AudioProvider, useAudio } from './audio/useAudio'

const STATES = {
  MAP: 'MAP',
  RIDING_OUT: 'RIDING_OUT',
  DESTINATION: 'DESTINATION',
  RIDING_BACK: 'RIDING_BACK',
}

const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.35 } },
}

const slideFade = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
}

function MidnightRides() {
  const [appState, setAppState] = useState(STATES.MAP)
  const [location, setLocation] = useState(null)
  const { startAudio, setScene } = useAudio()

  const handlePinClick = useCallback((loc) => {
    startAudio()
    setLocation(loc)
    setScene('riding')
    setAppState(STATES.RIDING_OUT)
  }, [startAudio, setScene])

  const handleRideOutEnd = useCallback(() => {
    setScene(location?.id || 'map')
    setAppState(STATES.DESTINATION)
  }, [location, setScene])

  const handleBack = useCallback(() => {
    setScene('riding')
    setAppState(STATES.RIDING_BACK)
  }, [setScene])

  const handleRideBackEnd = useCallback(() => {
    setScene('map')
    setAppState(STATES.MAP)
  }, [setScene])

  return (
    <div className="viewport-frame">
      <AnimatePresence mode="wait">
        {appState === STATES.MAP && (
          <motion.div
            key="map"
            variants={fade}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="screen"
          >
            <MapScreen onPinClick={handlePinClick} />
          </motion.div>
        )}

        {appState === STATES.RIDING_OUT && (
          <motion.div
            key="ride-out"
            variants={slideFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="screen"
          >
            <RideScreen direction="right" onEnd={handleRideOutEnd} />
          </motion.div>
        )}

        {appState === STATES.DESTINATION && location && (
          <motion.div
            key={`dest-${location.id}`}
            variants={fade}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="screen"
          >
            <DestinationScreen location={location} onBack={handleBack} />
          </motion.div>
        )}

        {appState === STATES.RIDING_BACK && (
          <motion.div
            key="ride-back"
            variants={slideFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="screen"
          >
            <RideScreen direction="left" onEnd={handleRideBackEnd} />
          </motion.div>
        )}
      </AnimatePresence>

      <AudioButton />
    </div>
  )
}

export default function App() {
  return (
    <AudioProvider>
      <MidnightRides />
    </AudioProvider>
  )
}
