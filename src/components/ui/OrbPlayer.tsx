import { useEffect, useRef, useState } from 'react'
import { getLevel, getPosition, next, prev, seek, toggle, usePlayer } from '@/hooks/usePlayer'
import type { Song } from '@/data/songs'

const SEEK_STEP_SECONDS = 5

function formatTime(seconds: number) {
  const s = Math.floor(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function OrbPlayer() {
  const { song, isPlaying } = usePlayer()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pinned, setPinned] = useState(false) // touch: stays open until a tap outside
  const [started, setStarted] = useState(false)
  const open = hovered || focused || pinned

  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const coreRef = useRef<HTMLSpanElement>(null)
  const haloRef = useRef<HTMLSpanElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)
  const draggingRef = useRef(false)

  useEffect(() => {
    if (isPlaying) setStarted(true)
  }, [isPlaying])

  useEffect(() => {
    if (!pinned) return
    function onDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setPinned(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [pinned])

  // Draw the ring and drive the pulse outside React's render cycle.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let level = 0
    let frame = 0

    function draw() {
      const canvas = canvasRef.current
      if (canvas) drawRing(canvas, song, getPosition() / song.duration, open, lineRef.current)
      if (timeRef.current && started) {
        timeRef.current.textContent = `${formatTime(getPosition())} / ${formatTime(song.duration)}`
      }
      if (isPlaying && !reduceMotion) {
        level += (getLevel() - level) * 0.2
        if (coreRef.current) coreRef.current.style.transform = `scale(${1 + level * 0.35})`
        if (haloRef.current) {
          haloRef.current.style.transform = `scale(${1 + level * 1.2})`
          haloRef.current.style.opacity = String(level * 0.5)
        }
      }
    }

    // Animate while something moves; otherwise draw once (plus the open/close resize).
    const animate = isPlaying || open
    frame = requestAnimationFrame(function tick() {
      draw()
      if (animate) frame = requestAnimationFrame(tick)
    })
    const settle = animate ? 0 : window.setTimeout(draw, 520)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(settle)
      if (coreRef.current) coreRef.current.style.transform = ''
      if (haloRef.current) {
        haloRef.current.style.transform = ''
        haloRef.current.style.opacity = ''
      }
    }
  }, [song, isPlaying, open, started])

  function seekFromPointer(e: React.PointerEvent<HTMLCanvasElement>) {
    const box = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - box.left - box.width / 2
    const y = e.clientY - box.top - box.height / 2
    let angle = Math.atan2(y, x) + Math.PI / 2
    if (angle < 0) angle += Math.PI * 2
    seek(angle / (Math.PI * 2))
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const step = e.key === 'ArrowRight' ? SEEK_STEP_SECONDS : -SEEK_STEP_SECONDS
    seek((getPosition() + step) / song.duration)
  }

  return (
    <div
      ref={rootRef}
      className="fixed bottom-4 right-4 z-40 flex flex-col items-end"
      style={{ '--song-light': song.color.light, '--song-dark': song.color.dark } as React.CSSProperties}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && !draggingRef.current && setHovered(false)}
      onPointerDown={(e) => e.pointerType !== 'mouse' && setPinned(true)}
      onFocus={(e) => e.target.matches(':focus-visible') && setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
      onKeyDown={onKeyDown}
    >
      <span ref={lineRef} className="hidden text-border-light dark:text-border-dark" aria-hidden />

      <div
        className={`mb-1 flex flex-col items-end text-right transition-all duration-300 ${
          open ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-1'
        }`}
      >
        <div className="flex items-center gap-1 text-sm font-semibold text-primary-light dark:text-primary-dark">
          <CaptionButton label="Previous song" onClick={prev}>‹</CaptionButton>
          <span className="orb-song-text px-1" aria-live="polite">{song.title}</span>
          <CaptionButton label="Next song" onClick={next}>›</CaptionButton>
        </div>
        <span ref={timeRef} className="font-mono text-xs text-secondary-light dark:text-secondary-dark">
          {started ? '' : 'play a tune'}
        </span>
      </div>

      <div
        className={`relative transition-[width,height] duration-500 ease-[cubic-bezier(.2,.9,.25,1.15)] motion-reduce:transition-none ${
          open ? 'h-[190px] w-[190px]' : 'h-16 w-16'
        }`}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-pointer touch-none"
          aria-hidden
          onPointerDown={(e) => {
            draggingRef.current = true
            e.currentTarget.setPointerCapture(e.pointerId)
            seekFromPointer(e)
          }}
          onPointerMove={(e) => draggingRef.current && seekFromPointer(e)}
          onPointerUp={() => (draggingRef.current = false)}
          onPointerCancel={() => (draggingRef.current = false)}
        />
        <button
          onClick={toggle}
          className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark"
          aria-label={isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
          aria-pressed={isPlaying}
          aria-keyshortcuts="ArrowLeft ArrowRight"
        >
          <span ref={haloRef} className="orb-song-bg absolute inset-2 rounded-full opacity-0" />
          <span
            ref={coreRef}
            className={`absolute inset-2 rounded-full shadow-md transition-colors duration-500 ${
              isPlaying ? 'orb-song-bg' : 'orb-idle bg-secondary-light dark:bg-secondary-dark'
            }`}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="relative h-3.5 w-3.5 fill-surface-light dark:fill-surface-dark"
            viewBox="0 0 24 24"
          >
            {isPlaying ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5v14l11-7z" />}
          </svg>
        </button>
      </div>
    </div>
  )
}

function CaptionButton({ label, onClick, children }: { label: string; onClick: () => void; children: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="px-1 text-lg leading-none text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors"
    >
      {children}
    </button>
  )
}

function drawRing(
  canvas: HTMLCanvasElement,
  song: Song,
  progress: number,
  open: boolean,
  lineEl: HTMLElement | null,
) {
  const size = canvas.clientWidth
  const dpr = window.devicePixelRatio || 1
  if (canvas.width !== Math.round(size * dpr)) {
    canvas.width = canvas.height = Math.round(size * dpr)
  }
  const g = canvas.getContext('2d')
  if (!g) return
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  g.clearRect(0, 0, size, size)

  const dark = document.documentElement.classList.contains('dark')
  const played = dark ? song.color.dark : song.color.light
  const unplayed = lineEl ? getComputedStyle(lineEl).color : '#999'
  const c = size / 2
  const inner = Math.max(21, size * 0.25)
  const amplitude = c - inner - 4
  const n = song.peaks.length

  g.lineCap = 'round'
  g.lineWidth = open ? 2.5 : 1.5
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    const length = 1.5 + song.peaks[i] * amplitude
    g.strokeStyle = i / n < progress ? played : unplayed
    g.beginPath()
    g.moveTo(c + Math.cos(angle) * inner, c + Math.sin(angle) * inner)
    g.lineTo(c + Math.cos(angle) * (inner + length), c + Math.sin(angle) * (inner + length))
    g.stroke()
  }

  if (progress > 0) {
    const angle = progress * Math.PI * 2 - Math.PI / 2
    g.fillStyle = played
    g.beginPath()
    g.arc(c + Math.cos(angle) * (inner - 5), c + Math.sin(angle) * (inner - 5), open ? 3.5 : 2, 0, Math.PI * 2)
    g.fill()
  }
}
