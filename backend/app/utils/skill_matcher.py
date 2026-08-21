import json
import os

import spacy
from spacy.matcher import PhraseMatcher


# -----------------------------
# Load spaCy Model
# -----------------------------

nlp = spacy.load("en_core_web_sm")


# -----------------------------
# Load Skills
# -----------------------------

skills_file = os.path.join(
    os.path.dirname(__file__),
    "../data/skills.json"
)

with open(skills_file, "r", encoding="utf-8") as file:
    skills = json.load(file)


# -----------------------------
# Create Phrase Matcher
# -----------------------------

matcher = PhraseMatcher(
    nlp.vocab,
    attr="LOWER"
)

patterns = [nlp.make_doc(skill) for skill in skills]

matcher.add("SKILLS", patterns)


# -----------------------------
# Extract Skills
# -----------------------------

def extract_skills(text):

    if not text:
        return []

    # Normalize text
    text = " ".join(text.split())

    doc = nlp(text)

    matches = matcher(doc)

    extracted = set()

    for _, start, end in matches:
        skill = doc[start:end].text.strip()

        # Normalize common variations
        skill = skill.replace("ReactJS", "React.js")
        skill = skill.replace("NodeJS", "Node.js")
        skill = skill.replace("ExpressJS", "Express.js")

        extracted.add(skill)

    skills = sorted(list(extracted))

    print("========== Skills Extracted ==========")
    print(skills)
    print("======================================")

    return skills