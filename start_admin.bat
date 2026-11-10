@echo off
title SIRAQ Local System - Admin Console & Canon G3010 Print Agent
color 0A
cd /d "%~dp0"

echo =====================================================================
echo                SIRAQ LOCAL ADMINISTRATION SYSTEM
echo       Private Shop Console + Canon PIXMA G3010 Auto-Spooler
echo =====================================================================
echo.

echo [1/3] Starting SIRAQ Canon G3010 Native Print Agent in background...
start "SIRAQ Print Agent" /min cmd /c "python print-agent\siraq_print_agent.py"

echo [2/3] Opening Admin Dashboard in browser...
start http://localhost:3001/admin

echo [3/3] Launching Local Next.js Server on port 3001...
npx next start -p 3001

if %errorlevel% neq 0 (
    echo.
    echo Production server not built. Starting dev server on port 3001...
    npx next dev -p 3001
)

pause
