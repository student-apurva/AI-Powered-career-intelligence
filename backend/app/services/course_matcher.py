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
# Calculate Course Match
# ==========================================

def calculate_course_match(
    course: Dict[str, Any],
    user_skills: List[str],
    target_skills: List[str],
    recommended_careers: List[str],
) -> Dict[str, Any]:

    # --------------------------------------
    # Normalize data
    # --------------------------------------

    course_skills_original = (
        course.get("skills", []) or []
    )

    course_skills = normalize_skills(
        course_skills_original
    )

    user_skill_set = normalize_skills(
        user_skills
    )

    target_skill_set = normalize_skills(
        target_skills
    )


    # ======================================
    # 1. Existing Skill Match
    # ======================================

    existing_matches = (
        course_skills &
        user_skill_set
    )


    # ======================================
    # 2. Skills User Needs To Learn
    # ======================================

    learning_matches = (
        course_skills &
        target_skill_set
    )


    # ======================================
    # Convert normalized skills back
    # to original course skill names
    # ======================================

    matching_skills = []

    skills_to_learn = []


    for skill in course_skills_original:

        normalized = normalize_skill(
            skill
        )

        if normalized in existing_matches:

            matching_skills.append(
                skill
            )

        if normalized in learning_matches:

            skills_to_learn.append(
                skill
            )


    # ======================================
    # 3. Skill Gap Score
    #
    # Most important component.
    # ======================================

    if target_skill_set:

        skill_gap_score = (

            len(learning_matches)
            /
            len(target_skill_set)

        ) * 100

    else:

        skill_gap_score = 0


    # ======================================
    # 4. Course Relevance Score
    #
    # How much of the course teaches
    # something relevant to this user.
    # ======================================

    if course_skills:

        relevant_skills = (
            existing_matches |
            learning_matches
        )

        course_relevance_score = (

            len(relevant_skills)
            /
            len(course_skills)

        ) * 100

    else:

        course_relevance_score = 0


    # ======================================
    # 5. Career Relevance
    # ======================================

    career_relevance_score = 0


    course_category = (
        course.get(
            "category",
            ""
        )
        .strip()
        .lower()
    )


    course_title = (
        course.get(
            "title",
            ""
        )
        .strip()
        .lower()
    )


    for career in recommended_careers:

        career_value = (
            str(career)
            .strip()
            .lower()
        )


        career_words = set(
            career_value.split()
        )


        searchable_course_text = (
            course_title
            + " "
            + course_category
            + " "
            + " ".join(
                course_skills
            )
        )


        matched_words = [

            word

            for word in career_words

            if len(word) > 2

            and word
            in searchable_course_text
        ]


        if matched_words:

            career_relevance_score = max(

                career_relevance_score,

                min(
                    100,
                    len(matched_words)
                    * 35
                )
            )


    # ======================================
    # 6. Learning Value
    #
    # Reward courses that teach at least
    # one skill the user does not know.
    # ======================================

    new_skills = (

        course_skills -
        user_skill_set

    )


    if course_skills:

        learning_value_score = (

            len(new_skills)
            /
            len(course_skills)

        ) * 100

    else:

        learning_value_score = 0


    # ======================================
    # 7. Final Score
    #
    # 50% skill gap
    # 25% course relevance
    # 15% career relevance
    # 10% learning value
    # ======================================

    final_score = (

        skill_gap_score * 0.50

        +

        course_relevance_score * 0.25

        +

        career_relevance_score * 0.15

        +

        learning_value_score * 0.10

    )


    final_score = round(
        min(
            100,
            max(
                0,
                final_score
            )
        ),
        2
    )


    # ======================================
    # 8. Recommendation Status
    # ======================================

    if final_score >= 70:

        recommendation_status = (
            "Highly Recommended"
        )

    elif final_score >= 50:

        recommendation_status = (
            "Recommended"
        )

    elif final_score >= 30:

        recommendation_status = (
            "Good Learning Option"
        )

    else:

        recommendation_status = (
            "Low Priority"
        )


    # ======================================
    # Return Result
    # ======================================

    return {

        "course_id":
            str(
                course.get(
                    "_id",
                    ""
                )
            ),

        "title":
            course.get(
                "title",
                ""
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

        "duration":
            course.get(
                "duration",
                ""
            ),

        "price_type":
            course.get(
                "price_type",
                ""
            ),

        "course_url":
            course.get(
                "course_url",
                ""
            ),

        "description":
            course.get(
                "description",
                ""
            ),

        "course_skills":
            course_skills_original,

        "matching_skills":
            matching_skills,

        "skills_to_learn":
            skills_to_learn,

        "match_score":
            final_score,

        "skill_gap_score":
            round(
                skill_gap_score,
                2
            ),

        "course_relevance_score":
            round(
                course_relevance_score,
                2
            ),

        "career_relevance_score":
            round(
                career_relevance_score,
                2
            ),

        "learning_value_score":
            round(
                learning_value_score,
                2
            ),

        "recommendation_status":
            recommendation_status,
    }


# ==========================================
# Rank Courses
# ==========================================

def rank_courses(
    courses: List[Dict[str, Any]],
    user_skills: List[str],
    target_skills: List[str],
    recommended_careers: List[str],
    limit: int = 10,
):

    recommendations = []


    for course in courses:

        result = calculate_course_match(

            course=course,

            user_skills=user_skills,

            target_skills=target_skills,

            recommended_careers=(
                recommended_careers
            ),
        )


        recommendations.append(
            result
        )


    # ======================================
    # Sort Highest Score First
    # ======================================

    recommendations.sort(

        key=lambda item:
            item["match_score"],

        reverse=True
    )


    # ======================================
    # Return Top Courses
    # ======================================

    return recommendations[:limit]