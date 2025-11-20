#!/usr/bin/env node

/**
 * Convenient script to start both backend and frontend servers
 * Usage: node start-dev.js
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Trello Real-time Development Servers...\n');

const rootDir = process.cwd();
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

// Start backend server
console.log('🔧 Starting backend server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: backendDir,
  stdio: ['inherit', 'pipe', 'pipe']
});

backend.stdout.on('data', (data) => {
  console.log(`[Backend] ${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data.toString().trim()}`);
});

// Wait a moment then start frontend
setTimeout(() => {
  console.log('⚛️  Starting frontend server...');
  const frontend = spawn('npm', ['start'], {
    cwd: frontendDir,
    stdio: ['inherit', 'pipe', 'pipe']
  });

  frontend.stdout.on('data', (data) => {
    console.log(`[Frontend] ${data.toString().trim()}`);
  });

  frontend.stderr.on('data', (data) => {
    console.error(`[Frontend Error] ${data.toString().trim()}`);
  });

  frontend.on('close', (code) => {
    console.log(`\n[Frontend] Process exited with code ${code}`);
    backend.kill();
    process.exit(code);
  });
}, 2000);

backend.on('close', (code) => {
  console.log(`\n[Backend] Process exited with code ${code}`);
  process.exit(code);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  process.exit(0);
});