import { Bell, LogOut, UserCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { profile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-primary">
          Hospital Appointment System
        </h2>
        <p className="text-sm text-gray-500">Dashboard Overview</p>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative rounded-xl bg-gray-100 p-3 transition hover:bg-gray-200">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3">
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
          className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;