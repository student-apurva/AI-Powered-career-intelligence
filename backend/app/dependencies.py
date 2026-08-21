from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.config import decode_access_token


# Change this line
security = HTTPBearer(auto_error=False)


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    print("Credentials:", credentials)

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )

    token = credentials.credentials

    print("Received Token:", token)

    user_id = decode_access_token(token)

    print("Decoded User ID:", user_id)

    return user_id


from fastapi import Depends, HTTPException
from bson import ObjectId

from app.database import users_collection


from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from jose import jwt, JWTError

from app.config import SECRET_KEY


security = HTTPBearer()


# =========================================================
# GET CURRENT ADMIN
# =========================================================

async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    )
):

    token = credentials.credentials

    print(
        "Received Token:",
        token
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"]
        )

    except JWTError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )


    # -----------------------------------------------------
    # Check Admin Role
    # -----------------------------------------------------

    role = payload.get("role")

    if not role or role.lower() != "admin":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )


    # -----------------------------------------------------
    # Return Admin Information
    # -----------------------------------------------------

    return {

        "id":
            payload.get("id"),

        "email":
            payload.get("email"),

        "role":
            role

    }