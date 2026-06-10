import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    // min-h-screen and flex ensure everything is perfectly centered vertically and horizontally
    <div className="bg-brand-bg flex min-h-screen flex-col items-center justify-center p-6 py-10 font-sans text-white">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
