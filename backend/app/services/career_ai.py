import os
from typing import List

from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel, Field


# ==========================================
# Load Environment Variables
# ==========================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found in .env file"
    )


# ==========================================
# Gemini Client
# ==========================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# ==========================================
# Gemini Models
# ==========================================

# Try the primary model first.
# If it is temporarily unavailable,
# automatically try the fallback models.

GEMINI_MODELS = [
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
]


# ==========================================
# Response Models
# ==========================================

class CareerRecommendation(BaseModel):

    career: str = Field(
        description="Recommended career role"
    )

    match_percentage: int = Field(
        ge=0,
        le=100,
        description=(
            "Career suitability score "
            "from 0 to 100"
        )
    )

    reason: str = Field(
        description=(
            "Reason why this career "
            "matches the candidate"
        )
    )

    matching_skills: List[str] = Field(
        description=(
            "Candidate skills relevant "
            "to this career"
        )
    )

    skills_to_improve: List[str] = Field(
        description=(
            "Important skills the candidate "
            "should learn or improve"
        )
    )

    roadmap: List[str] = Field(
        description=(
            "Short learning roadmap for "
            "entering this career"
        )
    )


class CareerRecommendationResponse(BaseModel):

    recommendations: List[
        CareerRecommendation
    ]


# ==========================================
# Check Temporary Gemini Error
# ==========================================

def is_temporary_gemini_error(
    error_message: str
) -> bool:

    message = error_message.lower()

    return (
        "503" in message
        or "unavailable" in message
        or "high demand" in message
        or "temporarily unavailable" in message
        or "resource_exhausted" in message
        or "429" in message
    )


# ==========================================
# Generate Career Recommendations
# ==========================================

def generate_career_recommendations(
    education,
    skills,
    experience,
    projects
):

    # ======================================
    # Normalize Input
    # ======================================

    education = education or []
    skills = skills or []
    experience = experience or []
    projects = projects or []


    # ======================================
    # Basic Validation
    # ======================================

    if (
        not education
        and not skills
        and not experience
        and not projects
    ):
        raise ValueError(
            "Candidate profile is empty. "
            "Career recommendations cannot "
            "be generated."
        )


    # ======================================
    # Prompt
    # ======================================

    prompt = f"""
You are an expert career advisor for software engineering,
information technology and computer science candidates.

Analyze the candidate profile below.

EDUCATION:
{education}

SKILLS:
{skills}

EXPERIENCE:
{experience}

PROJECTS:
{projects}

Recommend exactly 5 career roles that best match this candidate.

Evaluate the candidate using:

- education
- technical skills
- programming knowledge
- frameworks
- databases
- projects
- internship/work experience

For every career:

1. Give a realistic career suitability score between 0 and 100.

2. Explain briefly why the career matches the candidate.

3. Identify existing candidate skills that support the career.

4. Identify important skills the candidate should learn or improve.

5. Give a short practical learning roadmap.

Important rules:

- Return exactly 5 career recommendations.

- Do not recommend careers only because they are popular.

- Base the recommendations only on the candidate information
  provided above.

- Do not invent education, experience, projects, certifications
  or skills that are not present in the candidate profile.

- If education, experience or projects are empty, base the
  recommendation primarily on the available skills.

- The match percentage is a career suitability score,
  not a statistically validated probability.

- Keep explanations concise and suitable for a career dashboard.
"""


    # ======================================
    # Last Error
    # ======================================

    last_error = None


    # ======================================
    # Try Gemini Models
    # ======================================

    for model_name in GEMINI_MODELS:

        try:

            print()
            print(
                "======================================"
            )

            print(
                f"Trying Gemini Model: {model_name}"
            )

            print(
                "======================================"
            )


            # ==================================
            # Gemini Request
            # ==================================

            response = (
                client.models.generate_content(

                    model=model_name,

                    contents=prompt,

                    config=(
                        types.GenerateContentConfig(

                            response_mime_type=(
                                "application/json"
                            ),

                            response_schema=(
                                CareerRecommendationResponse
                            )
                        )
                    )
                )
            )


            # ==================================
            # Parse Response
            # ==================================

            result = response.parsed


            if result is None:

                raise ValueError(
                    "Gemini returned an empty "
                    "career recommendation response."
                )


            # ==================================
            # Get Recommendations
            # ==================================

            recommendations = (
                result.recommendations
            )


            # ==================================
            # Validate Count
            # ==================================

            if len(recommendations) != 5:

                raise ValueError(
                    "Gemini did not return exactly "
                    "5 career recommendations."
                )


            # ==================================
            # Success Log
            # ==================================

            print()
            print(
                "Career recommendations generated "
                "successfully."
            )

            print(
                f"Model Used: {model_name}"
            )

            print(
                f"Recommendations: "
                f"{len(recommendations)}"
            )


            # ==================================
            # Return JSON-Compatible Data
            # ==================================

            return result.model_dump()


        # ======================================
        # Handle Model Error
        # ======================================

        except Exception as e:

            last_error = e

            error_message = str(e)


            print()
            print(
                f"Gemini model {model_name} failed:"
            )

            print(
                error_message
            )


            # ==================================
            # Temporary Error
            # ==================================

            if is_temporary_gemini_error(
                error_message
            ):

                print(
                    f"{model_name} is temporarily "
                    "unavailable."
                )

                print(
                    "Trying fallback model..."
                )

                continue


            # ==================================
            # Permanent Error
            # ==================================

            print(
                "Career AI Error:",
                error_message
            )

            raise Exception(
                "Failed to generate career "
                "recommendations: "
                f"{error_message}"
            )


    # ======================================
    # All Models Failed
    # ======================================

    print()
    print(
        "======================================"
    )

    print(
        "ALL GEMINI MODELS FAILED"
    )

    print(
        "======================================"
    )

    print(
        "Last Error:",
        str(last_error)
    )


    raise Exception(
        "All Gemini models are currently "
        "unavailable. Please try again later. "
        f"Last error: {str(last_error)}"
    )