import { Alert, AlertDescription } from '../ui/alert';
import { Info, Wifi, WifiOff } from 'lucide-react';
import config from '../../lib/config';

interface DemoModeBannerProps {
  backendConnected: boolean;
}

export function DemoModeBanner({ backendConnected }: DemoModeBannerProps) {
  // Don't show banner if backend is connected and not in explicit demo mode
  if (backendConnected && !config.demoMode) {
    return null;
  }

  return (
    <Alert className="bg-blue-900/20 border-blue-700 mb-4">
      <div className="flex items-center gap-2">
        {backendConnected ? (
          <Wifi className="h-4 w-4 text-blue-400" />
        ) : (
          <WifiOff className="h-4 w-4 text-orange-400" />
        )}
        <Info className="h-4 w-4" />
      </div>
      <AlertDescription className="text-white ml-6">
        {config.demoMode ? (
          <div>
            <strong>Demo Mode Active</strong> - Using mock data for demonstration. 
            All features are functional with simulated data.
          </div>
        ) : (
          <div>
            <strong>Backend Unavailable</strong> - Unable to connect to the trading API. 
            The app is running in demo mode with mock data. 
            <br />
            <span className="text-sm text-gray-300 mt-1 block">
              Start your Flask backend on port 5000 to access real data.
            </span>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}