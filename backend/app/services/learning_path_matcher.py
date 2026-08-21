from typing import List, Dict, Any


# ==========================================
# Normalize Skill
# ==========================================

def normalize_skill(skill: str) -> str:

    if not skill:
        return ""

    return (
        str(skill)
        .strip()
        .lower()
        .replace(".", "")
        .replace("-", " ")
        .replace("_", " ")
    )


# ==========================================
# Normalize Skill List
# ==========================================

def normalize_skills(skills) -> set:

    if not skills:
        return set()

    return {
        normalize_skill(skill)
        for skill in skills
        if skill
    }


# ==========================================
# Calculate Course Score For Learning Step
# ==========================================

def calculate_step_course_score(
    step_skills,
    course
):

    step_skill_set = normalize_skills(
        step_skills
    )

    course_skills_original = (
        course.get(
            "skills",
            []
        )
        or []
    )

    course_skill_set = normalize_skills(
        course_skills_original
    )


    # ======================================
    # No Skills
    # ======================================

    if not step_skill_set:
        return 0


    if not course_skill_set:
        return 0


    # ======================================
    # Matching Skills
    # ======================================

    matching = (
        step_skill_set
        &
        course_skill_set
    )


    if not matching:
        return 0


    # ======================================
    # Coverage
    #
    # How many learning-step skills
    # are covered by the course?
    # ======================================

    coverage_score = (

        len(matching)
        /
        len(step_skill_set)

    ) * 100


    # ======================================
    # Course Relevance
    #
    # How focused is the course on the
    # learning step?
    # ======================================

    relevance_score = (

        len(matching)
        /
        len(course_skill_set)

    ) * 100


    # ======================================
    # Final Score
    #
    # Coverage is more important.
    # ======================================

    final_score = (

        coverage_score * 0.80

        +

        relevance_score * 0.20
    )


    return round(
        final_score,
        2
    )


# ==========================================
# Find Best Course
# ==========================================

def find_best_course_for_step(
    step_skills,
    courses
):

    best_course = None

    best_score = 0


    for course in courses:

        score = (
            calculate_step_course_score(
                step_skills=step_skills,
                course=course
            )
        )


        if score > best_score:

            best_score = score
            best_course = course


    # ======================================
    # No Matching Course
    # ======================================

    if not best_course:

        return None


    # ======================================
    # Return JSON-safe Course
    # ======================================

    return {

        "course_id":
            str(
                best_course.get(
                    "_id",
                    ""
                )
            ),

        "title":
            best_course.get(
                "title",
                ""
            ),

        "provider":
            best_course.get(
                "provider",
                ""
            ),

        "category":
            best_course.get(
                "category",
                ""
            ),

        "level":
            best_course.get(
                "level",
                ""
            ),

        "duration":
            best_course.get(
                "duration",
                ""
            ),

        "price_type":
            best_course.get(
                "price_type",
                ""
            ),

        "course_url":
            best_course.get(
                "course_url",
                ""
            ),

        "description":
            best_course.get(
                "description",
                ""
            ),

        "skills":
            best_course.get(
                "skills",
                []
            ),

        "step_match_score":
            best_score
    }


# ==========================================
# Attach Courses To Learning Path
# ==========================================

def attach_courses_to_learning_path(
    learning_path,
    courses
):

    if not learning_path:
        return []


    updated_path = []


    for learning_step in learning_path:

        # ==================================
        # Get Step Skills
        # ==================================

        step_skills = (
            learning_step.get(
                "skills",
                []
            )
            or []
        )


        # ==================================
        # Find Best Course
        # ==================================

        recommended_course = (
            find_best_course_for_step(
                step_skills=step_skills,
                courses=courses
            )
        )


        # ==================================
        # Create New Step
        # ==================================

        updated_step = {

            "step":
                learning_step.get(
                    "step"
                ),

            "title":
                learning_step.get(
                    "title",
                    ""
                ),

            "skills":
                step_skills,

            "goal":
                learning_step.get(
                    "goal",
                    ""
                ),

            "recommended_course":
                recommended_course
        }


        updated_path.append(
            updated_step
        )


    return updated_path