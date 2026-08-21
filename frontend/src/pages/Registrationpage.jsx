import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../styles/Registration.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function Registrationpage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      alert(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.role) {
      alert("Please select your role.");
      return;
    }

    if (!formData.terms) {
      alert("Please accept the Terms & Conditions.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/register",
        {
          fullName: formData.fullName,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          role: formData.role,
        }
      );

      console.log("Response:", response.data);

      alert(response.data.message);

      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);

        alert(
          error.response.data.detail ||
            error.response.data.message ||
            "Registration Failed"
        );
      } else {
        alert("Cannot connect to the server.");
      }
    }
  };

  return (
    <motion.form
      className="registration-form"
      onSubmit={handleSubmit}
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <h2>Create Your Account</h2>

      <p className="register-subtitle">
        Start your AI-powered career journey today.
      </p>

      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Mobile Number</label>
        <input
          type="tel"
          name="mobile"
          placeholder="Enter mobile number"
          value={formData.mobile}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create password"
            value={formData.password}
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

      <div className="form-group">
        <label>Confirm Password</label>

        <div className="password-field">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <span
            className="password-toggle"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className="form-group">
        <label>I am a</label>

        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="role"
              value="Student"
              checked={formData.role === "Student"}
              onChange={handleChange}
            />
            Student
          </label>

          <label>
            <input
              type="radio"
              name="role"
              value="Professional"
              checked={formData.role === "Professional"}
              onChange={handleChange}
            />
            Professional
          </label>

          <label>
            <input
              type="radio"
              name="role"
              value="Recruiter"
              checked={formData.role === "Recruiter"}
              onChange={handleChange}
            />
            Recruiter
          </label>
        </div>
      </div>

      <div className="checkbox-group">
        <input
          type="checkbox"
          name="terms"
          checked={formData.terms}
          onChange={handleChange}
        />

        <label>I agree to the Terms & Conditions</label>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Create Account
      </motion.button>

      <p className="login-text">
        Already have an account?

        <button
          type="button"
          className="login-btn"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </p>
    </motion.form>
  );
}