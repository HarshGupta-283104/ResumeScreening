import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER

def create_resume_rl(filename, name, location, email_phone, education, experience, projects, skills, activities):
    doc = SimpleDocTemplate(filename, pagesize=letter)
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle('TitleStyle', parent=styles['Heading1'], alignment=TA_CENTER)
    subtitle_style = ParagraphStyle('SubtitleStyle', parent=styles['Normal'], alignment=TA_CENTER)
    header_style = ParagraphStyle('HeaderStyle', parent=styles['Heading2'], textColor="black", spaceAfter=6, spaceBefore=12)
    item_style = ParagraphStyle('ItemStyle', parent=styles['Normal'], spaceBefore=3)
    bullet_style = ParagraphStyle('BulletStyle', parent=styles['Normal'], leftIndent=20, spaceBefore=2)

    story = []
    
    story.append(Paragraph(f"<b>{name}</b>", title_style))
    story.append(Paragraph(location, subtitle_style))
    story.append(Paragraph(email_phone, subtitle_style))
    story.append(Spacer(1, 12))
    
    def add_section(title, content_list):
        story.append(Paragraph(title, header_style))
        for item in content_list:
            if isinstance(item, tuple):
                story.append(Paragraph(f"<b>{item[0]}</b>", item_style))
                for bullet in item[1]:
                    story.append(Paragraph(f"- {bullet}", bullet_style))
            else:
                story.append(Paragraph(item, item_style))

    add_section("EDUCATION", education)
    add_section("INTERNSHIP EXPERIENCE", experience)
    add_section("PROJECTS", projects)
    add_section("SKILLS", skills)
    add_section("EXTRA/CO-CURRICULAR ACTIVITIES", activities)
    add_section("DECLARATION", ["I hereby declare that all the above mentioned information is true and correct to the best of my knowledge."])
    
    doc.build(story)

# Create Output Directory
out_dir = "E:/ResumeAnalyzer/test_resumes"
os.makedirs(out_dir, exist_ok=True)

# 10 Great Score Resumes (Skills likely to be found on GitHub profiles like 'octocat' - simple, specific foundational skills)
great_skills_sets = [
    ["HTML", "CSS"],
    ["JavaScript", "HTML"],
    ["Python"],
    ["CSS", "JavaScript", "HTML"],
    ["Ruby", "HTML", "CSS"],
    ["Java", "HTML"],
    ["C++", "Python"],
    ["JavaScript", "Node.js"],
    ["HTML", "CSS", "Ruby"],
    ["Python", "HTML", "CSS"]
]

for i in range(10):
    create_resume_rl(
        f"{out_dir}/Great_Resume_{i+1}.pdf",
        f"GREAT CANDIDATE {i+1}",
        "San Francisco, CA",
        f"great{i+1}@example.com | +1 555-0100",
        [("BS Computer Science", ["May 2022"])],
        [("Software Engineer Intern", ["Developed web pages.", "Fixed bugs in existing repositories."])],
        [("Personal Website", [f"Used {', '.join(great_skills_sets[i])} to build out the site."])],
        [("Technical", great_skills_sets[i])],
        ["Hackathon Winner"]
    )

# 5 Average Score Resumes (A mix of verifiable foundational skills and unverified buzzwords/frameworks)
average_skills_sets = [
    ["HTML", "CSS", "Kubernetes", "AWS"],
    ["Python", "JavaScript", "Generative AI", "LLM"],
    ["React", "Node.js", "Docker", "Machine Learning"],
    ["Java", "C++", "Blockchain", "Quantum Computing"],
    ["Ruby", "HTML", "CSS", "Deep Learning", "TensorFlow"]
]

for i in range(5):
    create_resume_rl(
        f"{out_dir}/Average_Resume_{i+1}.pdf",
        f"AVERAGE CANDIDATE {i+1}",
        "New York, NY",
        f"average{i+1}@example.com | +1 555-0200",
        [("MS Computer Science", ["May 2023"])],
        [("Data Scientist Intern", ["Worked on various data pipelines.", "Deployed models to production."])],
        [("AI Project", [f"Utilized {', '.join(average_skills_sets[i])} for predictive modeling."])],
        [("Technical", average_skills_sets[i])],
        ["Coding Club President"]
    )

# 5 Bad Score Resumes (Keyword stuffed with advanced jargon with no basic verifiable skills)
bad_skills_sets = [
    ["Generative AI", "LLM", "Prompt Engineering", "Machine Learning", "Deep Learning"],
    ["Kubernetes", "Docker", "AWS", "GCP", "Azure", "CI/CD"],
    ["Blockchain", "Web3", "Smart Contracts", "DeFi"],
    ["TensorFlow", "PyTorch", "Computer Vision", "NLP"],
    ["Microservices", "Serverless", "Kafka", "RabbitMQ", "NoSQL", "MongoDB"]
]

for i in range(5):
    create_resume_rl(
        f"{out_dir}/Bad_Resume_{i+1}.pdf",
        f"BAD CANDIDATE {i+1}",
        "Austin, TX",
        f"bad{i+1}@example.com | +1 555-0300",
        [("BA Business Administration", ["May 2021"])],
        [("Product Manager Intern", ["Oversaw agile development.", "Led team of 5 engineers."])],
        [("Enterprise Architecture", [f"Architected solutions using {', '.join(bad_skills_sets[i])}."])],
        [("Technical", bad_skills_sets[i])],
        ["Business Fraternity Member"]
    )

print("20 Test Resumes Generated Successfully in E:/ResumeAnalyzer/test_resumes/")
