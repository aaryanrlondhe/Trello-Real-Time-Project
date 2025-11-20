# 🚀 Vercel Deployment - Quick Reference Card

## One-Page Cheat Sheet

---

## 🎯 3-Step Deployment

### Step 1: Prepare
```bash
# Push to GitHub
git add .
git commit -m "Ready for Vercel"
git push origin main
```
Get credentials: https://trello.com/app-key

### Step 2: Deploy Backend
1. https://vercel.com/dashboard → New Project
2. Select your repo → Root Directory: `backend`
3. Add Environment Variables:
   - `TRELLO_API_KEY` = your key
   - `TRELLO_API_TOKEN` = your token
   - `NODE_ENV` = production
4. Deploy
5. Copy backend URL: `https://trello-backend-xxxxx.vercel.app`

### Step 3: Deploy Frontend
1. https://vercel.com/dashboard → New Project
2. Select your repo → Root Directory: `frontend`
3. Add Environment Variables:
   - `REACT_APP_API_URL` = backend URL from Step 2
   - `REACT_APP_SOCKET_URL` = backend URL from Step 2
   - `REACT_APP_ENABLE_REALTIME` = true
4. Deploy
5. Copy frontend URL: `https://trello-frontend-xxxxx.vercel.app`

### Step 4: Update Backend CORS
1. Backend project → Settings → Environment Variables
2. Edit `CORS_ORIGIN` = frontend URL from Step 3
3. Redeploy

### Step 5: Test
- Open frontend URL
- Select board → Create card → Should appear in real-time ✅

---

## 📋 Environment Variables Quick Ref

**Backend (in Vercel)**
```
TRELLO_API_KEY=xxx
TRELLO_API_TOKEN=xxx
NODE_ENV=production
CORS_ORIGIN=https://frontend-url.vercel.app
```

**Frontend (in Vercel)**
```
REACT_APP_API_URL=https://backend-url.vercel.app
REACT_APP_SOCKET_URL=https://backend-url.vercel.app
REACT_APP_ENABLE_REALTIME=true
```

---

## 📚 Which Guide?

| Level | Guide | Time |
|-------|-------|------|
| Beginner | VERCEL_VISUAL_GUIDE.md | 20 min |
| Intermediate | DEPLOY_QUICK_START.md | 5 min |
| Expert | Run: `./deploy-to-vercel.sh` | 5 min |

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot connect | Check `REACT_APP_API_URL` is correct |
| CORS error | Verify backend `CORS_ORIGIN` = frontend URL, then redeploy |
| WebSocket fails | Socket.IO fallback to polling enabled, should still work |
| 404 errors | Check backend deployed successfully, test `/health` |
| Blank page | Clear cache, check console errors (F12) |
| Real-time not working | Wait 2-3 sec for socket, check env vars |

---

## ✅ Verification

**Backend is working:**
```
Visit: https://[backend-url]/health
Should see: {"status":"OK","timestamp":"..."}
```

**Frontend is working:**
```
Open: https://[frontend-url]
Should see: App loads, console shows "Socket connected"
```

**Real-time works:**
```
1. Open in two windows
2. Create card in window 1
3. Should appear in window 2 within 2-3 seconds ✅
```

---

## 🚀 Deployment Timeline

```
Push to GitHub:      5 min
Deploy Backend:      10 min
Deploy Frontend:     10 min
Update CORS:         2 min
Test:                5 min
─────────────────────────
Total:              ~30 min
```

---

## 📞 Key URLs

| Item | URL |
|------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| Trello API Keys | https://trello.com/app-key |
| Your Frontend | https://[your-frontend].vercel.app |
| Your Backend | https://[your-backend].vercel.app |
| Backend Health | https://[your-backend].vercel.app/health |

---

## ✨ Success Indicators

- ✅ Frontend URL loads
- ✅ Console shows "Socket connected"
- ✅ Can create boards/cards
- ✅ Real-time sync works
- ✅ No errors in logs

---

## 🎯 Root Directories

```
Backend Project: root = backend/
Frontend Project: root = frontend/
```

---

## 💡 Pro Tips

1. **Set env vars in Vercel UI**, not in code
2. **Always redeploy after** changing env vars
3. **Test backend `/health`** before blaming frontend
4. **Check browser console** (F12) for JS errors
5. **CORS fails silently** - check logs not browser

---

## 🔗 Quick Links

- 📖 Start: `DEPLOY_VERCEL_README.md`
- ⚡ 5-min: `DEPLOY_QUICK_START.md`
- 👁️ Detailed: `VERCEL_VISUAL_GUIDE.md`
- ✅ Checklist: `VERCEL_DEPLOYMENT_CHECKLIST.md`
- 📚 Complete: `VERCEL_DEPLOYMENT_COMPLETE.md`

---

## 📝 Remember

- **Never commit `.env`** files to git
- **Backend and Frontend are separate** Vercel projects
- **Frontend connects to Backend** via `REACT_APP_API_URL`
- **Real-time uses WebSocket** (with polling fallback)
- **Data is in-memory** (add DB for persistence)

---

## ✅ Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Trello credentials ready
- [ ] Vercel account created
- [ ] Read a deployment guide
- [ ] Ready to deploy

---

**Total time to live: ~45 minutes**

**Let's deploy! 🚀**

---

*For more details, see the full guides:*
- *START_HERE_DEPLOYMENT.md* (overview)
- *DEPLOY_VERCEL_README.md* (main guide)
- *VERCEL_VISUAL_GUIDE.md* (detailed steps)
