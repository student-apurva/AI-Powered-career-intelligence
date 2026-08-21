from fastapi import APIRouter, HTTPException
from bson import ObjectId
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime, timezone
from app.services.adzuna_jobs import search_jobs

from app.database import (
    users_collection,
    resumes_collection,
    jobs_collection,
    career_recommendations_collection,
    saved_jobs_collection,
    job_recommendations_collection
)

from app.services.job_matcher import rank_jobs

from app.services.job_ai import (
    generate_job_explanation,
)


# ==========================================
# Router
# ==========================================

router = APIRouter(
    prefix="/api/jobs",
    tags=["Job Recommendations"],
)


# ==========================================
# Request Models
# ==========================================

class JobExplanationRequest(BaseModel):

    job_title: str

    company: str = ""

    job_description: str = ""

    resume_skills: List[str] = Field(
        default_factory=list
    )

    matching_skills: List[str] = Field(
        default_factory=list
    )

    missing_skills: List[str] = Field(
        default_factory=list
    )

    match_score: float = 0

    career_match_score: float = 0

    experience_match_score: float = 0


class SaveJobRequest(BaseModel):

    user_id: str

    job_id: str

    title: str

    company: str = ""

    location: str = ""

    job_type: str = ""

    experience_level: str = ""

    match_score: float = 0

    apply_url: str = ""


# ==========================================
# Helper: Find User Resume
# ==========================================

async def find_user_resume(
    user_id: str
):

    # ======================================
    # String user_id
    # ======================================

    resume = await resumes_collection.find_one(
        {
            "user_id": user_id
        }
    )

    if resume:
        return resume


    # ======================================
    # Older userId format
    # ======================================

    resume = await resumes_collection.find_one(
        {
            "userId": user_id
        }
    )

    if resume:
        return resume


    # ======================================
    # ObjectId formats
    # ======================================

    if ObjectId.is_valid(user_id):

        object_user_id = ObjectId(
            user_id
        )


        resume = (
            await resumes_collection.find_one(
                {
                    "user_id":
                        object_user_id
                }
            )
        )

        if resume:
            return resume


        resume = (
            await resumes_collection.find_one(
                {
                    "userId":
                        object_user_id
                }
            )
        )

        if resume:
            return resume


    return None


# ==========================================
# Helper: Extract Resume Data
# ==========================================

def extract_resume_data(
    resume: dict
):

    parsed_data = (

        resume.get("parsed_data")

        or resume.get("parsedData")

        or resume
    )


    skills = (
        parsed_data.get(
            "skills",
            []
        )
        or []
    )


    education = (
        parsed_data.get(
            "education",
            []
        )
        or []
    )


    experience = (
        parsed_data.get(
            "experience",
            []
        )
        or []
    )


    projects = (
        parsed_data.get(
            "projects",
            []
        )
        or []
    )


    return {

        "skills":
            skills,

        "education":
            education,

        "experience":
            experience,

        "projects":
            projects,
    }


# ==========================================
# Helper: Estimate Experience Years
# ==========================================

def get_experience_years(
    experience
) -> float:

    # ======================================
    # No Experience
    # ======================================

    if not experience:
        return 0.0


    # ======================================
    # Already Numeric
    # ======================================

    if isinstance(
        experience,
        (int, float)
    ):

        return float(
            experience
        )


    # ======================================
    # Dictionary
    # ======================================

    if isinstance(
        experience,
        dict
    ):

        years = experience.get(
            "years",
            experience.get(
                "total_years",
                0
            )
        )


        try:

            return float(
                years or 0
            )

        except (
            TypeError,
            ValueError
        ):

            return 0.0


    # ======================================
    # Current Safe Default
    # ======================================

    return 0.0


# ==========================================
# Helper: Get Career Recommendations
# ==========================================

async def get_user_career_recommendations(
    user_id: str
):

    recommended_careers = []


    # ======================================
    # Try ObjectId
    # ======================================

    career_document = None


    if ObjectId.is_valid(user_id):

        career_document = (
            await career_recommendations_collection
            .find_one(
                {
                    "user_id":
                        ObjectId(user_id)
                },
                sort=[
                    (
                        "created_at",
                        -1
                    )
                ]
            )
        )


    # ======================================
    # Try String
    # ======================================

    if not career_document:

        career_document = (
            await career_recommendations_collection
            .find_one(
                {
                    "user_id":
                        user_id
                },
                sort=[
                    (
                        "created_at",
                        -1
                    )
                ]
            )
        )


    if not career_document:

        return []


    # ======================================
    # Get Recommendation Data
    # ======================================

    recommendation_data = (

        career_document.get(
            "recommendations"
        )

        or career_document.get(
            "data"
        )

        or []
    )


    # Sometimes data contains:
    #
    # {
    #   "recommendations": [...]
    # }

    if isinstance(
        recommendation_data,
        dict
    ):

        recommendation_data = (
            recommendation_data.get(
                "recommendations",
                []
            )
        )


    # ======================================
    # Extract Career Names
    # ======================================

    if isinstance(
        recommendation_data,
        list
    ):

        for item in recommendation_data:

            if isinstance(
                item,
                dict
            ):

                career_name = (
                    item.get("career")
                    or item.get("title")
                    or item.get("role")
                )


                if career_name:

                    recommended_careers.append(
                        career_name
                    )


            elif isinstance(
                item,
                str
            ):

                recommended_careers.append(
                    item
                )


    return recommended_careers


# ==========================================
# GET Job Recommendations
#
# GET /api/jobs/recommendations/{user_id}
# ==========================================

@router.get(
    "/recommendations/{user_id}"
)
async def get_job_recommendations(
    user_id: str
):

    try:

        print()

        print(
            "======================================"
        )

        print(
            "JOB RECOMMENDATION REQUEST"
        )

        print(
            "======================================"
        )

        print(
            "User ID:",
            user_id
        )


        # ==================================
        # 1. Validate User ID
        # ==================================

        if not ObjectId.is_valid(
            user_id
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid user ID"
            )


        object_user_id = ObjectId(
            user_id
        )


        # ==================================
        # 2. Find User
        # ==================================

        user = (
            await users_collection.find_one(
                {
                    "_id":
                        object_user_id
                }
            )
        )


        if not user:

            raise HTTPException(
                status_code=404,
                detail="User not found"
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

        resume = await find_user_resume(
            user_id
        )


        if not resume:

            raise HTTPException(
                status_code=404,
                detail=(
                    "Resume not found. "
                    "Please upload your "
                    "resume first."
                )
            )


        # ==================================
        # 4. Extract Resume Information
        # ==================================

        resume_data = (
            extract_resume_data(
                resume
            )
        )


        resume_skills = (
            resume_data[
                "skills"
            ]
        )


        experience = (
            resume_data[
                "experience"
            ]
        )


        # ==================================
        # 5. Validate Skills
        # ==================================

        if not resume_skills:

            raise HTTPException(
                status_code=400,
                detail=(
                    "No skills found in "
                    "the parsed resume."
                )
            )


        # ==================================
        # 6. Experience Years
        # ==================================

        experience_years = (
            get_experience_years(
                experience
            )
        )


        # ==================================
        # 7. Get Module 3 Career Results
        # ==================================

        recommended_careers = (
            await
            get_user_career_recommendations(
                user_id
            )
        )
       
        # ==================================
        # 8. Fetch Live Jobs
        # ==================================

        search_query = ""

        if recommended_careers:

            # Use the top AI-recommended career
            search_query = recommended_careers[0]

        elif resume_skills:

            # Fall back to the first resume skill
            search_query = resume_skills[0]

        else:

            search_query = "Software Developer"

        print("Searching Live Jobs For:", search_query)

        jobs = search_jobs(
            query=search_query,
            location="India"
        )

        if not jobs:

            raise HTTPException(
                status_code=404,
                detail="No live jobs found."
            )

        print(f"Live Jobs Found: {len(jobs)}")
        # ==================================
        # Debug
        # ==================================

        print(
            "Resume Skills:",
            resume_skills
        )


        print(
            "Experience Years:",
            experience_years
        )


        print(
            "Career Recommendations:",
            recommended_careers
        )


        print(
            "Jobs Found:",
            len(jobs)
        )


        # ==================================
        # 9. Rank Jobs
        # ==================================

        ranked_jobs = rank_jobs(

            resume_skills=
                resume_skills,

            jobs=
                jobs,

            recommended_careers=
                recommended_careers,

            user_experience_years=
                experience_years,
        )


        # ==================================
        # 10. Top 10
        # ==================================

        top_jobs = (
            ranked_jobs[:10]
        )

        await job_recommendations_collection.update_one(

        {
            "user_id": user_id
        },

        {
            "$set": {

                "user_id": user_id,

                "recommendations": top_jobs,

                "created_at": datetime.now(timezone.utc)

            }

        },

        upsert=True

    )
        # ==================================
        # Debug Ranking
        # ==================================

        print()

        print(
            "======================================"
        )

        print(
            "JOB RANKING"
        )

        print(
            "======================================"
        )


        for index, job in enumerate(
            top_jobs,
            start=1
        ):

            print(
                f"{index}. "
                f"{job.get('title', '')} - "
                f"{job.get('match_score', 0)}%"
            )


            print(
               job.get("skill_match", 0)
            )


            print(
               job.get("career_match", 0)
            )


            print(
                job.get("experience_match", 0)
            )


        print(
            "======================================"
        )
        print(jobs[0])
        print("===============================\n")

        # ==================================
        # 11. Response
        # ==================================

        return {

            "success":
                True,

            "message":
                "Job recommendations "
                "generated successfully",

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


            # ==================================
            # Frontend expects this object
            # ==================================

            "profile_analysis": {

                "skills":
                    resume_skills,

                "experience_years":
                    experience_years,

                "recommended_careers":
                    recommended_careers,
            },


            "total_jobs":
                len(jobs),

            "total_recommendations":
                len(top_jobs),

            "jobs":
    top_jobs,
        }


    except HTTPException:
        raise


    except Exception as e:

        print(
            "JOB RECOMMENDATION ERROR:",
            repr(e)
        )


        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to generate "
                "job recommendations: "
                f"{str(e)}"
            )
        )


# ==========================================
# POST Job AI Explanation
#
# POST /api/jobs/explain
# ==========================================

@router.post(
    "/explain"
)
async def explain_job(
    request: JobExplanationRequest
):

    try:

        print()

        print(
            "======================================"
        )

        print(
            "JOB AI EXPLANATION REQUEST"
        )

        print(
            "======================================"
        )


        print(
            "Job:",
            request.job_title
        )


        print(
            "Company:",
            request.company
        )


        print(
            "Match Score:",
            request.match_score
        )


        print(
            "======================================"
        )

        print()


        # ==================================
        # Generate AI Explanation
        # ==================================

        result = (
            generate_job_explanation(

                job_title=
                    request.job_title,

                company=
                    request.company,

                job_description=
                    request.job_description,

                resume_skills=
                    request.resume_skills,

                matching_skills=
                    request.matching_skills,

                missing_skills=
                    request.missing_skills,

                match_score=
                    request.match_score,

                career_match_score=
                    request
                    .career_match_score,

                experience_match_score=
                    request
                    .experience_match_score,
            )
        )


        return {

            "success":
                True,

            "message":
                "Job explanation "
                "generated successfully",

            "data":
                result,
        }


    except Exception as e:

        print(
            "JOB AI EXPLANATION ERROR:",
            repr(e)
        )


        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to generate "
                "job explanation"
            )
        )


# ==========================================
# POST Save Job
#
# POST /api/jobs/save
# ==========================================

@router.post(
    "/save"
)
async def save_job(
    request: SaveJobRequest
):

    try:

        # ==================================
        # 1. Validate User ID
        # ==================================

        if not ObjectId.is_valid(
            request.user_id
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid user ID"
            )


        user_object_id = ObjectId(
            request.user_id
        )


        # ==================================
        # 2. Check User Exists
        # ==================================

        user = (
            await users_collection.find_one(
                {
                    "_id":
                        user_object_id
                }
            )
        )


        if not user:

            raise HTTPException(
                status_code=404,
                detail="User not found"
            )


        # ==================================
        # 3. Validate Job ID
        # ==================================

        if not request.job_id.strip():

            raise HTTPException(
                status_code=400,
                detail="Job ID is required"
            )


        # ==================================
        # 4. Check Duplicate
        # ==================================

        existing_saved_job = (
            await saved_jobs_collection
            .find_one(
                {
                    "user_id":
                        user_object_id,

                    "job_id":
                        request.job_id,
                }
            )
        )


        if existing_saved_job:

            return {

                "success":
                    True,

                "already_saved":
                    True,

                "message":
                    "Job already saved",

                "saved_job_id":
                    str(
                        existing_saved_job[
                            "_id"
                        ]
                    ),
            }


        # ==================================
        # 5. Create Saved Job
        # ==================================

        saved_job = {

            "user_id":
                user_object_id,

            "job_id":
                request.job_id,

            "title":
                request.title,

            "company":
                request.company,

            "location":
                request.location,

            "job_type":
                request.job_type,

            "experience_level":
                request.experience_level,

            "match_score":
                request.match_score,

            "apply_url":
                request.apply_url,

            "saved_at":
                datetime.now(
                    timezone.utc
                ),
        }


        # ==================================
        # 6. Save To MongoDB
        # ==================================

        result = (
            await saved_jobs_collection
            .insert_one(
                saved_job
            )
        )


        print()

        print(
            "======================================"
        )

        print(
            "JOB SAVED"
        )

        print(
            "======================================"
        )

        print(
            "User:",
            request.user_id
        )

        print(
            "Job:",
            request.title
        )

        print(
            "Saved Job ID:",
            str(
                result.inserted_id
            )
        )

        print(
            "======================================"
        )


        # ==================================
        # 7. Response
        # ==================================

        return {

            "success":
                True,

            "already_saved":
                False,

            "message":
                "Job saved successfully",

            "saved_job_id":
                str(
                    result.inserted_id
                ),
        }


    except HTTPException:
        raise


    except Exception as e:

        print(
            "SAVE JOB ERROR:",
            repr(e)
        )


        raise HTTPException(
            status_code=500,
            detail="Failed to save job"
        )

# ==========================================
# GET Saved Jobs
#
# GET /api/jobs/saved/{user_id}
# ==========================================

@router.get("/saved/{user_id}")
async def get_saved_jobs(
    user_id: str
):

    try:

        # ==================================
        # 1. Validate User ID
        # ==================================

        if not ObjectId.is_valid(user_id):

            raise HTTPException(
                status_code=400,
                detail="Invalid user ID"
            )


        user_object_id = ObjectId(
            user_id
        )


        # ==================================
        # 2. Check User Exists
        # ==================================

        user = await users_collection.find_one(
            {
                "_id": user_object_id
            }
        )


        if not user:

            raise HTTPException(
                status_code=404,
                detail="User not found"
            )


        # ==================================
        # 3. Get Saved Jobs
        # ==================================

        saved_jobs = []


        cursor = (
            saved_jobs_collection
            .find(
                {
                    "user_id":
                        user_object_id
                }
            )
            .sort(
                "saved_at",
                -1
            )
        )


        async for job in cursor:

            saved_jobs.append({

                "id":
                    str(job["_id"]),

                "job_id":
                    job.get(
                        "job_id",
                        ""
                    ),

                "title":
                    job.get(
                        "title",
                        ""
                    ),

                "company":
                    job.get(
                        "company",
                        ""
                    ),

                "location":
                    job.get(
                        "location",
                        ""
                    ),

                "job_type":
                    job.get(
                        "job_type",
                        ""
                    ),

                "experience_level":
                    job.get(
                        "experience_level",
                        ""
                    ),

                "match_score":
                    job.get(
                        "match_score",
                        0
                    ),

                "apply_url":
                    job.get(
                        "apply_url",
                        ""
                    ),

                "saved_at":
                    (
                        job.get("saved_at")
                        .isoformat()
                        if job.get("saved_at")
                        else None
                    ),
            })


        # ==================================
        # 4. Response
        # ==================================

        return {

            "success": True,

            "total_saved_jobs":
                len(saved_jobs),

            "saved_jobs":
                saved_jobs,
        }


    except HTTPException:
        raise


    except Exception as e:

        print(
            "GET SAVED JOBS ERROR:",
            repr(e)
        )


        raise HTTPException(
            status_code=500,
            detail="Failed to load saved jobs"
        )

# ==========================================
# DELETE Saved Job
#
# DELETE /api/jobs/saved/{user_id}/{job_id}
# ==========================================

@router.delete("/saved/{user_id}/{job_id}")
async def remove_saved_job(
    user_id: str,
    job_id: str
):

    try:

        # ==================================
        # Validate User ID
        # ==================================

        if not ObjectId.is_valid(user_id):

            raise HTTPException(
                status_code=400,
                detail="Invalid user ID"
            )


        user_object_id = ObjectId(
            user_id
        )


        # ==================================
        # Check User Exists
        # ==================================

        user = await users_collection.find_one(
            {
                "_id": user_object_id
            }
        )


        if not user:

            raise HTTPException(
                status_code=404,
                detail="User not found"
            )


        # ==================================
        # Find Saved Job
        # ==================================

        saved_job = (
            await saved_jobs_collection
            .find_one(
                {
                    "user_id":
                        user_object_id,

                    "job_id":
                        job_id,
                }
            )
        )


        if not saved_job:

            raise HTTPException(
                status_code=404,
                detail="Saved job not found"
            )


        # ==================================
        # Delete
        # ==================================

        result = (
            await saved_jobs_collection
            .delete_one(
                {
                    "_id":
                        saved_job["_id"]
                }
            )
        )


        if result.deleted_count == 0:

            raise HTTPException(
                status_code=500,
                detail=(
                    "Unable to remove "
                    "saved job"
                )
            )


        print()
        print(
            "======================================"
        )
        print("SAVED JOB REMOVED")
        print(
            "======================================"
        )
        print("User:", user_id)
        print("Job:", job_id)
        print(
            "======================================"
        )


        return {

            "success": True,

            "message":
                "Saved job removed successfully"
        }


    except HTTPException:
        raise


    except Exception as e:

        print(
            "REMOVE SAVED JOB ERROR:",
            repr(e)
        )


        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to remove saved job"
            )
        )