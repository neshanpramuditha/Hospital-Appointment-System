import { Routes, Route } from "react-router-dom";

import FindDoctors from "./patient/FindDoctors";
import PatientDoctorDetails from "./patient/PatientDoctorDetails";
import BookAppointment from "./patient/BookAppointment";
import MyAppointments from "./patient/MyAppointments";
import MyAppointmentDetails from "./patient/MyAppointmentDetails";
import PatientProfile from "./patient/PatientProfile";

function Patient() {
  return (
    <Routes>
      <Route path="doctors" element={<FindDoctors />} />
      <Route path="doctors/:id" element={<PatientDoctorDetails />} />
      <Route path="book/:doctorId" element={<BookAppointment />} />
      <Route path="appointments" element={<MyAppointments />} />
      <Route path="appointments/:id" element={<MyAppointmentDetails />} />
      <Route path="profile" element={<PatientProfile />} />
    </Routes>
  );
}

export default Patient;