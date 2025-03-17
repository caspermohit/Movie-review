#!/bin/bash
echo "Starting build process..."

# Copy special package.json for Render to root
if [ -f "package.json.render" ]; then
  echo "Using special package.json for Render"
  cp package.json.render package.json
fi

# Navigate to backend directory
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Build the TypeScript code
echo "Building backend..."
npm run build

echo "Build process completed!" 