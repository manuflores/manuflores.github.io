import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'color-theme'

function getInitialDark(): boolean {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return stored === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useTheme() {
  const [isDark, setIsDark] = useState(getInitialDark)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', isDark)
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light')

    const hljsLight = document.getElementById('hljs-light') as HTMLLinkElement | null
    const hljsDark = document.getElementById('hljs-dark') as HTMLLinkElement | null
    if (hljsLight) hljsLight.disabled = isDark
    if (hljsDark) hljsDark.disabled = !isDark
  }, [isDark])

  const toggle = useCallback(() => setIsDark((d) => !d), [])

  return { isDark, toggle }
}
