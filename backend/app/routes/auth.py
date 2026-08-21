from fastapi import APIRouter, HTTPException

from app.database import users_collection
from app.schemas import RegisterUser, LoginUser
from app.auth import hash_password, verify_password
from app.config import create_access_token
from app.utils.activity_logger import log_activity


router = APIRouter()


# =========================================================
# REGISTER
# =========================================================

@router.post("/register")
async def register(user: RegisterUser):

    # -----------------------------------------------------
    # Check existing user
    # -----------------------------------------------------

    existing = await users_collection.find_one(
        {
            "email": user.email
        }
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )


    # -----------------------------------------------------
    # Create user
    # -----------------------------------------------------

    new_user = {

        "fullName":
            user.fullName,

        "email":
            user.email,

        "mobile":
            user.mobile,

        "password":
            hash_password(
                user.password
            ),

        "role":
            user.role

    }


    result = await users_collection.insert_one(
        new_user
    )


    # -----------------------------------------------------
    # Log registration activity
    # -----------------------------------------------------

    await log_activity(

        action="Registration",

        description=
            "New user registered",

        user_id=
            result.inserted_id,

        user_name=
            user.fullName,

        email=
            user.email

    )


    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {

        "success":
            True,

        "message":
            "Registration Successful"

    }
    

# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
async def login(user: LoginUser):

    # -----------------------------------------------------
    # Find user
    # -----------------------------------------------------

    db_user = await users_collection.find_one(
        {
            "email": user.email
        }
    )


    if not db_user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    # -----------------------------------------------------
    # Verify password
    # -----------------------------------------------------

    if not verify_password(
        user.password,
        db_user["password"]
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )


    # -----------------------------------------------------
    # Create JWT
    # -----------------------------------------------------

    token = create_access_token({

        "id":
            str(
                db_user["_id"]
            ),

        "email":
            db_user["email"]

    })


    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {

        "success":
            True,

        "message":
            "Login Successful",

        "token":
            token,

        "user": {

            "id":
                str(
                    db_user["_id"]
                ),

            "fullName":
                db_user["fullName"],

            "email":
                db_user["email"],

            "role":
                db_user["role"]

        }

    }
