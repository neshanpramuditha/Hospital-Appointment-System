import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, UserRound } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../services/supabase";
import { getDoctorById, updateDoctor } from "../../services/doctorService";

function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [specializations, setSpecializations] = useState([]);
  const [doctor, setDoctor] = useState({
    full_name: "",
    email: "",
    phone: "",
    specialization_id: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const { data: specData, error: specError } = await supabase
      .from("specializations")
      .select("*")
      .order("name", { ascending: true });

    const { data: doctorData, error: doctorError } = await getDoctorById(id);

    if (specError) alert(specError.message);

    if (doctorError) {
      alert(doctorError.message);
      setLoading(false);
      return;
    }

    setSpecializations(specData || []);
    setDoctor({
      full_name: doctorData.full_name || "",
      email: doctorData.email || "",
      phone: doctorData.phone || "",
      specialization_id: doctorData.specialization_id || "",
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await updateDoctor(id, {
      full_name: doctor.full_name,
      email: doctor.email,
      phone: doctor.phone,
      specialization_id: doctor.specialization_id,
    });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Doctor updated successfully");
    navigate("/doctors");
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-white/80">
              Admin Module
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">Edit Doctor</h1>
            <p className="mt-1 max-w-lg text-sm text-white/80">
              Update doctor profile and specialization details.
            </p>
          </div>

          <Link
            to="/doctors"
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
            <UserRound size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary">Doctor Details</h2>
            <p className="text-sm text-gray-500">
              Modify doctor information below.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="py-10 text-center text-gray-500">
            Loading doctor...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Full Name"
                name="full_name"
                value={doctor.full_name}
                onChange={handleChange}
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={doctor.email}
                onChange={handleChange}
              />

              <Input
                label="Phone"
                name="phone"
                value={doctor.phone}
                onChange={handleChange}
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Specialization
                </label>

                <select
                  name="specialization_id"
                  value={doctor.specialization_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                >
                  <option value="">Select specialization</option>
                  {specializations.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/doctors")}
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
                {saving ? "Updating..." : "Update Doctor"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text", required }) {
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
        required={required}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}

export default EditDoctor;
