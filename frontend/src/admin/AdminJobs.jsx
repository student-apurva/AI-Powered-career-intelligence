import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaSearch,
  FaBriefcase,
  FaUsers,
  FaChartLine,
  FaExternalLinkAlt,
  FaSpinner,
  FaTimes
} from "react-icons/fa";

import AdminSidebar from "./AdminSidebar";
import "./AdminJobs.css";

const API_URL = "http://localhost:8000";

export default function AdminJobs() {

  const [jobs, setJobs] = useState([]);

  const [totalUsers, setTotalUsers] =
    useState(0);

  const [averageScore, setAverageScore] =
    useState(0);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // LOAD JOBS
  // =====================================================

  useEffect(() => {

    loadJobs();

  }, []);


  const loadJobs = async () => {

    try {

      setLoading(true);

      setError("");

      const token =
        localStorage.getItem("adminToken")

      const response = await axios.get(
        `${API_URL}/api/admin/jobs/recommendations`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      if (response.data?.success) {

        setJobs(
          response.data.jobs || []
        );

        setTotalUsers(
          response.data.total_users || 0
        );

        setAverageScore(
          response.data.average_match_score || 0
        );

      }

    } catch (error) {

      console.error(
        "Jobs loading error:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Unable to load job recommendations"
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredJobs =
    jobs.filter((job) => {

      const text =
        search.toLowerCase().trim();

      if (!text) {
        return true;
      }

      return (

        (job.title || "")
          .toLowerCase()
          .includes(text)

        ||

        (job.company || "")
          .toLowerCase()
          .includes(text)

        ||

        (job.location || "")
          .toLowerCase()
          .includes(text)

        ||

        (job.user_name || "")
          .toLowerCase()
          .includes(text)

        ||

        (job.email || "")
          .toLowerCase()
          .includes(text)

      );

    });


  // =====================================================
  // SCORE CLASS
  // =====================================================

  const getScoreClass = (score) => {

    const value =
      Number(score) || 0;

    if (value >= 80) {
      return "high";
    }

    if (value >= 60) {
      return "medium";
    }

    return "low";

  };


  return (

    <div className="admin-layout">

      <AdminSidebar />

      <main className="admin-main jobs-page">


        {/* HEADER */}

        <header className="jobs-header">

          <div>

            <h1>
              Job Recommendations
            </h1>

            <p>
              Monitor jobs recommended to users
            </p>

          </div>


          <div className="jobs-header-icon">

            <FaBriefcase />

          </div>

        </header>


        {/* STATISTICS */}

        <section className="jobs-stats">


          <div className="job-stat-card">

            <div className="job-stat-icon blue">

              <FaBriefcase />

            </div>

            <div>

              <span>
                Total Jobs
              </span>

              <h2>
                {jobs.length}
              </h2>

            </div>

          </div>


          <div className="job-stat-card">

            <div className="job-stat-icon green">

              <FaUsers />

            </div>

            <div>

              <span>
                Users
              </span>

              <h2>
                {totalUsers}
              </h2>

            </div>

          </div>


          <div className="job-stat-card">

            <div className="job-stat-icon orange">

              <FaChartLine />

            </div>

            <div>

              <span>
                Average Match
              </span>

              <h2>
                {averageScore}%
              </h2>

            </div>

          </div>

        </section>


        {/* SEARCH */}

        <section className="jobs-toolbar">

          <div className="jobs-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search by job, company, user or location..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (

              <button
                onClick={() =>
                  setSearch("")
                }
              >

                <FaTimes />

              </button>

            )}

          </div>


          <span>

            Showing{" "}

            <strong>
              {filteredJobs.length}
            </strong>

            {" "}of{" "}

            <strong>
              {jobs.length}
            </strong>

          </span>

        </section>


        {/* ERROR */}

        {error && (

          <div className="jobs-error">

            {error}

          </div>

        )}


        {/* TABLE */}

        <section className="jobs-table-card">

          {loading ? (

            <div className="jobs-loading">

              <FaSpinner className="jobs-spinner" />

              Loading job recommendations...

            </div>

          ) : filteredJobs.length === 0 ? (

            <div className="jobs-empty">

              <FaBriefcase />

              <h3>
                No job recommendations found
              </h3>

              <p>
                Recommended jobs will appear here.
              </p>

            </div>

          ) : (

            <div className="jobs-table-wrapper">

              <table className="jobs-table">

                <thead>

                  <tr>

                    <th>Job</th>

                    <th>Company</th>

                    <th>User</th>

                    <th>Location</th>

                    <th>Match</th>

                    <th>Apply</th>

                  </tr>

                </thead>


                <tbody>

                  {filteredJobs.map(
                    (job, index) => {

                    const score =
                      Number(
                        job.match_score
                      ) || 0;

                    return (

                      <tr
                        key={
                          job.id ||
                          index
                        }
                      >


                        {/* JOB */}

                        <td>

                          <div className="job-title">

                            <div className="job-icon">

                              <FaBriefcase />

                            </div>

                            <div>

                              <strong>
                                {job.title ||
                                  "Unknown Job"}
                              </strong>

                              <small>
                                {job.email ||
                                  ""}
                              </small>

                            </div>

                          </div>

                        </td>


                        {/* COMPANY */}

                        <td>

                          {job.company ||
                            "Unknown Company"}

                        </td>


                        {/* USER */}

                        <td>

                          {job.user_name ||
                            "Unknown User"}

                        </td>


                        {/* LOCATION */}

                        <td>

                          {job.location ||
                            "India"}

                        </td>


                        {/* SCORE */}

                        <td>

                          <span
                            className={`job-score ${getScoreClass(
                              score
                            )}`}
                          >

                            {score}%

                          </span>

                        </td>


                        {/* APPLY */}

                        <td>

                          {job.apply_link ? (

                            <a
                              href={
                                job.apply_link
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="job-apply-btn"
                            >

                              Apply

                              <FaExternalLinkAlt />

                            </a>

                          ) : (

                            <span className="no-link">

                              Unavailable

                            </span>

                          )}

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>

  );

}