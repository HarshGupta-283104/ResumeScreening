@echo off
echo Starting Backend Server...
start cmd /k "cd backend && venv2\Scripts\python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo Done. Both servers are starting up.
