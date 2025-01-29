import { useEffect, useState, useCallback } from "react";
import Avatar from "@mui/material/Avatar";
import { AnimatePresence, motion } from "motion/react";
import logo from "./assets/tag-svgrepo-com.svg";
import {
  MdDashboard,
  MdStore,
  MdPieChart,
  MdWallet,
  MdCategory,
  MdSettings,
  MdNotifications,
  MdOutlineClose,
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
      label: "Expenses",
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

  const checkExpenses = () => {
    setShowInfo("store");
  };

  const [expenses, setExpenses] = useState(false);

  const createExpense = useCallback(() => setExpenses((prev) => !prev));

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

  ///// expenses functions //// /

  const [nameExpense, setNameExpense] = useState("");
  const [category, setCategory] = useState("");
  const [howMuch, setHowMuch] = useState(0);
  const [allExpenses, setAllExpenses] = useState(() => {
    const storedExpenses = localStorage.getItem("allExpenses");
    return storedExpenses ? JSON.parse(storedExpenses) : [];
  });

  const handleSubmitExpenses = () => {
    if (!nameExpense.length || !category.length || howMuch.trim() === 0) {
      return;
    }

    const newExpense = {
      id: Date.now(),
      nameExpense,
      category,
      howMuch,
    };

    const updatedExpenses = [...allExpenses, newExpense];
    setAllExpenses(updatedExpenses);
    localStorage.setItem("allExpenses", JSON.stringify(updatedExpenses));

    // Clear input fields
    setNameExpense("");
    setCategory("");
    setHowMuch("");
  };

  const removeExpense = (id) => {
    const updateExpenses = allExpenses.filter((expense) => expense.id !== id);
    setAllExpenses(updateExpenses);
    localStorage.setItem("allExpenses", JSON.stringify(updateExpenses));
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
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              exit={{ opacity: 0, transition: { duration: 0.7 } }}
            >
              {showInfo === "dashboard" && (
                <Dashboard
                  lastUpdated={lastUpdated}
                  income={income}
                  setSelectedPeriod={setSelectedPeriod}
                  selectedPeriod={selectedPeriod}
                  chartData={chartData}
                  userData={userData}
                  checkExpenses={checkExpenses}
                  allExpenses={allExpenses}
                  removeExpense={removeExpense}
                />
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              exit={{ opacity: 0, transition: { duration: 0.7 } }}
            >
              {showInfo === "store" && (
                <Expenses
                  removeExpense={removeExpense}
                  expenses={expenses}
                  handleSubmitExpenses={handleSubmitExpenses}
                  nameExpense={nameExpense}
                  setNameExpense={setNameExpense}
                  category={category}
                  setCategory={setCategory}
                  howMuch={howMuch}
                  setHowMuch={setHowMuch}
                  createExpense={createExpense}
                  allExpenses={allExpenses}
                />
              )}
            </motion.div>
          </AnimatePresence>
          {/* Centered Content */}
        </div>
      </div>
    </div>
  );
};

export default Tracker;

function Dashboard({
  lastUpdated,
  income,
  period,
  setSelectedPeriod,
  selectedPeriod,
  chartData,
  userData,
  checkExpenses,
  allExpenses,
  removeExpense,
}) {
  const allInfo = [
    {
      name: "Total Balance",
      icon: (
        <MdWallet
          style={{
            color: "#8DE163",
            width: "22px",
            height: "22px",
          }}
        />
      ),
      income: userData.income,
      currency: userData.currency,
    },
    {
      name: "Total Income",
      icon: (
        <MdWallet
          style={{
            color: "#8DE163",
            width: "22px",
            height: "22px",
          }}
        />
      ),
      income: userData.income,
      currency: userData.currency,
    },
    {
      name: "Total Expenses",
      icon: (
        <MdWallet
          style={{
            color: "#8DE163",
            width: "22px",
            height: "22px",
          }}
        />
      ),
      income: userData.income,
      currency: userData.currency,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="flex flex-col items-center w-full mt-10 gap-5">
        <div className="flex items-center gap-20 justify-end w-full">
          {allInfo.map((info, index) => (
            <div
              key={index}
              className="incomeD bg-[#141718] rounded-xl p-3 text-center flex flex-col gap-2"
              style={{
                border: "1px solid rgb(222,222,222,0.2)",
              }}
            >
              <div className="flex items-start gap-4 justify-between">
                <p className="font-light text-sm text-gray-400">{info.name}</p>
                <div className="bg-[#212c24] p-1 rounded-md"> {info.icon}</div>
              </div>
              <h1 className="font-semibold text-base flex items-center gap-1">
                <p className="text-2xl"> {info.currency}</p>
                <p className="text-2xl">{info.income}</p>
              </h1>
              {lastUpdated && (
                <p className="text-xs text-gray-500">
                  Last Updated: {new Date(lastUpdated).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="flex w-[100%] justify-end gap-4">
          <div
            className="bg-[#141718] p-6 rounded-xl shadow-lg w-[50%]"
            style={{
              border: "1px solid rgb(222,222,222,0.2)",
            }}
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
                    className={`px-4 py-2 rounded-md text-sm font-medium hover:border-[#8DE163] ${selectedPeriod === period ? "bg-transparent text-[#8DE163]" : "bg-transparent"}`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-start justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="1 1" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    style={{
                      backgroundColor: "#000",
                    }}
                  />
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
          <div
            className="cardTask bg-[#141718] rounded-xl p-2"
            style={{
              border: "1px solid rgb(222,222,222,0.2)",
            }}
          >
            {allExpenses.length > 0 ? (
              allExpenses.map((info, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-center">
                    <h1 className="text-[#fff] font-medium text-lg">
                      {info.nameExpense}
                    </h1>{" "}
                    |
                    <p className="text-[#dedede] font-medium text-md">
                      {info.category}
                    </p>{" "}
                    |
                    <p className="text-[#dedede] font-light text-sm">
                      {info.howMuch}
                    </p>
                    <button onClick={() => removeExpense(info.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center flex flex-col items-center gap-2 justify-center h-full text-gray-500">
                No Story of Expenses Yet
                <button
                  onClick={checkExpenses}
                  className="bg-button text-[#000]"
                >
                  Check Expenses
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Expenses({
  allExpenses,
  removeExpense,
  expenses,

  handleSubmitExpenses,
  nameExpense,
  setNameExpense,
  category,
  setCategory,
  howMuch,
  setHowMuch,
  createExpense,
}) {
  return (
    <div className="exp flex flex-col items-center justify-center gap-5">
      <div className="flex flex-col gap-2 w-[50%]">
        <h1 className="text-4xl font-medium text-[#fff]  text-start mt-10">
          Expenses
        </h1>
        <p className="text-start text-[#dedede] font-normal text-md">
          Let's see what we've got to do today.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center w-full mt-20 gap-20 ml-20">
        {allExpenses.length > 0 ? (
          allExpenses.map((info, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex items-center">
                <h1 className="text-[#fff] font-medium text-lg">
                  {info.nameExpense}
                </h1>{" "}
                |
                <p className="text-[#dedede] font-medium text-md">
                  {info.category}
                </p>{" "}
                |
                <p className="text-[#dedede] font-light text-sm">
                  {info.howMuch}
                </p>
                <button onClick={() => removeExpense(info.id)}>Remove</button>
              </div>
            </div>
          ))
        ) : (
          <div className="expen text-3xl font-semibold">No Expenses Yet</div>
        )}

        <div className="fixed bottom-6 left-1/2 w-full max-w-xl -translate-x-1/2 px-4">
          <AnimatePresence>
            {expenses && (
              <motion.form
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 25,
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitExpenses();
                }}
                className="mb-6 w-full rounded border border-zinc-700 bg-[#141718] p-3"
              >
                <textarea
                  placeholder="What do you spend on ?"
                  value={nameExpense}
                  onChange={(e) => setNameExpense(e.target.value)}
                  className="h-20 w-full resize-none rounded bg-[#141718] p-3 text-sm text-zinc-50 placeholder-zinc-500 caret-zinc-50 focus:outline-0"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <input
                      placeholder="Categorize as ..."
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      type="text"
                      className="w-36 rounded bg-zinc-700 px-1.5 py-1 text-sm text-zinc-50 focus:outline-0"
                    />
                    <input
                      value={howMuch}
                      onChange={(e) => setHowMuch(e.target.value)}
                      placeholder={userData.currency}
                      type="number"
                      className="w-24 px-1.5 py-1 text-sm text-zinc-500 bg-zinc-700  rounded focus:outline-0"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded bg-[#8DE163] px-1.5 py-1 text-xs text-[#000] transition-colors hover:bg-[rgba(141,225,99,0.7)]"
                  >
                    Submit
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
          <button
            onClick={createExpense}
            className="grid w-full place-content-center rounded-full border border-[rgb(222,222,222,0.2)] bg-[#141718] py-3 text-lg text-white transition-colors hover:bg-zinc-800 active:bg-zinc-900"
          >
            <MdOutlineClose
              className={`transition-transform ${expenses ? "rotate-0" : "rotate-45"}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
