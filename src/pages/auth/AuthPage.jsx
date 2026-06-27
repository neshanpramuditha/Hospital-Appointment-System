import { useState } from "react";

import BrandPanel from "../../assets/auth/BrandPanel";
import MobileBrandBar from "../../assets/auth/MobileBrandBar";
import TabSwitcher from "../../assets/auth/TabSwitcher";

import Login from "./Test";
import Register from "./Register";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div
        className="w-full max-w-6xl overflow-hidden rounded-3xl shadow-2xl bg-white grid lg:grid-cols-2"
      >
        {/* Left Side */}
        <BrandPanel />

        {/* Right Side */}
        <div className="flex flex-col">

          <MobileBrandBar />

          <div className="flex-1 p-6 lg:p-10">

            <TabSwitcher
              activeTab={activeTab}
              onChange={setActiveTab}
            />

            <div className="mt-8">

              {activeTab === "login" ? (
                <Login
                  onSwitch={() => setActiveTab("register")}
                />
              ) : (
                <Register
                  onSwitch={() => setActiveTab("login")}
                />
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}