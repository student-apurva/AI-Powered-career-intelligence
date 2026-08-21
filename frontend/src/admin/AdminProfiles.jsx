import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaEye,
  FaTimes,
  FaUserCircle,
  FaSpinner
} from "react-icons/fa";

import AdminSidebar from "./AdminSidebar";
import "./AdminProfiles.css";

const API_URL = "http://localhost:8000";

export default function AdminProfiles() {

  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProfile, setSelectedProfile] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);


  // =====================================================
  // LOAD PROFILES
  // =====================================================

  useEffect(() => {
    loadProfiles();
  }, []);


  const loadProfiles = async () => {

    try {

      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("adminToken")

      const response = await axios.get(
        `${API_URL}/api/admin/profiles`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      if (response.data?.success) {

        setProfiles(
          response.data.profiles || []
        );

      }

    } catch (error) {

      console.error(
        "Profiles loading error:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Unable to load profiles"
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredProfiles =
    profiles.filter((profile) => {

      const searchText =
        search.toLowerCase().trim();

      if (!searchText) {
        return true;
      }

      const skills = Array.isArray(
        profile.skills
      )
        ? profile.skills.join(" ")
        : profile.skills || "";

      return (

        (profile.name || "")
          .toLowerCase()
          .includes(searchText)

        ||

        (profile.email || "")
          .toLowerCase()
          .includes(searchText)

        ||

        (profile.careerInterest || "")
          .toLowerCase()
          .includes(searchText)

        ||

        skills
          .toLowerCase()
          .includes(searchText)

      );

    });


  // =====================================================
  // VIEW PROFILE
  // =====================================================

  const handleViewProfile = async (
    profileId
  ) => {

    try {

      const token =
        localStorage.getItem("adminToken")

      const response = await axios.get(
        `${API_URL}/api/admin/profiles/${profileId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      if (response.data?.success) {

        setSelectedProfile(
          response.data.profile
        );

        setShowModal(true);

      }

    } catch (error) {

      console.error(
        "Profile details error:",
        error
      );

      alert(
        error.response?.data?.detail ||
        "Unable to load profile details"
      );

    }

  };


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {

    setShowModal(false);

    setSelectedProfile(null);

  };


  // =====================================================
  // FORMAT SKILLS
  // =====================================================

  const formatSkills = (skills) => {

    if (!skills) {
      return "—";
    }

    if (Array.isArray(skills)) {

      return skills.length
        ? skills.join(", ")
        : "—";

    }

    return skills;

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="admin-layout">

      <AdminSidebar />

      <main className="admin-main profiles-page">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="profiles-header">

          <div>

            <h1>
              Profile Management
            </h1>

            <p>
              View and monitor user career profiles
            </p>

          </div>


          <div className="profiles-count">

            <FaUserCircle />

            <span>
              {profiles.length} Profiles
            </span>

          </div>

        </header>


        {/* =================================================
            SEARCH
        ================================================= */}

        <section className="profiles-toolbar">

          <div className="profiles-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search by name, email, career or skill..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (

              <button
                className="profile-clear-btn"
                onClick={() =>
                  setSearch("")
                }
              >
                <FaTimes />
              </button>

            )}

          </div>


          <div className="profiles-result-count">

            Showing{" "}
            <strong>
              {filteredProfiles.length}
            </strong>{" "}
            of{" "}
            <strong>
              {profiles.length}
            </strong>

          </div>

        </section>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="profiles-error">

            {error}

          </div>

        )}


        {/* =================================================
            TABLE
        ================================================= */}

        <section className="profiles-table-card">

          {loading ? (

            <div className="profiles-loading">

              <FaSpinner className="profiles-spinner" />

              <span>
                Loading profiles...
              </span>

            </div>

          ) : filteredProfiles.length === 0 ? (

            <div className="profiles-empty">

              <FaUserCircle />

              <h3>
                No profiles found
              </h3>

              <p>
                Try changing your search.
              </p>

            </div>

          ) : (

            <div className="profiles-table-wrapper">

              <table className="profiles-table">

                <thead>

                  <tr>

                    <th>Profile</th>

                    <th>Email</th>

                    <th>Career Interest</th>

                    <th>Skills</th>

                    <th>Education</th>

                    <th>Action</th>

                  </tr>

                </thead>


                <tbody>

                  {filteredProfiles.map(
                    (profile) => (

                    <tr key={profile.id}>

                      {/* Profile */}

                      <td>

                        <div className="profile-user-cell">

                          <div className="profile-avatar">

                            {(profile.name || "U")
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <div>

                            <strong>
                              {profile.name ||
                                "Unknown User"}
                            </strong>

                            <small>
                              ID: {profile.id}
                            </small>

                          </div>

                        </div>

                      </td>


                      {/* Email */}

                      <td>
                        {profile.email || "—"}
                      </td>


                      {/* Career */}

                      <td>

                        <span className="career-badge">

                          {profile.careerInterest ||
                            profile.career_interest ||
                            "Not specified"}

                        </span>

                      </td>


                      {/* Skills */}

                      <td>

                        <div className="profile-skills">

                          {Array.isArray(
                            profile.skills
                          )

                            ? profile.skills
                                .slice(0, 3)
                                .map(
                                  (skill, index) => (

                                    <span
                                      key={index}
                                    >
                                      {skill}
                                    </span>

                                  )
                                )

                            : (

                              <span>
                                {profile.skills ||
                                  "—"}
                              </span>

                            )}

                          {Array.isArray(
                            profile.skills
                          ) &&
                            profile.skills.length >
                              3 && (

                              <small>
                                +
                                {profile.skills.length - 3}
                              </small>

                            )}

                        </div>

                      </td>


                      {/* Education */}

                      <td>

                        {profile.education
                          ? Array.isArray(
                              profile.education
                            )
                            ? profile.education
                                .map(
                                  (edu) =>
                                    typeof edu ===
                                    "string"
                                      ? edu
                                      : edu.degree ||
                                        edu.course ||
                                        ""
                                )
                                .filter(Boolean)
                                .slice(0, 1)
                                .join(", ")
                            : typeof profile.education ===
                              "object"
                            ? profile.education.degree ||
                              profile.education.course ||
                              "—"
                            : profile.education
                          : "—"}

                      </td>


                      {/* Action */}

                      <td>

                        <button
                          className="view-profile-btn"
                          onClick={() =>
                            handleViewProfile(
                              profile.id
                            )
                          }
                          title="View Profile"
                        >
                          <FaEye />

                          <span>
                            View
                          </span>

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
            PROFILE DETAILS MODAL
        ================================================= */}

        {showModal &&
          selectedProfile && (

          <div
            className="profile-modal-overlay"
            onClick={closeModal}
          >

            <div
              className="profile-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >


              {/* Modal Header */}

              <div className="profile-modal-header">

                <div>

                  <h2>
                    Profile Details
                  </h2>

                  <p>
                    Complete career profile
                  </p>

                </div>


                <button
                  className="profile-modal-close"
                  onClick={closeModal}
                >
                  <FaTimes />
                </button>

              </div>


              {/* Profile Header */}

              <div className="profile-modal-user">

                <div className="profile-modal-avatar">

                  {(selectedProfile.name ||
                    "U")
                    .charAt(0)
                    .toUpperCase()}

                </div>

                <div>

                  <h3>
                    {selectedProfile.name ||
                      "Unknown User"}
                  </h3>

                  <p>
                    {selectedProfile.email ||
                      "No email"}
                  </p>

                </div>

              </div>


              {/* Details */}

              <div className="profile-details-grid">


                <div className="profile-detail-box">

                  <label>
                    Email
                  </label>

                  <p>
                    {selectedProfile.email ||
                      "—"}
                  </p>

                </div>


                <div className="profile-detail-box">

                  <label>
                    Phone
                  </label>

                  <p>
                    {selectedProfile.phone ||
                      selectedProfile.mobile ||
                      "—"}
                  </p>

                </div>


                <div className="profile-detail-box">

                  <label>
                    Career Interest
                  </label>

                  <p>
                    {selectedProfile.careerInterest ||
                      selectedProfile.career_interest ||
                      "Not specified"}
                  </p>

                </div>


                <div className="profile-detail-box">

                  <label>
                    Location
                  </label>

                  <p>
                    {selectedProfile.location ||
                      "—"}
                  </p>

                </div>


                {/* Skills */}

                <div className="profile-detail-box full-width">

                  <label>
                    Skills
                  </label>

                  <div className="modal-skills">

                    {Array.isArray(
                      selectedProfile.skills
                    )

                      ? selectedProfile.skills.map(
                          (skill, index) => (

                            <span
                              key={index}
                            >
                              {skill}
                            </span>

                          )
                        )

                      : (

                        <p>
                          {selectedProfile.skills ||
                            "No skills added"}
                        </p>

                      )}

                  </div>

                </div>


                {/* Education */}

                <div className="profile-detail-box full-width">

                  <label>
                    Education
                  </label>

                  <p>

                    {selectedProfile.education
                      ? typeof selectedProfile.education ===
                        "object"

                        ? JSON.stringify(
                            selectedProfile.education
                          )

                        : Array.isArray(
                            selectedProfile.education
                          )

                        ? selectedProfile.education
                            .map(
                              (edu) =>
                                typeof edu ===
                                "string"
                                  ? edu
                                  : edu.degree ||
                                    edu.course ||
                                    JSON.stringify(
                                      edu
                                    )
                            )
                            .join(" | ")

                        : selectedProfile.education

                      : "No education information"}

                  </p>

                </div>


                {/* Experience */}

                <div className="profile-detail-box full-width">

                  <label>
                    Experience
                  </label>

                  <p>

                    {selectedProfile.experience
                      ? typeof selectedProfile.experience ===
                        "object"

                        ? JSON.stringify(
                            selectedProfile.experience
                          )

                        : selectedProfile.experience

                      : "No experience information"}

                  </p>

                </div>


              </div>

            </div>

          </div>

        )}

      </main>

    </div>

  );
}