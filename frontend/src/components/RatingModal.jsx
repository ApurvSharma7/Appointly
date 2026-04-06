import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const RatingModal = ({ isOpen, onClose, appointmentId, doctorName, onRatingSubmitted }) => {
  const { theme, backendUrl, token } = useContext(AppContext);
  const isNight = theme === 'night';
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/rate-doctor`,
        {
          appointmentId,
          rating,
          feedback: feedback.trim() || null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Rating submitted successfully!');
        onRatingSubmitted();
        onClose();
        setRating(0);
        setFeedback('');
      } else {
        toast.error(response.data.message || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Rating submission error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to submit rating';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setFeedback('');
    setHoveredRating(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`rounded-[40px] p-10 w-full max-w-md border shadow-2xl relative overflow-hidden transition-colors duration-500
              ${isNight ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-slate-100'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Accent for Dark Mode */}
            {isNight && <div className="absolute top-0 right-0 w-32 h-32 bg-[#4ca6a3]/5 blur-[80px] rounded-full pointer-events-none"></div>}

            <div className="flex justify-between items-center mb-10 relative z-10 font-inter">
              <h2 className={`text-3xl font-bold tracking-tight ${isNight ? 'text-white' : 'text-slate-900'}`}>
                Rate Your <span className="italic text-[#4ca6a3]">Experience</span>
              </h2>
              <button
                onClick={handleClose}
                className={`text-2xl transition-colors ${isNight ? 'text-zinc-700 hover:text-white' : 'text-slate-300 hover:text-slate-900'}`}
              >
                ×
              </button>
            </div>

            <div className="mb-10 relative z-10">
              <p className={`text-sm font-light mb-6 ${isNight ? 'text-zinc-500' : 'text-slate-500'}`}>
                How was your appointment with <span className={`font-semibold ${isNight ? 'text-zinc-300' : 'text-slate-900'}`}>{doctorName}</span>?
              </p>

              {/* Star Rating */}
              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className={`text-4xl transition-colors duration-200 ${star <= (hoveredRating || rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                      } hover:text-yellow-400`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  {rating === 0 && 'Select a rating'}
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </p>
              </div>
            </div>

            {/* Feedback */}
            <div className="mb-8 relative z-10">
              <label className={`block text-[10px] uppercase tracking-[0.2em] font-black mb-3 ${isNight ? 'text-zinc-600' : 'text-slate-400'}`}>
                Share your feedback (optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience..."
                className={`w-full p-5 border rounded-3xl transition-all duration-300 resize-none text-sm leading-relaxed
                  ${isNight
                    ? 'bg-white/5 border-white/5 text-white placeholder-zinc-700 focus:border-[#4ca6a3]/30 focus:bg-white/[0.07]'
                    : 'bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-300 focus:border-[#4ca6a3]/30 focus:bg-white'}`}
                rows="4"
                maxLength="500"
              />
              <p className={`text-[9px] uppercase tracking-widest font-black mt-2 text-right ${isNight ? 'text-zinc-800' : 'text-slate-200'}`}>
                {feedback.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="relative z-10 flex gap-4">
              <button
                onClick={handleClose}
                className={`flex-1 py-4 rounded-3xl text-[10px] uppercase tracking-[0.3em] font-black transition-all
                  ${isNight
                    ? 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white'
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                Discard
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-[2] py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] transition-all relative overflow-hidden group
                  ${isNight ? 'bg-white text-black hover:bg-zinc-200' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200'}`}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mx-auto"
                  />
                ) : (
                  'Submit Evaluation'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RatingModal;
