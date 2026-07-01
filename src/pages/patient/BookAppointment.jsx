import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Stethoscope,
  UserRound,
} from "lucide-react";

import { isSupabaseConfigured, supabase } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";
import { getPatientByUserId } from "../../services/patientService";
import toast from "react-hot-toast";

function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [schedules, setSchedules] = useState([]);

  const [formData, setFormData] = useState({
    schedule_id: "",
    appointment_date: "",
    appointment_time: "",
  });

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    if (!isSupabaseConfigured || !user?.id) {
      setLoading(false);
      return;
    }

    const { data: patientData, error: patientError } =
      await getPatientByUserId(user.id);

    if (patientError) {
      alert(patientError.message);
      setLoading(false);
      return;
    }

    if (!patientData) {
      toast.error("Patient profile not found for this account.");
      setLoading(false);
      return;
    }

    const { data: doctorData, error: doctorError } = await supabase
      .from("doctors")
      .select(`
        id,
        full_name,
        specialization_id,
        email,
        phone,
        specializations (
          id,
          name
        )
      `)
      .eq("id", doctorId)
      .single();

    if (doctorError) {
      alert(doctorError.message);
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const { data: schedulesData, error: schedulesError } = await supabase
      .from("schedules")
      .select("*")
      .eq("doctor_id", doctorId)
      .gte("available_date", today)
      .order("available_date", { ascending: true });

    if (schedulesError) {
      alert(schedulesError.message);
      setLoading(false);
      return;
    }

    setPatientId(patientData.id);
    setDoctor(doctorData);
    setSchedules(schedulesData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [doctorId, user?.id]);

  const handleScheduleChange = (e) => {
    const scheduleId = e.target.value;
    const selectedSchedule = schedules.find((item) => item.id === scheduleId);

    setFormData({
      schedule_id: scheduleId,
      appointment_date: selectedSchedule?.available_date || "",
      appointment_time: selectedSchedule?.start_time || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId) {
      toast.error("Patient profile not found.");
      return;
    }

    if (!formData.schedule_id) {
      toast.error("Please select an available schedule.");
      return;
    }

    setBooking(true);

    const { error } = await supabase.from("appointments").insert([
      {
        patient_id: patientId,
        doctor_id: doctorId,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        status: "pending",
      },
    ]);

    setBooking(false);

    if (error) {
      alert(error.message);
      return;
    }

    toast.success("Appointment booked successfully");
    navigate("/patient/appointments");
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="text-gray-500">Loading booking page...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="text-gray-500">Doctor not found.</p>

          <Link
            to="/patient/doctors"
            className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-white"
          >
            Back to Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-white/80">
              Appointment Booking
            </p>

            <h1 className="text-2xl font-bold md:text-3xl">
              Book Appointment
            </h1>

            <p className="mt-1 max-w-lg text-sm text-white/80">
              Select an available schedule to confirm your appointment.
            </p>
          </div>

          <Link
            to={`/patient/doctors/${doctorId}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-primary shadow-md transition hover:scale-105 md:w-auto"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>
      </div>

      <div className="mb-5 rounded-2xl bg-white p-5 shadow-lg md:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-md">
            <UserRound size={26} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary">
              Dr. {doctor.full_name}
            </h2>

            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-secondary">
              <Stethoscope size={14} />
              {doctor.specializations?.name || "General Doctor"}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-lg md:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-primary">
            Appointment Information
          </h2>
          <p className="text-sm text-gray-500">
            Choose a doctor schedule below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Available Schedule
              </label>

              <select
                value={formData.schedule_id}
                onChange={handleScheduleChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
              >
                <option value="">Choose schedule</option>

                {schedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.available_date} | {schedule.start_time} -{" "}
                    {schedule.end_time}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-primary">
                <Calendar size={18} />
                <p className="font-semibold">Appointment Date</p>
              </div>

              <p className="text-gray-700">
                {formData.appointment_date || "Select a schedule"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-primary">
                <Clock size={18} />
                <p className="font-semibold">Appointment Time</p>
              </div>

              <p className="text-gray-700">
                {formData.appointment_time || "Select a schedule"}
              </p>
            </div>
          </div>

          {schedules.length === 0 && (
            <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
              This doctor has no available schedules yet.
            </div>
          )}

          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/patient/doctors"
              className="inline-flex items-center justify-center rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={booking || schedules.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 font-semibold text-white shadow-md hover:opacity-90 disabled:opacity-60"
            >
              <CheckCircle size={18} />
              {booking ? "Booking..." : "Confirm Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;
