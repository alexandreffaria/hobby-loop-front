import { Outlet, Link, useNavigate } from "react-router-dom";
import { removeToken } from "../lib/token";
import { queryClient } from "../lib/queryClient";

export function MainLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    removeToken()
    queryClient.clear()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
      {/* Top Navbar */}
      <nav className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <Link
          to="/dashboard"
          className="text-xl font-bold tracking-tight text-indigo-600 transition-colors hover:text-indigo-800"
        >
          HobbyLoop
        </Link>
        <div className="flex items-center space-x-6 font-medium">
          <Link
            to="/dashboard"
            className="text-gray-600 transition-colors hover:text-indigo-600"
          >
            Dashboard
          </Link>
          <Link
            to="/subscriptions"
            className="text-gray-600 transition-colors hover:text-indigo-600"
          >
            Assinaturas
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            Sair
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
