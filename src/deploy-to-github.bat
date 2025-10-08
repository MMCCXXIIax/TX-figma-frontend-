@echo off
REM TX Predictive Intelligence - GitHub Deployment Script (Windows)
REM Run this script in your local project directory after downloading all files

echo 🚀 TX Predictive Intelligence - GitHub Deployment
echo ==================================================

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first:
    echo    Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Check if we're in a project directory
if not exist package.json (
    echo ❌ package.json not found. Make sure you're in the project directory.
    echo    Please download all files from Figma Make and run this script in that folder.
    pause
    exit /b 1
)

echo 📁 Current directory: %cd%
echo 🔍 Checking project files...

REM Verify key files exist
if exist App.tsx (
    echo ✅ App.tsx found
) else (
    echo ❌ App.tsx missing
    pause
    exit /b 1
)

if exist package.json (
    echo ✅ package.json found
) else (
    echo ❌ package.json missing
    pause
    exit /b 1
)

if exist README.md (
    echo ✅ README.md found
) else (
    echo ❌ README.md missing
    pause
    exit /b 1
)

echo.
echo 🔧 Initializing Git repository...

REM Initialize git if not already done
if not exist .git (
    git init
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

echo.
echo 📝 Adding files to Git...

REM Add all files
git add .
echo ✅ All files added to staging

echo.
echo 💾 Creating commit...

REM Create commit
git commit -m "🚀 Initial commit: TX Predictive Intelligence v1.0.0

- Complete React + TypeScript trading platform
- Real-time WebSocket integration with Socket.IO  
- 7 main pages: Dashboard, Charts, Paper Trading, Scan Control, Backtesting, Sentiment, Risk
- 42 Flask API endpoints integration with fallback system
- Dark minimalist theme with sky blue accents
- Comprehensive error handling and offline support
- Production-ready with environment configuration"

echo ✅ Commit created successfully

echo.
echo 🔗 Adding GitHub remote...

REM Add remote origin
git remote add origin https://github.com/MMCCXXIIax/TX-figma-frontend-.git

echo ✅ Remote origin added

echo.
echo 🌿 Setting main branch...

REM Set main branch
git branch -M main

echo ✅ Main branch set

echo.
echo ⬆️  Pushing to GitHub...

echo Note: You may be prompted for your GitHub username and personal access token
echo GitHub no longer accepts passwords - use a Personal Access Token instead
echo Generate one at: https://github.com/settings/tokens

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo 🎉 SUCCESS! Your TX Predictive Intelligence project is now on GitHub!
    echo 🔗 Repository: https://github.com/MMCCXXIIax/TX-figma-frontend-
    echo.
    echo 📋 Next steps:
    echo 1. Set up environment variables in your deployment platform
    echo 2. Configure GitHub Pages or deploy to Vercel/Netlify
    echo 3. Add collaborators if needed
    echo 4. Set up branch protection rules
) else (
    echo.
    echo ❌ Push failed. Common solutions:
    echo 1. Make sure you have write access to the repository
    echo 2. Use a Personal Access Token instead of password
    echo 3. Check if the repository already has content (use --force if needed)
    echo.
    echo Manual push command:
    echo git push -u origin main --force
)

echo.
echo Press any key to exit...
pause >nul