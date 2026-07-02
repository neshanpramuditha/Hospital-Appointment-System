import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { sendContactEmail } from "../services/emailService";

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

// Contact info cards data
const contactCards = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Phone",
    value: "+94 11 234 5678",
    sub: "Mon - Fri, 8 AM -8 PM",
    color: "#02C39A",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email",
    value: "clinexa@gmail.com",
    sub: "We reply within 24 hours",
    color: "#05668D",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Location",
    value: "42 Health Avenue",
    sub: "Colombo 03, Sri Lanka",
    color: "#028090",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Working Hours",
    value: "8 AM - 10 PM",
    sub: "All days including holidays",
    color: "#02C39A",
  },
];

const faqs = [
  {
    q: "How do I book an appointment?",
    a: "Sign up for a free account, browse our specialist list, and pick a time slot that works for you. The whole process takes under two minutes.",
  },
  {
    q: "Can I reschedule or cancel?",
    a: "Yes - you can reschedule or cancel any appointment up to 2 hours before your scheduled time directly from your dashboard.",
  },
  {
    q: "Is my medical data secure?",
    a: "Absolutely. All data is encrypted at rest and in transit using enterprise-grade protocols, and we are fully compliant with health data regulations.",
  },
  {
    q: "Do you offer emergency services?",
    a: "For emergencies, please dial 1990 (Sri Lanka national emergency). CLINEXA is designed for scheduled appointments, not emergency care.",
  },
];

// FAQ accordion item
function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={index * 70}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left glass rounded-2xl px-6 py-5 transition-all duration-300 group"
        style={{ boxShadow: open ? "0 8px 32px rgba(5,102,141,0.10)" : "none" }}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="font-bold text-sm" style={{ color: "#05668D" }}>{q}</span>
          <span
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: open ? "linear-gradient(135deg,#05668D,#02C39A)" : "rgba(5,102,141,0.10)",
              transform: open ? "rotate(45deg)" : "rotate(0deg)",
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke={open ? "white" : "#05668D"} strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </span>
        </div>
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: open ? "200px" : "0px", opacity: open ? 1 : 0 }}
        >
          <p className="text-sm mt-3 leading-relaxed" style={{ color: "#05668D99" }}>{a}</p>
        </div>
      </button>
    </Reveal>
  );
}

// Main
export default function ContactPage() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [sent, setSent]           = useState(false);
  const [form, setForm]           = useState({ name: "", email: "", subject: "", message: "" });
  const [focused, setFocused]     = useState("");

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

// Form submission handler
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await sendContactEmail(form);

    toast.success("Message sent successfully!");

    setSent(true);

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  } catch (error) {
    console.error(error);

    toast.error(
      "Failed to send message. Please try again."
    );
  }
};

  const inputStyle = (field) => ({
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(12px)",
    border: `1.5px solid ${focused === field ? "#02C39A" : "rgba(255,255,255,0.75)"}`,
    color: "#05668D",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxShadow: focused === field ? "0 0 0 3px rgba(2,195,154,0.15)" : "none",
  });

  return (
    <div className="min-h-screen font-sans selection:bg-[#02C39A] selection:text-white" style={{ background: "#F0F3BD" }}>
      <style>{`
        @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spinRing  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer   { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes waveBar   { 0%,100%{transform:scaleY(.4)} 50%{transform:scaleY(1)} }
        @keyframes successPop { 0%{transform:scale(.7);opacity:0} 60%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
        @keyframes checkDraw  { from{stroke-dashoffset:40} to{stroke-dashoffset:0} }

        .float-el    { animation: floatY   5s ease-in-out infinite; }
        .ring-spin   { animation: spinRing 22s linear infinite; }
        .ring-spin-r { animation: spinRing 15s linear infinite reverse; }
        .shimmer-btn { background-size:250% 250%; animation: shimmer 3.5s ease infinite; }
        .success-pop { animation: successPop .5s cubic-bezier(.34,1.56,.64,1) both; }
        .check-draw  { stroke-dasharray:40; animation: checkDraw .5s .4s ease forwards; }

        .nav-ul::after { content:''; display:block; height:2px; background:white; transform:scaleX(0);
          transform-origin:left; transition:transform .25s ease; border-radius:2px; margin-top:2px; }
        .nav-ul:hover::after { transform:scaleX(1); }

        .glass {
          background: rgba(255,255,255,0.52);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.75);
        }
        .card-lift { transition:transform .25s ease,box-shadow .25s ease; }
        .card-lift:hover { transform:translateY(-5px); box-shadow:0 18px 40px rgba(5,102,141,0.12); }

        .wave-bar { display:inline-block; width:4px; border-radius:4px;
          background:linear-gradient(to top,#05668D,#02C39A); transform-origin:bottom; }
        .wave-bar:nth-child(1){animation:waveBar 1.1s .00s ease-in-out infinite}
        .wave-bar:nth-child(2){animation:waveBar 1.1s .15s ease-in-out infinite}
        .wave-bar:nth-child(3){animation:waveBar 1.1s .30s ease-in-out infinite}
        .wave-bar:nth-child(4){animation:waveBar 1.1s .45s ease-in-out infinite}
        .wave-bar:nth-child(5){animation:waveBar 1.1s .60s ease-in-out infinite}

        input::placeholder, textarea::placeholder { color: rgba(5,102,141,0.38); }
        label { color: #05668D; }
      `}</style>

      {/* NAVBAR */}
      <nav
        className="sticky top-0 z-50 px-6 md:px-12 py-3.5 flex items-center justify-between transition-all duration-300"
        style={{
          background: "linear-gradient(90deg,#05668D 0%,#02C39A 100%)",
          boxShadow: scrolled ? "0 4px 24px rgba(5,102,141,0.30)" : "none",
        }}
      >
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/15 p-1 backdrop-blur-sm shadow-inner transition-transform group-hover:scale-105">
            <img src="/logo.png" alt="CLINEXA" className="w-full h-full object-contain" />
          </div>
          <span className="text-white text-lg font-black tracking-widest">CLINEXA</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-white/85 text-sm font-semibold">
          {[["Home","/"],["About","/about"],["Contact","#"]].map(([l,h]) => (
            <a key={l} href={h} className="nav-ul hover:text-white transition-colors pb-0.5">{l}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/register" className="px-5 py-2 rounded-full bg-white text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-px transition-all" style={{ color:"#05668D" }}>Signup Now</Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden px-6 py-5 flex flex-col gap-4 text-sm font-medium z-40 relative" style={{ background:"#05668D" }}>
          {["Home","About","Contact"].map(i => <a key={i} href="#" className="text-white/85 hover:text-white">{i}</a>)}
          <div className="flex gap-3 mt-1 pt-3 border-t border-white/20">
            <Link to="/register" className="flex-1 py-2 text-center rounded-full bg-white font-bold text-sm" style={{ color:"#05668D" }}>Signup Now</Link>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative pt-16 pb-10 overflow-hidden">

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute top-[-60px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background:"radial-gradient(circle,#02C39A,transparent 65%)" }} />
        <div className="pointer-events-none absolute bottom-0 left-[-50px] w-[280px] h-[280px] rounded-full opacity-10"
          style={{ background:"radial-gradient(circle,#05668D,transparent 70%)" }} />

        <div className="max-w-2xl mx-auto px-6 text-center">

          {/* Waveform and badge */}
          <div style={hs(0)} className="flex items-center gap-3 justify-center mb-6">
            <div className="flex items-end gap-[3px] h-5">
              {[12,18,14,20,10].map((h,i) => <span key={i} className="wave-bar" style={{ height:h }} />)}
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{ background:"rgba(2,195,154,0.15)", color:"#028090", border:"1px solid rgba(2,195,154,0.3)" }}>
              Get In Touch
            </span>
          </div>

          {/* Headline */}
          <div style={hs(110)}>
            <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.08] tracking-tight mb-4" style={{ color:"#05668D" }}>
              We're Here to{" "}
              <span className="relative" style={{ color:"#02C39A" }}>
                Help.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 120 10" preserveAspectRatio="none" style={{ height:6 }}>
                  <path d="M0 7 Q30 1 60 5 Q90 9 120 3" stroke="#02C39A" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.45"/>
                </svg>
              </span>
            </h1>
          </div>

          <div style={hs(200)}>
            <p className="text-base md:text-lg leading-relaxed max-w-lg mx-auto" style={{ color:"#05668D99" }}>
              Have a question, feedback, or need help with your appointment? Our team responds promptly and personally.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 pb-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {contactCards.map(({ icon, label, value, sub, color }, i) => (
            <Reveal key={label} delay={i * 70}>
              <div className="glass card-lift rounded-2xl p-5 flex flex-col items-start gap-3 cursor-default">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ background:`${color}18`, color }}>
                  {icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color:"#028090" }}>{label}</p>
                  <p className="font-bold text-sm leading-snug" style={{ color:"#05668D" }}>{value}</p>
                  <p className="text-[11px] mt-0.5" style={{ color:"#05668D80" }}>{sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FORM and SIDEBAR */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Form */}
          <Reveal className="lg:col-span-3">
            <div className="glass rounded-3xl p-8 md:p-10">
              {sent ? (
                /* Success state */
                <div className="success-pop flex flex-col items-center text-center py-8 gap-5">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background:"linear-gradient(135deg,#05668D,#02C39A)" }}>
                    <svg className="w-10 h-10" fill="none" stroke="white" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path className="check-draw" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold mb-2" style={{ color:"#05668D" }}>Message Sent!</h3>
                    <p className="text-sm leading-relaxed" style={{ color:"#05668D99" }}>
                      Thanks for reaching out. Our team will get back to you within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSent(false); setForm({ name:"", email:"", subject:"", message:"" }); }}
                    className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                    style={{ background:"linear-gradient(90deg,#05668D,#02C39A)" }}
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                /* Form */
                <>
                  <div className="mb-7">
                    <h2 className="text-xl font-extrabold mb-1" style={{ color:"#05668D" }}>Send us a Message</h2>
                    <p className="text-sm" style={{ color:"#05668D80" }}>Fill in the form and we'll be in touch.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { field:"name",  label:"Full Name",      type:"text",  placeholder:"Jane Doe" },
                        { field:"email", label:"Email Address",  type:"email", placeholder:"jane@example.com" },
                      ].map(({ field, label, type, placeholder }) => (
                        <div key={field}>
                          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color:"#028090" }}>{label}</label>
                          <input
                            required
                            type={type}
                            placeholder={placeholder}
                            value={form[field]}
                            onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                            onFocus={() => setFocused(field)}
                            onBlur={()  => setFocused("")}
                            className="w-full rounded-xl px-4 py-3 text-sm font-medium"
                            style={inputStyle(field)}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color:"#028090" }}>Subject</label>
                      <select
                        required
                        value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        onFocus={() => setFocused("subject")}
                        onBlur={()  => setFocused("")}
                        className="w-full rounded-xl px-4 py-3 text-sm font-medium"
                        style={inputStyle("subject")}
                      >
                        <option value="" disabled>Select a topic…</option>
                        <option value="appointment">Appointment Booking</option>
                        <option value="technical">Technical Support</option>
                        <option value="billing">Billing Enquiry</option>
                        <option value="feedback">General Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color:"#028090" }}>Message</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tell us how we can help…"
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        onFocus={() => setFocused("message")}
                        onBlur={()  => setFocused("")}
                        className="w-full rounded-xl px-4 py-3 text-sm font-medium resize-none"
                        style={inputStyle("message")}
                      />
                    </div>

                    <button
                      type="submit"
                      className="shimmer-btn w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 group mt-1"
                      style={{ backgroundImage:"linear-gradient(90deg,#05668D,#02C39A,#028090,#05668D)" }}
                    >
                      Send Message
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </form>
                </>
              )}
            </div>
          </Reveal>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-5">

            {/* Decorative doctor card */}
            <Reveal delay={100}>
              <div className="relative glass rounded-3xl overflow-hidden" style={{ minHeight:220 }}>
                {/* gradient bg */}
                <div className="absolute inset-0" style={{ background:"linear-gradient(155deg,#028090,#05668D)" }} />
                <div className="absolute inset-0 opacity-20"
                  style={{ background:"radial-gradient(ellipse at 70% 10%,#02C39A,transparent 60%)" }} />

                {/* Spinning rings */}
                <div className="ring-spin pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full"
                  style={{ border:"2px dashed rgba(2,195,154,0.35)" }} />
                <div className="ring-spin-r pointer-events-none absolute -bottom-6 -left-6 w-20 h-20 rounded-full"
                  style={{ border:"1.5px dashed rgba(255,255,255,0.2)" }} />

                {/* Content */}
                <div className="relative z-10 p-6 flex items-end gap-4 h-full" style={{ minHeight:220 }}>
                  <img
                    src="/logo.png" alt="Logo"
                    className="float-el w-28 object-contain object-center select-none flex-shrink-0"
                    style={{ filter:"drop-shadow(0 -4px 16px rgba(0,0,0,0.2))", marginBottom:"1.8rem" }}
                  />
                  <div className="pb-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1.8">Talk to us</p>
                    <h3 className="text-lg font-extrabold text-white leading-tight mb-5">Need help with<br/>your appointment?</h3>
                    <Link to="/register"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                      style={{ background:"rgba(240,243,189,0.95)", color:"#05668D" }}
                    >
                      Book Now
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Response time badge */}
            <Reveal delay={160}>
              <div className="glass rounded-2xl px-5 py-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:"rgba(2,195,154,0.15)", color:"#02C39A" }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-black text-base" style={{ color:"#05668D" }}>Under 24 hrs</p>
                  <p className="text-xs" style={{ color:"#05668D80" }}>Average response time</p>
                </div>
              </div>
            </Reveal>

            {/* Social links */}
            <Reveal delay={220}>
              <div className="glass rounded-2xl px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color:"#028090" }}>Find us on</p>
                <div className="flex gap-3">
                  {[
                    { label:"Facebook", path:"M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                    { label:"Twitter",  path:"M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                    { label:"Instagram",path:"M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 6.5h11a1 1 0 011 1v9a1 1 0 01-1 1h-11a1 1 0 01-1-1v-9a1 1 0 011-1z" },
                    { label:"LinkedIn", path:"M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" },
                  ].map(({ label, path }) => (
                    <a key={label} href="#" aria-label={label}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5 hover:shadow-md"
                      style={{ background:"rgba(5,102,141,0.10)", color:"#05668D" }}
                      onMouseEnter={e => { e.currentTarget.style.background="linear-gradient(135deg,#05668D,#02C39A)"; e.currentTarget.style.color="white"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="rgba(5,102,141,0.10)"; e.currentTarget.style.color="#05668D"; }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 md:px-12 pb-24">
        <Reveal className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ color:"#05668D" }}>Frequently Asked</h2>
          <p className="text-sm" style={{ color:"#028090" }}>Quick answers to the questions we hear most often</p>
        </Reveal>
        <div className="space-y-3">
          {faqs.map((f, i) => <FaqItem key={i} {...f} index={i} />)}
        </div>
      </section>

      {/* CTA */}
      <Reveal>
        <section className="mx-4 md:mx-12 mb-16 rounded-3xl overflow-hidden shadow-2xl">
          <div
            className="relative flex flex-col md:flex-row items-center justify-between px-8 md:px-14 py-14 gap-8 overflow-hidden"
            style={{ background:"linear-gradient(120deg,#05668D 0%,#02C39A 100%)" }}
          >
            <div className="pointer-events-none absolute right-0 top-0 w-80 h-80 rounded-full opacity-[0.07] -translate-y-1/2 translate-x-1/3" style={{ background:"white" }} />
            <div className="pointer-events-none absolute left-8 bottom-0 w-48 h-48 rounded-full opacity-[0.05] translate-y-1/2" style={{ background:"white" }} />
            <div className="text-white text-center md:text-left relative z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Ready to book your appointment?</h2>
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