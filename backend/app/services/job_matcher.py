from typing import List, Dict, Any


# ==========================================
# Skill Aliases
# ==========================================

SKILL_ALIASES = {
    "react.js": "react",
    "reactjs": "react",

    "node": "node.js",
    "nodejs": "node.js",

    "express": "express.js",
    "expressjs": "express.js",

    "mongo": "mongodb",

    "mysql database": "mysql",

    "js": "javascript",

    "py": "python",

    "springboot": "spring boot",

    "rest": "rest api",
    "restful api": "rest api",

    "scikit learn": "scikit-learn",
    "sklearn": "scikit-learn",

    "powerbi": "power bi",

    "github": "git",
}


# ==========================================
# Normalize One Skill
# ==========================================

def normalize_skill(skill: str) -> str:

    if not skill:
        return ""

    normalized = str(skill).strip().lower()

    normalized = " ".join(
        normalized.split()
    )

    return SKILL_ALIASES.get(
        normalized,
        normalized
    )


# ==========================================
# Normalize Skill List
# ==========================================

def normalize_skills(
    skills: List[str]
) -> List[str]:

    if not skills:
        return []

    normalized = []

    for skill in skills:

        value = normalize_skill(skill)

        if value and value not in normalized:
            normalized.append(value)

    return normalized


# ==========================================
# Display Skill
# ==========================================

def display_skill(skill: str) -> str:

    special_names = {
        "html": "HTML",
        "css": "CSS",
        "sql": "SQL",
        "mysql": "MySQL",
        "mongodb": "MongoDB",
        "javascript": "JavaScript",
        "java": "Java",
        "python": "Python",
        "react": "React",
        "node.js": "Node.js",
        "express.js": "Express.js",
        "git": "Git",
        "rest api": "REST API",
        "spring boot": "Spring Boot",
        "fastapi": "FastAPI",
        "power bi": "Power BI",
        "machine learning": "Machine Learning",
        "data analysis": "Data Analysis",
        "database design": "Database Design",
        "data structures": "Data Structures",
        "pandas": "Pandas",
        "numpy": "NumPy",
        "scikit-learn": "Scikit-learn",
        "excel": "Excel",
    }

    return special_names.get(
        skill,
        skill.title()
    )


# ==========================================
# Calculate Skill Match
# ==========================================

def calculate_skill_match(
    resume_skills: List[str],
    job_skills: List[str]
) -> Dict[str, Any]:

    resume_normalized = set(
        normalize_skills(resume_skills)
    )

    job_normalized = set(
        normalize_skills(job_skills)
    )

    # --------------------------------------
    # No job skills
    # --------------------------------------

    if not job_normalized:

        return {
            "score": 0,
            "matching_skills": [],
            "missing_skills": [],
            "total_job_skills": 0,
            "matched_skill_count": 0,
        }

    # --------------------------------------
    # Matching
    # --------------------------------------

    matching = (
        resume_normalized
        .intersection(job_normalized)
    )

    # --------------------------------------
    # Missing
    # --------------------------------------

    missing = (
        job_normalized
        .difference(resume_normalized)
    )

    # --------------------------------------
    # Score
    # --------------------------------------

    score = (
        len(matching)
        / len(job_normalized)
    ) * 100

    return {
        "score": round(score, 2),

        "matching_skills": sorted([
            display_skill(skill)
            for skill in matching
        ]),

        "missing_skills": sorted([
            display_skill(skill)
            for skill in missing
        ]),

        "total_job_skills":
            len(job_normalized),

        "matched_skill_count":
            len(matching),
    }


# ==========================================
# Career Match
# ==========================================

def calculate_career_match(
    recommended_careers: List[str],
    job_category: str,
    job_title: str
) -> float:

    if not recommended_careers:
        return 0.0

    normalized_careers = [
        str(career).strip().lower()
        for career in recommended_careers
        if career
    ]

    category = (
        str(job_category)
        .strip()
        .lower()
    )

    title = (
        str(job_title)
        .strip()
        .lower()
    )

    for career in normalized_careers:

        # Exact career category
        if career == category:
            return 100.0

        # Exact title
        if career == title:
            return 100.0

        # Similar title/category
        if (
            career in category
            or category in career
            or career in title
            or title in career
        ):
            return 80.0

    return 0.0


# ==========================================
# Experience Match
# ==========================================

def calculate_experience_match(
    user_experience_years: float,
    min_experience: float,
    max_experience: float
) -> float:

    try:

        user_years = float(
            user_experience_years or 0
        )

        minimum = float(
            min_experience or 0
        )

        maximum = float(
            max_experience or 0
        )

    except (TypeError, ValueError):
        return 0.0

    # Fresher job
    if minimum == 0 and user_years == 0:
        return 100.0

    # Candidate meets range
    if minimum <= user_years <= maximum:
        return 100.0

    # Candidate slightly below requirement
    if (
        user_years < minimum
        and minimum - user_years <= 1
    ):
        return 60.0

    # Candidate has more experience
    if user_years > maximum:
        return 80.0

    return 0.0


# ==========================================
# Calculate One Job Match
# ==========================================

def calculate_job_match(
    resume_skills,
    job,
    recommended_careers,
    user_experience_years
):
    """
    Calculate job match score
    """

    # ==========================
    # Extract skills from description
    # ==========================

    job_description = (
        job.get("description", "") or ""
    ).lower()

    skill_keywords = [
        "python",
        "java",
        "javascript",
        "react",
        "node.js",
        "html",
        "css",
        "sql",
        "mysql",
        "mongodb",
        "git",
        "github",
        "docker",
        "aws",
        "kubernetes",
        "fastapi",
        "spring boot",
        "postman",
        "linux",
        "terraform",
        "jenkins",
        "ci/cd",
        "api"
    ]

    job_skills = []

    for skill in skill_keywords:

        if skill in job_description:

            job_skills.append(skill)

    job_skills = list(set(job_skills))

    # ==========================
    # Resume Skills
    # ==========================

    resume_lower = [
        skill.lower()
        for skill in resume_skills
    ]

    matching_skills = []

    missing_skills = []

    for skill in job_skills:

        if skill in resume_lower:

            matching_skills.append(skill.title())

        else:

            missing_skills.append(skill.title())

    # ==========================
    # Skill Match
    # ==========================

    if len(job_skills) > 0:

        skill_match = round(

            len(matching_skills)
            / len(job_skills)
            * 100,

            2

        )

    else:

        skill_match = 0

    # ==========================
    # Career Match
    # ==========================

    job_title = job.get(
        "title",
        ""
    ).lower()

    career_match = 0

    for career in recommended_careers:

        if career.lower().replace("-", " ") in job_title:

            career_match = 100

            break

    if career_match == 0:

        for career in recommended_careers:

            words = career.lower().split()

            if any(word in job_title for word in words):

                career_match = 80

                break

    # ==========================
    # Experience Match
    # ==========================

    experience_match = calculate_experience_match(
    user_experience_years,
    job.get("min_experience", 0),
    job.get("max_experience", 0)
)

    # ==========================
    # Overall Score
    # ==========================

    match_score = round(

    (
        skill_match * 0.60
        +
        career_match * 0.25
        +
        experience_match * 0.15
    ),

    2

)

    return {

        "title": job.get("title", ""),

        "company": job.get("company", ""),

        "location": job.get("location", ""),

        "salary_min": job.get("salary_min"),

        "salary_max": job.get("salary_max"),

        "contract_type": job.get("contract_type"),

        "description": job.get("description", ""),

        "apply_url": job.get("apply_url", ""),

        "match_score": match_score,

        "skill_match": skill_match,

        "career_match": career_match,

        "experience_match": experience_match,

        "matching_skills": matching_skills,

        "missing_skills": missing_skills

    }

# ==========================================
# Rank Multiple Jobs
# ==========================================

def rank_jobs(
    resume_skills: List[str],
    jobs: List[Dict[str, Any]],
    recommended_careers=None,
    user_experience_years=0
) -> List[Dict[str, Any]]:

    recommended_careers = (
        recommended_careers or []
    )

    results = []

    # --------------------------------------
    # Calculate every job
    # --------------------------------------

    for job in jobs:

        result = calculate_job_match(

            resume_skills=
                resume_skills,

            job=
                job,

            recommended_careers=
                recommended_careers,

            user_experience_years=
                user_experience_years
        )

        results.append(result)


    # --------------------------------------
    # Sort highest → lowest
    # --------------------------------------

    results.sort(
        key=lambda item:
            item["match_score"],
        reverse=True
    )


    return results