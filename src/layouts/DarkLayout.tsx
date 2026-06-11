import { Outlet } from 'react-router-dom'
import { TopBar } from '../components/TopBar'

export function DarkLayout() {
  return (
    <div className="bg-brand-bg animate-page-enter min-h-screen font-sans text-white">
      <TopBar />
      <Outlet />
    </div>
  )
}
