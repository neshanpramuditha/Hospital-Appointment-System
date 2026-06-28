import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Eye,
  Search,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";

import { isSupabaseConfigured, supabase } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";

function MyAppointments() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);

    if (!isSupabaseConfigured || !user?.id) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (patientError) {
      alert(patientError.message);
      setLoading(false);
      return;
    }

    if (!patient) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id,
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        status,
        created_at,
        patients (
          id,
          full_name,
          email,
          phone
        ),
        doctors (
          id,
          full_name,
          email,
          phone,
          specializations (
            id,
            name
          )
        )
      `)
      .eq("patient_id", patient.id)
      .order("appointment_date", { ascending: true });

    if (error) {
      alert(error.message);
    } else {
      setAppointments(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [user?.id]);

  const filteredAppointments = useMemo(() => {
    let result = [...appointments];
    const keyword = search.trim().toLowerCase();

    if (keyword) {
      result = result.filter((appointment) => {
        const doctorName = appointment.doctors?.full_name || "";
        const specialization =
          appointment.doctors?.specializations?.name || "";

        return (
          doctorName.toLowerCase().includes(keyword) ||
          specialization.toLowerCase().includes(keyword) ||
          appointment.status?.toLowerCase().includes(keyword) ||
          appointment.appointment_date?.includes(search.trim()) ||
          appointment.appointment_time?.includes(search.trim()) ||
          appointment.id?.toLowerCase().includes(keyword)
        );
      });
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (appointment) => appointment.status === statusFilter
      );
    }

    return result;
  }, [appointments, search, statusFilter]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const getStatusClass = (status) => {
    if (status === "confirmed") return "bg-accent/10 text-secondary";
    if (status === "cancelled") return "bg-red-50 text-red-600";
    if (status === "completed") return "bg-blue-50 text-blue-600";
    return "bg-amber-50 text-amber-700";
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-white/80">
              Patient Portal
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">
              My Appointments
            </h1>
            <p className="mt-1 max-w-lg text-sm text-white/80">
              View your booked appointments.
            </p>
          </div>

          <Link
            to="/patient/doctors"
            className="inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 font-semibold text-primary shadow-md transition hover:scale-105 md:w-auto"
          >
            Book New Appointment
          </Link>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <p className="text-sm text-gray-500">Total Appointments</p>
          <h2 className="mt-1 text-3xl font-bold text-primary">
            {appointments.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-md">
          <p className="text-sm text-gray-500">Current Results</p>
          <h2 className="mt-1 text-3xl font-bold text-accent">
            {filteredAppointments.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-md">
          <p className="text-sm text-gray-500">Pending</p>
          <h2 className="mt-1 text-3xl font-bold text-amber-600">
            {appointments.filter((a) => a.status === "pending").length}
          </h2>
        </div>
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
              placeholder="Search doctor, specialization, status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-11 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
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
          <p className="text-gray-500">Loading appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="text-gray-500">No appointments found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-md">
                    <UserRound size={26} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-primary">
                      Dr. {appointment.doctors?.full_name || "N/A"}
                    </h3>

                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-secondary">
                      <Stethoscope size={14} />
                      {appointment.doctors?.specializations?.name ||
                        "General Doctor"}
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      Appointment ID: {appointment.id.slice(0, 8)}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                    appointment.status
                  )}`}
                >
                  {appointment.status || "pending"}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                  <Calendar size={17} className="text-primary" />
                  {appointment.appointment_date || "N/A"}
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                  <Clock size={17} className="text-primary" />
                  {appointment.appointment_time || "N/A"}
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <Link
                  to={`/patient/appointments/${appointment.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
                >
                  <Eye size={17} />
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyAppointments;