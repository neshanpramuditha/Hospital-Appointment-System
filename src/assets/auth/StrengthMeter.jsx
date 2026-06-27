const STRENGTH_COLORS = [
  "#EF4444", // Very Weak
  "#F97316", // Weak
  "#EAB308", // Fair
  "#22C55E", // Good
  "#16A34A", // Strong
];

const STRENGTH_LABELS = [
  "Very Weak",
  "Weak",
  "Fair",
  "Good",
  "Strong",
];

export function calcStrength(password) {
  let score = 0;

  if (!password) return 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return Math.min(score, 4);
}

export default function StrengthMeter({ strength = 0 }) {
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{
              background:
                index <= strength
                  ? STRENGTH_COLORS[strength]
                  : "#E2E8F0",
            }}
          />
        ))}
      </div>

      <p
        className="mt-2 text-xs font-medium"
        style={{
          color: STRENGTH_COLORS[strength],
          fontFamily: "Inter, sans-serif",
        }}
      >
        Password Strength: {STRENGTH_LABELS[strength]}
      </p>
    </div>
  );
}