import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/features/Header'
import GenerativeBackground from '@/components/ui/GenerativeBackground'

const BACKGROUND_ROUTES = ['/', '/verses'] as const

export default function Layout() {
  const location = useLocation()
  const showBackground = BACKGROUND_ROUTES.includes(
    location.pathname as (typeof BACKGROUND_ROUTES)[number],
  )
  const variant = location.pathname === '/verses' ? 'borders' : 'full'

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark transition-colors">
      {showBackground && <GenerativeBackground variant={variant} />}
      <Header />
      <main key={location.pathname} className="relative max-w-3xl mx-auto px-6 pb-20 page-enter">
        <Outlet />
      </main>
    </div>
  )
}
