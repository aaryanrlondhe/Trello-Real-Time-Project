# 🚀 Step-by-Step Vercel Deployment Guide

Follow these exact steps to deploy your Trello Real-time app to Vercel.

---

## ⏱️ Total Time Required: ~45 minutes

---

## 🔧 Step 1: Prerequisites (5 minutes)

### 1.1 Install Git (if not already installed)
```bash
# Check if git is installed
git --version

# If not installed, install it from https://git-scm.com/
```

### 1.2 Create GitHub Account
- Go to https://github.com
- Click "Sign up"
- Complete the signup process
- Save your username (you'll need it)

### 1.3 Create Vercel Account
- Go to https://vercel.com
- Click "Sign up"
- Choose "Continue with GitHub"
- Authorize Vercel to access your GitHub

### 1.4 Get Trello API Credentials
- Go to https://trello.com/app-key
- You'll see your **API Key** (copy it)
- Click the blue "Token" link
- Generate and **copy your API Token**
- Save both in a text file for later

**Example format:**
```
API Key: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
Token: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
```

✅ **Step 1 Complete: You have all credentials ready**

---

## 📤 Step 2: Push Your Code to GitHub (10 minutes)

### 2.1 Navigate to Your Project Directory
```bash
cd "/Users/shrushtiparkar/Documents/Trello Real-time WebSockets + API Frontend Assignment"
```

### 2.2 Initialize Git (if not already done)
```bash
git init
```

### 2.3 Add All Files
```bash
git add .
```

### 2.4 Create Initial Commit
```bash
git commit -m "Initial commit: Trello Real-time App - ready for Vercel deployment"
```

### 2.5 Create GitHub Repository
1. Go to https://github.com/new
2. Enter Repository name: `trello-realtime-app` (or your choice)
3. **Leave unchecked**: "Add a README file", "Add .gitignore", "Choose a license"
4. Click **"Create repository"**
5. Copy the URL from "Quick setup" section (looks like `https://github.com/YOUR_USERNAME/trello-realtime-app.git`)

### 2.6 Connect Local Repository to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/trello-realtime-app.git
git branch -M main
git push -u origin main
```

### 2.7 Verify on GitHub
- Go to https://github.com/YOUR_USERNAME/trello-realtime-app
- You should see all your project files
- If you see them, you're good to go! ✅

✅ **Step 2 Complete: Your code is on GitHub**

---

## 🎯 Step 3: Deploy Backend Service (10 minutes)

### 3.1 Create Backend Project on Vercel

1. Go to https://vercel.com/dashboard
2. Click **"New Project"** button (top right)
3. Click **"Import Git Repository"**
4. Search for your repository name: `trello-realtime-app`
5. Click on it to select it

### 3.2 Configure Backend Project

1. You'll see a configuration screen
2. Under **"Configure Project"**:
   - Find **"Root Directory"**
   - Click the dropdown and change it to **`backend`**
   - Leave all other settings as default

3. Click **"Deploy"** button
4. **Wait 2-3 minutes** for deployment to complete
5. You'll see "Congratulations! Your project has been successfully deployed"
6. **Copy and save your backend URL** - it looks like:
   ```
   https://trello-backend-xxxxx.vercel.app
   ```
   (Save this - you'll need it for frontend config)

### 3.3 Add Environment Variables to Backend

1. In the Vercel dashboard, click on your backend project
2. Go to **"Settings"** (top navigation)
3. Click **"Environment Variables"** (left sidebar)
4. You'll see a form to add variables

**Add these 4 environment variables:**

**Variable 1: TRELLO_API_KEY**
- Name: `TRELLO_API_KEY`
- Value: (paste your Trello API Key from Step 1.4)
- Environment: Select **"Production"**
- Click **"Add"**

**Variable 2: TRELLO_API_TOKEN**
- Name: `TRELLO_API_TOKEN`
- Value: (paste your Trello API Token from Step 1.4)
- Environment: Select **"Production"**
- Click **"Add"**

**Variable 3: NODE_ENV**
- Name: `NODE_ENV`
- Value: `production`
- Environment: Select **"Production"**
- Click **"Add"**

**Variable 4: CORS_ORIGIN**
- Name: `CORS_ORIGIN`
- Value: (leave blank for now, you'll update this later)
- Environment: Select **"Production"**
- Click **"Add"**

### 3.4 Redeploy Backend with Environment Variables

1. Go to **"Deployments"** tab (in your project)
2. Find the latest deployment at the top
3. Click the **three dots (•••)** menu on the right
4. Click **"Redeploy"**
5. **Wait 1-2 minutes** for redeployment
6. Verify it says "Deployment successful" ✅

✅ **Step 3 Complete: Backend is deployed**

---

## 🎨 Step 4: Deploy Frontend Service (10 minutes)

### 4.1 Create Frontend Project on Vercel

1. Go to https://vercel.com/dashboard
2. Click **"New Project"** button
3. Click **"Import Git Repository"**
4. Select the **same repository** again: `trello-realtime-app`

### 4.2 Configure Frontend Project

1. Under **"Configure Project"**:
   - Find **"Root Directory"**
   - Change it to **`frontend`**
   - Vercel should auto-detect React framework (it might show automatically)

2. Click **"Deploy"** button
3. **Wait 3-5 minutes** for frontend to build and deploy
4. You'll see "Congratulations! Your project has been successfully deployed"
5. **Copy and save your frontend URL** - it looks like:
   ```
   https://trello-frontend-xxxxx.vercel.app
   ```

### 4.3 Add Environment Variables to Frontend

1. Click on your frontend project
2. Go to **"Settings"** > **"Environment Variables"**

**Add these 3 environment variables:**

**Variable 1: REACT_APP_API_URL**
- Name: `REACT_APP_API_URL`
- Value: (paste your **backend URL** from Step 3.2 - the one you saved)
- Environment: Select **"Production"**
- Click **"Add"**

Example:
```
https://trello-backend-xxxxx.vercel.app
```

**Variable 2: REACT_APP_SOCKET_URL**
- Name: `REACT_APP_SOCKET_URL`
- Value: (paste the **same backend URL** again)
- Environment: Select **"Production"**
- Click **"Add"**

**Variable 3: REACT_APP_ENABLE_REALTIME**
- Name: `REACT_APP_ENABLE_REALTIME`
- Value: `true`
- Environment: Select **"Production"**
- Click **"Add"**

### 4.4 Redeploy Frontend with Environment Variables

1. Go to **"Deployments"** tab
2. Click the three dots (•••) on the latest deployment
3. Click **"Redeploy"**
4. **Wait 2-3 minutes** for redeployment
5. Verify it says "Deployment successful" ✅

✅ **Step 4 Complete: Frontend is deployed**

---

## ⚙️ Step 5: Complete Backend Configuration (5 minutes)

### 5.1 Update CORS Origin

Now that your frontend is deployed, you need to tell the backend to accept requests from it.

1. Go to your **Backend project** in Vercel dashboard
2. Go to **Settings** > **Environment Variables**
3. Find the `CORS_ORIGIN` variable you created earlier
4. Click on it to edit
5. Change the value to your **frontend URL**:
   ```
   https://trello-frontend-xxxxx.vercel.app
   ```
   (Replace with your actual frontend URL from Step 4.2)

6. Click **"Save"**

### 5.2 Redeploy Backend

1. Go to **"Deployments"** tab
2. Click the three dots (•••) on the latest deployment
3. Click **"Redeploy"**
4. **Wait 1-2 minutes** for redeployment
5. Verify it says "Deployment successful" ✅

✅ **Step 5 Complete: Backend and Frontend can now communicate**

---

## 🧪 Step 6: Test Your Deployment (5 minutes)

### 6.1 Test Backend Health

1. In a browser, open your backend URL + `/health`:
   ```
   https://trello-backend-xxxxx.vercel.app/health
   ```
   (Replace with your actual backend URL)

2. You should see this response:
   ```json
   {"status":"OK","timestamp":"2024-01-01T12:00:00.000Z"}
   ```

   ✅ If you see this, backend is working!

### 6.2 Test Frontend Loads

1. Open your frontend URL in a browser:
   ```
   https://trello-frontend-xxxxx.vercel.app
   ```

2. You should see the beautiful colorful Trello app interface

3. Open browser DevTools by pressing **F12**

4. Go to the **Console** tab

5. You should see a message like:
   ```
   Socket connected: abc123xyz...
   ```

   ✅ If you see this, WebSocket connection is working!

### 6.3 Test Real-time Functionality

1. In the frontend, select a board from the dropdown (or create one)

2. Click **"Add Card"** button and create a card with any title

3. The card should appear immediately on the board

4. Refresh the page (F5) - the card should still be there

   ✅ If this works, real-time features are working!

### 6.4 Test Real-time Sync (Advanced)

1. **Open your frontend URL in TWO different browser windows**

2. In **Window 1**: Select the same board

3. In **Window 2**: Select the same board

4. In **Window 1**: Create a new card with title "Test Card"

5. Wait 2-3 seconds

6. In **Window 2**: The card should appear automatically

   ✅ If the card appears in both windows, real-time sync is working!

✅ **Step 6 Complete: Everything is working!**

---

## 📊 Summary of Your Deployment

You should now have:

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | https://trello-frontend-xxxxx.vercel.app | ✅ Live |
| Backend | https://trello-backend-xxxxx.vercel.app | ✅ Live |
| Real-time Sync | Working across browsers | ✅ Live |
| GitHub Repo | https://github.com/YOUR_USERNAME/trello-realtime-app | ✅ Saved |

---

## 🎉 Congratulations! Your App is Live!

Your Trello Real-time app is now deployed and accessible from anywhere!

### Share Your App
- Send the frontend URL to anyone to use your app
- Example: "Check out my app at https://trello-frontend-xxxxx.vercel.app"

---

## 🆘 Troubleshooting Common Issues

### Issue 1: Backend shows "Cannot GET /health" (404 error)

**Solution:**
- Backend didn't deploy correctly
- Go to Vercel dashboard > Backend project > Deployments
- Look for error messages in the latest deployment
- Check that `backend/package.json` exists
- Click "Redeploy" on the last successful deployment

### Issue 2: Frontend shows blank page

**Solution:**
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Look for error messages in red
4. Common causes:
   - Environment variables not set correctly
   - Backend URL is wrong
   - Try: Ctrl+Shift+Delete to clear cache, then refresh

### Issue 3: "Cannot connect to backend" error in console

**Solution:**
1. Check frontend environment variables:
   - `REACT_APP_API_URL` should be your backend URL
   - `REACT_APP_SOCKET_URL` should be your backend URL
2. Check backend CORS_ORIGIN:
   - Should match your frontend URL exactly
3. Redeploy backend after updating CORS

### Issue 4: Cards don't sync in real-time

**Solution:**
1. Check browser console for errors (F12 > Console)
2. Look for "Socket connected" message
3. Verify both URLs in frontend environment variables
4. Try refreshing the page
5. Wait 2-3 seconds for socket connection

### Issue 5: CORS errors in browser console

**Solution:**
1. Go to backend project settings > Environment Variables
2. Check `CORS_ORIGIN` = your frontend URL
3. If wrong, update it
4. Go to Deployments > Redeploy
5. Wait for redeployment to complete

---

## 📝 Quick Reference

### Your Project URLs
```
Frontend: https://trello-frontend-xxxxx.vercel.app
Backend: https://trello-backend-xxxxx.vercel.app
```

### Important Environment Variables

**Backend (set in Vercel):**
- `TRELLO_API_KEY` = your Trello key
- `TRELLO_API_TOKEN` = your Trello token
- `CORS_ORIGIN` = your frontend URL
- `NODE_ENV` = production

**Frontend (set in Vercel):**
- `REACT_APP_API_URL` = your backend URL
- `REACT_APP_SOCKET_URL` = your backend URL
- `REACT_APP_ENABLE_REALTIME` = true

### Root Directories
- Backend project: `backend/`
- Frontend project: `frontend/`

---

## ✅ Success Checklist

- [ ] GitHub account created
- [ ] Code pushed to GitHub
- [ ] Trello API credentials obtained
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables set
- [ ] Backend CORS_ORIGIN updated
- [ ] Backend redeployed
- [ ] Health endpoint tested (/health)
- [ ] Frontend loads without errors
- [ ] Socket connection shows in console
- [ ] Can create cards
- [ ] Cards sync in real-time
- [ ] No errors in console

---

## 🚀 What's Next?

After deployment is working:

### Optional: Monitor Your App
- Check logs regularly: https://vercel.com/dashboard
- Look for errors in deployments
- Keep an eye on usage

### Optional: Set Up Custom Domain
- In Vercel project settings
- Add your own domain name
- No additional cost

### Optional: Set Up Trello Webhooks
- For even more real-time updates from Trello
- See backend/scripts/register-webhook.js
- Requires running a script locally

### Optional: Add Database
- Currently stores data in memory (lost on restart)
- To keep data forever, add MongoDB or PostgreSQL
- More advanced setup needed

---

## 📞 Need Help?

### Check Vercel Logs
```bash
# Install Vercel CLI
npm install -g vercel

# View backend logs
vercel logs [backend-project-name] --follow

# View frontend logs
vercel logs [frontend-project-name] --follow
```

### Common Resources
- Vercel Support: https://vercel.com/support
- Vercel Docs: https://vercel.com/docs
- Socket.IO Docs: https://socket.io/docs/

---

## 🎊 You Did It!

Your Trello Real-time app is now live on Vercel!

Bookmark these URLs:
- **Frontend:** ___________________________________
- **Backend:** ___________________________________

Share with friends and celebrate! 🎉

