import { Routes, Route } from "react-router-dom";

import ScheduleList from "./schedules/ScheduleList";
import AddSchedule from "./schedules/AddSchedule";
import EditSchedule from "./schedules/EditSchedule";

function Schedules() {
  return (
    <Routes>
      <Route index element={<ScheduleList />} />
      <Route path="add" element={<AddSchedule />} />
      <Route path="edit/:id" element={<EditSchedule />} />
    </Routes>
  );
}

export default Schedules;