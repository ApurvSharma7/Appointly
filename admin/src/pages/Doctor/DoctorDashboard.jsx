import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {

  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)


  useEffect(() => {

    if (dToken) {
      getDashData()
    }

  }, [dToken])

  return dashData && (
    <div className='flex flex-col gap-8'>

      <div className='flex justify-between items-end'>
        <div>
          <h1 className='heading-large mb-2'>Doctor Dashboard</h1>
          <p className='text-gray-400'>Monitor your clinic performance and manage upcoming appointments.</p>
        </div>
        <div className='hidden md:block text-right'>
          <p className='text-sm text-gray-500 font-medium uppercase tracking-widest mb-1'>Last Sync</p>
          <p className='text-white font-bold'>{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='glass-card p-6 flex items-center gap-4 hover:bg-white/5 transition-all cursor-pointer group'>
          <div className='p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-all'>
            <img className='w-8 invert' src={assets.earning_icon} alt="" />
          </div>
          <div>
            <p className='text-2xl font-bold text-white'>{currency} {dashData.earnings}</p>
            <p className='text-xs text-gray-400 font-bold uppercase tracking-wider'>Total Earnings</p>
          </div>
        </div>

        <div className='glass-card p-6 flex items-center gap-4 hover:bg-white/5 transition-all cursor-pointer group'>
          <div className='p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-all'>
            <img className='w-8 invert' src={assets.appointments_icon} alt="" />
          </div>
          <div>
            <p className='text-2xl font-bold text-white'>{dashData.appointments}</p>
            <p className='text-xs text-gray-400 font-bold uppercase tracking-wider'>Total Appts</p>
          </div>
        </div>

        <div className='glass-card p-6 flex items-center gap-4 hover:bg-white/5 transition-all cursor-pointer group'>
          <div className='p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-all'>
            <img className='w-8 invert' src={assets.patients_icon} alt="" />
          </div>
          <div>
            <p className='text-2xl font-bold text-white'>{dashData.patients}</p>
            <p className='text-xs text-gray-400 font-bold uppercase tracking-wider'>Total Patients</p>
          </div>
        </div>

        <div className='glass-card p-6 flex items-center gap-4 hover:bg-white/5 transition-all cursor-pointer group'>
          <div className='p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-all text-2xl'>
            ⭐
          </div>
          <div>
            <p className='text-2xl font-bold text-white'>{dashData.averageRating ? dashData.averageRating.toFixed(1) : '0.0'}</p>
            <p className='text-xs text-gray-400 font-bold uppercase tracking-wider'>({dashData.totalRatings || 0} reviews)</p>
          </div>
        </div>
      </div>

      <div className='glass-card overflow-hidden'>
        <div className='flex items-center gap-3 px-8 py-6 border-b border-white/10 bg-white/5'>
          <img className='w-5 invert' src={assets.list_icon} alt="" />
          <p className='font-semibold text-lg'>Upcoming Consultations</p>
        </div>

        <div className='p-2'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-6 py-4 gap-4 hover:bg-white/5 rounded-xl transition-all group' key={index}>
              <img className='rounded-full w-12 h-12 object-cover border-2 border-white/10' src={item.userData.image} alt="" />
              <div className='flex-1'>
                <p className='text-white font-semibold text-base mb-0.5'>{item.userData.name}</p>
                <p className='text-gray-400 text-sm font-medium'>Scheduled for {slotDateFormat(item.slotDate)}</p>
              </div>

              <div className='flex items-center gap-2'>
                {(item.cancelled || item.status === 'Cancelled')
                  ? <span className='px-3 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded-full border border-red-500/20'>Cancelled</span>
                  : (item.isCompleted || item.status === 'Completed')
                    ? <span className='px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20'>Completed</span>
                    : <div className='flex items-center gap-2'>
                        <button
                          onClick={() => completeAppointment(item._id)}
                          className='w-10 h-10 flex items-center justify-center bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white rounded-full transition-all duration-300'
                          title="Complete"
                        >
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M5 13l4 4L19 7' />
                          </svg>
                        </button>
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className='w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all duration-300'
                          title="Cancel"
                        >
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M6 18L18 6M6 6l12 12' />
                          </svg>
                        </button>
                    </div>
                }
              </div>
            </div>
          ))}
        </div>
        <div className='px-8 py-4 bg-white/5 border-t border-white/5 text-center'>
          <p className='text-sm text-gray-400 cursor-pointer hover:text-white transition-all font-medium'>Access all appointments</p>
        </div>
      </div>

    </div>
  )
}

export default DoctorDashboard