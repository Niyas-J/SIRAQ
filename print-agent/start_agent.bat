@echo off
title SIRAQ SMART PRINT - Local Print Agent (Windows 11)
color 0E

echo =====================================================================
echo          SIRAQ SMART PRINT - WINDOWS 11 PRINT AGENT
echo                  SCAN. UPLOAD. PAY. PRINT.
echo =====================================================================
echo.
echo Target Printer: Canon PIXMA G3010 Series
echo Server Backend: http://localhost:3000
echo.

cd /d "%~dp0"

echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not found in PATH!
    echo Please ensure Python 3.10+ is installed on this shop PC.
    pause
    exit /b 1
)

echo Starting SIRAQ Local Print Agent in background listener mode...
echo (Keep this window open during business hours for auto-printing)
echo.
python siraq_print_agent.py
pause

