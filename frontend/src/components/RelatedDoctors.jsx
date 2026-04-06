import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors, theme } = useContext(AppContext);
  const navigate = useNavigate();
  const [relDoc, setRelDoc] = useState([]);
  const isNight = theme === 'night';

  useEffect(() => {
    if (doctors && doctors.length > 0) {
      const filtered = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );

      // Force all doctors to be available
      setRelDoc(filtered.map((d) => ({ ...d, available: true })));
    }
  }, [doctors, speciality, docId]);

  if (!relDoc.length) return null;

  return (
    <div className="mt-16">
      <h3 className={`text-2xl font-semibold mb-6 flex items-center gap-3 ${isNight ? 'text-white' : 'text-gray-900'}`}>
        Related Doctors
      </h3>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {relDoc.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(`/appointment/${item._id}`)}
            className={`relative border rounded-[40px] p-6 hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden ${
              isNight 
                ? 'bg-[#0a0a0a] border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.06)] hover:border-white/10' 
                : 'bg-white border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:border-gray-300'
            }`}
          >
            {/* Availability Badge */}
            <span className={`absolute top-5 left-5 text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10 ${isNight ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-green-100/50 text-green-600 border border-green-100'}`}>
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2 animate-pulse"></span>
              Available
            </span>

            {/* Doctor Image */}
            <div className={`w-32 h-32 mx-auto rounded-full overflow-hidden mt-6 border-4 ${isNight ? 'border-[#1a1a1a]' : 'border-gray-50'}`}>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover object-center filter grayscale active-grayscale-0 hover:grayscale-0 transition-all duration-700"
              />
            </div>

            {/* Doctor Info */}
            <div className="text-center mt-6">
              <h4 className={`text-xl font-bold truncate ${isNight ? 'text-white' : 'text-gray-900'}`}>
                {item.name}
              </h4>
              <p className={`text-sm mt-1 font-medium ${isNight ? 'text-zinc-500' : 'text-gray-500'}`}>{item.speciality}</p>
              <p className={`text-xs mt-2 ${isNight ? 'text-zinc-600' : 'text-gray-400'}`}>
                {item.degree || 'MBBS'} • {item.experience || '3 Years'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedDoctors;
