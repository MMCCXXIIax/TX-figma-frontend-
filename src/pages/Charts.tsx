import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { CandlestickChart } from '../components/charts/CandlestickChart';
import { Search, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { marketApi, patternApi } from '../lib/api-client';
import config from '../lib/config';
import { usePoll } from '../hooks/usePoll';

interface CandleData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PatternDetection {
  pattern_name: string;
  confidence: number;
  pattern_type: 'bullish' | 'bearish' | 'neutral';
  description: string;
  timeframe: string;
  detected_at: string;
}

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  change_pct: number;
  volume: number;
  market_cap?: number;
}

export function Charts() {
  const [symbol, setSymbol] = useState('AAPL');
  const [period, setPeriod] = useState('1d');
  const [interval, setInterval] = useState('1h');
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<MarketData | null>(null);
  const [detectedPatterns, setDetectedPatterns] = useState<PatternDetection[]>([]);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    if (symbol) {
      loadChartData();
      loadCurrentPrice();
    }
  }, [symbol, period, interval]);

  // Poll every 180s to refresh chart and price
  usePoll(() => {
    if (!symbol) return;
    loadChartData();
    loadCurrentPrice();
  }, config.pollIntervalMs, { immediate: false });

  const loadChartData = async () => {
    if (!symbol) return;
    
    setLoading(true);
    try {
      const response = await marketApi.getCandles(symbol, period, interval);
      
      if (response.data.success && response.data.data) {
        setCandleData(response.data.data);
      } else {
        toast.error('Failed to load chart data');
      }
    } catch (error) {
      console.error('Failed to load chart data:', error);
      toast.error('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentPrice = async () => {
    if (!symbol) return;
    
    try {
      const response = await marketApi.getMarketData(symbol);
      
      if (response.data.success && response.data.data) {
        setCurrentPrice(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load current price:', error);
    }
  };

  const detectPatterns = async () => {
    if (!symbol) {
      toast.error('Please enter a symbol');
      return;
    }

    setDetecting(true);
    try {
      const response = await patternApi.detectEnhanced(symbol);
      
      if (response.data.success) {
        setDetectedPatterns(response.data.data || []);
        toast.success(`Found ${response.data.data?.length || 0} patterns`);
      } else {
        toast.error('Pattern detection failed');
      }
    } catch (error) {
      console.error('Pattern detection failed:', error);
      toast.error('Pattern detection failed');
    } finally {
      setDetecting(false);
    }
  };

  const getPatternColor = (type: string) => {
    switch (type) {
      case 'bullish': return 'bg-green-600';
      case 'bearish': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl">Charts & Pattern Detection</h1>
        {currentPrice && (
          <div className="text-right">
            <div className="text-white text-xl">${(currentPrice.price ?? 0).toFixed(2)}</div>
            <div className={`text-sm ${(currentPrice.change ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {(currentPrice.change ?? 0) >= 0 ? '+' : ''}${(currentPrice.change ?? 0).toFixed(2)} ({(currentPrice.change_pct ?? 0).toFixed(2)}%)
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Chart Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol" className="text-gray-300">Symbol</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="AAPL"
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Period</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="5d">5 Days</SelectItem>
                  <SelectItem value="1mo">1 Month</SelectItem>
                  <SelectItem value="3mo">3 Months</SelectItem>
                  <SelectItem value="6mo">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Interval</Label>
              <Select value={interval} onValueChange={setInterval}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="1m">1 Min</SelectItem>
                  <SelectItem value="5m">5 Min</SelectItem>
                  <SelectItem value="15m">15 Min</SelectItem>
                  <SelectItem value="30m">30 Min</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Actions</Label>
              <Button 
                onClick={loadChartData}
                disabled={loading}
                className="w-full bg-sky-600 hover:bg-sky-700"
              >
                {loading ? 'Loading...' : 'Load Chart'}
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Patterns</Label>
              <Button 
                onClick={detectPatterns}
                disabled={detecting || !symbol}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {detecting ? 'Detecting...' : 'Detect Patterns'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{symbol} Chart</CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{period}</span>
                  <span>•</span>
                  <span>{interval}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                </div>
              ) : candleData.length > 0 ? (
                <CandlestickChart 
                  data={candleData} 
                  height={500}
                  showVolume={true}
                />
              ) : (
                <div className="flex items-center justify-center h-96 text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                    <p>Enter a symbol and click "Load Chart" to view candlestick data</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detected Patterns */}
        <div>
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Detected Patterns</CardTitle>
                <Badge variant="secondary" className="bg-sky-600 text-white">
                  {detectedPatterns.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {detectedPatterns.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400 text-sm">
                    No patterns detected. Click "Detect Patterns" to analyze the current chart.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {detectedPatterns.map((pattern, index) => (
                    <div key={index} className="p-3 rounded-lg bg-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`${getPatternColor(pattern.pattern_type)} text-white`}>
                          {pattern.pattern_name}
                        </Badge>
                        <span className={`text-sm ${getConfidenceColor(pattern.confidence)}`}>
                          {pattern.confidence}%
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-2">
                        {pattern.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{pattern.timeframe}</span>
                        <span>{new Date(pattern.detected_at).toLocaleTimeString()}</span>
                      </div>
                      
                      <Separator className="my-2 bg-gray-700" />
                      
                      <div className="flex items-center gap-2">
                        <Info className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {pattern.pattern_type.charAt(0).toUpperCase() + pattern.pattern_type.slice(1)} signal
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}