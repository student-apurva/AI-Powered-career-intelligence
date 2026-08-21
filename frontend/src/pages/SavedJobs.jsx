import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import "../styles/SavedJobs.css";


export default function SavedJobs() {

  // ==========================================
  // State
  // ==========================================

  const [savedJobs, setSavedJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [removingJob, setRemovingJob] =
    useState({});


  // ==========================================
  // Get Logged-In User
  // ==========================================

  const getUser = () => {

    try {

      const storedUser =
        localStorage.getItem("user");


      if (!storedUser) {
        return null;
      }


      return JSON.parse(
        storedUser
      );

    } catch (error) {

      console.error(
        "USER PARSE ERROR:",
        error
      );

      return null;
    }
  };


  // ==========================================
  // Fetch Saved Jobs
  // ==========================================

  const fetchSavedJobs =
    useCallback(async () => {

      try {

        setLoading(true);

        setError("");


        const user =
          getUser();


        if (!user?.id) {

          setError(
            "User information not found. " +
            "Please log in again."
          );

          return;
        }


        const response =
          await axios.get(

            `http://127.0.0.1:8000/api/jobs/saved/${user.id}`

          );


        console.log(
          "Saved Jobs Response:",
          response.data
        );


        setSavedJobs(
          response.data.saved_jobs ||
          []
        );


      } catch (error) {

        console.error(
          "SAVED JOBS ERROR:",
          error
        );


        if (error.response) {

          setError(
            error.response.data?.detail ||
            "Unable to load saved jobs."
          );

        } else {

          setError(
            "Cannot connect to the backend server."
          );
        }


      } finally {

        setLoading(false);
      }

    }, []);


  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {

    fetchSavedJobs();

  }, [fetchSavedJobs]);


  // ==========================================
  // Remove Saved Job
  // ==========================================

  const handleRemoveJob = async (
    job
  ) => {

    try {

      const user =
        getUser();


      if (!user?.id) {

        alert(
          "Please log in again."
        );

        return;
      }


      const jobId =
        String(
          job.job_id || ""
        );


      if (!jobId) {

        alert(
          "Job ID not found."
        );

        return;
      }


      // ======================================
      // Loading
      // ======================================

      setRemovingJob(
        (previous) => ({

          ...previous,

          [jobId]: true,

        })
      );


      // ======================================
      // DELETE API
      // ======================================

      const response =
        await axios.delete(

          `http://127.0.0.1:8000/api/jobs/saved/${user.id}/${encodeURIComponent(jobId)}`

        );


      console.log(
        "Remove Saved Job:",
        response.data
      );


      // ======================================
      // Remove From UI
      // ======================================

      setSavedJobs(
        (previous) =>

          previous.filter(
            (savedJob) =>
              String(
                savedJob.job_id
              ) !== jobId
          )
      );


    } catch (error) {

      console.error(
        "REMOVE JOB ERROR:",
        error
      );


      alert(
        error.response?.data?.detail ||
        "Unable to remove saved job."
      );


    } finally {

      const jobId =
        String(
          job.job_id || ""
        );


      setRemovingJob(
        (previous) => ({

          ...previous,

          [jobId]: false,

        })
      );
    }
  };


  // ==========================================
  // Loading
  // ==========================================

  if (loading) {

    return (

      <div className="saved-jobs-state">

        <div className="saved-jobs-loader">
        </div>

        <h2>
          Loading your saved jobs...
        </h2>

        <p>
          Getting your bookmarked opportunities.
        </p>

      </div>
    );
  }


  // ==========================================
  // Error
  // ==========================================

  if (error) {

    return (

      <div className="saved-jobs-state">

        <div className="saved-jobs-error">

          <h2>
            Unable to Load Saved Jobs
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={
              fetchSavedJobs
            }
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="saved-jobs-page">


      {/* Header */}

      <section className="saved-jobs-header">

        <div>

          <span className="saved-jobs-label">
            AI Career Intelligence
          </span>

          <h1>
            Saved Jobs
          </h1>

          <p>
            Keep track of opportunities you
            want to explore and apply for.
          </p>

        </div>


        <div className="saved-jobs-count">

          <strong>
            {savedJobs.length}
          </strong>

          <span>
            Saved Jobs
          </span>

        </div>

      </section>


      {/* Empty State */}

      {
        savedJobs.length === 0
          ? (

            <section className="saved-jobs-empty">

              <div className="empty-bookmark">
                ♡
              </div>

              <h2>
                No Saved Jobs Yet
              </h2>

              <p>
                Save jobs from your job
                recommendations and they will
                appear here.
              </p>

            </section>

          )
          : (

            <section className="saved-jobs-grid">

              {
                savedJobs.map(
                  (job, index) => {

                    const jobId =
                      String(
                        job.job_id ||
                        job.id ||
                        index
                      );


                    return (

                      <article
                        className="saved-job-card"
                        key={
                          job.id ||
                          jobId
                        }
                      >


                        {/* Top */}

                        <div className="saved-job-top">

                          <div>

                            <span className="saved-badge">
                              ✓ Saved
                            </span>

                            <h2>
                              {job.title}
                            </h2>

                            <h3>
                              {job.company}
                            </h3>

                          </div>


                          <div className="saved-match-score">

                            <strong>

                              {
                                Math.round(
                                  job.match_score ||
                                  0
                                )
                              }%

                            </strong>

                            <span>
                              Match
                            </span>

                          </div>

                        </div>


                        {/* Meta */}

                        <div className="saved-job-meta">

                          <span>
                            📍 {
                              job.location ||
                              "Not specified"
                            }
                          </span>

                          <span>
                            💼 {
                              job.job_type ||
                              "Not specified"
                            }
                          </span>

                          <span>
                            🎓 {
                              job.experience_level ||
                              "Not specified"
                            }
                          </span>

                        </div>


                        {/* Saved Date */}

                        {
                          job.saved_at && (

                            <p className="saved-date">

                              Saved on{" "}

                              {
                                new Date(
                                  job.saved_at
                                ).toLocaleDateString()
                              }

                            </p>

                          )
                        }


                        {/* Actions */}

                        <div className="saved-job-actions">

                          {
                            job.apply_url
                              ? (

                                <a
                                  href={
                                    job.apply_url
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="saved-apply-btn"
                                >
                                  Apply Now
                                </a>

                              )
                              : (

                                <button
                                  type="button"
                                  className="saved-apply-btn disabled"
                                  disabled
                                >
                                  Application Link Unavailable
                                </button>

                              )
                          }


                          <button
                            type="button"
                            className="remove-saved-btn"
                            disabled={
                              removingJob[
                                jobId
                              ]
                            }
                            onClick={
                              () =>
                                handleRemoveJob(
                                  job
                                )
                            }
                          >

                            {
                              removingJob[jobId]
                                ? "Removing..."
                                : "Remove"
                            }

                          </button>

                        </div>

                      </article>

                    );
                  }
                )
              }

            </section>

          )
      }

    </div>
  );
}