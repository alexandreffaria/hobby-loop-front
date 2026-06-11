import { Link, useNavigate } from 'react-router-dom'
import { removeToken } from '../lib/token'
import { queryClient } from '../lib/queryClient'

export function TopBar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    removeToken()
    queryClient.clear()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-brand-bg/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/subscriptions"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="from-brand-pink to-brand-blue h-6 w-6 rounded-full bg-linear-to-tr shadow" />
          <span className="text-xs font-bold tracking-widest text-white/70 uppercase">HobbyLoop</span>
        </Link>
        <button
          onClick={handleLogout}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          Sair
        </button>
      </div>
    </header>
  )
}
