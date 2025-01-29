import { AnimatePresence, motion } from "motion/react";
import { useState, useCallback, useEffect } from "react";
import hero from "./images/heroWallpaper.jpg";
import { MdArrowForward, MdPlayArrow, MdMenu, MdClose } from "react-icons/md";
import avatar1 from "./images/images 5.jpg";
import avatar2 from "./images/images 9.jpg";
import avatar3 from "./images/images 12.jpg";
import Avatar from "@mui/material/Avatar";
import logo from "./assets/tag-svgrepo-com.svg";
import { useNavigate, useNavigationType } from "react-router-dom";
const HeroSection = () => {
  const [drawer, setDrawer] = useState(false);

  const handleClick = useCallback(() => setDrawer(true));
  const handleClose = useCallback(() => setDrawer(false));

  const drawerAnimation = {
    open: {
      y: 0, // Drawer slides down
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      y: "-100%", // Drawer slides up
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const parentAnimation = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      staggerChildren: 0.3, // Staggered animation for children
      transition: { duration: 0.5 },
    },
  };

  const childAnimation = {
    initial: { opacity: 0, x: -10 },
    animate: {
      opacity: 1,
      x: 0,
      staggerChildren: 0.3,
      transition: { duration: 0.3 },
    },
  };

  const navigate = useNavigate();

  const handleGetStarted = () => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      navigate("/tracker");
      setChangeName(true);
    } else {
      navigate("/setup");
      setChangeName(false);
    }
  };

  const [changeName, setChangeName] = useState(true); /// change the button text when the setup is complete

  return (
    <div className="bg-wrapper relative min-h-screen">
      {/* Background Layer */}
      <div className="bg absolute inset-0 blur"></div>

      {/* Content Layer */}
      <div className="relative text-black min-h-screen flex flex-col items-center justify-center">
        {/* Navbar */}
        <div className="hidden md:block">
          <DefaultNavbar />
        </div>
        <div className="block md:hidden">
          <NavbarResponsive logo={logo} handleClick={handleClick} />
          <AnimatePresence>
            {drawer && (
              <motion.div
                initial="closed"
                animate={drawer ? "open" : "closed"}
                exit={{
                  y: "-100%",
                  opacity: 0,
                  transition: { type: "spring", stiffness: 300, damping: 30 },
                }}
                variants={drawerAnimation}
                className="absolute top-[0px] left-0 w-full bg-[#191b18] shadow-lg "
                style={{ zIndex: 1000 }}
              >
                <div className="flex justify-between container items-center px-6 pt-6">
                  <h1 className="flex items-center gap-1 text-xl font-semibold text-[#fbfbfb]">
                    Finly
                    <img src={logo} alt="" />
                  </h1>
                  <button
                    onClick={handleClose}
                    className="bg-transparent hover:border-transparent -mr-10"
                  >
                    <MdClose
                      style={{
                        width: "30px",
                        height: "30px",
                        color: "#fbfbfb",
                      }}
                    />
                  </button>
                </div>
                <motion.ul
                  variants={parentAnimation}
                  initial="initial"
                  whileInView="animate"
                  className="flex flex-col items-center gap-7 pt-2"
                >
                  <li>
                    <motion.a
                      variants={childAnimation}
                      initial="initial"
                      whileInView="animate"
                      href="#features"
                      className="text-[#d8dcd6] hover:text-[#8de163] font-semibold text-xl"
                    >
                      Features
                    </motion.a>
                  </li>
                  <li>
                    <motion.a
                      variants={childAnimation}
                      initial="initial"
                      whileInView="animate"
                      href="#services"
                      className="text-[#d8dcd6] hover:text-[#8de163] font-semibold text-xl"
                    >
                      Services
                    </motion.a>
                  </li>
                  <li>
                    <motion.a
                      variants={childAnimation}
                      initial="initial"
                      whileInView="animate"
                      href="#review"
                      className="text-[#d8dcd6] hover:text-[#8de163] font-semibold text-xl"
                    >
                      Reviews
                    </motion.a>
                  </li>
                  <li>
                    <motion.a
                      variants={childAnimation}
                      initial="initial"
                      whileInView="animate"
                      href="#contact"
                      className="text-[#d8dcd6] hover:text-[#8de163] font-semibold text-xl"
                    >
                      FAQ
                    </motion.a>
                  </li>
                </motion.ul>
                <div className="w-full flex items-center justify-center mt-2 mb-3">
                  <button className="flex items-center gap-2 rounded-xl -mr-6 bg-[#171717] text-[#d8dcd6] hover:bg-[#d8dcd6] hover:text-[#080809] transition-colors border border-[#8CE163]">
                    Get Started <MdArrowForward />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.5 },
          }}
          className="text-center flex flex-col gap-2"
          style={{ color: "white" }}
        >
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <Avatar
                alt="Remy Sharp"
                src={avatar1}
                sx={{ border: "2px solid #fbfbfb" }}
              />
              <Avatar
                alt="Remy Sharp"
                src={avatar2}
                sx={{ border: "2px solid #fbfbfb", marginLeft: "-15px" }}
              />
              <Avatar
                alt="Remy Sharp"
                src={avatar3}
                sx={{ border: "2px solid #fbfbfb", marginLeft: "-15px" }}
              />
              <p>
                {" "}
                <b className="text-[#c6f268] ml-3">900</b> Reviews
              </p>
            </div>
          </div>
          <h1 className="text-3xl md:text-7xl font-medium mt-5 mb-5 md:px-40 px-5">
            Take Control of Your Finances with Finly
          </h1>
          <p className="text-lg mb-8 text-[#dedede] px-5 md:px-0">
            Simplify and check your financial goals with our easy to use
            tracker.
          </p>
          <div className="flex-col sm:flex-row flex gap-5 justify-center items-center w-full">
            <motion.button
              initial={{}}
              whileHover={{}}
              onClick={handleGetStarted}
              className="bg-button text-[#080809] px-6 py-1.5 flex items-center gap-2 rounded-xl  font-semibold "
            >
              {changeName === true ? <p>Check Finances</p> : <p>Get Started</p>}
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MdArrowForward style={{ widht: "30px", height: "30px" }} />
              </motion.div>
            </motion.button>
            <button className="bg-transparent flex flex-row-reverse hover:border-transparent items-center gap-2  px-6 py-1.5 rounded-lg  ">
              <a
                href="#features"
                className="font-medium text-[#fff] hover:text-[#fff]"
              >
                Learn More{" "}
              </a>
              <div
                className="bg-[#31482A] p-2.5 rounded-full"
                style={{ border: "1px solid #426534" }}
              >
                <MdPlayArrow style={{ color: "#8DE163" }} />
              </div>
            </button>
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: 0.2 },
        }}
        viewport={{ once: true }}
        className="flex w-full justify-center px-2.5"
      >
        <img
          className="finlty"
          src="https://res.cloudinary.com/datm8nslc/image/upload/v1737144939/finlys_csxi5b.png"
          alt=""
          style={{ objectFit: "contain" }}
        />
      </motion.div>
      <div className="empty w-full h-56"></div>
    </div>
  );
};

export default HeroSection;

function DefaultNavbar({}) {
  return (
    <nav className="bg3 container absolute top-0 left-0 w-full items-center flex justify-between mx-auto px-14 py-6">
      <h1 className="text-xl font-semibold text-[#fbfbfb] flex items-center gap-1">
        Finly <img src={logo} alt="" />
      </h1>
      <ul className="flex gap-7">
        <li>
          <a
            href="#features"
            className="text-[#d8dcd6] hover:text-[#8de163] font-normal"
          >
            Features
          </a>
        </li>
        <li>
          <a
            href="#services "
            className="text-[#d8dcd6] hover:text-[#8de163] font-normal"
          >
            Services
          </a>
        </li>
        <li>
          <a
            href="#review"
            className="text-[#d8dcd6] hover:text-[#8de163] font-normal"
          >
            Reviews
          </a>
        </li>
        <li>
          <a
            href="#contact"
            className="text-[#d8dcd6] hover:text-[#8de163] font-normal"
          >
            FAQ
          </a>
        </li>
      </ul>
      <button className="flex items-center gap-2 rounded-xl -mr-6 hover:border-transparent bg-[#171717] text-[#d8dcd6] hover:bg-[#d8dcd6] hover:text-[#080809] transition-colors">
        Get Started <MdArrowForward />
      </button>
    </nav>
  );
}

function NavbarResponsive({ logo, handleClick }) {
  return (
    <nav className="bg3 container absolute top-0 left-0 w-full items-center flex justify-between mx-auto px-5 py-6">
      <h1 className="text-xl font-semibold text-[#fbfbfb] flex items-center gap-1">
        Finly
        <img src={logo} alt="" />
      </h1>

      <button
        onClick={handleClick}
        className="bg-transparent hover:border-transparent -mr-5"
      >
        <MdMenu
          style={{
            width: "30px",
            height: "30px",
            color: "#fbfbfb",
          }}
        />
      </button>
    </nav>
  );
}
