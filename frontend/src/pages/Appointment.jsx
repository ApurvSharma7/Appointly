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
    <div className={`min-h-screen pb-24 px-3 md:px-6 font-inter transition-colors duration-500 overflow-x-hidden ${isNight ? 'bg-[#000000]' : 'bg-[#f9fafb]'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-8 md:gap-12 relative z-10 mt-[100px] md:mt-[160px] w-full">

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit transition-all border
            ${isNight
              ? 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
              : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
          <ArrowLeft className="w-3 h-3" /> Back
        </motion.button>

        {/* Doctor Identity Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-5 md:p-16 border rounded-[24px] md:rounded-[40px] flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-16 w-full overflow-hidden ${isNight ? 'bg-[#0a0a0a] border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.8)]' : 'bg-white border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)]'}`}
        >
          <div className={`w-32 h-32 md:w-64 md:h-64 rounded-[20px] md:rounded-[40px] overflow-hidden border flex-shrink-0 ${isNight ? 'border-white/10' : 'border-gray-100 bg-gray-50'}`}>
            <img
              src={docInfo.image}
              alt={docInfo.name}
              className="w-full h-full object-cover object-center filter grayscale active-grayscale-0 hover:grayscale-0 transition-all duration-700"
            />
          </div>

          <div className="flex-grow space-y-4 md:space-y-6 text-center md:text-left min-w-0 w-full">
            <div className="w-full">
              <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 mb-2 flex-wrap">
                <h1 className={`text-2xl sm:text-3xl md:text-6xl font-bold tracking-tighter ${isNight ? 'text-white' : 'text-gray-900'}`}>{docInfo.name}</h1>
                {docInfo.available ?
                  <CheckCircle className={`w-5 h-5 ${isNight ? 'text-white' : 'text-blue-600'}`} /> :
                  <div className="flex items-center gap-2 px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full">
                    <div className="w-1 h-1 rounded-full bg-red-500"></div>
                    <span className="text-red-400 text-[8px] font-bold uppercase tracking-widest">Offline</span>
                  </div>
                }
              </div>
              <p className={`text-xs md:text-xl font-light truncate ${isNight ? 'text-zinc-500' : 'text-gray-500'}`}>{docInfo.speciality}{docInfo.degree ? ` \u2022 ${docInfo.degree}` : ''}</p>
            </div>

            <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 py-4 md:py-6 border-y w-full ${isNight ? 'border-white/5' : 'border-gray-100'}`}>
              <div className="space-y-0.5 text-left min-w-0">
                <p className={`text-[7px] md:text-[10px] uppercase tracking-widest font-bold ${isNight ? 'text-zinc-500' : 'text-gray-400'}`}>Experience</p>
                <p className={`text-[11px] md:text-base font-medium flex items-center gap-1.5 truncate ${isNight ? 'text-white' : 'text-gray-900'}`}><Award className="w-3 h-3" /> {docInfo.experience || "N/A"}</p>
              </div>
              <div className="space-y-0.5 text-left min-w-0">
                <p className={`text-[7px] md:text-[10px] uppercase tracking-widest font-bold ${isNight ? 'text-zinc-500' : 'text-gray-400'}`}>Feedback</p>
                <p className={`text-[11px] md:text-base font-medium flex items-center gap-1.5 truncate ${isNight ? 'text-white' : 'text-gray-900'}`}><ThumbsUp className="w-3 h-3" /> 4.9</p>
              </div>
              <div className="space-y-0.5 text-left min-w-0">
                <p className={`text-[7px] md:text-[10px] uppercase tracking-widest font-bold ${isNight ? 'text-zinc-500' : 'text-gray-400'}`}>Fee</p>
                <p className={`text-[11px] md:text-base font-medium flex items-center gap-1.5 truncate ${isNight ? 'text-white' : 'text-gray-900'}`}>₹{docInfo.fees}</p>
              </div>
              <div className="space-y-0.5 text-left min-w-0">
                <p className={`text-[7px] md:text-[10px] uppercase tracking-widest font-bold ${isNight ? 'text-zinc-500' : 'text-gray-400'}`}>Patients</p>
                <p className={`text-[11px] md:text-base font-medium flex items-center gap-1.5 truncate ${isNight ? 'text-white' : 'text-gray-900'}`}><Star className="w-3 h-3" /> 1k+</p>
              </div>
            </div>

            <div>
              <p className={`text-[8px] md:text-[10px] uppercase tracking-widest font-bold mb-1.5 ${isNight ? 'text-zinc-500' : 'text-gray-400'}`}>Biography</p>
              <p className={`font-light leading-relaxed max-w-2xl text-[12px] md:text-base ${isNight ? 'text-zinc-400' : 'text-gray-600'}`}>
                {docInfo.about || "Distinguished medical professional."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Slot Selection */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-12 items-start w-full">
          <div className="md:col-span-2 space-y-6 md:space-y-8 w-full overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className={`p-4 md:p-12 border space-y-6 md:space-y-10 rounded-[20px] md:rounded-[40px] w-full overflow-hidden ${isNight ? 'bg-[#0a0a0a] border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.8)]' : 'bg-white border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)]'}`}
            >
              <div className={`flex justify-between items-center border-b pb-4 md:pb-6 ${isNight ? 'border-white/5' : 'border-gray-100'}`}>
                <h3 className={`text-lg md:text-2xl font-bold flex items-center gap-2 md:gap-3 ${isNight ? 'text-white' : 'text-gray-900'}`}>
                  <Calendar className={`w-5 h-5 md:w-6 md:h-6 ${isNight ? 'text-zinc-500' : 'text-gray-400'}`} /> Booking
                </h3>
                <button
                  onClick={() => refreshSlotAvailability(true)}
                  className={`text-[8px] md:text-[10px] uppercase tracking-widest font-bold transition-colors ${isNight ? 'text-zinc-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
                >
                  Refresh
                </button>
              </div>

              {/* Horizontal Scroll Area */}
              <div className="w-full relative">
                <div className="flex gap-2.5 md:gap-4 overflow-x-auto pb-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {docSlots.map((day, i) => {
                    if (!day || day.length === 0) return null;
                    const d = day[0].datetime;
                    const dayName = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(d);
                    const dateNum = d.getDate();
                    return (
                      <button
                        key={i}
                        onClick={() => setSlotIndex(i)}
                        className={`flex flex-col items-center gap-1 md:gap-2 px-4 py-5 md:px-6 md:py-8 rounded-xl md:rounded-3xl border transition-all min-w-[65px] md:min-w-[100px] ${i === slotIndex
                          ? (isNight ? "bg-white text-black border-white" : "bg-gray-900 text-white border-gray-900 shadow-md transform scale-105")
                          : (isNight ? "bg-white/5 text-zinc-500 border-white/5 hover:border-white/10" : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100")
                          }`}
                      >
                        <p className="text-[8px] md:text-[10px] uppercase font-bold tracking-tighter">{dayName}</p>
                        <p className="text-lg md:text-2xl font-bold">{dateNum}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <p className={`text-[8px] md:text-[10px] uppercase tracking-widest font-bold ${isNight ? 'text-zinc-500' : 'text-gray-400'}`}>Available Time</p>
                <div className="flex flex-wrap gap-2 md:gap-3 w-full">
                  {docSlots[slotIndex]?.map((slot, i) => {
                    const available = isSlotAvailable(slot);
                    return (
                      <button
                        key={i}
                        onClick={() => available && setSlotTime(slot.time)}
                        className={`px-3 md:px-6 py-2.5 md:py-4 rounded-lg md:rounded-2xl text-[9px] md:text-xs font-bold transition-all border shrink-0 ${slot.time === slotTime && available
                          ? (isNight ? "bg-white text-black border-white" : "bg-gray-900 text-white border-gray-900 shadow-sm")
                          : available
                            ? (isNight ? "bg-white/5 text-zinc-400 border-white/5 hover:border-white/20" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50")
                            : `${isNight ? 'bg-zinc-900/50 text-zinc-600 border-zinc-800' : 'bg-gray-100 text-gray-400 border-gray-200'} cursor-not-allowed relative overflow-hidden`
                          }`}
                      >
                        {slot.time}
                        {!available && (
                          <div className={`absolute top-1/2 left-0 w-full h-[1px] bg-red-500/50 -rotate-0`}></div>
                        )}
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
              className={`p-5 md:p-10 border space-y-6 md:space-y-8 rounded-[20px] md:rounded-[40px] w-full overflow-hidden ${isNight ? 'bg-[#0a0a0a] border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.8)]' : 'bg-white border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)]'}`}
            >
              <div className="space-y-2">
                <p className={`text-[8px] md:text-[10px] uppercase tracking-widest font-bold ${isNight ? 'text-zinc-500' : 'text-gray-400'}`}>Summary</p>
                <div className={`flex items-center gap-3 md:gap-4 ${isNight ? 'text-white' : 'text-gray-900'}`}>
                  <Clock className={`w-4 h-4 md:w-5 md:h-5 ${isNight ? 'text-zinc-600' : 'text-gray-400'}`} />
                  <p className="text-[13px] md:text-lg font-medium">
                    {slotTime ? `${new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(docSlots[slotIndex]?.[0]?.datetime)} \u2022 ${slotTime}` : "Select a time"}
                  </p>
                </div>
              </div>

              <div className={`flex justify-between items-center py-4 md:py-6 border-y ${isNight ? 'border-white/5' : 'border-gray-100'}`}>
                <p className={`text-xs md:text-base ${isNight ? 'text-zinc-500' : 'text-gray-500'}`}>Fee</p>
                <p className={`text-lg md:text-2xl font-bold ${isNight ? 'text-white' : 'text-gray-900'}`}>₹{docInfo.fees}</p>
              </div>

              <button
                onClick={bookAppointment}
                disabled={!docInfo.available}
                className={`w-full py-4 md:py-5 rounded-full text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold transition-all shadow-lg ${isNight
                  ? 'bg-white text-black hover:bg-zinc-100 shadow-white/5'
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
                  } ${!docInfo.available && 'opacity-20 cursor-not-allowed'}`}
              >
                {docInfo.available ? "Secure Appointment" : "Doctor Offline"}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="w-full">
          <DoctorReviews doctorId={docInfo._id} />
        </div>

        {/* Related Doctors */}
        <div className="w-full pb-10">
          <RelatedDoctors docId={docInfo._id} speciality={docInfo.speciality} />
        </div>

      </div>
    </div>
  );
};

export default Appointment;
