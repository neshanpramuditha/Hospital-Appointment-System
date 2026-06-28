import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { loading, isAuthenticated, role } = useAuth();

  // Wait until authentication finishes loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-lg font-semibold">
          Loading...
        </h2>
      </div>
    );
  }

  // User not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but doesn't have permission
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}