import { Routes, Route } from "react-router-dom";

import DashboardHome from "./dashboard/Dashboard";

function Dashboard() {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
    </Routes>
  );
}

export default Dashboard;