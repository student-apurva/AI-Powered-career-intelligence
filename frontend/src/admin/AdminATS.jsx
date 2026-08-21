import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaSearch,
  FaChartLine,
  FaEye,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

import AdminSidebar from "./AdminSidebar";
import "./AdminATS.css";


const API_URL = "http://localhost:8000";


export default function AdminATS() {

  // =====================================================
  // STATE
  // =====================================================

  const [analyses, setAnalyses] = useState([]);

  const [statistics, setStatistics] = useState({
    total_analyses: 0,
    average_ats_score: 0,
    high_score: 0,
    needs_improvement: 0
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedAnalysis, setSelectedAnalysis] =
    useState(null);


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadATSData();
  }, []);


  const loadATSData = async () => {

    try {

      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("adminToken");


      if (!token) {

        setError(
          "Admin session not found. Please login again."
        );

        setLoading(false);

        return;
      }


      // =================================================
      // GET ATS ANALYSES
      // =================================================

      const atsResponse = await axios.get(
        `${API_URL}/api/admin/ats`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      console.log(
        "ADMIN ATS RESPONSE:",
        atsResponse.data
      );


      if (
        atsResponse.data &&
        atsResponse.data.success
      ) {

        /*
         * Backend returns:
         *
         * {
         *   success: true,
         *   total: ...,
         *   results: [...]
         * }
         */

        setAnalyses(
          atsResponse.data.results || []
        );

      } else {

        setAnalyses([]);

      }


      // =================================================
      // GET ATS STATISTICS
      // =================================================

      try {

        const statisticsResponse =
          await axios.get(
            `${API_URL}/api/admin/ats/statistics`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );


        console.log(
          "ADMIN ATS STATISTICS:",
          statisticsResponse.data
        );


        if (
          statisticsResponse.data &&
          statisticsResponse.data.success
        ) {

          const stats =
            statisticsResponse.data.statistics || {};


          const total =
            Number(
              stats.total_analyses || 0
            );


          const average =
            Number(
              stats.average_score || 0
            );


          const high =
            (analyses || []).filter(
              (item) =>
                Number(
                  item.score ||
                  item.ats_score ||
                  0
                ) >= 70
            ).length;


          const needsImprovement =
            Math.max(
              total - high,
              0
            );


          setStatistics({

            total_analyses: total,

            average_ats_score: average,

            high_score: high,

            needs_improvement:
              needsImprovement

          });

        }

      } catch (statisticsError) {

        console.warn(
          "ATS statistics error:",
          statisticsError
        );

      }

    } catch (err) {

      console.error(
        "Admin ATS error:",
        err
      );


      setError(
        err.response?.data?.detail ||
        "Unable to load ATS analysis data"
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredAnalyses =
    analyses.filter((analysis) => {

      const searchText =
        search
          .toLowerCase()
          .trim();


      if (!searchText) {
        return true;
      }


      const userName =
        analysis.user_name ||
        analysis.fullName ||
        analysis.name ||
        "";


      const email =
        analysis.email ||
        "";


      const matchingSkills =
        analysis.matching_skills ||
        [];


      const missingSkills =
        analysis.missing_skills ||
        [];


      const allSkills = [

        ...matchingSkills,

        ...missingSkills

      ];


      return (

        userName
          .toLowerCase()
          .includes(searchText)

        ||

        email
          .toLowerCase()
          .includes(searchText)

        ||

        allSkills.some(
          (skill) =>
            String(skill)
              .toLowerCase()
              .includes(searchText)
        )

      );

    });


  // =====================================================
  // USER NAME
  // =====================================================

  const getUserName = (analysis) => {

    return (

      analysis.user_name ||

      analysis.fullName ||

      analysis.name ||

      "Unknown User"

    );

  };


  // =====================================================
  // ATS SCORE
  // =====================================================

  const getATSScore = (analysis) => {

    return (

      analysis.score ??

      analysis.ats_score ??

      analysis.atsScore ??

      0

    );

  };


  // =====================================================
  // SCORE CLASS
  // =====================================================

  const getScoreClass = (score) => {

    const value =
      Number(score) || 0;


    if (value >= 70) {
      return "high";
    }


    if (value >= 40) {
      return "medium";
    }


    return "low";

  };


  // =====================================================
  // FORMAT SCORE
  // =====================================================

  const formatScore = (score) => {

    const value =
      Number(score);


    if (Number.isNaN(value)) {
      return "—";
    }


    return `${Math.round(value)}%`;

  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }


    try {

      return new Date(date)
        .toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric"
          }
        );

    } catch {

      return "—";

    }

  };


  // =====================================================
  // VIEW ATS ANALYSIS
  // =====================================================

  const handleViewAnalysis = async (analysis) => {

    /*
     * Show the row data immediately.
     */

    setSelectedAnalysis(
      analysis
    );


    /*
     * Try to get the latest detailed
     * ATS result from backend.
     */

    if (!analysis.id) {
      return;
    }


    try {

      const token =
        localStorage.getItem(
          "adminToken"
        );


      if (!token) {
        return;
      }


      const response =
        await axios.get(
          `${API_URL}/api/admin/ats/${analysis.id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      if (
        response.data &&
        response.data.success &&
        response.data.result
      ) {

        setSelectedAnalysis(
          response.data.result
        );

      }

    } catch (err) {

      console.warn(
        "Unable to load ATS details:",
        err
      );

    }

  };


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {

    setSelectedAnalysis(
      null
    );

  };


  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {

    return (

      <div className="admin-layout">

        <AdminSidebar />

        <main className="admin-main ats-page">

          <div className="ats-loading">

            <FaSpinner
              className="ats-spinner"
            />

            <span>
              Loading ATS analysis...
            </span>

          </div>

        </main>

      </div>

    );

  }


  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (

    <div className="admin-layout">

      {/* =================================================
          SIDEBAR
          ================================================= */}

      <AdminSidebar />


      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <main className="admin-main ats-page">


        {/* =================================================
            HEADER
            ================================================= */}

        <header className="ats-header">

          <div>

            <h1>
              ATS Analysis
            </h1>

            <p>
              Monitor resume ATS performance
            </p>

          </div>


          <div className="ats-total">

            <FaChartLine />

            <span>
              {statistics.total_analyses}
            </span>

            <span>
              Analyses
            </span>

          </div>

        </header>


        {/* =================================================
            ERROR
            ================================================= */}

        {error && (

          <div className="ats-error">

            <FaExclamationTriangle />

            <span>
              {error}
            </span>

          </div>

        )}


        {/* =================================================
            STATISTICS
            ================================================= */}

        <section className="ats-stats">


          {/* TOTAL ANALYSES */}

          <div className="ats-stat-card">

            <div className="ats-stat-icon blue">

              <FaChartLine />

            </div>


            <div>

              <span>
                Total Analyses
              </span>

              <h2>
                {statistics.total_analyses}
              </h2>

            </div>

          </div>


          {/* AVERAGE SCORE */}

          <div className="ats-stat-card">

            <div className="ats-stat-icon green">

              <FaCheckCircle />

            </div>


            <div>

              <span>
                Average Score
              </span>

              <h2>
                {formatScore(
                  statistics.average_ats_score
                )}
              </h2>

            </div>

          </div>


          {/* HIGH SCORE */}

          <div className="ats-stat-card">

            <div className="ats-stat-icon success">

              <FaCheckCircle />

            </div>


            <div>

              <span>
                High Score
              </span>

              <h2>
                {statistics.high_score}
              </h2>

            </div>

          </div>


          {/* NEEDS IMPROVEMENT */}

          <div className="ats-stat-card">

            <div className="ats-stat-icon warning">

              <FaExclamationTriangle />

            </div>


            <div>

              <span>
                Needs Improvement
              </span>

              <h2>
                {statistics.needs_improvement}
              </h2>

            </div>

          </div>

        </section>


        {/* =================================================
            SEARCH TOOLBAR
            ================================================= */}

        <section className="ats-toolbar">

          <div className="ats-search">

            <FaSearch />


            <input
              type="text"
              placeholder="Search by user, email or skill..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />


            {search && (

              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                title="Clear search"
              >

                <FaTimes />

              </button>

            )}

          </div>


          <span>

            Showing{" "}

            <strong>
              {filteredAnalyses.length}
            </strong>

            {" "}of{" "}

            <strong>
              {analyses.length}
            </strong>

          </span>

        </section>


        {/* =================================================
            ATS TABLE
            ================================================= */}

        <section className="ats-table-card">


          {filteredAnalyses.length === 0 ? (

            <div className="ats-empty">

              <FaChartLine />

              <h3>
                No ATS analyses found
              </h3>

              <p>

                {search

                  ? "Try a different search."

                  : "No ATS analyses are available yet."

                }

              </p>

            </div>

          ) : (

            <div className="ats-table-wrapper">

              <table className="ats-table">


                <thead>

                  <tr>

                    <th>
                      User
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      ATS Score
                    </th>

                    <th>
                      Matching Skills
                    </th>

                    <th>
                      Missing Skills
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredAnalyses.map(
                    (analysis, index) => {


                      const userName =
                        getUserName(
                          analysis
                        );


                      const score =
                        getATSScore(
                          analysis
                        );


                      const matchingSkills =
                        analysis.matching_skills ||
                        [];


                      const missingSkills =
                        analysis.missing_skills ||
                        [];


                      return (

                        <tr
                          key={
                            analysis.id ||
                            analysis._id ||
                            index
                          }
                        >


                          {/* USER */}

                          <td>

                            <div className="ats-user">

                              <div className="ats-avatar">

                                {userName
                                  .charAt(0)
                                  .toUpperCase()}

                              </div>


                              <div>

                                <strong>
                                  {userName}
                                </strong>

                              </div>

                            </div>

                          </td>


                          {/* EMAIL */}

                          <td>

                            {analysis.email ||
                              "—"}

                          </td>


                          {/* ATS SCORE */}

                          <td>

                            <div
                              className={`score-circle ${getScoreClass(
                                score
                              )}`}
                            >

                              {formatScore(
                                score
                              )}

                            </div>

                          </td>


                          {/* MATCHING SKILLS */}

                          <td>

                            <div className="skills-list">

                              {matchingSkills.length >
                              0 ? (

                                matchingSkills
                                  .slice(
                                    0,
                                    8
                                  )
                                  .map(
                                    (
                                      skill,
                                      skillIndex
                                    ) => (

                                      <span
                                        key={
                                          skillIndex
                                        }
                                        className="matching-skill"
                                      >

                                        {skill}

                                      </span>

                                    )
                                  )

                              ) : (

                                <span>
                                  —
                                </span>

                              )}

                            </div>

                          </td>


                          {/* MISSING SKILLS */}

                          <td>

                            <div className="skills-list">

                              {missingSkills.length >
                              0 ? (

                                missingSkills
                                  .slice(
                                    0,
                                    8
                                  )
                                  .map(
                                    (
                                      skill,
                                      skillIndex
                                    ) => (

                                      <span
                                        key={
                                          skillIndex
                                        }
                                        className="missing-skill"
                                      >

                                        {skill}

                                      </span>

                                    )
                                  )

                              ) : (

                                <span>
                                  —
                                </span>

                              )}

                            </div>

                          </td>


                          {/* VIEW */}

                          <td>

                            <button
                              className="ats-view-btn"
                              onClick={() =>
                                handleViewAnalysis(
                                  analysis
                                )
                              }
                            >

                              <FaEye />

                              View

                            </button>

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>


      {/* =================================================
          ATS DETAILS MODAL
          ================================================= */}

      {selectedAnalysis && (

        <div
          className="ats-modal-overlay"
          onClick={
            closeModal
          }
        >


          <div
            className="ats-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* MODAL HEADER */}

            <div className="ats-modal-header">

              <div>

                <h2>
                  ATS Analysis Details
                </h2>

                <p>
                  {getUserName(
                    selectedAnalysis
                  )}
                </p>

              </div>


              <button
                className="ats-close"
                onClick={
                  closeModal
                }
                title="Close"
              >

                <FaTimes />

              </button>

            </div>


            {/* SCORE */}

            <div className="ats-modal-score">

              <div
                className={`large-score ${getScoreClass(
                  getATSScore(
                    selectedAnalysis
                  )
                )}`}
              >

                {formatScore(
                  getATSScore(
                    selectedAnalysis
                  )
                )}

              </div>


              <h3>
                ATS Score
              </h3>

            </div>


            {/* DETAILS */}

            <div className="ats-detail-grid">


              {/* USER */}

              <div>

                <label>
                  User
                </label>

                <p>
                  {getUserName(
                    selectedAnalysis
                  )}
                </p>

              </div>


              {/* EMAIL */}

              <div>

                <label>
                  Email
                </label>

                <p>
                  {selectedAnalysis.email ||
                    "—"}
                </p>

              </div>


              {/* MOBILE */}

              <div>

                <label>
                  Mobile
                </label>

                <p>
                  {selectedAnalysis.mobile ||
                    "—"}
                </p>

              </div>


              {/* USER ID */}

              <div>

                <label>
                  User ID
                </label>

                <p>
                  {selectedAnalysis.user_id ||
                    "—"}
                </p>

              </div>


              {/* ANALYSIS DATE */}

              <div>

                <label>
                  Analysis Date
                </label>

                <p>
                  {formatDate(
                    selectedAnalysis.created_at ||
                    selectedAnalysis.uploaded_at
                  )}
                </p>

              </div>


              {/* JOB DESCRIPTION */}

              <div>

                <label>
                  Job Description
                </label>

                <p>

                  {selectedAnalysis.job_description_uploaded
                    ? "Uploaded"
                    : "Not Uploaded"}

                </p>

              </div>

            </div>


            {/* =================================================
                MATCHING SKILLS
                ================================================= */}

            <div className="ats-skills-section">

              <h3>
                Matching Skills
              </h3>


              <div className="modal-skill-list">

                {(
                  selectedAnalysis.matching_skills ||
                  []
                ).length > 0 ? (

                  (
                    selectedAnalysis.matching_skills ||
                    []
                  ).map(
                    (skill, index) => (

                      <span
                        key={index}
                        className="modal-match"
                      >

                        {skill}

                      </span>

                    )
                  )

                ) : (

                  <span>
                    No matching skills
                  </span>

                )}

              </div>

            </div>


            {/* =================================================
                MISSING SKILLS
                ================================================= */}

            <div className="ats-skills-section">

              <h3>
                Missing Skills
              </h3>


              <div className="modal-skill-list">

                {(
                  selectedAnalysis.missing_skills ||
                  []
                ).length > 0 ? (

                  (
                    selectedAnalysis.missing_skills ||
                    []
                  ).map(
                    (skill, index) => (

                      <span
                        key={index}
                        className="modal-missing"
                      >

                        {skill}

                      </span>

                    )
                  )

                ) : (

                  <span>
                    No missing skills
                  </span>

                )}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}