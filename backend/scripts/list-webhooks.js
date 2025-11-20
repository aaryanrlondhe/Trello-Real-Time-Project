#!/usr/bin/env node

/**
 * Script to list all registered webhooks
 */

require('dotenv').config();
const trelloService = require('../services/trelloService');

async function listWebhooks() {
  try {
    console.log('Fetching registered webhooks...');
    
    const webhooks = await trelloService.getWebhooks();
    
    if (webhooks.length === 0) {
      console.log('\n📋 No webhooks registered.');
      return;
    }
    
    console.log(`\n📋 Found ${webhooks.length} webhook(s):`);
    console.log(''.padEnd(80, '='));
    
    webhooks.forEach((webhook, index) => {
      console.log(`\n${index + 1}. Webhook ID: ${webhook.id}`);
      console.log(`   Callback URL: ${webhook.callbackURL}`);
      console.log(`   Model ID: ${webhook.idModel}`);
      console.log(`   Description: ${webhook.description || 'N/A'}`);
      console.log(`   Active: ${webhook.active ? '✅' : '❌'}`);
    });
    
    console.log('\n' + ''.padEnd(80, '='));
    console.log('\nTo delete a webhook, use: node scripts/delete-webhook.js <WEBHOOK_ID>');
    
  } catch (error) {
    console.error('\n❌ Failed to fetch webhooks:');
    console.error(error.message);
    process.exit(1);
  }
}

listWebhooks();