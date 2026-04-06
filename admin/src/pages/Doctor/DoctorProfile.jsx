import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {

        try {

            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }

            setIsEdit(false)

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <div className='flex flex-col gap-8'>
            <div>
                <h1 className='heading-large mb-2'>Doctor Profile</h1>
                <p className='text-gray-400'>Manage your professional information and public visibility.</p>
            </div>

            <div className='flex flex-col lg:flex-row gap-6 items-start'>
                <div className='w-full lg:w-56 flex flex-col items-center'>
                    <div className='glass-card p-1.5 w-full bg-white/5 border-white/10'>
                        <img className='w-full aspect-square object-cover rounded-xl shadow-lg' src={profileData.image} alt="" />
                    </div>
                    {isEdit 
                        ? <button onClick={updateProfile} className='primary-btn w-full mt-4 py-2.5 text-sm'>Save Changes</button>
                        : <button onClick={() => setIsEdit(true)} className='primary-btn w-full mt-4 py-2.5 text-sm'>Edit Profile</button>
                    }
                </div>
                
                <div className='flex-1 glass-card p-8 w-full bg-[#111111] border-white/5'>
                    <div className='flex flex-col gap-6'>
                        <div>
                            <h2 className='text-3xl font-bold text-white mb-1.5'>{profileData.name}</h2>
                            <div className='flex items-center gap-3'>
                                <p className='text-gray-400 font-medium text-sm'>{profileData.degree} — {profileData.speciality}</p>
                                <span className='px-2.5 py-0.5 bg-white/10 text-white text-[10px] font-bold uppercase rounded-full border border-white/10 tracking-widest'>{profileData.experience} EXPERIENCE</span>
                            </div>
                        </div>
                        
                        <div className='border-t border-white/10 pt-5'>
                            <p className='text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-3'>Professional Summary</p>
                            <div className='text-gray-400 text-sm leading-relaxed'>
                                {isEdit
                                    ? <textarea onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} className='glass-input min-h-[120px] resize-none text-sm' rows={6} value={profileData.about} placeholder='Describe your medical expertise...' />
                                    : <p className='whitespace-pre-line bg-white/5 p-4 rounded-xl border border-white/5'>{profileData.about || 'No summary provided yet.'}</p>
                                }
                            </div>
                        </div>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-5'>
                            <div className='flex flex-col gap-5'>
                                <div>
                                    <p className='text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-2.5'>Consultation Fee</p>
                                    <div className='flex items-center gap-1.5 text-xl font-bold text-white'>
                                        <span className='text-gray-500'>Rs.</span>
                                        {isEdit 
                                            ? <input type='number' onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} className='glass-input w-24 py-1 text-base' /> 
                                            : <span>{profileData.fees}</span>
                                        }
                                    </div>
                                </div>
                                
                                <div>
                                    <p className='text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-2.5'>Practice Location</p>
                                    <div className='text-gray-400 text-sm'>
                                        {isEdit ? (
                                            <div className='flex flex-col gap-2'>
                                                <input 
                                                    type='text' 
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} 
                                                    value={profileData.address?.line1 || ''} 
                                                    className='glass-input py-1.5 text-sm'
                                                    placeholder='Street Address'
                                                />
                                                <input 
                                                    type='text' 
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} 
                                                    value={profileData.address?.line2 || ''} 
                                                    className='glass-input py-1.5 text-sm'
                                                    placeholder='City, Country'
                                                />
                                            </div>
                                        ) : (
                                            <div className='font-medium bg-white/5 p-4 rounded-xl border border-white/5'>
                                                <p>{profileData.address?.line1 || 'Primary location not set'}</p>
                                                <p>{profileData.address?.line2}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className='flex flex-col gap-4'>
                                <p className='text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-2.5'>Visibility & Availability</p>
                                <div className='flex flex-col gap-4 bg-white/5 p-4 rounded-xl border border-white/5'>
                                    <div className='flex items-center gap-4'>
                                        <label className='relative inline-flex items-center cursor-pointer'>
                                            <input 
                                                type="checkbox" 
                                                className='sr-only peer'
                                                onChange={async () => {
                                                    const newVal = !profileData.available;
                                                    setProfileData(prev => ({ ...prev, available: newVal }));
                                                    // Trigger instant save for availability toggle
                                                    try {
                                                        const updateData = {
                                                            address: profileData.address,
                                                            fees: profileData.fees,
                                                            about: profileData.about,
                                                            available: newVal
                                                        }
                                                        const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })
                                                        if (data.success) {
                                                            toast.success(data.message)
                                                            getProfileData()
                                                        }
                                                    } catch (error) {
                                                        toast.error(error.message)
                                                    }
                                                }} 
                                                checked={profileData.available} 
                                            />
                                            <div className={`w-12 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-[24px] after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500`}></div>
                                        </label>
                                        <span className={`text-[11px] font-bold uppercase tracking-wider ${profileData.available ? 'text-green-500' : 'text-red-400'}`}>
                                            {profileData.available ? 'Online' : 'Hidden'}
                                        </span>
                                    </div>
                                    <p className='text-[10px] text-gray-500 leading-relaxed italic'>Toggle this switch to immediately update your visibility on the public patient portal.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile