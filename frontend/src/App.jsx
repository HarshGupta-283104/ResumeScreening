import React, { useState } from 'react';
import { UploadCloud, Github, AlertTriangle, CheckCircle, XCircle, Search, FileText } from 'lucide-react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [githubUser, setGithubUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a resume first.");
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    if (githubUser) {
      formData.append("github_username", githubUser);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/analyze", {
        method: "POST",
        body: formData,
      });
      

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Error analyzing resume");
      }
      
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 70) return "#3fb950"; // Green
    if (score >= 40) return "#d29922"; // Yellow
    return "#f85149"; // Red
  };

  return (
    <div className="app-container">
      <header className="hero">
        <h1>Resume Truthfulness Analyzer</h1>
        <p className="subtitle">AI-Driven Skill Depth & Evidence Validation</p>
      </header>

      {!result && (
        <section className="glass-panel upload-section">
          <label className={`file-input-wrapper ${file ? 'active' : ''}`}>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <div className="file-label">
              <UploadCloud size={48} color={file ? "#58a6ff" : "#8b949e"} />
              <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                {file ? file.name : "Click or Drag & Drop Resume (PDF)"}
              </div>
              <div style={{ color: "#8b949e", fontSize: "0.9rem" }}>
                Max file size: 5MB
              </div>
            </div>
          </label>

          <div className="github-input-group">
            <label htmlFor="github"><Github size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'6px'}}/> GitHub Username (Optional)</label>
            <input 
              id="github" 
              type="text" 
              placeholder="e.g. octocat" 
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)} 
            />
          </div>

          {error && <div style={{color: "#f85149", width: "100%", textAlign: "left"}}><AlertTriangle size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> {error}</div>}

          <button 
            className="analyze-btn" 
            onClick={handleAnalyze}
            disabled={loading || !file}
          >
            {loading ? <><div className="spinner"></div> Analyzing Evidence...</> : <><Search size={20} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'8px'}}/> Verify Claims</>}
          </button>
        </section>
      )}

      {result && (
        <section className="results-section">
          <button onClick={() => setResult(null)} style={{marginBottom: "2rem"}}>
            &larr; Analyze Another Resume
          </button>
          
          <div className="glass-panel score-card" style={{ borderColor: scoreColor(result.report.overall_score) }}>
            <div>
              <h2 style={{marginTop: 0, fontSize: "2rem"}}>Confidence Score</h2>
              <p style={{color: "#8b949e", maxWidth: "600px", margin: 0}}>
                This score represents the verifiable truthfulness of the technical skills claimed in the resume based on provided public evidence.
              </p>
              <div style={{marginTop: "1rem", color: "#8b949e"}}>
                <strong><FileText size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> Extractor Engine:</strong> {result.extractor}
              </div>
            </div>
            <div className="score-circle" style={{ color: scoreColor(result.report.overall_score) }}>
              {result.report.overall_score}%
            </div>
          </div>

          <div className="grid-2">
            <div className="list-card">
              <h3 className="verified"><CheckCircle size={20} /> Verified Skills ({result.report.verified_skills.length})</h3>
              {result.report.verified_skills.length > 0 ? (
                <div>
                  {result.report.verified_skills.map((item, idx) => (
                    <span key={idx} className="skill-tag" title={`Found ${item.evidence_count} times in evidence`}>
                      {item.skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{color: "#8b949e"}}>No skills could be verified.</p>
              )}
            </div>

            <div className="list-card">
              <h3 className="unverified"><XCircle size={20} /> Unverified / Exaggerated ({result.report.unverified_skills.length})</h3>
              {result.report.unverified_skills.length > 0 ? (
                <div>
                  {result.report.unverified_skills.map((item, idx) => (
                    <span key={idx} className="skill-tag" style={{borderColor: "rgba(248, 81, 73, 0.4)", color: "#ff7b72"}}>
                      {item.skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{color: "#8b949e"}}>All extracted skills were verified!</p>
              )}
            </div>
          </div>

          {result.report.risk_indicators.length > 0 && (
            <div className="glass-panel list-card risk-indicators">
              <h3 style={{color: "#d29922", borderColor: "rgba(210, 153, 34, 0.3)"}}>
                <AlertTriangle size={20} /> Recruiter Summary & Risks
              </h3>
              <ul>
                {result.report.risk_indicators.map((risk, idx) => (
                  <li key={idx} style={{color: "#e3b341"}}>{risk}</li>
                ))}
              </ul>
              {result.evidence.length > 0 && (
                <div style={{marginTop: "1.5rem"}}>
                  <strong>Evidence Sources Found:</strong> {result.evidence.length} Repositories
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default App;
