import { Link } from "react-router-dom";

const footerLinks = {
  Company: [
    { label: "About Us",  to: "/about"   },
    { label: "Contact",   to: "/contact" },
    { label: "Careers",   to: "#"        },
    { label: "Press",     to: "#"        },
  ],
  Services: [
    { label: "Book Appointment", to: "/register" },
    { label: "Find a Doctor",    to: "/doctors"  },
    { label: "Specialties",      to: "#"         },
    { label: "Emergency Info",   to: "#"         },
  ],
  Legal: [
    { label: "Privacy Policy",   to: "#" },
    { label: "Terms of Service", to: "#" },
    { label: "Cookie Policy",    to: "#" },
    { label: "Data Security",    to: "#" },
  ],
};

const socials = [
  { label: "Facebook",  path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
  { label: "Twitter",   path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
  { label: "Instagram", path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 6.5h11a1 1 0 011 1v9a1 1 0 01-1 1h-11a1 1 0 01-1-1v-9a1 1 0 011-1z" },
  { label: "LinkedIn",  path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" },
];

const stats = [
  { num: "200+", label: "Specialists"  },
  { num: "15k+", label: "Patients"     },
  { num: "98%",  label: "Satisfaction" },
  { num: "100+", label: "Clinics"      },
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden font-sans"
      style={{ background: "#045271" }}
    >
      <style>{`
        /* animations */
        @keyframes spinRing  { from{transform:rotate(0deg)}  to{transform:rotate(360deg)}  }
        @keyframes spinRingR { from{transform:rotate(0deg)}  to{transform:rotate(-360deg)} }
        @keyframes waveBar   { 0%,100%{transform:scaleY(.35)} 50%{transform:scaleY(1)} }

        .ftr-ring-1 { animation: spinRing  30s linear infinite; }
        .ftr-ring-2 { animation: spinRingR 20s linear infinite; }

        /* waveform bars - white on dark bg */
        .wave-bar {
          display: inline-block; width: 3px; border-radius: 3px;
          background: linear-gradient(to top, rgba(255,255,255,0.5), #02C39A);
          transform-origin: bottom;
        }
        .wave-bar:nth-child(1){animation:waveBar 1.1s .00s ease-in-out infinite}
        .wave-bar:nth-child(2){animation:waveBar 1.1s .15s ease-in-out infinite}
        .wave-bar:nth-child(3){animation:waveBar 1.1s .30s ease-in-out infinite}
        .wave-bar:nth-child(4){animation:waveBar 1.1s .45s ease-in-out infinite}
        .wave-bar:nth-child(5){animation:waveBar 1.1s .60s ease-in-out infinite}

        /* glass panel — light on dark */
        .glass-ftr {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.14);
        }

        /* nav link */
        .ftr-link {
          color: rgba(255,255,255,0.55);
          font-size: .8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color .2s ease, padding-left .2s ease;
        }
        .ftr-link::before {
          content: '';
          display: inline-block;
          width: 0;
          height: 2px;
          border-radius: 2px;
          background: #02C39A;
          transition: width .2s ease;
          flex-shrink: 0;
        }
        .ftr-link:hover { color: #fff; padding-left: 4px; }
        .ftr-link:hover::before { width: 10px; }

        /* social icon button */
        .social-btn {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.75);
          border: 1px solid rgba(255,255,255,0.12);
          transition: transform .2s ease, box-shadow .2s ease, background .2s ease, color .2s ease;
        }
        .social-btn:hover {
          background: #02C39A;
          color: #fff;
          border-color: #02C39A;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(2,195,154,0.35);
        }

        /* stat pill */
        .stat-pill {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          padding: 10px 18px;
          text-align: center;
          flex: 1;
          transition: background .2s ease, transform .2s ease;
        }
        .stat-pill:hover {
          background: rgba(2,195,154,0.18);
          border-color: rgba(2,195,154,0.35);
          transform: translateY(-2px);
        }

        /* divider */
        .ftr-divider {
          height: 1px;
          background: linear-gradient(90deg,
            transparent,
            rgba(255,255,255,0.10) 20%,
            rgba(2,195,154,0.30) 50%,
            rgba(255,255,255,0.10) 80%,
            transparent);
        }

        /* newsletter input */
        .nl-input {
          background: rgba(255,255,255,0.10);
          border: 1.5px solid rgba(255,255,255,0.18);
          color: #fff;
          border-radius: 12px;
          padding: 10px 16px;
          font-size: .85rem;
          font-weight: 600;
          outline: none;
          flex: 1;
          min-width: 0;
          transition: border-color .2s ease, box-shadow .2s ease;
        }
        .nl-input:focus {
          border-color: #02C39A;
          box-shadow: 0 0 0 3px rgba(2,195,154,0.20);
        }
        .nl-input::placeholder { color: rgba(255,255,255,0.35); }

        /* trust badge */
        .trust-badge {
          display: flex; align-items: center; gap: 6px;
          font-size: .68rem; font-weight: 700;
          padding: 5px 12px; border-radius: 999px;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.70);
          border: 1px solid rgba(255,255,255,0.12);
          white-space: nowrap;
        }
      `}</style>

      {/* Decorative rings */}
      <div className="ftr-ring-1 pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full"
        style={{ border: "2px dashed rgba(2,195,154,0.20)" }} />
      <div className="ftr-ring-2 pointer-events-none absolute -bottom-14 -right-14 w-56 h-56 rounded-full"
        style={{ border: "1.5px dashed rgba(255,255,255,0.10)" }} />
      <div className="ftr-ring-1 pointer-events-none absolute top-10 right-1/4 w-28 h-28 rounded-full"
        style={{ border: "1px dashed rgba(2,195,154,0.12)", animationDuration:"40s" }} />
      {/* Radial glow */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-full opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse at 80% 0%, #02C39A, transparent 55%)" }} />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #F0F3BD, transparent 70%)" }} />

      {/* Top gradient border */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #05668D, #02C39A, #028090)" }} />

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-14 pb-10 relative z-10">

        {/* Row 1 — Brand + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-start">

          {/* Brand */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/15 p-1.5 border border-white/20 shadow-inner transition-transform group-hover:scale-105">
                <img src="/logo.png" alt="CLINEXA" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black tracking-widest text-white">CLINEXA</span>
            </Link>

            <p className="text-sm leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.60)" }}>
              Next-generation healthcare, connecting patients with the specialists they need, seamlessly and securely.
            </p>

            {/* Waveform + live dot */}
            <div className="flex items-center gap-3">
              <div className="flex items-end gap-[3px] h-4">
                {[10,15,12,18,9].map((h, i) => (
                  <span key={i} className="wave-bar" style={{ height: h }} />
                ))}
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: "#02C39A" }}>
                <span className="inline-block w-2 h-2 rounded-full bg-[#02C39A] animate-pulse" />
                Available 24 / 7
              </span>
            </div>

            {/* Socials */}
            <div className="flex gap-2.5 pt-1">
              {socials.map(({ label, path }) => (
                <a key={label} href="#" aria-label={label} className="social-btn">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="glass-ftr rounded-2xl p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#02C39A" }}>
              Stay informed
            </p>
            <h3 className="font-extrabold text-base mb-1 text-white">
              Health tips in your inbox
            </h3>
            <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.50)" }}>
              Appointment reminders, wellness articles, and CLINEXA updates.
            </p>
            <div className="flex gap-2">
              <input type="email" placeholder="your@email.com" className="nl-input" />
              <button
                className="flex-shrink-0 px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                style={{ background: "linear-gradient(90deg,#02C39A,#028090)" }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Row 2 - Stat pills */}
        <div className="flex flex-wrap gap-3 mb-12">
          {stats.map(({ num, label }) => (
            <div key={label} className="stat-pill">
              <p className="font-black text-lg tabular-nums text-white">{num}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#02C39A" }}>{label}</p>
            </div>
          ))}
        </div>

        <div className="ftr-divider mb-10" />

        {/* Row 3 - Nav columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-[10px] font-black uppercase tracking-[0.12em] mb-4" style={{ color: "#02C39A" }}>
                {heading}
              </p>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="ftr-link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="ftr-divider mb-8" />

        {/* Row 4 — Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="w-4 h-4 opacity-30 object-contain" />
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
              © {new Date().getFullYear()} CLINEXA · Next-Generation Healthcare · All rights reserved.
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            {[
              { label: "HIPAA Compliant" },
              { label: "SSL Secured"     },
              { label: "ISO 27001"       },
            ].map(({ label }) => (
              <span key={label} className="trust-badge">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="#02C39A" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}