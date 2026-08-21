import os
import time
from typing import List

from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel, Field


# ==========================================
# Environment
# ==========================================

load_dotenv()

GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)

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
# Response Models
# ==========================================

class LearningStep(BaseModel):

    step: int = Field(
        ge=1,
        description="Learning step number"
    )

    title: str = Field(
        description="Short title for this learning stage"
    )

    skills: List[str] = Field(
        description="Skills to learn in this stage"
    )

    goal: str = Field(
        description="Practical goal of this learning stage"
    )


class LearningPathResponse(BaseModel):

    career: str = Field(
        description="Primary target career"
    )

    learning_path: List[LearningStep] = Field(
        description="Ordered personalized learning path"
    )


# ==========================================
# Generate Learning Path
# ==========================================

def generate_learning_path(
    current_skills,
    target_skills,
    recommended_careers
):

    # ======================================
    # Normalize Inputs
    # ======================================

    current_skills = (
        current_skills or []
    )

    target_skills = (
        target_skills or []
    )

    recommended_careers = (
        recommended_careers or []
    )


    # ======================================
    # If there is no target skill
    # ======================================

    if not target_skills:

        return {
            "career": (
                recommended_careers[0]
                if recommended_careers
                else "Software Professional"
            ),

            "learning_path": []
        }


    # ======================================
    # Prompt
    # ======================================

    prompt = f"""
You are an expert technical learning-path planner.

Create a personalized learning path for a software,
IT or computer science candidate.

CURRENT SKILLS:
{current_skills}

SKILLS THE CANDIDATE NEEDS TO LEARN:
{target_skills}

RECOMMENDED CAREERS:
{recommended_careers}

Create an ordered learning path.

Important rules:

1. Use the candidate's current skills as prerequisites.

2. Focus primarily on the target skills provided.

3. Do not teach skills the candidate already knows
   unless they are required as prerequisites.

4. Arrange skills in a logical learning order.

5. Start with foundational technologies before
   advanced technologies.

6. Group closely related skills into one step.

7. Create between 3 and 6 learning steps when
   enough target skills are available.

8. Do not invent work experience, certifications
   or qualifications.

9. Select the most appropriate primary career
   from the recommended careers.

10. Each step must contain:
    - step number
    - short title
    - skills
    - practical goal

11. Keep the learning path concise enough for
    a dashboard.

12. Do not recommend specific courses.
    Courses will be matched separately from
    our MongoDB course database.
"""


    # ======================================
    # Gemini Models
    # ======================================

    models_to_try = [
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite",
    ]

    last_error = None


    # ======================================
    # Try Gemini Models
    # ======================================

    for model_name in models_to_try:

        try:

            print()
            print(
                "======================================"
            )
            print(
                "LEARNING PATH AI"
            )
            print(
                "======================================"
            )

            print(
                "Trying model:",
                model_name
            )

            print(
                "Current Skills:",
                current_skills
            )

            print(
                "Target Skills:",
                target_skills
            )

            print(
                "Recommended Careers:",
                recommended_careers
            )


            # ==================================
            # Generate
            # ==================================

            response = (
                client.models.generate_content(

                    model=model_name,

                    contents=prompt,

                    config=(
                        types.GenerateContentConfig(

                            temperature=0.2,

                            response_mime_type=(
                                "application/json"
                            ),

                            response_schema=(
                                LearningPathResponse
                            )
                        )
                    )
                )
            )


            # ==================================
            # Parse
            # ==================================

            result = response.parsed

            if result is None:

                raise ValueError(
                    "Gemini returned an empty "
                    "learning path"
                )


            # ==================================
            # Validate
            # ==================================

            if not result.learning_path:

                raise ValueError(
                    "Gemini returned an empty "
                    "learning_path list"
                )


            # ==================================
            # Fix step numbering
            # ==================================

            for index, learning_step in enumerate(
                result.learning_path,
                start=1
            ):

                learning_step.step = index


            # ==================================
            # Success
            # ==================================

            print()
            print(
                "Learning path generated "
                f"successfully using {model_name}"
            )

            print(
                "Career:",
                result.career
            )

            for learning_step in (
                result.learning_path
            ):

                print(
                    f"Step {learning_step.step}:",
                    learning_step.title
                )

                print(
                    "Skills:",
                    learning_step.skills
                )

            print(
                "======================================"
            )


            return result.model_dump()


        # ======================================
        # Gemini Error
        # ======================================

        except Exception as e:

            last_error = e

            error_message = str(e)

            print()
            print(
                f"Gemini model "
                f"{model_name} failed:"
            )

            print(
                error_message
            )


            temporary_error = (

                "503" in error_message

                or "UNAVAILABLE"
                in error_message

                or "high demand"
                in error_message.lower()

                or "temporarily unavailable"
                in error_message.lower()

                or "RESOURCE_EXHAUSTED"
                in error_message
            )


            if temporary_error:

                print(
                    "Trying fallback model..."
                )

                time.sleep(1)

                continue


            break


    # ==========================================
    # All Gemini Models Failed
    # ==========================================

    print()
    print(
        "All Gemini models failed."
    )

    print(
        "Using local learning path fallback."
    )

    print(
        "Last Error:",
        str(last_error)
    )


    return generate_fallback_learning_path(
        current_skills=current_skills,
        target_skills=target_skills,
        recommended_careers=recommended_careers
    )


# ==========================================
# Local Fallback
# ==========================================

def generate_fallback_learning_path(
    current_skills,
    target_skills,
    recommended_careers
):

    career = (

        recommended_careers[0]

        if recommended_careers

        else "Software Professional"
    )


    learning_path = []


    # ======================================
    # Group target skills
    # ======================================

    for index, skill in enumerate(
        target_skills[:6],
        start=1
    ):

        learning_path.append(
            {
                "step": index,

                "title": (
                    f"Learn {skill}"
                ),

                "skills": [
                    skill
                ],

                "goal": (
                    f"Build practical knowledge "
                    f"and hands-on experience "
                    f"with {skill}."
                )
            }
        )


    return {
        "career": career,
        "learning_path": learning_path
    }