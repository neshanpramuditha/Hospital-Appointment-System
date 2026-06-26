import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Plus, Search, Trash2, UserRound } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../services/supabase";

function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
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

    if (error) {
      alert(error.message);
    } else {
      setPatients(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const deletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    const { error } = await supabase.from("patients").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchPatients();
  };

  const filteredPatients = patients.filter((patient) => {
    const keyword = search.toLowerCase();

    return (
      patient.full_name?.toLowerCase().includes(keyword) ||
      patient.email?.toLowerCase().includes(keyword) ||
      patient.phone?.includes(search)
    );
  });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 rounded-3xl bg-linear-to-r from-primary via-secondary to-accent p-8 text-white shadow-xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-white/80">
              Patient Records
            </p>
            <h1 className="text-3xl font-bold">Patients Management</h1>
            <p className="mt-2 max-w-xl text-sm text-white/80">
              Manage patient profiles, contact details, and appointment-related
              patient records.
            </p>
          </div>

          <Link
            to="/patients/add"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-primary shadow-lg transition hover:scale-105"
          >
            <Plus size={18} />
            Add Patient
          </Link>
        </div>
      </div>

      {!isSupabaseConfigured && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Supabase is not configured yet. Set the environment variables to load patient records from the database.
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-md">
          <p className="text-sm text-gray-500">Total Patients</p>
          <h2 className="mt-2 text-3xl font-bold text-primary">
            {patients.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-md">
          <p className="text-sm text-gray-500">Registered Patients</p>
          <h2 className="mt-2 text-3xl font-bold text-accent">
            {patients.length}
          </h2>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">Patient List</h2>
            <p className="text-sm text-gray-500">
              Search, view, edit, or delete patient records.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-11 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="px-5 py-4">Patient</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Date of Birth</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Loading patients...
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No patients found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-t border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-accent text-white">
                          <UserRound size={20} />
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

                    <td className="px-5 py-4 text-gray-600">
                      {patient.email || "N/A"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {patient.phone || "N/A"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {patient.date_of_birth || "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/patients/details/${patient.id}`}
                          className="rounded-xl bg-accent/10 p-2 text-secondary hover:bg-accent hover:text-white"
                        >
                          <Eye size={18} />
                        </Link>

                        <Link
                          to={`/patients/edit/${patient.id}`}
                          className="rounded-xl bg-primary/10 p-2 text-primary hover:bg-primary hover:text-white"
                        >
                          <Pencil size={18} />
                        </Link>

                        <button
                          onClick={() => deletePatient(patient.id)}
                          className="rounded-xl bg-red-50 p-2 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={18} />
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