# Deployment Guide

This guide covers deployment options and configurations for TX Predictive Intelligence.

## 📋 Table of Contents

- [Quick Deploy](#quick-deploy)
- [Environment Configuration](#environment-configuration)
- [Platform-Specific Guides](#platform-specific-guides)
- [Domain Configuration](#domain-configuration)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Deploy

### Prerequisites
- Node.js 18+ locally (for building)
- Access to your chosen hosting platform
- Backend API running and accessible

### Build for Production
```bash
# Install dependencies
npm install

# Create production build
npm run build

# Preview build locally (optional)
npm run preview
```

## 🔧 Environment Configuration

### Required Environment Variables

Create these environment variables in your hosting platform:

```bash
# Backend API Configuration
VITE_API_BASE=https://your-backend-api.com
VITE_SOCKET_BASE=https://your-backend-api.com

# Optional: Application Configuration
VITE_APP_NAME=TX Predictive Intelligence
VITE_APP_VERSION=1.0.0
```

### Environment File Structure
```
# Production
VITE_API_BASE=https://tx-predictive-intelligence.onrender.com
VITE_SOCKET_BASE=https://tx-predictive-intelligence.onrender.com

# Staging
VITE_API_BASE=https://tx-predictive-intelligence-staging.onrender.com
VITE_SOCKET_BASE=https://tx-predictive-intelligence-staging.onrender.com

# Development
VITE_API_BASE=http://localhost:5000
VITE_SOCKET_BASE=http://localhost:5000
```

## 🌐 Platform-Specific Guides

### Vercel (Recommended)

**Automatic Deployment:**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push to main

**Manual Deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add VITE_API_BASE
vercel env add VITE_SOCKET_BASE

# Deploy to production
vercel --prod
```

**Configuration (vercel.json):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Netlify

**Automatic Deployment:**
1. Connect repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Set environment variables in Netlify dashboard

**Configuration (netlify.toml):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### GitHub Pages

**Deployment with GitHub Actions:**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_API_BASE: ${{ secrets.VITE_API_BASE }}
        VITE_SOCKET_BASE: ${{ secrets.VITE_SOCKET_BASE }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### AWS S3 + CloudFront

**S3 Setup:**
```bash
# Install AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://your-app-bucket

# Enable static website hosting
aws s3 website s3://your-app-bucket --index-document index.html --error-document index.html

# Upload build files
aws s3 sync dist/ s3://your-app-bucket --delete
```

**CloudFront Configuration:**
- Origin: Your S3 bucket
- Default Root Object: `index.html`
- Error Pages: 404 → `/index.html` (for SPA routing)
- Compress Objects: Yes

### DigitalOcean App Platform

**Configuration (app.yaml):**
```yaml
name: tx-predictive-intelligence
services:
- name: web
  source_dir: /
  github:
    repo: your-username/tx-predictive-intelligence
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: VITE_API_BASE
    value: https://your-backend-api.com
  - key: VITE_SOCKET_BASE
    value: https://your-backend-api.com
  routes:
  - path: /
  http_port: 3000
```

### Docker Deployment

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        gzip on;
        gzip_types text/css application/javascript application/json;
    }
}
```

**Docker Commands:**
```bash
# Build image
docker build -t tx-predictive-intelligence .

# Run container
docker run -p 8080:80 tx-predictive-intelligence
```

## 🔗 Domain Configuration

### Custom Domain Setup

**DNS Configuration:**
```
# For root domain (example.com)
A record: @ → hosting-platform-ip

# For subdomain (app.example.com)
CNAME record: app → hosting-platform-domain
```

**SSL Certificate:**
Most platforms provide automatic SSL. For custom setup:
- Use Let's Encrypt for free SSL
- Configure HTTPS redirects
- Update CORS settings in backend

### Backend CORS Configuration

Update your Flask backend to allow your domain:
```python
from flask_cors import CORS

# Allow your frontend domain
CORS(app, origins=[
    "https://yourdomain.com",
    "https://app.yourdomain.com",
    "http://localhost:5173"  # Keep for development
])
```

## ⚡ Performance Optimization

### Build Optimization

**Vite Configuration (vite.config.ts):**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
})
```

### CDN Configuration

**Headers for Static Assets:**
```
# Cache static assets for 1 year
Cache-Control: public, max-age=31536000, immutable

# Cache HTML for 1 hour
Cache-Control: public, max-age=3600
```

### Image Optimization
- Use WebP format for images
- Implement lazy loading
- Compress images before deployment
- Use appropriate image sizes

## 📊 Monitoring & Analytics

### Error Tracking

**Sentry Integration:**
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

### Performance Monitoring

**Web Vitals:**
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Analytics

**Google Analytics 4:**
```typescript
import { gtag } from 'ga-gtag';

gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: document.title,
  page_location: window.location.href,
});
```

## 🔍 Health Checks

### Application Health

Create health check endpoint:
```typescript
// Add to your app
export const healthCheck = async () => {
  try {
    const response = await fetch('/api/health');
    return response.ok;
  } catch {
    return false;
  }
};
```

### Monitoring Script

```bash
#!/bin/bash
# monitor.sh

URL="https://yourdomain.com"
WEBHOOK="your-slack-webhook-url"

if curl -f -s $URL > /dev/null; then
    echo "Site is up"
else
    echo "Site is down!"
    curl -X POST -H 'Content-type: application/json' \
        --data '{"text":"🚨 TX Predictive Intelligence is down!"}' \
        $WEBHOOK
fi
```

## 🐛 Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+
```

**Environment Variables Not Loading:**
- Verify variable names start with `VITE_`
- Check platform-specific environment setup
- Restart deployment after adding variables

**CORS Errors:**
- Update backend CORS configuration
- Verify API_BASE URL is correct
- Check browser developer tools for details

**WebSocket Connection Issues:**
- Verify SOCKET_BASE URL matches API_BASE
- Check firewall/proxy settings
- Ensure backend supports WebSocket upgrades

**Route Not Found (404):**
- Configure catch-all route to serve `index.html`
- Verify build output includes all assets
- Check server configuration for SPA routing

### Debug Mode

Enable debug logging:
```typescript
// lib/config.ts
export const config = {
  debug: import.meta.env.MODE === 'development',
  // ... other config
};

// Usage
if (config.debug) {
  console.log('Debug info:', data);
}
```

### Performance Issues

**Bundle Analysis:**
```bash
npm run build -- --analyze
```

**Network Analysis:**
- Use browser DevTools Network tab
- Check for large assets or slow API calls
- Monitor WebSocket connection stability

## 📞 Support

For deployment issues:
1. Check platform-specific documentation
2. Verify environment configuration
3. Test build locally first
4. Check server logs for errors
5. Create issue with deployment details

---

**Deployment Checklist:**
- [ ] Environment variables configured
- [ ] Build completes successfully
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Backend CORS updated
- [ ] Error monitoring setup
- [ ] Performance monitoring active
- [ ] Health checks configured