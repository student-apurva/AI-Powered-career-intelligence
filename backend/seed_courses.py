import asyncio

from app.database import (
    courses_collection
)


# ==========================================
# Initial Course Dataset
# ==========================================

COURSES = [

    # ======================================
    # JAVA
    # ======================================

    {
        "title": "Java Programming",
        "provider": "NPTEL",
        "category": "Software Development",
        "level": "Beginner",

        "skills": [
            "Java",
            "OOP",
            "Data Structures"
        ],

        "duration": "Self Paced",

        "price_type": "Free",

        "course_url":
            "https://nptel.ac.in/courses",

        "description":
            "Learn Java programming, object-oriented "
            "concepts and programming fundamentals."
    },


    # ======================================
    # SPRING BOOT
    # ======================================

    {
        "title": "Spring Boot Development",
        "provider": "Udemy",
        "category": "Backend Development",
        "level": "Intermediate",

        "skills": [
            "Java",
            "Spring Boot",
            "REST API",
            "Spring"
        ],

        "duration": "Self Paced",

        "price_type": "Paid",

        "course_url":
            "https://www.udemy.com/courses/search/?q=spring%20boot",

        "description":
            "Learn Spring Boot and build REST APIs "
            "using Java."
    },


    # ======================================
    # PYTHON
    # ======================================

    {
        "title": "Python Programming",
        "provider": "Coursera",
        "category": "Programming",
        "level": "Beginner",

        "skills": [
            "Python",
            "Programming",
            "Problem Solving"
        ],

        "duration": "Self Paced",

        "price_type": "Free/Paid",

        "course_url":
            "https://www.coursera.org/search?query=python",

        "description":
            "Learn Python programming fundamentals "
            "and problem solving."
    },


    # ======================================
    # REACT
    # ======================================

    {
        "title": "React Development",
        "provider": "freeCodeCamp",
        "category": "Frontend Development",
        "level": "Intermediate",

        "skills": [
            "React",
            "JavaScript",
            "HTML",
            "CSS"
        ],

        "duration": "Self Paced",

        "price_type": "Free",

        "course_url":
            "https://www.freecodecamp.org/learn/",

        "description":
            "Develop modern frontend applications "
            "using React and JavaScript."
    },


    # ======================================
    # NODE.JS
    # ======================================

    {
        "title": "Node.js Backend Development",
        "provider": "Udemy",
        "category": "Backend Development",
        "level": "Intermediate",

        "skills": [
            "Node.js",
            "Express.js",
            "REST API",
            "JavaScript"
        ],

        "duration": "Self Paced",

        "price_type": "Paid",

        "course_url":
            "https://www.udemy.com/courses/search/?q=nodejs",

        "description":
            "Learn backend development using "
            "Node.js and Express."
    },


    # ======================================
    # SQL
    # ======================================

    {
        "title": "SQL and Database Fundamentals",
        "provider": "Coursera",
        "category": "Database",
        "level": "Beginner",

        "skills": [
            "SQL",
            "Database",
            "MySQL"
        ],

        "duration": "Self Paced",

        "price_type": "Free/Paid",

        "course_url":
            "https://www.coursera.org/search?query=sql",

        "description":
            "Learn SQL queries, relational databases "
            "and database fundamentals."
    },


    # ======================================
    # MONGODB
    # ======================================

    {
        "title": "MongoDB Fundamentals",
        "provider": "MongoDB University",
        "category": "Database",
        "level": "Beginner",

        "skills": [
            "MongoDB",
            "NoSQL",
            "Database"
        ],

        "duration": "Self Paced",

        "price_type": "Free",

        "course_url":
            "https://learn.mongodb.com/",

        "description":
            "Learn MongoDB fundamentals, document "
            "databases and data modeling."
    },


    # ======================================
    # GIT
    # ======================================

    {
        "title": "Git and GitHub",
        "provider": "Coursera",
        "category": "Development Tools",
        "level": "Beginner",

        "skills": [
            "Git",
            "GitHub",
            "Version Control"
        ],

        "duration": "Self Paced",

        "price_type": "Free/Paid",

        "course_url":
            "https://www.coursera.org/search?query=git%20github",

        "description":
            "Learn version control using Git "
            "and collaborative development with GitHub."
    },


    # ======================================
    # DOCKER
    # ======================================

    {
        "title": "Docker Fundamentals",
        "provider": "Coursera",
        "category": "DevOps",
        "level": "Intermediate",

        "skills": [
            "Docker",
            "Containers",
            "DevOps"
        ],

        "duration": "Self Paced",

        "price_type": "Free/Paid",

        "course_url":
            "https://www.coursera.org/search?query=docker",

        "description":
            "Learn containers, Docker images and "
            "application deployment."
    },


    # ======================================
    # AWS
    # ======================================

    {
        "title": "AWS Cloud Fundamentals",
        "provider": "AWS Skill Builder",
        "category": "Cloud Computing",
        "level": "Beginner",

        "skills": [
            "AWS",
            "Cloud Computing",
            "Cloud"
        ],

        "duration": "Self Paced",

        "price_type": "Free/Paid",

        "course_url":
            "https://skillbuilder.aws/",

        "description":
            "Learn AWS cloud concepts, services "
            "and cloud fundamentals."
    },


    # ======================================
    # MACHINE LEARNING
    # ======================================

    {
        "title": "Machine Learning Fundamentals",
        "provider": "Coursera",
        "category": "Artificial Intelligence",
        "level": "Intermediate",

        "skills": [
            "Machine Learning",
            "Python",
            "Scikit-learn"
        ],

        "duration": "Self Paced",

        "price_type": "Free/Paid",

        "course_url":
            "https://www.coursera.org/search?query=machine%20learning",

        "description":
            "Learn machine learning concepts and "
            "build predictive models using Python."
    },


    # ======================================
    # DATA ANALYTICS
    # ======================================

    {
        "title": "Data Analytics Fundamentals",
        "provider": "Coursera",
        "category": "Data Analytics",
        "level": "Beginner",

        "skills": [
            "Data Analytics",
            "SQL",
            "Python",
            "Data Visualization"
        ],

        "duration": "Self Paced",

        "price_type": "Free/Paid",

        "course_url":
            "https://www.coursera.org/search?query=data%20analytics",

        "description":
            "Learn data analysis, SQL, visualization "
            "and analytical techniques."
    },


    # ======================================
    # HTML / CSS / JAVASCRIPT
    # ======================================

    {
        "title": "Responsive Web Development",
        "provider": "freeCodeCamp",
        "category": "Frontend Development",
        "level": "Beginner",

        "skills": [
            "HTML",
            "CSS",
            "Responsive Design"
        ],

        "duration": "Self Paced",

        "price_type": "Free",

        "course_url":
            "https://www.freecodecamp.org/learn/",

        "description":
            "Learn responsive website development "
            "using HTML and CSS."
    },


    {
        "title": "JavaScript Development",
        "provider": "freeCodeCamp",
        "category": "Frontend Development",
        "level": "Beginner",

        "skills": [
            "JavaScript",
            "ES6",
            "Programming"
        ],

        "duration": "Self Paced",

        "price_type": "Free",

        "course_url":
            "https://www.freecodecamp.org/learn/",

        "description":
            "Learn JavaScript fundamentals and "
            "modern JavaScript programming."
    },


    # ======================================
    # REST API
    # ======================================

    {
        "title": "REST API Development",
        "provider": "Udemy",
        "category": "Backend Development",
        "level": "Intermediate",

        "skills": [
            "REST API",
            "Backend Development",
            "Postman"
        ],

        "duration": "Self Paced",

        "price_type": "Paid",

        "course_url":
            "https://www.udemy.com/courses/search/?q=rest%20api",

        "description":
            "Learn REST API design, development "
            "and API testing."
    },


    # ======================================
    # DATA STRUCTURES
    # ======================================

    {
        "title": "Data Structures and Algorithms",
        "provider": "NPTEL",
        "category": "Computer Science",
        "level": "Intermediate",

        "skills": [
            "Data Structures",
            "Algorithms",
            "Problem Solving"
        ],

        "duration": "Self Paced",

        "price_type": "Free",

        "course_url":
            "https://nptel.ac.in/courses",

        "description":
            "Learn fundamental data structures, "
            "algorithms and problem-solving techniques."
    },
]


# ==========================================
# Seed Courses
# ==========================================

async def seed_courses():

    print()
    print("======================================")
    print("COURSE DATASET SEED")
    print("======================================")


    # --------------------------------------
    # Prevent duplicate seed records
    # --------------------------------------

    await courses_collection.delete_many({})


    # --------------------------------------
    # Insert Courses
    # --------------------------------------

    result = await courses_collection.insert_many(
        COURSES
    )


    print(
        f"{len(result.inserted_ids)} "
        "courses inserted successfully."
    )


    print("======================================")


# ==========================================
# Run
# ==========================================

if __name__ == "__main__":

    asyncio.run(
        seed_courses()
    )