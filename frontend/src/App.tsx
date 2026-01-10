import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ProblemSet } from "./pages/ProblemSet";
import { HomePage } from "./pages/HomePage";
import { AuthPage } from "./pages/AuthPage";
import { ActivityPage } from "./pages/ActivityPage";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    document.body.style.backgroundColor = isHome ? "#000000" : "#0F0A0A";
  }, [isHome]);

  return (
    <div className={`min-h-screen text-white selection:bg-orange-500/30 relative
      ${isHome ? "bg-black" : "bg-[#0F0A0A]"} 
      ${!isHome && !isAuthPage ? "pt-16" : ""} 
    `}>
      {/* --- NEW: Math Grid Background --- */}
      {/* We hide it on Home Page if you want that to remain pure black, otherwise remove '!isHome' */}
      {!isHome && (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* The Grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-100" />
            
            {/* Optional: Radial Fade (Vignette) so the grid fades out at edges */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F0A0A]/0 via-[#0F0A0A]/0 to-[#0F0A0A]" />
        </div>
      )}

      {/* Navbar (z-50 to stay above grid) */}
      {!isAuthPage && <Navbar />}
      
      {/* Content (z-10 to stay above grid) */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/problems" element={<ProblemSet />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/contests" element={<div className="p-20 text-center">Contests Page (Coming Soon)</div>} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;