import { useEffect, useState, useCallback, useMemo } from "react";
import Avatar from "@mui/material/Avatar";
import { AnimatePresence, motion } from "motion/react";
import logo from "./assets/tag-svgrepo-com.svg";
import { formatDistanceToNow, parseISO } from "date-fns";
import MouseTrap from "mousetrap";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";
import {
  MdDashboard,
  MdStore,
  MdPieChart,
  MdWallet,
  MdCategory,
  MdSettings,
  MdOutlineNotifications,
  MdOutlineClose,
  MdDelete,
  MdEdit,
  MdPayments,
  MdOutlineSearch,
  MdCheck,
  MdEmojiEvents,
  MdOutlineQuestionMark,MdBubbleChart 
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
      title: "Utilities",
      items: [
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
      ],
    },
    {
      title: "Customization",
      items: [
        {
          id: "goal",
          label: "Goal",
          icon: <MdEmojiEvents style={{ width: "30px", height: "30px" }} />,
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
      ],
    },
    {
      title: "Other",
      items: [
        {
          id: "settings",
          label: "Settings",
          icon: <MdSettings style={{ width: "30px", height: "30px" }} />,
        },
        {
          id: "help",
          label: "Help",
          icon: (
            <MdOutlineQuestionMark style={{ width: "30px", height: "30px" }} />
          ),
        },
      ],
    },
  ];

  ///// search functions /////

  const [showInfo, setShowInfo] = useState("dashboard");

  const chooseInfo = (info) => {
    setShowInfo(info);
    setOpenSearch(false);
    setSearchQuery("");
    setNotificationDrawer(false);
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
    /// this is for the dashboard pie
    { name: "Remaining Balance", value: Number(totalBalance.toFixed(2)) },
    { name: "Total Expenses", value: Number(totalExpenses.toFixed(2)) },
  ];

  const categoryTotals = allExpenses.reduce((acc, expense) => {
    if (acc[expense.category]) {
      acc[expense.category] += Number(expense.howMuch);
    } else {
      acc[expense.category] = Number(expense.howMuch);
    }
    return acc;
  }, {});

  const COLORS2 = ["#8CE163", "#75C14D", "#5FA038", "#497F25", "#325E14"]; // Light → Dark

  // 🔹 Convert grouped data into Pie Chart format
  const data2 = Object.entries(categoryTotals).map(([category, value]) => ({
    name: category,
    value: value, // No need to use `.toFixed(2)` here, Recharts handles it
  }));

  const sortedData = [...data2].sort((a, b) => b.value - a.value);

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
  const [notification, setNotification] = useState(0); /// state for the notification
  const [notify, setNotify] = useState("");
  const [notificationDrawer, setNotificationDrawer] = useState(false);
  const [notifyRemove, setNotifyRemove] = useState("");
  ///// the stored expenses in the local storage

  const [daily, setDaily] = useState("Daily"); //// state that will work with expenses

  const dateDaily = [
    { date: "Daily" },
    { date: "Monthly" },
    { date: "Yearly" },
  ];

  const handleSubmitExpenses = () => {
    if (!nameExpense.length || !category.length || howMuch.trim() === "0") {
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

    // 🔹 Retrieve previous count correctly
    const previousNotification =
      Number(localStorage.getItem("notification")) || 0;
    const updatedNotification = previousNotification + 1;

    // 🔹 Update localStorage and state
    localStorage.setItem("notification", updatedNotification);
    setNotification(updatedNotification);

    // 🔹 Store multiple messages in localStorage
    const existingMessages = JSON.parse(localStorage.getItem("messages")) || [];
    const updatedMessages = [...existingMessages, "Expense added successfully"];

    localStorage.setItem("messages", JSON.stringify(updatedMessages));
    setNotify(updatedMessages);

    // Clear input fields
    setNameExpense("");
    setCategory("");
    setHowMuch("");
    setDaily("Daily");
    setOpenExpense(false);
  };

  useEffect(() => {
    const savedNotifications =
      Number(localStorage.getItem("notification")) || 0;
    setNotification(savedNotifications);

    const storedMessages = JSON.parse(localStorage.getItem("messages")) || [];
    setNotify(storedMessages);
  }, []);

  const [shortTime, setShortTime] = useState("");

  useEffect(() => {
    const expenses = JSON.parse(localStorage.getItem("allExpenses")) || [];

    const updatedExpenses = expenses.map((expense) => ({
      ...expense,
      addedTime: formatDistanceToNow(parseISO(expense.id), { addSuffix: true }), // Update each expense's relative time
    }));

    setAllExpenses(updatedExpenses);
  }, []);

  const openNotification = () => [
    setNotificationDrawer((prev) => !prev),
    setNotification(0),
    localStorage.setItem("notification", 0),
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationDrawer) {
        const drawer = document.getElementById("bg-tracker");
        if (drawer && !drawer.contains(event.target)) {
          setNotificationDrawer(false);
        }
      }
    };

    if (notificationDrawer) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [notificationDrawer]);

  const removeExpense = (id) => {
    ///// remove and update the specific expense you choose on the dashboard and the expenses component
    const updateExpenses = allExpenses.filter((expense) => expense.id !== id);
    setAllExpenses(updateExpenses);
    localStorage.setItem("allExpenses", JSON.stringify(updateExpenses));

    (localStorage.getItem("notification") || 0) - 1;

    const previousNotification =
      Number(localStorage.getItem("notification")) || 0;
    const updatedNotification = previousNotification + 1;

    // 🔹 Update localStorage and state
    localStorage.setItem("notification", updatedNotification);
    setNotification(updatedNotification);

    // 🔹 Store multiple messages in localStorage
    const existingMessages = JSON.parse(localStorage.getItem("messages")) || [];
    const updatedMessages = [
      ...existingMessages,
      "Expense removed successfully",
    ];

    localStorage.setItem("messages", JSON.stringify(updatedMessages));
    setNotifyRemove(updatedMessages);
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

  const convertExpense = (amount, expensePeriod, targetPeriod) => {
    if (expensePeriod === targetPeriod) return amount; // No conversion needed

    if (targetPeriod === "Monthly") {
      if (expensePeriod === "Yearly") return amount / 12; // ✅ Yearly → Monthly
      if (expensePeriod === "Daily") return amount * 30.4; // ✅ Daily → Monthly (approximate)
    }

    if (targetPeriod === "Daily") {
      if (expensePeriod === "Yearly") return amount / 365; // ✅ Yearly → Daily (should be smaller)
      if (expensePeriod === "Monthly") return amount / 30.4; // ✅ Monthly → Daily
    }

    if (targetPeriod === "Yearly") {
      if (expensePeriod === "Monthly") return amount * 12; // ✅ Monthly → Yearly
      if (expensePeriod === "Daily") return amount * 365; // ✅ Daily → Yearly
    }

    return amount; // Fallback case
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
    const periodOrder = ["Monthly", "Yearly", "Daily"];
    const currentIndex = periodOrder.indexOf(changeHowMuch);
    const nextIndex = (currentIndex + 1) % periodOrder.length;
    const newPeriod = periodOrder[nextIndex];

    const totalConverted = getTotalExpensesByPeriod(allExpenses, newPeriod);
    setTotalExpenses(totalConverted);
    setChangeHowMuch(newPeriod);
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

            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className="w-full">
                {/* Section Title */}
                <p className="text-sm font-light text-[rgba(222,222,222,0.6)] uppercase mt-10 text-start pl-4">
                  {section.title}
                </p>

                {/* Section Items */}
                {section.items.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => chooseInfo(item.id)}
                    className={`dash w-full px-10 ${index === 0 ? "mt-5" : "mt-3"}`}
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
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div
          id="bg-tracker"
          className="bg-tracker   text-[#fff] items-center pr-10 pt-5"
        >
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
            <div onClick={openNotification} className="relative cursor-pointer">
              <MdOutlineNotifications
                style={{ width: "25px", height: "25px" }}
              />
              {notification > 0 ? (
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full border border-[#dedede]"></div>
              ) : (
                ""
              )}
            </div>
            <AnimatePresence>
              {notificationDrawer && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0, transtion: { duration: 0.5 } }}
                  exit={{ opacity: 0, y: -10, transtion: { duration: 0.5 } }}
                  className="drawerNotifaction absolute mt-36 mr-16 p-2"
                >
                  <div className="flex flex-col items-start gap-3">
                    <h2 className="text-[#fff] font-medium text-lg">
                      Notifications
                    </h2>
                    {notify && notify.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <MdCheck
                          style={{
                            backgroundColor: "#212C24",
                            color: "rgb(140, 225, 99)",
                            borderRadius: "10px",
                            padding: "3px",
                            width: "20px",
                            height: "20px",
                          }}
                        />
                        <p className="text-sm font-light text-[#dedede] relative">
                          {notify[notify.length - 1]}{" "}
                          {/* Latest notification message */}
                        </p>
                      </div>
                    ) : null}

                    {notifyRemove && notifyRemove.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <MdCheck
                          style={{
                            backgroundColor: "#212C24",
                            color: "rgb(140, 225, 99)",
                            borderRadius: "10px",
                            padding: "3px",
                            width: "20px",
                            height: "20px",
                          }}
                        />
                        <p className="text-sm font-light text-[#dedede] relative">
                          {notifyRemove[notifyRemove.length - 1]}{" "}
                          {/* Latest removed notification */}
                        </p>
                      </div>
                    ) : null}

                    {/* If neither exist, show "No Notifications Yet" */}
                    {notify.length === 0 && notifyRemove.length === 0 && (
                      <p>No Notifications Yet</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
              {showInfo === "analytic" && (
                <Analytic
                  data2={data2}
                  totalBalance={totalBalance}
                  allExpenses={allExpenses}
                  userData={userData}
                  totalExpenses={totalExpenses}
                  changeBalance={changeBalance}
                  changeHowMuch={changeHowMuch}
                  COLORS2={COLORS2}
                  sortedData={sortedData}
                  chooseInfo={chooseInfo}
                  setNotify={setNotify}
                  setNotification={setNotification}
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
    <div className="flex flex-col items-center justify-center gap-5 h-screen">
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

            <div className="flex items-end gap-4 ">
              <div className="flex gap-2">
                <p className="text-sm font-light text-[#dedede] text-start">
                  To check your chart press Both
                  <b className="text-[#8CE163]"> Balance</b> and{" "}
                  <b className="text-[#8CE163]">Expenses</b> dates for the chart
                  to calculate.Check{" "}
                  <a href="">
                    <em className="text-[#dedede] font-extralight text-sm underline decoration-solid">
                      Help
                    </em>
                  </a>{" "}
                  for more details
                </p>
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
                        <b className="text-[#fff] font-medium">{info.howMuch}</b>
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
    <div className="exp flex flex-col items-center justify-center gap-5 h-screen">
      <div className="flex flex-col gap-2 w-[50%]">
        <h1 className="text-4xl font-medium text-[#fff]  text-start mt-10">
          Expenses
        </h1>
        <p className="text-start text-[#dedede] font-normal text-md">
          Let's see what we've got to do today.
        </p>
      </div>
      <div className="expensess flex flex-col items-center justify-center  mt-5 gap-5 ml-28 overflow-y-auto h-[400px] py-6 w-fit">
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

        <div className="fixed bottom-2 left-1/2 w-full max-w-xl -translate-x-1/2 px-4">
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
      <div className="empty h-12"></div>
    </div>
  );
}

const Analytic = ({
  data2,
  allExpenses,
  userData,
  totalExpenses,
  changeBalance,
  changeHowMuch,
  COLORS2,
  sortedData,
  chooseInfo,
  setNotify,
  setNotification
}) => {
  // functions are here because they dont need to be passed to another components

  const [analyze, setAnalyze] = useState(false); //// start the analyze 
  const [goalChecker, setGoalChecker] = useState(false); //// checker if you want the goal or if you want the proceed
  const [analyzeExpense,setAnalyzeExpense]=useState(false)

  const letsAnalyze = () => {
    setAnalyze(true);

    setTimeout(() => {
      setAnalyze(false);
      setGoalChecker(true);
    }, 12000);
  };


  const letsProceed = () => {
    if (allExpenses.length === 0) {
      setAnalyzeExpense(true);
    } else {
      setAnalyzeExpense(false);
    }
  };
  
  useEffect(() => {
    if (analyzeExpense) {

      const previousNotification =
      Number(localStorage.getItem("notification")) || 0;
    const updatedNotification = previousNotification + 1;

    // 🔹 Update localStorage and state
    localStorage.setItem("notification", updatedNotification);
    setNotification(updatedNotification);

      const existingMessages = JSON.parse(localStorage.getItem("messages")) || [];
      const updatedMessages = [...existingMessages, "Analyze was unsuccessful"];
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
      setNotify(updatedMessages);
    }
  }, [analyzeExpense]);

  const resetAll=()=>{
    setAnalyze(false)
    setGoalChecker(false)
    setAnalyzeExpense(false)
  }

  const text = "Do you want to apply your goal to the analytics? If yes, please proceed or you can analyze otherwise.";

  const text2 ="There is not expense to analyze your finance , please create some expense to start anaylzing"
  
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.02, delayChildren: 0.5 * i },
    }),
  };

  const letterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  

  return (
    <div className="exp flex flex-col items-center justify-center gap-5 h-screen">
      {/* Page Title */}
      <div className="flex flex-col gap-2 w-[50%]">
        <h1 className="text-4xl font-medium text-[#fff] text-start mt-10">
          Analytics
        </h1>
        <p className="text-start text-[#dedede] font-normal text-md">
          Check where you can make improvements
        </p>
      </div>
      {/* Content Container */}
      <div className="flex items-start justify-center w-full">
        {/* Pie Chart (Shows Expenses by Category) */}
        <div className="flex flex-col items-center w-[70%]">
          {data2.length > 0 ? (
            <ResponsiveContainer width="80%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={sortedData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  fill="#8CE163"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {sortedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS2[index % COLORS2.length]} // Cycle through colors
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[#dedede] font-bold text-3xl text-center h-[50vh] flex flex-col items-center justify-center">No expenses recorded yet <em onClick={() => chooseInfo('store')} className="font-light text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer">Create Expenses to continue analyze</em></p>
          )}

          {/* Show Total Expenses */}
          <div className="flex items-center gap-2 ">
            <p className="text-xl flex items-center gap-2 font-semibold text-[#fff]">
              Total: {userData.currency}
              {Number(totalExpenses.toFixed(2))}
              <p className="text-md text-[#dedede] font-light">
                {changeHowMuch}
              </p>
            </p>
          </div>
          <button
            onClick={letsAnalyze}
            className="bg-button mt-4 text-[#000] w-[200px] flex items-center justify-center"
          >
            {analyze === true ? (
              <div className="loader "></div>
            ) : (
              <p>Let's Analyze</p>
            )}
          </button>
        </div>
        <hr className="h-full w-0.5 bg-[rgba(222,222,222,0.3)] ml-3"></hr>
        {/* Analyze Content */}
        <div className="analyzerContent overflow-y-auto overflow-x-hidden h-[500px] pl-2 text-start w-[20%]">
        {(!analyze && goalChecker === false) ? ( 
  <div className="flex flex-col items-center justify-center gap-4">
    <MdBubbleChart style={{ color: "#8CE163", width: "50px", height: "50px" }} />
    <h1 className="text-lg font-semibold text-[#fff]">Nothing Analyzed Yet</h1>
    <p className="text-sm font-light text-[#dedede] text-center">
      Click the button to start analyzing your finances
    </p>
  </div>
) : null}

        {analyze === true ? (
            <p className="analyzing-text text-md font-medium">Analyzing..</p>
          ) : (
            goalChecker && "Proceed.."
          )}
          {goalChecker && (
            <motion.p
            className="text-sm font-light mt-2.5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            
            {text.split("").map((char, index) => (
              <motion.span key={index} variants={letterVariants}>
                {char}
              </motion.span>
            ))}
            <p className="mt-1">
              <em className="font-light text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer">Add Goal </em> 
              or <em className="font-light text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer"
              onClick={letsProceed}
              >Proceed</em></p>
          </motion.p>
          
          )}
          {analyzeExpense && 
           <motion.p
           className="text-sm font-light mt-2.5"
           variants={containerVariants}
           initial="hidden"
           animate="visible"
         >
           {text2.split("").map((char, index) => (
             <motion.span key={index} variants={letterVariants}>
               {char}
             </motion.span>
           ))}

          <em className="font-light ml-1 text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer"
              onClick={resetAll}
              > Reset</em>
         </motion.p>
          }
        </div>
      </div>
      {/* Empty space */}
      <div className="empty h-12"></div>
    </div>
  );
};
