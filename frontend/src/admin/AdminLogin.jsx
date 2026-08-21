import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./AdminLogin.css";

const API_URL = "http://localhost:8000";

export default function AdminLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/admin/login`,
        {
          email,
          password
        }
      );

      if (response.data?.success) {

        // Save Admin JWT
        localStorage.setItem(
          "adminToken",
          response.data.token
        );

        // Save Admin information
        if (response.data.admin) {
          localStorage.setItem(
            "admin",
            JSON.stringify(
              response.data.admin
            )
          );
        }

        // Go to Admin Dashboard
        navigate("/admin/dashboard");

      } else {

        setError(
          response.data?.message ||
          "Admin login failed."
        );

      }

    } catch (err) {

      console.error(
        "Admin login error:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Invalid admin credentials."
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-header">

          <div className="admin-login-icon">
            🔐
          </div>

          <h1>
            Admin Login
          </h1>

          <p>
            Sign in to access the Admin Dashboard
          </p>

        </div>


        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}


        <form onSubmit={handleLogin}>

          <div className="admin-form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          <div className="admin-form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>


          <button
            type="submit"
            disabled={loading}
            className="admin-login-button"
          >

            {loading
              ? "Signing in..."
              : "Login as Admin"
            }

          </button>

        </form>

      </div>

    </div>

  );
}