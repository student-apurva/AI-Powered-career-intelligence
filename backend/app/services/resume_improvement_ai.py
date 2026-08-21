import os
import time
from typing import List

from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel, Field


# ==========================================
# Environment Variables
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

class ResumeSuggestion(BaseModel):

    category: str = Field(
        description=(
            "Resume area being improved, "
            "such as Projects, Experience, "
            "Skills, Summary or Writing"
        )
    )

    priority: str = Field(
        description=(
            "Priority level: High, Medium or Low"
        )
    )

    issue: str = Field(
        description=(
            "Specific problem detected in "
            "the candidate's resume"
        )
    )

    suggestion: str = Field(
        description=(
            "Clear and practical recommendation "
            "for improving the issue"
        )
    )


class RewriteSuggestion(BaseModel):

    section: str = Field(
        description=(
            "Resume section containing the text"
        )
    )

    original: str = Field(
        description=(
            "Original resume text. Must come "
            "directly from candidate information."
        )
    )

    improved: str = Field(
        description=(
            "Improved version without inventing "
            "facts, technologies or achievements."
        )
    )


class ResumeImprovementAIResponse(BaseModel):

    overall_feedback: str = Field(
        description=(
            "Short overall assessment of the "
            "resume and its main improvement need"
        )
    )

    top_priorities: List[str] = Field(
        description=(
            "Three most important improvements "
            "the candidate should make"
        )
    )

    suggestions: List[ResumeSuggestion] = Field(
        description=(
            "Personalized resume improvement "
            "suggestions"
        )
    )

    rewrite_suggestions: List[
        RewriteSuggestion
    ] = Field(
        description=(
            "Before and improved examples using "
            "only facts already present in resume"
        )
    )

    suggested_action_verbs: List[str] = Field(
        description=(
            "Professional action verbs relevant "
            "to the candidate's existing content"
        )
    )

    skills_organization: List[str] = Field(
        description=(
            "Suggestions for organizing the "
            "candidate's existing skills"
        )
    )


# ==========================================
# Generate AI Resume Improvements
# ==========================================

def generate_resume_improvements(
    resume_data,
    resume_text,
    analyzer_result
):

    # ======================================
    # Normalize Inputs
    # ======================================

    resume_data = resume_data or {}

    resume_text = resume_text or ""

    analyzer_result = analyzer_result or {}


    # ======================================
    # Limit Resume Text
    # ======================================
    #
    # Prevent extremely large prompts.
    # This is enough for a normal resume.
    # ======================================

    resume_text_for_ai = (
        resume_text[:12000]
    )


    # ======================================
    # Extract Analyzer Information
    # ======================================

    resume_score = (
        analyzer_result.get(
            "resume_score",
            0
        )
    )

    status = (
        analyzer_result.get(
            "status",
            ""
        )
    )

    strengths = (
        analyzer_result.get(
            "strengths",
            []
        )
    )

    basic_improvements = (
        analyzer_result.get(
            "improvements",
            []
        )
    )

    missing_sections = (
        analyzer_result.get(
            "missing_sections",
            []
        )
    )


    # ======================================
    # Prompt
    # ======================================

    prompt = f"""
You are an expert technical resume reviewer.

Analyze the candidate's resume and provide
personalized resume improvement suggestions.

The application has already calculated a
rule-based resume score.

RESUME SCORE:
{resume_score}/100

RESUME STATUS:
{status}

DETECTED STRENGTHS:
{strengths}

RULE-BASED IMPROVEMENTS:
{basic_improvements}

MISSING SECTIONS:
{missing_sections}


PARSED RESUME DATA:
{resume_data}


ORIGINAL RESUME TEXT:
{resume_text_for_ai}


Your job is NOT to calculate another resume score.

The score above was generated by the application's
rule-based resume analyzer.


IMPORTANT SAFETY AND ACCURACY RULES:

1. Never invent information.

2. Never invent technologies the candidate
   did not mention.

3. Never invent companies or employers.

4. Never invent internship or work experience.

5. Never invent certifications.

6. Never invent education information.

7. Never invent project features.

8. Never invent numerical achievements,
   percentages, performance improvements,
   revenue, users or metrics.

9. Never claim the candidate knows a skill
   unless it appears in the provided resume.

10. When rewriting resume text, preserve
    the original meaning and facts.

11. You may improve grammar, clarity,
    professionalism and action verbs.

12. If the resume does not contain enough
    information for a rewrite, do not fabricate
    an example.

13. Do not tell the candidate to add a fake
    achievement simply to improve the resume.

14. You may suggest adding measurable results
    only if the candidate genuinely has such
    results. Do not create the numbers yourself.


GENERATE:

A. OVERALL FEEDBACK

Give a concise overall assessment of the resume.


B. TOP PRIORITIES

Return exactly 3 important resume improvement
priorities whenever enough issues are available.


C. PERSONALIZED SUGGESTIONS

Focus on useful areas such as:

- project descriptions
- internship/experience descriptions
- technical skills organization
- professional summary
- writing quality
- clarity
- action verbs
- section organization
- GitHub/LinkedIn presentation

Only mention areas relevant to this resume.


D. REWRITE SUGGESTIONS

When appropriate, identify weak existing text
from the resume and provide a stronger version.

Example:

Original:
"Created a website using React."

Improved:
"Developed a web application using React,
implementing the features described in the
project."

Do NOT add features that were not provided.

Provide at most 5 rewrite suggestions.


E. ACTION VERBS

Recommend useful professional action verbs
appropriate to the candidate's existing work.


F. SKILLS ORGANIZATION

Suggest how the EXISTING skills could be grouped.

For example, only when those skills actually
exist:

Programming Languages: Java, Python

Frontend: HTML, CSS, JavaScript, React

Databases: MySQL, MongoDB

Tools: Git, GitHub, Postman

Do not add new skills to these groups.


Keep all responses concise enough for a
resume improvement dashboard.
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
    # Try Models
    # ======================================

    for model_name in models_to_try:

        try:

            print()
            print(
                "======================================"
            )

            print(
                "RESUME IMPROVEMENT AI"
            )

            print(
                "======================================"
            )

            print(
                "Trying model:",
                model_name
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

                            temperature=0.2,

                            response_mime_type=(
                                "application/json"
                            ),

                            response_schema=(
                                ResumeImprovementAIResponse
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
                    "resume improvement response"
                )


            # ==================================
            # Validate Result
            # ==================================

            if not result.suggestions:

                raise ValueError(
                    "Gemini returned no resume "
                    "improvement suggestions"
                )


            # ==================================
            # Success
            # ==================================

            print()
            print(
                "Resume improvement suggestions "
                f"generated using {model_name}"
            )

            print(
                "Suggestions:",
                len(
                    result.suggestions
                )
            )

            print(
                "Rewrite Suggestions:",
                len(
                    result.rewrite_suggestions
                )
            )

            print(
                "======================================"
            )


            return result.model_dump()


        # ======================================
        # Error
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


            # ==================================
            # Temporary Gemini Errors
            # ==================================

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


            # ==================================
            # Try Fallback Model
            # ==================================

            if temporary_error:

                print(
                    "Trying fallback model..."
                )

                time.sleep(1)

                continue


            # ==================================
            # Permanent Error
            # ==================================

            print(
                "Resume Improvement AI Error:",
                error_message
            )

            break


    # ==========================================
    # All Models Failed
    # ==========================================

    print()
    print(
        "======================================"
    )

    print(
        "ALL RESUME AI MODELS FAILED"
    )

    print(
        "======================================"
    )

    print(
        "Last Error:",
        str(last_error)
    )


    # ==========================================
    # Fallback
    # ==========================================
    #
    # We do NOT make the entire module fail
    # just because Gemini is unavailable.
    #
    # Rule-based recommendations from Step 1
    # will still be returned.
    # ==========================================

    return generate_fallback_response(
        analyzer_result
    )


# ==========================================
# Local Fallback
# ==========================================

def generate_fallback_response(
    analyzer_result
):

    analyzer_result = (
        analyzer_result or {}
    )


    improvements = (
        analyzer_result.get(
            "improvements",
            []
        )
    )


    # ======================================
    # Convert Analyzer Suggestions
    # ======================================

    fallback_suggestions = []


    for improvement in improvements[:6]:

        fallback_suggestions.append({

            "category":
                improvement.get(
                    "category",
                    "General"
                ),

            "priority":
                improvement.get(
                    "priority",
                    "Medium"
                ),

            "issue": (
                "This area can be improved "
                "based on the resume analysis."
            ),

            "suggestion":
                improvement.get(
                    "suggestion",
                    ""
                )
        })


    # ======================================
    # Top Priorities
    # ======================================

    priority_order = {
        "High": 1,
        "Medium": 2,
        "Low": 3
    }


    sorted_improvements = sorted(

        improvements,

        key=lambda item: (
            priority_order.get(
                item.get(
                    "priority",
                    "Low"
                ),
                4
            )
        )
    )


    top_priorities = [

        item.get(
            "suggestion",
            ""
        )

        for item
        in sorted_improvements[:3]

        if item.get(
            "suggestion"
        )
    ]


    # ======================================
    # Return Fallback
    # ======================================

    return {

        "overall_feedback": (
            "AI-specific feedback is temporarily "
            "unavailable. The recommendations below "
            "are based on the resume analyzer."
        ),

        "top_priorities":
            top_priorities,

        "suggestions":
            fallback_suggestions,

        "rewrite_suggestions":
            [],

        "suggested_action_verbs": [
            "Developed",
            "Implemented",
            "Designed",
            "Built",
            "Integrated",
            "Tested"
        ],

        "skills_organization":
            []
    }