from fastapi import APIRouter, Depends
from datetime import datetime, timedelta

from app.dependencies import get_current_admin
from app.database import activity_collection


router = APIRouter(
    prefix="/api/admin/activity",
    tags=["Admin Activity Monitoring"]
)


# =========================================================
# GET RECENT ACTIVITIES
# =========================================================

@router.get("")
async def get_activities(
    limit: int = 50,
    action: str = "",
    admin=Depends(get_current_admin)
):

    limit = min(max(limit, 1), 100)

    query = {}

    if action:

        query["action"] = {
            "$regex": action,
            "$options": "i"
        }


    cursor = activity_collection.find(
        query
    ).sort(
        "created_at",
        -1
    ).limit(
        limit
    )


    activities = []


    async for activity in cursor:

        activities.append({

            "id":
                str(
                    activity["_id"]
                ),

            "user_id":
                str(
                    activity.get(
                        "user_id"
                    )
                )
                if activity.get(
                    "user_id"
                )
                else None,

            "user_name":
                activity.get(
                    "user_name",
                    ""
                ),

            "email":
                activity.get(
                    "email",
                    ""
                ),

            "action":
                activity.get(
                    "action",
                    ""
                ),

            "description":
                activity.get(
                    "description",
                    ""
                ),

            "created_at":
                activity.get(
                    "created_at"
                )

        })


    # =====================================================
    # ACTIVITY STATISTICS
    # =====================================================

    total_activities = (
        await activity_collection.count_documents({})
    )


    # -----------------------------------------------------
    # Last 24 hours
    # -----------------------------------------------------

    last_24_hours = (
        datetime.utcnow()
        -
        timedelta(hours=24)
    )


    recent_activities = (
        await activity_collection.count_documents({
            "created_at": {
                "$gte": last_24_hours
            }
        })
    )


    # =====================================================
    # COUNT ACTIVITY TYPES
    # =====================================================

    registrations = (
        await activity_collection.count_documents({
            "action": {
                "$regex":
                    "registration|register|signup",
                "$options": "i"
            }
        })
    )


    resume_uploads = (
        await activity_collection.count_documents({
            "action": {
                "$regex":
                    "resume.*upload|upload.*resume",
                "$options": "i"
            }
        })
    )


    ats_analyses = (
        await activity_collection.count_documents({
            "action": {
                "$regex":
                    "ats|analysis|resume.*analy",
                "$options": "i"
            }
        })
    )


    job_recommendations = (
        await activity_collection.count_documents({
            "action": {
                "$regex":
                    "job.*recommend|recommend.*job",
                "$options": "i"
            }
        })
    )


    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "success": True,

        "total":
            len(activities),

        "statistics": {

            "registrations":
                registrations,

            "resume_uploads":
                resume_uploads,

            "ats_analyses":
                ats_analyses,

            "job_recommendations":
                job_recommendations,

            "total_activities":
                total_activities,

            "last_24_hours":
                recent_activities

        },

        "activities":
            activities

    }


# =========================================================
# ACTIVITY STATISTICS
# =========================================================

@router.get("/statistics")
async def activity_statistics(
    admin=Depends(get_current_admin)
):

    total_activities = (
        await activity_collection.count_documents({})
    )


    # -----------------------------------------------------
    # Activity by action
    # -----------------------------------------------------

    pipeline = [

        {
            "$match": {
                "action": {
                    "$nin": [
                        None,
                        ""
                    ]
                }
            }
        },

        {
            "$group": {

                "_id":
                    "$action",

                "count": {
                    "$sum": 1
                }

            }
        },

        {
            "$sort": {
                "count": -1
            }
        },

        {
            "$limit": 10
        }

    ]


    result = (
        await activity_collection.aggregate(
            pipeline
        ).to_list(
            length=10
        )
    )


    actions = []


    for item in result:

        actions.append({

            "action":
                item["_id"],

            "count":
                item["count"]

        })


    # -----------------------------------------------------
    # Last 24 hours
    # -----------------------------------------------------

    last_24_hours = (
        datetime.utcnow()
        -
        timedelta(hours=24)
    )


    recent_count = (
        await activity_collection.count_documents({
            "created_at": {
                "$gte": last_24_hours
            }
        })
    )


    # -----------------------------------------------------
    # Active users
    # -----------------------------------------------------

    active_users = (
        await activity_collection.distinct(
            "user_id",
            {
                "created_at": {
                    "$gte": last_24_hours
                }
            }
        )
    )


    return {

        "success": True,

        "statistics": {

            "total_activities":
                total_activities,

            "last_24_hours":
                recent_count,

            "active_users_24_hours":
                len(active_users),

            "top_actions":
                actions

        }

    }
