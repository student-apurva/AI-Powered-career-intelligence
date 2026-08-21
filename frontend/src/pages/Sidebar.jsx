import React from "react";
import "../styles/Sidebar.css";

import {
  FaThLarge,
  FaUser,
  FaChartLine,
  FaBriefcase,
  FaGraduationCap,
  FaMagic,
  FaSignOutAlt,
  FaFileAlt,
} from "react-icons/fa";

import { HiSparkles } from "react-icons/hi";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {

  // =====================================================
  // SIDEBAR MENU
  // =====================================================

  const menuItems = [

    {
      title: "Dashboard",
      icon: <FaThLarge />,
      path: "/dashboard-analytics",
    },

    {
      title: "Profile",
      icon: <FaUser />,
      path: "/profile",
    },

    // ===================================================
    // NEW - LIVE RESUME BUILDER
    // ===================================================

    {
      title: "Resume Builder",
      icon: <FaFileAlt />,
      path: "/resume-builder",
    },

    {
      title: "Resume Improvement",
      icon: <FaMagic />,
      path: "/resume-improvement",
    },

    {
      title: "ATS Analysis",
      icon: <FaChartLine />,
      path: "/analyze",
    },

    {
      title: "Career Recommendation",
      icon: <HiSparkles />,
      path: "/career-recom",
    },

    {
      title: "Job Recommendation",
      icon: <FaBriefcase />,
      path: "/job-recommendations",
    },

    {
      title: "Courses",
      icon: <FaGraduationCap />,
      path: "/courses",
    },

  ];


  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigate = useNavigate();


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <aside className="sidebar">


      {/* =================================================
          LOGO / BRAND
      ================================================= */}

      <div className="sidebar-logo">

        <div className="logo-icon">
          A
        </div>

        <div>

          <h2>
            Ascendra AI
          </h2>

          <p>
            Career Intelligence
          </p>

        </div>

      </div>


      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav className="sidebar-menu">

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "menu-item active"
                : "menu-item"
            }
          >

            <span className="menu-icon">

              {item.icon}

            </span>

            <span>

              {item.title}

            </span>

          </NavLink>

        ))}

      </nav>


      {/* =================================================
          LOGOUT
      ================================================= */}

      <button
        type="button"
        className="logout-btn"
        onClick={handleLogout}
      >

        <span className="logout-icon">

          <FaSignOutAlt />

        </span>

        <span>

          Logout

        </span>

      </button>


    </aside>

  );

}