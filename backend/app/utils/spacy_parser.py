import spacy
import re

nlp = spacy.load("en_core_web_sm")


def extract_spacy_data(text):

    doc = nlp(text)

    data = {
        "name": "",
        "organizations": [],
        "universities": [],
        "location": "",
    }

    # -------------------------
    # Name
    # -------------------------
    lines = [line.strip() for line in text.split("\n") if line.strip()]

    if lines:
        data["name"] = lines[0]

    # -------------------------
    # Location
    # -------------------------
    if len(lines) > 1:
        second = lines[1]

        if len(second) < 80:
            data["location"] = second

    # -------------------------
    # Organizations
    # -------------------------
    organizations = set()

    for ent in doc.ents:
        if ent.label_ == "ORG":

            value = ent.text.strip()

            if len(value) > 2:
                organizations.add(value)

    data["organizations"] = sorted(list(organizations))

    # -------------------------
    # Universities
    # -------------------------
    universities = set()

    patterns = [
        r".*College.*",
        r".*University.*",
        r".*Institute.*",
        r".*School.*",
        r".*Academy.*"
    ]

    for line in lines:

        for pattern in patterns:

            if re.search(pattern, line, re.IGNORECASE):
                universities.add(line.strip())

    data["universities"] = sorted(list(universities))

    return data