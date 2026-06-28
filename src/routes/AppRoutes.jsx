import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import HomePage from "../pages/HomePage";

import AuthPage from "../pages/auth/AuthPage";
import AuthCallback from "../pages/auth/AuthCallback";

import Unauthorized from "../pages/Unauthorized";

import Doctors from "../pages/Doctors";
import Patients from "../pages/Patients";
import Appointments from "../pages/Appointments";

import AdminDashboard from "../pages/dashboard/AdminDashboard";
import DoctorDashboard from "../pages/dashboard/DoctorDashboard";
import UserDashboard from "../pages/dashboard/UserDashboard";

import ProtectedRoute from "../components/ProtectedRoute";

import AdminLayout from "../layouts/AdminLayout";
import DoctorLayout from "../layouts/DoctorLayout";
import PatientLayout from "../layouts/PatientLayout";

import { ROLES } from "../utils/roles";

export default function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />}/>

        <Route path="/login" element={<AuthPage />}/>

        <Route
          path="/auth/callback"
          element={<AuthCallback />}
        />

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        {/* ===================== */}
        {/* ADMIN */}
        {/* ===================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.ADMIN]}
            />
          }
        >
          <Route element={<AdminLayout />}>

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/doctors"
              element={<Doctors />}
            />

            <Route
              path="/admin/patients"
              element={<Patients />}
            />

            <Route
              path="/admin/appointments"
              element={<Appointments />}
            />

          </Route>
        </Route>

        {/* ===================== */}
        {/* DOCTOR */}
        {/* ===================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.DOCTOR]}
            />
          }
        >
          <Route element={<DoctorLayout />}>

            <Route
              path="/doctor/dashboard"
              element={<DoctorDashboard />}
            />

            <Route
              path="/doctor/patients"
              element={<Patients />}
            />

            <Route
              path="/doctor/appointments"
              element={<Appointments />}
            />

          </Route>
        </Route>

        {/* ===================== */}
        {/* PATIENT */}
        {/* ===================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.PATIENT]}
            />
          }
        >
          <Route element={<PatientLayout />}>

            <Route
              path="/patient/dashboard"
              element={<UserDashboard />}
            />

            <Route
              path="/patient/appointments"
              element={<Appointments />}
            />

          </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to="/home" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}