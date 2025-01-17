import {
  MdBarChart,
  MdOutlineInsertDriveFile,
  MdOutlineStarOutline,
} from "react-icons/md";
import { motion } from "motion/react";
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

  return (
    <div className="bg-[#010101]">
      <Features
        containerVariants={containerVariants}
        childVariants={childVariants}
      />
      <div className="empty h-56"></div>
    </div>
  );
};

export default AllContent;

function Features({ containerVariants, childVariants }) {
  return (
    <div id="features" className="features">
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
          Features
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
