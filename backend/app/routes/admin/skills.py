from fastapi import APIRouter, Depends

from app.dependencies import get_current_admin
from app.database import ats_results_collection


router = APIRouter(
    prefix="/api/admin/skills",
    tags=["Admin Skill Gap Analytics"]
)


# =========================================================
# SKILL GAP ANALYTICS
# =========================================================

@router.get("/analytics")
async def skill_gap_analytics(
    admin=Depends(get_current_admin)
):

    # -----------------------------------------------------
    # Counters used for ranking skills
    # -----------------------------------------------------

    missing_counts = {}
    matching_counts = {}

    # -----------------------------------------------------
    # Unique skills across all ATS analyses
    # -----------------------------------------------------

    unique_missing_skills = set()
    unique_matching_skills = set()

    # -----------------------------------------------------
    # Total ATS analyses
    # -----------------------------------------------------

    total_analyses = 0

    # -----------------------------------------------------
    # Missing skills for each analysis
    # Used to calculate average skill gap
    # -----------------------------------------------------

    missing_skills_per_analysis = []


    # =====================================================
    # GET ATS RESULTS
    # =====================================================

    cursor = ats_results_collection.find(
        {},
        {
            "missing_skills": 1,
            "matching_skills": 1
        }
    )


    async for ats in cursor:

        total_analyses += 1


        # =================================================
        # MISSING SKILLS
        # =================================================

        missing_skills = ats.get(
            "missing_skills",
            []
        )

        # Skills missing in this particular analysis
        analysis_missing_skills = set()


        if isinstance(
            missing_skills,
            list
        ):

            for skill in missing_skills:

                if not skill:
                    continue


                skill_name = str(
                    skill
                ).strip()


                if not skill_name:
                    continue


                normalized = (
                    skill_name.lower()
                )


                # -----------------------------------------
                # Add to unique skills
                # -----------------------------------------

                unique_missing_skills.add(
                    normalized
                )


                # -----------------------------------------
                # Add to this analysis
                # -----------------------------------------

                analysis_missing_skills.add(
                    normalized
                )


                # -----------------------------------------
                # Count frequency
                # -----------------------------------------

                if normalized not in missing_counts:

                    missing_counts[
                        normalized
                    ] = {

                        "skill":
                            skill_name,

                        "count":
                            0

                    }


                missing_counts[
                    normalized
                ]["count"] += 1


        # -------------------------------------------------
        # Store number of missing skills for this analysis
        # -------------------------------------------------

        missing_skills_per_analysis.append(
            len(
                analysis_missing_skills
            )
        )


        # =================================================
        # MATCHING SKILLS
        # =================================================

        matching_skills = ats.get(
            "matching_skills",
            []
        )


        if isinstance(
            matching_skills,
            list
        ):

            for skill in matching_skills:

                if not skill:
                    continue


                skill_name = str(
                    skill
                ).strip()


                if not skill_name:
                    continue


                normalized = (
                    skill_name.lower()
                )


                # -----------------------------------------
                # Add to unique skills
                # -----------------------------------------

                unique_matching_skills.add(
                    normalized
                )


                # -----------------------------------------
                # Count frequency
                # -----------------------------------------

                if normalized not in matching_counts:

                    matching_counts[
                        normalized
                    ] = {

                        "skill":
                            skill_name,

                        "count":
                            0

                    }


                matching_counts[
                    normalized
                ]["count"] += 1


    # =====================================================
    # SORT MISSING SKILLS
    # =====================================================

    most_missing_skills = list(
        missing_counts.values()
    )


    most_missing_skills.sort(
        key=lambda x: x["count"],
        reverse=True
    )


    # =====================================================
    # SORT MATCHING SKILLS
    # =====================================================

    most_matched_skills = list(
        matching_counts.values()
    )


    most_matched_skills.sort(
        key=lambda x: x["count"],
        reverse=True
    )


    # =====================================================
    # UNIQUE SKILL TOTALS
    # =====================================================

    total_missing_skills = len(
        unique_missing_skills
    )


    total_matching_skills = len(
        unique_matching_skills
    )


    # =====================================================
    # AVERAGE SKILL GAP
    # =====================================================

    if total_analyses > 0:

        average_skill_gap = round(
            sum(
                missing_skills_per_analysis
            ) / total_analyses,
            2
        )

    else:

        average_skill_gap = 0


    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "success": True,


        # -------------------------------------------------
        # Total number of ATS analyses
        # -------------------------------------------------

        "total_analyses":
            total_analyses,


        # -------------------------------------------------
        # Unique missing skills
        # -------------------------------------------------

        "total_missing_skills":
            total_missing_skills,


        # -------------------------------------------------
        # Unique matching skills
        # -------------------------------------------------

        "total_matching_skills":
            total_matching_skills,


        # -------------------------------------------------
        # Average missing skills per analysis
        # -------------------------------------------------

        "average_skill_gap":
            average_skill_gap,


        # -------------------------------------------------
        # Top missing skills
        # -------------------------------------------------

        "most_missing_skills":
            most_missing_skills[:10],


        # -------------------------------------------------
        # Top matching skills
        # -------------------------------------------------

        "most_matched_skills":
            most_matched_skills[:10],


        # -------------------------------------------------
        # Compatibility with existing frontend
        # -------------------------------------------------

        "skills":
            most_missing_skills[:10]

    }