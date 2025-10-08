# Quick Setup Guide

## 1. Prerequisites
- Node.js 18+ installed
- Flask backend API running on port 5000
- Git (for cloning)

## 2. Installation Steps

```bash
# Clone the repository
git clone <your-repo-url>
cd tx-predictive-intelligence

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

## 3. Environment Configuration

Edit `.env` file:
```env
VITE_API_BASE=http://localhost:5000
VITE_SOCKET_BASE=http://localhost:5000
```

For production, update with your deployed backend URLs.

## 4. Backend Requirements

Your Flask backend should have these endpoints running:

### Essential Endpoints:
- `GET /api/market-scan?type=trending` - Market data
- `GET /api/scan/status` - Scan status
- `POST /api/detect-enhanced` - Pattern detection
- WebSocket connection for real-time updates

### Test Backend Connection:
```bash
curl http://localhost:5000/api/market-scan?type=trending
```

## 5. First Run Checklist

1. ✅ Backend API is running and accessible
2. ✅ WebSocket server is available
3. ✅ Environment variables are set
4. ✅ `npm install` completed successfully
5. ✅ `npm run dev` starts without errors
6. ✅ Application loads at http://localhost:5173
7. ✅ Dashboard shows connection status

## 6. Troubleshooting

### Common Issues:

**"Failed to connect to backend"**
- Check if Flask API is running on port 5000
- Verify CORS is configured in backend
- Check firewall/network restrictions

**"WebSocket connection failed"**
- Ensure Socket.IO is installed in backend
- Check WebSocket endpoint configuration
- Verify port accessibility

**"Pattern detection not working"**
- Check `/api/detect-enhanced` endpoint
- Verify symbol format (uppercase)
- Check backend logs for errors

**"Build fails"**
- Clear node_modules: `rm -rf node_modules && npm install`
- Update Node.js to latest LTS version
- Check for TypeScript errors

## 7. Production Deployment

### Build for production:
```bash
npm run build
```

### Deploy options:
- **Vercel**: Connect GitHub repo, set env vars
- **Netlify**: Drag & drop `dist/` folder
- **AWS S3**: Upload `dist/` to S3 bucket
- **Docker**: Use provided Dockerfile

### Environment Variables for Production:
```env
VITE_API_BASE=https://your-api-domain.com
VITE_SOCKET_BASE=https://your-api-domain.com
```

## 8. Feature Testing

### Test each feature:
1. **Dashboard**: Should show market movers and connection status
2. **Charts**: Enter "AAPL", load chart, detect patterns
3. **Paper Trading**: Execute a sample trade
4. **Scan Control**: Start/stop scanning
5. **Sentiment**: Analyze sentiment for a symbol
6. **Risk**: Configure risk settings

## 9. Development Tips

### Code Structure:
- Pages in `/pages/` for main routes
- Components in `/components/` organized by feature
- API client in `/lib/api-client.ts`
- WebSocket manager in `/lib/socket.ts`

### Adding New Features:
1. Create new page component
2. Add route in `App.tsx`
3. Add navigation in `Navbar.tsx`
4. Integrate with API client

### Debugging:
- Check browser console for errors
- Use React DevTools for component inspection
- Monitor Network tab for API calls
- Check WebSocket connection in Dashboard

## 10. Support

If you encounter issues:
1. Check this setup guide
2. Verify backend API functionality
3. Review browser console errors
4. Check backend logs
5. Ensure all dependencies are installed

Happy trading! 🚀