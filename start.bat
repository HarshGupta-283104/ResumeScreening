@echo off
echo Starting Resume Screening Backend...
start cmd /k "cd backend && npm start"

echo Starting Resume Screening Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting in separate windows.
