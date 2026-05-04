const express = require('express');
const cors = require('cors');
const multer = require('multer');

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // Pass raw PDF to Gemini

    // Use Gemini to parse text and generate questions
    const prompt = `
      You are an AI Interviewer. I will provide you with the text of a candidate's resume.
      Your tasks:
      1. Extract the candidate's skills, top projects, and education.
      2. Generate exactly 5 Multiple Choice Questions (MCQs) focusing on their technical skills.
      3. Generate exactly 3 subjective questions focusing on the projects mentioned in their resume.
      4. Generate exactly 1 question asking them to provide a GitHub link or describe their open-source contributions.

      Return the result STRICTLY as a valid JSON object with the following structure:
      {
        "skills": ["skill1", "skill2"],
        "projects": ["project1", "project2"],
        "education": ["edu1"],
        "questions": {
          "mcq": [
            { "id": "m1", "question": "...", "options": ["A", "B", "C", "D"], "answer": "A" }
          ],
          "subjective": [
            { "id": "s1", "question": "..." }
          ],
          "github": { "id": "g1", "question": "..." }
        }
      }

      Do not include markdown blocks like \`\`\`json. Return only the JSON string.

    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: "application/pdf"
        }
      }
    ]);
    let rawResponse = result.response.text().trim();
    if (rawResponse.startsWith('```json')) {
      rawResponse = rawResponse.replace(/^```json/, '').replace(/```$/, '').trim();
    }
    
    const parsedData = JSON.parse(rawResponse);
    
    res.json({
      success: true,
      data: parsedData,
      rawText: "PDF content extracted directly by Gemini" // placeholder for evaluate phase
    });
  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ error: 'Failed to process resume' });
  }
});

app.post('/api/evaluate', async (req, res) => {
  try {
    const { answers, questions, resumeText } = req.body;
    
    // Answers structure expected: { [questionId]: "user's answer" }
    
    const prompt = `
      You are an AI Interview Evaluator.
      Here are the interview questions: ${JSON.stringify(questions)}
      Here are the candidate's answers: ${JSON.stringify(answers)}
      
      Evaluate the candidate's performance based on their answers.
      1. For MCQs, check if the answer is correct based on the provided correct option.
      2. For subjective questions, evaluate relevance, depth, and clarity.
      3. For the GitHub question, check completeness and validity of the response.
      
      Score out of 10.
      
      Return the result STRICTLY as a valid JSON object with the following structure:
      {
        "score": 8.5,
        "feedback": {
          "strengths": ["...", "..."],
          "weaknesses": ["...", "..."],
          "interviewPerformance": "...",
          "improvementSuggestions": ["...", "..."]
        }
      }

      Do not include markdown blocks like \`\`\`json. Return only the JSON string.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let rawResponse = result.response.text().trim();
    if (rawResponse.startsWith('```json')) {
      rawResponse = rawResponse.replace(/^```json/, '').replace(/```$/, '').trim();
    }
    
    const parsedData = JSON.parse(rawResponse);
    
    res.json({
      success: true,
      evaluation: parsedData
    });
  } catch (error) {
    console.error('Error evaluating answers:', error);
    res.status(500).json({ error: 'Failed to evaluate answers' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
