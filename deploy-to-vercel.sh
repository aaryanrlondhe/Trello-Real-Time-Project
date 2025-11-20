#!/bin/bash

# Vercel Deployment Quick Start Script
# This script helps you quickly deploy to Vercel

set -e

echo "🚀 Trello Real-time App - Vercel Deployment Helper"
echo "=================================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "📋 Deployment Checklist:"
echo "✅ Prerequisites to complete manually:"
echo "   1. Create GitHub repository and push your code"
echo "   2. Obtain Trello API Key and Token from https://trello.com/app-key"
echo "   3. Create Vercel account at https://vercel.com"
echo ""

read -p "Have you completed the above? (yes/no): " completed

if [ "$completed" != "yes" ]; then
    echo "Please complete the prerequisites and run again."
    exit 1
fi

echo ""
echo "🔐 Environment Variables Setup"
echo "=============================="
echo ""

# Backend credentials
read -sp "Enter your Trello API Key: " TRELLO_API_KEY
echo ""
read -sp "Enter your Trello API Token: " TRELLO_API_TOKEN
echo ""

echo ""
echo "📡 Connecting to Vercel..."
echo ""

# Login to Vercel
vercel login

echo ""
echo "🎯 Deploying Backend"
echo "===================="
echo ""

cd "$(dirname "$0")/backend"
echo "Backend directory: $(pwd)"
echo ""

vercel env add TRELLO_API_KEY "$TRELLO_API_KEY"
vercel env add TRELLO_API_TOKEN "$TRELLO_API_TOKEN"
vercel env add NODE_ENV "production"

BACKEND_DEPLOYMENT=$(vercel --prod)
BACKEND_URL=$(echo "$BACKEND_DEPLOYMENT" | grep -oP 'https://\S+' | head -1)

echo ""
echo "✅ Backend deployed to: $BACKEND_URL"
echo ""

echo "🎨 Deploying Frontend"
echo "===================="
echo ""

cd "$(dirname "$0")/frontend"
echo "Frontend directory: $(pwd)"
echo ""

vercel env add REACT_APP_API_URL "$BACKEND_URL"
vercel env add REACT_APP_SOCKET_URL "$BACKEND_URL"
vercel env add REACT_APP_ENABLE_REALTIME "true"

FRONTEND_DEPLOYMENT=$(vercel --prod)
FRONTEND_URL=$(echo "$FRONTEND_DEPLOYMENT" | grep -oP 'https://\S+' | head -1)

echo ""
echo "✅ Frontend deployed to: $FRONTEND_URL"
echo ""

echo "📝 Updating Backend CORS"
echo "======================="
echo ""

cd "$(dirname "$0")/backend"
vercel env add CORS_ORIGIN "$FRONTEND_URL"

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "📊 Your Application URLs:"
echo "   Frontend: $FRONTEND_URL"
echo "   Backend:  $BACKEND_URL"
echo ""
echo "✅ Next Steps:"
echo "   1. Open your frontend URL in a browser"
echo "   2. Create or select a board"
echo "   3. Test creating a card to verify real-time sync"
echo "   4. Check browser console for any errors"
echo ""
echo "📚 Documentation: See VERCEL_DEPLOYMENT_COMPLETE.md for detailed info"
echo ""
