import React, { useContext, useLayoutEffect } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';

import ScrollToTop from './components/ScrollToTop'

const App = () => {
  useLayoutEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // F12 key
      if (e.keyCode === 123) {
        e.preventDefault();
      }
      // Ctrl + Shift + I (Inspect element)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
      }
      // Ctrl + Shift + J (Console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
      }
      // Ctrl + Shift + C (Inspect element)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
      }
      // Ctrl + U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  return dToken || aToken ? (
    <div className='bg-black min-h-screen text-white'>
      <ScrollToTop />
      <ToastContainer theme='dark' />
      <Navbar />
      <div className='flex'>
        <Sidebar />
        <div className='flex-1 p-5 md:p-10'>
          <Routes>
            <Route path='/' element={<></>} />
            <Route path='/admin-dashboard' element={<Dashboard />} />
            <Route path='/all-appointments' element={<AllAppointments />} />
            <Route path='/add-doctor' element={<AddDoctor />} />
            <Route path='/doctor-list' element={<DoctorsList />} />
            <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
            <Route path='/doctor-appointments' element={<DoctorAppointments />} />
            <Route path='/doctor-profile' element={<DoctorProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer theme='dark' />
      <Login />
    </>
  )
}

export default App