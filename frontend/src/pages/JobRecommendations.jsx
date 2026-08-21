import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import "../styles/JobRecommendations.css";
import Sidebar from "../pages/Sidebar";

export default function JobRecommendations() {

  // ==========================================
  // State
  // ==========================================

  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [jobType, setJobType] = useState("All");
  const [minimumMatch, setMinimumMatch] = useState(0);
  const [sortBy, setSortBy] = useState("match");


  // ==========================================
  // AI State
  // ==========================================

  const [aiExplanations, setAiExplanations] =
    useState({});

  const [aiLoading, setAiLoading] =
    useState({});


  // ==========================================
  // Saved Jobs State
  // ==========================================

  const [savedJobs, setSavedJobs] =
    useState({});

  const [savingJob, setSavingJob] =
    useState({});


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

    } catch (error) {

      console.error(
        "USER PARSE ERROR:",
        error
      );

      return null;
    }
  };


  // ==========================================
  // Fetch Job Recommendations
  // ==========================================

  const fetchRecommendations =
    useCallback(async () => {

      try {

        setLoading(true);
        setError("");


        const user =
          getLoggedInUser();


        if (!user) {

          setError(
            "User information not found. " +
            "Please log in again."
          );

          return;
        }


        if (!user?.id) {

          setError(
            "User ID not found. " +
            "Please log in again."
          );

          return;
        }


        const response =
          await axios.get(

            `http://127.0.0.1:8000/api/jobs/recommendations/${user.id}`

          );


        console.log(
          "Job Recommendations:",
          response.data
        );


        setJobs(
    response.data.jobs || []
);


        setProfile(
          response.data.profile_analysis ||
          null
        );


      } catch (error) {

        console.error(
          "JOB RECOMMENDATION ERROR:",
          error
        );


        if (error.response) {

          console.log(
            "Status:",
            error.response.status
          );

          console.log(
            "Backend:",
            error.response.data
          );


          setError(
            error.response.data?.detail ||
            "Unable to load job recommendations."
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
  // Fetch Existing Saved Jobs
  // ==========================================

  const fetchSavedJobs =
    useCallback(async () => {

      try {

        const user =
          getLoggedInUser();


        if (!user?.id) {

          console.log(
            "Saved jobs: User ID not found."
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


        // Convert array to lookup object

        const savedMap = {};


        (
          response.data.saved_jobs ||
          []
        ).forEach(
          (job) => {

            if (job.job_id) {

              savedMap[
                String(job.job_id)
              ] = true;
            }
          }
        );


        setSavedJobs(savedMap);


      } catch (error) {

        console.error(
          "FETCH SAVED JOBS ERROR:",
          error
        );


        if (error.response) {

          console.log(
            "Saved Jobs Status:",
            error.response.status
          );

          console.log(
            "Saved Jobs Backend:",
            error.response.data
          );
        }
      }

    }, []);


  // ==========================================
  // Load Page
  // ==========================================

  useEffect(() => {

    fetchRecommendations();

    fetchSavedJobs();

  }, [
    fetchRecommendations,
    fetchSavedJobs,
  ]);


  // ==========================================
  // Generate AI Explanation
  // ==========================================

  const getAIExplanation = async (
    job,
    jobKey
  ) => {

    // Don't call API again
    if (aiExplanations[jobKey]) {
      return;
    }


    try {

      setAiLoading(
        (previous) => ({
          ...previous,
          [jobKey]: true,
        })
      );


      const resumeSkills =
        profile?.skills || [];


      const response =
        await axios.post(

          "http://127.0.0.1:8000/api/jobs/explain",

          {

            job_title:
              job.title || "",

            company:
              job.company || "",

            job_description:
              job.description || "",

            resume_skills:
              resumeSkills,

            matching_skills:
              job.matching_skills || [],

            missing_skills:
              job.missing_skills || [],

            match_score:
              Number(
                job.match_score || 0
              ),

            career_match_score:
              Number(
                job.career_match_score ||
                0
              ),

            experience_match_score:
              Number(
                job.experience_match_score ||
                0
              ),
          }
        );


      console.log(
        "Job AI Explanation:",
        response.data
      );


      setAiExplanations(
        (previous) => ({

          ...previous,

          [jobKey]:
            response.data.data,

        })
      );


    } catch (error) {

      console.error(
        "JOB AI ERROR:",
        error
      );


      setAiExplanations(
        (previous) => ({

          ...previous,

          [jobKey]: {

            error:
              error.response?.data?.detail ||
              "Unable to generate AI explanation.",

          },

        })
      );


    } finally {

      setAiLoading(
        (previous) => ({

          ...previous,

          [jobKey]: false,

        })
      );
    }
  };


  // ==========================================
  // Save Job
  // ==========================================

  const handleSaveJob = async (
    job,
    jobKey
  ) => {

    try {

      const user =
        getLoggedInUser();


      if (!user?.id) {

        alert(
          "User ID not found. " +
          "Please log in again."
        );

        return;
      }


      if (savedJobs[jobKey]) {
        return;
      }


      setSavingJob(
        (previous) => ({

          ...previous,

          [jobKey]: true,

        })
      );


      const jobId = String(
        job.job_id ||
        job._id ||
        jobKey
      );


      const response =
        await axios.post(

          "http://127.0.0.1:8000/api/jobs/save",

          {

            user_id:
              user.id,

            job_id:
              jobId,

            title:
              job.title || "",

            company:
              job.company || "",

            location:
              job.location || "",

            job_type:
              job.job_type || "",

            experience_level:
              job.experience_level || "",

            match_score:
              Number(
                job.match_score || 0
              ),

            apply_url:
              job.apply_link || "",
          }
        );


      console.log(
        "Save Job Response:",
        response.data
      );


      if (response.data.success) {

        setSavedJobs(
          (previous) => ({

            ...previous,

            [jobId]: true,

          })
        );
      }


    } catch (error) {

      console.error(
        "SAVE JOB ERROR:",
        error
      );


      alert(
        error.response?.data?.detail ||
        "Unable to save job."
      );


    } finally {

      setSavingJob(
        (previous) => ({

          ...previous,

          [jobKey]: false,

        })
      );
    }
  };


  // ==========================================
  // Available Locations
  // ==========================================

  const locations = useMemo(() => {

    const uniqueLocations =
      jobs
        .map(
          (job) =>
            job.location?.trim()
        )
        .filter(Boolean);


    return [
      "All",

      ...Array.from(
        new Set(uniqueLocations)
      ).sort(),
    ];

  }, [jobs]);


  // ==========================================
  // Available Job Types
  // ==========================================

  const jobTypes = useMemo(() => {

    const values =
      jobs
        .map(
          (job) =>
            job.job_type?.trim()
        )
        .filter(Boolean);


    return [
      "All",

      ...Array.from(
        new Set(values)
      ).sort(),
    ];

  }, [jobs]);


  // ==========================================
  // Filter + Sort Jobs
  // ==========================================

  const filteredJobs = useMemo(() => {

    let result = [...jobs];


    // ======================================
    // Search
    // ======================================

    if (search.trim()) {

      const value =
        search
          .trim()
          .toLowerCase();


      result = result.filter(
        (job) => {

          const title =
            (
              job.title || ""
            ).toLowerCase();


          const company =
            (
              job.company || ""
            ).toLowerCase();


          const category =
            (
              job.career_category || ""
            ).toLowerCase();


          const jobLocation =
            (
              job.location || ""
            ).toLowerCase();


          return (

            title.includes(value) ||

            company.includes(value) ||

            category.includes(value) ||

            jobLocation.includes(value)

          );
        }
      );
    }


    // ======================================
    // Filter By Location
    // ======================================

    if (location !== "All") {

      result = result.filter(
        (job) => {

          const jobLocation =
            (
              job.location || ""
            )
              .trim()
              .toLowerCase();


          const selectedLocation =
            location
              .trim()
              .toLowerCase();


          return (
            jobLocation ===
            selectedLocation
          );
        }
      );
    }


    // ======================================
    // Filter By Job Type
    // ======================================

    if (jobType !== "All") {

      result = result.filter(
        (job) =>

          (
            job.job_type || ""
          )
            .trim()
            .toLowerCase()

          ===

          jobType
            .trim()
            .toLowerCase()
      );
    }


    // ======================================
    // Minimum Match
    // ======================================

    result = result.filter(
      (job) =>

        Number(
          job.match_score || 0
        )

        >=

        Number(
          minimumMatch
        )
    );


    // ======================================
    // Sort
    // ======================================

    if (sortBy === "match") {

      result.sort(
        (a, b) =>

          Number(
            b.match_score || 0
          )

          -

          Number(
            a.match_score || 0
          )
      );


    } else if (
      sortBy === "title"
    ) {

      result.sort(
        (a, b) =>

          (a.title || "")
            .localeCompare(
              b.title || ""
            )
      );


    } else if (
      sortBy === "company"
    ) {

      result.sort(
        (a, b) =>

          (a.company || "")
            .localeCompare(
              b.company || ""
            )
      );
    }


    return result;

  }, [
    jobs,
    search,
    location,
    jobType,
    minimumMatch,
    sortBy,
  ]);


  // ==========================================
  // Reset Filters
  // ==========================================

  const resetFilters = () => {

    setSearch("");

    setLocation("All");

    setJobType("All");

    setMinimumMatch(0);

    setSortBy("match");
  };


  // ==========================================
  // Loading
  // ==========================================

  if (loading) {

    return (

      <div className="jobs-state-page">

        <div className="jobs-loader">
        </div>

        <h2>
          Finding the best jobs for you...
        </h2>

        <p>
          Comparing your skills and career
          profile with available opportunities.
        </p>

      </div>
    );
  }


  // ==========================================
  // Error
  // ==========================================

  if (error) {

    return (

      <div className="jobs-state-page">

        <div className="jobs-error-card">

          <h2>
            Unable to Load Recommendations
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={
              fetchRecommendations
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

    <div className="job-recommendations-page">

    <Sidebar />

    <div className="job-content">
      {/* ====================================
          Header
      ==================================== */}

      <section className="jobs-header">

        <div>

          <span className="jobs-header-label">
            AI Career Intelligence
          </span>

          <h1>
            Job Recommendations
          </h1>

          <p>
            Opportunities ranked using your
            skills, career direction and
            experience.
          </p>

        </div>


        <div className="jobs-header-count">

          <strong>
            {jobs.length}
          </strong>

          <span>
            Recommended Jobs
          </span>

        </div>

      </section>


      {/* ====================================
          Profile Summary
      ==================================== */}

      {profile && (

        <section className="job-profile-summary">

          <div className="summary-item">

            <span>
              Skills
            </span>

            <strong>
              {profile.skills?.length || 0}
            </strong>

          </div>


          <div className="summary-item">

            <span>
              Experience
            </span>

            <strong>

              {
                profile.experience_years ||
                0
              } Years

            </strong>

          </div>


          <div className="summary-item">

            <span>
              Career Matches
            </span>

            <strong>

              {
                profile
                  .recommended_careers
                  ?.length || 0
              }

            </strong>

          </div>

        </section>

      )}


      {/* ====================================
          Career Paths
      ==================================== */}

      {
        profile
          ?.recommended_careers
          ?.length > 0 && (

          <section className="career-direction">

            <h2>
              Your Recommended Career Paths
            </h2>


            <div className="career-direction-list">

              {
                profile
                  .recommended_careers
                  .map(
                    (
                      career,
                      index
                    ) => (

                      <span
                        key={
                          `${career}-${index}`
                        }
                      >
                        {career}
                      </span>

                    )
                  )
              }

            </div>

          </section>

        )
      }


      {/* ====================================
          Filters
      ==================================== */}

      <section className="job-filters">


        {/* Search */}

        <div className="job-search-box">

          <input
            type="text"
            placeholder="Search job title, company or location..."
            value={search}
            onChange={
              (e) =>
                setSearch(
                  e.target.value
                )
            }
          />

        </div>


        {/* Location */}

        <div className="filter-group">

          <label>
            Location
          </label>

          <select
            value={location}
            onChange={
              (e) =>
                setLocation(
                  e.target.value
                )
            }
          >

            {
              locations.map(
                (item) => (

                  <option
                    key={item}
                    value={item}
                  >

                    {
                      item === "All"
                        ? "📍 All Locations"
                        : `📍 ${item}`
                    }

                  </option>

                )
              )
            }

          </select>

        </div>


        {/* Job Type */}

        <div className="filter-group">

          <label>
            Job Type
          </label>

          <select
            value={jobType}
            onChange={
              (e) =>
                setJobType(
                  e.target.value
                )
            }
          >

            {
              jobTypes.map(
                (item) => (

                  <option
                    key={item}
                    value={item}
                  >

                    {
                      item === "All"
                        ? "All Job Types"
                        : item
                    }

                  </option>

                )
              )
            }

          </select>

        </div>


        {/* Match */}

        <div className="filter-group">

          <label>
            Match Score
          </label>

          <select
            value={minimumMatch}
            onChange={
              (e) =>
                setMinimumMatch(
                  Number(
                    e.target.value
                  )
                )
            }
          >

            <option value={0}>
              Any Match
            </option>

            <option value={50}>
              50%+ Match
            </option>

            <option value={60}>
              60%+ Match
            </option>

            <option value={70}>
              70%+ Match
            </option>

            <option value={80}>
              80%+ Match
            </option>

          </select>

        </div>


        {/* Sort */}

        <div className="filter-group">

          <label>
            Sort By
          </label>

          <select
            value={sortBy}
            onChange={
              (e) =>
                setSortBy(
                  e.target.value
                )
            }
          >

            <option value="match">
              Best Match
            </option>

            <option value="title">
              Job Title
            </option>

            <option value="company">
              Company
            </option>

          </select>

        </div>


        <button
          type="button"
          className="reset-filter-btn"
          onClick={resetFilters}
        >
          Reset
        </button>

      </section>


      {/* ====================================
          Result Information
      ==================================== */}

      <div className="job-result-info">

        <div>

          <h2>
            Recommended Opportunities
          </h2>


          {location !== "All" && (

            <p className="active-location">

              Showing jobs in{" "}

              <strong>
                {location}
              </strong>

            </p>

          )}

        </div>


        <span>
          {filteredJobs.length} results
        </span>

      </div>


      {/* ====================================
          Job Cards
      ==================================== */}

      <section className="jobs-grid">

        {
          filteredJobs.map(
            (job, index) => {

              const jobKey = String(

                job.job_id ||

                job._id ||

                `${job.title}-${job.company}-${index}`

              );


              const aiResult =
                aiExplanations[jobKey];


              const isAILoading =
                aiLoading[jobKey];


              return (

                <article
                  className="job-recommendation-card"
                  key={jobKey}
                >


                  {/* Header */}

                  <div className="job-card-header">

                    <div>

                      <span className="job-rank">

                        #{index + 1} Recommended

                      </span>


                      <h2>
                        {job.title}
                      </h2>


                      <h3>
                        {job.company}
                      </h3>

                    </div>


                    <div className="job-match-circle">

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


                  {/* Metadata */}

                  <div className="job-meta">

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


                  {/* Match Status */}

                  {job.match_status && (

                    <div className="job-match-status">

                      {job.match_status}

                    </div>

                  )}


                  {/* Description */}

                  {job.description && (

                    <p className="job-description">

                      {job.description}

                    </p>

                  )}


                  {/* Scores */}

                  <div className="job-score-grid">

                    <div>

                      <span>
                        Skill Match
                      </span>

                      <strong>

                        {
                          Math.round(
                            job.skill_match_score ||
                            0
                          )
                        }%

                      </strong>

                    </div>


                    <div>

                      <span>
                        Career Match
                      </span>

                      <strong>

                        {
                          Math.round(
                            job.career_match_score ||
                            0
                          )
                        }%

                      </strong>

                    </div>


                    <div>

                      <span>
                        Experience
                      </span>

                      <strong>

                        {
                          Math.round(
                            job.experience_match_score ||
                            0
                          )
                        }%

                      </strong>

                    </div>

                  </div>


                  {/* Matching Skills */}

                  <div className="job-skills-section">

                    <h4>
                      Matching Skills
                    </h4>


                    <div className="skill-chip-container">

                      {
                        job
                          .matching_skills
                          ?.length > 0
                          ? (

                            job
                              .matching_skills
                              .map(
                                (
                                  skill,
                                  skillIndex
                                ) => (

                                  <span
                                    className="skill-chip matched"
                                    key={
                                      `${skill}-${skillIndex}`
                                    }
                                  >

                                    ✓ {skill}

                                  </span>

                                )
                              )

                          )
                          : (

                            <span className="empty-skill-text">
                              No direct skill matches
                            </span>

                          )
                      }

                    </div>

                  </div>


                  {/* Missing Skills */}

                  <div className="job-skills-section">

                    <h4>
                      Skills to Improve
                    </h4>


                    <div className="skill-chip-container">

                      {
                        job
                          .missing_skills
                          ?.length > 0
                          ? (

                            job
                              .missing_skills
                              .map(
                                (
                                  skill,
                                  skillIndex
                                ) => (

                                  <span
                                    className="skill-chip missing"
                                    key={
                                      `${skill}-${skillIndex}`
                                    }
                                  >

                                    + {skill}

                                  </span>

                                )
                              )

                          )
                          : (

                            <span className="all-skills-match">
                              You match all listed skills
                            </span>

                          )
                      }

                    </div>

                  </div>


                  {/* AI Explanation */}

                  {aiResult && (

                    <div className="job-ai-box">

                      {
                        aiResult.error
                          ? (

                            <p className="job-ai-error">
                              {aiResult.error}
                            </p>

                          )
                          : (

                            <>

                              <h4>
                                ✨ AI Job Insight
                              </h4>


                              {
                                aiResult.explanation && (

                                  <p>
                                    {
                                      aiResult.explanation
                                    }
                                  </p>

                                )
                              }


                              {
                                aiResult
                                  .strengths
                                  ?.length > 0 && (

                                  <div className="ai-detail">

                                    <strong>
                                      Your Strengths
                                    </strong>


                                    <div className="ai-chip-list">

                                      {
                                        aiResult
                                          .strengths
                                          .map(
                                            (
                                              skill,
                                              skillIndex
                                            ) => (

                                              <span
                                                key={
                                                  `${skill}-${skillIndex}`
                                                }
                                              >
                                                {skill}
                                              </span>

                                            )
                                          )
                                      }

                                    </div>

                                  </div>

                                )
                              }


                              {
                                aiResult
                                  .skills_to_improve
                                  ?.length > 0 && (

                                  <div className="ai-detail">

                                    <strong>
                                      Improve
                                    </strong>


                                    <div className="ai-chip-list improve">

                                      {
                                        aiResult
                                          .skills_to_improve
                                          .map(
                                            (
                                              skill,
                                              skillIndex
                                            ) => (

                                              <span
                                                key={
                                                  `${skill}-${skillIndex}`
                                                }
                                              >
                                                {skill}
                                              </span>

                                            )
                                          )
                                      }

                                    </div>

                                  </div>

                                )
                              }


                              {
                                aiResult
                                  .application_advice && (

                                  <div className="ai-advice">

                                    <strong>
                                      Before Applying
                                    </strong>

                                    <p>
                                      {
                                        aiResult
                                          .application_advice
                                      }
                                    </p>

                                  </div>

                                )
                              }

                            </>

                          )
                      }

                    </div>

                  )}


                  {/* Actions */}

                  <div className="job-card-actions">


                    {/* AI */}

                    <button
                      type="button"
                      className="why-job-btn"
                      onClick={
                        () =>
                          getAIExplanation(
                            job,
                            jobKey
                          )
                      }
                      disabled={
                        isAILoading
                      }
                    >

                      {
                        isAILoading
                          ? "Analyzing..."
                          : aiResult &&
                            !aiResult.error
                            ? "AI Insight Generated"
                            : "Why this job?"
                      }

                    </button>


                    {/* Save */}

                    <button
                      type="button"
                      className={
                        savedJobs[jobKey]
                          ? "save-job-btn saved"
                          : "save-job-btn"
                      }
                      onClick={
                        () =>
                          handleSaveJob(
                            job,
                            jobKey
                          )
                      }
                      disabled={
                        savingJob[jobKey] ||
                        savedJobs[jobKey]
                      }
                    >

                      {
                        savingJob[jobKey]
                          ? "Saving..."
                          : savedJobs[jobKey]
                            ? "✓ Saved"
                            : "♡ Save Job"
                      }

                    </button>


                    {/* Apply */}

{job.apply_url ? (

    <a
        href={job.apply_url}
        target="_blank"
        rel="noopener noreferrer"
        className="apply-btn"
    >
        Apply Now
    </a>

) : (

    <button
        className="apply-btn disabled"
        disabled
    >
        Application Link Unavailable
    </button>

)}
                  </div>

                </article>

              );
            }
          )
        }

      </section>


      {/* ====================================
          No Results
      ==================================== */}

      {filteredJobs.length === 0 && (

        <div className="no-job-results">

          <h3>
            No matching jobs found
          </h3>

          <p>
            Try changing your search or filters.
          </p>

          <button
            type="button"
            onClick={resetFilters}
          >
            Clear Filters
          </button>

        </div>

      )}

    </div>

</div>


  );
}