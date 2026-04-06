import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import GooeyNav from "./GooeyNav";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, userData, logout, theme, toggleTheme, backendUrl } = useContext(AppContext);
  const isNight = theme === "night";

  if (location.pathname === "/" || location.pathname === "/login") {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Doctors", href: "/doctors" },
    { label: "Appointments", href: "/my-appointments" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[2001] transition-all duration-500 border-b
        ${isNight ? 'bg-black/80 border-white/5' : 'bg-white/80 border-slate-100'} backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between relative">
          {/* Logo or Spacer for logo if needed */}
          <div className="w-10"></div>

          {/* Center Navigation */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <GooeyNav
              items={navItems}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              initialActiveIndex={navItems.findIndex(i => i.href === location.pathname) || 0}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <AnimatedThemeToggler />

            {token && userData ? (
              <div className="relative group rounded-full border border-[var(--border-color)] hover:bg-[var(--bg-primary)] shadow-sm transition-all cursor-pointer p-1">
                <div className="flex items-center gap-2 pr-3 pl-1">
                  <img
                    className="w-8 h-8 rounded-full border border-[var(--border-color)] object-cover"
                    src={userData.image ? (userData.image.startsWith('http') ? userData.image : backendUrl + userData.image) : assets.default_user}
                    alt="p"
                  />
                  <ChevronDown className="w-4 h-4 text-[var(--text-main)]" />
                </div>
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full pt-4 w-48 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                  <div className={`border rounded-2xl p-2 shadow-2xl ${isNight ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-slate-100'}`}>
                    <div onClick={() => navigate("/my-profile")} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer ${isNight ? 'text-white hover:bg-white/5' : 'text-slate-900 hover:bg-slate-50'}`}>Account</div>
                    <div onClick={() => { logout(); navigate("/login"); }} className="px-4 py-2 hover:bg-red-500/10 rounded-xl text-xs font-bold text-red-500 uppercase cursor-pointer">Terminate Access</div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className={`rounded-xl px-6 py-2 text-sm font-bold uppercase transition-shadow border
                  ${isNight ? 'bg-white text-black hover:bg-zinc-200 border-white' : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900 shadow-xl shadow-slate-200'}`}
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
