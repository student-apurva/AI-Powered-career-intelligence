import os
import time
from typing import List

from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel, Field


# ==========================================
# Load Environment Variables
# ==========================================

load_dotenv()

GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found "
        "in .env file"
    )


# ==========================================
# Gemini Client
# ==========================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# ==========================================
# AI Response Model
# ==========================================

class JobAIExplanation(BaseModel):

    explanation: str = Field(
        description=(
            "Short personalized explanation "
            "of why the job matches the candidate"
        )
    )

    strengths: List[str] = Field(
        description=(
            "Candidate strengths relevant "
            "to this job"
        )
    )

    skills_to_improve: List[str] = Field(
        description=(
            "Important missing skills the "
            "candidate should improve"
        )
    )

    application_advice: str = Field(
        description=(
            "Short practical advice before "
            "applying for this job"
        )
    )


# ==========================================
# Generate Job AI Explanation
# ==========================================

def generate_job_explanation(
    job_title: str,
    company: str,
    job_description: str,
    resume_skills: List[str],
    matching_skills: List[str],
    missing_skills: List[str],
    match_score: float,
    career_match_score: float = 0,
    experience_match_score: float = 0
):

    # ======================================
    # Normalize Inputs
    # ======================================

    job_title = (
        job_title or
        "Software Development Role"
    )

    company = (
        company or
        "Company"
    )

    job_description = (
        job_description or
        "No job description provided."
    )

    resume_skills = (
        resume_skills or []
    )

    matching_skills = (
        matching_skills or []
    )

    missing_skills = (
        missing_skills or []
    )


    # ======================================
    # Prompt
    # ======================================

    prompt = f"""
You are an expert career advisor helping a candidate
evaluate a software engineering or IT job opportunity.

Analyze the candidate-job match below.

JOB TITLE:
{job_title}

COMPANY:
{company}

JOB DESCRIPTION:
{job_description}

CANDIDATE SKILLS:
{resume_skills}

MATCHING SKILLS:
{matching_skills}

MISSING SKILLS:
{missing_skills}

JOB MATCH SCORE:
{match_score}

CAREER MATCH SCORE:
{career_match_score}

EXPERIENCE MATCH SCORE:
{experience_match_score}


IMPORTANT:

The match scores have already been calculated by the
application's deterministic job matching algorithm.

Do NOT calculate or change the scores.

Your job is only to explain the recommendation.


Generate:

1. A short personalized explanation of why this job
   matches the candidate.

2. Candidate strengths relevant to this job.

3. Important missing skills that should be improved.

4. Short practical advice before applying.


Rules:

- Do not invent candidate skills.

- Do not claim the candidate has a skill unless it
  appears in CANDIDATE SKILLS or MATCHING SKILLS.

- Use MISSING SKILLS when recommending skills
  to improve.

- Do not invent work experience.

- Do not invent education.

- Do not invent company information.

- Do not change the match score.

- Keep the response concise.

- Make the advice useful for a career dashboard.

- If the candidate already has most required skills,
  encourage project practice, interview preparation
  and resume improvement.

- If several important skills are missing, recommend
  learning those skills before applying.
"""


    # ======================================
    # Gemini Models
    # ======================================

    models_to_try = [
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite",
    ]


    # ======================================
    # Retry Configuration
    # ======================================

    max_retries = 2

    last_error = None


    # ======================================
    # Try Available Models
    # ======================================

    for model_name in models_to_try:

        for attempt in range(
            max_retries
        ):

            try:

                print()
                print(
                    "======================================"
                )

                print(
                    "JOB AI REQUEST"
                )

                print(
                    "======================================"
                )

                print(
                    "Model:",
                    model_name
                )

                print(
                    "Attempt:",
                    f"{attempt + 1}/"
                    f"{max_retries}"
                )

                print(
                    "Job:",
                    job_title
                )

                print(
                    "Company:",
                    company
                )

                print(
                    "Match Score:",
                    match_score
                )


                # ==========================
                # Gemini Request
                # ==========================

                response = (
                    client.models.generate_content(

                        model=
                            model_name,

                        contents=
                            prompt,

                        config=(
                            types
                            .GenerateContentConfig(

                                temperature=0.3,

                                response_mime_type=(
                                    "application/json"
                                ),

                                response_schema=(
                                    JobAIExplanation
                                )
                            )
                        )
                    )
                )


                # ==========================
                # Parse Result
                # ==========================

                result = response.parsed


                if result is None:

                    raise ValueError(
                        "Gemini returned an "
                        "empty job explanation."
                    )


                print(
                    "Job AI explanation "
                    "generated successfully "
                    f"using {model_name}."
                )


                # ==========================
                # Return JSON
                # ==========================

                return result.model_dump()


            # ==================================
            # Handle Model Error
            # ==================================

            except Exception as e:

                last_error = e

                error_message = str(e)


                print()
                print(
                    f"Job AI model "
                    f"{model_name} failed:"
                )

                print(
                    error_message
                )


                # ==============================
                # Temporary Errors
                # ==============================

                temporary_error = (

                    "503"
                    in error_message

                    or "UNAVAILABLE"
                    in error_message

                    or "high demand"
                    in error_message.lower()

                    or "temporarily unavailable"
                    in error_message.lower()

                    or "RESOURCE_EXHAUSTED"
                    in error_message

                    or "429"
                    in error_message
                )


                # ==============================
                # Retry Same Model
                # ==============================

                if (
                    temporary_error
                    and
                    attempt
                    < max_retries - 1
                ):

                    wait_time = (
                        2 ** (attempt + 1)
                    )


                    print(
                        "Gemini temporarily "
                        "unavailable."
                    )

                    print(
                        f"Retrying in "
                        f"{wait_time} seconds..."
                    )


                    time.sleep(
                        wait_time
                    )

                    continue


                # ==============================
                # Try Next Model
                # ==============================

                if temporary_error:

                    print(
                        "Trying fallback "
                        "Gemini model..."
                    )

                    break


                # ==============================
                # Model Not Found
                # ==============================

                model_error = (

                    "404"
                    in error_message

                    or "NOT_FOUND"
                    in error_message

                    or "no longer available"
                    in error_message.lower()
                )


                if model_error:

                    print(
                        f"{model_name} is not "
                        "available."
                    )

                    print(
                        "Trying next model..."
                    )

                    break


                # ==============================
                # Permanent Error
                # ==============================

                print(
                    "Job AI Error:",
                    error_message
                )

                break


    # ==========================================
    # AI Fallback
    # ==========================================

    print()
    print(
        "======================================"
    )

    print(
        "ALL JOB AI MODELS FAILED"
    )

    print(
        "======================================"
    )

    print(
        "Last Error:",
        str(last_error)
    )

    print(
        "Using local fallback explanation."
    )


    return generate_fallback_explanation(
        job_title=job_title,
        matching_skills=matching_skills,
        missing_skills=missing_skills,
        match_score=match_score
    )


# ==========================================
# Local Fallback Explanation
# ==========================================

def generate_fallback_explanation(
    job_title: str,
    matching_skills: List[str],
    missing_skills: List[str],
    match_score: float
):

    # ======================================
    # Matching Skills Text
    # ======================================

    if matching_skills:

        matching_text = ", ".join(
            matching_skills[:5]
        )

        explanation = (
            f"This {job_title} role matches "
            f"your profile because you already "
            f"have relevant skills such as "
            f"{matching_text}. Your calculated "
            f"job match score is "
            f"{match_score}%."
        )

    else:

        explanation = (
            f"This {job_title} role has a "
            f"calculated match score of "
            f"{match_score}%. Improving the "
            f"required technical skills could "
            f"make you a stronger candidate."
        )


    # ======================================
    # Strengths
    # ======================================

    strengths = (
        matching_skills[:5]
        if matching_skills
        else []
    )


    # ======================================
    # Skills To Improve
    # ======================================

    skills_to_improve = (
        missing_skills[:5]
        if missing_skills
        else []
    )


    # ======================================
    # Application Advice
    # ======================================

    if missing_skills:

        missing_text = ", ".join(
            missing_skills[:3]
        )

        application_advice = (
            f"Focus on improving {missing_text}. "
            f"Build a small project using these "
            f"skills and include relevant work "
            f"in your resume before applying."
        )

    else:

        application_advice = (
            "Your technical skills align well "
            "with this role. Review core concepts, "
            "prepare relevant projects and practice "
            "technical interview questions before "
            "applying."
        )


    return {
        "explanation":
            explanation,

        "strengths":
            strengths,

        "skills_to_improve":
            skills_to_improve,

        "application_advice":
            application_advice,

        "ai_generated":
            False
    }