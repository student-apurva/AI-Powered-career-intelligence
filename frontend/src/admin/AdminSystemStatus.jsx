import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaServer,
  FaDatabase,
  FaLock,
  FaBriefcase,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaSyncAlt,
} from "react-icons/fa";

import AdminSidebar from "./AdminSidebar";
import "./AdminSystemStatus.css";

const API_URL = "http://localhost:8000";

export default function AdminSystemStatus() {

  const [data, setData] = useState({
    overall_status: "Checking",

    services: {
      backend_api: {
        status: "Checking",
        healthy: false,
      },

      database: {
        status: "Checking",
        healthy: false,
      },

      authentication: {
        status: "Checking",
        healthy: false,
      },

      adzuna_api: {
        status: "Checking",
        healthy: false,
      },
    },

    response_time: 0,
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // LOAD SYSTEM STATUS
  // =====================================================

  useEffect(() => {

    loadStatus();

  }, []);


  const loadStatus = async () => {

    try {

      setLoading(true);

      setError("");


      // -------------------------------------------------
      // GET ADMIN TOKEN
      // -------------------------------------------------

      const token =
        localStorage.getItem("adminToken");


      if (!token) {

        setError(
          "Admin session not found. Please login again."
        );

        return;
      }


      // -------------------------------------------------
      // API REQUEST
      // -------------------------------------------------

      const response = await axios.get(

        `${API_URL}/api/admin/system-status/status`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }

      );


      console.log(
        "System Status Response:",
        response.data
      );


if (response.data?.success) {

  const services = response.data.services || {};

  setData({

    overall_status:
      response.data.overall_status || "Unknown",

    services: {

      backend_api:
        services.backend_api || {
          status: "Unknown",
          healthy: false
        },

      database:
        services.database || {
          status: "Unknown",
          healthy: false
        },

      authentication:
        services.authentication || {
          status: "Unknown",
          healthy: false
        },

      adzuna_api:
        services.adzuna_api || {
          status: "Unknown",
          healthy: false
        }

    },

    response_time:
      response.data.database_response_time || 0

  });

}

      else {

        setError(
          "Unable to load system status"
        );

      }

    }

    catch (err) {

      console.error(
        "System status error:",
        err
      );


      // -------------------------------------------------
      // 401
      // -------------------------------------------------

      if (
        err.response?.status === 401
      ) {

        setError(
          "Invalid or expired admin token. Please login again."
        );

      }


      // -------------------------------------------------
      // 403
      // -------------------------------------------------

      else if (
        err.response?.status === 403
      ) {

        setError(
          "Admin access required."
        );

      }


      // -------------------------------------------------
      // OTHER ERROR
      // -------------------------------------------------

      else {

        setError(
          err.response?.data?.detail ||
          "Unable to check system status"
        );

      }

    }

    finally {

      setLoading(false);

    }

  };


  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {

    switch (status) {

      case "Online":

      case "Connected":

      case "Running":

      case "Healthy":

        return <FaCheckCircle />;


      case "Warning":

      case "Degraded":

      case "Unavailable":

        return <FaExclamationTriangle />;


      case "Offline":

      case "Disconnected":

        return <FaTimesCircle />;


      default:

        return <FaExclamationTriangle />;

    }

  };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    switch (status) {

      case "Online":

      case "Connected":

      case "Running":

      case "Healthy":

        return "online";


      case "Warning":

      case "Degraded":

      case "Unavailable":

        return "warning";


      case "Offline":

      case "Disconnected":

        return "offline";


      default:

        return "unknown";

    }

  };


  // =====================================================
  // SERVICES
  // =====================================================

  const serviceData = [

    {

      name:
        "Backend API",

      key:
        "backend_api",

      icon:
        <FaServer />,

      description:
        "FastAPI backend service",

    },


    {

      name:
        "Database",

      key:
        "database",

      icon:
        <FaDatabase />,

      description:
        "MongoDB database connection",

    },


    {

      name:
        "Authentication",

      key:
        "authentication",

      icon:
        <FaLock />,

      description:
        "Admin authentication service",

    },


    {

      name:
        "Adzuna API",

      key:
        "adzuna_api",

      icon:
        <FaBriefcase />,

      description:
        "Live job recommendation service",

    },

  ];


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="admin-layout">

      <AdminSidebar />


      <main className="admin-main system-status-page">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="system-status-header">

          <div>

            <h1>
              System Status
            </h1>

            <p>
              Monitor the health of your application services
            </p>

          </div>


          <button

            className="refresh-status-btn"

            onClick={loadStatus}

            disabled={loading}

          >

            <FaSyncAlt

              className={
                loading
                  ? "refresh-spinning"
                  : ""
              }

            />

            Refresh

          </button>

        </header>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="system-status-error">

            {error}

          </div>

        )}


        {/* =================================================
            OVERALL STATUS
        ================================================= */}

        <section className="overall-status-card">

          <div

            className={`overall-status-icon ${getStatusClass(
              data.overall_status
            )}`}

          >

            {getStatusIcon(
              data.overall_status
            )}

          </div>


          <div>

            <span>
              Overall System Status
            </span>

            <h2>
              {data.overall_status}
            </h2>

            <p>
              All monitored services are checked in real time.
            </p>

          </div>

        </section>


        {/* =================================================
            SYSTEM SERVICES
        ================================================= */}

        <section className="system-services">

          <div className="system-section-header">

            <div>

              <h2>
                System Services
              </h2>

              <p>
                Current status of connected services
              </p>

            </div>

          </div>


          <div className="services-grid">

            {serviceData.map(
              (service) => {

                const serviceStatus =
                  data.services?.[
                    service.key
                  ];


                const status =
                  typeof serviceStatus === "object"

                    ? serviceStatus.status

                    : serviceStatus;


                return (

                  <div

                    className="service-card"

                    key={service.key}

                  >

                    <div className="service-top">


                      <div className="service-icon">

                        {service.icon}

                      </div>


                      <div

                        className={`service-status ${getStatusClass(
                          status
                        )}`}

                      >

                        {getStatusIcon(
                          status
                        )}

                        {status}

                      </div>

                    </div>


                    <h3>
                      {service.name}
                    </h3>


                    <p>
                      {service.description}
                    </p>

                  </div>

                );

              }
            )}

          </div>

        </section>


        {/* =================================================
            DATABASE RESPONSE TIME
        ================================================= */}

        <section className="response-time-card">

          <div>

            <span>
              Database Response Time
            </span>


            <h2>
              {data.response_time} ms
            </h2>

          </div>


          <FaServer />

        </section>


      </main>

    </div>

  );

}