import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../services/supabase";

function MySchedule() {
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
          phone,
          specializations (
            id,
            name
          )
        )
      `)
      .order("available_date", { ascending: true });

    if (error) alert(error.message);
    else setSchedules(data || []);

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
      const specialization = schedule.doctors?.specializations?.name || "";

      return (
        doctorName.toLowerCase().includes(keyword) ||
        specialization.toLowerCase().includes(keyword) ||
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
              Doctor Portal
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">My Schedule</h1>
            <p className="mt-1 max-w-lg text-sm text-white/80">
              Manage available dates and time slots for appointments.
            </p>
          </div>

          <Link
            to="/doctor/schedules/add"
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

      <div className="mb-5 rounded-2xl bg-white p-4 shadow-lg md:p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-3">
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
          <p className="text-gray-500">Loading schedules...</p>
        </div>
      ) : filteredSchedules.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="text-gray-500">No schedules found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h3 className="text-lg font-bold text-primary">
                Dr. {schedule.doctors?.full_name || "N/A"}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {schedule.doctors?.specializations?.name || "General Doctor"}
              </p>

              <div className="mt-5 grid gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                  <Calendar size={17} className="text-primary" />
                  {schedule.available_date || "N/A"}
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                  <Clock size={17} className="text-primary" />
                  {schedule.start_time || "N/A"} - {schedule.end_time || "N/A"}
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <Link
                  to={`/doctor/schedules/edit/${schedule.id}`}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MySchedule;