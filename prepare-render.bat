@echo off
REM MediTracker Render Deployment Helper Script (Windows)
REM This script prepares your project for deployment to Render

echo.
echo 🚀 MediTracker - Render Deployment Preparation
echo ============================================
echo.

echo Checking Git repository...
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Not a Git repository. Initializing...
    git init
)

echo.
echo 📝 Verifying deployment files...

set "files=Procfile render.yaml backend\wsgi.py backend\requirements.txt frontend\package.json .gitignore"

for %%F in (%files%) do (
    if exist "%%F" (
        echo ✓ %%F
    ) else (
        echo ✗ %%F (missing^)
    )
)

echo.
echo 🔧 Checking backend dependencies...

findstr /M "gunicorn" backend\requirements.txt >nul 2>&1
if errorlevel 1 (
    echo ✗ gunicorn missing from requirements.txt
) else (
    echo ✓ gunicorn in requirements.txt
)

findstr /M "python-dotenv" backend\requirements.txt >nul 2>&1
if errorlevel 1 (
    echo ✗ python-dotenv missing from requirements.txt
) else (
    echo ✓ python-dotenv in requirements.txt
)

echo.
echo 📋 Checking environment configuration...

if exist ".env.example" (
    echo ✓ .env.example exists
    echo   Remember to set these env vars in Render:
    for /f "tokens=1 delims==" %%A in (.env.example) do (
        if not "%%A"=="" if not "%%A:~0,1%"=="#" echo     - %%A
    )
) else (
    echo ✗ .env.example not found
)

echo.
echo ============================================
echo ✅ Deployment Preparation Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Push to GitHub:
echo    git push origin main
echo.
echo 2. Go to Render: https://render.com
echo.
echo 3. Click 'New' - 'Blueprint'
echo.
echo 4. Connect your GitHub repository
echo.
echo 5. Set environment variables:
echo    - SECRET_KEY ^(generate with: python -c "import secrets; print(secrets.token_hex(32))""^)
echo    - FLASK_ENV = production
echo    - FLASK_DEBUG = False
echo    - MAIL_USERNAME = your-email@gmail.com
echo    - MAIL_PASSWORD = your-app-password
echo    - REACT_APP_API_URL = https://your-backend.onrender.com
echo.
echo 6. Click 'Deploy'
echo.
echo For detailed instructions, see: DEPLOYMENT_GUIDE.md
echo.
pause
