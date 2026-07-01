import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import {
  deleteAppointment,
  getAppointments,
  updateAppointmentStatus,
} from "../../services/appointmentService";

const today = new Date().toISOString().slice(0, 10);
const activeStatuses = ["pending", "confirmed"];

const isExpiredAppointment = (appointment) =>
  appointment.appointment_date < today &&
  appointment.status !== "completed" &&
  appointment.status !== "cancelled";

const displayStatus = (appointment) =>
  isExpiredAppointment(appointment) ? "expired" : appointment.status || "pending";

const canCancel = (appointment) =>
  appointment.appointment_date >= today && activeStatuses.includes(appointment.status);

function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [dateFilter, setDateFilter] = useState("upcoming");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("upcoming");
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await getAppointments();

    if (error) alert(error.message);
    else setAppointments(data || []);

    setLoading(false);
  };

  useEffect(() => {
    Promise.resolve().then(fetchAppointments);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    const { error } = await deleteAppointment(id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchAppointments();
  };

  const handleCancel = async (appointment) => {
    if (!canCancel(appointment)) return;
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    const { error } = await updateAppointmentStatus(appointment.id, "cancelled");

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
        const patientName = appointment.patients?.full_name || "";
        const doctorName = appointment.doctors?.full_name || "";
        const specialization = appointment.doctors?.specializations?.name || "";
        const status = displayStatus(appointment);

        return (
          patientName.toLowerCase().includes(keyword) ||
          doctorName.toLowerCase().includes(keyword) ||
          specialization.toLowerCase().includes(keyword) ||
          status.includes(keyword) ||
          appointment.appointment_date?.includes(search.trim()) ||
          appointment.appointment_time?.includes(search.trim()) ||
          appointment.id?.toLowerCase().includes(keyword)
        );
      });
    }

    if (statusFilter === "active") {
      result = result.filter(
        (appointment) =>
          activeStatuses.includes(appointment.status) && !isExpiredAppointment(appointment)
      );
    } else if (statusFilter !== "all") {
      result = result.filter((appointment) => displayStatus(appointment) === statusFilter);
    }

    if (dateFilter === "upcoming") {
      result = result.filter((appointment) => appointment.appointment_date >= today);
    } else if (dateFilter === "past") {
      result = result.filter((appointment) => appointment.appointment_date < today);
    } else if (dateFilter === "expired") {
      result = result.filter(isExpiredAppointment);
    }

    if (startDate) {
      result = result.filter((appointment) => appointment.appointment_date >= startDate);
    }

    if (endDate) {
      result = result.filter((appointment) => appointment.appointment_date <= endDate);
    }

    result.sort((a, b) => {
      const dateA = `${a.appointment_date || ""} ${a.appointment_time || ""}`;
      const dateB = `${b.appointment_date || ""} ${b.appointment_time || ""}`;

      if (sortBy === "latest") return dateB.localeCompare(dateA);
      if (sortBy === "expired") {
        const expiredDiff = Number(isExpiredAppointment(b)) - Number(isExpiredAppointment(a));
        return expiredDiff || dateB.localeCompare(dateA);
      }
      if (sortBy === "status") return displayStatus(a).localeCompare(displayStatus(b));

      const expiredDiff = Number(isExpiredAppointment(a)) - Number(isExpiredAppointment(b));
      return expiredDiff || dateA.localeCompare(dateB);
    });

    return result;
  }, [appointments, search, statusFilter, dateFilter, startDate, endDate, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("active");
    setDateFilter("upcoming");
    setStartDate("");
    setEndDate("");
    setSortBy("upcoming");
  };

  const activeCount = appointments.filter(
    (item) => activeStatuses.includes(item.status) && !isExpiredAppointment(item)
  ).length;
  const expiredCount = appointments.filter(isExpiredAppointment).length;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-white/80">Admin Module</p>
            <h1 className="text-2xl font-bold md:text-3xl">Appointments Management</h1>
            <p className="mt-1 max-w-lg text-sm text-white/80">
              Manage patient appointments, doctors, date, time, and appointment status.
            </p>
          </div>

          <Link
            to="/appointments/add"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-primary shadow-md transition hover:scale-105 md:w-auto"
          >
            <Plus size={18} />
            Add Appointment
          </Link>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard title="Total" value={appointments.length} color="text-primary" />
        <StatCard title="Active" value={activeCount} color="text-accent" />
        <StatCard title="Expired" value={expiredCount} color="text-red-600" />
        <StatCard title="Current Results" value={filteredAppointments.length} color="text-secondary" />
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-lg md:p-5">
        <div className="mb-5 grid gap-3 md:grid-cols-6">
          <div className="relative md:col-span-2">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search patient, doctor, specialization, status, date, time, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-11 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
            <option value="all">All</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          >
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="expired">Expired</option>
            <option value="all">All Dates</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          >
            <option value="upcoming">Upcoming First</option>
            <option value="latest">Latest First</option>
            <option value="expired">Expired First</option>
            <option value="status">Status A-Z</option>
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

        <div className="mb-5 border-t border-gray-100 pt-5">
          <h2 className="text-lg font-bold text-primary">Appointment List</h2>
          <p className="text-sm text-gray-500">
            Upcoming pending and confirmed appointments are shown by default.
          </p>
        </div>

        <div className="grid gap-4 md:hidden">
          {loading ? (
            <p className="py-8 text-center text-gray-500">Loading appointments...</p>
          ) : filteredAppointments.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No appointments found.</p>
          ) : (
            filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancel}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        <div className="hidden overflow-x-auto rounded-xl border border-gray-100 md:block">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    Loading appointments...
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-t border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">
                        {appointment.patients?.full_name || "N/A"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {appointment.patients?.phone || "No phone"} | ID:{" "}
                        {appointment.id.slice(0, 8)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">
                        Dr. {appointment.doctors?.full_name || "N/A"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {appointment.doctors?.specializations?.name || "General Doctor"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {appointment.appointment_date || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {appointment.appointment_time || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={displayStatus(appointment)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/appointments/details/${appointment.id}`}
                          className="rounded-lg bg-accent/10 p-2 text-secondary hover:bg-accent hover:text-white"
                        >
                          <Eye size={17} />
                        </Link>
                        <Link
                          to={`/appointments/edit/${appointment.id}`}
                          className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary hover:text-white"
                        >
                          <Pencil size={17} />
                        </Link>
                        {canCancel(appointment) && (
                          <button
                            onClick={() => handleCancel(appointment)}
                            className="rounded-lg bg-amber-50 p-2 text-amber-600 hover:bg-amber-500 hover:text-white"
                          >
                            <XCircle size={17} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
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

function getStatusClass(status) {
  if (status === "expired") return "bg-red-50 text-red-600";
  if (status === "confirmed") return "bg-accent/10 text-secondary";
  if (status === "completed") return "bg-blue-50 text-blue-600";
  if (status === "cancelled") return "bg-red-50 text-red-600";
  return "bg-amber-50 text-amber-700";
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
        status
      )}`}
    >
      {status}
    </span>
  );
}

function AppointmentCard({ appointment, onCancel, onDelete }) {
  const status = displayStatus(appointment);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
          <UserRound size={21} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">
            {appointment.patients?.full_name || "Unknown Patient"}
          </h3>
          <p className="text-xs text-gray-400">
            Dr. {appointment.doctors?.full_name || "N/A"} | ID: {appointment.id.slice(0, 8)}
          </p>
        </div>
      </div>

      <div className="mb-4 space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <Calendar size={16} className="text-primary" />
          {appointment.appointment_date || "N/A"}
        </p>
        <p className="flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          {appointment.appointment_time || "N/A"}
        </p>
        <StatusBadge status={status} />
      </div>

      <div className="flex gap-2">
        <Link
          to={`/appointments/details/${appointment.id}`}
          className="flex flex-1 items-center justify-center rounded-xl bg-accent/10 py-2 text-secondary"
        >
          <Eye size={17} />
        </Link>
        <Link
          to={`/appointments/edit/${appointment.id}`}
          className="flex flex-1 items-center justify-center rounded-xl bg-primary/10 py-2 text-primary"
        >
          <Pencil size={17} />
        </Link>
        {canCancel(appointment) && (
          <button
            onClick={() => onCancel(appointment)}
            className="flex flex-1 items-center justify-center rounded-xl bg-amber-50 py-2 text-amber-600"
          >
            <XCircle size={17} />
          </button>
        )}
        <button
          onClick={() => onDelete(appointment.id)}
          className="flex flex-1 items-center justify-center rounded-xl bg-red-50 py-2 text-red-500"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
}

export default AppointmentsList;
