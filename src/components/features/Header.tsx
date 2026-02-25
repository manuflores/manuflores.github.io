import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Work' },
  { to: '/music', label: 'Sound' },
  { to: '/verses', label: 'Versos' },
]

export default function Header() {
  const { isDark, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && menuOpen) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <>
      <header className="py-6 relative z-40">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <NavLink
            to="/"
            className="text-xl font-bold text-primary-light dark:text-primary-dark hover:text-accent-light dark:hover:text-accent-dark transition-colors"
          >
            Manu Flores
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `text-base transition-colors ${
                    isActive
                      ? 'text-accent-light dark:text-accent-dark font-semibold'
                      : 'text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <ThemeButton isDark={isDark} onClick={toggle} />
          </nav>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeButton isDark={isDark} onClick={toggle} />
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-xl"
          onClick={() => setMenuOpen(false)}
        />
        <div className="relative flex flex-col h-full">
          {/* Overlay header */}
          <div className="flex items-center justify-between px-6 py-6">
            <span className="text-xl font-bold text-primary-light dark:text-primary-dark">
              Menu
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col px-6 gap-6 mt-8">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-2xl transition-colors ${
                    isActive
                      ? 'text-accent-light dark:text-accent-dark font-semibold'
                      : 'text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
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
