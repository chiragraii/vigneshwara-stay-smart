@echo off
echo ===============================================
echo   Hotel Vigneshwara Lodge - Backend Server
echo ===============================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo ERROR: .env file not found!
    echo Please copy .env.example to .env and configure it.
    echo.
    pause
    exit /b 1
)

echo Starting backend server...
echo Server will run on http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
