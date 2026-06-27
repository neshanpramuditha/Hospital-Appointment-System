import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "../pages/auth/AuthPage";
import AuthCallback from "../pages/auth/AuthCallback";
import Dashboard from "../pages/Dashboard";
import Doctors from "../pages/Doctors";
import Patients from "../pages/Patients";
import Appointments from "../pages/Appointments";
import Unauthorized from "../pages/Unauthorized";

import ProtectedRoute from "../components/ProtectedRoute";

import { ROLES } from "../utils/roles";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import PatientHome from "../pages/patients/patientHome";

export default function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public */}
        <Route path="/" element={<Navigate to="/login" replace />}/>
        <Route path="/login" element={<AuthPage />}/>
        <Route path="/auth/callback" element={<AuthCallback />}/>
        <Route path="/unauthorized" element={<Unauthorized />}/>

        {/* Patient */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.PATIENT]}/>}>
        <Route path="/patient/dashboard" element={<Dashboard />}/>
        <Route path="/patient/home" element={<PatientHome />} />
        <Route path="/patient/appointments" element={<Appointments />}/></Route>

        {/* Doctor */}
        <Route element={ <ProtectedRoute allowedRoles={[ROLES.DOCTOR]} />}>
        <Route path="/doctor/dashboard" element={<Dashboard />} />
        <Route path="/doctor/appointments" element={<Appointments />} />
        <Route path="/doctor/patients" element={<Patients />}/>
        </Route>

        {/* Admin */}
        <Route element={ <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="/admin/dashboard/*" element={<AdminDashboard/>}/>
        <Route path="/admin/doctors" element={<Doctors />}/>
        <Route path="/admin/patients" element={<Patients/>} />
        <Route path="/admin/appointments" element={<Appointments />}/>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />}/>

      </Routes>

    </BrowserRouter>
  );
}