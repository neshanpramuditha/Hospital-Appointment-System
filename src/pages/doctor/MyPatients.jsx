import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye, Mail, Phone, Search, UserRound, X } from "lucide-react";

import { isSupabaseConfigured, supabase } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";
import { getDoctorByUserId } from "../../services/doctorService";

function MyPatients() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    setLoading(true);

    if (!isSupabaseConfigured || !user?.id) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    const { data: doctor, error: doctorError } = await getDoctorByUserId(
      user.id
    );

    if (doctorError) {
      alert(doctorError.message);
      setLoading(false);
      return;
    }

    if (!doctor) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id,
        appointment_date,
        appointment_time,
        status,
        patients (
          id,
          full_name,
          email,
          phone,
          date_of_birth
        )
      `)
      .eq("doctor_id", doctor.id)
      .order("appointment_date", { ascending: false });

    if (error) alert(error.message);
    else setAppointments(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, [user?.id]);

  const uniquePatients = useMemo(() => {
    const map = new Map();

    appointments.forEach((appointment) => {
      const patient = appointment.patients;
      if (!patient) return;

      if (!map.has(patient.id)) {
        map.set(patient.id, {
          ...patient,
          latestAppointmentDate: appointment.appointment_date,
          latestAppointmentTime: appointment.appointment_time,
          latestStatus: appointment.status,
          appointmentId: appointment.id,
          totalAppointments: 1,
        });
      } else {
        const existing = map.get(patient.id);
        existing.totalAppointments += 1;

        const existingDate = `${existing.latestAppointmentDate || ""} ${
          existing.latestAppointmentTime || ""
        }`;

        const newDate = `${appointment.appointment_date || ""} ${
          appointment.appointment_time || ""
        }`;

        if (newDate > existingDate) {
          existing.latestAppointmentDate = appointment.appointment_date;
          existing.latestAppointmentTime = appointment.appointment_time;
          existing.latestStatus = appointment.status;
          existing.appointmentId = appointment.id;
        }
      }
    });

    return Array.from(map.values());
  }, [appointments]);

  const filteredPatients = useMemo(() => {
    let result = [...uniquePatients];
    const keyword = search.trim().toLowerCase();

    if (keyword) {
      result = result.filter((patient) => {
        return (
          patient.full_name?.toLowerCase().includes(keyword) ||
          patient.email?.toLowerCase().includes(keyword) ||
          patient.phone?.includes(search.trim()) ||
          patient.latestStatus?.toLowerCase().includes(keyword) ||
          patient.id?.toLowerCase().includes(keyword)
        );
      });
    }

    result.sort((a, b) => {
      if (sortBy === "name") {
        return (a.full_name || "").localeCompare(b.full_name || "");
      }

      if (sortBy === "most") {
        return b.totalAppointments - a.totalAppointments;
      }

      const dateA = `${a.latestAppointmentDate || ""} ${a.latestAppointmentTime || ""}`;
      const dateB = `${b.latestAppointmentDate || ""} ${b.latestAppointmentTime || ""}`;

      return dateB.localeCompare(dateA);
    });

    return result;
  }, [uniquePatients, search, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setSortBy("latest");
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <p className="mb-1 text-sm font-medium text-white/80">
          Doctor Portal
        </p>
        <h1 className="text-2xl font-bold md:text-3xl">My Patients</h1>
        <p className="mt-1 max-w-lg text-sm text-white/80">
          View patients who booked appointments with you.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Patients" value={uniquePatients.length} color="text-primary" />
        <StatCard title="Total Appointments" value={appointments.length} color="text-accent" />
        <StatCard title="Current Results" value={filteredPatients.length} color="text-secondary" />
      </div>

      <div className="mb-5 rounded-2xl bg-white p-4 shadow-lg md:p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search patient, email, phone, status, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-11 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          >
            <option value="latest">Latest Appointment</option>
            <option value="name">Name A-Z</option>
            <option value="most">Most Appointments</option>
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            <X size={17} />
            Clear
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="text-gray-500">Loading patients...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="text-gray-500">No patients found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-md">
                  <UserRound size={26} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-primary">
                    {patient.full_name || "Unknown Patient"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    ID: {patient.id.slice(0, 8)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-primary" />
                  {patient.email || "N/A"}
                </p>

                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-primary" />
                  {patient.phone || "N/A"}
                </p>

                <p className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  Latest: {patient.latestAppointmentDate || "N/A"}{" "}
                  {patient.latestAppointmentTime || ""}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-secondary">
                  {patient.totalAppointments} Appointment
                  {patient.totalAppointments === 1 ? "" : "s"}
                </span>

                <Link
                  to={`/doctor/appointments/${patient.appointmentId}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
                >
                  <Eye size={16} />
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-md">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`mt-1 text-3xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}

export default MyPatients;
