from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from bson import ObjectId

from app.database import (
    users_collection,
    resumes_collection,
    career_recommendations_collection
)

from app.services.career_ai import (
    generate_career_recommendations
)


# ==========================================
# Router
# ==========================================

router = APIRouter(
    prefix="/api/career",
    tags=["Career Recommendation"]
)


# ==========================================
# Career Recommendation API
# GET /api/career/recommendations/{user_id}
# ==========================================

@router.get("/recommendations/{user_id}")
async def get_career_recommendations(
    user_id: str
):

    try:

        # ======================================
        # 1. Validate MongoDB ObjectId
        # ======================================

        if not ObjectId.is_valid(user_id):

            raise HTTPException(
                status_code=400,
                detail="Invalid user ID"
            )

        object_user_id = ObjectId(user_id)


        # ======================================
        # 2. Check User Exists
        # ======================================

        user = await users_collection.find_one(
            {
                "_id": object_user_id
            }
        )

        if not user:

            raise HTTPException(
                status_code=404,
                detail="User not found"
            )


        # ======================================
        # 3. Find User Resume
        # ======================================

        # First try ObjectId format
        resume = await resumes_collection.find_one(
            {
                "user_id": object_user_id
            }
        )


        # Try string format
        if not resume:

            resume = await resumes_collection.find_one(
                {
                    "user_id": user_id
                }
            )


        # Try userId field if older records
        # use this naming format
        if not resume:

            resume = await resumes_collection.find_one(
                {
                    "userId": user_id
                }
            )


        if not resume:

            raise HTTPException(
                status_code=404,
                detail=(
                    "Resume not found. "
                    "Please upload your resume first."
                )
            )


        # ======================================
        # 4. Get Parsed Resume Data
        # ======================================

        parsed_data = resume.get(
            "parsed_data",
            {}
        )


        # Some older resume documents may store
        # parsed fields directly.
        if not parsed_data:

            parsed_data = resume


        # ======================================
        # 5. Extract Career Information
        # ======================================

        education = parsed_data.get(
            "education",
            []
        )

        skills = parsed_data.get(
            "skills",
            []
        )

        experience = parsed_data.get(
            "experience",
            []
        )

        projects = parsed_data.get(
            "projects",
            []
        )


        # ======================================
        # 6. Normalize Data
        # ======================================

        education = education or []

        skills = skills or []

        experience = experience or []

        projects = projects or []


        # ======================================
        # 7. Validate Skills
        # ======================================

        if not skills:

            raise HTTPException(
                status_code=400,
                detail=(
                    "No skills were found in the "
                    "parsed resume. Please upload "
                    "or update your resume."
                )
            )


        # ======================================
        # Debug Input
        # ======================================

        print()
        print(
            "======================================"
        )

        print(
            "CAREER RECOMMENDATION INPUT"
        )

        print(
            "======================================"
        )

        print(
            "User:",
            user.get(
                "fullName",
                ""
            )
        )

        print(
            "Education:",
            education
        )

        print(
            "Skills:",
            skills
        )

        print(
            "Experience:",
            experience
        )

        print(
            "Projects:",
            projects
        )

        print(
            "======================================"
        )

        print()


        # ======================================
        # 8. Generate AI Recommendations
        # ======================================

        recommendations = (
            generate_career_recommendations(

                education=education,

                skills=skills,

                experience=experience,

                projects=projects
            )
        )


        # ======================================
        # 9. Extract Recommendation List
        # ======================================

        recommendation_list = (
            recommendations.get(
                "recommendations",
                []
            )
        )


        if not recommendation_list:

            raise HTTPException(
                status_code=500,
                detail=(
                    "AI did not return any career "
                    "recommendations."
                )
            )


        # ======================================
        # 10. Save Recommendations to MongoDB
        # ======================================

        await (
            career_recommendations_collection
            .update_one(
                {
                    "user_id": user_id
                },
                {
                    "$set": {

                        "user_id":
                            user_id,

                        "user_object_id":
                            object_user_id,

                        "recommendations":
                            recommendation_list,

                        "profile_snapshot": {

                            "education":
                                education,

                            "skills":
                                skills,

                            "experience":
                                experience,

                            "projects":
                                projects
                        },

                        "updated_at":
                            datetime.now(
                                timezone.utc
                            )
                    }
                },

                upsert=True
            )
        )


        print()
        print(
            "======================================"
        )

        print(
            "CAREER RECOMMENDATIONS SAVED"
        )

        print(
            "======================================"
        )

        print(
            "User ID:",
            user_id
        )

        print(
            "Recommendations:",
            len(
                recommendation_list
            )
        )

        print(
            "======================================"
        )

        print()


        # ======================================
        # 11. Return Response
        # ======================================

        return {

            "success": True,

            "message": (
                "Career recommendations "
                "generated successfully"
            ),

            "user": {

                "id":
                    str(user["_id"]),

                "fullName":
                    user.get(
                        "fullName",
                        ""
                    ),

                "email":
                    user.get(
                        "email",
                        ""
                    )
            },


            # ==================================
            # Resume Information Used by AI
            # ==================================

            "profile_analysis": {

                "education":
                    education,

                "skills":
                    skills,

                "experience":
                    experience,

                "projects":
                    projects
            },


            # ==================================
            # AI Result
            # ==================================

            "data":
                recommendations
        }


    # ======================================
    # Preserve HTTP Errors
    # ======================================

    except HTTPException:

        raise


    # ======================================
    # Handle Unexpected Errors
    # ======================================

    except Exception as e:

        print()
        print(
            "Career Recommendation API Error:"
        )

        print(
            repr(e)
        )


        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to generate career "
                "recommendations"
            )
        )