import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import RelatedDoctors from "../components/RelatedDoctors";
import DoctorReviews from "../components/DoctorReviews";
import { CheckCircle, Star, Calendar, Clock, DollarSign, Award, ThumbsUp, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, backendUrl, token, theme } = useContext(AppContext);
  const navigate = useNavigate();
  const isNight = theme === "night";

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [refreshing, setRefreshing] = useState(false);

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
          const found = doctors.find((doc) => String(doc._id) === String(docId));
          if (found) setDocInfo({ ...found, slots_booked: found.slots_booked || {} });
          else setDocInfo(null);
        }
      } catch (error) {
        console.error("Error fetching doctor slots:", error);
        const found = doctors.find((doc) => String(doc._id) === String(docId));
        if (found) setDocInfo({ ...found, slots_booked: found.slots_booked || {} });
        else setDocInfo(null);
      }
    };

    if (docId) fetchDoctorSlots();
  }, [docId, doctors, backendUrl]);

  const getAvailableSlots = () => {
    if (!docInfo) return;
    const slots = [];
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let daySlots = [];
      const startHour = i === 0 && today.getHours() >= 10 ? today.getHours() + 1 : 10;

      for (let j = startHour; j <= 18; j++) {
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

  const isSlotAvailable = (slot) => {
    if (slot.isBooked || !docInfo.available) return false;
    const now = new Date();
    const slotDateTime = new Date(slot.datetime);
    return slotDateTime > now;
  };

  const refreshSlotAvailability = async (showToast = false) => {
    setRefreshing(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/doctor-slots/${docId}`);
      if (data.success) {
        setDocInfo({
          ...data.data.doctor,
          slots_booked: data.data.bookedSlots || {}
        });
        if (showToast) toast.success("Slots refreshed");
      }
    } catch (error) {
      console.error("Error refreshing slots:", error);
      toast.error("Failed to refresh");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  const bookAppointment = async () => {
    if (!token) {
      toast.warning("Please login to book");
      return navigate("/login");
    }
    if (!slotTime) return toast.error("Please select a time slot");

    try {
      const selectedDate = docSlots[slotIndex][0].datetime;
      const formattedDate = selectedDate.toISOString().split('T')[0];

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
        toast.success("Appointment booked");
        await refreshSlotAvailability();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  if (!docInfo) return null;

  return (
    <div className={`min-h-screen pb-24 px-6 font-inter transition-colors duration-500 ${isNight ? 'bg-[#000000]' : 'bg-[#f9fafb]'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-12 relative z-10 mt-[120px] md:mt-[160px]">

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest w-fit transition-all border
            ${isNight
              ? 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
              : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </motion.button>

        {/* Doctor Identity Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-10 md:p-16 border rounded-[40px] flex flex-col md:flex-row items-center md:items-center gap-16 ${isNight ? 'bg-[#0a0a0a] border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.8)]' : 'bg-white border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)]'}`}
        >
          <div className={`w-48 h-48 md:w-64 md:h-64 rounded-[40px] overflow-hidden border flex-shrink-0 ${isNight ? 'border-white/10' : 'border-gray-100 bg-gray-50'}`}>
            <img
              src={docInfo.image}
              alt={docInfo.name}
              className="w-full h-full object-cover object-center filter grayscale active-grayscale-0 hover:grayscale-0 transition-all duration-700"
            />
          </div>

          <div className="flex-grow space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className={`text-4xl md:text-6xl font-bold tracking-tighter ${isNight ? 'text-white' : 'text-gray-900'}`}>{docInfo.name}</h1>
                <CheckCircle className={`w-6 h-6 ${docInfo.available ? (isNight ? 'text-white' : 'text-blue-600') : (isNight ? 'text-zinc-700' : 'text-gray-300')}`} />
              </div>
              <p className={`text-lg md:text-xl font-light ${isNight ? 'text-zinc-500' : 'text-gray-500'}`}>{docInfo.speciality}{docInfo.degree ? ` \u2022 ${docInfo.degree}` : ''}</p>
            </div>

            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y ${isNight ? 'border-white/5' : 'border-gray-100'}`}>
              <div className="space-y-1">
                <p className={`text-[10px] uppercase tracking-widest font-bold ${isNight ? 'text-zinc-500' : 'text-gray-400'}`}>Experience</p>
                <p className={`font-medium flex items-center gap-2 ${isNight ? 'text-white' : 'text-gray-900'}`}><Award className={`w-4 h-4 ${isNight ? 'text-zinc-600' : 'text-gray-400'}`} /> {docInfo.experience || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className={`text-[10px] uppercase tracking-widest font-bold ${isNight ? 'text-zinc-500' : 'text-gray-400'}`}>Feedback</p>
                <p className={`font-medium flex items-center gap-2 ${isNight ? 'text-white' : 'text-gray-900'}`}><ThumbsUp className={`w-4 h-4 ${isNight ? 'text-zinc-600' : 'text-gray-400'}`} /> 4.9 Rating</p>
              </div>
              <div className="space-y-1">
                <p className={`text-[10px] uppercase tracking-widest font-bold ${isNight ? 'text-zinc-500' : 'text-gray-400'}`}>Consultation</p>
                <p className={`font-medium flex items-center gap-2 ${isNight ? 'text-white' : 'text-gray-900'}`}><DollarSign className={`w-4 h-4 ${isNight ? 'text-zinc-600' : 'text-gray-400'}`} /> ₹{docInfo.fees}</p>
              </div>
              <div className="space-y-1">
                <p className={`text-[10px] uppercase tracking-widest font-bold ${isNight ? 'text-zinc-500' : 'text-gray-400'}`}>Patients</p>
                <p className={`font-medium flex items-center gap-2 ${isNight ? 'text-white' : 'text-gray-900'}`}><Star className={`w-4 h-4 ${isNight ? 'text-zinc-600' : 'text-gray-400'}`} /> 1.2k+</p>
              </div>
            </div>

            <div>
              <p className={`text-[10px] uppercase tracking-widest font-bold mb-3 ${isNight ? 'text-zinc-500' : 'text-gray-400'}`}>Professional Biography</p>
              <p className={`font-light leading-relaxed max-w-2xl text-sm md:text-base ${isNight ? 'text-zinc-400' : 'text-gray-600'}`}>
                {docInfo.about || "Distinguished medical professional with extensive experience in providing empathetic and evidence-based patient care."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Slot Selection */}
        <div className="grid md:grid-cols-3 gap-12 items-center">
          <div className="md:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className={`p-8 md:p-12 border space-y-10 rounded-[40px] ${isNight ? 'bg-[#0a0a0a] border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.8)]' : 'bg-white border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)]'}`}
            >
              <div className={`flex justify-between items-center border-b pb-6 ${isNight ? 'border-white/5' : 'border-gray-100'}`}>
                <h3 className={`text-2xl font-bold flex items-center gap-3 ${isNight ? 'text-white' : 'text-gray-900'}`}>
                  <Calendar className={`w-6 h-6 ${isNight ? 'text-zinc-500' : 'text-gray-400'}`} /> Booking Calendar
                </h3>
                <button
                  onClick={() => refreshSlotAvailability(true)}
                  className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${isNight ? 'text-zinc-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
                >
                  Refresh View
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {docSlots.map((day, i) => {
                  if (!day || day.length === 0) return null;
                  const d = day[0].datetime;
                  const dayName = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(d);
                  const dateNum = d.getDate();
                  return (
                    <button
                      key={i}
                      onClick={() => setSlotIndex(i)}
                      className={`flex flex-col items-center gap-2 px-6 py-8 rounded-3xl border transition-all min-w-[100px] ${i === slotIndex
                        ? (isNight ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "bg-[#111827] text-white border-[#111827] shadow-[0_8px_30px_rgb(0,0,0,0.12)]")
                        : (isNight ? "bg-white/5 text-zinc-500 border-white/5 hover:border-white/10" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-100")
                        }`}
                    >
                      <p className="text-[10px] uppercase font-bold tracking-tighter">{dayName}</p>
                      <p className="text-2xl font-bold">{dateNum}</p>
                    </button>
                  )
                })}
              </div>

              <div className="space-y-6">
                <p className={`text-[10px] uppercase tracking-widest font-bold ${isNight ? 'text-zinc-500' : 'text-gray-400'}`}>Available Time Intervals</p>
                <div className="flex flex-wrap gap-3">
                  {docSlots[slotIndex]?.map((slot, i) => {
                    const available = isSlotAvailable(slot);
                    return (
                      <button
                        key={i}
                        onClick={() => available && setSlotTime(slot.time)}
                        className={`px-6 py-4 rounded-2xl text-xs font-bold transition-all border ${slot.time === slotTime && available
                          ? (isNight ? "bg-white text-black border-white" : "bg-gray-900 text-white border-gray-900")
                          : available
                            ? (isNight ? "bg-white/5 text-zinc-400 border-white/5 hover:border-white/20" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50")
                            : `opacity-20 cursor-not-allowed border-none ${isNight ? 'text-zinc-700' : 'text-gray-400'}`
                          }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Final Action Side */}
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className={`p-10 border space-y-8 rounded-[40px] ${isNight ? 'bg-[#0a0a0a] border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.8)]' : 'bg-white border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)]'}`}
            >
              <div className="space-y-2">
                <p className={`text-[10px] uppercase tracking-widest font-bold ${isNight ? 'text-zinc-500' : 'text-gray-400'}`}>Summary</p>
                <div className={`flex items-center gap-4 ${isNight ? 'text-white' : 'text-gray-900'}`}>
                  <Clock className={`w-5 h-5 ${isNight ? 'text-zinc-600' : 'text-gray-400'}`} />
                  <p className="text-lg font-medium cursor-default">
                    {slotTime ? `${new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(docSlots[slotIndex]?.[0]?.datetime)} \u2022 ${slotTime}` : "Select a time"}
                  </p>
                </div>
              </div>

              <div className={`flex justify-between items-center py-6 border-y ${isNight ? 'border-white/5' : 'border-gray-100'}`}>
                <p className={isNight ? 'text-zinc-500' : 'text-gray-500'}>Professional Fee</p>
                <p className={`text-2xl font-bold ${isNight ? 'text-white' : 'text-gray-900'}`}>₹{docInfo.fees}</p>
              </div>

              <button
                onClick={bookAppointment}
                disabled={!docInfo.available}
                className={`w-full py-5 rounded-[40px] text-[10px] uppercase tracking-[0.3em] font-bold transition-all ${isNight
                  ? 'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]'
                  : 'bg-[#111827] text-white hover:bg-[#1f2937]'
                  } ${!docInfo.available && 'opacity-50 cursor-not-allowed'}`}
              >
                Secure Appointment
              </button>

              <p className={`text-[10px] text-center leading-relaxed uppercase ${isNight ? 'text-zinc-600' : 'text-gray-400'}`}>
                By securing this appointment you agree to our digital consultation terms.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <DoctorReviews doctorId={docInfo._id} />

        {/* Related Doctors */}
        <RelatedDoctors docId={docInfo._id} speciality={docInfo.speciality} />

      </div>
    </div>
  );
};

export default Appointment;
