import React from 'react';
import styles from './Home.module.css'; // Import CSS module for styling

const Home = () => {
  return (
    <div className={styles.home}>
      <h1 className={styles.homeTitle}>Welcome to Your Finance Tracker</h1>
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <h2>Total Expenses</h2>
          <p className={styles.amount}>$2,500</p>
        </div>
        <div className={styles.summaryItem}>
          <h2>Monthly Budget</h2>
          <p className={styles.amount}>$3,000</p>
        </div>
        <div className={styles.summaryItem}>
          <h2>Remaining Budget</h2>
          <p className={styles.amount}>$500</p>
        </div>
      </div>
      <div className={styles.quickLinks}>
        <h2>Quick Links</h2>
        <div className={styles.link}>
          <button>Add Expenses</button>
        </div>
        <div className={styles.link}>
          <button>View Reports</button>
        </div>
        <div className={styles.link}>
          <button>Budget Overview</button>
        </div>
      </div>
      <div className={styles.chart}>
        <h2>Spending Trends</h2>
        <div className={styles.chartPlaceholder}>[Chart Placeholder]</div>
      </div>
    </div>
  );
}

export default Home;
