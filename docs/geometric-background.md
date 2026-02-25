# Editing the geometric background

This manual explains how to change the Clifford attractor background: shape, animation, cursor lens, colors, where it appears, and related constants.

## Overview

The background is a **Clifford strange attractor**: particles follow the discrete map

- `x' = sin(a·y) + c·cos(a·x)`
- `y' = sin(b·x) + d·cos(b·y)`

and are drawn as short line segments. The cursor applies a **gravitational lens** (positions are warped radially around the pointer). Theme-aware palettes color the lines (green/grey in dark mode, mauve/grey in light).

**Where the code lives:**

- **`src/lib/clifford.ts`** — Base parameters (a, b, c, d), the step function, and parameter drift over time.
- **`src/components/ui/GenerativeBackground.tsx`** — Canvas setup, particle loop, lens, colors, and mask (full-page vs borders).

---

## Changing the shape

Edit **`CLIFFORD_BASE_PARAMS`** in **`src/lib/clifford.ts`**:

```ts
export const CLIFFORD_BASE_PARAMS: CliffordParams = {
  a: -1.7,
  b: 1.8,
  c: -1.9,
  d: -0.4,
}
```

- Small changes (e.g. ±0.2 to one value) produce different figures: more wing-like, spiral, or tendril.
- There are no strict “safe” ranges; the map is chaotic. Try small steps and refresh to see the result.
- The same formulas above define the map; changing (a, b, c, d) changes the attractor’s shape in the plane.

---

## Parameter drift (animation)

The shape slowly morphs because the four parameters drift over time. That’s done in **`src/lib/clifford.ts`** in **`driftParams(base, t, amount)`**.

- **`base`** — The current base params (e.g. `CLIFFORD_BASE_PARAMS`).
- **`t`** — Time (e.g. frame count). Different coefficients for a, b, c, d give incommensurate motion so the animation doesn’t repeat quickly.
- **`amount`** — How far each parameter is allowed to drift (default 0.25). Larger = more visible morphing; 0 = no drift (static shape).

To slow the animation, decrease the time coefficients inside `driftParams` (e.g. change `0.0002` to `0.0001`). To disable drift, pass `amount: 0` when calling `driftParams`, or use the base params directly in the draw loop instead of `driftParams(...)`.

---

## Lens (cursor effect)

The gravitational lens is implemented in **`src/components/ui/GenerativeBackground.tsx`** in **`applyLens`** and two constants at the top:

- **`LENS_K`** (e.g. 180) — Strength of the warp. Higher = stronger bend around the cursor.
- **`LENS_SOFTENING`** (e.g. 80) — Added to distance squared so the effect doesn’t blow up when the cursor is exactly on a point. Larger = softer, less extreme warp near the cursor.

Lens strength is blended in/out with a damped spring when the mouse enters/leaves the window; that logic is in the `draw` loop (target strength 0 or 1, then `lensStrengthRef`).

---

## Colors

Palettes are in **`src/components/ui/GenerativeBackground.tsx`**:

- **`colorDark(hueBias, t)`** — Returns RGB for dark theme (green/grey/black).
- **`colorLight(hueBias, t)`** — Returns RGB for light theme (mauve/grey).

Each line is colored by a value derived from `hueBias` and `t` (e.g. `pt.x + pt.y + time`). The functions map that into 3–4 color bands. To change the look:

- Edit the RGB arrays in the relevant function.
- Adjust the thresholds (e.g. `v > 0.7`, `v > 0.45`) to change how much of each color appears.

---

## Where the background appears

**Layout** (which routes show the background) is in **`src/components/layout/Layout.tsx`**:

- **`BACKGROUND_ROUTES`** — Array of paths that show the background, e.g. `['/', '/about', '/verses']`.
- To add a page: add its path to `BACKGROUND_ROUTES`.
- To remove: delete the path. Work and Sound are not in the list, so they have a plain background.

**Variant (full vs borders):**

- **`variant="full"`** — Default. The usual vertical fade mask (opaque at top, fading to transparent lower down).
- **`variant="borders"`** — Used on Verses. A radial mask makes the center transparent and the edges opaque, so only a “frame” of the attractor is visible and the center is clear for text.

Variant is chosen in Layout: `variant={location.pathname === '/verses' ? 'borders' : 'full'}`. To change the border width on Verses, edit the radial gradient in `GenerativeBackground.tsx` (e.g. `70% 70%` → `80% 80%` makes the clear center larger and the visible border narrower).

---

## Particle count and trail fade

In **`src/components/ui/GenerativeBackground.tsx`** at the top:

- **`PARTICLES_PER_ATTRACTOR`** (e.g. 800) — Number of particles. More = denser trails; fewer = lighter and faster.
- **`TRAIL_FADE_ALPHA`** (e.g. 2.5) — Alpha of the background rect drawn each frame to fade old trails. Higher = trails disappear faster.
- **`LINE_ALPHA`** (e.g. 0.032) — Alpha of each line segment. Higher = more visible, denser-looking figure; lower = more subtle.

The canvas size and scale (e.g. `scale = Math.min(w, h) * 0.24`) control how big the figure is on screen; increase the multiplier for a larger shape.
