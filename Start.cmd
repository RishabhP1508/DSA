@echo off
cd /d "%~dp0"
if not exist "%~dp0runtime\node.exe" (
  echo Portable Node is missing. Extract the complete DSA Visual Lab ZIP first.
  pause
  exit /b 1
)
"%~dp0runtime\node.exe" "%~dp0desktop\start.mjs"
if errorlevel 1 pause
