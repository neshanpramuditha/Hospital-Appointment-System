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
import { getPatientByUserId } from "../../services/patientService";
import toast from "react-hot-toast";

function MyAppointments() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [timeFilter, setTimeFilter] = useState("upcoming");
  const [sortBy, setSortBy] = useState("upcoming");
  const [loading, setLoading] = useState(true);

  const now = new Date();

  const fetchAppointments = async () => {
    setLoading(true);

    if (!isSupabaseConfigured || !user?.id) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    const { data: patient, error: patientError } =
      await getPatientByUserId(user.id);

    if (patientError) {
      alert(patientError.message);
      setLoading(false);
      return;
    }

    if (!patient) {
      setPatientId(null);
      setAppointments([]);
      setLoading(false);
      return;
    }

    setPatientId(patient.id);

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
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (error) alert(error.message);
    else setAppointments(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [user?.id]);

  const getAppointmentDateTime = (appointment) => {
    if (!appointment.appointment_date || !appointment.appointment_time) {
      return null;
    }

    return new Date(
      `${appointment.appointment_date}T${appointment.appointment_time}`
    );
  };

  const isExpired = (appointment) => {
    if (
      appointment.status === "completed" ||
      appointment.status === "cancelled"
    ) {
      return false;
    }

    const appointmentDateTime = getAppointmentDateTime(appointment);

    if (!appointmentDateTime) return false;

    return appointmentDateTime < now;
  };

  const displayStatus = (appointment) => {
    if (isExpired(appointment)) return "expired";
    return appointment.status || "pending";
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    if (!patientId) {
      toast.error("Patient profile not found.");
      return;
    }

    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", id)
      .eq("patient_id", patientId);

    if (error) {
      alert(error.message);
      return;
    }

    fetchAppointments();
  };

  const filteredAppointments = useMemo(() => {
    let result = [...appointments];
    const keyword = search.trim().toLowerCase();

    if (keyword) {
      result = result.filter((appointment) => {
        const doctorName = appointment.doctors?.full_name || "";
        const specialization =
          appointment.doctors?.specializations?.name || "";
        const status = displayStatus(appointment);

        return (
          doctorName.toLowerCase().includes(keyword) ||
          specialization.toLowerCase().includes(keyword) ||
          status.toLowerCase().includes(keyword) ||
          appointment.appointment_date?.includes(search.trim()) ||
          appointment.appointment_time?.includes(search.trim()) ||
          appointment.id?.toLowerCase().includes(keyword)
        );
      });
    }

    if (statusFilter === "active") {
      result = result.filter((appointment) =>
        ["pending", "confirmed"].includes(displayStatus(appointment))
      );
    } else if (statusFilter !== "all") {
      result = result.filter(
        (appointment) => displayStatus(appointment) === statusFilter
      );
    }

    if (timeFilter === "upcoming") {
      result = result.filter((appointment) => !isExpired(appointment));
    }

    if (timeFilter === "expired") {
      result = result.filter((appointment) => isExpired(appointment));
    }

    if (timeFilter === "past") {
      result = result.filter((appointment) => {
        const appointmentDateTime = getAppointmentDateTime(appointment);
        return appointmentDateTime && appointmentDateTime < now;
      });
    }

    result.sort((a, b) => {
      const dateA = getAppointmentDateTime(a);
      const dateB = getAppointmentDateTime(b);

      if (!dateA || !dateB) return 0;

      if (sortBy === "latest") return dateB - dateA;

      if (sortBy === "expired_first") {
        return Number(isExpired(b)) - Number(isExpired(a));
      }

      if (sortBy === "status") {
        return displayStatus(a).localeCompare(displayStatus(b));
      }

      return dateA - dateB;
    });

    return result;
  }, [appointments, search, statusFilter, timeFilter, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("active");
    setTimeFilter("upcoming");
    setSortBy("upcoming");
  };

  const getStatusClass = (status) => {
    if (status === "confirmed") return "bg-accent/10 text-secondary";
    if (status === "cancelled") return "bg-red-50 text-red-600";
    if (status === "completed") return "bg-blue-50 text-blue-600";
    if (status === "expired") return "bg-gray-200 text-gray-700";
    return "bg-amber-50 text-amber-700";
  };

  const countByStatus = (status) =>
    appointments.filter((item) => displayStatus(item) === status).length;

  const upcomingCount = appointments.filter((item) => !isExpired(item)).length;

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
              View upcoming, completed, cancelled, and expired appointments.
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

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total" value={appointments.length} color="text-primary" />
        <StatCard title="Upcoming" value={upcomingCount} color="text-secondary" />
        <StatCard title="Pending" value={countByStatus("pending")} color="text-amber-600" />
        <StatCard title="Confirmed" value={countByStatus("confirmed")} color="text-accent" />
        <StatCard title="Expired" value={countByStatus("expired")} color="text-gray-600" />
      </div>

      <div className="mb-5 rounded-2xl bg-white p-4 shadow-lg md:p-5">
        <div className="grid gap-3 md:grid-cols-5">
          <div className="relative md:col-span-2">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search doctor, specialization, date, status..."
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
            <option value="active">Pending + Confirmed</option>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          >
            <option value="all">All Dates</option>
            <option value="upcoming">Upcoming Only</option>
            <option value="past">Past Only</option>
            <option value="expired">Expired Only</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          >
            <option value="upcoming">Upcoming First</option>
            <option value="latest">Latest First</option>
            <option value="expired_first">Expired First</option>
            <option value="status">Status A-Z</option>
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 md:col-span-5"
          >
            <X size={17} />
            Clear Filters
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
          {filteredAppointments.map((appointment) => {
            const status = displayStatus(appointment);

            const canCancel =
              !isExpired(appointment) &&
              (appointment.status === "pending" ||
                appointment.status === "confirmed");

            return (
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
                      status
                    )}`}
                  >
                    {status}
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

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => cancelAppointment(appointment.id)}
                      className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-500 hover:text-white"
                    >
                      Cancel Appointment
                    </button>
                  )}

                  <Link
                    to={`/patient/appointments/${appointment.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
                  >
                    <Eye size={17} />
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
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

export default MyAppointments;