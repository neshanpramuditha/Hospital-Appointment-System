import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import Footer from "../components/Footer";

// Animated Canvas
function MedicalParticleCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  const initParticles = useCallback((w, h) => {
    const count = Math.floor((w * h) / 9000);
    return Array.from({ length: Math.min(count, 55) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 10 + Math.random() * 18,
      opacity: 0.06 + Math.random() * 0.13,
      speedX: (Math.random() - 0.5) * 0.22,
      speedY: (Math.random() - 0.5) * 0.18,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.004,
      shape: Math.random() > 0.5 ? "plus" : "circle",
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const drawPlus = (ctx, x, y, size, alpha, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#02C39A";
      const t = size * 0.28;
      const l = size;
      // horizontal bar
      ctx.fillRect(-l / 2, -t / 2, l, t);
      // vertical bar
      ctx.fillRect(-t / 2, -l / 2, t, l);
      ctx.restore();
    };

    const drawCircle = (ctx, x, y, size, alpha) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "#05668D";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        if (p.shape === "plus") drawPlus(ctx, p.x, p.y, p.size, p.opacity, p.rotation);
        else drawCircle(ctx, p.x, p.y, p.size, p.opacity);
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;
        if (p.x < -30) p.x = canvas.width + 30;
        if (p.x > canvas.width + 30) p.x = -30;
        if (p.y < -30) p.y = canvas.height + 30;
        if (p.y > canvas.height + 30) p.y = -30;
      });
      animRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 1 }}
    />
  );
}

// Typewriter hook
function useTypewriter(text, speed = 55, startDelay = 300) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);
  return displayed;
}

// Data
const pillars = [
  { icon: "👨‍🔬", title: "Scalable Engineering", desc: "Built to grow reliably across distributed infrastructure without compromising speed." },
  { icon: "🛡️", title: "Enterprise Security", desc: "Strict medical-grade data isolation and regulatory compliance baked in from day one." },
  { icon: "🩺", title: "Patient-First Design", desc: "Every interaction is shaped around clarity, comfort, and the patient's journey." },
  { icon: "🌀", title: "Real-Time Sync", desc: "Doctor availability and records stay perfectly synchronized with zero latency." },
];

const milestones = [
  { year: "2021", label: "Founded", detail: "CLINEXA launched with a mission to modernize how patients connect with hospitals." },
  { year: "2022", label: "10k Patients", detail: "Reached 10,000 active patients across three regions within the first year." },
  { year: "2023", label: "100+ Clinics", detail: "Onboarded over 100 partner clinics and specialist networks nationwide." },
  { year: "2024", label: "Global Reach", detail: "Expanded internationally with multi-language support and regional data centers." },
];

// Main Component
export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headline = useTypewriter("Healthcare,\nReimagined.", 60, 400);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Split typewriter output to handle newline in the text
  const [line1, line2] = headline.split("\n");

  return (
    <div className="min-h-screen font-sans selection:bg-[#02C39A] selection:text-white" style={{ background: "#F0F3BD" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-9px); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
        .anim-fade-up  { animation: fadeUp 0.65s ease both; }
        .anim-fade-in  { animation: fadeIn 0.7s ease both; }
        .anim-float    { animation: floatY 4s ease-in-out infinite; }
        .anim-scale-in { animation: scaleIn 0.5s ease both; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .cursor::after {
          content: '|';
          animation: cursorBlink 0.9s ease infinite;
          color: #02C39A;
          font-weight: 300;
          margin-left: 2px;
        }
        .card-lift {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .card-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 38px rgba(5,102,141,0.13);
        }
        .nav-underline::after {
          content: '';
          display: block;
          height: 2px;
          background: white;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
          border-radius: 2px;
          margin-top: 2px;
        }
        .nav-underline:hover::after { transform: scaleX(1); }
        .pillar-card {
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.8);
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        .pillar-card:hover {
          background: rgba(255,255,255,0.85);
          transform: translateY(-4px);
          box-shadow: 0 14px 32px rgba(5,102,141,0.10);
        }
        .timeline-dot {
          background: linear-gradient(135deg, #05668D, #02C39A);
        }
      `}</style>

      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 px-6 md:px-12 py-3.5 flex items-center justify-between transition-all duration-300"
        style={{
          background: "linear-gradient(90deg, #05668D 0%, #02C39A 100%)",
          boxShadow: scrolled ? "0 4px 20px rgba(5,102,141,0.28)" : "none",
        }}
      >
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/15 p-1 backdrop-blur-sm shadow-inner transition-transform group-hover:scale-105">
            <img src="/logo.png" alt="CLINEXA" className="w-full h-full object-contain" />
          </div>
          <span className="text-white text-lg font-black tracking-widest">CLINEXA</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-white/85 text-sm font-semibold">
          <Link to="/home" className="nav-underline hover:text-white transition-colors duration-200 pb-0.5">Home</Link>
          <a href="/contact" className="nav-underline hover:text-white transition-colors duration-200 pb-0.5">Contact</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/register" className="px-5 py-2 rounded-full bg-white text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-px transition-all" style={{ color: "#05668D" }}>
            Sign up Now
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden px-6 py-5 flex flex-col gap-4 text-sm font-medium z-40 relative" style={{ background: "#05668D" }}>
          <Link to="/" className="text-white/85 hover:text-white transition-colors">Home</Link>
          <a href="#" className="text-white/85 hover:text-white transition-colors">Contact</a>
          <div className="flex gap-3 mt-1 pt-3 border-t border-white/20">
            <Link to="/login" className="flex-1 py-2 text-center rounded-full border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-all">Log in</Link>
            <Link to="/register" className="flex-1 py-2 text-center rounded-full bg-white font-bold text-sm" style={{ color: "#05668D" }}>Sign up</Link>
          </div>
        </div>
      )}

      {/* HERO: Particle Canvas + Typewriter */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden px-6">
        
        {/* Particle layer */}
        <MedicalParticleCanvas />

        {/* Soft radial vignette so edges feel grounded */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 40%, #F0F3BD88 100%)" }} />

        {/* Center content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">

          {/* Eyebrow pill */}
          <div className="anim-fade-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-8 border"
            style={{ color: "#028090", borderColor: "#02C39A44", background: "rgba(2,195,154,0.08)" }}>
            <img src="/logo.png" alt="" className="w-4 h-4 object-contain opacity-70" />
            About CLINEXA™
          </div>

          {/* Typewriter headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6" style={{ color: "#05668D" }}>
            <span>{line1 || ""}</span>
            {line1 && <br />}
            <span className={!line2 && line1 ? "cursor" : ""}>
              {line2 !== undefined ? (
                <span className={line1 && line2 !== undefined && line2.length < "Reimagined.".length ? "cursor" : ""}>
                  <span style={{ color: "#02C39A" }}>{line2}</span>
                </span>
              ) : null}
            </span>
            {/* Cursor only while typing */}
            {headline.length < "Healthcare,\nReimagined.".length && (
              <span className="cursor" style={{ color: "#02C39A" }} />
            )}
          </h1>

          <p className="anim-fade-up delay-200 text-gray-600 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
            We exist to close the gap between patients and the care they need with technology that feels invisible and outcomes that feel personal.
          </p>

          {/* Stat row */}
          <div className="anim-fade-up delay-300 inline-flex items-center gap-0 rounded-2xl overflow-hidden shadow-lg border border-white/60" style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}>
            {[["200+", "Specialists"], ["15k+", "Patients"], ["98%", "Satisfaction"]].map(([num, label], i) => (
              <div key={label} className="px-7 py-4 text-center relative">
                {i > 0 && <div className="absolute left-0 top-3 bottom-3 w-px bg-gray-200" />}
                <p className="text-xl font-black" style={{ color: "#05668D" }}>{num}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div className="anim-fade-up delay-500 mt-14 flex flex-col items-center gap-2 text-gray-400">
            <span className="text-xs font-semibold tracking-widest uppercase">Scroll to explore</span>
            <div className="w-5 h-8 rounded-full border-2 border-gray-300 flex items-start justify-center pt-1.5">
              <div className="w-1 h-2 rounded-full bg-gray-400"
                style={{ animation: "floatY 1.4s ease-in-out infinite" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Doctor */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* doc2 image */}
        <div className="anim-fade-in flex justify-center items-end order-2 lg:order-1">
          <img
            src="/doc2.png"
            alt="Doctor"
            className="anim-float w-full max-w-[500px] object-contain object-bottom select-none"
            style={{ filter: "drop-shadow(0 12px 32px rgba(5,102,141,0.18))" }}
          />
        </div>

        {/* Copy */}
        <div className="space-y-6 order-1 lg:order-2">
          <div className="anim-fade-up">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#02C39A" }}>Our Mission</p>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight" style={{ color: "#05668D" }}>
              Bridging patients and<br />the care they deserve.
            </h2>
          </div>
          <p className="anim-fade-up delay-100 text-gray-600 leading-relaxed text-sm md:text-base">
            CLINEXA was designed to close the structural gap between medical centers and families seeking safe, friction-free scheduling. We handle real-time doctor availability smoothly so records stay reliable, synchronized, and secure.
          </p>
          <p className="anim-fade-up delay-200 text-gray-600 leading-relaxed text-sm md:text-base">
            By combining high-performance infrastructure with an intuitive interface, we eliminate administrative overhead giving healthcare professionals the space to focus on what matters most.
          </p>

          <div className="anim-fade-up delay-300 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {pillars.map(({ icon, title, desc }) => (
              <div key={title} className="pillar-card flex items-start gap-3 p-4 rounded-2xl cursor-default">
                <span className="text-xl mt-0.5 flex-shrink-0">{icon}</span>
                <div>
                  <h4 className="font-bold text-sm mb-0.5" style={{ color: "#05668D" }}>{title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 relative overflow-hidden">
        {/* Tinted backdrop strip */}
        <div className="absolute inset-0" style={{ background: "rgba(5,102,141,0.04)" }} />

        <div className="relative max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: "#05668D" }}>Our Journey</h2>
            <p className="text-gray-500 text-sm mt-2">From a bold idea to a platform trusted by thousands.</p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-5 bottom-5 w-0.5 hidden sm:block"
              style={{ background: "linear-gradient(to bottom, #02C39A, #05668D22)" }} />

            <div className="space-y-7">
              {milestones.map(({ year, label, detail }, i) => (
                <div key={year} className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full timeline-dot flex items-center justify-center shadow-md z-10">
                    <span className="text-white text-xs font-black">{i + 1}</span>
                  </div>
                  <div className="pillar-card card-lift flex-1 rounded-2xl px-5 py-4 cursor-default">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full text-white" style={{ background: "#02C39A" }}>{year}</span>
                      <h3 className="font-bold text-sm" style={{ color: "#05668D" }}>{label}</h3>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-4 md:mx-12 my-16 rounded-3xl overflow-hidden shadow-2xl">
        <div
          className="relative flex flex-col md:flex-row items-center justify-between px-8 md:px-14 py-14 gap-8 overflow-hidden"
          style={{ background: "linear-gradient(120deg, #05668D 0%, #02C39A 100%)" }}
        >
          <div className="pointer-events-none absolute right-0 top-0 w-72 h-72 rounded-full opacity-10 -translate-y-1/2 translate-x-1/3" style={{ background: "white" }} />
          <div className="pointer-events-none absolute left-12 bottom-0 w-40 h-40 rounded-full opacity-5 translate-y-1/2" style={{ background: "white" }} />
          <div className="text-white text-center md:text-left relative z-10">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Ready to experience better care?</h2>
            <p className="text-white/70 text-sm">Join thousands of patients who trust CLINEXA every day.</p>
          </div>
          <Link
            to="/register"
            className="relative z-10 shrink-0 inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all group"
            style={{ background: "white", color: "#05668D" }}
          >
            Get Started Free
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}