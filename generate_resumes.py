from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER

def create_resume_rl(filename, name, location, email_phone, education, experience, projects, skills, activities):
    doc = SimpleDocTemplate(filename, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle('TitleStyle', parent=styles['Heading1'], alignment=TA_CENTER)
    subtitle_style = ParagraphStyle('SubtitleStyle', parent=styles['Normal'], alignment=TA_CENTER)
    # Using a safe color name instead of hex
    header_style = ParagraphStyle('HeaderStyle', parent=styles['Heading2'], textColor="black", spaceAfter=6, spaceBefore=12)
    item_style = ParagraphStyle('ItemStyle', parent=styles['Normal'], spaceBefore=3)
    bullet_style = ParagraphStyle('BulletStyle', parent=styles['Normal'], leftIndent=20, spaceBefore=2)

    story = []
    
    # Header
    story.append(Paragraph(f"<b>{name}</b>", title_style))
    story.append(Paragraph(location, subtitle_style))
    story.append(Paragraph(email_phone, subtitle_style))
    story.append(Spacer(1, 12))
    
    def add_section(title, content_list):
        story.append(Paragraph(title, header_style))
        for item in content_list:
            if isinstance(item, tuple):
                # item[0] is subtitle, item[1] is list of bullets
                story.append(Paragraph(f"<b>{item[0]}</b>", item_style))
                for bullet in item[1]:
                    story.append(Paragraph(f"- {bullet}", bullet_style)) # using simple dash instead of bullet char to avoid encoding issues
            else:
                story.append(Paragraph(item, item_style))

    add_section("EDUCATION", education)
    add_section("INTERNSHIP EXPERIENCE", experience)
    add_section("PROJECTS", projects)
    add_section("SKILLS", skills)
    add_section("EXTRA/CO-CURRICULAR ACTIVITIES", activities)
    add_section("DECLARATION", ["I hereby declare that all the above mentioned information is true and correct to the best of my knowledge."])
    
    doc.build(story)

# Resume 1
create_resume_rl(
    "E:/ResumeAnalyzer/Test_Resume_Legitimate.pdf",
    "ALEX JOHNSON",
    "Tech Park, San Francisco, CA",
    "alex.j@example.com | +1 555-0100",
    [
        ("Bachelor of Science in Computer Science, State University", ["May 2022"])
    ],
    [
        ("Software Engineering Intern, DevCorp, San Francisco", [
            "Assisted in developing frontend components using React and HTML.",
            "Wrote unit tests for Python backend APIs using FastAPI.",
            "Collaborated on designing RESTful services, using CSS for styling the admin dashboard."
        ])
    ],
    [
        ("Portfolio Website", [
            "Created a personal portfolio using React, CSS, and some JavaScript.",
            "Hosted securely and integrated with a simple Node.js mailer."
        ])
    ],
    [
        ("Technical", ["Python, React, JavaScript, FastAPI, HTML, Node.js, CSS"]),
        ("Professional", ["Effective Analytical Skills", "Ability to identify and solve problems"])
    ],
    [
        "Attended Global Hackathon 2021",
        "Participated in University Coding Fest"
    ]
)

# Resume 2
create_resume_rl(
    "E:/ResumeAnalyzer/Test_Resume_Exaggerated.pdf",
    "VIKAS SHARMA",
    "Lajpat Nagar, Agra, 281121",
    "vikas.sharma@example.ac.in | +91 9999999999",
    [
        ("Bachelor of Arts in English, GLA University, Mathura", ["May 2019"]),
        ("Intermediate, RPS School, Agra", ["May 2016"])
    ],
    [
        ("Times of India, Agra - Reader/Associate Editor", [
            "Review poetry submissions online with a team of 7 readers.",
            "Applied Machine Learning to auto-filter best poetry.",
            "Foster collaboration using Deep Learning models to predict trends."
        ])
    ],
    [
        ("Oil Refinery Project", [
            "Implemented Computer Vision to track campers during activities.",
            "Deployed models using Kubernetes, Docker, and AWS.",
            "Utilized Generative AI and LLM for generating end-of-summer awards."
        ])
    ],
    [
        ("Technical", ["Presented to 100+ conference participants about Generative AI.", "Machine Learning, Deep Learning, Computer Vision, Generative AI, LLM, Kubernetes, AWS, TensorFlow, PyTorch"]),
        ("Professional", ["Effective Analytical Skills", "Visionary Leader"])
    ],
    [
        "Coordinated SRIJAN (Cultural Fest, GLA)",
        "Participated in MAITREE (Sports Fest, GLA)"
    ]
)
print("PDF Resumes Generated Successfully!")
