#!/bin/bash

# TX Predictive Intelligence - GitHub Deployment Script
# Run this script in your local project directory after downloading all files

echo "🚀 TX Predictive Intelligence - GitHub Deployment"
echo "=================================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   - Windows: https://git-scm.com/download/win"
    echo "   - Mac: brew install git"
    echo "   - Linux: sudo apt-get install git"
    exit 1
fi

# Check if we're in a project directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Make sure you're in the project directory."
    echo "   Please download all files from Figma Make and run this script in that folder."
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo "🔍 Checking project files..."

# Verify key files exist
key_files=("App.tsx" "package.json" "README.md" ".gitignore")
for file in "${key_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file found"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

echo ""
echo "🔧 Initializing Git repository..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "📝 Adding files to Git..."

# Add all files
git add .
echo "✅ All files added to staging"

echo ""
echo "💾 Creating commit..."

# Create commit
git commit -m "🚀 Initial commit: TX Predictive Intelligence v1.0.0

- Complete React + TypeScript trading platform
- Real-time WebSocket integration with Socket.IO  
- 7 main pages: Dashboard, Charts, Paper Trading, Scan Control, Backtesting, Sentiment, Risk
- 42 Flask API endpoints integration with fallback system
- Dark minimalist theme with sky blue accents
- Comprehensive error handling and offline support
- Production-ready with environment configuration"

echo "✅ Commit created successfully"

echo ""
echo "🔗 Adding GitHub remote..."

# Add remote origin
git remote add origin https://github.com/MMCCXXIIax/TX-figma-frontend-.git

echo "✅ Remote origin added"

echo ""
echo "🌿 Setting main branch..."

# Set main branch
git branch -M main

echo "✅ Main branch set"

echo ""
echo "⬆️  Pushing to GitHub..."

# Push to GitHub
echo "Note: You may be prompted for your GitHub username and personal access token"
echo "GitHub no longer accepts passwords - use a Personal Access Token instead"
echo "Generate one at: https://github.com/settings/tokens"

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Your TX Predictive Intelligence project is now on GitHub!"
    echo "🔗 Repository: https://github.com/MMCCXXIIax/TX-figma-frontend-"
    echo ""
    echo "📋 Next steps:"
    echo "1. Set up environment variables in your deployment platform"
    echo "2. Configure GitHub Pages or deploy to Vercel/Netlify"
    echo "3. Add collaborators if needed"
    echo "4. Set up branch protection rules"
else
    echo ""
    echo "❌ Push failed. Common solutions:"
    echo "1. Make sure you have write access to the repository"
    echo "2. Use a Personal Access Token instead of password"
    echo "3. Check if the repository already has content (use --force if needed)"
    echo ""
    echo "Manual push command:"
    echo "git push -u origin main --force"
fi