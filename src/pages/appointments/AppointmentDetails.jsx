import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  Phone,
  Stethoscope,
  UserRound,
  Pencil,
} from "lucide-react";
import { getAppointmentById } from "../../services/appointmentService";

const today = new Date().toISOString().slice(0, 10);
const isExpiredAppointment = (appointment) =>
  appointment.appointment_date < today &&
  appointment.status !== "completed" &&
  appointment.status !== "cancelled";

const displayStatus = (appointment) =>
  isExpiredAppointment(appointment) ? "expired" : appointment.status || "pending";

function AppointmentDetails() {
  const { id } = useParams();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAppointment = useCallback(async () => {
    setLoading(true);

    const { data, error } = await getAppointmentById(id);

    if (error) {
      alert(error.message);
    } else {
      setAppointment(data);
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    Promise.resolve().then(fetchAppointment);
  }, [fetchAppointment]);

  const getStatusClass = (status) => {
    if (status === "expired")
      return "bg-red-100 text-red-700";

    if (status === "confirmed")
      return "bg-green-100 text-green-700";

    if (status === "completed")
      return "bg-blue-100 text-blue-700";

    if (status === "cancelled")
      return "bg-red-100 text-red-700";

    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 text-center shadow-lg">
        Loading appointment...
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 text-center shadow-lg">
        Appointment not found.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Header */}

      <div className="mb-6 rounded-3xl bg-gradient-to-r from-primary via-secondary to-accent p-8 text-white shadow-xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-white/80">
              Admin Module
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Appointment Details
            </h1>

            <p className="mt-2 text-sm text-white/80">
              Complete appointment information.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/appointments"
              className="rounded-2xl bg-white px-5 py-3 font-semibold text-primary"
            >
              <ArrowLeft size={18} />
            </Link>

            <Link
              to={`/appointments/edit/${appointment.id}`}
              className="rounded-2xl bg-white px-5 py-3 font-semibold text-primary"
            >
              <Pencil size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Patient */}

      <div className="mb-6 rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-primary p-3 text-white">
            <UserRound />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary">
              Patient Information
            </h2>

            <p className="text-gray-500">
              Patient details
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Info
            icon={<UserRound size={18} />}
            label="Patient Name"
            value={appointment.patients?.full_name}
          />

          <Info
            icon={<Mail size={18} />}
            label="Email"
            value={appointment.patients?.email}
          />

          <Info
            icon={<Phone size={18} />}
            label="Phone"
            value={appointment.patients?.phone}
          />
        </div>
      </div>

      {/* Doctor */}

      <div className="mb-6 rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-secondary p-3 text-white">
            <Stethoscope />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary">
              Doctor Information
            </h2>

            <p className="text-gray-500">
              Doctor details
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Info
            icon={<UserRound size={18} />}
            label="Doctor"
            value={`Dr. ${appointment.doctors?.full_name}`}
          />

          <Info
            icon={<Stethoscope size={18} />}
            label="Specialization"
            value={
              appointment.doctors?.specializations?.name ||
              "General Doctor"
            }
          />

          <Info
            icon={<Mail size={18} />}
            label="Email"
            value={appointment.doctors?.email}
          />

          <Info
            icon={<Phone size={18} />}
            label="Phone"
            value={appointment.doctors?.phone}
          />
        </div>
      </div>

      {/* Appointment */}

      <div className="rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-primary">
            Appointment Information
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Info
            icon={<Calendar size={18} />}
            label="Appointment Date"
            value={appointment.appointment_date}
          />

          <Info
            icon={<Clock size={18} />}
            label="Appointment Time"
            value={appointment.appointment_time}
          />

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="mb-2 font-semibold">
              Status
            </div>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${getStatusClass(
              displayStatus(appointment)
              )}`}
            >
              {displayStatus(appointment)}
            </span>
          </div>

          <Info
            icon={<Calendar size={18} />}
            label="Created"
            value={
              appointment.created_at
                ? new Date(
                    appointment.created_at
                  ).toLocaleDateString()
                : "N/A"
            }
          />
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-primary">
        {icon}
        <span className="font-semibold">{label}</span>
      </div>

      <p className="text-gray-700">
        {value || "N/A"}
      </p>
    </div>
  );
}

export default AppointmentDetails;
