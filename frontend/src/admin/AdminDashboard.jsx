import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

import {
  FaUsers,
  FaFileAlt,
  FaChartLine,
  FaBriefcase,
  FaBook,
  FaCheckCircle,
  FaExclamationTriangle,
  FaServer
} from "react-icons/fa";

import "./AdminDashboard.css";


const API_URL = "http://localhost:8000";


export default function AdminDashboard() {
const navigate = useNavigate();

const [statistics, setStatistics] = useState({
  users: {
    total: 0
  },
  resumes: {
    total: 0
  },
  ats: {
    total_analyses: 0
  },
  jobs: {
    total: 0
  },
  courses: {
    total: 0
  }
});


  const [loading, setLoading] = useState(true);


  const [error, setError] = useState("");


  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================

  useEffect(() => {

    loadDashboard();

  }, []);


const loadDashboard = async () => {

  try {

    setLoading(true);
    setError("");

    const token =
      localStorage.getItem("adminToken");

    if (!token) {

      setError(
        "Admin session not found. Please login again."
      );

      return;
    }

const response = await axios.get(
  `${API_URL}/api/admin/reports/overview`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

console.log("ADMIN DASHBOARD RESPONSE:", response.data);

if (
  response.data &&
  response.data.success
) {
  setStatistics(response.data.report);
} else {

      setError(
        "Unable to load dashboard data"
      );

    }

  } catch (error) {

    console.error(
      "Admin dashboard error:",
      error
    );

    setError(
      error.response?.data?.detail ||
      "Unable to load dashboard data"
    );

  } finally {

    setLoading(false);

  }

};


  return (

    <div className="admin-layout">

      {/* Sidebar */}

      <AdminSidebar />


      {/* Main */}

      <main className="admin-main">

        {/* Header */}

        <header className="admin-header">

          <div>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Monitor your AI Career Intelligence platform
            </p>

          </div>


          <div className="admin-header-status">

            <FaCheckCircle />

            <span>
              Admin Access
            </span>

          </div>

        </header>


        {/* Error */}

        {error && (

          <div className="admin-error">

            <FaExclamationTriangle />

            {error}

          </div>

        )}


        {/* Statistics */}

        <section className="admin-stat-grid">


          {/* Users */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon users">
              <FaUsers />
            </div>

            <div>

              <span>
                Total Users
              </span>

              <h2>
               {loading
  ? "..."
  : statistics.users?.total}
              </h2>

            </div>

          </div>


          {/* Resumes */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon resumes">
              <FaFileAlt />
            </div>

            <div>

              <span>
                Total Resumes
              </span>

              <h2>
               {loading
  ? "..."
  : statistics.resumes?.total}
              </h2>

            </div>

          </div>


          {/* ATS */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon ats">
              <FaChartLine />
            </div>

            <div>

              <span>
                ATS Analyses
              </span>

              <h2>
                {loading
  ? "..."
  : statistics.ats?.total_analyses}
              </h2>

            </div>

          </div>


          {/* Jobs */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon jobs">
              <FaBriefcase />
            </div>

            <div>

              <span>
                Total Jobs
              </span>

              <h2>
                {loading
  ? "..."
  : statistics.jobs?.total}
              </h2>

            </div>

          </div>


          {/* Courses */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon courses">
              <FaBook />
            </div>

            <div>

              <span>
                Total Courses
              </span>

              <h2>
                {loading
  ? "..."
  : statistics.courses?.total}
              </h2>

            </div>

          </div>


          {/* System */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon system">
              <FaServer />
            </div>

            <div>

              <span>
                System
              </span>

              <h2>
                Online
              </h2>

            </div>

          </div>

        </section>


        {/* Dashboard Content */}

        <section className="admin-content-grid">


          {/* Welcome */}

          <div className="admin-panel admin-welcome">

            <div className="admin-panel-header">

              <div>

                <h2>
                  Platform Overview
                </h2>

                <p>
                  AI Career Intelligence
                </p>

              </div>

              <FaChartLine />

            </div>


            <div className="admin-overview-content">

              <h3>
                Welcome to the Admin Panel
              </h3>

              <p>
                Monitor users, resumes, ATS analysis,
                career recommendations, jobs and
                learning resources from one place.
              </p>

            </div>

          </div>


          {/* Quick Actions */}

          <div className="admin-panel">

            <div className="admin-panel-header">

              <div>

                <h2>
                  Quick Actions
                </h2>

                <p>
                  Manage your platform
                </p>

              </div>

            </div>


            <div className="admin-quick-actions">

              <button onClick={() => navigate("/admin/users")}>
  <FaUsers />
  Manage Users
</button>

<button onClick={() => navigate("/admin/resumes")}>
  <FaFileAlt />
  View Resumes
</button>

<button onClick={() => navigate("/admin/jobs")}>
  <FaBriefcase />
  Manage Jobs
</button>

<button onClick={() => navigate("/admin/courses")}>
  <FaBook />
  Manage Courses
</button>

            </div>

          </div>

        </section>

      </main>

    </div>

  );

}