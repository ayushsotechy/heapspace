import { useState } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Check, ArrowRight, Github } from "lucide-react";

// --- CONFIGURATION ---
const API_URL = "http://localhost:4444/api/auth"; 

export const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // --- Form State ---
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "", 
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
    setError(""); 
    setFormData({ username: "", email: "", password: "" }); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? `${API_URL}/login` : `${API_URL}/register`;
      
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };

      const { data } = await axios.post(endpoint, payload, {
        withCredentials: true,
      });
      
      console.log("Auth Response:", data);
      
      localStorage.setItem("token", data.token);
      
      if (data.username) {
        localStorage.setItem("user", JSON.stringify({ username: data.username }));
      }
      
      navigate("/problems");

    } catch (err: any) {
      console.error("Auth Error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4444/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none brightness-100 contrast-150"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-900/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="relative w-full max-w-[420px] z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#E8DCC4] mb-2 drop-shadow-sm">
              {isLogin ? "Welcome Back" : "Join the Brew"}
            </h1>
            <p className="text-[#8C8375] text-sm font-medium">
              {isLogin ? "Ready to solve some problems?" : "Start your daily algorithm journey."}
            </p>
          </motion.div>

          {/* Toggle Switch */}
          <div className="mt-8 relative p-1.5 bg-[#161210] border border-[#2A2420] rounded-full inline-flex items-center w-64 shadow-inner">
            <motion.div
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#2A2420] border border-[#3E3630] rounded-full shadow-lg"
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              animate={{ x: isLogin ? "100%" : "0%" }}
            />
            <button onClick={() => setIsLogin(false)} className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${!isLogin ? "text-[#E8DCC4]" : "text-[#5C544E] hover:text-[#8C8375]"}`}>Sign Up</button>
            <button onClick={() => setIsLogin(true)} className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isLogin ? "text-[#E8DCC4]" : "text-[#5C544E] hover:text-[#8C8375]"}`}>Log In</button>
          </div>
        </div>

        {/* Main Card */}
        <motion.div layout className="bg-[#161210]/60 backdrop-blur-xl border border-[#2A2420] p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none"></div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 bg-[#0C0908] border border-[#2A2420] hover:border-[#3E3630] hover:bg-[#120E0D] text-[#8C8375] hover:text-[#E8DCC4] text-sm font-medium py-2.5 rounded-xl transition-all duration-200">
                  <span className="opacity-80"><GoogleIcon /></span>
                  <span>Google</span>
                </button>
                <SocialButton icon={<Github size={18} />} label="Github" />
            </div>

            <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-x-0 h-px bg-[#2A2420]"></div>
                <span className="relative bg-[#161210] px-3 text-[10px] font-bold text-[#5C544E] uppercase tracking-widest border border-[#2A2420] rounded-full">Or Continue With</span>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0, mb: 0 }} animate={{ opacity: 1, height: "auto", mb: 16 }} exit={{ opacity: 0, height: 0, mb: 0 }} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 overflow-hidden">
                  <p className="text-red-400 text-xs text-center font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                <motion.form
                    key={isLogin ? "login" : "signup"}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                    onSubmit={handleSubmit}
                >
                    {!isLogin && (
                        <InputField 
                            icon={User} 
                            type="text" 
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required={!isLogin}
                        />
                    )}
                    <InputField 
                        icon={Mail} 
                        type="email" 
                        name="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    
                    <div className="relative">
                        <InputField 
                            icon={Lock} 
                            type={showPassword ? "text" : "password"} 
                            name="password"
                            placeholder="Password" 
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[14px] text-[#5C544E] hover:text-[#E8DCC4] transition-colors focus:outline-none">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {!isLogin && (
                        <div className="flex items-start pt-1">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center w-5 h-5 bg-[#0C0908] border border-[#2A2420] rounded-[6px] group-hover:border-amber-600/50 transition-all">
                                    <input type="checkbox" className="peer sr-only" required />
                                    <Check size={12} className="text-amber-500 opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all" />
                                </div>
                                <span className="text-xs text-[#8C8375] group-hover:text-[#A89F91] transition-colors">
                                    I agree to the <span className="text-amber-600/80 hover:text-amber-500 hover:underline">Terms</span> & <span className="text-amber-600/80 hover:text-amber-500 hover:underline">Privacy</span>.
                                </span>
                            </label>
                        </div>
                    )}

                    {isLogin && (
                        <div className="flex justify-end -mt-1">
                            <a href="#" className="text-xs font-medium text-[#8C8375] hover:text-amber-500 transition-colors">Forgot Password?</a>
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-600 hover:to-orange-600 text-[#E8DCC4] font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-orange-900/20 transition-all flex items-center justify-center gap-2 group mt-6 disabled:opacity-70 disabled:grayscale"
                    >
                        {loading ? (
                          <span className="flex items-center gap-2">Brewing... <span className="animate-spin">⏳</span></span>
                        ) : (
                          <>
                            {isLogin ? "Sign In" : "Create Account"}
                            <ArrowRight size={18} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                    </motion.button>
                </motion.form>
            </AnimatePresence>

            <p className="text-center text-xs text-[#5C544E] mt-8 font-medium">
                {isLogin ? "New here? " : "Already a member? "}
                <button onClick={toggleMode} className="text-[#E8DCC4] hover:text-amber-500 hover:underline transition-colors ml-1">
                    {isLogin ? "Create an account" : "Sign in now"}
                </button>
            </p>
        </motion.div>
      </div>
    </div>
  );
};

// --- Components ---

const InputField = ({ icon: Icon, ...props }: any) => {
    return (
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#5C544E] group-focus-within:text-amber-500/80 transition-colors z-10">
                <Icon size={18} strokeWidth={2} />
            </div>
            <input
                {...props}
                className="w-full bg-[#0C0908] border border-[#2A2420] text-[#E8DCC4] text-sm rounded-xl py-3.5 pl-11 pr-10 
                placeholder:text-[#4A4440] placeholder:font-medium
                
                
                outline-none focus:outline-none ring-0 focus:ring-0
                
                
                focus:border-amber-600 focus:bg-[#120E0D]
                
                hover:border-[#3E3630] transition-all duration-200"
            />
        </div>
    );
};

const SocialButton = ({ icon, label }: { icon: any, label: string }) => (
    <button className="flex items-center justify-center gap-2 bg-[#0C0908] border border-[#2A2420] hover:border-[#3E3630] hover:bg-[#120E0D] text-[#8C8375] hover:text-[#E8DCC4] text-sm font-medium py-2.5 rounded-xl transition-all duration-200">
        <span className="opacity-80">{icon}</span>
        <span>{label}</span>
    </button>
);

const GoogleIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);