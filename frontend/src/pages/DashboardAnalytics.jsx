import React, {
  useEffect,
  useState,
} from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from "recharts";
import axios from "axios";

import "../styles/DashboardAnalytics.css";

export default function DashboardAnalytics() {
    const [loading, setLoading] = useState(true);

const [error, setError] = useState("");

const [dashboard, setDashboard] = useState({

    profile:{},

    ats:{},

    resume:{},

    career:{},

    jobs:{},

    courses:{},

    statistics:{}

});
const getUser = () => {

    try {

        return JSON.parse(
            localStorage.getItem("user")
        );

    }

    catch {

        return null;

    }

};
console.log("Backend URL:", "http://127.0.0.1:8000/dashboard");
const fetchDashboard = async () => {

    try {

        setLoading(true);
const token = localStorage.getItem("token");

console.log("Token:", token);

const response = await axios.get(
    "http://127.0.0.1:8000/dashboard",
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
);


console.log(response.data); 

        setDashboard(response.data);

    }

    catch (err) {

        console.error(err);

        setError("Unable to load dashboard");

    }

    finally {

        setLoading(false);

    }

};
useEffect(() => {

    fetchDashboard();

}, []);
if (loading) {

    return (

        <div className="dashboard-loading">

            <h2>
                Loading Dashboard...
            </h2>

        </div>

    );

}
if (error) {

    return (

        <div className="dashboard-error">

            <h2>
                {error}
            </h2>

        </div>

    );

}
const skillData = [

    {
        name: "Matching",
        value: dashboard.ats?.matching_skills?.length || 0
    },

    {
        name: "Missing",
        value: dashboard.ats?.missing_skills?.length || 0
    }

];

const summaryData = [

    {
        name: "ATS",
        score: dashboard.ats?.score || 0
    },

    {
        name: "Resume",
        score: dashboard.resume?.score || 0
    },

    {
        name: "Profile",
        score: dashboard.profile?.completion || 0
    }

];

const COLORS = [

    "#168AAD",

    "#E53935"

];


   return (

    <div className="dashboard-page">

        {/* ==========================================
                Dashboard Header
        ========================================== */}

        <div className="dashboard-header">

            <div>

                <h1>

                    Welcome Back,

                    {" "}

                    {dashboard.user?.name} 👋

                </h1>

                <p>

                    Here's your complete AI Career Dashboard.

                </p>

            </div>

            <div className="dashboard-date">

                {new Date().toLocaleDateString(
                    "en-IN",
                    {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }
                )}

            </div>

        </div>
        {/* ==========================================
        Summary Cards
========================================== */}

<div className="summary-grid">

    {/* ATS */}

    <div className="summary-card">

        <div className="card-icon">
            🎯
        </div>

        <h4>
            ATS Score
        </h4>

        <h2>

            {
                dashboard.ats?.score || 0
            }

        </h2>

        <p>

            Current ATS Score

        </p>

    </div>

    {/* Resume */}

    <div className="summary-card">

        <div className="card-icon">
            📄
        </div>

        <h4>
            Resume Score
        </h4>

        <h2>

            {
                dashboard.resume?.score || 0
            }

        </h2>

        <p>

            {
                dashboard.resume?.status ||
                "Not Available"
            }

        </p>

    </div>

    {/* Profile */}

    <div className="summary-card">

        <div className="card-icon">
            👤
        </div>

        <h4>
            Profile Completion
        </h4>

        <h2>

            {
                dashboard.profile?.completion || 0
            }%

        </h2>

        <p>

            Profile Status

        </p>

    </div>

    {/* Jobs */}

    <div className="summary-card">

        <div className="card-icon">
            💼
        </div>

        <h4>
            Recommended Jobs
        </h4>

        <h2>

            {
                dashboard.statistics
                ?.recommended_jobs || 0
            }

        </h2>

        <p>

            AI Recommendations

        </p>

    </div>

</div>
{/* ==========================================
        Career Recommendations
========================================== */}

<section className="dashboard-section">

    <div className="section-header">

        <h2>
            Career Recommendations
        </h2>

        <span>

            {

                dashboard.statistics
                ?.recommended_careers || 0

            }

            {" "}Recommendations

        </span>

    </div>

    <div className="career-grid">

        {

            dashboard.career?.recommendations?.map(

                (career, index) => (

                    <div
                        key={index}
                        className="career-card"
                    >

                        <div className="career-icon">

                            💼

                        </div>

                        <div>

                            <h3>

                                {

                                    typeof career === "string"

                                        ? career

                                        : career.career ||
                                          career.title ||
                                          "Career"

                                }

                            </h3>

                            <p>

                                AI Recommended Career Path

                            </p>

                        </div>

                    </div>

                )

            )

        }

    </div>

</section>
{/* ==========================================
        Recommended Courses
========================================== */}

<section className="dashboard-section">

    <div className="section-header">

        <h2>

            Recommended Courses

        </h2>

        <span>

            {

                dashboard.statistics
                ?.recommended_courses || 0

            }

            {" "}Courses

        </span>

    </div>

    <div className="course-grid">

        {

            dashboard.courses?.recommendations?.map(

                (course, index) => (

                    <div
                        key={index}
                        className="course-card"
                    >

                        <div className="course-icon">

                            📚

                        </div>

                        <h3>

                            {

                                course.course ||
                                course.title ||
                                course

                            }

                        </h3>

                        <p>

                            AI Recommended Learning Path

                        </p>

                        <div className="course-footer">

                            <span className="course-level">

                                Beginner

                            </span>

                            <button
                                className="learn-btn"
                            >

                                Learn More

                            </button>

                        </div>

                    </div>

                )

            )

        }

    </div>

</section>
{/* ==========================================
        Resume Improvement
========================================== */}

<section className="dashboard-section">

    <div className="section-header">

        <h2>

            Resume Improvement

        </h2>

        <span>

            {

                dashboard.statistics
                ?.resume_improvements || 0

            }

            {" "}Suggestions

        </span>

    </div>

    <div className="resume-card">

        <div className="resume-score">

            <div className="score-circle">

                <h1>

                    {

                        dashboard.resume?.score || 0

                    }

                </h1>

                <span>

                    Score

                </span>

            </div>

        </div>

        <div className="resume-content">

            <h3>

                {

                    dashboard.resume?.status ||
                    "Resume Analysis"

                }

            </h3>

            <p>

                AI Resume Improvement Suggestions

            </p>

            <div className="improvement-list">

                {

                    dashboard.resume?.improvements?.length > 0 ?

                    dashboard.resume.improvements.map(

                        (item,index)=>(

                            <div
                                key={index}
                                className="improvement-item"
                            >

                                <span className="priority">

                                    {

                                        item.priority ||
                                        "Medium"

                                    }

                                </span>

                                <div>

                                    <strong>

                                        {

                                            item.category ||
                                            "Suggestion"

                                        }

                                    </strong>

                                    <p>

                                        {

                                            item.suggestion ||
                                            item

                                        }

                                    </p>

                                </div>

                            </div>

                        )

                    )

                    :

                    <p>

                        No resume suggestions available.

                    </p>

                }

            </div>

        </div>

    </div>

</section>
{/* ==========================================
        Dashboard Analytics
========================================== */}

<section className="dashboard-section">

    <div className="section-header">

        <h2>

            Skills Analytics

        </h2>

    </div>

    <div className="analytics-grid">

        {/* ATS */}

        <div className="analytics-card">

            <h3>

                ATS Score

            </h3>

            <div className="progress-bar">

                <div

                    className="progress-fill"

                    style={{

                        width: `${dashboard.ats?.score || 0}%`

                    }}

                />

            </div>

            <h2>

                {

                    dashboard.ats?.score || 0

                }%

            </h2>

        </div>

        {/* Matching Skills */}

        <div className="analytics-card">

            <h3>

                Matching Skills

            </h3>

            <h1>

                {

                    dashboard.ats
                    ?.matching_skills
                    ?.length || 0

                }

            </h1>

            <div className="skill-list">

                {

                    dashboard.ats
                    ?.matching_skills
                    ?.slice(0,6)
                    .map((skill,index)=>(

                        <span
                            key={index}
                            className="skill-chip success"
                        >

                            {skill}

                        </span>

                    ))

                }

            </div>

        </div>

        {/* Missing Skills */}

        <div className="analytics-card">

            <h3>

                Missing Skills

            </h3>

            <h1>

                {

                    dashboard.ats
                    ?.missing_skills
                    ?.length || 0

                }

            </h1>

            <div className="skill-list">

                {

                    dashboard.ats
                    ?.missing_skills
                    ?.slice(0,6)
                    .map((skill,index)=>(

                        <span
                            key={index}
                            className="skill-chip danger"
                        >

                            {skill}

                        </span>

                    ))

                }

            </div>

        </div>

    </div>

</section>
{/* ==========================================
        Charts
========================================== */}

<section className="dashboard-section">

    <div className="section-header">

        <h2>

            Performance Analytics

        </h2>

    </div>

    <div className="chart-grid">

        {/* Bar Chart */}

        <div className="chart-card">

            <h3>

                Overall Performance

            </h3>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <BarChart
                    data={summaryData}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                    />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Bar
                        dataKey="score"
                        fill="#168AAD"
                        radius={[8,8,0,0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

        {/* Pie Chart */}

        <div className="chart-card">

            <h3>

                Skill Distribution

            </h3>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <PieChart>

                    <Pie

                        data={skillData}

                        cx="50%"

                        cy="50%"

                        outerRadius={90}

                        dataKey="value"

                        label

                    >

                        {

                            skillData.map(

                                (entry,index)=>(

                                    <Cell

                                        key={index}

                                        fill={COLORS[index]}

                                    />

                                )

                            )

                        }

                    </Pie>

                    <Tooltip />

                </PieChart>

            </ResponsiveContainer>

        </div>

    </div>

</section>
{/* ==========================================
        Dashboard Insights
========================================== */}

<section className="dashboard-section">

    <div className="section-header">

        <h2>

            AI Career Insights

        </h2>

    </div>

    <div className="insights-grid">

        {/* Left */}

        <div className="insight-card">

            <h3>

                Career Progress

            </h3>

            <ul>

                <li>

                    ✅ Profile Completion :

                    <strong>

                        {" "}

                        {dashboard.profile?.completion || 0}%

                    </strong>

                </li>

                <li>

                    ✅ Resume Score :

                    <strong>

                        {" "}

                        {dashboard.resume?.score || 0}

                    </strong>

                </li>

                <li>

                    ✅ ATS Score :

                    <strong>

                        {" "}

                        {dashboard.ats?.score || 0}

                    </strong>

                </li>

                <li>

                    ✅ Career Matches :

                    <strong>

                        {" "}

                        {dashboard.statistics?.recommended_careers || 0}

                    </strong>

                </li>

            </ul>

        </div>

        {/* Right */}

        <div className="insight-card">

            <h3>

                Quick Actions

            </h3>

            <div className="action-grid">

                <button>

                    📄 Improve Resume

                </button>

                <button>

                    💼 View Jobs

                </button>

                <button>

                    🎓 Explore Courses

                </button>

                <button>

                    🚀 Career Roadmap

                </button>

            </div>

        </div>

    </div>

</section>

    </div>

);

}