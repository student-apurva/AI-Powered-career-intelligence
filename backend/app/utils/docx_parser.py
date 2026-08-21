from docx import Document

def extract_docx_text(path):

    doc = Document(path)

    text = []

    for para in doc.paragraphs:
        text.append(para.text)

    return "\n".join(text)