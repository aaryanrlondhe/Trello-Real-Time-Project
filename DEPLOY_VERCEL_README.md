# 🚀 Vercel Deployment - Complete Guide

Your Trello Real-time App is ready to deploy! This directory contains everything you need.

## 📖 Quick Navigation

Choose your deployment path based on your experience:

### 👶 **New to Vercel? Start Here**
1. Read: **[VERCEL_VISUAL_GUIDE.md](./VERCEL_VISUAL_GUIDE.md)** - Visual step-by-step with screenshots
2. Follow: **[DEPLOY_QUICK_START.md](./DEPLOY_QUICK_START.md)** - 5-minute quick start
3. Use: **[VERCEL_DEPLOYMENT_CHECKLIST.md](./VERCEL_DEPLOYMENT_CHECKLIST.md)** - As you deploy

### 🚀 **Experienced with Vercel? Quick Reference**
- Command-line deployment: Run `./deploy-to-vercel.sh`
- Detailed guide: See **[VERCEL_DEPLOYMENT_COMPLETE.md](./VERCEL_DEPLOYMENT_COMPLETE.md)**

### 📚 **Need Everything? Comprehensive**
- Full documentation: **[VERCEL_DEPLOYMENT_COMPLETE.md](./VERCEL_DEPLOYMENT_COMPLETE.md)**
- Troubleshooting: **[VERCEL_VISUAL_GUIDE.md](./VERCEL_VISUAL_GUIDE.md)** (includes FAQ)

---

## 📋 What You'll Deploy

### Architecture
```
┌─────────────────────────────────┐
│   Frontend (React)              │
│   - User Interface              │
│   - Real-time board display     │
│   - WebSocket connection        │
│   Deployed to: Vercel           │
└────────────────┬────────────────┘
                 │
                 │ API Calls & WebSocket
                 │
┌────────────────▼────────────────┐
│   Backend (Node.js/Express)     │
│   - REST API                    │
│   - Socket.IO server            │
│   - Board & Task management     │
│   Deployed to: Vercel           │
└────────────────┬────────────────┘
                 │
                 │ External APIs
                 │
        ┌────────▼──────────┐
        │   Trello API      │
        │   (Optional)      │
        └───────────────────┘
```

---

## ✅ Pre-Deployment Checklist

Before you start, verify you have:

- [ ] **GitHub Account** - Go to https://github.com
- [ ] **Vercel Account** - Go to https://vercel.com (sign up with GitHub)
- [ ] **Trello API Credentials** - Get from https://trello.com/app-key
- [ ] **Git installed** - Check with `git --version`
- [ ] **Internet connection** - For deploying to Vercel

### Get Trello Credentials (2 minutes)

1. Visit: https://trello.com/app-key
2. Copy your **API Key**
3. Click blue "Token" link
4. Generate and copy your **API Token**
5. Save both - you'll need them during deployment

---

## 🚢 Deployment Process

### Step 1: Push to GitHub (5 minutes)
```bash
cd "/Users/shrushtiparkar/Documents/Trello Real-time WebSockets + API Frontend Assignment"

# Initialize git
git init
git add .
git commit -m "Initial commit: Trello real-time app"

# Create GitHub repo, then run:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend (10 minutes)
1. Go to https://vercel.com/dashboard
2. Click "New Project" → Import your GitHub repo
3. Change Root Directory to: `backend`
4. Click "Deploy"
5. After deployment, add environment variables:
   - `TRELLO_API_KEY` = your key
   - `TRELLO_API_TOKEN` = your token
   - `NODE_ENV` = production
   - `CORS_ORIGIN` = (leave blank, update later)
6. Redeploy
7. **Save the backend URL** (e.g., `https://trello-backend-xxxxx.vercel.app`)

### Step 3: Deploy Frontend (10 minutes)
1. In Vercel dashboard, click "New Project"
2. Import the same GitHub repo
3. Change Root Directory to: `frontend`
4. Click "Deploy"
5. After deployment, add environment variables:
   - `REACT_APP_API_URL` = your backend URL from Step 2
   - `REACT_APP_SOCKET_URL` = your backend URL from Step 2
   - `REACT_APP_ENABLE_REALTIME` = true
6. Redeploy
7. **Save the frontend URL** (e.g., `https://trello-frontend-xxxxx.vercel.app`)

### Step 4: Complete Backend Config (5 minutes)
1. Go to backend project settings
2. Update `CORS_ORIGIN` = your frontend URL from Step 3
3. Redeploy

### Step 5: Test (5 minutes)
1. Open your frontend URL
2. Select a board
3. Create a card - should appear in real-time ✅

**Total time: ~35 minutes**

---

## 📚 Documentation Files

| File | Purpose | Time |
|------|---------|------|
| **DEPLOY_QUICK_START.md** | 5-minute quick start | 5 min |
| **VERCEL_VISUAL_GUIDE.md** | Visual step-by-step guide | 20 min |
| **VERCEL_DEPLOYMENT_COMPLETE.md** | Comprehensive documentation | 30 min |
| **VERCEL_DEPLOYMENT_CHECKLIST.md** | Checklist for deployment | Use as you go |

---

## 🆘 Common Issues & Solutions

### "Cannot connect to backend"
→ Check `REACT_APP_API_URL` in frontend environment variables  
→ Verify backend `CORS_ORIGIN` matches frontend URL  
→ Test: Visit backend URL + `/health` in browser

### "WebSocket connection failed"
→ Socket.IO will fallback to polling (should still work)  
→ Upgrade to Vercel Pro if you need guaranteed WebSocket support  
→ Check environment variables are correctly set

### "404 errors on API calls"
→ Verify backend deployed successfully  
→ Check routes exist in `backend/routes/`  
→ Verify API URLs in frontend environment

### "CORS errors"
→ Ensure backend `CORS_ORIGIN` is set to frontend URL  
→ Redeploy backend after updating CORS  
→ Wait 1-2 minutes for deployment to complete

**More troubleshooting:** See section in **[VERCEL_VISUAL_GUIDE.md](./VERCEL_VISUAL_GUIDE.md)**

---

## 🎯 Key Configuration Points

### Environment Variables

#### Backend
```
NODE_ENV = production
TRELLO_API_KEY = [your key]
TRELLO_API_TOKEN = [your token]
CORS_ORIGIN = https://[frontend-url]
```

#### Frontend
```
REACT_APP_API_URL = https://[backend-url]
REACT_APP_SOCKET_URL = https://[backend-url]
REACT_APP_ENABLE_REALTIME = true
```

### Project Structure
```
your-repo/
├── backend/              ← Deploy to Vercel (root directory)
│   ├── server.js
│   ├── package.json
│   ├── routes/
│   └── services/
├── frontend/             ← Deploy to Vercel (root directory)
│   ├── src/
│   ├── package.json
│   └── public/
└── vercel.json          ← Configuration (optional)
```

---

## 🚀 What Happens After Deployment

### Automatic Features
- ✅ Auto-redeployment on git push
- ✅ HTTPS/SSL by default
- ✅ Global CDN distribution
- ✅ Environment variable management
- ✅ Automatic scaling

### What You Get
- Frontend URL: `https://[name].vercel.app`
- Backend URL: `https://[name].vercel.app`
- Custom domains (optional)
- Deployment history
- Environment variable management
- Analytics dashboard

---

## 📞 Support Resources

### Official Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Socket.IO Guide](https://socket.io/docs/)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)

### When You're Stuck
1. Check the error message in console
2. Review troubleshooting section above
3. Check Vercel logs: `vercel logs [project-name]`
4. Search error message on Google/Stack Overflow
5. Contact Vercel support: https://vercel.com/support

---

## 🎓 Learning Resources

After deployment, consider:
- Adding a database (MongoDB, PostgreSQL)
- Custom domain name
- GitHub Actions for CI/CD
- Error tracking (Sentry)
- Analytics
- Authentication system

---

## 📝 Important Notes

### About Data
- Currently stores in-memory (lost on server restart)
- To persist data: Add MongoDB or PostgreSQL
- Trello webhook can sync data from Trello

### About WebSockets
- Vercel Free plan: May have limitations
- Vercel Pro plan: Full WebSocket support
- Fallback to polling available (automatic)

### About Scaling
- Free tier: Perfect for development/testing
- Pro tier: Recommended for production
- Enterprise: For high-traffic applications

---

## ✨ Success Indicators

Your deployment is successful when you see:
1. ✅ Frontend loads without errors
2. ✅ "Socket connected" in browser console
3. ✅ Can create boards and cards
4. ✅ Real-time updates work across windows
5. ✅ No 500 errors in Vercel logs

---

## 🎉 You're Ready!

Choose your guide based on experience level:

- **Just starting?** → Read [VERCEL_VISUAL_GUIDE.md](./VERCEL_VISUAL_GUIDE.md) first
- **Quick deployment?** → Use [DEPLOY_QUICK_START.md](./DEPLOY_QUICK_START.md)
- **Need details?** → See [VERCEL_DEPLOYMENT_COMPLETE.md](./VERCEL_DEPLOYMENT_COMPLETE.md)
- **Checking off items?** → Use [VERCEL_DEPLOYMENT_CHECKLIST.md](./VERCEL_DEPLOYMENT_CHECKLIST.md)

---

**Questions?** Each guide has a troubleshooting section. Good luck! 🚀
