# 5-Minute Quick Start: Deploy to Vercel

## Option A: Using Vercel Dashboard (Recommended for Beginners)

### Step 1: Push to GitHub
```bash
# Navigate to your project directory
cd "/Users/shrushtiparkar/Documents/Trello Real-time WebSockets + API Frontend Assignment"

# Initialize git and push to GitHub
git init
git add .
git commit -m "Initial commit: Ready for Vercel deployment"
git branch -M main

# Create new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Deploy Backend
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project" → Import your GitHub repo
3. Change "Root Directory" to `backend`
4. Click "Deploy"
5. After deployment, note the URL (e.g., `https://trello-backend-xxxxx.vercel.app`)
6. Go to Settings → Environment Variables and add:
   ```
   TRELLO_API_KEY = [get from https://trello.com/app-key]
   TRELLO_API_TOKEN = [get from https://trello.com/app-key]
   CORS_ORIGIN = https://[frontend-url] (you'll update this later)
   NODE_ENV = production
   ```
7. Click "Redeploy" button

### Step 3: Deploy Frontend
1. Click "New Project" → Import the same GitHub repo
2. Change "Root Directory" to `frontend`
3. Click "Deploy"
4. After deployment, note the URL (e.g., `https://trello-frontend-xxxxx.vercel.app`)
5. Go to Settings → Environment Variables and add:
   ```
   REACT_APP_API_URL = https://[your-backend-url]
   REACT_APP_SOCKET_URL = https://[your-backend-url]
   REACT_APP_ENABLE_REALTIME = true
   ```
6. Click "Redeploy" button

### Step 4: Update Backend CORS
1. Go to your Backend project settings on Vercel
2. Settings → Environment Variables
3. Edit `CORS_ORIGIN` = `https://[your-frontend-url]`
4. Click "Redeploy" button

### Step 5: Test
1. Open your frontend URL
2. Select a board
3. Create a card → should see it appear in real-time ✅

---

## Option B: Using Vercel CLI (Advanced)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy backend
cd backend
vercel --prod

# Copy the backend URL from output

# 4. Deploy frontend
cd ../frontend
vercel --prod

# 5. Update both projects with environment variables
# (Use Vercel Dashboard for this)
```

---

## Troubleshooting

### "Cannot connect to backend" error
- ✅ Verify `REACT_APP_API_URL` is set to your backend URL
- ✅ Verify backend `CORS_ORIGIN` matches your frontend URL
- ✅ Check backend is running: Visit `/health` endpoint

### "WebSocket connection failed"
- ✅ Some Vercel plans don't support WebSocket - upgrade to Pro if needed
- ✅ Check that Socket.IO is configured correctly
- ✅ Fallback to polling should still work

### "404 on API calls"
- ✅ Verify backend URL is correct
- ✅ Check routes are defined in `backend/routes/`

---

## Your Project URLs (After Deployment)

**Frontend:** https://your-frontend.vercel.app  
**Backend:** https://your-backend.vercel.app

---

## Important Notes

- **First-time setup usually takes 5-10 minutes**
- **Vercel Free tier is sufficient** for this project
- **WebSocket support requires checking your Vercel plan**
- **Every git push automatically triggers redeployment**

---

## Next: Set Up Trello Webhooks (Optional)

For real-time updates from Trello:

```bash
cd backend
TRELLO_API_KEY=your_key TRELLO_API_TOKEN=your_token \
  WEBHOOK_URL=https://your-backend.vercel.app/api/webhooks/trello \
  node scripts/register-webhook.js
```

---

**Need more details?** See `VERCEL_DEPLOYMENT_COMPLETE.md` for comprehensive guide.
