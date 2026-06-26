import React from 'react';

function Navbar() {
  return (
    <div className="h-16 bg-white flex justify-between items-center px-8 shadow-sm border-b border-slate-100">
      <h3 className="text-lg font-semibold text-slate-700">Hospital Dashboard Overview</h3>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-800">Welcome, Admin</p>
          <p className="text-xs text-green-500 font-medium">● Online</p>
        </div>
        <button className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-md hover:bg-rose-700 transition shadow-sm">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;