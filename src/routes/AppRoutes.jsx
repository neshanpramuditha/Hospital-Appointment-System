import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Doctors from '../pages/Doctors'
import Patients from '../pages/Patients'
import Appointments from '../pages/Appointments'
import Login from '../pages/auth/Login'
import Dashboard from '../pages/Dashboard'
import Patient from "../pages/Patient";
import Schedules from "../pages/Schedules";

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
import DoctorDashboard from "../pages/dashboard/DoctorDashboard";
import UserDashboard from "../pages/dashboard/UserDashboard";
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
        <Route path="/dashboard/user" element={<UserDashboard />}/>
        <Route path="/patient/home" element={<PatientHome />} />
        <Route path="/patient/appointments" element={<Appointments />}/></Route>

        {/* Doctor */}
        <Route element={ <ProtectedRoute allowedRoles={[ROLES.DOCTOR]} />}>
        <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<Appointments />} />
        <Route path="/doctor/patients" element={<Patients />}/>
        </Route>

        {/* Admin */}
        <Route element={ <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="/dashboard/admin" element={<AdminDashboard/>}/>
        <Route path="/doctors/*" element={<Doctors />}/>
        <Route path="/patients/*" element={<Patients/>} />
        <Route path="/appointments/*" element={<Appointments />}/>
        <Route path="/schedules/*" element={<Schedules />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />}/>

      </Routes>

    </BrowserRouter>
  );
}