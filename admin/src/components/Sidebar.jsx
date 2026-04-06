import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'

const Sidebar = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  return (
    <div className='min-h-screen bg-black border-r border-gray-800'>
      {aToken && <ul className='text-gray-400 mt-5'>

        <NavLink to={'/admin-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#1a1a1a] text-white border-r-4 border-white' : 'hover:bg-[#0a0a0a]'}`}>
          <img className='min-w-5 invert' src={assets.home_icon} alt='' />
          <p className='hidden md:block font-medium'>Dashboard</p>
        </NavLink>
        <NavLink to={'/all-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#1a1a1a] text-white border-r-4 border-white' : 'hover:bg-[#0a0a0a]'}`}>
          <img className='min-w-5 invert' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block font-medium'>Appointments</p>
        </NavLink>
        <NavLink to={'/add-doctor'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#1a1a1a] text-white border-r-4 border-white' : 'hover:bg-[#0a0a0a]'}`}>
          <img className='min-w-5 invert' src={assets.add_icon} alt='' />
          <p className='hidden md:block font-medium'>Add Doctor</p>
        </NavLink>
        <NavLink to={'/doctor-list'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#1a1a1a] text-white border-r-4 border-white' : 'hover:bg-[#0a0a0a]'}`}>
          <img className='min-w-5 invert' src={assets.people_icon} alt='' />
          <p className='hidden md:block font-medium'>Doctors List</p>
        </NavLink>
      </ul>}

      {dToken && <ul className='text-gray-400 mt-5'>
        <NavLink to={'/doctor-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#1a1a1a] text-white border-r-4 border-white' : 'hover:bg-[#0a0a0a]'}`}>
          <img className='min-w-5 invert' src={assets.home_icon} alt='' />
          <p className='hidden md:block font-medium'>Dashboard</p>
        </NavLink>
        <NavLink to={'/doctor-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#1a1a1a] text-white border-r-4 border-white' : 'hover:bg-[#0a0a0a]'}`}>
          <img className='min-w-5 invert' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block font-medium'>Appointments</p>
        </NavLink>
        <NavLink to={'/doctor-profile'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-[#1a1a1a] text-white border-r-4 border-white' : 'hover:bg-[#0a0a0a]'}`}>
          <img className='min-w-5 invert' src={assets.people_icon} alt='' />
          <p className='hidden md:block font-medium'>Profile</p>
        </NavLink>
      </ul>}
    </div>
  )
}

export default Sidebar