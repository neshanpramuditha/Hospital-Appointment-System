import { useState } from "react";

function CrossIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function EyeOpen() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/* PRIMITIVES */

/** Labelled form field wrapper */
function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 select-none">
        {label}
      </label>
      {children}
    </div>
  );
}

/** Text / email / etc. input with focus ring using --color-accent */
function Input({ type = "text", placeholder, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="w-full px-3 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400"
      style={{
        fontFamily: "Inter, sans-serif",
        outline: "none",
        borderColor: focused ? "var(--color-accent)" : "#E2E8F0",
        boxShadow: focused
          ? "0 0 0 3px color-mix(in srgb, var(--color-accent) 18%, transparent)"
          : "none",
        background: focused ? "#fff" : "#F8FAFB",
        transition: "border-color .18s, box-shadow .18s, background .18s",
      }}
    />
  );
}

/* Password input with show/hide toggle */
function PasswordInput({ placeholder = "••••••••", onChange }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-3 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400"
        style={{
          fontFamily: "Inter, sans-serif",
          outline: "none",
          paddingRight: "2.6rem",
          borderColor: focused ? "var(--color-accent)" : "#E2E8F0",
          boxShadow: focused
            ? "0 0 0 3px color-mix(in srgb, var(--color-accent) 18%, transparent)"
            : "none",
          background: focused ? "#fff" : "#F8FAFB",
          transition: "border-color .18s, box-shadow .18s, background .18s",
        }}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff /> : <EyeOpen />}
      </button>
    </div>
  );
}

/* Gradient CTA button */
function PrimaryButton({ children }) {
  return (
    <button
      type="button"
      className="w-full py-3 rounded-xl text-white text-sm font-semibold tracking-wide
                 transition-all duration-150 hover:opacity-90 active:scale-[0.99] cursor-pointer"
      style={{
        fontFamily: "Poppins, sans-serif",
        border: "none",
        background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
        boxShadow: "0 4px 18px color-mix(in srgb, var(--color-accent) 38%, transparent)",
      }}
    >
      {children}
    </button>
  );
}

/* Outlined social / OAuth button */
function SocialButton({ children }) {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl
                 border border-slate-200 text-sm font-medium text-slate-700
                 bg-white hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {children}
    </button>
  );
}

/* Hairline divider with centred label */
function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-xs text-slate-400 whitespace-nowrap">or continue with</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

/* Inline accent link-style button */
function LinkBtn({ onClick, children }) {
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

/* PASSWORD STRENGTH METER */

const STRENGTH_COLORS = ["#E24B4A", "#EF9F27", "#02C39A", "#02C39A"];
const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];

function calcStrength(value) {
  let score = 0;
  if (value.length >= 6)                              score++;
  if (value.length >= 10)                             score++;
  if (/[A-Z]/.test(value) && /[0-9]/.test(value))    score++;
  if (/[^A-Za-z0-9]/.test(value))                    score++;
  return score;
}

function StrengthMeter({ score }) {
  return (
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i < score ? STRENGTH_COLORS[score - 1] : "#E2E8F0" }}
          />
        ))}
      </div>
      {score > 0 && (
        <p className="text-[11px] font-medium" style={{ color: STRENGTH_COLORS[score - 1] }}>
          {STRENGTH_LABELS[score]}
        </p>
      )}
    </div>
  );
}

/* ROLE CARD */

function RoleCard({ id, emoji, label, sub, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                 w-full transition-all duration-150 cursor-pointer"
      style={{
        border: `1.5px solid ${selected ? "var(--color-accent)" : "#E2E8F0"}`,
        background: selected
          ? "color-mix(in srgb, var(--color-accent) 9%, #fff)"
          : "#fff",
      }}
    >
      <span style={{ fontSize: 20 }} aria-hidden="true">{emoji}</span>
      <div>
        <p className="text-sm font-semibold text-slate-700 leading-tight m-0"
          style={{ fontFamily: "Poppins, sans-serif" }}>
          {label}
        </p>
        <p className="text-[11px] text-slate-400 leading-tight m-0">{sub}</p>
      </div>
    </button>
  );
}

/* BRAND PANEL  (desktop — hidden on mobile) */

const BRAND_FEATURES = [
  "Instant Appointment Booking",
  "Smart Doctor Matching",
  "Secure Health Records",
];

function BrandPanel() {
  return (
    <aside
      aria-label="Clinexa brand"
      className="relative hidden md:flex flex-col justify-between overflow-hidden p-10"
      style={{
        width: "42%",
        flexShrink: 0,
        background:
          "linear-gradient(155deg, var(--color-primary) 0%, var(--color-secondary) 38%, #00A896 72%, var(--color-accent) 100%)",
      }}
    >
      {/* Decorative translucent circles */}
      <span aria-hidden="true" className="absolute rounded-full pointer-events-none"
        style={{ width: 280, height: 280, top: -80, right: -96, background: "rgba(255,255,255,0.055)" }} />
      <span aria-hidden="true" className="absolute rounded-full pointer-events-none"
        style={{ width: 200, height: 200, bottom: -20, left: -64, background: "rgba(255,255,255,0.055)" }} />
      <span aria-hidden="true" className="absolute rounded-full pointer-events-none"
        style={{ width: 120, height: 120, bottom: 120, right: 16, background: "rgba(255,255,255,0.055)" }} />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.3)" }}>
          <CrossIcon />
        </div>
        <span className="text-white text-xl font-bold tracking-wide"
          style={{ fontFamily: "Poppins, sans-serif" }}>
          Clinexa
        </span>
      </div>

      {/* Tagline */}
      <div className="relative z-10">
        <h2 className="text-white font-semibold leading-tight mb-4"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "1.6rem" }}>
          Next Generation<br />Healthcare<br />Management
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
          Streamlining hospital appointments and patient care with intelligence and precision.
        </p>
      </div>

      {/* Feature pills */}
      <div className="relative z-10 flex flex-col gap-2">
        {BRAND_FEATURES.map((text) => (
          <div key={text}
            className="flex items-center gap-2 w-fit rounded-full px-4 py-[7px]"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.22)",
            }}>
            <span className="w-2 h-2 rounded-full shrink-0"
              style={{ background: "var(--color-background)" }} aria-hidden="true" />
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.92)" }}>
              {text}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

/* MOBILE BRAND BAR  (visible only on < md) */

function MobileBrandBar() {
  return (
    <div className="flex md:hidden items-center justify-center gap-3 px-6 py-5"
      style={{
        background:
          "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
      }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.3)" }}>
        <CrossIcon size={20} />
      </div>
      <div>
        <p className="text-white font-bold text-base leading-none"
          style={{ fontFamily: "Poppins, sans-serif" }}>
          Clinexa
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>
          Next Generation Healthcare Management
        </p>
      </div>
    </div>
  );
}

/* TAB SWITCHER */

function TabSwitcher({ tab, setTab }) {
  const tabs = [
    { id: "login",    label: "Sign In" },
    { id: "register", label: "Create Account" },
  ];
  return (
    <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 mb-7" role="tablist">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={tab === id}
          onClick={() => setTab(id)}
          className="flex-1 py-2 rounded-[10px] text-sm transition-all duration-200 cursor-pointer"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: tab === id ? 600 : 500,
            color: tab === id ? "var(--color-primary)" : "#94A3B8",
            background: tab === id ? "#fff" : "transparent",
            boxShadow: tab === id
              ? "0 2px 8px color-mix(in srgb, var(--color-primary) 20%, transparent)"
              : "none",
            border: "none",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* LOGIN VIEW */

function LoginView({ onSwitch }) {
  return (
    <section aria-label="Sign in" className="flex flex-col">
      <h1 className="text-2xl font-bold text-slate-900 mb-1"
        style={{ fontFamily: "Poppins, sans-serif" }}>
        Welcome back
      </h1>
      <p className="text-sm text-slate-400 mb-7">
        New to Clinexa?{" "}
        <LinkBtn onClick={onSwitch}>Create a free account</LinkBtn>
      </p>

      <div className="flex flex-col gap-4">
        <FormField label="Email Address">
          <Input type="email" placeholder="you@example.com" />
        </FormField>

        <FormField label="Password">
          <PasswordInput placeholder="••••••••" />
        </FormField>
      </div>

      {/* Forgot password */}
      <div className="flex justify-end mt-2 mb-6">
        <button
          type="button"
          className="text-xs font-medium hover:underline underline-offset-2"
          style={{
            color: "var(--color-accent)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Forgot password?
        </button>
      </div>

      <PrimaryButton>Sign In to Clinexa</PrimaryButton>
      <Divider />
      <SocialButton>
        <GoogleIcon />
        Continue with Google
      </SocialButton>
    </section>
  );
}

/* REGISTER VIEW */

const ROLES = [
  { id: "patient", emoji: "🧑‍⚕️", label: "Patient", sub: "Book & manage appointments" },
  { id: "doctor",  emoji: "👨‍💼", label: "Doctor",  sub: "Manage your schedule"       },
];

function RegisterView({ onSwitch }) {
  const [role, setRole] = useState("patient");
  const [strength, setStrength] = useState(0);

  return (
    <section aria-label="Create account" className="flex flex-col">
      <h1 className="text-2xl font-bold text-slate-900 mb-1"
        style={{ fontFamily: "Poppins, sans-serif" }}>
        Create your account
      </h1>
      <p className="text-sm text-slate-400 mb-6">
        Already registered?{" "}
        <LinkBtn onClick={onSwitch}>Sign in</LinkBtn>
      </p>

      {/* Role picker */}
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2"
        id="role-label">
        I am a
      </p>
      <div className="grid grid-cols-2 gap-3 mb-5" role="group" aria-labelledby="role-label">
        {ROLES.map((r) => (
          <RoleCard key={r.id} {...r} selected={role === r.id} onSelect={setRole} />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {/* Name — single column on mobile, two columns on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="First Name">
            <Input type="text" placeholder="John" />
          </FormField>
          <FormField label="Last Name">
            <Input type="text" placeholder="Doe" />
          </FormField>
        </div>

        <FormField label="Email Address">
          <Input type="email" placeholder="you@example.com" />
        </FormField>

        <FormField label="Password">
          <PasswordInput
            placeholder="••••••••"
            onChange={(e) => setStrength(calcStrength(e.target.value))}
          />
          <StrengthMeter score={strength} />
        </FormField>
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2.5 mt-5 mb-6">
        <input
          type="checkbox"
          id="clinexa-terms"
          className="mt-0.5 w-4 h-4 rounded cursor-pointer shrink-0"
          style={{ accentColor: "var(--color-accent)" }}
        />
        <label htmlFor="clinexa-terms"
          className="text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
          I agree to the{" "}
          <span className="font-medium" style={{ color: "var(--color-accent)" }}>
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="font-medium" style={{ color: "var(--color-accent)" }}>
            Privacy Policy
          </span>
        </label>
      </div>

      <PrimaryButton>Create My Account</PrimaryButton>
    </section>
  );
}

/* ROOT */

export default function Login() {
  const [tab, setTab] = useState("login");

  return (
    <div
      className="min-h-dvh flex items-start sm:items-center justify-center sm:p-4"
      style={{ background: "var(--color-background)" }}
    >
      <div
        className="
          flex flex-col md:flex-row
          w-full sm:max-w-[920px]
          bg-white overflow-hidden
          sm:rounded-3xl
          min-h-dvh sm:min-h-0
        "
        style={{
          boxShadow: "0 24px 80px rgba(5,102,141,0.14), 0 4px 16px rgba(5,102,141,0.07)",
        }}
      >
        {/* ── Mobile top bar (hidden md+) ── */}
        <MobileBrandBar />

        {/* ── Desktop brand panel (hidden < md) ── */}
        <BrandPanel />

        {/* ── Form panel ── */}
        <main className="flex-1 flex flex-col px-5 py-7 sm:px-8 sm:py-9 md:px-10 md:py-10">
          <TabSwitcher tab={tab} setTab={setTab} />
          {tab === "login"
            ? <LoginView    onSwitch={() => setTab("register")} />
            : <RegisterView onSwitch={() => setTab("login")}    />
          }
        </main>
      </div>
    </div>
  );
}
