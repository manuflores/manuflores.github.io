import { useEffect, useRef } from 'react'
import { getLevel, useLoopPlayer } from '@/hooks/useLoopPlayer'

export default function LoopOrb() {
  const { isPlaying, toggle } = useLoopPlayer()
  const coreRef = useRef<HTMLSpanElement>(null)
  const haloRef = useRef<HTMLSpanElement>(null)

  // Drive the orb from the audio level outside React's render cycle.
  useEffect(() => {
    if (!isPlaying) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let level = 0
    let frame = requestAnimationFrame(function tick() {
      level += (getLevel() - level) * 0.2
      if (coreRef.current) coreRef.current.style.transform = `scale(${1 + level * 0.35})`
      if (haloRef.current) {
        haloRef.current.style.transform = `scale(${1 + level * 1.2})`
        haloRef.current.style.opacity = String(level * 0.5)
      }
      frame = requestAnimationFrame(tick)
    })

    return () => {
      cancelAnimationFrame(frame)
      if (coreRef.current) coreRef.current.style.transform = ''
      if (haloRef.current) {
        haloRef.current.style.transform = ''
        haloRef.current.style.opacity = ''
      }
    }
  }, [isPlaying])

  return (
    <div className="group fixed bottom-5 right-5 z-40 flex items-center gap-3">
      <span className="pointer-events-none translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 text-sm text-secondary-light dark:text-secondary-dark">
        {isPlaying ? 'loop1 · playing' : 'play a tune'}
      </span>
      <button
        onClick={toggle}
        className="relative flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark"
        aria-label={isPlaying ? 'Pause tune' : 'Play a tune'}
        aria-pressed={isPlaying}
      >
        <span
          ref={haloRef}
          className="absolute inset-2 rounded-full bg-accent-light dark:bg-accent-dark opacity-0"
        />
        <span
          ref={coreRef}
          className={`absolute inset-2 rounded-full shadow-md transition-colors duration-500 ${
            isPlaying
              ? 'bg-accent-light dark:bg-accent-dark'
              : 'orb-idle bg-secondary-light dark:bg-secondary-dark group-hover:bg-accent-light dark:group-hover:bg-accent-dark'
          }`}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="relative h-3.5 w-3.5 fill-surface-light dark:fill-surface-dark"
          viewBox="0 0 24 24"
        >
          {isPlaying ? (
            <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
          ) : (
            <path d="M8 5v14l11-7z" />
          )}
        </svg>
      </button>
    </div>
  )
}
