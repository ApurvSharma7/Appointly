import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import RelatedDoctors from "../components/RelatedDoctors";
import DoctorReviews from "../components/DoctorReviews";
import { CheckCircle, Star } from "lucide-react";
import { motion } from "framer-motion";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch doctor info and real-time slot availability
  useEffect(() => {
    const fetchDoctorSlots = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/doctor-slots/${docId}`);
        if (data.success) {
          setDocInfo({ 
            ...data.data.doctor, 
            slots_booked: data.data.bookedSlots || {} 
          });
        } else {
          // Fallback to local doctor data
          const found = doctors.find((doc) => String(doc._id) === String(docId));
          if (found) setDocInfo({ ...found, slots_booked: found.slots_booked || {} });
          else setDocInfo(null);
        }
      } catch (error) {
        console.error("Error fetching doctor slots:", error);
        // Fallback to local doctor data
        const found = doctors.find((doc) => String(doc._id) === String(docId));
        if (found) setDocInfo({ ...found, slots_booked: found.slots_booked || {} });
        else setDocInfo(null);
      }
    };

    if (docId) {
      fetchDoctorSlots();
    }
  }, [docId, doctors, backendUrl]);

  // Generate next 7 days of slots
  const getAvailableSlots = () => {
    if (!docInfo) return;
    const slots = [];
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let daySlots = [];
      for (let j = 10; j <= 12; j++) {
        let currentDateCopy = new Date(currentDate);
        currentDateCopy.setHours(j);
        currentDateCopy.setMinutes(0);

        let formattedTime = currentDateCopy.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        const formattedDate = currentDateCopy.toISOString().split('T')[0];
        const slotKey = `${formattedDate}_${formattedTime}`;
        const isBooked = docInfo.slots_booked && docInfo.slots_booked[slotKey];

        daySlots.push({ 
          datetime: currentDateCopy, 
          time: formattedTime, 
          isBooked: isBooked || false 
        });
      }
      slots.push(daySlots);
    }
    setDocSlots(slots);
  };

  // Check if a slot is available
  const isSlotAvailable = (slot) => {
    if (slot.isBooked || !docInfo.available) return false;
    
    // Check if slot is in the past
    const now = new Date();
    const slotDateTime = new Date(slot.datetime);
    
    // If slot is more than 30 minutes in the past, it's not available
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    if (slotDateTime < thirtyMinutesAgo) return false;
    
    return true;
  };

  // Refresh slot availability
  const refreshSlotAvailability = async () => {
    setRefreshing(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/doctor-slots/${docId}`);
      if (data.success) {
        setDocInfo({ 
          ...data.data.doctor, 
          slots_booked: data.data.bookedSlots || {} 
        });
        toast.success("Slot availability updated");
      }
    } catch (error) {
      console.error("Error refreshing slots:", error);
      toast.error("Failed to refresh slots");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  const bookAppointment = async () => {
    if (!slotTime) return toast.error("Please select a time slot");

    try {
      // Format the date properly for backend
      const selectedDate = docSlots[slotIndex][0].datetime;
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          docId: docInfo._id,
          slotDate: formattedDate,
          slotTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        // Refresh slot availability to get the latest data
        await refreshSlotAvailability();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  return (
    docInfo && (
      <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 overflow-hidden">
        {/* Floating background bubbles */}
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-blue-200/20 top-10 -left-24 blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-56 h-56 rounded-full bg-teal-200/20 bottom-10 -right-20 blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Doctor Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/50 backdrop-blur-md rounded-3xl shadow-xl p-8 flex flex-col sm:flex-row items-center gap-6 border border-white/20"
          >
            <img
              src={docInfo.image}
              alt={docInfo.name}
              className="w-32 h-32 rounded-2xl object-cover shadow-md"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {docInfo.name}
                </h2>
                <CheckCircle
                  className={`w-6 h-6 ${
                    docInfo.available ? "text-green-500" : "text-red-500"
                  }`}
                />
              </div>
              <p className="text-indigo-600 font-medium mt-1">{docInfo.speciality}</p>
              <div className="flex items-center gap-4 mt-3 flex-wrap text-gray-500">
                <span className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 mr-1" /> 
                  {docInfo.averageRating ? docInfo.averageRating.toFixed(1) : '0.0'}
                  <span className="text-xs text-gray-500 ml-1">
                    ({docInfo.totalRatings || 0} reviews)
                  </span>
                </span>
                <span>{docInfo.experience}</span>
                <span>{docInfo.degree}</span>
              </div>
              <div className="mt-4 flex gap-3 flex-wrap">
                <span className="px-3 py-1 bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 rounded-xl shadow-sm text-sm">
                  ₹{docInfo.fees} Consultation Fee
                </span>
                <span
                  className={`px-3 py-1 rounded-xl text-sm font-medium ${
                    docInfo.available
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {docInfo.available ? "Available Today" : "Unavailable"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Slots Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-inner"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Select a Time Slot
              </h3>
              <motion.button
                onClick={refreshSlotAvailability}
                disabled={refreshing}
                whileHover={{ scale: refreshing ? 1 : 1.05 }}
                className={`px-4 py-2 rounded-xl transition-colors text-sm font-medium ${
                  refreshing 
                    ? "bg-gray-400 text-white cursor-not-allowed" 
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {refreshing ? "Refreshing..." : "Refresh Slots"}
              </motion.button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {docSlots.map((day, i) => (
                <motion.button
                  key={i}
                  onClick={() => setSlotIndex(i)}
                  whileHover={{ scale: 1.05 }}
                  className={`px-5 py-2 rounded-2xl border transition-all font-medium ${
                    i === slotIndex
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Day {i + 1}
                </motion.button>
              ))}
            </div>

            <div className="mt-5 flex gap-3 flex-wrap">
              {docSlots[slotIndex]?.map((slot, i) => {
                const available = isSlotAvailable(slot);
                const isPast = new Date(slot.datetime) < new Date(new Date().getTime() - 30 * 60 * 1000);
                const isBooked = slot.isBooked;
                
                let statusText = "";
                if (isBooked) statusText = "(Booked)";
                else if (isPast) statusText = "(Past)";
                
                return (
                  <motion.button
                    key={i}
                    onClick={() => available && setSlotTime(slot.time)}
                    disabled={!available}
                    whileHover={{ scale: available ? 1.05 : 1 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`px-5 py-2 rounded-2xl border transition-all font-medium ${
                      slot.time === slotTime && available
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                        : available
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : isPast
                        ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
                        : "bg-red-100 text-red-500 border-red-200 cursor-not-allowed"
                    }`}
                  >
                    {slot.time} {statusText}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Book Appointment Button */}
          <motion.button
            onClick={bookAppointment}
            disabled={!docInfo.available}
            whileHover={{ scale: docInfo.available ? 1.05 : 1 }}
            className={`mt-8 w-full py-3 text-white font-semibold rounded-2xl shadow-lg transition-all ${
              docInfo.available
                ? "bg-black hover:bg-gray-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {docInfo.available ? "Book Appointment" : "Unavailable"}
          </motion.button>

          {/* Doctor Reviews */}
          <div className="mt-10">
            <DoctorReviews doctorId={docInfo._id} />
          </div>

          {/* Related Doctors */}
          <div className="mt-10">
            <RelatedDoctors docId={docInfo._id} speciality={docInfo.speciality} />
          </div>
        </div>
      </div>
    )
  );
};

export default Appointment;
