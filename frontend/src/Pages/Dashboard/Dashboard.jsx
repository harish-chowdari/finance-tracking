import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Styles from './Dashboard.module.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExpensesChart = () => {
    const [expenses, setExpenses] = useState([]);
    const userId = localStorage.getItem('userId');
    const tableRef = useRef(null); // Reference for the table
    const chartRef = useRef(null); // Reference for the chart

    // Fetch data from API
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get(`http://localhost:4003/api/get-expenses/${userId}`);
                setExpenses(response.data.expenses);
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        };

        fetchExpenses();
    }, [userId]);

    // Function to split expenses into chunks of a specified size
    const chunkArray = (arr, size) => {
        return arr.reduce((acc, _, index) => {
            if (index % size === 0) {
                acc.push(arr.slice(index, index + size));
            }
            return acc;
        }, []);
    };

    // Prepare data for charts
    const expensesChunks = chunkArray(expenses, 10);



    const downloadPDF = async () => {
      const pdf = new jsPDF('p', 'mm', 'a4'); // Create jsPDF object

      // Capture chart
      if (chartRef.current) {
          const chartCanvas = await html2canvas(chartRef.current, { scale: 2 }); // Increase scale for better resolution
          const chartImageData = chartCanvas.toDataURL('image/png');
          pdf.addImage(chartImageData, 'PNG', 10, 10, 190, (chartCanvas.height * 190) / chartCanvas.width); // Maintain aspect ratio
      }

      // Add a new page for the table
      pdf.addPage();
      
      // Set initial Y position for the table
      let yPosition = 20; // Start a little lower for the header
      const itemsPerPage = 20; // Number of items to display per page

      // Create table headers
      pdf.setFontSize(12);
      pdf.text("S.No", 10, yPosition);
      pdf.text("Category", 30, yPosition);
      pdf.text("Amount", 100, yPosition);
      pdf.text("Date", 150, yPosition);
      yPosition += 10; // Move down for the first row

      // Loop through expenses and add to PDF
      expenses.forEach((expense, index) => {
          // Check if a new page is needed
          if (index > 0 && index % itemsPerPage === 0) {
              pdf.addPage(); // Add a new page for subsequent entries
              yPosition = 20; // Reset Y position for new page
              
              // Re-add the table headers on the new page
              pdf.setFontSize(12);
              pdf.text("S.No", 10, yPosition);
              pdf.text("Category", 30, yPosition);
              pdf.text("Amount", 100, yPosition);
              pdf.text("Date", 150, yPosition);
              yPosition += 10; // Move down for the first row
          }

          // Add expenses rows with serial number
          pdf.text((index + 1).toString(), 10, yPosition); // Serial number
          pdf.text(expense.category, 30, yPosition);
          pdf.text(expense.amount.toString(), 100, yPosition);
          pdf.text(expense.date.slice(0, 10), 150, yPosition);
          yPosition += 10; // Move down for the next row
      });

      // Save PDF
      pdf.save('expenses.pdf');
  };


    return (
        <div>
            <h1>Expenses Chart</h1>
            {expensesChunks.map((chunk, chunkIndex) => {
                // Prepare chart data for each chunk
                const chartData = {
                    labels: chunk.map(expense => expense.category), // X-axis labels (categories)
                    datasets: [
                        {
                            label: 'Amount ($)',
                            data: chunk.map(expense => expense.amount), // Y-axis data (amounts)
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                };

                // Chart options
                const chartOptions = {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: `Expenses by Category (Chart ${chunkIndex + 1})`,
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                };

                return (
                    <div key={chunkIndex}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                );
            })}

            <h1 className={Styles.title}>Expenses History</h1>
            <table className={Styles.table} ref={tableRef}>
                <thead className={Styles.thead}>
                    <tr className={Styles.tr}>
                        <th className={Styles.th}>S.No</th> {/* Serial Number Header */}
                        <th className={Styles.th}>Category</th>
                        <th className={Styles.th}>Amount</th>
                        <th className={Styles.th}>Date</th>
                    </tr>
                </thead>

                <tbody className={Styles.tbody}>
                    {expenses.map((expense, index) => ( // Limit to 50 rows
                        <tr className={Styles.tr} key={expense._id}>
                            <td className={Styles.td}>{index + 1}</td> {/* Serial Number in Table */}
                            <td className={Styles.td}>{expense.category}</td>
                            <td className={Styles.td}>{expense.amount}</td>
                            <td className={Styles.td}>{expense.date.slice(0, 10)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Download PDF button */}
            <button onClick={downloadPDF}>Download as PDF</button>
        </div>
    );
};

export default ExpensesChart;
