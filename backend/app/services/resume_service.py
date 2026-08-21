import os

from app.utils.pdf_parser import extract_pdf_text
from app.utils.docx_parser import extract_docx_text
from app.utils.skill_matcher import extract_skills
from app.utils.regex_parser import extract_regex_data
from app.utils.spacy_parser import extract_spacy_data
from app.utils.section_parser import extract_sections


class ResumeParser:

    def __init__(self, filepath):

        self.filepath = filepath

        self.text = ""

    # -----------------------------
    # Extract Resume Text
    # -----------------------------

    def extract_text(self):

        extension = os.path.splitext(self.filepath)[1].lower()

        if extension == ".pdf":

            self.text = extract_pdf_text(self.filepath)

        elif extension == ".docx":

            self.text = extract_docx_text(self.filepath)

        else:

            raise Exception("Unsupported File Type")

        return self.text

    # -----------------------------
    # Parse Resume
    # -----------------------------

    def parse(self):

        if self.text == "":
            self.extract_text()
            print("========== EXTRACTED TEXT ==========")
            print(self.text[:1000])
            print("===================================")

        regex_data = extract_regex_data(self.text)
        spacy_data = extract_spacy_data(self.text)
        sections = extract_sections(self.text)

        skills = extract_skills(sections.get("skills", ""))

        result = {

        "resume_text": self.text,

        "personal_information": {

            "name": spacy_data.get("name"),
            "email": regex_data.get("email"),
            "phone": regex_data.get("phone"),
            "linkedin": regex_data.get("linkedin"),
            "github": regex_data.get("github"),
            "portfolio": regex_data.get("portfolio"),
            "location": spacy_data.get("location")

        },

        "skills": skills,

        "organizations": spacy_data.get("organizations"),

        "universities": spacy_data.get("universities"),

        "years": regex_data.get("years"),

        "sections": sections

    }

        return result