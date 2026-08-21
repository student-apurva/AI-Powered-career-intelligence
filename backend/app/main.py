import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.routing import APIRoute
from app.routes.ats import router as ats_router
from app.routes.auth import router as auth_router
from app.routes.resume import router as resume_router
from app.routes.profile import router as profile_router
from app.routes.career import router as career_router
from app.routes.jobs import router as jobs_router
from app.routes.courses import (router as courses_router)
from app.routes.resume_improvement import (router as resume_improvement_router)
from app.routes.dashboard import router as dashboard_router
from app.routes.admin.auth import router as admin_auth_router
from app.routes.admin.dashboard import router as admin_dashboard_router
from app.routes.admin.users import router as admin_users_router
from app.routes.admin.profiles import router as admin_profiles_router
from app.routes.admin.resumes import router as admin_resumes_router
from app.routes.admin.ats import router as admin_ats_router
from app.routes.admin.skills import router as admin_skills_router
from app.routes.admin.careers import router as admin_careers_router
from app.routes.admin.jobs import router as admin_jobs_router
from app.routes.admin.courses import router as admin_courses_router
from app.routes.admin.activity import router as admin_activity_router
from app.routes.admin.system import router as admin_system_router
from app.routes.admin.reports import router as admin_reports_router
from app.routes.chatbot import router as chatbot_router
from app.routes.public_statistics import router as public_statistics_router

app = FastAPI(
    title="AI Career Intelligence API",
    version="1.0.0",
)

# ==========================
# CORS Configuration
# ==========================

raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    ",".join(
        [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "https://id-preview--94882ff4-7c73-4612-9eac-4e255eafe801.lovable.app",
        ]
    ),
)

allow_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# Routers
# ==========================

app.include_router(auth_router, prefix="/api/users", tags=["Authentication"])
app.include_router(profile_router, tags=["Profile"])
app.include_router(resume_router, tags=["Resume"])
app.include_router(ats_router, tags=["ATS"])
app.include_router(career_router)
app.include_router(jobs_router)
app.include_router(courses_router)
app.include_router(resume_improvement_router)
app.include_router(dashboard_router)
app.include_router(admin_auth_router)
app.include_router(admin_dashboard_router)
app.include_router(admin_users_router)
app.include_router(admin_profiles_router)
app.include_router(admin_resumes_router)
app.include_router(admin_ats_router)
app.include_router(admin_skills_router)
app.include_router(admin_careers_router)
app.include_router(admin_jobs_router)
app.include_router(admin_courses_router)
app.include_router(admin_activity_router)
app.include_router(admin_system_router)
app.include_router(admin_reports_router)
app.include_router(chatbot_router)
app.include_router(public_statistics_router)
# ==========================
# Debug Routes
# ==========================

for route in app.routes:
    if isinstance(route, APIRoute):
        print(route.path, route.methods)

# ==========================
# Static Files
# ==========================

os.makedirs("uploads", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

# ==========================
# Root Endpoint
# ==========================

@app.get("/")
def home():
    return {
        "message": "AI Career Intelligence Backend Running 🚀"
    }

# ==========================
# Health Check
# ==========================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }