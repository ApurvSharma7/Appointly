import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [openExperience, setOpenExperience] = useState(false)
    const [openSpeciality, setOpenSpeciality] = useState(false)

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!docImg) {
                return toast.error('Image Not Selected')
            }

            const formData = new FormData();

            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            // console log formdata            
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='w-full'>
            <div className='mb-8'>
                <h1 className='heading-large'>Add New Doctor</h1>
                <p className='text-gray-400'>Fill in the details to register a new physician.</p>
            </div>

            <div className='glass-card p-10 w-full max-w-5xl'>
                <div className='flex items-center gap-6 mb-10'>
                    <label htmlFor="doc-img" className='relative group cursor-pointer'>
                        <div className='w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border-2 border-dashed border-white/20 group-hover:border-white/40 transition-all overflow-hidden'>
                            <img className='w-full h-full object-cover' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                        </div>
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="" id="doc-img" hidden />
                    <div>
                        <p className='text-white font-semibold'>Doctor Photo</p>
                        <p className='text-sm text-gray-400 mt-1'>Click to upload profile picture</p>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6'>
                    
                    <div className='flex flex-col gap-5'>
                        <div className='flex flex-col gap-2'>
                            <p className='text-sm font-medium text-gray-300'>Full Name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='glass-input' type="text" placeholder='Dr. Stephen Strange' required />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <p className='text-sm font-medium text-gray-300'>Doctor Email</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className='glass-input' type="email" placeholder='doctor@medigo.com' required />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <p className='text-sm font-medium text-gray-300'>Set Password</p>
                            <input onChange={e => setPassword(e.target.value)} value={password} className='glass-input' type="password" placeholder='Secure password' required />
                        </div>

                        <div className='flex flex-col gap-2 relative'>
                            <p className='text-sm font-medium text-gray-300'>Experience</p>
                            <div 
                                onClick={() => setOpenExperience(!openExperience)}
                                className='glass-input bg-[#1a1a1a] cursor-pointer flex justify-between items-center group'
                            >
                                <span className='text-white'>{experience}</span>
                                <svg className={`w-4 h-4 text-gray-500 transition-transform ${openExperience ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {openExperience && (
                                <div className='absolute top-full left-0 w-full mt-2 bg-[#1f1f1f] border border-white/10 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200'>
                                    {['1 Year', '2 Years', '3 Years', '4 Years', '5 Years', '6 Years', '8 Years', '10 Years'].map((opt) => (
                                        <div 
                                            key={opt}
                                            onClick={() => { setExperience(opt); setOpenExperience(false); }}
                                            className={`px-4 py-3 text-sm cursor-pointer transition-colors ${experience === opt ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <p className='text-sm font-medium text-gray-300'>Consultation Fees</p>
                            <input onChange={e => setFees(e.target.value)} value={fees} className='glass-input' type="number" placeholder='50' required />
                        </div>
                    </div>

                    <div className='flex flex-col gap-5'>
                        <div className='flex flex-col gap-2 relative'>
                            <p className='text-sm font-medium text-gray-300'>Speciality</p>
                            <div 
                                onClick={() => setOpenSpeciality(!openSpeciality)}
                                className='glass-input bg-[#1a1a1a] cursor-pointer flex justify-between items-center group'
                            >
                                <span className='text-white'>{speciality}</span>
                                <svg className={`w-4 h-4 text-gray-500 transition-transform ${openSpeciality ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {openSpeciality && (
                                <div className='absolute top-full left-0 w-full mt-2 bg-[#1f1f1f] border border-white/10 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200'>
                                    <div className='px-4 py-2 text-[10px] uppercase tracking-widest font-black text-[#4ca6a3] bg-white/5'>Core Specialties</div>
                                    {['General physician', 'Gynecologist', 'Dermatologist'].map((opt) => (
                                        <div 
                                            key={opt}
                                            onClick={() => { setSpeciality(opt); setOpenSpeciality(false); }}
                                            className={`px-4 py-3 text-sm cursor-pointer transition-colors ${speciality === opt ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                    <div className='px-4 py-2 text-[10px] uppercase tracking-widest font-black text-[#4ca6a3] bg-white/5 border-t border-white/5'>Advanced Fields</div>
                                    {['Pediatricians', 'Neurologist', 'Gastroenterologist'].map((opt) => (
                                        <div 
                                            key={opt}
                                            onClick={() => { setSpeciality(opt); setOpenSpeciality(false); }}
                                            className={`px-4 py-3 text-sm cursor-pointer transition-colors ${speciality === opt ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <p className='text-sm font-medium text-gray-300'>Degree</p>
                            <input onChange={e => setDegree(e.target.value)} value={degree} className='glass-input' type="text" placeholder='MBBS, MD' required />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <p className='text-sm font-medium text-gray-300'>Office Address</p>
                            <div className='flex flex-col gap-3'>
                                <input onChange={e => setAddress1(e.target.value)} value={address1} className='glass-input' type="text" placeholder='Line 1' required />
                                <input onChange={e => setAddress2(e.target.value)} value={address2} className='glass-input' type="text" placeholder='Line 2' required />
                            </div>
                        </div>
                    </div>

                </div>

                <div className='mt-8 flex flex-col gap-2'>
                    <p className='text-sm font-medium text-gray-300'>About Doctor</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='glass-input min-h-[120px] resize-none' rows={5} placeholder='Brief professional summary...'></textarea>
                </div>

                <div className='mt-10'>
                    <button type='submit' className='primary-btn px-12 py-4'>Add doctor</button>
                </div>
            </div>
        </form>
    )
}

export default AddDoctor