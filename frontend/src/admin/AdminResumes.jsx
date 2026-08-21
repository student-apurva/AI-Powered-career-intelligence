import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaSearch,
  FaEye,
  FaFilePdf,
  FaFileAlt,
  FaTimes,
  FaSpinner,
  FaDownload
} from "react-icons/fa";

import AdminSidebar from "./AdminSidebar";
import "./AdminResumes.css";

const API_URL = "http://localhost:8000";

export default function AdminResumes() {

  const [resumes, setResumes] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedResume, setSelectedResume] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);


  // =====================================================
  // LOAD RESUMES
  // =====================================================

  useEffect(() => {

    loadResumes();

  }, []);


  const loadResumes = async () => {

    try {

      setLoading(true);

      setError("");

      const token =
        localStorage.getItem("adminToken")

      const response = await axios.get(
        `${API_URL}/api/admin/resumes`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      if (response.data?.success) {

        setResumes(
          response.data.resumes || []
        );

      }

    } catch (error) {

      console.error(
        "Resume loading error:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Unable to load resumes"
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredResumes =
    resumes.filter((resume) => {

      const text =
        search
          .toLowerCase()
          .trim();

      if (!text) {
        return true;
      }

      return (

        (resume.file_name || "")
          .toLowerCase()
          .includes(text)

        ||

        (resume.user_name || "")
          .toLowerCase()
          .includes(text)

        ||

        (resume.email || "")
          .toLowerCase()
          .includes(text)

      );

    });


  // =====================================================
  // VIEW RESUME DETAILS
  // =====================================================

  const handleViewResume = async (
    resumeId
  ) => {

    try {

      const token =
        localStorage.getItem("adminToken")

      const response = await axios.get(
        `${API_URL}/api/admin/resumes/${resumeId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      if (response.data?.success) {

        setSelectedResume(
          response.data.resume
        );

        setShowModal(true);

      }

    } catch (error) {

      console.error(
        "Resume details error:",
        error
      );

      alert(
        error.response?.data?.detail ||
        "Unable to load resume"
      );

    }

  };


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {

    setShowModal(false);

    setSelectedResume(null);

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


  return (

    <div className="admin-layout">

      <AdminSidebar />

      <main className="admin-main resumes-page">


        {/* HEADER */}

        <header className="resumes-header">

          <div>

            <h1>
              Resume Management
            </h1>

            <p>
              View and monitor uploaded resumes
            </p>

          </div>


          <div className="resumes-count">

            <FaFileAlt />

            <span>
              {resumes.length} Resumes
            </span>

          </div>

        </header>


        {/* SEARCH */}

        <section className="resumes-toolbar">

          <div className="resumes-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search by user, email or resume name..."
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


          <span className="resumes-result">

            Showing{" "}
            <strong>
              {filteredResumes.length}
            </strong>{" "}
            of{" "}
            <strong>
              {resumes.length}
            </strong>

          </span>

        </section>


        {/* ERROR */}

        {error && (

          <div className="resumes-error">

            {error}

          </div>

        )}


        {/* TABLE */}

        <section className="resumes-table-card">

          {loading ? (

            <div className="resumes-loading">

              <FaSpinner className="resume-spinner" />

              Loading resumes...

            </div>

          ) : filteredResumes.length === 0 ? (

            <div className="resumes-empty">

              <FaFileAlt />

              <h3>
                No resumes found
              </h3>

              <p>
                Uploaded resumes will appear here.
              </p>

            </div>

          ) : (

            <div className="resumes-table-wrapper">

              <table className="resumes-table">

                <thead>

                  <tr>

                    <th>Resume</th>

                    <th>User</th>

                    <th>Email</th>

                    <th>Uploaded</th>

                    <th>Actions</th>

                  </tr>

                </thead>


                <tbody>

                  {filteredResumes.map(
                    (resume) => (

                    <tr key={resume.id}>

                      <td>

                        <div className="resume-name">

                          <div className="resume-icon">

                            <FaFilePdf />

                          </div>

                          <div>

                            <strong>
                              {resume.file_name ||
                                "Resume"}
                            </strong>

                            <small>
                              PDF / Resume
                            </small>

                          </div>

                        </div>

                      </td>


                      <td>
                        {resume.user_name ||
                          "Unknown User"}
                      </td>


                      <td>
                        {resume.email || "—"}
                      </td>


                      <td>
  <span className={`resume-status ${(
    resume.status || "Uploaded"
  ).toLowerCase()}`}>
    {resume.status || "Uploaded"}
  </span>
</td>


                      <td>

                        <button
                          className="view-resume-btn"
                          onClick={() =>
                            handleViewResume(
                              resume.id
                            )
                          }
                        >

                          <FaEye />

                          View

                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {/* =================================================
            DETAILS MODAL
        ================================================= */}

        {showModal &&
          selectedResume && (

          <div
            className="resume-modal-overlay"
            onClick={closeModal}
          >

            <div
              className="resume-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="resume-modal-header">

                <div>

                  <h2>
                    Resume Details
                  </h2>

                  <p>
                    Uploaded resume information
                  </p>

                </div>


                <button
                  onClick={closeModal}
                  className="resume-modal-close"
                >
                  <FaTimes />
                </button>

              </div>


              <div className="resume-modal-content">

                <div className="resume-large-icon">

                  <FaFilePdf />

                </div>


                <h3>
                  {selectedResume.file_name ||
                    "Resume"}
                </h3>


                <div className="resume-info-grid">

                  <div>

                    <label>
                      User ID
                    </label>

                    <p>
                      {selectedResume.user_id ||
                        "—"}
                    </p>

                  </div>


                  <div>

                    <label>
                      Uploaded
                    </label>

                    <p>
                      {formatDate(
                        selectedResume.created_at
                      )}
                    </p>

                  </div>

                </div>


                {/* Parsed Data */}

                {selectedResume.parsed_data && (

                  <div className="parsed-resume">

                    <h3>
                      Parsed Resume Information
                    </h3>


                    {selectedResume.parsed_data.name && (

                      <div className="parsed-item">

                        <strong>
                          Name
                        </strong>

                        <span>
                          {selectedResume.parsed_data.name}
                        </span>

                      </div>

                    )}


                    {selectedResume.parsed_data.email && (

                      <div className="parsed-item">

                        <strong>
                          Email
                        </strong>

                        <span>
                          {selectedResume.parsed_data.email}
                        </span>

                      </div>

                    )}


                    {Array.isArray(
                      selectedResume.parsed_data.skills
                    ) && (

                      <div className="parsed-item">

                        <strong>
                          Skills
                        </strong>

                        <span>
                          {selectedResume.parsed_data.skills.join(
                            ", "
                          )}
                        </span>

                      </div>

                    )}

                  </div>

                )}


                {/* File */}

                {selectedResume.file_path && (

                  <a
                    href={`${API_URL}/${selectedResume.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="open-resume-btn"
                  >

                    <FaEye />

                    Open Resume

                  </a>

                )}

              </div>

            </div>

          </div>

        )}

      </main>

    </div>

  );
}