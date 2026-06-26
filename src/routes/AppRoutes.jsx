import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Doctors from '../pages/Doctors'
import Patients from '../pages/Patients'
import Appointments from '../pages/Appointments'
import Login from '../pages/auth/Login'
import PatientsList from '../pages/patients/PatientsList'
import AdminDashboard from '../pages/dashboard/AdminDashboard'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/doctors/*" element={<Doctors />} />
        <Route path="/patients/*" element={<Patients />} />
        <Route path="/appointments/*" element={<Appointments />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes