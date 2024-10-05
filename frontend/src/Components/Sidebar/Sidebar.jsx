import React from "react";
import { NavLink } from "react-router-dom"; 
import { FaMoneyBill, FaTachometerAlt, FaDollarSign } from "react-icons/fa";
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
        <FaTachometerAlt className={Styles.icon} /> Expenses History
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
        <FaTachometerAlt className={Styles.icon} /> Download
      </NavLink>
    </div>
  );
};

export default Sidebar;
