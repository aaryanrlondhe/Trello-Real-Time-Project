#!/usr/bin/env node

/**
 * Script to register a Trello webhook for real-time updates
 * Usage: node scripts/register-webhook.js <CALLBACK_URL> <BOARD_ID>
 */

require('dotenv').config();
const trelloService = require('../services/trelloService');

async function registerWebhook() {
  try {
    const callbackURL = process.argv[2];
    const boardId = process.argv[3];
    
    if (!callbackURL || !boardId) {
      console.error('Usage: node scripts/register-webhook.js <CALLBACK_URL> <BOARD_ID>');
      console.error('Example: node scripts/register-webhook.js https://your-domain.com/api/webhooks/trello 64a1b2c3d4e5f6789abcdef0');
      process.exit(1);
    }
    
    console.log('Registering webhook...');
    console.log(`Callback URL: ${callbackURL}`);
    console.log(`Board ID: ${boardId}`);
    
    const webhook = await trelloService.createWebhook(callbackURL, boardId);
    
    console.log('\n✅ Webhook registered successfully!');
    console.log(`Webhook ID: ${webhook.id}`);
    console.log(`Callback URL: ${webhook.callbackURL}`);
    console.log(`Model ID: ${webhook.idModel}`);
    console.log(`Description: ${webhook.description}`);
    console.log(`Active: ${webhook.active}`);
    
    console.log('\n📋 Save this webhook ID for future reference:');
    console.log(`WEBHOOK_ID=${webhook.id}`);
    
  } catch (error) {
    console.error('\n❌ Failed to register webhook:');
    console.error(error.message);
    process.exit(1);
  }
}

registerWebhook();