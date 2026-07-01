import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { deleteSchedule, getSchedules } from "../../services/scheduleService";

const today = new Date().toISOString().slice(0, 10);

const isExpiredSchedule = (schedule) => schedule.available_date < today;

const getScheduleStatus = (schedule) =>
  isExpiredSchedule(schedule) ? "expired" : "upcoming";

function ScheduleList() {
  const [schedules, setSchedules] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("upcoming");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("upcoming");
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    setLoading(true);
    const { data, error } = await getSchedules();

    if (error) alert(error.message);
    else setSchedules(data || []);

    setLoading(false);
  };

  useEffect(() => {
    Promise.resolve().then(fetchSchedules);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;

    const { error } = await deleteSchedule(id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchSchedules();
  };

  const filteredSchedules = useMemo(() => {
    let result = [...schedules];
    const keyword = search.trim().toLowerCase();

    if (keyword) {
      result = result.filter((schedule) => {
        const doctorName = schedule.doctors?.full_name || "";
        const specialization = schedule.doctors?.specializations?.name || "";
        const status = getScheduleStatus(schedule);

        return (
          doctorName.toLowerCase().includes(keyword) ||
          specialization.toLowerCase().includes(keyword) ||
          status.includes(keyword) ||
          schedule.available_date?.includes(search.trim()) ||
          schedule.start_time?.includes(search.trim()) ||
          schedule.end_time?.includes(search.trim()) ||
          schedule.id?.toLowerCase().includes(keyword)
        );
      });
    }

    if (statusFilter !== "all") {
      result = result.filter((schedule) => getScheduleStatus(schedule) === statusFilter);
    }

    if (startDate) {
      result = result.filter((schedule) => schedule.available_date >= startDate);
    }

    if (endDate) {
      result = result.filter((schedule) => schedule.available_date <= endDate);
    }

    result.sort((a, b) => {
      const dateA = `${a.available_date || ""} ${a.start_time || ""}`;
      const dateB = `${b.available_date || ""} ${b.start_time || ""}`;

      if (sortBy === "latest") return dateB.localeCompare(dateA);
      if (sortBy === "expired") {
        const expiredDiff = Number(isExpiredSchedule(b)) - Number(isExpiredSchedule(a));
        return expiredDiff || dateB.localeCompare(dateA);
      }

      const expiredDiff = Number(isExpiredSchedule(a)) - Number(isExpiredSchedule(b));
      return expiredDiff || dateA.localeCompare(dateB);
    });

    return result;
  }, [schedules, search, statusFilter, startDate, endDate, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("upcoming");
    setStartDate("");
    setEndDate("");
    setSortBy("upcoming");
  };

  const upcomingCount = schedules.filter((item) => !isExpiredSchedule(item)).length;
  const expiredCount = schedules.filter(isExpiredSchedule).length;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-white/80">Admin Module</p>
            <h1 className="text-2xl font-bold md:text-3xl">Schedules Management</h1>
            <p className="mt-1 max-w-lg text-sm text-white/80">
              Manage doctor available dates and appointment time slots.
            </p>
          </div>

          <Link
            to="/schedules/add"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-primary shadow-md transition hover:scale-105 md:w-auto"
          >
            <Plus size={18} />
            Add Schedule
          </Link>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Upcoming" value={upcomingCount} color="text-primary" />
        <StatCard title="Expired" value={expiredCount} color="text-red-600" />
        <StatCard title="Current Results" value={filteredSchedules.length} color="text-accent" />
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
              placeholder="Search doctor, specialization, date, time, or ID..."
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
            <option value="upcoming">Upcoming</option>
            <option value="expired">Expired</option>
            <option value="all">All</option>
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

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          >
            <option value="upcoming">Upcoming First</option>
            <option value="latest">Latest First</option>
            <option value="expired">Expired First</option>
          </select>
        </div>

        <div className="mb-5 flex justify-end">
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
          <h2 className="text-lg font-bold text-primary">Schedule List</h2>
          <p className="text-sm text-gray-500">
            Upcoming schedules are shown by default. Use filters to review expired slots.
          </p>
        </div>

        <div className="grid gap-4 md:hidden">
          {loading ? (
            <p className="py-8 text-center text-gray-500">Loading schedules...</p>
          ) : filteredSchedules.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No schedules found.</p>
          ) : (
            filteredSchedules.map((schedule) => (
              <ScheduleCard key={schedule.id} schedule={schedule} onDelete={handleDelete} />
            ))
          )}
        </div>

        <div className="hidden overflow-x-auto rounded-xl border border-gray-100 md:block">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
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
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    Loading schedules...
                  </td>
                </tr>
              ) : filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No schedules found.
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((schedule) => (
                  <tr
                    key={schedule.id}
                    className="border-t border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                          <UserRound size={19} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            Dr. {schedule.doctors?.full_name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {schedule.doctors?.specializations?.name || "General Doctor"} | ID:{" "}
                            {schedule.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {schedule.available_date || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {schedule.start_time || "N/A"} - {schedule.end_time || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge expired={isExpiredSchedule(schedule)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/schedules/edit/${schedule.id}`}
                          className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary hover:text-white"
                        >
                          <Pencil size={17} />
                        </Link>
                        <button
                          onClick={() => handleDelete(schedule.id)}
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

function StatusBadge({ expired }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        expired ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"
      }`}
    >
      {expired ? "Expired" : "Upcoming"}
    </span>
  );
}

function ScheduleCard({ schedule, onDelete }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
          <UserRound size={21} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">
            Dr. {schedule.doctors?.full_name || "N/A"}
          </h3>
          <p className="text-xs text-gray-400">
            {schedule.doctors?.specializations?.name || "General Doctor"} | ID:{" "}
            {schedule.id.slice(0, 8)}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <Calendar size={16} className="text-primary" />
          {schedule.available_date || "N/A"}
        </p>
        <p className="flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          {schedule.start_time || "N/A"} - {schedule.end_time || "N/A"}
        </p>
        <StatusBadge expired={isExpiredSchedule(schedule)} />
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          to={`/schedules/edit/${schedule.id}`}
          className="flex flex-1 items-center justify-center rounded-xl bg-primary/10 py-2 text-primary"
        >
          <Pencil size={17} />
        </Link>
        <button
          onClick={() => onDelete(schedule.id)}
          className="flex flex-1 items-center justify-center rounded-xl bg-red-50 py-2 text-red-500"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
}

export default ScheduleList;
