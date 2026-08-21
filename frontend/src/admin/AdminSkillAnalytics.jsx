import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaSearch,
  FaChartBar,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner
} from "react-icons/fa";

import AdminSidebar from "./AdminSidebar";
import "./AdminSkillAnalytics.css";

const API_URL = "http://localhost:8000";

export default function AdminSkillAnalytics() {

  const [data, setData] = useState({
    total_analyses: 0,
    total_missing_skills: 0,
    total_matching_skills: 0,
    average_skill_gap: 0,
    most_missing_skills: [],
    most_matching_skills: []
  });

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // LOAD ANALYTICS
  // =====================================================

  useEffect(() => {

    loadAnalytics();

  }, []);


  const loadAnalytics = async () => {

    try {

      setLoading(true);

      setError("");

      const token =
        localStorage.getItem("adminToken")

      const response = await axios.get(
        `${API_URL}/api/admin/skills/analytics`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      if (response.data?.success) {

        setData(response.data);

      }

    } catch (error) {

      console.error(
        "Skill analytics error:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Unable to load skill analytics"
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // FILTER
  // =====================================================

  const filterSkills = (skills) => {

    const text =
      search.toLowerCase().trim();

    if (!text) {
      return skills;
    }

    return skills.filter(
      (item) =>
        item.skill
          ?.toLowerCase()
          .includes(text)
    );

  };


  const missingSkills =
    filterSkills(
      data.most_missing_skills || []
    );


  const matchingSkills =
    filterSkills(
      data.most_matching_skills || []
    );


  // =====================================================
  // MAX VALUES
  // =====================================================

  const maxMissing = Math.max(
    ...(data.most_missing_skills || [])
      .map((item) => item.count),
    1
  );

  const maxMatching = Math.max(
    ...(data.most_matching_skills || [])
      .map((item) => item.count),
    1
  );


  return (

    <div className="admin-layout">

      <AdminSidebar />

      <main className="admin-main skill-page">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="skill-header">

          <div>

            <h1>
              Skill Gap Analytics
            </h1>

            <p>
              Analyze user skill gaps and strengths
            </p>

          </div>


          <div className="skill-header-icon">

            <FaChartBar />

          </div>

        </header>


        {error && (

          <div className="skill-error">

            {error}

          </div>

        )}


        {loading ? (

          <div className="skill-loading">

            <FaSpinner />

            Loading skill analytics...

          </div>

        ) : (

          <>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <section className="skill-stats">


              <div className="skill-stat-card">

                <div className="skill-stat-icon blue">

                  <FaChartBar />

                </div>

                <div>

                  <span>
                    Total Analyses
                  </span>

                  <h2>
                    {data.total_analyses}
                  </h2>

                </div>

              </div>


              <div className="skill-stat-card">

                <div className="skill-stat-icon red">

                  <FaExclamationTriangle />

                </div>

                <div>

                  <span>
                    Missing Skills
                  </span>

                  <h2>
                    {data.total_missing_skills}
                  </h2>

                </div>

              </div>


              <div className="skill-stat-card">

                <div className="skill-stat-icon green">

                  <FaCheckCircle />

                </div>

                <div>

                  <span>
                    Matching Skills
                  </span>

                  <h2>
                    {data.total_matching_skills}
                  </h2>

                </div>

              </div>


              <div className="skill-stat-card">

                <div className="skill-stat-icon orange">

                  <FaChartBar />

                </div>

                <div>

                  <span>
                    Average Skill Gap
                  </span>

                  <h2>
                    {data.average_skill_gap}
                  </h2>

                </div>

              </div>

            </section>


            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="skill-search">

              <FaSearch />

              <input
                type="text"
                placeholder="Search skill..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            {/* =================================================
                ANALYTICS GRID
            ================================================= */}

            <section className="skill-analytics-grid">


              {/* Missing */}

              <div className="skill-panel">

                <div className="skill-panel-header">

                  <div>

                    <h2>
                      Most Missing Skills
                    </h2>

                    <p>
                      Skills users need to improve
                    </p>

                  </div>

                  <FaExclamationTriangle />

                </div>


                <div className="skill-list">

                  {missingSkills.length === 0 ? (

                    <div className="no-skills">
                      No missing skills found
                    </div>

                  ) : (

                    missingSkills.map(
                      (item, index) => {

                      const width =
                        (item.count /
                          maxMissing) *
                        100;

                      return (

                        <div
                          className="skill-row"
                          key={index}
                        >

                          <div className="skill-row-top">

                            <span>
                              {item.skill}
                            </span>

                          </div>


                          <div className="skill-bar">

                            <div
                              className="skill-bar-fill missing"
                              style={{
                                width:
                                  `${width}%`
                              }}
                            />

                          </div>

                        </div>

                      );

                    })

                  )}

                </div>

              </div>


              {/* Matching */}

              <div className="skill-panel">

                <div className="skill-panel-header">

                  <div>

                    <h2>
                      Most Matched Skills
                    </h2>

                    <p>
                      Skills users already possess
                    </p>

                  </div>

                  <FaCheckCircle />

                </div>


                <div className="skill-list">

  {(data.most_matched_skills || []).length === 0 ? (

    <div className="empty-skill">
      No matching skills found
    </div>

  ) : (

    data.most_matched_skills.map(
      (item, index) => (

        <div
          className="skill-item"
          key={index}
        >

          <div className="skill-name">
            {item.skill}
          </div>

          

        </div>

      )
    )

  )}

</div>

              </div>

            </section>

          </>

        )}

      </main>

    </div>

  );

}