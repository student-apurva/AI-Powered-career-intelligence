from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime
from typing import Optional

from app.dependencies import get_current_admin
from app.database import jobs_collection


router = APIRouter(
    prefix="/api/admin/jobs",
    tags=["Admin Job Management"]
)


# =========================================================
# GET ALL JOBS
# =========================================================

@router.get("")
async def get_all_jobs(
    search: str = "",
    location: str = "",
    category: str = "",
    admin=Depends(get_current_admin)
):

    query = {}

    # -----------------------------------------------------
    # Search
    # -----------------------------------------------------

    if search:

        query["$or"] = [

            {
                "title": {
                    "$regex": search,
                    "$options": "i"
                }
            },

            {
                "company": {
                    "$regex": search,
                    "$options": "i"
                }
            }

        ]

    # -----------------------------------------------------
    # Location filter
    # -----------------------------------------------------

    if location:

        query["location"] = {
            "$regex": location,
            "$options": "i"
        }

    # -----------------------------------------------------
    # Category filter
    # -----------------------------------------------------

    if category:

        query["category"] = {
            "$regex": category,
            "$options": "i"
        }

    cursor = jobs_collection.find(
        query
    ).sort(
        "_id",
        -1
    )

    jobs = []

    async for job in cursor:

        jobs.append({

            "id":
                str(job["_id"]),

            "title":
                job.get("title", ""),

            "company":
                job.get("company", ""),

            "location":
                job.get("location", ""),

            "category":
                job.get("category", ""),

            "contract_type":
                job.get("contract_type", ""),

            "salary_min":
                job.get("salary_min"),

            "salary_max":
                job.get("salary_max"),

            "apply_url":
                job.get(
                    "apply_url",
                    job.get(
                        "redirect_url",
                        job.get(
                            "apply_link",
                            ""
                        )
                    )
                ),

            "source":
                job.get(
                    "source",
                    "Unknown"
                ),

            "created":
                job.get(
                    "created",
                    job.get(
                        "created_at"
                    )
                )

        })

    return {

        "success": True,

        "total":
            len(jobs),

        "jobs":
            jobs

    }


# =========================================================
# JOB STATISTICS
# =========================================================

@router.get("/statistics")
async def job_statistics(
    admin=Depends(get_current_admin)
):

    total_jobs = await jobs_collection.count_documents({})

    # -----------------------------------------------------
    # Jobs by category
    # -----------------------------------------------------

    category_pipeline = [

        {
            "$match": {
                "category": {
                    "$nin": [
                        None,
                        ""
                    ]
                }
            }
        },

        {
            "$group": {

                "_id":
                    "$category",

                "count": {
                    "$sum": 1
                }

            }
        },

        {
            "$sort": {
                "count": -1
            }
        },

        {
            "$limit": 10
        }

    ]

    category_result = (
        await jobs_collection.aggregate(
            category_pipeline
        ).to_list(
            length=10
        )
    )

    top_categories = []

    for item in category_result:

        top_categories.append({

            "category":
                item["_id"],

            "count":
                item["count"]

        })


    # -----------------------------------------------------
    # Jobs by location
    # -----------------------------------------------------

    location_pipeline = [

        {
            "$match": {
                "location": {
                    "$nin": [
                        None,
                        ""
                    ]
                }
            }
        },

        {
            "$group": {

                "_id":
                    "$location",

                "count": {
                    "$sum": 1
                }

            }
        },

        {
            "$sort": {
                "count": -1
            }
        },

        {
            "$limit": 10
        }

    ]

    location_result = (
        await jobs_collection.aggregate(
            location_pipeline
        ).to_list(
            length=10
        )
    )

    top_locations = []

    for item in location_result:

        top_locations.append({

            "location":
                item["_id"],

            "count":
                item["count"]

        })


    # -----------------------------------------------------
    # Companies
    # -----------------------------------------------------

    company_pipeline = [

        {
            "$match": {
                "company": {
                    "$nin": [
                        None,
                        ""
                    ]
                }
            }
        },

        {
            "$group": {

                "_id":
                    "$company",

                "count": {
                    "$sum": 1
                }

            }
        },

        {
            "$sort": {
                "count": -1
            }
        },

        {
            "$limit": 10
        }

    ]

    company_result = (
        await jobs_collection.aggregate(
            company_pipeline
        ).to_list(
            length=10
        )
    )

    top_companies = []

    for item in company_result:

        top_companies.append({

            "company":
                item["_id"],

            "count":
                item["count"]

        })


    return {

        "success": True,

        "statistics": {

            "total_jobs":
                total_jobs,

            "top_categories":
                top_categories,

            "top_locations":
                top_locations,

            "top_companies":
                top_companies

        }

    }

# =========================================================
# GET JOB RECOMMENDATIONS
# =========================================================

@router.get("/recommendations")
async def get_job_recommendations(
    search: str = "",
    location: str = "",
    admin=Depends(get_current_admin)
):

    query = {}

    # Search
    if search:

        query["$or"] = [

            {
                "title": {
                    "$regex": search,
                    "$options": "i"
                }
            },

            {
                "company": {
                    "$regex": search,
                    "$options": "i"
                }
            }

        ]

    # Location
    if location:

        query["location"] = {
            "$regex": location,
            "$options": "i"
        }


    cursor = jobs_collection.find(
        query
    ).sort(
        "_id",
        -1
    ).limit(100)


    jobs = []


    async for job in cursor:

        jobs.append({

            "id":
                str(job["_id"]),

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

            "category":
                job.get(
                    "category",
                    ""
                ),

            "contract_type":
                job.get(
                    "contract_type",
                    ""
                ),

            "salary_min":
                job.get(
                    "salary_min"
                ),

            "salary_max":
                job.get(
                    "salary_max"
                ),

            "apply_url":
                job.get(
                    "apply_url",
                    job.get(
                        "redirect_url",
                        job.get(
                            "apply_link",
                            ""
                        )
                    )
                ),

            "source":
                job.get(
                    "source",
                    "Adzuna"
                ),

            "created":
                job.get(
                    "created",
                    job.get(
                        "created_at"
                    )
                )

        })


    return {

        "success": True,

        "total":
            len(jobs),

        "jobs":
            jobs

    }
# =========================================================
# GET SINGLE JOB
# =========================================================

@router.get("/{job_id}")
async def get_job(
    job_id: str,
    admin=Depends(get_current_admin)
):

    try:

        object_id = ObjectId(
            job_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid job ID"
        )

    job = await jobs_collection.find_one({

        "_id":
            object_id

    })

    if not job:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return {

        "success": True,

        "job": {

            "id":
                str(job["_id"]),

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

            "category":
                job.get(
                    "category",
                    ""
                ),

            "contract_type":
                job.get(
                    "contract_type",
                    ""
                ),

            "salary_min":
                job.get(
                    "salary_min"
                ),

            "salary_max":
                job.get(
                    "salary_max"
                ),

            "apply_url":
                job.get(
                    "apply_url",
                    job.get(
                        "redirect_url",
                        job.get(
                            "apply_link",
                            ""
                        )
                    )
                ),

            "source":
                job.get(
                    "source",
                    "Unknown"
                )

        }

    }


# =========================================================
# ADD JOB
# =========================================================

@router.post("")
async def create_job(
    job: dict,
    admin=Depends(get_current_admin)
):

    required_fields = [
        "title",
        "company",
        "location"
    ]

    for field in required_fields:

        if not job.get(field):

            raise HTTPException(
                status_code=400,
                detail=f"{field} is required"
            )

    job["source"] = job.get(
        "source",
        "Admin"
    )

    job["created_at"] = datetime.utcnow()

    result = await jobs_collection.insert_one(
        job
    )

    return {

        "success": True,

        "message":
            "Job created successfully",

        "job_id":
            str(result.inserted_id)

    }


# =========================================================
# UPDATE JOB
# =========================================================

@router.put("/{job_id}")
async def update_job(
    job_id: str,
    job: dict,
    admin=Depends(get_current_admin)
):

    try:

        object_id = ObjectId(
            job_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid job ID"
        )

    existing_job = await jobs_collection.find_one({

        "_id":
            object_id

    })

    if not existing_job:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    # Prevent changing MongoDB ID

    job.pop(
        "_id",
        None
    )

    await jobs_collection.update_one(

        {
            "_id":
                object_id
        },

        {
            "$set":
                job
        }

    )

    return {

        "success": True,

        "message":
            "Job updated successfully"

    }


# =========================================================
# DELETE JOB
# =========================================================

@router.delete("/{job_id}")
async def delete_job(
    job_id: str,
    admin=Depends(get_current_admin)
):

    try:

        object_id = ObjectId(
            job_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid job ID"
        )

    job = await jobs_collection.find_one({

        "_id":
            object_id

    })

    if not job:

        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    await jobs_collection.delete_one({

        "_id":
            object_id

    })

    return {

        "success": True,

        "message":
            "Job deleted successfully"

    }