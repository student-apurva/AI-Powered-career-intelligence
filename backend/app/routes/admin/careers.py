from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.dependencies import get_current_admin
from app.database import career_recommendations_collection


router = APIRouter(
    prefix="/api/admin/careers",
    tags=["Admin Career Analytics"]
)


# =========================================================
# GET ALL CAREER RECOMMENDATIONS
# =========================================================

@router.get("")
async def get_all_career_recommendations(
    search: str = "",
    admin=Depends(get_current_admin)
):

    recommendations = []

    # -----------------------------------------------------
    # Get all career recommendation documents
    # -----------------------------------------------------

    cursor = career_recommendations_collection.find(
        {}
    ).sort(
        "_id",
        -1
    )


    # -----------------------------------------------------
    # Process every user document
    # -----------------------------------------------------

    async for document in cursor:

        user_id = document.get(
            "user_id"
        )

        if isinstance(
            user_id,
            ObjectId
        ):

            user_id = str(
                user_id
            )

        elif user_id is not None:

            user_id = str(
                user_id
            )


        email = document.get(
            "email",
            ""
        )


        # -------------------------------------------------
        # Recommendations are stored inside
        # the "recommendations" array
        # -------------------------------------------------

        career_list = document.get(
            "recommendations",
            []
        )


        if not isinstance(
            career_list,
            list
        ):

            continue


        # -------------------------------------------------
        # Process each career
        # -------------------------------------------------

        for index, career_data in enumerate(
            career_list
        ):

            if not isinstance(
                career_data,
                dict
            ):

                continue


            career_name = career_data.get(
                "career",
                ""
            )


            # Skip empty career records

            if not career_name:

                continue


            # -------------------------------------------------
            # Search
            # -------------------------------------------------

            if search:

                search_lower = (
                    search.lower()
                )

                if search_lower not in (
                    str(
                        career_name
                    ).lower()
                ):

                    continue


            recommendations.append({

                "id":
                    f"{document['_id']}_{index}",

                "document_id":
                    str(
                        document["_id"]
                    ),

                "user_id":
                    user_id,

                "email":
                    email,

                "career":
                    career_name,

                "score":
                    career_data.get(
                        "match_percentage",
                        0
                    ),

                "reason":
                    career_data.get(
                        "reason",
                        ""
                    ),

                "matching_skills":
                    career_data.get(
                        "matching_skills",
                        []
                    ),

                "skills_to_improve":
                    career_data.get(
                        "skills_to_improve",
                        []
                    ),

                "roadmap":
                    career_data.get(
                        "roadmap",
                        []
                    ),

                "created_at":
                    document.get(
                        "updated_at"
                    )

            })


    # -----------------------------------------------------
    # Return response
    # -----------------------------------------------------

    return {

        "success": True,

        "total":
            len(recommendations),

        "careers":
            recommendations,

        "recommendations":
            recommendations

    }


# =========================================================
# CAREER STATISTICS
# =========================================================

@router.get("/statistics")
async def career_statistics(
    admin=Depends(get_current_admin)
):

    total_recommendations = 0

    career_counts = {}

    unique_careers = set()


    # -----------------------------------------------------
    # Get all documents
    # -----------------------------------------------------

    cursor = career_recommendations_collection.find(
        {},
        {
            "recommendations": 1
        }
    )


    async for document in cursor:

        career_list = document.get(
            "recommendations",
            []
        )


        if not isinstance(
            career_list,
            list
        ):

            continue


        # -------------------------------------------------
        # Count every career recommendation
        # -------------------------------------------------

        for career_data in career_list:

            if not isinstance(
                career_data,
                dict
            ):

                continue


            career_name = career_data.get(
                "career",
                ""
            )


            if not career_name:

                continue


            total_recommendations += 1


            normalized = (
                str(
                    career_name
                ).strip().lower()
            )


            unique_careers.add(
                normalized
            )


            if normalized not in career_counts:

                career_counts[
                    normalized
                ] = {

                    "career":
                        career_name,

                    "count":
                        0

                }


            career_counts[
                normalized
            ]["count"] += 1


    # -----------------------------------------------------
    # Sort careers
    # -----------------------------------------------------

    top_careers = list(
        career_counts.values()
    )


    top_careers.sort(
        key=lambda x: x["count"],
        reverse=True
    )


    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {

        "success": True,

        "statistics": {

            "total_recommendations":
                total_recommendations,

            "unique_careers":
                len(
                    unique_careers
                ),

            "top_careers":
                top_careers[:10]

        }

    }


# =========================================================
# GET SINGLE CAREER RECOMMENDATION
# =========================================================

@router.get("/{career_id}")
async def get_career_recommendation(
    career_id: str,
    admin=Depends(get_current_admin)
):

    # -----------------------------------------------------
    # Our ID format is:
    #
    # MongoDocumentID_ArrayIndex
    #
    # Example:
    # 6a6af097c299ad2201013369_0
    # -----------------------------------------------------

    try:

        document_id, index_string = (
            career_id.rsplit(
                "_",
                1
            )
        )

        object_id = ObjectId(
            document_id
        )

        index = int(
            index_string
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid career recommendation ID"
        )


    # -----------------------------------------------------
    # Find document
    # -----------------------------------------------------

    document = await (
        career_recommendations_collection.find_one(
            {
                "_id": object_id
            }
        )
    )


    if not document:

        raise HTTPException(
            status_code=404,
            detail="Career recommendation not found"
        )


    # -----------------------------------------------------
    # Get recommendations
    # -----------------------------------------------------

    career_list = document.get(
        "recommendations",
        []
    )


    if (
        not isinstance(
            career_list,
            list
        )
        or
        index >= len(career_list)
    ):

        raise HTTPException(
            status_code=404,
            detail="Career recommendation not found"
        )


    career_data = career_list[
        index
    ]


    if not isinstance(
        career_data,
        dict
    ):

        raise HTTPException(
            status_code=404,
            detail="Career recommendation not found"
        )


    user_id = document.get(
        "user_id"
    )


    if isinstance(
        user_id,
        ObjectId
    ):

        user_id = str(
            user_id
        )

    elif user_id is not None:

        user_id = str(
            user_id
        )


    # -----------------------------------------------------
    # Return single recommendation
    # -----------------------------------------------------

    return {

        "success": True,

        "recommendation": {

            "id":
                career_id,

            "user_id":
                user_id,

            "email":
                document.get(
                    "email",
                    ""
                ),

            "career":
                career_data.get(
                    "career",
                    ""
                ),

            "score":
                career_data.get(
                    "match_percentage",
                    0
                ),

            "reason":
                career_data.get(
                    "reason",
                    ""
                ),

            "matching_skills":
                career_data.get(
                    "matching_skills",
                    []
                ),

            "skills_to_improve":
                career_data.get(
                    "skills_to_improve",
                    []
                ),

            "roadmap":
                career_data.get(
                    "roadmap",
                    []
                ),

            "created_at":
                document.get(
                    "updated_at"
                )

        }

    }