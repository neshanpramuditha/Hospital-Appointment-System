import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import AuthPage from "../pages/auth/AuthPage";
import AuthCallback from "../pages/auth/AuthCallback";
import Unauthorized from "../pages/Unauthorized";

import ProtectedRoute from "../components/ProtectedRoute";

import { ROLES } from "../utils/roles";

import AdminDashboard from "../pages/dashboard/AdminDashboard";
import DoctorDashboard from "../pages/dashboard/DoctorDashboard";
import UserDashboard from "../pages/dashboard/UserDashboard";

import Doctors from "../pages/Doctors";
import Patients from "../pages/Patients";
import Appointments from "../pages/Appointments";
import Schedules from "../pages/Schedules";

import Patient from "../pages/Patient";
import Doctor from "../pages/Doctor";
import HomePage from "../pages/HomePage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Patient */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.PATIENT]} />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard/user" element={<UserDashboard />} />
            <Route path="/patient/*" element={<Patient />} />
          </Route>
        </Route>

        {/* Doctor */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.DOCTOR]} />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
            <Route path="/doctor/*" element={<Doctor />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/doctors/*" element={<Doctors />} />
            <Route path="/patients/*" element={<Patients />} />
            <Route path="/appointments/*" element={<Appointments />} />
            <Route path="/schedules/*" element={<Schedules />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}