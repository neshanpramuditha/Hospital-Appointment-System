import { Link } from "react-router-dom";
import { useState } from "react";

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Easy Scheduling",
    desc: "Book appointments in seconds — no phone calls, no waiting on hold.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Expert Doctors",
    desc: "Choose from a wide network of verified, specialist physicians.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Secure Records",
    desc: "Your medical history and data protected with enterprise-grade security.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Real-time Updates",
    desc: "Get instant confirmations and reminders for every appointment.",
  },
];

const specialties = [
  { name: "Cardiology", icon: "❤️" },
  { name: "Neurology", icon: "🧠" },
  { name: "Orthopedics", icon: "🦴" },
  { name: "Pediatrics", icon: "👶" },
  { name: "Dermatology", icon: "🌿" },
  { name: "Ophthalmology", icon: "👁️" },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-accent selection:text-white">

      {/* ── Navbar ── */}
      <nav
        className="px-6 md:px-12 py-4 flex items-center justify-between shadow-sm relative z-50"
        style={{ background: "linear-gradient(90deg, #05668D 0%, #02C39A 100%)" }}
      >
        {/* Brand Logo Container */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg bg-white/10 p-1 backdrop-blur-sm shadow-inner">
            <img 
              src="/logo.png" 
              alt="CLINEXA Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-white text-xl font-bold tracking-wide">CLINEXA</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-white/90 text-sm font-medium">
          <a href="#" className="hover:text-white transition-colors">Doctors</a>
          <a href="#" className="hover:text-white transition-colors">Doctor Schedules</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/register"
            className="px-5 py-2 rounded-full bg-white text-sm font-semibold transition-all hover:opacity-90 shadow-sm"
            style={{ color: "#05668D" }}
          >
            Signup Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 py-4 flex flex-col gap-3 text-sm font-medium relative z-50" style={{ background: "#05668D" }}>
          {["Doctors", "Doctor Schedules", "About", "Contact"].map(item => (
            <a key={item} href="#" className="text-white/90 hover:text-white">{item}</a>
          ))}
          <div className="flex gap-3 mt-2">
            <Link to="/login" className="px-4 py-2 rounded-full border border-white/40 text-white hover:bg-white/10">Login</Link>
            <Link to="/register" className="px-4 py-2 rounded-full bg-white font-semibold" style={{ color: "#05668D" }}>Register</Link>
          </div>
        </div>
      )}

      {/* ── HERO SECTION ── */}
      <section className="relative bg-white pt-10 pb-20 lg:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Side: Dynamic Copy Text */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm"
              style={{ background: "#E8F8F5", color: "#02C39A" }}
            >
              ✨ Next-Generation Healthcare
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight" style={{ color: "#05668D" }}>
              Your Health,<br />
              <span style={{ color: "#02C39A" }}>Our Priority.</span>
            </h1>
            
            <p className="text-gray-500 text-base md:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
              Book appointments with top specialists, manage your schedules, and access hospital services — all from one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 text-center"
                style={{ background: "linear-gradient(90deg, #05668D, #02C39A)" }}
              >
                Make an Appointment
              </Link>
              <Link
                to="/doctors"
                className="px-8 py-4 rounded-xl font-bold text-sm border-2 transition-all hover:bg-gray-50 text-center"
                style={{ color: "#05668D", borderColor: "#05668D" }}
              >
                Browse Doctors
              </Link>
            </div>

            {/* Metrics Counter Section */}
            <div className="flex gap-8 pt-6 justify-center lg:justify-start border-t border-gray-100 mt-8">
              {[["200+", "Doctors"], ["15k+", "Patients"], ["98%", "Satisfaction"]].map(([num, label]) => (
                <div key={label}>
                  <p className="text-2xl font-black" style={{ color: "#05668D" }}>{num}</p>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Reference Card Frame Canvas */}
          <div className="lg:col-span-6 flex justify-center items-center relative w-full h-[460px] md:h-[520px]">
            
            {/* Main Geometric Shield Backplate Shape */}
            <div 
              className="absolute inset-0 rounded-tl-[100px] rounded-br-[100px] rounded-tr-[24px] rounded-bl-[24px] shadow-2xl flex items-end justify-center overflow-hidden"
              style={{ background: "linear-gradient(145deg, #028090 20%, #05668D 90%)" }}
            >
              {/* Doctor Image pulling directly from your public folder asset */}
              <div className="h-[92%] w-full flex justify-center relative">
                <img 
                  src="/doc.png" 
                  alt="Doctor Visual Display" 
                  className="h-full object-contain object-bottom select-none filter drop-shadow-2xl z-10"
                />
              </div>

              {/* Functional Next Arrow Floating Badge */}
              <div className="absolute top-8 right-8 bg-white p-3 rounded-2xl shadow-lg transition-transform hover:scale-110 cursor-pointer hidden sm:block">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-gray-800">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>

            {/* Overlapping Floating Appointment Detail Card Block */}
            <div className="absolute bottom-[-15px] right-[-10px] bg-white p-5 rounded-3xl shadow-2xl w-[240px] border border-gray-100/80 z-20 transition-transform hover:scale-105">
              <div className="flex flex-col items-center text-center space-y-3">
                
                {/* Circular Profile Avatar Thumbnail with Crop Frame */}
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-accent/40 bg-gray-50 shadow-inner">
                  <img 
                    src="/doc.png" 
                    alt="Clinicxa Avatar Thumbnail" 
                    className="w-full h-full object-cover object-top scale-125 mt-1"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-black tracking-tight text-gray-900">CLINEXA</h3>
                  <p className="text-[11px] text-gray-400 font-semibold tracking-wide">Next-Generation Healthcare</p>
                </div>

                <Link 
                  to="/login"
                  className="w-full bg-[#1F293D] hover:bg-primary text-white text-xs font-bold py-3 rounded-xl shadow-md transition-colors block text-center"
                >
                  Make appointment
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Specialties ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: "#05668D" }}>Browse by Specialty</h2>
          <p className="text-gray-400 text-sm mt-2">Find the right specialist for your needs</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {specialties.map(({ name, icon }) => (
            <button
              key={name}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-lg transition-all hover:-translate-y-1"
              style={{ background: "white" }}
              onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg,#E8F8F5,#EDF6FB)"}
              onMouseLeave={e => e.currentTarget.style.background = "white"}
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-semibold text-gray-600 text-center leading-tight">{name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16" style={{ background: "#F8FFFE" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: "#05668D" }}>Why Choose CLINEXA?</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">Built for patients who expect more from their healthcare experience</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg,#E8F8F5,#EDF6FB)", color: "#028090" }}
                >
                  {icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-1.5">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="mx-4 md:mx-12 my-16 rounded-3xl overflow-hidden shadow-xl">
        <div
          className="flex flex-col md:flex-row items-center justify-between px-8 md:px-14 py-12 gap-6"
          style={{ background: "linear-gradient(120deg, #05668D 0%, #02C39A 100%)" }}
        >
          <div className="text-white text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Ready to take charge of your health?</h2>
            <p className="text-white/75 text-sm">Join thousands of patients who trust CLINEXA every day.</p>
          </div>
          <Link
            to="/register"
            className="shrink-0 px-8 py-3.5 rounded-full font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            style={{ background: "white", color: "#05668D" }}
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="text-center py-8 text-gray-400 text-xs border-t border-gray-100">
        © {new Date().getFullYear()} CLINEXA · Next-Generation Healthcare
      </footer>
    </div>
  );
}