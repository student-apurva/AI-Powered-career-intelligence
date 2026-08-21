import shutil
from pathlib import Path
from datetime import datetime, timezone

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends,
)
from fastapi.responses import FileResponse

from app.database import resumes_collection
from app.services.resume_service import ResumeParser
from app.dependencies import get_current_user_id


router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


# ==========================================
# UPLOAD DIRECTORY
# ==========================================

BASE_DIR = Path(__file__).resolve().parents[2]

UPLOAD_DIR = BASE_DIR / "uploads"

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ==========================================
# UPLOAD RESUME
# ==========================================

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id)
):

    # Check filename
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected"
        )

    # Get extension
    extension = Path(
        file.filename
    ).suffix.lower()

    allowed_extensions = [
        ".pdf",
        ".doc",
        ".docx"
    ]

    # Validate extension
    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOC and DOCX files are allowed."
        )

    # ======================================
    # Create user-specific filename
    # ======================================

    filename = f"{user_id}_Resume{extension}"

    filepath = UPLOAD_DIR / filename

    try:

        # ==================================
        # Delete old resume file
        # ONLY for current user
        # ==================================

        for old_file in UPLOAD_DIR.glob(
            f"{user_id}_Resume.*"
        ):

            if old_file.exists():
                old_file.unlink()

        # ==================================
        # Save new resume
        # ==================================

        with open(filepath, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        # ==================================
        # Parse resume
        # ==================================

        parser = ResumeParser(
            str(filepath)
        )

        parsed_data = parser.parse()

        # ==================================
        # MongoDB Document
        # ==================================

        document = {

            "user_id": user_id,

            "filename": filename,

            "filepath": str(filepath),

            "parsed_data": parsed_data,

            "uploaded_at": datetime.now(
                timezone.utc
            )
        }

        # ==================================
        # Delete ONLY this user's old record
        # ==================================

        await resumes_collection.delete_many(
            {
                "user_id": user_id
            }
        )

        # ==================================
        # Insert new resume
        # ==================================

        result = await resumes_collection.insert_one(
            document
        )

        return {

            "success": True,

            "message": "Resume uploaded successfully",

            "resume_id": str(
                result.inserted_id
            ),

            # Important for Profile.jsx
            "filename": filename,

            "parsed_data": parsed_data
        }

    except HTTPException:
        raise

    except Exception as error:

        print(
            "Resume upload error:",
            error
        )

        # Remove partially saved file
        if filepath.exists():
            filepath.unlink()

        raise HTTPException(
            status_code=500,
            detail=f"Resume upload failed: {str(error)}"
        )

    finally:

        await file.close()


# ==========================================
# GET CURRENT USER RESUME
# ==========================================

@router.get("/")
async def get_resume(
    user_id: str = Depends(get_current_user_id)
):

    resume = await resumes_collection.find_one(
        {
            "user_id": user_id
        }
    )

    if resume is None:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    # Convert MongoDB ObjectId to string
    resume["_id"] = str(
        resume["_id"]
    )

    return resume


# ==========================================
# VIEW CURRENT USER RESUME
# ==========================================

@router.get("/view")
async def view_resume(
    user_id: str = Depends(get_current_user_id)
):

    # Find ONLY logged-in user's resume
    resume = await resumes_collection.find_one(
        {
            "user_id": user_id
        }
    )

    if resume is None:

        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    filepath_string = resume.get(
        "filepath"
    )

    if not filepath_string:

        raise HTTPException(
            status_code=404,
            detail="Resume file path not found"
        )

    filepath = Path(
        filepath_string
    )

    # Check physical file
    if not filepath.exists():

        raise HTTPException(
            status_code=404,
            detail="Resume file not found"
        )

    extension = filepath.suffix.lower()

    # ======================================
    # Media Type
    # ======================================

    if extension == ".pdf":

        media_type = "application/pdf"

    elif extension == ".docx":

        media_type = (
            "application/vnd.openxmlformats-officedocument."
            "wordprocessingml.document"
        )

    elif extension == ".doc":

        media_type = "application/msword"

    else:

        media_type = "application/octet-stream"

    return FileResponse(
        path=str(filepath),
        filename=filepath.name,
        media_type=media_type
    )


# ==========================================
# DELETE CURRENT USER RESUME
# ==========================================

@router.delete("/")
async def delete_resume(
    user_id: str = Depends(get_current_user_id)
):

    # ======================================
    # Delete current user's physical file
    # ======================================

    for resume_file in UPLOAD_DIR.glob(
        f"{user_id}_Resume.*"
    ):

        if resume_file.exists():

            resume_file.unlink()

    # ======================================
    # Delete ONLY current user's MongoDB data
    # ======================================

    result = await resumes_collection.delete_many(
        {
            "user_id": user_id
        }
    )

    return {

        "success": True,

        "message": "Resume deleted successfully",

        "deleted": result.deleted_count
    }