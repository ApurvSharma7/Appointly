// src/pages/MyAppointments.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import RatingModal from "../components/RatingModal";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState({ isOpen: false, appointment: null });
  const navigate = useNavigate();
  const location = useLocation();

  const getUserAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await axios.get(
        "http://localhost:5000/api/user/appointments",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error("❌ Fetch appointments error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (amount, apptId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const { data } = await axios.post(
        "http://localhost:5000/api/payment/razorpay",
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data.success) return alert("Payment initiation failed");

      const { order } = data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "MediGo - Appointment Payment",
        description: "Doctor Appointment Payment",
        order_id: order.id,
        handler: async (response) => {
          try {
            await axios.post(
              "http://localhost:5000/api/payment/verify",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId: apptId,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("✅ Payment Successful!");
            getUserAppointments();
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("❌ Payment verification failed");
          }
        },
        theme: { color: "#1D4ED8" },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed");
    }
  };

  const handleCancel = async (apptId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:5000/api/user/cancel-appointment",
        { appointmentId: apptId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        alert("✅ Appointment cancelled successfully!");
        getUserAppointments();
      } else alert("❌ Could not cancel appointment");
    } catch (err) {
      console.error("Cancel appointment error:", err);
      alert("❌ Cancellation failed");
    }
  };

  const handleRateAppointment = (appointment) => {
    setRatingModal({ isOpen: true, appointment });
  };

  const handleRatingSubmitted = () => {
    getUserAppointments(); // Refresh appointments to show updated rating
  };

  useEffect(() => {
    setLoading(true);
    getUserAppointments();
  }, [location.pathname]);

  if (loading)
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-6 text-gray-600"
      >
        Loading appointments...
      </motion.p>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-4 text-center text-gray-700"
      >
        My Appointments
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-600 text-lg">💡</span>
          <h3 className="font-semibold text-gray-800">Rating System</h3>
        </div>
        <p className="text-gray-700 text-sm">
          After paying for your appointment, you can rate the doctor and share your experience. 
          Your rating helps other patients make informed decisions!
        </p>
      </motion.div>

      {appointments.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 text-center text-lg"
        >
          You have no upcoming appointments.
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((appt, index) => (
            <motion.div
              key={appt._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-lg text-gray-800">
                  {appt.docId?.name || "Unknown"}{" "}
                  <span className="text-sm text-gray-500">
                    ({appt.docId?.speciality})
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(appt.slotDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Time:</span> {appt.slotTime}
                </p>
                {appt.rating !== null && (
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-sm font-medium text-gray-600">Your Rating:</span>
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < appt.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    {appt.feedback && (
                      <span className="text-xs text-gray-500 italic">
                        "{appt.feedback.length > 50 ? appt.feedback.substring(0, 50) + '...' : appt.feedback}"
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                      appt.status === "Pending"
                        ? "bg-yellow-500"
                        : appt.status === "Confirmed"
                        ? "bg-green-600"
                        : appt.status === "Completed"
                        ? "bg-black"
                        : "bg-gray-500"
                    }`}
                  >
                    {appt.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                      appt.paymentStatus === "Paid"
                        ? "bg-green-500"
                        : appt.paymentStatus === "Unpaid"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {appt.paymentStatus}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {appt.status === "Pending" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePayment(500, appt._id)}
                      className="px-4 py-2 bg-black text-white rounded-xl shadow hover:bg-gray-800 transition"
                    >
                      Pay Now
                    </motion.button>
                  )}
                  {appt.paymentStatus === "Paid" && appt.rating === null && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRateAppointment(appt)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-xl shadow hover:bg-yellow-600 transition"
                    >
                      Rate Doctor
                    </motion.button>
                  )}
                  {(appt.status === "Pending" || appt.status === "Confirmed") && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCancel(appt._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600 transition"
                    >
                      Cancel
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, appointment: null })}
        appointmentId={ratingModal.appointment?._id}
        doctorName={ratingModal.appointment?.docId?.name}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </div>
  );
};

export default MyAppointments;
