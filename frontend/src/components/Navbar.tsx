import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Code2, Terminal, Trophy, Activity, LogOut} from "lucide-react";

export const Navbar = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // --- NEW: Auth State ---
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for logged-in user whenever the route changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };
  // -----------------------

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) setHidden(true);
    else setHidden(false);
    if (latest > 50) setScrolled(true);
    else setScrolled(false);
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: -100, opacity: 0 }}}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none"
      >
        <nav 
          className={`pointer-events-auto flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 ${
            scrolled 
              ? "bg-[#1a1512]/90 backdrop-blur-xl border border-orange-500/20 shadow-[0_4px_30px_-5px_rgba(217,119,6,0.2)] w-[65%]"
              : "bg-[#2A2420]/60 backdrop-blur-md border border-white/5 shadow-none w-[75%]"
          }`}
        >
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-800 text-white shadow-lg shadow-orange-900/40 group-hover:scale-105 transition-transform duration-300">
              <Code2 size={20} className="relative z-10" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#E8DCC4] group-hover:text-white transition-colors">
              Heap<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">Space</span>
            </span>
          </Link>

          {/* LINKS */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/problems" icon={<Terminal size={16} />} text="Problems" active={location.pathname === "/problems"} />
            <NavLink to="/activity" icon={<Activity size={16} />} text="Activity" active={location.pathname === "/activity"} />
            <NavLink to="/contests" icon={<Trophy size={16} />} text="Contests" active={location.pathname === "/contests"} />
          </div>

          {/* AUTH SECTION (Dynamic) */}
          <div className="flex items-center gap-4">
            {user ? (
              // --- LOGGED IN STATE ---
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[#E8DCC4] bg-[#1A1512] px-3 py-1.5 rounded-full border border-[#2A2420]">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-[10px] font-bold text-white">
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-xs font-medium max-w-[80px] truncate">{user.username}</span>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-full text-[#8C8375] hover:text-red-400 hover:bg-red-900/10 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              // --- LOGGED OUT STATE ---
              <div className="flex items-center gap-5">
                <Link to="/login" className="text-sm font-medium text-[#A89F91] hover:text-[#E8DCC4] transition-colors">Log In</Link>
                <Link to="/signup" className="relative group overflow-hidden rounded-full p-[1px]">
                  <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#78350F_0%,#F59E0B_50%,#78350F_100%)]" />
                  <div className="relative flex h-full w-full items-center justify-center rounded-full bg-[#120C0A] px-5 py-2 text-sm font-bold text-amber-500 backdrop-blur-3xl transition-all group-hover:text-amber-400">
                    Sign Up
                  </div>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </motion.div>
    </AnimatePresence>
  );
};

// Helper Component for Links
const NavLink = ({ to, icon, text, active }: { to: string; icon: any; text: string; active: boolean }) => (
  <Link to={to} className="relative px-4 py-2 rounded-lg group">
    {active && (
      <motion.span
        layoutId="navbar-indicator"
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/10"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <span className={`relative z-10 flex items-center gap-2 text-sm font-medium transition-colors ${active ? "text-amber-100" : "text-[#8C8375] group-hover:text-[#E8DCC4]"}`}>
      {icon} {text}
    </span>
  </Link>
);