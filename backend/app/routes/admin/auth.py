from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr

from app.database import users_collection
from app.auth import verify_password
from app.config import create_access_token
from app.dependencies import get_current_admin


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin Authentication"]
)


# =========================================================
# ADMIN LOGIN SCHEMA
# =========================================================

class AdminLogin(BaseModel):
    email: EmailStr
    password: str


# =========================================================
# ADMIN LOGIN
# =========================================================

@router.post("/login")
async def admin_login(data: AdminLogin):

    # -----------------------------------------------------
    # Find user
    # -----------------------------------------------------

    admin = await users_collection.find_one({
        "email": data.email
    })

    if not admin:

        raise HTTPException(
            status_code=401,
            detail="Invalid admin credentials"
        )


    # -----------------------------------------------------
    # Check Admin role
    # -----------------------------------------------------

    if admin.get("role", "").lower() != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )


    # -----------------------------------------------------
    # Verify password
    # -----------------------------------------------------

    if not verify_password(
        data.password,
        admin["password"]
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid admin credentials"
        )


    # -----------------------------------------------------
    # Create Admin JWT
    # -----------------------------------------------------

    token = create_access_token({

        "id": str(admin["_id"]),

        "email": admin["email"],

        "role": "admin"

    })


    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {

        "success": True,

        "message":
            "Admin authentication successful",

        "token":
            token,

        "admin": {

            "id":
                str(admin["_id"]),

            "name":
                admin.get(
                    "fullName",
                    admin.get(
                        "name",
                        "Admin"
                    )
                ),

            "email":
                admin["email"],

            "role":
                "Admin"

        }

    }


# =========================================================
# VERIFY ADMIN
# =========================================================

@router.get("/verify")
async def verify_admin(
    admin=Depends(get_current_admin)
):

    return {

        "success": True,

        "message":
            "Admin token is valid",

        "admin":
            admin

    }