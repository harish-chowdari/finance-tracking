import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Import user icon
import Styles from './Navbar.module.css';

const Navbar = () => {
  const name = localStorage.getItem("name"); // Get the user's name from local storage

  return (
    <div className={Styles.navbar}>
      <div className={Styles.logo}></div>
      <div className={Styles.userSection}>
        <FaUserCircle className={Styles.userIcon} />
        <span className={Styles.userName}>{name}</span>
      </div>
    </div>
  );
};

export default Navbar;
