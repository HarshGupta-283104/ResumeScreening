import re

COMMON_SKILLS = [
    "Python", "JavaScript", "React", "Node.js", "FastAPI", "Docker", "Kubernetes",
    "Machine Learning", "ML", "Deep Learning", "SQL", "NoSQL", "MongoDB", "PostgreSQL",
    "AWS", "GCP", "Azure", "CI/CD", "Git", "C++", "Java", "Go", "Rust", "NLP",
    "Computer Vision", "Data Analysis", "Pandas", "NumPy", "TensorFlow", "PyTorch",
    "OpenAI", "Generative AI", "LLM", "Vector DB", "ChromaDB", "Qdrant", "HTML", "CSS"
]

def extract_skills_from_resume(text: str) -> list:
    """
    Extract technical skills from resume text.
    Uses regex keyword matching mapped against a known taxonomy.
    """
    extracted = []
    text_lower = " " + text.lower().replace("\n", " ") + " "
    
    for skill in COMMON_SKILLS:
        pattern = r'(?<!\w)' + re.escape(skill.lower()) + r'(?!\w)'
        if re.search(pattern, text_lower):
            extracted.append(skill)
            
    # Normalize Machine Learning vs ML if needed
    if "ML" in extracted and "Machine Learning" not in extracted:
        extracted.append("Machine Learning")
    
    return list(set(extracted))
