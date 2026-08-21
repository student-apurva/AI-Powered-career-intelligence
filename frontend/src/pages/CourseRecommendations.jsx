import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import "../styles/CourseRecommendations.css";
import Sidebar from "../pages/Sidebar";


const API_URL = "http://127.0.0.1:8000";


export default function CourseRecommendations() {

  const [courses, setCourses] = useState([]);

  const [learningPath, setLearningPath] =
    useState([]);

  const [career, setCareer] = useState("");

  const [currentSkills, setCurrentSkills] =
    useState([]);

  const [targetSkills, setTargetSkills] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ========================================
  // Get User
  // ========================================

  const getUser = () => {

    try {

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);

    } catch (err) {

      console.error(
        "Invalid user in localStorage:",
        err
      );

      return null;
    }
  };


  // ========================================
  // Fetch Data
  // ========================================

  const fetchCourseData = useCallback(
    async () => {

      try {

        setLoading(true);
        setError("");


        const user = getUser();


        if (!user?.id) {

          setError(
            "User information not found. " +
            "Please log in again."
          );

          return;
        }


        // ==================================
        // Fetch Course Recommendations
        // ==================================

        const courseResponse =
          await axios.get(
            `${API_URL}/api/courses/recommendations/${user.id}`
          );


        console.log(
          "Course Recommendations:",
          courseResponse.data
        );


        setCourses(
          courseResponse.data
            ?.recommendations || []
        );


        // ==================================
        // Fetch Learning Path
        // ==================================

        const pathResponse =
          await axios.get(
            `${API_URL}/api/courses/learning-path/${user.id}`
          );


        console.log(
          "Learning Path:",
          pathResponse.data
        );


        const pathData =
          pathResponse.data?.data || {};


        setLearningPath(
          pathData.learning_path || []
        );


        setCareer(
          pathData.career || ""
        );


        setCurrentSkills(
          pathResponse.data
            ?.learning_profile
            ?.current_skills || []
        );


        setTargetSkills(
          pathResponse.data
            ?.learning_profile
            ?.target_skills || []
        );


      } catch (err) {

        console.error(
          "Course Recommendation Error:",
          err
        );


        const message =
          err.response?.data?.detail ||
          "Unable to load course recommendations.";


        setError(message);

      } finally {

        setLoading(false);
      }

    },
    []
  );


  // ========================================
  // Initial Load
  // ========================================

  useEffect(() => {

    fetchCourseData();

  }, [fetchCourseData]);


  // ========================================
  // Open Course
  // ========================================

  const handleStartCourse = (
    courseUrl
  ) => {

    if (!courseUrl) {

      alert(
        "Course link is not available."
      );

      return;
    }


    window.open(
      courseUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };


  // ========================================
  // Loading
  // ========================================

  if (loading) {

    return (

      <div className="course-page">

        <div className="course-loading">

          <div className="course-spinner" />

          <h2>
            Building your learning plan...
          </h2>

          <p>
            Analyzing your skills and career
            recommendations.
          </p>

        </div>

      </div>
    );
  }


  // ========================================
  // Error
  // ========================================

  if (error) {

    return (

      <div className="course-page">

        <div className="course-error">

          <h2>
            Unable to Load Recommendations
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={fetchCourseData}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  // ========================================
  // UI
  // ========================================

  return (

    <div className="course-page">

  <Sidebar />

  <div className="course-content">

      {/* ===================================
          Header
      ==================================== */}

      <section className="course-header">

        <div>

          <span className="course-eyebrow">
            Personalized Learning
          </span>

          <h1>
            Course Recommendations
          </h1>

          <p>
            Courses and a learning path
            personalized from your resume
            skills and career recommendations.
          </p>

        </div>

      </section>


      {/* ===================================
          Learning Profile
      ==================================== */}

      <section className="learning-profile">

        <div className="profile-card">

          <span className="profile-label">
            Target Career
          </span>

          <h3>
            {career ||
              "Software Professional"}
          </h3>

        </div>


        <div className="profile-card">

          <span className="profile-label">
            Current Skills
          </span>

          <div className="skill-list">

            {currentSkills.length > 0 ? (

              currentSkills.map(
                (skill, index) => (

                  <span
                    className="skill-chip current"
                    key={`${skill}-${index}`}
                  >
                    {skill}
                  </span>

                )
              )

            ) : (

              <span className="empty-text">
                No skills available
              </span>

            )}

          </div>

        </div>


        <div className="profile-card">

          <span className="profile-label">
            Skills To Learn
          </span>

          <div className="skill-list">

            {targetSkills.length > 0 ? (

              targetSkills.map(
                (skill, index) => (

                  <span
                    className="skill-chip target"
                    key={`${skill}-${index}`}
                  >
                    {skill}
                  </span>

                )
              )

            ) : (

              <span className="empty-text">
                No target skills
              </span>

            )}

          </div>

        </div>

      </section>


      {/* ===================================
          Recommended Courses
      ==================================== */}

      <section className="course-section">

        <div className="section-heading">

          <div>

            <span className="section-number">
              01
            </span>

            <h2>
              Recommended Courses
            </h2>

          </div>

          <p>
            Courses ranked according to
            your current skills and skill gaps.
          </p>

        </div>


        <div className="course-grid">

          {courses.length > 0 ? (

            courses.map(
              (course, index) => (

                <article
                  className="course-card"
                  key={
                    course.course_id ||
                    `${course.title}-${index}`
                  }
                >

                  <div className="course-card-top">

                    <span className="course-rank">
                      #{index + 1}
                    </span>

                    <span className="match-badge">

                      {Math.round(
                        course.match_score || 0
                      )}
                      % Match

                    </span>

                  </div>


                  <h3>
                    {course.title}
                  </h3>


                  <div className="course-meta">

                    <span>
                      {course.provider ||
                        "Course Provider"}
                    </span>

                    <span>
                      {course.level ||
                        "All Levels"}
                    </span>

                  </div>


                  {course.category && (

                    <p className="course-category">
                      {course.category}
                    </p>

                  )}


                  <div className="course-skills">

                    {(
                      course.skills_to_learn ||
                      course.skills ||
                      []
                    )
                      .slice(0, 4)
                      .map(
                        (skill, skillIndex) => (

                          <span
                            key={
                              `${skill}-${skillIndex}`
                            }
                          >
                            {skill}
                          </span>

                        )
                      )}

                  </div>


                  <button
                    type="button"
                    className="start-course-btn"
                    onClick={() =>
                      handleStartCourse(
                        course.course_url
                      )
                    }
                  >
                    Start Course
                    <span>→</span>
                  </button>

                </article>

              )
            )

          ) : (

            <div className="empty-card">

              <h3>
                No courses found
              </h3>

              <p>
                Course recommendations are
                not available for the current
                skill profile.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* ===================================
          Learning Path
      ==================================== */}

      <section className="course-section path-section">

        <div className="section-heading">

          <div>

            <span className="section-number">
              02
            </span>

            <h2>
              Your Learning Path
            </h2>

          </div>

          <p>
            Follow these stages in order to
            build the skills needed for
            {career
              ? ` ${career}.`
              : " your target career."}
          </p>

        </div>


        <div className="learning-path">

          {learningPath.length > 0 ? (

            learningPath.map(
              (step, index) => {

                const recommendedCourse =
                  step.recommended_course;


                return (

                  <div
                    className="path-item"
                    key={
                      step.step ||
                      index
                    }
                  >

                    {/* Timeline */}

                    <div className="path-timeline">

                      <div className="step-circle">
                        {step.step ||
                          index + 1}
                      </div>

                      {index <
                        learningPath.length -
                          1 && (

                        <div className="path-line" />

                      )}

                    </div>


                    {/* Content */}

                    <div className="path-content">

                      <span className="path-step-label">
                        STEP{" "}
                        {step.step ||
                          index + 1}
                      </span>


                      <h3>
                        {step.title}
                      </h3>


                      <p className="path-goal">
                        {step.goal}
                      </p>


                      <div className="path-skills">

                        {(step.skills || [])
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
                          )}

                      </div>


                      {/* Recommended Course */}

                      {recommendedCourse ? (

                        <div className="path-course">

                          <div>

                            <span className="path-course-label">
                              Recommended Course
                            </span>

                            <h4>
                              {
                                recommendedCourse.title
                              }
                            </h4>

                            <p>

                              {recommendedCourse.provider ||
                                "Course Provider"}

                              {recommendedCourse.level
                                ? ` • ${recommendedCourse.level}`
                                : ""}

                            </p>

                          </div>


                          <div className="path-course-actions">

                            <span className="path-match">

                              {Math.round(
                                recommendedCourse
                                  .step_match_score ||
                                  0
                              )}
                              % Match

                            </span>


                            <button
                              type="button"
                              onClick={() =>
                                handleStartCourse(
                                  recommendedCourse
                                    .course_url
                                )
                              }
                            >
                              Start
                            </button>

                          </div>

                        </div>

                      ) : (

                        <div className="no-path-course">

                          No matching course is
                          currently available for
                          this step.

                        </div>

                      )}

                    </div>

                  </div>

                );

              }
            )

          ) : (

            <div className="empty-card">

              <h3>
                Learning path unavailable
              </h3>

              <p>
                No learning steps were generated
                for your current profile.
              </p>

            </div>

          )}

        </div>

      </section>

   </div>

</div>


  );
}