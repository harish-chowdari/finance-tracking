import React from "react";
import { NavLink } from "react-router-dom"; 
import { FaMoneyBill, FaTachometerAlt, FaDollarSign, FaDashcube, FaDownload, FaMoneyBillWave, FaHornbill, FaHistory, FaFileInvoice, FaFileInvoiceDollar } from "react-icons/fa";
import Styles from "./Sidebar.module.css";

const Sidebar = () => {
  const name = localStorage.getItem("name");

  return (
    <div className={Styles.sidebar}>
      <div className={Styles.financeSection}>
        <FaDollarSign className={Styles.financeIcon} />
        <h2 className={Styles.financeText}>Finance</h2>
      </div>

      <NavLink 
        to={`/finance/${name}/addexpenses`} 
        className={({ isActive }) => `${Styles.link} ${isActive ? Styles.activeLink : ''}`} 
      >
        <FaMoneyBill className={Styles.icon} /> Add Expenses
      </NavLink>

      <NavLink 
        to={`/finance/${name}/expenses-history`} 
        className={({ isActive }) => `${Styles.link} ${isActive ? Styles.activeLink : ''}`}
      >
        <FaHistory className={Styles.icon} /> Expenses History
      </NavLink>

      <NavLink 
        to={`/finance/${name}/dashboard`} 
        className={({ isActive }) => `${Styles.link} ${isActive ? Styles.activeLink : ''}`}
      >
        <FaTachometerAlt className={Styles.icon} /> Dashboard
      </NavLink>

      <NavLink 
        to={`/finance/${name}/download`} 
        className={({ isActive }) => `${Styles.link} ${isActive ? Styles.activeLink : ''}`}
      >
        <FaDownload className={Styles.icon} /> Download
      </NavLink>

      <NavLink 
        to={`/finance/${name}/add-bill`} 
        className={({ isActive }) => `${Styles.link} ${isActive ? Styles.activeLink : ''}`}
      >
        <FaFileInvoiceDollar className={Styles.icon} /> Add Bill
      </NavLink>

      <NavLink 
        to={`/finance/${name}/view-bill`} 
        className={({ isActive }) => `${Styles.link} ${isActive ? Styles.activeLink : ''}`}
      >
        <FaFileInvoice className={Styles.icon} /> View Bill
      </NavLink>
    </div>
  );
};

export default Sidebar;
