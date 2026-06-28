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
import { isSupabaseConfigured, supabase } from "../../services/supabase";

function ScheduleList() {
  const [schedules, setSchedules] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    setLoading(true);

    if (!isSupabaseConfigured) {
      setSchedules([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("schedules")
      .select(`
        id,
        doctor_id,
        available_date,
        start_time,
        end_time,
        created_at,
        doctors (
          id,
          full_name,
          email,
          phone
        )
      `)
      .order("available_date", { ascending: true });

    if (error) {
      alert(error.message);
    } else {
      setSchedules(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const deleteSchedule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;

    const { error } = await supabase.from("schedules").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchSchedules();
  };

  const filteredSchedules = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return schedules;

    return schedules.filter((schedule) => {
      const doctorName = schedule.doctors?.full_name || "";

      return (
        doctorName.toLowerCase().includes(keyword) ||
        schedule.available_date?.includes(search.trim()) ||
        schedule.start_time?.includes(search.trim()) ||
        schedule.end_time?.includes(search.trim()) ||
        schedule.id?.toLowerCase().includes(keyword)
      );
    });
  }, [schedules, search]);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-white/80">
              Admin Module
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">
              Schedules Management
            </h1>
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

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <p className="text-sm text-gray-500">Total Schedules</p>
          <h2 className="mt-1 text-3xl font-bold text-primary">
            {schedules.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-md">
          <p className="text-sm text-gray-500">Current Results</p>
          <h2 className="mt-1 text-3xl font-bold text-accent">
            {filteredSchedules.length}
          </h2>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-lg md:p-5">
        <div className="mb-5 grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-3">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search doctor, date, time, or ID..."
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

        <div className="mb-5 border-t border-gray-100 pt-5">
          <h2 className="text-lg font-bold text-primary">Schedule List</h2>
          <p className="text-sm text-gray-500">
            Search, edit, or delete doctor schedules.
          </p>
        </div>

        <div className="grid gap-4 md:hidden">
          {loading ? (
            <p className="py-8 text-center text-gray-500">Loading schedules...</p>
          ) : filteredSchedules.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No schedules found.</p>
          ) : (
            filteredSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                    <UserRound size={21} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800">
                      Dr. {schedule.doctors?.full_name || "N/A"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      ID: {schedule.id.slice(0, 8)}
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
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/schedules/edit/${schedule.id}`}
                    className="flex flex-1 items-center justify-center rounded-xl bg-primary/10 py-2 text-primary"
                  >
                    <Pencil size={17} />
                  </Link>

                  <button
                    onClick={() => deleteSchedule(schedule.id)}
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
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    Loading schedules...
                  </td>
                </tr>
              ) : filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
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
                            ID: {schedule.id.slice(0, 8)}
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
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/schedules/edit/${schedule.id}`}
                          className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary hover:text-white"
                        >
                          <Pencil size={17} />
                        </Link>

                        <button
                          onClick={() => deleteSchedule(schedule.id)}
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

export default ScheduleList;