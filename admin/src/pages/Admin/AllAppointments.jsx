import React, { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {

  const { aToken, appointments, cancelAppointment, completeAppointment, getAllAppointments, doctors, getAllDoctors } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency, backendUrl } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className='w-full'>

      <div className='mb-8'>
        <h1 className='heading-large'>All Appointments</h1>
        <p className='text-gray-400'>Manage and track all patient bookings and doctor schedules.</p>
      </div>

      <div className='glass-card overflow-hidden'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1.5fr] py-5 px-8 border-b border-white/10 bg-white/5 text-gray-300 font-semibold uppercase text-xs tracking-wider'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p className='text-right'>Action</p>
        </div>

        <div className='max-h-[70vh] overflow-y-auto'>
          {appointments.map((item, index) => (
            <div className='flex flex-wrap justify-between max-sm:gap-4 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1.5fr] items-center text-gray-400 py-4 px-8 border-b border-white/5 hover:bg-white/5 transition-all group' key={index}>
              <p className='max-sm:hidden font-medium'>{index + 1}</p>
              <div className='flex items-center gap-3'>
                <img 
                  src={item.userData?.image 
                    ? (item.userData.image.startsWith('http') 
                        ? item.userData.image 
                        : `${backendUrl || "http://localhost:5000"}/${item.userData.image.replace(/^\//, '')}`) 
                    : "https://www.w3schools.com/howto/img_avatar.png"} 
                  className='w-10 h-10 rounded-full border border-white/10 object-cover shadow-sm bg-white/5' 
                  onError={(e) => { e.target.src = "https://www.w3schools.com/howto/img_avatar.png" }}
                  alt="" 
                />
                <p className='text-white font-semibold'>{item.userData?.name || 'Unknown User'}</p>
              </div>
              <p className='max-sm:hidden'>{item.userData?.dob ? calculateAge(item.userData.dob) : 'N/A'}</p>
              <div className='flex flex-col gap-0.5'>
                <p className='text-white font-medium'>{slotDateFormat(item.slotDate)}</p>
                <p className='text-xs text-gray-500'>{item.slotTime}</p>
              </div>
              <div className='flex items-center gap-3'>
                <img 
                  src={item.docData?.image 
                    ? (item.docData.image.startsWith('http') 
                        ? item.docData.image 
                        : `${backendUrl || "http://localhost:5000"}/${item.docData.image.replace(/^\//, '')}`) 
                    : "https://www.w3schools.com/howto/img_avatar.png"} 
                  className='w-10 h-10 rounded-full border border-white/10 bg-white/5 object-cover shadow-sm' 
                  onError={(e) => { e.target.src = "https://www.w3schools.com/howto/img_avatar.png" }}
                  alt="" 
                />
                <p className='text-white font-medium'>{item.docData?.name || 'Unknown Doctor'}</p>
              </div>
              <p className='text-white font-bold text-lg'>
                Rs.{item.docData?.fees || item.amount || doctors.find(d => d._id === item.docId || d._id === item.docData?._id || d.name === item.docData?.name)?.fees || 0}
              </p>
              <div className='flex items-center justify-end gap-3'>
                {(item.cancelled || item.status === 'Cancelled') ? (
                  <span className='px-3 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded-full border border-red-500/20'>Cancelled</span>
                ) : (item.isCompleted || item.status === 'Completed') ? (
                  <span className='px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20'>Completed</span>
                ) : (
                  <div className='flex items-center gap-2'>
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
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default AllAppointments