import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaBook,
  FaSearch,
  FaSpinner,
  FaTimes,
  FaGraduationCap,
} from "react-icons/fa";

import AdminSidebar from "./AdminSidebar";
import "./AdminCourses.css";

const API_URL = "http://localhost:8000";

export default function AdminCourses() {

  const [data, setData] = useState({
    total: 0,
    courses: [],
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    loadCourses();
  }, []);


  const loadCourses = async () => {

    try {

      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("adminToken")

      const response = await axios.get(
        `${API_URL}/api/admin/courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {

        setData({
          total:
            response.data.total || 0,

          courses:
            response.data.courses || [],
        });

      }

    } catch (err) {

      console.error(
        "Course loading error:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to load courses"
      );

    } finally {

      setLoading(false);

    }

  };


  const filteredCourses =
    (data.courses || []).filter(
      (course) => {

        const text =
          search.toLowerCase().trim();

        if (!text) {
          return true;
        }

        return (

          String(
            course.name ||
            course.title ||
            ""
          )
            .toLowerCase()
            .includes(text)

          ||

          String(
            course.category ||
            ""
          )
            .toLowerCase()
            .includes(text)

        );

      }
    );


  if (loading) {

    return (

      <div className="admin-layout">

        <AdminSidebar />

        <main className="admin-main">

          <div className="courses-loading">

            <FaSpinner />

            Loading courses...

          </div>

        </main>

      </div>

    );

  }


  return (

    <div className="admin-layout">

      <AdminSidebar />

      <main className="admin-main admin-courses-page">


        {/* HEADER */}

        <header className="courses-header">

          <div>

            <h1>
              Course Management
            </h1>

            <p>
              Manage recommended learning courses
            </p>

          </div>

          <div className="courses-header-icon">
            <FaBook />
          </div>

        </header>


        {/* ERROR */}

        {error && (

          <div className="courses-error">
            {error}
          </div>

        )}


        {/* STAT */}

        <section className="courses-stats">

          <div className="course-stat-card">

            <div className="course-stat-icon">
              <FaBook />
            </div>

            <div>

              <span>
                Total Courses
              </span>

              <h2>
                {data.total || 0}
              </h2>

            </div>

          </div>

        </section>


        {/* SEARCH */}

        <section className="courses-toolbar">

          <div className="courses-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search courses..."
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
              {filteredCourses.length}
            </strong>{" "}
            courses
          </span>

        </section>


        {/* COURSES */}

        <section className="courses-panel">

          {filteredCourses.length === 0 ? (

            <div className="courses-empty">

              <FaGraduationCap />

              <h3>
                No courses found
              </h3>

              <p>
                Recommended courses will appear here.
              </p>

            </div>

          ) : (

            <div className="courses-grid">

              {filteredCourses.map(
                (course, index) => {

                const name =
                  course.name ||
                  course.title ||
                  "Course";

                return (

                  <div
                    className="course-card"
                    key={
                      course.id ||
                      course._id ||
                      index
                    }
                  >

                    <div className="course-card-icon">
                      <FaBook />
                    </div>

                    <div>

                      <h3>
                        {name}
                      </h3>

                      <p>
                        {course.category ||
                          "Learning Course"}
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