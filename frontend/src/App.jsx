import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import ATSAnalysis from "./pages/ATSAnalysis";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile";
import CareerRecommendation from "./pages/CareerRecommendation";
import JobRecommendations from "./pages/JobRecommendations";
import SavedJobs from "./pages/SavedJobs";
import CourseRecommendations from "./pages/CourseRecommendations";
import ResumeImprovement from "./pages/ResumeImprovement";
import DashboardAnalytics from "./pages/DashboardAnalytics";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminProfiles from "./admin/AdminProfiles";
import AdminResumes from "./admin/AdminResumes";
import AdminATS from "./admin/AdminATS";
import AdminSkillAnalytics from "./admin/AdminSkillAnalytics";
import AdminJobs from "./admin/AdminJobs";
import AdminJobAnalytics from "./admin/AdminJobAnalytics";
import AdminActivity from "./admin/AdminActivity";
import AdminCareers from "./admin/AdminCareers";
import AdminCourses from "./admin/AdminCourses";
import AdminSystemStatus from "./admin/AdminSystemStatus";
import AdminLogin from "./admin/AdminLogin";
import AdminReports from "./admin/AdminReports";  
import ResumeBuilder from "./pages/ResumeBuilder";
import HelpChatbot from "../components/HelpChatbot";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/analyze" element={<ATSAnalysis />}/>
        <Route path="/career-recom" element={<CareerRecommendation />} />
        <Route path="/job-recommendations" element={<JobRecommendations />}/>
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/courses" element={<CourseRecommendations />} />
        <Route path="/resume-improvement" element={<ResumeImprovement />}/>
        <Route path="/dashboard-analytics" element={<DashboardAnalytics/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/profiles" element={<AdminProfiles />} />
        <Route path="/admin/resumes" element={<AdminResumes />} />
        <Route path="/admin/ats" element={<AdminATS />} />
        <Route path="/admin/skills" element={<AdminSkillAnalytics />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/job-analytics" element={<AdminJobAnalytics />} />
        <Route path="/admin/activity" element={<AdminActivity />}     />
       <Route
  path="/admin/careers"
  element={<AdminCareers />}
/>

<Route
  path="/admin/courses"
  element={<AdminCourses />}
/>

<Route
  path="/admin/system-status"
  element={<AdminSystemStatus />}
/>
<Route
  path="/admin/system"
  element={<AdminSystemStatus />}
/>

<Route
  path="/admin/system-status"
  element={<AdminSystemStatus />}
/>
<Route
  path="/admin/login"
  element={<AdminLogin />}
/>
<Route
  path="/admin/reports"
  element={<AdminReports />}
/>
<Route
  path="/resume-builder"
  element={<ResumeBuilder />}
/>
      </Routes>
      <HelpChatbot />
    </BrowserRouter>
  );
}

export default App;