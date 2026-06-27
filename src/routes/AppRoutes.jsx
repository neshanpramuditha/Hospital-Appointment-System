import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Doctors from '../pages/Doctors'
import Patients from '../pages/Patients'
import Appointments from '../pages/Appointments'
import Login from '../pages/auth/Login'
import Dashboard from '../pages/Dashboard'
import Patient from "../pages/Patient";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard/*" element={<Dashboard />} />
        <Route path="/doctors/*" element={<Doctors />} />
        <Route path="/patients/*" element={<Patients />} />
        <Route path="/appointments/*" element={<Appointments />} />
        <Route path="/patient/*" element={<Patient />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes