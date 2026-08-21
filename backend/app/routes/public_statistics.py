from fastapi import APIRouter

from app.database import (
    users_collection,
    resumes_collection,
    jobs_collection,
    courses_collection,
    ats_results_collection,
    career_recommendations_collection
)


router = APIRouter(
    prefix="/api/public",
    tags=["Public Statistics"]
)


# =========================================================
# PUBLIC PLATFORM STATISTICS
# =========================================================

@router.get("/statistics")
async def get_public_statistics():

    # -----------------------------------------
    # TOTAL USERS
    # -----------------------------------------

    total_users = await users_collection.count_documents({})


    # -----------------------------------------
    # TOTAL RESUMES
    # -----------------------------------------

    total_resumes = await resumes_collection.count_documents({})


    # -----------------------------------------
    # TOTAL JOBS
    # -----------------------------------------

    total_jobs = await jobs_collection.count_documents({})


    # -----------------------------------------
    # TOTAL COURSES
    # -----------------------------------------

    total_courses = await courses_collection.count_documents({})


    # -----------------------------------------
    # TOTAL ATS ANALYSES
    # -----------------------------------------

    total_ats_analyses = (
        await ats_results_collection.count_documents({})
    )


    # -----------------------------------------
    # CAREER RECOMMENDATIONS
    # -----------------------------------------

    total_career_recommendations = (
        await career_recommendations_collection.count_documents({})
    )


    # -----------------------------------------
    # RESPONSE
    # -----------------------------------------

    return {

        "success": True,

        "statistics": {

            "users":
                total_users,

            "resumes":
                total_resumes,

            "jobs":
                total_jobs,

            "courses":
                total_courses,

            "ats_analyses":
                total_ats_analyses,

            "career_recommendations":
                total_career_recommendations

        }

    }