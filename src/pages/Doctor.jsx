import { Routes, Route } from "react-router-dom";

import MyAppointments from "./doctor/MyAppointments";
import AppointmentDetails from "./doctor/AppointmentDetails";
import MySchedule from "./doctor/MySchedule";
import AddSchedule from "./doctor/AddSchedule";
import EditSchedule from "./doctor/EditSchedule";
import MyPatients from "./doctor/MyPatients";
import DoctorProfile from "./doctor/DoctorProfile";

function Doctor() {
  return (
    <Routes>
      <Route path="appointments" element={<MyAppointments />} />
      <Route path="appointments/:id" element={<AppointmentDetails />} />
      <Route path="schedules" element={<MySchedule />} />
      <Route path="schedules/add" element={<AddSchedule />} />
      <Route path="schedules/edit/:id" element={<EditSchedule />} />
      <Route path="patients" element={<MyPatients />} />
      <Route path="profile" element={<DoctorProfile />} />
    </Routes>
  );
}

export default Doctor;