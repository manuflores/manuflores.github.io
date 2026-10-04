import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'
import Shell from '@/components/features/Shell'
import { sectionForPath } from '@/lib/shell'

export default function Header() {
  const { isDark, toggle } = useTheme()
  const [shellOpen, setShellOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const cwd = sectionForPath(location.pathname)

  useEffect(() => {
    setShellOpen(false)
  }, [location.pathname])

  // Backtick toggles the shell (unless typing elsewhere); Escape closes it.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setShellOpen(false)
      const target = e.target as HTMLElement
      const typing = target.closest('input, textarea, [contenteditable="true"]')
      if (e.key === '`' && (!typing || target.getAttribute('aria-label') === 'Shell command')) {
        e.preventDefault()
        setShellOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function closeShell() {
    setShellOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <>
      <header className="py-6 relative z-30">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between gap-4">
          <NavLink
            to="/"
            className="text-xl font-bold text-accent-light dark:text-accent-dark active:text-secondary-light dark:active:text-secondary-dark transition-colors"
          >
            manu flores
          </NavLink>

          <div className="flex items-center gap-4">
            <button
              ref={triggerRef}
              onClick={() => setShellOpen((o) => !o)}
              className="group flex items-center gap-1.5 font-mono text-sm text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors"
              aria-label={`Open site shell (current section: ${cwd.name}). Shortcut: backtick`}
              aria-expanded={shellOpen}
              aria-haspopup="dialog"
            >
              <span className="text-accent-light dark:text-accent-dark font-semibold">
                ~/{cwd.name === 'home' ? '' : cwd.name}
              </span>
              <span>$</span>
              <span className="shell-caret" aria-hidden />
            </button>
            <ThemeButton isDark={isDark} onClick={toggle} />
          </div>
        </div>
      </header>

      <Shell open={shellOpen} cwd={cwd} onClose={closeShell} onToggleTheme={toggle} />
    </>
  )
}

function ThemeButton({ isDark, onClick }: { isDark: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors p-1"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      )}
    </button>
  )
}
