from typing import Any, Dict, List


# ==========================================
# Score Weights
# ==========================================

SECTION_COMPLETENESS_WEIGHT = 25
SKILLS_WEIGHT = 20
PROJECTS_WEIGHT = 20
EXPERIENCE_WEIGHT = 15
PROFESSIONAL_LINKS_WEIGHT = 10
CONTENT_QUALITY_WEIGHT = 10


# ==========================================
# Helper - Normalize List
# ==========================================

def normalize_list(value: Any) -> List[Any]:

    if value is None:
        return []

    if isinstance(value, list):
        return value

    if isinstance(value, str):

        value = value.strip()

        if not value:
            return []

        return [value]

    return [value]


# ==========================================
# Helper - Has Useful Content
# ==========================================

def has_content(value: Any) -> bool:

    if value is None:
        return False

    if isinstance(value, str):
        return bool(value.strip())

    if isinstance(value, list):
        return len(value) > 0

    if isinstance(value, dict):
        return len(value) > 0

    return True


# ==========================================
# Status
# ==========================================

def get_resume_status(score: int) -> str:

    if score >= 85:
        return "Excellent"

    if score >= 70:
        return "Good"

    if score >= 50:
        return "Needs Improvement"

    return "Weak"


# ==========================================
# 1. Section Completeness
# Maximum = 25
# ==========================================

def calculate_section_score(
    resume_data: Dict[str, Any]
) -> Dict[str, Any]:

    # Important resume sections.
    #
    # Experience is not included here because
    # freshers should not lose too many marks
    # simply because they have no job experience.

    sections = {
        "education": 5,
        "skills": 5,
        "projects": 5,
        "email": 3,
        "phone": 3,
        "name": 2,
        "certifications": 2,
    }

    score = 0

    missing_sections = []

    present_sections = []

    for section, points in sections.items():

        value = resume_data.get(section)

        if has_content(value):

            score += points

            present_sections.append(section)

        else:

            missing_sections.append(section)

    return {
        "score": min(
            score,
            SECTION_COMPLETENESS_WEIGHT
        ),
        "present_sections": present_sections,
        "missing_sections": missing_sections,
    }


# ==========================================
# 2. Skills Quality
# Maximum = 20
# ==========================================

def calculate_skills_score(
    resume_data: Dict[str, Any]
) -> Dict[str, Any]:

    skills = normalize_list(
        resume_data.get("skills")
    )

    # Remove empty values and duplicates.

    cleaned_skills = []

    seen = set()

    for skill in skills:

        skill_text = str(skill).strip()

        if not skill_text:
            continue

        normalized = skill_text.lower()

        if normalized in seen:
            continue

        seen.add(normalized)

        cleaned_skills.append(skill_text)

    skill_count = len(cleaned_skills)

    # --------------------------------------
    # Scoring
    # --------------------------------------

    if skill_count >= 10:
        score = 20

    elif skill_count >= 7:
        score = 17

    elif skill_count >= 5:
        score = 14

    elif skill_count >= 3:
        score = 10

    elif skill_count >= 1:
        score = 5

    else:
        score = 0

    return {
        "score": score,
        "skill_count": skill_count,
        "skills": cleaned_skills,
    }


# ==========================================
# Helper - Convert Item To Text
# ==========================================

def item_to_text(item: Any) -> str:

    if isinstance(item, str):
        return item.strip()

    if isinstance(item, dict):

        text_parts = []

        for value in item.values():

            if isinstance(value, str):
                text_parts.append(value)

            elif isinstance(value, list):

                text_parts.extend(
                    str(x)
                    for x in value
                )

        return " ".join(text_parts).strip()

    return str(item).strip()


# ==========================================
# 3. Projects Quality
# Maximum = 20
# ==========================================

def calculate_projects_score(
    resume_data: Dict[str, Any]
) -> Dict[str, Any]:

    projects = normalize_list(
        resume_data.get("projects")
    )

    if not projects:

        return {
            "score": 0,
            "project_count": 0,
            "detailed_projects": 0,
        }

    project_count = len(projects)

    detailed_projects = 0

    for project in projects:

        text = item_to_text(project)

        # A reasonable amount of project
        # information indicates that the
        # candidate described the project.

        if len(text) >= 80:
            detailed_projects += 1

    # --------------------------------------
    # Base score for having projects
    # --------------------------------------

    if project_count >= 3:
        score = 14

    elif project_count == 2:
        score = 12

    else:
        score = 8

    # --------------------------------------
    # Description quality bonus
    # --------------------------------------

    if detailed_projects >= 2:
        score += 6

    elif detailed_projects == 1:
        score += 3

    return {
        "score": min(
            score,
            PROJECTS_WEIGHT
        ),
        "project_count": project_count,
        "detailed_projects": detailed_projects,
    }


# ==========================================
# 4. Experience / Internship
# Maximum = 15
# ==========================================

def calculate_experience_score(
    resume_data: Dict[str, Any]
) -> Dict[str, Any]:

    experience = normalize_list(
        resume_data.get("experience")
    )

    if not experience:

        # Important:
        # Do not give zero to freshers.
        #
        # A fresher can still have a good
        # resume without professional
        # employment.

        return {
            "score": 7,
            "experience_count": 0,
            "has_experience": False,
        }

    experience_count = len(experience)

    detailed_entries = 0

    for item in experience:

        text = item_to_text(item)

        if len(text) >= 80:
            detailed_entries += 1

    if detailed_entries >= 2:
        score = 15

    elif detailed_entries == 1:
        score = 13

    else:
        score = 10

    return {
        "score": score,
        "experience_count": experience_count,
        "has_experience": True,
    }


# ==========================================
# 5. Professional Links
# Maximum = 10
# ==========================================

def calculate_links_score(
    resume_data: Dict[str, Any]
) -> Dict[str, Any]:

    github = (
        resume_data.get("github")
        or resume_data.get("github_url")
        or ""
    )

    linkedin = (
        resume_data.get("linkedin")
        or resume_data.get("linkedin_url")
        or ""
    )

    score = 0

    available_links = []

    missing_links = []

    if has_content(github):

        score += 5
        available_links.append("GitHub")

    else:

        missing_links.append("GitHub")

    if has_content(linkedin):

        score += 5
        available_links.append("LinkedIn")

    else:

        missing_links.append("LinkedIn")

    return {
        "score": score,
        "available_links": available_links,
        "missing_links": missing_links,
    }


# ==========================================
# 6. Content Quality
# Maximum = 10
# ==========================================

def calculate_content_quality_score(
    resume_text: str
) -> Dict[str, Any]:

    resume_text = (
        resume_text or ""
    ).strip()

    if not resume_text:

        return {
            "score": 0,
            "word_count": 0,
            "action_verbs_found": [],
        }

    words = resume_text.split()

    word_count = len(words)

    # --------------------------------------
    # Length Score
    # --------------------------------------

    if 300 <= word_count <= 900:
        length_score = 5

    elif 200 <= word_count < 300:
        length_score = 4

    elif 100 <= word_count < 200:
        length_score = 3

    elif word_count > 900:
        length_score = 3

    else:
        length_score = 2

    # --------------------------------------
    # Action Verbs
    # --------------------------------------

    action_verbs = [
        "developed",
        "implemented",
        "designed",
        "built",
        "created",
        "integrated",
        "optimized",
        "managed",
        "improved",
        "automated",
        "deployed",
        "engineered",
        "analyzed",
        "collaborated",
        "tested",
    ]

    text_lower = resume_text.lower()

    found_verbs = []

    for verb in action_verbs:

        if verb in text_lower:

            found_verbs.append(verb)

    if len(found_verbs) >= 5:
        verb_score = 5

    elif len(found_verbs) >= 3:
        verb_score = 4

    elif len(found_verbs) >= 1:
        verb_score = 2

    else:
        verb_score = 0

    score = min(
        length_score + verb_score,
        CONTENT_QUALITY_WEIGHT
    )

    return {
        "score": score,
        "word_count": word_count,
        "action_verbs_found": found_verbs,
    }


# ==========================================
# Generate Rule-Based Strengths
# ==========================================

def generate_strengths(
    section_result,
    skills_result,
    projects_result,
    experience_result,
    links_result,
    content_result,
) -> List[str]:

    strengths = []

    if skills_result["skill_count"] >= 7:

        strengths.append(
            "The resume contains a strong "
            "technical skills section."
        )

    if projects_result["project_count"] >= 2:

        strengths.append(
            "Multiple projects demonstrate "
            "practical technical exposure."
        )

    if projects_result["detailed_projects"] >= 1:

        strengths.append(
            "At least one project contains "
            "a useful level of detail."
        )

    if experience_result["has_experience"]:

        strengths.append(
            "Experience or internship "
            "information is included."
        )

    if len(
        links_result["available_links"]
    ) == 2:

        strengths.append(
            "Both GitHub and LinkedIn links "
            "are included."
        )

    if (
        "education"
        in section_result["present_sections"]
    ):

        strengths.append(
            "Education information is present."
        )

    if len(
        content_result["action_verbs_found"]
    ) >= 3:

        strengths.append(
            "The resume uses multiple "
            "professional action verbs."
        )

    return strengths


# ==========================================
# Generate Rule-Based Improvements
# ==========================================

def generate_basic_improvements(
    section_result,
    skills_result,
    projects_result,
    experience_result,
    links_result,
    content_result,
) -> List[Dict[str, str]]:

    improvements = []

    # --------------------------------------
    # Skills
    # --------------------------------------

    if skills_result["skill_count"] < 5:

        improvements.append({
            "category": "Skills",
            "priority": "High",
            "suggestion": (
                "Strengthen the technical skills "
                "section with relevant programming "
                "languages, frameworks, databases "
                "and development tools."
            ),
        })

    # --------------------------------------
    # Projects
    # --------------------------------------

    if projects_result["project_count"] == 0:

        improvements.append({
            "category": "Projects",
            "priority": "High",
            "suggestion": (
                "Add academic or personal projects "
                "that demonstrate practical use of "
                "your technical skills."
            ),
        })

    elif projects_result[
        "detailed_projects"
    ] == 0:

        improvements.append({
            "category": "Projects",
            "priority": "High",
            "suggestion": (
                "Improve project descriptions by "
                "explaining the technologies used, "
                "features implemented and your "
                "specific contribution."
            ),
        })

    # --------------------------------------
    # Experience
    # --------------------------------------

    if not experience_result[
        "has_experience"
    ]:

        improvements.append({
            "category": "Experience",
            "priority": "Low",
            "suggestion": (
                "If applicable, include internships, "
                "freelance work, technical training "
                "or relevant practical experience."
            ),
        })

    # --------------------------------------
    # Professional Links
    # --------------------------------------

    for link in links_result[
        "missing_links"
    ]:

        improvements.append({
            "category": (
                "Professional Profile"
            ),
            "priority": "Medium",
            "suggestion": (
                f"Add your {link} profile link "
                "if you have one."
            ),
        })

    # --------------------------------------
    # Certifications
    # --------------------------------------

    if (
        "certifications"
        in section_result["missing_sections"]
    ):

        improvements.append({
            "category": "Certifications",
            "priority": "Low",
            "suggestion": (
                "Add relevant certifications "
                "if you have completed any."
            ),
        })

    # --------------------------------------
    # Action Verbs
    # --------------------------------------

    if len(
        content_result["action_verbs_found"]
    ) < 3:

        improvements.append({
            "category": "Writing",
            "priority": "Medium",
            "suggestion": (
                "Use stronger action verbs such as "
                "Developed, Implemented, Designed, "
                "Built, Integrated and Optimized."
            ),
        })

    # --------------------------------------
    # Resume Length
    # --------------------------------------

    if content_result["word_count"] < 200:

        improvements.append({
            "category": "Content",
            "priority": "Medium",
            "suggestion": (
                "The resume appears brief. Add "
                "meaningful details to projects, "
                "education and relevant experience "
                "without adding unnecessary content."
            ),
        })

    elif content_result[
        "word_count"
    ] > 900:

        improvements.append({
            "category": "Content",
            "priority": "Medium",
            "suggestion": (
                "The resume contains a large amount "
                "of text. Consider making descriptions "
                "more concise and focused."
            ),
        })

    return improvements


# ==========================================
# Main Resume Improvement Analyzer
# ==========================================

def analyze_resume_improvement(
    resume_data: Dict[str, Any],
    resume_text: str = "",
) -> Dict[str, Any]:

    resume_data = resume_data or {}

    resume_text = resume_text or ""

    # ======================================
    # Calculate Individual Scores
    # ======================================

    section_result = (
        calculate_section_score(
            resume_data
        )
    )

    skills_result = (
        calculate_skills_score(
            resume_data
        )
    )

    projects_result = (
        calculate_projects_score(
            resume_data
        )
    )

    experience_result = (
        calculate_experience_score(
            resume_data
        )
    )

    links_result = (
        calculate_links_score(
            resume_data
        )
    )

    content_result = (
        calculate_content_quality_score(
            resume_text
        )
    )

    # ======================================
    # Final Score
    # ======================================

    total_score = (
        section_result["score"]
        + skills_result["score"]
        + projects_result["score"]
        + experience_result["score"]
        + links_result["score"]
        + content_result["score"]
    )

    total_score = max(
        0,
        min(
            round(total_score),
            100
        )
    )

    # ======================================
    # Strengths
    # ======================================

    strengths = generate_strengths(
        section_result=section_result,
        skills_result=skills_result,
        projects_result=projects_result,
        experience_result=experience_result,
        links_result=links_result,
        content_result=content_result,
    )

    # ======================================
    # Improvements
    # ======================================

    improvements = (
        generate_basic_improvements(
            section_result=section_result,
            skills_result=skills_result,
            projects_result=projects_result,
            experience_result=experience_result,
            links_result=links_result,
            content_result=content_result,
        )
    )

    # ======================================
    # Response
    # ======================================

    return {

        "resume_score":
            total_score,

        "status":
            get_resume_status(
                total_score
            ),

        "component_scores": {

            "section_completeness": {
                "score":
                    section_result["score"],
                "max_score":
                    SECTION_COMPLETENESS_WEIGHT,
            },

            "skills": {
                "score":
                    skills_result["score"],
                "max_score":
                    SKILLS_WEIGHT,
            },

            "projects": {
                "score":
                    projects_result["score"],
                "max_score":
                    PROJECTS_WEIGHT,
            },

            "experience": {
                "score":
                    experience_result["score"],
                "max_score":
                    EXPERIENCE_WEIGHT,
            },

            "professional_links": {
                "score":
                    links_result["score"],
                "max_score":
                    PROFESSIONAL_LINKS_WEIGHT,
            },

            "content_quality": {
                "score":
                    content_result["score"],
                "max_score":
                    CONTENT_QUALITY_WEIGHT,
            },
        },

        "strengths":
            strengths,

        "missing_sections":
            section_result[
                "missing_sections"
            ],

        "missing_links":
            links_result[
                "missing_links"
            ],

        "improvements":
            improvements,

        "statistics": {

            "skill_count":
                skills_result[
                    "skill_count"
                ],

            "project_count":
                projects_result[
                    "project_count"
                ],

            "experience_count":
                experience_result[
                    "experience_count"
                ],

            "word_count":
                content_result[
                    "word_count"
                ],

            "action_verbs_found":
                content_result[
                    "action_verbs_found"
                ],
        },
    }