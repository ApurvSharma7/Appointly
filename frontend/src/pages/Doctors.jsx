import { useContext, useState, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Search, Calendar } from "lucide-react";

const Doctors = () => {
  const { doctors, backendUrl, theme } = useContext(AppContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("All");

  const specialities = useMemo(() => {
    if (!doctors) return ["All"];
    const unique = new Set(doctors.map((doc) => doc.speciality));
    return ["All", ...Array.from(unique)];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    if (!doctors) return [];
    return doctors.filter((doc) => {
      const matchSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSpec = selectedSpeciality === "All" || doc.speciality === selectedSpeciality;
      return matchSearch && matchSpec;
    });
  }, [doctors, searchTerm, selectedSpeciality]);

  const getImage = (doc) => {
    if (doc.image) {
      return doc.image.startsWith("http") ? doc.image : `${backendUrl}${doc.image}`;
    }
    const bg = theme === "night" ? "1a1a1a" : "f3f4f6";
    const color = theme === "night" ? "ffffff" : "000000";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&size=512&background=${bg}&color=${color}`;
  };

  const isNight = theme === "night";

  return (
    <div 
      className={`min-h-screen w-full pt-28 pb-16 px-6 lg:px-20 font-sans transition-colors duration-500 ${
        isNight ? "bg-[#000000] text-[#ffffff]" : "bg-[#f9fafb] text-[#111827]"
      }`}
      style={{ fontFamily: "'Inter', 'Google Sans', sans-serif" }}
    >
      {/* Header and Search */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className={`text-4xl md:text-5xl font-bold tracking-tight mb-3 ${isNight ? 'text-white' : 'text-slate-900'}`}>
            Our <span className="italic text-[#4ca6a3]">Doctors</span>
          </h1>
          <p className={`text-lg ${isNight ? "text-gray-400" : "text-gray-600"}`}>
            Find and book appointments with top specialists.
          </p>
        </div>

        <div className="w-full md:w-[350px] relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 ${isNight ? "text-gray-400" : "text-gray-500"}`} />
          </div>
          <input
            type="text"
            placeholder="Search doctors by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full rounded-[24px] pl-11 pr-5 py-4 focus:outline-none transition-all ${
              isNight
                ? "bg-[rgba(255,255,255,0.05)] backdrop-blur-md focus:bg-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.1)] placeholder:text-gray-500 text-white"
                : "bg-white border border-gray-200 focus:border-gray-300 focus:ring-4 focus:ring-gray-100 shadow-sm placeholder:text-gray-400 text-gray-900"
            }`}
          />
        </div>
      </div>

      {/* Specialities Filter */}
      <div className="max-w-7xl mx-auto mb-10 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-center gap-3 w-max">
          {specialities.map((spec) => {
            let btnClass = "";
            if (isNight) {
              btnClass = selectedSpeciality === spec
                ? "bg-[#ffffff] text-[#000000]"
                : "bg-[#1a1a1a] text-[#ffffff] hover:bg-[#2a2a2a]";
            } else {
              btnClass = selectedSpeciality === spec
                ? "bg-[#111827] text-[#ffffff]"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200";
            }

            return (
              <button
                key={spec}
                onClick={() => setSelectedSpeciality(spec)}
                className={`px-6 py-2.5 rounded-[9999px] whitespace-nowrap transition-all font-medium ${
                  isNight ? "border-none" : ""
                } ${btnClass}`}
              >
                {spec}
              </button>
            );
          })}
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredDoctors.length === 0 ? (
          <div className={`flex flex-col items-center justify-center py-20 text-center rounded-[32px] border ${
            isNight 
              ? "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)]" 
              : "bg-white border-gray-100 shadow-sm"
          }`}>
            <Search className={`h-12 w-12 mb-4 ${isNight ? "text-gray-500" : "text-gray-400"}`} />
            <h3 className="text-xl font-bold mb-2">No doctors found</h3>
            <p className={isNight ? "text-gray-400" : "text-gray-500"}>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 mt-8 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc._id}
                className={`group flex flex-col rounded-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  isNight
                    ? "bg-[rgba(255,255,255,0.03)] backdrop-blur-md border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_15px_40px_-15px_rgba(255,255,255,0.1)]"
                    : "bg-white border border-gray-100 hover:border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                }`}
              >
                <div className={`relative w-full aspect-square overflow-hidden p-4 ${isNight ? "bg-[#1a1a1a]" : "bg-gray-50"}`}>
                  <img
                    src={getImage(doc)}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top rounded-[16px] group-hover:scale-105 transition-transform duration-500"
                  />
                  {doc.available !== false && (
                    <div className={`absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                      isNight 
                        ? "bg-[#000000] backdrop-blur-md border-[rgba(255,255,255,0.1)]" 
                        : "bg-white border-gray-200 shadow-sm"
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className={`text-[10px] font-bold tracking-wider ${isNight ? "text-white" : "text-gray-700"}`}>AVAILABLE</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-1 truncate">{doc.name}</h3>
                    <p className={`text-sm mb-4 ${isNight ? "text-gray-400" : "text-gray-500"}`}>{doc.speciality}</p>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/appointment/${doc._id}`)}
                    className={`mt-2 w-full flex items-center justify-center gap-2 py-3.5 border-none rounded-[9999px] transition-colors font-medium ${
                      isNight
                        ? "bg-[#1a1a1a] text-[#ffffff] hover:bg-[#2a2a2a]"
                        : "bg-[#111827] text-white hover:bg-[#1f2937]"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
