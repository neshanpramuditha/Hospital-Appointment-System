import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}

      <aside className="w-64 bg-white shadow-md">
        <div className="p-5 text-xl font-bold">
          Admin Panel
        </div>

        {/* Sidebar comes here */}
      </aside>

      {/* Content */}

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}