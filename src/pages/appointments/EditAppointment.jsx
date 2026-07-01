import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarPlus, Save } from "lucide-react";
import {
  getAppointmentById,
  getAppointmentDoctors,
  getAppointmentPatients,
  updateAppointment,
} from "../../services/appointmentService";
import toast from "react-hot-toast";

const today = new Date().toISOString().slice(0, 10);
const isExpiredAppointment = (appointment) =>
  appointment.appointment_date < today &&
  appointment.status !== "completed" &&
  appointment.status !== "cancelled";

function EditAppointment() {
  const { id } = useParams();
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
  const [originalAppointment, setOriginalAppointment] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);

    const { data: patientData } = await getAppointmentPatients();
    const { data: doctorData } = await getAppointmentDoctors();
    const { data: appointmentData, error } = await getAppointmentById(id);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setPatients(patientData || []);
    setDoctors(doctorData || []);
    setOriginalAppointment(appointmentData);

    setAppointment({
      patient_id: appointmentData.patient_id || "",
      doctor_id: appointmentData.doctor_id || "",
      appointment_date: appointmentData.appointment_date || "",
      appointment_time: appointmentData.appointment_time || "",
      status: appointmentData.status || "pending",
    });

    setLoading(false);
  }, [id]);

  useEffect(() => {
    Promise.resolve().then(fetchData);
  }, [fetchData]);

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
      toast.error("Cannot save an appointment for a past date.");
      return;
    }

    if (!appointment.appointment_time) {
      toast.error("Please select an appointment time.");
      return;
    }

    if (
      originalAppointment &&
      isExpiredAppointment(originalAppointment) &&
      appointment.status !== originalAppointment.status
    ) {
      toast.error("Status update is not allowed for expired appointments.");
      return;
    }

    setSaving(true);

    const { error } = await updateAppointment(id, {
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

    toast.success("Appointment updated successfully");
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
              Edit Appointment
            </h1>
            <p className="mt-1 max-w-lg text-sm text-white/80">
              Update patient, doctor, date, time, or appointment status.
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
              Modify appointment details below.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="py-10 text-center text-gray-500">
            Loading appointment...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField
                label="Patient"
                name="patient_id"
                value={appointment.patient_id}
                onChange={handleChange}
              >
                <option value="">Select patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.full_name} - {patient.phone || "No phone"}
                  </option>
                ))}
              </SelectField>

              <SelectField
                label="Doctor"
                name="doctor_id"
                value={appointment.doctor_id}
                onChange={handleChange}
              >
                <option value="">Select doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.full_name} -{" "}
                    {doctor.specializations?.name || "General Doctor"}
                  </option>
                ))}
              </SelectField>

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

              <SelectField
                label="Status"
                name="status"
                value={appointment.status}
                onChange={handleChange}
                disabled={originalAppointment && isExpiredAppointment(originalAppointment)}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </SelectField>
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
                {saving ? "Updating..." : "Update Appointment"}
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

function SelectField({ label, name, value, onChange, children, disabled = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {children}
      </select>
    </div>
  );
}

export default EditAppointment;
