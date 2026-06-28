import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const totalDoctors = 12;
  const totalPatients = 145;
  const totalAppointments = 48;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">

      <AdminSidebar />
      
      <div className="flex-1 ml-64 flex flex-col">
        <Navbar onLogout={handleLogout} />
        
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Hello, Aswini!</h2>
            <p className="text-sm text-slate-500">Here is the quick hospital summary for today.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Card 1: Total Doctors */}
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Doctors</p>
                <h1 className="text-3xl font-bold text-slate-800 mt-2">{totalDoctors}</h1>
              </div>
              <div className="text-3xl bg-blue-50 p-3 rounded-lg">👨‍⚕️</div>
            </div>

            {/* Card 2: Total Patients */}
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Patients</p>
                <h1 className="text-3xl font-bold text-slate-800 mt-2">{totalPatients}</h1>
              </div>
              <div className="text-3xl bg-green-50 p-3 rounded-lg">👥</div>
            </div>

            {/* Card 3: Total Appointments */}
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-amber-500 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Appointments</p>
                <h1 className="text-3xl font-bold text-slate-800 mt-2">{totalAppointments}</h1>
              </div>
              <div className="text-3xl bg-amber-50 p-3 rounded-lg">📅</div>
            </div>

          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">📅 Upcoming Appointments Summary</h3>
              <span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-600 rounded-full">Today</span>
            </div>
            
            <div className="text-center py-8 text-slate-400 text-sm">
              No appointments scheduled for the next hour.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}