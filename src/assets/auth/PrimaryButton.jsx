export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 rounded-xl text-white text-sm font-semibold tracking-wide
                 transition-all duration-150 hover:opacity-90
                 active:scale-[0.99]
                 disabled:opacity-60
                 disabled:cursor-not-allowed
                 cursor-pointer"
      style={{
        fontFamily: "Poppins, sans-serif",
        border: "none",
        background:
          "linear-gradient(90deg,var(--color-primary),var(--color-accent))",
        boxShadow:
          "0 4px 18px color-mix(in srgb,var(--color-accent) 38%,transparent)",
      }}
    >
      {children}
    </button>
  );
}