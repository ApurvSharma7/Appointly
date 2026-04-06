import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase } from 'lucide-react'
import { AppContext } from '../context/AppContext'

const Contact = () => {
  const { theme } = useContext(AppContext);
  const isNight = theme === "night";

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen py-24 px-6 md:px-12 lg:px-20 font-inter transition-colors duration-500">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center mb-24'
      >
        <h1 className={`young-serif text-5xl md:text-7xl font-bold tracking-tighter mb-6 transition-colors lowercase ${isNight ? 'text-white' : 'text-slate-900'}`}>
          Get In <span className='italic text-[#4ca6a3] font-normal'>Touch</span>
        </h1>
        <p className='text-zinc-500 max-w-2xl mx-auto font-light lowercase'>
          Have questions? Our team is here to help you navigate your healthcare journey.
        </p>
      </motion.div>

      <div className='max-w-6xl mx-auto flex flex-col md:flex-row gap-20 items-center'>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className='w-full md:w-1/2 relative'
        >
          <div className="absolute -inset-4 bg-[#4ca6a3]/5 blur-3xl rounded-[40px]"></div>
          <img className='w-full rounded-[40px] border border-zinc-500/10 relative z-10 filter grayscale group-hover:grayscale-0 transition-all duration-700' src={assets.contact_image} alt="Contact" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className='w-full md:w-1/2 space-y-12'
        >
          <div className='space-y-8'>
            <div className='space-y-2'>
              <p className='text-[10px] uppercase tracking-widest font-bold text-zinc-600'>Global Headquarters</p>
              <div className='flex items-start gap-4 text-[var(--text-main)] transition-colors group'>
                <div className='p-3 rounded-2xl bg-zinc-500/10 group-hover:bg-[#4ca6a3] group-hover:text-black transition-all'>
                  <MapPin className='w-5 h-5' />
                </div>
                <div>
                  <p className='text-lg font-medium lowercase'>Gujarat Road Phase 1, Gujarat</p>
                  <p className='text-zinc-500 font-light lowercase'>Gujarat, 362001, India</p>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center gap-4 text-[var(--text-main)] transition-colors group'>
                <div className='p-3 rounded-2xl bg-zinc-500/10 group-hover:bg-[#4ca6a3] group-hover:text-black transition-all'>
                  <Phone className='w-5 h-5' />
                </div>
                <p className='text-lg font-medium lowercase'>+91-999-888-7776</p>
              </div>
              <div className='flex items-center gap-4 text-[var(--text-main)] transition-colors group'>
                <div className='p-3 rounded-2xl bg-zinc-500/10 group-hover:bg-[#4ca6a3] group-hover:text-black transition-all'>
                  <Mail className='w-5 h-5' />
                </div>
                <p className='text-lg font-medium lowercase'>support@appointly.com</p>
              </div>
            </div>
          </div>

          <div className='p-8 md:p-10 bg-zinc-500/5 border border-zinc-500/10 rounded-[32px] space-y-6'>
            <div className='flex items-center gap-3'>
              <Briefcase className='w-6 h-6 text-[#4ca6a3]' />
              <h4 className='text-xl font-bold text-[var(--text-main)] transition-colors lowercase tracking-tight'>Careers at Appointly</h4>
            </div>
            <p className='text-zinc-500 font-light text-sm leading-relaxed lowercase'>
              We're always looking for talented individuals to join our mission of transforming healthcare.
            </p>
            <button className='w-full py-4 border border-[#4ca6a3]/20 text-[10px] uppercase tracking-[0.3em] font-bold text-[#4ca6a3] rounded-2xl hover:bg-[#4ca6a3] hover:text-black transition-all'>
              Explore Opportunities
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  )
}

export default Contact
