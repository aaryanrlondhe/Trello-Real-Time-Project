# 🔗 Webhook Setup Guide

This guide will help you set up Trello webhooks for real-time updates in your application.

## 📋 Prerequisites

1. **Trello API Credentials**: You need a Trello API key and token
   - Get your API key: https://trello.com/app-key
   - Get your token: https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=Server%20Token&key={YOUR_API_KEY}

2. **Public Callback URL**: Trello needs to send webhooks to a publicly accessible HTTPS URL

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

Run the interactive setup script:

```bash
cd backend
node scripts/setup-webhooks.js
```

This script will:
- ✅ Verify your Trello API credentials
- ✅ Test your webhook endpoint
- ✅ Show you available Trello boards
- ✅ Register the webhook automatically
- ✅ Update your .env file

### Option 2: Manual Setup

#### Step 1: Set up a public URL

**For Development (using ngrok):**
```bash
# Install ngrok
brew install ngrok

# Start your backend server
cd backend
npm start

# In another terminal, expose your server
ngrok http 5000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

**For Production:**
Use your deployed server URL (e.g., https://your-app.herokuapp.com)

#### Step 2: Update your .env file

```bash
# Update backend/.env
WEBHOOK_CALLBACK_URL=https://your-ngrok-url.ngrok.io/api/webhooks/trello
```

#### Step 3: Register the webhook

```bash
cd backend

# List your boards to get a Board ID
node scripts/list-webhooks.js

# Register webhook for a specific board
node scripts/register-webhook.js https://your-ngrok-url.ngrok.io/api/webhooks/trello YOUR_BOARD_ID
```

## 🧪 Testing Your Setup

1. **Start your application:**
   ```bash
   # Start backend
   cd backend
   npm start

   # Start frontend (in another terminal)
   cd frontend
   npm start
   ```

2. **Make changes in Trello:**
   - Add a new card
   - Move a card between lists
   - Update card details

3. **Check your server logs** for webhook events

4. **Verify real-time updates** in your frontend application

## 🔍 Troubleshooting

### Common Issues:

**Webhook not receiving events:**
- ✅ Ensure your callback URL is publicly accessible
- ✅ Trello requires HTTPS for webhooks
- ✅ Check your server logs for errors
- ✅ Verify the webhook is still active: `node scripts/list-webhooks.js`

**ngrok session expired:**
- ✅ Restart ngrok to get a new URL
- ✅ Update your .env file with the new URL
- ✅ Re-register the webhook with the new URL

**CORS errors:**
- ✅ Make sure CORS_ORIGIN in .env matches your frontend URL

### Useful Commands:

```bash
# List all registered webhooks
node scripts/list-webhooks.js

# Delete a webhook
node scripts/delete-webhook.js WEBHOOK_ID

# Register a new webhook
node scripts/register-webhook.js CALLBACK_URL BOARD_ID
```

## 📱 Production Deployment

For production, you'll need:

1. **Deploy your backend** to a cloud service (Heroku, Railway, DigitalOcean, etc.)
2. **Get your production URL** (e.g., https://your-app.herokuapp.com)
3. **Update your .env** with the production callback URL
4. **Re-register webhooks** for production

Example production webhook URL:
```
WEBHOOK_CALLBACK_URL=https://your-app.herokuapp.com/api/webhooks/trello
```

## 🎯 Next Steps

Once webhooks are set up:
1. Test real-time functionality
2. Monitor webhook events in server logs
3. Implement any custom webhook event handling
4. Set up production webhooks when deploying