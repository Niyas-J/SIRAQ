@echo off
title SIRAQ SMART PRINT - Native GDI Print Agent (Canon PIXMA G3010)
color 0E

echo =====================================================================
echo          SIRAQ SMART PRINT - WINDOWS 11 PRINT AGENT
echo                  SCAN. UPLOAD. PAY. PRINT.
echo =====================================================================
echo.
echo Target Printer: Canon PIXMA G3010 Series
echo Server Backend: http://localhost:3001
echo Engine        : Native Windows GDI + PyMuPDF High-Res
echo.

cd /d "%~dp0"

echo Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    pause
    exit /b 1
)

echo Starting SIRAQ Native Print Agent...
python siraq_print_agent.py
pause
