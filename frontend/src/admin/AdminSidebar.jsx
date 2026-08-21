import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUsers,
  FaUserCircle,
  FaFileAlt,
  FaChartLine,
  FaLightbulb,
  FaBriefcase,
  FaBook,
  FaHistory,
  FaChartBar,
  FaServer,
  FaSignOutAlt
} from "react-icons/fa";

import "./AdminSidebar.css";


export default function AdminSidebar() {

  const navigate = useNavigate();


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    // Remove admin authentication token
    localStorage.removeItem("adminToken");

    // Optional: remove other admin-related data
    localStorage.removeItem("admin");

    // Redirect to admin login
    navigate("/admin/login", {
      replace: true
    });

  };


  // =====================================================
  // MENU ITEMS
  // =====================================================

  const menuItems = [

    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt />
    },

    {
      path: "/admin/users",
      label: "Users",
      icon: <FaUsers />
    },

    {
      path: "/admin/profiles",
      label: "Profiles",
      icon: <FaUserCircle />
    },

    {
      path: "/admin/resumes",
      label: "Resumes",
      icon: <FaFileAlt />
    },

    {
      path: "/admin/ats",
      label: "ATS Analysis",
      icon: <FaChartLine />
    },

    {
      path: "/admin/skills",
      label: "Skill Analytics",
      icon: <FaLightbulb />
    },

    {
      path: "/admin/careers",
      label: "Career Analytics",
      icon: <FaChartBar />
    },

    {
      path: "/admin/jobs",
      label: "Jobs",
      icon: <FaBriefcase />
    },

    {
      path: "/admin/courses",
      label: "Courses",
      icon: <FaBook />
    },

    {
      path: "/admin/activity",
      label: "Activity",
      icon: <FaHistory />
    },

    {
      path: "/admin/reports",
      label: "Reports",
      icon: <FaChartBar />
    },

    {
      path: "/admin/system-status",
      label: "System Status",
      icon: <FaServer />
    }

  ];


  return (

    <aside className="admin-sidebar">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-sidebar-header">

        <div className="admin-logo">
          AI
        </div>

        <div className="admin-brand">

          <h2>
            Ascendra AI
          </h2>

          <span>
            Admin Panel
          </span>

        </div>

      </div>


      {/* =================================================
          SCROLLABLE MENU
      ================================================= */}

      <nav className="admin-sidebar-menu">

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `admin-sidebar-item ${
                isActive ? "active" : ""
              }`
            }
          >

            {item.icon}

            <span>
              {item.label}
            </span>

          </NavLink>

        ))}

      </nav>


      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="admin-sidebar-footer">


        {/* Admin Information */}

        <div className="admin-user">

          <div className="admin-user-avatar">
            A
          </div>

          <div className="admin-user-info">

            <strong>
              Administrator
            </strong>

            <span>
              Admin Access
            </span>

          </div>

        </div>


        {/* Logout */}

        <button
          type="button"
          className="admin-logout-btn"
          onClick={handleLogout}
        >

          <FaSignOutAlt />

          <span>
            Logout
          </span>

        </button>


      </div>

    </aside>

  );

}