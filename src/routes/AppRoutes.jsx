import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Doctors from '../pages/Doctors'
import Patients from '../pages/Patients'
import Appointments from '../pages/Appointments'
import Login from '../pages/auth/Login'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/doctors/*" element={<Doctors />} />
        <Route path="/patients/*" element={<Patients />} />
        <Route path="/appointments/*" element={<Appointments />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes