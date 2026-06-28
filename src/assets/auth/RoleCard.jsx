export default function RoleCard({
  title,
  description,
  icon,
  selected = false,
  onClick,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full rounded-2xl border p-4 text-left
        transition-all duration-200
        ${
          selected
            ? "border-transparent shadow-lg scale-[1.02]"
            : "border-slate-200 hover:border-slate-300 hover:shadow-md"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      style={{
        background: selected
          ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))"
          : "#FFFFFF",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: selected
              ? "rgba(255,255,255,0.18)"
              : "var(--color-background)",
          }}
        >
          {icon}
        </div>

        <div className="flex-1">
          <h3
            className={`font-semibold ${
              selected ? "text-white" : "text-slate-800"
            }`}
            style={{
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {title}
          </h3>

          <p
            className={`mt-1 text-sm ${
              selected ? "text-white/80" : "text-slate-500"
            }`}
            style={{
              fontFamily: "Inter, sans-serif",
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}