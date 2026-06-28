import { useState } from "react";

export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="w-full px-3 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400"
      style={{
        fontFamily: "Inter, sans-serif",
        outline: "none",
        borderColor: focused
          ? "var(--color-accent)"
          : "#E2E8F0",
        boxShadow: focused
          ? "0 0 0 3px color-mix(in srgb, var(--color-accent) 18%, transparent)"
          : "none",
        background: focused ? "#fff" : "#F8FAFB",
        transition:
          "border-color .18s, box-shadow .18s, background .18s",
      }}
    />
  );
}