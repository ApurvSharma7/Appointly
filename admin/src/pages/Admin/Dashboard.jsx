import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='flex flex-col gap-8'>

      <div>
        <h1 className='heading-large mb-2'>Dashboard Overview</h1>
        <p className='text-gray-400'>Monitor your medical facility performance and bookings.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='glass-card p-6 flex items-center gap-4 hover:bg-[#ffffff0a] transition-all cursor-pointer group'>
          <div className='p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-all'>
            <img className='w-8 invert' src={assets.doctor_icon} alt="" />
          </div>
          <div>
            <p className='text-3xl font-bold text-white'>{dashData.doctors}</p>
            <p className='text-sm text-gray-400 font-medium'>Available Doctors</p>
          </div>
        </div>

        <div className='glass-card p-6 flex items-center gap-4 hover:bg-[#ffffff0a] transition-all cursor-pointer group'>
          <div className='p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-all'>
            <img className='w-8 invert' src={assets.appointments_icon} alt="" />
          </div>
          <div>
            <p className='text-3xl font-bold text-white'>{dashData.appointments}</p>
            <p className='text-sm text-gray-400 font-medium'>Total Appointments</p>
          </div>
        </div>

        <div className='glass-card p-6 flex items-center gap-4 hover:bg-[#ffffff0a] transition-all cursor-pointer group'>
          <div className='p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-all'>
            <img className='w-8 invert' src={assets.patients_icon} alt="" />
          </div>
          <div>
            <p className='text-3xl font-bold text-white'>{dashData.patients}</p>
            <p className='text-sm text-gray-400 font-medium'>Total Patients</p>
          </div>
        </div>
      </div>

      <div className='glass-card overflow-hidden'>
        <div className='flex items-center gap-3 px-8 py-6 border-b border-white/10'>
          <img className='w-5 invert' src={assets.list_icon} alt="" />
          <p className='font-semibold text-lg'>Latest Bookings</p>
        </div>

        <div className='p-2'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-6 py-4 gap-4 hover:bg-white/5 rounded-xl transition-all group' key={index}>
              <img className='rounded-full w-12 h-12 object-cover border-2 border-white/10' src={item.docData?.image || '/default-avatar.png'} alt="" />
              <div className='flex-1'>
                <p className='text-white font-semibold text-base mb-0.5'>{item.docData?.name || 'Unknown Doctor'}</p>
                <p className='text-gray-400 text-sm'>Booking on {slotDateFormat(item.slotDate)}</p>
                <p className='text-white/60 text-xs mt-1'>Rs.{item.docData?.fees || item.amount || 0}</p>
              </div>
              <div className='flex items-center gap-2'>
                {(item.cancelled || item.status === 'Cancelled')
                  ? <span className='px-3 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-full border border-red-500/20 uppercase tracking-wider'>Cancelled</span>
                  : (item.isCompleted || item.status === 'Completed')
                    ? <span className='px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full border border-green-500/20 uppercase tracking-wider'>Completed</span>
                    : <button
                      onClick={() => cancelAppointment(item._id)}
                      className='w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all duration-300'
                      title="Cancel"
                    >
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                }
              </div>
            </div>
          ))}
        </div>
        <div className='px-8 py-4 bg-white/5 border-t border-white/5 text-center'>
          <p className='text-sm text-gray-400 cursor-pointer hover:text-white transition-all font-medium'>View all appointments</p>
        </div>
      </div>

    </div>
  )
}

export default Dashboard