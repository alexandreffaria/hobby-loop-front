import { Outlet, Link } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
      {/* Top Navbar */}
      <nav className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <Link
          to="/"
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
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-indigo-700">
            Log in
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        {/* The Outlet is where our page components will magically render */}
        <Outlet />
      </main>
    </div>
  );
}
