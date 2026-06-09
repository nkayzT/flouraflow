import { createContext, useContext, useRef, useState, useCallback } from 'react'

const AudioCtx = createContext(null)

function createNoiseBuffer(ctx, duration = 2) {
  const size = ctx.sampleRate * duration
  const buf = ctx.createBuffer(1, size, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1
  return buf
}

function makeNoise(ctx, dest, frequency = 400, q = 1, gain = 0.04) {
  const src = ctx.createBufferSource()
  src.buffer = createNoiseBuffer(ctx)
  src.loop = true
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = frequency
  filter.Q.value = q
  const g = ctx.createGain()
  g.gain.value = gain
  src.connect(filter)
  filter.connect(g)
  g.connect(dest)
  src.start()
  return { source: src, gainNode: g }
}

function makeLofi(ctx, dest) {
  const notes = [130.81, 146.83, 164.81, 174.61, 196, 220, 246.94]
  const masterGain = ctx.createGain()
  masterGain.gain.value = 0.06
  masterGain.connect(dest)

  // Vinyl crackle
  const crackle = makeNoise(ctx, masterGain, 6000, 0.8, 0.015)

  let noteIdx = 0
  const playNote = () => {
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = notes[noteIdx % notes.length] * (Math.random() > 0.7 ? 2 : 1)
    noteIdx++
    const t = ctx.currentTime
    env.gain.setValueAtTime(0, t)
    env.gain.linearRampToValueAtTime(0.4, t + 0.02)
    env.gain.exponentialRampToValueAtTime(0.001, t + 1.2)
    osc.connect(env)
    env.connect(masterGain)
    osc.start(t)
    osc.stop(t + 1.2)
  }

  playNote()
  const interval = setInterval(playNote, 800 + Math.random() * 600)
  return () => {
    clearInterval(interval)
    crackle.source.stop()
  }
}

export function AudioProvider({ children }) {
  const ctxRef = useRef(null)
  const masterRef = useRef(null)
  const lofiCleanupRef = useRef(null)
  const ambienceRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState(false)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      masterRef.current = ctxRef.current.createGain()
      masterRef.current.gain.value = 0.4
      masterRef.current.connect(ctxRef.current.destination)
    }
    return ctxRef.current
  }, [])

  const startAudio = useCallback(() => {
    if (started) return
    setStarted(true)
    const ctx = getCtx()
    ctx.resume()
    lofiCleanupRef.current = makeLofi(ctx, masterRef.current)
  }, [started, getCtx])

  const setScene = useCallback((scene) => {
    if (!ctxRef.current || !started) return
    const ctx = ctxRef.current

    if (ambienceRef.current) {
      const { gainNode } = ambienceRef.current
      gainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.3)
      setTimeout(() => {
        try { ambienceRef.current?.source?.stop() } catch (_) {}
        ambienceRef.current = null
      }, 1500)
    }

    const configs = {
      bedroom: { freq: 800, q: 0.3, gain: 0.08 },
      burger:  { freq: 200, q: 0.5, gain: 0.05 },
      dock:    { freq: 300, q: 0.4, gain: 0.06 },
      beach:   { freq: 400, q: 0.3, gain: 0.09 },
      riding:  { freq: 1200, q: 2, gain: 0.07 },
    }

    const cfg = configs[scene]
    if (!cfg) return

    setTimeout(() => {
      if (!ctxRef.current) return
      const amb = makeNoise(ctx, masterRef.current, cfg.freq, cfg.q, 0)
      amb.gainNode.gain.setTargetAtTime(cfg.gain, ctx.currentTime, 0.5)
      ambienceRef.current = amb
    }, 300)
  }, [started])

  const toggleMute = useCallback(() => {
    setMuted(m => {
      const next = !m
      if (masterRef.current && ctxRef.current) {
        masterRef.current.gain.setTargetAtTime(
          next ? 0 : 0.4,
          ctxRef.current.currentTime,
          0.1
        )
      }
      return next
    })
  }, [])

  return (
    <AudioCtx.Provider value={{ startAudio, setScene, toggleMute, muted, started }}>
      {children}
    </AudioCtx.Provider>
  )
}

export const useAudio = () => useContext(AudioCtx)
