import React from "react";
import { Link } from "react-router-dom";
import { CrossIcon } from "./icons";
import { IoChevronBackCircleOutline } from "react-icons/io5";

export default function BrandPanel() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between p-10 text-white relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
      }}
    >
      {/* Decorative Circles */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
        style={{ background: "#ffffff" }}
      />

      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-10"
        style={{ background: "#ffffff" }}
      />

      {/* Logo */}
      <div className="relative z-10">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(10px)",
          }}
        >
          <img src="/logo.png" alt="CLINEXA Logo" className="w-15 h-15 object-contain inline-block" />
        </div>

        <h1
          className="text-4xl font-bold"
          style={{
            fontFamily: "Poppins, sans-serif",
          }}
        >
          CLINEXA
        </h1>

        <p
          className="mt-3 text-lg opacity-90"
          style={{
            fontFamily: "Inter, sans-serif",
          }}
        >
        Next Generation Healthcare
        </p>
      </div>

      {/* Bottom Content */}
      <div className="relative z-10">
        <h2
          className="text-2xl font-semibold mb-4"
          style={{
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Your Health,
          <br />
          Our Priority
        </h2>

        <p
          className="text-white/80 leading-7"
          style={{
            fontFamily: "Inter, sans-serif",
          }}
        >
          Easily book appointments with experienced doctors, manage
          your schedules, and access healthcare services from one
          secure platform.
        </p>

        <div className="flex gap-3 mt-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="w-3 h-3 rounded-full"
              style={{
                background:
                  item === 1
                    ? "#FFFFFF"
                    : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
          <Link 
          to="/"
          className="flex items-center gap-1 text-white/80 hover:text-white transition-colors">
            <IoChevronBackCircleOutline className="w-10 h-10" />
            </Link>
          
        </div>
      </div>
    </div>
  );
}