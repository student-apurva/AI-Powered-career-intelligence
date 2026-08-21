from collections import Counter
import re
from typing import Dict, List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.database import ats_results_collection
from app.dependencies import get_current_user_id
from fastapi import Depends

router = APIRouter(
    prefix="/ats",
    tags=["ATS Analysis"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class ATSRequest(BaseModel):
    job_description: str = Field(..., min_length=10)
    resume_skills: List[str] = Field(default_factory=list)
    resume_text: str = ""


# =========================================================
# TECHNICAL SKILL DATABASE
# =========================================================

TECH_SKILLS = [
    # Programming
    "java",
    "python",
    "javascript",
    "typescript",
    "c",
    "c++",
    "c#",
    "php",
    "kotlin",
    "swift",
    "go",
    "rust",

    # Frontend
    "html",
    "css",
    "react",
    "angular",
    "vue",
    "bootstrap",
    "tailwind css",
    "next.js",
    "redux",

    # Backend
    "node.js",
    "express.js",
    "spring boot",
    "spring",
    "hibernate",
    "django",
    "flask",
    "fastapi",
    "maven",
    "gradle",

    # Database
    "sql",
    "mysql",
    "mongodb",
    "postgresql",
    "sqlite",
    "oracle",
    "redis",
    "mongoose",

    # Cloud
    "aws",
    "azure",
    "gcp",
    "firebase",

    # DevOps
    "docker",
    "kubernetes",
    "jenkins",
    "github actions",
    "ci/cd",
    "terraform",

    # Tools
    "git",
    "github",
    "postman",
    "jira",

    # AI / ML
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "tensorflow",
    "pytorch",
    "scikit-learn",
    "pandas",
    "numpy",
    "opencv",
    "nlp",

    # APIs
    "rest api",
    "graphql",

    # Testing
    "junit",
    "pytest",
    "selenium",

    # Concepts
    "data structures",
    "algorithms",
    "oops",
    "microservices",
    "linux",
    "database design",
]


# =========================================================
# SKILL ALIASES
# =========================================================

SKILL_ALIASES = {
    "react.js": "react",
    "reactjs": "react",

    "node": "node.js",
    "nodejs": "node.js",

    "express": "express.js",
    "expressjs": "express.js",

    "js": "javascript",
    "ts": "typescript",

    "mongo db": "mongodb",
    "postgres": "postgresql",

    "rest": "rest api",
    "restful api": "rest api",
    "restful apis": "rest api",
    "rest apis": "rest api",

    "tailwind": "tailwind css",

    "sklearn": "scikit-learn",

    "google cloud": "gcp",
    "google cloud platform": "gcp",

    "object oriented programming": "oops",
    "object-oriented programming": "oops",
    "oop": "oops",

    "springboot": "spring boot",
}


# =========================================================
# SKILL RECOMMENDATION GRAPH
# =========================================================

SKILL_RECOMMENDATIONS = {
    "java": [
        "spring boot",
        "hibernate",
        "maven",
        "junit",
        "rest api",
    ],

    "spring boot": [
        "hibernate",
        "maven",
        "microservices",
        "docker",
        "junit",
    ],

    "python": [
        "fastapi",
        "django",
        "flask",
        "pytest",
    ],

    "javascript": [
        "typescript",
        "react",
        "node.js",
    ],

    "react": [
        "typescript",
        "redux",
        "next.js",
        "rest api",
    ],

    "node.js": [
        "express.js",
        "mongodb",
        "rest api",
        "docker",
    ],

    "express.js": [
        "mongodb",
        "rest api",
        "node.js",
    ],

    "sql": [
        "mysql",
        "postgresql",
        "database design",
    ],

    "mongodb": [
        "mongoose",
        "database design",
    ],

    "docker": [
        "kubernetes",
        "jenkins",
        "ci/cd",
        "aws",
    ],

    "kubernetes": [
        "docker",
        "aws",
        "ci/cd",
    ],

    "aws": [
        "docker",
        "kubernetes",
        "ci/cd",
        "terraform",
    ],

    "machine learning": [
        "numpy",
        "pandas",
        "scikit-learn",
        "tensorflow",
        "pytorch",
    ],

    "git": [
        "github",
        "github actions",
        "ci/cd",
    ],
}


# =========================================================
# STOP WORDS FOR KEYWORD ANALYSIS
# =========================================================

STOP_WORDS = {
    "the", "and", "for", "with", "that", "this",
    "from", "your", "you", "our", "are", "will",
    "have", "has", "had", "into", "their", "they",
    "who", "but", "not", "all", "can", "job",
    "role", "work", "working", "candidate",
    "candidates", "looking", "required",
    "preferred", "skills", "skill", "experience",
    "experienced", "years", "year", "good",
    "strong", "team", "using", "knowledge",
    "ability", "responsible", "responsibilities",
    "should", "must", "plus", "would", "about",
    "company", "position", "development",
    "developer", "software", "applications",
    "application", "technology", "technologies",
}


# =========================================================
# NORMALIZATION
# =========================================================

def normalize_skill(skill: str) -> str:
    if not isinstance(skill, str):
        return ""

    skill = skill.strip().lower()
    skill = re.sub(r"\s+", " ", skill)

    return SKILL_ALIASES.get(skill, skill)


def normalize_text(text: str) -> str:
    if not text:
        return ""

    text = text.lower()
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def normalize_resume_skills(
    resume_skills: List[str]
) -> List[str]:

    normalized = set()

    for skill in resume_skills:
        clean_skill = normalize_skill(skill)

        if clean_skill:
            normalized.add(clean_skill)

    return sorted(normalized)


# =========================================================
# SKILL EXISTS IN TEXT
# =========================================================

def skill_in_text(
    skill: str,
    text: str
) -> bool:

    skill = normalize_skill(skill)
    text = normalize_text(text)

    if not skill or not text:
        return False

    variations = {skill}

    # Include aliases
    for alias, canonical in SKILL_ALIASES.items():

        if normalize_skill(canonical) == skill:
            variations.add(alias.lower())

    for variation in variations:

        pattern = (
            r"(?<![a-zA-Z0-9])"
            + re.escape(variation)
            + r"(?![a-zA-Z0-9])"
        )

        if re.search(pattern, text):
            return True

    return False


# =========================================================
# EXTRACT TECHNICAL SKILLS FROM TEXT
# =========================================================

def extract_skills_from_text(
    text: str
) -> List[str]:

    if not text:
        return []

    detected = set()

    for skill in TECH_SKILLS:

        normalized_skill = normalize_skill(skill)

        if skill_in_text(
            normalized_skill,
            text
        ):
            detected.add(normalized_skill)

    return sorted(detected)


# =========================================================
# CLASSIFY JOB SKILLS
#
# Required skills have more weight.
# Preferred skills have lower weight.
# =========================================================

def classify_job_skills(
    job_description: str
) -> Dict[str, List[str]]:

    detected_skills = extract_skills_from_text(
        job_description
    )

    required = set()
    preferred = set()

    text = normalize_text(job_description)

    sentences = re.split(
        r"[.\n;•]+",
        text
    )

    required_markers = [
        "required",
        "must",
        "mandatory",
        "need",
        "needs",
        "should have",
        "proficient",
        "strong knowledge",
        "experience with",
        "experience in",
    ]

    preferred_markers = [
        "preferred",
        "nice to have",
        "good to have",
        "bonus",
        "advantage",
        "desirable",
        "plus",
    ]

    for skill in detected_skills:

        skill_sentences = [
            sentence
            for sentence in sentences
            if skill_in_text(skill, sentence)
        ]

        is_required = False
        is_preferred = False

        for sentence in skill_sentences:

            if any(
                marker in sentence
                for marker in required_markers
            ):
                is_required = True

            if any(
                marker in sentence
                for marker in preferred_markers
            ):
                is_preferred = True

        # Required has priority
        if is_required:
            required.add(skill)

        elif is_preferred:
            preferred.add(skill)

        else:
            # Directly mentioned technical skills are
            # treated as normal requirements.
            required.add(skill)

    preferred -= required

    return {
        "all": sorted(detected_skills),
        "required": sorted(required),
        "preferred": sorted(preferred),
    }


# =========================================================
# KEYWORD EXTRACTION
#
# Technical skills are excluded because they are already
# scored in the skill-matching component.
# =========================================================

def extract_keywords(
    text: str,
    excluded_skills: List[str] | None = None,
    limit: int = 30,
) -> List[str]:

    text = normalize_text(text)

    excluded_skills = excluded_skills or []

    excluded_words = set()

    # Prevent double scoring:
    # Java should not count once as skill and again
    # as a general keyword.
    for skill in excluded_skills:

        normalized_skill = normalize_skill(skill)

        skill_words = re.findall(
            r"[a-zA-Z0-9+#.\-]+",
            normalized_skill
        )

        excluded_words.update(skill_words)

    words = re.findall(
        r"\b[a-z][a-z0-9+#.\-]{2,}\b",
        text
    )

    filtered = [
        word
        for word in words
        if word not in STOP_WORDS
        and word not in excluded_words
    ]

    frequencies = Counter(filtered)

    return [
        word
        for word, _
        in frequencies.most_common(limit)
    ]


# =========================================================
# KEYWORD MATCH
# =========================================================

def calculate_keyword_match(
    resume_content: str,
    job_description: str,
    job_skills: List[str],
):

    keywords = extract_keywords(
        job_description,
        excluded_skills=job_skills,
    )

    # A JD containing only technical skills may have
    # no additional meaningful keywords.
    if not keywords:
        return None, [], []

    resume_content = normalize_text(
        resume_content
    )

    matched_keywords = []
    missing_keywords = []

    for keyword in keywords:

        pattern = (
            r"(?<![a-zA-Z0-9])"
            + re.escape(keyword)
            + r"(?![a-zA-Z0-9])"
        )

        if re.search(
            pattern,
            resume_content
        ):
            matched_keywords.append(keyword)

        else:
            missing_keywords.append(keyword)

    percentage = (
        len(matched_keywords)
        / len(keywords)
    ) * 100

    return (
        round(percentage),
        matched_keywords,
        missing_keywords,
    )


# =========================================================
# RESUME EVIDENCE SCORE
#
# Checks whether matching skills are actually represented
# in resume content.
# =========================================================

def calculate_evidence_score(
    matching_skills: List[str],
    resume_text: str,
) -> int | None:

    if not matching_skills:
        return 0

    # No raw resume text means evidence cannot be measured.
    # Return None instead of giving arbitrary 50%.
    if not resume_text.strip():
        return None

    evidence_count = 0

    for skill in matching_skills:

        if skill_in_text(
            skill,
            resume_text
        ):
            evidence_count += 1

    return round(
        (
            evidence_count
            / len(matching_skills)
        ) * 100
    )


# =========================================================
# SKILL RECOMMENDATIONS
#
# These do NOT reduce ATS score unless they are explicitly
# required by the job description.
# =========================================================

def generate_skill_recommendations(
    job_skills: List[str],
    resume_skills: List[str],
    missing_skills: List[str],
    limit: int = 8,
) -> List[str]:

    resume_set = {
        normalize_skill(skill)
        for skill in resume_skills
        if skill
    }

    missing_set = {
        normalize_skill(skill)
        for skill in missing_skills
        if skill
    }

    scores = Counter()

    for job_skill in job_skills:

        normalized_job_skill = normalize_skill(
            job_skill
        )

        related_skills = SKILL_RECOMMENDATIONS.get(
            normalized_job_skill,
            []
        )

        for related_skill in related_skills:

            related_skill = normalize_skill(
                related_skill
            )

            if not related_skill:
                continue

            # Don't recommend something already on resume
            if related_skill in resume_set:
                continue

            # Missing JD skills belong in missing_skills,
            # not in suggested_skills.
            if related_skill in missing_set:
                continue

            scores[related_skill] += 1

    ranked = sorted(
        scores.items(),
        key=lambda item: (
            -item[1],
            item[0],
        )
    )

    return [
        skill
        for skill, _
        in ranked[:limit]
    ]


# =========================================================
# WEIGHTED SCORE HELPER
#
# Redistributes unavailable components rather than giving
# artificial free points.
# =========================================================

def weighted_average(
    components: List[tuple]
) -> int:

    """
    components:
        [
            (percentage, weight),
            ...
        ]

    If a percentage is None, that component is unavailable
    and its weight is redistributed across available data.
    """

    available = [
        (score, weight)
        for score, weight in components
        if score is not None
    ]

    if not available:
        return 0

    total_weight = sum(
        weight
        for _, weight in available
    )

    if total_weight <= 0:
        return 0

    weighted_score = sum(
        score * weight
        for score, weight in available
    )

    final = (
        weighted_score
        / total_weight
    )

    return round(final)


# =========================================================
# ATS CALCULATION
# =========================================================

def calculate_ats_score(
    resume_skills: List[str],
    resume_text: str,
    job_description: str,
) -> Dict:

    # -----------------------------------------------------
    # Normalize resume skills
    # -----------------------------------------------------

    normalized_resume_list = (
        normalize_resume_skills(
            resume_skills
        )
    )

    normalized_resume = set(
        normalized_resume_list
    )

    # -----------------------------------------------------
    # Analyze JD
    # -----------------------------------------------------

    job_data = classify_job_skills(
        job_description
    )

    required_set = set(
        job_data["required"]
    )

    preferred_set = set(
        job_data["preferred"]
    )

    all_job_set = set(
        job_data["all"]
    )

    # -----------------------------------------------------
    # Required skills
    # -----------------------------------------------------

    matching_required = sorted(
        required_set
        & normalized_resume
    )

    missing_required = sorted(
        required_set
        - normalized_resume
    )

    if required_set:

        required_percentage = round(
            (
                len(matching_required)
                / len(required_set)
            ) * 100
        )

    else:
        required_percentage = None

    # -----------------------------------------------------
    # Preferred skills
    # -----------------------------------------------------

    matching_preferred = sorted(
        preferred_set
        & normalized_resume
    )

    missing_preferred = sorted(
        preferred_set
        - normalized_resume
    )

    if preferred_set:

        preferred_percentage = round(
            (
                len(matching_preferred)
                / len(preferred_set)
            ) * 100
        )

    else:
        # IMPORTANT:
        # No preferred requirements = no free 100%.
        preferred_percentage = None

    # -----------------------------------------------------
    # Overall technical skill coverage
    # -----------------------------------------------------

    matching_skills = sorted(
        all_job_set
        & normalized_resume
    )

    missing_skills = sorted(
        all_job_set
        - normalized_resume
    )

    if all_job_set:

        coverage_percentage = round(
            (
                len(matching_skills)
                / len(all_job_set)
            ) * 100
        )

    else:
        coverage_percentage = None

    # =====================================================
    # BUILD SEARCHABLE RESUME CONTENT
    # =====================================================

    # Raw resume text is best.
    resume_content = normalize_text(
        resume_text
    )

    # Also include parsed skills so keyword analysis
    # does not become zero simply because resume_text
    # was not sent by frontend.
    skill_content = " ".join(
        normalized_resume_list
    )

    resume_content = (
        resume_content
        + " "
        + skill_content
    ).strip()

    # -----------------------------------------------------
    # Keyword match
    # -----------------------------------------------------

    (
        keyword_percentage,
        matched_keywords,
        missing_keywords,
    ) = calculate_keyword_match(
        resume_content,
        job_description,
        job_data["all"],
    )

    # -----------------------------------------------------
    # Evidence score
    # -----------------------------------------------------

    evidence_percentage = (
        calculate_evidence_score(
            matching_skills,
            resume_text,
        )
    )

    # =====================================================
    # FINAL ATS SCORE
    # =====================================================
    #
    # Normal weights:
    #
    # Required skills  = 55%
    # Keywords         = 20%
    # Preferred skills = 10%
    # Resume evidence  = 10%
    # Coverage         = 5%
    #
    # Missing components are redistributed automatically.
    # =====================================================

    final_score = weighted_average([
        (
            required_percentage,
            0.55
        ),
        (
            keyword_percentage,
            0.20
        ),
        (
            preferred_percentage,
            0.10
        ),
        (
            evidence_percentage,
            0.10
        ),
        (
            coverage_percentage,
            0.05
        ),
    ])

    # =====================================================
    # REQUIRED-SKILL PENALTY
    #
    # Prevent very high ATS scores when important required
    # technical skills are missing.
    # =====================================================

    if required_set:

        missing_ratio = (
            len(missing_required)
            / len(required_set)
        )

        # Half or more required skills missing
        if missing_ratio >= 0.50:
            final_score = min(
                final_score,
                55
            )

        # 30%-49% missing
        elif missing_ratio >= 0.30:
            final_score = min(
                final_score,
                70
            )

        # At least one required skill missing
        elif missing_ratio > 0:
            final_score = min(
                final_score,
                89
            )

    final_score = max(
        0,
        min(
            100,
            final_score
        )
    )

    return {
        "ats_score":
            final_score,

        "matching_skills":
            matching_skills,

        "missing_skills":
            missing_skills,

        "matching_required_skills":
            matching_required,

        "missing_required_skills":
            missing_required,

        "matching_preferred_skills":
            matching_preferred,

        "missing_preferred_skills":
            missing_preferred,

        "required_skill_match":
            required_percentage,

        "preferred_skill_match":
            preferred_percentage,

        "keyword_match":
            keyword_percentage,

        "evidence_score":
            evidence_percentage,

        "coverage_score":
            coverage_percentage,

        "matched_keywords":
            matched_keywords,

        "missing_keywords":
            missing_keywords,

        "job_skills":
            job_data["all"],

        "required_job_skills":
            job_data["required"],

        "preferred_job_skills":
            job_data["preferred"],
    }


# =========================================================
# SCORE STATUS
# =========================================================

def get_score_status(
    score: int
) -> str:

    if score >= 85:
        return "Excellent Match"

    if score >= 70:
        return "Strong Match"

    if score >= 55:
        return "Moderate Match"

    if score >= 40:
        return "Low Match"

    return "Needs Improvement"


# =========================================================
# GENERATE RECOMMENDATION
# =========================================================

def generate_recommendation(
    analysis: Dict
) -> str:

    score = analysis[
        "ats_score"
    ]

    missing_required = analysis[
        "missing_required_skills"
    ]

    missing_preferred = analysis[
        "missing_preferred_skills"
    ]

    keyword_match = analysis[
        "keyword_match"
    ]

    messages = []

    # -----------------------------------------------------
    # Missing required skills have highest priority
    # -----------------------------------------------------

    if missing_required:

        skills = ", ".join(
            missing_required[:5]
        )

        messages.append(
            "Your highest priority should be the missing "
            f"required skills: {skills}."
        )

    # -----------------------------------------------------
    # Preferred skills
    # -----------------------------------------------------

    if missing_preferred:

        skills = ", ".join(
            missing_preferred[:3]
        )

        messages.append(
            "You can further strengthen your profile with "
            f"preferred skills such as {skills}."
        )

    # -----------------------------------------------------
    # Keyword alignment
    # -----------------------------------------------------

    if (
        keyword_match is not None
        and keyword_match < 50
    ):

        messages.append(
            "Your resume has low non-technical keyword "
            "alignment with the job description. Add relevant "
            "terminology naturally to your summary, projects "
            "and experience where it truthfully applies."
        )

    # -----------------------------------------------------
    # Overall message
    # -----------------------------------------------------

    if score >= 85:

        opening = (
            "Your resume is highly aligned "
            "with this position."
        )

    elif score >= 70:

        opening = (
            "Your resume is a strong match "
            "for this position."
        )

    elif score >= 55:

        opening = (
            "Your resume has moderate alignment "
            "with this position."
        )

    elif score >= 40:

        opening = (
            "Your resume has limited alignment "
            "with this position."
        )

    else:

        opening = (
            "Your resume needs stronger alignment "
            "with this position."
        )

    if messages:

        return (
            opening
            + " "
            + " ".join(messages)
        )

    return (
        opening
        + " Most detected technical requirements "
          "are already represented in your resume."
    )


# =========================================================
# POST /ats/analyze
# =========================================================

@router.post("/analyze")
async def analyze_resume(
    request: ATSRequest,
    user_id: str = Depends(get_current_user_id)
):

    try:

        print("\n======================================")
        print("ATS ANALYSIS")
        print("======================================")

        # -------------------------------------------------
        # Validation
        # -------------------------------------------------

        if not request.job_description.strip():

            raise HTTPException(
                status_code=400,
                detail="Job description is required."
            )

        if not request.resume_skills:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Resume skills are required. "
                    "Please parse the resume first."
                )
            )

        # -------------------------------------------------
        # ATS calculation
        # -------------------------------------------------

        analysis = calculate_ats_score(
            request.resume_skills,
            request.resume_text,
            request.job_description,
        )

        # -------------------------------------------------
        # Make sure technical requirements were detected
        # -------------------------------------------------

        if not analysis["job_skills"]:

            raise HTTPException(
                status_code=400,
                detail=(
                    "No supported technical skills were "
                    "detected in the job description."
                )
            )

        # -------------------------------------------------
        # Additional learning recommendations
        # -------------------------------------------------

        suggested_skills = (
            generate_skill_recommendations(
                analysis["job_skills"],
                request.resume_skills,
                analysis["missing_skills"],
            )
        )

        # -------------------------------------------------
        # Status
        # -------------------------------------------------

        status = get_score_status(
            analysis["ats_score"]
        )

        # -------------------------------------------------
        # Recommendation
        # -------------------------------------------------

        recommendation = (
            generate_recommendation(
                analysis
            )
        )

        # =================================================
        # DEBUG OUTPUT
        # =================================================

        print(
            "Resume Skills:",
            normalize_resume_skills(
                request.resume_skills
            )
        )

        print(
            "Job Skills:",
            analysis["job_skills"]
        )

        print(
            "Required:",
            analysis["required_job_skills"]
        )

        print(
            "Preferred:",
            analysis["preferred_job_skills"]
        )

        print(
            "Matching:",
            analysis["matching_skills"]
        )

        print(
            "Missing:",
            analysis["missing_skills"]
        )

        print(
            "Suggested:",
            suggested_skills
        )

        print(
            "Required Match:",
            analysis["required_skill_match"]
        )

        print(
            "Preferred Match:",
            analysis["preferred_skill_match"]
        )

        print(
            "Keyword Match:",
            analysis["keyword_match"]
        )

        print(
            "Evidence Score:",
            analysis["evidence_score"]
        )

        print(
            "Coverage Score:",
            analysis["coverage_score"]
        )

        print(
            "ATS Score:",
            analysis["ats_score"]
        )

        print("======================================\n")

        # =================================================
        # RESPONSE
        # =================================================
        await ats_results_collection.update_one(
    {"user_id": user_id},
    {
        "$set": {
            "user_id": user_id,
            "ats_score": analysis["ats_score"],
            "matching_skills": analysis["matching_skills"],
            "missing_skills": analysis["missing_skills"],
            "required_skill_match": analysis["required_skill_match"],
            "preferred_skill_match": analysis["preferred_skill_match"],
            "keyword_match": analysis["keyword_match"],
            "coverage_score": analysis["coverage_score"],
            "recommendation": recommendation
        }
    },
    upsert=True
)

        return {
            "success": True,

            # Main result
            "ats_score":
                analysis["ats_score"],

            "status":
                status,

            # Matching / missing
            "matching_skills":
                analysis["matching_skills"],

            "missing_skills":
                analysis["missing_skills"],

            # Learning recommendations
            "suggested_skills":
                suggested_skills,

            # Required skills
            "matching_required_skills":
                analysis["matching_required_skills"],

            "missing_required_skills":
                analysis["missing_required_skills"],

            # Preferred skills
            "matching_preferred_skills":
                analysis["matching_preferred_skills"],

            "missing_preferred_skills":
                analysis["missing_preferred_skills"],

            # Component scores
            "required_skill_match":
                analysis["required_skill_match"],

            "preferred_skill_match":
                analysis["preferred_skill_match"],

            "keyword_match":
                analysis["keyword_match"],

            "evidence_score":
                analysis["evidence_score"],

            "coverage_score":
                analysis["coverage_score"],

            # Detected JD requirements
            "job_skills":
                analysis["job_skills"],

            "required_job_skills":
                analysis["required_job_skills"],

            "preferred_job_skills":
                analysis["preferred_job_skills"],

            # Keywords
            "matched_keywords":
                analysis["matched_keywords"],

            "missing_keywords":
                analysis["missing_keywords"][:10],

            # Counts
            "total_job_skills":
                len(
                    analysis["job_skills"]
                ),

            "total_matching_skills":
                len(
                    analysis["matching_skills"]
                ),

            "total_missing_skills":
                len(
                    analysis["missing_skills"]
                ),

            # Recommendation text
            "recommendation":
                recommendation,
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "ATS ANALYSIS ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                f"ATS analysis failed: {str(e)}"
            )
        )