import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Product from "./Product";
import Home from "./Home";
import HeroSection from "./HeroSection";
import AllContent from "./AllContent";

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
        <Route path="/product" element={<Product goBack={goBack} />} />
      </Routes>
    </Router>
  );
}

const props = {
  name: "ustahi",
};

export default App;
