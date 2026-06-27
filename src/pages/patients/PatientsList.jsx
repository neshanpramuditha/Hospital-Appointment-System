import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../services/supabase";

function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [dobFrom, setDobFrom] = useState("");
  const [dobTo, setDobTo] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    setLoading(true);

    if (!isSupabaseConfigured) {
      setPatients([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) alert(error.message);
    else setPatients(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const deletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;

    const { error } = await supabase.from("patients").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchPatients();
  };

  const clearFilters = () => {
    setSearch("");
    setDobFrom("");
    setDobTo("");
    setSortBy("newest");
  };

  const filteredPatients = useMemo(() => {
    let result = [...patients];

    const keyword = search.trim().toLowerCase();

    if (keyword) {
      result = result.filter((patient) => {
        return (
          patient.full_name?.toLowerCase().includes(keyword) ||
          patient.email?.toLowerCase().includes(keyword) ||
          patient.phone?.includes(search.trim()) ||
          patient.id?.toLowerCase().includes(keyword)
        );
      });
    }

    if (dobFrom) {
      result = result.filter(
        (patient) => patient.date_of_birth && patient.date_of_birth >= dobFrom
      );
    }

    if (dobTo) {
      result = result.filter(
        (patient) => patient.date_of_birth && patient.date_of_birth <= dobTo
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name_asc") {
        return (a.full_name || "").localeCompare(b.full_name || "");
      }

      if (sortBy === "name_desc") {
        return (b.full_name || "").localeCompare(a.full_name || "");
      }

      if (sortBy === "oldest") {
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      }

      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

    return result;
  }, [patients, search, dobFrom, dobTo, sortBy]);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-white/80">
              Patient Records
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">
              Patients Management
            </h1>
            <p className="mt-1 max-w-lg text-sm text-white/80">
              Manage patient profiles and contact details.
            </p>
          </div>

          <Link
            to="/patients/add"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-primary shadow-md transition hover:scale-105 md:w-auto"
          >
            <Plus size={18} />
            Add Patient
          </Link>
        </div>
      </div>

      {!isSupabaseConfigured && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Supabase is not configured yet. Set environment variables to load patient records.
        </div>
      )}

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <p className="text-sm text-gray-500">Total Patients</p>
          <h2 className="mt-1 text-3xl font-bold text-primary">
            {patients.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-md">
          <p className="text-sm text-gray-500">Current Results</p>
          <h2 className="mt-1 text-3xl font-bold text-accent">
            {filteredPatients.length}
          </h2>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-lg md:p-5">
        <div className="mb-5">
          <div className="mb-4 flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-primary" />
            <div>
              <h2 className="text-lg font-bold text-primary">
                Search & Filters
              </h2>
              <p className="text-sm text-gray-500">
                Filter by keyword, date of birth, or sorting order.
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
                placeholder="Search name, email, phone, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-11 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            </div>

            <input
              type="date"
              value={dobFrom}
              onChange={(e) => setDobFrom(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />

            <input
              type="date"
              value={dobTo}
              onChange={(e) => setDobTo(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 md:col-span-2"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="name_asc">Sort: Name A-Z</option>
              <option value="name_desc">Sort: Name Z-A</option>
            </select>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 md:col-span-2"
            >
              <X size={17} />
              Clear Filters
            </button>
          </div>
        </div>

        <div className="mb-5 border-t border-gray-100 pt-5">
          <h2 className="text-lg font-bold text-primary">Patient List</h2>
          <p className="text-sm text-gray-500">
            Search, view, edit, or delete patient records.
          </p>
        </div>

        <div className="grid gap-4 md:hidden">
          {loading ? (
            <p className="py-8 text-center text-gray-500">Loading patients...</p>
          ) : filteredPatients.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No patients found.</p>
          ) : (
            filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                    <UserRound size={21} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800">
                      {patient.full_name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      ID: {patient.id.slice(0, 8)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold text-gray-700">Email:</span>{" "}
                    {patient.email || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Phone:</span>{" "}
                    {patient.phone || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">DOB:</span>{" "}
                    {patient.date_of_birth || "N/A"}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/patients/details/${patient.id}`}
                    className="flex flex-1 items-center justify-center rounded-xl bg-accent/10 py-2 text-secondary"
                  >
                    <Eye size={17} />
                  </Link>

                  <Link
                    to={`/patients/edit/${patient.id}`}
                    className="flex flex-1 items-center justify-center rounded-xl bg-primary/10 py-2 text-primary"
                  >
                    <Pencil size={17} />
                  </Link>

                  <button
                    onClick={() => deletePatient(patient.id)}
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
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Date of Birth</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    Loading patients...
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No patients found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-t border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                          <UserRound size={19} />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {patient.full_name}
                          </p>
                          <p className="text-xs text-gray-400">
                            ID: {patient.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {patient.email || "N/A"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {patient.phone || "N/A"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600">
                      {patient.date_of_birth || "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/patients/details/${patient.id}`}
                          className="rounded-lg bg-accent/10 p-2 text-secondary hover:bg-accent hover:text-white"
                        >
                          <Eye size={17} />
                        </Link>

                        <Link
                          to={`/patients/edit/${patient.id}`}
                          className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary hover:text-white"
                        >
                          <Pencil size={17} />
                        </Link>

                        <button
                          onClick={() => deletePatient(patient.id)}
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

export default PatientsList;