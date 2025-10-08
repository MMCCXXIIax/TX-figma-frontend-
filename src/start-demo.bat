@echo off
echo 🚀 TX Predictive Intelligence - Quick Start
echo ===========================================

REM Check if Node.js is installed
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found. Make sure you're in the project directory.
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo ⚙️  Creating .env file...
    (
        echo # API Configuration
        echo VITE_API_BASE=http://localhost:5000
        echo VITE_SOCKET_BASE=http://localhost:5000
        echo.
        echo # Demo Mode ^(set to 'true' to force demo mode^)
        echo VITE_DEMO_MODE=false
        echo.
        echo # Logging
        echo VITE_ENABLE_LOGGING=true
    ) > .env
    echo ✅ .env file created
)

echo.
echo 🎯 Starting development server...
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000 ^(if available^)
echo.
echo 💡 The app will work in demo mode if the backend is not available
echo    All features are functional with mock data
echo.

REM Start the development server
npm run dev