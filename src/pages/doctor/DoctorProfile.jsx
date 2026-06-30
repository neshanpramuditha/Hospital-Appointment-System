import { useEffect, useState } from "react";
import { Save, Stethoscope, UserRound } from "lucide-react";

import { isSupabaseConfigured, supabase } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";

function DoctorProfile() {
  const { user } = useAuth();

  const [doctorId, setDoctorId] = useState(null);

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    specialization_id: "",
  });

  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    if (!isSupabaseConfigured || !user?.id) {
      setLoading(false);
      return;
    }

    const { data: specData, error: specError } = await supabase
      .from("specializations")
      .select("*")
      .order("name", { ascending: true });

    if (specError) {
      alert(specError.message);
      setLoading(false);
      return;
    }

    const { data: doctorData, error: doctorError } = await supabase
      .from("doctors")
      .select("*")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (doctorError) {
      alert(doctorError.message);
      setLoading(false);
      return;
    }

    setSpecializations(specData || []);

    if (!doctorData) {
      setDoctorId(null);
      setLoading(false);
      return;
    }

    setDoctorId(doctorData.id);

    setProfile({
      full_name: doctorData.full_name || "",
      email: doctorData.email || "",
      phone: doctorData.phone || "",
      specialization_id: doctorData.specialization_id || "",
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctorId) {
      alert("Doctor profile not found.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("doctors")
      .update({
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        specialization_id: profile.specialization_id,
      })
      .eq("id", doctorId);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Doctor profile updated successfully");
    fetchData();
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <p className="mb-1 text-sm font-medium text-white/80">
          Doctor Portal
        </p>

        <h1 className="text-2xl font-bold md:text-3xl">Doctor Profile</h1>

        <p className="mt-1 max-w-lg text-sm text-white/80">
          View and update your doctor profile information.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-lg md:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
            <UserRound size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary">
              Profile Information
            </h2>
            <p className="text-sm text-gray-500">
              Update your personal and specialization details.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="py-10 text-center text-gray-500">Loading profile...</p>
        ) : !doctorId ? (
          <p className="py-10 text-center text-gray-500">
            No doctor profile found for this account.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Doctor</p>
              <h3 className="mt-1 font-bold text-primary">
                Dr. {profile.full_name || "N/A"}
              </h3>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Full Name"
                name="full_name"
                value={profile.full_name}
                onChange={handleChange}
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
              />

              <Input
                label="Phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Specialization
                </label>

                <div className="relative">
                  <Stethoscope
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <select
                    name="specialization_id"
                    value={profile.specialization_id}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-11 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
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
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 font-semibold text-white shadow-md hover:opacity-90 disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
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

export default DoctorProfile;