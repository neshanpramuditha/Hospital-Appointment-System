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
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../services/supabase";

function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
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
      .order("appointment_date", { ascending: false });

    if (error) alert(error.message);
    else setAppointments(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const deleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    const { error } = await supabase.from("appointments").delete().eq("id", id);

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

        return (
          patientName.toLowerCase().includes(keyword) ||
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
      result = result.filter((appointment) => appointment.status === statusFilter);
    }

    return result;
  }, [appointments, search, statusFilter]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const getStatusClass = (status) => {
    if (status === "confirmed") return "bg-accent/10 text-secondary";
    if (status === "completed") return "bg-blue-50 text-blue-600";
    if (status === "cancelled") return "bg-red-50 text-red-600";
    return "bg-amber-50 text-amber-700";
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-white/80">
              Admin Module
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">
              Appointments Management
            </h1>
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
            {appointments.filter((item) => item.status === "pending").length}
          </h2>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-lg md:p-5">
        <div className="mb-5 grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search patient, doctor, date, status, or ID..."
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

        <div className="mb-5 border-t border-gray-100 pt-5">
          <h2 className="text-lg font-bold text-primary">Appointment List</h2>
          <p className="text-sm text-gray-500">
            Search, view, edit, or delete appointment records.
          </p>
        </div>

        <div className="grid gap-4 md:hidden">
          {loading ? (
            <p className="py-8 text-center text-gray-500">Loading appointments...</p>
          ) : filteredAppointments.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No appointments found.</p>
          ) : (
            filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                    <UserRound size={21} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800">
                      {appointment.patients?.full_name || "Unknown Patient"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Dr. {appointment.doctors?.full_name || "N/A"}
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

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                      appointment.status
                    )}`}
                  >
                    {appointment.status || "pending"}
                  </span>
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

                  <button
                    onClick={() => deleteAppointment(appointment.id)}
                    className="flex flex-1 items-center justify-center rounded-xl bg-red-50 py-2 text-red-500"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
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
                        {appointment.patients?.phone || "No phone"}
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
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                          appointment.status
                        )}`}
                      >
                        {appointment.status || "pending"}
                      </span>
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

                        <button
                          onClick={() => deleteAppointment(appointment.id)}
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

export default AppointmentsList;