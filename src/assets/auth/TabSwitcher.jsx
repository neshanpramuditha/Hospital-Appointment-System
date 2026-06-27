export default function TabSwitcher({
  activeTab,
  onChange,
}) {
  return (
    <div
      className="flex p-1 rounded-2xl"
      style={{
        background: "#F1F5F9",
      }}
    >
      <button
        type="button"
        onClick={() => onChange("login")}
        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
          activeTab === "login"
            ? "text-white shadow-md"
            : "text-slate-600 hover:text-slate-800"
        }`}
        style={{
          background:
            activeTab === "login"
              ? "linear-gradient(90deg, var(--color-primary), var(--color-secondary))"
              : "transparent",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        Login
      </button>

      <button
        type="button"
        onClick={() => onChange("register")}
        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
          activeTab === "register"
            ? "text-white shadow-md"
            : "text-slate-600 hover:text-slate-800"
        }`}
        style={{
          background:
            activeTab === "register"
              ? "linear-gradient(90deg, var(--color-primary), var(--color-secondary))"
              : "transparent",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        Register
      </button>
    </div>
  );
}