from datetime import datetime

from app.database import activity_collection


async def log_activity(
    action,
    description="",
    user_id=None,
    user_name="",
    email=""
):

    activity = {
        "user_id": str(user_id) if user_id else None,
        "user_name": user_name,
        "email": email,
        "action": action,
        "description": description,
        "created_at": datetime.utcnow()
    }

    result = await activity_collection.insert_one(
        activity
    )

    print(
        "ACTIVITY LOGGED:",
        result.inserted_id,
        action
    )

    return result.inserted_id