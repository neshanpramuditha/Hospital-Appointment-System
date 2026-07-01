import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  Phone,
  Stethoscope,
  UserRound,
} from "lucide-react";

import { isSupabaseConfigured, supabase } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";
import { getDoctorByUserId } from "../../services/doctorService";
import toast from "react-hot-toast";

function AppointmentDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const fetchAppointment = async () => {
    setLoading(true);

    if (!isSupabaseConfigured || !user?.id) {
      setLoading(false);
      return;
    }

    const { data: doctor, error: doctorError } = await getDoctorByUserId(
      user.id
    );

    if (doctorError) {
      alert(doctorError.message);
      setLoading(false);
      return;
    }

    if (!doctor) {
      setAppointment(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id,
        doctor_id,
        appointment_date,
        appointment_time,
        status,
        created_at,
        patients (
          id,
          full_name,
          email,
          phone,
          date_of_birth
        ),
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
      .eq("id", id)
      .eq("doctor_id", doctor.id)
      .limit(1)
      .maybeSingle();

    if (error) {
      alert(error.message);
    } else {
      setAppointment(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAppointment();
  }, [id, user?.id]);

  const isExpired = (item) =>
    item?.appointment_date < today &&
    item?.status !== "completed" &&
    item?.status !== "cancelled";

  const displayStatus = (item) => {
    if (isExpired(item)) return "expired";
    return item?.status || "pending";
  };

  const getStatusClass = (status) => {
    if (status === "confirmed") return "bg-accent/10 text-secondary";
    if (status === "completed") return "bg-blue-50 text-blue-600";
    if (status === "cancelled") return "bg-red-50 text-red-600";
    if (status === "expired") return "bg-gray-200 text-gray-700";
    return "bg-amber-50 text-amber-700";
  };

  const updateStatus = async (status) => {
    if (!appointment?.id) return;

    if (displayStatus(appointment) === "expired") {
      toast.error("Expired appointments cannot be updated.");
      return;
    }

    setUpdating(true);

    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", appointment.id)
      .eq("doctor_id", appointment.doctor_id);

    setUpdating(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    fetchAppointment();
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="text-gray-500">Loading appointment...</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="text-gray-500">
          Appointment not found or you do not have permission to view it.
        </p>

        <Link
          to="/doctor/appointments"
          className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-white"
        >
          Back
        </Link>
      </div>
    );
  }

  const status = displayStatus(appointment);
  const canUpdate =
    status !== "expired" &&
    status !== "completed" &&
    status !== "cancelled";

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-white/80">
              Doctor Portal
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">
              Appointment Details
            </h1>
          </div>

          <Link
            to="/doctor/appointments"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-primary shadow-md"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-lg md:p-6">
        <div className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
              <UserRound size={30} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary">
                {appointment.patients?.full_name || "Unknown Patient"}
              </h2>
              <p className="text-sm text-gray-500">
                Appointment ID: {appointment.id.slice(0, 8)}
              </p>
            </div>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
              status
            )}`}
          >
            {status}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard icon={<UserRound size={18} />} label="Patient" value={appointment.patients?.full_name || "N/A"} />
          <InfoCard icon={<Mail size={18} />} label="Patient Email" value={appointment.patients?.email || "N/A"} />
          <InfoCard icon={<Phone size={18} />} label="Patient Phone" value={appointment.patients?.phone || "N/A"} />
          <InfoCard icon={<Calendar size={18} />} label="Appointment Date" value={appointment.appointment_date || "N/A"} />
          <InfoCard icon={<Clock size={18} />} label="Appointment Time" value={appointment.appointment_time || "N/A"} />
          <InfoCard icon={<Stethoscope size={18} />} label="Doctor" value={`Dr. ${appointment.doctors?.full_name || "N/A"}`} />
        </div>

        <div className="mt-6 rounded-2xl bg-gray-50 p-4">
          <h3 className="mb-3 font-bold text-primary">Update Status</h3>

          {!canUpdate ? (
            <p className="text-sm text-gray-500">
              This appointment cannot be updated because it is {status}.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              <button
                disabled={updating}
                onClick={() => updateStatus("confirmed")}
                className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                Confirm
              </button>

              <button
                disabled={updating}
                onClick={() => updateStatus("completed")}
                className="rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                Complete
              </button>

              <button
                disabled={updating}
                onClick={() => updateStatus("cancelled")}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-primary">
        {icon}
        <p className="font-semibold">{label}</p>
      </div>
      <p className="text-gray-700">{value}</p>
    </div>
  );
}

export default AppointmentDetails;
