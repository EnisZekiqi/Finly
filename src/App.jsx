import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";

import HeroSection from "./HeroSection";
import AllContent from "./AllContent";
import Setup from "./Setup";
import Tracker from "./Tracker";

function App() {
  const goBack = () => {
    navigate("/");
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 350);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 350);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
       <Router>
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/setup" element={<Setup />} />
          
          {/* Default Tracker Route */}
          <Route path="/tracker" element={<Navigate to="/tracker/dashboard" replace />} />
          
          {/* Tracker with Dynamic Section Handling */}
          <Route path="/tracker/:section" element={<Tracker />} />
        </Routes>
      </Router>

  );
}

const props = {
  name: "ustahi",
};

export default App;
