import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  Stethoscope,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { isSupabaseConfigured } from "../../services/supabase";
import { deleteDoctor, getDoctors } from "../../services/doctorService";

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    setLoading(true);

    if (!isSupabaseConfigured) {
      setDoctors([]);
      setLoading(false);
      return;
    }

    const { data, error } = await getDoctors();

    if (error) alert(error.message);
    else setDoctors(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    const { error } = await deleteDoctor(id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchDoctors();
  };

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
        const specialization = doctor.specializations?.name || "";

        return (
          doctor.full_name?.toLowerCase().includes(keyword) ||
          doctor.email?.toLowerCase().includes(keyword) ||
          doctor.phone?.includes(search.trim()) ||
          specialization.toLowerCase().includes(keyword) ||
          doctor.id?.toLowerCase().includes(keyword)
        );
      });
    }

    if (specializationFilter !== "all") {
      result = result.filter(
        (doctor) => doctor.specializations?.name === specializationFilter
      );
    }

    return result;
  }, [doctors, search, specializationFilter]);

  const clearFilters = () => {
    setSearch("");
    setSpecializationFilter("all");
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-white/80">
              Admin Module
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">
              Doctors Management
            </h1>
            <p className="mt-1 max-w-lg text-sm text-white/80">
              Manage doctor records, contact details, and specializations.
            </p>
          </div>

          <Link
            to="/doctors/add"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-primary shadow-md transition hover:scale-105 md:w-auto"
          >
            <Plus size={18} />
            Add Doctor
          </Link>
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
          <p className="text-sm text-gray-500">Current Results</p>
          <h2 className="mt-1 text-3xl font-bold text-accent">
            {filteredDoctors.length}
          </h2>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-lg md:p-5">
        <div className="mb-5 grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search doctor, email, phone, specialization, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-11 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          >
            {specializations.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All Specializations" : item}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            <X size={17} />
            Clear
          </button>
        </div>

        <div className="mb-5 border-t border-gray-100 pt-5">
          <h2 className="text-lg font-bold text-primary">Doctors List</h2>
          <p className="text-sm text-gray-500">
            Search, view, edit, or delete doctor records.
          </p>
        </div>

        <div className="grid gap-4 md:hidden">
          {loading ? (
            <p className="py-8 text-center text-gray-500">Loading doctors...</p>
          ) : filteredDoctors.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No doctors found.</p>
          ) : (
            filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                    <UserRound size={21} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800">
                      Dr. {doctor.full_name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      ID: {doctor.id.slice(0, 8)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Stethoscope size={16} className="text-primary" />
                    {doctor.specializations?.name || "General Doctor"}
                  </p>

                  <p className="flex items-center gap-2">
                    <Mail size={16} className="text-primary" />
                    {doctor.email || "N/A"}
                  </p>

                  <p className="flex items-center gap-2">
                    <Phone size={16} className="text-primary" />
                    {doctor.phone || "N/A"}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/doctors/details/${doctor.id}`}
                    className="flex flex-1 items-center justify-center rounded-xl bg-accent/10 py-2 text-secondary"
                  >
                    <Eye size={17} />
                  </Link>

                  <Link
                    to={`/doctors/edit/${doctor.id}`}
                    className="flex flex-1 items-center justify-center rounded-xl bg-primary/10 py-2 text-primary"
                  >
                    <Pencil size={17} />
                  </Link>

                  <button
                    onClick={() => handleDeleteDoctor(doctor.id)}
                    className="flex flex-1 items-center justify-center rounded-xl bg-red-50 py-2 text-red-500"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden overflow-x-auto rounded-xl border border-gray-100 md:block">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Specialization</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    Loading doctors...
                  </td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No doctors found.
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="border-t border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                          <UserRound size={19} />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            Dr. {doctor.full_name}
                          </p>
                          <p className="text-xs text-gray-400">
                            ID: {doctor.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {doctor.specializations?.name || "General Doctor"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {doctor.email || "N/A"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {doctor.phone || "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/doctors/details/${doctor.id}`}
                          className="rounded-lg bg-accent/10 p-2 text-secondary hover:bg-accent hover:text-white"
                        >
                          <Eye size={17} />
                        </Link>

                        <Link
                          to={`/doctors/edit/${doctor.id}`}
                          className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary hover:text-white"
                        >
                          <Pencil size={17} />
                        </Link>

                        <button
                          onClick={() => handleDeleteDoctor(doctor.id)}
                          className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DoctorsList;

