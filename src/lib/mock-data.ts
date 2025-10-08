// Mock data for demo mode when backend is not available

export const mockMarketData = {
  trending: [
    { symbol: 'AAPL', price: 185.25, change: 2.15, change_pct: 1.17, volume: 45230000 },
    { symbol: 'TSLA', price: 242.84, change: -3.21, change_pct: -1.30, volume: 89450000 },
    { symbol: 'MSFT', price: 378.91, change: 4.56, change_pct: 1.22, volume: 23180000 },
    { symbol: 'NVDA', price: 487.32, change: 12.45, change_pct: 2.62, volume: 67890000 },
    { symbol: 'GOOGL', price: 134.56, change: -1.23, change_pct: -0.91, volume: 34560000 },
  ],
  volume: [
    { symbol: 'TSLA', price: 242.84, change: -3.21, change_pct: -1.30, volume: 89450000 },
    { symbol: 'NVDA', price: 487.32, change: 12.45, change_pct: 2.62, volume: 67890000 },
    { symbol: 'AAPL', price: 185.25, change: 2.15, change_pct: 1.17, volume: 45230000 },
    { symbol: 'GOOGL', price: 134.56, change: -1.23, change_pct: -0.91, volume: 34560000 },
    { symbol: 'MSFT', price: 378.91, change: 4.56, change_pct: 1.22, volume: 23180000 },
  ]
};

export const mockCandleData = [
  { timestamp: '2024-01-01T09:30:00Z', open: 180.00, high: 182.50, low: 179.20, close: 181.75, volume: 1234567 },
  { timestamp: '2024-01-01T10:30:00Z', open: 181.75, high: 183.20, low: 180.95, close: 182.40, volume: 987654 },
  { timestamp: '2024-01-01T11:30:00Z', open: 182.40, high: 184.10, low: 181.80, close: 183.60, volume: 1456789 },
  { timestamp: '2024-01-01T12:30:00Z', open: 183.60, high: 185.20, low: 182.90, close: 184.85, volume: 1123456 },
  { timestamp: '2024-01-01T13:30:00Z', open: 184.85, high: 186.40, low: 184.20, close: 185.25, volume: 1345678 },
];

export const mockPatterns = [
  {
    pattern_name: 'Bullish Engulfing',
    confidence: 78,
    pattern_type: 'bullish',
    description: 'A bullish reversal pattern formed by two candlesticks where the second candle completely engulfs the first.',
    timeframe: '1h',
    detected_at: new Date().toISOString()
  },
  {
    pattern_name: 'Hammer',
    confidence: 65,
    pattern_type: 'bullish',
    description: 'A bullish reversal pattern with a small body and long lower shadow.',
    timeframe: '1h',
    detected_at: new Date().toISOString()
  }
];

export const mockSentiment = {
  symbol: 'AAPL',
  overall_sentiment: 0.24,
  sentiment_score: 0.24,
  sentiment_label: 'BULLISH' as const,
  confidence: 0.72,
  sources: {
    news: 0.18,
    social: 0.31,
    technical: 0.22
  },
  metrics: {
    volume_buzz: 0.45,
    social_mentions: 15420,
    news_articles: 28,
    analyst_ratings: {
      buy: 15,
      hold: 8,
      sell: 2
    }
  },
  historical: [
    { date: '2024-01-01', sentiment: 0.12, volume: 123456 },
    { date: '2024-01-02', sentiment: 0.18, volume: 234567 },
    { date: '2024-01-03', sentiment: 0.24, volume: 345678 },
  ],
  keywords: [
    { keyword: 'earnings', sentiment: 0.35, mentions: 1240 },
    { keyword: 'growth', sentiment: 0.28, mentions: 890 },
    { keyword: 'innovation', sentiment: 0.42, mentions: 567 },
  ],
  price_correlation: 0.68,
  last_updated: new Date().toISOString()
};

export const mockAlerts = [
  {
    id: 1,
    symbol: 'AAPL',
    alert_type: 'Bullish Engulfing',
    confidence_pct: 78,
    price: 185.25,
    timestamp: new Date().toISOString(),
    metadata: { timeframe: '1h' }
  },
  {
    id: 2,
    symbol: 'TSLA',
    alert_type: 'Hammer',
    confidence_pct: 65,
    price: 242.84,
    timestamp: new Date(Date.now() - 300000).toISOString(),
    metadata: { timeframe: '1h' }
  }
];

export const mockScanStatus = {
  active: true,
  last_scan: new Date().toISOString(),
  patterns_found: 5,
  symbols_scanned: 150,
  scan_duration: 2.3,
  errors: []
};

export const mockTradingStats = {
  total_trades: 24,
  winning_trades: 16,
  losing_trades: 8,
  win_rate: 66.7,
  avg_win: 245.50,
  avg_loss: -128.75,
  best_trade: 890.25,
  worst_trade: -456.80
};

export const mockPaperTrades = [
  {
    id: 1,
    symbol: 'AAPL',
    side: 'BUY' as const,
    quantity: 100,
    entry_price: 180.00,
    current_price: 185.25,
    pnl: 525.00,
    pnl_pct: 2.92,
    status: 'open' as const,
    pattern: 'Bullish Engulfing',
    confidence: 78,
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

// Mock API response wrapper
export const createMockResponse = (data: any, success = true) => ({
  data: {
    success,
    data,
    message: success ? 'Mock data response' : 'Mock error response'
  }
});

// Simulate network delay
export const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));