// Environment validation utility
export const validateEnvironment = () => {
  const issues: string[] = [];
  
  // Check if import.meta.env is available (only in browser/vite context)
  if (typeof import.meta === 'undefined' || typeof import.meta.env === 'undefined') {
    // This is expected in some contexts (build, SSR, etc.), so just return basic validation
    return { 
      isValid: true, 
      issues: [], 
      env: {}, 
      note: 'Running without import.meta.env (build context)' 
    };
  }
  
  // Check for required environment variables
  const requiredVars = ['VITE_API_BASE'];
  const optionalVars = ['VITE_SOCKET_BASE', 'VITE_ENABLE_LOGGING'];
  
  requiredVars.forEach(varName => {
    if (!import.meta.env[varName]) {
      issues.push(`Required environment variable ${varName} is not set`);
    }
  });
  
  // Log environment status
  console.log('🔍 Environment Check:', {
    hasImportMeta: typeof import.meta !== 'undefined',
    hasEnv: typeof import.meta.env !== 'undefined',
    isDev: import.meta.env?.DEV,
    isProd: import.meta.env?.PROD,
    mode: import.meta.env?.MODE,
    availableVars: Object.keys(import.meta.env || {}).filter(key => key.startsWith('VITE_')),
  });
  
  return {
    isValid: issues.length === 0,
    issues,
    env: import.meta.env
  };
};

export default validateEnvironment;