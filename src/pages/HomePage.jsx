import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";

// Data
const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Easy Scheduling",
    desc: "Book appointments in seconds, no phone calls, no waiting.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Expert Doctors",
    desc: "Choose from a wide network of verified, specialist physicians.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Secure Records",
    desc: "Your medical data protected with enterprise-grade security.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Real-time Updates",
    desc: "Instant confirmations and reminders for every appointment.",
  },
];

const specialties = [
  { name: "Cardiology",    icon: "❤️" },
  { name: "Neurology",     icon: "🧠" },
  { name: "Orthopedics",   icon: "🦴" },
  { name: "Pediatrics",    icon: "👶" },
  { name: "Dermatology",   icon: "🌿" },
  { name: "Ophthalmology", icon: "👁️" },
];

// Hooks
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCounter(numericTarget, duration = 1300, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * numericTarget));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, numericTarget, duration]);
  return count;
}

// Components
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(26px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function StatPill({ num, suffix, label }) {
  const [ref, visible] = useReveal(0.5);
  const count = useCounter(num, 1300, visible);
  return (
    <div ref={ref} className="text-center lg:text-left">
      <p className="text-2xl font-black tabular-nums" style={{ color: "#05668D" }}>{count}{suffix}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: "#028090" }}>{label}</p>
    </div>
  );
}

// Main
export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 60);
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);

  const hs = (delay) => ({
    opacity: heroReady ? 1 : 0,
    transform: heroReady ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <div className="min-h-screen font-sans selection:bg-[#02C39A] selection:text-white" style={{ background: "#F0F3BD" }}>
      <style>{`
        /* Keyframes */
        @keyframes floatDoc  { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-12px)} }
        @keyframes floatCard { 0%,100%{transform:translateY(0) rotate(-1.5deg)} 50%{transform:translateY(-8px) rotate(-1.5deg)} }
        @keyframes spinRing  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer   { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes pulse2    { 0%{transform:scale(1);opacity:.65} 80%{transform:scale(2.4);opacity:0} 100%{transform:scale(2.4);opacity:0} }
        @keyframes badgePop  { 0%{transform:scale(.7);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes waveBar   { 0%,100%{transform:scaleY(.4)} 50%{transform:scaleY(1)} }

        .doc-float   { animation: floatDoc  4.8s ease-in-out infinite; }
        .card-float  { animation: floatCard 3.6s ease-in-out infinite; }
        .ring-spin   { animation: spinRing  22s linear infinite; }
        .shimmer-btn { background-size:250% 250%; animation: shimmer 3.5s ease infinite; }
        .badge-pop   { animation: badgePop  .55s cubic-bezier(.34,1.56,.64,1) both; }

        /* Nav underline */
        .nav-ul::after { content:''; display:block; height:2px; background:white; transform:scaleX(0); transform-origin:left; transition:transform .25s ease; border-radius:2px; margin-top:2px; }
        .nav-ul:hover::after { transform:scaleX(1); }

        /* Card hover */
        .card-lift { transition:transform .25s ease,box-shadow .25s ease; }
        .card-lift:hover { transform:translateY(-6px); box-shadow:0 20px 44px rgba(5,102,141,0.13); }

        /* Glass surface (uses bg color tint) */
        .glass {
          background: rgba(255,255,255,0.52);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.75);
        }
        .glass-dark {
          background: rgba(5,102,141,0.07);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(5,102,141,0.12);
        }

        /* Specialty */
        .spec-btn { transition:transform .22s ease,box-shadow .22s ease,background .22s ease; }
        .spec-btn:hover { transform:translateY(-5px); box-shadow:0 14px 30px rgba(2,195,154,.18); }

        /* Waveform decoration */
        .wave-bar { display:inline-block; width:4px; border-radius:4px; background:linear-gradient(to top,#05668D,#02C39A); transform-origin:bottom; }
        .wave-bar:nth-child(1){animation:waveBar 1.1s .0s ease-in-out infinite}
        .wave-bar:nth-child(2){animation:waveBar 1.1s .15s ease-in-out infinite}
        .wave-bar:nth-child(3){animation:waveBar 1.1s .3s ease-in-out infinite}
        .wave-bar:nth-child(4){animation:waveBar 1.1s .45s ease-in-out infinite}
        .wave-bar:nth-child(5){animation:waveBar 1.1s .6s ease-in-out infinite}
      `}</style>

      {/* NAVBAR */}
      <nav
        className="sticky top-0 z-50 px-6 md:px-12 py-3.5 flex items-center justify-between transition-all duration-300"
        style={{
          background: "linear-gradient(90deg,#05668D 0%,#02C39A 100%)",
          boxShadow: scrolled ? "0 4px 24px rgba(5,102,141,0.30)" : "none",
        }}
      >
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/15 p-1 backdrop-blur-sm shadow-inner transition-transform group-hover:scale-105">
            <img src="/logo.png" alt="CLINEXA" className="w-full h-full object-contain" />
          </div>
          <span className="text-white text-lg font-black tracking-widest">CLINEXA</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-white/85 text-sm font-semibold">
          {[["About","/about"],["Contact","/contact"]].map(([l,h]) => (
            <a key={l} href={h} className="nav-ul hover:text-white transition-colors pb-0.5">{l}</a>
          ))}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/register" className="px-5 py-2 rounded-full bg-white text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-px transition-all" style={{ color:"#05668D" }}>Signup Now</Link>
        </div>

        {/* Hamburger */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden px-6 py-5 flex flex-col gap-4 text-sm font-medium z-40 relative" style={{ background:"#05668D" }}>
          {["About","Contact"].map(i => <a key={i} href="#" className="text-white/85 hover:text-white">{i}</a>)}
          <div className="flex gap-3 mt-1 pt-3 border-t border-white/20">
            <Link to="/register" className="flex-1 py-2 text-center rounded-full bg-white font-bold text-sm" style={{ color:"#05668D" }}>Signup Now</Link>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative pt-14 pb-0 lg:pt-20 overflow-hidden">

        {/* Faint decorative blobs */}
        <div className="pointer-events-none absolute top-[-80px] right-[-80px] w-[440px] h-[440px] rounded-full opacity-20"
          style={{ background:"radial-gradient(circle,#02C39A,transparent 65%)" }} />
        <div className="pointer-events-none absolute bottom-0 left-[-40px] w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background:"radial-gradient(circle,#05668D,transparent 70%)" }} />

        <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">

          {/* Left copy */}
          <div className="space-y-7 text-center lg:text-left pb-14 lg:pb-20">

            {/* Animated waveform and badge */}
            <div style={hs(0)} className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="flex items-end gap-[3px] h-5">
                {[1,2,3,4,5].map(n => <span key={n} className="wave-bar" style={{ height: [12,18,14,20,10][n-1] }} />)}
              </div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{ background:"rgba(2,195,154,0.15)", color:"#028090", border:"1px solid rgba(2,195,154,0.3)" }}>
                Next-Generation Healthcare
              </span>
            </div>

            {/* Headline */}
            <div style={hs(110)}>
              <h1 className="text-4xl md:text-5xl lg:text-[3.6rem] font-extrabold leading-[1.07] tracking-tight" style={{ color:"#05668D" }}>
                Your Health,<br />
                <span className="relative" style={{ color:"#02C39A" }}>
                  Our Priority.
                  {/* Hand-drawn underline */}
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 240 10" preserveAspectRatio="none" style={{ height:7 }}>
                    <path d="M0 7 Q60 1 120 5 Q180 9 240 3" stroke="#02C39A" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.45"/>
                  </svg>
                </span>
              </h1>
            </div>

            {/* Body */}
            <div style={hs(200)}>
              <p className="text-[#05668D]/70 text-base md:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
                Book appointments with top specialists, manage your schedule, and access hospital services, all from one thoughtful place.
              </p>
            </div>

            {/* CTA */}
            <div style={hs(300)}>
              <Link
                to="/register"
                className="shimmer-btn inline-flex items-center gap-2.5 px-9 py-4 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 group"
                style={{ backgroundImage:"linear-gradient(90deg,#05668D,#02C39A,#028090,#05668D)" }}
              >
                Make an Appointment
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div style={hs(400)} className="flex gap-8 pt-5 justify-center lg:justify-start border-t mt-2" style2={{ borderColor:"rgba(5,102,141,0.15)" }}>
              <StatPill num={200}   suffix="+" label="Doctors"      />
              <div className="w-px self-stretch" style={{ background:"rgba(5,102,141,0.15)" }} />
              <StatPill num={15000} suffix="+" label="Patients"     />
              <div className="w-px self-stretch" style={{ background:"rgba(5,102,141,0.15)" }} />
              <StatPill num={98}    suffix="%" label="Satisfaction"  />
            </div>
          </div>

          {/* Right: doctor visual */}
          <div className="relative flex justify-center lg:justify-end items-end" style={hs(160)}>

            {/* Asymmetric shape behind doctor */}
            <div
              className="relative w-[330px] md:w-[400px] lg:w-[430px] h-[430px] md:h-[520px] flex items-end justify-center overflow-hidden"
              style={{
                borderRadius:"90px 24px 24px 90px",
                background:"linear-gradient(155deg,#028090 0%,#05668D 100%)",
                boxShadow:"0 32px 80px rgba(5,102,141,0.22)",
              }}
            >
              {/* Inner glow */}
              <div className="absolute inset-0 opacity-20"
                style={{ background:"radial-gradient(ellipse at 65% 12%,#02C39A,transparent 60%)" }} />

              {/* Doctor */}
              <img
                src="/doc.png" alt="Doctor"
                className="doc-float relative z-10 h-[96%] w-auto object-contain object-bottom select-none"
                style={{ filter:"drop-shadow(0 -8px 32px rgba(0,0,0,0.20))" }}
              />
            </div>

            {/* Spinning dashed ring outside shape */}
            <div className="ring-spin pointer-events-none absolute top-[-16px] right-[-16px] w-28 h-28 rounded-full"
              style={{ border:"2px dashed rgba(2,195,154,0.35)" }} />

            {/* Tiny second ring */}
            <div className="ring-spin pointer-events-none absolute bottom-10 left-[-10px] w-14 h-14 rounded-full"
              style={{ border:"1.5px dashed rgba(5,102,141,0.25)", animationDirection:"reverse", animationDuration:"14s" }} />

            {/* Live badge */}
            <div className="badge-pop absolute top-7 left-7 glass px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5 z-20" style={{ animationDelay:"600ms" }}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#02C39A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#02C39A]" />
              </span>
              <span className="text-xs font-bold" style={{ color:"#05668D" }}>Doctors Available Now</span>
            </div>

            {/* Appointment card */}
            <div className="card-float absolute bottom-[-14px] right-[-4px] lg:right-[-20px] glass rounded-2xl shadow-2xl p-4 w-[210px] z-30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0 p-1.5 bg-white/60" style={{ borderColor:"#02C39A" }}>
                  <img src="/logo.png" alt="CLINEXA" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-xs font-black leading-tight" style={{ color:"#05668D" }}>CLINEXA</p>
                  <p className="text-[10px] font-medium" style={{ color:"#028090" }}>Next-Gen Healthcare</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] mb-3 px-0.5" style={{ color:"#05668D" }}>
                <span>⭐ 4.9 rating</span>
                <span className="font-bold" style={{ color:"#02C39A" }}>● Live</span>
              </div>
              <Link to="/register"
                className="block w-full text-center text-white text-xs font-bold py-2.5 rounded-xl transition-all hover:opacity-90"
                style={{ background:"linear-gradient(90deg,#05668D,#02C39A)" }}
              >Book Now</Link>
            </div>
          </div>

        </div>
      </section>

      {/* SPECIALTIES */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <Reveal className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color:"#05668D" }}>Browse by Specialty</h2>
          <p className="text-sm mt-2" style={{ color:"#028090" }}>Find the right specialist for your needs</p>
        </Reveal>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {specialties.map(({ name, icon }, i) => (
            <Reveal key={name} delay={i * 55}>
              <button className="spec-btn group w-full flex flex-col items-center gap-3 p-5 rounded-2xl glass card-lift">
                <span className="text-2xl transition-transform duration-200 group-hover:scale-110">{icon}</span>
                <span className="text-xs font-semibold text-center leading-tight group-hover:font-bold transition-all" style={{ color:"#05668D" }}>{name}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <Reveal className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color:"#05668D" }}>Why Choose CLINEXA?</h2>
            <p className="text-sm mt-2 max-w-md mx-auto" style={{ color:"#028090" }}>Built for patients who expect more from their healthcare experience</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 75}>
                <div className="glass card-lift rounded-2xl p-6 group cursor-default h-full">
                  {/* Icon circle */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3"
                    style={{ background:"linear-gradient(135deg,#05668D,#02C39A)", color:"white" }}
                  >
                    {icon}
                  </div>
                  <h3 className="font-bold mb-2 text-sm" style={{ color:"#05668D" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color:"#05668D99" }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <Reveal>
        <section className="mx-4 md:mx-12 my-16 rounded-3xl overflow-hidden shadow-2xl">
          <div
            className="relative flex flex-col md:flex-row items-center justify-between px-8 md:px-14 py-14 gap-8 overflow-hidden"
            style={{ background:"linear-gradient(120deg,#05668D 0%,#02C39A 100%)" }}
          >
            <div className="pointer-events-none absolute right-0 top-0 w-80 h-80 rounded-full opacity-[0.07] -translate-y-1/2 translate-x-1/3" style={{ background:"white" }} />
            <div className="pointer-events-none absolute left-8 bottom-0 w-48 h-48 rounded-full opacity-[0.05] translate-y-1/2" style={{ background:"white" }} />
            <div className="text-white text-center md:text-left relative z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Ready to take charge of your health?</h2>
              <p className="text-white/70 text-sm">Join thousands of patients who trust CLINEXA every day.</p>
            </div>
            <Link
              to="/register"
              className="relative z-10 shrink-0 inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all group"
              style={{ background:"white", color:"#05668D" }}
            >
              Get Started Free
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </Reveal>

      {/* FOOTER */}
      <Footer/>
    </div>
  );
}
