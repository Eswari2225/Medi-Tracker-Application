#!/bin/bash

# Build script for Render deployment

echo "🔨 Building MediTracker..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt

# Go back to root
cd ..

# Install frontend dependencies and build
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Build complete!"
