import { Routes, Route } from "react-router-dom";

import DoctorsList from './doctors/DoctorsList'
import AddDoctor from './doctors/AddDoctor'
import DoctorDetails from './doctors/DoctorDetails'
import EditDoctor from './doctors/EditDoctor'

function Doctors() {
  return (
    <Routes>
      <Route index element={<DoctorsList />} />
      <Route path="add" element={<AddDoctor />} />
      <Route path="edit/:id" element={<EditDoctor />} />
      <Route path="details/:id" element={<DoctorDetails />} />
    </Routes>
  );
}

export default Doctors;