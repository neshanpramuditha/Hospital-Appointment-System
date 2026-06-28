import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">

      <h1 className="text-4xl font-bold text-red-500">
        403
      </h1>

      <p className="mt-4 text-gray-600">
        You are not authorized to access this page.
      </p>

      <Link
        to="/login"
        className="mt-6 bg-blue-600 text-white px-5 py-2 rounded"
      >
        Go to Login
      </Link>

    </div>
  );
}