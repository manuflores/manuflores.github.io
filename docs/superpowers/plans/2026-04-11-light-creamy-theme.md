# Light-Creamy Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the website's light-mode color tokens with values from the iTerm2 `light-creamy` profile — warm cream background, dusty steel-blue accents.

**Architecture:** Six hex values in `tailwind.config.ts` are updated in-place. Token names are unchanged so all components inherit new colors automatically at Tailwind build time. Dark mode is untouched.

**Tech Stack:** Tailwind CSS (class-based dark mode), Vite, TypeScript

---

### Task 1: Update light-mode color tokens in tailwind.config.ts

**Files:**
- Modify: `tailwind.config.ts:13-34`

There are no unit tests for color values in this project — verification is visual via the dev server. The "test" step below is a TypeScript type-check to confirm the config file is still valid before spinning up the dev server.

- [ ] **Step 1: Apply the token changes**

Open `tailwind.config.ts` and replace the `colors` block (lines 12–35) with:

```ts
colors: {
  surface: {
    light: '#ece9df',
    dark: '#121212',
    'card-light': '#f5f2e8',
    'card-dark': '#1a1a1a',
  },
  primary: {
    light: '#353b46',
    dark: colors.neutral[100],
  },
  secondary: {
    light: '#798798',
    dark: colors.neutral[400],
  },
  accent: {
    light: '#4a7fa5',
    dark: colors.emerald[400],
  },
  border: {
    light: '#d3e4ed',
    dark: colors.neutral[700],
  },
},
```

- [ ] **Step 2: Type-check the config**

```bash
cd /Users/mnu/projects/website/new-website
npx tsc --noEmit
```

Expected: no output (exit 0). If errors appear, fix them before continuing.

- [ ] **Step 3: Start the dev server and visually verify**

```bash
npm run dev
```

Open `http://localhost:5173` (or whatever port Vite assigns) and confirm:

| Element | Expected |
|---|---|
| Page background | warm cream `#ece9df` |
| Card / section backgrounds | slightly lighter `#f5f2e8` |
| Body text | dark blue-gray `#353b46` |
| Muted / secondary text | muted blue-gray `#798798` |
| Links and accent elements | steel blue `#4a7fa5` |
| Borders and dividers | pale blue `#d3e4ed` |
| Dark mode (toggle it) | unchanged — same as before |

- [ ] **Step 4: Commit**

```bash
cd /Users/mnu/projects/website/new-website
git add tailwind.config.ts
git commit -m "feat: apply light-creamy iTerm palette to light mode"
```
