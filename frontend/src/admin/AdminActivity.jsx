import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaUserPlus,
  FaFileAlt,
  FaRobot,
  FaBriefcase,
  FaClock,
  FaSpinner
} from "react-icons/fa";

import AdminSidebar from "./AdminSidebar";
import "./AdminActivity.css";

const API_URL = "http://localhost:8000";

export default function AdminActivity() {

  const [data, setData] = useState({
    statistics: {
      registrations: 0,
      resume_uploads: 0,
      ats_analyses: 0,
      job_recommendations: 0
    },
    activities: []
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    loadActivity();
  }, []);


  const loadActivity = async () => {

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        `${API_URL}/api/admin/activity`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      if (response.data?.success) {

  setData({
    statistics: {
      registrations:
        response.data.statistics?.registrations || 0,

      resume_uploads:
        response.data.statistics?.resume_uploads || 0,

      ats_analyses:
        response.data.statistics?.ats_analyses || 0,

      job_recommendations:
        response.data.statistics?.job_recommendations || 0,
    },

    activities:
      response.data.activities || [],
  });

}

    } catch (err) {

      console.error(
        "Activity error:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to load activity"
      );

    } finally {

      setLoading(false);

    }

  };


  const getActivityIcon = (type) => {

    switch (type) {

      case "registration":
        return <FaUserPlus />;

      case "resume":
        return <FaFileAlt />;

      case "ats":
        return <FaRobot />;

      case "job":
        return <FaBriefcase />;

      default:
        return <FaClock />;

    }

  };


  const getActivityClass = (type) => {

    switch (type) {

      case "registration":
        return "registration";

      case "resume":
        return "resume";

      case "ats":
        return "ats";

      case "job":
        return "job";

      default:
        return "default";

    }

  };


  const formatDate = (timestamp) => {

    if (!timestamp) {
      return "Recently";
    }

    try {

      return new Date(timestamp)
        .toLocaleString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }
        );

    } catch {

      return "Recently";

    }

  };


  if (loading) {

    return (

      <div className="admin-layout">

        <AdminSidebar />

        <main className="admin-main">

          <div className="activity-loading">

            <FaSpinner />

            Loading activity...

          </div>

        </main>

      </div>

    );

  }


  return (

    <div className="admin-layout">

      <AdminSidebar />

      <main className="admin-main activity-page">


        {/* HEADER */}

        <header className="activity-header">

          <div>

            <h1>
              Activity Monitoring
            </h1>

            <p>
              Monitor recent system activity
            </p>

          </div>

          <div className="activity-header-icon">
            <FaClock />
          </div>

        </header>


        {/* ERROR */}

        {error && (

          <div className="activity-error">

            {error}

          </div>

        )}


        {/* STATISTICS */}

        <section className="activity-stats">


          <div className="activity-card">

            <div className="activity-card-icon blue">
              <FaUserPlus />
            </div>

            <div>

              <span>
                Registrations
              </span>

              <h2>
                {data.statistics.registrations}
              </h2>

            </div>

          </div>


          <div className="activity-card">

            <div className="activity-card-icon green">
              <FaFileAlt />
            </div>

            <div>

              <span>
                Resume Uploads
              </span>

              <h2>
                {data.statistics.resume_uploads}
              </h2>

            </div>

          </div>


          <div className="activity-card">

            <div className="activity-card-icon purple">
              <FaRobot />
            </div>

            <div>

              <span>
                ATS Analyses
              </span>

              <h2>
                {data.statistics.ats_analyses}
              </h2>

            </div>

          </div>


          <div className="activity-card">

            <div className="activity-card-icon orange">
              <FaBriefcase />
            </div>

            <div>

              <span>
                Job Recommendations
              </span>

              <h2>
                {data.statistics.job_recommendations}
              </h2>

            </div>

          </div>

        </section>


        {/* RECENT ACTIVITY */}

        <section className="activity-panel">

          <div className="activity-panel-header">

            <div>

              <h2>
                Recent Activity
              </h2>

              <p>
                Latest actions performed in the system
              </p>

            </div>

            <FaClock />

          </div>


          <div className="activity-list">

            {data.activities.length === 0 ? (

              <div className="activity-empty">

                <FaClock />

                <h3>
                  No activity found
                </h3>

                <p>
                  System activity will appear here.
                </p>

              </div>

            ) : (

              data.activities.map(
                (activity, index) => (

                  <div
                    className="activity-item"
                    key={index}
                  >

                    <div
                      className={`activity-icon ${getActivityClass(
                        activity.type
                      )}`}
                    >

                      {getActivityIcon(
                        activity.type
                      )}

                    </div>


                    <div className="activity-content">

                      <h3>
                        {activity.title}
                      </h3>

                      <p>
                        {activity.description}
                      </p>

                      {activity.email && (

                        <small>
                          {activity.email}
                        </small>

                      )}

                    </div>


                    <div className="activity-time">

                      <FaClock />

                      {formatDate(
                        activity.timestamp
                      )}

                    </div>

                  </div>

                )

              )

            )}

          </div>

        </section>

      </main>

    </div>

  );

}