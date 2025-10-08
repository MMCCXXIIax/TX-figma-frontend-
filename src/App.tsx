import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { DemoModeBanner } from './components/layout/DemoModeBanner';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { validateEnvironment } from './lib/env-check';
import config from './lib/config';
import { Dashboard } from './pages/Dashboard';
import { Charts } from './pages/Charts';
import { PaperTrading } from './pages/PaperTrading';
import { ScanControl } from './pages/ScanControl';
import { Backtesting } from './pages/Backtesting';
import { Sentiment } from './pages/Sentiment';
import { Risk } from './pages/Risk';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { Toaster } from './components/ui/sonner';
import socketManager from './lib/socket';
import { scanApi } from './lib/api-client';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  useEffect(() => {
    // Validate environment first
    const envCheck = validateEnvironment();
    if (!envCheck.isValid) {
      console.error('❌ Environment validation failed:', envCheck.issues);
      // Continue anyway with defaults
    }

    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    // Initialize scan status
    checkScanStatus();

    // Setup WebSocket for global app state
    setupWebSocket();

    return () => {
      socketManager.disconnect();
    };
  }, []);

  const checkScanStatus = async () => {
    try {
      const response = await scanApi.getStatus();
      if (response.data.success) {
        setIsScanning(response.data.data.active);
        setBackendConnected(true);
      }
    } catch (error) {
      console.error('Failed to check scan status:', error);
      setBackendConnected(false);
    }
  };

  const setupWebSocket = async () => {
    try {
      await socketManager.connect();
      
      socketManager.onPatternAlert((alert) => {
        setAlertCount(prev => prev + 1);
      });

    } catch (error) {
      console.error('Failed to setup WebSocket:', error);
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navbar alertCount={alertCount} isScanning={isScanning} />
        
        <main className="min-h-[calc(100vh-4rem)] overflow-y-auto scroll-smooth">
          <div className="container mx-auto px-4">
            <DemoModeBanner backendConnected={backendConnected} />
          </div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/paper-trading" element={<PaperTrading />} />
            <Route path="/scan-control" element={<ScanControl onScanStatusChange={setIsScanning} />} />
            <Route path="/backtesting" element={<Backtesting />} />
            <Route path="/sentiment" element={<Sentiment />} />
            <Route path="/risk" element={<Risk />} />
            {/* Catch-all route to handle unknown paths */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>

        {/* Scroll to Top Button */}
        <ScrollToTop />

        {/* Global Components */}
        <OnboardingModal 
          open={showOnboarding} 
          onComplete={handleOnboardingComplete} 
        />
        <Toaster />
      </div>
    </Router>
  );
}