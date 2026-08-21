import asyncio

from app.database import jobs_collection


# ==========================================
# Sample Jobs
# ==========================================

JOBS = [

    # ======================================
    # Java Developer
    # ======================================

    {
        "title": "Java Developer",

        "company": "TechNova Solutions",

        "location": "Pune",

        "job_type": "Full Time",

        "experience_level": "Fresher",

        "min_experience": 0,

        "max_experience": 2,

        "skills": [
            "Java",
            "Spring Boot",
            "SQL",
            "Git",
            "REST API"
        ],

        "career_category": "Java Developer",

        "description": (
            "Looking for a Java Developer with "
            "knowledge of Java, Spring Boot, SQL, "
            "Git and REST API development."
        ),

        "apply_url": ""
    },


    # ======================================
    # React Developer
    # ======================================

    {
        "title": "React Developer",

        "company": "WebSphere Technologies",

        "location": "Bangalore",

        "job_type": "Full Time",

        "experience_level": "Fresher",

        "min_experience": 0,

        "max_experience": 2,

        "skills": [
            "React",
            "JavaScript",
            "HTML",
            "CSS",
            "Git"
        ],

        "career_category": "Frontend Developer",

        "description": (
            "Looking for a React Developer with "
            "strong JavaScript, React, HTML and "
            "CSS fundamentals."
        ),

        "apply_url": ""
    },


    # ======================================
    # Python Developer
    # ======================================

    {
        "title": "Python Developer",

        "company": "DataCore Systems",

        "location": "Hyderabad",

        "job_type": "Full Time",

        "experience_level": "Fresher",

        "min_experience": 0,

        "max_experience": 2,

        "skills": [
            "Python",
            "FastAPI",
            "SQL",
            "Git",
            "REST API"
        ],

        "career_category": "Python Developer",

        "description": (
            "Python Developer required with "
            "knowledge of Python, FastAPI, SQL "
            "and REST API development."
        ),

        "apply_url": ""
    },


    # ======================================
    # Full Stack Developer
    # ======================================

    {
        "title": "Full Stack Developer",

        "company": "NextGen Software",

        "location": "Pune",

        "job_type": "Full Time",

        "experience_level": "Fresher",

        "min_experience": 0,

        "max_experience": 2,

        "skills": [
            "React",
            "JavaScript",
            "Node.js",
            "Express.js",
            "MongoDB",
            "HTML",
            "CSS",
            "Git"
        ],

        "career_category": "Full Stack Developer",

        "description": (
            "Looking for a Full Stack Developer "
            "with React, Node.js, Express.js and "
            "MongoDB development skills."
        ),

        "apply_url": ""
    },


    # ======================================
    # Backend Developer
    # ======================================

    {
        "title": "Backend Developer",

        "company": "CloudStack Technologies",

        "location": "Mumbai",

        "job_type": "Full Time",

        "experience_level": "Fresher",

        "min_experience": 0,

        "max_experience": 2,

        "skills": [
            "Python",
            "FastAPI",
            "MongoDB",
            "SQL",
            "REST API",
            "Git"
        ],

        "career_category": "Backend Developer",

        "description": (
            "Backend Developer required with "
            "Python, FastAPI, MongoDB, SQL "
            "and REST API knowledge."
        ),

        "apply_url": ""
    },


    # ======================================
    # Software Developer
    # ======================================

    {
        "title": "Software Developer",

        "company": "Innovate Systems",

        "location": "Bangalore",

        "job_type": "Full Time",

        "experience_level": "Fresher",

        "min_experience": 0,

        "max_experience": 2,

        "skills": [
            "Java",
            "Python",
            "SQL",
            "Git",
            "Data Structures"
        ],

        "career_category": "Software Developer",

        "description": (
            "Software Developer required with "
            "strong programming fundamentals, "
            "Java or Python and SQL knowledge."
        ),

        "apply_url": ""
    },


    # ======================================
    # Frontend Developer
    # ======================================

    {
        "title": "Frontend Developer",

        "company": "PixelCraft Labs",

        "location": "Pune",

        "job_type": "Full Time",

        "experience_level": "Fresher",

        "min_experience": 0,

        "max_experience": 1,

        "skills": [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Git"
        ],

        "career_category": "Frontend Developer",

        "description": (
            "Frontend Developer required with "
            "HTML, CSS, JavaScript and React "
            "development skills."
        ),

        "apply_url": ""
    },


    # ======================================
    # Data Analyst
    # ======================================

    {
        "title": "Junior Data Analyst",

        "company": "Insight Analytics",

        "location": "Mumbai",

        "job_type": "Full Time",

        "experience_level": "Fresher",

        "min_experience": 0,

        "max_experience": 1,

        "skills": [
            "Python",
            "SQL",
            "Excel",
            "Power BI",
            "Data Analysis"
        ],

        "career_category": "Data Analyst",

        "description": (
            "Junior Data Analyst required with "
            "Python, SQL, Excel and Power BI "
            "knowledge."
        ),

        "apply_url": ""
    },


    # ======================================
    # Machine Learning Engineer
    # ======================================

    {
        "title": "Junior Machine Learning Engineer",

        "company": "AI Vision Labs",

        "location": "Bangalore",

        "job_type": "Full Time",

        "experience_level": "Fresher",

        "min_experience": 0,

        "max_experience": 2,

        "skills": [
            "Python",
            "Machine Learning",
            "Pandas",
            "NumPy",
            "Scikit-learn",
            "Git"
        ],

        "career_category": "Machine Learning Engineer",

        "description": (
            "Machine Learning Engineer required "
            "with Python, machine learning and "
            "data processing fundamentals."
        ),

        "apply_url": ""
    },


    # ======================================
    # Database Developer
    # ======================================

    {
        "title": "Database Developer",

        "company": "DataBridge Solutions",

        "location": "Hyderabad",

        "job_type": "Full Time",

        "experience_level": "Fresher",

        "min_experience": 0,

        "max_experience": 2,

        "skills": [
            "SQL",
            "MySQL",
            "MongoDB",
            "Database Design",
            "Python"
        ],

        "career_category": "Database Developer",

        "description": (
            "Database Developer required with "
            "SQL, MySQL, MongoDB and database "
            "design knowledge."
        ),

        "apply_url": ""
    }

]


# ==========================================
# Seed Jobs
# ==========================================

async def seed_jobs():

    print()
    print("======================================")
    print("JOB DATABASE SEED")
    print("======================================")


    # --------------------------------------
    # Delete old sample jobs
    # --------------------------------------

    result = await jobs_collection.delete_many({})

    print(
        f"Deleted old jobs: "
        f"{result.deleted_count}"
    )


    # --------------------------------------
    # Insert new jobs
    # --------------------------------------

    result = await jobs_collection.insert_many(
        JOBS
    )


    print(
        f"Inserted jobs: "
        f"{len(result.inserted_ids)}"
    )


    print("======================================")
    print("Job database created successfully.")
    print("======================================")


# ==========================================
# Run Script
# ==========================================

if __name__ == "__main__":

    asyncio.run(
        seed_jobs()
    )