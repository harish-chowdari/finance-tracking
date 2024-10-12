import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaMoneyBill,
  FaTachometerAlt,
  FaDollarSign,
  FaDownload,
  FaMoneyBillWave,
  FaHistory,
  FaFileInvoice,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import Styles from "./Sidebar.module.css";
import { useColour } from "../../Context/UseContext";

const Sidebar = () => {
  const name = localStorage.getItem("name");
  const disease = localStorage.getItem("disease");

  const { tritanopia, protanopia, deuteranopia, monochromacy } = useColour();
  let colorsToUse;

  if (disease === "protanopia") {
    colorsToUse = protanopia.use;
  } else if (disease === "tritanopia") {
    colorsToUse = tritanopia.use;
  } 
  
  else if (disease === "deuteranopia") {
    colorsToUse = deuteranopia.use;
  } 
  else if (disease === "monochromacy") {
    colorsToUse = monochromacy.use;
  }
  else {
    colorsToUse = ["#000000"]; 
  }

  const userId = localStorage.getItem("userId");
  const sidebarStyle = {
    backgroundColor: colorsToUse[0], 
    color: "#FFFFFF", 
  };

  return (
    <div className={Styles.sidebar} style={sidebarStyle}>
      <div className={Styles.financeSection} style={{ color: "#FFFFFF" }}>
        <FaDollarSign className={Styles.financeIcon} />
        <h2 className={Styles.financeText}>Finance</h2>
      </div>

      <NavLink
        to={`/finance/${name}/addexpenses`}
        className={({ isActive }) => `${Styles.link} ${isActive ? Styles.activeLink : ''}`}
        style={{ color: "#FFFFFF" }} 
      >
        <FaMoneyBill className={Styles.icon} /> Add Expenses
      </NavLink>

      <NavLink
        to={`/finance/${name}/expenses-history`}
        className={({ isActive }) => `${Styles.link} ${isActive ? Styles.activeLink : ''}`}
        style={{ color: "#FFFFFF" }} 
      >
        <FaHistory className={Styles.icon} /> Expenses History
      </NavLink>

      <NavLink
        to={`/finance/${name}/dashboard`}
        className={({ isActive }) => `${Styles.link} ${isActive ? Styles.activeLink : ''}`}
        style={{ color: "#FFFFFF" }} 
      >
        <FaTachometerAlt className={Styles.icon} /> Dashboard
      </NavLink>

      <NavLink
        to={`/finance/${name}/download`}
        className={({ isActive }) => `${Styles.link} ${isActive ? Styles.activeLink : ''}`}
        style={{ color: "#FFFFFF" }} 
      >
        <FaDownload className={Styles.icon} /> Download
      </NavLink>

      <NavLink
        to={`/finance/${name}/add-bill`}
        className={({ isActive }) => `${Styles.link} ${isActive ? Styles.activeLink : ''}`}
        style={{ color: "#FFFFFF" }} 
      >
        <FaFileInvoiceDollar className={Styles.icon} /> Add Bill
      </NavLink>

      <NavLink
        to={`/finance/${name}/view-bill`}
        className={({ isActive }) => `${Styles.link} ${isActive ? Styles.activeLink : ''}`}
        style={{ color: "#FFFFFF" }} 
      >
        <FaFileInvoice className={Styles.icon} /> View Bill
      </NavLink>
    </div>
  );
};

export default Sidebar;