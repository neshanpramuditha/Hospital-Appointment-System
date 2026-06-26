import { Routes, Route } from "react-router-dom";

import AdminDashboard from "./dashboard/AdminDashboard";
import DoctorDashboard from "./dashboard/DoctorDashboard";
import UserDashboard from "./dashboard/UserDashboard";


function Dashboard() {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="doctor" element={<DoctorDashboard />} />
      <Route path="user" element={<UserDashboard />} />
    </Routes>
  );
}

export default Dashboard;