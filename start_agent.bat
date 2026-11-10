@echo off
title SIRAQ Smart Print Agent (Canon PIXMA G3010)
color 0E
cd /d "%~dp0\print-agent"

echo =====================================================================
echo          SIRAQ SMART PRINT - WINDOWS 11 PRINT AGENT
echo                  SCAN. UPLOAD. PAY. PRINT.
echo =====================================================================
echo.
echo Launching Python Print Spooler Agent for Canon G3010 series...
echo.

call start_agent.bat

