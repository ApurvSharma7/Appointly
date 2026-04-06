import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const DoctorsList = () => {

  const { doctors, changeAvailability, aToken, getAllDoctors, deleteDoctor } = useContext(AdminContext)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showMenu, setShowMenu] = useState(null)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  const [doctorToDelete, setDoctorToDelete] = useState(null)

  const confirmDelete = async () => {
    if (doctorToDelete) {
      await deleteDoctor(doctorToDelete)
      setDoctorToDelete(null)
    }
  }

  return (
    <div className='w-full'>
      <div className='mb-8 flex justify-between items-end'>
        <div>
          <h1 className='heading-large'>Registered Doctors</h1>
          <p className='text-gray-400'>View and manage all healthcare professionals in the system.</p>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {doctors.map((item, index) => (
          <div className={`bg-[#1a1a1a] border border-white/5 rounded-[24px] group hover:translate-y-[-4px] transition-all duration-300 relative ${showMenu === index ? 'z-30' : 'z-auto'}`} key={index}>
            <div className='h-48 overflow-hidden bg-white/5 rounded-t-[24px] flex items-center justify-center border-b border-white/5'>
              <img className='w-full h-full object-cover group-hover:scale-105 transition-all duration-500' src={item.image} alt="" />
            </div>
            <div className='p-6'>
              <p className='text-white text-xl font-bold mb-1 truncate'>{item.name}</p>
              <p className='text-gray-400 text-sm font-medium mb-4'>{item.speciality}</p>
              
              <div className='flex items-center justify-between mt-auto pt-4 border-t border-white/10'>
                <div className='flex items-center gap-3'>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input 
                      type="checkbox" 
                      className='sr-only peer' 
                      checked={item.available} 
                      onChange={() => changeAvailability(item._id)} 
                    />
                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500/50"></div>
                  </label>
                  <span className={`text-xs font-bold uppercase tracking-wider ${item.available ? 'text-green-400' : 'text-gray-500'}`}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                
                <div className='relative'>
                  <button 
                    onClick={() => setShowMenu(showMenu === index ? null : index)}
                    className='text-white/50 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>

                   {showMenu === index && (
                    <div className='absolute right-0 bottom-full mb-2 w-48 overflow-hidden rounded-2xl bg-[#1f1f1f] border border-white/10 py-1.5 z-20 shadow-2xl animate-in fade-in zoom-in duration-200 origin-bottom-right'>
                      <button 
                        onClick={() => { setSelectedDoctor(item); setShowMenu(null); }}
                        className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all group/item'
                      >
                        <div className='w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover/item:bg-white/10 transition-colors'>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                          </svg>
                        </div>
                        <span className='font-medium'>View Profile</span>
                      </button>
                      <div className='h-px bg-white/5 mx-2 my-1'></div>
                      <button 
                        onClick={() => { setDoctorToDelete(item._id); setShowMenu(null); }}
                        className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-all group/item'
                      >
                        <div className='w-8 h-8 rounded-lg bg-red-500/5 flex items-center justify-center group-hover/item:bg-red-500/10 transition-colors'>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                          </svg>
                        </div>
                        <span className='font-bold'>Delete Doctor</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90'>
          <div className='bg-[#1a1a1a] shadow-2xl border border-white/10 rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative'>
            <button 
              onClick={() => setSelectedDoctor(null)}
              className='absolute top-6 right-6 text-gray-400 hover:text-white'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>

            <div className='flex flex-col md:flex-row gap-8 items-start'>
              <img className='w-32 h-32 md:w-48 md:h-48 object-cover rounded-2xl border-2 border-white/10' src={selectedDoctor.image} alt="" />
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <h2 className='text-3xl font-bold text-white'>{selectedDoctor.name}</h2>
                  <img className='w-5' src={assets.verified_icon} alt="" />
                </div>
                <div className='flex items-center gap-2 text-gray-400 font-medium mb-4'>
                  <p>{selectedDoctor.degree} - {selectedDoctor.speciality}</p>
                  <span className='px-2 py-0.5 bg-white/5 rounded text-xs'>{selectedDoctor.experience} Exp</span>
                </div>
                
                <div className='mb-6'>
                  <p className='text-white font-semibold mb-2'>About</p>
                  <p className='text-gray-400 text-sm leading-relaxed'>{selectedDoctor.about}</p>
                </div>

                <div className='grid grid-cols-2 gap-4 pt-6 border-t border-white/10'>
                  <div>
                    <p className='text-gray-500 text-xs uppercase font-bold tracking-wider mb-1'>Appointment Fee</p>
                    <p className='text-white font-bold text-lg'>${selectedDoctor.fees}</p>
                  </div>
                  <div>
                    <p className='text-gray-500 text-xs uppercase font-bold tracking-wider mb-1'>Address</p>
                    <p className='text-white text-sm'>{selectedDoctor.address.line1}, {selectedDoctor.address.line2}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {doctorToDelete && (
        <div className='fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95'>
          <div className='bg-[#1a1a1a] border border-white/10 rounded-[32px] max-w-sm w-full p-8 text-center animate-in fade-in zoom-in duration-200'>
            <div className='w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6'>
              <svg className='w-8 h-8 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-white mb-2'>Delete Doctor?</h3>
            <p className='text-gray-400 text-sm mb-8'>This action is irreversible. All associated data will be permanently removed.</p>
            <div className='flex flex-col gap-3'>
              <button 
                onClick={confirmDelete}
                className='w-full py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-colors uppercase tracking-widest text-xs'
              >
                Confirm Deletion
              </button>
              <button 
                onClick={() => setDoctorToDelete(null)}
                className='w-full py-4 bg-white/5 text-gray-400 font-bold rounded-2xl hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest text-xs'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorsList