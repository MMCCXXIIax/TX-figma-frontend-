import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { statusApi, scanApi, marketApi, alertsApi, isBackendAvailable, isDemoMode } from '../../lib/api-client';

interface EndpointStatus {
  name: string;
  ok: boolean;
  latencyMs?: number;
  message?: string;
}

export function HealthPanel() {
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState<EndpointStatus[]>([]);
  const [demo, setDemo] = useState(isDemoMode());
  const [backendUp, setBackendUp] = useState(isBackendAvailable());

  const checkAll = async () => {
    setLoading(true);
    const start = Date.now();
    const time = () => Date.now() - start;

    const results: EndpointStatus[] = [];

    // Basic health
    try {
      const res = await statusApi.getHealth();
      results.push({ name: 'Health', ok: !!res?.data, latencyMs: time() });
    } catch (e: any) {
      results.push({ name: 'Health', ok: false, message: e?.message, latencyMs: time() });
    }

    // Provider health
    try {
      const res = await statusApi.getProviderHealth();
      const ok = !!res?.data;
      results.push({ name: 'Provider Health', ok, latencyMs: time() });
    } catch (e: any) {
      results.push({ name: 'Provider Health', ok: false, message: e?.message, latencyMs: time() });
    }

    // Scan status
    try {
      const res = await scanApi.getStatus();
      results.push({ name: 'Scan Status', ok: !!res?.data, latencyMs: time() });
    } catch (e: any) {
      results.push({ name: 'Scan Status', ok: false, message: e?.message, latencyMs: time() });
    }

    // Market data (AAPL)
    try {
      const res = await marketApi.getMarketData('AAPL');
      results.push({ name: 'Market Data', ok: !!res?.data, latencyMs: time() });
    } catch (e: any) {
      results.push({ name: 'Market Data', ok: false, message: e?.message, latencyMs: time() });
    }

    // Active alerts
    try {
      const res = await alertsApi.getActiveAlerts();
      results.push({ name: 'Active Alerts', ok: !!res?.data, latencyMs: time() });
    } catch (e: any) {
      results.push({ name: 'Active Alerts', ok: false, message: e?.message, latencyMs: time() });
    }

    setStatuses(results);
    setDemo(isDemoMode());
    setBackendUp(isBackendAvailable());
    setLoading(false);
  };

  useEffect(() => {
    checkAll();
  }, []);

  const StatusBadge = ({ ok }: { ok: boolean }) => (
    <Badge className={ok ? 'bg-green-600' : 'bg-red-600'}>{ok ? 'OK' : 'Fail'}</Badge>
  );

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">System Health</CardTitle>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${backendUp ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-xs text-gray-400">{backendUp ? 'Backend' : 'Fallback'}</span>
          {demo && <Badge className="bg-yellow-600">Demo</Badge>}
          <Button size="sm" onClick={checkAll} disabled={loading} className="bg-sky-600 hover:bg-sky-700">
            {loading ? 'Checking...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {statuses.map((s) => (
            <div key={s.name} className="flex items-center justify-between p-3 rounded bg-gray-800">
              <div className="text-sm text-white">{s.name}</div>
              <div className="flex items-center gap-2">
                {typeof s.latencyMs === 'number' && (
                  <span className="text-xs text-gray-400">{s.latencyMs}ms</span>
                )}
                <StatusBadge ok={s.ok} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
