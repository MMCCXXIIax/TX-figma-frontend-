#!/bin/bash

echo "🚀 TX Predictive Intelligence - Quick Start"
echo "==========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version is $NODE_VERSION. Please upgrade to Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Make sure you're in the project directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cat > .env << EOF
# API Configuration
VITE_API_BASE=http://localhost:5000
VITE_SOCKET_BASE=http://localhost:5000

# Demo Mode (set to 'true' to force demo mode)
VITE_DEMO_MODE=false

# Logging
VITE_ENABLE_LOGGING=true
EOF
    echo "✅ .env file created"
fi

echo ""
echo "🎯 Starting development server..."
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000 (if available)"
echo ""
echo "💡 The app will work in demo mode if the backend is not available"
echo "   All features are functional with mock data"
echo ""

# Start the development server
npm run dev