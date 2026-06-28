export default function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-slate-200" />

      <span className="text-xs text-slate-400 whitespace-nowrap">
        or continue with
      </span>

      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}