import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Terminal, Code2, Cpu, Globe } from "lucide-react";

export const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-[#0F0A0A] text-[#E8DCC4] overflow-hidden selection:bg-amber-900/50 selection:text-amber-100">
      
      {/* WARM AMBIENT GLOWS */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2420_1px,transparent_1px),linear-gradient(to_bottom,#2a2420_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center">
        
        {/* GOLDEN BADGE */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1F1915] border border-amber-900/30 text-xs font-bold text-amber-500 mb-8 backdrop-blur-md shadow-lg shadow-orange-900/20"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          Brewing New Challenges v2.0
        </motion.div>

        {/* HERO TITLE */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-[#FAF6F0]"
        >
          Code with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-400 to-amber-700 animate-gradient-x drop-shadow-[0_0_25px_rgba(245,158,11,0.2)]">
            Perfection
          </span>
        </motion.h1>

        {/* ACTION BUTTONS (Cream & Gold) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 mt-6"
        >
          <Link to="/problems" className="group relative px-8 py-4 bg-[#E8DCC4] text-[#2A2420] font-bold rounded-xl text-lg hover:bg-white transition-all shadow-[0_0_20px_-5px_rgba(217,119,6,0.3)] hover:scale-105">
            <span className="flex items-center gap-2">
              Start Solving <Terminal size={20} className="text-orange-900" />
            </span>
          </Link>

          <Link to="/activity" className="px-8 py-4 bg-[#1F1915] border border-white/10 text-[#E8DCC4] font-bold rounded-xl text-lg hover:border-amber-500/50 hover:text-amber-400 transition-all">
            View Activity
          </Link>
        </motion.div>

        {/* BENTO GRID FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left">
          <FeatureCard icon={<Code2 />} title="Rich Editor" desc="Monaco engine with a warm, eye-saving theme." delay={0.4} />
          <FeatureCard icon={<Cpu />} title="Fast Compile" desc="Milliseconds execution on our premium servers." delay={0.5} />
          <FeatureCard icon={<Globe />} title="Global Elite" desc="Join the ranks of the top developers worldwide." delay={0.6} />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="p-6 rounded-2xl bg-gradient-to-b from-[#1A1512] to-[#0F0A0A] border border-[#2A2420] hover:border-amber-900/50 group hover:-translate-y-1 transition-all duration-300"
  >
    <div className="h-12 w-12 rounded-lg bg-[#2A2420] flex items-center justify-center mb-4 text-amber-500 group-hover:text-amber-300 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-[#E8DCC4] group-hover:text-white">{title}</h3>
    <p className="text-[#8C8375] leading-relaxed">{desc}</p>
  </motion.div>
);