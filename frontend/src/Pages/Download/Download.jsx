import React, { useState, useEffect } from "react";
import axios from "../../axios";
import Styles from "./Download.module.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import "jspdf-autotable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Download = () => {
  const userId = localStorage.getItem("userId");
  const [ExpensesHistory, setExpensesHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = React.createRef();

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

  const filteredExpenses = selectedDate
    ? ExpensesHistory.filter(
        (expense) => expense.date.slice(0, 10) === selectedDate
      )
    : ExpensesHistory;

  // Aggregate expenses by category
  const aggregatedExpenses = filteredExpenses.reduce((acc, expense) => {
    const found = acc.find((item) => item.category === expense.category);
    if (found) {
      found.amount += expense.amount; // Sum the amounts for the same category
    } else {
      acc.push({ category: expense.category, amount: expense.amount });
    }
    return acc;
  }, []);

  const downloadPDF = async () => {
    const doc = new jsPDF();

    // Title
    doc.text("Expenses Summary for " + selectedDate, 14, 16);

    // Create a table for filtered expenses
    const tableData = filteredExpenses.map((expense, index) => [
      index + 1,
      expense.category,
      expense.amount,
      expense.date.slice(0, 10),
    ]);

    doc.autoTable({
      head: [["Sl.No", "Category", "Amount", "Date"]],
      body: tableData,
      startY: 30,
    });

    // Convert chart to image
    if (chartRef.current) {
      const chartCanvas = chartRef.current.canvas;
      const chartImage = chartCanvas.toDataURL("image/png");
      doc.addImage(
        chartImage,
        "PNG",
        14,
        doc.autoTable.previous.finalY + 10,
        180,
        100
      );
    }

    // Create a table for all expenses
    const allTableData = ExpensesHistory.map((expense, index) => [
      index + 1,
      expense.category,
      expense.amount,
      expense.date.slice(0, 10),
    ]);

    // Add a new page for all expenses table if needed
    doc.addPage();

    doc.text("All Expenses History", 14, 16);

    doc.autoTable({
      head: [["Sl.No", "Category", "Amount", "Date"]],
      body: allTableData,
      startY: 30,
    });

    doc.save("expenses_history.pdf");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Prepare data for the chart
  const chartData = {
    labels: aggregatedExpenses.map((expense) => expense.category),
    datasets: [
      {
        label: "Amount",
        data: aggregatedExpenses.map((expense) => expense.amount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Expenses by Category",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.selectContainer}>
        <label className={Styles.label}>Select Date:</label>
        <div className={Styles.inputContainer}>
        <input
          className={Styles.input}
          type="date"
          onChange={(e) => setSelectedDate(e.target.value)} // Set the selected date
        />

        <button className={Styles.downloadButton} onClick={downloadPDF}>
          Download PDF
        </button>
        </div>
      </div>

      {error && <div className={Styles.error}>{error}</div>}

      {selectedDate && aggregatedExpenses.length > 0 && (
        <div className={Styles.chartContainer}>
          <Bar ref={chartRef} data={chartData} options={chartOptions} />
        </div>
      )}

      <h1 className={Styles.title}>Expenses Summary</h1>
      <table className={Styles.table}>
        <thead className={Styles.thead}>
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
              <td className={Styles.td}>{expense.category}</td>
              <td className={Styles.td}>{expense.amount}</td>
              <td className={Styles.td}>{expense.date.slice(0, 10)}</td>
            </tr>
          ))}
          {filteredExpenses.length === 0 && (
            <tr className={Styles.tr}>
              <td colSpan="4" className={Styles.td}>
                No expenses found for the selected date.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Download;
