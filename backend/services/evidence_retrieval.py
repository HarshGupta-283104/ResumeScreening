import requests

def get_github_evidence(username: str) -> list:
    """
    Retrieve repositories and their descriptions/languages from GitHub.
    Uses public GitHub APIs. Note: Unauthenticated requests have a rate limit.
    """
    
    # DEMO MODE
    if username.lower() in ["alex.j", "alex_johnson", "alex"]:
        return [
            {"name": "react-portfolio", "description": "My React portfolio using HTML/CSS/JS", "language": "JavaScript", "url": "", "stars": 5},
            {"name": "fastapi-backend", "description": "Python FastAPI backend for my services", "language": "Python", "url": "", "stars": 12},
            {"name": "node-mailer", "description": "Simple node.js mailer backend", "language": "JavaScript", "url": "", "stars": 1}
        ]
        
    url = f"https://api.github.com/users/{username}/repos?per_page=100"
    headers = {"Accept": "application/vnd.github.v3+json"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            repos = response.json()
            evidence = []
            for r in repos:
                evidence.append({
                    "name": r.get("name"),
                    "description": r.get("description", ""),
                    "language": r.get("language", ""),
                    "url": r.get("html_url", ""),
                    "stars": r.get("stargazers_count", 0)
                })
            return evidence
        return []
    except Exception:
        return []
