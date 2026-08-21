import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaEye,
  FaTrash,
  FaUsers,
  FaTimes,
  FaSpinner
} from "react-icons/fa";

import AdminSidebar from "./AdminSidebar";
import "./AdminUsers.css";

const API_URL = "http://localhost:8000";

export default function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // =====================================================
  // LOAD USERS
  // =====================================================

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {

    try {

      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("adminToken")

      const response = await axios.get(
        `${API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data?.success) {

        setUsers(
          response.data.users || []
        );

      }

    } catch (error) {

      console.error(
        "Users loading error:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Unable to load users"
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredUsers = users.filter((user) => {

    const searchText =
      search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (

      (user.fullName || "")
  .toLowerCase()
  .includes(searchText)

      ||

      (user.email || "")
        .toLowerCase()
        .includes(searchText)

      ||

      (user.mobile || "")
        .toLowerCase()
        .includes(searchText)

      ||

      (user.role || "")
        .toLowerCase()
        .includes(searchText)

    );

  });


  // =====================================================
  // VIEW USER
  // =====================================================

  const handleViewUser = async (userId) => {

    try {

      const token =
        localStorage.getItem("adminToken")

      const response = await axios.get(
        `${API_URL}/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data?.success) {

        setSelectedUser(
          response.data.user
        );

        setShowModal(true);

      }

    } catch (error) {

      console.error(
        "User details error:",
        error
      );

      alert(
        error.response?.data?.detail ||
        "Unable to load user details"
      );

    }

  };


  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDeleteUser = async (userId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {

      const token =
        localStorage.getItem("adminToken")

      await axios.delete(
        `${API_URL}/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) =>
            user.id !== userId
        )
      );

      if (
        selectedUser?.id === userId
      ) {

        setSelectedUser(null);
        setShowModal(false);

      }

    } catch (error) {

      console.error(
        "Delete user error:",
        error
      );

      alert(
        error.response?.data?.detail ||
        "Unable to delete user"
      );

    }

  };


  return (

    <div className="admin-layout">

      <AdminSidebar />

      <main className="admin-main users-page">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="users-header">

          <div>

            <h1>
              User Management
            </h1>

            <p>
              View and manage registered users
            </p>

          </div>

          <div className="users-count">

            <FaUsers />

            <span>
              {users.length} Users
            </span>

          </div>

        </header>


        {/* =================================================
            SEARCH
        ================================================= */}

        <section className="users-toolbar">

          <div className="users-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search by name, email, mobile or role..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (

              <button
                onClick={() => setSearch("")}
                className="clear-search"
              >
                <FaTimes />
              </button>

            )}

          </div>

          <div className="users-result-count">

            Showing{" "}
            <strong>
              {filteredUsers.length}
            </strong>{" "}
            of{" "}
            <strong>
              {users.length}
            </strong>{" "}
            users

          </div>

        </section>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="users-error">
            {error}
          </div>

        )}


        {/* =================================================
            TABLE
        ================================================= */}

        <section className="users-table-card">

          {loading ? (

            <div className="users-loading">

              <FaSpinner className="spinner" />

              <span>
                Loading users...
              </span>

            </div>

          ) : filteredUsers.length === 0 ? (

            <div className="users-empty">

              <FaUsers />

              <h3>
                No users found
              </h3>

              <p>
                Try changing your search.
              </p>

            </div>

          ) : (

            <div className="table-wrapper">

              <table className="users-table">

                <thead>

                  <tr>

                    <th>User</th>

                    <th>Email</th>

                    <th>Mobile</th>

                    <th>Role</th>

                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {filteredUsers.map(
                    (user) => (

                    <tr key={user.id}>

                      {/* User */}

                      <td>

                        <div className="user-cell">

                          <div className="user-avatar">

                            {(user.fullName || "U")
  .charAt(0)
  .toUpperCase()}

                          </div>

                          <div>

                            <strong>
                              {user.fullName || "Unknown User"}
                            </strong>

                            <small>
                              ID: {user.id}
                            </small>

                          </div>

                        </div>

                      </td>


                      {/* Email */}

                      <td>
                        {user.email || "—"}
                      </td>


                      {/* Mobile */}

                      <td>
                        {user.mobile || "—"}
                      </td>


                      {/* Role */}

                      <td>

                        <span
                          className={`role-badge ${
                            (user.role || "Student")
                              .toLowerCase()
                          }`}
                        >
                          {user.role || "Student"}
                        </span>

                      </td>


                      {/* Actions */}

                      <td>

                        <div className="user-actions">

                          <button
                            className="view-user-btn"
                            onClick={() =>
                              handleViewUser(user.id)
                            }
                            title="View User"
                          >
                            <FaEye />
                          </button>

                          <button
                            className="delete-user-btn"
                            onClick={() =>
                              handleDeleteUser(user.id)
                            }
                            title="Delete User"
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {/* =================================================
            USER DETAILS MODAL
        ================================================= */}

        {showModal && selectedUser && (

          <div
            className="user-modal-overlay"
            onClick={() => {
              setShowModal(false);
              setSelectedUser(null);
            }}
          >

            <div
              className="user-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="user-modal-header">

                <div>

                  <h2>
                    User Details
                  </h2>

                  <p>
                    Registered user information
                  </p>

                </div>

                <button
                  className="modal-close"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedUser(null);
                  }}
                >
                  <FaTimes />
                </button>

              </div>


              <div className="user-modal-profile">

                <div className="modal-avatar">

                  {(selectedUser.fullName || "U")
                    .charAt(0)
                    .toUpperCase()}

                </div>

                <div>

                  <h3>
                    {selectedUser.fullName ||
                      "Unknown User"}
                  </h3>

                  <span>
                    {selectedUser.role ||
                      "Student"}
                  </span>

                </div>

              </div>


              <div className="user-details-grid">

                <div className="detail-item">

                  <label>
                    Full Name
                  </label>

                  <p>
                    {selectedUser.fullName || "—"}
                  </p>

                </div>


                <div className="detail-item">

                  <label>
                    Email
                  </label>

                  <p>
                    {selectedUser.email || "—"}
                  </p>

                </div>


                <div className="detail-item">

                  <label>
                    Mobile
                  </label>

                  <p>
                    {selectedUser.mobile || "—"}
                  </p>

                </div>


                <div className="detail-item">

                  <label>
                    Role
                  </label>

                  <p>
                    {selectedUser.role || "Student"}
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