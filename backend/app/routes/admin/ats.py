from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.dependencies import get_current_admin
from app.database import ats_results_collection, db


router = APIRouter(
    prefix="/api/admin/ats",
    tags=["Admin ATS Management"]
)


# =========================================================
# COLLECTIONS
# =========================================================

users_collection = db["users"]


# =========================================================
# HELPER: GET USER INFORMATION
# =========================================================

async def get_user_info(user_id):

    if not user_id:

        return {
            "user_name": "",
            "email": "",
            "mobile": ""
        }


    user_id_str = str(user_id)


    try:

        user = await users_collection.find_one({
            "_id": ObjectId(user_id_str)
        })

    except Exception:

        user = None


    if not user:

        return {
            "user_name": "",
            "email": "",
            "mobile": ""
        }


    return {

        "user_name": (
            user.get("fullName")
            or user.get("name")
            or ""
        ),

        "email": user.get(
            "email",
            ""
        ),

        "mobile": (
            user.get("mobile")
            or user.get("phone")
            or ""
        )

    }


# =========================================================
# GET ALL ATS RESULTS
# =========================================================

@router.get("")
async def get_all_ats(
    search: str = "",
    admin=Depends(get_current_admin)
):

    query = {}


    # -----------------------------------------------------
    # Search
    # -----------------------------------------------------

    if search:

        query["$or"] = [

            {
                "email": {
                    "$regex": search,
                    "$options": "i"
                }
            },

            {
                "user_id": {
                    "$regex": search,
                    "$options": "i"
                }
            }

        ]


    # -----------------------------------------------------
    # Fetch ATS results
    # -----------------------------------------------------

    cursor = ats_results_collection.find(
        query
    ).sort(
        "_id",
        -1
    )


    results = []


    async for ats in cursor:


        # -------------------------------------------------
        # Get score
        # -------------------------------------------------

        score = ats.get(
            "score",
            ats.get(
                "ats_score",
                0
            )
        )


        # -------------------------------------------------
        # Get user ID
        # -------------------------------------------------

        user_id = ats.get(
            "user_id"
        )


        if user_id is not None:

            user_id = str(
                user_id
            )


        # -------------------------------------------------
        # Get user information
        # -------------------------------------------------

        user_info = await get_user_info(
            user_id
        )


        # -------------------------------------------------
        # Matching skills
        # -------------------------------------------------

        matching_skills = ats.get(
            "matching_skills",
            []
        )


        # -------------------------------------------------
        # Missing skills
        # -------------------------------------------------

        missing_skills = ats.get(
            "missing_skills",
            []
        )


        # -------------------------------------------------
        # Add result
        # -------------------------------------------------

        results.append({

            "id":
                str(ats["_id"]),


            "user_id":
                user_id,


            "user_name":
                user_info["user_name"],


            "email":
                (
                    user_info["email"]
                    or ats.get(
                        "email",
                        ""
                    )
                ),


            "mobile":
                user_info["mobile"],


            "score":
                score,


            "matching_skills":
                matching_skills,


            "missing_skills":
                missing_skills,


            "job_description_uploaded":
                ats.get(
                    "job_description_uploaded",
                    False
                ),


            "created_at":
                ats.get(
                    "created_at",
                    ats.get(
                        "uploaded_at"
                    )
                )

        })


    return {

        "success": True,

        "total":
            len(results),

        "results":
            results

    }


# =========================================================
# ATS STATISTICS
# =========================================================

@router.get("/statistics")
async def ats_statistics(
    admin=Depends(get_current_admin)
):


    # -----------------------------------------------------
    # Total Analyses
    # -----------------------------------------------------

    total_analyses = (
        await ats_results_collection.count_documents({})
    )


    # -----------------------------------------------------
    # Score Statistics
    # -----------------------------------------------------

    pipeline = [

        {
            "$match": {

                "$or": [

                    {
                        "score": {
                            "$type": "number"
                        }
                    },

                    {
                        "ats_score": {
                            "$type": "number"
                        }
                    }

                ]

            }
        },


        {
            "$project": {

                "score_value": {

                    "$ifNull": [

                        "$score",

                        "$ats_score"

                    ]

                }

            }

        },


        {
            "$group": {

                "_id": None,

                "average_score": {

                    "$avg":
                        "$score_value"

                },

                "highest_score": {

                    "$max":
                        "$score_value"

                },

                "lowest_score": {

                    "$min":
                        "$score_value"

                }

            }

        }

    ]


    result = await ats_results_collection.aggregate(
        pipeline
    ).to_list(
        length=1
    )


    if result:

        average_score = round(

            result[0].get(
                "average_score",
                0
            ),

            2

        )


        highest_score = result[0].get(
            "highest_score",
            0
        )


        lowest_score = result[0].get(
            "lowest_score",
            0
        )


    else:

        average_score = 0

        highest_score = 0

        lowest_score = 0


    # -----------------------------------------------------
    # Job Description Uploaded
    # -----------------------------------------------------

    job_description_analyses = (
        await ats_results_collection.count_documents({

            "job_description_uploaded": True

        })
    )


    return {

        "success": True,

        "statistics": {

            "total_analyses":
                total_analyses,

            "average_score":
                average_score,

            "highest_score":
                highest_score,

            "lowest_score":
                lowest_score,

            "job_description_analyses":
                job_description_analyses

        }

    }


# =========================================================
# GET SINGLE ATS RESULT
# =========================================================

@router.get("/{ats_id}")
async def get_ats_result(
    ats_id: str,
    admin=Depends(get_current_admin)
):


    # -----------------------------------------------------
    # Validate ID
    # -----------------------------------------------------

    try:

        object_id = ObjectId(
            ats_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid ATS ID"
        )


    # -----------------------------------------------------
    # Find ATS result
    # -----------------------------------------------------

    ats = await ats_results_collection.find_one({

        "_id": object_id

    })


    if not ats:

        raise HTTPException(
            status_code=404,
            detail="ATS result not found"
        )


    # -----------------------------------------------------
    # Get user ID
    # -----------------------------------------------------

    user_id = ats.get(
        "user_id"
    )


    if user_id is not None:

        user_id = str(
            user_id
        )


    # -----------------------------------------------------
    # Get user information
    # -----------------------------------------------------

    user_info = await get_user_info(
        user_id
    )


    # -----------------------------------------------------
    # Return result
    # -----------------------------------------------------

    return {

        "success": True,

        "result": {

            "id":
                str(ats["_id"]),


            "user_id":
                user_id,


            "user_name":
                user_info["user_name"],


            "email":
                (
                    user_info["email"]
                    or ats.get(
                        "email",
                        ""
                    )
                ),


            "mobile":
                user_info["mobile"],


            "score":
                ats.get(
                    "score",
                    ats.get(
                        "ats_score",
                        0
                    )
                ),


            "matching_skills":
                ats.get(
                    "matching_skills",
                    []
                ),


            "missing_skills":
                ats.get(
                    "missing_skills",
                    []
                ),


            "job_description_uploaded":
                ats.get(
                    "job_description_uploaded",
                    False
                ),


            "created_at":
                ats.get(
                    "created_at",
                    ats.get(
                        "uploaded_at"
                    )
                )

        }

    }