import {
  useEffect,
  useRef,
  useState
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/CareerRecommendation.css";
import Sidebar from "../pages/Sidebar";


function CareerRecommendation() {

  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [profileAnalysis, setProfileAnalysis] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // Load Career Recommendations
  // ==========================================

  useEffect(() => {

    fetchCareerRecommendations();

  }, []);


  // ==========================================
  // Fetch Recommendations
  // ==========================================

  const fetchCareerRecommendations = async () => {

    try {

      setLoading(true);
      setError("");

      // ----------------------------------------
      // Get logged-in user
      // ----------------------------------------

      const storedUser = localStorage.getItem("user");

if (!storedUser) {
  setError("Please login to view career recommendations.");
  return;
}

let user;

try {
  user = JSON.parse(storedUser);
} catch (error) {
  console.error("Invalid user data:", error);
  setError("Invalid login information. Please login again.");
  return;
}

console.log("Stored Career User:", user);

// Support both id and _id
const userId = user?.id || user?._id;

if (!userId) {
  console.error("User ID missing from localStorage:", user);
  setError("User ID not found. Please login again.");
  return;
}

console.log("Career User ID:", userId);


      // ----------------------------------------
      // Call FastAPI
      // ----------------------------------------

      const response = await axios.get(
        `http://localhost:8000/api/career/recommendations/${userId}`
      );


      console.log(
        "Career Recommendation Response:",
        response.data
      );


      // ----------------------------------------
      // Store Results
      // ----------------------------------------

      setRecommendations(
        response.data?.data?.recommendations || []
      );


      setProfileAnalysis(
        response.data?.profile_analysis || null
      );

    }

    catch (err) {

      console.error(
        "Career Recommendation Error:",
        err
      );


      const detail =
        err.response?.data?.detail;


      if (detail) {

        setError(detail);

      } else {

        setError(
          "Unable to generate career recommendations."
        );

      }

    }

    finally {

      setLoading(false);

    }

  };


  // ==========================================
  // Loading Screen
  // ==========================================

  if (loading) {

    return (

      <div className="career-loading">

        <div className="career-spinner"></div>

        <h2>
          Analyzing Your Career Profile
        </h2>

        <p>
          AI is analyzing your skills, education,
          experience and projects...
        </p>

      </div>

    );

  }


  // ==========================================
  // Main Page
  // ==========================================

  return (

    <div className="career-page">

  <Sidebar />

  <div className="career-content">
    

      {/* =====================================
          Content
      ===================================== */}

      <main className="career-container">


        {/* Header */}

        <section className="career-header">

          <span className="career-badge">
            AI Career Intelligence
          </span>

          <h1>
            Career Recommendations
          </h1>

          <p>
            Discover career paths that match your
            skills, education, experience and projects.
          </p>

        </section>


        {/* =====================================
            Error
        ===================================== */}

        {error && (

          <div className="career-error">

            <div>

              <strong>
                Unable to Generate Recommendations
              </strong>

              <p>
                {error}
              </p>

            </div>


            <button
              onClick={() =>
                navigate("/profile")
              }
            >
              View Profile
            </button>

          </div>

        )}


        {/* =====================================
            Profile Summary
        ===================================== */}

        {!error && profileAnalysis && (

          <section className="profile-analysis-card">

            <div className="analysis-heading">

              <div>

                <span className="analysis-icon">
                  ✦
                </span>

              </div>


              <div>

                <h2>
                  Profile Analyzed
                </h2>

                <p>
                  AI used your resume information
                  to generate these recommendations.
                </p>

              </div>

            </div>


            <div className="analysis-stats">


              <div className="analysis-stat">

                <strong>
                  {
                    profileAnalysis.skills?.length ||
                    0
                  }
                </strong>

                <span>
                  Skills
                </span>

              </div>


              <div className="analysis-stat">

                <strong>
                  {
                    profileAnalysis.education?.length ||
                    0
                  }
                </strong>

                <span>
                  Education
                </span>

              </div>


              <div className="analysis-stat">

                <strong>
                  {
                    profileAnalysis.experience?.length ||
                    0
                  }
                </strong>

                <span>
                  Experience
                </span>

              </div>


              <div className="analysis-stat">

                <strong>
                  {
                    profileAnalysis.projects?.length ||
                    0
                  }
                </strong>

                <span>
                  Projects
                </span>

              </div>


            </div>

          </section>

        )}


        {/* =====================================
            Recommendations Header
        ===================================== */}

        {!error &&
          recommendations.length > 0 && (

          <div className="recommendation-heading">

            <div>

              <span className="career-badge">
                Top Matches
              </span>

              <h2>
                Recommended Career Paths
              </h2>

              <p>
                Ranked according to your current
                profile.
              </p>

            </div>


            <button
              className="regenerate-btn"
              onClick={
                fetchCareerRecommendations
              }
            >
              ↻ Regenerate
            </button>

          </div>

        )}


        {/* =====================================
            Career Cards
        ===================================== */}

        <div className="career-grid">

          {
            recommendations.map(
              (career, index) => (

                <div
                  className="career-card"
                  key={index}
                >


                  {/* Rank */}

                  <div className="career-card-top">

                    <span className="career-rank">
                      #{index + 1}
                    </span>


                    <span
                      className={
                        `match-badge ${
                          career.match_percentage >= 80
                            ? "high-match"
                            : career.match_percentage >= 60
                            ? "medium-match"
                            : "low-match"
                        }`
                      }
                    >

                      {
                        career.match_percentage
                      }% Match

                    </span>

                  </div>


                  {/* Career Name */}

                  <h2>
                    {career.career}
                  </h2>


                  {/* Match Progress */}

                  <div className="match-progress">

                    <div
                      className="match-progress-bar"
                      style={{
                        width:
                          `${career.match_percentage}%`
                      }}
                    />

                  </div>


                  {/* Reason */}

                  <div className="career-section">

                    <h3>
                      Why This Career?
                    </h3>

                    <p>
                      {career.reason}
                    </p>

                  </div>


                  {/* Matching Skills */}

                  <div className="career-section">

                    <h3>
                      Your Matching Skills
                    </h3>


                    <div className="career-tags">

                      {
                        career.matching_skills?.map(
                          (skill, skillIndex) => (

                            <span
                              className="career-tag matched"
                              key={skillIndex}
                            >
                              ✓ {skill}
                            </span>

                          )
                        )
                      }

                    </div>

                  </div>


                  {/* Skills to Improve */}

                  <div className="career-section">

                    <h3>
                      Skills to Improve
                    </h3>


                    <div className="career-tags">

                      {
                        career.skills_to_improve?.map(
                          (skill, skillIndex) => (

                            <span
                              className="career-tag improve"
                              key={skillIndex}
                            >
                              + {skill}
                            </span>

                          )
                        )
                      }

                    </div>

                  </div>


                  {/* Roadmap */}

                  <div className="career-section roadmap-section">

                    <h3>
                      Learning Roadmap
                    </h3>


                    <div className="roadmap-list">

                      {
                        career.roadmap?.map(
                          (step, stepIndex) => (

                            <div
                              className="roadmap-item"
                              key={stepIndex}
                            >

                              <span className="roadmap-number">
                                {stepIndex + 1}
                              </span>

                              <p>
                                {step}
                              </p>

                            </div>

                          )
                        )
                      }

                    </div>

                  </div>


                </div>

              )
            )
          }

        </div>


        {/* =====================================
            No Recommendations
        ===================================== */}

        {
          !error &&
          recommendations.length === 0 && (

            <div className="no-careers">

              <h2>
                No Career Recommendations Yet
              </h2>

              <p>
                Make sure your resume contains
                skills and profile information.
              </p>

              <button
                onClick={() =>
                  navigate("/profile")
                }
              >
                Complete Profile
              </button>

            </div>

          )
        }


      </main>

</div>

</div>

  );

}


export default CareerRecommendation;