# 🚀 Quick Start Guide: Deploy to Vercel in 5 Minutes

## ⚡ TL;DR - The Fast Path

### 1. **Get Trello Credentials** (2 min)
- Go to https://trello.com/app-key
- Copy your **API Key**
- Generate **API Token**: https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=Server%20Token&key={YOUR_API_KEY}

### 2. **Push to GitHub** (1 min)
```bash
git push origin main
```

### 3. **Deploy to Vercel** (1 min)
- Go to https://vercel.com/new
- Import your GitHub repository
- Click "Deploy"
- After deployment, go to **Settings → Environment Variables**
- Add these variables:
  ```
  TRELLO_API_KEY=your_api_key
  TRELLO_API_TOKEN=your_token
  CORS_ORIGIN=https://your-project.vercel.app
  NODE_ENV=production
  ```
- Redeploy with new environment variables

### 4. **Test It** (1 min)
Visit: `https://your-project.vercel.app`

✅ **Done!** Your app is live!

---

## 📋 Detailed Steps with Screenshots

### Step 1: Get Trello API Credentials

#### Get API Key:
1. Visit: https://trello.com/app-key
2. You'll see your **API Key** at the top
3. Copy it somewhere safe

#### Get API Token:
1. Go to: https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=Server%20Token&key={YOUR_API_KEY}
   - Replace `{YOUR_API_KEY}` with your actual API key
2. Click "Authorize"
3. You'll see your **Token**
4. Copy it somewhere safe

**Example credentials (DO NOT USE - for reference only):**
```
API Key: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
Token: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z
```

### Step 2: Prepare Your Local Repository

```bash
# Navigate to your project
cd /Users/shrushtiparkar/Documents/Trello\ Real-time\ WebSockets\ \+\ API\ Frontend\ Assignment

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Create Vercel Account & Connect Repository

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Select your repository
5. Click "Import"

### Step 4: Configure Vercel Project Settings

The system will auto-detect settings, but verify:

- **Framework**: Should show "Create React App" or "React"
- **Root Directory**: `./`
- **Build Command**: 
  ```
  npm run build:frontend
  ```
- **Output Directory**: 
  ```
  frontend/build
  ```
- **Install Command**: (default is fine)

Click **Save**

### Step 5: Add Environment Variables

**IMPORTANT**: Do this BEFORE first deployment or after initial deploy:

1. In Vercel Dashboard → Your Project → **Settings**
2. Click **Environment Variables**
3. Add these variables (select Production environment):

| Key | Value | Example |
|-----|-------|---------|
| `TRELLO_API_KEY` | Your Trello API Key | `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6` |
| `TRELLO_API_TOKEN` | Your Trello Token | `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7...` |
| `CORS_ORIGIN` | Your Vercel URL | `https://myproject.vercel.app` |
| `NODE_ENV` | production | `production` |

4. Click "Save"

### Step 6: Deploy

- If already deployed: Go to **Deployments** → Click the latest deployment → **Redeploy**
- Or click **Deploy** button

**Wait for deployment to complete** (usually 2-3 minutes)

### Step 7: Test Your Deployment

1. Deployment complete! Go to: `https://your-project.vercel.app`
2. You should see your Trello board UI
3. Try creating a task - it should work!
4. Open two browser windows and test real-time sync (may require WebSocket support)

---

## ✅ Deployment Checklist

- [ ] Got Trello API Key & Token
- [ ] Repository pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported in Vercel
- [ ] Environment variables added
- [ ] Deployment completed successfully
- [ ] Frontend loads without 404 errors
- [ ] Can view the board
- [ ] API health check works: `https://your-project.vercel.app/api/health`
- [ ] Can create/update/delete tasks

---

## 🔗 API Endpoints (After Deployment)

Your API is now available at: `https://your-project.vercel.app/api/`

### Test API Endpoints:

**Health Check:**
```bash
curl https://your-project.vercel.app/api/health
```

**Get Board:**
```bash
curl https://your-project.vercel.app/api/boards/{BOARD_ID}
```

**Create Task:**
```bash
curl -X POST https://your-project.vercel.app/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "boardId": "YOUR_BOARD_ID",
    "listId": "YOUR_LIST_ID",
    "name": "Test Task",
    "desc": "Test Description"
  }'
```

---

## 🐛 Troubleshooting

### Issue: Deployment Failed
- Check build logs in Vercel dashboard
- Ensure `frontend/build/index.html` exists
- Check for Node version compatibility

### Issue: 404 on Frontend Routes
- Vercel auto-configures rewrites for React apps
- If not working, check `vercel.json` exists

### Issue: API Returning 404
- Verify environment variables are set
- Check `api/index.js` exists
- Look at function logs in Vercel dashboard

### Issue: CORS Errors
- Verify `CORS_ORIGIN` is set to your Vercel URL
- Ensure it's set in Production environment

### Issue: Tasks Not Creating
- Check Trello API Key & Token are correct
- Verify board ID is valid
- Check backend logs for errors

### Issue: Real-time Updates Not Working
- WebSocket support is limited on Vercel Functions
- The app will still work with polling
- For full real-time, consider Vercel Pro with WebSocket support

---

## 📊 What's Deployed

```
Vercel Project: your-project
├── Frontend (React)
│   ├── Hosted at: https://your-project.vercel.app
│   ├── Static files served from CDN
│   ├── Auto-scaling
│   └── HTTPS enabled
│
└── Backend (Node.js API)
    ├── Hosted at: https://your-project.vercel.app/api/*
    ├── Serverless Functions
    ├── Auto-scaling
    └── Environment variables secure
```

---

## 🎯 What's Next?

### Register Webhook for Real-time Updates (Optional)

Once deployed, you can set up Trello webhooks:

```bash
curl -X POST \
  "https://api.trello.com/1/webhooks/?key=YOUR_API_KEY&token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"callbackURL\": \"https://your-project.vercel.app/api/webhooks/trello\",
    \"idModel\": \"YOUR_BOARD_ID\",
    \"description\": \"Production Webhook\"
  }"
```

### Monitor Deployment

- Check Vercel Dashboard for logs
- Monitor performance metrics
- Set up alerts for errors

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records per Vercel instructions

---

## 📞 Support

If you encounter issues:

1. Check Vercel Logs: Dashboard → Deployments → Click deployment → Logs
2. Check Frontend Console: Browser DevTools → Console
3. Check Environment Variables: Dashboard → Settings → Environment Variables
4. Refer to full deployment guide: `VERCEL_DEPLOYMENT.md`

---

## 🎉 Success!

Your Trello Real-time application is now deployed! 🚀

**Visit**: https://your-project.vercel.app
