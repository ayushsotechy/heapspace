import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  slug: string;
}

export const ProblemSet = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get("http://localhost:4444/api/problems");
        if (Array.isArray(response.data)) setProblems(response.data);
        else if (response.data.problems) setProblems(response.data.problems);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchProblems();
  }, []);

  // Memoized Filtering
  const filteredProblems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return problems;

    return problems.filter((problem) => {
      const matchesTitle = problem.title.toLowerCase().includes(query);
      const matchesId = problem.id.toString().includes(query);
      return matchesTitle || matchesId;
    });
  }, [problems, searchQuery]);

  return (
    <div className="min-h-screen text-[#E8DCC4] px-6 md:px-10 pb-10 pt-48 relative overflow-hidden">
      <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0F0A0A] via-[#0F0A0A]/90 to-transparent z-40 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[400px] h-[600px] bg-orange-950/10 blur-[150px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-[#FAF6F0]">Problem Menu</h1>
            <p className="text-[#8C8375]">Select your daily brew of algorithms.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5C544E] group-focus-within:text-amber-500">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search challenges..."
                className="w-full bg-[#1A1512] border border-[#2A2420] rounded-xl py-3 pl-10 pr-4 text-sm text-[#E8DCC4] focus:outline-none focus:border-amber-500/40 focus:bg-[#221C18] transition-all placeholder:text-[#5C544E]"
              />
            </div>
            <button className="p-3 bg-[#1A1512] border border-[#2A2420] rounded-xl hover:border-amber-500/30 hover:text-amber-500 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="w-full">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-6 py-4 text-xs font-bold text-[#5C544E] uppercase tracking-widest border-b border-[#2A2420]">
            <div className="col-span-1">#</div>
            <div className="col-span-6">Title</div>
            <div className="col-span-3">Difficulty</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {loading ? (
            <div className="mt-8 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-[#1A1512] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              {/* --- FIX: Using AnimatePresence + layout instead of key re-renders --- */}
             <AnimatePresence mode="popLayout">
  {filteredProblems.map((problem) => ( // You don't even need 'index' anymore
    <motion.div
      layout
      key={problem.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/problems/${problem.slug}`)}
      className="group grid grid-cols-12 items-center p-5 rounded-xl border border-[#1F1915] bg-[#161210] hover:bg-[#1C1815] hover:border-amber-900/30 transition-all cursor-pointer shadow-sm hover:shadow-md"
    >
      {/* --- FIX: Changed {index + 1} to {problem.id} --- */}
      <div className="col-span-1 font-mono text-[#5C544E] group-hover:text-amber-600">
        {problem.id} 
      </div>
      
      <div className="col-span-6 font-medium text-lg text-[#D6CFC7] group-hover:text-white transition-colors">
        {problem.title}
      </div>
      <div className="col-span-3">
        <DifficultyBadge level={problem.difficulty} />
      </div>
      <div className="col-span-2 flex justify-end">
        <ArrowRight className="text-[#4A4440] group-hover:text-amber-500 group-hover:translate-x-1 transition-all" size={20} />
      </div>
    </motion.div>
  ))}
</AnimatePresence>
              
              {filteredProblems.length === 0 && (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   className="text-center py-10 text-[#5C544E]"
                 >
                   No problems found matching "{searchQuery}"
                 </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Badges
const DifficultyBadge = ({ level }: { level: string }) => {
  const styles = {
    Easy: "bg-emerald-900/10 text-emerald-400 border-emerald-900/20", 
    Medium: "bg-amber-900/10 text-amber-400 border-amber-900/20",   
    Hard: "bg-rose-950/10 text-rose-400 border-rose-900/20",         
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold border ${styles[level as keyof typeof styles] || styles.Easy}`}>
      {level}
    </span>
  );
};