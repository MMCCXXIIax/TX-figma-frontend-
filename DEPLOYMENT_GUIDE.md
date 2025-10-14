# 🚀 Deployment Guide - TX Predictive Intelligence

## 📍 Deployment URLs

### **Frontend**
```
https://tx-figma-frontend.onrender.com
```

### **Backend**
```
https://tx-predictive-intelligence.onrender.com
```

---

## 🔧 Pre-Deployment Checklist

### **1. Environment Variables** ✅

Create a `.env` file (or configure in Render dashboard):

```bash
# Backend API URL
VITE_API_BASE=https://tx-predictive-intelligence.onrender.com

# Socket.IO URL
VITE_SOCKET_BASE=https://tx-predictive-intelligence.onrender.com

# Demo Mode (false for production)
VITE_DEMO_MODE=false

# Enable Logging (false for production)
VITE_ENABLE_LOGGING=false

# Polling Interval (3 minutes)
VITE_POLL_INTERVAL_MS=180000

# Frontend URL (for CORS)
VITE_FRONTEND_URL=https://tx-figma-frontend.onrender.com
```

### **2. Build Configuration** ✅

Verify `vite.config.ts` is production-ready:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/', // Root path
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable for production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs']
        }
      }
    }
  }
})
```

### **3. Package.json Scripts** ✅

Verify scripts are correct:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

---

## 🌐 Render.com Deployment

### **Step 1: Create New Web Service**

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository: `TX-figma-frontend`

### **Step 2: Configure Service**

**Basic Settings:**
- **Name:** `tx-figma-frontend`
- **Region:** Choose closest to your users
- **Branch:** `main` (or your production branch)
- **Root Directory:** Leave empty (or specify if in subdirectory)

**Build Settings:**
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

**Instance Type:**
- **Free** (for testing)
- **Starter** ($7/month - recommended for production)
- **Standard** ($25/month - for high traffic)

### **Step 3: Environment Variables**

Add these in Render dashboard:

| Key | Value |
|-----|-------|
| `VITE_API_BASE` | `https://tx-predictive-intelligence.onrender.com` |
| `VITE_SOCKET_BASE` | `https://tx-predictive-intelligence.onrender.com` |
| `VITE_DEMO_MODE` | `false` |
| `VITE_ENABLE_LOGGING` | `false` |
| `VITE_POLL_INTERVAL_MS` | `180000` |
| `VITE_FRONTEND_URL` | `https://tx-figma-frontend.onrender.com` |

### **Step 4: Deploy**

1. Click **"Create Web Service"**
2. Wait for build to complete (5-10 minutes)
3. Service will be available at: `https://tx-figma-frontend.onrender.com`

---

## 🔒 CORS Configuration

### **Backend CORS Settings**

Ensure backend allows requests from frontend:

```python
# Backend (Flask)
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    'https://tx-figma-frontend.onrender.com',
    'http://localhost:3000',  # For development
    'http://localhost:5173'   # Vite dev server
])
```

---

## 🧪 Post-Deployment Testing

### **1. Health Check**
```bash
curl https://tx-figma-frontend.onrender.com
```
**Expected:** HTML page loads

### **2. API Connectivity**
Open browser console at `https://tx-figma-frontend.onrender.com`:
```javascript
fetch('https://tx-predictive-intelligence.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log('Backend Health:', d));
```
**Expected:** `{ "status": "ok", "timestamp": "..." }`

### **3. Test All Features**
1. Navigate to AI Insights: `https://tx-figma-frontend.onrender.com/ai-insights`
2. Check all 4 tabs load
3. Verify data is coming from backend (not mock data)
4. Check browser console for errors

### **4. Test Backend Endpoints**
```javascript
const baseUrl = 'https://tx-predictive-intelligence.onrender.com';

// Test new endpoints
fetch(`${baseUrl}/api/analytics/attribution?period=30d`)
  .then(r => r.json()).then(d => console.log('Attribution:', d));

fetch(`${baseUrl}/api/analytics/forecast?timeframe=7d`)
  .then(r => r.json()).then(d => console.log('Forecast:', d));

fetch(`${baseUrl}/api/achievements`)
  .then(r => r.json()).then(d => console.log('Achievements:', d));

fetch(`${baseUrl}/api/streak`)
  .then(r => r.json()).then(d => console.log('Streak:', d));
```

---

## 📊 Performance Optimization

### **1. Enable Compression**

Render automatically enables gzip compression for static files.

### **2. Caching Headers**

Create `_headers` file in `public/` directory:
```
/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

### **3. CDN (Optional)**

For better performance, consider using Cloudflare CDN:
1. Point domain to Render service
2. Enable Cloudflare proxy
3. Configure caching rules

---

## 🔍 Monitoring

### **1. Render Dashboard**

Monitor in Render dashboard:
- Build logs
- Deploy logs
- Runtime logs
- Metrics (CPU, memory, bandwidth)

### **2. Error Tracking**

Add error tracking (optional):
```bash
npm install @sentry/react
```

Configure in `src/main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

### **3. Analytics**

Add Google Analytics (optional):
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🚨 Troubleshooting

### **Issue: Build fails**
**Solution:**
1. Check build logs in Render dashboard
2. Verify all dependencies in `package.json`
3. Ensure TypeScript compiles: `npm run build` locally
4. Check Node version compatibility

### **Issue: Blank page after deployment**
**Solution:**
1. Check browser console for errors
2. Verify `base` path in `vite.config.ts` is `/`
3. Check that `dist` folder contains `index.html`
4. Verify environment variables are set

### **Issue: API calls failing**
**Solution:**
1. Check CORS configuration on backend
2. Verify `VITE_API_BASE` environment variable
3. Check backend is running: `curl https://tx-predictive-intelligence.onrender.com/health`
4. Check browser network tab for errors

### **Issue: Slow initial load**
**Solution:**
1. Backend may be cold-starting (wait 30-60s)
2. Consider upgrading to paid Render plan (no cold starts)
3. Enable demo mode for faster initial load: `VITE_DEMO_MODE=true`

---

## 🔄 Continuous Deployment

### **Auto-Deploy on Git Push**

Render automatically deploys when you push to the configured branch:

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Render will:
1. Detect the push
2. Start a new build
3. Deploy automatically
4. Update the live site

### **Manual Deploy**

In Render dashboard:
1. Go to your service
2. Click **"Manual Deploy"**
3. Select branch
4. Click **"Deploy"**

---

## 📋 Deployment Checklist

### **Pre-Deployment**
- [x] All components tested locally
- [x] Environment variables configured
- [x] Build succeeds locally: `npm run build`
- [x] Preview works: `npm run preview`
- [x] No console errors
- [x] All backend endpoints tested

### **Deployment**
- [ ] Create Render web service
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Deploy service
- [ ] Wait for build to complete

### **Post-Deployment**
- [ ] Test frontend URL: `https://tx-figma-frontend.onrender.com`
- [ ] Test all pages load
- [ ] Test API connectivity
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Monitor error logs

---

## 🎯 Production URLs

### **Frontend**
```
https://tx-figma-frontend.onrender.com
```

**Pages:**
- Dashboard: `https://tx-figma-frontend.onrender.com/`
- AI Insights: `https://tx-figma-frontend.onrender.com/ai-insights`
- Charts: `https://tx-figma-frontend.onrender.com/charts`
- Alerts: `https://tx-figma-frontend.onrender.com/alerts`
- Paper Trading: `https://tx-figma-frontend.onrender.com/paper-trading`
- Settings: `https://tx-figma-frontend.onrender.com/settings`

### **Backend**
```
https://tx-predictive-intelligence.onrender.com
```

**Health Check:**
```
https://tx-predictive-intelligence.onrender.com/health
```

**API Docs:**
```
https://tx-predictive-intelligence.onrender.com/docs
```

---

## 🔐 Security Checklist

### **Frontend Security**
- [x] No API keys in frontend code
- [x] Environment variables for sensitive data
- [x] HTTPS enforced (Render does this automatically)
- [x] No console.log in production (set `VITE_ENABLE_LOGGING=false`)
- [x] Content Security Policy headers (optional)

### **Backend Security**
- [x] CORS configured correctly
- [x] Rate limiting enabled
- [x] Authentication (if needed)
- [x] Input validation
- [x] SQL injection prevention

---

## 📊 Expected Performance

### **Build Time**
- **First build:** 5-10 minutes
- **Subsequent builds:** 3-5 minutes

### **Load Time**
- **First visit:** 2-3 seconds
- **Cached visit:** < 1 second
- **API calls:** < 500ms (backend dependent)

### **Bundle Size**
- **Total:** ~500KB (gzipped)
- **Initial JS:** ~200KB
- **Vendor chunks:** ~150KB
- **UI chunks:** ~100KB

---

## 🎉 Success Criteria

### **Deployment Successful When:**
- ✅ Frontend loads at `https://tx-figma-frontend.onrender.com`
- ✅ All pages accessible
- ✅ Backend API calls working
- ✅ No console errors
- ✅ All 4 tabs in AI Insights working
- ✅ Real data loading from backend
- ✅ Mobile responsive
- ✅ Fast load times

---

## 📞 Support

### **Render Support**
- Documentation: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

### **Project Support**
- Check `TROUBLESHOOTING.md` for common issues
- Review browser console for errors
- Check Render logs for build/runtime errors
- Test backend health endpoint

---

## 🚀 Ready to Deploy!

Your frontend is **100% ready** for deployment at:
```
https://tx-figma-frontend.onrender.com
```

**All systems go!** 🎊

---

**Last Updated:** October 14, 2025  
**Status:** 🟢 **DEPLOYMENT READY**  
**Frontend URL:** `https://tx-figma-frontend.onrender.com`  
**Backend URL:** `https://tx-predictive-intelligence.onrender.com`
