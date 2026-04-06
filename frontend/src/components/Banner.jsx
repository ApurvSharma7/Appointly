import { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Stethoscope } from "lucide-react";
import { AppContext } from "../context/AppContext";

const Banner = () => {
  const navigate = useNavigate();
  const { theme } = useContext(AppContext);
  const isNight = theme === "night";

  return (
    <section className={`relative mx-6 md:mx-16 my-24 overflow-hidden rounded-[48px] border transition-colors duration-500
      ${isNight
        ? "bg-[#0a0a0a] border-white/5"
        : "bg-[#f4f4f4] border-black/5"
      }`}
    >
      {/* Ambient glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[120px] rounded-full pointer-events-none opacity-30
        ${isNight ? "bg-[#4ca6a3]" : "bg-[#4ca6a3]"}`} />

      <div className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16 md:py-24 relative z-10 gap-12">

        {/* Left Side */}
        <div className="flex-1 text-center md:text-left max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-[0.2em] uppercase mb-6 transition-colors"
            style={{
              background: isNight ? "rgba(76,166,163,0.08)" : "rgba(76,166,163,0.08)",
              borderColor: isNight ? "rgba(76,166,163,0.2)" : "rgba(76,166,163,0.2)",
              color: "#4ca6a3"
            }}
          >
            <Stethoscope className="w-3 h-3" /> Healthcare Reimagined
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6 tracking-tight transition-colors
              ${isNight ? "text-white" : "text-gray-900"}`}
          >
            Your Health,<br />
            <span className="italic text-[#4ca6a3]">Our Priority.</span>
          </motion.h2>

          <p className={`text-base md:text-lg font-light leading-relaxed mb-10 transition-colors
            ${isNight ? "text-zinc-500" : "text-gray-500"}`}>
            Book appointments with trusted doctors anytime, anywhere.
            Simple, secure, and accessible healthcare — always.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { navigate("/contact"); window.scrollTo(0, 0); }}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold lowercase tracking-wide transition-all
              ${isNight
                ? "bg-white text-black hover:bg-zinc-100"
                : "bg-gray-900 text-white hover:bg-gray-700"
              }`}
          >
            Connect with Us <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Right Side — Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          {[
            { value: "50+", label: "Verified Specialists" },
            { value: "10k+", label: "Appointments Booked" },
            { value: "4.9★", label: "Average Rating" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-6 rounded-[28px] border flex items-center justify-between transition-colors
                ${isNight
                  ? "bg-white/5 border-white/5 hover:bg-white/8"
                  : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
            >
              <p className={`text-3xl font-bold tracking-tight ${isNight ? "text-white" : "text-gray-900"}`}>{stat.value}</p>
              <p className={`text-xs font-bold uppercase tracking-widest ${isNight ? "text-zinc-500" : "text-gray-400"}`}>{stat.label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Banner;
