import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-4 border-b border-white/10 bg-black sticky top-0 z-50'>
      <div className='flex items-center gap-3'>
        <img 
          onClick={() => navigate('/')} 
          className='w-12 h-12 cursor-pointer hover:scale-105 transition-all' 
          src={assets.appointly_logo} 
          alt="Appointly" 
        />
        <p className='border px-2.5 py-0.5 rounded-full border-white/10 text-gray-500 font-bold uppercase text-[10px] tracking-widest'>{aToken ? 'Admin' : 'Doctor'}</p>
      </div>
      <button onClick={() => logout()} className='primary-btn text-sm'>Logout</button>
    </div>
  )
}

export default Navbar