import { CrossIcon } from "./icons";

export default function MobileBrandBar() {
  return (
    <div
      className="lg:hidden flex items-center gap-3 px-6 py-4 border-b"
      style={{
        background:
          "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="flex items-center justify-center rounded-xl"
        style={{
          width: 44,
          height: 44,
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
        }}
      >
        <CrossIcon size={22} />
      </div>

      <div>
        <h1
          className="text-white font-bold tracking-wide"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "1rem",
          }}
        >
          HospitalCare
        </h1>

        <p
          className="text-white/80 text-xs"
          style={{
            fontFamily: "Inter, sans-serif",
          }}
        >
          Appointment Management System
        </p>
      </div>
    </div>
  );
}