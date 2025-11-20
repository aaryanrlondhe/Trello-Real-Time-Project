#!/bin/bash

# Vercel Pre-Deployment Setup Script
# This script helps prepare your project for deployment to Vercel

echo "🚀 Trello Real-time Application - Vercel Pre-Deployment Setup"
echo "=============================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if git is initialized
echo "${BLUE}Checking git repository...${NC}"
if [ -d ".git" ]; then
    echo "${GREEN}✓ Git repository found${NC}"
else
    echo "${YELLOW}⚠ Git repository not initialized${NC}"
    read -p "Initialize git? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git init
        git add .
        git commit -m "Initial commit - Ready for Vercel deployment"
        echo "${GREEN}✓ Git initialized${NC}"
    fi
fi

echo ""

# Check if GitHub remote exists
echo "${BLUE}Checking GitHub remote...${NC}"
if git remote get-url origin &> /dev/null; then
    origin=$(git remote get-url origin)
    echo "${GREEN}✓ GitHub remote found: $origin${NC}"
else
    echo "${YELLOW}⚠ GitHub remote not configured${NC}"
    echo "Add your repository with:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
fi

echo ""

# Check dependencies
echo "${BLUE}Checking dependencies...${NC}"

if [ ! -d "node_modules" ]; then
    echo "${YELLOW}⚠ Root dependencies not installed${NC}"
    read -p "Install? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install
    fi
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "${YELLOW}⚠ Frontend dependencies not installed${NC}"
    read -p "Install? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd frontend && npm install && cd ..
    fi
fi

if [ ! -d "backend/node_modules" ]; then
    echo "${YELLOW}⚠ Backend dependencies not installed${NC}"
    read -p "Install? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd backend && npm install && cd ..
    fi
fi

echo "${GREEN}✓ Dependencies checked${NC}"
echo ""

# Check for required files
echo "${BLUE}Checking required configuration files...${NC}"

files_to_check=("vercel.json" "api/index.js" ".env.vercel.example")
missing_files=()

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "${GREEN}✓ Found: $file${NC}"
    else
        echo "${RED}✗ Missing: $file${NC}"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo ""
    echo "${YELLOW}Some configuration files are missing.${NC}"
    echo "Please run: git pull origin main"
    echo "Or recreate the files from the repository."
fi

echo ""

# Check Trello credentials
echo "${BLUE}Checking Trello credentials...${NC}"

if [ -f ".env" ]; then
    if grep -q "TRELLO_API_KEY" .env && grep -q "TRELLO_API_TOKEN" .env; then
        echo "${GREEN}✓ Trello credentials found in .env${NC}"
        echo "  (But remember to set them in Vercel dashboard!)"
    else
        echo "${YELLOW}⚠ Trello credentials not in .env${NC}"
    fi
else
    echo "${YELLOW}⚠ .env file not found${NC}"
    read -p "Create .env from example? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.vercel.example .env
        echo "${GREEN}✓ Created .env${NC}"
        echo "${YELLOW}⚠ Edit .env with your Trello credentials${NC}"
    fi
fi

echo ""

# Summary
echo "${BLUE}Pre-deployment Summary:${NC}"
echo "======================="
echo ""
echo "✅ Setup check complete!"
echo ""
echo "${YELLOW}Next steps:${NC}"
echo "1. Get Trello API credentials:"
echo "   - API Key: https://trello.com/app-key"
echo "   - API Token: https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=Server%20Token&key={YOUR_API_KEY}"
echo ""
echo "2. Push to GitHub:"
echo "   git push origin main"
echo ""
echo "3. Go to https://vercel.com"
echo "   - Import your repository"
echo "   - Add environment variables:"
echo "     * TRELLO_API_KEY"
echo "     * TRELLO_API_TOKEN"
echo "     * CORS_ORIGIN (your Vercel URL)"
echo "     * NODE_ENV=production"
echo ""
echo "4. Deploy!"
echo ""
echo "${GREEN}For detailed instructions, see: VERCEL_QUICK_START.md${NC}"
echo ""
