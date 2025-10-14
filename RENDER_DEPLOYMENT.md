# 🚀 Render.com Deployment - Quick Guide

## 📍 Deployment URL
```
https://tx-figma-frontend.onrender.com
```

---

## ⚡ Quick Deploy Steps

### **1. Push to GitHub**
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### **2. Create Render Service**

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:

**Build & Deploy:**
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Branch:** `main`

**Environment Variables:**
```
VITE_API_BASE=https://tx-predictive-intelligence.onrender.com
VITE_SOCKET_BASE=https://tx-predictive-intelligence.onrender.com
VITE_DEMO_MODE=false
VITE_ENABLE_LOGGING=false
VITE_POLL_INTERVAL_MS=180000
```

### **3. Deploy**
Click **"Create Web Service"** and wait 5-10 minutes.

---

## ✅ Post-Deployment Test

### **Test in Browser Console**
Navigate to `https://tx-figma-frontend.onrender.com` and run:

```javascript
// Test backend connectivity
fetch('https://tx-predictive-intelligence.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend Health:', d));

// Test new endpoints
const base = 'https://tx-predictive-intelligence.onrender.com';

fetch(`${base}/api/analytics/attribution?period=30d`)
  .then(r => r.json()).then(d => console.log('✅ Attribution:', d));

fetch(`${base}/api/analytics/forecast?timeframe=7d`)
  .then(r => r.json()).then(d => console.log('✅ Forecast:', d));

fetch(`${base}/api/achievements`)
  .then(r => r.json()).then(d => console.log('✅ Achievements:', d));

fetch(`${base}/api/streak`)
  .then(r => r.json()).then(d => console.log('✅ Streak:', d));
```

---

## 📊 What's Deployed

### **Frontend Features**
- ✅ 8 Advanced AI Components
- ✅ AI Intelligence Center (4 tabs)
- ✅ 77 Backend Endpoints Integrated
- ✅ Real-time Data
- ✅ Responsive Design
- ✅ Production Optimized

### **Pages**
- `/` - Dashboard
- `/ai-insights` - AI Intelligence Center ⭐
- `/charts` - Charts & Analysis
- `/alerts` - Active Alerts
- `/paper-trading` - Paper Trading
- `/settings` - Settings

---

## 🎯 Success Criteria

✅ Frontend loads at `https://tx-figma-frontend.onrender.com`  
✅ All pages accessible  
✅ Backend API calls working  
✅ No console errors  
✅ AI Insights page fully functional  
✅ Real data loading  

---

## 🐛 Troubleshooting

### **Issue: Build fails**
- Check Render logs
- Verify `package.json` dependencies
- Ensure TypeScript compiles locally: `npm run build`

### **Issue: Blank page**
- Check browser console
- Verify `dist` folder has `index.html`
- Check environment variables are set

### **Issue: API calls failing**
- Verify backend is running: `curl https://tx-predictive-intelligence.onrender.com/health`
- Check CORS configuration on backend
- Wait 30-60s for backend cold start

---

## 📞 Support

- **Render Docs:** https://render.com/docs
- **Render Status:** https://status.render.com
- **Project Docs:** See `DEPLOYMENT_GUIDE.md`

---

**Ready to deploy!** 🚀

**Frontend URL:** `https://tx-figma-frontend.onrender.com`  
**Backend URL:** `https://tx-predictive-intelligence.onrender.com`
