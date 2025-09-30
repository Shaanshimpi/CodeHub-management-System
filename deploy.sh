#!/bin/bash

# CodeHub ERP Railway Deployment Script

echo "🚀 Starting CodeHub ERP deployment to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it first:"
    echo "npm install -g @railway/cli"
    exit 1
fi

# Check if user is logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "🔐 Please log in to Railway first:"
    echo "railway login"
    exit 1
fi

echo "📦 Installing dependencies..."
npm run install:all

echo "🏗️  Building frontend..."
npm run build:frontend

echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at the Railway URL shown above."
echo "📝 Don't forget to set up your environment variables in the Railway dashboard."
