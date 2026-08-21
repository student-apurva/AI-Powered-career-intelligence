import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaBriefcase,
  FaUsers,
  FaChartLine,
  FaBuilding,
  FaMapMarkerAlt,
  FaSpinner,
} from "react-icons/fa";

import AdminSidebar from "./AdminSidebar";
import "./AdminJobAnalytics.css";

const API_URL = "http://localhost:8000";

export default function AdminJobAnalytics() {
  const [data, setData] = useState({
    total_jobs: 0,
    total_users: 0,
    average_match_score: 0,
    score_distribution: {
      high: 0,
      medium: 0,
      low: 0,
    },
    top_companies: [],
    top_titles: [],
    top_locations: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken")

      const response = await axios.get(
        `${API_URL}/api/admin/job-analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setData(response.data);
      }
    } catch (err) {
      console.error("Job analytics error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load job analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  const getMaxValue = (items) => {
    if (!items || items.length === 0) {
      return 1;
    }

    return Math.max(
      ...items.map((item) => Number(item.count) || 0),
      1
    );
  };

  const companyMax = getMaxValue(data.top_companies);
  const titleMax = getMaxValue(data.top_titles);
  const locationMax = getMaxValue(data.top_locations);

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <main className="admin-main">
          <div className="job-analytics-loading">
            <FaSpinner className="analytics-spinner" />
            <span>Loading job analytics...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main job-analytics-page">

        {/* HEADER */}
        <header className="job-analytics-header">
          <div>
            <h1>Job Analytics</h1>

            <p>
              Analyze recommended jobs and matching trends
            </p>
          </div>

          <div className="job-analytics-header-icon">
            <FaChartLine />
          </div>
        </header>

        {/* ERROR */}
        {error && (
          <div className="job-analytics-error">
            {error}
          </div>
        )}

        {/* STATISTICS */}
        <section className="job-analytics-stats">

          <div className="job-analytics-card">
            <div className="analytics-icon blue">
              <FaBriefcase />
            </div>

            <div>
              <span>Total Jobs</span>

              <h2>
                {data.total_jobs}
              </h2>
            </div>
          </div>


          <div className="job-analytics-card">
            <div className="analytics-icon green">
              <FaUsers />
            </div>

            <div>
              <span>Users</span>

              <h2>
                {data.total_users}
              </h2>
            </div>
          </div>


          <div className="job-analytics-card">
            <div className="analytics-icon orange">
              <FaChartLine />
            </div>

            <div>
              <span>Average Match</span>

              <h2>
                {data.average_match_score}%
              </h2>
            </div>
          </div>

        </section>


        {/* SCORE DISTRIBUTION */}
        <section className="score-distribution">

          <div className="analytics-section-title">
            <h2>Match Score Distribution</h2>

            <p>
              Job recommendation quality
            </p>
          </div>


          <div className="score-bars">

            {/* HIGH */}
            <div className="score-bar-item">

              <div className="score-bar-label">
                <span>High Match</span>

                <strong>
                  {data.score_distribution.high}
                </strong>
              </div>

              <div className="analytics-bar">

                <div
                  className="bar-high"
                  style={{
                    width: `${
                      data.total_jobs
                        ? (data.score_distribution.high /
                            data.total_jobs) *
                          100
                        : 0
                    }%`,
                  }}
                />

              </div>
            </div>


            {/* MEDIUM */}
            <div className="score-bar-item">

              <div className="score-bar-label">
                <span>Medium Match</span>

                <strong>
                  {data.score_distribution.medium}
                </strong>
              </div>

              <div className="analytics-bar">

                <div
                  className="bar-medium"
                  style={{
                    width: `${
                      data.total_jobs
                        ? (data.score_distribution.medium /
                            data.total_jobs) *
                          100
                        : 0
                    }%`,
                  }}
                />

              </div>
            </div>


            {/* LOW */}
            <div className="score-bar-item">

              <div className="score-bar-label">
                <span>Low Match</span>

                <strong>
                  {data.score_distribution.low}
                </strong>
              </div>

              <div className="analytics-bar">

                <div
                  className="bar-low"
                  style={{
                    width: `${
                      data.total_jobs
                        ? (data.score_distribution.low /
                            data.total_jobs) *
                          100
                        : 0
                    }%`,
                  }}
                />

              </div>
            </div>

          </div>
        </section>


        {/* ANALYTICS GRID */}
        <section className="job-analytics-grid">

          {/* TOP COMPANIES */}
          <div className="analytics-panel">

            <div className="analytics-panel-header">

              <div>
                <h2>Top Companies</h2>

                <p>
                  Companies appearing most often
                </p>
              </div>

              <FaBuilding />

            </div>


            <div className="analytics-list">

              {data.top_companies.length === 0 ? (

                <p className="no-data">
                  No company data available
                </p>

              ) : (

                data.top_companies.map(
                  (item, index) => {

                    const width =
                      (Number(item.count) /
                        companyMax) *
                      100;

                    return (
                      <div
                        className="analytics-list-item"
                        key={index}
                      >

                        <div className="analytics-item-top">

                          <span>
                            {item.name}
                          </span>

                          <strong>
                            {item.count}
                          </strong>

                        </div>

                        <div className="analytics-bar">

                          <div
                            className="company-bar"
                            style={{
                              width: `${width}%`,
                            }}
                          />

                        </div>

                      </div>
                    );
                  }
                )

              )}

            </div>
          </div>


          {/* TOP JOB TITLES */}
          <div className="analytics-panel">

            <div className="analytics-panel-header">

              <div>
                <h2>Top Job Roles</h2>

                <p>
                  Most recommended positions
                </p>
              </div>

              <FaBriefcase />

            </div>


            <div className="analytics-list">

              {data.top_titles.length === 0 ? (

                <p className="no-data">
                  No job role data available
                </p>

              ) : (

                data.top_titles.map(
                  (item, index) => {

                    const width =
                      (Number(item.count) /
                        titleMax) *
                      100;

                    return (
                      <div
                        className="analytics-list-item"
                        key={index}
                      >

                        <div className="analytics-item-top">

                          <span>
                            {item.name}
                          </span>

                          <strong>
                            {item.count}
                          </strong>

                        </div>

                        <div className="analytics-bar">

                          <div
                            className="title-bar"
                            style={{
                              width: `${width}%`,
                            }}
                          />

                        </div>

                      </div>
                    );
                  }
                )

              )}

            </div>
          </div>


          {/* TOP LOCATIONS */}
          <div className="analytics-panel">

            <div className="analytics-panel-header">

              <div>
                <h2>Top Locations</h2>

                <p>
                  Most common job locations
                </p>
              </div>

              <FaMapMarkerAlt />

            </div>


            <div className="analytics-list">

              {data.top_locations.length === 0 ? (

                <p className="no-data">
                  No location data available
                </p>

              ) : (

                data.top_locations.map(
                  (item, index) => {

                    const width =
                      (Number(item.count) /
                        locationMax) *
                      100;

                    return (
                      <div
                        className="analytics-list-item"
                        key={index}
                      >

                        <div className="analytics-item-top">

                          <span>
                            {item.name}
                          </span>

                          <strong>
                            {item.count}
                          </strong>

                        </div>

                        <div className="analytics-bar">

                          <div
                            className="location-bar"
                            style={{
                              width: `${width}%`,
                            }}
                          />

                        </div>

                      </div>
                    );
                  }
                )

              )}

            </div>
          </div>

        </section>

      </main>
    </div>
  );
}