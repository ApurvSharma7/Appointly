import { useContext, useState, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { assets } from "../assets/assets";

// Helper for class merging
const cn = (...classes) => classes.filter(Boolean).join(" ");

// ACETERNITY UI COMPONENTS
const Input = ({ className, type, ...props }) => {
  const radius = 100;
  const [visible, setVisible] = useState(false);

  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
          var(--blue-500),
          transparent 80%
        )
      `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="p-[2px] rounded-lg transition duration-300 group/input"
    >
      <input
        type={type}
        className={cn(
          "flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus:outline-none focus:ring-[2px]  focus:ring-neutral-400 dark:focus:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-400 font-sans",
          className
        )}
        {...props}
      />
    </motion.div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

const Login = () => {
  const [mode, setMode] = useState("signup"); // "signup" | "login"
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    password: ""
  });

  const { registerUser, loginUser, googleLogin, theme } = useContext(AppContext);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [id]: value };
      if (id === 'firstName' || id === 'lastName') {
        next.name = `${next.firstName} ${next.lastName}`.trim();
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "signup") {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    } else {
      await loginUser({
        email: formData.email,
        password: formData.password,
      });
    }
  };

  const isNight = theme === "night";

  return (
    <div className={`min-h-screen w-full pt-10 pb-10 flex flex-col items-center justify-center font-inter transition-colors duration-500 overflow-y-auto
      ${isNight ? 'bg-[#000000]' : 'bg-[#f9fafb]'}`}
    >
      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-24 relative z-10">

        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-col justify-center items-center w-1/2 space-y-10"
        >
          <div className="relative group w-full flex justify-center py-10">
            <div className={`absolute inset-0 blur-[120px] rounded-full opacity-20 ${isNight ? 'bg-[#4ca6a3]' : 'bg-blue-200'}`} />
            <img
              src={assets.undraw_doctors_djoj}
              alt="doctors"
              className="w-full max-w-lg h-auto relative z-10 filter drop-shadow-[0_25px_25px_rgba(0,0,0,0.1)]"
            />
          </div>
        </motion.div>

        {/* Right Section: Form */}
        <div className="w-full sm:w-[540px] lg:w-[480px] flex items-center justify-center px-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full p-6 sm:p-10 border rounded-[40px] relative overflow-hidden transition-all duration-500
              ${isNight
                ? 'bg-[#060606] border-white/5 shadow-[0_32px_120px_-15px_rgba(0,0,0,1)]'
                : 'bg-white border-slate-100 shadow-[0_32px_120px_-15px_rgba(0,0,0,0.08)]'}`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4ca6a3]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

            <div className="relative z-10">
              <h2 className={`text-3xl font-black tracking-tight mb-2 ${isNight ? 'text-white' : 'text-slate-900'}`}>
                {mode === "signup" ? "Get Started" : "Welcome Back"}
              </h2>
              <p className={`text-sm mb-10 font-medium ${isNight ? 'text-zinc-500' : 'text-slate-400'}`}>
                Enter your credentials to access the portal.
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {mode === "signup" && (
                    <motion.div
                      key="names"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <LabelInputContainer>
                        <label className={`text-[10px] uppercase tracking-[0.2em] font-black ml-1 mb-1 ${isNight ? 'text-zinc-500' : 'text-slate-400'}`} htmlFor="firstName">First name</label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <label className={`text-[10px] uppercase tracking-[0.2em] font-black ml-1 mb-1 ${isNight ? 'text-zinc-500' : 'text-slate-400'}`} htmlFor="lastName">Last name</label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                      </LabelInputContainer>
                    </motion.div>
                  )}
                </AnimatePresence>

                <LabelInputContainer>
                  <label className={`text-[10px] uppercase tracking-[0.2em] font-black ml-1 mb-1 ${isNight ? 'text-zinc-500' : 'text-slate-400'}`} htmlFor="email">Email address</label>
                  <Input
                    id="email"
                    placeholder="name@institute.com"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <label className={`text-[10px] uppercase tracking-[0.2em] font-black ml-1 mb-1 ${isNight ? 'text-zinc-500' : 'text-slate-400'}`} htmlFor="password">Security password</label>
                  <Input
                    id="password"
                    placeholder="••••••••••••"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </LabelInputContainer>

                <button
                  className={`w-full py-4 rounded-3xl text-sm font-black uppercase tracking-widest transition-all duration-300 active:scale-[0.98] mt-6
                    ${isNight
                      ? 'bg-white text-black hover:bg-zinc-200 shadow-xl'
                      : 'bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-200'}`}
                  type="submit"
                >
                  {mode === "signup" ? "Initialize Account" : "Open Console"} &rarr;
                </button>

                <div className="relative py-6 flex items-center">
                  <div className={`flex-grow h-px ${isNight ? 'bg-white/5' : 'bg-slate-100'}`} />
                  <span className={`px-4 text-[10px] uppercase tracking-widest font-bold ${isNight ? 'text-zinc-700' : 'text-slate-300'}`}>Third-Party Secure Link</span>
                  <div className={`flex-grow h-px ${isNight ? 'bg-white/5' : 'bg-slate-100'}`} />
                </div>

                <div className="flex justify-center">
                  <div className="scale-90 opacity-90 hover:opacity-100 transition-opacity">
                    <GoogleLogin
                      onSuccess={(credentialResponse) => googleLogin(credentialResponse.credential)}
                      onError={() => console.log("Google Auth Failed")}
                      shape="circle"
                      text="continue_with"
                      theme={isNight ? "filled_black" : "outline"}
                    />
                  </div>
                </div>

                <div className="text-center pt-6">
                  <p className={`text-xs font-medium ${isNight ? 'text-zinc-500' : 'text-slate-500'}`}>
                    {mode === "signup" ? "Existing clinical member?" : "Need a clinical account?"}
                    <button
                      type="button"
                      onClick={() => setMode(mode === "signup" ? "login" : "signup")}
                      className={`ml-2 font-black uppercase tracking-widest border-b pb-0.5 transition-colors
                        ${isNight ? 'text-white border-white/20 hover:text-[#4ca6a3] hover:border-[#4ca6a3]/40' : 'text-slate-900 border-slate-200 hover:text-[#4ca6a3] hover:border-[#4ca6a3]/40'}`}
                    >
                      {mode === "signup" ? "Sign in" : "Sign up"}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Login;
