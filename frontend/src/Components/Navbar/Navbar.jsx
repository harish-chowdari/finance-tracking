import React from "react";
import { FaUserCircle } from "react-icons/fa";
import Styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import { useColour } from "../../Context/UseContext";

const Navbar = () => {
  const name = localStorage.getItem("name");
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

  const navbarStyle = {
    backgroundColor: colorsToUse[0],
    color: "#FFFFFF",
  };

  const handleLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  return (
    <div className={Styles.navbar} style={navbarStyle}>
      <div className={Styles.logo}></div>
      <div className={Styles.userSection}>
        <FaUserCircle className={Styles.userIcon} />

        <NavLink
          to={`/finance/${name}/profile`}
          className={({ isActive }) =>
            `${Styles.link} ${isActive ? Styles.activeLink : ""}`
          }
          style={{ color: "#FFFFFF" }}
        >
          <span className={Styles.userName}>{name}</span>
        </NavLink>

        <button className={Styles.logoutButton} onClick={handleLogout} style={{ color: "#FFFFFF" }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;