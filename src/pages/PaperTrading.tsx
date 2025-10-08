import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Progress } from '../components/ui/progress';
import { DollarSign, TrendingUp, TrendingDown, X, PlusCircle, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { paperTradingApi, marketApi, analyticsApi } from '../lib/api-client';
import { usePoll } from '../hooks/usePoll';
import config from '../lib/config';

interface PaperTrade {
  id: number;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  entry_price: number;
  current_price?: number;
  exit_price?: number;
  pnl?: number;
  pnl_pct?: number;
  status: 'open' | 'closed';
  pattern?: string;
  confidence?: number;
  created_at: string;
  closed_at?: string;
}

interface Portfolio {
  total_value: number;
  cash_balance: number;
  total_pnl: number;
  total_pnl_pct: number;
  positions_count: number;
  open_positions: PaperTrade[];
}

interface TradingStats {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  avg_win: number;
  avg_loss: number;
  best_trade: number;
  worst_trade: number;
}

export function PaperTrading() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [trades, setTrades] = useState<PaperTrade[]>([]);
  const [stats, setStats] = useState<TradingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false);
  
  // Trade form state
  const [tradeSymbol, setTradeSymbol] = useState('');
  const [tradeSide, setTradeSide] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeQuantity, setTradeQuantity] = useState('');
  const [tradePrice, setTradePrice] = useState('');
  const [tradePattern, setTradePattern] = useState('');
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Poll every 180s to refresh trades/stats/portfolio
  usePoll(() => {
    loadData();
  }, config.pollIntervalMs, { immediate: false });

  const loadData = async () => {
    setLoading(true);
    try {
      const [tradesResponse, statsResponse] = await Promise.all([
        paperTradingApi.getTrades(),
        analyticsApi.getTradingStats(),
      ]);

      if (tradesResponse.data.success) {
        const allTrades = tradesResponse.data.data || [];
        setTrades(allTrades);
        
        // Calculate portfolio from trades
        const openPositions = allTrades.filter((t: PaperTrade) => t.status === 'open');
        const totalPnl = allTrades.reduce((sum: number, t: PaperTrade) => sum + (t.pnl || 0), 0);
        
        setPortfolio({
          total_value: 100000 + totalPnl, // Starting with $100k
          cash_balance: 100000 - openPositions.reduce((sum, t) => sum + (t.entry_price * t.quantity), 0),
          total_pnl: totalPnl,
          total_pnl_pct: (totalPnl / 100000) * 100,
          positions_count: openPositions.length,
          open_positions: openPositions,
        });
      }

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }
    } catch (error) {
      console.error('Failed to load trading data:', error);
      toast.error('Failed to load trading data');
    } finally {
      setLoading(false);
    }
  };

  const executeTrade = async () => {
    if (!tradeSymbol || !tradeQuantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setExecuting(true);
    try {
      // Get current market price if not specified
      let price = parseFloat(tradePrice);
      if (!price) {
        const marketResponse = await marketApi.getMarketData(tradeSymbol);
        if (marketResponse.data.success) {
          price = marketResponse.data.data.price;
        } else {
          toast.error('Failed to get market price');
          return;
        }
      }

      const tradeData = {
        symbol: tradeSymbol.toUpperCase(),
        side: tradeSide,
        quantity: parseInt(tradeQuantity),
        price,
        pattern: tradePattern || undefined,
      };

      const response = await paperTradingApi.executeTrade(tradeData);
      
      if (response.data.success) {
        toast.success(`${tradeSide} order executed for ${tradeSymbol}`);
        setTradeDialogOpen(false);
        resetTradeForm();
        loadData(); // Reload data
      } else {
        toast.error('Trade execution failed');
      }
    } catch (error) {
      console.error('Trade execution failed:', error);
      toast.error('Trade execution failed');
    } finally {
      setExecuting(false);
    }
  };

  const closePosition = async (trade: PaperTrade) => {
    try {
      const response = await paperTradingApi.closePosition({ trade_id: trade.id });
      
      if (response.data.success) {
        toast.success(`Position closed for ${trade.symbol}`);
        loadData(); // Reload data
      } else {
        toast.error('Failed to close position');
      }
    } catch (error) {
      console.error('Failed to close position:', error);
      toast.error('Failed to close position');
    }
  };

  const resetTradeForm = () => {
    setTradeSymbol('');
    setTradeSide('BUY');
    setTradeQuantity('');
    setTradePrice('');
    setTradePattern('');
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
        <h1 className="text-white text-2xl">Paper Trading</h1>
        <Dialog open={tradeDialogOpen} onOpenChange={setTradeDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sky-600 hover:bg-sky-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Trade
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Execute Trade</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trade-symbol">Symbol</Label>
                  <Input
                    id="trade-symbol"
                    value={tradeSymbol}
                    onChange={(e) => setTradeSymbol(e.target.value.toUpperCase())}
                    placeholder="AAPL"
                    className="bg-gray-800 border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Side</Label>
                  <Select value={tradeSide} onValueChange={(value: 'BUY' | 'SELL') => setTradeSide(value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="BUY">BUY</SelectItem>
                      <SelectItem value="SELL">SELL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trade-quantity">Quantity</Label>
                  <Input
                    id="trade-quantity"
                    type="number"
                    value={tradeQuantity}
                    onChange={(e) => setTradeQuantity(e.target.value)}
                    placeholder="100"
                    className="bg-gray-800 border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trade-price">Price (optional)</Label>
                  <Input
                    id="trade-price"
                    type="number"
                    step="0.01"
                    value={tradePrice}
                    onChange={(e) => setTradePrice(e.target.value)}
                    placeholder="Market price"
                    className="bg-gray-800 border-gray-600"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trade-pattern">Pattern (optional)</Label>
                <Input
                  id="trade-pattern"
                  value={tradePattern}
                  onChange={(e) => setTradePattern(e.target.value)}
                  placeholder="e.g., Bullish Engulfing"
                  className="bg-gray-800 border-gray-600"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={executeTrade}
                  disabled={executing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {executing ? 'Executing...' : 'Execute Trade'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTradeDialogOpen(false)}
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Portfolio Summary */}
      {portfolio && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Value</p>
                  <p className="text-2xl text-white">{formatCurrency(portfolio.total_value)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-sky-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Cash Balance</p>
                  <p className="text-2xl text-white">{formatCurrency(portfolio.cash_balance)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total P&L</p>
                  <p className={`text-2xl ${portfolio.total_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(portfolio.total_pnl)}
                  </p>
                  <p className={`text-sm ${portfolio.total_pnl_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercentage(portfolio.total_pnl_pct)}
                  </p>
                </div>
                {portfolio.total_pnl >= 0 ? (
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
                  <p className="text-sm text-gray-400">Open Positions</p>
                  <p className="text-2xl text-white">{portfolio.positions_count}</p>
                </div>
                <Activity className="h-8 w-8 text-sky-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trading Stats */}
      {stats && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Trading Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl text-white">{stats.total_trades}</p>
                <p className="text-sm text-gray-400">Total Trades</p>
              </div>
              <div className="text-center">
                <p className="text-2xl text-green-400">{stats.win_rate.toFixed(1)}%</p>
                <p className="text-sm text-gray-400">Win Rate</p>
                <Progress value={stats.win_rate} className="mt-2" />
              </div>
              <div className="text-center">
                <p className="text-2xl text-green-400">{formatCurrency(stats.avg_win)}</p>
                <p className="text-sm text-gray-400">Avg Win</p>
              </div>
              <div className="text-center">
                <p className="text-2xl text-red-400">{formatCurrency(Math.abs(stats.avg_loss))}</p>
                <p className="text-sm text-gray-400">Avg Loss</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trades Table */}
      <Tabs defaultValue="open" className="space-y-4">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="open" className="data-[state=active]:bg-sky-600">
            Open Positions ({portfolio?.open_positions.length || 0})
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-sky-600">
            All Trades ({trades.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio?.open_positions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No open positions. Click "New Trade" to start trading.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Symbol</TableHead>
                      <TableHead className="text-gray-300">Side</TableHead>
                      <TableHead className="text-gray-300">Quantity</TableHead>
                      <TableHead className="text-gray-300">Entry Price</TableHead>
                      <TableHead className="text-gray-300">Current Price</TableHead>
                      <TableHead className="text-gray-300">P&L</TableHead>
                      <TableHead className="text-gray-300">Pattern</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolio?.open_positions.map((trade) => (
                      <TableRow key={trade.id} className="border-gray-700">
                        <TableCell className="text-white">{trade.symbol}</TableCell>
                        <TableCell>
                          <Badge className={trade.side === 'BUY' ? 'bg-green-600' : 'bg-red-600'}>
                            {trade.side}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">{trade.quantity}</TableCell>
                        <TableCell className="text-white">${trade.entry_price.toFixed(2)}</TableCell>
                        <TableCell className="text-white">
                          ${trade.current_price?.toFixed(2) || '--'}
                        </TableCell>
                        <TableCell className={trade.pnl && trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {trade.pnl ? formatCurrency(trade.pnl) : '--'}
                          {trade.pnl_pct && (
                            <div className="text-xs">
                              {formatPercentage(trade.pnl_pct)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {trade.pattern || '--'}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => closePosition(trade)}
                            className="border-gray-600 text-white hover:bg-gray-800"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">All Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Symbol</TableHead>
                    <TableHead className="text-gray-300">Side</TableHead>
                    <TableHead className="text-gray-300">Quantity</TableHead>
                    <TableHead className="text-gray-300">Price</TableHead>
                    <TableHead className="text-gray-300">P&L</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map((trade) => (
                    <TableRow key={trade.id} className="border-gray-700">
                      <TableCell className="text-white">
                        {new Date(trade.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-white">{trade.symbol}</TableCell>
                      <TableCell>
                        <Badge className={trade.side === 'BUY' ? 'bg-green-600' : 'bg-red-600'}>
                          {trade.side}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{trade.quantity}</TableCell>
                      <TableCell className="text-white">
                        ${trade.exit_price?.toFixed(2) || trade.entry_price.toFixed(2)}
                      </TableCell>
                      <TableCell className={trade.pnl && trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {trade.pnl ? formatCurrency(trade.pnl) : '--'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={trade.status === 'open' ? 'default' : 'secondary'}>
                          {trade.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}