#!/usr/bin/env node

/**
 * Quick setup script for the Trello Real-time project
 * This script helps you set up environment variables and dependencies
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Trello Real-time Project...\n');

// Check if we're in the root directory
const rootDir = process.cwd();
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

if (!fs.existsSync(backendDir) || !fs.existsSync(frontendDir)) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

console.log('📦 Installing backend dependencies...');
try {
  process.chdir(backendDir);
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed successfully\n');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

console.log('📦 Installing frontend dependencies...');
try {
  process.chdir(frontendDir);
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed successfully\n');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Return to root directory
process.chdir(rootDir);

console.log('📋 Setup completed successfully!\n');
console.log('🔧 Next steps:');
console.log('1. Get your Trello API key from: https://trello.com/app-key');
console.log('2. Generate your token from the authorization URL');
console.log('3. Edit backend/.env and add your API credentials');
console.log('4. Run "npm run dev" in the backend directory');
console.log('5. Run "npm start" in the frontend directory');
console.log('6. Set up ngrok and register webhooks for real-time functionality\n');
console.log('📖 See README.md for detailed setup instructions');