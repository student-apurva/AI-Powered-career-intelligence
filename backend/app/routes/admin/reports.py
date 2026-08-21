from fastapi import APIRouter, Depends

from app.dependencies import get_current_admin

from app.database import (
    users_collection,
    resumes_collection,
    ats_results_collection,
    jobs_collection,
    job_recommendations_collection,
    courses_collection,
    course_recommendations_collection,
    career_recommendations_collection,
    saved_jobs_collection,
    resume_improvement_collection,
    activity_collection,
)


router = APIRouter(
    prefix="/api/admin/reports",
    tags=["Admin Reports"]
)


@router.get("/overview")
async def reports_overview(
    admin=Depends(get_current_admin)
):

    # =====================================================
    # BASIC COUNTS
    # =====================================================

    total_users = await users_collection.count_documents({})

    total_resumes = await resumes_collection.count_documents({})

    total_ats = await ats_results_collection.count_documents({})

    total_jobs = await jobs_collection.count_documents({})

    total_courses = await courses_collection.count_documents({})

    total_job_recommendations = (
        await job_recommendations_collection.count_documents({})
    )

    total_course_recommendations = (
        await course_recommendations_collection.count_documents({})
    )

    total_career_recommendations = (
        await career_recommendations_collection.count_documents({})
    )

    total_saved_jobs = (
        await saved_jobs_collection.count_documents({})
    )

    total_resume_improvements = (
        await resume_improvement_collection.count_documents({})
    )

    total_activities = (
        await activity_collection.count_documents({})
    )


    # =====================================================
    # USER ROLES
    # =====================================================

    students = await users_collection.count_documents({
        "role": {
            "$regex": "^student$",
            "$options": "i"
        }
    })

    professionals = await users_collection.count_documents({
        "role": {
            "$regex": "^professional$",
            "$options": "i"
        }
    })

    recruiters = await users_collection.count_documents({
        "role": {
            "$regex": "^recruiter$",
            "$options": "i"
        }
    })


    # =====================================================
    # ATS ANALYTICS
    # =====================================================

    ats_pipeline = [

        {
            "$group": {
                "_id": None,

                "average_ats_score": {
                    "$avg": "$ats_score"
                },

                "average_coverage_score": {
                    "$avg": "$coverage_score"
                }
            }
        }

    ]

    ats_result = (
        await ats_results_collection
        .aggregate(ats_pipeline)
        .to_list(length=1)
    )


    if ats_result:

        average_ats_score = round(
            ats_result[0].get(
                "average_ats_score",
                0
            ) or 0,
            2
        )

        average_coverage_score = round(
            ats_result[0].get(
                "average_coverage_score",
                0
            ) or 0,
            2
        )

    else:

        average_ats_score = 0

        average_coverage_score = 0


    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "success": True,

        "report": {

            "users": {

                "total": total_users,

                "students": students,

                "professionals": professionals,

                "recruiters": recruiters

            },

            "resumes": {

                "total": total_resumes,

                "improvements":
                    total_resume_improvements

            },

            "ats": {

                "total_analyses":
                    total_ats,

                "average_ats_score":
                    average_ats_score,

                "average_coverage_score":
                    average_coverage_score

            },

            "jobs": {

                "total":
                    total_jobs,

                "recommendations":
                    total_job_recommendations,

                "saved":
                    total_saved_jobs

            },

            "courses": {

                "total":
                    total_courses,

                "recommendations":
                    total_course_recommendations

            },

            "careers": {

                "recommendations":
                    total_career_recommendations

            },

            "activity": {

                "total":
                    total_activities

            }

        }

    }