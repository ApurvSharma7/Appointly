import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import GooeyNav from "./GooeyNav";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { ChevronDown, Menu, X, Home, Users, Calendar, Info, Phone, LogOut, User } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, userData, logout, theme, toggleTheme, backendUrl } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isNight = theme === "night";

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-pill-container')) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileOpen]);

  // Prevent scroll when side menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  if (location.pathname === "/" || location.pathname === "/login") {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
    { label: "Doctors", href: "/doctors", icon: <Users className="w-4 h-4" /> },
    { label: "Appointments", href: "/my-appointments", icon: <Calendar className="w-4 h-4" /> },
    { label: "About", href: "/about", icon: <Info className="w-4 h-4" /> },
    { label: "Contact", href: "/contact", icon: <Phone className="w-4 h-4" /> },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[2001] transition-all duration-500 border-b
        ${isNight ? 'bg-[#000000] border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between relative">

          {/* Mobile Menu Toggle (Left) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-xl border transition-all ${isNight ? 'border-white/10 hover:bg-zinc-900 shadow-sm' : 'border-slate-100 hover:bg-slate-50 shadow-sm'}`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo - click to home - Hidden on Mobile */}
          <div onClick={() => navigate("/")} className="hidden md:flex cursor-pointer items-center gap-3 group md:ml-0">
            <img src={assets.logo} alt="logo" className="w-auto h-8 md:h-10 object-contain" />
          </div>

          {/* Center Navigation - Hidden on Mobile */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
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
              <div className="relative profile-pill-container hidden md:block">
                <div
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center gap-2 pr-4 pl-1.5 py-1.5 rounded-full border transition-all cursor-pointer shadow-sm
                    ${isNight ? 'bg-[#1a1a1a] border-white/10 hover:bg-zinc-900' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
                >
                  <img
                    className="w-8 h-8 rounded-full border border-white/10 object-cover"
                    src={userData.image ? (userData.image.startsWith('http') ? userData.image : backendUrl + userData.image) : assets.default_user}
                    alt="profile"
                  />
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''} ${isNight ? 'text-zinc-500' : 'text-slate-400'}`} />
                </div>

                {/* Unified Dropdown Menu (Works on Mobile and Desktop) */}
                <div className={`absolute right-0 top-full pt-4 w-52 transition-all duration-300 z-[3000]
                  ${isProfileOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto'}
                `}>
                  <div className={`border rounded-2xl p-2 shadow-2xl ${isNight ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-100'}`}>
                    <div
                      onClick={() => { navigate("/my-profile"); setIsProfileOpen(false); }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase cursor-pointer transition-colors ${isNight ? 'text-white hover:bg-zinc-900' : 'text-slate-900 hover:bg-slate-50'}`}
                    >
                      <User className="w-4 h-4 opacity-50" /> Account Settings
                    </div>
                    <div
                      onClick={() => { logout(); navigate("/login"); setIsProfileOpen(false); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 rounded-xl text-xs font-bold text-red-500 uppercase cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Terminate Access
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className={`rounded-xl px-4 md:px-6 py-2.5 text-[10px] md:text-xs font-bold uppercase transition-all border
                  ${isNight ? 'bg-white text-black hover:bg-zinc-100 border-white shadow-lg' : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900 shadow-lg shadow-slate-200'}`}
              >
                Log in
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`md:hidden fixed inset-0 top-0 z-[2000] transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className={`absolute inset-0 bg-black/40`} onClick={() => setIsMenuOpen(false)} />
          <div className={`absolute left-0 top-0 bottom-0 w-4/5 max-w-sm transition-transform duration-500 ease-out p-6 shadow-2xl
            ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            ${isNight ? 'bg-[#000000] border-r border-white/5' : 'bg-white'}`}>

            <div className="flex flex-col h-full text-foreground">
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-6 ${isNight ? 'text-zinc-500' : 'text-slate-400'}`}>Navigation</p>

              <div className="space-y-2 flex-grow">
                {navItems.map((item, idx) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <div
                      key={idx}
                      onClick={() => navigate(item.href)}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer border
                        ${isActive
                          ? (isNight ? 'bg-white text-black border-white' : 'bg-slate-900 text-white border-slate-900 shadow-lg')
                          : (isNight ? 'text-white border-transparent hover:bg-zinc-900' : 'text-slate-600 border-transparent hover:bg-slate-50')
                        }`}
                    >
                      {item.icon}
                      <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </div>
                  );
                })}
              </div>

              {token && userData && (
                <div className={`mt-auto pt-6 border-t ${isNight ? 'border-white/5' : 'border-slate-100'}`}>
                  <div
                    onClick={() => navigate("/my-profile")}
                    className={`flex items-center gap-4 p-4 rounded-2xl mb-2 cursor-pointer ${isNight ? 'hover:bg-zinc-900' : 'hover:bg-slate-50'}`}
                  >
                    <User className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className={`text-sm font-bold ${isNight ? 'text-white' : 'text-slate-900'}`}>My Profile</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold">Manage Account</p>
                    </div>
                  </div>
                  <div
                    onClick={() => { logout(); navigate("/login"); }}
                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-red-500/10 text-red-500`}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-bold text-sm">Terminate Access</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
