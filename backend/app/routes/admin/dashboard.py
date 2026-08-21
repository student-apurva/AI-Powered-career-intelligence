from fastapi import APIRouter, Depends

from app.dependencies import get_current_admin

from app.database import (
    users_collection,
    profiles_collection,
    resumes_collection,
    ats_results_collection,
    jobs_collection,
    courses_collection,
    career_recommendations_collection,
    job_recommendations_collection,
    course_recommendations_collection,
)


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin Dashboard"]
)


@router.get("/dashboard")
async def get_admin_dashboard(
    admin=Depends(get_current_admin)
):

    # ==============================
    # USERS
    # ==============================

    total_users = await users_collection.count_documents({})

    active_users = await users_collection.count_documents({
        "isActive": True
    })


    # ==============================
    # PROFILES
    # ==============================

    total_profiles = await profiles_collection.count_documents({})


    # ==============================
    # RESUMES
    # ==============================

    total_resumes = await resumes_collection.count_documents({})


    # ==============================
    # ATS
    # ==============================

    total_ats = await ats_results_collection.count_documents({})


    # ==============================
    # JOBS
    # ==============================

    total_jobs = await jobs_collection.count_documents({})


    # ==============================
    # COURSES
    # ==============================

    total_courses = await courses_collection.count_documents({})


    # ==============================
    # CAREER RECOMMENDATIONS
    # ==============================

    total_career_recommendations = (
        await career_recommendations_collection.count_documents({})
    )


    # ==============================
    # JOB RECOMMENDATIONS
    # ==============================

    total_job_recommendations = (
        await job_recommendations_collection.count_documents({})
    )


    # ==============================
    # COURSE RECOMMENDATIONS
    # ==============================

    total_course_recommendations = (
        await course_recommendations_collection.count_documents({})
    )


    # ==============================
    # RESPONSE
    # ==============================

    return {

        "success": True,

        "admin": {
            "name": admin.get("fullName"),
            "email": admin.get("email"),
            "role": admin.get("role")
        },

        "statistics": {

            "total_users":
                total_users,

            "active_users":
                active_users,

            "total_profiles":
                total_profiles,

            "total_resumes":
                total_resumes,

            "total_ats_analyses":
                total_ats,

            "total_jobs":
                total_jobs,

            "total_courses":
                total_courses,

            "career_recommendations":
                total_career_recommendations,

            "job_recommendations":
                total_job_recommendations,

            "course_recommendations":
                total_course_recommendations

        }

    }