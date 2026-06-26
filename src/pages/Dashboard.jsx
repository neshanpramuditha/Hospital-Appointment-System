import { Routes, Route } from "react-router-dom";

import dashboard from "./dashboard/Dashboard";



function Dashboard() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
    </Routes>
  );
}

export default Dashboard;