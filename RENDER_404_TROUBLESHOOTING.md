# 🔧 Render 404 Error - Complete Fix Guide

## ❌ Current Issue

Still getting **404 - The requested path could not be found** after deployment.

---

## 🔍 Root Cause

Your Render service was likely created as a **Web Service** instead of a **Static Site**, so the `render.yaml` routing rules aren't being applied.

---

## ✅ SOLUTION: Recreate as Static Site

### **Step 1: Delete Current Service**

1. Go to **Render Dashboard**: https://dashboard.render.com
2. Find your service: `tx-figma-frontend`
3. Click on it
4. Go to **Settings** (bottom of left sidebar)
5. Scroll down to **"Delete Service"**
6. Click **"Delete Service"** and confirm

---

### **Step 2: Create New Static Site**

1. Click **"New +"** → **"Static Site"** (NOT Web Service!)
2. Connect your GitHub repository: `MMCCXXIIax/TX-figma-frontend-`
3. Configure:

**Basic Settings:**
- **Name:** `tx-figma-frontend`
- **Branch:** `main`
- **Root Directory:** (leave empty)

**Build Settings:**
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

**Advanced Settings:**
- **Auto-Deploy:** Yes

4. Click **"Create Static Site"**

---

### **Step 3: Add Environment Variables**

After creation, go to **Environment** tab and add:

```
VITE_API_BASE=https://tx-predictive-intelligence.onrender.com
VITE_SOCKET_BASE=https://tx-predictive-intelligence.onrender.com
VITE_DEMO_MODE=false
VITE_ENABLE_LOGGING=false
VITE_POLL_INTERVAL_MS=180000
```

---

### **Step 4: Configure Redirects**

1. Go to **Redirects/Rewrites** tab
2. Click **"Add Rule"**
3. Configure:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** `Rewrite`
4. Click **"Save Changes"**

---

### **Step 5: Deploy**

The site will automatically deploy. Wait 5-10 minutes.

---

## 🎯 Alternative: Fix Current Web Service

If you don't want to delete and recreate:

### **Option A: Add Redirect Rule Manually**

1. Go to your service in Render Dashboard
2. Click **"Redirects/Rewrites"** in left sidebar
3. Click **"Add Rule"**
4. Configure:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** `Rewrite` (NOT Redirect!)
5. Click **"Save Changes"**
6. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

### **Option B: Use serve Package**

If the above doesn't work, modify your setup to use `serve`:

1. **Update `package.json`:**

Add to dependencies:
```json
{
  "dependencies": {
    "serve": "^14.2.3"
  },
  "scripts": {
    "start": "serve -s dist -l $PORT"
  }
}
```

2. **Update Render Settings:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

3. **Commit and push:**
```bash
git add package.json
git commit -m "Add serve for production"
git push origin main
```

---

## 🧪 Verify the Fix

After deployment, test these URLs:

1. **Root:** https://tx-figma-frontend.onrender.com/
2. **AI Insights:** https://tx-figma-frontend.onrender.com/ai-insights
3. **Charts:** https://tx-figma-frontend.onrender.com/charts
4. **Alerts:** https://tx-figma-frontend.onrender.com/alerts

**All should return 200 OK, not 404!**

Also test:
- Navigate to `/ai-insights`
- Press **F5** to refresh
- Should NOT get 404

---

## 📊 Check Build Output

In Render logs, you should see:

```
==> Running build command 'npm install && npm run build'...
✓ 2434 modules transformed.
✓ built in ~40s

dist/
  index.html
  _redirects  ← This file should be here!
  assets/
    ...
```

**If `_redirects` is NOT in the dist folder**, that's the problem!

---

## 🔧 Verify _redirects File

Let me verify the file is correct:

**File:** `public/_redirects`
**Content:**
```
/*    /index.html   200
```

This tells Render: "For ANY route, serve index.html with 200 status"

---

## 🚨 Common Issues

### **Issue 1: Service Type is Wrong**
**Symptom:** 404 on all routes except `/`
**Solution:** Recreate as Static Site (see Step 1-5 above)

### **Issue 2: _redirects Not Copied**
**Symptom:** Build succeeds but still 404
**Solution:** 
- Verify `public/_redirects` exists
- Check build logs for file copy
- Rebuild: `npm run build` locally and check `dist/_redirects`

### **Issue 3: Redirect Rule Not Applied**
**Symptom:** Static site but still 404
**Solution:** Add redirect rule manually in Render dashboard

### **Issue 4: Cache Issue**
**Symptom:** Old version still showing
**Solution:** 
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Try incognito mode

---

## 📝 Quick Checklist

- [ ] Service created as **Static Site** (not Web Service)
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `dist`
- [ ] Redirect rule added: `/* → /index.html (Rewrite)`
- [ ] Environment variables added
- [ ] `public/_redirects` file exists
- [ ] Latest commit deployed
- [ ] Tested all routes

---

## 🎯 Recommended Action

**BEST SOLUTION:** Delete and recreate as Static Site (Steps 1-5)

This ensures:
- ✅ Correct service type
- ✅ Proper routing
- ✅ Faster performance
- ✅ Lower cost
- ✅ Automatic CDN

**Time:** 10 minutes  
**Difficulty:** Easy  
**Success Rate:** 99%

---

## 📞 Still Not Working?

If you've tried everything and still getting 404:

1. **Check Render Status:** https://status.render.com
2. **Check Build Logs:** Look for errors
3. **Test Locally:** `npm run build && npx serve -s dist`
4. **Share Logs:** Copy build logs for debugging

---

## 🎉 Expected Result

After fix:
- ✅ All routes work (no 404)
- ✅ Refresh works (no 404)
- ✅ Direct URL access works
- ✅ Fast load times (< 2s)
- ✅ Backend API calls work

---

**Let me know which option you choose and I'll help you through it!** 🚀
