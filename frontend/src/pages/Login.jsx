import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Login.css";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Login
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // ==============================
    // Login Request
    // ==============================
    const response = await axios.post(
      "http://127.0.0.1:8000/api/users/login",
      {
        email: loginData.email,
        password: loginData.password,
      }
    );

    console.log("Login Success:", response.data);
    console.log("User From Backend:", response.data.user);

    // ==============================
    // Get Token and User
    // ==============================
    const token = response.data.token;
    const user = response.data.user;

    // ==============================
    // Validate Response
    // ==============================
    if (!token) {
      alert("Login token was not received from server.");
      return;
    }

    if (!user) {
      alert("User information was not received from server.");
      return;
    }

    // Support id or _id
    const userId = user.id || user._id;

    if (!userId) {
      console.error(
        "MongoDB user ID is missing from login response:",
        user
      );

      alert(
        "User ID was not received from the server. Please check the backend login response."
      );

      return;
    }

    // ==============================
    // Create User Object
    // ==============================
    const userData = {
      id: userId,
      fullName: user.fullName || "",
      email: user.email || "",
      mobile: user.mobile || "",
      role: user.role || "Student",
    };

    // ==============================
    // Save Login Information
    // ==============================
    localStorage.setItem("token", token);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    console.log("Saved User:", userData);
    console.log("Saved User ID:", userId);

    // ==============================
    // Success
    // ==============================
    alert(response.data.message || "Login Successful");

    navigate("/profile");

  } catch (error) {
    console.error("Login Error:", error);

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);

      alert(
        error.response.data?.detail ||
        error.response.data?.message ||
        "Login Failed"
      );
    } else {
      alert("Cannot connect to the server.");
    }
  }
};

  return (
    <motion.div
      className="login-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Left Section */}
      <motion.div
        className="login-left"
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src="/career.svg"
          alt="Career"
          className="login-image"
        />

        <h1>Ascendra AI</h1>

        <p>
          Unlock career insights powered by Artificial Intelligence
          and accelerate your professional journey.
        </p>
      </motion.div>

      {/* Right Section */}
      <motion.form
        className="login-form"
        onSubmit={handleSubmit}
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
        }}
      >
        <h2>Welcome Back</h2>

        <p className="login-subtitle">
          Sign in to continue your career journey.
        </p>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={loginData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleChange}
              required
            />

            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/* Login Button */}
        <motion.button
          className="lgn-btn"
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>

        {/* Register */}
        <p className="register-text">
          Don't have an account?

          <button
            type="button"
            className="register-btn"
            onClick={() => navigate("/registration")}
          >
            Register
          </button>
        </p>
      </motion.form>
    </motion.div>
  );
}