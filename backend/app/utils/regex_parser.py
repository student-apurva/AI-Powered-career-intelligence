import re


def extract_regex_data(text):

    data = {
        "email": "",
        "phone": "",
        "linkedin": "",
        "github": "",
        "portfolio": "",
        "years": []
    }

    # ------------------------
    # Email
    # ------------------------
    email = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )

    if email:
        data["email"] = email.group()

    # ------------------------
    # Phone Number
    # ------------------------
    phone_patterns = [
        r"(?:\+91[\-\s]?)?[6-9]\d{9}",
        r"(?:\+91[\-\s]?)?[6-9]\d{4}[\-\s]?\d{5}"
    ]

    for pattern in phone_patterns:
        match = re.search(pattern, text)

        if match:
            phone = re.sub(r"\D", "", match.group())

            if phone.startswith("91") and len(phone) > 10:
                phone = phone[-10:]

            data["phone"] = phone
            break

    # ------------------------
    # LinkedIn
    # ------------------------
    linkedin = re.search(
        r"https?://(?:www\.)?linkedin\.com/[^\s]+",
        text,
        re.IGNORECASE
    )

    if linkedin:
        data["linkedin"] = linkedin.group()

    # ------------------------
    # GitHub
    # ------------------------
    github = re.search(
        r"https?://(?:www\.)?github\.com/[^\s]+",
        text,
        re.IGNORECASE
    )

    if github:
        data["github"] = github.group()

    # ------------------------
    # Portfolio
    # ------------------------
    urls = re.findall(
        r"https?://[^\s]+",
        text
    )

    for url in urls:

        if (
            "linkedin" not in url.lower()
            and
            "github" not in url.lower()
        ):
            data["portfolio"] = url
            break

    # ------------------------
    # Years
    # ------------------------
    years = set()

    # 2021, 2025
    for year in re.findall(r"\b(19\d{2}|20\d{2})\b", text):
        years.add(year)

    # 2021-22 / 2021-2025
    for year in re.findall(
        r"\b(20\d{2}\s*[-–]\s*(?:20\d{2}|\d{2}))\b",
        text
    ):
        years.add(year)

    # July 2025
    months = (
        "January|February|March|April|May|June|July|August|"
        "September|October|November|December"
    )

    pattern = rf"\b(?:{months})\s+\d{{4}}\b"

    for value in re.findall(pattern, text, re.IGNORECASE):
        years.add(value)

    data["years"] = sorted(years)

    return data