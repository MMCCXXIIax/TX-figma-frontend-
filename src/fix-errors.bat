@echo off
echo 🔧 TX Predictive Intelligence - Error Recovery
echo ==============================================

echo 1. Cleaning previous installation...
if exist "node_modules" rd /s /q node_modules
if exist "package-lock.json" del package-lock.json
if exist ".vite" rd /s /q .vite
if exist "dist" rd /s /q dist

echo 2. Reinstalling dependencies...
npm install

echo 3. Checking environment configuration...
if not exist ".env" (
    echo    Creating .env file...
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
)

echo 4. Running setup verification...
npm run verify

echo.
echo ✅ Error recovery complete!
echo.
echo Try starting the application again:
echo    npm run dev
echo.
echo Or use the quick start script:
echo    start-demo.bat