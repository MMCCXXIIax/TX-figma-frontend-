// Environment configuration with fallbacks
export const config = {
  // API Configuration
  apiBaseUrl: import.meta.env?.VITE_API_BASE || 'https://tx-predictive-intelligence.onrender.com',
  socketBaseUrl: import.meta.env?.VITE_SOCKET_BASE || import.meta.env?.VITE_API_BASE || 'https://tx-predictive-intelligence.onrender.com',
  
  // Development flags
  isDevelopment: import.meta.env?.DEV || false,
  isProduction: import.meta.env?.PROD || false,
  
  // Demo/Offline mode
  demoMode: import.meta.env?.VITE_DEMO_MODE === 'true' || false,
  
  // Logging
  enableLogging: import.meta.env?.VITE_ENABLE_LOGGING === 'true' || import.meta.env?.DEV || false,
};

// Log configuration in development
if (config.isDevelopment && config.enableLogging) {
  console.log('🔧 TX Predictive Intelligence Configuration:', {
    apiBaseUrl: config.apiBaseUrl,
    socketBaseUrl: config.socketBaseUrl,
    environment: config.isDevelopment ? 'development' : 'production',
  });
}

export default config;