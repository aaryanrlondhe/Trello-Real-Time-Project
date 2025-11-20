#!/usr/bin/env node

/**
 * Interactive script to help set up Trello webhooks
 * This script will guide you through the webhook setup process
 */

require('dotenv').config();
const readline = require('readline');
const trelloService = require('../services/trelloService');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupWebhooks() {
  console.log('🚀 Trello Webhook Setup Assistant\n');
  
  // Check if environment is properly configured
  if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_API_TOKEN) {
    console.error('❌ Missing Trello API credentials!');
    console.log('Please set TRELLO_API_KEY and TRELLO_API_TOKEN in your .env file');
    process.exit(1);
  }
  
  try {
    // Step 1: Get the callback URL
    console.log('📋 Step 1: Configure Callback URL');
    console.log('You need a publicly accessible URL for Trello to send webhooks to.');
    console.log('Options:');
    console.log('1. ngrok (for local development)');
    console.log('2. Production server URL');
    console.log('3. Other tunneling service\n');
    
    const callbackURL = await question('Enter your webhook callback URL (e.g., https://abc123.ngrok.io/api/webhooks/trello): ');
    
    if (!callbackURL.startsWith('https://')) {
      console.log('⚠️  Warning: Trello requires HTTPS for webhook callbacks');
    }
    
    // Step 2: Test the callback URL
    console.log('\n🧪 Step 2: Testing Webhook Endpoint');
    console.log('Testing if your webhook endpoint is accessible...');
    
    try {
      const fetch = require('node-fetch');
      const testResponse = await fetch(`${callbackURL}`, { method: 'HEAD' });
      
      if (testResponse.ok) {
        console.log('✅ Webhook endpoint is accessible!');
      } else {
        console.log(`⚠️  Warning: Webhook endpoint returned status ${testResponse.status}`);
      }
    } catch (error) {
      console.log('⚠️  Warning: Could not reach webhook endpoint. Make sure your server is running.');
    }
    
    // Step 3: Get board ID
    console.log('\n📋 Step 3: Select Trello Board');
    console.log('Fetching your Trello boards...\n');
    
    try {
      const boards = await trelloService.getBoards();
      
      if (boards.length === 0) {
        console.log('No boards found. Please create a board in Trello first.');
        process.exit(1);
      }
      
      console.log('Available boards:');
      boards.forEach((board, index) => {
        console.log(`${index + 1}. ${board.name} (${board.id})`);
      });
      
      const boardChoice = await question('\nSelect a board number: ');
      const selectedBoard = boards[parseInt(boardChoice) - 1];
      
      if (!selectedBoard) {
        console.log('Invalid board selection');
        process.exit(1);
      }
      
      console.log(`\n✅ Selected board: ${selectedBoard.name}`);
      
      // Step 4: Register the webhook
      console.log('\n🔗 Step 4: Registering Webhook');
      
      const confirmRegister = await question(`Register webhook for board "${selectedBoard.name}"? (y/n): `);
      
      if (confirmRegister.toLowerCase() !== 'y') {
        console.log('Webhook registration cancelled');
        process.exit(0);
      }
      
      console.log('Registering webhook...');
      
      const webhook = await trelloService.createWebhook(callbackURL, selectedBoard.id);
      
      console.log('\n🎉 Webhook registered successfully!');
      console.log(`Webhook ID: ${webhook.id}`);
      console.log(`Board: ${selectedBoard.name} (${selectedBoard.id})`);
      console.log(`Callback URL: ${webhook.callbackURL}`);
      console.log(`Active: ${webhook.active}`);
      
      console.log('\n📝 Next Steps:');
      console.log(`1. Update your .env file with: WEBHOOK_CALLBACK_URL=${callbackURL}`);
      console.log(`2. Save the webhook ID for future reference: ${webhook.id}`);
      console.log('3. Test real-time functionality by making changes to your Trello board');
      console.log('4. Monitor your server logs for incoming webhook events');
      
      // Step 5: Update .env file automatically
      const updateEnv = await question('\nWould you like to automatically update your .env file? (y/n): ');
      
      if (updateEnv.toLowerCase() === 'y') {
        try {
          const fs = require('fs');
          const path = require('path');
          const envPath = path.join(__dirname, '../.env');
          
          let envContent = fs.readFileSync(envPath, 'utf8');
          
          // Replace or add WEBHOOK_CALLBACK_URL
          if (envContent.includes('WEBHOOK_CALLBACK_URL=')) {
            envContent = envContent.replace(
              /WEBHOOK_CALLBACK_URL=.*/,
              `WEBHOOK_CALLBACK_URL=${callbackURL}`
            );
          } else {
            envContent += `\nWEBHOOK_CALLBACK_URL=${callbackURL}`;
          }
          
          fs.writeFileSync(envPath, envContent);
          console.log('✅ .env file updated successfully!');
        } catch (error) {
          console.log('⚠️  Could not update .env file automatically. Please update it manually.');
        }
      }
      
    } catch (error) {
      console.error('❌ Error fetching boards:', error.message);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Handle CTRL+C gracefully
process.on('SIGINT', () => {
  console.log('\n\nSetup interrupted by user');
  rl.close();
  process.exit(0);
});

setupWebhooks();