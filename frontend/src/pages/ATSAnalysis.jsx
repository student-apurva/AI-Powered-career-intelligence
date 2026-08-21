import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ATSAnalysis.css";
import Sidebar from "../pages/Sidebar";

function ATSAnalysis() {
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

const calculateATS = async () => {
  if (!jobDescription.trim()) {
    setError("Please enter the job description.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    // Temporary skills for testing ATS backend
    const resumeSkills = [
      "Java",
      "Python",
      "JavaScript",
      "React",
      "HTML",
      "CSS",
      "SQL",
      "MongoDB",
      "Git",
      "Node.js",
      "Express.js",
    ];
const token = localStorage.getItem("token");
if (!token) {
  setError("Please login first.");
  return;
}
const response = await axios.post(
  "http://localhost:8000/ats/analyze",
  {
    job_description: jobDescription,
    resume_skills: resumeSkills,
    resume_text: "",
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
);

    console.log("ATS Response:", response.data);

    setResult(response.data);
  } catch (err) {
    console.error("ATS ERROR:", err);
    console.error("Backend response:", err.response?.data);
    console.error("Status:", err.response?.status);

    const detail = err.response?.data?.detail;

    if (Array.isArray(detail)) {
      setError(detail.map((item) => item.msg).join(", "));
    } else {
      setError(detail || "Unable to calculate ATS score.");
    }
  } finally {
    setLoading(false);
  }
};

  const clearAnalysis = () => {
    setJobDescription("");
    setResult(null);
    setError("");
  };

  return (
    <div className="ats-page">

  <Sidebar />

  <div className="ats-content">
      

      <main className="ats-container">

        {/* Header */}
        <section className="ats-header">
          <span className="ats-badge">AI Resume Intelligence</span>

          <h1>ATS Resume Analysis</h1>

          <p>
            Compare your resume with a job description and discover how well
            your profile matches the role.
          </p>
        </section>

        {/* Main Grid */}
        <div className="ats-main-grid">

          {/* Resume Card */}
          <section className="ats-card resume-info-card">
            <div className="card-heading">
              <div className="heading-icon">📄</div>

              <div>
                <h2>Your Resume</h2>
                <p>Resume currently available in your profile</p>
              </div>
            </div>

            <div className="resume-status-box">
              <div className="resume-check">✓</div>

              <div className="resume-details">
                <strong>Resume Ready</strong>
                <span>Your parsed resume will be used for analysis.</span>
              </div>

              <button
                className="view-profile-btn"
                onClick={() => navigate("/profile")}
              >
                View Profile
              </button>
            </div>

            <div className="analysis-info">
              <div>
                <span>✓</span>
                Skills
              </div>

              <div>
                <span>✓</span>
                Education
              </div>

              <div>
                <span>✓</span>
                Experience
              </div>

              <div>
                <span>✓</span>
                Projects
              </div>
            </div>
          </section>

          {/* Job Description */}
          <section className="ats-card job-card">
            <div className="card-heading">
              <div className="heading-icon">💼</div>

              <div>
                <h2>Job Description</h2>
                <p>Paste the job description you want to analyze</p>
              </div>
            </div>

            <textarea
              className="job-description-input"
              placeholder="Paste job description here...

Example:

We are looking for a Software Developer with experience in React.js, JavaScript, Python, SQL, REST APIs and Git..."
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setError("");
              }}
            />

            <div className="textarea-footer">
              <span>
                {jobDescription.length} characters
              </span>

              {jobDescription && (
                <button
                  className="clear-text-btn"
                  onClick={() => setJobDescription("")}
                >
                  Clear
                </button>
              )}
            </div>
          </section>
        </div>

        {error && (
          <div className="ats-error">
            ⚠ {error}
          </div>
        )}

        {/* Analyze Button */}
        <div className="analyze-section">
          <button
            className="analyze-btn"
            onClick={calculateATS}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing Resume...
              </>
            ) : (
              <>
                ✦ Calculate ATS Score
              </>
            )}
          </button>

          <p>
            AI will compare your resume skills and keywords with the job
            requirements.
          </p>
        </div>

        {/* Results */}
        {result && (
          <section className="results-section">

            <div className="results-title">
              <div>
                <span className="ats-badge">Analysis Complete</span>
                <h2>Your ATS Analysis</h2>
              </div>

              <button
                className="new-analysis-btn"
                onClick={clearAnalysis}
              >
                New Analysis
              </button>
            </div>

            {/* Score Cards */}
            <div className="score-grid">

              <div className="score-card main-score">
                <span className="score-label">
                  ATS Compatibility Score
                </span>

                <div className="score-circle">
                  <strong>{result.ats_score || 0}</strong>
                  <span>%</span>
                </div>

                <p>
                  {result.ats_score >= 80
                    ? "Excellent Match"
                    : result.ats_score >= 60
                    ? "Good Match"
                    : result.ats_score >= 40
                    ? "Average Match"
                    : "Needs Improvement"}
                </p>
              </div>

              <div className="score-card">
                <div className="metric-icon green">✓</div>

                <span>Matching Skills</span>

                <strong>
                  {result.matching_skills?.length || 0}
                </strong>

                <p>Skills found in both resume and job</p>
              </div>

              <div className="score-card">
                <div className="metric-icon orange">!</div>

                <span>Missing Skills</span>

                <strong>
                  {result.missing_skills?.length || 0}
                </strong>

                <p>Important skills you should consider learning</p>
              </div>
            </div>

            {/* Skills */}
            <div className="skills-result-grid">

              <div className="result-card matching-card">
                <div className="result-card-header">
                  <div>
                    <span className="result-icon success">✓</span>
                  </div>

                  <div>
                    <h3>Matching Skills</h3>
                    <p>Your strengths for this position</p>
                  </div>
                </div>

                <div className="skill-tags">
                  {result.matching_skills?.length > 0 ? (
                    result.matching_skills.map((skill, index) => (
                      <span
                        className="skill-tag matched"
                        key={index}
                      >
                        ✓ {skill}
                      </span>
                    ))
                  ) : (
                    <p className="empty-message">
                      No matching skills detected.
                    </p>
                  )}
                </div>
              </div>

              <div className="result-card missing-card">
                <div className="result-card-header">
                  <div>
                    <span className="result-icon warning">!</span>
                  </div>

                  <div>
                    <h3>Missing Skills</h3>
                    <p>Skills required by this position</p>
                  </div>
                </div>

                <div className="skill-tags">
                  {result.missing_skills?.length > 0 ? (
                    result.missing_skills.map((skill, index) => (
                      <span
                        className="skill-tag missing"
                        key={index}
                      >
                        + {skill}
                      </span>
                    ))
                  ) : (
                    <p className="empty-message">
                      Great! No major skills are missing.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendation */}
            {result.recommendation && (
              <div className="recommendation-card">
                <div className="recommendation-icon">✦</div>

                <div>
                  <h3>AI Recommendation</h3>
                  <p>{result.recommendation}</p>
                </div>
              </div>
            )}

          </section>
        )}

            </main>

  </div>

</div>
  );
}

export default ATSAnalysis;