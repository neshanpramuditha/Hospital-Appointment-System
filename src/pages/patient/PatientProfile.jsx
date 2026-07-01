import { useEffect, useState } from "react";
import { LockKeyhole, Save, UserRound } from "lucide-react";

import { isSupabaseConfigured } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";
import {
  changePatientPassword,
  getPatientByUserId,
  updatePatient,
} from "../../services/patientService";
import toast from "react-hot-toast";

function PatientProfile() {
  const { user } = useAuth();

  const [patientId, setPatientId] = useState(null);

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
  });

  const [security, setSecurity] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const fetchPatient = async () => {
    setLoading(true);

    if (!isSupabaseConfigured || !user?.id) {
      setLoading(false);
      return;
    }

    const { data, error } = await getPatientByUserId(user.id);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (!data) {
      setPatientId(null);
      setLoading(false);
      return;
    }

    setPatientId(data.id);

    setProfile({
      full_name: data.full_name || "",
      email: data.email || "",
      phone: data.phone || "",
      date_of_birth: data.date_of_birth || "",
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchPatient();
  }, [user?.id]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSecurityChange = (e) => {
    setSecurity({
      ...security,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId) {
      toast.error("Patient profile not found.");
      return;
    }

    setSaving(true);

    const { error } = await updatePatient(patientId, {
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        date_of_birth: profile.date_of_birth,
      });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    toast.success("Profile updated successfully");
    fetchPatient();
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (security.newPassword !== security.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setChangingPassword(true);

    const { error } = await changePatientPassword(security.newPassword);

    setChangingPassword(false);

    if (error) {
      alert(error.message);
      return;
    }

    setSecurity({
      newPassword: "",
      confirmPassword: "",
    });
    toast.success("Password updated successfully");
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <p className="mb-1 text-sm font-medium text-white/80">
          Patient Portal
        </p>

        <h1 className="text-2xl font-bold md:text-3xl">My Profile</h1>

        <p className="mt-1 max-w-lg text-sm text-white/80">
          View and update your patient profile information.
        </p>
      </div>

      <div className="mb-5 rounded-2xl bg-white p-5 shadow-lg md:p-6">
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
        ) : !patientId ? (
          <p className="py-10 text-center text-gray-500">
            No patient profile found for this account.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5">
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

      <div className="rounded-2xl bg-white p-5 shadow-lg md:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
            <LockKeyhole size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary">Security</h2>
            <p className="text-sm text-gray-500">
              Change your account password.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={security.newPassword}
              onChange={handleSecurityChange}
              required
              minLength={6}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={security.confirmPassword}
              onChange={handleSecurityChange}
              required
              minLength={6}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 font-semibold text-white shadow-md hover:opacity-90 disabled:opacity-60"
            >
              <Save size={18} />
              {changingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  minLength,
}) {
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
        minLength={minLength}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}

export default PatientProfile;
