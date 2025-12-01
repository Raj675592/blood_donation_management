# Hosting Guide - Blood Donation Management System

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Backend Hosting](#backend-hosting)
- [Frontend Hosting](#frontend-hosting)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [SSL & Domain Configuration](#ssl--domain-configuration)
- [Monitoring & Maintenance](#monitoring--maintenance)

## ⚡ Prerequisites

### Required Tools
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **MongoDB** database (local or cloud)

### Recommended Services
- **Backend**: Railway, Render, Heroku, DigitalOcean, AWS
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: MongoDB Atlas (cloud)
- **Domain**: Namecheap, GoDaddy
- **SSL**: Let's Encrypt (free), Cloudflare

## 🔧 Backend Hosting

### Option 1: Railway (Recommended)

#### Step 1: Prepare Your Backend
```bash
# 1. Create railway.json in root directory
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node index.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}

# 2. Add health check endpoint to index.js
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

# 3. Update package.json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

#### Step 2: Deploy to Railway
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project
railway init

# 4. Deploy
railway up
```

#### Step 3: Configure Environment Variables
```bash
# Add these variables in Railway dashboard
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blood-donation
JWT_SECRET=your-super-secret-key-here-min-32-chars
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.com
```

### Option 2: Render

#### Step 1: Create render.yaml
```yaml
services:
  - type: web
    name: blood-donation-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: node index.js
    envVars:
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: NODE_ENV
        value: production
```

#### Step 2: Deploy
1. Connect GitHub repository to Render
2. Select backend folder if using monorepo
3. Set environment variables
4. Deploy automatically

### Option 3: Heroku

#### Step 1: Prepare Heroku Files
```bash
# Create Procfile in root
echo "web: node index.js" > Procfile

# Add heroku postbuild script to package.json
{
  "scripts": {
    "heroku-postbuild": "npm install --only=dev"
  }
}
```

#### Step 2: Deploy to Heroku
```bash
# 1. Install Heroku CLI
# 2. Login
heroku login

# 3. Create app
heroku create blood-donation-backend

# 4. Set environment variables
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# 5. Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

## 🎨 Frontend Hosting

### Option 1: Vercel (Recommended)

#### Step 1: Prepare Frontend
```bash
# 1. Create vercel.json in client folder
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}

# 2. Update package.json build script
{
  "scripts": {
    "build": "react-scripts build",
    "vercel-build": "react-scripts build"
  }
}
```

#### Step 2: Configure Environment Variables
```bash
# Create .env.production in client folder
REACT_APP_API_URL=https://your-backend-domain.railway.app
REACT_APP_ENVIRONMENT=production
```

#### Step 3: Deploy to Vercel
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy from client folder
cd client
vercel --prod
```

### Option 2: Netlify

#### Step 1: Create _redirects file
```bash
# Create public/_redirects in client folder
/*    /index.html   200
```

#### Step 2: Build Configuration
```bash
# Create netlify.toml in client folder
[build]
  publish = "build/"
  command = "npm run build"

[build.environment]
  REACT_APP_API_URL = "https://your-backend-domain.railway.app"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 3: Deploy
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy

### Option 3: GitHub Pages

#### Step 1: Install gh-pages
```bash
cd client
npm install --save-dev gh-pages
```

#### Step 2: Configure package.json
```json
{
  "homepage": "https://username.github.io/blood-donation-management",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

#### Step 3: Deploy
```bash
npm run deploy
```

## ⚙️ Environment Configuration

### Backend Environment Variables
```bash
# Production .env file
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blood-donation
JWT_SECRET=super-secret-key-minimum-32-characters-long
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend Environment Variables
```bash
# .env.production file
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_ENVIRONMENT=production
REACT_APP_API_TIMEOUT=10000
```

### Update API URLs in Frontend
```javascript
// Create config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  },
  USER: {
    DASHBOARD: `${API_BASE_URL}/api/users/dashboard`,
    BLOOD_REQUEST: `${API_BASE_URL}/api/users/blood-request`,
  },
  ADMIN: {
    DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
    USERS: `${API_BASE_URL}/api/admin/users`,
  }
};
```

## 🗄️ Database Setup

### MongoDB Atlas (Cloud Database)

#### Step 1: Create Cluster
1. Visit [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free account
3. Create new cluster
4. Choose free tier (M0)

#### Step 2: Configure Database
```bash
# 1. Create database user
Username: blooddonation
Password: [Generate secure password]
Role: Atlas admin

# 2. Network Access
Add IP Address: 0.0.0.0/0 (Allow from anywhere)

# 3. Get connection string
mongodb+srv://blooddonation:<password>@cluster0.xxxxx.mongodb.net/blood-donation?retryWrites=true&w=majority
```

#### Step 3: Initialize Database
```javascript
// Optional: Create init script
const mongoose = require('mongoose');
const User = require('./models/user');

const initDatabase = async () => {
  try {
    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@blooddonation.com',
      password: 'hashed-password',
      role: 'admin'
    });
    await admin.save();
    console.log('Database initialized');
  } catch (error) {
    console.error('Database init error:', error);
  }
};
```

## 🔒 SSL & Domain Configuration

### Custom Domain Setup

#### Step 1: Purchase Domain
- Buy domain from Namecheap, GoDaddy, etc.
- Example: `blooddonation.org`

#### Step 2: Configure DNS
```bash
# DNS Records
Type    Name              Value
A       @                 [Backend IP]
CNAME   www               blooddonation.org
CNAME   api               backend-host.railway.app
CNAME   app               frontend-host.vercel.app
```

#### Step 3: SSL Certificate
```bash
# For Railway/Render/Vercel - Automatic SSL
# For custom server - Use Certbot
sudo certbot --nginx -d blooddonation.org -d www.blooddonation.org
```

### CORS Configuration
```javascript
// Update backend CORS
app.use(cors({
  origin: [
    'https://blooddonation.org',
    'https://www.blooddonation.org',
    'https://app.blooddonation.org'
  ],
  credentials: true
}));
```

## 📊 Monitoring & Maintenance

### Health Checks
```javascript
// Backend health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Database health check
app.get('/health/db', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ database: 'Connected' });
  } catch (error) {
    res.status(500).json({ database: 'Disconnected', error: error.message });
  }
});
```

### Logging Setup
```javascript
// Install morgan and winston
npm install morgan winston

// Add logging middleware
const morgan = require('morgan');
const winston = require('winston');

app.use(morgan('combined'));
```

### Performance Monitoring
```bash
# Monitor application performance
# Use services like:
# - New Relic
# - DataDog
# - Railway Analytics
# - Vercel Analytics
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] API endpoints tested
- [ ] CORS settings updated
- [ ] Security headers added
- [ ] Error handling implemented

### Backend Deployment
- [ ] Health check endpoint added
- [ ] Process manager configured
- [ ] Database migrations run
- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] Monitoring setup

### Frontend Deployment
- [ ] API URLs updated
- [ ] Build process tested
- [ ] Asset optimization done
- [ ] Routing configured
- [ ] Error boundaries added
- [ ] Performance optimized

### Post-Deployment
- [ ] SSL certificate active
- [ ] Domain DNS propagated
- [ ] Application functionality tested
- [ ] Performance metrics checked
- [ ] Error logging working
- [ ] Backup strategy implemented

## 📞 Support & Resources

### Hosting Platform Docs
- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

### Troubleshooting
- Check application logs
- Verify environment variables
- Test database connectivity
- Validate API endpoints
- Monitor resource usage