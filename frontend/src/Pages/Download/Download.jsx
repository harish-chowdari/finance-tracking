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
import { useColour } from "../../Context/UseContext";

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

  const filteredExpenses = selectedDate
    ? ExpensesHistory.filter(
        (expense) => expense.date.slice(0, 10) === selectedDate
      )
    : ExpensesHistory;

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

    doc.text("Expenses Summary for " + selectedDate, 14, 16);

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

    const allTableData = ExpensesHistory.map((expense, index) => [
      index + 1,
      expense.category,
      expense.amount,
      expense.date.slice(0, 10),
    ]);

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

  const chartData = {
    labels: aggregatedExpenses.map((expense) => expense.category),
    datasets: [
      {
        label: "Amount",
        data: aggregatedExpenses.map((expense) => expense.amount),
        backgroundColor: colorsToUse[3],
        borderColor: colorsToUse[3],
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
        <label className={Styles.label}>Select a date to download PDF:</label>
        <div className={Styles.inputContainer}>
          <input
            className={Styles.input}
            type="date"
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <button style={{ backgroundColor: colorsToUse[1] }} className={Styles.downloadButton} onClick={downloadPDF}>
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

      <h1 className={Styles.title}>
        {selectedDate ? "Expenses Summary" : "All Expenses"}
      </h1>
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