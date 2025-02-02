import { useEffect, useState, useCallback } from "react";
import Avatar from "@mui/material/Avatar";
import { AnimatePresence, motion } from "motion/react";
import logo from "./assets/tag-svgrepo-com.svg";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  MdDashboard,
  MdStore,
  MdPieChart,
  MdWallet,
  MdCategory,
  MdSettings,
  MdNotifications,
  MdOutlineClose,
  MdDelete,
  MdEdit,
  MdPayments,
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

  const [openExpense, setOpenExpense] = useState(false);

  const createExpense = useCallback(() => setOpenExpense((prev) => !prev));

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

  const [nameExpense, setNameExpense] = useState(""); ///// name of the expense
  const [category, setCategory] = useState(""); ///// category of expense
  const [howMuch, setHowMuch] = useState(0); //// value for the money of the expense
  const [allExpenses, setAllExpenses] = useState(() => {
    const storedExpenses = localStorage.getItem("allExpenses");
    return storedExpenses ? JSON.parse(storedExpenses) : [];
  }); ///// the stored expenses in the local storage

  const [daily, setDaily] = useState("Daily"); //// state that will work with expenses

  const dateDaily = [
    { date: "Daily" },
    { date: "Week" },
    { date: "Monthly" },
    { date: "Year" },
  ];

  const handleSubmitExpenses = () => {
    if (!nameExpense.length || !category.length || howMuch.trim() === 0) {
      return;
    }

    const now = new Date().toISOString(); // Store timestamp
    const relativeTime = formatDistanceToNow(new Date(now), {
      addSuffix: true,
    });

    const newExpense = {
      id: now,
      nameExpense,
      category,
      howMuch,
      daily,
      addedTime: relativeTime,
    };

    const updatedExpenses = [...allExpenses, newExpense];
    setAllExpenses(updatedExpenses);
    localStorage.setItem("allExpenses", JSON.stringify(updatedExpenses));

    // Clear input fields
    setNameExpense("");
    setCategory("");
    setHowMuch("");
    setDaily("Daily");
    setOpenExpense(false);
  };

  const [shortTime, setShortTime] = useState("");

  useEffect(() => {
    const expenses = JSON.parse(localStorage.getItem("allExpenses")) || [];

    const updatedExpenses = expenses.map((expense) => ({
      ...expense,
      addedTime: formatDistanceToNow(parseISO(expense.id), { addSuffix: true }), // Update each expense's relative time
    }));

    setAllExpenses(updatedExpenses);
  }, []);

  const removeExpense = (id) => {
    ///// remove and update the specific expense you choose on the dashboard and the expenses component
    const updateExpenses = allExpenses.filter((expense) => expense.id !== id);
    setAllExpenses(updateExpenses);
    localStorage.setItem("allExpenses", JSON.stringify(updateExpenses));
  };

  const removeAllExpense = () => {
    ///////////function to remove all the expenses on the dashboard component
    const updateExpenses = [];
    setAllExpenses(updateExpenses);
    localStorage.setItem("allExpenses", JSON.stringify(updateExpenses));
  };

  ////// change state functions for the total income , monthly ,daily ,yearly of the income that was putted in the beggining :)

  const [stateIncome, setStateIncome] = useState(0);
  const [incomeValue, setIncomeValue] = useState(0);
  const [changeIncome, setChangeIncome] = useState("Monthly");

  useEffect(() => {
    if (!income) return; // Avoid errors if income is missing

    let incomeValue;

    if (typeof income === "string") {
      incomeValue = parseFloat(income.slice(2)); // Remove currency symbol
    } else if (typeof income === "number") {
      incomeValue = income; // It's already a number
    } else {
      console.error("Unexpected income format:", income);
      return;
    }

    if (changeIncome === "Monthly") {
      setStateIncome(incomeValue);
    } else if (changeIncome === "Yearly") {
      setStateIncome(incomeValue * 12);
    } else if (changeIncome === "Daily") {
      setStateIncome(incomeValue / 30);
    }
  }, [changeIncome, income]);

  const cycleIncomeType = () => {
    if (changeIncome === "Monthly") {
      setStateIncome(incomeValue);
      setChangeIncome("Yearly");
    } else if (changeIncome === "Yearly") {
      setStateIncome(incomeValue * 12);
      setChangeIncome("Daily");
    } else if (changeIncome === "Daily") {
      setStateIncome(incomeValue / 30);
      setChangeIncome("Monthly");
    }

    const showExpenses = JSON.parse(localStorage.getItem("allExpenses")) || [];

    const total = showExpenses.reduce(
      (acc, expense) => acc + Number(expense.howMuch),
      0
    );

    const getTotalMonthlyExpenses = (expenses) => {
      return expenses
        .filter((expense) => expense.daily === "Monthly")
        .reduce((acc, expense) => acc + Number(expense.howMuch), 0);
    };

    const getTotalYearlyExpenses = (expenses) => {
      return expenses
        .filter((expense) => expense.daily === "Yearly")
        .reduce((acc, expense) => acc + Number(expense.howMuch), 0);
    };

    const Daily = total / 365;
    const totalMonthly = getTotalMonthlyExpenses(showExpenses);
    const Yearly = getTotalYearlyExpenses(showExpenses) + totalMonthly * 12;

    if (changeIncome === "Daily") {
      setTotalExpenses(Daily);
    }

    if (changeIncome === "Monthly") {
      setTotalExpenses(totalMonthly);
    }

    if (changeIncome === "Yearly") {
      setTotalExpenses(Yearly);
    }
  };

  ////// state and function of the total expenses that was taken by the component expenses :)

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [changeHowMuch, setChangeHowMuch] = useState("Monthly");

  useEffect(() => {
    const showExpenses = JSON.parse(localStorage.getItem("allExpenses")) || [];

    const total = showExpenses.reduce(
      (acc, expense) => acc + Number(expense.howMuch),
      0
    );

    const getTotalMonthlyExpenses = (expenses) => {
      return expenses
        .filter((expense) => expense.daily === "Monthly")
        .reduce((acc, expense) => acc + Number(expense.howMuch), 0);
    };

    const getTotalYearlyExpenses = (expenses) => {
      return expenses
        .filter((expense) => expense.daily === "Yearly")
        .reduce((acc, expense) => acc + Number(expense.howMuch), 0);
    };

    const Daily = total / 30;
    const totalMonthly = getTotalMonthlyExpenses(showExpenses);
    const Yearly = getTotalYearlyExpenses(showExpenses) + totalMonthly * 12;

    if (changeIncome === "Daily") {
      setTotalExpenses(Daily);
    }

    if (changeIncome === "Monthly") {
      setTotalExpenses(totalMonthly);
    }

    if (changeIncome === "Yearly") {
      setTotalExpenses(Yearly);
    }
  }, [allExpenses]);

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
              key={showInfo} // ✅ Ensures correct animation behavior
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
                  shortTime={shortTime}
                  removeAllExpense={removeAllExpense}
                  daily={daily}
                  stateIncome={stateIncome}
                  changeIncome={changeIncome}
                  setChangeIncome={setChangeIncome}
                  cycleIncomeType={cycleIncomeType}
                  totalExpenses={totalExpenses}
                  setChangeHowMuch={setChangeHowMuch}
                />
              )}
              {showInfo === "store" && (
                <Expenses
                  removeExpense={removeExpense}
                  handleSubmitExpenses={handleSubmitExpenses}
                  nameExpense={nameExpense}
                  setNameExpense={setNameExpense}
                  category={category}
                  setCategory={setCategory}
                  howMuch={howMuch}
                  setHowMuch={setHowMuch}
                  createExpense={createExpense}
                  expenses={allExpenses}
                  userData={userData}
                  openExpense={openExpense}
                  daily={daily}
                  setDaily={setDaily}
                  dateDaily={dateDaily}
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
  expenses,
  shortTime,
  removeAllExpense,
  daily,
  stateIncome,
  changeIncome,
  setChangeIncome,
  cycleIncomeType,
  totalExpenses,
  setChangeHowMuch,
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
      income: stateIncome, // ✅ Dynamically updated income
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
      income: stateIncome, // ✅ Dynamically updated income
      currency: userData.currency,
    },
    {
      name: "Total Expenses",
      icon: (
        <MdPayments
          style={{
            color: "#8DE163",
            width: "22px",
            height: "22px",
          }}
        />
      ),
      income: totalExpenses, // ✅ Dynamically updated income
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
              className="incomeD bg-[#141718] rounded-xl p-3 text-center flex flex-col gap-2 w-[270px]"
              style={{
                border: "1px solid rgb(222,222,222,0.2)",
              }}
            >
              <div className="flex items-center gap-4 justify-between">
                <p className="font-light text-sm text-gray-400">{info.name}</p>
                <div className="flex flex-row-reverse items-center gap-1">
                  <div className="bg-[#212c24] p-1 rounded-md">
                    {" "}
                    {info.icon}
                  </div>
                  <button
                    className="bg-[#252923] border border-[#3e453b] text-xs font-light text-[#d8dcd6]"
                    onClick={cycleIncomeType}
                  >
                    {changeIncome}
                  </button>
                </div>
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
        <div className="flex w-[100%] justify-end items-center gap-4">
          <div
            className="bg-[#141718] p-6 rounded-xl shadow-lg w-[40%]"
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
              <ResponsiveContainer width="100%" height={330}>
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
          <div>
            <div className="cardTask bg-[#]   rounded-xl p-2 flex flex-col gap-4 max-h-[450px] overflow-y-auto">
              {allExpenses.length > 0 ? (
                allExpenses.map((info) => (
                  <div
                    key={info.id || `${info.nameExpense}-${info.howMuch}`}
                    className="flex flex-col rounded-xl px-2 border  border-[rgb(222,222,222,0.2)] bg-[#141718] py-3 text-lg text-white transition-colors  active:bg-zinc-900"
                  >
                    <div className="flex items-center justify-between ">
                      <h1 className="text-[#fff] font-medium text-lg">
                        {info.nameExpense}
                      </h1>{" "}
                      <div className="flex items-center gap-3">
                        <div className="rounded text-xs font-light text-[#d8dcd6] bg-[#252923] p-1 border border-[#3e453b]">
                          {info.daily}
                        </div>
                        <button
                          onClick={() => removeExpense(info.id)}
                          className="rounded bg-red-300/20 px-1.5 py-1 text-xs text-red-300 transition-colors hover:bg-red-600 hover:text-red-200"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-1.5">
                      <p className="text-[#dedede] font-normal text-sm flex items-center">
                        Category:
                        <b className="text-[#fff] font-medium">
                          {" "}
                          {info.category}
                        </b>
                      </p>{" "}
                      <p className="text-[rgba(222,222,222,0.7)]">/</p>
                      <p className="text-[#dedede] font-light text-sm flex items-center">
                        Amount:{" "}
                        <b className="text-[#fff] font-medium">
                          {info.howMuch}
                        </b>
                        {userData.currency}
                      </p>
                      <p className="text-[rgba(222,222,222,0.7)]">/</p>
                      <p className="text-[#aaa] text-xs">
                        {info.addedTime}
                      </p>{" "}
                      {/* Show relative time */}
                    </div>
                  </div>
                ))
              ) : (
                <div className="expen text-3xl font-semibold">
                  No Expenses Yet
                </div>
              )}
            </div>
            {allExpenses.length > 0 ? (
              <button
                className="rounded w-full flex items-center justify-center bg-red-300/20 px-2 py-2 text-xs text-red-300 transition-colors hover:bg-red-600 hover:text-red-200"
                onClick={removeAllExpense}
              >
                Remove All
              </button>
            ) : (
              ""
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
  userData,
  handleSubmitExpenses,
  nameExpense,
  setNameExpense,
  category,
  setCategory,
  howMuch,
  setHowMuch,
  createExpense,
  openExpense,
  daily,
  dateDaily,
  setDaily,
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
      <div className="flex flex-col items-center justify-center w-full mt-20 gap-5 ml-20">
        {expenses.length > 0 ? (
          expenses.map((info) => (
            <div
              key={info.id || `${info.nameExpense}-${info.howMuch}`}
              className="flex flex-col rounded-xl px-2 border border-[rgb(222,222,222,0.2)] bg-[#141718] py-3 text-lg text-white transition-colors  active:bg-zinc-900"
            >
              <div className="flex items-center justify-between w-[400px]">
                <h1 className="text-[#fff] font-medium text-lg">
                  {info.nameExpense}
                </h1>{" "}
                <div className="flex items-center gap-3">
                  <div className="rounded text-xs font-light text-[#d8dcd6] bg-[#252923] p-1 border border-[#3e453b]">
                    {info.daily}
                  </div>
                  <button
                    onClick={() => removeExpense(info.id)}
                    className="rounded bg-red-300/20 px-1.5 py-1 text-xs text-red-300 transition-colors hover:bg-red-600 hover:text-red-200"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[#dedede] font-normal text-sm flex items-center">
                  Category:
                  <b className="text-[#fff] font-medium"> {info.category}</b>
                </p>{" "}
                <p className="text-[rgba(222,222,222,0.7)]">/</p>
                <p className="text-[#dedede] font-light text-sm flex items-center">
                  Amount:{" "}
                  <b className="text-[#fff] font-medium">{info.howMuch}</b>
                  {userData.currency}
                </p>
                <p className="text-[rgba(222,222,222,0.7)]">/</p>
                <p className="text-xs text-gray-500">
                  Added: {new Date(info.id).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="expen text-3xl font-semibold">No Expenses Yet</div>
        )}

        <div className="fixed bottom-6 left-1/2 w-full max-w-xl -translate-x-1/2 px-4">
          <AnimatePresence>
            {openExpense && (
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
                    <select
                      className="resize-none rounded bg-[#141718] p-3 text-sm text-zinc-50 placeholder-zinc-500 caret-zinc-50 focus:outline-0"
                      value={daily}
                      onChange={(e) => setDaily(e.target.value)} // Update state correctly
                    >
                      {/* Fixed this line */}
                      {dateDaily.map((option, index) => (
                        <option key={index} value={String(option.date)}>
                          {" "}
                          {/* Ensure it's a string */}
                          {option.date}
                        </option>
                      ))}
                    </select>
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
              className={`transition-transform ${openExpense ? "rotate-0" : "rotate-45"}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
