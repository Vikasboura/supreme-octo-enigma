
@echo off
echo ===========================================
echo   Starting SECUREWAY Autonomous Logic Engine
echo   (Python 3.12 + FastAPI + JS Frontend)
echo ===========================================

echo [+] Installing minimal dependencies...
pip install fastapi uvicorn pydantic python-dotenv requests > nul 2>&1

echo [+] Launching Backend API (Port 8000)...
start "SECUREWAY Backend" cmd /k "cd backend && python main.py"

echo [+] Launching Frontend (Port 3000)...
start "SECUREWAY Frontend" cmd /k "cd secureway && npm start"

echo ===========================================
echo   System Operational!
echo   > API: http://localhost:8000/docs
echo   > UI:  http://localhost:3000
echo ===========================================
pause
