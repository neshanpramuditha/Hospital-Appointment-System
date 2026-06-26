import { Routes, Route } from "react-router-dom";

import AppointmentsList from "./appointments/AppointmentsList";
import AddAppointment from "./appointments/AddAppointment";
import EditAppointment from "./appointments/EditAppointment";
import AppointmentDetails from "./appointments/AppointmentDetails";

function Appointments() {

  return (
    <Routes>
      <Route index element={<AppointmentsList />} />
      <Route path="add" element={<AddAppointment />} />
      <Route path="edit/:id" element={<EditAppointment />} />
      <Route path="details/:id" element={<AppointmentDetails />} />
    </Routes>
  );
}

export default Appointments;