import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import "../styles/ResumeImprovement.css";
import Sidebar from "../pages/Sidebar";

export default function ResumeImprovement() {

  // ==========================================
  // State
  // ==========================================

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // Get Logged-In User
  // ==========================================

  const getLoggedInUser = () => {

    try {

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);

    } catch (err) {

      console.error(
        "Failed to read user:",
        err
      );

      return null;
    }
  };


  // ==========================================
  // Fetch Resume Improvement
  // ==========================================

  const fetchResumeImprovement = async () => {

    try {

      setLoading(true);
      setError("");

      const user = getLoggedInUser();


      // ======================================
      // Validate User
      // ======================================

      if (!user) {

        setError(
          "User information was not found. Please log in again."
        );

        return;
      }


      const userId =
        user.id ||
        user._id ||
        user.user_id;


      if (!userId) {

        setError(
          "User ID was not found. Please log in again."
        );

        return;
      }


      console.log(
        "Fetching resume improvement for:",
        userId
      );


      // ======================================
      // API Request
      // ======================================

      const response = await axios.get(
        `http://127.0.0.1:8000/api/resume-improvement/${userId}`
      );


      console.log(
        "Resume Improvement Response:",
        response.data
      );


      // ======================================
      // Validate Response
      // ======================================

      if (!response.data?.success) {

        throw new Error(
          response.data?.message ||
          "Failed to analyze resume."
        );
      }


      setData(
        response.data
      );

    } catch (err) {

      console.error(
        "Resume Improvement Error:",
        err
      );


      if (err.response) {

        setError(
          err.response.data?.detail ||
          "Failed to load resume improvement suggestions."
        );

      } else {

        setError(
          err.message ||
          "Cannot connect to the server."
        );
      }

    } finally {

      setLoading(false);
    }
  };


  // ==========================================
  // Load Data
  // ==========================================

  useEffect(() => {

    fetchResumeImprovement();

  }, []);


  // ==========================================
  // Loading
  // ==========================================

  if (loading) {

    return (
      <div className="resume-improvement-page">

        <div className="resume-loading">

          <div className="resume-loader"></div>

          <h2>
            Analyzing your resume...
          </h2>

          <p>
            Reviewing your resume and generating
            personalized improvement suggestions.
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // Error
  // ==========================================

  if (error) {

    return (
      <div className="resume-improvement-page">

        <div className="resume-error">

          <h2>
            Unable to Analyze Resume
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={
              fetchResumeImprovement
            }
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  // ==========================================
  // No Data
  // ==========================================

  if (!data) {

    return (
      <div className="resume-improvement-page">

        <div className="resume-error">

          <h2>
            No Resume Analysis Available
          </h2>

        </div>

      </div>
    );
  }


  // ==========================================
  // API Data
  // ==========================================

  const score =
    data.resume_score ?? 0;

  const status =
    data.status || "Not Available";

  const componentScores =
    data.component_scores || {};

  const strengths =
    data.strengths || [];

  const missingSections =
    data.missing_sections || [];

  const basicImprovements =
    data.basic_improvements || [];

  const statistics =
    data.statistics || {};

  const ai =
    data.ai_feedback || {};

  const priorities =
    ai.top_priorities || [];

  const suggestions =
    ai.suggestions || [];

  const rewrites =
    ai.rewrite_suggestions || [];

  const actionVerbs =
    ai.suggested_action_verbs || [];

  const skillsOrganization =
    ai.skills_organization || [];


  // ==========================================
  // Format Component Name
  // ==========================================

  const formatComponentName = (name) => {

    return name
      .replace(/_/g, " ")
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  };


  // ==========================================
  // Calculate Percentage
  // ==========================================

  const getPercentage = (
    component
  ) => {

    if (!component) {
      return 0;
    }

    const componentScore =
      component.score || 0;

    const maxScore =
      component.max_score || 0;

    if (!maxScore) {
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        (
          componentScore /
          maxScore
        ) * 100
      )
    );
  };


  // ==========================================
  // UI
  // ==========================================

  return (

   <div className="resume-improvement-page">

  <Sidebar />

  <div className="resume-improvement-content">

      {/* ====================================
          Header
      ==================================== */}

      <div className="resume-improvement-header">

        <div>

          <h1>
            Resume Improvement
          </h1>

          <p>
            Get personalized suggestions to
            strengthen your resume and improve
            its overall quality.
          </p>

        </div>

        <button
          type="button"
          className="reanalyze-button"
          onClick={
            fetchResumeImprovement
          }
        >
          Reanalyze Resume
        </button>

      </div>


      {/* ====================================
          Score Section
      ==================================== */}

      <div className="resume-score-section">

        <div className="resume-score-card">

          <p className="score-label">
            Resume Score
          </p>

          <div className="score-circle">

            <span className="score-number">
              {score}
            </span>

            <span className="score-total">
              /100
            </span>

          </div>

          <div className="resume-status">
            {status}
          </div>

        </div>


        {/* ==================================
            Overall AI Feedback
        ================================== */}

        <div className="overall-feedback-card">

          <h2>
            Overall Feedback
          </h2>

          <p>
            {
              ai.overall_feedback ||
              "No overall feedback available."
            }
          </p>

        </div>

      </div>


      {/* ====================================
          Component Scores
      ==================================== */}

      <section className="resume-section">

        <div className="section-heading">

          <h2>
            Resume Breakdown
          </h2>

          <p>
            See how each part of your resume
            contributes to the overall score.
          </p>

        </div>


        <div className="component-score-grid">

          {
            Object.entries(
              componentScores
            ).map(
              ([name, component]) => {

                const percentage =
                  getPercentage(
                    component
                  );

                return (

                  <div
                    className="component-score-card"
                    key={name}
                  >

                    <div className="component-header">

                      <h3>
                        {
                          formatComponentName(
                            name
                          )
                        }
                      </h3>

                      <span>
                        {
                          component.score ?? 0
                        }
                        /
                        {
                          component.max_score ?? 0
                        }
                      </span>

                    </div>


                    <div className="score-progress">

                      <div
                        className="score-progress-fill"
                        style={{
                          width:
                            `${percentage}%`,
                        }}
                      ></div>

                    </div>


                    <p>
                      {percentage}% complete
                    </p>

                  </div>

                );
              }
            )
          }

        </div>

      </section>


      {/* ====================================
          Top Priorities
      ==================================== */}

      <section className="resume-section">

        <div className="section-heading">

          <h2>
            Top Priorities
          </h2>

          <p>
            Start with these improvements for
            the greatest impact.
          </p>

        </div>


        {
          priorities.length > 0 ? (

            <div className="priority-list">

              {
                priorities.map(
                  (priority, index) => (

                    <div
                      className="priority-card"
                      key={index}
                    >

                      <div className="priority-number">
                        {index + 1}
                      </div>

                      <p>
                        {priority}
                      </p>

                    </div>

                  )
                )
              }

            </div>

          ) : (

            <p className="empty-message">
              No priorities available.
            </p>

          )
        }

      </section>


      {/* ====================================
          Strengths
      ==================================== */}

      <section className="resume-section">

        <div className="section-heading">

          <h2>
            Resume Strengths
          </h2>

          <p>
            Areas your current resume is
            already doing well.
          </p>

        </div>


        {
          strengths.length > 0 ? (

            <div className="strength-list">

              {
                strengths.map(
                  (strength, index) => (

                    <div
                      className="strength-card"
                      key={index}
                    >
                      <span>
                        ✓
                      </span>

                      <p>
                        {strength}
                      </p>

                    </div>

                  )
                )
              }

            </div>

          ) : (

            <p className="empty-message">
              No strengths available.
            </p>

          )
        }

      </section>


      {/* ====================================
          AI Suggestions
      ==================================== */}

      <section className="resume-section">

        <div className="section-heading">

          <h2>
            AI Improvement Suggestions
          </h2>

          <p>
            Personalized recommendations based
            on your resume content.
          </p>

        </div>


        {
          suggestions.length > 0 ? (

            <div className="suggestion-grid">

              {
                suggestions.map(
                  (suggestion, index) => (

                    <div
                      className="suggestion-card"
                      key={index}
                    >

                      <div className="suggestion-top">

                        <h3>
                          {
                            suggestion.category ||
                            "General"
                          }
                        </h3>

                        <span
                          className={`priority-badge ${
                            (
                              suggestion.priority ||
                              "medium"
                            ).toLowerCase()
                          }`}
                        >
                          {
                            suggestion.priority ||
                            "Medium"
                          }
                        </span>

                      </div>


                      <div className="suggestion-content">

                        <div>

                          <h4>
                            Issue
                          </h4>

                          <p>
                            {
                              suggestion.issue ||
                              "No issue description."
                            }
                          </p>

                        </div>


                        <div>

                          <h4>
                            How to Improve
                          </h4>

                          <p>
                            {
                              suggestion.suggestion ||
                              "No suggestion available."
                            }
                          </p>

                        </div>

                      </div>

                    </div>

                  )
                )
              }

            </div>

          ) : (

            <p className="empty-message">
              No AI suggestions available.
            </p>

          )
        }

      </section>


      {/* ====================================
          Before -> Improved
      ==================================== */}

      <section className="resume-section">

        <div className="section-heading">

          <h2>
            Before → Improved
          </h2>

          <p>
            See how existing resume content can
            be written more professionally.
          </p>

        </div>


        {
          rewrites.length > 0 ? (

            <div className="rewrite-list">

              {
                rewrites.map(
                  (rewrite, index) => (

                    <div
                      className="rewrite-card"
                      key={index}
                    >

                      <div className="rewrite-section-name">
                        {
                          rewrite.section ||
                          "Resume Section"
                        }
                      </div>


                      <div className="rewrite-comparison">

                        <div className="before-box">

                          <span>
                            Before
                          </span>

                          <p>
                            {
                              rewrite.original ||
                              "No original text."
                            }
                          </p>

                        </div>


                        <div className="rewrite-arrow">
                          →
                        </div>


                        <div className="after-box">

                          <span>
                            Improved
                          </span>

                          <p>
                            {
                              rewrite.improved ||
                              "No improved text."
                            }
                          </p>

                        </div>

                      </div>

                    </div>

                  )
                )
              }

            </div>

          ) : (

            <p className="empty-message">
              No rewrite suggestions available.
            </p>

          )
        }

      </section>


      {/* ====================================
          Skills Organization
      ==================================== */}

      <section className="resume-section">

        <div className="section-heading">

          <h2>
            Skills Organization
          </h2>

          <p>
            A cleaner way to organize your
            technical skills.
          </p>

        </div>


        {
          skillsOrganization.length > 0 ? (

            <div className="skills-organization-card">

              {
                skillsOrganization.map(
                  (group, index) => (

                    <div
                      className="skill-group"
                      key={index}
                    >
                      {group}
                    </div>

                  )
                )
              }

            </div>

          ) : (

            <p className="empty-message">
              No skill organization suggestions
              available.
            </p>

          )
        }

      </section>


      {/* ====================================
          Action Verbs
      ==================================== */}

      <section className="resume-section">

        <div className="section-heading">

          <h2>
            Recommended Action Verbs
          </h2>

          <p>
            Use stronger verbs when describing
            projects and experience.
          </p>

        </div>


        {
          actionVerbs.length > 0 ? (

            <div className="action-verbs">

              {
                actionVerbs.map(
                  (verb, index) => (

                    <span
                      className="action-verb"
                      key={index}
                    >
                      {verb}
                    </span>

                  )
                )
              }

            </div>

          ) : (

            <p className="empty-message">
              No action verbs available.
            </p>

          )
        }

      </section>


      {/* ====================================
          Basic Improvements
      ==================================== */}

      {
        basicImprovements.length > 0 && (

          <section className="resume-section">

            <div className="section-heading">

              <h2>
                Additional Improvements
              </h2>

              <p>
                Recommendations identified by
                the resume quality analyzer.
              </p>

            </div>


            <div className="basic-improvement-list">

              {
                basicImprovements.map(
                  (item, index) => (

                    <div
                      className="basic-improvement-card"
                      key={index}
                    >

                      <div>

                        <h3>
                          {
                            item.category ||
                            "General"
                          }
                        </h3>

                        <p>
                          {
                            item.suggestion
                          }
                        </p>

                      </div>


                      <span
                        className={`priority-badge ${
                          (
                            item.priority ||
                            "medium"
                          ).toLowerCase()
                        }`}
                      >
                        {
                          item.priority ||
                          "Medium"
                        }
                      </span>

                    </div>

                  )
                )
              }

            </div>

          </section>

        )
      }


      {/* ====================================
          Missing Sections
      ==================================== */}

      {
        missingSections.length > 0 && (

          <section className="resume-section">

            <div className="section-heading">

              <h2>
                Missing Sections
              </h2>

            </div>


            <div className="missing-section-list">

              {
                missingSections.map(
                  (section, index) => (

                    <span
                      key={index}
                      className="missing-section-badge"
                    >
                      {section}
                    </span>

                  )
                )
              }

            </div>

          </section>

        )
      }


      {/* ====================================
          Resume Statistics
      ==================================== */}

      <section className="resume-section">

        <div className="section-heading">

          <h2>
            Resume Statistics
          </h2>

        </div>


        <div className="statistics-grid">

          <div className="stat-card">

            <strong>
              {
                statistics.skill_count ?? 0
              }
            </strong>

            <span>
              Skills
            </span>

          </div>


          <div className="stat-card">

            <strong>
              {
                statistics.project_count ?? 0
              }
            </strong>

            <span>
              Projects
            </span>

          </div>


          <div className="stat-card">

            <strong>
              {
                statistics.experience_count ?? 0
              }
            </strong>

            <span>
              Experience
            </span>

          </div>


          <div className="stat-card">

            <strong>
              {
                statistics.word_count ?? 0
              }
            </strong>

            <span>
              Words
            </span>

          </div>

        </div>

      </section>

   </div>

</div>
  );
}