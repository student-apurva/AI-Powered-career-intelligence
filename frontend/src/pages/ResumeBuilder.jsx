import React, { useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaTools,
  FaFileAlt,
  FaDownload,
} from "react-icons/fa";

import "../styles/ResumeBuilder.css";

export default function ResumeBuilder() {
  // =====================================================
  // PERSONAL INFORMATION
  // =====================================================

  const [personal, setPersonal] = useState({
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    github: "",
    linkedin: "",
  });

  // =====================================================
  // SUMMARY
  // =====================================================

  const [summary, setSummary] = useState("");

  // =====================================================
  // EXPERIENCE
  // =====================================================

  const [experiences, setExperiences] = useState([]);

  const [experienceForm, setExperienceForm] = useState({
    jobTitle: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [editingExperience, setEditingExperience] = useState(null);

  // =====================================================
  // EDUCATION
  // =====================================================

  const [education, setEducation] = useState([]);

  const [educationForm, setEducationForm] = useState({
    degree: "",
    college: "",
    location: "",
    startYear: "",
    endYear: "",
    description: "",
  });

  const [editingEducation, setEditingEducation] = useState(null);

  // =====================================================
  // SKILLS
  // =====================================================

  const [skills, setSkills] = useState([]);

  const [skillInput, setSkillInput] = useState("");

  // =====================================================
  // PERSONAL CHANGE
  // =====================================================

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;

    setPersonal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // EXPERIENCE CHANGE
  // =====================================================

  const handleExperienceChange = (e) => {
    const { name, value } = e.target;

    setExperienceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD / UPDATE EXPERIENCE
  // =====================================================

  const saveExperience = () => {
    if (
      !experienceForm.jobTitle.trim() &&
      !experienceForm.company.trim()
    ) {
      alert("Please enter Job Title or Company.");
      return;
    }

    if (editingExperience !== null) {
      setExperiences((prev) =>
        prev.map((item, index) =>
          index === editingExperience
            ? { ...experienceForm }
            : item
        )
      );

      setEditingExperience(null);
    } else {
      setExperiences((prev) => [
        ...prev,
        { ...experienceForm },
      ]);
    }

    setExperienceForm({
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  // =====================================================
  // EDIT EXPERIENCE
  // =====================================================

  const editExperience = (index) => {
    setExperienceForm({
      ...experiences[index],
    });

    setEditingExperience(index);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE EXPERIENCE
  // =====================================================

  const deleteExperience = (index) => {
    setExperiences((prev) =>
      prev.filter((_, i) => i !== index)
    );

    if (editingExperience === index) {
      setEditingExperience(null);

      setExperienceForm({
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    }
  };

  // =====================================================
  // EDUCATION CHANGE
  // =====================================================

  const handleEducationChange = (e) => {
    const { name, value } = e.target;

    setEducationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD / UPDATE EDUCATION
  // =====================================================

  const saveEducation = () => {
    if (
      !educationForm.degree.trim() &&
      !educationForm.college.trim()
    ) {
      alert("Please enter Degree or College/University.");
      return;
    }

    if (editingEducation !== null) {
      setEducation((prev) =>
        prev.map((item, index) =>
          index === editingEducation
            ? { ...educationForm }
            : item
        )
      );

      setEditingEducation(null);
    } else {
      setEducation((prev) => [
        ...prev,
        { ...educationForm },
      ]);
    }

    setEducationForm({
      degree: "",
      college: "",
      location: "",
      startYear: "",
      endYear: "",
      description: "",
    });
  };

  // =====================================================
  // EDIT EDUCATION
  // =====================================================

  const editEducation = (index) => {
    setEducationForm({
      ...education[index],
    });

    setEditingEducation(index);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE EDUCATION
  // =====================================================

  const deleteEducation = (index) => {
    setEducation((prev) =>
      prev.filter((_, i) => i !== index)
    );

    if (editingEducation === index) {
      setEditingEducation(null);

      setEducationForm({
        degree: "",
        college: "",
        location: "",
        startYear: "",
        endYear: "",
        description: "",
      });
    }
  };

  // =====================================================
  // ADD SKILL
  // =====================================================

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) {
      return;
    }

    const exists = skills.some(
      (item) =>
        item.toLowerCase() === skill.toLowerCase()
    );

    if (exists) {
      setSkillInput("");
      return;
    }

    setSkills((prev) => [
      ...prev,
      skill,
    ]);

    setSkillInput("");
  };

  // =====================================================
  // SKILL ENTER
  // =====================================================

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // =====================================================
  // DELETE SKILL
  // =====================================================

  const deleteSkill = (index) => {
    setSkills((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =====================================================
  // DOWNLOAD / PRINT
  // =====================================================

  const handleDownload = () => {
    window.print();
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="resume-builder-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="resume-builder-header">

        <div>
          <div className="builder-eyebrow">
            <FaFileAlt />
            RESUME BUILDER
          </div>

          <h1>
            Build Your Professional Resume
          </h1>

          <p>
            Enter your information and see your resume
            update instantly.
          </p>
        </div>

        <button
          className="builder-download-btn"
          onClick={handleDownload}
        >
          <FaDownload />
          Download / Print
        </button>

      </div>

      {/* =================================================
          MAIN BUILDER
      ================================================= */}

      <div className="resume-builder-layout">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="resume-editor">

          {/* =============================================
              PERSONAL INFORMATION
          ============================================== */}

          <section className="builder-card">

            <div className="builder-card-header">

              <div className="builder-section-icon">
                <FaUser />
              </div>

              <div>
                <h2>
                  Personal Information
                </h2>

                <p>
                  Add your basic contact information.
                </p>
              </div>

            </div>

            <div className="builder-form-grid">

              <div className="form-group full">
                <label>Full Name</label>

                <input
                  type="text"
                  name="fullName"
                  value={personal.fullName}
                  onChange={handlePersonalChange}
                  placeholder="e.g. Saurabh Karande"
                />
              </div>

              <div className="form-group">

                <label>Professional Title</label>

                <input
                  type="text"
                  name="jobTitle"
                  value={personal.jobTitle}
                  onChange={handlePersonalChange}
                  placeholder="e.g. Java Full Stack Developer"
                />

              </div>

              <div className="form-group">

                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={personal.email}
                  onChange={handlePersonalChange}
                  placeholder="you@example.com"
                />

              </div>

              <div className="form-group">

                <label>Phone</label>

                <input
                  type="text"
                  name="phone"
                  value={personal.phone}
                  onChange={handlePersonalChange}
                  placeholder="+91 9876543210"
                />

              </div>

              <div className="form-group">

                <label>Location</label>

                <input
                  type="text"
                  name="location"
                  value={personal.location}
                  onChange={handlePersonalChange}
                  placeholder="Kolhapur, Maharashtra"
                />

              </div>

              <div className="form-group">

                <label>GitHub</label>

                <input
                  type="text"
                  name="github"
                  value={personal.github}
                  onChange={handlePersonalChange}
                  placeholder="github.com/username"
                />

              </div>

              <div className="form-group">

                <label>LinkedIn</label>

                <input
                  type="text"
                  name="linkedin"
                  value={personal.linkedin}
                  onChange={handlePersonalChange}
                  placeholder="linkedin.com/in/username"
                />

              </div>

            </div>

          </section>

          {/* =============================================
              SUMMARY
          ============================================== */}

          <section className="builder-card">

            <div className="builder-card-header">

              <div className="builder-section-icon">
                <FaFileAlt />
              </div>

              <div>
                <h2>
                  Professional Summary
                </h2>

                <p>
                  Write a short introduction about yourself.
                </p>
              </div>

            </div>

            <div className="form-group">

              <textarea
                value={summary}
                onChange={(e) =>
                  setSummary(e.target.value)
                }
                placeholder="Example: Computer Science graduate with experience in Java, React.js, SQL and full-stack web development..."
                rows="5"
              />

            </div>

          </section>

          {/* =============================================
              EXPERIENCE
          ============================================== */}

          <section className="builder-card">

            <div className="builder-card-header">

              <div className="builder-section-icon experience-icon">
                <FaBriefcase />
              </div>

              <div>
                <h2>
                  Experience
                </h2>

                <p>
                  Add your internships, jobs and work experience.
                </p>
              </div>

            </div>

            {/* EXPERIENCE FORM */}

            <div className="builder-subform">

              <div className="builder-form-grid">

                <div className="form-group">

                  <label>Job Title</label>

                  <input
                    type="text"
                    name="jobTitle"
                    value={experienceForm.jobTitle}
                    onChange={handleExperienceChange}
                    placeholder="e.g. Software Developer Intern"
                  />

                </div>

                <div className="form-group">

                  <label>Company</label>

                  <input
                    type="text"
                    name="company"
                    value={experienceForm.company}
                    onChange={handleExperienceChange}
                    placeholder="e.g. Infosys"
                  />

                </div>

                <div className="form-group">

                  <label>Location</label>

                  <input
                    type="text"
                    name="location"
                    value={experienceForm.location}
                    onChange={handleExperienceChange}
                    placeholder="Pune, Maharashtra"
                  />

                </div>

                <div className="form-group">

                  <label>Start Date</label>

                  <input
                    type="text"
                    name="startDate"
                    value={experienceForm.startDate}
                    onChange={handleExperienceChange}
                    placeholder="Jun 2025"
                  />

                </div>

                <div className="form-group">

                  <label>End Date</label>

                  <input
                    type="text"
                    name="endDate"
                    value={experienceForm.endDate}
                    onChange={handleExperienceChange}
                    placeholder="Jul 2026 / Present"
                  />

                </div>

                <div className="form-group full">

                  <label>Description</label>

                  <textarea
                    name="description"
                    value={experienceForm.description}
                    onChange={handleExperienceChange}
                    placeholder="Describe your responsibilities, achievements and technologies used..."
                    rows="4"
                  />

                </div>

              </div>

              <button
                type="button"
                className="add-entry-btn"
                onClick={saveExperience}
              >

                {editingExperience !== null ? (
                  <>
                    <FaSave />
                    Update Experience
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Add Experience
                  </>
                )}

              </button>

            </div>

            {/* EXPERIENCE LIST */}

            {experiences.length > 0 && (

              <div className="entry-list">

                {experiences.map((item, index) => (

                  <div
                    className="entry-item"
                    key={index}
                  >

                    <div className="entry-content">

                      <h3>
                        {item.jobTitle ||
                          "Untitled Position"}
                      </h3>

                      <strong>
                        {item.company}
                      </strong>

                      <span>
                        {item.startDate}
                        {item.startDate &&
                          item.endDate
                          ? " — "
                          : ""}
                        {item.endDate}
                      </span>

                    </div>

                    <div className="entry-actions">

                      <button
                        type="button"
                        onClick={() =>
                          editExperience(index)
                        }
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        className="delete"
                        onClick={() =>
                          deleteExperience(index)
                        }
                        title="Delete"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

          {/* =============================================
              EDUCATION
          ============================================== */}

          <section className="builder-card">

            <div className="builder-card-header">

              <div className="builder-section-icon education-icon">
                <FaGraduationCap />
              </div>

              <div>
                <h2>
                  Education
                </h2>

                <p>
                  Add your academic qualifications.
                </p>
              </div>

            </div>

            {/* EDUCATION FORM */}

            <div className="builder-subform">

              <div className="builder-form-grid">

                <div className="form-group">

                  <label>Degree</label>

                  <input
                    type="text"
                    name="degree"
                    value={educationForm.degree}
                    onChange={handleEducationChange}
                    placeholder="B.Tech Computer Science"
                  />

                </div>

                <div className="form-group">

                  <label>College / University</label>

                  <input
                    type="text"
                    name="college"
                    value={educationForm.college}
                    onChange={handleEducationChange}
                    placeholder="D.Y. Patil College of Engineering"
                  />

                </div>

                <div className="form-group">

                  <label>Location</label>

                  <input
                    type="text"
                    name="location"
                    value={educationForm.location}
                    onChange={handleEducationChange}
                    placeholder="Kolhapur, Maharashtra"
                  />

                </div>

                <div className="form-group">

                  <label>Start Year</label>

                  <input
                    type="text"
                    name="startYear"
                    value={educationForm.startYear}
                    onChange={handleEducationChange}
                    placeholder="2022"
                  />

                </div>

                <div className="form-group">

                  <label>End Year</label>

                  <input
                    type="text"
                    name="endYear"
                    value={educationForm.endYear}
                    onChange={handleEducationChange}
                    placeholder="2026"
                  />

                </div>

                <div className="form-group full">

                  <label>Description</label>

                  <textarea
                    name="description"
                    value={educationForm.description}
                    onChange={handleEducationChange}
                    placeholder="CGPA, specialization, achievements, relevant coursework..."
                    rows="3"
                  />

                </div>

              </div>

              <button
                type="button"
                className="add-entry-btn"
                onClick={saveEducation}
              >

                {editingEducation !== null ? (
                  <>
                    <FaSave />
                    Update Education
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Add Education
                  </>
                )}

              </button>

            </div>

            {/* EDUCATION LIST */}

            {education.length > 0 && (

              <div className="entry-list">

                {education.map((item, index) => (

                  <div
                    className="entry-item"
                    key={index}
                  >

                    <div className="entry-content">

                      <h3>
                        {item.degree ||
                          "Untitled Degree"}
                      </h3>

                      <strong>
                        {item.college}
                      </strong>

                      <span>
                        {item.startYear}
                        {item.startYear &&
                          item.endYear
                          ? " — "
                          : ""}
                        {item.endYear}
                      </span>

                    </div>

                    <div className="entry-actions">

                      <button
                        type="button"
                        onClick={() =>
                          editEducation(index)
                        }
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        className="delete"
                        onClick={() =>
                          deleteEducation(index)
                        }
                        title="Delete"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

          {/* =============================================
              SKILLS
          ============================================== */}

          <section className="builder-card">

            <div className="builder-card-header">

              <div className="builder-section-icon skills-icon">
                <FaTools />
              </div>

              <div>
                <h2>
                  Skills
                </h2>

                <p>
                  Add your technical and professional skills.
                </p>
              </div>

            </div>

            <div className="skill-input-row">

              <input
                type="text"
                value={skillInput}
                onChange={(e) =>
                  setSkillInput(e.target.value)
                }
                onKeyDown={handleSkillKeyDown}
                placeholder="Enter a skill e.g. Java"
              />

              <button
                type="button"
                onClick={addSkill}
              >
                <FaPlus />
                Add
              </button>

            </div>

            {skills.length > 0 && (

              <div className="skills-editor-list">

                {skills.map((skill, index) => (

                  <div
                    className="skill-chip-editor"
                    key={index}
                  >

                    <span>
                      {skill}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        deleteSkill(index)
                      }
                    >
                      ×
                    </button>

                  </div>

                ))}

              </div>

            )}

          </section>

        </div>

        {/* =================================================
            RIGHT SIDE - LIVE RESUME
        ================================================= */}

        <div className="resume-preview-wrapper">

          <div className="preview-header">

            <div>
              <span>
                LIVE PREVIEW
              </span>

              <h2>
                Your Resume
              </h2>
            </div>

            <div className="live-indicator">
              <span></span>
              Live
            </div>

          </div>

          <div className="resume-paper">

            {/* HEADER */}

            <div className="resume-paper-header">

              <h1>
                {personal.fullName ||
                  "Your Name"}
              </h1>

              <h2>
                {personal.jobTitle ||
                  "Professional Title"}
              </h2>

              <div className="resume-contact">

                {personal.email && (
                  <span>
                    {personal.email}
                  </span>
                )}

                {personal.phone && (
                  <span>
                    {personal.phone}
                  </span>
                )}

                {personal.location && (
                  <span>
                    {personal.location}
                  </span>
                )}

              </div>

              <div className="resume-links">

                {personal.github && (
                  <span>
                    {personal.github}
                  </span>
                )}

                {personal.linkedin && (
                  <span>
                    {personal.linkedin}
                  </span>
                )}

              </div>

            </div>

            {/* SUMMARY */}

            {summary.trim() && (

              <div className="resume-section">

                <h3>
                  PROFESSIONAL SUMMARY
                </h3>

                <p>
                  {summary}
                </p>

              </div>

            )}

            {/* EXPERIENCE */}

            {experiences.length > 0 && (

              <div className="resume-section">

                <h3>
                  EXPERIENCE
                </h3>

                {experiences.map(
                  (item, index) => (

                    <div
                      className="resume-entry"
                      key={index}
                    >

                      <div className="resume-entry-top">

                        <div>

                          <h4>
                            {item.jobTitle}
                          </h4>

                          <strong>
                            {item.company}
                          </strong>

                        </div>

                        <div className="resume-entry-date">

                          {item.startDate}

                          {item.startDate &&
                            item.endDate
                            ? " — "
                            : ""}

                          {item.endDate}

                        </div>

                      </div>

                      {item.location && (
                        <div className="resume-location">
                          {item.location}
                        </div>
                      )}

                      {item.description && (
                        <p>
                          {item.description}
                        </p>
                      )}

                    </div>

                  )
                )}

              </div>

            )}

            {/* EDUCATION */}

            {education.length > 0 && (

              <div className="resume-section">

                <h3>
                  EDUCATION
                </h3>

                {education.map(
                  (item, index) => (

                    <div
                      className="resume-entry"
                      key={index}
                    >

                      <div className="resume-entry-top">

                        <div>

                          <h4>
                            {item.degree}
                          </h4>

                          <strong>
                            {item.college}
                          </strong>

                        </div>

                        <div className="resume-entry-date">

                          {item.startYear}

                          {item.startYear &&
                            item.endYear
                            ? " — "
                            : ""}

                          {item.endYear}

                        </div>

                      </div>

                      {item.location && (
                        <div className="resume-location">
                          {item.location}
                        </div>
                      )}

                      {item.description && (
                        <p>
                          {item.description}
                        </p>
                      )}

                    </div>

                  )
                )}

              </div>

            )}

            {/* SKILLS */}

            {skills.length > 0 && (

              <div className="resume-section">

                <h3>
                  SKILLS
                </h3>

                <div className="resume-skills">

                  {skills.map(
                    (skill, index) => (

                      <span key={index}>
                        {skill}
                      </span>

                    )
                  )}

                </div>

              </div>

            )}

            {/* EMPTY PREVIEW */}

            {!personal.fullName &&
              !summary &&
              experiences.length === 0 &&
              education.length === 0 &&
              skills.length === 0 && (

                <div className="resume-empty">

                  <FaFileAlt />

                  <h3>
                    Start Building Your Resume
                  </h3>

                  <p>
                    Fill in your information on the left
                    and your resume will appear here.
                  </p>

                </div>

              )}

          </div>

        </div>

      </div>

    </div>
  );
}