import { useEffect, useRef, useState } from 'react'
import type p5Type from 'p5'
import { cliffordStep, driftParams, CLIFFORD_BASE_PARAMS } from '@/lib/clifford'

const PARTICLES_PER_ATTRACTOR = 700
const LENS_K = 180
const LENS_SOFTENING = 80
const TRAIL_FADE_ALPHA_DARK = 2.5
const TRAIL_FADE_ALPHA_LIGHT = 5
const LINE_ALPHA_DARK = 0.032
const LINE_ALPHA_LIGHT = 0.024

interface Particle {
  x: number
  y: number
  px: number
  py: number
  hueBias: number
}

/** Gravitational lens: p_drawn = p + k * direction / (dist^2 + softening^2) */
function applyLens(
  x: number,
  y: number,
  cx: number,
  cy: number,
  strength: number,
): [number, number] {
  const dx = x - cx
  const dy = y - cy
  const distSq = dx * dx + dy * dy + LENS_SOFTENING * LENS_SOFTENING
  const scale = (strength * LENS_K) / distSq
  return [x + dx * scale, y + dy * scale]
}

/** Map Clifford space [-2,2] to canvas; offset (0,0) = centered */
function toScreen(
  x: number,
  y: number,
  w: number,
  h: number,
  offsetX: number,
  offsetY: number,
  scale: number,
): [number, number] {
  const sx = w * 0.5 + offsetX + (x / 2) * scale
  const sy = h * 0.5 + offsetY - (y / 2) * scale
  return [sx, sy]
}

/** Green/grey/black palette (dark) - returns r,g,b in 0-255 */
function colorDark(hueBias: number, t: number): [number, number, number] {
  const v = (Math.sin(t * 2) * 0.5 + 0.5) * 0.7 + hueBias * 0.3
  if (v > 0.7) return [16, 185, 129]
  if (v > 0.45) return [110, 231, 183]
  if (v > 0.25) return [75, 85, 99]
  return [31, 41, 55]
}

/** Mauve/grey palette (light) */
function colorLight(hueBias: number, t: number): [number, number, number] {
  const v = (Math.sin(t * 2) * 0.5 + 0.5) * 0.7 + hueBias * 0.3
  if (v > 0.7) return [71, 185, 129]
  if (v > 0.45) return [110, 44, 183]
  if (v > 0.25) return [75, 85, 99]
  return [31, 41, 55]
}
//   if (v > 0.7) return [167, 139, 250]
//   if (v > 0.45) return [156, 163, 175]
//   if (v > 0.25) return [209, 213, 219]
//   return [229, 231, 235]
// }

interface Props {
  variant?: 'full' | 'borders'
}

export default function GenerativeBackground({ variant = 'full' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: -10000, y: -10000, active: false })
  const lensStrengthRef = useRef(0)
  const lensVelRef = useRef(0)

  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  )

  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark')),
    )
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect()
      mouseRef.current.x = clientX - rect.left
      mouseRef.current.y = clientY - rect.top
      mouseRef.current.active = true
    }

    const handleMove = (e: MouseEvent) => {
      updateMouse(e.clientX, e.clientY)
    }

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateMouse(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleLeave = () => {
      mouseRef.current.active = false
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('touchmove', handleTouch, { passive: true })
    window.addEventListener('mouseleave', handleLeave)
    document.addEventListener('mouseleave', handleLeave)

    let cancelled = false
    let instance: p5Type | null = null

    import('p5').then((mod) => {
      if (cancelled) return
      const p5 = mod.default

      instance = new p5((p: p5Type) => {
        const offsetX = 0
        const offsetY = 0
        let scale = 0

        const particles: Particle[] = []
        for (let i = 0; i < PARTICLES_PER_ATTRACTOR; i++) {
          particles.push({
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            px: 0,
            py: 0,
            hueBias: 0,
          })
        }

        let bg: [number, number, number]
        let getColor: (hueBias: number, t: number) => [number, number, number]

        p.setup = () => {
          const dark = document.documentElement.classList.contains('dark')
          bg = dark ? [18, 18, 18] : [250, 249, 247]
          getColor = dark ? colorDark : colorLight

          const c = p.createCanvas(el.offsetWidth, el.offsetHeight)
          c.style('display', 'block')
          p.background(bg[0], bg[1], bg[2])
          p.frameRate(24)
        }

        let frameCount = 0
        p.draw = () => {
          const w = p.width
          const h = p.height
          const t = frameCount * 0.01
          const darkNow = document.documentElement.classList.contains('dark')
          const lineAlpha = darkNow ? LINE_ALPHA_DARK : LINE_ALPHA_LIGHT
          const trailFadeAlpha = darkNow
            ? TRAIL_FADE_ALPHA_DARK
            : TRAIL_FADE_ALPHA_LIGHT
          scale = Math.min(w, h) * (darkNow ? 0.24 : 0.19)

          const targetStrength = mouseRef.current.active ? 1 : 0
          lensVelRef.current =
            lensVelRef.current * 0.8 +
            (targetStrength - lensStrengthRef.current) * 0.2
          lensStrengthRef.current = Math.max(
            0,
            Math.min(1, lensStrengthRef.current + lensVelRef.current),
          )
          const lensStr = lensStrengthRef.current
          const cx = mouseRef.current.x
          const cy = mouseRef.current.y
          const cursorXNorm = ((cx / Math.max(1, w)) * 2 - 1) * lensStr
          const cursorYNorm = ((cy / Math.max(1, h)) * 2 - 1) * lensStr

          p.noStroke()
          p.fill(bg[0], bg[1], bg[2], trailFadeAlpha)
          p.rect(0, 0, w, h)

          const drifted = driftParams(CLIFFORD_BASE_PARAMS, frameCount)
          // Cursor modulates the attractor itself (not just post-warp),
          // so the figure "breathes" and re-forms as you move around.
          const params = {
            a: drifted.a + cursorXNorm * 0.35,
            b: drifted.b + cursorYNorm * 0.35,
            c: drifted.c - cursorYNorm * 0.25,
            d: drifted.d + cursorXNorm * 0.25,
          }

          for (const pt of particles) {
            pt.px = pt.x
            pt.py = pt.y
            const [nx, ny] = cliffordStep(pt.x, pt.y, params)
            pt.x = nx
            pt.y = ny

            const [sx, sy] = toScreen(pt.x, pt.y, w, h, offsetX, offsetY, scale)
            const [spx, spy] = toScreen(pt.px, pt.py, w, h, offsetX, offsetY, scale)

            let drawX = sx
            let drawY = sy
            let drawPx = spx
            let drawPy = spy
            if (lensStr > 0.001) {
              const [dx, dy] = applyLens(sx, sy, cx, cy, lensStr)
              const [dpx, dpy] = applyLens(spx, spy, cx, cy, lensStr)
              drawX = dx
              drawY = dy
              drawPx = dpx
              drawPy = dpy
            }

            const [r, g, b] = getColor(pt.hueBias, pt.x + pt.y + t)
            p.strokeWeight(1)
            p.stroke(r, g, b, lineAlpha * 255)
            p.line(drawPx, drawPy, drawX, drawY)
          }

          frameCount++
        }

        p.windowResized = () => {
          if (!el.offsetWidth) return
          p.resizeCanvas(el.offsetWidth, el.offsetHeight)
          if (bg) p.background(bg[0], bg[1], bg[2])
        }
      }, el)
    })

    return () => {
      cancelled = true
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleTouch)
      window.removeEventListener('mouseleave', handleLeave)
      document.removeEventListener('mouseleave', handleLeave)
      instance?.remove()
      instance = null
    }
  }, [isDark])

  const maskStyle =
    variant === 'borders'
      ? {
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, black 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, black 100%)',
        }
      : {
          maskImage:
            'linear-gradient(to bottom, black 0%, black 40vh, transparent 80vh)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, black 40vh, transparent 80vh)',
        }

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden opacity-32 dark:opacity-50 transition-opacity duration-700"
      style={maskStyle}
    />
  )
}
