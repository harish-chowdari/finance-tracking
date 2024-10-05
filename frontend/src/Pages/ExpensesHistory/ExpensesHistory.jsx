import React from "react";
import { useState, useEffect } from "react";
import axios from "../../axios";
import Styles from "./ExpensesHistory.module.css";

const ExpensesHistory = () => {
  const userId = localStorage.getItem("userId");

  const [ExpensesHistory, setExpensesHistory] = useState([]);

  useEffect(() => {
    const getExpensesHistory = async () => {
      try {
        const response = await axios.get(`/get-expenses/${userId}`);
    setExpensesHistory(response.data.expenses);
        console.log(response.data.expenses);
      } catch (error) {
        console.log(error);
      }
    };

    getExpensesHistory();
  }, []);

  return (
    <div className={Styles.container}>
      <h1 className={Styles.title}>Expenses History</h1>
      <table className={Styles.table}>
        <thead className={Styles.thead}>
          <tr className={Styles.tr}>
            <th className={Styles.th}>Category</th>
            <th className={Styles.th}>Amount</th>
            <th className={Styles.th}>Date</th>
          </tr>
        </thead>

        <tbody className={Styles.tbody}>
          {ExpensesHistory.map((expense) => (
            <tr className={Styles.tr} key={expense._id}>
              <td className={Styles.td}>{expense.category}</td>
              <td className={Styles.td}>{expense.amount}</td>
              <td className={Styles.td}>{expense.date.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesHistory;
