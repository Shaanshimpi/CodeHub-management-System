@echo off
REM CodeHub ERP Railway Deployment Script for Windows

echo 🚀 Starting CodeHub ERP deployment to Railway...

REM Check if Railway CLI is installed
where railway >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Railway CLI not found. Please install it first:
    echo npm install -g @railway/cli
    pause
    exit /b 1
)

REM Check if user is logged in to Railway
railway whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo 🔐 Please log in to Railway first:
    echo railway login
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
call npm run install:all

echo 🏗️  Building frontend...
call npm run build:frontend

echo 🚀 Deploying to Railway...
railway up

echo ✅ Deployment complete!
echo 🌐 Your app should be available at the Railway URL shown above.
echo 📝 Don't forget to set up your environment variables in the Railway dashboard.
pause
