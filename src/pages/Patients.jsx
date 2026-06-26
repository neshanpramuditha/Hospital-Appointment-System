import { Routes, Route } from "react-router-dom";

import PatientsList from "./patients/PatientsList";
import AddPatient from "./patients/AddPatient";
import EditPatient from "./patients/EditPatient";
import PatientDetails from "./patients/PatientDetails";

function Patients() {
  return (
    <Routes>
      <Route index element={<PatientsList />} />
      <Route path="add" element={<AddPatient />} />
      <Route path="edit/:id" element={<EditPatient />} />
      <Route path="details:id" element={<PatientDetails />} />
    </Routes>
  );
}

export default Patients;