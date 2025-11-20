# 🔧 Vercel Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. **Build Failed - "Cannot find module" errors**

#### Problem
```
Error: Cannot find module 'express'
```

#### Solutions

**Option A: Check Dependencies**
```bash
cd backend
npm install
cd ../frontend
npm install
cd ..
```

**Option B: Clear Cache and Reinstall**
```bash
# Root directory
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
cd ..

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
cd ..
```

**Option C: Verify package.json**
Ensure both `frontend/package.json` and `backend/package.json` have all dependencies:
- `express`, `cors`, `body-parser` in backend
- `react`, `react-dom`, `axios`, `socket.io-client` in frontend

---

### 2. **Deployment Failed - Build Command Error**

#### Problem
```
Build command failed with exit code 1
```

#### Solutions

1. **Check Build Command in Vercel Settings**
   - Should be: `npm run build:frontend`
   - Or: `cd frontend && npm install && npm run build`

2. **Verify Build Script Exists**
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

3. **Check for TypeScript Errors**
   If frontend uses TypeScript, ensure all type issues are resolved

4. **Check Output Directory**
   - Should be: `frontend/build`
   - Verify files exist after running build locally

---

### 3. **404 on Frontend Routes**

#### Problem
Navigating to routes like `/board` gives 404

#### Solutions

1. **Verify `vercel.json` Rewrites**
   Root `vercel.json` should include:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

2. **Verify `frontend/vercel.json`**
   Should also have rewrites configured

3. **Check Frontend Router**
   Make sure React Router is properly configured

---

### 4. **API Returning 404**

#### Problem
```
GET https://your-project.vercel.app/api/health → 404
```

#### Solutions

1. **Verify `api/index.js` Exists**
   ```bash
   ls -la api/index.js
   ```

2. **Check Vercel Functions**
   In Vercel dashboard → Deployments → Click deployment → Functions
   Should show API routes

3. **Check Environment Variables**
   Settings → Environment Variables → Verify all set

4. **Check Function Logs**
   Deployments → Click deployment → Logs → Select function
   Look for error messages

---

### 5. **CORS Errors**

#### Problem
```
Access to XMLHttpRequest at 'https://your-project.vercel.app/api/boards' 
from origin 'https://your-project.vercel.app' has been blocked by CORS policy
```

#### Solutions

1. **Set CORS_ORIGIN Environment Variable**
   ```
   CORS_ORIGIN=https://your-project.vercel.app
   ```

2. **Verify in api/index.js**
   ```javascript
   cors({
     origin: process.env.CORS_ORIGIN || "http://localhost:3000",
     credentials: true
   })
   ```

3. **Redeploy After Changes**
   Settings → Environment Variables → Change/Add → Redeploy

---

### 6. **API Endpoints Returning 500 Error**

#### Problem
```json
{
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

#### Solutions

1. **Check Trello Credentials**
   ```
   TRELLO_API_KEY=your_key_here
   TRELLO_API_TOKEN=your_token_here
   ```

2. **Verify Credentials Are Valid**
   ```bash
   curl -X GET "https://api.trello.com/1/members/me?key=YOUR_KEY&token=YOUR_TOKEN"
   ```

3. **Check Function Logs**
   Deployments → Latest → Logs → Look for errors

4. **Test Locally First**
   ```bash
   npm run dev
   curl http://localhost:5000/api/health
   ```

---

### 7. **Real-time Updates Not Working**

#### Problem
Multiple browser windows don't sync in real-time

#### Expected Behavior
- Real-time works with WebSocket support
- Limited on Vercel due to function timeouts
- App still works with polling fallback

#### Solutions

1. **Check Socket.IO Connection**
   Browser Console → Check for connection messages

2. **Use Polling Instead**
   Edit `frontend/src/services/socketService.js`:
   ```javascript
   const ENABLE_REALTIME = process.env.REACT_APP_ENABLE_REALTIME === 'true';
   ```

3. **Consider Vercel Pro**
   WebSocket support available with Vercel Pro plan

---

### 8. **502 Bad Gateway**

#### Problem
```
Error 502: Bad Gateway
```

#### Solutions

1. **Check Function Duration**
   Vercel functions timeout after 30 seconds
   - Optimize long-running operations
   - Break into smaller tasks

2. **Check Memory Usage**
   Increase memory in `vercel.json`:
   ```json
   {
     "functions": {
       "api/index.js": {
         "memory": 1024
       }
     }
   }
   ```

3. **Check Backend Logs**
   Deployments → Functions → Select function → View logs

---

### 9. **Environment Variables Not Loading**

#### Problem
```
Error: TRELLO_API_KEY is undefined
```

#### Solutions

1. **Verify Variables in Dashboard**
   Settings → Environment Variables → Check all exist

2. **Redeploy After Adding Variables**
   Variables don't take effect until redeployment

3. **Check Variable Names Exactly**
   Must match exactly: `TRELLO_API_KEY` not `trello_api_key`

4. **Use `.env.example` to Track**
   Keep `.env.example` in git for reference (not secrets!)

---

### 10. **Cannot Connect to Trello API**

#### Problem
```
Error: connect ECONNREFUSED 127.0.0.1:443
```

#### Solutions

1. **Verify API Credentials**
   - Get from: https://trello.com/app-key
   - Token: https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=Server%20Token&key=YOUR_KEY

2. **Check Network Connection**
   Test manually:
   ```bash
   curl -X GET "https://api.trello.com/1/members/me?key=YOUR_KEY&token=YOUR_TOKEN"
   ```

3. **Verify Trello Service Status**
   Check https://trello.status.io/

4. **Check API Rate Limits**
   Trello has rate limits (180 requests/10 seconds)

---

### 11. **Webhook Not Working**

#### Problem
Trello changes don't trigger updates

#### Solutions

1. **Register Webhook with Production URL**
   ```bash
   curl -X POST \
     "https://api.trello.com/1/webhooks/?key=YOUR_KEY&token=YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d "{
       \"callbackURL\": \"https://your-project.vercel.app/api/webhooks/trello\",
       \"idModel\": \"BOARD_ID\",
       \"description\": \"Production\"
     }"
   ```

2. **Verify Webhook Endpoint Exists**
   ```bash
   curl https://your-project.vercel.app/api/webhooks/trello
   ```

3. **Check Webhook Logs**
   Can't view Trello webhook logs, but test with:
   ```bash
   # List webhooks
   curl -X GET "https://api.trello.com/1/webhooks?key=YOUR_KEY&token=YOUR_TOKEN"
   ```

---

### 12. **Slow Performance / High Latency**

#### Problem
App is slow or takes 10+ seconds to respond

#### Solutions

1. **Check Function Memory**
   Increase in `vercel.json`:
   ```json
   {
     "functions": {
       "api/**/*.js": {
         "memory": 1024
       }
     }
   }
   ```

2. **Optimize Database Calls**
   - Cache results when possible
   - Minimize Trello API calls

3. **Check Function Duration**
   Logs → Look for total execution time
   Max 30 seconds on free tier

4. **Use Regional Deployment**
   Settings → Region → Choose closest to users

---

### 13. **Frontend Showing 404 After Changes**

#### Problem
After code changes, getting 404 on routes

#### Solutions

1. **Clear Browser Cache**
   Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

2. **Clear Vercel Cache**
   Deployments → Latest → Click → Options → Clear Cache

3. **Verify Build Output**
   Check `frontend/build/index.html` exists

4. **Redeploy**
   Make another commit and push to trigger redeploy

---

### 14. **Module Not Found in Production**

#### Problem
Works locally but fails in Vercel:
```
Error: Cannot find module 'styled-components'
```

#### Solutions

1. **Check Dependencies Listed**
   ```bash
   cat package.json | grep "styled-components"
   ```

2. **Reinstall Dependencies**
   ```bash
   npm install
   npm install styled-components --save
   git add .
   git commit -m "Add missing dependency"
   git push
   ```

3. **Check package-lock.json**
   Should be in git repository

---

## 📊 Debugging Workflow

### When Deployment Fails:

1. **Check Build Logs**
   - Deployments tab
   - Look for error at end of logs
   - Scroll up to see full context

2. **Check Function Logs**
   - Deployments → Click failed deployment
   - Functions tab
   - Select each function to see logs

3. **Test Locally**
   ```bash
   npm run dev
   # Or
   cd frontend && npm start
   cd ../backend && npm start
   ```

4. **Compare Configurations**
   - Local `.env` vs Vercel environment variables
   - Check `vercel.json` exists and is valid JSON
   - Verify `api/index.js` syntax

---

## 🆘 Getting Help

If you still have issues:

1. **Check Vercel Documentation**
   https://vercel.com/docs

2. **Search GitHub Issues**
   Look for similar problems

3. **Share Error Details**
   - Full error message
   - Build logs
   - Environment setup
   - Reproduction steps

---

## ✅ Verification Checklist

After fixing issues:

- [ ] Deployment successful (green checkmark)
- [ ] Frontend loads at `https://your-project.vercel.app`
- [ ] API health check works: `/api/health`
- [ ] Can view board
- [ ] Can create task
- [ ] Can update task
- [ ] Can delete task
- [ ] No console errors
- [ ] Network requests show success (200 status)

---

## 🎯 Quick Health Check Script

```bash
#!/bin/bash
URL="https://your-project.vercel.app"

echo "🔍 Health Check"
echo "==============="
echo ""

# Check frontend
echo -n "Frontend: "
curl -s -o /dev/null -w "%{http_code}\n" "$URL"

# Check API health
echo -n "API Health: "
curl -s -o /dev/null -w "%{http_code}\n" "$URL/api/health"

# Check if board data loads
echo -n "API Available: "
curl -s "$URL/api/health" | grep -q "status" && echo "✓" || echo "✗"

echo ""
echo "Done!"
```

Save as `health-check.sh`, make executable with `chmod +x health-check.sh`, then run: `./health-check.sh`
