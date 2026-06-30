import { NavLink } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  LayoutDashboard,
  Search,
  Stethoscope,
  X,
  UserRound,
  Users,
} from "lucide-react";

import { ROLES } from "../utils/roles";
import { useAuth } from "../context/AuthContext";

function Sidebar({ isOpen = false, onClose }) {
  const { role, profile } = useAuth();

  const currentRole = role || ROLES.PATIENT;

  const links = {
    [ROLES.ADMIN]: [
      { name: "Dashboard", path: "/dashboard/admin", icon: LayoutDashboard },
      { name: "Doctors", path: "/doctors", icon: Stethoscope },
      { name: "Patients", path: "/patients", icon: Users },
      { name: "Schedules", path: "/schedules", icon: Clock },
      { name: "Appointments", path: "/appointments", icon: CalendarCheck },
    ],

    [ROLES.DOCTOR]: [
      { name: "Dashboard", path: "/dashboard/doctor", icon: LayoutDashboard },
      { name: "Appointments", path: "/doctor/appointments", icon: CalendarCheck },
      { name: "My Schedule", path: "/doctor/schedules", icon: Clock },
      { name: "My Patients", path: "/doctor/patients", icon: Users },
      { name: "Profile", path: "/doctor/profile", icon: UserRound },
    ],

    [ROLES.PATIENT]: [
      { name: "Dashboard", path: "/dashboard/user", icon: LayoutDashboard },
      { name: "Find Doctors", path: "/patient/doctors", icon: Search },
      { name: "My Appointments", path: "/patient/appointments", icon: CalendarCheck },
      { name: "Profile", path: "/patient/profile", icon: UserRound },
    ],
  };

  const activeLinks = links[currentRole] || links[ROLES.PATIENT];

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen w-64 bg-gradient-to-b from-primary via-secondary to-accent text-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-start justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold">HMS</h1>

          <p className="text-sm capitalize text-white/80">
            {currentRole} Panel
          </p>

          <p className="mt-1 truncate text-xs text-white/70">
            {profile?.full_name || "User"}
          </p>
        </div>

        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="rounded-lg p-2 text-white transition hover:bg-white/20 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="space-y-2 px-4">
        {activeLinks.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path.includes("dashboard")}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-primary shadow-md"
                    : "text-white hover:bg-white/20"
                }`
              }
            >
              <Icon size={18} />
              {link.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
