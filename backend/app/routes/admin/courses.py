from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime

from app.dependencies import get_current_admin
from app.database import courses_collection


router = APIRouter(
    prefix="/api/admin/courses",
    tags=["Admin Course Management"]
)


# =========================================================
# GET ALL COURSES
# =========================================================

@router.get("")
async def get_all_courses(
    search: str = "",
    category: str = "",
    level: str = "",
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
                "name": {
                    "$regex": search,
                    "$options": "i"
                }
            },
            {
                "provider": {
                    "$regex": search,
                    "$options": "i"
                }
            }
        ]

    # -----------------------------------------------------
    # Category
    # -----------------------------------------------------

    if category:

        query["category"] = {
            "$regex": category,
            "$options": "i"
        }

    # -----------------------------------------------------
    # Level
    # -----------------------------------------------------

    if level:

        query["level"] = {
            "$regex": level,
            "$options": "i"
        }

    cursor = courses_collection.find(
        query
    ).sort(
        "_id",
        -1
    )

    courses = []

    async for course in cursor:

        courses.append({

            "id":
                str(course["_id"]),

            "title":
                course.get(
                    "title",
                    course.get(
                        "name",
                        ""
                    )
                ),

            "provider":
                course.get(
                    "provider",
                    ""
                ),

            "category":
                course.get(
                    "category",
                    ""
                ),

            "level":
                course.get(
                    "level",
                    ""
                ),

            "skills":
                course.get(
                    "skills",
                    []
                ),

            "url":
                course.get(
                    "url",
                    course.get(
                        "course_url",
                        ""
                    )
                ),

            "duration":
                course.get(
                    "duration",
                    ""
                ),

            "description":
                course.get(
                    "description",
                    ""
                ),

            "created_at":
                course.get(
                    "created_at"
                )

        })

    return {

        "success": True,

        "total":
            len(courses),

        "courses":
            courses

    }


# =========================================================
# COURSE STATISTICS
# =========================================================

@router.get("/statistics")
async def course_statistics(
    admin=Depends(get_current_admin)
):

    total_courses = (
        await courses_collection.count_documents({})
    )

    # -----------------------------------------------------
    # Categories
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
        await courses_collection.aggregate(
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
    # Providers
    # -----------------------------------------------------

    provider_pipeline = [

        {
            "$match": {
                "provider": {
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
                    "$provider",

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

    provider_result = (
        await courses_collection.aggregate(
            provider_pipeline
        ).to_list(
            length=10
        )
    )

    top_providers = []

    for item in provider_result:

        top_providers.append({

            "provider":
                item["_id"],

            "count":
                item["count"]

        })

    return {

        "success": True,

        "statistics": {

            "total_courses":
                total_courses,

            "top_categories":
                top_categories,

            "top_providers":
                top_providers

        }

    }


# =========================================================
# GET SINGLE COURSE
# =========================================================

@router.get("/{course_id}")
async def get_course(
    course_id: str,
    admin=Depends(get_current_admin)
):

    try:

        object_id = ObjectId(
            course_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid course ID"
        )

    course = await courses_collection.find_one({
        "_id": object_id
    })

    if not course:

        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    return {

        "success": True,

        "course": {

            "id":
                str(course["_id"]),

            "title":
                course.get(
                    "title",
                    course.get(
                        "name",
                        ""
                    )
                ),

            "provider":
                course.get(
                    "provider",
                    ""
                ),

            "category":
                course.get(
                    "category",
                    ""
                ),

            "level":
                course.get(
                    "level",
                    ""
                ),

            "skills":
                course.get(
                    "skills",
                    []
                ),

            "url":
                course.get(
                    "url",
                    course.get(
                        "course_url",
                        ""
                    )
                ),

            "duration":
                course.get(
                    "duration",
                    ""
                ),

            "description":
                course.get(
                    "description",
                    ""
                ),

            "created_at":
                course.get(
                    "created_at"
                )

        }

    }


# =========================================================
# CREATE COURSE
# =========================================================

@router.post("")
async def create_course(
    course: dict,
    admin=Depends(get_current_admin)
):

    title = course.get(
        "title",
        course.get(
            "name"
        )
    )

    provider = course.get(
        "provider"
    )

    if not title:

        raise HTTPException(
            status_code=400,
            detail="Course title is required"
        )

    if not provider:

        raise HTTPException(
            status_code=400,
            detail="Course provider is required"
        )

    course["title"] = title

    course["created_at"] = datetime.utcnow()

    result = await courses_collection.insert_one(
        course
    )

    return {

        "success": True,

        "message":
            "Course created successfully",

        "course_id":
            str(result.inserted_id)

    }


# =========================================================
# UPDATE COURSE
# =========================================================

@router.put("/{course_id}")
async def update_course(
    course_id: str,
    course: dict,
    admin=Depends(get_current_admin)
):

    try:

        object_id = ObjectId(
            course_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid course ID"
        )

    existing_course = await courses_collection.find_one({
        "_id": object_id
    })

    if not existing_course:

        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    course.pop(
        "_id",
        None
    )

    await courses_collection.update_one(

        {
            "_id":
                object_id
        },

        {
            "$set":
                course
        }

    )

    return {

        "success": True,

        "message":
            "Course updated successfully"

    }


# =========================================================
# DELETE COURSE
# =========================================================

@router.delete("/{course_id}")
async def delete_course(
    course_id: str,
    admin=Depends(get_current_admin)
):

    try:

        object_id = ObjectId(
            course_id
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid course ID"
        )

    course = await courses_collection.find_one({
        "_id": object_id
    })

    if not course:

        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    await courses_collection.delete_one({
        "_id": object_id
    })

    return {

        "success": True,

        "message":
            "Course deleted successfully"

    }