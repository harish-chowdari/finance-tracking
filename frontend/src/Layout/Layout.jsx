import React from 'react';
import { Outlet } from 'react-router-dom';
import "./Layout.css";
import Sidebar from '../Components/Sidebar/Sidebar';
import Navbar from '../Components/Navbar/Navbar';

const Layout = () => {
  return (
    <div className="sidebar-layout">
      <Sidebar /> 
      <div className="main-content">
        <Navbar className="navbar" /> 
        <div className="content-area">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default Layout;
