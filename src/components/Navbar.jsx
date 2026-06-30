import { Bell, LogOut, Menu, UserCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar({ onMenuClick }) {
  const { profile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={onMenuClick}
          className="rounded-xl bg-gray-100 p-3 text-primary transition hover:bg-gray-200 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-base font-bold text-primary sm:text-xl">
          Hospital Appointment System
          </h2>
          <p className="truncate text-xs text-gray-500 sm:text-sm">
            Dashboard Overview
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-5">
        <button className="relative rounded-xl bg-gray-100 p-3 transition hover:bg-gray-200">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="hidden items-center gap-3 sm:flex">
          <UserCircle2 size={42} className="text-primary" />

          <div className="text-right">
            <p className="font-semibold text-gray-800">
              {profile?.full_name || "User"}
            </p>

            <p className="text-sm capitalize text-gray-500">
              {profile?.role || "loading..."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600 sm:px-4"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
