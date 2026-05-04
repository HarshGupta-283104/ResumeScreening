import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, FileText, ArrowRight, Loader2, Cpu } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        navigate('/interview', { state: { data: response.data.data, resumeText: response.data.rawText } });
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to process resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl w-full text-center space-y-8"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
            <Cpu className="w-10 h-10 text-primary" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          Resume Screening
        </h1>
        <p className="text-xl text-white/60 font-light">
          AI-Powered Technical Interview Simulator
        </p>

        <div className="glass-panel p-8 md:p-12 mt-12 flex flex-col items-center gap-6">
          <div 
            className="w-full border-2 border-dashed border-white/20 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group relative"
          >
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
            />
            {file ? (
              <div className="flex flex-col items-center gap-4 text-white">
                <FileText className="w-12 h-12 text-secondary" />
                <span className="font-medium">{file.name}</span>
                <span className="text-sm text-white/50">Click or drag to replace</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-white/60 group-hover:text-white transition-colors">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-white/80" />
                </div>
                <span className="text-lg font-medium">Upload your Resume (PDF)</span>
                <span className="text-sm text-white/40">Our AI will analyze your skills and projects</span>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpload}
            disabled={!file || loading}
            className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${file && !loading ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                Start Interview <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
        
        <div className="flex justify-center gap-8 text-white/40 text-sm mt-8">
          <span className="flex items-center gap-2">✓ Smart Parsing</span>
          <span className="flex items-center gap-2">✓ Dynamic Questions</span>
          <span className="flex items-center gap-2">✓ AI Evaluation</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
