# Light-Creamy Theme: Light Mode Redesign

**Date:** 2026-04-11
**Status:** Approved

## Goal

Apply the `light-creamy` iTerm2 profile color palette to the website's light mode, replacing the current near-white + royal-blue scheme with a warm creamy background and dusty steel-blue accents.

## Source

All new hex values are derived directly from the `light-creamy` iTerm2 profile (stored in `~/Library/Preferences/com.googlecode.iterm2.plist`):

| Token | Current | New | iTerm Source |
|---|---|---|---|
| `surface.light` | `#FAF9F7` | `#ece9df` | Background Color (Light) |
| `surface.card-light` | `#FFFFFF` | `#f5f2e8` | derived — warmed off-white |
| `primary.light` | `#2A2F3D` | `#353b46` | Foreground Color (Light) |
| `secondary.light` | `#6B7485` | `#798798` | Ansi 8 (muted blue-gray) |
| `accent.light` | `#4169E1` | `#4a7fa5` | Link Color (Light) |
| `border.light` | `#C8CDD8` | `#d3e4ed` | Selection Color (Light) |

`surface.card-light` has no direct iTerm equivalent; `#f5f2e8` is a warm off-white that sits between the background (`#ece9df`) and pure white, maintaining card/surface contrast at the same ratio as before.

## Scope

- **In scope:** `tailwind.config.ts` — the 6 values above.
- **Out of scope:** Dark mode tokens, component files, `index.css`, font or spacing changes.

## Architecture

The website uses Tailwind's `darkMode: 'class'` strategy. All light-mode colors are defined as named tokens in `tailwind.config.ts` under `theme.extend.colors`. Components reference these tokens by name (e.g. `bg-surface-light`, `text-accent-light`). Since token names are unchanged, no component edits are needed — Tailwind rebuilds all utilities with the new hex values.

References in `index.css` that use `theme('colors.accent.light')` (animated-link underline, prose links) will update automatically. The `bg-stone-100` used for inline code backgrounds is a Tailwind default neutral and remains visually acceptable against the warmer page background.

## Implementation

**One change, one file:**

```ts
// tailwind.config.ts — colors.extend section
surface: {
  light: '#ece9df',          // was #FAF9F7
  'card-light': '#f5f2e8',   // was #FFFFFF
  ...
},
primary: {
  light: '#353b46',          // was #2A2F3D
  ...
},
secondary: {
  light: '#798798',          // was #6B7485
  ...
},
accent: {
  light: '#4a7fa5',          // was #4169E1
  ...
},
border: {
  light: '#d3e4ed',          // was #C8CDD8
  ...
},
```

## Verification

After the change, run `npm run build` (or `npm run dev`) and visually confirm:
- Page background is warm cream (`#ece9df`)
- Cards/sections show the slightly lighter `#f5f2e8`
- Body text is the darker blue-gray (`#353b46`)
- Links and accents render in steel blue (`#4a7fa5`)
- Borders and dividers use the pale blue (`#d3e4ed`)
- Dark mode is unaffected when toggled
