import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  MapPin,
  Trophy,
  Star,
  CheckCircle2,
  Eye,
  MessageSquare,
  Award,
  Github,
  Linkedin,
  Edit2,
  Calendar,
} from "lucide-react";

// --- TYPES ---
interface ProfileData {
  user: { username: string; email: string };
  solvedStats: { easy: number; medium: number; hard: number; total: number };
  totalProblemsStats: { easy: number; medium: number; hard: number };
  languageStats: { language: string; _count: number }[];
  heatmap: Record<string, number>;
  totalSubmissions: number;
  realRank: number;     // <--- Calculated in backend
  totalUsers: number;   // <--- Count from backend
}

export const ActivityPage = () => {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make sure your backend endpoint is correct (e.g. /api/users/profile)
    axios.get("http://localhost:4444/api/users/profile",{ 
        withCredentials: true // <--- THIS IS REQUIRED TO SEND COOKIES
    })
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#8C8375]">Loading Profile...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center text-rose-500">Failed to load profile</div>;

  return (
    <div className="min-h-screen text-[#E8DCC4] p-6 pt-32 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-amber-900/10 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-orange-950/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-3 space-y-6">
          <ProfileCard user={data.user} rank={data.realRank} />
          <CommunityStats solutions={data.solvedStats.total} />
          <LanguagesCard languages={data.languageStats} />
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="lg:col-span-9 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContestRatingCard rating={1450} />
            {/* UPDATED: Passing real rank and total users */}
            <GlobalRankingCard rank={data.realRank} totalUsers={data.totalUsers} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <SolvedProblemsCard solved={data.solvedStats} total={data.totalProblemsStats} />
            </div>
            <div className="md:col-span-1">
              <BadgesCard />
              <BadgesCard />
            </div>
          </div>

          <SubmissionHeatmap heatmap={data.heatmap} totalSubmissions={data.totalSubmissions} />
        </div>
      </div>
    </div>
  );
};

/* --- 1. PROFILE CARD --- */
const ProfileCard = ({ user, rank }: { user: any, rank: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-[#161210] border border-[#2A2420] rounded-2xl p-6 shadow-xl"
  >
    <div className="flex flex-col items-start">
      <div className="relative mb-4">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
          alt="Avatar"
          className="w-24 h-24 rounded-2xl border-4 border-[#2A2420] bg-[#1A1512]"
        />
        <div className="absolute -bottom-2 -right-2 bg-emerald-900/80 border border-emerald-500/20 p-1.5 rounded-lg backdrop-blur-md">
          <span className="text-[10px] font-bold text-emerald-400">ONLINE</span>
          <span className="text-[10px] font-bold text-emerald-400">ONLINE</span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white capitalize">{user.username}</h2>
      <p className="text-[#8C8375] text-sm mb-4">@{user.username.toLowerCase()}</p>

      <button className="w-full py-2 bg-[#1A1512] border border-[#2A2420] hover:border-amber-600/50 text-[#E8DCC4] text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2 group">
        <Edit2 size={14} className="group-hover:text-amber-500" />
        Edit Profile
      </button>

      <div className="mt-6 space-y-3 w-full">
        <div className="flex items-center gap-3 text-sm text-[#8C8375]">
          <MapPin size={16} /> India
        </div>
        <div className="flex items-center gap-3 text-sm text-[#8C8375]">
          <Trophy size={16} className="text-amber-600" /> Rank {rank.toLocaleString()}
        </div>
        <div className="flex items-center gap-3 text-sm text-[#8C8375]">
          <Github size={16} /> {user.username}
        </div>
      </div>
    </div>
  </motion.div>
);

/* --- 2. COMMUNITY STATS --- */
const CommunityStats = ({ solutions }: { solutions: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-[#161210] border border-[#2A2420] rounded-2xl p-6"
  >
    <h3 className="text-sm font-bold text-[#E8DCC4] uppercase tracking-wider mb-4">
      Community Stats
    </h3>
    <div className="space-y-4">
      <StatRow icon={<Eye size={16} className="text-blue-400" />} label="Views" value="0" />
      <StatRow icon={<CheckCircle2 size={16} className="text-emerald-400" />} label="Solutions" value={solutions.toString()} />
      <StatRow icon={<MessageSquare size={16} className="text-amber-400" />} label="Discuss" value="0" />
      <StatRow icon={<Star size={16} className="text-yellow-400" />} label="Reputation" value="0" />
    </div>
  </motion.div>
);

const StatRow = ({ icon, label, value }: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3 text-sm text-[#8C8375]">
      {icon} {label}
    </div>
    <span className="font-mono font-bold text-[#E8DCC4]">{value}</span>
  </div>
);

/* --- 3. LANGUAGES --- */
const LanguagesCard = ({ languages }: { languages: any[] }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-[#161210] border border-[#2A2420] rounded-2xl p-6"
  >
    <h3 className="text-sm font-bold text-[#E8DCC4] uppercase tracking-wider mb-4">
      Languages
    </h3>
    <div className="flex flex-wrap gap-2">
      {languages.length === 0 ? <span className="text-xs text-[#5C544E]">No submissions yet</span> : 
      languages.map((lang) => (
        <span
          key={lang.language}
          className="px-3 py-1 bg-[#1A1512] border border-[#2A2420] rounded-full text-xs text-[#8C8375] capitalize"
        >
          {lang.language} ({lang._count})
        </span>
      ))}
    </div>
  </motion.div>
);

/* --- 4. CONTEST RATING --- */
const ContestRatingCard = ({ rating }: { rating: number }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-[#161210] border border-[#2A2420] rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
         <div>
           <p className="text-[#8C8375] text-xs font-bold uppercase">Contest Rating</p>
           <h2 className="text-3xl font-bold text-white mt-1">{rating}</h2>
           <p className="text-emerald-500 text-xs mt-1 font-medium">Top 28.78%</p>
         </div>
         <div className="p-2 bg-[#1A1512] rounded-lg border border-[#2A2420]">
            <Trophy size={20} className="text-amber-500" />
         </div>
      </div>
      
      {/* SVG Graph Mock */}
      <div className="h-24 w-full flex items-end">
         <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M0,80 C50,80 80,60 120,65 C160,70 200,40 240,45 C270,50 280,20 300,10" fill="url(#chartGradient)" stroke="none" />
            <path d="M0,80 C50,80 80,60 120,65 C160,70 200,40 240,45 C270,50 280,20 300,10" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <circle cx="300" cy="10" r="4" fill="#F59E0B" />
         </svg>
      </div>
    </motion.div>
  );

/* --- 5. GLOBAL RANKING (UPDATED) --- */
const GlobalRankingCard = ({ rank, totalUsers }: { rank: number, totalUsers: number }) => (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-[#161210] border border-[#2A2420] rounded-2xl p-6"
  >
    <p className="text-[#8C8375] text-xs font-bold uppercase">Global Ranking</p>
    <h2 className="text-3xl font-bold text-white mt-1">
      {rank}
      <span className="text-[#5C544E] text-base font-normal"> / {totalUsers}</span>
    </h2>

    <div className="mt-8 flex items-end gap-1 h-24">
      {[20, 35, 25, 45, 30, 60, 40, 70, 50, 80, 45, 30].map((h, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-sm ${
            i === 9 ? "bg-amber-500" : "bg-[#2A2420]"
          }`}
          style={{ height: `${h}%` }}
        ></div>
      ))}
    </div>
  </motion.div>
);

/* --- 6. SOLVED PROBLEMS DONUT --- */
const SolvedProblemsCard = ({ solved, total }: { solved: any, total: any }) => (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-[#161210] border border-[#2A2420] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-8"
  >
    {/* Donut Chart */}
    <div className="relative w-32 h-32 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-[#1A1512]"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
         <path className="text-emerald-500" strokeDasharray={`${(solved.easy/total.easy || 0) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{solved.total}</span>
        <span className="text-[10px] text-[#8C8375] uppercase">Solved</span>
      </div>
    </div>

    {/* Legend */}
    <div className="flex-1 w-full space-y-3">
      <DifficultyRow
        label="Easy"
        count={solved.easy}
        total={total.easy || 1}
        color="text-emerald-500"
        bg="bg-emerald-500"
      />
      <DifficultyRow
        label="Medium"
        count={solved.medium}
        total={total.medium || 1}
        color="text-amber-500"
        bg="bg-amber-500"
      />
      <DifficultyRow
        label="Hard"
        count={solved.hard}
        total={total.hard || 1}
        color="text-rose-500"
        bg="bg-rose-500"
      />
    </div>
  </motion.div>
);

const DifficultyRow = ({ label, count, total, color, bg }: any) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-xs font-medium">
      <span className="text-[#8C8375] w-12">{label}</span>
      <span className="text-white"><span className={color}>{count}</span><span className="text-[#4A4440]">/{total}</span></span>
    </div>
    <div className="w-full h-1.5 bg-[#1A1512] rounded-full overflow-hidden">
      <div className={`h-full ${bg} rounded-full`} style={{ width: `${(count / total) * 100}%` }}></div>
    </div>
  </div>
);

/* --- 7. BADGES --- */
const BadgesCard = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="bg-[#161210] border border-[#2A2420] rounded-2xl p-6"
    >
       <div className="flex justify-between items-center mb-6">
         <h3 className="text-sm font-bold text-[#E8DCC4] uppercase">Badges</h3>
         <span className="text-2xl font-bold text-white">1</span>
       </div>
       <div className="grid grid-cols-3 gap-4">
          <div className="aspect-square bg-[#1A1512] border border-[#2A2420] rounded-xl flex items-center justify-center group cursor-pointer hover:border-amber-500/50 transition-colors">
                 <Award size={32} className="text-[#5C544E] group-hover:text-amber-500 transition-colors" />
             </div>
       </div>
       <p className="text-center text-xs text-[#8C8375] mt-4">Most Recent: Newbie Badge</p>
    </motion.div>
);

/* --- 8. SUBMISSION HEATMAP --- */
const SubmissionHeatmap = ({ heatmap, totalSubmissions }: { heatmap: any, totalSubmissions: number }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      className="bg-[#161210] border border-[#2A2420] rounded-2xl p-6 overflow-x-auto"
    >
       <div className="flex justify-between items-center mb-6 min-w-[600px]">
          <h3 className="text-sm font-bold text-[#E8DCC4] flex items-center gap-2">
             {totalSubmissions} submissions in the past year <Calendar size={14} className="text-[#8C8375]" />
          </h3>
          <div className="flex items-center gap-2 text-xs text-[#8C8375]">
             <span>Less</span>
             <div className="w-3 h-3 bg-[#1A1512] rounded-sm"></div>
             <div className="w-3 h-3 bg-amber-900/40 rounded-sm"></div>
             <div className="w-3 h-3 bg-amber-700 rounded-sm"></div>
             <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
             <span>More</span>
          </div>
       </div>
       
       {/* Heatmap Grid - Visual Approximation */}
       <div className="flex gap-1 min-w-[600px]">
          {[...Array(52)].map((_, weekIndex) => (
             <div key={weekIndex} className="flex flex-col gap-1">
                {[...Array(7)].map((_, dayIndex) => {
                   // Calculate approximate date for this cell (visual only for now)
                   // Real implementation requires mapping strict dates to grid cells
                   const intensity = Math.random() * (totalSubmissions > 0 ? 1 : 0); // Mock distribution
                   
                   let bgClass = "bg-[#1A1512]";
                   if (intensity > 0.8 && totalSubmissions > 5) bgClass = "bg-amber-500";
                   else if (intensity > 0.6 && totalSubmissions > 5) bgClass = "bg-amber-700";
                   else if (intensity > 0.4 && totalSubmissions > 5) bgClass = "bg-amber-900/40";
                   
                   return (
                      <div 
                        key={dayIndex} 
                        className={`w-3 h-3 rounded-sm ${bgClass} hover:ring-1 ring-white/20 transition-all`}
                        title="Submission count"
                      />
                   );
                })}
             </div>
          ))}
       </div>
    </motion.div>
);