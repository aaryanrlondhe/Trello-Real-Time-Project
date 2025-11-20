# Vercel Deployment Checklist

Use this checklist to ensure your deployment is successful.

## Before Deployment

### Prepare Credentials
- [ ] Have your Trello API Key ready (from https://trello.com/app-key)
- [ ] Have your Trello API Token ready (from https://trello.com/app-key)
- [ ] GitHub account created
- [ ] Vercel account created (vercel.com)

### Prepare Code
- [ ] Project is in a git repository locally
- [ ] All changes are committed
- [ ] `.env` files are NOT committed (verify with `git status`)
- [ ] `.gitignore` includes: `node_modules/`, `.env`, `.env.local`, `build/`, `dist/`

### Verify Configuration
- [ ] `backend/package.json` exists and has correct dependencies
- [ ] `frontend/package.json` exists and has correct dependencies
- [ ] `backend/server.js` starts without errors locally: `npm run dev`
- [ ] `frontend/` builds without errors locally: `npm run build`

## Push to GitHub

- [ ] Create new GitHub repository
- [ ] Run these commands:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
  git branch -M main
  git push -u origin main
  ```
- [ ] Verify repository appears on GitHub with all files

## Deploy Backend

### Create Vercel Project
- [ ] Go to vercel.com/dashboard
- [ ] Click "New Project"
- [ ] Select "Import Git Repository"
- [ ] Choose your repository
- [ ] Change "Root Directory" to `backend`
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Copy the deployed URL (e.g., `https://trello-backend-xxxxx.vercel.app`)

### Configure Environment Variables
- [ ] In Vercel backend project, go to Settings > Environment Variables
- [ ] Add `TRELLO_API_KEY` = your key
- [ ] Add `TRELLO_API_TOKEN` = your token
- [ ] Add `NODE_ENV` = `production`
- [ ] Add `CORS_ORIGIN` = `https://your-frontend.vercel.app` (after frontend deployment)

### Verify Deployment
- [ ] Visit your backend URL + `/health` in browser
- [ ] Should see: `{"status":"OK","timestamp":"..."}`

## Deploy Frontend

### Create Vercel Project
- [ ] In vercel.com/dashboard, click "New Project"
- [ ] Select the same GitHub repository
- [ ] Change "Root Directory" to `frontend`
- [ ] Vercel should auto-detect React framework
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Copy the deployed URL (e.g., `https://trello-frontend-xxxxx.vercel.app`)

### Configure Environment Variables
- [ ] In Vercel frontend project, go to Settings > Environment Variables
- [ ] Add `REACT_APP_API_URL` = your backend URL
- [ ] Add `REACT_APP_SOCKET_URL` = your backend URL
- [ ] Add `REACT_APP_ENABLE_REALTIME` = `true`

### Redeploy Frontend
- [ ] Click "Deployments" tab
- [ ] Click "Redeploy" on the latest deployment (to apply environment variables)

## Complete Backend Configuration

- [ ] Go back to backend project settings
- [ ] Update `CORS_ORIGIN` environment variable to: `https://your-frontend.vercel.app`
- [ ] Click "Redeploy" on the latest deployment

## Testing

### Test Backend
- [ ] Visit backend URL + `/health` → should return status OK
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Make an API call from frontend
- [ ] Should see request going to backend URL with 200 status

### Test Frontend
- [ ] Visit frontend URL
- [ ] Select a board from dropdown
- [ ] Browser should not show errors in console
- [ ] Should see "Socket connected" in console
- [ ] Create a new card
- [ ] Card should appear in real-time ✅

### Test Real-time Features
- [ ] Open frontend in two browser windows side-by-side
- [ ] In one window, create a card
- [ ] In the other window, card should appear automatically ✅
- [ ] Update a card in one window
- [ ] Update should appear in the other ✅
- [ ] Delete a card in one window
- [ ] Card should disappear from the other ✅

## Troubleshooting Checklist

### Backend Issues
- [ ] Check backend logs: `vercel logs [backend-project-name]`
- [ ] Verify all environment variables are set
- [ ] Test health endpoint: `[backend-url]/health`
- [ ] Check Trello API credentials are correct

### Frontend Connection Issues
- [ ] Open browser console (F12 > Console)
- [ ] Look for error messages
- [ ] Verify `REACT_APP_API_URL` environment variable is correct
- [ ] Verify `REACT_APP_SOCKET_URL` is correct
- [ ] Check that backend URL is accessible
- [ ] Try clearing browser cache (Ctrl+Shift+Delete)

### CORS Issues
- [ ] Verify backend `CORS_ORIGIN` matches frontend URL exactly
- [ ] Redeploy backend after updating CORS_ORIGIN
- [ ] Wait 1-2 minutes for deployment to complete

### WebSocket Issues
- [ ] Check if Vercel Pro plan is needed (Free tier may have limitations)
- [ ] Socket.IO fallback to polling should work automatically
- [ ] Check network tab in DevTools for WebSocket (ws://) connections

## Performance Checklist

- [ ] Frontend loads in under 3 seconds
- [ ] Creating a card is responsive (under 1 second)
- [ ] Real-time updates appear within 2-3 seconds
- [ ] No console errors on any page
- [ ] Memory usage is reasonable

## Optional: Set Up Trello Webhooks

- [ ] Deploy backend successfully first
- [ ] Run: `TRELLO_API_KEY=xxx TRELLO_API_TOKEN=yyy node backend/scripts/register-webhook.js`
- [ ] Webhook should show as registered on Trello API dashboard
- [ ] Test by updating a card in Trello - should reflect in app

## Maintenance

- [ ] Set up monitoring/error tracking
- [ ] Save deployment URLs somewhere safe
- [ ] Document any custom environment variables needed
- [ ] Keep dependencies updated monthly
- [ ] Monitor Vercel usage to stay within free tier limits

---

## Success Indicators ✅

Your deployment is successful when:
1. ✅ Frontend URL loads without errors
2. ✅ You can select/create a board
3. ✅ WebSocket shows as connected in console
4. ✅ Creating a card works and appears instantly
5. ✅ Real-time updates work across browser windows
6. ✅ No errors in browser console
7. ✅ No errors in Vercel backend logs

## Quick Links

- Frontend URL: ___________________________________
- Backend URL: ___________________________________
- GitHub Repo: ___________________________________
- Vercel Dashboard: https://vercel.com/dashboard
- Trello API Keys: https://trello.com/app-key

---

**Deployment Date:** ________________  
**Deployed By:** ________________  
**Notes:** ________________________________________________________________

