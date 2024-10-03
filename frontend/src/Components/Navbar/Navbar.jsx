import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Styles from './Navbar.module.css';

const Navbar = () => {
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.removeItem("name");
    window.location.href = '/';
  };

  return (
    <div className={Styles.navbar}>
      <div className={Styles.logo}></div>
      <div className={Styles.userSection}>
        <FaUserCircle className={Styles.userIcon} />
        <span className={Styles.userName}>{name}</span>
        <button className={Styles.logoutButton} onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
