export default function FormField({
  label,
  children,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 select-none">
        {label}
      </label>

      {children}
    </div>
  );
}