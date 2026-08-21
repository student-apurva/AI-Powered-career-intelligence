import asyncio

from app.database import users_collection
from app.auth import hash_password


async def create_admin():

    email = "admin@example.com"
    password = "Admin@123"

    existing = await users_collection.find_one({
        "email": email
    })

    if existing:
        print("User already exists:")
        print(existing)
        return

    admin = {
        "fullName": "System Admin",
        "email": email,
        "mobile": "",
        "password": hash_password(password),
        "role": "Admin"
    }

    result = await users_collection.insert_one(admin)

    print("Admin created successfully")
    print("ID:", result.inserted_id)
    print("Email:", email)
    print("Password:", password)


asyncio.run(create_admin())