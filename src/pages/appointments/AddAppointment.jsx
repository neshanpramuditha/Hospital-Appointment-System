import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarPlus, Save } from "lucide-react";
import {
  addAppointment,
  getAppointmentDoctors,
  getAppointmentPatients,
} from "../../services/appointmentService";
import toast from "react-hot-toast";

const today = new Date().toISOString().slice(0, 10);

function AddAppointment() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [appointment, setAppointment] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    status: "pending",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchFormData = async () => {
    setLoading(true);

    const { data: patientData, error: patientError } = await getAppointmentPatients();
    const { data: doctorData, error: doctorError } = await getAppointmentDoctors();

    if (patientError) alert(patientError.message);
    if (doctorError) alert(doctorError.message);

    setPatients(patientData || []);
    setDoctors(doctorData || []);
    setLoading(false);
  };

  useEffect(() => {
    Promise.resolve().then(fetchFormData);
  }, []);

  const handleChange = (e) => {
    setAppointment({
      ...appointment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!appointment.patient_id || !appointment.doctor_id) {
      toast.error("Please select both a patient and a doctor.");
      return;
    }

    if (appointment.appointment_date < today) {
      toast.error("Cannot add an appointment for a past date.");
      return;
    }

    if (!appointment.appointment_time) {
      toast.error("Please select an appointment time.");
      return;
    }

    setSaving(true);

    const { error } = await addAppointment({
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      status: appointment.status,
    });

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Appointment added successfully");
    navigate("/appointments");
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
              Add Appointment
            </h1>
            <p className="mt-1 max-w-lg text-sm text-white/80">
              Create a new appointment between a patient and a doctor.
            </p>
          </div>

          <Link
            to="/appointments"
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
              Appointment Information
            </h2>
            <p className="text-sm text-gray-500">
              Fill appointment details below.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="py-10 text-center text-gray-500">
            Loading form data...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Patient
                </label>
                <select
                  name="patient_id"
                  value={appointment.patient_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.full_name} - {patient.phone || "No phone"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Doctor
                </label>
                <select
                  name="doctor_id"
                  value={appointment.doctor_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                >
                  <option value="">Select doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.full_name} -{" "}
                      {doctor.specializations?.name || "General Doctor"}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Appointment Date"
                name="appointment_date"
                type="date"
                value={appointment.appointment_date}
                onChange={handleChange}
                min={today}
                required
              />

              <Input
                label="Appointment Time"
                name="appointment_time"
                type="time"
                value={appointment.appointment_time}
                onChange={handleChange}
                required
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={appointment.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/appointments")}
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
                {saving ? "Saving..." : "Save Appointment"}
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

export default AddAppointment;
