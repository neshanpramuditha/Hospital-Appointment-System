import { Routes, Route } from "react-router-dom";

import dashboard from "./dashboard/Dashboard";

function Patients() {
  return (
    <Routes>
      <Route index element={<dashboard />} />
    </Routes>
  );
}

export default Patients;