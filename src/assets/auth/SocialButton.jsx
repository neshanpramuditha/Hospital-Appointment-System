export default function SocialButton({
  children,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2.5
                 py-2.5 rounded-xl border border-slate-200
                 text-sm font-medium text-slate-700
                 bg-white hover:bg-slate-50
                 active:scale-[0.99]
                 transition-all cursor-pointer"
      style={{
        fontFamily: "Inter, sans-serif",
      }}
    >
      {children}
    </button>
  );
}