import React, { useContext } from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";

const SpecialityMenu = () => {
  const { theme } = useContext(AppContext);
  const isNight = theme === "night";
  return (
    <section
      id="speciality"
      className="relative flex flex-col items-center gap-16 py-32 px-6 bg-[var(--bg-primary)] overflow-hidden font-inter transition-colors duration-500"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4ca6a3]/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Title & Description */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-6 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-500/10 border border-zinc-500/20 text-[10px] font-bold tracking-[0.2em] text-[#4ca6a3] mb-4 uppercase transition-colors">
           medical expertise
        </div>
        <h2 className="young-serif text-5xl md:text-7xl leading-tight text-[var(--text-main)] transition-colors lowercase">
           choose your <br /> 
           <span className="italic">specialization.</span>
        </h2>
        <p className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-xl font-light leading-relaxed">
          Access world-class medical specialists through our curated digital healthcare ecosystem. 
          Expert care, reimagined for the modern era.
        </p>
      </motion.div>

      {/* Speciality Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-12 w-full max-w-7xl mx-auto relative z-10 font-inter">
        {specialityData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link
              to={`/doctors/${item.speciality}`}
              onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`group flex flex-col items-center gap-6 p-10 rounded-[32px] border transition-all duration-500 hover:-translate-y-2 relative overflow-hidden
                ${isNight
                  ? "bg-white/[0.03] border-white/5 hover:bg-[#4ca6a3]/10 hover:border-[#4ca6a3]/20"
                  : "bg-gray-50 border-gray-200 hover:bg-[#4ca6a3]/5 hover:border-[#4ca6a3]/20"
                }`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#4ca6a3]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700 scale-150"></div>
                <img
                   className="w-16 h-16 relative z-10 transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100"
                   src={item.image}
                   alt={item.speciality}
                />
              </div>

              <div className="flex flex-col items-center gap-2">
                 <p className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 text-center leading-tight
                   ${isNight ? "text-zinc-500 group-hover:text-white" : "text-gray-400 group-hover:text-gray-800"}`}>
                   {item.speciality}
                 </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SpecialityMenu;
