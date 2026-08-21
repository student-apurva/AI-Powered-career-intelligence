import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import AdminSidebar from "./AdminSidebar";

import {
  FaUsers,
  FaFileAlt,
  FaChartLine,
  FaBriefcase,
  FaBook,
  FaUserTie,
  FaSyncAlt,
  FaClock,
  FaRobot,
  FaChartBar,
  FaExclamationTriangle
} from "react-icons/fa";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

import "./AdminReports.css";


// =========================================================
// API
// =========================================================

const API_URL = "http://localhost:8000";


// =========================================================
// COLORS
// =========================================================

const PIE_COLORS = [
  "#168aad",
  "#76c893",
  "#d9ed92"
];


// =========================================================
// COMPONENT
// =========================================================

export default function AdminReports() {

  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");


  // =======================================================
  // LOAD REPORT
  // =======================================================

  useEffect(() => {

    loadReports();

  }, []);


  const loadReports = async () => {

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


      console.log(
        "ADMIN REPORT RESPONSE:",
        response.data
      );


      if (
        response.data &&
        response.data.success
      ) {

        setReport(
          response.data.report
        );

      } else {

        setError(
          "Unable to load reports."
        );

      }

    } catch (err) {

      console.error(
        "Admin reports error:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to load reports."
      );

    } finally {

      setLoading(false);

    }

  };


  // =======================================================
  // REFRESH
  // =======================================================

  const handleRefresh = async () => {

    try {

      setRefreshing(true);

      await loadReports();

    } finally {

      setRefreshing(false);

    }

  };


  // =======================================================
  // SAFE REPORT OBJECT
  // =======================================================

  const users =
    report?.users || {};

  const resumes =
    report?.resumes || {};

  const ats =
    report?.ats || {};

  const jobs =
    report?.jobs || {};

  const courses =
    report?.courses || {};

  const careers =
    report?.careers || {};

  const activity =
    report?.activity || {};


  // =======================================================
  // USER DISTRIBUTION
  // =======================================================

  const userDistributionData = useMemo(() => {

    return [

      {
        name: "Students",
        value: Number(
          users.students || 0
        )
      },

      {
        name: "Professionals",
        value: Number(
          users.professionals || 0
        )
      },

      {
        name: "Recruiters",
        value: Number(
          users.recruiters || 0
        )
      }

    ];

  }, [users]);


  // =======================================================
  // PLATFORM OVERVIEW
  // =======================================================

  const platformChartData = useMemo(() => {

    return [

      {
        name: "Users",
        value: Number(
          users.total || 0
        )
      },

      {
        name: "Resumes",
        value: Number(
          resumes.total || 0
        )
      },

      {
        name: "ATS",
        value: Number(
          ats.total_analyses || 0
        )
      },

      {
        name: "Jobs",
        value: Number(
          jobs.total || 0
        )
      },

      {
        name: "Courses",
        value: Number(
          courses.total || 0
        )
      },

      {
        name: "Career Rec.",
        value: Number(
          careers.recommendations || 0
        )
      }

    ];

  }, [
    users,
    resumes,
    ats,
    jobs,
    courses,
    careers
  ]);


  // =======================================================
  // ATS PERFORMANCE
  // =======================================================

  const atsChartData = useMemo(() => {

    return [

      {
        name: "ATS Score",
        value: Number(
          ats.average_ats_score || 0
        )
      },

      {
        name: "Coverage",
        value: Number(
          ats.average_coverage_score || 0
        )
      }

    ];

  }, [ats]);


  // =======================================================
  // ACTIVITY
  // =======================================================

  const activityChartData = useMemo(() => {

    return [

      {
        name: "Career",
        value: Number(
          careers.recommendations || 0
        )
      },

      {
        name: "Job Rec.",
        value: Number(
          jobs.recommendations || 0
        )
      },

      {
        name: "Saved Jobs",
        value: Number(
          jobs.saved || 0
        )
      },

      {
        name: "Resume",
        value: Number(
          resumes.improvements || 0
        )
      },

      {
        name: "Courses",
        value: Number(
          courses.recommendations || 0
        )
      }

    ];

  }, [
    careers,
    jobs,
    resumes,
    courses
  ]);


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {

    return (

      <div className="admin-layout">

        <AdminSidebar />

        <main className="admin-main">

          <div className="reports-loading">

            <FaSyncAlt className="reports-loading-icon" />

            <p>
              Loading reports...
            </p>

          </div>

        </main>

      </div>

    );

  }


  // =======================================================
  // MAIN UI
  // =======================================================

  return (

    <div className="admin-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <AdminSidebar />


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-main reports-page">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="reports-header">

          <div>

            <div className="reports-title-row">

              <FaChartBar />

              <h1>
                Reports & Analytics
              </h1>

            </div>

            <p>
              Detailed analytics of your AI Career
              Intelligence platform
            </p>

          </div>


          <button
            className="reports-refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >

            <FaSyncAlt
              className={
                refreshing
                  ? "refresh-spinning"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </header>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="reports-error">

            <FaExclamationTriangle />

            <span>
              {error}
            </span>

          </div>

        )}


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <section className="reports-overview-grid">


          {/* USERS */}

          <div className="report-summary-card">

            <div className="report-summary-icon users">

              <FaUsers />

            </div>

            <div>

              <span>
                Total Users
              </span>

              <h2>
                {users.total || 0}
              </h2>

              <small>
                Registered users
              </small>

            </div>

          </div>


          {/* RESUMES */}

          <div className="report-summary-card">

            <div className="report-summary-icon resumes">

              <FaFileAlt />

            </div>

            <div>

              <span>
                Total Resumes
              </span>

              <h2>
                {resumes.total || 0}
              </h2>

              <small>
                Uploaded resumes
              </small>

            </div>

          </div>


          {/* ATS */}

          <div className="report-summary-card">

            <div className="report-summary-icon ats">

              <FaChartLine />

            </div>

            <div>

              <span>
                ATS Analyses
              </span>

              <h2>
                {ats.total_analyses || 0}
              </h2>

              <small>
                Resume analyses
              </small>

            </div>

          </div>


          {/* JOBS */}

          <div className="report-summary-card">

            <div className="report-summary-icon jobs">

              <FaBriefcase />

            </div>

            <div>

              <span>
                Total Jobs
              </span>

              <h2>
                {jobs.total || 0}
              </h2>

              <small>
                Available jobs
              </small>

            </div>

          </div>


          {/* COURSES */}

          <div className="report-summary-card">

            <div className="report-summary-icon courses">

              <FaBook />

            </div>

            <div>

              <span>
                Total Courses
              </span>

              <h2>
                {courses.total || 0}
              </h2>

              <small>
                Learning resources
              </small>

            </div>

          </div>


          {/* CAREER */}

          <div className="report-summary-card">

            <div className="report-summary-icon careers">

              <FaUserTie />

            </div>

            <div>

              <span>
                Career Recommendations
              </span>

              <h2>
                {careers.recommendations || 0}
              </h2>

              <small>
                Recommendations generated
              </small>

            </div>

          </div>

        </section>


        {/* =================================================
            CHART ROW 1
        ================================================= */}

        <section className="reports-chart-grid">


          {/* =================================================
              USER DISTRIBUTION
          ================================================= */}

          <div className="report-chart-panel">

            <div className="report-panel-header">

              <div>

                <h2>
                  User Distribution
                </h2>

                <p>
                  Registered user breakdown
                </p>

              </div>

              <FaUsers />

            </div>


            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={userDistributionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={95}
                    innerRadius={45}
                    paddingAngle={3}
                    labelLine={false}
                    label={({
                      name,
                      value
                    }) =>
                      value > 0
                        ? `${name}: ${value}`
                        : ""
                    }
                  >

                    {userDistributionData.map(
                      (entry, index) => (

                        <Cell
                          key={`cell-${index}`}
                          fill={
                            PIE_COLORS[index %
                              PIE_COLORS.length]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                  />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* =================================================
              PLATFORM OVERVIEW
          ================================================= */}

          <div className="report-chart-panel">

            <div className="report-panel-header">

              <div>

                <h2>
                  Platform Overview
                </h2>

                <p>
                  Overall platform statistics
                </p>

              </div>

              <FaChartLine />

            </div>


            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={platformChartData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 0,
                    bottom: 10
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 11
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    fill="#168aad"
                    radius={[
                      6,
                      6,
                      0,
                      0
                    ]}
                    maxBarSize={50}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </section>


        {/* =================================================
            CHART ROW 2
        ================================================= */}

        <section className="reports-chart-grid">


          {/* =================================================
              ATS PERFORMANCE
          ================================================= */}

          <div className="report-chart-panel">

            <div className="report-panel-header">

              <div>

                <h2>
                  ATS Performance
                </h2>

                <p>
                  Average analysis scores
                </p>

              </div>

              <FaRobot />

            </div>


            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={atsChartData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 0,
                    bottom: 10
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                  />

                  <YAxis
                    domain={[0, 100]}
                    allowDecimals={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    fill="#34a0a4"
                    radius={[
                      6,
                      6,
                      0,
                      0
                    ]}
                    maxBarSize={65}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* =================================================
              ACTIVITY ANALYTICS
          ================================================= */}

          <div className="report-chart-panel">

            <div className="report-panel-header">

              <div>

                <h2>
                  Activity Analytics
                </h2>

                <p>
                  Platform activity overview
                </p>

              </div>

              <FaClock />

            </div>


            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={activityChartData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 0,
                    bottom: 10
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 10
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    fill="#76c893"
                    radius={[
                      6,
                      6,
                      0,
                      0
                    ]}
                    maxBarSize={55}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </section>


        {/* =================================================
            DETAILED ANALYTICS
        ================================================= */}

        <section className="report-two-column">


          {/* =================================================
              USER ANALYTICS
          ================================================= */}

          <div className="report-panel">

            <div className="report-panel-header">

              <div>

                <h2>
                  User Analytics
                </h2>

                <p>
                  Breakdown of registered users
                </p>

              </div>

              <FaUsers />

            </div>


            <div className="analytics-grid">

              <div className="analytics-item">

                <span>
                  Total Users
                </span>

                <strong>
                  {users.total || 0}
                </strong>

              </div>


              <div className="analytics-item">

                <span>
                  Students
                </span>

                <strong>
                  {users.students || 0}
                </strong>

              </div>


              <div className="analytics-item">

                <span>
                  Professionals
                </span>

                <strong>
                  {users.professionals || 0}
                </strong>

              </div>


              <div className="analytics-item">

                <span>
                  Recruiters
                </span>

                <strong>
                  {users.recruiters || 0}
                </strong>

              </div>

            </div>

          </div>


          {/* =================================================
              ATS ANALYTICS
          ================================================= */}

          <div className="report-panel">

            <div className="report-panel-header">

              <div>

                <h2>
                  ATS Analytics
                </h2>

                <p>
                  Resume analysis performance
                </p>

              </div>

              <FaRobot />

            </div>


            <div className="analytics-grid">

              <div className="analytics-item">

                <span>
                  Total Analyses
                </span>

                <strong>
                  {ats.total_analyses || 0}
                </strong>

              </div>


              <div className="analytics-item">

                <span>
                  Average ATS Score
                </span>

                <strong>
                  {ats.average_ats_score || 0}
                </strong>

                <small>
                  / 100
                </small>

              </div>


              <div className="analytics-item">

                <span>
                  Average Coverage Score
                </span>

                <strong>
                  {ats.average_coverage_score || 0}
                </strong>

                <small>
                  / 100
                </small>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            RESUME / JOB ANALYTICS
        ================================================= */}

        <section className="report-two-column">


          {/* RESUME */}

          <div className="report-panel">

            <div className="report-panel-header">

              <div>

                <h2>
                  Resume Analytics
                </h2>

                <p>
                  Resume management statistics
                </p>

              </div>

              <FaFileAlt />

            </div>


            <div className="analytics-grid">

              <div className="analytics-item">

                <span>
                  Total Resumes
                </span>

                <strong>
                  {resumes.total || 0}
                </strong>

              </div>


              <div className="analytics-item">

                <span>
                  Resume Improvements
                </span>

                <strong>
                  {resumes.improvements || 0}
                </strong>

              </div>

            </div>

          </div>


          {/* JOBS */}

          <div className="report-panel">

            <div className="report-panel-header">

              <div>

                <h2>
                  Job Analytics
                </h2>

                <p>
                  Job and recommendation statistics
                </p>

              </div>

              <FaBriefcase />

            </div>


            <div className="analytics-grid">

              <div className="analytics-item">

                <span>
                  Total Jobs
                </span>

                <strong>
                  {jobs.total || 0}
                </strong>

              </div>


              <div className="analytics-item">

                <span>
                  Job Recommendations
                </span>

                <strong>
                  {jobs.recommendations || 0}
                </strong>

              </div>


              <div className="analytics-item">

                <span>
                  Saved Jobs
                </span>

                <strong>
                  {jobs.saved || 0}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            COURSE / CAREER ANALYTICS
        ================================================= */}

        <section className="report-two-column">


          {/* COURSES */}

          <div className="report-panel">

            <div className="report-panel-header">

              <div>

                <h2>
                  Course Analytics
                </h2>

                <p>
                  Learning resource usage
                </p>

              </div>

              <FaBook />

            </div>


            <div className="analytics-grid">

              <div className="analytics-item">

                <span>
                  Total Courses
                </span>

                <strong>
                  {courses.total || 0}
                </strong>

              </div>


              <div className="analytics-item">

                <span>
                  Course Recommendations
                </span>

                <strong>
                  {courses.recommendations || 0}
                </strong>

              </div>

            </div>

          </div>


          {/* CAREER */}

          <div className="report-panel">

            <div className="report-panel-header">

              <div>

                <h2>
                  Career Analytics
                </h2>

                <p>
                  Career recommendation usage
                </p>

              </div>

              <FaUserTie />

            </div>


            <div className="large-analytics-number">

              <span>
                Career Recommendations
              </span>

              <strong>
                {careers.recommendations || 0}
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            ACTIVITY
        ================================================= */}

        <section className="report-panel">

          <div className="report-panel-header">

            <div>

              <h2>
                Activity Analytics
              </h2>

              <p>
                Overall system activity
              </p>

            </div>

            <FaClock />

          </div>


          <div className="activity-report">

            <div>

              <span>
                Total Activities
              </span>

              <strong>
                {activity.total || 0}
              </strong>

            </div>


            <div>

              <span>
                Platform Status
              </span>

              <strong className="status-active">
                Active
              </strong>

            </div>

          </div>

        </section>


      </main>

    </div>

  );

}