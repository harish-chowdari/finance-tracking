import React from "react";
import { FaUserCircle } from "react-icons/fa";
import Styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  return (
    <div className={Styles.navbar}>
      <div className={Styles.logo}></div>
      <div className={Styles.userSection}>
        <FaUserCircle className={Styles.userIcon} />

        <NavLink
          to={`/finance/${name}/profile`}
          className={({ isActive }) =>
            `${Styles.link} ${isActive ? Styles.activeLink : ""}`
          }
        >
          <span className={Styles.userName}>{name}</span>
        </NavLink>

        <button className={Styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
