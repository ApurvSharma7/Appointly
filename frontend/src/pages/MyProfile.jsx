import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";


const MyProfile = () => {
  const { token, backendUrl, userData, setUserData, theme, toggleTheme } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [localUser, setLocalUser] = useState({
    name: "",
    phone: "",
    address: { line1: "", line2: "" },
    gender: "not selected",
    dob: "",
    email: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      setLocalUser({
        name: userData.name || "",
        phone: userData.phone || "",
        address: userData.address || { line1: "", line2: "" },
        gender: userData.gender || "not selected",
        dob: userData.dob || "",
        email: userData.email || "",
        image: userData.image || "",
      });
      setLoading(false);
    }
  }, [userData]);

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", localUser.name);
      formData.append("phone", localUser.phone);
      formData.append("address", JSON.stringify(localUser.address));
      formData.append("gender", localUser.gender);
      formData.append("dob", localUser.dob);
      if (image) formData.append("image", image);

      const { data } = await axios.put(`${backendUrl}/api/user/profile`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("profile updated");
        setUserData(data.user);
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "update failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full bg-[var(--text-main)] animate-pulse"></div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center w-full h-svh overflow-hidden bg-[var(--bg-primary)] px-4 font-inter text-[var(--text-main)] selection:bg-[var(--text-main)] selection:text-[var(--bg-primary)] transition-colors duration-500">
      <div className="text-center mb-0 mt-8">
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${theme === "night" ? "text-white" : "text-slate-900"}`}>
          My <span className="italic text-[#4ca6a3]">Profile</span>
        </h1>
      </div>
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-stretch justify-center px-4 md:px-10 gap-12 md:gap-10 pt-10 relative">

        {/* Left Column: Avatar & Name */}
        <div className="w-full md:w-1/3 flex flex-col justify-center items-center gap-6 shrink-0 md:pr-10 md:py-10 md:border-r border-[var(--border-color)]">
          <div className="w-36 h-36 rounded-full overflow-hidden bg-[rgba(128,128,128,0.1)] relative border border-[var(--border-color)] shadow-sm">
            <img
              src={
                image ? URL.createObjectURL(image)
                  : localUser.image
                    ? (localUser.image.startsWith("http") ? localUser.image : backendUrl + localUser.image)
                    : assets.default_user
              }
              alt="profile"
              className="w-full h-full object-cover"
            />
            {isEdit && (
              <label className="absolute inset-0 bg-black/50 cursor-pointer flex items-center justify-center backdrop-blur-[2px] transition-colors hover:bg-black/60 text-white">
                <span className="text-sm font-medium">change</span>
                <input type="file" hidden onChange={e => setImage(e.target.files[0])} />
              </label>
            )}
          </div>

          <div className="flex flex-col w-full items-center mt-2">
            {isEdit ? (
              <input
                value={localUser.name}
                onChange={e => setLocalUser({ ...localUser, name: e.target.value })}
                className={`text-2xl font-bold backdrop-blur-md rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.05)] px-6 py-2 text-center outline-none w-full border-none transition-all ${theme === "night"
                  ? "bg-[rgba(255,255,255,0.05)] text-white focus:bg-[rgba(255,255,255,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
                  : "bg-[rgba(0,0,0,0.05)] text-black focus:bg-[rgba(0,0,0,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.05)]"
                  }`}
                placeholder="your name"
              />
            ) : (
              <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-main)] tracking-tight text-center">
                {localUser.name || "not provided"}
              </h1>
            )}
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="w-full md:w-2/3 flex flex-col justify-start gap-8">

          {/* contact information */}
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-medium text-[var(--text-secondary)] border-b border-[var(--border-color)] pb-2 mb-2">contact information</h2>

            <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-4 items-center">
              <span className="text-[var(--text-main)] font-medium">email:</span>
              <span className="text-[#3b82f6] text-base">{localUser.email}</span>
            </div>

            <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-4 items-center">
              <span className="text-[var(--text-main)] font-medium">phone:</span>
              {isEdit ? (
                <input
                  className={`backdrop-blur-md rounded-[24px] px-5 py-2.5 outline-none w-full border-none transition-all ${theme === "night"
                    ? "bg-[rgba(255,255,255,0.05)] text-white focus:bg-[rgba(255,255,255,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
                    : "bg-[rgba(0,0,0,0.05)] text-black focus:bg-[rgba(0,0,0,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.05)]"
                    }`}
                  value={localUser.phone}
                  onChange={e => setLocalUser({ ...localUser, phone: e.target.value })}
                  placeholder="phone number"
                />
              ) : (
                <span className="text-[var(--text-main)] text-base">{localUser.phone || "not provided"}</span>
              )}
            </div>

            <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-4 items-start">
              <span className="text-[var(--text-main)] font-medium pt-2">address:</span>
              {isEdit ? (
                <div className="flex flex-col gap-3 w-full max-w-[400px]">
                  <input
                    className={`backdrop-blur-md rounded-[24px] px-5 py-2.5 outline-none w-full border-none transition-all ${theme === "night"
                      ? "bg-[rgba(255,255,255,0.05)] text-white focus:bg-[rgba(255,255,255,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
                      : "bg-[rgba(0,0,0,0.05)] text-black focus:bg-[rgba(0,0,0,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.05)]"
                      }`}
                    value={localUser.address.line1}
                    onChange={e => setLocalUser({ ...localUser, address: { ...localUser.address, line1: e.target.value } })}
                    placeholder="address line 1"
                  />
                  <input
                    className={`backdrop-blur-md rounded-[24px] px-5 py-2.5 outline-none w-full border-none transition-all ${theme === "night"
                      ? "bg-[rgba(255,255,255,0.05)] text-white focus:bg-[rgba(255,255,255,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
                      : "bg-[rgba(0,0,0,0.05)] text-black focus:bg-[rgba(0,0,0,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.05)]"
                      }`}
                    value={localUser.address.line2}
                    onChange={e => setLocalUser({ ...localUser, address: { ...localUser.address, line2: e.target.value } })}
                    placeholder="address line 2"
                  />
                </div>
              ) : (
                <span className="text-[var(--text-main)] text-base pt-2 leading-relaxed">
                  {localUser.address.line1 || "not provided"} <br />
                  {localUser.address.line2}
                </span>
              )}
            </div>
          </div>

          {/* basic information */}
          <div className="flex flex-col gap-5 mt-2">
            <h2 className="text-lg font-medium text-[var(--text-secondary)] border-b border-[var(--border-color)] pb-2 mb-2">basic information</h2>

            <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-4 items-center">
              <span className="text-[var(--text-main)] font-medium">gender:</span>
              {isEdit ? (
                <select
                  className={`backdrop-blur-md rounded-[24px] px-5 py-2.5 outline-none w-full max-w-[400px] border-none transition-all appearance-none cursor-pointer ${theme === "night"
                    ? "bg-[rgba(255,255,255,0.05)] text-white focus:bg-[rgba(255,255,255,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
                    : "bg-[rgba(0,0,0,0.05)] text-black focus:bg-[rgba(0,0,0,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.05)]"
                    }`}
                  value={localUser.gender}
                  onChange={e => setLocalUser({ ...localUser, gender: e.target.value })}
                >
                  <option className="bg-[var(--bg-primary)] text-[var(--text-main)]" value="not selected">not selected</option>
                  <option className="bg-[var(--bg-primary)] text-[var(--text-main)]" value="male">male</option>
                  <option className="bg-[var(--bg-primary)] text-[var(--text-main)]" value="female">female</option>
                  <option className="bg-[var(--bg-primary)] text-[var(--text-main)]" value="other">other</option>
                </select>
              ) : (
                <span className="text-[var(--text-main)] text-base">{localUser.gender}</span>
              )}
            </div>

            <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-4 items-center">
              <span className="text-[var(--text-main)] font-medium">birthday:</span>
              {isEdit ? (
                <input
                  type="date"
                  className={`backdrop-blur-md rounded-[24px] px-5 py-2.5 outline-none w-full max-w-[400px] border-none transition-all ${theme === "night"
                    ? "bg-[rgba(255,255,255,0.05)] text-white focus:bg-[rgba(255,255,255,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.3)] [color-scheme:dark]"
                    : "bg-[rgba(0,0,0,0.05)] text-black focus:bg-[rgba(0,0,0,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.05)] [color-scheme:light]"
                    }`}
                  value={localUser.dob}
                  onChange={e => setLocalUser({ ...localUser, dob: e.target.value })}
                />
              ) : (
                <span className="text-[var(--text-main)] text-base">{localUser.dob || "not provided"}</span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex md:justify-start justify-center mt-6 gap-4">
            {isEdit ? (
              <>
                <button
                  onClick={() => setIsEdit(false)}
                  className="bg-transparent border border-[var(--border-color)] hover:bg-[rgba(128,128,128,0.1)] text-[var(--text-main)] rounded-[9999px] px-8 py-3 transition-colors outline-none font-medium"
                >
                  cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#ffffff] rounded-[9999px] px-8 py-3 transition-colors outline-none font-medium"
                >
                  save profile
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#ffffff] rounded-[9999px] px-10 py-3 font-medium transition-colors outline-none shadow-xl"
              >
                edit profile
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default MyProfile;
