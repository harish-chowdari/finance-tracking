import React from 'react';
import { Outlet } from 'react-router-dom';
import "./Layout.css";
import Sidebar from '../Components/Sidebar/Sidebar';
import Navbar from '../Components/Navbar/Navbar';

const SidebarLayout = () => {
  return (
    <div className="sidebar-layout">
      <Sidebar /> {/* Sidebar on the left */}
      <div className="main-content">
        <Navbar className="navbar" /> {/* Navbar at the top, beside the sidebar */}
        <div className="content-area">
          <Outlet /> {/* Main content area */}
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
