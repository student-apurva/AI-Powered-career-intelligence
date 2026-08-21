import os
import requests
from dotenv import load_dotenv

load_dotenv()

APP_ID = os.getenv("ADZUNA_APP_ID")
APP_KEY = os.getenv("ADZUNA_APP_KEY")


def search_jobs(query, location="India", page=1):

    url = (
        f"https://api.adzuna.com/v1/api/jobs/in/search/{page}"
    )

    params = {
        "app_id": APP_ID,
        "app_key": APP_KEY,
        "results_per_page": 20,
        "what": query,
        "where": location,
        "content-type": "application/json"
    }

    response = requests.get(
        url,
        params=params,
        timeout=30
    )

    response.raise_for_status()

    data = response.json()

    jobs = []

    for job in data.get("results", []):

        jobs.append({

            "title": job.get("title", ""),

            "company": (
                job.get("company", {})
                .get("display_name", "")
            ),

            "location": (
                job.get("location", {})
                .get("display_name", "")
            ),

            "salary_min": job.get("salary_min"),

            "salary_max": job.get("salary_max"),

            "apply_url": job.get("redirect_url", ""),

            "category": (
                job.get("category", {})
                .get("label", "")
            ),
            "description": job.get("description", ""),

            "contract_type": job.get("contract_type"),

            "created": job.get("created")

        })
        print("\n====================")
        print(job.get("title"))
        print("Redirect URL:", job.get("redirect_url"))
        print("====================")

    return jobs

