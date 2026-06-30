import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  Stethoscope,
  UserRound,
  Pencil,
} from "lucide-react";
import { isSupabaseConfigured } from "../../services/supabase";
import { getDoctorById } from "../../services/doctorService";

function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDoctor = async () => {
    setLoading(true);

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const { data, error } = await getDoctorById(id);

    if (error) alert(error.message);
    else setDoctor(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="text-gray-500">Loading doctor details...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="text-gray-500">Doctor not found.</p>
        <Link
          to="/doctors"
          className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-white"
        >
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
            <p className="mb-1 text-sm font-medium text-white/80">
              Admin Module
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">Doctor Details</h1>
            <p className="mt-1 max-w-lg text-sm text-white/80">
              View doctor profile and specialization information.
            </p>
          </div>

          <Link
            to="/doctors"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-primary shadow-md"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-lg md:p-6">
        <div className="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
              <UserRound size={30} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary">
                Dr. {doctor.full_name}
              </h2>
              <p className="text-sm text-gray-500">
                Doctor ID: {doctor.id.slice(0, 8)}
              </p>
            </div>
          </div>

          <Link
            to={`/doctors/edit/${doctor.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 font-semibold text-white shadow-md hover:opacity-90"
          >
            <Pencil size={18} />
            Edit Doctor
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard
            icon={<Stethoscope size={18} />}
            label="Specialization"
            value={doctor.specializations?.name || "General Doctor"}
          />

          <InfoCard
            icon={<Mail size={18} />}
            label="Email"
            value={doctor.email || "N/A"}
          />

          <InfoCard
            icon={<Phone size={18} />}
            label="Phone"
            value={doctor.phone || "N/A"}
          />

          <InfoCard
            icon={<Calendar size={18} />}
            label="Created Date"
            value={
              doctor.created_at
                ? new Date(doctor.created_at).toLocaleDateString()
                : "N/A"
            }
          />
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

export default DoctorDetails;
