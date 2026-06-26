import React from 'react';

export default function AdminSidebar() {
  return (
    <div className="w-64 h-screen bg-slate-900 text-white p-5 fixed left-0 top-0 border-r border-slate-800">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-blue-500 tracking-wide">Hospital System</h2>
        <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
      </div>
      
      <ul className="space-y-2">
        <li className="flex items-center gap-3 p-3 bg-blue-600 rounded-lg cursor-pointer font-medium hover:bg-blue-700 transition">
          <span>📊</span> Dashboard
        </li>
        <li className="flex items-center gap-3 p-3 text-slate-300 rounded-lg cursor-pointer hover:bg-slate-800 hover:text-white transition">
          <span>👨‍⚕️</span> Doctors Summary
        </li>
        <li className="flex items-center gap-3 p-3 text-slate-300 rounded-lg cursor-pointer hover:bg-slate-800 hover:text-white transition">
          <span>👥</span> Patients Summary
        </li>
        <li className="flex items-center gap-3 p-3 text-slate-300 rounded-lg cursor-pointer hover:bg-slate-800 hover:text-white transition">
          <span>📅</span> Appointment Summary
        </li>
      </ul>
    </div>
  );
}

