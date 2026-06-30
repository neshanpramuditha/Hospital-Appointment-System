import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Eye, Search, UserRound, X } from "lucide-react";

import { isSupabaseConfigured, supabase } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";
import { getDoctorByUserId } from "../../services/doctorService";

function MyAppointments() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("upcoming");
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const fetchAppointments = async () => {
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
          phone,
          date_of_birth
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
      .eq("doctor_id", doctor.id)
      .order("appointment_date", { ascending: true });

    if (error) alert(error.message);
    else setAppointments(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [user?.id]);

  const isExpired = (appointment) =>
    appointment.appointment_date < today &&
    appointment.status !== "completed" &&
    appointment.status !== "cancelled";

  const displayStatus = (appointment) => {
    if (isExpired(appointment)) return "expired";
    return appointment.status || "pending";
  };

  const filteredAppointments = useMemo(() => {
    let result = [...appointments];
    const keyword = search.trim().toLowerCase();

    if (keyword) {
      result = result.filter((appointment) => {
        const patientName = appointment.patients?.full_name || "";
        const patientEmail = appointment.patients?.email || "";
        const patientPhone = appointment.patients?.phone || "";
        const status = displayStatus(appointment);

        return (
          patientName.toLowerCase().includes(keyword) ||
          patientEmail.toLowerCase().includes(keyword) ||
          patientPhone.includes(search.trim()) ||
          status.toLowerCase().includes(keyword) ||
          appointment.appointment_date?.includes(search.trim()) ||
          appointment.appointment_time?.includes(search.trim()) ||
          appointment.id?.toLowerCase().includes(keyword)
        );
      });
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (appointment) => displayStatus(appointment) === statusFilter
      );
    }

    if (timeFilter === "upcoming") {
      result = result.filter((appointment) => appointment.appointment_date >= today);
    }

    if (timeFilter === "past") {
      result = result.filter((appointment) => appointment.appointment_date < today);
    }

    if (timeFilter === "expired") {
      result = result.filter((appointment) => isExpired(appointment));
    }

    result.sort((a, b) => {
      const dateA = `${a.appointment_date} ${a.appointment_time}`;
      const dateB = `${b.appointment_date} ${b.appointment_time}`;

      if (sortBy === "latest") return dateB.localeCompare(dateA);
      if (sortBy === "expired_first") return Number(isExpired(b)) - Number(isExpired(a));
      if (sortBy === "status") return displayStatus(a).localeCompare(displayStatus(b));

      return dateA.localeCompare(dateB);
    });

    return result;
  }, [appointments, search, statusFilter, timeFilter, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTimeFilter("all");
    setSortBy("upcoming");
  };

  const getStatusClass = (status) => {
    if (status === "confirmed") return "bg-accent/10 text-secondary";
    if (status === "completed") return "bg-blue-50 text-blue-600";
    if (status === "cancelled") return "bg-red-50 text-red-600";
    if (status === "expired") return "bg-gray-200 text-gray-700";
    return "bg-amber-50 text-amber-700";
  };

  const countByStatus = (status) =>
    appointments.filter((item) => displayStatus(item) === status).length;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <p className="mb-1 text-sm font-medium text-white/80">Doctor Portal</p>
        <h1 className="text-2xl font-bold md:text-3xl">My Appointments</h1>
        <p className="mt-1 max-w-lg text-sm text-white/80">
          View patient appointments assigned to you.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total" value={appointments.length} color="text-primary" />
        <StatCard title="Pending" value={countByStatus("pending")} color="text-amber-600" />
        <StatCard title="Confirmed" value={countByStatus("confirmed")} color="text-accent" />
        <StatCard title="Completed" value={countByStatus("completed")} color="text-blue-600" />
        <StatCard title="Expired" value={countByStatus("expired")} color="text-gray-600" />
      </div>

      <div className="mb-5 rounded-2xl bg-white p-4 shadow-lg md:p-5">
        <div className="grid gap-3 md:grid-cols-5">
          <div className="relative md:col-span-2">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search patient, email, phone, date, status..."
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
                        {appointment.patients?.full_name || "Unknown Patient"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {appointment.patients?.email || "No email"} |{" "}
                        {appointment.patients?.phone || "No phone"}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        ID: {appointment.id.slice(0, 8)}
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

                <div className="mt-5 flex justify-end">
                  <Link
                    to={`/doctor/appointments/${appointment.id}`}
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
