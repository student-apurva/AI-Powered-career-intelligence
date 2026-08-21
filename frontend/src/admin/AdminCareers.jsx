import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaBriefcase,
  FaSearch,
  FaSpinner,
  FaTimes,
  FaChartLine,
} from "react-icons/fa";

import AdminSidebar from "./AdminSidebar";
import "./AdminCareers.css";

const API_URL = "http://localhost:8000";

export default function AdminCareers() {

  const [data, setData] = useState({
    total: 0,
    careers: [],
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

if (!token) {
  setError("Admin session not found. Please login again.");
  setLoading(false);
  return;
}

      const response = await axios.get(
        `${API_URL}/api/admin/careers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {

        setData({
          total: response.data.total || 0,
          careers: response.data.careers || [],
        });

      }

    } catch (err) {

      console.error(
        "Career loading error:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to load careers"
      );

    } finally {

      setLoading(false);

    }
  };


  const filteredCareers =
    (data.careers || []).filter((career) => {

      const text =
        search.toLowerCase().trim();

      if (!text) {
        return true;
      }

      return (
        String(
          career.name ||
          career.title ||
          career.career ||
          ""
        )
          .toLowerCase()
          .includes(text)
      );

    });


  if (loading) {

    return (
      <div className="admin-layout">

        <AdminSidebar />

        <main className="admin-main">

          <div className="careers-loading">

            <FaSpinner />

            Loading careers...

          </div>

        </main>

      </div>
    );

  }


  return (

    <div className="admin-layout">

      <AdminSidebar />

      <main className="admin-main admin-careers-page">

        {/* HEADER */}

        <header className="careers-header">

          <div>

            <h1>
              Career Management
            </h1>

            <p>
              Manage career recommendations and career paths
            </p>

          </div>

          <div className="careers-header-icon">
            <FaBriefcase />
          </div>

        </header>


        {/* ERROR */}

        {error && (
          <div className="careers-error">
            {error}
          </div>
        )}


        {/* STAT */}

        <section className="careers-stats">

          <div className="career-stat-card">

            <div className="career-stat-icon">
              <FaBriefcase />
            </div>

            <div>

              <span>
                Total Careers
              </span>

              <h2>
                {data.total || 0}
              </h2>

            </div>

          </div>

        </section>


        {/* SEARCH */}

        <section className="careers-toolbar">

          <div className="careers-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search careers..."
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
              {filteredCareers.length}
            </strong>{" "}
            careers
          </span>

        </section>


        {/* CAREERS */}

        <section className="careers-panel">

          {filteredCareers.length === 0 ? (

            <div className="careers-empty">

              <FaChartLine />

              <h3>
                No careers found
              </h3>

              <p>
                Career recommendations will appear here.
              </p>

            </div>

          ) : (

            <div className="careers-grid">

              {filteredCareers.map(
                (career, index) => {

                const name =
  career.career ||
  career.career_name ||
  career.name ||
  career.title ||
  "Career";

                return (

                  <div
                    className="career-card"
                    key={
                      career.id ||
                      career._id ||
                      index
                    }
                  >

                    <div className="career-card-icon">
                      <FaBriefcase />
                    </div>

                    <div>

                      <h3>
                        {name}
                      </h3>

                      <p>
  Match Score:{" "}
  {career.score ?? career.match_score ?? 0}%
</p>

                    </div>

                  </div>

                );

              })}

            </div>

          )}

        </section>

      </main>

    </div>

  );
}