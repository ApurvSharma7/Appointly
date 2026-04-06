import React from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div className='w-full'>

      <div className='mb-8'>
        <h1 className='heading-large'>Patient Appointments</h1>
        <p className='text-gray-400'>Manage your schedule and track patient consultations.</p>
      </div>

      <div className='glass-card overflow-hidden'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-4 py-5 px-8 border-b border-white/10 bg-white/5 text-gray-300 font-semibold uppercase text-xs tracking-wider'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p className='text-right'>Action</p>
        </div>

        <div className='max-h-[70vh] overflow-y-auto'>
          {appointments.map((item, index) => (
            <div className='flex flex-wrap justify-between max-sm:gap-4 sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-4 items-center text-gray-400 py-4 px-8 border-b border-white/5 hover:bg-white/5 transition-all group' key={index}>
              <p className='max-sm:hidden font-medium'>{index + 1}</p>
              <div className='flex items-center gap-3'>
                <img src={item.userData.image} className='w-10 h-10 rounded-full border border-white/10' alt="" />
                <p className='text-white font-semibold'>{item.userData.name}</p>
              </div>
              <div>
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${item.paymentStatus === 'Paid' ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                  {item.paymentStatus === 'Paid' ? 'Online' : 'Cash'}
                </span>
              </div>
              <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
              <div className='flex flex-col gap-0.5'>
                <p className='text-white font-medium'>{slotDateFormat(item.slotDate)}</p>
                <p className='text-xs text-gray-500'>{item.slotTime}</p>
              </div>
              <p className='text-white font-bold text-lg'>Rs.{item.amount || 0}</p>
              <div className='flex items-center justify-end gap-3'>
                {(item.cancelled || item.status === 'Cancelled')
                  ? <span className='px-3 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-full border border-red-500/20 uppercase tracking-wider'>Cancelled</span>
                  : (item.isCompleted || item.status === 'Completed')
                    ? <span className='px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full border border-green-500/20 uppercase tracking-wider'>Completed</span>
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
      </div>

    </div>
  )
}

export default DoctorAppointments