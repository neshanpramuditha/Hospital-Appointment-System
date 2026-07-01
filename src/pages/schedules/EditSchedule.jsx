import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import {
  getScheduleById,
  getScheduleDoctors,
  updateSchedule,
} from "../../services/scheduleService";
import toast from "react-hot-toast";

const today = new Date().toISOString().slice(0, 10);

function EditSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [schedule, setSchedule] = useState({
    doctor_id: "",
    available_date: "",
    start_time: "",
    end_time: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);

    const { data: doctorData, error: doctorError } = await getScheduleDoctors();

    if (doctorError) {
      alert(doctorError.message);
      setLoading(false);
      return;
    }

    const { data: scheduleData, error: scheduleError } = await getScheduleById(id);

    if (scheduleError) {
      alert(scheduleError.message);
      setLoading(false);
      return;
    }

    setDoctors(doctorData || []);

    setSchedule({
      doctor_id: scheduleData.doctor_id || "",
      available_date: scheduleData.available_date || "",
      start_time: scheduleData.start_time || "",
      end_time: scheduleData.end_time || "",
    });

    setLoading(false);
  }, [id]);

  useEffect(() => {
    Promise.resolve().then(fetchData);
  }, [fetchData]);

  const handleChange = (e) => {
    setSchedule({
      ...schedule,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (schedule.available_date < today) {
      toast.error("Cannot save a schedule for a past date.");
      return;
    }

    if (schedule.start_time >= schedule.end_time) {
      toast.error("Start time must be earlier than end time.");
      return;
    }

    setSaving(true);

    const { error } = await updateSchedule(id, {
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

    toast.success("Schedule updated successfully");
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

            <h1 className="text-2xl font-bold md:text-3xl">
              Edit Schedule
            </h1>

            <p className="mt-1 text-sm text-white/80">
              Update doctor's available schedule.
            </p>
          </div>

          <Link
            to="/schedules"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-primary shadow-md"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-lg">
        {loading ? (
          <p className="py-10 text-center text-gray-500">
            Loading schedule...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                Doctor
              </label>

              <select
                name="doctor_id"
                value={schedule.doctor_id}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
              >
                <option value="">Select Doctor</option>

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
                type="date"
                name="available_date"
                value={schedule.available_date}
                onChange={handleChange}
                min={today}
              />

              <Input
                label="Start Time"
                type="time"
                name="start_time"
                value={schedule.start_time}
                onChange={handleChange}
              />

              <Input
                label="End Time"
                type="time"
                name="end_time"
                value={schedule.end_time}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/schedules")}
                className="rounded-xl bg-gray-200 px-5 py-3 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 font-semibold text-white"
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

function Input({ label, type, name, value, onChange, min }) {
  return (
    <div>
      <label className="mb-2 block font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        required
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
      />
    </div>
  );
}

export default EditSchedule;
