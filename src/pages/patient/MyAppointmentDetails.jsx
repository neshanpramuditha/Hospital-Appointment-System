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
import { getPatientByUserId } from "../../services/patientService";

function MyAppointmentDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAppointment = async () => {
    setLoading(true);

    if (!user?.id) {
      setAppointment(null);
      setLoading(false);
      return;
    }

    const { data: patient, error: patientError } =
      await getPatientByUserId(user.id);

    if (patientError) {
      alert(patientError.message);
      setLoading(false);
      return;
    }

    if (!patient) {
      setAppointment(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id,
        patient_id,
        appointment_date,
        appointment_time,
        status,
        created_at,
        patients (
          id,
          full_name,
          email,
          phone
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
      .eq("patient_id", patient.id)
      .single();

    if (error) alert(error.message);
    else setAppointment(data);

    setLoading(false);
  };

  useEffect(() => {
    if (isSupabaseConfigured) fetchAppointment();
    else setLoading(false);
  }, [id, user?.id]);

  if (loading) return <p className="text-gray-500">Loading appointment...</p>;

  if (!appointment) {
    return (
      <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="text-gray-500">Appointment not found.</p>
        <Link to="/patient/appointments" className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-white">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-white/80">Appointment Details</p>
            <h1 className="text-2xl font-bold md:text-3xl">Appointment Information</h1>
          </div>

          <Link to="/patient/appointments" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-primary shadow-md">
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-lg md:p-6">
        <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
            <UserRound size={30} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-primary">
              Dr. {appointment.doctors?.full_name || "N/A"}
            </h2>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-secondary">
              <Stethoscope size={14} />
              {appointment.doctors?.specializations?.name || "General Doctor"}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard icon={<UserRound size={18} />} label="Patient" value={appointment.patients?.full_name || "N/A"} />
          <InfoCard icon={<Calendar size={18} />} label="Date" value={appointment.appointment_date || "N/A"} />
          <InfoCard icon={<Clock size={18} />} label="Time" value={appointment.appointment_time || "N/A"} />
          <InfoCard icon={<Mail size={18} />} label="Doctor Email" value={appointment.doctors?.email || "N/A"} />
          <InfoCard icon={<Phone size={18} />} label="Doctor Phone" value={appointment.doctors?.phone || "N/A"} />
          <InfoCard label="Status" value={appointment.status || "pending"} />
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

export default MyAppointmentDetails;
