import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye, Mail, Phone, Search, UserRound, X } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../services/supabase";

function MyPatients() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    setLoading(true);

    if (!isSupabaseConfigured) {
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
        ),
        doctors (
          id,
          full_name,
          specializations (
            id,
            name
          )
        )
      `)
      .order("appointment_date", { ascending: false });

    if (error) alert(error.message);
    else setAppointments(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

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
      }
    });

    return Array.from(map.values());
  }, [appointments]);

  const filteredPatients = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return uniquePatients;

    return uniquePatients.filter((patient) => {
      return (
        patient.full_name?.toLowerCase().includes(keyword) ||
        patient.email?.toLowerCase().includes(keyword) ||
        patient.phone?.includes(search.trim()) ||
        patient.id?.toLowerCase().includes(keyword)
      );
    });
  }, [uniquePatients, search]);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <p className="mb-1 text-sm font-medium text-white/80">
          Doctor Portal
        </p>
        <h1 className="text-2xl font-bold md:text-3xl">My Patients</h1>
        <p className="mt-1 max-w-lg text-sm text-white/80">
          View patients who have booked appointments with you.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <p className="text-sm text-gray-500">Total Patients</p>
          <h2 className="mt-1 text-3xl font-bold text-primary">
            {uniquePatients.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-md">
          <p className="text-sm text-gray-500">Current Results</p>
          <h2 className="mt-1 text-3xl font-bold text-accent">
            {filteredPatients.length}
          </h2>
        </div>
      </div>

      <div className="mb-5 rounded-2xl bg-white p-4 shadow-lg md:p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-3">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search patient name, email, phone, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-11 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <button
            type="button"
            onClick={() => setSearch("")}
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

              <div className="mt-5 flex items-center justify-between">
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

export default MyPatients;