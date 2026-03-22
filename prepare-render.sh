#!/bin/bash

# MediTracker Render Deployment Helper Script
# This script prepares your project for deployment to Render

set -e  # Exit on error

echo "🚀 MediTracker - Render Deployment Preparation"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Git
echo -e "${BLUE}Checking Git repository...${NC}"
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Not a Git repository. Initializing...${NC}"
    git init
fi

# Check for uncommitted changes
if [[ $(git status --porcelain) ]]; then
    echo -e "${YELLOW}📝 Found uncommitted changes. Committing...${NC}"
    git add .
    git commit -m "Prepare for Render deployment" || echo "No new changes to commit"
fi

# Verify files
echo -e "${BLUE}Verifying deployment files...${NC}"
files=(
    "Procfile"
    "render.yaml"
    "backend/wsgi.py"
    "backend/requirements.txt"
    "frontend/package.json"
    ".gitignore"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${YELLOW}✗${NC} $file (missing)"
    fi
done

# Check backend dependencies
echo -e "${BLUE}Checking backend dependencies...${NC}"
if grep -q "gunicorn" backend/requirements.txt; then
    echo -e "${GREEN}✓${NC} gunicorn in requirements.txt"
else
    echo -e "${YELLOW}✗${NC} gunicorn missing from requirements.txt"
fi

if grep -q "python-dotenv" backend/requirements.txt; then
    echo -e "${GREEN}✓${NC} python-dotenv in requirements.txt"
else
    echo -e "${YELLOW}✗${NC} python-dotenv missing from requirements.txt"
fi

# Check environment variables
echo -e "${BLUE}Checking environment configuration...${NC}"
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓${NC} .env.example exists"
    echo -e "${YELLOW}  Remember to set these env vars in Render:${NC}"
    grep -E "^[A-Z_]+" .env.example | sed 's/=.*//' | sed 's/^/    - /'
else
    echo -e "${YELLOW}✗${NC} .env.example not found"
fi

# Check .gitignore
echo -e "${BLUE}Checking .gitignore...${NC}"
if grep -q ".env" .gitignore; then
    echo -e "${GREEN}✓${NC} .env is in .gitignore"
else
    echo -e "${YELLOW}✗${NC} .env not in .gitignore"
fi

# Summary
echo ""
echo "=============================================="
echo -e "${GREEN}✅ Deployment Preparation Complete!${NC}"
echo "=============================================="
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Push to GitHub:"
echo "   git push origin main"
echo ""
echo "2. Go to Render: https://render.com"
echo ""
echo "3. Click 'New' → 'Blueprint'"
echo ""
echo "4. Connect your GitHub repository"
echo ""
echo "5. Set environment variables:"
echo "   - SECRET_KEY (generate with: python -c \"import secrets; print(secrets.token_hex(32))\")"
echo "   - FLASK_ENV = production"
echo "   - FLASK_DEBUG = False"
echo "   - MAIL_USERNAME = your-email@gmail.com"
echo "   - MAIL_PASSWORD = your-app-password"
echo "   - REACT_APP_API_URL = https://your-backend.onrender.com"
echo ""
echo "6. Click 'Deploy'"
echo ""
echo "For detailed instructions, see: DEPLOYMENT_GUIDE.md"
echo ""
