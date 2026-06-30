import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarPlus,
  Eye,
  Mail,
  Phone,
  Search,
  SlidersHorizontal,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";
import { getPatientByUserId } from "../../services/patientService";

function FindDoctors() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [, setPatientId] = useState(null);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [sortBy, setSortBy] = useState("name_asc");
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    setLoading(true);

    if (!isSupabaseConfigured || !user?.id) {
      setDoctors([]);
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
      setDoctors([]);
      setLoading(false);
      return;
    }

    setPatientId(patient.id);

    const { data, error } = await supabase
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
      .order("full_name", { ascending: true });

    if (error) {
      alert(error.message);
    } else {
      setDoctors(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, [user?.id]);

  const specializations = useMemo(() => {
    const values = doctors
      .map((doctor) => doctor.specializations?.name)
      .filter(Boolean);

    return ["all", ...new Set(values)];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    let result = [...doctors];
    const keyword = search.trim().toLowerCase();

    if (keyword) {
      result = result.filter((doctor) => {
        const specializationName = doctor.specializations?.name || "";

        return (
          doctor.full_name?.toLowerCase().includes(keyword) ||
          doctor.email?.toLowerCase().includes(keyword) ||
          doctor.phone?.includes(search.trim()) ||
          specializationName.toLowerCase().includes(keyword) ||
          doctor.id?.toLowerCase().includes(keyword)
        );
      });
    }

    if (specialization !== "all") {
      result = result.filter(
        (doctor) => doctor.specializations?.name === specialization
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name_desc") {
        return (b.full_name || "").localeCompare(a.full_name || "");
      }

      if (sortBy === "newest") {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }

      if (sortBy === "oldest") {
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      }

      return (a.full_name || "").localeCompare(b.full_name || "");
    });

    return result;
  }, [doctors, search, specialization, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setSpecialization("all");
    setSortBy("name_asc");
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-white/80">
              Patient Portal
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">Find Doctors</h1>
            <p className="mt-1 max-w-lg text-sm text-white/80">
              Browse doctors by name, contact details, or specialization.
            </p>
          </div>

          <div className="rounded-xl bg-white/15 px-4 py-3 text-sm font-semibold text-white">
            {filteredDoctors.length} Result{filteredDoctors.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      {!isSupabaseConfigured && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Supabase is not configured yet. Set environment variables to load doctors.
        </div>
      )}

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <p className="text-sm text-gray-500">Total Doctors</p>
          <h2 className="mt-1 text-3xl font-bold text-primary">
            {doctors.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-md">
          <p className="text-sm text-gray-500">Search Results</p>
          <h2 className="mt-1 text-3xl font-bold text-accent">
            {filteredDoctors.length}
          </h2>
        </div>
      </div>

      <div className="mb-5 rounded-2xl bg-white p-4 shadow-lg md:p-5">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-primary" />
          <div>
            <h2 className="text-lg font-bold text-primary">
              Search & Filter Doctors
            </h2>
            <p className="text-sm text-gray-500">
              Find the right doctor for your appointment.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search name, email, phone, specialization, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-11 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          >
            {specializations.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All Specializations" : item}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          >
            <option value="name_asc">Sort: Name A-Z</option>
            <option value="name_desc">Sort: Name Z-A</option>
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 md:col-span-4"
          >
            <X size={17} />
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="text-gray-500">Loading doctors...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="text-gray-500">No doctors found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-md">
                  <UserRound size={26} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-bold text-primary">
                    Dr. {doctor.full_name}
                  </h3>

                  <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-secondary">
                    <Stethoscope size={14} />
                    {doctor.specializations?.name || "General Doctor"}
                  </div>

                  <p className="mt-1 text-xs text-gray-400">
                    ID: {doctor.id.slice(0, 8)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-primary" />
                  {doctor.email || "N/A"}
                </p>

                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-primary" />
                  {doctor.phone || "N/A"}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link
                  to={`/patient/doctors/${doctor.id}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
                >
                  <Eye size={17} />
                  View Profile
                </Link>

                <Link
                  to={`/patient/book/${doctor.id}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90"
                >
                  <CalendarPlus size={17} />
                  Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FindDoctors;
