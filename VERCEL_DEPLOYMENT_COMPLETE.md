# Complete Vercel Deployment Guide

This guide will help you deploy your Trello Real-time WebSockets project to Vercel with both frontend and backend services.

## Prerequisites

- [Vercel Account](https://vercel.com) (free account is sufficient)
- [GitHub Account](https://github.com) with your repository
- Trello API Key and Token (for backend)
- Node.js 14+ installed locally

## Project Structure

Your project has two deployable parts:
- **Backend**: Express.js server with Socket.IO (port 5001)
- **Frontend**: React application (built static files)

## Step-by-Step Deployment

### Step 1: Prepare Your Trello API Credentials

1. Go to [Trello Developer Portal](https://trello.com/app-key)
2. Copy your **API Key**
3. Click "Token" and authorize to get your **API Token**
4. Save both values - you'll need them for environment variables

### Step 2: Set Up GitHub Repository

1. Initialize git if not already done:
   ```bash
   cd "/Users/shrushtiparkar/Documents/Trello Real-time WebSockets + API Frontend Assignment"
   git init
   git add .
   git commit -m "Initial commit: Trello real-time app ready for deployment"
   ```

2. Create a new repository on GitHub (don't initialize with README, .gitignore, or license)

3. Add the remote and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy Backend to Vercel

1. **Create Backend Project on Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select "Other" as the Framework
   - Set **Root Directory** to `backend`

2. **Configure Build Settings:**
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Output Directory**: (leave empty for serverless function)

3. **Set Environment Variables:**
   In the Vercel dashboard for your backend project, go to Settings > Environment Variables and add:

   ```
   NODE_ENV = production
   TRELLO_API_KEY = [your_trello_api_key]
   TRELLO_API_TOKEN = [your_trello_api_token]
   CORS_ORIGIN = https://[your-frontend-project].vercel.app
   ```

4. **Deploy:** Click "Deploy" and wait for completion
5. **Note the Backend URL:** It will be something like `https://trello-backend-xxxxx.vercel.app`

### Step 4: Deploy Frontend to Vercel

1. **Create Frontend Project on Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import the same GitHub repository
   - Select **React** as the Framework (Vercel will auto-detect)
   - Set **Root Directory** to `frontend`

2. **Configure Build Settings:**
   - **Build Command**: `npm run build`
   - **Start Command**: `npx serve -s build`
   - **Output Directory**: `build`

3. **Set Environment Variables:**
   In the Vercel dashboard for your frontend project, go to Settings > Environment Variables and add:

   ```
   REACT_APP_API_URL = https://[your-backend-project].vercel.app
   REACT_APP_SOCKET_URL = https://[your-backend-project].vercel.app
   REACT_APP_ENABLE_REALTIME = true
   ```

   Replace `[your-backend-project]` with your actual backend Vercel project name/URL

4. **Deploy:** Click "Deploy" and wait for completion
5. **Note the Frontend URL:** It will be something like `https://trello-frontend-xxxxx.vercel.app`

### Step 5: Update CORS Configuration

After deployment, update your backend's CORS environment variable to use the frontend URL:

1. Go to your Backend project settings on Vercel
2. Settings > Environment Variables
3. Edit `CORS_ORIGIN` and set it to your frontend URL: `https://[your-frontend-project].vercel.app`
4. Vercel will automatically redeploy with the new environment variable

### Step 6: Test Your Deployment

1. Open your frontend URL in a browser
2. Select or create a board
3. Create a new card - verify it appears in real-time
4. Check the browser console for WebSocket connections (should show "Socket connected")
5. Verify API calls in Network tab show requests going to your backend domain

## Troubleshooting

### WebSocket Connection Issues

If you see connection errors in the browser console:

1. **Check CORS settings**: Ensure `CORS_ORIGIN` in backend environment matches your frontend URL
2. **Verify API URLs**: In frontend `.env` variables, ensure URLs point to your backend domain
3. **Check Backend Status**: Visit `https://[your-backend].vercel.app/health` to verify backend is running

### 404 Errors on API Calls

- Ensure backend is deployed to the correct Vercel project
- Verify all environment variables are set correctly
- Check that API routes are correctly defined in `backend/routes/`

### Frontend Shows Blank Page

- Check browser console for errors (F12 > Console tab)
- Verify `REACT_APP_API_URL` is set correctly in frontend environment
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)

### Socket.IO Connection Timeouts

- WebSocket fallback to polling is enabled in `socketService.js`
- If still failing, check that your Vercel plan supports WebSocket (Pro or above)
- Consider using polling-only as fallback: edit `frontend/src/services/socketService.js` transports

## Production Best Practices

### 1. Environment Variables Security
- Never commit `.env` files to git
- Use Vercel's Environment Variables UI for sensitive data
- Use `.env.example` files to show what variables are needed

### 2. Monitoring & Logging
- Monitor backend logs: `vercel logs [backend-project-name]`
- Monitor frontend logs: `vercel logs [frontend-project-name]`
- Set up error tracking (e.g., Sentry)

### 3. Performance Optimization
- Frontend: Already using React with optimized build
- Backend: Consider adding caching headers for static content
- Monitor WebSocket connections and implement connection limits

### 4. Trello Webhook Configuration
To receive real-time updates from Trello:

```bash
cd backend
node scripts/register-webhook.js
```

This requires your backend to be publicly accessible (which Vercel provides).

## Redeploying After Changes

### Update Backend
```bash
cd backend
git add .
git commit -m "Update backend"
git push origin main
# Vercel automatically redeploys
```

### Update Frontend
```bash
cd frontend
git add .
git commit -m "Update frontend"
git push origin main
# Vercel automatically redeploys
```

## Alternative: Deploy Both Services in One Vercel Project

If you want to keep both in one project, you can use the `vercel.json` configuration with monorepo setup. However, it's generally recommended to keep them separate for better scalability.

## Useful Vercel Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from command line
vercel deploy

# View logs
vercel logs [project-name]

# List all projects
vercel list

# Remove a deployment
vercel remove [project-name]
```

## Support & Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Socket.IO with Vercel](https://socket.io/docs/v4/vercel/)
- [Trello API Documentation](https://developer.atlassian.com/cloud/trello/apis/rest/)

## Need Help?

1. Check Vercel logs for error messages
2. Verify all environment variables are set
3. Test backend health endpoint: `/health`
4. Check browser console for frontend errors
5. Review backend logs for API errors

---

**Deployment Checklist:**
- [ ] Trello API credentials ready
- [ ] GitHub repository set up
- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured on both services
- [ ] CORS settings updated with frontend URL
- [ ] Tested WebSocket connection
- [ ] Tested API calls
- [ ] Verified real-time card creation/updates work
