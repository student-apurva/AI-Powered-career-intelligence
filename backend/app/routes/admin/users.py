from fastapi import APIRouter, Depends, HTTPException, Query
from bson import ObjectId

from app.dependencies import get_current_admin
from app.database import users_collection


router = APIRouter(
    prefix="/api/admin/users",
    tags=["Admin User Management"]
)


# =========================================================
# GET ALL USERS
# =========================================================

@router.get("")
async def get_all_users(
    search: str = "",
    role: str = "",
    admin=Depends(get_current_admin)
):

    query = {}

    # -------------------------
    # Search
    # -------------------------

    if search:

        query["$or"] = [
            {
                "fullName": {
                    "$regex": search,
                    "$options": "i"
                }
            },
            {
                "email": {
                    "$regex": search,
                    "$options": "i"
                }
            }
        ]

    # -------------------------
    # Role Filter
    # -------------------------

    if role:

        query["role"] = role

    # -------------------------
    # Fetch Users
    # -------------------------

    cursor = users_collection.find(
        query
    ).sort(
        "_id",
        -1
    )

    users = []

    async for user in cursor:

        users.append({

            "id": str(user["_id"]),

            "fullName":
                user.get("fullName", ""),

            "email":
                user.get("email", ""),

            "mobile":
                user.get("mobile", ""),

            "role":
                user.get("role", "Student"),

            "isActive":
                user.get("isActive", True)

        })

    return {

        "success": True,

        "total": len(users),

        "users": users

    }


# =========================================================
# GET SINGLE USER
# =========================================================

@router.get("/{user_id}")
async def get_user(
    user_id: str,
    admin=Depends(get_current_admin)
):

    try:

        object_id = ObjectId(user_id)

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid user ID"
        )

    user = await users_collection.find_one(
        {
            "_id": object_id
        }
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {

        "success": True,

        "user": {

            "id":
                str(user["_id"]),

            "fullName":
                user.get("fullName", ""),

            "email":
                user.get("email", ""),

            "mobile":
                user.get("mobile", ""),

            "role":
                user.get("role", "Student"),

            "isActive":
                user.get("isActive", True)

        }

    }


# =========================================================
# UPDATE USER ROLE / STATUS
# =========================================================

@router.put("/{user_id}")
async def update_user(
    user_id: str,
    role: str | None = None,
    isActive: bool | None = None,
    admin=Depends(get_current_admin)
):

    try:

        object_id = ObjectId(user_id)

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid user ID"
        )

    user = await users_collection.find_one(
        {
            "_id": object_id
        }
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    update_data = {}

    # -------------------------
    # Update Role
    # -------------------------

    if role is not None:

        allowed_roles = [
            "Student",
            "Professional",
            "Recruiter",
            "Admin"
        ]

        if role not in allowed_roles:

            raise HTTPException(
                status_code=400,
                detail="Invalid role"
            )

        update_data["role"] = role

    # -------------------------
    # Update Status
    # -------------------------

    if isActive is not None:

        update_data["isActive"] = isActive

    if not update_data:

        raise HTTPException(
            status_code=400,
            detail="No update data provided"
        )

    await users_collection.update_one(
        {
            "_id": object_id
        },
        {
            "$set": update_data
        }
    )

    updated_user = await users_collection.find_one(
        {
            "_id": object_id
        }
    )

    return {

        "success": True,

        "message":
            "User updated successfully",

        "user": {

            "id":
                str(updated_user["_id"]),

            "fullName":
                updated_user.get("fullName", ""),

            "email":
                updated_user.get("email", ""),

            "role":
                updated_user.get("role", "Student"),

            "isActive":
                updated_user.get("isActive", True)

        }

    }


# =========================================================
# DELETE USER
# =========================================================

@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    admin=Depends(get_current_admin)
):

    try:

        object_id = ObjectId(user_id)

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid user ID"
        )

    user = await users_collection.find_one(
        {
            "_id": object_id
        }
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # --------------------------------
    # Prevent Admin From Deleting
    # --------------------------------

    if user.get("role") == "Admin":

        raise HTTPException(
            status_code=403,
            detail="Admin users cannot be deleted"
        )

    await users_collection.delete_one(
        {
            "_id": object_id
        }
    )

    return {

        "success": True,

        "message":
            "User deleted successfully"

    }