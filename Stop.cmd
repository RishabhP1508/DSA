@echo off
cd /d "%~dp0"
"%~dp0runtime\node.exe" "%~dp0desktop\stop.mjs"
if errorlevel 1 pause
