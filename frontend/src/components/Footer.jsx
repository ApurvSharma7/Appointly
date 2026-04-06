import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Twitter, Instagram, Linkedin, Mail, Globe, Shield, ArrowUpRight } from "lucide-react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useContext(AppContext);
  const isNight = theme === "night";

  if (location.pathname === "/login") {
    return null;
  }

  return (
    <footer className={`relative pt-24 pb-12 px-6 font-inter overflow-hidden transition-colors duration-500
      ${isNight ? "bg-[#000000]" : "bg-[#ffffff]"}`}
    >
      {/* Top divider */}
      <div className={`absolute top-0 left-0 right-0 h-px ${isNight ? "bg-white/10" : "bg-black/5"}`} />

      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 pb-16">

          {/* Brand */}
          <div className="space-y-8 md:col-span-1">
            <div
              onClick={() => { navigate("/"); window.scrollTo(0, 0); }}
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              <img className="w-8 opacity-80 group-hover:opacity-100 transition-opacity" src={assets.logo} alt="logo" />
              <span className={`text-xl font-bold tracking-tight transition-colors italic
                ${isNight ? "text-white group-hover:text-[#4ca6a3]" : "text-slate-900 group-hover:text-[#4ca6a3]"}`}>
                Appointly
              </span>
            </div>
            <p className={`leading-relaxed text-sm font-medium ${isNight ? "text-zinc-400" : "text-slate-600"}`}>
              Reimagining tomorrow's medical care today. The advanced healthcare platform for the digital era.
            </p>
            <div className="flex gap-3">
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <button key={i} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer border
                  ${isNight
                    ? "bg-white/5 border-white/10 hover:bg-[#4ca6a3] hover:border-transparent text-zinc-400 hover:text-white"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-900 hover:border-transparent text-slate-500 hover:text-white"
                  }`}>
                  <Icon className="w-4 h-4 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-8">
            <h3 className={`text-[10px] font-black tracking-[0.3em] uppercase ${isNight ? "text-zinc-500" : "text-slate-900"}`}>Navigation</h3>
            <ul className="flex flex-col gap-4">
              {[
                { label: "Home", path: "/" },
                { label: "Doctors", path: "/doctors" },
                { label: "About", path: "/about" },
                { label: "Contact", path: "/contact" },
              ].map((item) => (
                <li
                  key={item.label}
                  onClick={() => { navigate(item.path); window.scrollTo(0, 0); }}
                  className={`text-sm cursor-pointer flex items-center gap-2 group w-fit transition-all font-medium
                    ${isNight ? "text-zinc-400 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
                >
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -ml-5 group-hover:ml-0" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Specialities */}
          <div className="space-y-8">
            <h3 className={`text-[10px] font-black tracking-[0.3em] uppercase ${isNight ? "text-zinc-500" : "text-slate-900"}`}>Specialities</h3>
            <ul className="flex flex-col gap-4">
              {["General Care", "Neurology", "Cardiology", "Pediatrics", "Dermatology"].map((item) => (
                <li
                  key={item}
                  className={`text-sm cursor-pointer w-fit transition-colors font-medium
                    ${isNight ? "text-zinc-400 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-8">
            <h3 className={`text-[10px] font-black tracking-[0.3em] uppercase ${isNight ? "text-zinc-500" : "text-slate-900"}`}>Support</h3>
            <div className="space-y-4">
              <a href="mailto:help@appointly.ai" className={`flex items-center gap-3 group text-sm transition-colors font-medium
                ${isNight ? "text-zinc-400 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}>
                <Mail className="w-4 h-4 text-[#4ca6a3]" />
                help@appointly.ai
              </a>
              <div className={`flex items-center gap-3 text-sm font-medium ${isNight ? "text-zinc-400" : "text-slate-600"}`}>
                <Globe className="w-4 h-4 text-[#4ca6a3]" />
                global registry v1.0
              </div>
            </div>

            <div className={`p-5 rounded-3xl border flex items-center gap-4 transition-all
              ${isNight ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200 shadow-sm"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isNight ? 'bg-[#4ca6a3]/10' : 'bg-[#4ca6a3]/5'}`}>
                <Shield className="w-5 h-5 text-[#4ca6a3] shrink-0" />
              </div>
              <p className={`text-[10px] font-black tracking-[0.2em] uppercase leading-tight
                ${isNight ? "text-zinc-400" : "text-slate-900"}`}>
                Encrypted secure portal
              </p>
            </div>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className={`pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-all
          ${isNight ? "border-white/10" : "border-slate-100"}`}>
          <p className={`text-[11px] tracking-[0.1em] uppercase font-bold ${isNight ? "text-zinc-500" : "text-slate-400"}`}>
            © 2026 Appointly. healthcare innovation.
          </p>
          <div className="flex items-center gap-10">
            {["Privacy Policy", "Terms of Service"].map((t) => (
              <p key={t} className={`text-[11px] uppercase tracking-[0.1em] cursor-pointer transition-colors font-bold
                ${isNight ? "text-zinc-500 hover:text-white" : "text-slate-400 hover:text-slate-900"}`}>
                {t}
              </p>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
