# 🔑 TRELLO CREDENTIALS SETUP GUIDE

## Current Status
- Backend: ✅ Running on port 5001
- Frontend: ✅ Running on port 3000
- Trello Integration: ⚠️ TEST MODE (using placeholder credentials)

## How to Enable Real Trello Integration

### Step 1: Get Your Trello API Key
1. Go to: **https://trello.com/app-key**
2. You'll see your **API Key** displayed (32 character string)
3. Copy this key

### Step 2: Generate Your Trello API Token
1. On the same page (https://trello.com/app-key), find the **Token** section
2. Click the **Token** link (blue text)
3. Authorize the application when prompted
4. Copy the **Token** (long string, about 64 characters)

### Step 3: Update Your .env File

Open: `backend/.env`

Find these lines:
```properties
TRELLO_API_KEY=your_api_key_here
TRELLO_API_TOKEN=your_api_token_here
TEST_MODE=true
```

Replace with your actual credentials:
```properties
TRELLO_API_KEY=da5c10a4d15e4aca0d6fe0347f7384ce
TRELLO_API_TOKEN=4c4cb85eee987e035ecba1d2f2d6d8b81b8bc939709bc70e310002ca7f5152fd
TEST_MODE=false
```

### Step 4: Restart Backend Server

Kill the existing backend process and restart:
```bash
cd backend
npm run dev
```

### Step 5: Verify Connection

The backend should now say:
```
✓ Trello API configured with valid credentials
```

Instead of:
```
⚠️  TEST MODE ENABLED - Using mock data instead of Trello API
```

## What Changes After Adding Real Credentials

### ✅ Now Works with Real Trello
- Creating boards creates them in your Trello account
- Creating cards adds them to real Trello boards
- Updating cards updates your Trello cards
- Deleting cards archives them in Trello
- All data persists in Trello

### Test It Out
1. Open http://localhost:3000
2. Create a new board - it will appear in your Trello account
3. Create cards - they will appear in your Trello board
4. Refresh - changes will sync in real-time

## Troubleshooting

### Getting 401 Errors?
- Your API key or token is invalid
- Visit https://trello.com/app-key again
- Generate a new token
- Make sure you didn't accidentally add spaces

### Credentials Still Show as TEST MODE?
1. Check .env file is saved correctly
2. Make sure TEST_MODE=false (not true)
3. Restart the backend: `npm run dev`
4. Check terminal output for "✓ Trello API configured"

### Don't See Your Boards?
1. Make sure credentials are correct
2. Verify you have at least one open board in Trello
3. Check browser console for errors
4. Restart both frontend and backend

## Command Line Test

To test your credentials from command line:
```bash
cd backend
node test-trello-api.js
```

This will verify your credentials and test API connectivity.

## Security Note

⚠️ **Important**: Never commit your `.env` file with real credentials to public repositories!

Make sure `.env` is in your `.gitignore` file.

## Need Help?

- Trello API Docs: https://developer.trello.com/
- API Key Page: https://trello.com/app-key
- OAuth: https://developer.trello.com/docs/getting-started
