from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from dotenv import load_dotenv
import shutil
import os
import re
import pdfplumber

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Backend Running Successfully"}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    # Save file
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text
    extracted_text = ""
    if file.filename.endswith(".pdf"):
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                extracted_text += page.extract_text() or ""

    os.remove(file_path)

    text = extracted_text.lower()

    # ---------------- SKILLS ----------------
    skill_keywords = [
        "python", "react", "fastapi",
        "machine learning", "sql",
        "aws", "docker", "javascript"
    ]

    strengths = [s.title() for s in skill_keywords if s in text]
    missing_skills = [s.title() for s in skill_keywords if s not in text]

    # ---------------- ROLE DETECTION ----------------
    job_roles = {
        "AI Engineer": ["python", "machine learning", "tensorflow"],
        "Data Scientist": ["python", "sql", "machine learning"],
        "Backend Developer": ["python", "fastapi", "sql"],
        "Frontend Developer": ["react", "javascript", "css"],
        "Cloud Engineer": ["aws", "docker"]
    }

    predicted_roles = []

    for role, skills in job_roles.items():
        match_count = sum(1 for skill in skills if skill in text)
        if match_count >= 2:
            predicted_roles.append(role)

    # ---------------- SKILL GAP ----------------
    skill_gap = []

    if "AI Engineer" in predicted_roles:
        required = ["tensorflow", "pytorch", "mlops", "docker"]
    elif "Data Scientist" in predicted_roles:
        required = ["pandas", "numpy", "matplotlib", "statistics"]
    elif "Frontend Developer" in predicted_roles:
        required = ["react", "javascript", "css", "html"]
    elif "Backend Developer" in predicted_roles:
        required = ["fastapi", "docker", "api", "database"]
    elif "Cloud Engineer" in predicted_roles:
        required = ["aws", "docker", "kubernetes"]
    else:
        required = []

    for skill in required:
        if skill not in text:
            skill_gap.append(skill.title())

    # ---------------- SCORING ----------------
    numbers_found = re.findall(r"\d+", text)
    word_count = len(text.split())

    score = len(strengths) * 10

    if numbers_found:
        score += 10

    if word_count > 350:
        score += 10

    score = min(score, 100)

    # Skill match %
    skill_match_percentage = int((len(strengths) / len(skill_keywords)) * 100)

    # ---------------- SUGGESTIONS ----------------
    suggestions = []

    if not numbers_found:
        suggestions.append(
            "Quantify achievements (e.g., Improved performance by 40%)."
        )

    if word_count < 350:
        suggestions.append(
            "Expand project descriptions with tech + results."
        )

    if len(strengths) < 5:
        suggestions.append(
            "Add more high-demand skills like DevOps, Cloud, Data Engineering."
        )

    if "github" not in text:
        suggestions.append(
            "Add GitHub or portfolio links."
        )

    suggestions.append(
        "Use strong action verbs (Engineered, Led, Optimized)."
    )

    # ---------------- AI FEEDBACK ----------------
    ai_feedback = f"""
Strengths:
- Good exposure to {", ".join(strengths) if strengths else "core technologies"}.
- Resume length is {word_count} words.

Weaknesses:
- Missing skills: {", ".join(missing_skills[:3])}

Advice:
- Add measurable achievements
- Add GitHub links
- Improve modern tech stack
"""

    # ---------------- RESUME IMPROVER ----------------
    improved_resume = extracted_text
    improved_resume = improved_resume.replace("developed", "engineered")
    improved_resume = improved_resume.replace("made", "built")
    improved_resume = improved_resume.replace("worked on", "collaborated on")
    improved_resume = improved_resume.replace("created", "designed and developed")

    # ---------------- FINAL RESPONSE ----------------
    return {
        "filename": file.filename,
        "score": score,
        "word_count": word_count,
        "skill_match": skill_match_percentage,
        "strengths": strengths,
        "missing_skills": missing_skills,
        "predicted_roles": predicted_roles,
        "skill_gap": skill_gap,
        "suggestions": suggestions,
        "ai_feedback": ai_feedback,
        "improved_resume": improved_resume[:1500]
    }