import {useNavigate} from "react-router-dom";
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Registrationpage from "./Registrationpage"
import "../styles/Registration.css"

export default function Registration() {
  

  return (  

<motion.div
className="register-page"
initial={{ opacity:0 }}
animate={{ opacity:1 }}
transition={{ duration:.8 }}
>

    {/* Left Section */}

    <motion.div
        className="register-left"
        initial={{ x:-80, opacity:0 }}
        animate={{ x:0, opacity:1 }}
        transition={{ duration:.8 }}
     >

        <img
        src="/Innovation-pana.svg"
        alt="Career Illustration"
        className="register-image"
        />

        <h1>Ascendra AI</h1>

        <p>

            Join thousands of learners and professionals
            using AI-powered career intelligence to discover
            better opportunities and build future-ready skills.

        </p>

    </motion.div>

    {/* Right Section */}

    <Registrationpage />

</motion.div>

);
}