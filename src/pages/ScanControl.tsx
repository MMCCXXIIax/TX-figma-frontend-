import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { Play, Square, Activity, Clock, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { usePoll } from '../hooks/usePoll';
import { scanApi, dataApi, isDemoMode } from '../lib/api-client';
import socketManager, { ScanUpdate } from '../lib/socket';
import config from '../lib/config';

interface ScanStatus {
  active: boolean;
  last_scan: string;
  patterns_found: number;
  symbols_scanned: number;
  scan_duration?: number;
  errors?: string[];
}

interface ScanConfig {
  symbols: string[];
  interval: number;
  auto_alerts: boolean;
  max_symbols?: number;
  patterns_to_detect?: string[];
  min_confidence?: number;
}

interface ScanControlProps {
  onScanStatusChange?: (isScanning: boolean) => void;
}

export function ScanControl({ onScanStatusChange }: ScanControlProps) {
  const [scanStatus, setScanStatus] = useState<ScanStatus | null>(null);
  const [scanConfig, setScanConfig] = useState<ScanConfig>({
    symbols: [],
    interval: 30,
    auto_alerts: true,
  });
  const [customSymbols, setCustomSymbols] = useState('');
  const [loading, setLoading] = useState(true);
  const [startingStoppping, setStartingStopping] = useState(false);
  const [realtimeScanUpdates, setRealtimeScanUpdates] = useState<ScanUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    loadScanData();
    setupWebSocket();
    
    return () => {
      socketManager.disconnect();
    };
  }, []);

  // Poll every 180s (3 minutes) to refresh status/config
  usePoll(() => {
    loadScanData();
  }, config.pollIntervalMs, { immediate: false });

  useEffect(() => {
    onScanStatusChange?.(scanStatus?.active || false);
  }, [scanStatus?.active, onScanStatusChange]);

  const loadScanData = async () => {
    setLoading(true);
    try {
      const [statusResponse, configResponse] = await Promise.all([
        scanApi.getStatus(),
        scanApi.getConfig(),
      ]);

      if (statusResponse.data.success) {
        setScanStatus(statusResponse.data.data);
      }

      if (configResponse.data.success) {
        const config = configResponse.data.data;
        setScanConfig(config);
        setCustomSymbols(config.symbols?.join(', ') || '');
      }
    } catch (error) {
      console.error('Failed to load scan data:', error);
      toast.error('Failed to load scan data');
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = async () => {
    try {
      await socketManager.connect();
      
      socketManager.onConnectionStatus((status) => {
        setIsConnected(status.connected);
        setIsDemo(isDemoMode() || socketManager.isDemoActive());
      });

      socketManager.onScanUpdate((update) => {
        // Ignore updates when disconnected to avoid confusing UX
        if (!socketManager.isConnected()) return;
        setRealtimeScanUpdates(prev => [update, ...prev.slice(0, 19)]); // Keep last 20 updates
      });

      socketManager.subscribeToScanResults();
    } catch (error) {
      console.error('Failed to setup WebSocket:', error);
    }
  };

  const startScan = async () => {
    setStartingStopping(true);
    try {
      const symbols = customSymbols
        .split(',')
        .map(s => s.trim().toUpperCase())
        .filter(s => s.length > 0);

      const config = {
        symbols: symbols.length > 0 ? symbols : undefined,
        interval: scanConfig.interval,
        auto_alerts: scanConfig.auto_alerts,
      };

      const response = await scanApi.startScan(config);
      
      if (response.data.success) {
        toast.success('Scan started successfully');
        loadScanData(); // Reload status
      } else {
        toast.error('Failed to start scan');
      }
    } catch (error) {
      console.error('Failed to start scan:', error);
      toast.error('Failed to start scan');
    } finally {
      setStartingStopping(false);
    }
  };

  const stopScan = async () => {
    setStartingStopping(true);
    try {
      const response = await scanApi.stopScan();
      
      if (response.data.success) {
        toast.success('Scan stopped');
        loadScanData(); // Reload status
      } else {
        toast.error('Failed to stop scan');
      }
    } catch (error) {
      console.error('Failed to stop scan:', error);
      toast.error('Failed to stop scan');
    } finally {
      setStartingStopping(false);
    }
  };

  const saveConfig = async () => {
    try {
      const symbols = customSymbols
        .split(',')
        .map(s => s.trim().toUpperCase())
        .filter(s => s.length > 0);

      const configToSave = {
        ...scanConfig,
        symbols: symbols.length > 0 ? symbols : [],
      };

      const response = await scanApi.setConfig(configToSave);
      
      if (response.data.success) {
        toast.success('Configuration saved');
        setScanConfig(configToSave);
      } else {
        toast.error('Failed to save configuration');
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
      toast.error('Failed to save configuration');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl">Scan Control</h1>
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          {isDemo && (
            <span className="text-xs px-2 py-0.5 rounded bg-yellow-600 text-black">Demo/Fallback</span>
          )}
          
          {/* Scan Status */}
          {scanStatus && (
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${scanStatus.active ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
              <span className="text-sm text-gray-400">
                {scanStatus.active ? 'Scanning' : 'Stopped'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Status Cards */}
      {scanStatus && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Scan Status</p>
                  <p className={`text-xl ${scanStatus.active ? 'text-green-400' : 'text-gray-400'}`}>
                    {scanStatus.active ? 'Active' : 'Stopped'}
                  </p>
                </div>
                {scanStatus.active ? (
                  <Activity className="h-8 w-8 text-green-400" />
                ) : (
                  <Square className="h-8 w-8 text-gray-400" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Patterns Found</p>
                  <p className="text-xl text-white">{scanStatus.patterns_found}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-sky-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Symbols Scanned</p>
                  <p className="text-xl text-white">{scanStatus.symbols_scanned}</p>
                </div>
                <Activity className="h-8 w-8 text-sky-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Last Scan</p>
                  <p className="text-xl text-white">
                    {scanStatus.last_scan ? new Date(scanStatus.last_scan).toLocaleTimeString() : '--'}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-sky-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Alerts */}
      {scanStatus?.errors && scanStatus.errors.length > 0 && (
        <Alert className="bg-red-900/20 border-red-700">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-white">
            <div className="space-y-1">
              {scanStatus.errors.map((error, index) => (
                <div key={index}>• {error}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scan Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Control Buttons */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Scan Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Button
                  onClick={startScan}
                  disabled={startingStoppping || scanStatus?.active}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {startingStoppping ? 'Starting...' : 'Start Scan'}
                </Button>
                
                <Button
                  onClick={stopScan}
                  disabled={startingStoppping || !scanStatus?.active}
                  variant="destructive"
                  className="flex-1"
                >
                  <Square className="h-4 w-4 mr-2" />
                  {startingStoppping ? 'Stopping...' : 'Stop Scan'}
                </Button>
              </div>

              <Separator className="bg-gray-700" />

              {/* Configuration */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symbols" className="text-gray-300">
                    Custom Symbols (comma-separated, leave empty for all available symbols)
                  </Label>
                  <Textarea
                    id="symbols"
                    value={customSymbols}
                    onChange={(e) => setCustomSymbols(e.target.value)}
                    placeholder="AAPL, MSFT, TSLA, NVDA..."
                    className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="interval" className="text-gray-300">Scan Interval (seconds)</Label>
                    <Input
                      id="interval"
                      type="number"
                      min="10"
                      max="300"
                      value={scanConfig.interval}
                      onChange={(e) => setScanConfig({
                        ...scanConfig,
                        interval: parseInt(e.target.value) || 30
                      })}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      id="auto-alerts"
                      checked={scanConfig.auto_alerts}
                      onCheckedChange={(checked) => setScanConfig({
                        ...scanConfig,
                        auto_alerts: checked
                      })}
                    />
                    <Label htmlFor="auto-alerts" className="text-gray-300">
                      Auto Alerts
                    </Label>
                  </div>
                </div>

                <Button
                  onClick={saveConfig}
                  variant="outline"
                  className="w-full border-gray-600 text-white hover:bg-gray-800"
                >
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Configuration Display */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Current Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Scan Interval</p>
                  <p className="text-white">{scanConfig.interval} seconds</p>
                </div>
                <div>
                  <p className="text-gray-400">Auto Alerts</p>
                  <Badge className={scanConfig.auto_alerts ? 'bg-green-600' : 'bg-gray-600'}>
                    {scanConfig.auto_alerts ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400">Symbols</p>
                  <p className="text-white text-xs">
                    {scanConfig.symbols && scanConfig.symbols.length > 0 
                      ? scanConfig.symbols.join(', ') 
                      : 'All available symbols'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Scan Updates */}
        <div>
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Live Scan Updates</CardTitle>
                <Badge variant="secondary" className="bg-sky-600 text-white">
                  {realtimeScanUpdates.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {realtimeScanUpdates.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Activity className="h-8 w-8 mx-auto mb-4 text-gray-600" />
                    <p className="text-sm">No scan updates yet. Start scanning to see live updates.</p>
                  </div>
                ) : (
                  realtimeScanUpdates.map((update, index) => (
                    <div key={index} className="p-3 rounded-lg bg-gray-800 border-l-4 border-sky-500">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white">{update.symbol}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(update.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {update.intraday_patterns && update.intraday_patterns.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-400">Intraday Patterns:</p>
                          {update.intraday_patterns.map((pattern, i) => (
                            <Badge key={i} variant="secondary" className="text-xs mr-1 mb-1">
                              {pattern.name || pattern}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {update.context_patterns && update.context_patterns.length > 0 && (
                        <div className="space-y-1 mt-2">
                          <p className="text-xs text-gray-400">Context Patterns:</p>
                          {update.context_patterns.map((pattern, i) => (
                            <Badge key={i} variant="outline" className="text-xs mr-1 mb-1">
                              {pattern.name || pattern}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}