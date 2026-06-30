import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CalendarPlus,
  Clock,
  Mail,
  Phone,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";
import { getPatientByUserId } from "../../services/patientService";

function PatientDoctorDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [, setPatientId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctorDetails = async () => {
    setLoading(true);

    if (!isSupabaseConfigured || !user?.id) {
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
      setPatientId(null);
      setDoctor(null);
      setSchedules([]);
      setLoading(false);
      return;
    }

    setPatientId(patient.id);

    const { data: doctorData, error: doctorError } = await supabase
      .from("doctors")
      .select(`
        id,
        full_name,
        specialization_id,
        email,
        phone,
        created_at,
        specializations (
          id,
          name
        )
      `)
      .eq("id", id)
      .single();

    if (doctorError) {
      alert(doctorError.message);
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const { data: scheduleData, error: scheduleError } = await supabase
      .from("schedules")
      .select("*")
      .eq("doctor_id", id)
      .gte("available_date", today)
      .order("available_date", { ascending: true });

    if (scheduleError) {
      alert(scheduleError.message);
    }

    setDoctor(doctorData);
    setSchedules(scheduleData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, [id, user?.id]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="text-gray-500">Loading doctor details...</p>
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
              Doctor Profile
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">
              Dr. {doctor.full_name}
            </h1>
            <p className="mt-1 max-w-lg text-sm text-white/80">
              View doctor information and available schedules.
            </p>
          </div>

          <Link
            to="/patient/doctors"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-primary shadow-md transition hover:scale-105 md:w-auto"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>
      </div>

      <div className="mb-5 rounded-2xl bg-white p-5 shadow-lg md:p-6">
        <div className="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-md">
              <UserRound size={30} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary">
                Dr. {doctor.full_name}
              </h2>

              <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-secondary">
                <Stethoscope size={14} />
                {doctor.specializations?.name || "General Doctor"}
              </div>
            </div>
          </div>

          <Link
            to={`/patient/book/${doctor.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 font-semibold text-white shadow-md hover:opacity-90"
          >
            <CalendarPlus size={18} />
            Book Appointment
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Mail size={18} />
              <p className="font-semibold">Email</p>
            </div>
            <p className="text-gray-700">{doctor.email || "N/A"}</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Phone size={18} />
              <p className="font-semibold">Phone</p>
            </div>
            <p className="text-gray-700">{doctor.phone || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-lg md:p-6">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-primary">
            Available Schedules
          </h2>
          <p className="text-sm text-gray-500">
            Select a doctor schedule when booking an appointment.
          </p>
        </div>

        {schedules.length === 0 ? (
          <div className="rounded-xl bg-gray-50 p-6 text-center text-gray-500">
            No schedules available for this doctor.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
              >
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <Calendar size={18} />
                  <p className="font-semibold">
                    {schedule.available_date || "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={18} className="text-primary" />
                  <p>
                    {schedule.start_time || "N/A"} -{" "}
                    {schedule.end_time || "N/A"}
                  </p>
                </div>

                <Link
                  to={`/patient/book/${doctor.id}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
                >
                  <CalendarPlus size={17} />
                  Book This Doctor
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDoctorDetails;
