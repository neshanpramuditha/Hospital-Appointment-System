import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarPlus, Save } from "lucide-react";

import { isSupabaseConfigured, supabase } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";

function EditSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const today = new Date().toISOString().split("T")[0];

  const [doctor, setDoctor] = useState(null);
  const [schedule, setSchedule] = useState({
    available_date: "",
    start_time: "",
    end_time: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    if (!isSupabaseConfigured || !user?.id) {
      setLoading(false);
      return;
    }

    const { data: doctorData, error: doctorError } = await supabase
      .from("doctors")
      .select(`
        id,
        full_name,
        specializations (
          id,
          name
        )
      `)
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (doctorError) {
      alert(doctorError.message);
      setLoading(false);
      return;
    }

    if (!doctorData) {
      alert("Doctor profile not found.");
      setLoading(false);
      navigate("/doctor/schedules");
      return;
    }

    const { data: scheduleData, error: scheduleError } = await supabase
      .from("schedules")
      .select("*")
      .eq("id", id)
      .eq("doctor_id", doctorData.id)
      .limit(1)
      .maybeSingle();

    if (scheduleError) {
      alert(scheduleError.message);
      setLoading(false);
      return;
    }

    if (!scheduleData) {
      alert("Schedule not found or you do not have permission to edit it.");
      setLoading(false);
      navigate("/doctor/schedules");
      return;
    }

    setDoctor(doctorData);
    setSchedule({
      available_date: scheduleData.available_date || "",
      start_time: scheduleData.start_time || "",
      end_time: scheduleData.end_time || "",
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id, user?.id]);

  const handleChange = (e) => {
    setSchedule({
      ...schedule,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctor?.id) {
      alert("Doctor profile not found.");
      return;
    }

    if (schedule.available_date < today) {
      alert("Cannot select a past date.");
      return;
    }

    if (schedule.start_time >= schedule.end_time) {
      alert("End time must be after start time.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("schedules")
      .update({
        doctor_id: doctor.id,
        available_date: schedule.available_date,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
      })
      .eq("id", id)
      .eq("doctor_id", doctor.id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Schedule updated successfully");
    navigate("/doctor/schedules");
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-white/80">
              Doctor Portal
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">Edit Schedule</h1>
            <p className="mt-1 max-w-lg text-sm text-white/80">
              Update your available date and time slot.
            </p>
          </div>

          <Link
            to="/doctor/schedules"
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
              Modify your schedule details below.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="py-10 text-center text-gray-500">Loading schedule...</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Doctor</p>
              <h3 className="mt-1 font-bold text-primary">
                Dr. {doctor?.full_name || "N/A"}
              </h3>
              <p className="text-sm text-gray-500">
                {doctor?.specializations?.name || "General Doctor"}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <Input
                label="Available Date"
                name="available_date"
                type="date"
                min={today}
                value={schedule.available_date}
                onChange={handleChange}
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
                onClick={() => navigate("/doctor/schedules")}
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
                {saving ? "Updating..." : "Update Schedule"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  min,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        min={min}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}

export default EditSchedule;