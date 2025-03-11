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
  
} from "recharts";
import { BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';

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
  MdEmojiEvents,MdMenu ,MdClose ,MdOutlineDashboard ,MdPieChartOutline ,MdOutlineCategory ,MdOutlineWallet ,
  MdOutlineQuestionMark,MdBubbleChart ,MdOutlineWarning ,MdMenuBook ,MdOutlineCalendarToday,MdInfoOutline   
} from "react-icons/md";
import analyticImg from './images/Analytics.svg'
import { HiUser } from "react-icons/hi2";
import { HiUserGroup } from "react-icons/hi2";
import goalphoto from './images/Capture.jpg'
import expensephoto from './images/Capture2.jpg'
import progressphoto from './images/Capture3.jpg'
import { useNavigate, useParams } from "react-router-dom";
import { FaChartPie, FaPlusCircle, FaWallet, FaThLarge } from "react-icons/fa";
import { BsFillGridFill,BsGrid  } from "react-icons/bs";
import { FaRegChartBar, FaRegListAlt, FaRegPlusSquare } from "react-icons/fa";

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
          label: "Cash Flow",
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
            <MdMenuBook  style={{ width: "30px", height: "30px" }} />
          ),
        },
      ],
    },
  ];

  ///// search functions /////

  const [showInfo, setShowInfo] = useState("dashboard");

   const navigate = useNavigate();
  const { section } = useParams(); // Get the current section from URL

  const chooseInfo = (id) => {
    navigate(`/tracker/${id}`);
    setOpenSearch(false);
    setSearchQuery("");
    setNotificationDrawer(false);
    setDrawer(false)
  };

  const checkExpenses = () => {
    setShowInfo("store");
  };

  const [openExpense, setOpenExpense] = useState(false);

  const createExpense = useCallback(() => setOpenExpense((prev) => !prev));
  const createGoal =useCallback(()=>setOpenGoal((prev)=>!prev))

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

     
      // ✅ Fix: Ensure `converted` is always assigned a value
      let converted = convertExpense
        ? convertExpense(amt, expensePeriod, targetPeriod)
        : 0;

   
      return acc + converted;
    }, 0);
  };

    const COLORS = ["#8CE163", "#75C14D", "#5FA038", "#497F25", "#325E14"]; // Light → Dark

 

 const convertAmount = (amount, targetPeriod) => {
  if (targetPeriod === "Monthly") return amount;
  if (targetPeriod === "Yearly") return amount * 12;
  if (targetPeriod === "Daily") return amount / 30;
  return amount;
};
const totalSavings = userData.income - totalExpenses

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
      setAllExpenses((prevExpenses) => [...prevExpenses, newExpense]); // ✅ Ensures correct state update
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
  localStorage.setItem("allExpenses", JSON.stringify(allExpenses));
}, [allExpenses]); // ✅ Syncs storage every time allExpenses changes


  useEffect(() => {
    const savedNotifications =
      Number(localStorage.getItem("notification")) || 0;
    setNotification(savedNotifications);

    const storedMessages = JSON.parse(localStorage.getItem("messages")) || [];
    setNotify(storedMessages);
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
  const [bind1,setBind1]=useState('ctrl')
  const [bind2,setBind2]=useState('+k')
  const [bind3,setBind3]=useState('esc')

  Mousetrap.bind(bind1 + bind2 , () => {
    setOpenSearch(!openSearch);
  });

  Mousetrap.bind(bind3, () => {
    setOpenSearch(false);
  });

useEffect(()=>{
const storedBinds = JSON.parse(localStorage.getItem("mousebinds")) || { bind1: 'ctrl', bind2: '+k', bind3: 'esc' };

setBind1(storedBinds.bind1);
setBind2(storedBinds.bind2);
setBind3(storedBinds.bind3);

},[])

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

const [analyzeTime,setAnalyzeTime]=useState("")

useEffect(()=>{

  const analyzedTime = localStorage.getItem("analyzedTime")

  if (analyzedTime) {
  setAnalyzeTime(analyzedTime); // Correct function name
}

},[])


 const [totalGp,setTotalGp]=useState(0)

useEffect(() => {
  const goal = localStorage.getItem("allGoal");

  if (goal) {
    const parsedGoals = JSON.parse(goal); // Parse the string into an array
    const totalPrice = parsedGoals.reduce((sum, goal) => sum + goal.priceGoal, 0); // Sum all priceGoal values
    setTotalGp(totalPrice); // Update state with total sum
  }
}, []);

   const [sales,setSales]=useState([])
  
  useEffect(()=>{
  const existingBusiness = JSON.parse(localStorage.getItem("setupBusiness")) || [];
  if(existingBusiness){
    setSales(existingBusiness)
  }
  },[])

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
        more: [
         
          {
            expense: "Last Analyzed",
            icon: <MdBubbleChart  style={{ width: "30px", height: "30px" }} />,
            money: analyzeTime,
          },
        ],
      },
      {
        id: "goal",
        label: "Goal",
        icon: <MdEmojiEvents  style={{ width: "30px", height: "30px" }} />,
        more: [
       
          {
            expense: "Total Goals",
            icon: <MdPayments  style={{ width: "30px", height: "30px" }} />,
            money: totalGp,
          },
        ],
      },
      {
        id: "cash flow",
        label: "Cash Flow",
        icon: <MdWallet style={{ width: "30px", height: "30px" }} />,
         more: [
          {
            expense: "Sales Overview",
            icon: <HiUserGroup  style={{ width: "30px", height: "30px" }} />,
            money: sales,
          },
        ],
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



  const [userGoal,setUserGoal]=useState("") //// name of the goal
  const [categoryGoal,setCategoryGoal]=useState("") /// name the category of goal 
  const [priceGoal,setPriceGoal]=useState(0)///  price of the goal 
  const [allGoal,setAllGoal]=useState([]) //// array of the goals
  const [notifyGoal,setNotifyGoal]=useState("")//// notificaton for the goal complete
  const [openGoal,setOpenGoal]=useState(false)/// the form that opens for goal 
  

  const handleSubmitGoal=()=>{
    if (!userGoal.length || !categoryGoal.length || priceGoal.trim() === "0") {
      return;
    }
    
    if (!userGoal || !categoryGoal || priceGoal <= 0) {
    return;
  }


    const now = new Date().toISOString(); // Store timestamp
    const relativeTime = formatDistanceToNow(new Date(now), {
      addSuffix: true,
    });

    const newGoal = {
      id: now,
      userGoal,
      categoryGoal,
      priceGoal:Number(priceGoal),
      addedTime: relativeTime,
    };

    const updatedGoal = [...allGoal, newGoal];
    setAllGoal(updatedGoal);
    localStorage.setItem("allGoal", JSON.stringify(updatedGoal));

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
    setNotifyGoal(updatedMessages);

    // Clear input fields
    setUserGoal("");
    setCategoryGoal("");
    setPriceGoal("")
    setOpenGoal(false);
  }


useEffect(() => {
  const storedGoals = JSON.parse(localStorage.getItem('allGoal')) || [];
  setAllGoal(storedGoals);
}, []);

 const categoryGoals = allGoal.reduce((acc, goal) => {
    if (acc[goal.categoryGoal]) {
      acc[goal.categoryGoal] += Number(goal.priceGoal);
    } else {
      acc[goal.categoryGoal] = Number(goal.priceGoal);
    }
    return acc;
  }, {});

const data3 = Object.entries(categoryGoals).map(([category, value]) => ({
    name: category,
    value: value, // No need to use `.toFixed(2)` here, Recharts handles it
  }));

  const sortedData2 = [...data3].sort((a, b) => b.value - a.value);

    const removeGoal = (id) => {
    ///// remove and update the specific expense you choose on the dashboard and the expenses component
    const updatedGoal = allGoal.filter((goal) => goal.id !== id);
    setAllGoal(updatedGoal);
    localStorage.setItem("allGoal", JSON.stringify(updatedGoal));

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
      "Goal removed Successfully",
    ];

    localStorage.setItem("messages", JSON.stringify(updatedMessages));
    setNotifyRemove(updatedMessages);
  };

  const [activeTab,setActiveTab]=useState("")


const [chartSystem, setChartSystem] = useState(() => {
  return localStorage.getItem("chartsystem") || "piechart";
});

const [progressSystem, setProgressSystem] = useState(() => {
  return localStorage.getItem("progressSystem") || "goalexpenses";
})

   const changeChart =(chart)=>{
    setChartSystem(chart)
    localStorage.setItem("chartsystem",chart)
   }


   const changeProgress =(progress)=>{
    setProgressSystem(progress)
   localStorage.setItem("progressSystem",progress)
   }

useEffect(() => {
  const storedChart = localStorage.getItem("chartsystem");
  if (storedChart) setChartSystem(storedChart);

  const storedProgress = localStorage.getItem("progressSystem");
  if (storedProgress) setProgressSystem(storedProgress);
}, []);


  const [businessArray,setBusinessArray]=useState([])

  const [notifSettings,setNotifSettings]=useState(true)

  const updateNotif = ()=>{
    setNotifSettings((prev) => !prev)
    localStorage.setItem("notifSettings",notifSettings)
  }

  const [drawer,setDrawer]=useState(false)

const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

    const [activeTab2, setActiveTab2] = useState("dashboard"); // Default active

  return (
    <div>
      <div className="flex w-full">
        {drawer && 
        <div onClick={()=>setDrawer(false)} className={`backdrop fixed left-0 sm:block hidden top-0 bottom-0 right-0 z-[400]`}>
         <button onClick={()=>setDrawer(false)}  className="bg-transparent fixed sm:block bottom-0 top-4 right-4 z-[500] h-fit block xl:hidden rounded-md p-1"><MdClose  style={{color:'rgba(222,222,222,0.9)',width:'30px',height:'30px'}}/></button>
        </div>
        }
        {/* Drawer */}
        {/* Bottom Navigation Bar (Mobile) */}
 <div className="fixed bottom-0 left-0 right-0 bg-[#121212] p-4 flex justify-between items-center shadow-lg z-[500] sm:hidden">
      <button
        onClick={() => {
          chooseInfo("dashboard");
          setActiveTab2("dashboard");
        }}
        className="text-white hover:text-[#8DE163]"
      >
        {activeTab2 === "dashboard" ? <MdDashboard size={24} /> : <MdOutlineDashboard size={24} />}
      </button>

      <button
        onClick={() => {
          chooseInfo("analytic");
          setActiveTab2("analytic");
        }}
        className="text-white hover:text-[#8DE163]"
      >
        {activeTab2 === "analytic" ? <MdPieChart  size={24} /> : <MdPieChartOutline size={24} />}
      </button>

      {/* Centered "+" Button */}
      <motion.button
        onClick={handleOpenModal}
        className="bg-[#8DE163] p-4 rounded-full shadow-lg text-white relative -top-4"
        whileTap={{ scale: 0.9 }}
      >
        <FaPlusCircle size={28} />
      </motion.button>

      <button
        onClick={() => {
          chooseInfo("wallet");
          setActiveTab2("cashflow");
        }}
        className="text-white hover:text-[#8DE163]"
      >
        {activeTab2 === "cashflow" ? <MdWallet size={24} /> : <MdOutlineWallet  size={24} />}
      </button>

      <button
        onClick={() => {
          chooseInfo("category");
          setActiveTab2("category");
        }}
        className="text-white hover:text-[#8DE163]"
      >
        {activeTab2 === "category" ? <MdCategory size={24} /> : <MdOutlineCategory size={24} />}
      </button>
    </div>
 <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-[500]"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => chooseInfo("store")} className="text-lg font-bold text-[#121212] hover:text-[#8DE163]">
                Create Expense
              </button>
              <button onClick={() => chooseInfo("goal")} className="text-lg font-bold text-[#121212] hover:text-[#8DE163]">
                Create Goal
              </button>
              <button onClick={handleCloseModal} className="text-sm text-gray-500 mt-2">
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        <AnimatePresence>
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { duration: 0.7 } }}
          exit={{x:-100,opacity:0,transition:{duration:0.7}}}
          key={drawer}
        className={`drawer-finly cursor-pointer fixed left-0 top-0 bottom-0 z-[500] 
              ${drawer ? "w-full block" : "hidden xl:block w-1/5"}`}
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
                    <div className={`flex items-center cursor-pointer gap-3 transition-colors font-medium ${
  String(section) === String(item.id) ? "text-[#8DE163] font-bold" : "text-[#fff]"
} hover:text-[#8DE163]`}>
    {item.icon} {item.label}
  </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
        </AnimatePresence>
        

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
              className="cursor-pointer pl-1 xl:pl-0 px-0 xl:px-3 w-fit xl:w-[250px] flex gap-2 justify-between items-center rounded-md border border-[rgba(222,222,222,0.2)] p-1 focus:outline-0"
            >
              {" "}
              <div className="flex items-center gap-2">
                <label>
                  <MdOutlineSearch style={{ color: "rgba(222,222,222,0.6)" }} />
                </label>
                <p className="text-sm font-light hidden xl:flex text-[rgba(222,222,222,0.6)]">
                  Quick Search
                </p>
              </div>
              <label>
                <p className="text-sm font-light hidden xl:flex text-[rgba(222,222,222,0.6)]">
                  {bind1}{bind2}
                </p>
              </label>
            </button>
           <AnimatePresence>
             {notifSettings &&
            <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            transition={{duration:0.2}}
            onClick={openNotification} className={`relative cursor-pointer bg-[#1A1A1A] rounded-md border border-[rgba(222,222,222,0.2)]`}>
              <MdOutlineNotifications
                style={{ width: "25px", height: "25px",color:'rgba(222,222,222,0.6)' }}
              />
              {notification > 0 ? (
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full border border-[#dedede]"></div>
              ) : (
                ""
              )}
            </motion.div>
            }
           </AnimatePresence>
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
                        {notify[notify.length === 0] ? <MdOutlineWarning  style={{
                            backgroundColor: "#3a3a0b",
                            color: "#e1e163",
                            borderRadius: "10px",
                            padding: "3px",
                            width: "20px",
                            height: "20px",scale:'1.2'
                          }}/> :  <MdCheck 
                          style={{
                            backgroundColor: "#212C24",
                            color: "rgb(140, 225, 99)",
                            borderRadius: "10px",
                            padding: "3px",
                            width: "20px",
                            height: "20px",
                          }}
                        />}
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
            <h1 className="text-base hidden xl:block font-light text-[#fff]">
              {userData.name}
            </h1>
            <button 
            onClick={()=>setDrawer((prev)=>!prev)}
            className="bg-[#1A1A1A] sm:block hidden xl:hidden border border-[rgba(222,222,222,0.2)] rounded-md p-1"><MdMenu style={{color:'rgba(222,222,222,0.6)',width:'20px',height:'20px'}}/></button>         
            <button 
            onClick={()=>chooseInfo('settings')}
            className="bg-[#1A1A1A] sm:hidden block border border-[rgba(222,222,222,0.2)] rounded-md p-1"><MdSettings style={{color:'rgba(222,222,222,0.6)',width:'20px',height:'20px'}}/></button>
             </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={section} // ✅ Ensures correct animation behavior
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
            >
              {section === "dashboard" && (
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
                  setChangeBalance={setChangeBalance}
                  changeBalance={changeBalance}
                  totalBalance={totalBalance}
                  chooseInfo={chooseInfo}
                  data={data}
                  COLORS={COLORS}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  allGoal={allGoal}
                  convertAmount={convertAmount}
                  totalSavings={totalSavings}
                  convertExpense={convertExpense}
                  chartSystem={chartSystem}
                  progressSystem={progressSystem}
                  businessArray={businessArray}
                />
              )}
              {section === "store" && (
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
              {section === "analytic" && (
                <Analytic
                  data2={data2}
                  data3={data3}
                  totalBalance={totalBalance}
                  allExpenses={allExpenses}
                  userData={userData}
                  totalExpenses={totalExpenses}
                  changeBalance={changeBalance}
                  changeHowMuch={changeHowMuch}
                  COLORS2={COLORS2}
                  sortedData={sortedData}
                  sortedData2={sortedData2}
                  chooseInfo={chooseInfo}
                  setNotify={setNotify}
                  setNotification={setNotification}
                  allGoal={allGoal}
                  setAnalyzeTime={setAnalyzeTime}
                  
                />
              )}
               {section === "goal" && (
                <Goal 
                userGoal={userGoal}
                removeGoal={removeGoal}
                setUserGoal={setUserGoal}
                categoryGoal={categoryGoal}
                setCategoryGoal={setCategoryGoal}
                priceGoal={priceGoal}
                setPriceGoal={setPriceGoal}
                openGoal={openGoal}
                allGoal={allGoal}
                handleSubmitGoal={handleSubmitGoal}
                createGoal={createGoal}
                userData={userData}/>
              )}
               {section === "wallet" && (
                <Wallet 
                totalExpenses={totalExpenses}
                totalBalance={totalBalance}
                userData={userData}
                expenses={allExpenses}
                income={income}
                businessArray={businessArray}
                setBusinessArray={setBusinessArray}
                />
              )}
              {section === "category" && (
                <Category 
                chartSystem={chartSystem}
                changeChart={changeChart}
                setChartSystem={setChartSystem}
                COLORS={COLORS}
                progressSystem={progressSystem}
                setProgressSystem={setProgressSystem}
                changeProgress={changeProgress}
                />
              )}
               {section === "settings" && (
                <Settings 
                userData={userData}
                notifSettings={notifSettings}
                updateNotif={updateNotif}
                bind1={bind1}
                bind2={bind2}
                bind3={bind3}
                setBind1={setBind1}
                setBind2={setBind2}
                setBind3={setBind3}
                />
              )}
              {section === "help" && (
                <Help />
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
                        {bind3}
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


const MobileNavbar = ({ chooseInfo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#121212] p-4 flex justify-between items-center shadow-lg z-50">
        <button onClick={() => chooseInfo("dashboard")} className="text-white hover:text-[#8DE163]">
          <FaThLarge size={24} />
        </button>
        <button onClick={() => chooseInfo("analytics")} className="text-white hover:text-[#8DE163]">
          <FaChartPie size={24} />
        </button>
        
        {/* Centered "+" Button */}
        <motion.button
          onClick={handleOpenModal}
          className="bg-[#8DE163] p-4 rounded-full shadow-lg text-white relative -top-4"
          whileTap={{ scale: 0.9 }}
        >
          <FaPlusCircle size={28} />
        </motion.button>
        
        <button onClick={() => chooseInfo("cashflow")} className="text-white hover:text-[#8DE163]">
          <FaWallet size={24} />
        </button>
        <button onClick={() => chooseInfo("category")} className="text-white hover:text-[#8DE163]">
          <BsFillGridFill size={24} />
        </button>
      </div>

      {/* Modal for Create Expense & Goal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => chooseInfo("createExpense")} className="text-lg font-bold text-[#121212] hover:text-[#8DE163]">
                Create Expense
              </button>
              <button onClick={() => chooseInfo("createGoal")} className="text-lg font-bold text-[#121212] hover:text-[#8DE163]">
                Create Goal
              </button>
              <button onClick={handleCloseModal} className="text-sm text-gray-500 mt-2">
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
  setChangeBalance,
  totalBalance,
  chooseInfo,
  data,
  COLORS,
  activeTab,
  setActiveTab,
  allGoal,convertAmount,convertExpense,
  chartSystem,progressSystem,businessArray
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

  
const totalGoals = allGoal.reduce((sum, goal) => sum + Number(goal.priceGoal || 0), 0);

const totalSavings = userData.income - totalExpenses

const totalSavedForGoals = totalSavings > 0 ? totalSavings : 0;

const [totalBalanceForGoal,setTotalBalanceForGoal]=useState(0)

useEffect(()=>{

  const balance = totalSavedForGoals

  if(progressView === 'Monthly'){
setTotalBalanceForGoal(balance)
  }else if (progressView === 'Daily'){
    setTotalBalanceForGoal(balance / 30)
  }else if (progressView === 'Yearly'){
   setTotalBalanceForGoal(balance * 12)
  }
},[])

const [progressView, setProgressView] = useState('Monthly');
    const [chartView, setChartView] = useState('Expenses vs Goals');
  const [previousView, setPreviousView] = useState('Monthly');
  const [pieData, setPieData] = useState([]);
  const [circleChartData, setCircleChartData] = useState([]);
  const [expenseProgress, setExpenseProgress] = useState(0);
  const [goalProgress, setGoalProgress] = useState(0);

  //// functions to switch between charts in the catergory section /// 

   
const updatePieData = (view) => {
  let data = [];

  switch (view) {
    case 'Expenses vs Goals':
      data = [
        { name: 'Total Expenses', value: totalExpenses || 0 },
        { name: 'Total Goals', value: totalGoals || 0 }
      ];
      break;

    case 'Balance (Daily/Monthly/Yearly)':
      data = [
        { name: 'Daily Balance', value: convertAmount(totalBalance, 'Daily') || 0 },
        { name: 'Monthly Balance', value: convertAmount(totalBalance, 'Monthly') || 0 },
        { name: 'Yearly Balance', value: convertAmount(totalBalance, 'Yearly') || 0 }
      ];
      break;

    case 'Balance vs Goals':
      data = [
        { name: 'Total Balance', value: totalBalance || 0 },
        { name: 'Total Goals', value: totalGoals || 0 }
      ];
      break;

    case 'Balance vs Expenses':
      data = [
        { name: 'Total Balance', value: totalBalance || 0 },
        { name: 'Total Expenses', value: totalExpenses || 0 }
      ];
      break;

    default:
      data = [];
  }

  console.log("Updated Pie Data:", data); // Debugging
  setPieData(data);
  setCircleChartData(data);  // Now updating circle chart with same data
};

useEffect(() => {
  updatePieData(chartView);
}, [chartView, totalBalance, totalExpenses, totalGoals]);

const [barChartData, setBarChartData] = useState([]);

const updateBarChartData = (view) => {
  let data = [];

  switch (view) {
    case 'Expenses vs Goals':
      data = [
        { name: 'Total Expenses', value: Number(totalExpenses) },
        { name: 'Total Goals', value: Number(totalGoals) }
      ];
      break;

    case 'Balance (Daily/Monthly/Yearly)':
      data = [
        { name: 'Daily Balance', value: Number(convertAmount(totalBalance, 'Daily')) },
        { name: 'Monthly Balance', value: Number(convertAmount(totalBalance, 'Monthly')) },
        { name: 'Yearly Balance', value: Number(convertAmount(totalBalance, 'Yearly')) }
      ];
      break;

    case 'Balance vs Goals':
      data = [
        { name: 'Total Balance', value: Number(totalBalance) },
        { name: 'Total Goals', value: Number(totalGoals) }
      ];
      break;

    case 'Balance vs Expenses':
      data = [
        { name: 'Total Balance', value: Number(totalBalance) },
        { name: 'Total Expenses', value: Number(totalExpenses) }
      ];
      break;

    default:
      data = [];
  }

  setBarChartData(data);
};

useEffect(() => {
  updateBarChartData(chartView);
}, [chartView, totalBalance, totalExpenses, totalGoals]);




const updateProgressData = (view) => {
  const adjustedExpenses = convertAmount(totalExpenses, view);
  const adjustedGoals = convertAmount(totalGoals, view);

  const newExpenseProgress = Math.min((adjustedExpenses / userData.income) * 100, 100);
  const newGoalProgress = totalGoals > 0
    ? Math.min((adjustedSavings / adjustedGoals) * 100, 100)
    : 0;

  setExpenseProgress(newExpenseProgress);
  setGoalProgress(newGoalProgress);
};




const handleProgressViewChange = (view) => {
  setProgressView(view);
  updateProgressData(view);
  setIncomeUsed(view)
};


const adjustedSavings = convertAmount(totalSavings, progressView);
const adjustedGoals = convertAmount(totalGoals, progressView);

const [incomeUsed,setIncomeUsed]=useState('')
const [expenseForProgress,setExpenseForProgress]=useState(0)

useEffect(()=>{
  const expenseMoney = totalExpenses
    if(incomeUsed === "Monthly"){
      setExpenseForProgress(expenseMoney)
    }else if (incomeUsed === "Daily"){
      setExpenseForProgress(expenseMoney / 30)
    }else if (incomeUsed === "Yearly"){
      setExpenseForProgress(expenseMoney * 12)
    }
},[incomeUsed])


const [chooseProgress,setChooseProgress]=useState('goals')

  return (
    <div className="flex flex-col items-center justify-center gap-5 h-full">
      <div className="flex flex-col items-center w-full mt-10 gap-5">
        <div className="flex flex-col lg:flex-row items-center gap-20 justify-end w-full">
          {allInfo.map((info, index) => (
            <div
              key={index}
              className="incomeD grid  bg-[#141718] rounded-xl p-3 text-center flex flex-col gap-2 w-[270px]"
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
        <div className="flex flex-col lg:flex-row w-[100%] justify-evenly xl:justify-end items-center gap-8 xl:gap-4">
          <div
            className="bg-[#141718] p-6 rounded-xl shadow-lg w-[60%] xl:w-[52%]"
            style={{
              border: "1px solid rgb(222,222,222,0.2)",
            }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <h2 className="text-lg font-semibold mb-4"> Finances Breakdown</h2>
              <select
                onChange={(e) => setChartView(e.target.value)}
                value={chartView}
                className="border border-[#8CE163] bg-transparent text-[#8CE163] py-2 px-3 rounded text-sm font-light outline-none"
              >
                <option value="Expenses vs Goals" className="bg-[#141718] text-[#8CE163]">
                  Expenses vs Goals
                </option>
                <option value="Balance (Daily/Monthly/Yearly)" className="bg-[#141718] text-[#8CE163]">
                  Balance (D/M/Y)
                </option>
                <option value="Balance vs Goals" className="bg-[#141718] text-[#8CE163]">
                  Balance vs Goals
                </option>
                <option value="Balance vs Expenses" className="bg-[#141718] text-[#8CE163]">
                  Balance vs Expenses
                </option>
              </select>
            </div>

            <div className="flex justify-center gap-4  mb-4">
                <div className="flex justify-center space-x-4 mb-4">
<p className="text-start px-2 font-light text-sm text-[#dedede]">
  Select an option on the right to view a detailed financial breakdown.  
  Changing <em className="font-light text-sm text-[rgb(156,163,175)]">Total Balance -  
    <b className="text[rgb(216,220,214)] font-light text-sm rounded-md border border-[#3E453B] bg-[#252923] p-0.5 mt-1.5">Monthly</b>
  </em> and  
  <em className="font-light text-sm text-[rgb(156,163,175)]">Total Expenses -  
    <b className="text[rgb(216,220,214)] font-light text-sm rounded-md border border-[#3E453B] bg-[#252923] p-0.5 mt-1.5">Monthly</b>
  </em> will also update the chart.For more please check <em className="font-light underline decoration-solid text-sm text-[rgb(156,163,175)]"> 
    Help
  </em>
</p>

      </div>
            </div>

            <div className="flex items-start justify-center">
              <ResponsiveContainer width="100%" height={330}>

               <>
  {/* If pieData is empty and the Pie Chart is selected, show a message */}
  {chartSystem === 'piechart' && pieData.length === 0 ? (
    <div className="h-full flex flex-col-reverse gap-2 items-center justify-center text-xl font-medium text-center">
      <img width="300px" height="300px" src={analyticImg} />
      Create some Expenses and Goals for the pie chart to work
    </div>
  ) : null}

  {/* Render Pie Chart if there is data */}
  {chartSystem === 'piechart' && pieData.length > 0 && (
    <PieChart width={560} className="piechart" height={275}>
      <Pie
        data={pieData}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
        label={({ name, value, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
 <Tooltip
    contentStyle={{
      backgroundColor: '#2d2f31', // Dark background
      borderRadius: '8px', 
      border: 'none', 
      color: '#ffffff', // White text
    }}
    cursor={{ fill: 'rgba(140, 225, 99, 0.3)' }} 
     itemStyle={{ color: "#ffffff" }}// Light green hover effect instead of grey
  />    </PieChart>
  )}

  {/* Render Bar Chart if selected */}
  {chartSystem === 'barchart' && (
    <BarChart width={500} height={275} data={barChartData} className="barchart" style={{marginTop:"25px"}}>
      <XAxis dataKey="name" />
      <YAxis />
 <Tooltip
    contentStyle={{
      backgroundColor: '#2d2f31', // Dark background
      borderRadius: '8px', 
      border: 'none', 
      color: '#ffffff', // White text
    }}
    cursor={{ fill: 'rgba(140, 225, 99, 0.3)' }} // Light green hover effect instead of grey
  />      <Legend />
      <Bar dataKey="value" fill="#8ce163" stackId="a" name="Data" />
    </BarChart>
  )}

  {/* If circleChartData is empty and Circle Chart is selected, show a message */}
  {chartSystem === 'circlechart' && circleChartData.length === 0 ? (
    <div className="h-full flex flex-col-reverse gap-2 items-center justify-center text-xl font-medium text-center">
      No data available for the circle chart.
    </div>
  ) : null}

  {/* Render Circle Chart if there is data */}
  {chartSystem === 'circlechart' && circleChartData.length > 0 && (
    <PieChart width={650} height={275} className="circlechart">
      <Pie
        data={circleChartData}
        cx={270}
        cy={160}
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
         labelStyle={{
      fill: "#ffffff", // White text color
      fontSize: "14px",
      fontWeight: "bold",
    }}
        label={({ name, value, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
      >
        {circleChartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
       <Tooltip
    contentStyle={{
      backgroundColor: '#2d2f31', // Dark background
      borderRadius: '8px', 
      border: 'none', 
      color: '#ffffff', // White text
    }}
    cursor={{ fill: 'rgba(140, 225, 99, 0.3)' }} 
     itemStyle={{ color: "#ffffff" }}// Light green hover effect instead of grey
  />
    </PieChart>
  )}
</>


            </ResponsiveContainer>

            </div>
          </div>
          <div>
            <div className="cardTask bg-[#] max-w-[650px]  rounded-xl p-2 flex flex-col gap-4 max-h-[450px] overflow-y-auto">
        {progressSystem === 'goalexpenses' && 
         <h2 className="text-lg font-semibold mb-2 flex flex-col items-center"> Progress Breakdown 
          <select
           onChange={(e) => setChooseProgress(e.target.value)}
          value={chooseProgress}
           className="border border-none bg-transparent text-[#8CE163] py-2 px-3 rounded text-sm font-light outline-none"
          >
            <option value="goals" className="bg-[#141718] text-[#8CE163]">Goal Progress</option>
            <option value="expense" className="bg-[#141718] text-[#8CE163]">Expense Progress</option>
          </select>
         </h2>
        }
        {progressSystem === 'business' && 
         <h2 className="text-lg font-semibold mb-2 flex flex-col items-center"> Business Breakdown 
         </h2>
        }
<div className="flex flex-col items-center gap-4">
    {progressSystem ==="goalexpenses" && 
    <div>
     {/* Expense Progress */}
    {chooseProgress === 'expense' && 
    <div className="bg-[#1b1f21] rounded-xl p-4 text-white shadow-lg">
      <h2 className="text-lg font-semibold mb-2">Expense Progress</h2>
      
       {["Daily", "Monthly", "Yearly"].map((view) => {
  const expenseAmount = convertAmount(totalExpenses, view);
  const incomeAmount = convertAmount(stateIncome, view);
  const expensePercentage = incomeAmount > 0 ? Math.min((expenseAmount / incomeAmount) * 100, 100).toFixed(1) : 0;

  return (
    <div key={view} className="mb-3">
      <p className="text-sm text-gray-400">{view} Expenses</p>
      <p className="text-lg font-bold text-red-400">
        {expenseAmount.toFixed(2)} / {incomeAmount.toFixed(2)} {userData.currency}
      </p>
      <div className="w-full bg-gray-800 rounded-full h-3">
        <div
          className="bg-red-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${expensePercentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-400 mt-1">{expensePercentage}% of income spent</p>
    </div>
  );
})}

    </div>
}
    {/* Goal Progress */}
    {chooseProgress === 'goals' && 
    <div className="bg-[#1b1f21] rounded-xl p-4 text-white shadow-lg">
      <h2 className="text-lg font-semibold mb-2">Goal Progress</h2>
   {["Daily", "Monthly", "Yearly"].map((view) => {
  const savingsAmount = convertAmount(totalSavings, view);
  const goalAmount = convertAmount(totalGoals, view);
  const goalPercentage = goalAmount > 0 ? Math.min((savingsAmount / goalAmount) * 100, 100).toFixed(1) : 0;

  return (
    <div key={view} className="mb-3">
      <p className="text-sm text-gray-400">{view}</p>
      <p className="text-lg font-bold text-[#63e163]">
        {savingsAmount.toFixed(2)} / {goalAmount.toFixed(2)} {userData.currency}
      </p>
      <div className="w-full bg-gray-800 rounded-full h-3">
        <div
          className="bg-[#63e163] h-3 rounded-full transition-all duration-500"
          style={{ width: `${goalPercentage}%` }}
        ></div>
      </div>
      {/* Displaying the percentage below the progress bar */}
      <p className="text-xs text-gray-400 mt-1">{goalPercentage}% of goal achieved</p>
    </div>
  );
})}

    </div>
    }
    </div>
    }
    {progressSystem === "business" && 
    <div>
       {businessArray.length === 0 ? (
  <p>Please submit Business fields for the finances to appear</p>
) : (
  businessArray.map((bus, index) => (
    <div className="flex flex-col items-start gap-2 bg-[#1B1F21] text-[#8CE163] p-2 border border-[#3e453b] rounded-lg shadow-md" key={index}>
       <div className="mb-2">
      <p className="text-lg font-semibold flex items-center gap-1 text-[#fff]"><MdOutlineCalendarToday style={{color:'#8CE163'}}/> Daily Overview</p>
      <p className="flex justify-between text-sm">
        <span className="font-light text-[#dedede]">Revenue:</span> 
        <span className="font-medium">{userData.currency}{bus.sold * bus.cost}</span>
      </p>
      <p className="flex justify-between text-sm">
        <span className="font-light text-[#dedede]">Profit:</span> 
        <span className="font-medium">{userData.currency}{(bus.sold * bus.cost) - bus.be}</span>
      </p>
    </div>

      {/* Monthly Totals */}
      <div className="border-t border-gray-600 pt-2 mb-2">
      <p className="text-lg font-semibold flex items-center gap-1 text-[#fff]"><MdOutlineCalendarToday style={{color:'#8CE163'}}/> Monthly Overview</p>
      <p className="flex justify-between text-sm">
        <span className="font-light text-[#dedede]">Revenue:</span> 
        <span className="font-medium">{userData.currency}{bus.sold * bus.cost * 30}</span>
      </p>
      <p className="flex justify-between text-sm">
        <span className="font-light text-[#dedede]">Profit:</span> 
        <span className="font-medium">{userData.currency}{(bus.sold * bus.cost * 30) - (bus.be * 30)}</span>
      </p>
    </div>


      {/* Yearly Totals */}
     <div className="border-t border-gray-600 pt-2">
      <p className="text-lg font-semibold flex items-center gap-1 text-[#fff]"><MdOutlineCalendarToday style={{color:'#8CE163'}}/> Yearly Overview</p>
      <p className="flex justify-between text-sm">
        <span className="font-light text-[#dedede]">Revenue:</span> 
        <span className="font-medium">{userData.currency}{bus.sold * bus.cost * 365}</span>
      </p>
      <p className="flex justify-between text-sm">
        <span className="font-light text-[#dedede]">Profit:</span> 
        <span className="font-medium">{userData.currency}{(bus.sold * bus.cost * 365) - (bus.be * 365)}</span>
      </p>
    </div>
    </div>
  ))
)}
    </div>
    }        
    
  </div>

            </div>
            
          </div>
        </div>
      </div>
      <div className="empty h-26"></div>
       <div className="empty h-26"></div>
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
}) 



{
  return (
    <div className="exp flex flex-col items-center justify-center gap-5 h-screen">
      <div className="flex flex-col gap-2 w-[100%] pl-6 xl:pl-0 xl:w-[50%]">
        <h1 className="text-4xl font-medium text-[#fff]  text-start mt-10">
          Expenses
        </h1>
        <p className="text-start text-[#dedede] font-normal text-md">
          Let's see what we've got to do today.
        </p>
      </div>
      <div className="expensess flex flex-col grid-cols-1 gap-6 xl:grid xl:grid-cols-2 xl:gap-5 ml-24 xl:ml-32 overflow-y-auto h-[calc(100vh-50px)] py-4 w-fit">
        {expenses.length > 0 ? (
          expenses.map((info) => (
            <div
              key={info.id || `${info.nameExpense}-${info.howMuch}`}
              className="flex flex-col rounded-xl px-2 border h-fit border-[rgb(222,222,222,0.2)] bg-[#141718] py-3 text-lg text-white transition-colors  active:bg-zinc-900 "
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
                  <b className="text-[#fff] font-medium"> {info.category.slice(0,10)}</b>
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
          <div className="expen text-3xl font-semibold h-full text-center flex items-center justify-center -mr-14">No Expenses Yet</div>
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
  data3,
  allExpenses,
  userData,
  totalExpenses,
  changeBalance,
  totalBalance,
  changeHowMuch,
  COLORS2,
  sortedData,
  chooseInfo,
  setNotify,
  setNotification,
  allGoal,
  sortedData2,setAnalyzeTime
}) => {
  // functions are here because they dont need to be passed to another components

  const [analyze, setAnalyze] = useState(false); //// start the analyze 
  const [goalChecker, setGoalChecker] = useState(false); //// checker if you want the goal or if you want the proceed
  const [analyzeExpense,setAnalyzeExpense]=useState(false)
  const [analyzeExpense2 ,setAnalyzeExpense2]=useState(false)
  const [continueAnalyze,setContinueAnalyze]=useState(false) //// state for the response of the analyzer number 2
  const [continueMessage,setContinueMessage]=useState("") //// message for the response of the analyzer number 2
  const [goal,setGoal]=useState(false)/// state for the goal to check if there is any goal or not 
  const [continueLess,setContinueLess]=useState(false)
  const [lessMessage,setLessMessage]=useState("")

  const letsAnalyze = () => {
    setAnalyze(true);

    setTimeout(() => {
      setAnalyze(false);
      setGoalChecker(true);
      setAnalyzeExpense(false)
      setGoal(false)
    }, 12000);
  };


  const letsProceed = () => {
    // Only set `analyzeExpense` if no expenses exist.
    if (allExpenses.length === 0) {
      setAnalyzeExpense(true);  // Show no expenses message
      setAnalyzeExpense2(false); // Hide category analysis message
      
    } else {
      setAnalyzeExpense2(true);  // Show category analysis message
      setAnalyzeExpense(false);
      
    }
  };
  

  
  useEffect(() => {   ///analyzing if there is no expense notification is sent 
    if (analyzeExpense === true && allExpenses.length === 0) {

      const previousNotification =
      Number(localStorage.getItem("notification")) || 0;
    const updatedNotification = previousNotification + 1;

    // 🔹 Update localStorage and state
    localStorage.setItem("notification", updatedNotification);
    setNotification(updatedNotification);

      const existingMessages = JSON.parse(localStorage.getItem("messages")) || [];
      const updatedMessages = [...existingMessages, "Analyze was unsuccessfull"];
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
      setNotify(updatedMessages);
      
    }
  }, [analyzeExpense]);

 


  useEffect(() => {
    if (analyzeExpense2  === true && allExpenses.length > 0) {
      const totalExpenses = allExpenses.reduce((acc, expense) => acc + Number(expense.howMuch), 0);
      const categoryTotals = allExpenses.reduce((acc, expense) => {
        if (acc[expense.category]) {
          acc[expense.category] += Number(expense.howMuch);
        } else {
          acc[expense.category] = Number(expense.howMuch);
        }
        return acc;
      }, {});
  
      const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
      const highestCategory = sortedCategories[0];
  
      if (highestCategory) {
        const highestCategoryPercentage = (highestCategory[1] / totalExpenses) * 100;
        setHighestCategoryMessage(`You can try to lower your expenses in the ${highestCategory[0]} category, which accounts for ${highestCategoryPercentage.toFixed(1)}% of your total expenses.`);
      }
    }
  }, [analyzeExpense2 , allExpenses]);

  const [highestCategoryMessage, setHighestCategoryMessage] = useState("");

  useEffect(()=>{

    if(continueAnalyze){
      const expenses = totalExpenses
      const balance = totalBalance
      const dayForExpense = changeHowMuch
      const dayForBalance = changeBalance
     const currency =userData.currency
      if(balance > expenses){
        setContinueMessage(`Your Balance which is ${balance}${currency} per ${dayForBalance} is much higher than your Expenses which is ${expenses}${currency} per ${dayForExpense}`)
      }else{
        setContinueMessage(`Your Balance which is ${balance} per ${dayForBalance} is much lower than your Expenses which is ${expenses} per ${dayForExpense}.Do you want me to help you constructing so you can have less expenses.`)
      }
    }

  },[continueAnalyze])

  const [changeFunction,setChangeFunction]=useState(false)

  useEffect(()=>{ //// useEffect that changes the function of the button 

    const expenses = totalExpenses
    const balance = totalBalance
    
  if(balance < expenses){
    setChangeFunction(true)
  }else{
    setChangeFunction(false)
  }    

  },[continueAnalyze,continueMessage])

  const [sortedCategories, setSortedCategories] = useState([]);
  const [adjustedCategories, setAdjustedCategories] = useState([]);
  

  useEffect(() => {
    if (continueLess === true && allExpenses.length > 0) {
      const totalExpenses = allExpenses.reduce((acc, expense) => acc + Number(expense.howMuch), 0);
            const categoryTotals = allExpenses.reduce((acc, expense) => {
              acc[expense.category] = (acc[expense.category] || 0) + Number(expense.howMuch);
              return acc;
            }, {});
  
      // Sort categories from highest to lowest expense
      const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  
      // Calculate the initial percentages
      const sortedWithPercentages = sortedCategories.map(([category, amount]) => {
        return {
          category,
          amount,
          percentage: (amount / totalExpenses) * 100
        };
      });
  
      setSortedCategories(sortedWithPercentages);
  
      // Calculate the adjusted expenses
      let adjustedExpenses = [...sortedWithPercentages];
      let adjustedTotal = totalExpenses;
      
      while (adjustedTotal > totalBalance) {
        adjustedExpenses = adjustedExpenses.map(exp => ({
          ...exp,
          amount: exp.amount * 0.92,  // Reduce each by 8%
          percentage: (exp.amount * 0.92 / totalExpenses) * 100
        }));
        adjustedTotal = adjustedExpenses.reduce((acc, exp) => acc + exp.amount, 0);
      }
  
      setAdjustedCategories(adjustedExpenses);
  
      // Set the highest category message
      const highestCategory = sortedCategories[0];
      if (highestCategory) {
        const highestCategoryPercentage = (highestCategory[1] / totalExpenses) * 100;
        setHighestCategoryMessage(`You can try to lower your expenses in the ${highestCategory[0]} category, which accounts for ${highestCategoryPercentage.toFixed(1)}% of your total expenses.`);
      }
    }
  }, [continueLess, allExpenses, totalBalance]);
  

  useEffect (()=>{

    const text = "Let's try by listing on order the expenses and make some changes untill the Expenses are lower to Balance"
  
    if(continueLess){
      setLessMessage(text)
    }
  },[continueLess,allExpenses])

  const [isReset, setIsReset] = useState(false);


  const resetAll = () => {
  setAnalyze(false);
  setGoalChecker(false);
  setAnalyzeExpense(false);
  setAnalyzeExpense2(false);
  setContinueAnalyze(false);
  setContinueLess(false);
  setIsReset(true);
setAnalyzeGoalAfter(false)
setGoalAnalyzer(false)
setGoalvsExpenses(false)
  const analyzedTime = new Date().toLocaleDateString(); // Formats the date
  localStorage.setItem("analyzedTime", analyzedTime);

  setAnalyzeTime(analyzedTime); // Also update state
};


  useEffect(() => {
    if (isReset) {
      const previousNotification = Number(localStorage.getItem("notification")) || 0;
      const updatedNotification = previousNotification + 1;
  
      // 🔹 Update localStorage and state
      localStorage.setItem("notification", updatedNotification);
      setNotification(updatedNotification);
  
      const existingMessages = JSON.parse(localStorage.getItem("messages")) || [];
      const updatedMessages = [...existingMessages, "Analyze was successfull"];
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
      setNotify(updatedMessages);
  
      // 🔹 Reset the state to prevent continuous triggering
      setIsReset(false);
    }
  }, [isReset]);


  /// All functions if goal is true and if it is false ////

  const [noGoal,setNoGoal]=useState("")
  const [goalAnalyzer,setGoalAnalyzer]=useState(false)
  const [goalAnalyzer2,setGoalAnalyzer2]=useState(false)
   const [changeMethods,setChangeMethods]=useState("expenses")


    // Calculate time to reach the goal based on savings

    // Assuming you can save the full balance towards the goal

useEffect(() => {
  const balanceAmount = parseFloat(totalBalance);

  if (allGoal.length === 0) {
    setNoGoal("You need a goal for the finchat to analyze.");
    return;
  }

  if (isNaN(balanceAmount) || balanceAmount <= 0) {
    setNoGoal("Invalid balance amount.");
    return;
  }

  const goalAnalysis = allGoal.map((goal) => {
    const goalPrice = parseFloat(goal.priceGoal);

    if (isNaN(goalPrice) || goalPrice <= 0) {
      return `${goal.userGoal}: Invalid goal price.`;
    }

    const dailySavings = balanceAmount / 30;
    const monthlySavings = balanceAmount;
    const yearlySavings = balanceAmount * 12;

    const daysToGoal = goalPrice / dailySavings;
    const monthsToGoal = goalPrice / monthlySavings;
    const yearsToGoal = goalPrice / yearlySavings;

    let resultMessage = "";

    if (daysToGoal <= 30) {
      resultMessage = `${Math.ceil(daysToGoal)} days`;
    } else if (monthsToGoal <= 12) {
      resultMessage = `${Math.ceil(monthsToGoal)} months`;
    } else {
      resultMessage = `${Math.ceil(yearsToGoal)} years`;
    }

    return {
      goalName: goal.userGoal,
      goalPrice: goalPrice.toFixed(2),
      timeToAchieve: resultMessage,
    };
  });

  setNoGoal(goalAnalysis);
}, [allGoal, goalAnalyzer, totalBalance]);



  

  const text = "Do you want to apply your goal to the analytics? If yes, please proceed or you can analyze otherwise.";

  const text2 ="There is no expense to analyze your finance , please create some expense to start anaylzing."
  
const text3 ="Give this a go and your Balance will stay higher than the Expenses thus making your Finances Better.Do you want to"

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
  
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,  // Delay between each list item
      },
    },
  };
  
  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };
  
  const charVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.05 },
    },
  };


  const [goalChanged,setGoalChanged]=useState(0)


useEffect(() => {
  const totalGoal = allGoal.reduce((acc, goal) => {
    const goalPrice = parseFloat(goal.priceGoal);

    return isNaN(goalPrice) || goalPrice <= 0 ? acc : acc + goalPrice;
  }, 0);

  setGoalChanged(totalGoal);
}, [allGoal]); // Dependency array ensures it updates when `allGoal` changes

const textGoal = "In order to achieve these goals with your current balance in "


const [goalvsExpenses,setGoalvsExpenses]=useState(false)
const [goalGood,setGoalGood]=useState('')
const [progress,setProgress]=useState(0)

useEffect(() => {
  // Sum all goals correctly
  const goalPrice = allGoal.reduce((sum, goal) => sum + (parseFloat(goal.priceGoal) || 0), 0);

  // Ensure balance and expenses are numbers
  const balance = parseFloat(totalBalance) || 0;
  const expenses = parseFloat(totalExpenses) || 0;

  // Remaining balance after expenses
  

  // Calculate remaining amount to cover the goal correctly
  const remainingAmountToGoal = Math.max(0, goalPrice - balance);

  const progressPercentage = goalPrice > 0 ? ((goalPrice - balance) / goalPrice) * 100 : 0;
  setProgress(progressPercentage);
  
  // Check if balance can cover both expenses and the goal
  if (balance >= goalPrice) {
    setGoalGood('Your balance will cover both the expenses and the goal!');
  } else if (balance >= 0 && balance < goalPrice) {
    setGoalGood(`Your balance will cover the expenses, but you still need ${remainingAmountToGoal.toFixed(2)} to reach your goal which will be `);
  } else {
    setGoalGood('Your balance is insufficient to cover expenses and the goal together. Do you want to ');
  }
  // Calculate progress percentage


}, [allGoal, allExpenses, totalBalance]);


const [goalAnalysis, setGoalAnalysis] = useState('');
const [analyzeGoalAfter, setAnalyzeGoalAfter] = useState(false);

    useEffect(() => {
  if (analyzeGoalAfter) {
    const goalPrice = allGoal.reduce((sum, goal) => sum + (parseFloat(goal.priceGoal) || 0), 0);
    const balance = parseFloat(totalBalance) || 0;
    const expenses = parseFloat(totalExpenses) || 0;

    const remainingAmountToGoal = goalPrice - balance;

    let analysisText = `📊 **Financial Analysis:**\n\n`;

    // ✅ **Case 1: User can afford everything**
    if (balance >= goalPrice) {
      analysisText += `✅ You can achieve all your goals immediately! 🎉`;
    } 
    // 🔹 **Case 2: Suggest Expense Adjustments**
    else if (balance >= 0 && balance < goalPrice) {
      let neededSavings = remainingAmountToGoal;
      let adjustableExpenses = [...allExpenses].sort((a, b) => a.howMuch - b.howMuch); // Sort from lowest to highest

      let reducedExpenses = [];
      let totalReduced = 0;

      for (let i = 0; i < adjustableExpenses.length; i++) {
        let expense = adjustableExpenses[i];

        if (totalReduced >= neededSavings) break; // Stop once enough has been saved

        let reductionAmount = Math.min(neededSavings - totalReduced, expense.howMuch); // Cut as much as needed
        totalReduced += reductionAmount;

        reducedExpenses.push({
          name: expense.nameExpense,
          newAmount: expense.howMuch - reductionAmount
        });
      }

      // ✅ If we managed to save enough, show the reduced expenses.
      if (totalReduced >= neededSavings) {
        analysisText += `💡 **Reduce these expenses to save for your goals:**\n`;
        reducedExpenses.forEach((expense, index) => {
          analysisText += `  ${index + 1}. ${expense.name}: $${expense.newAmount.toFixed(2)} (Adjusted)\n`;
        });
        analysisText += `\n✅ With these adjustments, you will reach your goals!\n`;
      } 
    } 
    // ⛔️ **Case 3: Balance is too low**
    else {
      analysisText += `⚠️ Your balance is too low to cover your expenses and goals. Consider adjusting your budget or increasing income.\n`;
    }

    setGoalAnalysis(analysisText);
  }
}, [analyzeGoalAfter, allGoal, allExpenses, totalBalance, totalExpenses]);






  return (
    <div className="exp flex flex-col items-center justify-center gap-5 h-full lg:h-screen">
      {/* Page Title */}
      <div className="flex flex-col gap-2 w-[100%] pl-10 xl:pl-0 xl:w-[50%]">
        <h1 className="text-4xl font-medium text-[#fff] text-start mt-10">
          Analytics
        </h1>
        <p className="text-start text-[#dedede] font-normal text-md">
          Check where you can make improvements
        </p>
      </div>
      {/* Content Container */}
      <div className="flex flex-col lg:flex-row items-start justify-center w-full">
        {/* Pie Chart (Shows Expenses by Category) */}
        <div className="flex flex-col items-center justify-end ml-[10%] w-[80%] lg:w-[65%]">
          {data2.length > 0 ? (
            <ResponsiveContainer  className=" w-[100%] lg:w-[60%]" height={300}>
              <div className="w-full items-end justify-end text-end ml-12 lg:ml-0">
                <select
                  value={changeMethods}
                  onChange={(e) => setChangeMethods(e.target.value)}
                  style={{
                    border: '1px solid #8CE163', // Green border
                    background: 'transparent',
                    color: 'inherit',
                    padding: '5px',
                    borderRadius: '4px',
                    outline: 'none',
                  }}
                >
                  <option value="expenses" className="bg-[#141718] text-[#8CE163]">Expenses</option>
                  <option value="goals" className="bg-[#141718] text-[#8CE163]">Goals</option>
                </select>

              </div>

             {changeMethods === 'expenses' && <PieChart>
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
              </PieChart>}
              {changeMethods === 'goals' &&  <PieChart>
                <Pie
                  dataKey="value"
                  data={sortedData2}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  fill="#8CE163"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {sortedData2.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS2[index % COLORS2.length]} // Cycle through colors
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>}
            </ResponsiveContainer>
          ) : (
            <p className="text-[#dedede] font-bold text-3xl text-center h-[50vh] flex flex-col items-center justify-center">No expenses recorded yet <em onClick={() => chooseInfo('store')} className="font-light text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer">Create Expenses to continue analyze</em></p>
          )}

          {/* Show Total Expenses */}
          <div className="flex items-center gap-2 mt-6">
            <p className="text-xl flex items-center gap-2 font-semibold text-[#fff]">
              {changeMethods === 'expenses' &&
             <div className="flex items-center gap-2  ">
               Total: {userData.currency}
              {Number(totalExpenses.toFixed(2))}
              <p className="text-md text-[#dedede] font-light">
                {changeHowMuch}
              </p>
             </div>
                    }
                    {changeMethods === 'goals' && 
                <div className="flex items-center gap-2">
               Total: {userData.currency}
               { (goalChanged.toFixed(2))}              
              <p className="text-md text-[#dedede] font-light">

              </p>
                    </div>
                    }
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
        <hr className="lg:h-full h-0.5 w-full lg:w-0.5 bg-[rgba(222,222,222,0.3)] mt-4 lg:mt-0 ml-3"></hr>
        {/* Analyze Content */}
        <div className="analyzerContent overflow-y-auto overflow-x-hidden h-[500px] pl-3 text-start w-full lg:w-[20%] flex-grow">
        {(!analyze && goalChecker === false) ? ( 
  <motion.div
  initial={{opacity:0}}
  animate={{opacity:1,transition:{duration:0.5,delay:0.3}}}
  className="flex flex-col items-center justify-center gap-4 h-full w-full">
    <MdBubbleChart style={{ color: "#8CE163", width: "50px", height: "50px" }} />
    <h1 className="text-lg font-semibold text-[#fff]">FinChat Analyzer</h1>
    <p className="text-sm font-light text-[#dedede] text-center">
      Click the button to start analyzing your finances
    </p>
  </motion.div>
) : null}

        {analyze === true ? (
            <p className="analyzing-text text-md font-medium">Analyzing..</p>
          ) : (
            goalChecker && ""
          )}
          {goalChecker && (
          <div className="flex flex-col mt-2.5">
             <motion.div
             initial={{opacity:0}}
             animate={{opacity:1,transition:{duration:0.5,delay:0.3}}}
             className="flex items-center gap-2" style={{color:'#8CE163'}}>
            <MdBubbleChart  style={{border:'1px solid #8CE163' ,borderRadius:'999px',padding:'1px' ,widht:'20px',height:'20px',scale:1.7}}/>
            <p className="text-lg font-semibold text-[#fff]">FinChat</p>
          </motion.div>
            <motion.p
            className="text-sm font-light mt-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            
            {text.split("").map((char, index) => (
              <motion.span key={index} variants={letterVariants}>
                {char}
              </motion.span>
            ))}
            <motion.p
            initial={{opacity:0}}
            animate={{opacity:1,transition:{delay:1.5,duration:0.7}}}
            className="mt-1 flex items-center gap-1">
              <em className="font-light text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer" onClick={()=>setGoalAnalyzer(true)}>Add Goal </em> 
               {goalAnalyzer === true ? '' :<div className="flex items-center gap-1">or <em className="font-light text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer"
              onClick={letsProceed}
              >Proceed</em></div> }</motion.p>
          </motion.p>
          </div>
          
          )}
      {goalAnalyzer && (
  <div className="flex flex-col mt-2.5">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.3 } }}
      className="flex items-center gap-2"
      style={{ color: '#8CE163' }}
    >
      <MdBubbleChart
        style={{
          border: '1px solid #8CE163',
          borderRadius: '999px',
          padding: '1.5px',
          width: '20px',
          height: '20px',
        }}
      />
      <p className="text-lg font-semibold text-[#fff]">FinChat</p>
    </motion.div>

    {Array.isArray(noGoal) && noGoal.length > 0 ? (
      <>
        <motion.p
          className="text-sm font-light mt-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {textGoal.split("").map((char, index) => (
    <motion.span key={index} variants={letterVariants}>
      {char}
    </motion.span>
  ))}
           <motion.span initial={{opacity:0}}
           animate={{opacity:1,trainsition:{dalay:0.5,duration:0.5}}}
           style={{ color: '#8CE163' }}>
            {changeBalance}
          </motion.span>
          {", you need:"}
        </motion.p>

        <ul className="list-none mt-2 pl-0">
          {noGoal.map((item, index) => (
            <motion.li
              key={index}
              in    itial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.3 + index * 0.2 } }}
              className="text-sm text-[rgba(222,222,222,0.9)] flex justify-between"
            >
              <span>{item.goalName} ({userData.currency} {item.goalPrice})</span>
              <span>{item.timeToAchieve}</span>
            </motion.li>
          ))}
        </ul>

        <p className="text-sm mt-2">
          Do you want to 
          {analyzeExpense2 === true ? '':<em
            className="font-light ml-1 text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer"
            onClick={() => setGoalvsExpenses(true)}
          >
            Check Goals with Expenses 
          </em>}

          {!analyzeExpense2 && !goalvsExpenses === true && 'or'}
          {goalvsExpenses === true ? '' :<em
            className="font-light ml-1 text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer"
            onClick={() => setAnalyzeExpense2(true)}
          >
            Proceed Analyzing Expenses
          </em>}
        </p>
      </>
    ) : (
      <motion.p
        className="text-sm font-light mt-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {noGoal.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
          >
            {char}
          </motion.span>
        ))}
        <br />
        <em
          className="font-light ml-1 text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer"
          onClick={() => chooseInfo("goal")}
        >
          Create Goal
        </em>
        or
        <em
          className="font-light ml-1 text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer"
          onClick={() => setAnalyzeExpense(true)}
        >
          Proceed Analyzing without a Goal
        </em>
      </motion.p>
    )}
  </div>
)}
{goalvsExpenses && 
            <div className="flex flex-col mt-2.5">
               <motion.div
               initial={{opacity:0}}
               animate={{opacity:1,transition:{duration:0.5,delay:0.3}}}
               className="flex items-center gap-2" style={{color:'#8CE163'}}>
            <MdBubbleChart  style={{border:'1px solid #8CE163' ,borderRadius:'999px',padding:'1.5px' ,widht:'20px',height:'20px'}}/>
            <p className="text-lg font-semibold text-[#fff]">FinChat</p>
          </motion.div>
           <motion.p
           className="text-sm font-light mt-1"
           variants={containerVariants}
           initial="hidden"
           animate="visible"
         >
           {goalGood.split("").map((char, index) => (
             <motion.span key={index} variants={letterVariants}>
               {char}
             </motion.span>
           ))}
            {totalBalance >= 0 && totalBalance < allGoal.reduce((sum, goal) => sum + (parseFloat(goal.priceGoal) || 0), 0) ?  <span className="font-light text-sm ml-0.5 text-[#8CE163]">{progress.toFixed(2)}% </span> : ''}
            
          <em className="font-light ml-1 text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer"
onClick={totalBalance >= 0 && totalBalance < allGoal.reduce((sum, goal) => sum + (parseFloat(goal.priceGoal) || 0), 0) 
  ? () => setAnalyzeGoalAfter(true) 
  : resetAll}
              > {totalBalance >= 0 && totalBalance < allGoal.reduce((sum, goal) => sum + (parseFloat(goal.priceGoal) || 0), 0) ? 'Achive Goals':'Finish Analyzing'}</em>
         </motion.p>
            </div>
          }
{analyzeGoalAfter && 
            <div className="flex flex-col mt-2.5">
               <motion.div
               initial={{opacity:0}}
               animate={{opacity:1,transition:{duration:0.5,delay:0.3}}}
               className="flex items-center gap-2" style={{color:'#8CE163'}}>
            <MdBubbleChart  style={{border:'1px solid #8CE163' ,borderRadius:'999px',padding:'1.5px' ,widht:'20px',height:'20px'}}/>
            <p className="text-lg font-semibold text-[#fff]">FinChat</p>
          </motion.div>
           <motion.p
           className="text-sm font-light mt-1"
           variants={containerVariants}
           initial="hidden"
           animate="visible"
         >
           {goalAnalysis.split("").map((char, index) => (
             <motion.span key={index} variants={letterVariants}>
               {char}
             </motion.span>
           ))}
            
          <em className="font-light ml-1 text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer"
              onClick={resetAll}
              > Finish Analyzing</em>
         </motion.p>
            </div>
          }
          {analyzeExpense && 
            <div className="flex flex-col mt-2.5">
               <motion.div
               initial={{opacity:0}}
               animate={{opacity:1,transition:{duration:0.5,delay:0.3}}}
               className="flex items-center gap-2" style={{color:'#8CE163'}}>
            <MdBubbleChart  style={{border:'1px solid #8CE163' ,borderRadius:'999px',padding:'1.5px' ,widht:'20px',height:'20px'}}/>
            <p className="text-lg font-semibold text-[#fff]">FinChat</p>
          </motion.div>
           <motion.p
           className="text-sm font-light mt-1"
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
            </div>
          }
          {analyzeExpense2  && 
            <div className="flex flex-col mt-2.5">
            <motion.div
            initial={{opacity:0}}
            animate={{opacity:1,transition:{duration:0.5,delay:0.3}}}
            className="flex items-center gap-2" style={{color:'#8CE163'}}>
            <MdBubbleChart  style={{border:'1px solid #8CE163' ,borderRadius:'999px',padding:'1.5px',widht:'20px',height:'20px'}}/>
            <p className="text-lg font-semibold text-[#fff]">FinChat</p>
          </motion.div>
          <motion.p
          className="text-sm font-light mt-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={highestCategoryMessage} // 🔹 Add this key to trigger re-render on change
        >
          {highestCategoryMessage.split("").map((char, index) => (
            <motion.span key={index} variants={letterVariants}>
              {char}
            </motion.span>
          ))}
          <motion.em 
          initial={{opacity:0}}
          animate={{opacity:1,transition:{delay:1.5,duration:0.7}}}
            className="font-light ml-1 text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer"
            onClick={() => setContinueAnalyze(true)}
          >
            Continue Analyzing
          </motion.em>
        </motion.p>
            </div>
        
          }

{continueAnalyze && 
<div className="flex flex-col mt-2.5">
  <motion.div
  initial={{opacity:0}}
  animate={{opacity:1,transition:{duration:0.5,delay:0.3}}}
  className="flex items-center gap-2" style={{color:'#8CE163'}}>
    <MdBubbleChart  style={{border:'1px solid #8CE163' ,borderRadius:'999px',padding:'1.5px' ,widht:'20px',height:'20px'}}/>
    <p className="text-lg font-semibold text-[#fff]">FinChat</p>
  </motion.div>
<motion.p
  className="text-sm font-light mt-1"
  variants={containerVariants}
  initial="hidden"
  animate="visible"
  key={continueMessage} // 🔹 Add this key to trigger re-render on change
>
  {continueMessage.split("").map((char, index) => (
    <motion.span key={index} variants={letterVariants}>
      {char}
    </motion.span>
  ))}
  <motion.em
  initial={{opacity:0}}
  animate={{opacity:1,transition:{delay:1.5,duration:0.7}}}
    className="font-light ml-1 text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer"
onClick={changeFunction ? () => setContinueLess(true) : resetAll}
  >
    {changeFunction ? 'Improve Expenses':'Continue Analyzing'}
  </motion.em>
</motion.p>
</div>

}
{continueLess && 
<div className="flex flex-col mt-2.5">
  <motion.div
  initial={{opacity:0}}
  animate={{opacity:1,transition:{duration:0.5,delay:0.3}}}
  className="flex items-center gap-2" style={{color:'#8CE163'}}>
    <MdBubbleChart  style={{border:'1px solid #8CE163' ,borderRadius:'999px',padding:'1.5px' ,widht:'20px',height:'20px'}}/>
    <p className="text-lg font-semibold text-[#fff]">FinChat</p>
  </motion.div>
<motion.p
  className="text-sm font-light mt-1"
  variants={containerVariants}
  initial="hidden"
  animate="visible"
  key={continueMessage} // 🔹 Add this key to trigger re-render on change
>
  {lessMessage.split("").map((char, index) => (
    <motion.span key={index} variants={letterVariants}>
      {char}
    </motion.span>
  ))}
  <motion.em
  initial={{opacity:0}}
  animate={{opacity:1,transition:{delay:1.5,duration:0.7}}}
    className="font-light ml-1 text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer"
    onClick={changeFunction ? () => setContinueLess(true) : () => setContinueAnalyze(true)}
  >
    
  </motion.em>
</motion.p>
<div className="expense-analysis flex justify-between gap-8 mt-2">
  <div>
    <h3 className="font-medium text-xs mb-2">Expenses Ordered from Highest to Lowest</h3>
    <motion.ol
      variants={listContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      {sortedCategories.map((item, index) => (
        <motion.li key={index} variants={listItemVariants} className="text-sm">
          {item.category
            .concat(": ", item.amount.toFixed(2), " (", item.percentage.toFixed(1), "%)")
            .split("")
            .map((char, charIndex) => (
              <motion.span
                key={charIndex}
                variants={charVariants}
                style={{ color: "#FF4D4D" }}  // Red for high expenses
              >
                {char}
               
              </motion.span>
            ))}
        </motion.li>
      ))}
    </motion.ol>
  </div>

  <div>
    <h3 className="font-medium text-xs mb-2">Adjusted Expenses to Match Budget</h3>
    <motion.ol
      variants={listContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      {adjustedCategories.map((item, index) => (
        <motion.li key={index} variants={listItemVariants} className="text-sm">
          {item.category
            .concat(": ", item.amount.toFixed(2), " (", item.percentage.toFixed(1), "%)")
            .split("")
            .map((char, charIndex) => (
              <motion.span
                key={charIndex}
                variants={charVariants}
                style={{ color: "#8CE163" }}  // Green for adjusted expenses
              >
                {char}
              </motion.span>
            ))}
        </motion.li>
      ))}
    </motion.ol>
  </div>
</div>

<motion.p
            className="text-sm font-light mt-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            
            {text3.split("").map((char, index) => (
              <motion.span key={index} variants={letterVariants}>
                {char}
              </motion.span>
            ))}
            <motion.p
            initial={{opacity:0}}
            animate={{opacity:1,transition:{delay:1.5,duration:0.7}}}
            className="mt-1">
              <em className="font-light text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer" onClick={()=>setGoalAnalyzer2(true)}>Check your Goal  </em> 
              or <em className="font-light text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer"
              onClick={resetAll}
              >Finish Analyzing</em></motion.p>
          </motion.p>
</div>
}
    {goalAnalyzer2 && (
  <div className="flex flex-col mt-2.5">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.3 } }}
      className="flex items-center gap-2"
      style={{ color: '#8CE163' }}
    >
      <MdBubbleChart
        style={{
          border: '1px solid #8CE163',
          borderRadius: '999px',
          padding: '1.5px',
          width: '20px',
          height: '20px',
        }}
      />
      <p className="text-lg font-semibold text-[#fff]">FinChat</p>
    </motion.div>

    {Array.isArray(noGoal) && noGoal.length > 0 ? (
      <>
        <motion.p
          className="text-sm font-light mt-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {textGoal.split("").map((char, index) => (
    <motion.span key={index} variants={letterVariants}>
      {char}
    </motion.span>
  ))}
           <motion.span initial={{opacity:0}}
           animate={{opacity:1,trainsition:{dalay:0.5,duration:0.5}}}
           style={{ color: '#8CE163' }}>
            {changeBalance}
          </motion.span>
          {", you need:"}
        </motion.p>

        <ul className="list-none mt-2 pl-0">
          {noGoal.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.3 + index * 0.2 } }}
              className="text-sm text-[rgba(222,222,222,0.9)] flex justify-between"
            >
              <span>{item.goalName} ({userData.currency} {item.goalPrice})</span>
              <span>{item.timeToAchieve}</span>
            </motion.li>
          ))}
        </ul>

        <p className="text-sm mt-2">
          Do you want to 
          <em
            className="font-light ml-1 text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer"
            onClick={() => chooseInfo("goal")}
          >
            Check Goals with Expenses 
          </em>
        </p>
      </>
    ) : (
      <motion.p
        className="text-sm font-light mt-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {noGoal.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
          >
            {char}
          </motion.span>
        ))}
        <br />
        <em
          className="font-light ml-1 text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer"
          onClick={() => chooseInfo("goal")}
        >
          Create Goal
        </em>
        or
        <em
          className="font-light ml-1 text-sm text-[rgba(222,222,222,0.6)] underline decoration-solid cursor-pointer"
          onClick={() => setAnalyzeExpense(true)}
        >
          Proceed Analyzing without a Goal
        </em>
      </motion.p>
    )}
  </div>
)}

        </div>
      </div>
      {/* Empty space */}
      <div className="empty h-12"></div>
    </div>
  );
};

const Goal =({userGoal,categoryGoal,priceGoal,handleSubmitGoal,openGoal,
  setUserGoal,setCategoryGoal,setPriceGoal,createGoal,allGoal,userData,removeGoal
})=>{

  return(
    <div className="exp flex flex-col items-center justify-center gap-5 h-screen">
      <div className="flex flex-col gap-2 w-full pl-10 xl:pl-0 xl:w-[50%]">
        <h1 className="text-4xl font-medium text-[#fff]  text-start mt-10">
          Goal
        </h1>
        <p className="text-start text-[#dedede] font-normal text-md">
          Let's see what we can achive today
        </p>
      </div>
      <div className="expensess flex flex-col items-center justify-center  mt-5 gap-5 ml-20 xl:ml-28 overflow-y-auto h-[400px] py-6 w-fit">
       {allGoal && allGoal.length > 0 ? (
          allGoal.map((info) => (
            <div
              key={info.id || `${info.userGoal}-${info.priceGoal}`}
              className="flex flex-col rounded-xl px-2 border border-[rgb(222,222,222,0.2)] bg-[#141718] py-3 text-lg text-white transition-colors  active:bg-zinc-900 "
            >
              <div className="flex items-center justify-between w-[400px]">
                <h1 className="text-[#fff] font-medium text-lg">
                  {info.userGoal}
                </h1>{" "}
                <div className="flex items-center gap-3">
                  
                  <button
                    onClick={() => removeGoal(info.id)}
                    className="rounded bg-red-300/20 px-1.5 py-1 text-xs text-red-300 transition-colors hover:bg-red-600 hover:text-red-200"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[#dedede] font-normal text-sm flex items-center">
                  Category:
                  <b className="text-[#fff] font-medium"> {info.categoryGoal.slice(0,10)}</b>
                </p>{" "}
                <p className="text-[rgba(222,222,222,0.7)]">/</p>
                <p className="text-[#dedede] font-light text-sm flex items-center">
                  Amount:{" "}
                  <b className="text-[#fff] font-medium">{info.priceGoal}</b>
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
          <div className="expen text-3xl font-semibold">No Goals Yet</div>
        )}

        <div className="fixed bottom-2 left-1/2 w-full max-w-xl -translate-x-1/2 px-4">
          <AnimatePresence>
            {openGoal && (
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
                  handleSubmitGoal();
                }}
                className="mb-6 w-full rounded border border-zinc-700 bg-[#141718] p-3"
              >
                <textarea
                  placeholder="What is you goal ?"
                  value={userGoal}
                  onChange={(e) => setUserGoal(e.target.value)}
                  className="h-20 w-full resize-none rounded bg-[#141718] p-3 text-sm text-zinc-50 placeholder-zinc-500 caret-zinc-50 focus:outline-0"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <input
                      placeholder="Categorize as ..."
                      value={categoryGoal}
                      onChange={(e) => setCategoryGoal(e.target.value)}
                      type="text"
                      className="w-36 rounded bg-zinc-700 px-1.5 py-1 text-sm text-zinc-50 focus:outline-0"
                    />
                    <input
                      value={priceGoal}
                      onChange={(e) => setPriceGoal(e.target.value)}
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
            onClick={createGoal}
            className="grid w-full place-content-center rounded-full border border-[rgb(222,222,222,0.2)] bg-[#141718] py-3 text-lg text-white transition-colors hover:bg-zinc-800 active:bg-zinc-900"
          >
            <MdOutlineClose
              className={`transition-transform ${openGoal ? "rotate-0" : "rotate-45"}`}
            />
          </button>
        </div>
      </div>
      <div className="empty h-12"></div>
    </div>
  )
}
 
const Wallet =({expenses,totalBalance,userData,totalExpenses,businessArray,setBusinessArray})=>{
  const [mode, setMode] = useState("employee");

 const storedData = JSON.parse(localStorage.getItem("userData")) || {};
  const [businessType, setBusinessType] = useState(storedData.businessType || "");
  const [businessExpenses, setBusinessExpenses] = useState(0);
  const [products, setProducts] = useState(0);
  const [productCost, setProductCost] = useState(0);
  const profit = (products * productCost) - businessExpenses;
  const [income, setIncome] = useState(storedData.income || "");

    const updateIncome = () => {
    const updatedData = { ...storedData, income: parseFloat(income) };
    localStorage.setItem("userData", JSON.stringify(updatedData));
  };

const updateBusinessType = (type) => {
    setBusinessType(type);
    const updatedData = { ...storedData, businessType: type };
    localStorage.setItem("userData", JSON.stringify(updatedData));
  };

const submitBusiness = () => {
  const businessSaved = {
    type: businessType,
    be: businessExpenses,
    sold: products,
    cost: productCost,
  };

  // Get existing businesses from localStorage
  const existingBusiness = JSON.parse(localStorage.getItem("setupBusiness")) || [];

  // Add ne   w business entry
  const updatedBusiness = [...existingBusiness, businessSaved];

  // Save back to localStorage
  localStorage.setItem("setupBusiness", JSON.stringify(updatedBusiness));

  // Update state
  setBusinessArray(updatedBusiness);
};


useEffect(() => {
  const savedBusiness = JSON.parse(localStorage.getItem("setupBusiness")) || [];
  setBusinessArray(savedBusiness);
}, []);


// Simulated Monthly and Yearly Data (Replace with actual calculations later)
const monthlyRevenue = products * productCost * 30; // Example: 30 days of sales
const yearlyRevenue = monthlyRevenue * 12; // 12 months
const monthlyProfit = monthlyRevenue - (businessExpenses * 30);
const yearlyProfit = yearlyRevenue - (businessExpenses * 365);


  return (
    <div className="cashflow-container flex flex-col items-center h-full">
       <div className="flex flex-col gap-2 w-full pl-10 xl:pl-0 xl:w-[50%]">
        <h1 className="text-4xl font-medium text-[#fff]  text-start mt-10">
          Cash Flow
        </h1>
        <p className="text-start text-[#dedede] font-normal text-md">
          Let's see what we can achive today
        </p>
      </div>
      {/* Toggle between Employee & Business Mode */}
      <div className="flex flex-col lg:flex-row items-center gap-8 ml-16">
      <div className="bg-[#1b1f21] mt-10 rounded-md p-3 w-[450px]" 
      style={{border:'1px solid rgba(172, 233, 142,0.6)',height:mode === 'business' && ["Restaurant", "Retail", "Freelancer", "Coffee Shop", "Car Wash", "Rent Cars", "Other"].includes(businessType)  ? '530px':'370px',transition:'height 0.5s ease'}}>
      <div className="flex flex-col items-center gap-2">
      <div className="toggle-container flex items-center gap-24 justify-around rounded-md mt-10">
        <div 
         style={{
      opacity: mode === "employee" ? 1 : 0.6, // Lower opacity when not selected
      filter: mode === "employee" ? "none" : "blur(2px)", // Add blur effect when not selected
      cursor: "pointer", // Make it clickable,
      scale:mode === 'employee' ? 1.5 : 1,transition:'all 0.5s ease'
    }} onClick={() => setMode("employee")}
          className="flex flex-col items-center gap-2">
            <HiUser style={{color:'#8ce163',width:'35px',height:'35px',backgroundColor:'#1a3a0b',padding:'3px',borderRadius:'10px'}}/>
          <h1 className="font-semibold text-lg">
          Employee
        </h1>
        </div>
        <div
        style={{ opacity: mode === "business" ? 1 : 0.6, // Lower opacity when not selected
      filter: mode === "business" ? "none" : "blur(2px)", // Add blur effect when not selected
      cursor: "pointer", // Make it clickable,
      scale:mode === 'business' ? 1.5 : 1,transition:'all 0.5s ease'}}
          className="flex flex-col items-center gap-2"
          onClick={() => setMode("business")}
        >
          <HiUserGroup style={{color:'#8ce163',width:'35px',height:'35px',backgroundColor:'#1a3a0b',padding:'3px',borderRadius:'10px'}}/>
          <h1 className="font-semibold text-lg">
            Business
          </h1>
        </div>
      </div>
      <span className="w-full h-2 rounded-full bg-[] flex items-center relative">
  {/* Moving inner bar */}
  <span
    style={{
      width: "50%", // Half the width of the container
      backgroundColor: "#8ce163", // Different background color
      position: "absolute",
      left:mode === 'employee' ? "0%" : "50%", // Moves left if expenses exist, otherwise right
      transition: "left 0.5s ease", // Smooth movement
      height: "100%",
      borderRadius: "inherit" // Match rounded corners
    }}
  ></span>
</span>

      </div>
      {/* Employee Mode */}
     <AnimatePresence mode="wait">
        {mode === "employee" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, y: 10, transition: { duration: 0.5 } }}
            key="employee"
            className="employee-mode mt-10 flex flex-col items-start pl-1 gap-2"
          >
            <h3 className="w-full text-start mb-4 -mt-6 text-base font-medium">Employee Mode</h3>
            <label>
              <p className="text-sm font-light text-start">Income: </p>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                onBlur={updateIncome} // Save income when the user leaves input
                className="bg-transparent  p-1 text-start  border-[#8ce163] rounded-sm"
              />
            </label>
            <p><strong className="text-sm font-light text-start">Expenses:</strong> ${totalExpenses}</p>
            <p><strong className="text-sm font-light text-start">Remaining Balance:</strong> ${totalBalance}</p>
            <p><strong className="text-sm font-light text-start">Business Type (if applicable):</strong> {businessType || "N/A"}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, y: 10, transition: { duration: 0.5 } }}
            key="business"
            className="business-mode mt-10 flex flex-col items-end pr-1 gap-2"
          >
            <h3 className="w-full text-end mb-4 -mt-6 text-base font-medium">Business Mode</h3>
            <label className="flex items-center flex-col gap-1">
              <p className="text-sm font-light text-end w-full">Business Type</p>
              <select
                value={businessType}
                onChange={(e) => updateBusinessType(e.target.value)}
                className="bg-transparent border border-[#8ce163] rounded-sm  focus:outline-0 p-1"
              >
                <option className="bg-[#1b1f21] text-[#8ce163]" value="">Select Business Type</option>
                <option className="bg-[#1b1f21] text-[#8ce163]" value="Restaurant">Restaurant</option>
                <option className="bg-[#1b1f21] text-[#8ce163]" value="Retail">Retail</option>
                <option className="bg-[#1b1f21] text-[#8ce163]" value="Freelancer">Freelancer</option>
                <option className="bg-[#1b1f21] text-[#8ce163]" value="Coffee Shop">Coffee Shop</option>
                <option className="bg-[#1b1f21] text-[#8ce163]" value="Bakery">Bakery</option>
                <option className="bg-[#1b1f21] text-[#8ce163]" value="Car Wash">Car Wash</option>
                <option className="bg-[#1b1f21] text-[#8ce163]" value="Rent Cars">Rent Cars</option>
                <option className="bg-[#1b1f21] text-[#8ce163]" value="Car Salesman">Car Salesman</option>
                <option className="bg-[#1b1f21] text-[#8ce163]" value="Other">Other</option>

              </select>
            </label>
            <label className="flex items-center flex-col gap-1">
              <p className="text-sm font-light text-end w-full">Business Expenses</p>
              <input
                type="number"
                value={businessExpenses}
                onChange={(e) => setBusinessExpenses(Number(e.target.value))}
                className="bg-transparent border border-[#8ce163] rounded-sm p-1 focus:outline-0"
              />
            </label>

               {["Restaurant", "Retail", "Freelancer", "Coffee Shop", "Car Wash", "Rent Cars", "Other"].includes(businessType) && (
  <motion.div 
    initial={{ opacity: 0, y: -10, height: 0 }}
    animate={{ opacity: 1, y: 0, height: "auto" }}
    exit={{ opacity: 0, y: -10, height: 0 }}
    transition={{ duration: 0.8 }}
    className="mt-4"
  >
    {/* Products Sold Input */}
    <label>
      <p className="text-sm font-light text-end w-full">Products Sold (Today):</p>
      <input
        type="number"
        value={products}
        onChange={(e) => setProducts(Number(e.target.value))}
        className="bg-transparent border border-[#8ce163] rounded-sm p-1 focus:outline-0"
      />
    </label>

    {/* Product Cost Input */}
    <label>
      <p className="text-sm font-light text-end w-full mt-2">Product Cost ({userData.currency} per unit):</p>
      <input
        type="number"
        value={productCost}
        onChange={(e) => setProductCost(Number(e.target.value))}
         onBlur={updateIncome} // Save income when the user leaves input
        className="bg-transparent border border-[#8ce163] rounded-sm  p-1 focus:outline-0"
      />
    </label>

    {/* Sales Overview */}
   
  </motion.div>
)}



            <div className="flex items-center flex-row-reverse justify-between w-full mt-3">
              <p><strong>Profit:</strong> {userData.currency}{profit}</p>
            <button className="rounded bg-[#8DE163] px-1.5 py-1 text-xs text-[#000] transition-colors hover:bg-[rgba(141,225,99,0.7)]"
            onClick={submitBusiness}>Submit</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
             <motion.div
             initial={{opacity:0}}
             animate={{opacity:1}}
             transition={{duration:0.5}}
             className="mt-4 border-t pt-3 ml-8">
      <h4 className="text-md font-semibold text-[#8ce163] mb-4">Sales Overview</h4>
      
      {/* Daily Totals */}
    {businessArray.length === 0 ? (
  <p>Please submit Business fields for the finances to appear</p>
) : (
  businessArray.map((bus, index) => (
    <div className="flex flex-col items-start gap-2 bg-[#1B1F21] text-[#8CE163] p-2 border border-[#3e453b] rounded-lg shadow-md" key={index}>
       <div className="mb-2">
      <p className="text-lg font-semibold flex items-center gap-1 text-[#fff]"><MdOutlineCalendarToday style={{color:'#8CE163'}}/> Daily Overview</p>
      <p className="flex justify-between text-sm">
        <span className="font-light text-[#dedede]">Revenue:</span> 
        <span className="font-medium">{userData.currency}{bus.sold * bus.cost}</span>
      </p>
      <p className="flex justify-between text-sm">
        <span className="font-light text-[#dedede]">Profit:</span> 
        <span className="font-medium">{userData.currency}{(bus.sold * bus.cost) - bus.be}</span>
      </p>
    </div>

      {/* Monthly Totals */}
      <div className="border-t border-gray-600 pt-2 mb-2">
      <p className="text-lg font-semibold flex items-center gap-1 text-[#fff]"><MdOutlineCalendarToday style={{color:'#8CE163'}}/> Monthly Overview</p>
      <p className="flex justify-between text-sm">
        <span className="font-light text-[#dedede]">Revenue:</span> 
        <span className="font-medium">{userData.currency}{bus.sold * bus.cost * 30}</span>
      </p>
      <p className="flex justify-between text-sm">
        <span className="font-light text-[#dedede]">Profit:</span> 
        <span className="font-medium">{userData.currency}{(bus.sold * bus.cost * 30) - (bus.be * 30)}</span>
      </p>
    </div>


      {/* Yearly Totals */}
     <div className="border-t border-gray-600 pt-2">
      <p className="text-lg font-semibold flex items-center gap-1 text-[#fff]"><MdOutlineCalendarToday style={{color:'#8CE163'}}/> Yearly Overview</p>
      <p className="flex justify-between text-sm">
        <span className="font-light text-[#dedede]">Revenue:</span> 
        <span className="font-medium">{userData.currency}{bus.sold * bus.cost * 365}</span>
      </p>
      <p className="flex justify-between text-sm">
        <span className="font-light text-[#dedede]">Profit:</span> 
        <span className="font-medium">{userData.currency}{(bus.sold * bus.cost * 365) - (bus.be * 365)}</span>
      </p>
    </div>
    </div>
  ))
)}


    </motion.div>
    </div>

    <div className="empty h-24"></div>

    </div>
  );

}

const Category =({chartSystem,setChartSystem,changeChart,COLORS,progressSystem,setProgressSystem,changeProgress})=>{
  

  const data = [
  { name: 'Page A', value: 4000 },
  { name: 'Page B', value: 3000 },
  { name: 'Page C', value: 2000 },
  { name: 'Page D', value: 2780 },
];

const data2 = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
];


const renderTooltipWithoutRange = (props) => <Tooltip {...props} />;
const renderLegendWithoutRange = (props) => <Legend {...props} />


const [selectCategory,setSelectCategory]=useState('charts')

const chooseCategory =(select)=>{
  setSelectCategory(select)
}

  return(
   <div className="category flex flex-col items-center h-full">
     <div className="flex flex-col gap-2 w-full pl-10 xl:pl-0 xl:w-[50%]">
        <h1 className="text-4xl font-medium text-[#fff]  text-start mt-10">
          Category
        </h1>
        <p className="text-start text-[#dedede] font-normal text-md">
          Make changes to your preferences
        </p>
      </div>
      <h1 className="text-2xl font-medium text-[#fff] w-full pl-10 xl:pl-0 xl:w-[50%] text-start mt-10">
          Charts
        </h1>
      <p className="w-full xl:w-[50%] pl-10 xl:pl-0 mt-4 text-[#dedede] text-start font-light text-sm">Current chosen : {chartSystem}</p>
      <div className="flex flex-col lg:flex-row items-center gap-6 ml-[5%] justify-end w-[100%] mt-8">
      <div onClick={()=>changeChart('piechart')} className="cursor-pointer bg-[#1b1f21] p-1 rounded-md" style={{border:chartSystem === 'piechart' ? '1px solid #8ce163':'1px solid #3e453b',opacity:chartSystem==='piechart'? '1': '0.7',transition:'all 0.5s ease'}}>
         <PieChart width={300} height={275}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value" // Use "value" since we fixed the data format
            label={({ name, value, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
       <div onClick={()=>changeChart('barchart')} className="cursor-pointer bg-[#1b1f21] p-1 rounded-md" style={{border:chartSystem === 'barchart' ? '1px solid #8ce163':'1px solid #3e453b',opacity:chartSystem==='barchart'? '1': '0.7',transition:'all 0.5s ease'}}>
        <BarChart width={300} height={275} data={data2}>
        <XAxis  is dataKey="name" /> {/* Added X-Axis */}
        <YAxis /> {/* Added Y-Axis */}
 <Tooltip
    contentStyle={{
      backgroundColor: '#2d2f31', // Dark background
      borderRadius: '8px', 
      border: 'none', 
      color: '#ffffff', // White text
    }}
    cursor={{ fill: 'rgba(140, 225, 99, 0.3)' }} // Light green hover effect instead of grey
  />        <Legend /> {/* Added Legend for better UI */}
        <Bar dataKey="uv" fill="#8ce163" stackId="a" />
        <Bar dataKey="pv" fill="#5FA038" stackId="a" />
      </BarChart>
       </div>
        <div onClick={()=>changeChart('circlechart')} className="cursor-pointer bg-[#1b1f21] p-1 rounded-md" style={{border:chartSystem === 'circlechart' ? '1px solid #8ce163':'1px solid #3e453b',opacity:chartSystem==='circlechart'? '1': '0.7',transition:'all 0.5s ease'}}>
 <PieChart width={300} height={275}>
        <Pie
          data={data}
          cx={140}
          cy={120}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
       </div>
       
      </div>
      <h1 className="text-2xl font-medium text-[#fff] w-full pl-10 xl:pl-0 xl:w-[50%] text-start mt-10">
          Progress
        </h1>
       
      <p className="w-full pl-10 xl:pl-0 xl:w-[50%] mt-4 text-[#dedede] text-start font-light text-sm">
  Current chosen : {progressSystem}
</p>

<div className="flex flex-col lg:flex-row items-center gap-20 justify-center mt-14">
  
  {/* Goal & Expenses Section */}
  <div 
    className={`flex items-center relative p-2 rounded-lg transition-all duration-500 cursor-pointer 
                ${progressSystem === 'goalexpenses' ? 'scale-110 inset-shadow-lg inset-shadow-[#8CE163]/40' : 'opacity-70 hover:opacity-100'}`}
    onClick={() => changeProgress('goalexpenses')}
  >
    <img 
      className="object-cover rounded-md border border-[#3e453b] transition-transform duration-500" 
      style={{
        transform: progressSystem === 'goalexpenses' ? "rotate(-15deg) scale(1.2)" : "rotate(-20deg)",
      }}
      src={goalphoto}
      width="125px"
      height="125px"
    />
    
    <img 
      className="object-cover -ml-8 rounded-md border border-[#3e453b] transition-transform duration-500" 
      style={{
        transform: progressSystem === 'goalexpenses' ? "rotate(5deg) scale(1.2)" : "rotate(10deg)",
      }}
      src={expensephoto}
      width="125px"
      height="125px"
    />
  </div>

  {/* Business Section */}
  <div 
    className={`flex items-center relative p-2 rounded-lg transition-all duration-500 cursor-pointer ml-0 lg:ml-20 mr-0 lg:-mr-36
                ${progressSystem === 'business' ? 'scale-110 border-2 border-[#8CE163] shadow-lg shadow-[#8CE163]/40' : 'opacity-70 hover:opacity-100'}`}
    onClick={() => changeProgress('business')}
  >
    <img 
      className="object-cover rounded-md border border-[#3e453b] transition-transform duration-500" 
      style={{
        transform: progressSystem === 'business' ? "rotate(0deg) scale(1.2)" : "rotate(0deg)",
      }}
      src={progressphoto}
      width="145px"
      height="145px"
    />
  </div>

</div>

     <div className="empty h-24"></div>
   </div>
  )
}


const Settings =({userData,updateNotif,notifSettings,bind1,bind2,bind3,setBind1,setBind2,setBind3})=>{

  const [changeName,setChangeName]=useState(userData.name)

const submitChanges = () => {
  const storedUserData = JSON.parse(localStorage.getItem("userData")) || {}; // Get the current user data
  const updatedUserData = {
    ...storedUserData,  // Keep existing data
    name: changeName,   // Update only the name
  };


  const mouseBinds = { bind1, bind2, bind3 };

  localStorage.setItem("userData", JSON.stringify(updatedUserData));
  localStorage.setItem("notifSettings",notifSettings)
  localStorage.setItem("mousebinds", JSON.stringify(mouseBinds));
};

const [notification,setNotification]=useState('')

useEffect(()=>{

  if(notifSettings === true){
    setNotification('Enabled')
  }else{
    setNotification('Disabled')
  }

},[notifSettings])

  return(
    <div className="flex flex-col items-center h-full">
       <div className="flex flex-col gap-2 w-full pl-10 xl:pl-0 xl:w-[50%]">
        <h1 className="text-4xl font-medium text-[#fff]  text-start mt-10">
          Settings
          <p className="mt-10 text-xl font-medium text-[#fff] text-start">Name</p>
         <p className="mt-1 text-sm font-[400] text-[#d8dcd6] text-start">Change the username as your preference.Keep in mind the name needs to be 8 letters in average</p>
        </h1>          
      </div>
     <div className="flex flex-col gap-2 w-full pl-10 xl:pl-0 xl:w-[50%] mt-4">
       <p className="text-sm font-light text-[#a3ac9f] flex items-center mt-2 gap-0.5">Current Name: <p className="text-[#fff] font-medium">{changeName}</p></p>
      <input className="w-[30%] xl:w-[40%] bg-transparent border border-[#8CE163] focus:outline-0 p-1" value={changeName} onChange={(e)=>setChangeName(e.target.value)}/>
     </div>
     <hr className="w-full ml-10 xl:ml-0 xl:w-[50%] h-0.5 bg-[#d8dcd6] mt-6 opacity-30"/>
        <p className="mt-6 text-xl font-medium text-[#fff] text-start w-full pl-10 xl:pl-0 xl:w-[50%]">Notification</p>
         <p className="mt-1 text-sm font-base text-[#d8dcd6] text-start w-full pl-10 xl:pl-0 xl:w-[50%]">Allow the notifications so you can check on what did you achive</p>
        <div className="flex items-end gap-6 w-full pl-10 xl:pl-0 xl:w-[50%] mt-4">
       <p className="text-sm font-light text-[#a3ac9f] flex items-center mt-2 gap-0.5">Currently: <p className="text-[#fff] font-medium">{notification}</p></p>
     <input onClick={updateNotif} class="switch focus:outline-0 mt-2" type="checkbox" checked={notifSettings}/>   
    </div>
     <hr className="w-full ml-10 xl:ml-0 xl:w-[50%] h-0.5 bg-[#d8dcd6] mt-6 opacity-30"/>
      <p className="mt-6 text-xl font-medium text-[#fff] text-start w-full pl-10 xl:pl-0 xl:w-[50%]">MouseBinds</p>
         <p className="mt-1 text-sm font-base text-[#d8dcd6] text-start w-full pl-10 xl:pl-0 xl:w-[50%]">Costumize the mousebinds for your preference,Mousebinds needs to be keyboard letters</p>
         <div className="bg-[#e16363] rounded-md p-0.5 mt-3 text-[#3a0b0b] w-full ml-10 xl:ml-0 xl:w-[50%] text-sm font-light flex items-center gap-1.5">
          <MdInfoOutline style={{width:'20px',height:'20px'}}/><p className="text-start">Keep in mind that that for the mousebinds to work one of the keyboard letters needs to have '+' before the letter</p>
         </div>
         <div className="flex items-center gap-4 w-full pl-10 xl:pl-0 xl:w-[50%] mt-2">
       <p className="text-sm font-light text-[#a3ac9f] flex items-center mt-2 gap-0.5">Current Mousebinds: <p className="text-[#fff] font-medium">{bind1}{bind2}</p></p>|
        <p className="text-sm font-extralight text-[#a3ac9f] flex items-center mt-2 gap-0.5">What it does: <p className="text-[#fff] font-medium">Opens the Quick Search</p></p>
         </div>
         <div className="flex items-center gap-3 w-full pl-10 xl:pl-0 xl:w-[50%] mt-2">
          <input className="w-[20%] bg-transparent border border-[#8CE163] focus:outline-0 p-1" value={bind1} onChange={(e)=>setBind1(e.target.value)}/>
      <input className="w-[20%] bg-transparent b w-full pl-10 xl:pl-0oxl:rder border-[#8CE163] focus:outline-0 p-1" value={bind2} onChange={(e)=>setBind2(e.target.value)}/>
         </div>
           <div className="flex items-center gap-4 w-full pl-10 xl:pl-0 xl:w-[50%] mt-2">
       <p className="text-sm font-light text-[#a3ac9f] flex items-center mt-2 gap-0.5">Current Mousebinds: <p className="text-[#fff] font-medium">{bind3}</p></p>|
        <p className="text-sm font-extralight text-[#a3ac9f] flex items-center mt-2 gap-0.5">What it does: <p className="text-[#fff] font-medium">Closes the Quick Search</p></p>
         </div>
         <div className="flex items-center gap-3 w-full pl-10 xl:pl-0 xl:w-[50%] mt-2">
          <input className="w-[20%] bg-transparent border border-[#8CE163] focus:outline-0 p-1" value={bind3} onChange={(e)=>setBind3(e.target.value)}/>
         </div>
        <div className="flex items-center gap-4 w-full px-10 xl:px-0 xl:w-[50%] mt-4">
        <button className="bg-button text-[#000]" onClick={submitChanges}>Save Changes</button>
        </div>
    <div className="empty h-24"></div>
    </div>
  )
}

const Help =()=>{

  const [openHelp,setOpenHelp]=useState('Dashboard')

  

const helpContent = {
    Dashboard: (
      <motion.p 
      initial={{opacity:0}}
      animate={{opacity:1}}
      transition={{duration:0.3}}
      className="text-lg text-[#ddd] mt-4">
        The Dashboard provides an overview of your finances. It includes:
        <ul className="list-disc pl-5 mt-2">
          <li className="text-sm font-light text-[#a3ac9f]">
            <strong className="text-md font-medium text-[#d8dcd6]">Total Balance:</strong> Displays your remaining balance after all expenses.
          </li>
          <li className="text-sm font-light text-[#a3ac9f]">
            <strong className="text-md font-medium text-[#d8dcd6]">Total Income:</strong> Shows your income before expenses are deducted.
          </li>
          <li className="text-sm font-light text-[#a3ac9f]">
            <strong className="text-md font-medium text-[#d8dcd6]">Total Expenses:</strong> Sums up all recorded expenses from the Expenses section.
          </li>
        </ul>
         <p className="text-sm font-light text-[#a3ac9f] text-start flex justify-center mt-1.5">Each financial card has a button (default:Monthly ) to switch views between Monthly, Yearly, and Daily.</p>
        <p className="text-sm font-light text-[#a3ac9f] text-start mt-1.5"> Below these, the Pie Chart visually represents your spending breakdown, updating dynamically based on your selection.
        At the bottom, the Goals & Expenses Progress section tracks how close you are to reaching your financial goals.
        </p>
      </motion.p>
    ),
  Expenses: (
  <motion.p 
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{duration: 0.3}}
    className="text-lg text-[#ddd] mt-4"
  >
    The <strong className="text-md font-medium text-[#d8dcd6]">Expenses</strong> section allows you to manage your daily, monthly, or yearly expenses. It includes:
    <ul className="list-disc pl-5 mt-2">
      <li className="text-sm font-light text-[#a3ac9f] text-start">
        <strong className="text-md font-medium text-[#d8dcd6] text-start">Add Expenses:</strong> Create new expenses, specifying the name, category, and amount.
      </li>
      <li className="text-sm font-light text-[#a3ac9f] text-start mt-1.5">
        <strong className="text-md font-medium text-[#d8dcd6]">Expense Calculation:</strong> All expenses are summed up and displayed in the <strong>Dashboard</strong> to track your total spending.
      </li>
      <li className="text-sm font-light text-[#a3ac9f] text-start mt-1.5">
        <strong className="text-md font-medium text-[#d8dcd6]">Delete Expenses:</strong> Remove unnecessary expenses anytime to update your budget.
      </li>
      <li className="text-sm font-light text-[#a3ac9f] text-start mt-1.5">
        <strong className="text-md font-medium text-[#d8dcd6]">Character Limit:</strong> The expense name has a limited number of characters to maintain UI consistency.
      </li>
    </ul>
    <p className="text-sm font-light text-[#a3ac9f] text-start mt-1.5">
      All fields (expense name, category, and amount) must be completed for the expense to be saved. Incomplete entries will not be recorded.
    </p>
  </motion.p>
)
,
    Analytics: (
  <motion.p 
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{duration: 0.3}}
    className="text-lg text-[#ddd] mt-4"
  >
    The <strong className="text-md font-medium text-[#d8dcd6]">Analytics</strong> section helps you gain deeper insights into your financial status. This system includes:
    <ul className="list-disc pl-5 mt-2">
      <li className="text-sm font-light text-[#a3ac9f] text-start">
        <strong className="text-md font-medium text-[#d8dcd6]">Expense & Balance Analysis:</strong> The analyzer <strong className="text-md text-[#8ce163]">FinChat</strong> examines your expenses and balance to identify areas for improvement.
      </li>
      <li className="text-sm font-light text-[#a3ac9f] text-start mt-1.5">
        <strong className="text-md font-medium text-[#d8dcd6]">Goal-Based Insights:</strong> If you have a financial goal, Finly will evaluate your progress and compare your expenses to determine if achieving the goal is feasible.
      </li>
      <li className="text-sm font-light text-[#a3ac9f] text-start mt-1.5">
        <strong className="text-md font-medium text-[#d8dcd6]">Alternative Analysis:</strong> If no goal is set, Finly will provide general financial improvement suggestions based on your spending patterns.
      </li>
    </ul>
    <p className="text-sm font-light text-[#a3ac9f] text-start mt-1.5">
      Finly will highlight areas where you may be overspending and suggest optimizations, ensuring better financial planning and stability.
    </p>
  </motion.p>
)
,
   Goal: (
  <motion.p 
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{duration: 0.3}}
    className="text-lg text-[#ddd] mt-4"
  >
    The <strong className="text-md font-medium text-[#d8dcd6]">Goal</strong> section allows you to set financial targets you aim to achieve. Unlike expenses, goals do not have a fixed time frame but are completed using your remaining balance over time.
    <ul className="list-disc pl-5 mt-2">
      <li className="text-sm font-light text-[#a3ac9f] text-start mt-1.5">
        <strong className="text-md font-medium text-[#d8dcd6] ">Creating a Goal:</strong> You can define a goal by specifying a name and an amount to save. The system ensures all fields are properly filled before saving.
      </li>
      <li className="text-sm font-light text-[#a3ac9f] text-start mt-1.5">
        <strong className="text-md font-medium text-[#d8dcd6]">Progress Tracking:</strong> The system calculates how long it will take to reach your goal based on your remaining balance and spending habits.
      </li>
      <li className="text-sm font-light text-[#a3ac9f] text-start mt-1.5">
        <strong className="text-md font-medium text-[#d8dcd6]">Limitations:</strong> To maintain a clean UI and system stability, goal names have a character limit.
      </li>
    </ul>
    <p className="text-sm font-light text-[#a3ac9f] text-start mt-1.5">
      Goals help you stay motivated and financially disciplined, allowing you to plan for future purchases, investments, or savings milestones.
    </p>
  </motion.p>
)
,
   CashFlow: (
  <motion.p 
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{duration: 0.3}}
    className="text-lg text-[#ddd] mt-4"
  >
    The <strong className="text-md font-medium text-[#d8dcd6]">Cash Flow</strong> section allows you to define your financial structure. You can select between being an <strong>Employee</strong> or a <strong>Business Owner</strong>, and based on your choice, input relevant financial details.
    <ul className="list-disc pl-5 mt-2">
      <li className="text-sm font-light text-[#a3ac9f] text-start">
        <strong className="text-md font-medium text-[#d8dcd6]">Employee:</strong> If you are an employee, you need to enter:
        <ul className="list-disc pl-5 mt-1">
          <li className="text-sm font-light text-[#a3ac9f]">The company you work for</li>
          <li className="text-sm font-light text-[#a3ac9f]">Your monthly salary</li>
        </ul>
        <p className="text-sm font-light text-[#a3ac9f] mt-1.5">
          Your salary will automatically update the <strong>Total Balance</strong> and adjust as soon as you leave this section.
        </p>
      </li>
      <li className="text-sm font-light text-[#a3ac9f] mt-3 text-start">
        <strong className="text-md font-medium text-[#d8dcd6]">Business Owner:</strong> If you run a business, you need to provide:
        <ul className="list-disc pl-5 mt-1">
          <li className="text-sm font-light text-[#a3ac9f] text-start">Your business name</li>
          <li className="text-sm font-light text-[#a3ac9f] text-start">Expenses related to your business</li>
          <li className="text-sm font-light text-[#a3ac9f] text-start">Total sales</li>
          <li className="text-sm font-light text-[#a3ac9f] text-start">Cost per product sold</li>
        </ul>
        <p className="text-sm font-light text-[#a3ac9f] mt-1.5">
          Based on these inputs, the system will calculate your <strong>Revenue</strong> and <strong>Profit</strong> automatically.
        </p>
      </li>
    </ul>
    <p className="text-sm font-light text-[#a3ac9f] text-start mt-1.5">
      This section ensures accurate financial tracking, integrating your income into the Total Balance dynamically.
    </p>
  </motion.p>
)
,
  Category: (
  <motion.p 
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{duration: 0.3}}
    className="text-lg text-[#ddd] mt-4"
  >
    The <strong className="text-md font-medium text-[#d8dcd6]">Category</strong> section allows you to customize the UI based on your preferences. Here, you can modify two key elements:
    <ul className="list-disc pl-5 mt-2">
      <li className="text-sm font-light text-[#a3ac9f] text-start">
        <strong className="text-md font-medium text-[#d8dcd6]">Chart Customization:</strong> You can switch between <strong>three different chart types</strong> to visualize your financial data in a way that suits you best.
      </li>
      <li className="text-sm font-light text-[#a3ac9f] mt-3 text-start">
        <strong className="text-md font-medium text-[#d8dcd6]">Progress Section Customization:</strong> In the <strong>Dashboard</strong>, the default view shows your <strong>Expense and Goal Progress</strong>. However, if you have a business, you can replace this section with <strong>Revenue and Profit</strong> to track business performance instead.
      </li>
    </ul>
    <p className="text-sm font-light text-[#a3ac9f] text-start mt-1.5">
      This section gives you full control over how financial insights are displayed, ensuring a tailored experience that fits your needs.
    </p>
  </motion.p>
)
,
  };


  return(
  <div className="flex flex-col items-center h-full">
     <div className="flex flex-col gap-2 w-full pl-10 xl:pl-0 xl:w-[50%]">
        <h1 className="text-4xl font-medium text-[#fff]  text-start mt-10">Help</h1> 
        </div>
        <div className="flex flex-col gap-8 lg:gap-0 lg:flex-row items-center justify-around xl:justify-center w-full xl:w-[90%] ml-0 xl:ml-36 mt-4">
         <div className="flex flex-col items-center w-full lg:w-[70%]">
              {Object.keys(helpContent).map((key) => (
          <div
            key={key}
            onClick={() => setOpenHelp(openHelp === key ? null : key)}
            className="mt-4 text-xl font-medium cursor-pointer flex items-center p-2 hover:text-[#8ce163] w-[50%] transition-colors" style={{borderBottom:'1px solid rgba(216, 220, 214,0.6)'}}
          >
            {key}
          </div>
        ))}
         </div>
    <div className="w-full ml-10 lg:ml-0 lg:w-[40%] mt-4 p-4 bg-[#1b1f21] rounded-lg h-fit">
        {openHelp && helpContent[openHelp]}
      </div>
        </div>
          <div className="empty h-24"></div>
          <div className="empty h-24"></div>


  </div>
  )
}