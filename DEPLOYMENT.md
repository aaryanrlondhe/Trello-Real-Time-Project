# Deployment Guide for Trello Real-time Application

This guide will help you deploy your Trello Real-time application to production.

## 🌐 Deployment Options

### 1. Backend Deployment Options

#### Option A: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name-backend

# Set environment variables
heroku config:set TRELLO_API_KEY=your_key
heroku config:set TRELLO_API_TOKEN=your_token
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-frontend-domain.com

# Deploy
git subtree push --prefix backend heroku main
```

#### Option B: Railway
1. Connect your GitHub repository
2. Select the backend folder
3. Set environment variables in Railway dashboard
4. Deploy automatically

#### Option C: DigitalOcean App Platform
1. Connect GitHub repository
2. Configure build settings for backend folder
3. Set environment variables
4. Deploy

### 2. Frontend Deployment Options

#### Option A: Netlify
```bash
# Build the frontend
cd frontend
npm run build

# Deploy to Netlify (drag & drop dist folder)
# Or connect GitHub repository for continuous deployment
```

#### Option B: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

#### Option C: GitHub Pages
```bash
# Install gh-pages
cd frontend
npm install --save-dev gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

## 🔧 Production Configuration

### Backend Environment Variables
```bash
PORT=5000
NODE_ENV=production
TRELLO_API_KEY=your_production_trello_api_key
TRELLO_API_TOKEN=your_production_trello_token
CORS_ORIGIN=https://your-frontend-domain.com
WEBHOOK_CALLBACK_URL=https://your-backend-domain.com
```

### Frontend Environment Variables
```bash
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_SOCKET_URL=https://your-backend-domain.com
REACT_APP_ENABLE_REALTIME=true
```

## 🚀 Quick Deploy Script

Create this script in your project root:

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying Trello Real-time Application..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build

# Deploy frontend to Netlify (example)
echo "🌐 Deploying frontend..."
# netlify deploy --prod --dir=build

# Deploy backend to Heroku (example)
echo "🔧 Deploying backend..."
cd ../backend
# git subtree push --prefix backend heroku main

echo "✅ Deployment completed!"
echo "📋 Don't forget to:"
echo "1. Update webhook URLs in Trello"
echo "2. Test all functionality in production"
echo "3. Monitor logs for any issues"
```

## 📱 Mobile Responsiveness

The application is already optimized for mobile devices. Test on:
- iOS Safari
- Android Chrome
- Various screen sizes

## 🔒 Security Checklist

- [ ] Environment variables are properly configured
- [ ] API keys are not exposed in frontend code
- [ ] CORS is properly configured
- [ ] HTTPS is enabled in production
- [ ] Error messages don't expose sensitive information

## 📊 Monitoring & Analytics

Consider adding:
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Performance monitoring
- Uptime monitoring

## 🔄 CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Deploy Backend
        run: |
          cd backend
          npm install
          # Deploy to your backend service
          
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          # Deploy to your frontend service
```

## 🧪 Production Testing

Before going live:
1. Test all API endpoints
2. Verify real-time functionality
3. Test on multiple devices
4. Check error handling
5. Validate webhook functionality
6. Performance testing

## 📞 Support & Maintenance

- Monitor application logs
- Set up alerts for errors
- Regular security updates
- Backup important data
- Document any custom configurations