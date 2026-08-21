import os
import time
import requests

from fastapi import APIRouter, Depends

from app.dependencies import get_current_admin
from app.database import db


router = APIRouter(
    prefix="/api/admin/system-status",
    tags=["Admin System Monitoring"]
)


# =========================================================
# CHECK MONGODB
# =========================================================

async def check_mongodb():

    try:

        start_time = time.time()

        await db.command("ping")

        response_time = round(
            (time.time() - start_time) * 1000,
            2
        )

        return {

            "status": "Connected",

            "healthy": True,

            "response_time_ms":
                response_time

        }

    except Exception as e:

        return {

            "status": "Disconnected",

            "healthy": False,

            "error": str(e)

        }


# =========================================================
# CHECK ADZUNA
# =========================================================

def check_adzuna():

    app_id = os.getenv(
        "ADZUNA_APP_ID"
    )

    app_key = os.getenv(
        "ADZUNA_APP_KEY"
    )


    if not app_id or not app_key:

        return {

            "status":
                "Not Configured",

            "healthy":
                False

        }


    try:

        start_time = time.time()

        url = (
            "https://api.adzuna.com/"
            "v1/api/jobs/in/search/1"
        )

        params = {

            "app_id":
                app_id,

            "app_key":
                app_key,

            "results_per_page":
                1,

            "what":
                "developer",

            "where":
                "India"

        }


        response = requests.get(

            url,

            params=params,

            timeout=10

        )


        response_time = round(

            (time.time() - start_time) * 1000,

            2

        )


        if response.status_code == 200:

            return {

                "status":
                    "Connected",

                "healthy":
                    True,

                "response_time_ms":
                    response_time

            }


        return {

            "status":
                "Unavailable",

            "healthy":
                False,

            "http_status":
                response.status_code

        }


    except Exception as e:

        return {

            "status":
                "Unavailable",

            "healthy":
                False,

            "error":
                str(e)

        }


# =========================================================
# CHECK RESUME PARSER
# =========================================================

def check_resume_parser():

    parser_url = os.getenv(
        "RESUME_PARSER_URL"
    )


    if not parser_url:

        return {

            "status":
                "Internal Service",

            "healthy":
                True,

            "message":
                "Resume parser runs inside backend"

        }


    try:

        response = requests.get(

            parser_url,

            timeout=5

        )


        return {

            "status":

                "Available"
                if response.status_code < 500
                else "Unavailable",

            "healthy":

                response.status_code < 500

        }


    except Exception as e:

        return {

            "status":
                "Unavailable",

            "healthy":
                False,

            "error":
                str(e)

        }


# =========================================================
# SYSTEM STATUS
# =========================================================

@router.get("/status")
async def system_status(

    admin=Depends(
        get_current_admin
    )

):

    # -----------------------------------------------------
    # Check services
    # -----------------------------------------------------

    mongodb = await check_mongodb()

    adzuna = check_adzuna()

    resume_parser = check_resume_parser()


    # -----------------------------------------------------
    # Services
    # -----------------------------------------------------

    services = {

        "backend_api": {

            "status":
                "Online",

            "healthy":
                True

        },


        "database": {

            **mongodb,

            "status":

                "Online"
                if mongodb.get("healthy")
                else "Offline"

        },


        "authentication": {

            "status":
                "Online",

            "healthy":
                True

        },


        "adzuna_api": {

            **adzuna,

            "status":

                "Online"
                if adzuna.get("healthy")
                else "Offline"

        },


        "resume_parser":
            resume_parser

    }


    # -----------------------------------------------------
    # Overall system status
    # -----------------------------------------------------

    all_healthy = all(

        service.get(
            "healthy",
            False
        )

        for service in services.values()

    )


    # -----------------------------------------------------
    # Database response time
    # -----------------------------------------------------

    database_response_time = (

        mongodb.get(
            "response_time_ms",
            0
        )

    )


    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {

        "success":
            True,

        "overall_status":

            "Healthy"
            if all_healthy
            else "Degraded",

        "services":
            services,

        "database_response_time":
            database_response_time

    }