from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import json

from google import genai


router = APIRouter(
    prefix="/api/chatbot",
    tags=["AI Chatbot"]
)


# =========================================================
# GEMINI CLIENT
# =========================================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found in environment variables"
    )

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# =========================================================
# REQUEST MODEL
# =========================================================

class ChatbotRequest(BaseModel):

    message: str

    current_page: str = "Ascendra AI"

    current_path: str = "/"


# =========================================================
# SYSTEM INSTRUCTIONS
# =========================================================

SYSTEM_PROMPT = """
You are Ascendra AI Assistant.

You are an in-app assistant for an AI Career Intelligence platform.

Your main purpose is to:
1. Help users navigate the application.
2. Explain platform features.
3. Help users understand Resume Builder.
4. Explain ATS Analysis.
5. Explain Resume Improvement.
6. Help users find jobs.
7. Help users find courses.
8. Explain Career Recommendations.
9. Help users understand their Profile.

AVAILABLE ROUTES:

Dashboard:
 /dashboard-analytics

Profile:
 /profile

Resume Builder:
 /resume-builder

Resume Improvement:
 /resume-improvement

ATS Analysis:
 /analyze

Career Recommendation:
 /career-recom

Job Recommendation:
 /job-recommendations

Courses:
 /courses


NAVIGATION RULES:

Never invent a route.

Only use the routes listed above.

If the user's question requires navigation,
return a navigation action.

If the question can be answered without navigation,
return no action.

RETURN ONLY VALID JSON.

For navigation:

{
  "message": "Your helpful response",
  "action": "navigate",
  "target": "/valid-route",
  "action_label": "Open Page"
}

For normal answers:

{
  "message": "Your helpful response",
  "action": null,
  "target": null,
  "action_label": null
}

CURRENT PAGE:
__CURRENT_PAGE__

CURRENT URL:
__CURRENT_PATH__

Keep responses short, friendly and easy to understand.
"""
# =========================================================
# CHATBOT
# =========================================================

@router.post("")
async def chatbot(
    request: ChatbotRequest
):

    try:

        # -------------------------------------------------
        # Validate message
        # -------------------------------------------------

        if not request.message.strip():

            raise HTTPException(
                status_code=400,
                detail="Message cannot be empty"
            )


        # -------------------------------------------------
        # Build prompt
        # -------------------------------------------------

        prompt = SYSTEM_PROMPT.replace(
        "__CURRENT_PAGE__",
        request.current_page
        ).replace(
            "__CURRENT_PATH__",
            request.current_path
        )

        prompt += f"""

        USER MESSAGE:

        {request.message}

        Return ONLY valid JSON.
        """

        # -------------------------------------------------
        # Gemini
        # -------------------------------------------------

        response = client.models.generate_content(

            model="gemini-3.6-flash",

            contents=prompt

        )


        # -------------------------------------------------
        # Get response text
        # -------------------------------------------------

        response_text = (
            response.text
            if response.text
            else ""
        )


        response_text = (
            response_text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )


        # -------------------------------------------------
        # Parse JSON
        # -------------------------------------------------

        try:

            data = json.loads(
                response_text
            )

        except json.JSONDecodeError:

            # Fallback if Gemini returns
            # normal text instead of JSON

            data = {

                "message":
                    response_text,

                "action":
                    None,

                "target":
                    None,

                "action_label":
                    None

            }


        # -------------------------------------------------
        # Validate response
        # -------------------------------------------------

        return {

            "success": True,

            "message":
                data.get(
                    "message",
                    "I'm here to help you."
                ),

            "action":
                data.get(
                    "action"
                ),

            "target":
                data.get(
                    "target"
                ),

            "action_label":
                data.get(
                    "action_label"
                )

        }


    except HTTPException:

        raise


    except Exception as error:

        print(
            "CHATBOT ERROR:",
            error
        )

        raise HTTPException(

            status_code=500,

            detail=
                "Unable to process chatbot request"

        )