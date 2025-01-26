import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { motion } from "motion/react";
import logo from "./assets/tag-svgrepo-com.svg";
import {
  MdDashboard,
  MdStore,
  MdPieChart,
  MdWallet,
  MdCategory,
  MdSettings,
  MdNotifications,
} from "react-icons/md";
const Tracker = () => {
  const [userData, setUserData] = useState({
    name: "",
    currency: "",
    income: "",
  });

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setUserData(storedUserData);
    }
  }, []);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <MdDashboard style={{ width: "30px", height: "30px" }} />,
    },
    {
      id: "store",
      label: "Store",
      icon: <MdStore style={{ width: "30px", height: "30px" }} />,
    },
    {
      id: "analytic",
      label: "Analytic",
      icon: <MdPieChart style={{ width: "30px", height: "30px" }} />,
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: <MdWallet style={{ width: "30px", height: "30px" }} />,
    },
    {
      id: "category",
      label: "Category",
      icon: <MdCategory style={{ width: "30px", height: "30px" }} />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <MdSettings style={{ width: "30px", height: "30px" }} />,
    },
  ];

  const [showInfo, setShowInfo] = useState("dashboard");

  const chooseInfo = (info) => {
    setShowInfo(info);
  };

  return (
    <div>
      <div className="flex w-full">
        {/* Drawer */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { duration: 0.7 } }}
          className="drawer-finly w-1/5 fixed left-0 top-0 bottom-0"
          style={{ zIndex: 1000 }}
        >
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-semibold text-[#fbfbfb] flex items-center gap-1 pl-10 pt-5 text-start w-full">
              Finly <img src={logo} alt="" />
            </h1>

            {menuItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => chooseInfo(item.id)}
                className={`dash w-full px-10 ${index === 0 ? "mt-20" : "mt-10"}`}
              >
                <div
                  style={{
                    color: showInfo === item.id ? "#8DE163" : "#fff",
                    transition: "color 0.5s ease",
                  }}
                  className="flex items-center cursor-pointer gap-3 text-[#fff] hover:text-[#8DE163] transition-colors font-medium"
                >
                  {item.icon} {item.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="bg-tracker   text-[#fff] items-center p-4">
          {/* Top-right userData.name */}
          <div
            className=" flex items-end justify-end w-full gap-3"
            style={{ zIndex: 10 }}
          >
            <MdNotifications style={{ width: "25px", height: "25px" }} />
            <h1 className="text-base font-light text-[#fff]">
              {userData.name}
            </h1>
          </div>

          {/* Centered Content */}
          <div className="flex flex-col items-center justify-center w-full mt-10">
            <div
              className="incomeD bg-[#141718] rounded-xl p-3 text-center flex flex-col "
              style={{ border: "1px solid rgb(222,222,222,0.2)" }}
            >
              <div className="flex items-center gap-4">
                <p className="font-light text-sm text-gray-500">
                  Total Balance
                </p>
                <div className="bg-[#212c24] p-1 rounded-xl">
                  {" "}
                  <MdWallet
                    style={{ color: "#8DE163", width: "22px", height: "22px" }}
                  />
                </div>
              </div>
              <h1 className="font-semibold text-base flex items-center gap-1">
                <p className="text-2xl"> {userData.currency}</p>
                <p className="text-2xl">{userData.income}</p>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracker;
