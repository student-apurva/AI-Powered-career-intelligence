from fastapi import APIRouter, HTTPException
from bson import ObjectId

from app.database import (
    users_collection,
    resumes_collection,
    career_recommendations_collection,
    courses_collection,
    course_recommendations_collection,
)

from app.services.course_matcher import rank_courses
from app.services.learning_path_ai import (
    generate_learning_path
)
from app.services.learning_path_matcher import (
    attach_courses_to_learning_path
)
# ==========================================
# Router
# ==========================================

router = APIRouter(
    prefix="/api/courses",
    tags=["Course Recommendation"],
)


# ==========================================
# Helper - Extract Career Information
# ==========================================

def extract_career_information(career_document):

    recommended_careers = []
    target_skills = []

    if not career_document:
        return recommended_careers, target_skills

    # ======================================
    # Try recommendations directly
    # ======================================

    recommendations = (
        career_document.get(
            "recommendations",
            []
        )
        or []
    )

    # ======================================
    # Try recommendations inside data
    # ======================================

    if not recommendations:

        data = career_document.get(
            "data",
            {}
        )

        if isinstance(data, dict):

            recommendations = (
                data.get(
                    "recommendations",
                    []
                )
                or []
            )

    # ======================================
    # Extract Careers + Skills
    # ======================================

    for recommendation in recommendations:

        if not isinstance(
            recommendation,
            dict
        ):
            continue

        # ----------------------------------
        # Career
        # ----------------------------------

        career = recommendation.get(
            "career",
            ""
        )

        if (
            career
            and career not in recommended_careers
        ):
            recommended_careers.append(
                career
            )

        # ----------------------------------
        # Skills To Improve
        # ----------------------------------

        skills_to_improve = (
            recommendation.get(
                "skills_to_improve",
                []
            )
            or []
        )

        for skill in skills_to_improve:

            if (
                skill
                and skill not in target_skills
            ):
                target_skills.append(
                    skill
                )

    return (
        recommended_careers,
        target_skills
    )


# ==========================================
# Course Recommendation API
#
# GET:
# /api/courses/recommendations/{user_id}
# ==========================================

@router.get(
    "/recommendations/{user_id}"
)
async def get_course_recommendations(
    user_id: str
):

    try:

        print()
        print("======================================")
        print("COURSE RECOMMENDATION API STARTED")
        print("======================================")

        # ==================================
        # STEP 1
        # Validate User ID
        # ==================================

        print("STEP 1: Validating user ID...")

        if not ObjectId.is_valid(user_id):

            raise HTTPException(
                status_code=400,
                detail="Invalid user ID"
            )

        object_user_id = ObjectId(
            user_id
        )

        print("STEP 2: User ID valid")


        # ==================================
        # STEP 2
        # Find User
        # ==================================

        print("STEP 3: Searching user...")

        user = await users_collection.find_one(
            {
                "_id": object_user_id
            }
        )

        print(
            "STEP 4: User query completed"
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
        # STEP 3
        # Find Resume
        # ==================================

        print(
            "STEP 5: Searching resume..."
        )

        resume = await resumes_collection.find_one(
            {
                "user_id": object_user_id
            }
        )

        # ----------------------------------
        # Try string user ID
        # ----------------------------------

        if not resume:

            resume = (
                await
                resumes_collection.find_one(
                    {
                        "user_id": user_id
                    }
                )
            )

        print(
            "STEP 6: Resume query completed"
        )

        if not resume:

            raise HTTPException(
                status_code=404,
                detail=(
                    "Resume not found. "
                    "Please upload your resume first."
                )
            )


        # ==================================
        # STEP 4
        # Extract Resume Data
        # ==================================

        print(
            "STEP 7: Extracting resume skills..."
        )

        parsed_data = resume.get(
            "parsed_data",
            {}
        )

        if not parsed_data:
            parsed_data = resume

        user_skills = (
            parsed_data.get(
                "skills",
                []
            )
            or []
        )

        if not user_skills:

            raise HTTPException(
                status_code=400,
                detail=(
                    "No skills were found "
                    "in your resume."
                )
            )

        print(
            "STEP 8: Resume skills extracted"
        )

        print(
            "Resume Skills:",
            user_skills
        )


        # ==================================
        # STEP 5
        # Find Career Recommendations
        # ==================================

        print(
            "STEP 9: Searching career recommendations..."
        )

        # ----------------------------------
        # Try ObjectId
        # ----------------------------------

        career_document = (
            await
            career_recommendations_collection
            .find_one(
                {
                    "user_id":
                        object_user_id
                }
            )
        )

        # ----------------------------------
        # Try String ID
        # ----------------------------------

        if not career_document:

            career_document = (
                await
                career_recommendations_collection
                .find_one(
                    {
                        "user_id":
                            user_id
                    }
                )
            )

        print(
            "STEP 10: Career query completed"
        )


        # ==================================
        # STEP 6
        # Extract Career Information
        # ==================================

        print(
            "STEP 11: Extracting career information..."
        )

        (
            recommended_careers,
            target_skills
        ) = extract_career_information(
            career_document
        )

        print(
            "STEP 12: Career information extracted"
        )

        print(
            "Recommended Careers:",
            recommended_careers
        )

        print(
            "Target Skills:",
            target_skills
        )


        # ==================================
        # STEP 7
        # Load Courses
        # ==================================

        print(
            "STEP 13: Loading courses..."
        )

        courses = []

        async for course in (
            courses_collection.find({})
        ):

            courses.append(
                course
            )

        print(
            "STEP 14: Courses loaded:",
            len(courses)
        )

        if not courses:

            raise HTTPException(
                status_code=404,
                detail=(
                    "No courses found. "
                    "Please seed the course "
                    "dataset first."
                )
            )


        # ==================================
        # Show Complete Input
        # ==================================

        print()
        print("======================================")
        print("COURSE RECOMMENDATION INPUT")
        print("======================================")

        print(
            "User:",
            user.get(
                "fullName",
                ""
            )
        )

        print(
            "Resume Skills:",
            user_skills
        )

        print(
            "Recommended Careers:",
            recommended_careers
        )

        print(
            "Target Skills:",
            target_skills
        )

        print(
            "Available Courses:",
            len(courses)
        )

        print("======================================")
        print()


        # ==================================
        # STEP 8
        # Rank Courses
        # ==================================

        print(
            "STEP 15: Starting course ranking..."
        )

        recommendations = rank_courses(

            courses=courses,

            user_skills=user_skills,

            target_skills=target_skills,

            recommended_careers=(
                recommended_careers
            ),

            limit=10
        )

        print(
            "STEP 16: Course ranking completed"
        )

        print(
            "Recommendations:",
            len(recommendations)
        )


        # ==================================
        # Ranking Debug
        # ==================================

        print()
        print("======================================")
        print("COURSE RANKING RESULTS")
        print("======================================")

        for course in recommendations:

            print()

            print(
                "Course:",
                course.get(
                    "title",
                    ""
                )
            )

            print(
                "Provider:",
                course.get(
                    "provider",
                    ""
                )
            )

            print(
                "Match Score:",
                course.get(
                    "match_score",
                    0
                )
            )

            print(
                "Matching Skills:",
                course.get(
                    "matching_skills",
                    []
                )
            )

            print(
                "Skills To Learn:",
                course.get(
                    "skills_to_learn",
                    []
                )
            )

            print(
                "Skill Gap Score:",
                course.get(
                    "skill_gap_score",
                    0
                )
            )

            print(
                "Course Relevance:",
                course.get(
                    "course_relevance_score",
                    0
                )
            )

            print(
                "Career Relevance:",
                course.get(
                    "career_relevance_score",
                    0
                )
            )

            print(
                "Learning Value:",
                course.get(
                    "learning_value_score",
                    0
                )
            )

        print()
        print("======================================")


        # ==================================
        # STEP 9
        # Filter Weak Results
        # ==================================

        print(
            "STEP 17: Filtering recommendations..."
        )

        useful_recommendations = [

            course

            for course in recommendations

            if course.get(
                "match_score",
                0
            ) > 0
        ]

        # ----------------------------------
        # If everything scored zero
        # ----------------------------------

        if not useful_recommendations:

            useful_recommendations = (
                recommendations
            )

        print(
            "STEP 18: Filtering completed"
        )

        print(
            "Useful Recommendations:",
            len(
                useful_recommendations
            )
        )


        # ==================================
        # STEP 10
        # Prepare Response
        # ==================================

        print(
            "STEP 19: Preparing API response..."
        )

        response_data = {

            "success": True,

            "message": (
                "Course recommendations "
                "generated successfully"
            ),

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
                    )
            },

            "learning_profile": {

                "current_skills":
                    user_skills,

                "recommended_careers":
                    recommended_careers,

                "target_skills":
                    target_skills
            },

            "total_courses":
                len(
                    useful_recommendations
                ),

            "recommendations":
                useful_recommendations
        }
        # ==========================================
# Save Course Recommendations
# ==========================================

        from app.database import course_recommendations_collection

        course_data = await course_recommendations_collection.update_one(

            {
                "user_id": user_id
            },

            {
                "$set": {

                    "user_id": user_id,

                    "recommendations": useful_recommendations

                }

            },

            upsert=True

        )
        print("\n========== COURSE DOCUMENT ==========")
        print(course_data)
        print("====================================\n")

        print(
            "STEP 20: Response ready"
        )

        print("======================================")
        print("COURSE RECOMMENDATION API COMPLETED")
        print("======================================")
        print()

        return response_data


    # ======================================
    # HTTP Errors
    # ======================================

    except HTTPException:
        raise


    # ======================================
    # Unexpected Errors
    # ======================================

    except Exception as e:

        print()
        print("======================================")
        print("COURSE RECOMMENDATION ERROR")
        print("======================================")

        print(
            "Error Type:",
            type(e).__name__
        )

        print(
            "Error:",
            repr(e)
        )

        print("======================================")
        print()

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to generate "
                "course recommendations: "
                f"{str(e)}"
            )
        )

# ==========================================
# Learning Path API
#
# GET:
# /api/courses/learning-path/{user_id}
# ==========================================

@router.get(
    "/learning-path/{user_id}"
)
async def get_learning_path(
    user_id: str
):

    try:

        print()
        print("======================================")
        print("LEARNING PATH API")
        print("======================================")

        # ==================================
        # 1. Validate User ID
        # ==================================

        if not ObjectId.is_valid(user_id):

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

        user = await users_collection.find_one(
            {
                "_id": object_user_id
            }
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

        resume = await resumes_collection.find_one(
            {
                "user_id": object_user_id
            }
        )


        # Try string user_id
        if not resume:

            resume = (
                await
                resumes_collection.find_one(
                    {
                        "user_id": user_id
                    }
                )
            )


        if not resume:

            raise HTTPException(
                status_code=404,
                detail=(
                    "Resume not found. "
                    "Please upload your resume first."
                )
            )


        # ==================================
        # 4. Extract Resume Skills
        # ==================================

        parsed_data = resume.get(
            "parsed_data",
            {}
        )


        if not parsed_data:

            parsed_data = resume


        current_skills = (
            parsed_data.get(
                "skills",
                []
            )
            or []
        )


        if not current_skills:

            raise HTTPException(
                status_code=400,
                detail=(
                    "No skills were found "
                    "in your resume."
                )
            )


        # ==================================
        # 5. Find Career Recommendations
        # ==================================

        career_document = (
            await
            career_recommendations_collection
            .find_one(
                {
                    "user_id":
                        object_user_id
                }
            )
        )


        # Try string user_id
        if not career_document:

            career_document = (
                await
                career_recommendations_collection
                .find_one(
                    {
                        "user_id":
                            user_id
                    }
                )
            )


        if not career_document:

            raise HTTPException(
                status_code=404,
                detail=(
                    "Career recommendations "
                    "not found. Generate career "
                    "recommendations first."
                )
            )


        # ==================================
        # 6. Extract Career Information
        # ==================================

        (
            recommended_careers,
            target_skills
        ) = extract_career_information(
            career_document
        )


        # ==================================
        # 7. Validate Target Skills
        # ==================================

        if not target_skills:

            raise HTTPException(
                status_code=400,
                detail=(
                    "No target skills were found "
                    "from career recommendations."
                )
            )


        # ==================================
        # Debug Information
        # ==================================

        print()
        print("Current Skills:")
        print(current_skills)

        print()
        print("Recommended Careers:")
        print(recommended_careers)

        print()
        print("Target Skills:")
        print(target_skills)

        print()
        print(
            "Generating personalized "
            "learning path..."
        )


        # ==================================
        # 8. Generate AI Learning Path
        # ==================================

        learning_path = generate_learning_path(

            current_skills=(
                current_skills
            ),

            target_skills=(
                target_skills
            ),

            recommended_careers=(
                recommended_careers
            )
        )
                # ==========================================
        # Load Course Dataset
        # ==========================================

        courses = []

        async for course in courses_collection.find({}):

            courses.append(
                course
            )


        print(
            "Courses available for learning path:",
            len(courses)
        )


        # ==========================================
        # Attach Courses To Learning Steps
        # ==========================================

        learning_steps = learning_path.get(
            "learning_path",
            []
        )


        learning_steps_with_courses = (
            attach_courses_to_learning_path(

                learning_path=learning_steps,

                courses=courses
            )
        )


        # ==========================================
        # Replace Original Learning Path
        # ==========================================

        learning_path[
            "learning_path"
        ] = learning_steps_with_courses

        # ==================================
        # 9. Validate AI Result
        # ==================================

        if not learning_path:

            raise HTTPException(
                status_code=500,
                detail=(
                    "Learning path generation "
                    "returned no result."
                )
            )


        # ==================================
        # 10. Response
        # ==================================

        print()
        print(
            "Learning path generated "
            "successfully."
        )

        print("======================================")
        print()


        return {

            "success": True,

            "message": (
                "Personalized learning path "
                "generated successfully"
            ),

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
                    )
            },

            "learning_profile": {

                "current_skills":
                    current_skills,

                "recommended_careers":
                    recommended_careers,

                "target_skills":
                    target_skills
            },

            "data":
                learning_path
        }


    # ======================================
    # Preserve HTTP Errors
    # ======================================

    except HTTPException:
        raise


    # ======================================
    # Unexpected Errors
    # ======================================

    except Exception as e:

        print()
        print("======================================")
        print("LEARNING PATH API ERROR")
        print("======================================")

        print(
            "Error:",
            repr(e)
        )

        print("======================================")
        print()

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to generate "
                "learning path: "
                f"{str(e)}"
            )
        )