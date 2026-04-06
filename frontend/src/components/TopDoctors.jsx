import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const TopDoctors = () => {
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);

    return (
        <section className="bg-[var(--bg-primary)] py-32 px-6 flex flex-col items-center gap-16 font-inter transition-colors duration-500">
            {/* Background Accent */}
            <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-[#4ca6a3]/5 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Header Content */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center space-y-6"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-500/10 border border-zinc-500/20 text-[10px] font-bold tracking-[0.2em] text-[#4ca6a3] mb-4 uppercase">
                   Verified Specialists
                </div>
                <h2 className="young-serif text-5xl md:text-7xl leading-tight text-[var(--text-main)] transition-colors lowercase">
                    our leading <br /> 
                    <span className="italic font-normal">medical professionals.</span>
                </h2>
                <p className="max-w-xl mx-auto text-zinc-500 text-lg md:text-xl font-light leading-relaxed">
                    Connect with the most trusted clinicians through our advanced medical distribution platform.
                </p>
            </motion.div>

            {/* Content Display Grid */}
            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
                {doctors.slice(0, 8).map((item, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0,0); }}
                        className="group relative cursor-pointer"
                    >
                        {/* Elite Transformation Card */}
                        <div className="bg-zinc-500/5 backdrop-blur-sm border border-zinc-500/10 rounded-[40px] p-6 hover:border-[#4ca6a3]/30 transition-all duration-700 hover:bg-zinc-500/10 shadow-2xl relative overflow-hidden h-[450px] flex flex-col items-center">
                            
                            {/* Hover Glimmer */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4ca6a3]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            {/* Image Container */}
                            <div className="relative w-full h-[65%] mb-8 rounded-[32px] overflow-hidden bg-black/40 border border-white/5">
                                <img 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter grayscale group-hover:grayscale-0" 
                                    src={item.image} 
                                    alt={item.name} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                
                                {/* Status Indicator */}
                                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                                    <div className="w-1.5 h-1.5 bg-[#4ca6a3] rounded-full animate-pulse shadow-[0_0_10px_#4ca6a3]"></div>
                                    <p className="text-[9px] font-bold text-white uppercase tracking-widest leading-none">Available</p>
                                </div>
                            </div>

                            {/* Details Text Content */}
                            <div className="w-full flex flex-col items-start gap-2 relative z-10 font-inter">
                                <h3 className="text-xl font-bold text-[var(--text-main)] transition-colors leading-tight mb-2 uppercase italic tracking-tighter">
                                    {item.name}
                                </h3>
                                <div className="flex items-center justify-between w-full">
                                   <p className="text-[10px] font-black italic tracking-[0.2em] text-[#4ca6a3] leading-none uppercase">
                                     {item.speciality}
                                   </p>
                                   <div className="w-8 h-8 rounded-xl bg-[#4ca6a3]/20 flex items-center justify-center border border-[#4ca6a3]/30 group-hover:bg-[#4ca6a3] group-hover:border-none transition-all duration-500">
                                      <ArrowUpRight className="w-4 h-4 text-[#4ca6a3] group-hover:text-black transition-colors" />
                                   </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Call to View All Doctors */}
            <motion.button 
                whileHover={{ y: -5 }}
                onClick={() => { navigate('/doctors'); window.scrollTo(0,0); }}
                className="bg-[var(--text-main)] text-[var(--bg-primary)] mt-12 shadow-2xl flex items-center gap-3 px-10 py-5 font-bold rounded-xl transition-all duration-500 lowercase active:scale-95"
            >
                browse clinical registry <ArrowUpRight className="w-4 h-4" />
            </motion.button>
        </section>
    );
};

export default TopDoctors;
