from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB Connection
MONGO_URL = "mongodb://localhost:27017"

client = AsyncIOMotorClient(MONGO_URL)

db = client["career_ai"]

# ===========================
# Collections
# ===========================

users_collection = db["users"]

profiles_collection = db["profiles"]

resumes_collection = db["resumes"]

# Existing collections (KEEP)
jobs_collection = db["jobs"]
saved_jobs_collection = db["saved_jobs"]
courses_collection = db["courses"]

# AI Module collections
ats_results_collection = db["ats_results"]

career_recommendations_collection = db["career_recommendations"]

job_recommendations_collection = db["job_recommendations"]

course_recommendations_collection = db["course_recommendations"]

resume_improvement_collection = db["resume_improvement"]

activity_collection = db["activity"]