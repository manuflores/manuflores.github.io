import { useSyncExternalStore } from 'react'
import { songs } from '@/data/songs'

const FADE_SECONDS = 0.2
const VOLUME = 0.8

// Module-level so there is one player for the whole site,
// and playback survives route changes.
//
// Loops (song.loop) play from a decoded buffer for a sample-accurate loop.
// Songs stream through an <audio> element so they don't have to be
// fully downloaded and decoded first. Both feed the same gain + analyser.
let ctx: AudioContext | null = null
let master: GainNode | null = null
let analyser: AnalyserNode | null = null
let samples: Uint8Array | null = null
let audioEl: HTMLAudioElement | null = null
let loopSource: AudioBufferSourceNode | null = null
let loopStartedAt = 0 // context time at which the loop's position was 0
let pausedAt = 0 // position in seconds while paused
let startToken = 0 // discards async starts that were superseded
const buffers = new Map<string, Promise<AudioBuffer>>()

interface State {
  index: number
  playing: boolean
}
let state: State = { index: 0, playing: false }
const listeners = new Set<() => void>()

function setState(patch: Partial<State>) {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

function setup(): AudioContext {
  if (ctx) return ctx
  ctx = new AudioContext()
  master = ctx.createGain()
  master.gain.value = 0
  analyser = ctx.createAnalyser()
  analyser.fftSize = 512
  samples = new Uint8Array(analyser.fftSize)
  master.connect(analyser)
  analyser.connect(ctx.destination)

  audioEl = new Audio()
  audioEl.preload = 'none'
  audioEl.addEventListener('ended', () => select(state.index + 1))
  ctx.createMediaElementSource(audioEl).connect(master)
  return ctx
}

function loadBuffer(context: AudioContext, src: string) {
  let buffer = buffers.get(src)
  if (!buffer) {
    buffer = fetch(src)
      .then((res) => res.arrayBuffer())
      .then((data) => context.decodeAudioData(data))
      .catch((err) => {
        buffers.delete(src) // allow a retry on the next click
        throw err
      })
    buffers.set(src, buffer)
  }
  return buffer
}

function fadeTo(value: number, from?: number) {
  if (!ctx || !master) return
  const now = ctx.currentTime
  master.gain.cancelScheduledValues(now)
  master.gain.setValueAtTime(from ?? master.gain.value, now)
  master.gain.linearRampToValueAtTime(value, now + FADE_SECONDS)
}

function stopSources() {
  loopSource?.stop()
  loopSource = null
  audioEl?.pause()
}

// Kept synchronous up to audio.play() so browsers treat it as part of the click.
function start(at: number) {
  const token = ++startToken
  const context = setup()
  void context.resume()
  stopSources()
  fadeTo(VOLUME, 0)

  const song = songs[state.index]
  if (song.loop) {
    return loadBuffer(context, song.src).then((buffer) => {
      if (token !== startToken || !state.playing) return
      loopSource = context.createBufferSource()
      loopSource.buffer = buffer
      loopSource.loop = true
      loopSource.loopEnd = Math.min(song.duration, buffer.duration)
      loopSource.connect(master!)
      loopSource.start(context.currentTime, at)
      loopStartedAt = context.currentTime - at
    })
  }

  const el = audioEl!
  if (el.dataset.song !== song.id) {
    el.src = song.src
    el.dataset.song = song.id
  }
  el.currentTime = at
  return el.play()
}

function begin(at: number) {
  setState({ playing: true })
  start(at)?.catch(() => setState({ playing: false }))
}

export function play() {
  if (!state.playing) begin(pausedAt)
}

export function pause() {
  if (!state.playing) return
  pausedAt = getPosition()
  startToken++
  setState({ playing: false })
  fadeTo(0)
  setTimeout(() => {
    if (!state.playing) stopSources()
  }, FADE_SECONDS * 1000)
}

export function toggle() {
  if (state.playing) pause()
  else play()
}

/** Switch song (wrapping around) and play it from the start. */
export function select(index: number) {
  const n = ((index % songs.length) + songs.length) % songs.length
  pausedAt = 0
  setState({ index: n })
  begin(0)
}

export const next = () => select(state.index + 1)
export const prev = () => select(state.index - 1)

/** Jump to a fraction (0..1) of the current song. */
export function seek(fraction: number) {
  const song = songs[state.index]
  const at = Math.min(Math.max(fraction, 0), 0.999) * song.duration
  if (!state.playing) {
    pausedAt = at
    listeners.forEach((l) => l())
  } else if (song.loop) {
    begin(at)
  } else if (audioEl) {
    audioEl.currentTime = at
  }
}

/** Current position in seconds. Cheap enough to call every frame. */
export function getPosition(): number {
  const song = songs[state.index]
  if (!state.playing || !ctx) return pausedAt
  if (song.loop) return loopSource ? (ctx.currentTime - loopStartedAt) % song.duration : pausedAt
  return audioEl?.currentTime ?? 0
}

/** Current loudness (RMS) of the output, roughly 0..1. Cheap enough to call every frame. */
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

export function usePlayer() {
  const { index, playing } = useSyncExternalStore(subscribe, () => state, () => state)
  return { song: songs[index], index, isPlaying: playing }
}
