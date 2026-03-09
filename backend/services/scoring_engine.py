def calculate_confidence_score(extracted_skills: list, evidence_data: list) -> dict:
    """
    Simulates finding occurrences of skills in gathered evidence and scoring based on coverage.
    """
    report = {
        "overall_score": 0,
        "verified_skills": [],
        "unverified_skills": [],
        "risk_indicators": []
    }
    
    if not extracted_skills:
        report["risk_indicators"].append("No technical skills found in resume.")
        return report
        
    if not evidence_data:
        report["unverified_skills"] = [{"skill": s, "confidence": "Low", "status": "No external evidence (GitHub missing or empty)"} for s in extracted_skills]
        report["risk_indicators"].append("No external evidence provided or found.")
        return report

    # Aggregate evidence texts
    all_evidence_text = ""
    for ev in evidence_data:
        desc = ev.get("description") or ""
        lang = ev.get("language") or ""
        all_evidence_text += f" {desc} {lang} {ev.get('name')}".lower()
        
    verified = []
    unverified = []
    
    for skill in extracted_skills:
        # A simple check (in real scenario - Sentence Embedding match via Vector DB)
        if skill.lower() in all_evidence_text:
            count = all_evidence_text.count(skill.lower())
            verified.append({
                "skill": skill,
                "confidence": "High" if count > 2 else "Medium",
                "evidence_count": count,
                "status": "Verified"
            })
        else:
            unverified.append({
                "skill": skill,
                "confidence": "Low",
                "status": "Hallucinated/Exaggerated"
            })
            
    report["verified_skills"] = verified
    report["unverified_skills"] = unverified
    
    total_skills = len(extracted_skills)
    verified_count = len(verified)
    
    score = int((verified_count / total_skills) * 100) if total_skills > 0 else 0
    report["overall_score"] = score
    
    if score < 40:
        report["risk_indicators"].append("High likelihood of keyword stuffing.")
    elif score < 70:
        report["risk_indicators"].append("Some claims lack verifiable evidence. Proceed with technical interview.")
    else:
        report["risk_indicators"].append("Candidate claims strongly correlate with public evidence.")

    return report
