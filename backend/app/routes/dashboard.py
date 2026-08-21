from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.dependencies import get_current_user_id

from app.database import (
    users_collection,
    resumes_collection,
    ats_results_collection,
    career_recommendations_collection,
    job_recommendations_collection,
    course_recommendations_collection,
    resume_improvement_collection,
)

router = APIRouter(
    prefix="",
    tags=["Dashboard"]
)


@router.get("/dashboard")
async def dashboard(
    user_id: str = Depends(get_current_user_id)
):

    print("\n====================================")
    print("DASHBOARD API")
    print("====================================")
    print("User ID:", user_id)

    # =====================================================
    # USER
    # =====================================================

    try:
        object_id = ObjectId(user_id)

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid User ID"
        )

    user = await users_collection.find_one(
        {
            "_id": object_id
        }
    )

    print("\n========== USER DOCUMENT ==========")
    print(user)
    print("===================================\n")

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # ==========================================
# PROFILE
# ==========================================

    resume = await resumes_collection.find_one(
        {
            "user_id": user_id
        }
    )

    profile_completion = 0
    resume_uploaded = False

    if resume:

        parsed = resume.get("parsed_data", {})

        personal = parsed.get("personal_information", {})

        sections = parsed.get("sections", {})

        fields = [

            personal.get("name"),
            personal.get("email"),
            personal.get("phone"),
            personal.get("github"),
            personal.get("linkedin"),

            sections.get("education"),
            sections.get("experience"),
            sections.get("projects"),
            sections.get("certifications"),

            parsed.get("skills")

        ]

        filled = sum(
            1
            for field in fields
            if field
        )

        profile_completion = round(
            (filled / len(fields)) * 100
        )

        resume_uploaded = True
    # =====================================================
    # ATS
    # =====================================================

    ats = await ats_results_collection.find_one(
        {
            "user_id": user_id
        }
    )

    ats_score = 0
    matching_skills = []
    missing_skills = []
    job_description_uploaded = False

    if ats:

        ats_score = ats.get(
            "ats_score",
            0
        )

        matching_skills = ats.get(
            "matching_skills",
            []
        )

        missing_skills = ats.get(
            "missing_skills",
            []
        )

        job_description_uploaded = True

    # =====================================================
    # RESUME IMPROVEMENT
    # =====================================================

    resume = await resume_improvement_collection.find_one(
        {
            "user_id": user_id
        }
    )

    resume_score = 0
    resume_status = "Not Available"
    resume_improvements = []

    if resume:

        resume_score = resume.get(
            "resume_score",
            0
        )

        resume_status = resume.get(
            "status",
            "Not Available"
        )

        resume_improvements = resume.get(
            "basic_improvements",
            []
        )

    # =====================================================
    # CAREER RECOMMENDATION
    # =====================================================

    career = await career_recommendations_collection.find_one(
        {
            "user_id": user_id
        }
    )

    career_list = []

    if career:

        career_list = career.get(
            "recommendations",
            []
        )

    # =====================================================
    # JOB RECOMMENDATION
    # =====================================================

    jobs = await job_recommendations_collection.find_one(
        {
            "user_id": user_id
        }
    )

    job_list = []

    if jobs:

        job_list = jobs.get(
            "jobs",
            []
        )

    # =====================================================
    # COURSE RECOMMENDATION
    # =====================================================

    courses = await course_recommendations_collection.find_one(
        {
            "user_id": user_id
        }
    )

    course_list = []

    if courses:

        course_list = courses.get(
            "recommendations",
            []
        )

    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "success": True,

        "message": "Dashboard loaded successfully",

        "user": {

            "name": user.get(
                "fullName"
            ),

            "email": user.get(
                "email"
            )

        },

        "profile": {

            "completion": profile_completion,

            "resume_uploaded": resume_uploaded

        },

        "ats": {

            "score": ats_score,

            "job_description_uploaded": job_description_uploaded,

            "matching_skills": matching_skills,

            "missing_skills": missing_skills

        },

        "resume": {

            "score": resume_score,

            "status": resume_status,

            "improvements": resume_improvements

        },

        "career": {

            "recommendations": career_list

        },

        "jobs": {

            "recommendations": job_list

        },

        "courses": {

            "recommendations": course_list

        },

        "statistics": {

            "profile_completion": profile_completion,

            "ats_score": ats_score,

            "resume_score": resume_score,

            "matching_skills": len(
                matching_skills
            ),

            "missing_skills": len(
                missing_skills
            ),

            "recommended_careers": len(
                career_list
            ),

            "recommended_jobs": len(
                job_list
            ),

            "recommended_courses": len(
                course_list
            ),

            "resume_improvements": len(
                resume_improvements
            )

        }

    }