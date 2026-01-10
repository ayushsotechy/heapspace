import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ProblemSet } from "./pages/ProblemSet";
import { HomePage } from "./pages/HomePage";
import { AuthPage } from "./pages/AuthPage";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const isHome = location.pathname === "/";
  // 1. Check if we are on an Auth page
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    // Keep the background logic: Home is Black, everything else is Brown
    document.body.style.backgroundColor = isHome ? "#000000" : "#0F0A0A";
  }, [isHome]);

  return (
    <div className={`min-h-screen text-white selection:bg-blue-500/30 
      ${isHome ? "bg-black" : "bg-[#0F0A0A]"} 
      ${!isHome && !isAuthPage ? "pt-28" : ""} 
    `}>
      {/* 2. Only show Navbar if we are NOT on an Auth page */}
      {!isAuthPage && <Navbar />}
      
      {children}
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
          <Route path="/activity" element={<div className="p-20 text-center">Activity Page (Coming Soon)</div>} />
          <Route path="/contests" element={<div className="p-20 text-center">Contests Page (Coming Soon)</div>} />
          
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;