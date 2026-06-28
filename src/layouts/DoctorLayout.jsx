import { Outlet } from "react-router-dom";

export default function DoctorLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">

      <aside className="w-64 bg-white shadow-md">
        <div className="p-5 text-xl font-bold">
          Doctor Panel
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>

    </div>
  );
}