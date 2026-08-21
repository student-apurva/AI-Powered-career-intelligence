from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.dependencies import get_current_admin
from app.database import resumes_collection, db


router = APIRouter(
    prefix="/api/admin/resumes",
    tags=["Admin Resume Management"]
)


# =========================================================
# COLLECTIONS
# =========================================================

users_collection = db["users"]


# =========================================================
# HELPER: GET USER INFORMATION
# =========================================================

async def get_resume_user_info(user_id):

    if not user_id:
        return {
            "user_name": "",
            "email": "",
            "mobile": ""
        }

    # Convert ObjectId to string if required
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
# GET ALL RESUMES
# =========================================================

@router.get("")
async def get_all_resumes(
    search: str = "",
    admin=Depends(get_current_admin)
):

    query = {}

    # -----------------------------------------
    # Search
    # -----------------------------------------

    if search:

        query["$or"] = [

            {
                "file_name": {
                    "$regex": search,
                    "$options": "i"
                }
            },

            {
                "filename": {
                    "$regex": search,
                    "$options": "i"
                }
            },

            {
                "email": {
                    "$regex": search,
                    "$options": "i"
                }
            }

        ]

    # -----------------------------------------
    # Fetch resumes
    # -----------------------------------------

    cursor = resumes_collection.find(
        query
    ).sort(
        "_id",
        -1
    )

    resumes = []

    async for resume in cursor:

        # -----------------------------------------
        # Get status
        # -----------------------------------------

        status = resume.get(
            "status",
            "Uploaded"
        )

        # -----------------------------------------
        # Get score
        # -----------------------------------------

        score = resume.get(
            "score",
            0
        )

        # -----------------------------------------
        # Get owner
        # -----------------------------------------

        user_id = resume.get(
            "user_id"
        )

        if user_id is not None:
            user_id = str(user_id)

        # -----------------------------------------
        # Get user information
        # -----------------------------------------

        user_info = await get_resume_user_info(
            user_id
        )

        # -----------------------------------------
        # Build resume response
        # -----------------------------------------

        resumes.append({

            "id": str(
                resume["_id"]
            ),

            "user_id": user_id,

            "user_name": user_info[
                "user_name"
            ],

            "email": (
                user_info["email"]
                or resume.get(
                    "email",
                    ""
                )
            ),

            "mobile": user_info[
                "mobile"
            ],

            "file_name": resume.get(
                "file_name",
                resume.get(
                    "filename",
                    ""
                )
            ),

            "status": status,

            "score": score,

            "uploaded_at": resume.get(
                "uploaded_at",
                resume.get(
                    "created_at"
                )
            ),

            "parsed_data": resume.get(
                "parsed_data",
                {}
            )

        })

    return {

        "success": True,

        "total": len(resumes),

        "resumes": resumes

    }


# =========================================================
# RESUME STATISTICS
# =========================================================

@router.get("/statistics")
async def resume_statistics(
    admin=Depends(get_current_admin)
):

    # -----------------------------------------
    # Total
    # -----------------------------------------

    total_resumes = await resumes_collection.count_documents({})


    # -----------------------------------------
    # Parsed
    # -----------------------------------------

    parsed_resumes = await resumes_collection.count_documents({

        "$or": [

            {
                "status": {
                    "$regex": "^parsed$",
                    "$options": "i"
                }
            },

            {
                "parsed_data": {
                    "$exists": True,
                    "$ne": {}
                }
            }

        ]

    })


    # -----------------------------------------
    # Failed
    # -----------------------------------------

    failed_resumes = await resumes_collection.count_documents({

        "status": {
            "$regex": "failed|error",
            "$options": "i"
        }

    })


    # -----------------------------------------
    # Pending / Uploaded
    # -----------------------------------------

    pending_resumes = max(
        total_resumes
        - parsed_resumes
        - failed_resumes,
        0
    )


    # -----------------------------------------
    # Average Resume Score
    # -----------------------------------------

    pipeline = [

        {
            "$match": {
                "score": {
                    "$type": "number"
                }
            }
        },

        {
            "$group": {

                "_id": None,

                "average_score": {
                    "$avg": "$score"
                }

            }

        }

    ]

    result = await resumes_collection.aggregate(
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

    else:

        average_score = 0


    return {

        "success": True,

        "statistics": {

            "total_resumes":
                total_resumes,

            "parsed_resumes":
                parsed_resumes,

            "failed_resumes":
                failed_resumes,

            "pending_resumes":
                pending_resumes,

            "average_score":
                average_score

        }

    }


# =========================================================
# GET SINGLE RESUME
# =========================================================

@router.get("/{resume_id}")
async def get_resume(
    resume_id: str,
    admin=Depends(get_current_admin)
):

    # -----------------------------------------
    # Validate resume ID
    # -----------------------------------------

    try:

        object_id = ObjectId(
            resume_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid resume ID"
        )


    # -----------------------------------------
    # Find resume
    # -----------------------------------------

    resume = await resumes_collection.find_one({

        "_id": object_id

    })


    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )


    # -----------------------------------------
    # Get owner
    # -----------------------------------------

    user_id = resume.get(
        "user_id"
    )

    if user_id is not None:
        user_id = str(user_id)


    # -----------------------------------------
    # Get user information
    # -----------------------------------------

    user_info = await get_resume_user_info(
        user_id
    )


    # -----------------------------------------
    # Return resume
    # -----------------------------------------

    return {

        "success": True,

        "resume": {

            "id":
                str(resume["_id"]),

            "user_id":
                user_id,

            "user_name":
                user_info["user_name"],

            "email":
                (
                    user_info["email"]
                    or resume.get(
                        "email",
                        ""
                    )
                ),

            "mobile":
                user_info["mobile"],

            "file_name":
                resume.get(
                    "file_name",
                    resume.get(
                        "filename",
                        ""
                    )
                ),

            "status":
                resume.get(
                    "status",
                    "Uploaded"
                ),

            "score":
                resume.get(
                    "score",
                    0
                ),

            "uploaded_at":
                resume.get(
                    "uploaded_at",
                    resume.get(
                        "created_at"
                    )
                ),

            "parsed_data":
                resume.get(
                    "parsed_data",
                    {}
                )

        }

    }