@echo off
title SIRAQ Local Admin System (Windows 11)
color 0A
cd /d "%~dp0"

echo =====================================================================
echo                SIRAQ LOCAL ADMINISTRATION SYSTEM
echo                   Private Shop Control Panel
echo =====================================================================
echo.
echo Launching local admin server on http://localhost:3001/admin...
echo Note: This admin panel runs locally on your shop Windows 11 PC and
echo is protected from public access on Vercel.
echo.

start http://localhost:3001/admin
npx next start -p 3001

if %errorlevel% neq 0 (
    echo.
    echo Production server not built. Starting in development mode on port 3001...
    npx next dev -p 3001
)

pause

