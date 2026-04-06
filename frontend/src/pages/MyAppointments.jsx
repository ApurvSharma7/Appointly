import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import RatingModal from "../components/RatingModal";
import { Calendar, Clock, CreditCard, XCircle, Star, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState({ isOpen: false, appointment: null });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, appointmentId: null });
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, token, theme } = useContext(AppContext);
  const isNight = theme === "night";

  const getUserAppointments = async () => {
    try {
      if (!token) return navigate("/login");

      const res = await axios.get(
        `${backendUrl}/api/user/appointments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error("Fetch appointments error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (amount, apptId) => {
    try {
      if (!token) return navigate("/login");

      const { data } = await axios.post(
        `${backendUrl}/api/payment/razorpay`,
        { amount, appointmentId: apptId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data.success) return toast.error("Payment initiation failed");

      const { order } = data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Appointly Healthcare",
        description: "Official Consultation Fee",
        order_id: order.id,
        handler: async (response) => {
          try {
            await axios.post(
              `${backendUrl}/api/payment/verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId: apptId,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Payment Successful!");
            getUserAppointments();
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error("Payment verification failed");
          }
        },
        theme: { color: isNight ? "#000000" : "#5f6fff" },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed");
    }
  };

  const handleCancel = async (apptId) => {
    setCancelModal({ isOpen: true, appointmentId: apptId });
  };

  const confirmCancel = async () => {
    const apptId = cancelModal.appointmentId;
    setCancelModal({ isOpen: false, appointmentId: null });

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId: apptId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Appointment cancelled successfully!");
        getUserAppointments();
      } else toast.error("Could not cancel appointment");
    } catch (err) {
      console.error("Cancel appointment error:", err);
      toast.error("Cancellation failed");
    }
  };

  useEffect(() => {
    setLoading(true);
    getUserAppointments();
  }, [location.pathname, token]);

  if (loading)
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isNight ? 'bg-black' : 'bg-gray-50'}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`w-10 h-10 border-2 rounded-full ${isNight ? 'border-white/20 border-t-white' : 'border-gray-200 border-t-blue-600'}`}
        />
      </div>
    );

  return (
    <div className={`min-h-screen py-32 px-6 font-inter transition-colors duration-500 ${isNight ? 'bg-[#000000]' : 'bg-[#f8fafc]'}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <h2 className={`text-5xl md:text-5xl font-bold tracking-tight mb-4 ${isNight ? 'text-white' : 'text-slate-900'}`}>
              My <span className="italic text-[#4ca6a3]">Appointments</span>
            </h2>
            <p className={`font-light max-w-lg text-lg ${isNight ? 'text-zinc-500' : 'text-slate-500'}`}>
              Manage your consultations, track payment status, and prepare for your upcoming health journey.
            </p>
          </div>
          <div className={`hidden md:block text-[10px] uppercase tracking-[0.3em] font-black ${isNight ? 'text-zinc-800' : 'text-slate-200'}`}>
            Portal v2.0
          </div>
        </motion.div>

        {appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-20 text-center border rounded-[48px] border-dashed transition-all
              ${isNight ? 'bg-white/[0.02] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}
          >
            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-8
              ${isNight ? 'bg-white/5' : 'bg-slate-50'}`}>
              <Calendar className={`w-10 h-10 ${isNight ? 'text-zinc-700' : 'text-slate-300'}`} />
            </div>
            <p className={`text-xl font-medium mb-8 ${isNight ? 'text-zinc-500' : 'text-slate-400'}`}>
              You haven't scheduled any sessions yet.
            </p>
            <button
              onClick={() => navigate("/doctors")}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold transition-all
                ${isNight
                  ? 'bg-white text-black hover:bg-zinc-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200'}`}
            >
              Explore Specialists <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-8">
            <AnimatePresence mode="popLayout">
              {appointments.map((appt, index) => (
                <motion.div
                  key={appt._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-8 md:p-10 border rounded-[40px] transition-all relative overflow-hidden group
                    ${isNight
                      ? 'bg-[#0a0a0a] border-white/5 hover:border-white/10'
                      : 'bg-white border-slate-100 hover:border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.02)]'}`}
                >
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-center">
                    {/* Doctor Header */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-28 h-28 rounded-3xl overflow-hidden border transition-all duration-700
                        ${isNight ? 'border-white/10 bg-zinc-900 group-hover:border-[#4ca6a3]/40' : 'border-slate-100 bg-slate-50 group-hover:border-[#4ca6a3]/40'}`}>
                        <img
                          src={appt.docId?.image}
                          alt={appt.docId?.name}
                          className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                      </div>
                    </div>

                    {/* Middle Info */}
                    <div className="flex-grow space-y-4 text-center md:text-left min-w-0">
                      <div>
                        <span className={`text-[10px] uppercase tracking-[0.2em] font-black mb-2 block
                          ${isNight ? 'text-[#4ca6a3]' : 'text-[#4ca6a3]'}`}>
                          {appt.docId?.speciality}
                        </span>
                        <h3 className={`text-2xl md:text-3xl font-bold tracking-tight truncate ${isNight ? 'text-white' : 'text-slate-900'}`}>
                          {appt.docId?.name}
                        </h3>
                      </div>

                      <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 pt-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${isNight ? 'bg-white/5' : 'bg-slate-50'}`}>
                            <Calendar className={`w-4 h-4 ${isNight ? 'text-zinc-400' : 'text-[#4ca6a3]'}`} />
                          </div>
                          <div>
                            <p className={`text-[10px] uppercase tracking-widest font-black leading-none mb-1 ${isNight ? 'text-zinc-500' : 'text-slate-500'}`}>Date</p>
                            <p className={`text-sm font-bold ${isNight ? 'text-zinc-300' : 'text-slate-800'}`}>
                              {new Date(appt.slotDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${isNight ? 'bg-white/5' : 'bg-slate-50'}`}>
                            <Clock className={`w-4 h-4 ${isNight ? 'text-zinc-400' : 'text-[#4ca6a3]'}`} />
                          </div>
                          <div>
                            <p className={`text-[10px] uppercase tracking-widest font-black leading-none mb-1 ${isNight ? 'text-zinc-500' : 'text-slate-500'}`}>Time</p>
                            <p className={`text-sm font-bold ${isNight ? 'text-zinc-300' : 'text-slate-800'}`}>{appt.slotTime}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* End Controls */}
                    <div className="flex flex-col gap-6 w-full md:w-auto items-center md:items-end">
                      <div className="flex gap-2">
                        <div className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black border flex items-center gap-2
                          ${appt.status === "Pending" ? (isNight ? 'border-zinc-700 text-zinc-400' : 'border-slate-300 text-slate-600') :
                            appt.status === "Confirmed" ? (isNight ? 'border-[#4ca6a3]/30 bg-[#4ca6a3]/5 text-[#4ca6a3]' : 'border-emerald-200 bg-emerald-50 text-emerald-700') :
                              appt.status === "Completed" ? (isNight ? 'border-white bg-white text-black' : 'border-slate-900 bg-slate-900 text-white') :
                                'border-red-900/40 text-red-600 bg-red-500/5'
                          }`}>
                          <div className={`w-1 h-1 rounded-full animate-pulse ${appt.status === "Pending" ? 'bg-current' : 'bg-current'}`} />
                          {appt.status}
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black border
                          ${appt.paymentStatus === "Paid"
                            ? (isNight ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' : 'border-emerald-200 bg-emerald-50 text-emerald-700')
                            : (isNight ? 'border-zinc-700 text-zinc-400' : 'border-slate-300 text-slate-500')
                          }`}>
                          {appt.paymentStatus}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 w-full justify-center md:justify-end">
                        {appt.status === "Pending" && appt.paymentStatus === "Unpaid" && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePayment(appt.docId?.fees || 500, appt._id)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-xl
                              ${isNight ? 'bg-white text-black hover:bg-zinc-200 shadow-white/5' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'}`}
                          >
                            <CreditCard className="w-3.5 h-3.5" /> Pay Fee
                          </motion.button>
                        )}
                        {appt.paymentStatus === "Paid" && appt.rating === null && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setRatingModal({ isOpen: true, appointment: appt })}
                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-bold transition-all border
                              ${isNight ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'}`}
                          >
                            <Star className="w-3.5 h-3.5 fill-[#4ca6a3] text-[#4ca6a3]" /> Rate Experience
                          </motion.button>
                        )}
                        {(appt.status === "Pending" || appt.status === "Confirmed") && (
                          <button
                            onClick={() => handleCancel(appt._id)}
                            className={`flex items-center gap-2 transition-all text-[10px] uppercase tracking-widest font-black hover:text-red-500
                              ${isNight ? 'text-zinc-500 hover:text-red-400' : 'text-slate-500 hover:text-red-600'}`}
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, appointment: null })}
        appointmentId={ratingModal.appointment?._id}
        doctorName={ratingModal.appointment?.docId?.name}
        onRatingSubmitted={getUserAppointments}
      />

      {/* Custom Confirmation Modal for Cancellation */}
      <AnimatePresence>
        {cancelModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`max-w-sm w-full p-10 rounded-[40px] border shadow-2xl relative overflow-hidden
                ${isNight ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-slate-100'}`}
            >
              <div className="relative z-10 space-y-8">
                <div className="flex flex-col items-center text-center gap-6">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2
                    ${isNight ? 'bg-red-500/5 border-red-500/20 text-red-500' : 'bg-red-50/50 border-red-100 text-red-600'}`}>
                    <XCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold mb-3 ${isNight ? 'text-white' : 'text-slate-900'}`}>Confirm Cancellation</h3>
                    <p className={`text-sm font-light leading-relaxed ${isNight ? 'text-zinc-500' : 'text-slate-500'}`}>
                      Are you sure you want to terminate this appointment request? This action cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setCancelModal({ isOpen: false, appointmentId: null })}
                    className={`py-4 rounded-3xl text-[10px] uppercase tracking-[0.3em] font-black transition-all
                      ${isNight
                        ? 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white'
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`}
                  >
                    Keep It
                  </button>
                  <button
                    onClick={confirmCancel}
                    className="py-4 rounded-3xl bg-red-600 text-white text-[10px] uppercase tracking-[0.3em] font-black hover:bg-red-500 transition-all shadow-xl shadow-red-900/20"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Decorative background flare */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[80px] rounded-full"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyAppointments;
