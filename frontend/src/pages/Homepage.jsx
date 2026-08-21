// import React, { useState } from "react";
// import "../styles/Homepage.css";

// import { motion, useScroll } from "framer-motion";
// import Registrationpage from "./Registrationpage";
// import { Link } from "react-router-dom";

// /**
//  * AscendraLanding.jsx
//  * Pairs with AscendraLanding.css (put both files in the same folder).
//  * No external UI libraries required — icons are inline SVG so this
//  * drops into any React project with zero extra dependencies.
//  *
//  * Usage:
//  *   import AscendraLanding from "./AscendraLanding";
//  *   export default function App() { return <AscendraLanding />; }
//  */

// /* ---------------------------- Inline icon set ---------------------------- */

// const Icon = {
//   Compass: (p) => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
//       <circle cx="12" cy="12" r="10" />
//       <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
//     </svg>
//   ),
//   Shield: (p) => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
//       <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3Z" />
//     </svg>
//   ),
//   Bolt: (p) => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
//       <polygon points="13 2 3 14 11 14 9 22 21 10 13 10 13 2" />
//     </svg>
//   ),
//   FileScan: (p) => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
//       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//       <path d="M14 2v6h6" />
//       <circle cx="11" cy="15" r="2" />
//       <path d="m14.5 18-1.6-1.6" />
//     </svg>
//   ),
//   Target: (p) => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
//       <circle cx="12" cy="12" r="9" />
//       <circle cx="12" cy="12" r="5" />
//       <circle cx="12" cy="12" r="1" />
//     </svg>
//   ),
//   Radar: (p) => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
//       <path d="M12 2a10 10 0 1 0 10 10" />
//       <path d="M12 12 12 2" />
//       <circle cx="12" cy="12" r="3" />
//     </svg>
//   ),
//   Path: (p) => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
//       <circle cx="6" cy="6" r="2.5" />
//       <circle cx="18" cy="18" r="2.5" />
//       <circle cx="18" cy="6" r="2.5" />
//       <path d="M8.2 6h7.6M17 8.2 8.7 16.5" />
//     </svg>
//   ),
//   Arrow: (p) => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
//       <path d="M5 12h14M13 6l6 6-6 6" />
//     </svg>
//   ),
//   Star: (p) => (
//     <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
//       <polygon points="12 2 15.09 8.63 22 9.24 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.24 8.91 8.63 12 2" />
//     </svg>
//   ),
//   Quote: (p) => (
//     <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
//       <path d="M9.5 7C6.5 7 4 9.5 4 12.5S6.5 18 9.5 18c.4 0 .8 0 1.1-.1-.6 1.7-2.1 3-4 3.4v2c3.7-.5 6.5-3.6 6.5-7.4V12c0-2.8-2-5-4.6-5Zm10 0c-3 0-5.5 2.5-5.5 5.5S16.5 18 19.5 18c.4 0 .8 0 1.1-.1-.6 1.7-2.1 3-4 3.4v2c3.7-.5 6.5-3.6 6.5-7.4V12c0-2.8-2-5-4.6-5Z" />
//     </svg>
//   ),
//   Twitter: (p) => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
//       <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.3 1.7-2.3-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.9 3.7A11.4 11.4 0 0 1 3.5 4.6a4 4 0 0 0 1.2 5.4c-.6 0-1.2-.2-1.7-.5v.1a4 4 0 0 0 3.2 4 4 4 0 0 1-1.8.1 4 4 0 0 0 3.8 2.8A8 8 0 0 1 2 18.6a11.3 11.3 0 0 0 6.3 1.9c7.5 0 11.7-6.4 11.7-11.9v-.5c.8-.6 1.5-1.3 2-2.2Z" />
//     </svg>
//   ),
//   Linkedin: (p) => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
//       <rect x="3" y="3" width="18" height="18" rx="2" />
//       <path d="M7.5 10.5v6M7.5 7.5v.01M12 16.5v-3.7c0-1.4 1-2.3 2.2-2.3s2.3 1 2.3 2.4v3.6" />
//     </svg>
//   ),
//   Youtube: (p) => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
//       <rect x="2.5" y="6" width="19" height="12" rx="3" />
//       <polygon points="10.5 9.5 15 12 10.5 14.5" fill="currentColor" stroke="none" />
//     </svg>
//   ),
// };

// /* ------------------------------- Data ------------------------------- */

// const FEATURES = [
//   {
//     icon: Icon.FileScan,
//     title: "Resume analysis",
//     desc: "AI scans your resume line by line, scores impact and clarity, and rewrites weak bullet points into recruiter-ready wins.",
//   },
//   {
//     icon: Icon.Target,
//     title: "Job match scoring",
//     desc: "Every role gets a 0–100 fit score against your profile, so you apply where you truly stand out instead of guessing.",
//   },
//   {
//     icon: Icon.Radar,
//     title: "Skill gap detection",
//     desc: "See the exact skills separating you from your target role, ranked by impact, with courses matched to close each gap.",
//   },
//   {
//     icon: Icon.Path,
//     title: "Career path mapping",
//     desc: "Visualize realistic next roles, salary ranges, and the milestones to reach them — a living map of your career.",
//   },
// ];

// const STEPS = [
//   {
//     n: 1,
//     title: "Connect your profile",
//     desc: "Link your LinkedIn or paste your experience. Setup takes under two minutes — no uploads required.",
//   },
//   {
//     n: 2,
//     title: "Get AI insights",
//     desc: "Ascendra scores your matches, flags skill gaps, and maps career paths tailored to your goals.",
//   },
//   {
//     n: 3,
//     title: "Take action",
//     desc: "Follow a prioritized plan — apply smarter, upskill faster, and track your momentum week over week.",
//   },
// ];

// const TESTIMONIALS = [
//   {
//     quote:
//       "Ascendra showed me I was a 91% match for roles I'd been ignoring. I landed a senior offer six weeks later.",
//     name: "Marcus Reed",
//     role: "Senior Product Manager",
//     initials: "MR",
//   },
//   {
//     quote:
//       "The skill gap map was a wake-up call. Three targeted courses later, I finally broke into data engineering.",
//     name: "Priya Nair",
//     role: "Data Engineer",
//     initials: "PN",
//   },
//   {
//     quote:
//       "I stopped applying blindly. The match scores told me exactly where to focus and my callback rate tripled.",
//     name: "Diego Alvarez",
//     role: "Operations Lead",
//     initials: "DA",
//   },
// ];
// const fadeUp = {
//   hidden: {
//     opacity: 0,
//     y: 60,
//   },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.7,
//     },
//   },
// };

// const fadeLeft = {
//   hidden: {
//     opacity: 0,
//     x: -80,
//   },
//   visible: {
//     opacity: 1,
//     x: 0,
//     transition: {
//       duration: 0.8,
//     },
//   },
// };

// const fadeRight = {
//   hidden: {
//     opacity: 0,
//     x: 80,
//   },
//   visible: {
//     opacity: 1,
//     x: 0,
//     transition: {
//       duration: 0.8,
//     },
//   },
// };

// const zoomIn = {
//   hidden: {
//     opacity: 0,
//     y: 50,
//     scale: 0.9,
//   },

//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: {
//       duration: 0.6,
//       ease: "easeOut",
//     },
//   },
// };
// const container = {
//   hidden: {},

//   visible: {
//     transition: {
//       staggerChildren: 0.15,
//       delayChildren: 0.2,
//     },
//   },
// };

// /* ------------------------------ Component ------------------------------ */

// export default function AscendraLanding() {
//   const [form, setForm] = useState({ name: "", email: "", agree: false });
//   const [submitted, setSubmitted] = useState(false);

//   function handleSubmit(e) {
//     e.preventDefault();
//     if (!form.name || !form.email || !form.agree) return;
//     setSubmitted(true);
//   }
//   const { scrollYProgress } = useScroll()
//   const [showAdminMenu, setShowAdminMenu] = useState(false);
//   return (
//     <div className="asc">
    
//       {/* ---------- Nav ---------- */}
//       <header className="asc-nav">
//         <div className="asc-container asc-nav-inner">
//           <div className="asc-logo">
//             <span className="asc-logo-mark">
//               <Icon.Compass className="asc-icon" />
//             </span>
//             <span>
//               Ascendra <b>AI</b>
//             </span>
//           </div>
//           <nav className="asc-nav-links">
//             <a href="#features">Features</a>
//             <a href="#how-it-works">How it works</a>
//             <a href="#results">Results</a>
//             <a href="#get-started">Get started</a>
//           </nav>
//           <a href="/login" className="asc-btn asc-btn-primary asc-nav-cta">
//             Get started
//           </a>

//           <div className="admin-menu-wrapper">

//   <button
//     className="admin-menu-button"
//     onClick={() =>
//       setShowAdminMenu(!showAdminMenu)
//     }
//     aria-label="Admin menu"
//   >
//     ⋮
//   </button>

//   {showAdminMenu && (
//     <div className="admin-dropdown">

//       <Link
//         to="/admin/login"
//         onClick={() => setShowAdminMenu(false)}
//       >
//         🔐 Admin Login
//       </Link>

//     </div>
//   )}

// </div>  
//         </div>
//       </header>

//       {/* ---------- Hero ---------- */}
//       {/* ---------- Hero ---------- */}

// <section className="asc-hero">

//   <div className="asc-container asc-hero-grid">

//     {/* Left Content */}

//     <motion.div
//       className="asc-hero-content"
//       variants={fadeLeft}
//       initial="hidden"
//       animate="visible"
//       transition={{ duration: 0.8 }}
//     >

//       <span className="asc-pill">
//         <Icon.Bolt className="asc-pill-icon" />
//         AI CAREER INTELLIGENCE
//       </span>

//       <h1 className="asc-h1">
//         Know your next
//         <br />
//         <span className="asc-gradient-text">
//           career move
//         </span>
//         <br />
//         before you make it.
//       </h1>

//       <p className="asc-lede">
//         Ascendra AI analyzes your experience, scores every job match,
//         identifies skill gaps, and creates a personalized roadmap so
//         you can grow your career with confidence.
//       </p>

//       <div className="asc-btn-group">

//         <a
//           href="#get-started"
//           className="asc-btn asc-btn-primary asc-btn-lg"
//         >
//           Start Free Analysis

//           <Icon.Arrow className="asc-btn-arrow" />

//         </a>

//       </div>

//       <div className="asc-trust-row">

//         <span>

//           <Icon.Shield className="asc-trust-icon" />

//           No Resume Upload Required

//         </span>

//         <span>

//           <Icon.Bolt className="asc-trust-icon" />

//           AI Insights in 2 Minutes

//         </span>

//       </div>

//     </motion.div>

//     {/* Right Dashboard */}

//     <motion.div
//       className="asc-hero-art"
//       variants={fadeRight}
//       initial="hidden"
//       animate="visible"
//       transition={{ duration: 0.8 }}
//     >

//       <div className="asc-dashboard">

//         <div className="asc-dashboard-header">

//           <h4>Career Analytics</h4>

//           <span className="asc-live-badge">
//             ● Live
//           </span>

//         </div>

//         <div className="asc-dashboard-grid">

//           <div className="asc-chart">

//             {[40,65,90,70,55,35,60,80,45,30].map((h,i)=>(
//               <div
//                 key={i}
//                 className="asc-bar"
//                 style={{height:`${h}%`}}
//               />
//             ))}

//           </div>

//           <div className="asc-chart">

//             {[30,55,80,95,60,40,65,50,35,45].map((h,i)=>(
//               <div
//                 key={i}
//                 className="asc-bar asc-bar-alt"
//                 style={{height:`${h}%`}}
//               />
//             ))}

//           </div>

//         </div>

//       </div>

//       {/* Floating Card 1 */}

//       <div className="asc-float asc-float-top">

//         <span className="asc-float-label">

//           JOB MATCH SCORE

//         </span>

//         <span className="asc-float-value">

//           94%

//         </span>

//       </div>

//       {/* Floating Card 2 */}

//       <div className="asc-float asc-float-bottom">

//         <span className="asc-float-label">

//           SKILLS TO GROW

//         </span>

//         <span className="asc-float-value asc-float-value-sm">

//           3 Gaps

//         </span>

//       </div>

//     </motion.div>

//   </div>

// </section>
      
//       {/* ---------- How it Works ---------- */}

// <section className="asc-section asc-section-tint" id="how-it-works">

//     {/* Heading */}

//     <motion.div
//         className="asc-container asc-section-head"
//         variants={fadeUp}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//     >

//         <span className="asc-pill asc-pill-quiet">
//             HOW IT WORKS
//         </span>

//         <h2 className="asc-h2">
//             From Profile to Career Roadmap
//         </h2>

//         <p className="asc-sub">
//             Connect your profile once. Our AI analyzes your experience,
//             identifies your strengths, detects skill gaps, and creates
//             a personalized career growth roadmap in minutes.
//         </p>

//     </motion.div>

//     {/* Steps */}

//     <motion.div
//         className="asc-container asc-steps-row"
//         variants={container}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//     >

//         {STEPS.map((step, index) => (

//             <React.Fragment key={step.n}>

//                 <motion.div
//                     className="asc-step-card"
//                     variants={fadeUp}
//                     whileHover={{
//                         y: -12,
//                         scale: 1.03
//                     }}
//                     transition={{
//                         duration: 0.3
//                     }}
//                 >

//                     <div className="asc-step-badge">

//                         {step.n}

//                     </div>

//                     <h3>

//                         {step.title}

//                     </h3>

//                     <p>

//                         {step.desc}

//                     </p>

//                 </motion.div>

//                 {index < STEPS.length - 1 && (

//                     <motion.div
//                         className="asc-step-arrow-wrapper"
//                         initial={{
//                             opacity: 0,
//                             x: -20
//                         }}
//                         whileInView={{
//                             opacity: 1,
//                             x: 0
//                         }}
//                         transition={{
//                             duration: 0.5,
//                             delay: index * 0.2
//                         }}
//                         viewport={{ once: true }}
//                     >

//                         <Icon.Arrow className="asc-step-arrow" />

//                     </motion.div>

//                 )}

//             </React.Fragment>

//         ))}

//     </motion.div>

// </section>

//       {/* ---------- Testimonials ---------- */}

// <section className="asc-section" id="results">

//     {/* Heading */}

//     <motion.div
//         className="asc-container asc-section-head"
//         variants={fadeUp}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//     >

//         <span className="asc-pill asc-pill-quiet">
//             REAL OUTCOMES
//         </span>

//         <h2 className="asc-h2">
//             Careers Moving Forward, Faster
//         </h2>

//         <p className="asc-sub">
//             Professionals across industries use Ascendra AI to discover
//             better career opportunities, identify skill gaps, and achieve
//             their next career milestone with confidence.
//         </p>

//     </motion.div>

//     {/* Testimonial Cards */}

//     <motion.div
//         className="asc-container asc-testimonial-grid"
//         variants={container}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//     >

//         {TESTIMONIALS.map((testimonial) => (

//             <motion.div
//                 key={testimonial.name}
//                 className="asc-testimonial"
//                 variants={zoomIn}
//                 whileHover={{
//                     y: -12,
//                     scale: 1.03
//                 }}
//                 transition={{
//                     duration: 0.3
//                 }}
//             >

//                 {/* Quote */}

//                 <div className="asc-quote-icon">

//                     <Icon.Quote className="asc-icon" />

//                 </div>

//                 {/* Stars */}

//                 <div className="asc-stars">

//                     {Array.from({ length: 5 }).map((_, index) => (

//                         <motion.div
//                             key={index}
//                             whileHover={{
//                                 rotate: 360,
//                                 scale: 1.25
//                             }}
//                             transition={{
//                                 duration: 0.4
//                             }}
//                         >

//                             <Icon.Star className="asc-star" />

//                         </motion.div>

//                     ))}

//                 </div>

//                 {/* Review */}

//                 <p className="asc-testimonial-text">

//                     {testimonial.quote}

//                 </p>

//                 {/* Person */}

//                 <div className="asc-testimonial-person">

//                     <span className="asc-avatar">

//                         {testimonial.initials}

//                     </span>

//                     <div>

//                         <div className="asc-person-name">

//                             {testimonial.name}

//                         </div>

//                         <div className="asc-person-role">

//                             {testimonial.role}

//                         </div>

//                     </div>

//                 </div>

//             </motion.div>

//         ))}

//     </motion.div>

//     {/* Pagination */}

//     <div className="asc-dots">

//         <span className="asc-dot asc-dot-active"></span>

//         <span className="asc-dot"></span>

//         <span className="asc-dot"></span>

//     </div>

// </section>

//      {/* ---------- CTA / Signup ---------- */}

// <section className="asc-section asc-cta-section" id="get-started">

//     <div className="asc-container">

//         <motion.div
//             className="asc-cta-card"
//             variants={fadeUp}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//         >

//             <span className="asc-pill asc-pill-quiet">
//                 START YOUR JOURNEY
//             </span>

//             <h2 className="asc-h2 asc-cta-title">
//                 Your smartest career move
//                 <br />
//                 starts here
//             </h2>

//             <p className="asc-sub">

//                 Receive your personalized AI career report in less than
//                 two minutes. Discover your strongest matches, identify
//                 missing skills, and get a roadmap to your next opportunity.

//             </p>

//             {submitted ? (

//                 <motion.div
//                     className="asc-success"
//                     initial={{ opacity: 0, scale: .9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                 >

//                     🎉 Thanks <b>{form.name.split(" ")[0]}</b>!

//                     <br />

//                     Your career report is on its way to

//                     <br />

//                     <strong>{form.email}</strong>

//                 </motion.div>

//             ) : (

//                 <div className="asc-form-wrapper">

//                     <Registrationpage />

//                 </div>

//             )}

//         </motion.div>

//     </div>

// </section>

      
//       {/* ---------- Footer ---------- */}

// <footer className="asc-footer">

//     <div className="asc-footer-bg"></div>

//     <div className="asc-container asc-footer-grid">

//         {/* Brand */}

//         <div className="asc-footer-brand">

//             <div className="asc-logo">

//                 <span className="asc-logo-mark">

//                     <Icon.Compass className="asc-icon"/>

//                 </span>

//                 <span>

//                     Ascendra <b>AI</b>

//                 </span>

//             </div>

//             <p>

//                 Empowering professionals with AI-driven career intelligence,
//                 personalized learning paths, and smarter career decisions.

//             </p>

//         </div>

//         {/* Product */}

//         <div className="asc-footer-col">

//             <h4>Product</h4>

//             <a href="#features">Features</a>

//             <a href="#how-it-works">How It Works</a>

//             <a href="#results">Success Stories</a>

//         </div>

//         {/* Company */}

//         <div className="asc-footer-col">

//             <h4>Company</h4>

//             <a href="#get-started">Get Started</a>

//             <a href="#demo">Request Demo</a>

//             <a href="#contact">Contact</a>

//         </div>

//         {/* Social */}

//         <div className="asc-footer-col">

//             <h4>Connect</h4>

//             <div className="asc-social-row">

//                 <a href="#linkedin">

//                     <Icon.Linkedin className="asc-icon"/>

//                 </a>

//                 <a href="#twitter">

//                     <Icon.Twitter className="asc-icon"/>

//                 </a>

//                 <a href="#youtube">

//                     <Icon.Youtube className="asc-icon"/>

//                 </a>

//             </div>

//         </div>

//     </div>

//     <div className="asc-container">

//         <div className="asc-footer-divider"></div>

//         <div className="asc-footer-bottom">

//             <p>

//                 © {new Date().getFullYear()} Ascendra AI. All rights reserved.

//             </p>

//             <div className="asc-footer-legal">

//                 <a href="#privacy">Privacy Policy</a>

//                 <a href="#terms">Terms of Service</a>

//             </div>

//         </div>

//     </div>

// </footer>
//     </div>
//   );
// }





import React, { useEffect, useMemo, useState } from "react";
import "../styles/Homepage.css";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { motion, useScroll } from "framer-motion";
import Registrationpage from "./Registrationpage";
import { Link } from "react-router-dom";

/*
 * AscendraLanding.jsx
 *
 * Dynamic public landing page.
 *
 * Expected public API:
 *   GET /api/public/homepage
 *
 * Recommended response:
 * {
 *   success: true,
 *   stats: {
 *     users: 6,
 *     resumes: 6,
 *     jobs: 10,
 *     courses: 16,
 *     atsAnalyses: 2,
 *     careerRecommendations: 3,
 *     averageAtsScore: 14
 *   },
 *   chartData: [
 *     { name: "Users", value: 6 },
 *     { name: "Resumes", value: 6 },
 *     ...
 *   ],
 *   features: [...],
 *   steps: [...],
 *   testimonials: [...]
 * }
 *
 * The component also has safe fallback values so the UI does not break
 * while the public endpoint is being created.
 */

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
const HOMEPAGE_API = `${API_BASE}/api/public/statistics`;

const Icon = {
  Compass: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),

  Shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3Z" />
    </svg>
  ),

  Bolt: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <polygon points="13 2 3 14 11 14 9 22 21 10 13 10 13 2" />
    </svg>
  ),

  FileScan: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <circle cx="11" cy="15" r="2" />
      <path d="m14.5 18-1.6-1.6" />
    </svg>
  ),

  Target: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  ),

  Radar: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 12 12 2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),

  Path: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <path d="M8.2 6h7.6M17 8.2 8.7 16.5" />
    </svg>
  ),

  Arrow: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),

  Star: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <polygon points="12 2 15.09 8.63 22 9.24 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.24 8.91 8.63 12 2" />
    </svg>
  ),

  Quote: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M9.5 7C6.5 7 4 9.5 4 12.5S6.5 18 9.5 18c.4 0 .8 0 1.1-.1-.6 1.7-2.1 3-4 3.4v2c3.7-.5 6.5-3.6 6.5-7.4V12c0-2.8-2-5-4.6-5Zm10 0c-3 0-5.5 2.5-5.5 5.5S16.5 18 19.5 18c.4 0 .8 0 1.1-.1-.6 1.7-2.1 3-4 3.4v2c3.7-.5 6.5-3.6 6.5-7.4V12c0-2.8-2-5-4.6-5Z" />
    </svg>
  ),

  Linkedin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7.5 10.5v6M7.5 7.5v.01M12 16.5v-3.7c0-1.4 1-2.3 2.2-2.3s2.3 1 2.3 2.4v3.6" />
    </svg>
  ),

  Twitter: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.3 1.7-2.3-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.9 3.7A11.4 11.4 0 0 1 3.5 4.6a4 4 0 0 0 1.2 5.4c-.6 0-1.2-.2-1.7-.5v.1a4 4 0 0 0 3.2 4 4 0 0 1-1.8.1 4 4 0 0 0 3.8 2.8A8 8 0 0 1 2 18.6a11.3 11.3 0 0 0 6.3 1.9c7.5 0 11.7-6.4 11.7-11.9v-.5c.8-.6 1.5-1.3 2-2.2Z" />
    </svg>
  ),

  Youtube: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <rect x="2.5" y="6" width="19" height="12" rx="3" />
      <polygon points="10.5 9.5 15 12 10.5 14.5" fill="currentColor" stroke="none" />
    </svg>
  ),

  Menu: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),

  X: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  ),

  Users: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 11c2.8.2 5 2.5 5 5.3M16 5.8a3 3 0 0 1 0 5.6" />
    </svg>
  ),

  Resume: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M6 2h9l4 4v16H6z" />
      <path d="M15 2v5h5M9 12h6M9 16h6M9 8h2" />
    </svg>
  ),

  Briefcase: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
    </svg>
  ),

  Book: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
      <path d="M4 5.5v16M8 7h8M8 11h8" />
    </svg>
  ),

  Spark: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="m12 2 1.8 7.2L21 11l-7.2 1.8L12 20l-1.8-7.2L3 11l7.2-1.8z" />
    </svg>
  ),
};

const DEFAULT_FEATURES = [
  {
    icon: "FileScan",
    title: "Resume analysis",
    desc: "AI scans your resume, scores clarity and impact, and highlights the improvements that matter most.",
  },
  {
    icon: "Target",
    title: "Job match scoring",
    desc: "Compare your profile against opportunities and focus your applications where you are strongest.",
  },
  {
    icon: "Radar",
    title: "Skill gap detection",
    desc: "Discover the skills separating you from your target role and identify what to learn next.",
  },
  {
    icon: "Path",
    title: "Career path mapping",
    desc: "Turn your current experience into a practical roadmap toward your next career milestone.",
  },
];

const DEFAULT_STEPS = [
  {
    n: 1,
    title: "Build your profile",
    desc: "Create your profile and add your experience, education, skills, and career interests.",
  },
  {
    n: 2,
    title: "Get AI insights",
    desc: "Ascendra analyzes your profile, resume, job matches, and skill gaps.",
  },
  {
    n: 3,
    title: "Take action",
    desc: "Follow personalized recommendations and keep improving your career profile.",
  },
];

const DEFAULT_TESTIMONIALS = [
  {
    quote: "Ascendra helped me understand exactly where my profile was strong and where I needed to improve.",
    name: "Ascendra User",
    role: "Career Explorer",
    initials: "AU",
    rating: 5,
  },
  {
    quote: "The combination of resume insights, job matching, and skill recommendations makes career planning much easier.",
    name: "Platform User",
    role: "Professional",
    initials: "PU",
    rating: 5,
  },
  {
    quote: "I can see my next steps clearly instead of applying to jobs without a plan.",
    name: "Ascendra Member",
    role: "Job Seeker",
    initials: "AM",
    rating: 5,
  },
];

const DEFAULT_STATS = {
  users: 0,
  resumes: 0,
  jobs: 0,
  courses: 0,
  atsAnalyses: 0,
  careerRecommendations: 0,
  averageAtsScore: 0,
  averageCoverageScore: 0,
};

const fallbackChart = [
  { name: "Users", value: 0 },
  { name: "Resumes", value: 0 },
  { name: "Jobs", value: 0 },
  { name: "Courses", value: 0 },
  { name: "ATS", value: 0 },
  { name: "Career", value: 0 },
];

const getIcon = (name) => Icon[name] || Icon.Spark;

const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const normalizeStats = (raw = {}) => ({
  users: safeNumber(raw.users ?? raw.totalUsers),
  resumes: safeNumber(raw.resumes ?? raw.totalResumes),
  jobs: safeNumber(raw.jobs ?? raw.totalJobs),
  courses: safeNumber(raw.courses ?? raw.totalCourses),
  atsAnalyses: safeNumber(raw.atsAnalyses ?? raw.totalAnalyses),
  careerRecommendations: safeNumber(
    raw.careerRecommendations ?? raw.recommendations
  ),
  averageAtsScore: safeNumber(
    raw.averageAtsScore ?? raw.average_ats_score
  ),
  averageCoverageScore: safeNumber(
    raw.averageCoverageScore ?? raw.average_coverage_score
  ),
});

const normalizeHomepageData = (payload) => {

  const statistics =
    payload?.statistics || {};

  const stats = normalizeStats({

    users:
      statistics.users ?? 0,

    resumes:
      statistics.resumes ?? 0,

    jobs:
      statistics.jobs ?? 0,

    courses:
      statistics.courses ?? 0,

    atsAnalyses:
      statistics.ats_analyses ?? 0,

    careerRecommendations:
      statistics.career_recommendations ?? 0,

  });

  const chartData = [
    {
      name: "Users",
      value: stats.users,
    },
    {
      name: "Resumes",
      value: stats.resumes,
    },
    {
      name: "Jobs",
      value: stats.jobs,
    },
    {
      name: "Courses",
      value: stats.courses,
    },
    {
      name: "ATS",
      value: stats.atsAnalyses,
    },
    {
      name: "Career",
      value: stats.careerRecommendations,
    },
  ];

  return {

    stats,

    chartData,

    features: DEFAULT_FEATURES,

    steps: DEFAULT_STEPS,

    testimonials: DEFAULT_TESTIMONIALS,

  };

};

const fadeUp = {
  hidden: { opacity: 0, y: 45 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -55 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: "easeOut" },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 55 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: "easeOut" },
  },
};

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

function AnimatedNumber({ value, duration = 900 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = safeNumber(value);
    const start = performance.now();

    let frame;

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
}

function StatCard({ icon: IconComponent, label, value, suffix = "" }) {
  return (
    <motion.div
      className="asc-stat-card"
      variants={fadeUp}
      whileHover={{ y: -7 }}
    >
      <div className="asc-stat-icon">
        <IconComponent className="asc-icon" />
      </div>

      <div>
        <span>{label}</span>
        <strong>
          <AnimatedNumber value={value} />
          {suffix}
        </strong>
      </div>
    </motion.div>
  );
}

export default function AscendraLanding() {
  const { scrollYProgress } = useScroll();

  const [homepage, setHomepage] = useState({
    stats: DEFAULT_STATS,
    chartData: fallbackChart,
    features: DEFAULT_FEATURES,
    steps: DEFAULT_STEPS,
    testimonials: DEFAULT_TESTIMONIALS,
  });

  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState("loading");
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadHomepage = async () => {
      try {
        setLoading(true);

        const response = await fetch(HOMEPAGE_API, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Homepage API returned ${response.status}`);
        }

        const payload = await response.json();

        if (!cancelled) {
          setHomepage(normalizeHomepageData(payload));
          setApiStatus("online");
        }
      } catch (error) {
        console.warn("Ascendra public homepage API unavailable:", error);

        if (!cancelled) {
          setApiStatus("offline");
          setHomepage((current) => ({
            ...current,
            stats: current.stats,
          }));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadHomepage();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (homepage.testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setActiveTestimonial((current) =>
        (current + 1) % homepage.testimonials.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [homepage.testimonials.length]);

  const stats = homepage.stats;

  const dashboardData = useMemo(
    () => [
      {
        name: "Users",
        value: stats.users,
      },
      {
        name: "Resumes",
        value: stats.resumes,
      },
      {
        name: "Jobs",
        value: stats.jobs,
      },
      {
        name: "Courses",
        value: stats.courses,
      },
    ],
    [stats]
  );

  const scoreData = useMemo(
    () => [
      {
        name: "ATS Score",
        value: Math.min(100, Math.max(0, stats.averageAtsScore)),
      },
      {
        name: "Coverage",
        value: Math.min(100, Math.max(0, stats.averageCoverageScore)),
      },
    ],
    [stats]
  );

  const activeTestimonialData =
    homepage.testimonials[activeTestimonial] || DEFAULT_TESTIMONIALS[0];

  const closeMobileMenu = () => setMobileMenu(false);

  return (
    <div className="asc">
      <motion.div
        className="asc-scroll-progress"
        style={{ scaleX: scrollYProgress }}
      />

      {/* NAVIGATION */}
      <header className="asc-nav">
        <div className="asc-container asc-nav-inner">
          <a className="asc-logo" href="#top" onClick={closeMobileMenu}>
            <span className="asc-logo-mark">
              <Icon.Compass className="asc-icon" />
            </span>

            <span>
              Ascendra <b>AI</b>
            </span>
          </a>

          <nav className="asc-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#platform">Platform</a>
            <a href="#results">Results</a>
            <a href="#get-started">Get started</a>
          </nav>

          <div className="asc-nav-actions">
            <Link
              to="/login"
              className="asc-btn asc-btn-primary asc-nav-cta"
            >
              Get started
            </Link>

            <div className="admin-menu-wrapper">
              <button
                className="admin-menu-button"
                onClick={() => setShowAdminMenu((value) => !value)}
                aria-label="Admin menu"
                aria-expanded={showAdminMenu}
              >
                ⋮
              </button>

              {showAdminMenu && (
                <div className="admin-dropdown">
                  <Link
                    to="/admin/login"
                    onClick={() => setShowAdminMenu(false)}
                  >
                    🔐 Admin Login
                  </Link>
                </div>
              )}
            </div>

            <button
              className="asc-mobile-toggle"
              onClick={() => setMobileMenu((value) => !value)}
              aria-label="Toggle navigation"
            >
              {mobileMenu ? (
                <Icon.X className="asc-icon" />
              ) : (
                <Icon.Menu className="asc-icon" />
              )}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <motion.div
            className="asc-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <a href="#features" onClick={closeMobileMenu}>Features</a>
            <a href="#how-it-works" onClick={closeMobileMenu}>How it works</a>
            <a href="#platform" onClick={closeMobileMenu}>Platform</a>
            <a href="#results" onClick={closeMobileMenu}>Results</a>
            <a href="#get-started" onClick={closeMobileMenu}>Get started</a>
            <Link to="/login" onClick={closeMobileMenu}>Login</Link>
          </motion.div>
        )}
      </header>

      <main id="top">
        {/* HERO */}
        <section className="asc-hero">
          <div className="asc-hero-glow asc-hero-glow-one" />
          <div className="asc-hero-glow asc-hero-glow-two" />

          <div className="asc-container asc-hero-grid">
            <motion.div
              className="asc-hero-content"
              variants={fadeLeft}
              initial="hidden"
              animate="visible"
            >
              <span className="asc-pill">
                <Icon.Bolt className="asc-pill-icon" />
                AI CAREER INTELLIGENCE
              </span>

              <h1 className="asc-h1">
                Know your next
                <br />
                <span className="asc-gradient-text">career move</span>
                <br />
                before you make it.
              </h1>

              <p className="asc-lede">
                Ascendra AI analyzes your experience, evaluates your career
                profile, identifies skill gaps, and helps you make smarter
                career decisions.
              </p>

              <div className="asc-btn-group">
                <a
                  href="#get-started"
                  className="asc-btn asc-btn-primary asc-btn-lg"
                >
                  Start Free Analysis
                  <Icon.Arrow className="asc-btn-arrow" />
                </a>

                <a href="#platform" className="asc-btn asc-btn-ghost">
                  Explore platform
                </a>
              </div>

              <div className="asc-trust-row">
                <span>
                  <Icon.Shield className="asc-trust-icon" />
                  Secure career data
                </span>

                <span>
                  <Icon.Bolt className="asc-trust-icon" />
                  AI-powered insights
                </span>

                <span>
                  <Icon.Spark className="asc-trust-icon" />
                  Personalized recommendations
                </span>
              </div>

              <div className="asc-api-status">
                <span
                  className={`asc-status-dot ${
                    apiStatus === "online"
                      ? "online"
                      : apiStatus === "loading"
                        ? "loading"
                        : "offline"
                  }`}
                />
                {apiStatus === "online"
                  ? "Live platform data"
                  : apiStatus === "loading"
                    ? "Connecting to platform..."
                    : "Demo data mode"}
              </div>
            </motion.div>

            <motion.div
              className="asc-hero-art"
              variants={fadeRight}
              initial="hidden"
              animate="visible"
            >
              <div className="asc-dashboard">
                <div className="asc-dashboard-header">
                  <div>
                    <span className="asc-dashboard-eyebrow">
                      ASCENDRA INSIGHTS
                    </span>
                    <h4>Career Analytics</h4>
                  </div>

                  <span className="asc-live-badge">
                    <span />
                    Live
                  </span>
                </div>

                <div className="asc-dashboard-score-row">
                  <div className="asc-dashboard-score">
                    <span>Average ATS</span>
                    <strong>{Math.round(stats.averageAtsScore)}%</strong>
                    <small>platform score</small>
                  </div>

                  <div className="asc-dashboard-score secondary">
                    <span>Profiles</span>
                    <strong>
                      <AnimatedNumber value={stats.users} />
                    </strong>
                    <small>registered users</small>
                  </div>
                </div>

                <div className="asc-chart-heading">
                  <span>Platform growth</span>
                  <span>Live metrics</span>
                </div>

                <div className="asc-chart-box">
                  {loading ? (
                    <div className="asc-chart-loading">
                      <span />
                      Loading analytics...
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={homepage.chartData}
                        margin={{ top: 10, right: 8, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="ascAreaGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#168AAD"
                              stopOpacity={0.35}
                            />
                            <stop
                              offset="100%"
                              stopColor="#52B69A"
                              stopOpacity={0.03}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          stroke="#eaf2f1"
                          strokeDasharray="4 4"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 9, fill: "#7a8995" }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <YAxis
                          tick={{ fontSize: 9, fill: "#7a8995" }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: "1px solid #e3eeee",
                            boxShadow: "0 10px 30px rgba(24,78,119,.12)",
                          }}
                        />

                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#168AAD"
                          strokeWidth={3}
                          fill="url(#ascAreaGradient)"
                          activeDot={{ r: 5 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="asc-dashboard-mini-grid">
                  <div>
                    <span>Resumes</span>
                    <strong>
                      <AnimatedNumber value={stats.resumes} />
                    </strong>
                  </div>

                  <div>
                    <span>Jobs</span>
                    <strong>
                      <AnimatedNumber value={stats.jobs} />
                    </strong>
                  </div>

                  <div>
                    <span>Courses</span>
                    <strong>
                      <AnimatedNumber value={stats.courses} />
                    </strong>
                  </div>
                </div>
              </div>

              <div className="asc-float asc-float-top">
                <span className="asc-float-label">ATS SCORE</span>
                <span className="asc-float-value">
                  {Math.round(stats.averageAtsScore)}%
                </span>
              </div>

              <div className="asc-float asc-float-bottom">
                <span className="asc-float-label">CAREER INSIGHTS</span>
                <span className="asc-float-value asc-float-value-sm">
                  <AnimatedNumber value={stats.careerRecommendations} />+
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PLATFORM STATISTICS */}
        <section className="asc-platform" id="platform">
          <div className="asc-container">
            <motion.div
              className="asc-section-head"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <span className="asc-pill asc-pill-quiet">
                <Icon.Spark className="asc-pill-icon" />
                PLATFORM INTELLIGENCE
              </span>

              <h2 className="asc-h2">
                A career platform that grows with you
              </h2>

              <p className="asc-sub">
                Real platform activity is connected to the dashboard, so the
                numbers can change automatically as your application grows.
              </p>
            </motion.div>

            <motion.div
              className="asc-stats-grid"
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <StatCard
                icon={Icon.Users}
                label="Registered Users"
                value={stats.users}
              />

              <StatCard
                icon={Icon.Resume}
                label="Resumes"
                value={stats.resumes}
              />

              <StatCard
                icon={Icon.Briefcase}
                label="Available Jobs"
                value={stats.jobs}
              />

              <StatCard
                icon={Icon.Book}
                label="Learning Courses"
                value={stats.courses}
              />

              <StatCard
                icon={Icon.Target}
                label="ATS Analyses"
                value={stats.atsAnalyses}
              />

              <StatCard
                icon={Icon.Spark}
                label="Career Recommendations"
                value={stats.careerRecommendations}
              />
            </motion.div>

            <div className="asc-platform-visual">
              <div className="asc-platform-chart-card">
                <div className="asc-panel-heading">
                  <div>
                    <span>Platform overview</span>
                    <h3>Career ecosystem activity</h3>
                  </div>
                  <span className="asc-panel-live">Live</span>
                </div>

                <div className="asc-big-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        stroke="#edf3f2"
                        strokeDasharray="4 4"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: "#667987" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 10, fill: "#667987" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(22,138,173,.05)" }}
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #e3eeee",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#168AAD"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={52}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="asc-platform-chart-card score-card">
                <div className="asc-panel-heading">
                  <div>
                    <span>AI quality signals</span>
                    <h3>Average analysis score</h3>
                  </div>
                </div>

                <div className="asc-score-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={scoreData}
                      layout="vertical"
                      margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
                    >
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={72}
                        tick={{ fontSize: 11, fill: "#667987" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}/100`, "Score"]}
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #e3eeee",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#52B69A"
                        radius={[0, 8, 8, 0]}
                        maxBarSize={28}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="asc-section asc-features-section" id="features">
          <div className="asc-container">
            <motion.div
              className="asc-section-head"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="asc-pill asc-pill-quiet">
                WHAT ASCENDRA DOES
              </span>

              <h2 className="asc-h2">
                Everything you need to make a smarter career move
              </h2>

              <p className="asc-sub">
                One intelligent platform for resumes, jobs, skills, learning,
                and career planning.
              </p>
            </motion.div>

            <motion.div
              className="asc-features-grid"
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {homepage.features.map((feature, index) => {
                const FeatureIcon = getIcon(feature.icon);

                return (
                  <motion.div
                    className="asc-card"
                    key={`${feature.title}-${index}`}
                    variants={fadeUp}
                    whileHover={{ y: -10 }}
                  >
                    <div className="asc-card-icon">
                      <FeatureIcon className="asc-icon" />
                    </div>

                    <h3>{feature.title}</h3>
                    <p>{feature.desc || feature.description}</p>

                    <span className="asc-card-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          className="asc-section asc-section-tint"
          id="how-it-works"
        >
          <div className="asc-container">
            <motion.div
              className="asc-section-head"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="asc-pill asc-pill-quiet">
                HOW IT WORKS
              </span>

              <h2 className="asc-h2">
                From profile to career roadmap
              </h2>

              <p className="asc-sub">
                Build your profile once. Ascendra turns your career data into
                actionable intelligence.
              </p>
            </motion.div>

            <motion.div
              className="asc-steps-row"
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {homepage.steps.map((step, index) => (
                <React.Fragment key={`${step.n}-${step.title}`}>
                  <motion.div
                    className="asc-step-card"
                    variants={fadeUp}
                    whileHover={{ y: -10 }}
                  >
                    <div className="asc-step-badge">
                      {String(step.n ?? index + 1).padStart(2, "0")}
                    </div>

                    <h3>{step.title}</h3>
                    <p>{step.desc || step.description}</p>
                  </motion.div>

                  {index < homepage.steps.length - 1 && (
                    <motion.div
                      className="asc-step-arrow-wrapper"
                      variants={fadeUp}
                    >
                      <Icon.Arrow className="asc-step-arrow" />
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </section>

        {/* RESULTS */}
        <section className="asc-section" id="results">
          <div className="asc-container">
            <motion.div
              className="asc-section-head"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="asc-pill asc-pill-quiet">
                REAL OUTCOMES
              </span>

              <h2 className="asc-h2">
                Built around your next career milestone
              </h2>

              <p className="asc-sub">
                See how Ascendra brings your resume, skills, opportunities,
                learning, and career recommendations together.
              </p>
            </motion.div>

            <motion.div
              className="asc-testimonial-feature"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="asc-testimonial-main">
                <div className="asc-quote-icon">
                  <Icon.Quote className="asc-icon" />
                </div>

                <div className="asc-stars">
                  {Array.from({
                    length: activeTestimonialData.rating || 5,
                  }).map((_, index) => (
                    <Icon.Star
                      className="asc-star"
                      key={index}
                    />
                  ))}
                </div>

                <blockquote>
                  “{activeTestimonialData.quote}”
                </blockquote>

                <div className="asc-testimonial-person">
                  <span className="asc-avatar">
                    {activeTestimonialData.initials ||
                      activeTestimonialData.name
                        ?.split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                  </span>

                  <div>
                    <div className="asc-person-name">
                      {activeTestimonialData.name}
                    </div>

                    <div className="asc-person-role">
                      {activeTestimonialData.role}
                    </div>
                  </div>
                </div>
              </div>

              <div className="asc-results-side">
                <div className="asc-results-stat">
                  <span>ATS analyses</span>
                  <strong>
                    <AnimatedNumber value={stats.atsAnalyses} />
                  </strong>
                </div>

                <div className="asc-results-stat">
                  <span>Average ATS</span>
                  <strong>
                    <AnimatedNumber value={stats.averageAtsScore} />%
                  </strong>
                </div>

                <div className="asc-results-stat">
                  <span>Career recommendations</span>
                  <strong>
                    <AnimatedNumber
                      value={stats.careerRecommendations}
                    />
                  </strong>
                </div>
              </div>
            </motion.div>

            <div className="asc-dots">
              {homepage.testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`asc-dot ${
                    index === activeTestimonial
                      ? "asc-dot-active"
                      : ""
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`Show testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="asc-section asc-cta-section"
          id="get-started"
        >
          <div className="asc-container">
            <motion.div
              className="asc-cta-card"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="asc-pill asc-pill-quiet">
                START YOUR JOURNEY
              </span>

              <h2 className="asc-h2 asc-cta-title">
                Your smartest career move
                <br />
                starts here
              </h2>

              <p className="asc-sub">
                Create your Ascendra AI profile and start turning your
                experience into a clear, actionable career plan.
              </p>

              <div className="asc-cta-actions">
                <Link
                  to="/register"
                  className="asc-btn asc-btn-primary asc-btn-lg"
                >
                  Create free profile
                  <Icon.Arrow className="asc-btn-arrow" />
                </Link>

                <Link to="/login" className="asc-btn asc-btn-ghost">
                  Already have an account?
                </Link>
              </div>

              <div className="asc-form-wrapper">
                <Registrationpage />
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="asc-footer">
        <div className="asc-footer-bg" />

        <div className="asc-container asc-footer-grid">
          <div className="asc-footer-brand">
            <a className="asc-logo" href="#top">
              <span className="asc-logo-mark">
                <Icon.Compass className="asc-icon" />
              </span>

              <span>
                Ascendra <b>AI</b>
              </span>
            </a>

            <p>
              Empowering professionals with AI-driven career intelligence,
              personalized learning paths, and smarter career decisions.
            </p>
          </div>

          <div className="asc-footer-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#platform">Platform</a>
            <a href="#results">Results</a>
          </div>

          <div className="asc-footer-col">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/admin/login">Admin Login</Link>
          </div>

          <div className="asc-footer-col">
            <h4>Connect</h4>

            <div className="asc-social-row">
              <a href="#linkedin" aria-label="LinkedIn">
                <Icon.Linkedin className="asc-icon" />
              </a>

              <a href="#twitter" aria-label="Twitter">
                <Icon.Twitter className="asc-icon" />
              </a>

              <a href="#youtube" aria-label="YouTube">
                <Icon.Youtube className="asc-icon" />
              </a>
            </div>
          </div>
        </div>

        <div className="asc-container">
          <div className="asc-footer-divider" />

          <div className="asc-footer-bottom">
            <p>
              © {new Date().getFullYear()} Ascendra AI. All rights reserved.
            </p>

            <div className="asc-footer-legal">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}