import { useEffect, useState } from "react";
import { Save, UserRound } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../services/supabase";

function PatientProfile() {
  const [patients, setPatients] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("full_name", { ascending: true });

    if (error) {
      alert(error.message);
    } else {
      setPatients(data || []);

      if (data?.length > 0) {
        setSelectedId(data[0].id);
        setProfile({
          full_name: data[0].full_name || "",
          email: data[0].email || "",
          phone: data[0].phone || "",
          date_of_birth: data[0].date_of_birth || "",
        });
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handlePatientChange = (id) => {
    setSelectedId(id);

    const patient = patients.find((p) => p.id === id);

    if (patient) {
      setProfile({
        full_name: patient.full_name || "",
        email: patient.email || "",
        phone: patient.phone || "",
        date_of_birth: patient.date_of_birth || "",
      });
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedId) {
      alert("Please select a patient.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("patients")
      .update({
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        date_of_birth: profile.date_of_birth,
      })
      .eq("id", selectedId);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile updated successfully");
    fetchPatients();
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <p className="mb-1 text-sm font-medium text-white/80">
          Patient Portal
        </p>
        <h1 className="text-2xl font-bold md:text-3xl">My Profile</h1>
        <p className="mt-1 max-w-lg text-sm text-white/80">
          View and update patient profile information.
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
              Update your personal details.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="py-10 text-center text-gray-500">Loading profile...</p>
        ) : patients.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            No patient profile found.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Select Patient
              </label>
              <select
                value={selectedId}
                onChange={(e) => handlePatientChange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
              >
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.full_name} - {patient.phone}
                  </option>
                ))}
              </select>
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
                required
              />

              <Input
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={profile.date_of_birth}
                onChange={handleChange}
              />
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

export default PatientProfile;