export default function LinkButton({
  children,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-medium hover:underline underline-offset-2 transition-opacity hover:opacity-80"
      style={{
        color: "var(--color-accent)",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}