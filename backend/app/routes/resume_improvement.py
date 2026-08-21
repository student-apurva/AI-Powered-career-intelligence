from fastapi import APIRouter, HTTPException
from bson import ObjectId

from app.database import (
    users_collection,
    resumes_collection,
    resume_improvement_collection,
)
from app.services.resume_improvement_analyzer import (
    analyze_resume_improvement,
)

from app.services.resume_improvement_ai import (
    generate_resume_improvements,
)


# ==========================================
# Router
# ==========================================

router = APIRouter(
    prefix="/api/resume-improvement",
    tags=["Resume Improvement"],
)


# ==========================================
# Build Resume Text
# ==========================================

def build_resume_text(
    personal_information,
    sections
):

    text_parts = []

    # ======================================
    # Personal Information
    # ======================================

    for key in [
        "name",
        "email",
        "phone",
        "location",
        "github",
        "linkedin",
    ]:

        value = personal_information.get(
            key,
            ""
        )

        if value:
            text_parts.append(
                str(value)
            )

    # ======================================
    # Resume Sections
    # ======================================

    for section_name in [
        "education",
        "experience",
        "projects",
        "certifications",
        "skills",
    ]:

        section_data = sections.get(
            section_name,
            []
        )

        if not section_data:
            continue

        text_parts.append(
            section_name.upper()
        )

        if isinstance(
            section_data,
            list
        ):

            for item in section_data:

                text_parts.append(
                    str(item)
                )

        else:

            text_parts.append(
                str(section_data)
            )

    return "\n".join(
        text_parts
    )


# ==========================================
# GET Resume Improvement
#
# GET /api/resume-improvement/{user_id}
# ==========================================

@router.get("/{user_id}")
async def get_resume_improvement(
    user_id: str
):

    try:

        print()
        print("======================================")
        print("RESUME IMPROVEMENT API")
        print("======================================")


        # ==================================
        # 1. Validate User ID
        # ==================================

        if not ObjectId.is_valid(
            user_id
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid user ID",
            )

        object_user_id = ObjectId(
            user_id
        )


        # ==================================
        # 2. Find User
        # ==================================

        user = await users_collection.find_one(
            {
                "_id": object_user_id
            }
        )

        if not user:

            raise HTTPException(
                status_code=404,
                detail="User not found",
            )


        print(
            "User:",
            user.get(
                "fullName",
                ""
            )
        )


        # ==================================
        # 3. Find Resume
        # ==================================

        # Try ObjectId first

        resume = await resumes_collection.find_one(
            {
                "user_id": object_user_id
            }
        )


        # Your MongoDB currently stores
        # user_id as string, so this lookup
        # will normally find the document.

        if not resume:

            resume = await resumes_collection.find_one(
                {
                    "user_id": user_id
                }
            )


        if not resume:

            raise HTTPException(
                status_code=404,
                detail=(
                    "Resume not found. "
                    "Please upload your resume first."
                ),
            )


        # ==================================
        # 4. Get Parsed Data
        # ==================================

        stored_parsed_data = resume.get(
            "parsed_data",
            {}
        )
        print()
        print("======================================")
        print("CHECKING PARSED DATA")
        print("======================================")

        print(
            "Parsed Data Keys:",
            stored_parsed_data.keys()
        )

        print(
            "Direct Skills:",
            stored_parsed_data.get(
                "skills",
                "SKILLS KEY NOT FOUND"
            )
        )

        print("======================================")
        if not isinstance(
            stored_parsed_data,
            dict
        ):

            stored_parsed_data = {}


        # ==================================
        # 5. Extract Personal Information
        # ==================================

        personal_information = (
            stored_parsed_data.get(
                "personal_information",
                {}
            )
        )

        if not isinstance(
            personal_information,
            dict
        ):

            personal_information = {}


        # ==================================
        # 6. Extract Resume Sections
        # ==================================

        sections = (
            stored_parsed_data.get(
                "sections",
                {}
            )
        )

        if not isinstance(
            sections,
            dict
        ):

            sections = {}


        # ==================================
        # 7. Normalize Data
        # ==================================
        #
        # Resume parser stores nested data.
        #
        # Resume analyzer expects:
        #
        # name
        # email
        # phone
        # github
        # linkedin
        # education
        # skills
        # experience
        # projects
        # certifications
        # ==================================

        parsed_data = {

            "name":
                personal_information.get(
                    "name",
                    ""
                ),

            "email":
                personal_information.get(
                    "email",
                    ""
                ),

            "phone":
                personal_information.get(
                    "phone",
                    ""
                ),

            "github":
                personal_information.get(
                    "github",
                    ""
                ),

            "linkedin":
                personal_information.get(
                    "linkedin",
                    ""
                ),

            "location":
                personal_information.get(
                    "location",
                    ""
                ),

            "education":
                sections.get(
                    "education",
                    []
                ),

            "skills":
    stored_parsed_data.get(
        "skills",
        []
    ),

            "experience":
                sections.get(
                    "experience",
                    []
                ),

            "projects":
                sections.get(
                    "projects",
                    []
                ),

            "certifications":
                sections.get(
                    "certifications",
                    []
                ),
        }
        print(
    "SKILLS AFTER NORMALIZATION:",
    parsed_data["skills"]
)

        # ==================================
        # 8. Get / Build Resume Text
        # ==================================
        #
        # Your MongoDB document does not
        # currently store raw resume text.
        #
        # Therefore build usable text from
        # the parsed resume sections.
        # ==================================

        resume_text = (
            resume.get(
                "resume_text"
            )
            or resume.get(
                "raw_text"
            )
            or resume.get(
                "extracted_text"
            )
            or ""
        )


        if not resume_text:

            resume_text = (
                build_resume_text(
                    personal_information,
                    sections
                )
            )


        # ==================================
        # 9. Debug Final Data
        # ==================================

        print()
        print("======================================")
        print("FINAL DATA SENT TO ANALYZER")
        print("======================================")

        print(
            "Name:",
            parsed_data.get(
                "name"
            )
        )

        print(
            "Email:",
            parsed_data.get(
                "email"
            )
        )

        print(
            "Phone:",
            parsed_data.get(
                "phone"
            )
        )

        print(
            "Education:",
            parsed_data.get(
                "education"
            )
        )

        print(
            "Skills:",
            parsed_data.get(
                "skills"
            )
        )

        print(
            "Projects:",
            parsed_data.get(
                "projects"
            )
        )

        print(
            "Experience:",
            parsed_data.get(
                "experience"
            )
        )

        print(
            "Certifications:",
            parsed_data.get(
                "certifications"
            )
        )

        print(
            "GitHub:",
            parsed_data.get(
                "github"
            )
        )

        print(
            "LinkedIn:",
            parsed_data.get(
                "linkedin"
            )
        )

        print(
            "Resume Text Length:",
            len(
                resume_text
            )
        )

        print(
            "======================================"
        )


        # ==================================
        # 10. Rule-Based Analysis
        # ==================================

        print()
        print(
            "Running rule-based "
            "resume analysis..."
        )


        analyzer_result = (
            analyze_resume_improvement(

                resume_data=parsed_data,

                resume_text=resume_text,
            )
        )


        print()
        print(
            "Resume Score:",
            analyzer_result.get(
                "resume_score",
                0
            )
        )

        print(
            "Resume Status:",
            analyzer_result.get(
                "status",
                ""
            )
        )


        # ==================================
        # 11. AI Analysis
        # ==================================

        print()
        print(
            "Generating AI resume "
            "improvement suggestions..."
        )


        ai_result = (
            generate_resume_improvements(

                resume_data=parsed_data,

                resume_text=resume_text,

                analyzer_result=(
                    analyzer_result
                ),
            )
        )


        # ==================================
        # 12. API Response
        # ==================================

        response_data = {

            "success": True,

            "message": (
                "Resume improvement analysis "
                "generated successfully"
            ),

            "user": {

                "id":
                    str(
                        user["_id"]
                    ),

                "fullName":
                    user.get(
                        "fullName",
                        ""
                    ),

                "email":
                    user.get(
                        "email",
                        ""
                    ),
            },


            # ==============================
            # Resume Information
            # ==============================

            "resume_profile": {

                "name":
                    parsed_data.get(
                        "name",
                        ""
                    ),

                "email":
                    parsed_data.get(
                        "email",
                        ""
                    ),

                "phone":
                    parsed_data.get(
                        "phone",
                        ""
                    ),

                "github":
                    parsed_data.get(
                        "github",
                        ""
                    ),

                "linkedin":
                    parsed_data.get(
                        "linkedin",
                        ""
                    ),

                "location":
                    parsed_data.get(
                        "location",
                        ""
                    ),
            },


            # ==============================
            # Rule-Based Analysis
            # ==============================

            "resume_score":
                analyzer_result.get(
                    "resume_score",
                    0
                ),

            "status":
                analyzer_result.get(
                    "status",
                    ""
                ),

            "component_scores":
                analyzer_result.get(
                    "component_scores",
                    {}
                ),

            "strengths":
                analyzer_result.get(
                    "strengths",
                    []
                ),

            "missing_sections":
                analyzer_result.get(
                    "missing_sections",
                    []
                ),

            "missing_links":
                analyzer_result.get(
                    "missing_links",
                    []
                ),

            "basic_improvements":
                analyzer_result.get(
                    "improvements",
                    []
                ),

            "statistics":
                analyzer_result.get(
                    "statistics",
                    {}
                ),


            # ==============================
            # AI Analysis
            # ==============================

            "ai_feedback": {

                "overall_feedback":
                    ai_result.get(
                        "overall_feedback",
                        ""
                    ),

                "top_priorities":
                    ai_result.get(
                        "top_priorities",
                        []
                    ),

                "suggestions":
                    ai_result.get(
                        "suggestions",
                        []
                    ),

                "rewrite_suggestions":
                    ai_result.get(
                        "rewrite_suggestions",
                        []
                    ),

                "suggested_action_verbs":
                    ai_result.get(
                        "suggested_action_verbs",
                        []
                    ),

                "skills_organization":
                    ai_result.get(
                        "skills_organization",
                        []
                    ),
            },
        }


        # ==================================
        # Success
        # ==================================
        # ==========================================
# Save Resume Improvement
# ==========================================

        from app.database import resume_improvement_collection

        resume_data =await resume_improvement_collection.update_one(

            {
                "user_id": user_id
            },

            {
                "$set": {

                    "user_id": user_id,

                    "resume_score":
                        analyzer_result.get(
                            "resume_score",
                            0
                        ),

                    "status":
                        analyzer_result.get(
                            "status",
                            ""
                        ),

                    "basic_improvements":
                        analyzer_result.get(
                            "improvements",
                            []
                        )

                }

            },

            upsert=True

        )
        print("\n========== RESUME IMPROVEMENT DOCUMENT ==========")
        print(resume_data)
        print("===============================================\n")
        print()
        print(
            "Resume improvement analysis "
            "completed successfully."
        )

        print(
            "======================================"
        )

        print()


        return response_data


    # ======================================
    # HTTP Errors
    # ======================================

    except HTTPException:
        raise


    # ======================================
    # Unexpected Errors
    # ======================================

    except Exception as e:

        print()
        print(
            "======================================"
        )

        print(
            "RESUME IMPROVEMENT API ERROR"
        )

        print(
            "======================================"
        )

        print(
            "Error:",
            repr(e)
        )

        print(
            "======================================"
        )

        print()


        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to analyze resume: "
                f"{str(e)}"
            ),
        )