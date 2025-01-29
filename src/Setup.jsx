import { MdArrowForward, MdArrowBack, MdMenu, MdClose } from "react-icons/md";
import { motion } from "motion/react";
import logo from "./assets/tag-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Setup = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  const [income, setIncome] = useState("");
  const [name, setName] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState("€");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === "" || income.trim() === "") {
      setError("Please fill the empty fields");
      return;
    }
    if (!agree) {
      setError("You must agree to the terms to proceed.");
      return;
    }
    const updated = new Date().toISOString();

    const userData = {
      name: name || "User",
      income: parseFloat(income),
      currency: currency,
    };
    localStorage.setItem("lastUpdated", updated);
    localStorage.setItem("userData", JSON.stringify(userData));
    navigate("/tracker");
  };

  return (
    <div className="bg-wrapper relative min-h-screen">
      {/* Background Layer */}
      <div className="bg-setup absolute inset-0 blur"></div>

      {/* Content Layer */}
      <div className="relative text-black min-h-screen flex flex-col items-center justify-center">
        {/* Navbar */}
        <div className="k">
          <DefaultNavbar handleGoBack={handleGoBack} />
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.5 },
          }}
          className="text-center flex flex-col md:flex-row justify-between gap-2 items-center"
          style={{ color: "white" }}
        >
          <div className="flex flex-col items-center justify-start">
            {" "}
            <h1 className="text-3xl md:text-7xl font-medium mt-5 mb-5 md:px-40 px-5">
              Let's Get Started
            </h1>
            <p className="text-lg mb-8 text-[#dedede] px-5 md:px-0">
              To proceed we need some information about your finances
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            action=""
            className="flex flex-col items-start gap-4 "
          >
            <label className="block text-[#D2D2D2] ">Your Name :</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md bg-transparent p-2  w-full focus:outline-0"
              style={{ border: "1px solid #8CE163" }}
            />
            <label className="block text-[#D2D2D2]">Your Income:</label>
            <div className="flex items-center gap-4">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="p-2 border rounded-md bg-transparent text-gray-700 focus:outline-none"
                style={{
                  border: "1px solid #8CE163",
                  appearance: "none", // Remove default dropdown arrow
                }}
              >
                <option value="€">Euro (€)</option>
                <option value="$">Dollar ($)</option>
                <option value="£">Pound (£)</option>
              </select>
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#fff]">
                  {currency}
                </span>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="rounded-md bg-transparent p-2 pl-8 w-full focus:outline-0"
                  style={{
                    border: "1px solid #8CE163",
                    appearance: "none",
                    MozAppearance: "textfield",
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 ">
              <label>
                <input
                  type="checkbox"
                  class="input"
                  value={agree}
                  onChange={(e) => setAgree(e.target.value)}
                />
                <span class="custom-checkbox"></span>
              </label>
              <p className="text-xs font-light text-[#dedede]">
                Agree that this website will use Cookies for your finances
              </p>
            </div>
            <button
              type="submit"
              className="bg-button text-[#080809] w-full items-center justify-center flex"
            >
              Submit
            </button>
            {error && <p>{error}</p>}
          </form>
        </motion.div>
      </div>

      <div className="empty w-full h-24"></div>
    </div>
  );
};
function DefaultNavbar({ handleGoBack }) {
  return (
    <nav className="bg3 container absolute top-0 left-0 w-full items-center flex justify-between mx-auto px-14 py-6">
      <h1 className="text-xl font-semibold text-[#fbfbfb] flex items-center gap-1">
        Finly <img src={logo} alt="" />
      </h1>

      <button
        onClick={handleGoBack}
        className="flex items-center gap-2 rounded-xl -mr-6 hover:border-transparent bg-[#171717] text-[#d8dcd6] hover:bg-[#d8dcd6] hover:text-[#080809] transition-colors"
      >
        Go Back <MdArrowBack />
      </button>
    </nav>
  );
}

export default Setup;
