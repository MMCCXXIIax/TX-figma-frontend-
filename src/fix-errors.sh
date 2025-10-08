#!/bin/bash

echo "🔧 TX Predictive Intelligence - Error Recovery"
echo "=============================================="

echo "1. Cleaning previous installation..."
rm -rf node_modules package-lock.json .vite dist

echo "2. Reinstalling dependencies..."
npm install

echo "3. Checking environment configuration..."
if [ ! -f ".env" ]; then
    echo "   Creating .env file..."
    cat > .env << EOF
# API Configuration
VITE_API_BASE=http://localhost:5000
VITE_SOCKET_BASE=http://localhost:5000

# Demo Mode (set to 'true' to force demo mode)
VITE_DEMO_MODE=false

# Logging
VITE_ENABLE_LOGGING=true
EOF
fi

echo "4. Running setup verification..."
npm run verify

echo ""
echo "✅ Error recovery complete!"
echo ""
echo "Try starting the application again:"
echo "   npm run dev"
echo ""
echo "Or use the quick start script:"
echo "   ./start-demo.sh"