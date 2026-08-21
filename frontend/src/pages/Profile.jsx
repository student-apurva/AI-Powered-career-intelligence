// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import "../styles/Profile.css";
// import { useNavigate } from "react-router-dom";

// const API = "http://localhost:8001";

// export default function Profile() {
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);

//   // ==========================================
//   // STATE
//   // ==========================================

//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     github: "",
//     linkedin: "",
//     location: "",
//   });

//   const [completion, setCompletion] = useState(0);

//   const [skills, setSkills] = useState([]);
//   const [skill, setSkill] = useState("");

//   const [resume, setResume] = useState(null);

//   const [educationList, setEducationList] = useState([""]);
//   const [experienceList, setExperienceList] = useState([""]);
//   const [projectList, setProjectList] = useState([""]);
//   const [certificateList, setCertificateList] = useState([""]);

//   // ==========================================
//   // AUTH HEADERS
//   // ==========================================

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("token");

//     return {
//       Authorization: `Bearer ${token}`,
//     };
//   };

//   // ==========================================
//   // LOAD PROFILE
//   // ==========================================

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     fetchProfile();
//     fetchCompletion();
//   }, []);

//   // ==========================================
//   // APPLY PARSED RESUME DATA
//   // ==========================================

//   const applyParsed = (data = {}) => {
//     const personal = data.personal_information || {};
//     const sections = data.sections || {};

//     const updatedProfile = {
//       name: personal.name || "",
//       email: personal.email || "",
//       phone: personal.phone || "",
//       github: personal.github || "",
//       linkedin: personal.linkedin || "",
//       location: personal.location || "",
//     };

//     setProfile(updatedProfile);

//     // Skills
//     setSkills(
//       Array.isArray(data.skills)
//         ? data.skills
//         : []
//     );

//     // Education
//     setEducationList(
//       Array.isArray(sections.education) &&
//         sections.education.length > 0
//         ? sections.education
//         : sections.education
//           ? [sections.education]
//           : [""]
//     );

//     // Experience
//     setExperienceList(
//       Array.isArray(sections.experience) &&
//         sections.experience.length > 0
//         ? sections.experience
//         : sections.experience
//           ? [sections.experience]
//           : [""]
//     );

//     // Projects
//     setProjectList(
//       Array.isArray(sections.projects) &&
//         sections.projects.length > 0
//         ? sections.projects
//         : sections.projects
//           ? [sections.projects]
//           : [""]
//     );

//     // Certifications
//     setCertificateList(
//       Array.isArray(sections.certifications) &&
//         sections.certifications.length > 0
//         ? sections.certifications
//         : sections.certifications
//           ? [sections.certifications]
//           : [""]
//     );
//   };

//   // ==========================================
//   // FETCH PROFILE
//   // ==========================================

//   const fetchProfile = async () => {
//     try {
//       const res = await axios.get(
//         `${API}/profile/`,
//         {
//           headers: getAuthHeaders(),
//         }
//       );

//       applyParsed(res.data);

//       // Check logged-in user's resume
//       try {
//         const resumeRes = await axios.get(
//           `${API}/resume/`,
//           {
//             headers: getAuthHeaders(),
//           }
//         );

//         setResume({
//           name:
//             resumeRes.data.filename ||
//             "Resume.pdf",
//         });
//       } catch (resumeError) {
//         if (resumeError.response?.status === 404) {
//           setResume(null);
//         } else {
//           console.error(
//             "Resume fetch error:",
//             resumeError
//           );
//         }
//       }
//     } catch (err) {
//       console.error(
//         "Profile fetch error:",
//         err
//       );

//       if (err.response?.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");

//         navigate("/login");
//       }

//       // New user may not have a profile
//       if (err.response?.status === 404) {
//         setResume(null);
//       }
//     }
//   };

//   // ==========================================
//   // FETCH COMPLETION
//   // ==========================================

//   const fetchCompletion = async () => {
//     try {
//       const res = await axios.get(
//         `${API}/profile/completion`,
//         {
//           headers: getAuthHeaders(),
//         }
//       );

//       const value =
//         res.data.completion ??
//         res.data.completion_percentage ??
//         0;

//       setCompletion(
//         Math.min(value, 100)
//       );
//     } catch (err) {
//       console.error(
//         "Completion error:",
//         err
//       );
//     }
//   };

//   // ==========================================
//   // INPUT CHANGE
//   // ==========================================

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setProfile((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   // ==========================================
//   // UPLOAD RESUME
//   // ==========================================

//   const uploadResume = async (file) => {
//     const formData = new FormData();

//     formData.append("file", file);

//     try {
//       const res = await axios.post(
//         `${API}/resume/upload`,
//         formData,
//         {
//           headers: {
//             ...getAuthHeaders(),
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       applyParsed(
//         res.data.parsed_data || {}
//       );

//       setResume({
//         name:
//           res.data.filename ||
//           file.name,
//       });

//       await fetchCompletion();

//       alert(
//         "Resume uploaded successfully"
//       );
//     } catch (err) {
//       console.error(
//         "Upload error:",
//         err
//       );

//       if (err.response?.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");

//         navigate("/login");
//         return;
//       }

//       alert(
//         err.response?.data?.detail ||
//           "Resume upload failed"
//       );
//     }
//   };

//   // ==========================================
//   // HANDLE FILE SELECTION
//   // ==========================================

//   const handleResumeUpload = (e) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     const allowedExtensions = [
//       ".pdf",
//       ".doc",
//       ".docx",
//     ];

//     const extension =
//       "." +
//       file.name
//         .split(".")
//         .pop()
//         .toLowerCase();

//     if (
//       !allowedExtensions.includes(extension)
//     ) {
//       alert(
//         "Only PDF, DOC and DOCX files are allowed"
//       );

//       e.target.value = "";
//       return;
//     }

//     const maxSize =
//       5 * 1024 * 1024;

//     if (file.size > maxSize) {
//       alert(
//         "Resume must be less than 5 MB"
//       );

//       e.target.value = "";
//       return;
//     }

//     uploadResume(file);

//     e.target.value = "";
//   };

//   // ==========================================
//   // VIEW RESUME
//   // ==========================================

//   const viewResume = async () => {
//     try {
//       const response = await axios.get(
//         `${API}/resume/view`,
//         {
//           headers: getAuthHeaders(),
//           responseType: "blob",
//         }
//       );

//       const fileURL =
//         URL.createObjectURL(
//           response.data
//         );

//       window.open(
//         fileURL,
//         "_blank"
//       );

//       setTimeout(() => {
//         URL.revokeObjectURL(
//           fileURL
//         );
//       }, 60000);
//     } catch (err) {
//       console.error(
//         "View resume error:",
//         err
//       );

//       alert(
//         err.response?.data?.detail ||
//           "Unable to view resume"
//       );
//     }
//   };

//   // ==========================================
//   // REPLACE RESUME
//   // ==========================================

//   const replaceResume = () => {
//     fileInputRef.current?.click();
//   };

//   // ==========================================
//   // DELETE RESUME
//   // ==========================================

//   const deleteResume = async () => {
//     const confirmDelete =
//       window.confirm(
//         "Are you sure you want to delete your resume?"
//       );

//     if (!confirmDelete) return;

//     try {
//       await axios.delete(
//         `${API}/resume/`,
//         {
//           headers: getAuthHeaders(),
//         }
//       );

//       setResume(null);

//       setProfile({
//         name: "",
//         email: "",
//         phone: "",
//         github: "",
//         linkedin: "",
//         location: "",
//       });

//       setSkills([]);
//       setSkill("");

//       setEducationList([""]);
//       setExperienceList([""]);
//       setProjectList([""]);
//       setCertificateList([""]);

//       setCompletion(0);

//       alert(
//         "Resume deleted successfully"
//       );
//     } catch (err) {
//       console.error(
//         "Delete resume error:",
//         err
//       );

//       alert(
//         err.response?.data?.detail ||
//           "Failed to delete resume"
//       );
//     }
//   };

//   // ==========================================
//   // SKILLS
//   // ==========================================

//   const addSkill = () => {
//     const newSkill =
//       skill.trim();

//     if (!newSkill) return;

//     const alreadyExists =
//       skills.some(
//         (item) =>
//           item.toLowerCase() ===
//           newSkill.toLowerCase()
//       );

//     if (alreadyExists) {
//       alert(
//         "Skill already added"
//       );

//       return;
//     }

//     setSkills([
//       ...skills,
//       newSkill,
//     ]);

//     setSkill("");
//   };

//   const removeSkill = (index) => {
//     setSkills(
//       skills.filter(
//         (_, currentIndex) =>
//           currentIndex !== index
//       )
//     );
//   };

//   // ==========================================
//   // EDUCATION
//   // ==========================================

//   const addEducation = () => {
//     setEducationList([
//       ...educationList,
//       "",
//     ]);
//   };

//   const removeEducation = (index) => {
//     const updated =
//       educationList.filter(
//         (_, currentIndex) =>
//           currentIndex !== index
//       );

//     setEducationList(
//       updated.length
//         ? updated
//         : [""]
//     );
//   };

//   const updateEducation = (
//     index,
//     value
//   ) => {
//     const updated = [
//       ...educationList,
//     ];

//     updated[index] = value;

//     setEducationList(updated);
//   };

//   // ==========================================
//   // EXPERIENCE
//   // ==========================================

//   const addExperience = () => {
//     setExperienceList([
//       ...experienceList,
//       "",
//     ]);
//   };

//   const removeExperience = (
//     index
//   ) => {
//     const updated =
//       experienceList.filter(
//         (_, currentIndex) =>
//           currentIndex !== index
//       );

//     setExperienceList(
//       updated.length
//         ? updated
//         : [""]
//     );
//   };

//   const updateExperience = (
//     index,
//     value
//   ) => {
//     const updated = [
//       ...experienceList,
//     ];

//     updated[index] = value;

//     setExperienceList(updated);
//   };

//   // ==========================================
//   // PROJECTS
//   // ==========================================

//   const addProject = () => {
//     setProjectList([
//       ...projectList,
//       "",
//     ]);
//   };

//   const removeProject = (
//     index
//   ) => {
//     const updated =
//       projectList.filter(
//         (_, currentIndex) =>
//           currentIndex !== index
//       );

//     setProjectList(
//       updated.length
//         ? updated
//         : [""]
//     );
//   };

//   const updateProject = (
//     index,
//     value
//   ) => {
//     const updated = [
//       ...projectList,
//     ];

//     updated[index] = value;

//     setProjectList(updated);
//   };

//   // ==========================================
//   // CERTIFICATIONS
//   // ==========================================

//   const addCertificate = () => {
//     setCertificateList([
//       ...certificateList,
//       "",
//     ]);
//   };

//   const removeCertificate = (
//     index
//   ) => {
//     const updated =
//       certificateList.filter(
//         (_, currentIndex) =>
//           currentIndex !== index
//       );

//     setCertificateList(
//       updated.length
//         ? updated
//         : [""]
//     );
//   };

//   const updateCertificate = (
//     index,
//     value
//   ) => {
//     const updated = [
//       ...certificateList,
//     ];

//     updated[index] = value;

//     setCertificateList(updated);
//   };

//   // ==========================================
//   // VALIDATION
//   // ==========================================

//   const validateProfile = () => {
//     if (!profile.name.trim()) {
//       return "Name is required";
//     }

//     if (!profile.email.trim()) {
//       return "Email is required";
//     }

//     if (!profile.phone.trim()) {
//       return "Phone is required";
//     }

//     if (!profile.location.trim()) {
//       return "Location is required";
//     }

//     if (!profile.github.trim()) {
//       return "GitHub is required";
//     }

//     if (!profile.linkedin.trim()) {
//       return "LinkedIn is required";
//     }

//     const hasEducation =
//       educationList.some(
//         (item) =>
//           item.trim()
//       );

//     if (!hasEducation) {
//       return "Education is required";
//     }

//     if (skills.length === 0) {
//       return "Add at least one skill";
//     }

//     return null;
//   };

//   // ==========================================
//   // SAVE PROFILE
//   // ==========================================

//   const saveProfile = async () => {
//     const error =
//       validateProfile();

//     if (error) {
//       alert(error);
//       return;
//     }

//     try {
//       await axios.post(
//         `${API}/profile/`,
//         {
//           ...profile,

//           skills,

//           education:
//             educationList.filter(
//               (item) =>
//                 item.trim()
//             ),

//           experience:
//             experienceList.filter(
//               (item) =>
//                 item.trim()
//             ),

//           projects:
//             projectList.filter(
//               (item) =>
//                 item.trim()
//             ),

//           certifications:
//             certificateList.filter(
//               (item) =>
//                 item.trim()
//             ),
//         },
//         {
//           headers:
//             getAuthHeaders(),
//         }
//       );

//       await fetchCompletion();

//       alert(
//         "Profile Saved Successfully"
//       );

//       navigate(
//         "/dashboard"
//       );
//     } catch (err) {
//       console.error(
//         "Save profile error:",
//         err
//       );

//       if (err.response?.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");

//         navigate("/login");
//         return;
//       }

//       alert(
//         err.response?.data?.detail ||
//           "Failed to save profile"
//       );
//     }
//   };

//   // ==========================================
//   // LOGOUT
//   // ==========================================

//   const handleLogout = () => {
//     localStorage.removeItem(
//       "token"
//     );

//     localStorage.removeItem(
//       "user"
//     );

//     navigate("/login");
//   };

//   // ==========================================
//   // UI
//   // ==========================================

//   return (
//     <div className="profile-layout">

//       {/* ======================================
//           SIDEBAR
//       ====================================== */}

//       <aside className="profile-sidebar">

//         <h1 className="sidebar-logo">
//           Ascendra AI
//         </h1>

//         <div className="sidebar-menu">

//           {/* Dashboard */}

//           <button
//             type="button"
//             className="sidebar-item"
//             onClick={() =>
//               navigate("/dashboard")
//             }
//           >
//             <span className="sidebar-icon">
//               🏠
//             </span>

//             <span>
//               Dashboard
//             </span>
//           </button>

//           {/* Profile */}

//           <button
//             type="button"
//             className="sidebar-item active"
//             onClick={() =>
//               navigate("/profile")
//             }
//           >
//             <span className="sidebar-icon">
//               👤
//             </span>

//             <span>
//               Profile
//             </span>
//           </button>

//         </div>

//         {/* Logout */}

//         <button
//           type="button"
//           className="sidebar-logout"
//           onClick={handleLogout}
//         >
//           <span>
//             🚪
//           </span>

//           <span>
//             Logout
//           </span>
//         </button>

//       </aside>


//       {/* ======================================
//           PROFILE MAIN CONTENT
//       ====================================== */}

//       <main className="profile-main">

//         <div className="profile-page">

//           {/* Hidden Resume Input */}

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept=".pdf,.doc,.docx"
//             style={{
//               display: "none",
//             }}
//             onChange={
//               handleResumeUpload
//             }
//           />


//           {/* ==================================
//               RESUME
//           ================================== */}

//           <div className="card resume-card">

//             <h2>
//               Resume
//             </h2>

//             {!resume ? (
//               <>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     fileInputRef.current?.click()
//                   }
//                 >
//                   Upload Resume
//                 </button>

//                 <p className="resume-note">
//                   PDF, DOC, DOCX
//                   (Max 5 MB)
//                 </p>

//               </>
//             ) : (
//               <div className="resume-file">

//                 <span
//                   className="resume-name"
//                   onClick={
//                     viewResume
//                   }
//                 >
//                   📄 {resume.name}
//                 </span>

//                 <div className="resume-actions">

//                   <button
//                     type="button"
//                     className="view-btn"
//                     onClick={
//                       viewResume
//                     }
//                   >
//                     View
//                   </button>

//                   <button
//                     type="button"
//                     className="replace-btn"
//                     onClick={
//                       replaceResume
//                     }
//                   >
//                     Replace
//                   </button>

//                   <button
//                     type="button"
//                     className="delete-btn"
//                     onClick={
//                       deleteResume
//                     }
//                   >
//                     Delete
//                   </button>

//                 </div>

//               </div>
//             )}

//           </div>


//           {/* ==================================
//               PROFILE COMPLETION
//           ================================== */}

//           <div className="card">

//             <h2>
//               Profile Completion
//             </h2>

//             <div className="progress">

//               <div
//                 className="progress-bar"
//                 style={{
//                   width: `${Math.min(
//                     completion,
//                     100
//                   )}%`,
//                 }}
//               >
//                 {completion}%
//               </div>

//             </div>

//           </div>


//           <h1 className="edit-profile-title">
//             Edit Profile
//           </h1>


//           {/* ==================================
//               PERSONAL INFORMATION
//           ================================== */}

//           <div className="card">

//             <h2>
//               Personal Information
//             </h2>

//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               value={profile.name}
//               onChange={handleChange}
//             />

//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={profile.email}
//               onChange={handleChange}
//             />

//             <input
//               type="text"
//               name="phone"
//               placeholder="Phone"
//               value={profile.phone}
//               onChange={handleChange}
//             />

//             <input
//               type="text"
//               name="location"
//               placeholder="Location"
//               value={profile.location}
//               onChange={handleChange}
//             />

//             <input
//               type="url"
//               name="github"
//               placeholder="GitHub"
//               value={profile.github}
//               onChange={handleChange}
//             />

//             <input
//               type="url"
//               name="linkedin"
//               placeholder="LinkedIn"
//               value={profile.linkedin}
//               onChange={handleChange}
//             />

//           </div>


//           {/* ==================================
//               SKILLS
//           ================================== */}

//           <div className="card">

//             <h2>
//               Skills
//             </h2>

//             <div className="skill-box">

//               <input
//                 type="text"
//                 placeholder="Add Skill"
//                 value={skill}
//                 onChange={(e) =>
//                   setSkill(
//                     e.target.value
//                   )
//                 }
//                 onKeyDown={(e) => {
//                   if (
//                     e.key ===
//                     "Enter"
//                   ) {
//                     e.preventDefault();

//                     addSkill();
//                   }
//                 }}
//               />

//               <button
//                 type="button"
//                 onClick={addSkill}
//               >
//                 Add Skill
//               </button>

//             </div>

//             <div className="skill-list">

//               {skills.map(
//                 (item, index) => (
//                   <span
//                     className="skill-chip"
//                     key={`${item}-${index}`}
//                   >

//                     {item}

//                     <button
//                       type="button"
//                       className="remove-skill"
//                       onClick={() =>
//                         removeSkill(
//                           index
//                         )
//                       }
//                     >
//                       ×
//                     </button>

//                   </span>
//                 )
//               )}

//             </div>

//           </div>


//           {/* ==================================
//               EDUCATION
//           ================================== */}

//           <div className="card">

//             <h2>
//               Education
//             </h2>

//             {educationList.map(
//               (
//                 education,
//                 index
//               ) => (
//                 <div
//                   className="dynamic-item"
//                   key={index}
//                 >

//                   <textarea
//                     rows={5}
//                     value={
//                       education
//                     }
//                     placeholder="Enter Education"
//                     onChange={(e) =>
//                       updateEducation(
//                         index,
//                         e.target.value
//                       )
//                     }
//                   />

//                   <div className="dynamic-buttons">

//                     <button
//                       type="button"
//                       onClick={
//                         addEducation
//                       }
//                     >
//                       Add
//                     </button>

//                     {educationList.length >
//                       1 && (
//                       <button
//                         type="button"
//                         onClick={() =>
//                           removeEducation(
//                             index
//                           )
//                         }
//                       >
//                         Delete
//                       </button>
//                     )}

//                   </div>

//                 </div>
//               )
//             )}

//           </div>


//           {/* ==================================
//               EXPERIENCE
//           ================================== */}

//           <div className="card">

//             <h2>
//               Experience
//             </h2>

//             {experienceList.map(
//               (
//                 experience,
//                 index
//               ) => (
//                 <div
//                   className="dynamic-item"
//                   key={index}
//                 >

//                   <textarea
//                     rows={5}
//                     value={
//                       experience
//                     }
//                     placeholder="Enter Experience"
//                     onChange={(e) =>
//                       updateExperience(
//                         index,
//                         e.target.value
//                       )
//                     }
//                   />

//                   <div className="dynamic-buttons">

//                     <button
//                       type="button"
//                       onClick={
//                         addExperience
//                       }
//                     >
//                       Add
//                     </button>

//                     {experienceList.length >
//                       1 && (
//                       <button
//                         type="button"
//                         onClick={() =>
//                           removeExperience(
//                             index
//                           )
//                         }
//                       >
//                         Delete
//                       </button>
//                     )}

//                   </div>

//                 </div>
//               )
//             )}

//           </div>


//           {/* ==================================
//               PROJECTS
//           ================================== */}

//           <div className="card">

//             <h2>
//               Projects
//             </h2>

//             {projectList.map(
//               (
//                 project,
//                 index
//               ) => (
//                 <div
//                   className="dynamic-item"
//                   key={index}
//                 >

//                   <textarea
//                     rows={5}
//                     value={
//                       project
//                     }
//                     placeholder="Enter Project"
//                     onChange={(e) =>
//                       updateProject(
//                         index,
//                         e.target.value
//                       )
//                     }
//                   />

//                   <div className="dynamic-buttons">

//                     <button
//                       type="button"
//                       onClick={
//                         addProject
//                       }
//                     >
//                       Add
//                     </button>

//                     {projectList.length >
//                       1 && (
//                       <button
//                         type="button"
//                         onClick={() =>
//                           removeProject(
//                             index
//                           )
//                         }
//                       >
//                         Delete
//                       </button>
//                     )}

//                   </div>

//                 </div>
//               )
//             )}

//           </div>


//           {/* ==================================
//               CERTIFICATIONS
//           ================================== */}

//           <div className="card">

//             <h2>
//               Certifications
//             </h2>

//             {certificateList.map(
//               (
//                 certificate,
//                 index
//               ) => (
//                 <div
//                   className="dynamic-item"
//                   key={index}
//                 >

//                   <textarea
//                     rows={5}
//                     value={
//                       certificate
//                     }
//                     placeholder="Enter Certification"
//                     onChange={(e) =>
//                       updateCertificate(
//                         index,
//                         e.target.value
//                       )
//                     }
//                   />

//                   <div className="dynamic-buttons">

//                     <button
//                       type="button"
//                       onClick={
//                         addCertificate
//                       }
//                     >
//                       Add
//                     </button>

//                     {certificateList.length >
//                       1 && (
//                       <button
//                         type="button"
//                         onClick={() =>
//                           removeCertificate(
//                             index
//                           )
//                         }
//                       >
//                         Delete
//                       </button>
//                     )}

//                   </div>

//                 </div>
//               )
//             )}

//           </div>


//           {/* ==================================
//               SAVE PROFILE
//           ================================== */}

//           <div className="save-section">

//             <button
//               type="button"
//               className="save-btn"
//               onClick={
//                 saveProfile
//               }
//             >
//               Save Profile
//             </button>

//           </div>

//         </div>

//       </main>

//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaHome,
  FaSignOutAlt,
  FaFileAlt,
  FaUpload,
  FaEye,
  FaSyncAlt,
  FaTrashAlt,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaProjectDiagram,
  FaCertificate,
  FaPlus,
  FaTimes,
  FaSave,
  FaCheckCircle,
} from "react-icons/fa";

import "../styles/Profile.css";
import Sidebar from "./Sidebar";

const API = "http://localhost:8000";

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // =====================================================
  // STATE
  // =====================================================

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    location: "",
  });

  const [completion, setCompletion] = useState(0);

  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState("");

  const [resume, setResume] = useState(null);

  const [educationList, setEducationList] = useState([""]);
  const [experienceList, setExperienceList] = useState([""]);
  const [projectList, setProjectList] = useState([""]);
  const [certificateList, setCertificateList] = useState([""]);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // AUTH
  // =====================================================

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchProfile();
    fetchCompletion();
  }, []);

  // =====================================================
  // APPLY PARSED DATA
  // =====================================================

  const applyParsed = (data = {}) => {
    const personal = data.personal_information || {};
    const sections = data.sections || {};

    setProfile({
      name: personal.name || "",
      email: personal.email || "",
      phone: personal.phone || "",
      github: personal.github || "",
      linkedin: personal.linkedin || "",
      location: personal.location || "",
    });

    setSkills(Array.isArray(data.skills) ? data.skills : []);

    setEducationList(
      Array.isArray(sections.education) && sections.education.length
        ? sections.education
        : sections.education
          ? [sections.education]
          : [""]
    );

    setExperienceList(
      Array.isArray(sections.experience) && sections.experience.length
        ? sections.experience
        : sections.experience
          ? [sections.experience]
          : [""]
    );

    setProjectList(
      Array.isArray(sections.projects) && sections.projects.length
        ? sections.projects
        : sections.projects
          ? [sections.projects]
          : [""]
    );

    setCertificateList(
      Array.isArray(sections.certifications) &&
        sections.certifications.length
        ? sections.certifications
        : sections.certifications
          ? [sections.certifications]
          : [""]
    );
  };

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API}/profile/`, {
        headers: getAuthHeaders(),
      });

      applyParsed(response.data);

      try {
        const resumeResponse = await axios.get(`${API}/resume/`, {
          headers: getAuthHeaders(),
        });

        setResume({
          name: resumeResponse.data.filename || "Resume.pdf",
        });
      } catch (resumeError) {
        if (resumeError.response?.status === 404) {
          setResume(null);
        } else {
          console.error("Resume fetch error:", resumeError);
        }
      }
    } catch (error) {
      console.error("Profile fetch error:", error);

      if (error.response?.status === 401) {
        logout();
      }

      if (error.response?.status === 404) {
        setResume(null);
      }
    }
  };

  // =====================================================
  // FETCH COMPLETION
  // =====================================================

  const fetchCompletion = async () => {
    try {
      const response = await axios.get(`${API}/profile/completion`, {
        headers: getAuthHeaders(),
      });

      const value =
        response.data.completion ??
        response.data.completion_percentage ??
        0;

      setCompletion(Math.min(value, 100));
    } catch (error) {
      console.error("Completion error:", error);
    }
  };

  // =====================================================
  // PERSONAL INFORMATION
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // RESUME UPLOAD
  // =====================================================

  const uploadResume = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    try {
      setUploading(true);

      const response = await axios.post(
        `${API}/resume/upload`,
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      applyParsed(response.data.parsed_data || {});

      setResume({
        name: response.data.filename || file.name,
      });

      await fetchCompletion();

      alert("Resume uploaded successfully");
    } catch (error) {
      console.error("Resume upload error:", error);

      if (error.response?.status === 401) {
        logout();
        return;
      }

      alert(
        error.response?.data?.detail ||
          "Resume upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const extension = `.${file.name
      .split(".")
      .pop()
      .toLowerCase()}`;

    const allowedExtensions = [".pdf", ".doc", ".docx"];

    if (!allowedExtensions.includes(extension)) {
      alert("Only PDF, DOC and DOCX files are allowed.");
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Resume must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    uploadResume(file);

    event.target.value = "";
  };

  // =====================================================
  // VIEW RESUME
  // =====================================================

  const viewResume = async () => {
    try {
      const response = await axios.get(`${API}/resume/view`, {
        headers: getAuthHeaders(),
        responseType: "blob",
      });

      const fileURL = URL.createObjectURL(response.data);

      window.open(fileURL, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(fileURL);
      }, 60000);
    } catch (error) {
      console.error("View resume error:", error);

      alert(
        error.response?.data?.detail ||
          "Unable to view resume"
      );
    }
  };

  // =====================================================
  // REPLACE RESUME
  // =====================================================

  const replaceResume = () => {
    fileInputRef.current?.click();
  };

  // =====================================================
  // DELETE RESUME
  // =====================================================

  const deleteResume = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your resume?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API}/resume/`, {
        headers: getAuthHeaders(),
      });

      setResume(null);

      setProfile({
        name: "",
        email: "",
        phone: "",
        github: "",
        linkedin: "",
        location: "",
      });

      setSkills([]);
      setSkill("");

      setEducationList([""]);
      setExperienceList([""]);
      setProjectList([""]);
      setCertificateList([""]);

      setCompletion(0);

      alert("Resume deleted successfully");
    } catch (error) {
      console.error("Delete resume error:", error);

      alert(
        error.response?.data?.detail ||
          "Failed to delete resume"
      );
    }
  };

  // =====================================================
  // SKILLS
  // =====================================================

  const addSkill = () => {
    const newSkill = skill.trim();

    if (!newSkill) return;

    const exists = skills.some(
      (item) =>
        item.toLowerCase() === newSkill.toLowerCase()
    );

    if (exists) {
      alert("Skill already added");
      return;
    }

    setSkills((previous) => [...previous, newSkill]);

    setSkill("");
  };

  const removeSkill = (index) => {
    setSkills((previous) =>
      previous.filter(
        (_, currentIndex) => currentIndex !== index
      )
    );
  };

  // =====================================================
  // EDUCATION
  // =====================================================

  const addEducation = () => {
    setEducationList((previous) => [...previous, ""]);
  };

  const updateEducation = (index, value) => {
    setEducationList((previous) => {
      const updated = [...previous];

      updated[index] = value;

      return updated;
    });
  };

  const removeEducation = (index) => {
    setEducationList((previous) => {
      const updated = previous.filter(
        (_, currentIndex) => currentIndex !== index
      );

      return updated.length ? updated : [""];
    });
  };

  // =====================================================
  // EXPERIENCE
  // =====================================================

  const addExperience = () => {
    setExperienceList((previous) => [...previous, ""]);
  };

  const updateExperience = (index, value) => {
    setExperienceList((previous) => {
      const updated = [...previous];

      updated[index] = value;

      return updated;
    });
  };

  const removeExperience = (index) => {
    setExperienceList((previous) => {
      const updated = previous.filter(
        (_, currentIndex) => currentIndex !== index
      );

      return updated.length ? updated : [""];
    });
  };

  // =====================================================
  // PROJECTS
  // =====================================================

  const addProject = () => {
    setProjectList((previous) => [...previous, ""]);
  };

  const updateProject = (index, value) => {
    setProjectList((previous) => {
      const updated = [...previous];

      updated[index] = value;

      return updated;
    });
  };

  const removeProject = (index) => {
    setProjectList((previous) => {
      const updated = previous.filter(
        (_, currentIndex) => currentIndex !== index
      );

      return updated.length ? updated : [""];
    });
  };

  // =====================================================
  // CERTIFICATIONS
  // =====================================================

  const addCertificate = () => {
    setCertificateList((previous) => [...previous, ""]);
  };

  const updateCertificate = (index, value) => {
    setCertificateList((previous) => {
      const updated = [...previous];

      updated[index] = value;

      return updated;
    });
  };

  const removeCertificate = (index) => {
    setCertificateList((previous) => {
      const updated = previous.filter(
        (_, currentIndex) => currentIndex !== index
      );

      return updated.length ? updated : [""];
    });
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateProfile = () => {
    if (!profile.name.trim()) return "Name is required";

    if (!profile.email.trim()) return "Email is required";

    if (!profile.phone.trim()) return "Phone is required";

    if (!profile.location.trim()) return "Location is required";

    if (!profile.github.trim()) return "GitHub is required";

    if (!profile.linkedin.trim()) return "LinkedIn is required";

    if (!educationList.some((item) => item.trim())) {
      return "Education is required";
    }

    if (skills.length === 0) {
      return "Add at least one skill";
    }

    return null;
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const saveProfile = async () => {
    const error = validateProfile();

    if (error) {
      alert(error);
      return;
    }

    try {
      setSaving(true);

      await axios.post(
        `${API}/profile/`,
        {
          ...profile,

          skills,

          education: educationList.filter((item) =>
            item.trim()
          ),

          experience: experienceList.filter((item) =>
            item.trim()
          ),

          projects: projectList.filter((item) =>
            item.trim()
          ),

          certifications: certificateList.filter((item) =>
            item.trim()
          ),
        },
        {
          headers: getAuthHeaders(),
        }
      );

      await fetchCompletion();

      alert("Profile Saved Successfully");

      // navigate("/dashboard-analytics");
    } catch (error) {
      console.error("Save profile error:", error);

      if (error.response?.status === 401) {
        logout();
        return;
      }

      alert(
        error.response?.data?.detail ||
          "Failed to save profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =====================================================
  // INITIALS
  // =====================================================

  const getInitials = () => {
    if (!profile.name.trim()) return "U";

    const names = profile.name.trim().split(/\s+/);

    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return (
      names[0].charAt(0) +
      names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="profile-app">

      {/* ================= SIDEBAR ================= */}

      <Sidebar />


      {/* ================= MAIN ================= */}

      <main className="profile-main">

        {/* Top Header */}

        <header className="profile-topbar">

          <div>
            <p className="page-eyebrow">
              ACCOUNT
            </p>

            <h1>My Profile</h1>

            
          </div>

          <button
            type="button"
            className="top-save-button"
            onClick={saveProfile}
            disabled={saving}
          >
            <FaSave />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </header>


        {/* ================= PROFILE HERO ================= */}

        <section className="profile-hero">

          <div className="profile-hero-user">

            <div className="large-avatar">
              {getInitials()}
            </div>

            <div className="hero-user-details">

              <div className="hero-title-row">
                <h2>
                  {profile.name || "Complete Your Profile"}
                </h2>

                {completion >= 80 && (
                  <FaCheckCircle className="verified-icon" />
                )}
              </div>

              <p>
                {profile.email ||
                  "Upload your resume to automatically fill your information."}
              </p>

              {profile.location && (
                <span className="hero-location">
                  <FaMapMarkerAlt />
                  {profile.location}
                </span>
              )}

            </div>

          </div>


          <div className="completion-panel">

            <div className="completion-text">

              <div>
                <span>Profile completion</span>

                <strong>
                  {completion}%
                </strong>
              </div>

              <p>
                {completion === 100
                  ? "Your profile is complete."
                  : "Complete your profile to improve career insights."}
              </p>

            </div>

            <div className="modern-progress">

              <div
                className="modern-progress-value"
                style={{
                  width: `${Math.min(completion, 100)}%`,
                }}
              />

            </div>

          </div>

        </section>


        {/* Hidden File Input */}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          hidden
          onChange={handleResumeUpload}
        />


        {/* ================= CONTENT GRID ================= */}

        <div className="profile-content-grid">

          {/* ================= LEFT ================= */}

          <div className="profile-content-left">

            {/* Resume */}

            <section className="profile-section resume-section">

              <div className="section-heading">

                <div className="section-icon">
                  <FaFileAlt />
                </div>

                <div>
                  <h2>Resume</h2>
                </div>

              </div>


              {!resume ? (

                <div
                  className={`resume-dropzone ${
                    uploading ? "uploading" : ""
                  }`}
                  onClick={() => {
                    if (!uploading) {
                      fileInputRef.current?.click();
                    }
                  }}
                >

                  <div className="dropzone-icon">
                    <FaUpload />
                  </div>

                  <h3>
                    {uploading
                      ? "Processing your resume..."
                      : "Upload your resume"}
                  </h3>

                  <p>
                    {uploading
                      ? "Please wait while your profile is being prepared."
                      : "Choose your PDF, DOC or DOCX resume"}
                  </p>

                  <span>
                    Maximum file size: 5 MB
                  </span>

                  {!uploading && (
                    <button type="button">
                      <FaUpload />
                      Browse File
                    </button>
                  )}

                  {uploading && (
                    <div className="upload-loader" />
                  )}

                </div>

              ) : (

                <div className="uploaded-resume">

                  <div className="resume-file-left">

                    <div className="resume-pdf-icon">
                      <FaFileAlt />
                    </div>

                    <div>
                      <strong>
                        {resume.name}
                      </strong>

                      <span>
                        Resume attached to your profile
                      </span>
                    </div>

                  </div>


                  <div className="resume-button-group">

                    <button
                      type="button"
                      className="resume-action view"
                      onClick={viewResume}
                    >
                      <FaEye />
                      View
                    </button>

                    <button
                      type="button"
                      className="resume-action replace"
                      onClick={replaceResume}
                    >
                      <FaSyncAlt />
                      Replace
                    </button>

                    <button
                      type="button"
                      className="resume-action delete"
                      onClick={deleteResume}
                    >
                      <FaTrashAlt />
                    </button>

                  </div>

                </div>

              )}

            </section>


            {/* Personal Information */}

            <section className="profile-section">

              <div className="section-heading">

                <div className="section-icon">
                  <FaUser />
                </div>

                <div>
                  <h2>Personal Information</h2>
            
                </div>

              </div>


              <div className="profile-form-grid">

                <div className="profile-field">
                  <label>Full Name</label>

                  <div className="input-with-icon">
                    <FaUser />

                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      placeholder="Enter your full name"
                      onChange={handleChange}
                    />
                  </div>
                </div>


                <div className="profile-field">
                  <label>Email Address</label>

                  <div className="input-with-icon">
                    <FaEnvelope />

                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      placeholder="Enter your email"
                      onChange={handleChange}
                    />
                  </div>
                </div>


                <div className="profile-field">
                  <label>Phone Number</label>

                  <div className="input-with-icon">
                    <FaPhoneAlt />

                    <input
                      type="text"
                      name="phone"
                      value={profile.phone}
                      placeholder="Enter phone number"
                      onChange={handleChange}
                    />
                  </div>
                </div>


                <div className="profile-field">
                  <label>Location</label>

                  <div className="input-with-icon">
                    <FaMapMarkerAlt />

                    <input
                      type="text"
                      name="location"
                      value={profile.location}
                      placeholder="City, State"
                      onChange={handleChange}
                    />
                  </div>
                </div>


                <div className="profile-field">
                  <label>GitHub</label>

                  <div className="input-with-icon">
                    <FaGithub />

                    <input
                      type="url"
                      name="github"
                      value={profile.github}
                      placeholder="GitHub profile URL"
                      onChange={handleChange}
                    />
                  </div>
                </div>


                <div className="profile-field">
                  <label>LinkedIn</label>

                  <div className="input-with-icon">
                    <FaLinkedin />

                    <input
                      type="url"
                      name="linkedin"
                      value={profile.linkedin}
                      placeholder="LinkedIn profile URL"
                      onChange={handleChange}
                    />
                  </div>
                </div>

              </div>

            </section>


            {/* Skills */}

            <section className="profile-section">

              <div className="section-heading">

                <div className="section-icon">
                  <FaCheckCircle />
                </div>

                <div>
                  <h2>Skills</h2>
                  
                </div>

              </div>


              <div className="add-skill-row">

                <input
                  type="text"
                  value={skill}
                  placeholder="e.g. React, Java, Python..."
                  onChange={(event) =>
                    setSkill(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={addSkill}
                >
                  <FaPlus />
                  Add Skill
                </button>

              </div>


              <div className="modern-skill-list">

                {skills.length === 0 && (
                  <p className="empty-text">
                    No skills added yet.
                  </p>
                )}

                {skills.map((item, index) => (
                  <span
                    className="modern-skill-chip"
                    key={`${item}-${index}`}
                  >
                    {item}

                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                    >
                      <FaTimes />
                    </button>

                  </span>
                ))}

              </div>

            </section>

          </div>


          {/* ================= RIGHT ================= */}

          <div className="profile-content-right">

            {/* Education */}

            <DynamicSection
              title="Education"
              icon={<FaGraduationCap />}
              items={educationList}
              placeholder="Degree, college, university, year, CGPA..."
              addText="Add Education"
              onAdd={addEducation}
              onUpdate={updateEducation}
              onRemove={removeEducation}
            />


            {/* Experience */}

            <DynamicSection
              title="Experience"
              icon={<FaBriefcase />}
              items={experienceList}
              placeholder="Company, role, duration and responsibilities..."
              addText="Add Experience"
              onAdd={addExperience}
              onUpdate={updateExperience}
              onRemove={removeExperience}
            />


            {/* Projects */}

            <DynamicSection
              title="Projects"

              icon={<FaProjectDiagram />}
              items={projectList}
              placeholder="Project name, technologies and description..."
              addText="Add Project"
              onAdd={addProject}
              onUpdate={updateProject}
              onRemove={removeProject}
            />


            {/* Certifications */}

            <DynamicSection
              title="Certifications"
              icon={<FaCertificate />}
              items={certificateList}
              placeholder="Certification name, organization and year..."
              addText="Add Certification"
              onAdd={addCertificate}
              onUpdate={updateCertificate}
              onRemove={removeCertificate}
            />

          </div>

        </div>


        {/* ================= BOTTOM SAVE ================= */}

        <div className="profile-save-footer">

          <div>
            <strong>Ready to update your profile?</strong>

            <span>
              Review your information before saving.
            </span>
          </div>

          <button
            type="button"
            onClick={saveProfile}
            disabled={saving}
          >
            <FaSave />

            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>

        </div>

      </main>

    </div>
  );
}


// =====================================================
// REUSABLE DYNAMIC SECTION
// =====================================================

function DynamicSection({
  title,
  description,
  icon,
  items,
  placeholder,
  addText,
  onAdd,
  onUpdate,
  onRemove,
}) {
  return (
    <section className="profile-section dynamic-section">

      <div className="section-heading">

        <div className="section-icon">
          {icon}
        </div>

        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

      </div>


      <div className="dynamic-list">

        {items.map((item, index) => (
          <div
            className="modern-dynamic-item"
            key={index}
          >

            <div className="dynamic-number">
              {index + 1}
            </div>

            <textarea
              value={item}
              placeholder={placeholder}
              rows={4}
              onChange={(event) =>
                onUpdate(index, event.target.value)
              }
            />

            {items.length > 1 && (
              <button
                type="button"
                className="dynamic-delete"
                title={`Delete ${title}`}
                onClick={() => onRemove(index)}
              >
                <FaTrashAlt />
              </button>
            )}

          </div>
        ))}

      </div>


      <button
        type="button"
        className="add-entry-button"
        onClick={onAdd}
      >
        <FaPlus />
        {addText}
      </button>

    </section>
  );
} 