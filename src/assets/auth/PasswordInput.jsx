import { useState } from "react";
import { EyeOpen, EyeOff } from "./icons";

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Enter your password",
  name,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-3 py-2.5 pr-11 rounded-xl border text-sm text-slate-800 placeholder-slate-400"
        style={{
          fontFamily: "Inter, sans-serif",
          outline: "none",
          borderColor: focused
            ? "var(--color-accent)"
            : "#E2E8F0",
          background: focused ? "#FFFFFF" : "#F8FAFB",
          boxShadow: focused
            ? "0 0 0 3px color-mix(in srgb, var(--color-accent) 18%, transparent)"
            : "none",
          transition:
            "border-color .18s, box-shadow .18s, background .18s",
        }}
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        {showPassword ? <EyeOff /> : <EyeOpen />}
      </button>
    </div>
  );
}