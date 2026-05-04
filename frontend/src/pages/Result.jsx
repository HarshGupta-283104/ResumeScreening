import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Download, RefreshCcw, TrendingUp, AlertTriangle, Lightbulb, Activity } from 'lucide-react';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state || !location.state.evaluation) {
    return <Navigate to="/" />;
  }

  const { evaluation } = location.state;
  const { score, feedback } = evaluation;

  const scoreColor = score >= 8 ? '#10b981' : score >= 5 ? '#f59e0b' : '#ef4444';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleDownload = () => {
    // Basic implementation for demonstration
    const content = `
Resume Screening Interview Report
Score: ${score}/10

Interview Performance:
${feedback.interviewPerformance}

Strengths:
${feedback.strengths.map(s => '- ' + s).join('\n')}

Weaknesses:
${feedback.weaknesses.map(s => '- ' + s).join('\n')}

Suggestions:
${feedback.improvementSuggestions.map(s => '- ' + s).join('\n')}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Interview_Report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-10"
        >
          <h1 className="text-3xl font-bold text-white">Interview Results</h1>
          <div className="flex gap-4">
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" /> Download Report
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCcw className="w-4 h-4" /> Retake Interview
            </button>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Score Card */}
          <motion.div variants={itemVariants} className="glass-panel p-8 flex flex-col items-center justify-center col-span-1">
            <h2 className="text-xl font-medium text-white/80 mb-6">Overall Score</h2>
            <div className="w-48 h-48 mb-4">
              <CircularProgressbar 
                value={score * 10} 
                text={`${score}/10`} 
                styles={buildStyles({
                  pathColor: scoreColor,
                  textColor: '#fff',
                  trailColor: 'rgba(255,255,255,0.1)',
                  textSize: '18px'
                })}
              />
            </div>
            <p className="text-center text-white/60 text-sm mt-4">
              {score >= 8 ? 'Excellent performance! You are well prepared.' : score >= 5 ? 'Good effort! Some areas need review.' : 'Keep practicing! Review your weaknesses.'}
            </p>
          </motion.div>

          {/* Performance Summary */}
          <motion.div variants={itemVariants} className="glass-panel p-8 col-span-1 md:col-span-2 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-medium text-white/90">Performance Summary</h2>
            </div>
            <p className="text-white/70 leading-relaxed text-lg flex-1">
              {feedback.interviewPerformance}
            </p>
          </motion.div>

          {/* Strengths */}
          <motion.div variants={itemVariants} className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
              <h3 className="font-medium text-lg">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {feedback.strengths.map((item, i) => (
                <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Weaknesses */}
          <motion.div variants={itemVariants} className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-medium text-lg">Areas to Improve</h3>
            </div>
            <ul className="space-y-3">
              {feedback.weaknesses.map((item, i) => (
                <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Suggestions */}
          <motion.div variants={itemVariants} className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4 text-amber-400">
              <Lightbulb className="w-5 h-5" />
              <h3 className="font-medium text-lg">Actionable Suggestions</h3>
            </div>
            <ul className="space-y-3">
              {feedback.improvementSuggestions.map((item, i) => (
                <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default Result;
