import { Outlet } from 'react-router-dom'

export function DarkLayout() {
  return (
    <div className="bg-brand-bg animate-page-enter min-h-screen font-sans text-white">
      <Outlet />
    </div>
  )
}
