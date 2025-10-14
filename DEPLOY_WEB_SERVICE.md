# 🚀 DEPLOY AS WEB SERVICE - Quick Guide

## ✅ Everything is Ready!

Your frontend is now configured as a **Web Service** with proper routing.

---

## 📦 What Was Done

1. ✅ Added `serve` package to handle routing
2. ✅ Created `serve.json` for rewrite rules
3. ✅ Updated `package.json` with start script
4. ✅ Updated `render.yaml` for Web Service
5. ✅ Configured `vite.config.ts`

---

## 🚀 Deploy in 3 Steps

### **Step 1: Commit & Push**

```bash
git add .
git commit -m "Configure as Web Service with serve package for routing"
git push origin main
```

---

### **Step 2: Update Render Dashboard**

1. Go to: https://dashboard.render.com
2. Click on your service: `tx-figma-frontend`
3. Go to **Settings**
4. Update these fields:

**Build & Deploy:**
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

5. Click **"Save Changes"**

---

### **Step 3: Deploy**

1. Click **"Manual Deploy"** (top right)
2. Select **"Deploy latest commit"**
3. Wait 5-10 minutes

---

## 🎯 What Will Happen

### **Build Phase:**
```
==> npm install && npm run build
✓ Installing dependencies...
✓ Building with Vite...
✓ Build complete!
```

### **Start Phase:**
```
==> npm start
✓ Starting serve...
✓ Serving on port 10000
✓ Ready to accept connections!
```

### **Result:**
```
✅ https://tx-figma-frontend.onrender.com/ → Works!
✅ https://tx-figma-frontend.onrender.com/ai-insights → Works!
✅ https://tx-figma-frontend.onrender.com/charts → Works!
✅ All routes work, no 404!
```

---

## 🔧 Render Settings Summary

Copy these into Render Dashboard:

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm start
```

**Environment Variables:**
```
NODE_VERSION=20
VITE_API_BASE=https://tx-predictive-intelligence.onrender.com
VITE_SOCKET_BASE=https://tx-predictive-intelligence.onrender.com
VITE_DEMO_MODE=false
VITE_ENABLE_LOGGING=false
VITE_POLL_INTERVAL_MS=180000
```

---

## ✅ Success Criteria

After deployment, verify:
- [ ] Build completes without errors
- [ ] Server starts successfully
- [ ] Root URL loads: `https://tx-figma-frontend.onrender.com/`
- [ ] AI Insights loads: `https://tx-figma-frontend.onrender.com/ai-insights`
- [ ] Refresh works (no 404)
- [ ] Direct URL access works
- [ ] Backend API calls work

---

## 🎉 You're All Set!

Just commit, push, update Render settings, and deploy!

**Time to deployment: ~15 minutes**

---

**Let's ship it!** 🚀
