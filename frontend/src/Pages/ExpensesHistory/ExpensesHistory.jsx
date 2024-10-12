import React, { useState, useEffect } from "react";
import axios from "../../axios";
import Styles from "./ExpensesHistory.module.css";

import { useColour } from "../../Context/UseContext";

const ExpensesHistory = () => {
  const userId = localStorage.getItem("userId");
  const [ExpensesHistory, setExpensesHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const disease = localStorage.getItem("disease");

  const { tritanopia, protanopia, deuteranopia, monochromacy } = useColour();
  let colorsToUse;

  if (disease === "protanopia") {
    colorsToUse = protanopia.use;
  } else if (disease === "tritanopia") {
    colorsToUse = tritanopia.use;
  } else if (disease === "deuteranopia") {
    colorsToUse = deuteranopia.use;
  } else if (disease === "monochromacy") {
    colorsToUse = monochromacy.use;
  } else {
    colorsToUse = ["#000000"];
  }

  useEffect(() => {
    const getExpensesHistory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/get-expenses/${userId}`);
        setExpensesHistory(response.data.expenses);
      } catch (error) {
        setError("Failed to load expenses.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getExpensesHistory();
  }, [userId]);

  const filteredExpenses = selectedCategory
    ? ExpensesHistory.filter((expense) => expense.category === selectedCategory)
    : ExpensesHistory;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={Styles.container}>
      <div className={Styles.selectContainer}>
        <label className={Styles.label}>Category:</label>
        <select
          className={Styles.select}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Personal">Personal</option>
          <option value="Education">Education</option>
          <option value="Health">Health</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {error && <div className={Styles.error}>{error}</div>}

      <h1 className={Styles.title}>Expenses History</h1>
      <table className={Styles.table}>
        <thead style={{ backgroundColor: colorsToUse[3] }} className={Styles.thead}>
          <tr className={Styles.tr}>
          <th className={Styles.th}>Sl.No</th>
            <th className={Styles.th}>Category</th>
            <th className={Styles.th}>Amount</th>
            <th className={Styles.th}>Date</th>
          </tr>
        </thead>

        <tbody className={Styles.tbody}>
          {filteredExpenses.map((expense, index) => (
            <tr className={Styles.tr} key={expense._id}>
              <td className={Styles.td}>{index + 1}</td>
              <td style={{ color: colorsToUse[3] }} className={Styles.td}>{expense.category}</td>
              <td className={Styles.td}>{expense.amount}</td>
              <td className={Styles.td}>{expense.date.slice(0, 10)}</td>
            </tr>
          ))}
          {filteredExpenses.length === 0 && (
            <tr className={Styles.tr}>
              <td colSpan="3" className={Styles.td}>
                No expenses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesHistory;
