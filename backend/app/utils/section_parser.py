import re

SECTION_HEADERS = {
    "summary": [
        "summary",
        "profile",
        "professional summary",
        "objective",
        "career objective",
        "about me"
    ],

    "education": [
        "education",
        "academic qualification",
        "academic details",
        "qualification"
    ],

    "skills": [
        "skills",
        "technical skills",
        "key skills",
        "technical expertise"
    ],

    "experience": [
        "experience",
        "work experience",
        "professional experience",
        "employment",
        "internship",
        "internships"
    ],

    "projects": [
        "projects",
        "project",
        "academic projects",
        "personal projects"
    ],

    "certifications": [
        "certification",
        "certifications",
        "certificate",
        "certificates",
        "licenses",
        "license"
    ],

    "links": [
        "web links",
        "links",
        "profiles",
        "social links"
    ],

    "achievements": [
        "achievements",
        "achievement",
        "awards"
    ],

    "languages": [
        "languages",
        "language"
    ],

    "interests": [
        "interests",
        "hobbies"
    ]
}


def extract_sections(text):

    lines = [line.strip() for line in text.split("\n")]

    sections = {
        "header": "",
        "summary": "",
        "education": "",
        "skills": "",
        "experience": "",
        "projects": "",
        "certifications": "",
        "achievements": "",
        "links": "",
        "languages": "",
        "interests": ""
    }

    current_section = "header"

    for line in lines:

        if not line:
            continue

        clean = re.sub(r"[:\-]", "", line.lower()).strip()

        found = False

        for key, headers in SECTION_HEADERS.items():

            if clean in headers:

                current_section = key
                found = True
                break

        if found:
            continue

        sections[current_section] += line + "\n"

    for key in sections:
        sections[key] = sections[key].strip()

    return sections