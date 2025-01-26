import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HeroSection from "./HeroSection";
import AllContent from "./AllContent";
import Setup from "./Setup";
import Tracker from "./Tracker";

function App() {
  const goBack = () => {
    navigate("/");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <HeroSection />
              <AllContent />
            </div>
          }
        />
        <Route path="/setup" element={<Setup />} />
        <Route path="/tracker" element={<Tracker />} />
      </Routes>
    </Router>
  );
}

const props = {
  name: "ustahi",
};

export default App;
