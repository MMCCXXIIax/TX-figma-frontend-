# 🚀 Quick Start Guide

## Immediate Setup (30 seconds)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Verify setup
npm run verify

# 4. Start development server
npm run dev
```

## That's it! 🎉

Your application should now be running at: **http://localhost:5173**

## What You Should See

1. **Dashboard page** with market data and connection status
2. **Navigation bar** with all features accessible
3. **Onboarding modal** explaining features (first time only)
4. **No console errors** in browser developer tools

## If Something Goes Wrong

### Quick Fixes:

1. **Environment variable error?**
   ```bash
   # Make sure .env file exists and has content
   ls -la .env
   cat .env
   ```

2. **Backend connection failed?**
   - Make sure your Flask backend is running on port 5000
   - Test: `curl http://localhost:5000/api/market-scan?type=trending`

3. **Dependencies missing?**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Port already in use?**
   - Stop other applications using port 5173
   - Or change port in `vite.config.ts`

### Detailed Help:
- See **TROUBLESHOOTING.md** for comprehensive solutions
- Check browser console (F12) for detailed errors
- Verify Node.js version is 18+ with `node --version`

## Next Steps

1. **Explore the Dashboard** - View market movers and alerts
2. **Try Charts** - Enter "AAPL" and detect patterns
3. **Test Paper Trading** - Execute virtual trades
4. **Configure Scanning** - Set up live market monitoring

## Backend Requirements

Your Flask backend should provide these endpoints:
- `GET /api/market-scan?type=trending`
- `GET /api/scan/status`
- WebSocket connection at the same URL

## Production Deployment

When ready to deploy:

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Update environment variables** for your production API
3. **Deploy to Vercel/Netlify** or any static hosting
4. **Configure backend CORS** for your domain

---

**Need help?** Check TROUBLESHOOTING.md or verify your backend is running properly.