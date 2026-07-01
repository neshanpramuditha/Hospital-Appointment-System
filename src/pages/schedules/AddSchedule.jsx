import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarPlus, Save } from "lucide-react";
import { addSchedule, getScheduleDoctors } from "../../services/scheduleService";
import toast from "react-hot-toast";

const today = new Date().toISOString().slice(0, 10);

function AddSchedule() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [schedule, setSchedule] = useState({
    doctor_id: "",
    available_date: "",
    start_time: "",
    end_time: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);

    const { data, error } = await getScheduleDoctors();

    if (error) alert(error.message);
    else setDoctors(data || []);

    setLoading(false);
  };

  useEffect(() => {
    Promise.resolve().then(fetchDoctors);
  }, []);

  const handleChange = (e) => {
    setSchedule({
      ...schedule,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (schedule.available_date < today) {
      toast.error("Cannot add a schedule for a past date.");
      return;
    }

    if (schedule.start_time >= schedule.end_time) {
      toast.error("Start time must be earlier than end time.");
      return;
    }

    setSaving(true);

    const { error } = await addSchedule({
      doctor_id: schedule.doctor_id,
      available_date: schedule.available_date,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
    });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    toast.success("Schedule added successfully");
    navigate("/schedules");
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-white/80">
              Admin Module
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">Add Schedule</h1>
            <p className="mt-1 max-w-lg text-sm text-white/80">
              Add doctor available date and appointment time slot.
            </p>
          </div>

          <Link
            to="/schedules"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-primary shadow-md transition hover:scale-105 md:w-auto"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-lg md:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
            <CalendarPlus size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary">
              Schedule Information
            </h2>
            <p className="text-sm text-gray-500">
              Select doctor and enter available time details.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="py-10 text-center text-gray-500">Loading doctors...</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Doctor
              </label>

              <select
                name="doctor_id"
                value={schedule.doctor_id}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
              >
                <option value="">Select doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <Input
                label="Available Date"
                name="available_date"
                type="date"
                value={schedule.available_date}
                onChange={handleChange}
                min={today}
                required
              />

              <Input
                label="Start Time"
                name="start_time"
                type="time"
                value={schedule.start_time}
                onChange={handleChange}
                required
              />

              <Input
                label="End Time"
                name="end_time"
                type="time"
                value={schedule.end_time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/schedules")}
                className="rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 font-semibold text-white shadow-md hover:opacity-90 disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Schedule"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text", min, required }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        required={required}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}

export default AddSchedule;
