import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the ChartDataLabels plugin
import axios from "../../axios";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Dashboard.module.css'; // Import the CSS file
import Styles from "./Dashboard.module.css";

// Register Chart.js components and the data labels plugin
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const FinanceTracker = () => {

    const userId = localStorage.getItem("userId");

  const [entries, setEntries] = useState([]);
  const contentRef = useRef(); // Reference for PDF generation

  // Fetch finance data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/get-expenses/${userId}`);
        setEntries(response.data.expenses); // Assuming the data is an array of finance objects
      } catch (error) {
        console.error('Error fetching finance data:', error);
      }
    };

    fetchData();
  }, []);

  // Group entries by category and calculate the total sum for each category
  const groupByCategory = (data) => {
    const categoryTotals = {};
    
    data.forEach((entry) => {
      if (!categoryTotals[entry.category]) {
        categoryTotals[entry.category] = 0;
      }
      categoryTotals[entry.category] += entry.amount;
    });

    // Convert the object to an array for easier rendering
    return Object.entries(categoryTotals).map(([category, totalAmount]) => ({
      category,
      totalAmount,
    }));
  };

  const groupedEntries = groupByCategory(entries);

  // Create chart data using the grouped categories
  const createChartData = () => ({
    labels: groupedEntries.map((entry) => entry.category),
    datasets: [
      {
        label: 'Total Amount ($)',
        data: groupedEntries.map((entry) => entry.totalAmount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  });

  // Generate chart options
  const getChartOptions = () => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Spend by Category',
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        margin: 10,
        formatter: (value) => `$${value.toFixed(2)}`, // Format amount to show on top of bars
        color: 'black',
        font: {
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
      
    },
    elements: {
    bar: {
      barThickness: 2, // Set the thickness of the bars (you can adjust this value)
    },
  },
  });

  // Function to generate PDF
  

  return (
    <div className="finance-tracker">
      {/* Both Chart and Finance Summary */}
      <div ref={contentRef} className="content">
        <h2>Finance Summary</h2>
        {entries.length === 0 ? (
          <p className="loading">Loading data...</p>
        ) : (
          <>
            {/* Render the Bar chart */}
            <div className={Styles.chartContainer}>
              <Bar data={createChartData()} options={getChartOptions()} />
            </div>

            {/* Render Finance Summary */}
            <h1 className={Styles.title}>Expenses Summary by Category</h1>
            <table className={Styles.table}>
              <thead className={Styles.thead}>
                <tr className={Styles.tr}>
                  <th className={Styles.th}>Category</th>
                  <th className={Styles.th}>Total Amount</th>
                </tr>
              </thead>
              <tbody className={Styles.tbody}>
                {groupedEntries.map((expense, index) => (
                  <tr className={Styles.tr} key={index}>
                    <td className={Styles.td}>{expense.category}</td>
                    <td className={Styles.td}>${expense.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default FinanceTracker;
