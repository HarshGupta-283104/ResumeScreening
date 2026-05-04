import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  if (!location.state || !location.state.data) {
    return <Navigate to="/" />;
  }

  const { data, resumeText } = location.state;
  const questionsData = data.questions;
  
  // Flatten all questions into an ordered array
  // 5 MCQs, 3 Subjective, 1 Github
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const allQ = [];
    if (questionsData.mcq) questionsData.mcq.forEach(q => allQ.push({ ...q, type: 'mcq' }));
    if (questionsData.subjective) questionsData.subjective.forEach(q => allQ.push({ ...q, type: 'subjective' }));
    if (questionsData.github) allQ.push({ ...questionsData.github, type: 'github' });
    setQuestions(allQ);
  }, [questionsData]);

  const currentQ = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0;

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finish Interview
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:5000/api/evaluate', {
          answers,
          questions,
          resumeText
        });
        if (response.data.success) {
          navigate('/result', { state: { evaluation: response.data.evaluation } });
        }
      } catch (error) {
        console.error('Evaluation failed', error);
        alert('Failed to evaluate answers. Please try again.');
        setLoading(false);
      }
    }
  };

  const handleAnswer = (val) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: val }));
  };

  if (!currentQ) return null;

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header / Progress */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between mb-12 relative z-10">
        <div className="text-2xl font-bold tracking-tight text-white">Resume Screening</div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-white/60">
            Question {currentIndex + 1} of {questions.length}
          </div>
          <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center max-w-3xl w-full mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full glass-panel p-8 md:p-10 mb-8"
          >
            <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-wider uppercase text-white/60 mb-6">
              {currentQ.type === 'mcq' ? 'Multiple Choice' : currentQ.type === 'github' ? 'Portfolio / Github' : 'Technical Question'}
            </div>
            
            <h2 className="text-2xl md:text-3xl font-medium text-white/90 leading-relaxed mb-8">
              {currentQ.question}
            </h2>

            {currentQ.type === 'mcq' ? (
              <div className="space-y-4">
                {currentQ.options.map((opt, i) => {
                  const isSelected = answers[currentQ.id] === opt;
                  return (
                    <div 
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 ${isSelected ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(79,70,229,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${isSelected ? 'bg-primary border-primary text-white' : 'border-white/30'}`}>
                        {isSelected && <CheckCircle className="w-4 h-4" />}
                      </div>
                      <span className="text-lg text-white/80">{opt}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="w-full">
                <textarea
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Type your answer here in detail..."
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-5 text-white/80 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="w-full flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={!answers[currentQ.id] || loading}
            className={`px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all ${answers[currentQ.id] && !loading ? 'bg-white text-background hover:bg-gray-200' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Evaluating...
              </>
            ) : (
              <>
                {currentIndex === questions.length - 1 ? 'Submit Interview' : 'Next Question'}
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Interview;
