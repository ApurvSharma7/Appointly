import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  console.log(backendUrl?backendUrl:"nothing")

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Admin') {

      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
      if (data.success) {
        setAToken(data.token)
        localStorage.setItem('aToken', data.token)
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
      if (data.success) {
        setDToken(data.token)
        localStorage.setItem('dToken', data.token)
      } else {
        toast.error(data.message)
      }

    }

  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-screen flex flex-col items-center justify-center bg-black'>
      <img className='w-24 h-24 mb-6 hover:scale-110 transition-all' src={assets.appointly_logo} alt="Appointly Logo" />

      <div className='glass-card flex flex-col gap-6 items-start p-10 min-w-[340px] sm:min-w-[420px] text-white'>
        <div className='w-full'>
          <h1 className='text-2xl font-bold mb-1'>{state} Panel</h1>
          <p className='text-gray-400 font-medium'>Please sign in to continue</p>
        </div>
        
        <div className='w-full flex flex-col gap-4'>
          <div className='w-full'>
            <p className='mb-2 text-sm font-medium text-gray-300'>Email Address</p>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              className='glass-input' 
              type="email" 
              placeholder='your@email.com'
              required 
            />
          </div>
          <div className='w-full'>
            <p className='mb-2 text-sm font-medium text-gray-300'>Password</p>
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              className='glass-input' 
              type="password" 
              placeholder='Enter your password'
              required 
            />
          </div>
        </div>

        <button className='primary-btn w-full mt-2'>Login</button>

        <div className='w-full text-center'>
          {
            state === 'Admin'
              ? <p className='text-sm text-gray-400'>Doctor Login? <span onClick={() => setState('Doctor')} className='text-white font-semibold cursor-pointer hover:underline'>Click here</span></p>
              : <p className='text-sm text-gray-400'>Admin Login? <span onClick={() => setState('Admin')} className='text-white font-semibold cursor-pointer hover:underline'>Click here</span></p>
          }
        </div>
      </div>
    </form>
  )
}

export default Login