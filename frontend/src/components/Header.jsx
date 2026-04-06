import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, User, LogOut, ChevronDown, ChevronDown as ScrollIcon } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const Header = () => {
  const navigate = useNavigate();
  const { token, userData, logout, theme, toggleTheme, backendUrl } = useContext(AppContext);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx appointly setup --vibrant --care");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="h-svh w-full flex items-center justify-center p-2 sm:p-6 md:p-8 lg:p-10 bg-[var(--bg-primary)] transition-colors duration-500">
      <div className="relative w-full h-full max-w-[2400px] max-h-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl bg-[var(--bg-card)] transition-colors duration-700">

        {/* Hero Images — CSS-switched, no React re-render needed */}
        <img
          src={assets.doctor_illu}
          alt="Day Healthcare Illustration"
          className="hero-img hero-img-day"
        />
        <img
          src={assets.doctor_illu_night}
          alt="Night Healthcare Illustration"
          className="hero-img hero-img-night"
        />

        {/* Global Dark Overlay for Readability (Optional but adds depth) */}
        <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>

        {/* Foreground Content Wrapper */}
        <div className="relative z-10 h-full flex flex-col p-6 sm:p-10 md:p-12 lg:p-14">

          {/* Top Left Branding */}
          <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-20 flex items-center gap-3">
            <img src={assets.header_logo} alt="Appointly Logo" className="w-10 opacity-70 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => navigate("/")} />
          </div>

          {/* Top Navbar Section - Refined for premium feel */}
          <div className="absolute top-6 right-6 sm:top-10 sm:right-10 z-20 flex items-center gap-4">
            <AnimatePresence mode="wait">
              {token && userData ? (
                <motion.div 
                  key="user-profile"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all cursor-pointer p-1"
                >
                  <div className="flex items-center gap-2 pr-3 pl-1" onClick={() => navigate("/my-profile")}>
                    <img 
                      className="w-8 h-8 rounded-full border border-white/20 object-cover" 
                      src={userData.image ? (userData.image.startsWith('http') ? userData.image : backendUrl + userData.image) : assets.default_user} 
                      alt="Profile" 
                    />
                    <ChevronDown className="w-3 h-3 text-white/70 group-hover:text-white transition-colors" />
                  </div>
                  <div className="absolute right-0 top-full pt-4 w-48 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                    <div className="bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                      <div onClick={() => navigate("/my-profile")} className="px-4 py-2 hover:bg-white/5 rounded-xl text-[10px] font-bold text-white uppercase cursor-pointer tracking-widest">Console</div>
                      <div onClick={() => { logout(); navigate("/login"); }} className="px-4 py-2 hover:bg-white/5 rounded-xl text-[10px] font-bold text-red-500 uppercase cursor-pointer tracking-widest mt-1">Disconnect</div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="login-btn"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => navigate("/login")}
                  className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-8 py-2.5 text-sm font-bold text-white hover:bg-white/20 hover:border-white/40 transition-all active:scale-95 shadow-lg"
                >
                  Log in
                </motion.button>
              )}
            </AnimatePresence>

            {/* Animated Theme Toggle */}
            <AnimatedThemeToggler className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/40 shadow-lg" />
          </div>

          {/* Center Main Content */}
          <div className="flex-1 flex flex-col justify-center max-w-2xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/80 text-base sm:text-lg mb-4 lowercase tracking-tight"
            >
              meet appointly
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="hero-title mb-16"
            >
              Connecting You <br /> with <em className="italic font-bold text-[#4cf6a3]">Doctors</em>, <br /> Effortlessly.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mt-10"
            >
              <button
                onClick={() => navigate("/doctors")}
                className="inline-flex items-center justify-center rounded-md border-2 border-white/90 bg-white/90 px-6 py-2.5 text-sm font-medium text-black hover:bg-white transition-colors lowercase"
              >
                See Docs
              </button>
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-black/80 transition-colors lowercase"
              >
                Create New
              </button>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center pb-2">
            <ScrollIcon className="w-5 h-5 text-white/30 animate-bounce" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Header;
