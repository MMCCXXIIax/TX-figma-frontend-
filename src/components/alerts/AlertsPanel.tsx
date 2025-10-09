import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { AlertTriangle, TrendingUp, TrendingDown, X, Eye } from 'lucide-react';
import { PatternAlert } from '../../lib/socket';
import { alertsApi } from '../../lib/api-client';

interface Alert {
  id: number;
  symbol: string;
  alert_type: string;
  confidence_pct: number;
  price: number;
  timestamp: string;
  metadata?: any;
  status?: 'active' | 'dismissed';
}

interface AlertsPanelProps {
  alerts: PatternAlert[];
  onDismissAlert?: (alertId: number) => void;
  onViewAlert?: (alert: Alert) => void;
  maxHeight?: string;
  showHeader?: boolean;
}

export function AlertsPanel({ 
  alerts, 
  onDismissAlert, 
  onViewAlert,
  maxHeight = '400px',
  showHeader = true 
}: AlertsPanelProps) {
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveAlerts();
  }, []);

  useEffect(() => {
    // Add new real-time alerts to the list
    if (alerts.length > 0) {
      const newAlerts = alerts.map((alert, index) => ({
        id: Date.now() + index,
        ...alert,
        status: 'active' as const,
      }));
      
      setActiveAlerts(prev => [...newAlerts, ...prev]);
    }
  }, [alerts]);

  const loadActiveAlerts = async () => {
    try {
      const response = await alertsApi.getActiveAlerts();
      if (response.data.success) {
        setActiveAlerts(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissAlert = async (alertId: number) => {
    try {
      await alertsApi.dismissAlert(alertId);
      setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
      onDismissAlert?.(alertId);
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
    }
  };

  const getAlertIcon = (alertType: string) => {
    if (alertType.toLowerCase().includes('bullish') || alertType.toLowerCase().includes('buy')) {
      return <TrendingUp className="h-4 w-4 text-green-400" />;
    } else if (alertType.toLowerCase().includes('bearish') || alertType.toLowerCase().includes('sell')) {
      return <TrendingDown className="h-4 w-4 text-red-400" />;
    }
    return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-600';
    if (confidence >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        {showHeader && (
          <CardHeader className="pb-3">
            <CardTitle className="text-white">Live Alerts</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-700">
      {showHeader && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Live Alerts</CardTitle>
            <Badge variant="secondary" className="bg-sky-600 text-white">
              {activeAlerts.length}
            </Badge>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <ScrollArea style={{ maxHeight }}>
          {activeAlerts.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              No active alerts
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="p-4 hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {getAlertIcon(alert.alert_type)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white">{alert.symbol}</span>
                          <Badge 
                            className={`text-xs ${getConfidenceColor(alert.confidence_pct)} text-white`}
                          >
                            {alert.confidence_pct}%
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-300">{alert.alert_type}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>${(alert.price ?? 0).toFixed(2)}</span>
                          <span>{formatTimestamp(alert.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {onViewAlert && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onViewAlert(alert)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDismissAlert(alert.id)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}