import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, BarChart3, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { backtestApi, patternApi } from '../lib/api-client';

interface BacktestResult {
  strategy_name?: string;
  pattern_name?: string;
  total_return: number;
  total_return_pct: number;
  max_drawdown: number;
  max_drawdown_pct: number;
  sharpe_ratio: number;
  win_rate: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  avg_win: number;
  avg_loss: number;
  best_trade: number;
  worst_trade: number;
  start_date: string;
  end_date: string;
  initial_capital: number;
  final_capital: number;
  equity_curve: Array<{
    date: string;
    value: number;
    return_pct: number;
  }>;
  trades: Array<{
    entry_date: string;
    exit_date: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    entry_price: number;
    exit_price: number;
    quantity: number;
    pnl: number;
    pnl_pct: number;
    pattern?: string;
    confidence?: number;
  }>;
}

interface Strategy {
  id: string;
  name: string;
  description: string;
  parameters?: any;
}

interface Pattern {
  name: string;
  description: string;
  type: 'bullish' | 'bearish' | 'neutral';
}

export function Backtesting() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [results, setResults] = useState<BacktestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  
  // Backtest configuration
  const [testType, setTestType] = useState<'strategy' | 'pattern'>('pattern');
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [selectedPattern, setSelectedPattern] = useState('');
  const [symbol, setSymbol] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [initialCapital, setInitialCapital] = useState('100000');
  const [minConfidence, setMinConfidence] = useState('70');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [strategiesResponse, patternsResponse] = await Promise.all([
        backtestApi.getStrategies(),
        patternApi.getPatternsList(),
      ]);

      if (strategiesResponse.data.success) {
        setStrategies(strategiesResponse.data.data || []);
      }

      if (patternsResponse.data.success) {
        setPatterns(patternsResponse.data.data || []);
      }

      // Set default dates (last 3 months)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);
      
      setEndDate(endDate.toISOString().split('T')[0]);
      setStartDate(startDate.toISOString().split('T')[0]);
    } catch (error) {
      console.error('Failed to load backtest data:', error);
      toast.error('Failed to load backtest data');
    } finally {
      setLoading(false);
    }
  };

  const runBacktest = async () => {
    if (testType === 'pattern' && !selectedPattern) {
      toast.error('Please select a pattern to backtest');
      return;
    }
    
    if (testType === 'strategy' && !selectedStrategy) {
      toast.error('Please select a strategy to backtest');
      return;
    }

    setRunning(true);
    try {
      const config = {
        symbol: symbol || undefined,
        start_date: startDate,
        end_date: endDate,
        initial_capital: parseFloat(initialCapital),
        min_confidence: parseFloat(minConfidence),
      };

      let response;
      if (testType === 'pattern') {
        response = await backtestApi.runPatternBacktest({
          ...config,
          pattern_name: selectedPattern,
        });
      } else {
        response = await backtestApi.runStrategyBacktest({
          ...config,
          strategy_id: selectedStrategy,
        });
      }

      if (response.data.success) {
        setResults(response.data.data);
        toast.success('Backtest completed successfully');
      } else {
        toast.error('Backtest failed');
      }
    } catch (error) {
      console.error('Backtest failed:', error);
      toast.error('Backtest failed');
    } finally {
      setRunning(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
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
        <h1 className="text-white text-2xl">Backtesting</h1>
        <Button
          onClick={runBacktest}
          disabled={running}
          className="bg-sky-600 hover:bg-sky-700"
        >
          <Play className="h-4 w-4 mr-2" />
          {running ? 'Running...' : 'Run Backtest'}
        </Button>
      </div>

      {/* Configuration */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Backtest Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Test Type Selection */}
            <div className="space-y-2">
              <Label className="text-gray-300">Test Type</Label>
              <Select value={testType} onValueChange={(value: 'strategy' | 'pattern') => setTestType(value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="pattern">Pattern Backtest</SelectItem>
                  <SelectItem value="strategy">Strategy Backtest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pattern/Strategy Selection */}
            {testType === 'pattern' ? (
              <div className="space-y-2">
                <Label className="text-gray-300">Pattern</Label>
                <Select value={selectedPattern} onValueChange={setSelectedPattern}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select a pattern to backtest" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {patterns.map((pattern) => (
                      <SelectItem key={pattern.name} value={pattern.name}>
                        {pattern.name} ({pattern.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-gray-300">Strategy</Label>
                <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select a strategy to backtest" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {strategies.map((strategy) => (
                      <SelectItem key={strategy.id} value={strategy.id}>
                        {strategy.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Configuration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="symbol" className="text-gray-300">
                  Symbol (optional, leave empty for all)
                </Label>
                <Input
                  id="symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="AAPL"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-date" className="text-gray-300">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date" className="text-gray-300">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="initial-capital" className="text-gray-300">Initial Capital</Label>
                <Input
                  id="initial-capital"
                  type="number"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="min-confidence" className="text-gray-300">
                  Minimum Confidence (%)
                </Label>
                <Input
                  id="min-confidence"
                  type="number"
                  min="0"
                  max="100"
                  value={minConfidence}
                  onChange={(e) => setMinConfidence(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Return</p>
                    <p className={`text-2xl ${results.total_return >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(results.total_return)}
                    </p>
                    <p className={`text-sm ${results.total_return_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPercentage(results.total_return_pct)}
                    </p>
                  </div>
                  {results.total_return >= 0 ? (
                    <TrendingUp className="h-8 w-8 text-green-400" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-red-400" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Win Rate</p>
                    <p className="text-2xl text-white">{results.win_rate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-400">
                      {results.winning_trades}/{results.total_trades} trades
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-sky-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Sharpe Ratio</p>
                    <p className="text-2xl text-white">{results.sharpe_ratio.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-sky-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Max Drawdown</p>
                    <p className="text-2xl text-red-400">
                      {formatCurrency(Math.abs(results.max_drawdown))}
                    </p>
                    <p className="text-sm text-red-400">
                      {formatPercentage(results.max_drawdown_pct)}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Tabs defaultValue="chart" className="space-y-4">
            <TabsList className="bg-gray-800">
              <TabsTrigger value="chart" className="data-[state=active]:bg-sky-600">
                Equity Curve
              </TabsTrigger>
              <TabsTrigger value="trades" className="data-[state=active]:bg-sky-600">
                Trade History
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-sky-600">
                Detailed Stats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chart">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Equity Curve</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={results.equity_curve}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#9ca3af"
                          tickFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <YAxis 
                          stroke="#9ca3af"
                          tickFormatter={(value) => formatCurrency(value)}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                          }}
                          labelFormatter={(value) => new Date(value).toLocaleDateString()}
                          formatter={(value: number) => [formatCurrency(value), 'Portfolio Value']}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#0ea5e9"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trades">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Trade History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Entry Date</TableHead>
                        <TableHead className="text-gray-300">Exit Date</TableHead>
                        <TableHead className="text-gray-300">Symbol</TableHead>
                        <TableHead className="text-gray-300">Side</TableHead>
                        <TableHead className="text-gray-300">Entry Price</TableHead>
                        <TableHead className="text-gray-300">Exit Price</TableHead>
                        <TableHead className="text-gray-300">P&L</TableHead>
                        <TableHead className="text-gray-300">Pattern</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.trades.map((trade, index) => (
                        <TableRow key={index} className="border-gray-700">
                          <TableCell className="text-white">
                            {new Date(trade.entry_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-white">
                            {new Date(trade.exit_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-white">{trade.symbol}</TableCell>
                          <TableCell>
                            <Badge className={trade.side === 'BUY' ? 'bg-green-600' : 'bg-red-600'}>
                              {trade.side}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white">${trade.entry_price.toFixed(2)}</TableCell>
                          <TableCell className="text-white">${trade.exit_price.toFixed(2)}</TableCell>
                          <TableCell className={trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {formatCurrency(trade.pnl)}
                            <div className="text-xs">
                              {formatPercentage(trade.pnl_pct)}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {trade.pattern || '--'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Detailed Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Initial Capital:</span>
                        <span className="text-white">{formatCurrency(results.initial_capital)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Final Capital:</span>
                        <span className="text-white">{formatCurrency(results.final_capital)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Trades:</span>
                        <span className="text-white">{results.total_trades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Winning Trades:</span>
                        <span className="text-green-400">{results.winning_trades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Losing Trades:</span>
                        <span className="text-red-400">{results.losing_trades}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Average Win:</span>
                        <span className="text-green-400">{formatCurrency(results.avg_win)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Average Loss:</span>
                        <span className="text-red-400">{formatCurrency(Math.abs(results.avg_loss))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Best Trade:</span>
                        <span className="text-green-400">{formatCurrency(results.best_trade)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Worst Trade:</span>
                        <span className="text-red-400">{formatCurrency(Math.abs(results.worst_trade))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Test Period:</span>
                        <span className="text-white">
                          {new Date(results.start_date).toLocaleDateString()} - {new Date(results.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}