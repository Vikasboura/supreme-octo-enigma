@echo off
echo ======================================
echo    Starting SECUREWAY Autonomous Logic Engine
echo    (Python 3.12 + FastAPI + HTML/CSS/JS Frontend)
echo ======================================

echo [+] Installing minimal dependencies...
cd /d "%~dp0backend"
pip install -r requirements.txt >nul 2>&1

echo [+] Launching Backend API (Port 8000)...
start "SECUREWAY Backend" cmd /k "python main.py"

echo [+] Launching Frontend (Port 3000)...
cd /d "%~dp0secureway"
start "SECUREWAY Frontend" cmd /k "python -m http.server 3000"

echo ======================================
echo    System Operational!
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000/docs
echo ======================================
pause
