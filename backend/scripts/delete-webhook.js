#!/usr/bin/env node

/**
 * Script to delete a Trello webhook
 * Usage: node scripts/delete-webhook.js <WEBHOOK_ID>
 */

require('dotenv').config();
const trelloService = require('../services/trelloService');

async function deleteWebhook() {
  try {
    const webhookId = process.argv[2];
    
    if (!webhookId) {
      console.error('Usage: node scripts/delete-webhook.js <WEBHOOK_ID>');
      console.error('Example: node scripts/delete-webhook.js 64a1b2c3d4e5f6789abcdef0');
      process.exit(1);
    }
    
    console.log(`Deleting webhook: ${webhookId}`);
    
    await trelloService.deleteWebhook(webhookId);
    
    console.log('\n✅ Webhook deleted successfully!');
    
  } catch (error) {
    console.error('\n❌ Failed to delete webhook:');
    console.error(error.message);
    process.exit(1);
  }
}

deleteWebhook();