from fastapi import APIRouter, HTTPException, Depends

from app.database import resumes_collection
from app.dependencies import get_current_user_id


router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


# ==========================================
# GET LOGGED-IN USER PROFILE
# ==========================================

@router.get("/")
async def get_profile(
    user_id: str = Depends(get_current_user_id)
):

    resume = await resumes_collection.find_one({
        "user_id": user_id
    })

    # New user has no profile/resume yet
    if not resume:
        return {
            "personal_information": {
                "name": "",
                "email": "",
                "phone": "",
                "github": "",
                "linkedin": "",
                "location": ""
            },
            "sections": {
                "education": [],
                "experience": [],
                "projects": [],
                "certifications": []
            },
            "skills": []
        }

    return resume.get("parsed_data", {})


# ==========================================
# PROFILE COMPLETION
# ==========================================

@router.get("/completion")
async def get_completion(
    user_id: str = Depends(get_current_user_id)
):

    resume = await resumes_collection.find_one({
        "user_id": user_id
    })

    if not resume:
        return {
            "completion": 0
        }

    data = resume.get("parsed_data", {})

    personal = data.get("personal_information", {})
    sections = data.get("sections", {})

    fields = [
        personal.get("name"),
        personal.get("email"),
        personal.get("phone"),
        personal.get("location"),
        personal.get("github"),
        personal.get("linkedin"),
        sections.get("education"),
        sections.get("experience"),
        sections.get("projects"),
        sections.get("certifications"),
        data.get("skills")
    ]

    filled_fields = sum(
        1 for field in fields if field
    )

    completion = round(
        (filled_fields / len(fields)) * 100
    )

    return {
        "completion": min(completion, 100)
    }


# ==========================================
# SAVE LOGGED-IN USER PROFILE
# ==========================================

@router.post("/")
async def save_profile(
    profile: dict,
    user_id: str = Depends(get_current_user_id)
):

    parsed_data = {

        "personal_information": {

            "name": profile.get("name", ""),
            "email": profile.get("email", ""),
            "phone": profile.get("phone", ""),
            "github": profile.get("github", ""),
            "linkedin": profile.get("linkedin", ""),
            "location": profile.get("location", "")

        },

        "sections": {

            "education": profile.get(
                "education",
                []
            ),

            "experience": profile.get(
                "experience",
                []
            ),

            "projects": profile.get(
                "projects",
                []
            ),

            "certifications": profile.get(
                "certifications",
                []
            )

        },

        "skills": profile.get(
            "skills",
            []
        )
    }

    # IMPORTANT:
    # Update only logged-in user's profile
    await resumes_collection.update_one(

        {
            "user_id": user_id
        },

        {
            "$set": {
                "user_id": user_id,
                "parsed_data": parsed_data
            }
        },

        upsert=True
    )

    return {
        "success": True,
        "message": "Profile saved successfully"
    }