import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { CheckCircle, Clock, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";

const About = () => {
  const { theme } = useContext(AppContext);
  const isNight = theme === "night";

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen py-24 px-6 md:px-12 lg:px-20 font-inter transition-colors duration-500">
      {/* About Us Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-24"
      >
        <h2 className={`young-serif text-5xl md:text-7xl font-bold tracking-tighter mb-6 transition-colors lowercase ${isNight ? 'text-white' : 'text-slate-900'}`}>
          Our <span className="italic text-[#4ca6a3] font-normal">Story</span>
        </h2>
        <p className="text-zinc-500 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed lowercase">
          Pioneering the future of digital healthcare. Learn how we're transforming the patient experience through innovation and empathy.
        </p>
      </motion.div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center mb-32">
        <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 relative"
        >
            <div className="absolute -inset-4 bg-[#4ca6a3]/5 blur-2xl rounded-[40px]"></div>
            <img
              className="w-full rounded-[40px] border border-zinc-500/10 relative z-10 filter grayscale-0 transition-all duration-700 hover:grayscale-0"
              src={assets.about_image}
              alt="About Appointly"
            />
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 space-y-8"
        >
          <div className="space-y-4">
             <h3 className="text-3xl font-bold text-[var(--text-main)] tracking-tight transition-colors uppercase italic">Redefining Accessibility</h3>
             <p className="text-zinc-500 font-light leading-relaxed text-base md:text-lg lowercase">
                Welcome to <span className="text-[var(--text-main)] font-medium">Appointly</span>, your reliable partner in managing healthcare needs with precision. We solve the complexities of modern medical scheduling through an intuitive, AI-driven interface.
             </p>
          </div>
          
          <div className="space-y-4">
             <h3 className="text-3xl font-bold text-[var(--text-main)] tracking-tight transition-colors uppercase italic">Our Commitment</h3>
             <p className="text-zinc-500 font-light leading-relaxed text-base md:text-lg lowercase">
                We believe that premium healthcare should be a right, not a privilege. By integrating world-class specialists with cutting-edge technology, we ensure your health is always just one click away.
             </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-zinc-500/10">
             <div>
                <p className="text-4xl font-bold text-[var(--text-main)] mb-2 transition-colors">500+</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-600">Expert Doctors</p>
             </div>
             <div>
                <p className="text-4xl font-bold text-[var(--text-main)] mb-2 transition-colors">10k+</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-600">Success Stories</p>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-7xl mx-auto space-y-16 mb-24">
        <div className="text-center space-y-4">
            <h2 className={`young-serif text-4xl md:text-5xl font-bold tracking-tight transition-colors lowercase ${isNight ? 'text-white' : 'text-slate-900'}`}>
              Why <span className="italic text-[#4ca6a3] font-normal">Appointly?</span>
            </h2>
            <p className="text-zinc-500 font-light lowercase">The standard in modern healthcare management.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { icon: Clock, title: "Efficiency", desc: "Real-time booking and instant confirmations for a stress-free experience." },
                { icon: UserCheck, title: "Convenience", desc: "Access the most trusted healthcare professionals from anywhere in the world." },
                { icon: CheckCircle, title: "Precision", desc: "Tailored health recommendations and seamless record management." }
            ].map((item, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-12 bg-zinc-500/5 border border-zinc-500/10 rounded-[32px] space-y-6 hover:border-[#4ca6a3]/20 transition-all flex flex-col items-center text-center group"
                >
                    <div className="p-4 rounded-3xl bg-[#4ca6a3]/10 text-[#4ca6a3] transition-all">
                        <item.icon className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-[var(--text-main)] transition-colors lowercase tracking-tight">{item.title}</h4>
                    <p className="text-zinc-500 font-light text-sm leading-relaxed lowercase">{item.desc}</p>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default About;
