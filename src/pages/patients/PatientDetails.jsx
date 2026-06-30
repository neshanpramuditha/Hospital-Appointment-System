import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Mail,
  Pencil,
  Phone,
  UserRound,
} from "lucide-react";
import { isSupabaseConfigured } from "../../services/supabase";
import { getPatientById } from "../../services/patientService";

function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPatient = async () => {
    setLoading(true);

    if (!isSupabaseConfigured) {
      setPatient(null);
      setLoading(false);
      return;
    }

    const { data, error } = await getPatientById(id);

    if (error) {
      alert(error.message);
    } else {
      setPatient(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="text-gray-500">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="text-gray-500">Patient not found.</p>
          <Link
            to="/patients"
            className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-white"
          >
            Back to Patients
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
              Patient Profile
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">
              Patient Details
            </h1>
            <p className="mt-1 max-w-lg text-sm text-white/80">
              View patient profile and contact information.
            </p>
          </div>

          <Link
            to="/patients"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-primary shadow-md transition hover:scale-105 md:w-auto"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-lg md:p-6">
        <div className="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-md">
              <UserRound size={30} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary">
                {patient.full_name}
              </h2>
              <p className="text-sm text-gray-500">
                Patient ID: {patient.id.slice(0, 8)}
              </p>
            </div>
          </div>

          <Link
            to={`/patients/edit/${patient.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 font-semibold text-white shadow-md hover:opacity-90"
          >
            <Pencil size={18} />
            Edit Patient
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Mail size={18} />
              <p className="font-semibold">Email</p>
            </div>
            <p className="text-gray-700">{patient.email || "N/A"}</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Phone size={18} />
              <p className="font-semibold">Phone</p>
            </div>
            <p className="text-gray-700">{patient.phone || "N/A"}</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Calendar size={18} />
              <p className="font-semibold">Date of Birth</p>
            </div>
            <p className="text-gray-700">{patient.date_of_birth || "N/A"}</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Calendar size={18} />
              <p className="font-semibold">Registered Date</p>
            </div>
            <p className="text-gray-700">
              {patient.created_at
                ? new Date(patient.created_at).toLocaleString("en-LK", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDetails;
