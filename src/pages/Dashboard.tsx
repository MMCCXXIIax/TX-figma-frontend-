import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { AlertsPanel } from '../components/alerts/AlertsPanel';
import { marketApi, dataApi, analyticsApi } from '../lib/api-client';
import socketManager, { PatternAlert } from '../lib/socket';
import { usePoll } from '../hooks/usePoll';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  change_pct: number;
  volume: number;
}

interface CoverageStats {
  total_assets: number;
  scanned_assets: number;
  coverage_pct: number;
  last_update: string;
}

interface AnalyticsSummary {
  total_patterns_detected: number;
  total_alerts_today: number;
  success_rate: number;
  top_performers: string[];
}

export function Dashboard() {
  const [topMovers, setTopMovers] = useState<MarketData[]>([]);
  const [coverageStats, setCoverageStats] = useState<CoverageStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [realtimeAlerts, setRealtimeAlerts] = useState<PatternAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    loadDashboardData();
    setupWebSocket();
    
    return () => {
      socketManager.disconnect();
    };
  }, []);

  // Poll every 180s to refresh dashboard aggregates
  usePoll(() => {
    loadDashboardData();
  }, 180_000, { immediate: false });

  const loadDashboardData = async () => {
    try {
      const [movingData, volumeData, coverage, analyticsData] = await Promise.all([
        marketApi.getMarketScan('trending'),
        marketApi.getMarketScan('volume'),
        dataApi.getCoverage(),
        analyticsApi.getSummary(),
      ]);

      // Combine trending and volume data
      const allMovers = [
        ...(movingData.data.success ? movingData.data.data : []),
        ...(volumeData.data.success ? volumeData.data.data : []),
      ];
      
      // Remove duplicates and sort by absolute change percentage
      const uniqueMovers = allMovers
        .filter((item, index, array) => 
          array.findIndex(t => t.symbol === item.symbol) === index
        )
        .sort((a, b) => Math.abs(b.change_pct) - Math.abs(a.change_pct))
        .slice(0, 8);

      setTopMovers(uniqueMovers);

      if (coverage.data.success) {
        setCoverageStats(coverage.data.data);
      }

      if (analyticsData.data.success) {
        setAnalytics(analyticsData.data.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = async () => {
    try {
      await socketManager.connect();
      
      // Subscribe to events
      socketManager.subscribeToAll();
      
      // Set up event handlers
      socketManager.onConnectionStatus((status) => {
        setIsConnected(status.connected);
      });

      socketManager.onPatternAlert((alert) => {
        setRealtimeAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10 alerts
      });

    } catch (error) {
      console.error('Failed to setup WebSocket:', error);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend 
  }: { 
    title: string; 
    value: string | number; 
    subtitle?: string; 
    icon: any; 
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl text-white mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${
            trend === 'up' ? 'bg-green-600/20' : 
            trend === 'down' ? 'bg-red-600/20' : 
            'bg-sky-600/20'
          }`}>
            <Icon className={`h-6 w-6 ${
              trend === 'up' ? 'text-green-400' : 
              trend === 'down' ? 'text-red-400' : 
              'text-sky-400'
            }`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl">Dashboard</h1>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Loading...</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                  <div className="h-8 bg-gray-700 rounded w-16"></div>
                  <div className="h-3 bg-gray-700 rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl">Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patterns"
          value={analytics?.total_patterns_detected || 0}
          subtitle="Detected today"
          icon={BarChart3}
          trend="neutral"
        />
        <StatCard
          title="Active Alerts"
          value={analytics?.total_alerts_today || 0}
          subtitle="Today"
          icon={Activity}
          trend="up"
        />
        <StatCard
          title="Success Rate"
          value={`${analytics?.success_rate || 0}%`}
          subtitle="Pattern accuracy"
          icon={TrendingUp}
          trend="up"
        />
        <StatCard
          title="Coverage"
          value={`${coverageStats?.coverage_pct || 0}%`}
          subtitle={`${coverageStats?.scanned_assets || 0}/${coverageStats?.total_assets || 0} assets`}
          icon={Activity}
          trend="neutral"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Movers */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Top Movers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topMovers.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        (stock.change || 0) >= 0 ? 'bg-green-600/20' : 'bg-red-600/20'
                      }`}>
                        {(stock.change || 0) >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white">{stock.symbol}</p>
                        <p className="text-sm text-gray-400">
                          Vol: {(stock.volume || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white">${(stock.price || 0).toFixed(2)}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${
                          (stock.change || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {(stock.change || 0) >= 0 ? '+' : ''}${(stock.change || 0).toFixed(2)}
                        </span>
                        <Badge 
                          variant={(stock.change_pct || 0) >= 0 ? 'default' : 'destructive'}
                          className={(stock.change_pct || 0) >= 0 ? 'bg-green-600' : 'bg-red-600'}
                        >
                          {(stock.change_pct || 0) >= 0 ? '+' : ''}{(stock.change_pct || 0).toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Alerts */}
        <div>
          <AlertsPanel 
            alerts={realtimeAlerts} 
            maxHeight="500px"
          />
        </div>
      </div>
    </div>
  );
}