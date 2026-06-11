import { Outlet } from 'react-router-dom'

// Layout for subscriber-facing public pages: same dark theme as the app,
// but no TopBar — visitors have no account, so no logout or app navigation.
export function PublicLayout() {
  return (
    <div className="bg-brand-bg animate-page-enter min-h-screen font-sans text-white">
      <header className="flex items-center justify-center gap-2 border-b border-white/5 py-3">
        <div className="from-brand-pink to-brand-blue h-5 w-5 rounded-full bg-linear-to-tr shadow" />
        <span className="text-[11px] font-bold tracking-widest text-white/70 uppercase">
          HobbyLoop
        </span>
      </header>
      <Outlet />
    </div>
  )
}
