import { useSyncExternalStore } from 'react'

const SRC = '/audio/loop1.m4a'
// Length of the original AIFF; caps the loop so encoder padding never plays.
const LOOP_SECONDS = 1728627 / 44100
const FADE_SECONDS = 0.2
const VOLUME = 0.8

// Module-level so there is one loop for the whole site,
// and playback survives route changes.
let ctx: AudioContext | null = null
let gain: GainNode | null = null
let analyser: AnalyserNode | null = null
let samples: Uint8Array | null = null
let buffer: Promise<AudioBuffer> | null = null
let source: AudioBufferSourceNode | null = null
let playing = false
const listeners = new Set<() => void>()

function setPlaying(value: boolean) {
  playing = value
  listeners.forEach((l) => l())
}

function loadBuffer(context: AudioContext) {
  buffer ??= fetch(SRC)
    .then((res) => res.arrayBuffer())
    .then((data) => context.decodeAudioData(data))
    .catch((err) => {
      buffer = null // allow a retry on the next click
      throw err
    })
  return buffer
}

async function play() {
  ctx ??= new AudioContext()
  if (!gain) {
    gain = ctx.createGain()
    analyser = ctx.createAnalyser()
    analyser.fftSize = 512
    samples = new Uint8Array(analyser.fftSize)
    gain.connect(analyser)
    analyser.connect(ctx.destination)
  }
  setPlaying(true)
  await ctx.resume()
  const audio = await loadBuffer(ctx)
  if (!playing || source) return

  source = ctx.createBufferSource()
  source.buffer = audio
  source.loop = true
  source.loopEnd = Math.min(LOOP_SECONDS, audio.duration)
  source.connect(gain)

  const now = ctx.currentTime
  gain.gain.cancelScheduledValues(now)
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(VOLUME, now + FADE_SECONDS)
  source.start(now)
}

function pause() {
  setPlaying(false)
  if (!ctx || !gain || !source) return
  const now = ctx.currentTime
  gain.gain.cancelScheduledValues(now)
  gain.gain.setValueAtTime(gain.gain.value, now)
  gain.gain.linearRampToValueAtTime(0, now + FADE_SECONDS)
  source.stop(now + FADE_SECONDS)
  source = null
}

// Current loudness (RMS) of the output, roughly 0..1. Cheap enough to call every frame.
export function getLevel() {
  if (!analyser || !samples) return 0
  analyser.getByteTimeDomainData(samples)
  let sum = 0
  for (const v of samples) {
    const x = (v - 128) / 128
    sum += x * x
  }
  return Math.min(1, Math.sqrt(sum / samples.length) * 4)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useLoopPlayer() {
  const isPlaying = useSyncExternalStore(subscribe, () => playing, () => false)
  const toggle = () => {
    if (playing) pause()
    else play().catch(() => setPlaying(false))
  }
  return { isPlaying, toggle }
}
