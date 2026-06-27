import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { supabase } from '../../utils/supabaseClient'; 

function Dashboard() {
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        setLoading(true);

        const { count: doctorsCount, error: docError } = await supabase
          .from('doctors')
          .select('*', { count: 'exact', head: true });

        const { count: patientsCount, error: patError } = await supabase
          .from('patients')
          .select('*', { count: 'exact', head: true });

        const { count: appointmentsCount, error: aptError } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true });

        const { data: recentData, error: recentError } = await supabase
          .from('appointments')
          .select(`
            id,
            appointment_time,
            status,
            patients ( full_name ),
            doctors ( full_name )
          `)
          .order('created_at', { ascending: false })
          .limit(4);

        if (!docError) setTotalDoctors(doctorsCount || 0);
        if (!patError) setTotalPatients(patientsCount || 0);
        if (!aptError) setTotalAppointments(appointmentsCount || 0);
        if (!recentError) setRecentAppointments(recentData || []);

      } catch (error) {
        console.error("Supabase fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupabaseData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row bg-[#F0F3BD] min-h-screen font-sans">
      <Sidebar />
      
      <div className="flex-1 md:ml-64 flex flex-col min-w-0 w-full">
        <Navbar />
        
        <div className="p-4 md:p-8">
          
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Hello, Aswini!</h2>
              <p className="text-sm text-slate-500">Hospital statistics directly fetched from Supabase.</p>
            </div>
            <span className="text-sm px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 font-medium text-slate-600">
              ⚡ Supabase Live Backend
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#05668D] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Doctors</p>
                <h1 className="text-3xl font-bold text-slate-800 mt-2">{loading ? "..." : totalDoctors}</h1>
              </div>
              <div className="text-2xl bg-[#05668D]/10 text-[#05668D] p-3 rounded-xl">👨‍⚕️</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#028090] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Patients</p>
                <h1 className="text-3xl font-bold text-slate-800 mt-2">{loading ? "..." : totalPatients}</h1>
              </div>
              <div className="text-2xl bg-[#028090]/10 text-[#028090] p-3 rounded-xl">👥</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#02C39A] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Appointments</p>
                <h1 className="text-3xl font-bold text-slate-800 mt-2">{loading ? "..." : totalAppointments}</h1>
              </div>
              <div className="text-2xl bg-[#02C39A]/10 text-[#02C39A] p-3 rounded-xl">📅</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">📅 Recent Appointments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase">
                    <th className="pb-3">Appt ID</th>
                    <th className="pb-3">Patient Name</th>
                    <th className="pb-3">Doctor Name</th>
                    <th className="pb-3">Time</th>
                    <th className="pb-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentAppointments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-slate-400">No data found in Supabase yet.</td>
                    </tr>
                  ) : (
                    recentAppointments.map((appt) => (
                      <tr key={appt.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                        <td className="py-3.5 font-medium text-slate-600">{appt.id.substring(0, 8)}...</td>
                        <td className="py-3.5 font-semibold text-slate-800">{appt.patients?.full_name || "N/A"}</td>
                        <td className="py-3.5 text-slate-600">{appt.doctors?.full_name || "N/A"}</td>
                        <td className="py-3.5 text-slate-500">{appt.appointment_time}</td>
                        <td className="py-3.5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            appt.status === "Confirmed" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {appt.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;