# TX Predictive Intelligence - Troubleshooting Guide

## Common Issues and Solutions

### 1. Environment Variable Issues

#### Error: `TypeError: Cannot read properties of undefined (reading 'VITE_API_BASE')`

**Cause**: Environment variables are not being loaded properly by Vite.

**Solutions**:

1. **Check .env file exists**:
   ```bash
   ls -la .env
   ```
   If missing, create it:
   ```bash
   cp .env.example .env
   ```

2. **Verify .env file content**:
   ```env
   VITE_API_BASE=http://localhost:5000
   VITE_SOCKET_BASE=http://localhost:5000
   ```

3. **Restart development server**:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

4. **Check Vite configuration**:
   Ensure `vite.config.ts` has:
   ```typescript
   export default defineConfig({
     envPrefix: 'VITE_',
     // ... other config
   });
   ```

5. **Clear Vite cache**:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

### 2. Backend Connection Issues

#### Error: Network errors or API calls failing

**Solutions**:

1. **Verify backend is running**:
   ```bash
   curl http://localhost:5000/api/market-scan?type=trending
   ```

2. **Check Flask backend CORS configuration**:
   ```python
   from flask_cors import CORS
   CORS(app, origins=["http://localhost:5173"])
   ```

3. **Update API base URL in .env**:
   ```env
   VITE_API_BASE=http://localhost:5000
   # or your actual backend URL
   ```

### 3. WebSocket Connection Issues

#### Error: WebSocket connection failed or Socket.IO errors

**Solutions**:

1. **Verify Socket.IO is installed in backend**:
   ```bash
   pip install python-socketio flask-socketio
   ```

2. **Check WebSocket URL in .env**:
   ```env
   VITE_SOCKET_BASE=http://localhost:5000
   ```

3. **Backend Socket.IO configuration**:
   ```python
   from flask_socketio import SocketIO
   socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")
   ```

### 4. Build and Dependencies Issues

#### Error: Build fails or dependency conflicts

**Solutions**:

1. **Clear and reinstall dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Update Node.js to latest LTS**:
   ```bash
   node --version  # Should be 18+
   ```

3. **Check for TypeScript errors**:
   ```bash
   npx tsc --noEmit
   ```

### 5. Import and Module Issues

#### Error: Module resolution failures

**Solutions**:

1. **Check file paths are correct**:
   - Components: `./components/...`
   - Pages: `./pages/...`
   - Lib: `./lib/...`

2. **Verify TypeScript configuration**:
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "bundler",
       "allowImportingTsExtensions": true
     }
   }
   ```

3. **Restart TypeScript server** (in VS Code):
   - `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### 6. Styling and CSS Issues

#### Error: Tailwind classes not working

**Solutions**:

1. **Verify Tailwind CSS v4 installation**:
   ```bash
   npm list tailwindcss
   ```

2. **Check globals.css import**:
   In `src/main.tsx`:
   ```typescript
   import '../styles/globals.css'
   ```

3. **Verify Tailwind configuration**:
   Check `styles/globals.css` has proper `@theme` and `@layer` directives.

### 7. Chart and Visualization Issues

#### Error: Charts not rendering or Recharts errors

**Solutions**:

1. **Verify Recharts installation**:
   ```bash
   npm list recharts
   ```

2. **Check data format**:
   Ensure candlestick data has required fields:
   ```typescript
   interface CandleData {
     timestamp: string;
     open: number;
     high: number;
     low: number;
     close: number;
     volume: number;
   }
   ```

### 8. Development Environment Setup

#### Complete reset procedure:

1. **Stop all running servers**
2. **Clear everything**:
   ```bash
   rm -rf node_modules package-lock.json .vite
   ```
3. **Reinstall**:
   ```bash
   npm install
   ```
4. **Verify environment**:
   ```bash
   cp .env.example .env
   # Edit .env with correct values
   ```
5. **Start fresh**:
   ```bash
   npm run dev
   ```

### 9. Production Deployment Issues

#### Vercel/Netlify deployment problems:

1. **Set environment variables in dashboard**:
   - `VITE_API_BASE=https://your-api-domain.com`
   - `VITE_SOCKET_BASE=https://your-api-domain.com`

2. **Update backend CORS for production domain**

3. **Check build output**:
   ```bash
   npm run build
   npm run preview
   ```

### 10. Performance Issues

#### Slow loading or high memory usage:

1. **Enable production build**:
   ```bash
   npm run build
   npm run preview
   ```

2. **Check bundle size**:
   ```bash
   npm run build -- --analyze
   ```

3. **Optimize WebSocket connections**:
   - Limit concurrent connections
   - Implement proper cleanup

### Debug Commands

#### Environment debugging:
```bash
# Check environment variables
node -e "console.log(process.env)"

# Test API connection
curl -v http://localhost:5000/api/market-scan?type=trending

# Check WebSocket connection
# (Use browser developer tools → Network → WS tab)
```

#### Browser debugging:
1. Open Developer Tools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Check Application tab for localStorage/sessionStorage

### Getting Help

If issues persist:

1. **Check browser console** for detailed error messages
2. **Review backend logs** for API errors
3. **Verify all services are running**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
4. **Test individual components** in isolation
5. **Check this troubleshooting guide** for similar issues

### Contact Information

For additional support:
- Check GitHub issues
- Review documentation
- Verify backend API compatibility
- Ensure all prerequisites are met