# Vercel Deployment - Visual Step-by-Step Guide

## 🎯 Overview

Your project has two parts to deploy:
- **Backend** (Node.js + Express + Socket.IO) → `backend/` folder
- **Frontend** (React) → `frontend/` folder

---

## 📚 Deployment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      STEP 1: GitHub Setup                   │
│              Push your code to GitHub repository            │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│              STEP 2: Deploy Backend Service                 │
│  - Import GitHub repo into Vercel                           │
│  - Set root directory to: backend                           │
│  - Add Trello API credentials as env variables              │
│  - Deploy and note the URL                                  │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│              STEP 3: Deploy Frontend Service                │
│  - Import same GitHub repo into Vercel (new project)        │
│  - Set root directory to: frontend                          │
│  - Add Backend URL as environment variables                 │
│  - Deploy and note the URL                                  │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│            STEP 4: Final Configuration                      │
│  - Update Backend CORS_ORIGIN to Frontend URL               │
│  - Verify both services are communicating                   │
│  - Test real-time features                                  │
└────────────────┬────────────────────────────────────────────┘
                 │
        ✅ Deployment Complete!
```

---

## 🔧 Detailed Steps

### STEP 1: Prepare Code for GitHub

1. **Open Terminal**
   ```bash
   cd "/Users/shrushtiparkar/Documents/Trello Real-time WebSockets + API Frontend Assignment"
   ```

2. **Initialize Git** (if not already initialized)
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Trello Real-time App - ready for deployment"
   ```

3. **Create GitHub Repository**
   - Go to https://github.com/new
   - Create repository (name: `trello-realtime-app` or your choice)
   - **Do NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

4. **Connect Local Repository to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

✅ **Result:** Your code is now on GitHub

---

### STEP 2: Get Trello Credentials

**You'll need these for the backend:**

1. Go to: https://trello.com/app-key
2. You'll see your **API Key** (long alphanumeric string)
3. Click **"Token"** link in blue
4. Generate and copy your **API Token** (another long string)
5. **Save both values** - you'll need them for Vercel

Example format:
```
API Key:   a1b2c3d4e5f6g7h8i9j0
API Token: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```

✅ **Result:** You have your Trello credentials ready

---

### STEP 3: Deploy Backend Service

#### 3.1: Create Vercel Account & Project

1. Go to: https://vercel.com
2. Click **"Sign Up"** (or Sign In if you have an account)
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub repositories
5. You'll be redirected to Vercel Dashboard

#### 3.2: Import Your Repository

1. Click **"New Project"** (or "Add New..." > "Project")
2. Click **"Import Git Repository"**
3. Search for your repository name
4. Click the repository to select it

#### 3.3: Configure Backend Project

1. You'll see a configuration screen
2. Under **"Project Settings"**:
   - Look for **"Root Directory"**
   - Change it from `.` to `backend`
   - Leave other settings as default

3. Click **"Deploy"** button
4. Wait for deployment to complete (2-3 minutes)
5. When done, you'll see a success page with a URL like:
   ```
   https://trello-backend-xxxxx.vercel.app
   ```
   **Copy and save this URL** - you'll need it for the frontend

#### 3.4: Add Environment Variables

1. After deployment, click on your project name to go to project dashboard
2. Go to **Settings** (top navigation)
3. Click **"Environment Variables"** (left sidebar)
4. Add each variable by clicking **"Add New"**:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `TRELLO_API_KEY` | [Your API Key from Step 2] | Production |
   | `TRELLO_API_TOKEN` | [Your API Token from Step 2] | Production |
   | `NODE_ENV` | `production` | Production |
   | `CORS_ORIGIN` | `https://[leave blank for now]` | Production |

5. After adding variables, go to **Deployments** tab
6. Click the **"•••"** menu on latest deployment
7. Click **"Redeploy"** to apply environment variables
8. Wait for redeployment (1-2 minutes)

✅ **Result:** Backend is deployed and accessible

---

### STEP 4: Deploy Frontend Service

#### 4.1: Create Frontend Project in Vercel

1. Go back to Vercel Dashboard: https://vercel.com/dashboard
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Select the **same repository** you used for backend

#### 4.2: Configure Frontend Project

1. Under **"Root Directory"**, change it to `frontend`
2. Vercel should auto-detect **React** as the framework
3. Leave other settings as default
4. Click **"Deploy"**
5. Wait for deployment (3-5 minutes)
6. When done, you'll see a URL like:
   ```
   https://trello-frontend-xxxxx.vercel.app
   ```
   **Copy and save this URL** - you'll need it for backend config

#### 4.3: Add Environment Variables

1. In frontend project, go to **Settings**
2. Click **"Environment Variables"**
3. Add these variables:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `REACT_APP_API_URL` | `https://trello-backend-xxxxx.vercel.app` | Production |
   | `REACT_APP_SOCKET_URL` | `https://trello-backend-xxxxx.vercel.app` | Production |
   | `REACT_APP_ENABLE_REALTIME` | `true` | Production |

   (Replace `trello-backend-xxxxx.vercel.app` with your actual backend URL from Step 3)

4. Go to **Deployments** tab
5. Click **"•••"** menu on latest deployment
6. Click **"Redeploy"** to apply environment variables
7. Wait for redeployment (1-2 minutes)

✅ **Result:** Frontend is deployed and connected to backend

---

### STEP 5: Complete Backend Configuration

#### 5.1: Update CORS Origin

1. Go back to your **Backend project** in Vercel
2. Go to **Settings** > **Environment Variables**
3. Find `CORS_ORIGIN` variable
4. Edit it and set value to your **Frontend URL**:
   ```
   https://trello-frontend-xxxxx.vercel.app
   ```
5. Click **"Save"**

#### 5.2: Redeploy Backend

1. Go to **Deployments** tab
2. Click **"•••"** menu on latest deployment
3. Click **"Redeploy"**
4. Wait for redeployment (1-2 minutes)

✅ **Result:** Backend and Frontend can now communicate

---

## 🧪 Testing Your Deployment

### Test 1: Backend Health Check

1. Open your backend URL in a browser:
   ```
   https://trello-backend-xxxxx.vercel.app/health
   ```
2. You should see:
   ```json
   {"status":"OK","timestamp":"2024-01-01T12:00:00.000Z"}
   ```
   ✅ Backend is working!

### Test 2: Frontend Loads

1. Open your frontend URL in a browser:
   ```
   https://trello-frontend-xxxxx.vercel.app
   ```
2. You should see the colorful Trello app interface
3. Open DevTools (F12)
4. Go to **Console** tab
5. You should see: `Socket connected: [socket-id]`
   ✅ Frontend is connected to backend!

### Test 3: Real-time Functionality

1. In the frontend, select or create a board
2. Create a new card
3. The card should:
   - Appear immediately on the screen
   - Show in the list
   - Persist when you refresh the page
4. ✅ Real-time features are working!

### Test 4: Cross-Browser Real-time

1. **Open frontend in two separate browser windows**
2. In **Window 1**: Create a new card
3. In **Window 2**: You should see the card appear automatically (within 2-3 seconds)
4. In **Window 2**: Update the card title
5. In **Window 1**: You should see the update automatically
   ✅ Real-time sync works!

---

## 🆘 Troubleshooting

### Issue: "Cannot GET /health" (404 error)

**Solution:**
- Backend didn't deploy correctly
- Check backend logs: In Vercel dashboard, go to Deployments > Click failed deployment > View logs
- Ensure `backend/server.js` has no errors
- Verify `backend/package.json` has all required dependencies

### Issue: Frontend shows blank page

**Solution:**
- Check browser console for errors (F12 > Console)
- Verify environment variables:
  - `REACT_APP_API_URL` should be your backend URL
  - `REACT_APP_SOCKET_URL` should be your backend URL
- Try: Ctrl+Shift+Delete (clear cache) then refresh page

### Issue: "Cannot connect to WebSocket"

**Solution:**
- Ensure backend `CORS_ORIGIN` matches frontend URL exactly
- Redeploy backend after updating CORS
- Socket.IO will fallback to polling if WebSocket fails
- If still failing, check Vercel plan (Free tier may have limitations)

### Issue: API calls show "CORS error"

**Solution:**
1. Go to backend project in Vercel
2. Settings > Environment Variables
3. Check `CORS_ORIGIN` = your frontend URL
4. If not correct, update it
5. Redeploy backend

### Issue: Cards don't sync in real-time

**Solution:**
- Check browser console for connection errors
- Verify both `REACT_APP_API_URL` and `REACT_APP_SOCKET_URL` point to backend
- Redeploy frontend with correct environment variables
- Wait 2-3 seconds for socket connection to establish

---

## 📱 Your Deployment URLs

After successful deployment, save these URLs:

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | https://trello-frontend-xxxxx.vercel.app | ✅ |
| Backend | https://trello-backend-xxxxx.vercel.app | ✅ |
| GitHub | https://github.com/YOUR_USERNAME/YOUR_REPO | ✅ |
| Vercel Dashboard | https://vercel.com/dashboard | ✅ |

---

## 📊 What's Deployed

### Frontend Service
- React application
- Real-time board UI
- WebSocket client
- API client for REST calls

### Backend Service
- Express.js server
- Socket.IO for real-time updates
- REST API for boards and tasks
- Trello integration

---

## 🚀 Next Steps

1. **Share your deployment**: Send the frontend URL to others
2. **Set up Trello webhooks**: For even more real-time updates
3. **Monitor your application**: Check logs regularly
4. **Keep dependencies updated**: Update npm packages monthly
5. **Scale if needed**: Upgrade Vercel plan when needed

---

## ❓ FAQ

**Q: Do I need to pay for Vercel?**  
A: No, the free tier is sufficient for this project.

**Q: How long does deployment take?**  
A: Usually 3-5 minutes per service for first deployment.

**Q: Can I use custom domain?**  
A: Yes, after deployment, go to project settings to add custom domain.

**Q: Will my data persist?**  
A: The app currently stores data in memory. For persistent storage, add a database.

**Q: How do I update my app after deployment?**  
A: Just push changes to GitHub. Vercel automatically redeployes.

---

**Successfully deployed? Congratulations! 🎉**

For more details, see `VERCEL_DEPLOYMENT_COMPLETE.md`
