import {
  MdBarChart,
  MdOutlineInsertDriveFile,
  MdOutlineStarOutline,
  MdOutlineClose,
  MdArrowForward,
  MdPeopleOutline,
  MdAttachMoney,
  MdOutlineShoppingBag,
  MdMailOutline,
  MdPlayArrow,
  MdOutlinePhone,
  MdOutlineLocationOn,
} from "react-icons/md";
import { motion } from "motion/react";
import { useState, useCallback, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import avatar1 from "./images/images 5.jpg";
import avatar2 from "./images/images 9.jpg";
import avatar3 from "./images/images 12.jpg";
import { useInView } from "motion/react";
import logo from "./assets/tag-svgrepo-com.svg";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
const AllContent = () => {
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between each child animation
      },
    },
  };
  const childVariants = {
    hidden: {
      opacity: 0,
      x: -50, // Start below
    },
    visible: {
      opacity: 1,
      x: 0, // Move into place
      transition: {
        type: "spring",
        stiffness: 50,
        delay: 0.5,
      },
    },
  };

  const [services, setServices] = useState("finance"); //// changes for the services
  const handleChangeServ = (serv) => {
    setServices(serv);
  };

  const [faq, setFaq] = useState("");
  const handleChangeFaq = (faq) => {
    setFaq(faq);
  };

  ///////////////////////////////
  const [clients, setClients] = useState(0);
  const [hasStarted, setHasStarted] = useState(false); //// the state for showing the numbers go up only in view

  useEffect(() => {
    if (!hasStarted) return;
    const interval = 50;
    const target = 79;

    const timer = setInterval(() => {
      setClients((prev) => {
        if (prev < target) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, interval);
    return () => clearInterval(timer);
  }, [hasStarted]);

  ///////////////////

  const [ad, setAd] = useState(0);

  useEffect(() => {
    if (!hasStarted) return;
    const interval = 70; // Interval in milliseconds
    const target = 25; // Target value

    const timer = setInterval(() => {
      setAd((prev) => {
        if (prev < target) {
          return prev + 1;
        } else {
          clearInterval(timer); // Stop the interval
          return prev;
        }
      });
    }, interval);

    // Cleanup function to clear the interval on component unmount
    return () => clearInterval(timer);
  }, [hasStarted]);

  ////////////////////////////

  const [rev, setRev] = useState(0);

  useEffect(() => {
    if (!hasStarted) return;
    const interval = 45; // Interval in milliseconds
    const target = 103; // Target value

    const timer = setInterval(() => {
      setRev((prev) => {
        if (prev < target) {
          return prev + 1;
        } else {
          clearInterval(timer); // Stop the interval
          return prev;
        }
      });
    }, interval);

    // Cleanup function to clear the interval on component unmount
    return () => clearInterval(timer);
  }, [hasStarted]);

  ////////////////////////

  const [av, setAv] = useState(0);

  useEffect(() => {
    if (!hasStarted) return;
    const interval = 100; // Interval in milliseconds
    const target = 13; // Target value

    const timer = setInterval(() => {
      setAv((prev) => {
        if (prev < target) {
          return prev + 1;
        } else {
          clearInterval(timer); // Stop the interval
          return prev;
        }
      });
    }, interval);

    // Cleanup function to clear the interval on component unmount
    return () => clearInterval(timer);
  }, [hasStarted]);

  return (
    <div className="bg-[#010101]">
      <Benefits
        containerVariants={containerVariants}
        childVariants={childVariants}
      />
      <div className="empty h-56"></div>
      <Services services={services} handleChangeServ={handleChangeServ} />

      <div className="empty h-56"></div>
      <GetStarted avatar1={avatar1} avatar2={avatar2} avatar3={avatar3} />
      <div className="empty h-56"></div>
      <Reviews
        setHasStarted={setHasStarted}
        hasStarted={hasStarted}
        clients={clients}
        ad={ad}
        rev={rev}
        av={av}
      />
      <div className="empty h-56"></div>
      <Features />
      <div className="empty h-56"></div>
      <FAQ faq={faq} handleChangeFaq={handleChangeFaq} />

      <div className="lastInfo relative min-h-screen">
        {/* Blurred Background */}
        <div
          className="bg2 inset-0 absolute blur"
          style={{ zIndex: 1000 }}
        ></div>

        {/* Content */}
        <div
          className="absolute inset-0 top-32 md:top-40 flex flex-col items-center justify-center"
          style={{ zIndex: 1002 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10 items-start pb-0 md:pb-6 px-10">
            {/* Finly Section */}
            <div className="flex flex-col items-center md:items-start  gap-4 mb-2">
              <h1 className="flex items-center text-center md:text-start gap-1 text-xl font-semibold text-[#fbfbfb]">
                Finly
                <img src={logo} alt="" />
              </h1>
              <p className="font-normal text-[#dedede] text-md text-center md:text-start ">
                Get a high-end conversion-focused website for your agency.
              </p>
            </div>

            {/* Pages Section */}
            <div className="flex flex-col gap-4 mb-2">
              <h1 className="font-semibold text-xl text-[#fff]">Pages</h1>
              <a
                href="#features"
                className="text-[#d8dcd6] hover:text-[#8de163] font-medium text-md transition-colors"
              >
                Features
              </a>
              <a
                href="#services"
                className="text-[#d8dcd6] hover:text-[#8de163] font-medium text-md transition-colors"
              >
                Services
              </a>
              <a
                href="#review"
                className="text-[#d8dcd6] hover:text-[#8de163] font-medium text-md transition-colors"
              >
                Review
              </a>
            </div>

            {/* Contact Section */}
            <div className="flex flex-col items-center gap-4">
              <h1 className="font-semibold text-xl text-[#fff]">Contact</h1>
              <p className="font-normal flex items-center gap-2 text-[#dedede] text-md text-start ">
                <MdMailOutline style={{ color: "#8de163" }} />{" "}
                enis_zekiqi@hotmail.com
              </p>
              <p className="font-normal flex items-center gap-2 text-[#dedede] text-md text-start ">
                <MdOutlinePhone style={{ color: "#8de163" }} /> +383 44 256 853
              </p>
              <p className="font-normal flex items-center gap-2 text-[#dedede] text-md text-start ">
                <MdOutlineLocationOn style={{ color: "#8de163" }} /> Faruk
                Beqiri , Vushtrri
              </p>
            </div>

            {/* Follow Section */}
            <div className="hidden md:flex flex-row md:flex-col items-center gap-4">
              <h1 className="font-semibold text-xl text-[#fff]">Follow</h1>
              <a
                href="https://www.instagram.com/eniszekiqi/"
                className="w-fit font-normal flex items-center bg-transparent hover:bg-[#8de163] transition-colors hover:text-[#000] gap-2 text-[#dedede] text-md text-start rounded-xl p-1.5"
                style={{ border: "1px solid #2B2C2B" }}
              >
                <FaInstagram /> Instagram
              </a>
              <a
                href="https://www.linkedin.com/in/enis-zekiqi-090b692b9/"
                className="w-fit font-normal flex items-center bg-transparent hover:bg-[#8de163] transition-colors hover:text-[#000] gap-2 text-[#dedede] text-md text-start rounded-xl p-1.5"
                style={{ border: "1px solid #2B2C2B" }}
              >
                <FaLinkedin /> LinkedIn
              </a>
              <a
                href="https://github.com/EnisZekiqi"
                className="w-fit font-normal flex items-center bg-transparent hover:bg-[#8de163] transition-colors hover:text-[#000] gap-2 text-[#dedede] text-md text-start rounded-xl p-1.5"
                style={{ border: "1px solid #2B2C2B" }}
              >
                <FaGithub /> GitHub
              </a>
            </div>
            <div className=" flex md:hidden justify-center flex-row md:flex-col items-center gap-4 w-full">
              <a
                href="https://www.instagram.com/eniszekiqi/"
                className="w-fit font-normal flex items-center bg-transparent hover:bg-[#8de163] transition-colors hover:text-[#000] gap-2 text-[#dedede] text-md text-start rounded-xl p-1.5"
                style={{ border: "1px solid #2B2C2B" }}
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/in/enis-zekiqi-090b692b9/"
                className="w-fit font-normal flex items-center bg-transparent hover:bg-[#8de163] transition-colors hover:text-[#000] gap-2 text-[#dedede] text-md text-start rounded-xl p-1.5"
                style={{ border: "1px solid #2B2C2B" }}
              >
                <FaLinkedin />
              </a>
              <a
                href="https://github.com/EnisZekiqi"
                className="w-fit font-normal flex items-center bg-transparent hover:bg-[#8de163] transition-colors hover:text-[#000] gap-2 text-[#dedede] text-md text-start rounded-xl p-1.5"
                style={{ border: "1px solid #2B2C2B" }}
              >
                <FaGithub />
              </a>
            </div>
          </div>
          <div className=" w-full px-10 opacity-0 md:opacity-30">
            <hr style={{ color: "1px solid #374531" }} />
          </div>
          <div className=" hidden md:flex justify-between items-center w-full text-md text-[#dedede] font-medium px-10 mt-10">
            <p>© Finly 2025. All rights reserved.</p>
            <p>Designed & Made by Enis Zekiqi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllContent;

function Benefits({ containerVariants, childVariants }) {
  return (
    <div className="benefits">
      <div className="container mx-auto px-10 flex flex-col justify-start items-start">
        <motion.h1
          initial={{
            opacity: 0,
            x: -100,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.5,
            },
          }}
          viewport={{
            once: true,
          }}
          className="text-[#D1D1D1] py-1.5 px-3 rounded-2xl text-base font-medium w-fit"
          style={{
            border: "1px solid #8CE163",
          }}
        >
          Benefits
        </motion.h1>
        <motion.h1
          initial={{
            opacity: 0,
            x: -100,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.5,
            },
          }}
          viewport={{
            once: true,
          }}
          className="font-medium text-2xl md:text-6xl text-[#fff] mt-4 mb-4"
        >
          Unlock Your Success
        </motion.h1>
        <motion.p
          initial={{
            opacity: 0,
            x: -100,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.5,
            },
          }}
          viewport={{
            once: true,
          }}
          className="text-lg font-normal text-[#dedede] w-full md:w-2/4 text-start"
        >
          Discover our features and understand what our purpouse is , after this
          you will get to know your finances
        </motion.p>
        <motion.div
          className="flex flex-col md:flex-row  w-full justify-center md:justify-between items-center mt-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" // Trigger animation when in view
          viewport={{
            once: true,
          }}
        >
          {/* First Item */}
          <motion.div
            className="flex flex-col items-start gap-3"
            variants={childVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
            }}
          >
            <div
              className="wrappericon bg-[#121214] rounded-lg p-1.5"
              style={{
                border: "1px solid #343839",
              }}
            >
              <MdBarChart
                style={{
                  color: "#8DE163",
                  width: "30px",
                  height: "30px",
                }}
              />
            </div>
            <h2 className="text-lg font-medium text-[#fff]">ROI Obsessed</h2>
            <p className="text-base font-normal text-[#dedede] w-full md:w-[60%] text-start">
              Our focus on ROI drives every decision we make, ensuring maximum
              value and impact for your investment.
            </p>
          </motion.div>

          {/* Second Item */}
          <motion.div
            className="flex flex-col items-start gap-3 mt-8 md:mt-0"
            variants={childVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
            }}
          >
            <div
              className="wrappericon bg-[#121214] rounded-lg p-1.5"
              style={{
                border: "1px solid #343839",
              }}
            >
              <MdOutlineInsertDriveFile
                style={{
                  color: "#8DE163",
                  width: "30px",
                  height: "30px",
                }}
              />
            </div>
            <h2 className="text-lg font-medium text-[#fff]">No Contracts</h2>
            <p className="text-base font-normal text-[#dedede]  w-full md:w-[60%] text-start">
              Our focus on ROI drives every decision we make, ensuring maximum
              value and impact for your investment.
            </p>
          </motion.div>

          {/* Third Item */}
          <motion.div
            className="flex flex-col items-start gap-3 mt-8 md:mt-0"
            variants={childVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
            }}
          >
            <div
              className="wrappericon bg-[#121214] rounded-lg p-1.5"
              style={{
                border: "1px solid #343839",
              }}
            >
              <MdOutlineStarOutline
                style={{
                  color: "#8DE163",
                  width: "30px",
                  height: "30px",
                }}
              />
            </div>
            <h2 className="text-lg font-medium text-[#fff]">Excellence</h2>
            <p className="text-base font-normal text-[#dedede] w-full md:w-[60%] text-start">
              Striving for excellence drives our every action. We deliver
              outstanding results, consistently exceeding expectations.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function Services({ services, handleChangeServ }) {
  return (
    <div id="services" className="services">
      <div className="container mx-auto px-10 flex flex-col-reverse md:flex-row justify-between items-center">
        <div className="flex flex-col">
          <motion.h1
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
              transition: {
                duration: 1,
              },
            }}
            viewport={{
              once: true,
            }}
            className="text-[#D1D1D1] py-1.5 px-3 rounded-2xl text-base font-medium w-fit mt-8 md:mt-0"
            style={{
              border: "1px solid #8CE163",
            }}
          >
            Services
          </motion.h1>
          <motion.h1
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
              transition: {
                duration: 1,
              },
            }}
            viewport={{
              once: true,
            }}
            className="font-medium text-2xl md:w-[60%] w-full md:text-6xl text-[#fff] text-start mt-4 mb-4"
          >
            Crafting Your Success Story
          </motion.h1>
          <motion.div
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
              transition: {
                duration: 1,
              },
            }}
            viewport={{
              once: true,
            }}
            className="llojet-services flex flex-col gap-4 items-start mt-12"
          >
            <div
              className="f w-full md:w-[85%] flex flex-col gap-2 pb-3"
              style={{
                borderBottom:
                  services === "finance"
                    ? "1px solid #8DE163"
                    : "1px solid #212122",
                transition: "all 0.5s ease",
              }}
            >
              <p
                onClick={() => handleChangeServ("finance")}
                className="text-xl cursor-pointer   mb-4 font-medium text-[#fff] hover:text-[#dedede] flex justify-between items-center transition-colors"
              >
                Track your Finances{" "}
                <MdOutlineClose
                  style={{
                    transform:
                      services === "finance" ? "none" : "rotate(135deg)",
                    transition: "all 0.5s ease",
                  }}
                />
              </p>
              <div
                className={`overflow-hidden transition-all duration-500 ${services === "finance" ? "max-h-[100px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                <p className="text-[#dedede] text-start font-normal text-lg">
                  Drive targeted visitors to your website with expertly managed
                  paid traffic campaigns.
                </p>
              </div>
            </div>
            <div
              className="flex flex-col gap-2 pb-3 w-full md:w-[85%]"
              style={{
                borderBottom:
                  services === "income"
                    ? "1px solid #8DE163"
                    : "1px solid #212122",
                transition: "all 0.5s ease",
              }}
            >
              <p
                onClick={() => handleChangeServ("income")}
                className="text-xl cursor-pointer  mb-4 font-medium text-[#fff] hover:text-[#dedede] flex justify-between items-center transition-colors"
              >
                Improve your Incomes{" "}
                <MdOutlineClose
                  style={{
                    transform:
                      services === "income" ? "none" : "rotate(135deg)",
                    transition: "all 0.5s ease",
                  }}
                />
              </p>
              <div
                className={`overflow-hidden transition-all duration-500 ${services === "income" ? "max-h-[100px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                <p className="text-[#dedede] text-start font-normal text-lg">
                  Drive targeted visitors to your website with expertly managed
                  paid traffic campaigns.
                </p>
              </div>
            </div>
            <div
              className="flex flex-col gap-2 pb-3 w-full md:w-[85%]"
              style={{
                borderBottom:
                  services === "detail"
                    ? "1px solid #8DE163"
                    : "1px solid #212122",
                transition: "all 0.5s ease",
              }}
            >
              <p
                onClick={() => handleChangeServ("detail")}
                className="text-xl cursor-pointer mb-4  font-medium text-[#fff] hover:text-[#dedede] flex justify-between items-center transition-colors"
              >
                Check every Detail{" "}
                <MdOutlineClose
                  style={{
                    transform:
                      services === "detail" ? "none" : "rotate(135deg)",
                    transition: "all 0.5s ease",
                  }}
                />
              </p>
              <div
                className={`overflow-hidden transition-all duration-500 ${services === "detail" ? "max-h-[100px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                <p className="text-[#dedede] text-start font-normal text-lg">
                  Drive targeted visitors to your website with expertly managed
                  paid traffic campaigns.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
            transition: {
              duration: 1,
            },
          }}
          viewport={{
            once: true,
          }}
          className="relative mb-6 md:mb-0"
        >
          <img
            src="https://framerusercontent.com/images/6l8u9RlHacqRAihVFjwOXXJhTtY.jpg"
            alt=""
            className="w-full rounded-2xl" // Ensures the first image spans the container width
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="https://framerusercontent.com/images/Fy5TbplnXJEOTdPWZZHKOdE4cE.svg"
              alt=""
              className="w-[85%] md:w-[90%]" // Adjust size as needed
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function GetStarted({ avatar1, avatar2, avatar3 }) {
  return (
    <div className="start">
      <div className="relative w-full flex items-center justify-center px-10 md:px-0">
        <img
          src="https://framerusercontent.com/images/lTBYcGtW0iVzGDyEeRAozHdZck.jpg"
          alt=""
          className=" w-full md:w-[80%] h-[90vh] md:h-fit rounded-2xl object-cover" // Ensures the first image spans the container width
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.h1
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
              transition: {
                duration: 0.5,
              },
            }}
            viewport={{
              once: true,
            }}
            className="text-[#D1D1D1] py-1.5 px-3 rounded-2xl text-base font-medium w-fit"
            style={{
              border: "1px solid #8CE163",
            }}
          >
            Get Started
          </motion.h1>
          <motion.h1
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
              transition: {
                duration: 0.5,
              },
            }}
            viewport={{
              once: true,
            }}
            className="font-medium text-2xl w-full md:w-[50%] md:text-6xl text-center text-[#fff]  mt-4 mb-4"
          >
            Start Your Journey with Confidence
          </motion.h1>
          <p className=" text-md md:text-lg font-normal text-[#dedede] w-3/4 md:w-2/4 text-center mb-8">
            Embrace a risk-free journey with our satisfaction guarantee — your
            success is not just a goal, but our commitment.
          </p>
          <div className="flex items-center gap-4 flex-col md:flex-row ">
            <motion.button
              initial={{}}
              whileHover={{}}
              className="bg-button text-[#080809] px-6 py-1.5 mt-6.5  flex items-center gap-2 rounded-xl  font-semibold "
            >
              Get Started{" "}
              <motion.div
                initial={{
                  x: 0,
                }}
                whileHover={{
                  x: 5,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                }}
              >
                <MdArrowForward
                  style={{
                    widht: "30px",
                    height: "30px",
                  }}
                />
              </motion.div>
            </motion.button>{" "}
            <div className="flex items-center">
              <Avatar
                alt="Remy Sharp"
                src={avatar1}
                sx={{
                  border: "2px solid #fbfbfb",
                }}
              />
              <Avatar
                alt="Remy Sharp"
                src={avatar2}
                sx={{
                  border: "2px solid #fbfbfb",
                  marginLeft: "-15px",
                }}
              />
              <Avatar
                alt="Remy Sharp"
                src={avatar3}
                sx={{
                  border: "2px solid #fbfbfb",
                  marginLeft: "-15px",
                }}
              />
              <p className="text-[#fff]">
                {" "}
                <b className="text-[#c6f268] ml-3">900</b> Reviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Reviews({ setHasStarted, hasStarted, clients, ad, rev, av }) {
  return (
    <div className="flex flex-col">
      <div
        id="review"
        className="review container mx-auto px-10 flex flex-col md:flex-row items-center justify-between"
      >
        <div className=" flex flex-col w-full justify-start items-start">
          <motion.h1
            initial={{
              opacity: 0,
              y: 100,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
              },
            }}
            viewport={{
              once: true,
            }}
            className="text-[#D1D1D1] py-1.5 px-3 rounded-2xl text-base font-medium w-fit"
            style={{
              border: "1px solid #8CE163",
            }}
          >
            Reviews
          </motion.h1>
          <motion.h1
            initial={{
              opacity: 0,
              y: 100,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
              },
            }}
            viewport={{
              once: true,
            }}
            className="font-medium text-start text-2xl md:text-6xl  text-[#fff] mt-4 mb-4"
          >
            Our Work Results in Good Reviews
          </motion.h1>
        </div>
        <motion.div
          initial={{
            opacity: 0,
            y: 100,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
            },
          }}
          viewport={{
            once: true,
          }}
          className="flex flex-col gap-3"
        >
          <p className="font-normal text-[#dedede] text-md md:text-lg text-start">
            Explore our comprehensive suite of marketing services designed to
            elevate your brand
          </p>
        </motion.div>
      </div>
      <motion.div
        whileInView={() => setHasStarted(true)}
        viewport={{
          once: true,
        }}
        className="px-10"
      >
        <div className="reviewContainer md:container md:mx-auto px-10 flex flex-col md:flex-row justify-around mt-10">
          <div className="flex flex-col gap-4 items-center py-5">
            <div
              className="wrappericon bg-[#121214] rounded-lg p-1.5"
              style={{
                border: "1px solid #343839",
              }}
            >
              <MdPeopleOutline
                style={{
                  color: "#8DE163",
                  width: "30px",
                  height: "30px",
                }}
              />
            </div>
            {hasStarted === true && (
              <div>
                <h1 className="text-[#fff] text-4xl font-medium">{clients}</h1>
                <p className="text-[#dedede] text-medium text-lg">
                  Clients Helped
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 items-center py-5">
            <div
              className="wrappericon bg-[#121214] rounded-lg p-1.5"
              style={{
                border: "1px solid #343839",
              }}
            >
              <MdAttachMoney
                style={{
                  color: "#8DE163",
                  width: "30px",
                  height: "30px",
                }}
              />
            </div>
            <h1 className="text-[#fff] text-4xl font-medium">{ad}m+</h1>
            <p className="text-[#dedede] text-medium text-lg">Total Ad Spend</p>
          </div>
          <div className="flex flex-col gap-4 items-center py-5">
            <div
              className="wrappericon bg-[#121214] rounded-lg p-1.5"
              style={{
                border: "1px solid #343839",
              }}
            >
              <MdOutlineShoppingBag
                style={{
                  color: "#8DE163",
                  width: "30px",
                  height: "30px",
                }}
              />
            </div>
            <h1 className="text-[#fff] text-4xl font-medium">{rev}m+</h1>
            <p className="text-[#dedede] text-medium text-lg">
              Collective Revenue
            </p>
          </div>
          <div className="flex flex-col gap-4 items-center py-5">
            <div
              className="wrappericon bg-[#121214] rounded-lg p-1.5"
              style={{
                border: "1px solid #343839",
              }}
            >
              <MdBarChart
                style={{
                  color: "#8DE163",
                  width: "30px",
                  height: "30px",
                }}
              />
            </div>
            <h1 className="text-[#fff] text-4xl font-medium">{av}</h1>
            <p className="text-[#dedede] text-medium text-lg">Average ROAS</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Features({}) {
  return (
    <div id="features" className="features">
      <div className="flex flex-col gap-4 justify-center items-center">
        <motion.h1
          className="text-[#D1D1D1] py-1.5 px-3 rounded-2xl text-base font-medium w-fit"
          style={{
            border: "1px solid #8CE163",
          }}
        >
          Features
        </motion.h1>
        <motion.h1 className="font-medium text-2xl md:text-6xl text-[#fff] mt-4 mb-4">
          Your Success Package
        </motion.h1>
        <div className="flex flex-col gap-12 items-center justify-center container mx-auto px-7 md:px-10 mt-10">
          {" "}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <motion.div
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
                transition: {
                  duration: 1,
                },
              }}
              viewport={{
                once: true,
              }}
              className="relative mb-6 md:mb-0"
            >
              {/* First Image (Background) */}
              <img
                src="https://framerusercontent.com/images/TCL11c6gwT2EDEMbVShkGv8eaIA.png"
                alt=""
                className="w-full rounded-2xl h-[65vh] md:h-[75vh]" // Ensures the first image spans the container width
              />

              {/* Second Image (On Top of First Image) */}
              <div className="absolute inset-0 flex items-center justify-center z-10 -top-20">
                <img
                  src="https://framerusercontent.com/images/PNcwK6lizEigO2bQrBDZMVhVqdI.svg"
                  alt=""
                  className="w-[85%] md:w-[90%] py-20" // Adjust size as needed
                />
              </div>

              {/* Text (Under the Second Image) */}
              <div className="absolute inset-0 flex w-full items-start justify-center top-auto bottom-10 z-20">
                <div className="flex flex-col gap-2 items-start text-start px-6">
                  <h1 className="text-[#fff] font-medium text-xl">
                    Full Account Audit
                  </h1>
                  <p className="text-[#dedede] font-normal  text-md">
                    Comprehensive analysis to maximize your PPC campaigns'
                    performance and efficiency.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
                transition: {
                  duration: 1,
                },
              }}
              viewport={{
                once: true,
              }}
              className="relative mb-6 md:mb-0"
            >
              {/* First Image (Background) */}
              <img
                src="https://framerusercontent.com/images/wo0Em8OOMXCl1dVgRk563mThcLw.png"
                alt=""
                className="w-full rounded-2xl h-[75vh]" // Ensures the first image spans the container width
              />

              {/* Second Image (On Top of First Image) */}
              <div className="absolute inset-0 flex items-center justify-center z-10 -top-20">
                <img
                  src="https://framerusercontent.com/images/v5yb0q7g9QH9nYV872QQIb0Wds.svg"
                  alt=""
                  className="w-[85%] md:w-[70%] py-20" // Adjust size as needed
                />
              </div>

              {/* Text (Under the Second Image) */}
              <div className="absolute inset-0 flex items-center justify-center top-auto bottom-10 z-20">
                <div className="flex flex-col gap-2 items-start text-center px-6">
                  <h1 className="text-[#fff] font-medium text-xl">
                    PPC Strategy
                  </h1>
                  <p className="text-[#dedede] font-normal  text-md text-start">
                    Tailored strategies crafted to boost your ad campaigns and
                    achieve your business goals.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
            <motion.div
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
                transition: {
                  duration: 1,
                },
              }}
              viewport={{
                once: true,
              }}
              className="relative mb-6 md:mb-0"
            >
              {/* First Image (Background) */}
              <img
                src="https://framerusercontent.com/images/LvbPdmHdWlfKpfkKQ2RgCeIDhE.png"
                alt=""
                className="w-full rounded-2xl h-[75vh]" // Ensures the first image spans the container width
              />

              {/* Second Image (On Top of First Image) */}
              <div className="absolute inset-0 flex items-center justify-center z-10 -top-32">
                <img
                  src="https://framerusercontent.com/images/T4IHPsdHUmQaIcIb5XdbQktSkQ.svg"
                  alt=""
                  className="w-[85%] md:w-[70%] py-20" // Adjust size as needed
                />
              </div>

              {/* Text (Under the Second Image) */}
              <div className="absolute inset-0 flex items-center justify-center top-auto bottom-14 z-20">
                <div className="flex flex-col gap-2 items-start text-center px-6">
                  <h1 className="text-[#fff] font-medium text-xl">
                    Daily Reports
                  </h1>
                  <p className="text-[#dedede] font-normal  text-md text-start">
                    Stay informed with detailed insights into your PPC
                    performance delivered straight to your inbox.
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
                transition: {
                  duration: 1,
                },
              }}
              viewport={{
                once: true,
              }}
              className="relative mb-6 md:mb-0"
            >
              {/* First Image (Background) */}
              <img
                src="https://framerusercontent.com/images/H3YQpCWKplAgrr3OUe7kC0a3k.png"
                alt=""
                className="w-full rounded-2xl h-[75vh]" // Ensures the first image spans the container width
              />

              {/* Second Image (On Top of First Image) */}
              <div className="absolute inset-0 flex items-center justify-center z-10 -top-32">
                <img
                  src="https://framerusercontent.com/images/4MyvZHMTwxwWkDRdpSNGRkL098.svg"
                  alt=""
                  className="w-[85%] md:w-[70%] py-20" // Adjust size as needed
                />
              </div>

              {/* Text (Under the Second Image) */}
              <div className="absolute inset-0 flex items-center justify-center top-auto bottom-14 z-20">
                <div className="flex flex-col gap-2 items-start text-center px-6">
                  <h1 className="text-[#fff] font-medium text-xl">
                    Constant Optimization
                  </h1>
                  <p className="text-[#dedede] font-normal text-md text-start">
                    Continuous fine-tuning to ensure your PPC campaigns are
                    always delivering optimal results.
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
                transition: {
                  duration: 1,
                },
              }}
              viewport={{
                once: true,
              }}
              className="relative mb-6 md:mb-0"
            >
              {/* First Image (Background) */}
              <img
                src="https://framerusercontent.com/images/r3rQfsio2FfbQaArwHLkCBISq8.png"
                alt=""
                className="w-full rounded-2xl h-[75vh]" // Ensures the first image spans the container width
              />

              {/* Second Image (On Top of First Image) */}
              <div className="absolute inset-0 flex items-center justify-center z-10 -top-32">
                <img
                  src="https://framerusercontent.com/images/ZtpHP52wEUBvHLiuggXQwCMr0g.png"
                  alt=""
                  className="w-[85%] md:w-[70%] py-20" // Adjust size as needed
                />
              </div>

              {/* Text (Under the Second Image) */}
              <div className="absolute inset-0 flex items-center justify-center top-auto bottom-14 z-20">
                <div className="flex flex-col gap-2 items-start text-center px-6">
                  <h1 className="text-[#fff] font-medium text-xl">
                    Copywriting
                  </h1>
                  <p className="text-[#dedede] font-normal text-md text-start">
                    Compelling ad copy that captivates your audience and drives
                    conversions.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQ({ faq, handleChangeFaq }) {
  return (
    <div
      id="faq"
      className="faq flex flex-col justify-center items-center px-5"
    >
      <motion.h1
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
          transition: {
            duration: 0.5,
          },
        }}
        viewport={{
          once: true,
        }}
        className="text-[#D1D1D1] py-1.5 px-3 rounded-2xl text-base font-medium w-fit"
        style={{
          border: "1px solid #8CE163",
        }}
      >
        FAQ
      </motion.h1>
      <motion.h1
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
          transition: {
            duration: 0.5,
          },
        }}
        viewport={{
          once: true,
        }}
        className="font-medium text-center text-2xl md:text-6xl  text-[#fff] mt-4 mb-4 "
      >
        Frequently Asked Questions
      </motion.h1>
      <div className="flex questions flex-col gap-4 items-center justify-center mt-6">
        <div
          className="f w-full md:w-[85%] flex flex-col gap-2 pb-2 p-3 rounded-md bg-[#121214]"
          style={{
            border:
              faq === "quest1" ? "1px solid #8DE163" : "1px solid #2A2A2C",
            transition: "all 0.5s ease",
          }}
        >
          <p
            onClick={() => handleChangeFaq("quest1")}
            className="text-xl cursor-pointer   mb-4 font-medium text-[#fff] hover:text-[#dedede] flex justify-between items-center transition-colors"
          >
            Track your Finances{" "}
            <MdOutlineClose
              style={{
                transform: faq === "quest1" ? "none" : "rotate(135deg)",
                transition: "all 0.5s ease",
              }}
            />
          </p>
          <div
            className={`overflow-hidden transition-all duration-500 ${faq === "quest1" ? "max-h-[100px] opacity-100" : "max-h-0 opacity-0"}`}
          >
            <p className="text-[#dedede] text-start font-normal text-lg">
              Drive targeted visitors to your website with expertly managed paid
              traffic campaigns.
            </p>
          </div>
        </div>

        <div
          className="f w-full md:w-[85%] flex flex-col gap-2 pb-2 p-3 bg-[#121214] rounded-md"
          style={{
            border:
              faq === "quest2" ? "1px solid #8DE163" : "1px solid #2A2A2C",
            transition: "all 0.5s ease",
          }}
        >
          <p
            onClick={() => handleChangeFaq("quest2")}
            className="text-xl cursor-pointer   mb-4 font-medium text-[#fff] hover:text-[#dedede] flex justify-between items-center transition-colors"
          >
            Track your Finances{" "}
            <MdOutlineClose
              style={{
                transform: faq === "quest2" ? "none" : "rotate(135deg)",
                transition: "all 0.5s ease",
              }}
            />
          </p>
          <div
            className={`overflow-hidden transition-all duration-500 ${faq === "quest2" ? "max-h-[100px] opacity-100" : "max-h-0 opacity-0"}`}
          >
            <p className="text-[#dedede] text-start font-normal text-lg">
              Drive targeted visitors to your website with expertly managed paid
              traffic campaigns.
            </p>
          </div>
        </div>
        <div
          className="f w-full md:w-[85%] flex flex-col gap-2 pb-2 p-3 rounded-md bg-[#121214]"
          style={{
            border:
              faq === "quest3" ? "1px solid #8DE163" : "1px solid #2A2A2C",
            transition: "all 0.5s ease",
          }}
        >
          <p
            onClick={() => handleChangeFaq("quest3")}
            className="text-xl cursor-pointer   mb-4 font-medium text-[#fff] hover:text-[#dedede] flex justify-between items-center transition-colors"
          >
            Track your Finances{" "}
            {faq === "quest3" ? (
              <MdOutlineClose
                onClick={() => handleChangeFaq("")}
                style={{
                  transform: faq === "quest3" ? "none" : "rotate(135deg)",
                  transition: "all 0.5s ease",
                }}
              />
            ) : (
              <MdOutlineClose
                onClick={() => handleChangeFaq("")}
                style={{
                  transform: faq === "quest3" ? "none" : "rotate(135deg)",
                  transition: "all 0.5s ease",
                }}
              />
            )}
          </p>
          <div
            className={`overflow-hidden transition-all duration-500 ${faq === "quest3" ? "max-h-[100px] opacity-100" : "max-h-0 opacity-0"}`}
          >
            <p className="text-[#dedede] text-start font-normal text-lg">
              Drive targeted visitors to your website with expertly managed paid
              traffic campaigns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
