from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.dependencies import get_current_admin
from app.database import db


router = APIRouter(
    prefix="/api/admin/profiles",
    tags=["Admin Profiles"]
)


# =========================================================
# COLLECTIONS
# =========================================================

users_collection = db["users"]
resumes_collection = db["resumes"]


# =========================================================
# GET ALL PROFILES
# =========================================================

@router.get("")
async def get_profiles(
    admin=Depends(get_current_admin)
):

    profiles = []

    cursor = users_collection.find({})

    async for user in cursor:

        user_id = str(user["_id"])

        # ---------------------------------------------
        # Find user's resume/profile
        # ---------------------------------------------

        resume = await resumes_collection.find_one({
            "user_id": user_id
        })

        parsed_data = {}

        if resume:
            parsed_data = resume.get(
                "parsed_data",
                {}
            )

        # ---------------------------------------------
        # Personal information
        # ---------------------------------------------

        personal = parsed_data.get(
            "personal_information",
            {}
        )

        # ---------------------------------------------
        # Profile sections
        # ---------------------------------------------

        sections = parsed_data.get(
            "sections",
            {}
        )

        # ---------------------------------------------
        # Build profile
        # ---------------------------------------------

        profile = {

            "id": user_id,

            "name": (
                user.get("fullName")
                or personal.get("name")
                or user.get("name")
                or ""
            ),

            "email": (
                user.get("email")
                or personal.get("email")
                or ""
            ),

            "phone": (
                user.get("mobile")
                or user.get("phone")
                or personal.get("phone")
                or ""
            ),

            "careerInterest": (
                user.get("careerInterest")
                or user.get("career_interest")
                or parsed_data.get("careerInterest")
                or ""
            ),

            "skills": parsed_data.get(
                "skills",
                []
            ),

            "education": sections.get(
                "education",
                []
            ),

            "experience": sections.get(
                "experience",
                []
            ),

            "projects": sections.get(
                "projects",
                []
            ),

            "certifications": sections.get(
                "certifications",
                []
            ),

            "location": (
                personal.get("location")
                or user.get("location")
                or ""
            ),

            "github": (
                personal.get("github")
                or user.get("github")
                or ""
            ),

            "linkedin": (
                personal.get("linkedin")
                or user.get("linkedin")
                or ""
            )

        }

        profiles.append(profile)

    return {

        "success": True,

        "total": len(profiles),

        "profiles": profiles

    }


# =========================================================
# GET SINGLE PROFILE
# =========================================================

@router.get("/{profile_id}")
async def get_profile(
    profile_id: str,
    admin=Depends(get_current_admin)
):

    try:

        object_id = ObjectId(profile_id)

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid profile ID"
        )

    # ---------------------------------------------
    # Get user
    # ---------------------------------------------

    user = await users_collection.find_one({
        "_id": object_id
    })

    if not user:

        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    user_id = str(user["_id"])

    # ---------------------------------------------
    # Get resume/profile
    # ---------------------------------------------

    resume = await resumes_collection.find_one({
        "user_id": user_id
    })

    parsed_data = {}

    if resume:

        parsed_data = resume.get(
            "parsed_data",
            {}
        )

    personal = parsed_data.get(
        "personal_information",
        {}
    )

    sections = parsed_data.get(
        "sections",
        {}
    )

    # ---------------------------------------------
    # Build complete profile
    # ---------------------------------------------

    profile = {

        "id": user_id,

        "name": (
            user.get("fullName")
            or personal.get("name")
            or user.get("name")
            or ""
        ),

        "email": (
            user.get("email")
            or personal.get("email")
            or ""
        ),

        "phone": (
            user.get("mobile")
            or user.get("phone")
            or personal.get("phone")
            or ""
        ),

        "careerInterest": (
            user.get("careerInterest")
            or user.get("career_interest")
            or parsed_data.get("careerInterest")
            or ""
        ),

        "skills": parsed_data.get(
            "skills",
            []
        ),

        "education": sections.get(
            "education",
            []
        ),

        "experience": sections.get(
            "experience",
            []
        ),

        "projects": sections.get(
            "projects",
            []
        ),

        "certifications": sections.get(
            "certifications",
            []
        ),

        "location": (
            personal.get("location")
            or user.get("location")
            or ""
        ),

        "github": (
            personal.get("github")
            or user.get("github")
            or ""
        ),

        "linkedin": (
            personal.get("linkedin")
            or user.get("linkedin")
            or ""
        )

    }

    return {

        "success": True,

        "profile": profile

    }