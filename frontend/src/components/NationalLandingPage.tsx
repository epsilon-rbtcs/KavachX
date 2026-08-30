import React, { useState } from "react";
import {
  ShieldCheck,
  LogIn,
  X,
  Upload,
  LayoutDashboard,
  FileSearch,
  LockKeyhole,
} from "lucide-react";

type Props = {
  onSearch: (query: string, category: string) => void;
  onNavigateTab: (
    tab:
      | "submit"
      | "registry"
      | "standards"
      | "ai_crypto_profiler"
      | "upload_firmware"
  ) => void;
  onToggleContrast: () => void;
  highContrast: boolean;
  onOpenAccessibility: () => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  userEmail: string;
  onLogin: (email: string) => void;
  onLogout: () => void;
  onGoToAuditLogs: () => void;
};

export default function NationalLandingPage({
  onNavigateTab,
  isLoggedIn,
  isAdmin,
  userEmail,
  onLogin,
  onLogout,
  onGoToAuditLogs,
}: Props) {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    onLogin(email.trim());
    setShowLogin(false);
    setPassword("");
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/src/assets/images/india_gate_1781360143835.jpg')",
        }}
      />

      {/* DARK NAVY OVERLAY */}
      <div className="absolute inset-0 bg-[#031633]/85" />

      {/* SUBTLE BLUE GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#061d3f]/30 via-[#031633]/30 to-[#020b19]/90" />

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* TOP BAR */}
        <header className="w-full px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <ShieldCheck size={23} />
            </div>

            <div>
              <div className="font-bold tracking-widest text-sm">
                KAVACHX
              </div>
              <div className="text-[10px] text-blue-200 tracking-[0.25em]">
                NETWORK SECURITY PLATFORM
              </div>
            </div>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:block text-xs text-blue-100">
                {userEmail}
              </span>

              <button
                onClick={onLogout}
                className="px-4 py-2 text-xs border border-white/30 rounded-md bg-white/10 hover:bg-white/20 transition"
              >
                Logout
              </button>
            </div>
          ) : null}
        </header>

        {/* MAIN */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-4xl text-center">

            {/* GOVERNMENT EMBLEM */}
            <div className="flex justify-center mb-7">
              <div className="w-28 h-28 rounded-full bg-white/95 shadow-2xl flex items-center justify-center p-3">
                <img
                  src="/src/assets/images/national_emblem_clean_1781762649324.jpg"
                  alt="Government of India"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            {/* BRAND */}
            <div className="flex justify-center items-center mb-3">
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
                Kavach
              </h1>

              <span className="ml-2 px-2 py-1 text-[10px] font-bold bg-yellow-400 text-black rounded-sm">
                BETA
              </span>
            </div>

            {/* ORANGE / GREEN LINE */}
            <div className="flex justify-center mb-5">
              <div className="w-44 h-[2px] flex">
                <div className="w-1/2 bg-orange-500" />
                <div className="w-1/2 bg-green-500" />
              </div>
            </div>

            {/* TITLE */}
            <h2 className="text-sm md:text-base font-semibold tracking-[0.18em] uppercase">
              National Network Security Operations Portal
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-3 text-sm text-blue-100/80">
              Secure. Analyse. Monitor. Protect.
            </p>

            {/* LOGIN */}
            {!isLoggedIn ? (
              <button
                onClick={() => setShowLogin(true)}
                className="mt-7 inline-flex items-center gap-2 px-7 py-3 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-lg transition-all"
              >
                <LogIn size={17} />
                LOGIN
              </button>
            ) : (
              <div className="mt-8 flex justify-center gap-3 flex-wrap">

                <button
                  onClick={() => onNavigateTab("registry")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 font-semibold text-sm transition"
                >
                  <LayoutDashboard size={17} />
                  SOC DASHBOARD
                </button>

                <button
                  onClick={() => onNavigateTab("upload_firmware")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-orange-500 hover:bg-orange-600 font-semibold text-sm transition"
                >
                  <Upload size={17} />
                  ANALYSE PCAP / CSV
                </button>

                {isAdmin && (
                  <button
                    onClick={onGoToAuditLogs}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 font-semibold text-sm transition"
                  >
                    <FileSearch size={17} />
                    AUDIT HISTORY
                  </button>
                )}
              </div>
            )}
          </div>
        </main>

        {/* FOOTER */}
        <footer className="px-8 py-5 flex items-center justify-between text-[10px] text-blue-200/60 tracking-wider">
          <span>GOVERNMENT NETWORK SECURITY INITIATIVE</span>
          <span>© 2026 KAVACHX</span>
        </footer>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-5">
          <div className="w-full max-w-md bg-[#071a35] border border-white/20 rounded-xl shadow-2xl p-7">

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">
                  KavachX Login
                </h2>
                <p className="text-xs text-blue-200/70 mt-1">
                  Secure SOC authentication
                </p>
              </div>

              <button
                onClick={() => setShowLogin(false)}
                className="text-white/60 hover:text-white"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">

              <div>
                <label className="block text-xs text-blue-100 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@kavachx.gov.in"
                  className="w-full px-4 py-3 rounded-md bg-[#03132a] border border-white/15 outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-blue-100 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-md bg-[#03132a] border border-white/15 outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-md bg-orange-500 hover:bg-orange-600 font-semibold text-sm flex items-center justify-center gap-2 transition"
              >
                <LockKeyhole size={17} />
                AUTHENTICATE
              </button>

            </form>

            <p className="text-[10px] text-center text-white/40 mt-5">
              Authorized access only
            </p>
          </div>
        </div>
      )}
    </div>
  );
}