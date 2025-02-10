import { useEffect, useState, useCallback, useMemo } from "react";
import Avatar from "@mui/material/Avatar";
import { AnimatePresence, motion } from "motion/react";
import logo from "./assets/tag-svgrepo-com.svg";
import { formatDistanceToNow, parseISO } from "date-fns";
import MouseTrap from "mousetrap";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
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
  MdOutlineSearch,
} from "react-icons/md";

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

  ///// search functions /////

  const [showInfo, setShowInfo] = useState("dashboard");

  const chooseInfo = (info) => {
    setShowInfo(info);
    setOpenSearch(false);
    setSearchQuery("");
  };

  const checkExpenses = () => {
    setShowInfo("store");
  };

  const [openExpense, setOpenExpense] = useState(false);

  const createExpense = useCallback(() => setOpenExpense((prev) => !prev));

  /// charts functions .//////

  const [selectedPeriod, setSelectedPeriod] = useState("Monthly"); // Default: Month
  const [chartData, setChartData] = useState([]);
  const [income, setIncome] = useState(0);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.income) {
      setIncome(storedData.income);
    }
  }, []);

  const [totalBalance, setTotalBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [changeBalance, setChangeBalance] = useState("Monthly");
  const [allExpenses, setAllExpenses] = useState(() => {
    const storedExpenses = localStorage.getItem("allExpenses");
    return storedExpenses ? JSON.parse(storedExpenses) : [];
  });

  const getTotalExpensesByPeriod = (expenses, targetPeriod) => {
    return expenses.reduce((acc, expense) => {
      const amt = Number(expense.howMuch);
      const expensePeriod = expense.period || expense.daily; // Ensure correct key

      console.log(
        `Checking conversion: Amount ${amt}, Period ${expensePeriod}, Target ${targetPeriod}`
      );

      // ✅ Fix: Ensure `converted` is always assigned a value
      let converted = convertExpense
        ? convertExpense(amt, expensePeriod, targetPeriod)
        : 0;

      console.log(
        `Expense: ${expense.nameExpense}, Amount: ${amt}, Period: ${expensePeriod}, Converted: ${converted}`
      );

      return acc + converted;
    }, 0);
  };

  const COLORS = ["#8DE163", "#FF6363"];

  const data = [
    { name: "Remaining Balance", value: Number(totalBalance.toFixed(2)) },
    { name: "Total Expenses", value: Number(totalExpenses.toFixed(2)) },
  ];

  useEffect(() => {
    // Ensure expenses are converted properly
    let convertedExpenses = getTotalExpensesByPeriod(
      allExpenses,
      selectedPeriod
    );

    let calculatedBalance = income; // Start with base income

    if (selectedPeriod === "Yearly") {
      calculatedBalance = income * 12; // Convert Monthly Income → Yearly
    } else if (selectedPeriod === "Daily") {
      calculatedBalance = income / 30; // Convert Monthly Income → Daily
    }

    // Subtract expenses (already converted)
    calculatedBalance -= convertedExpenses;

    setTotalBalance(calculatedBalance);
  }, [income, selectedPeriod, allExpenses]);

  ///// expenses functions //// /

  const [nameExpense, setNameExpense] = useState(""); ///// name of the expense
  const [category, setCategory] = useState(""); ///// category of expense
  const [howMuch, setHowMuch] = useState(0); //// value for the money of the expense
  ///// the stored expenses in the local storage

  const [daily, setDaily] = useState("Daily"); //// state that will work with expenses

  const dateDaily = [{ date: "Daily" }, { date: "Monthly" }, { date: "Year" }];

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
      nameExpense, // 🛑 Should be "name" (to match your existing structure)
      category,
      howMuch,
      daily, // 🛑 This should be "period" instead of "daily"
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
  const [changeIncome, setChangeIncome] = useState("Monthly");

  // Expense conversion states

  const [changeHowMuch, setChangeHowMuch] = useState("Monthly");

  ///// balance conversion states

  const convertExpense = (amount, fromPeriod, toPeriod) => {
    const periodDays = {
      Daily: 1,
      Weekly: 7,
      Monthly: 30,
      Year: 365,
    };

    // Check if both periods exist in the conversion table
    if (!(fromPeriod in periodDays) || !(toPeriod in periodDays)) {
      console.error(`Invalid period: ${fromPeriod} or ${toPeriod}`);
      return amount; // Return as is if invalid
    }

    // Convert from original period to daily, then to target period
    const dailyValue = amount / periodDays[fromPeriod];
    const convertedAmount = dailyValue * periodDays[toPeriod];

    const updated = new Date().toISOString();
    localStorage.setItem("lastUpdated", updated);

    return convertedAmount;
  };

  useEffect(() => {
    if (!income) return;
    // Assume income is either a string with a currency symbol or a number.
    let parsedIncome =
      typeof income === "string" ? parseFloat(income.slice(2)) : income;

    if (changeIncome === "Monthly") {
      setStateIncome(parsedIncome);
    } else if (changeIncome === "Yearly") {
      setStateIncome(parsedIncome * 12);
    } else if (changeIncome === "Daily") {
      setStateIncome(parsedIncome / 30);
    }
  }, [changeIncome, income]);

  // When expenses or expense period changes, update totalExpenses
  useEffect(() => {
    if (allExpenses.length === 0) return; // Prevent running on empty array
    const total = getTotalExpensesByPeriod(allExpenses, changeHowMuch);
    setTotalExpenses(total);
  }, [allExpenses, changeHowMuch]);

  // Cycle income period: Monthly -> Yearly -> Daily -> Monthly
  const cycleIncomeType = () => {
    if (changeIncome === "Monthly") {
      setChangeIncome("Yearly");
    } else if (changeIncome === "Yearly") {
      setChangeIncome("Daily");
    } else if (changeIncome === "Daily") {
      setChangeIncome("Monthly");
    }
  };

  useEffect(() => {
    // Ensure expenses are converted properly
    let convertedExpenses = getTotalExpensesByPeriod(
      allExpenses,
      changeBalance
    );

    let calculatedBalance = income; // Start with base income

    if (changeBalance === "Yearly") {
      calculatedBalance = income * 12; // Convert Monthly Income → Yearly
    } else if (changeBalance === "Daily") {
      calculatedBalance = income / 30; // Convert Monthly Income → Daily
    }

    // Subtract expenses (already converted)
    calculatedBalance -= convertedExpenses;

    setTotalBalance(calculatedBalance);
  }, [income, changeBalance, allExpenses]);

  // Cycle expense period: Monthly -> Yearly -> Daily -> Monthly
  const cycleExpenseType = () => {
    if (changeHowMuch === "Monthly") {
      setChangeHowMuch("Yearly");
    } else if (changeHowMuch === "Yearly") {
      setChangeHowMuch("Daily");
    } else if (changeHowMuch === "Daily") {
      setChangeHowMuch("Monthly");
    }
  };

  ///// cycle balance period : monthly -> yearly -> daily -> monthly

  const cycleBalanceType = () => {
    if (changeBalance === "Monthly") {
      setChangeBalance("Yearly");
    } else if (changeBalance === "Yearly") {
      setChangeBalance("Daily");
    } else if (changeBalance === "Daily") {
      setChangeBalance("Monthly");
    }
  };

  ////// state and function of the total expenses that was taken by the component expenses :)

  const [openSearch, setOpenSearch] = useState(false);

  Mousetrap.bind("ctrl+k", () => {
    setOpenSearch(!openSearch);
  });

  Mousetrap.bind("esc", () => {
    setOpenSearch(false);
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setSearchResults([]); // Clear results if empty
      return;
    }

    const results = multiItems
      .map((item) => {
        // Check if main label matches
        const mainMatch = item.label.toLowerCase().includes(query);

        // Check if any `more` items match
        const subMatches =
          item.more?.filter((sub) =>
            Object.values(sub)
              .join(" ") // Convert object values to a single string
              .toLowerCase()
              .includes(query)
          ) || [];

        // ✅ If main matches but no sub-matches, keep all `more` items
        if (mainMatch && subMatches.length === 0) {
          return { ...item, more: item.more || [] }; // Keep all sub-items
        }

        // ✅ If there's a match in `more`, keep only matched sub-items
        if (subMatches.length > 0) {
          return { ...item, more: subMatches };
        }

        return null; // Otherwise, filter out this item
      })
      .filter(Boolean); // Remove null values

    setSearchResults(results);
  };

  useEffect(
    () => {
      handleSearch({ target: { value: searchQuery } });
    },
    [changeIncome, stateIncome, changeHowMuch, totalExpenses.toFixed(2)],
    totalBalance,
    changeBalance
  );

  const multiItems = useMemo(
    () => [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <MdDashboard style={{ width: "30px", height: "30px" }} />,
        more: [
          {
            balance: "Total Balance",
            icon: <MdWallet style={{ width: "30px", height: "30px" }} />,
            money: totalBalance.toFixed(2),
            date: changeBalance,
          },
          {
            balance: "Total Income",
            icon: <MdWallet style={{ width: "30px", height: "30px" }} />,
            money: stateIncome,
            date: changeIncome,
          },
        ],
      },
      {
        id: "store",
        label: "Expenses",
        icon: <MdStore style={{ width: "30px", height: "30px" }} />,
        more: [
          {
            nameExpense: "Expense",
            icon: <MdPayments style={{ width: "30px", height: "30px" }} />,
            money: allExpenses[1],
            date: changeHowMuch,
          },
          {
            expense: "Total Expenses",
            icon: <MdPayments style={{ width: "30px", height: "30px" }} />,
            money: totalExpenses.toFixed(2),
            date: changeHowMuch,
          },
        ],
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
    ],
    [stateIncome, changeIncome, allExpenses, totalExpenses, changeHowMuch]
  );

  return (
    <div>
      <div className="flex w-full">
        {/* Drawer */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { duration: 0.7 } }}
          className="drawer-finly w-1/5 fixed left-0 top-0 bottom-0"
          style={{ zIndex: 500 }}
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
            className=" flex items-center justify-end w-full gap-3"
            style={{ zIndex: 10 }}
          >
            <button
              onClick={() => setOpenSearch(!openSearch)}
              className="cursor-pointer px-3 w-[250px] flex gap-2 justify-between items-center rounded-md border border-[rgba(222,222,222,0.2)] p-1 focus:outline-0"
            >
              {" "}
              <div className="flex items-center gap-2">
                <label>
                  <MdOutlineSearch style={{ color: "rgba(222,222,222,0.6)" }} />
                </label>
                <p className="text-sm font-light text-[rgba(222,222,222,0.6)]">
                  Quick Search
                </p>
              </div>
              <label>
                <p className="text-sm font-light text-[rgba(222,222,222,0.6)]">
                  Ctrl K
                </p>
              </label>
            </button>
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
                  changeHowMuch={changeHowMuch}
                  setChangeHowMuch={setChangeHowMuch}
                  cycleExpenseType={cycleExpenseType}
                  cycleBalanceType={cycleBalanceType}
                  changeBalance={changeBalance}
                  totalBalance={totalBalance}
                  chooseInfo={chooseInfo}
                  data={data}
                  COLORS={COLORS}
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
          {openSearch && (
            <AnimatePresence>
              {openSearch && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.5 } }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                  className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center"
                  style={{ zIndex: 3000 }}
                  onClick={() => setOpenSearch(false)} // Closes when clicking outside modal
                >
                  {/* Modal */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      transition: { duration: 0.4 },
                    }}
                    exit={{
                      scale: 0.8,
                      opacity: 0,
                      transition: { duration: 0.3 },
                    }}
                    className="search bg-[#141718] p-6 rounded-xl shadow-lg w-[550px] h-[350px] overflow-y-auto border border-[rgba(222,222,222,0.2)]"
                    style={{ zIndex: 4000 }}
                    onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
                  >
                    {/* Header */}
                    <div
                      className="flex justify-between items-center mb-4 gap-3"
                      style={{
                        borderBottom: "3px solid rbga(222,222,222,0.2)",
                      }}
                    >
                      <label htmlFor="">
                        <MdOutlineSearch />
                      </label>
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full p-2 rounded-lg focus:outline-0 bg-transparent -ml-2"
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                      <button
                        onClick={() => setOpenSearch(false)}
                        className="text-gray-500 hover:text-gray-700 bg-transparent text-sm font-light border border-[rgba(222,222,222,0.1)] p-0.5"
                      >
                        esc
                      </button>
                    </div>

                    {/* Search Input */}

                    {searchResults.length > 0 ? (
                      <ul className=" space-y-2">
                        {searchResults.map((item) => (
                          <li
                            key={item.id}
                            className=" p-3 border-b border-gray-300"
                          >
                            {/* Main Item */}
                            <div
                              onClick={() => chooseInfo(item.id)}
                              className="flex cursor-pointer hover:text-[#8CE163] transition-colors items-center gap-3 text-lg font-semibold w-fit "
                            >
                              {item.icon} {/* ✅ Keep icon aligned left */}
                              <span>{item.label}</span>
                            </div>

                            {/* Sub-items (if any) */}
                            {item.more?.length > 0 && (
                              <ul className="ml-10 mt-2 space-y-1">
                                {item.more.map((sub, index) => (
                                  <li
                                    key={index}
                                    className="pl-2 cursor-not-allowed border-l-4 border-gray-400 text-gray-600 text-sm flex items-center gap-2"
                                  >
                                    {/* Nested Icon if available */}
                                    {sub.icon && (
                                      <span className="text-gray-500 ">
                                        {sub.icon}
                                      </span>
                                    )}

                                    {/* Prevent [object Object] by filtering non-string/non-number values */}
                                    <span>
                                      {Object.values(sub)
                                        .filter(
                                          (val) => typeof val !== "object"
                                        ) // Remove objects
                                        .join(" - ")}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          Type to search...
                        </p>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
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
  changeHowMuch,
  setChangeHowMuch,
  cycleExpenseType,
  cycleBalanceType,
  changeBalance,
  totalBalance,
  chooseInfo,
  data,
  COLORS,
}) {
  const allInfo = [
    {
      name: "Total Balance",
      icon: (
        <MdWallet style={{ color: "#8DE163", width: "22px", height: "22px" }} />
      ),
      income: totalBalance,
      currency: userData.currency,
      button: cycleBalanceType,
      buttonText: changeBalance,
    },
    {
      name: "Total Income",
      icon: (
        <MdWallet style={{ color: "#8DE163", width: "22px", height: "22px" }} />
      ),
      income: stateIncome,
      currency: userData.currency,
      button: cycleIncomeType,
      buttonText: changeIncome,
    },
    {
      name: "Total Expenses",
      icon: (
        <MdPayments
          style={{ color: "#8DE163", width: "22px", height: "22px" }}
        />
      ),
      income: totalExpenses,
      currency: userData.currency,
      button: cycleExpenseType,
      buttonText: changeHowMuch,
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
              style={{ border: "1px solid rgba(222,222,222,0.2)" }}
            >
              <div className="flex items-center gap-4 justify-between">
                <p className="font-light text-sm text-gray-400">{info.name}</p>
                <div className="flex flex-row-reverse items-center gap-1">
                  <div className="bg-[#212c24] p-1 rounded-md">{info.icon}</div>
                  <button
                    className="bg-[#252923] border border-[#3e453b] text-xs font-light text-[#d8dcd6]"
                    onClick={info.button}
                  >
                    {info.buttonText}
                  </button>
                </div>
              </div>
              <h1 className="font-semibold text-base flex items-center gap-1">
                <p className="text-2xl">{info.currency}</p>
                <p className="text-2xl">{info.income.toFixed(2)}</p>
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
                {["Daily", "Monthly", "Yearly"].map((period) => (
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
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <div className="cardTask bg-[#] max-w-[650px]  rounded-xl p-2 flex flex-col gap-4 max-h-[450px] overflow-y-auto">
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
                <div className="expen  text-3xl font-semibold flex flex-col gap-4 w-full items-center justify-center">
                  No Expenses Yet
                  <button
                    onClick={() => chooseInfo("store")}
                    className="bg-button text-[#000] text-sm font-medium w-[200px]"
                  >
                    Create Expenses
                  </button>
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
      <div className="flex flex-col items-center justify-center w-full -mt-5 gap-5 ml-20 overflow-y-auto h-[500px]">
        {expenses.length > 0 ? (
          expenses.map((info) => (
            <div
              key={info.id || `${info.nameExpense}-${info.howMuch}`}
              className="flex flex-col rounded-xl px-2 border border-[rgb(222,222,222,0.2)] bg-[#141718] py-3 text-lg text-white transition-colors  active:bg-zinc-900 "
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
