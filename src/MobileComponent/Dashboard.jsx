import { useEffect, useState } from "react";

const [lastUpdated, setLastUpdated] = useState(() => {
    return localStorage.getItem("lastUpdated") || "";
  });

const [income, setIncome] = useState(0);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.income) {
      setIncome(storedData.income);
    }
  }, []);

  const [selectedPeriod, setSelectedPeriod] = useState("Monthly"); // Default: Month
  const [chartData, setChartData] = useState([]);
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

    const [totalExpenses, setTotalExpenses] = useState(0);

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

const Dashboard =()=>{
    return(
        <div>Dashboard</div>
    )
}
export default Dashboard