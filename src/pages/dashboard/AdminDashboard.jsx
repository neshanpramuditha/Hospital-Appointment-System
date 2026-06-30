import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";

import { isSupabaseConfigured, supabase } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
  const { profile, role } = useAuth();

  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    schedules: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const [
      { count: doctors },
      { count: patients },
      { count: appointments },
      { count: schedules },
    ] = await Promise.all([
      supabase.from("doctors").select("*", { count: "exact", head: true }),
      supabase.from("patients").select("*", { count: "exact", head: true }),
      supabase.from("appointments").select("*", { count: "exact", head: true }),
      supabase.from("schedules").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      doctors: doctors || 0,
      patients: patients || 0,
      appointments: appointments || 0,
      schedules: schedules || 0,
    });

    setLoading(false);
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <p className="mb-1 text-sm font-medium text-white/80">
          Admin Dashboard
        </p>

        <h1 className="text-2xl font-bold md:text-3xl">
          Welcome, {profile?.full_name || "Admin"}
        </h1>

        <p className="mt-1 max-w-lg text-sm text-white/80">
          Role: {role || "admin"} • Manage doctors, patients, schedules, and
          appointments.
        </p>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Stethoscope />} title="Doctors" value={stats.doctors} />
        <StatCard icon={<Users />} title="Patients" value={stats.patients} />
        <StatCard
          icon={<CalendarCheck />}
          title="Appointments"
          value={stats.appointments}
        />
        <StatCard icon={<Clock />} title="Schedules" value={stats.schedules} />
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-lg md:p-6">
        <h2 className="mb-4 text-xl font-bold text-primary">
          Quick Admin Actions
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <ActionCard
            icon={<Stethoscope />}
            title="Manage Doctors"
            description="Add, edit, view, and remove doctor records."
            link="/doctors"
          />

          <ActionCard
            icon={<UserRound />}
            title="Manage Patients"
            description="Maintain patient records and contact information."
            link="/patients"
          />

          <ActionCard
            icon={<Clock />}
            title="Manage Schedules"
            description="Create and update doctor available time slots."
            link="/schedules"
          />

          <ActionCard
            icon={<CalendarCheck />}
            title="Manage Appointments"
            description="Create, update, and track patient appointments."
            link="/appointments"
          />
        </div>
      </div>

      {loading && (
        <p className="mt-4 text-center text-sm text-gray-500">
          Loading dashboard data...
        </p>
      )}
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-md">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
        {icon}
      </div>

      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="mt-1 text-3xl font-bold text-primary">{value}</h2>
    </div>
  );
}

function ActionCard({ icon, title, description, link }) {
  return (
    <Link
      to={link}
      className="rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-primary">{title}</h3>

      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </Link>
  );
}

export default AdminDashboard;