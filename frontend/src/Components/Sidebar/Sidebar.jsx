import React from 'react';
import { Link } from 'react-router-dom';
import { FaMoneyBill, FaTachometerAlt, FaDollarSign } from 'react-icons/fa'; // Import icons from react-icons
import Styles from './Sidebar.module.css';

const Sidebar = () => {
  const name = localStorage.getItem("name");
  return (
    <div className={Styles.sidebar}>
      {/* Finance Section */}
      <div className={Styles.financeSection}>
        <FaDollarSign className={Styles.financeIcon} />
        <h2 className={Styles.financeText}>Finance</h2>
      </div>
      
      {/* Links */}
      <Link to={`/finance/${name}/addexpenses`} className={Styles.link}>
        <FaMoneyBill className={Styles.icon} /> Add Expenses
      </Link>
      <Link to={`/finance/${name}/dashboard`} className={Styles.link}>
        <FaTachometerAlt className={Styles.icon} /> Dashboard
      </Link>
    </div>
  );
};

export default Sidebar;
