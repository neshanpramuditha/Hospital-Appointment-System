import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-800">Finishing sign in...</h2>
        <p className="mt-2 text-sm text-slate-500">Please wait while your Google session is being completed.</p>
      </div>
    </div>
  );
}
