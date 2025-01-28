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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Tracker = () => {
  const [userData, setUserData] = useState({
    name: "",
    currency: "",
    income: "",
  });

  const [lastUpdated, setLastUpdated] = useState(() => {
    return localStorage.getItem("lastUpdated") || "";
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

  /// charts functions .//////

  const [selectedPeriod, setSelectedPeriod] = useState("month"); // Default: Month
  const [chartData, setChartData] = useState([]);
  const [income, setIncome] = useState(0);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.income) {
      setIncome(storedData.income);
    }
  }, []);

  useEffect(() => {
    const generateData = () => {
      let data = [];

      if (selectedPeriod === "day") {
        data = Array.from({ length: 7 }, (_, i) => ({
          name: `Day ${i + 1}`,
          value: Math.floor(Math.random() * income),
        }));
      } else if (selectedPeriod === "week") {
        data = Array.from({ length: 4 }, (_, i) => ({
          name: `Week ${i + 1}`,
          value: Math.floor(Math.random() * income),
        }));
      } else if (selectedPeriod === "month") {
        data = Array.from({ length: 12 }, (_, i) => ({
          name: `Month ${i + 1}`,
          value: Math.floor(Math.random() * income),
        }));
      } else if (selectedPeriod === "year") {
        data = Array.from({ length: 5 }, (_, i) => ({
          name: `Year ${new Date().getFullYear() - i}`,
          value: Math.floor(Math.random() * income),
        }));
      }

      setChartData(data);
    };

    generateData();
  }, [selectedPeriod, income]);

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
            <h1 className="text-3xl font-semibold text-[#fbfbfb] flex items-center gap-1 pl-10 pt-5 text-start w-full">
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
        <div className="bg-tracker   text-[#fff] items-center pr-10 pt-5">
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
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="flex  items-center gap-24 justify-end w-full mt-10">
              <div
                className="incomeD bg-[#141718] rounded-xl p-3 text-center flex flex-col gap-2"
                style={{ border: "1px solid rgb(222,222,222,0.2)" }}
              >
                <div className="flex items-start gap-4 justify-between">
                  <p className="font-light text-sm text-gray-400">
                    Total Balance
                  </p>
                  <div className="bg-[#212c24] p-1 rounded-md">
                    {" "}
                    <MdWallet
                      style={{
                        color: "#8DE163",
                        width: "22px",
                        height: "22px",
                      }}
                    />
                  </div>
                </div>
                <h1 className="font-semibold text-base flex items-center gap-1">
                  <p className="text-2xl"> {userData.currency}</p>
                  <p className="text-2xl">{userData.income}</p>
                </h1>
                {lastUpdated && (
                  <p className="text-xs text-gray-500">
                    Last Updated: {new Date(lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
              <div
                className="incomeD bg-[#141718] rounded-xl p-3 text-center flex flex-col gap-2"
                style={{ border: "1px solid rgb(222,222,222,0.2)" }}
              >
                <div className="flex items-start gap-4 justify-between">
                  <p className="font-light text-sm text-gray-400">
                    Total Income
                  </p>
                  <div className="bg-[#212c24] p-1 rounded-md">
                    {" "}
                    <MdWallet
                      style={{
                        color: "#8DE163",
                        width: "22px",
                        height: "22px",
                      }}
                    />
                  </div>
                </div>
                <h1 className="font-semibold text-base flex items-center gap-1">
                  <p className="text-2xl"> {userData.currency}</p>
                  <p className="text-2xl">{userData.income}</p>
                </h1>
                {lastUpdated && (
                  <p className="text-xs text-gray-500">
                    Last Updated: {new Date(lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
              <div
                className="incomeD bg-[#141718] rounded-xl p-3 text-center flex flex-col gap-2"
                style={{ border: "1px solid rgb(222,222,222,0.2)" }}
              >
                <div className="flex items-start gap-4 justify-between">
                  <p className="font-light text-sm text-gray-400">
                    Total Expenses
                  </p>
                  <div className="bg-[#212c24] p-1 rounded-md">
                    {" "}
                    <MdWallet
                      style={{
                        color: "#8DE163",
                        width: "22px",
                        height: "22px",
                      }}
                    />
                  </div>
                </div>
                <h1 className="font-semibold text-base flex items-center gap-1">
                  <p className="text-2xl"> {userData.currency}</p>
                  <p className="text-2xl">{userData.income}</p>
                </h1>
                {lastUpdated && (
                  <p className="text-xs text-gray-500">
                    Last Updated: {new Date(lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex w-[90%] justify-center ml-16">
              <div
                className="bg-[#141718] p-6 rounded-xl shadow-lg w-[50%]"
                style={{ border: "1px solid rgb(222,222,222,0.2)" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold"> Overview</h2>
                  <p className="text-gray-600">
                    Income: <span className="font-semibold">${income}</span>
                  </p>
                </div>

                <div className="flex items-end gap-4 ml-12">
                  <div className="flex gap-2">
                    {["day", "week", "month", "year"].map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-4 py-2 rounded-md text-sm font-medium hover:border-[#8DE163] ${
                          selectedPeriod === period
                            ? "bg-transparent text-[#8DE163]"
                            : "bg-transparent"
                        }`}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex  items-end">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8DE163"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracker;
