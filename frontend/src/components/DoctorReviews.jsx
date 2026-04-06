import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Star, PenLine, MessageSquare } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const DoctorReviews = ({ doctorId }) => {
  const [reviews, setReviews] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(AppContext);
  const isNight = theme === 'night';

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/doctor-reviews/${doctorId}`);
        if (response.data.success) {
          setDoctor(response.data.data.doctor);
          setReviews(response.data.data.reviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [doctorId]);

  const StarRow = ({ rating, size = 'sm' }) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${
            i < rating
              ? 'fill-yellow-400 text-yellow-400'
              : isNight ? 'fill-white/10 text-white/10' : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className={`rounded-[40px] p-8 md:p-12 border animate-pulse ${isNight ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-200'}`}>
        <div className="space-y-4">
          <div className={`h-5 w-32 rounded-full ${isNight ? 'bg-white/10' : 'bg-gray-100'}`} />
          <div className={`h-4 w-full rounded-full ${isNight ? 'bg-white/5' : 'bg-gray-50'}`} />
          <div className={`h-4 w-2/3 rounded-full ${isNight ? 'bg-white/5' : 'bg-gray-50'}`} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[40px] p-8 md:p-12 border ${isNight ? 'bg-[#0a0a0a] border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.8)]' : 'bg-white border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)]'}`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between pb-8 border-b ${isNight ? 'border-white/5' : 'border-gray-100'}`}>
        <div className="flex items-center gap-3">
          <MessageSquare className={`w-5 h-5 ${isNight ? 'text-zinc-500' : 'text-gray-400'}`} />
          <h3 className={`text-2xl font-bold ${isNight ? 'text-white' : 'text-gray-900'}`}>
            Patient Reviews
          </h3>
        </div>
        {doctor && doctor.totalRatings > 0 && (
          <div className="flex items-center gap-3">
            <StarRow rating={Math.round(doctor.averageRating)} size="md" />
            <div className="text-right">
              <p className={`text-lg font-bold leading-none ${isNight ? 'text-white' : 'text-gray-900'}`}>
                {doctor.averageRating.toFixed(1)}
              </p>
              <p className={`text-[10px] uppercase tracking-widest font-bold mt-1 ${isNight ? 'text-zinc-500' : 'text-gray-400'}`}>
                {doctor.totalRatings} review{doctor.totalRatings !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {reviews.length === 0 ? (
        <div className={`mt-8 flex flex-col items-center justify-center gap-4 py-14 rounded-3xl border-2 border-dashed transition-colors
          ${isNight ? 'border-white/5' : 'border-gray-100'}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isNight ? 'bg-white/5' : 'bg-gray-50'}`}>
            <PenLine className={`w-5 h-5 ${isNight ? 'text-zinc-600' : 'text-gray-300'}`} />
          </div>
          <div className="text-center space-y-1">
            <p className={`font-semibold ${isNight ? 'text-zinc-400' : 'text-gray-500'}`}>No reviews yet</p>
            <p className={`text-sm ${isNight ? 'text-zinc-600' : 'text-gray-300'}`}>
              Book an appointment to leave the first review
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className={`p-6 rounded-3xl border transition-colors ${isNight ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'}`}
            >
              <div className="flex items-start gap-4">
                {/* Avatar Initial */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-bold text-sm
                  ${isNight ? 'bg-white/10 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {review.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${isNight ? 'text-white' : 'text-gray-900'}`}>
                        {review.userId?.name || 'Anonymous'}
                      </span>
                      <StarRow rating={review.rating} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest shrink-0 ${isNight ? 'text-zinc-600' : 'text-gray-300'}`}>
                      {new Date(review.ratedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  {review.feedback && (
                    <p className={`text-sm leading-relaxed ${isNight ? 'text-zinc-400' : 'text-gray-600'}`}>
                      {review.feedback}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default DoctorReviews;
