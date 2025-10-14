import axios from 'axios';
import config from './config';
import { 
  mockMarketData, 
  mockCandleData, 
  mockPatterns, 
  mockSentiment,
  mockAlerts,
  mockScanStatus,
  mockTradingStats,
  mockPaperTrades,
  createMockResponse,
  simulateDelay
} from './mock-data';

// API Configuration
const API_BASE_URL = config.apiBaseUrl;

// Track backend availability
let backendAvailable = true;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Mark backend as unavailable on network errors
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      backendAvailable = false;
      console.warn('🔌 Backend unavailable, switching to demo mode');
    }
    
    return Promise.reject(error);
  }
);

// Helper function to use mock data when backend is unavailable
const withFallback = async (apiCall: () => Promise<any>, mockData: any): Promise<any> => {
  if (config.demoMode || !backendAvailable) {
    await simulateDelay(300);
    return createMockResponse(mockData);
  }
  
  try {
    const result = await apiCall();
    backendAvailable = true; // Reset if successful
    return result;
  } catch (error) {
    console.warn('API call failed, using mock data:', error);
    backendAvailable = false;
    await simulateDelay(300);
    return createMockResponse(mockData);
  }
};

// Health & Provider Status APIs
export const statusApi = {
  // Basic health
  getHealth: () =>
    withFallback(
      () => apiClient.get('/health'),
      { status: 'ok', timestamp: new Date().toISOString() }
    ),

  // Data providers health
  getProviderHealth: () =>
    withFallback(
      () => apiClient.get('/api/provider-health'),
      {
        yfinance: { ok: true, latency_ms: 100 },
        finnhub: { ok: true, latency_ms: 50 },
      }
    ),
};

// Market Data APIs
export const marketApi = {
  // Get trending or high volume instruments
  getMarketScan: (type: 'trending' | 'volume') =>
    withFallback(
      () => apiClient.get(`/api/market-scan?type=${type}`),
      mockMarketData[type]
    ),

  // Get current price for a symbol
  getMarketData: (symbol: string) =>
    withFallback(
      () => apiClient.get(`/api/market/${encodeURIComponent(symbol)}`),
      mockMarketData.trending.find(item => item.symbol === symbol) || mockMarketData.trending[0]
    ),

  // Get OHLCV candles
  getCandles: (symbol: string, period: string = '1d', interval: string = '1h') =>
    withFallback(
      () => apiClient
        .get(`/api/candles?symbol=${symbol}&period=${period}&interval=${interval}`)
        .then((res) => {
          // Backend returns { success, data: { symbol, candles: [...] } }
          // Normalize to { success, data: Candle[] } to match existing consumers
          const candles = res?.data?.data?.candles;
          if (Array.isArray(candles)) {
            return { ...res, data: { ...res.data, data: candles } } as typeof res;
          }
          return res;
        }),
      mockCandleData
    ),
};

// Live Scanning APIs
export const scanApi = {
  // Start live scanning
  startScan: (config: { symbols?: string[], interval: number, auto_alerts: boolean }) =>
    withFallback(
      () => apiClient.post('/api/scan/start', config),
      { ...mockScanStatus, active: true }
    ),

  // Stop scanning
  stopScan: () =>
    withFallback(
      () => apiClient.post('/api/scan/stop'),
      { ...mockScanStatus, active: false }
    ),

  // Get scan status
  getStatus: () =>
    withFallback(
      () => apiClient.get('/api/scan/status'),
      mockScanStatus
    ),

  // Get/Set scan configuration
  getConfig: () =>
    withFallback(
      () => apiClient.get('/api/scan/config'),
      { symbols: [], interval: 30, auto_alerts: true }
    ),

  setConfig: (config: any) =>
    withFallback(
      () => apiClient.post('/api/scan/config', config),
      { success: true }
    ),
};

// Pattern Detection APIs
export const patternApi = {
  // Detect patterns for a symbol
  detectEnhanced: (symbol: string) =>
    withFallback(
      () => apiClient.post('/api/detect-enhanced', { symbol }),
      mockPatterns
    ),

  // Get pattern statistics
  getPatternStats: () =>
    withFallback(
      () => apiClient.get('/api/pattern-stats'),
      { total_patterns: 15, detected_today: 5, accuracy: 72.5 }
    ),

  // List all available patterns
  getPatternsList: () =>
    withFallback(
      () => apiClient.get('/api/patterns/list'),
      [
        { name: 'Bullish Engulfing', description: 'Bullish reversal pattern', type: 'bullish' },
        { name: 'Bearish Engulfing', description: 'Bearish reversal pattern', type: 'bearish' },
        { name: 'Hammer', description: 'Bullish reversal pattern', type: 'bullish' },
        { name: 'Doji', description: 'Indecision pattern', type: 'neutral' },
      ]
    ),

  // Explain a specific pattern
  explainPattern: (patternName: string) =>
    withFallback(
      () => apiClient.get(`/api/explain/pattern/${patternName}`),
      { 
        pattern: patternName, 
        explanation: `${patternName} is a candlestick pattern used in technical analysis.`,
        characteristics: ['Reversal signal', 'High reliability', 'Common in trending markets']
      }
    ),

  // Explain an alert
  explainAlert: (alertData: { alert_id?: number, alert_type?: string, symbol?: string }) =>
    withFallback(
      () => apiClient.post('/api/explain/alert', alertData),
      { 
        explanation: `Alert triggered for ${alertData.symbol || 'symbol'} based on ${alertData.alert_type || 'pattern'} detection.`,
        confidence: 75,
        next_steps: ['Monitor price action', 'Consider entry/exit', 'Manage risk']
      }
    ),
};

// Sentiment APIs
export const sentimentApi = {
  // Get sentiment for a symbol
  getSentiment: (symbol: string) =>
    withFallback(
      () => apiClient.get(`/api/sentiment/${encodeURIComponent(symbol)}`),
      { ...mockSentiment, symbol }
    ),

  // Enhance sentiment confidence
  enhanceConfidence: (symbol: string, base_confidence: number, pattern_type: string) =>
    withFallback(
      () => apiClient.post('/api/sentiment/enhance-confidence', { symbol, base_confidence, pattern_type }),
      { enhanced: true, confidence_boost: 0.05 }
    ),

  // Set sentiment alert condition
  setAlertCondition: (condition: any) =>
    withFallback(
      () => apiClient.post('/api/sentiment/alert-condition', condition),
      { success: true, condition_set: condition }
    ),

  // Get Twitter health status
  getTwitterHealth: () =>
    withFallback(
      () => apiClient.get('/api/sentiment/twitter-health'),
      {
        status: 'healthy',
        last_update: new Date().toISOString(),
        rate_limit_remaining: 450,
        rate_limit_reset: new Date(Date.now() + 3600000).toISOString(),
        api_version: 'v2'
      }
    ),
};

// Entry/Exit Signals APIs
export const signalsApi = {
  // Get entry/exit signals
  getEntryExitSignals: (symbol: string, timeframe: string, type: 'all' | 'entry' | 'exit' = 'all') =>
    withFallback(
      () => apiClient.get(`/api/signals/entry-exit?symbol=${symbol}&timeframe=${timeframe}&type=${type}`),
      {
        symbol,
        signals: [
          {
            type: 'entry',
            action: 'BUY',
            confidence: 75,
            price_target: 190.00,
            stop_loss: 175.00,
            timeframe: '1d',
            reasoning: 'Bullish momentum with strong volume support'
          }
        ],
        last_updated: new Date().toISOString()
      }
    ),

  // Generate signals for multiple symbols
  generateSignals: (data: { symbols: string[], timeframe: string, min_confidence?: number }) =>
    withFallback(
      () => apiClient.post('/api/signals/entry-exit', data),
      {
        signals_generated: data.symbols.length,
        timeframe: data.timeframe,
        min_confidence: data.min_confidence || 60
      }
    ),
};

// Alerts APIs
export const alertsApi = {
  // Get active alerts
  getActiveAlerts: () =>
    withFallback(
      () => apiClient.get('/api/get_active_alerts').then((res) => {
        // Backend returns { success, alerts: [...] }
        // Normalize to { success, data: [...] } to match consumers
        if (res?.data && Array.isArray(res.data.alerts)) {
          return { ...res, data: { ...res.data, data: res.data.alerts } } as typeof res;
        }
        return res;
      }),
      mockAlerts
    ),

  // Dismiss an alert
  dismissAlert: (alertId: number) =>
    withFallback(
      () => apiClient.post(`/api/alerts/dismiss/${alertId}`),
      { success: true, dismissed: alertId }
    ),

  // Handle alert response
  handleAlertResponse: (data: { alert_id: number, response: string, action?: string }) =>
    withFallback(
      () => apiClient.post('/api/handle_alert_response', data),
      { success: true, processed: data.alert_id }
    ),
};

// Paper Trading APIs
export const paperTradingApi = {
  // Get paper trades
  getTrades: () =>
    withFallback(
      () => apiClient.get('/api/paper-trades'),
      mockPaperTrades
    ),

  // Execute a paper trade
  executeTrade: (trade: {
    symbol: string,
    side: 'BUY' | 'SELL',
    quantity: number,
    price?: number,
    pattern?: string,
    confidence?: number
  }) =>
    withFallback(
      () => apiClient.post('/api/paper-trades', trade),
      {
        id: Date.now(),
        ...trade,
        entry_price: trade.price || 100,
        status: 'open',
        created_at: new Date().toISOString()
      }
    ),

  // Execute from alert context (aligns with /api/paper-trade/execute-from-alert)
  executeFromAlert: (payload: {
    symbol: string,
    suggested_action: 'BUY' | 'SELL',
    quantity: number,
    pattern?: string,
    confidence?: number,
    risk_suggestions?: { entry?: number; stop_loss?: number; take_profit?: number }
  }) =>
    withFallback(
      () => apiClient.post('/api/paper-trade/execute-from-alert', payload),
      {
        id: Date.now(),
        symbol: payload.symbol,
        side: payload.suggested_action,
        price: payload.risk_suggestions?.entry ?? 100,
        status: 'open',
        pnl: 0,
        pattern: payload.pattern,
        confidence: payload.confidence,
        risk_suggestions: payload.risk_suggestions || {},
      }
    ),

  // Close a position
  closePosition: (data: { symbol?: string, trade_id?: number }) =>
    withFallback(
      () => apiClient.post('/api/close-position', data),
      { success: true, closed: data.trade_id || data.symbol }
    ),
};

// Backtesting APIs
export const backtestApi = {
  // Get available strategies
  getStrategies: () =>
    withFallback(
      () => apiClient.get('/api/strategies'),
      [
        { id: 'momentum', name: 'Momentum Strategy', description: 'Trend following strategy' },
        { id: 'mean-reversion', name: 'Mean Reversion', description: 'Contrarian strategy' },
        { id: 'pattern-based', name: 'Pattern Based', description: 'Candlestick pattern strategy' }
      ]
    ),

  // Run backtest
  runBacktest: (config: any) =>
    withFallback(
      () => apiClient.post('/api/backtest', config),
      {
        total_return: 15420.50,
        total_return_pct: 15.42,
        max_drawdown: -2340.80,
        max_drawdown_pct: -2.34,
        sharpe_ratio: 1.85,
        win_rate: 68.5,
        total_trades: 45,
        winning_trades: 31,
        losing_trades: 14
      }
    ),

  // Run pattern backtest
  runPatternBacktest: (config: any) =>
    withFallback(
      () => apiClient.post('/api/backtest/pattern', config),
      {
        pattern_name: config.pattern_name || 'Bullish Engulfing',
        total_return: 8750.25,
        total_return_pct: 8.75,
        win_rate: 72.3,
        total_trades: 28,
        equity_curve: [
          { date: '2024-01-01', value: 100000, return_pct: 0 },
          { date: '2024-01-15', value: 102500, return_pct: 2.5 },
          { date: '2024-01-30', value: 108750, return_pct: 8.75 }
        ],
        trades: []
      }
    ),

  // Run strategy backtest
  runStrategyBacktest: (config: any) =>
    withFallback(
      () => apiClient.post('/api/backtest/strategy', config),
      {
        strategy_name: config.strategy_id || 'momentum',
        total_return: 12340.75,
        total_return_pct: 12.34,
        sharpe_ratio: 1.65,
        win_rate: 65.8,
        total_trades: 38
      }
    ),
};

// Analytics & Reporting APIs
export const analyticsApi = {
  // Get analytics summary
  getSummary: () =>
    withFallback(
      () => apiClient.get('/api/analytics/summary'),
      {
        total_symbols: 150,
        patterns_detected: 24,
        accuracy_rate: 72.5,
        active_alerts: 3,
        scanning_uptime: 98.5
      }
    ),

  // Get trading statistics
  getTradingStats: () =>
    withFallback(
      () => apiClient.get('/api/trading-stats'),
      mockTradingStats
    ),

  // Get detection statistics
  getDetectionStats: () =>
    withFallback(
      () => apiClient.get('/api/detection_stats'),
      {
        patterns_detected_today: 15,
        accuracy_rate: 74.2,
        most_common_pattern: 'Bullish Engulfing',
        detection_rate: 89.1
      }
    ),

  // Get detection logs
  getDetectionLogs: (params: { limit?: number, offset?: number, symbol?: string, pattern?: string }) =>
    withFallback(
      () => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) queryParams.append(key, value.toString());
        });
        return apiClient.get(`/api/detection_logs?${queryParams}`);
      },
      [
        {
          id: 1,
          symbol: 'AAPL',
          pattern: 'Bullish Engulfing',
          confidence: 78,
          detected_at: new Date().toISOString()
        }
      ]
    ),

  // Export detection logs
  exportDetectionLogs: (params: { symbol?: string, pattern?: string, days?: number }) =>
    withFallback(
      () => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) queryParams.append(key, value.toString());
        });
        return apiClient.get(`/api/export_detection_logs?${queryParams}`);
      },
      { export_url: '/mock-export.csv', records: 150 }
    ),
};

// Risk & Recommendations APIs
export const riskApi = {
  // Get risk settings
  getRiskSettings: () =>
    withFallback(
      () => apiClient.get('/api/risk-settings'),
      {
        max_position_size: 10,
        max_portfolio_risk: 5,
        stop_loss_percentage: 2,
        max_daily_trades: 10,
        max_drawdown_limit: 15,
        require_confirmation: true,
        enable_auto_stop_loss: true,
        enable_position_sizing: true,
        risk_free_rate: 2.5,
        correlation_threshold: 0.7
      }
    ),

  // Update risk settings
  updateRiskSettings: (settings: any) =>
    withFallback(
      () => apiClient.post('/api/risk-settings', settings),
      { success: true, settings_updated: Object.keys(settings).length }
    ),


  // Get recommendations
  getRecommendations: (symbol: string) =>
    withFallback(
      () => apiClient.get(`/api/recommend/complete?symbol=${symbol}`),
      {
        symbol,
        action: 'BUY',
        confidence: 78,
        target_price: 195.50,
        stop_loss: 172.25,
        reasoning: 'Strong bullish momentum with positive sentiment and technical indicators.',
        risk_assessment: {
          risk_score: 42.3,
          risk_factors: ['Market volatility', 'Earnings uncertainty'],
          risk_mitigation: ['Diversify position', 'Use stop loss', 'Monitor volume']
        },
        position_sizing: {
          recommended_size: 85,
          max_size: 150,
          kelly_criterion: 0.12
        },
        timeframe: '1-2 weeks',
        last_updated: new Date().toISOString()
      }
    ),
};

// Data Coverage APIs
export const dataApi = {
  // Get available assets
  getAssetsList: () =>
    withFallback(
      () => apiClient.get('/api/assets/list'),
      {
        stocks: ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'AMZN'],
        total_count: 150,
        last_updated: new Date().toISOString()
      }
    ),


  // Get data coverage
  getCoverage: () =>
    withFallback(
      () => apiClient.get('/api/coverage'),
      {
        symbols_covered: 150,
        symbols_scanned: 142,
        coverage_percentage: 94.7,
        last_update: new Date().toISOString()
      }
    ),
};

// Enhanced AI/ML APIs
export const enhancedAIApi = {
  // Get pattern heatmap (multi-timeframe confidence matrix)
  getPatternHeatmap: (symbol: string) =>
    withFallback(
      () => apiClient.get(`/api/patterns/heatmap?symbol=${encodeURIComponent(symbol)}`),
      {
        symbol,
        patterns: [
          {
            pattern_name: 'Bullish Engulfing',
            pattern_type: 'bullish',
            timeframes: [
              { timeframe: '15m', confidence: 65, detected: true },
              { timeframe: '1h', confidence: 78, detected: true },
              { timeframe: '4h', confidence: 85, detected: true },
              { timeframe: '1d', confidence: 82, detected: true }
            ],
            max_confidence: 85,
            avg_confidence: 77.5
          }
        ],
        timeframes: ['15m', '1h', '4h', '1d']
      }
    ),

  // Get AI reasoning explanation
  getAIReasoning: (data: { symbol: string; pattern_name: string; alert_id?: number }) =>
    withFallback(
      () => apiClient.post('/api/explain/reasoning', data),
      {
        symbol: data.symbol,
        pattern: data.pattern_name,
        composite_score: 85.2,
        quality_badge: 'ELITE',
        reasoning: [
          {
            icon: '🎯',
            status: 'strong',
            title: 'Strong Technical Pattern',
            description: 'Bullish Engulfing detected with 85% confidence. This is a high-probability reversal signal.',
            details: 'Pattern formed after 3-day downtrend with strong volume confirmation.'
          },
          {
            icon: '🧠',
            status: 'strong',
            title: 'Deep Learning Confirmation',
            description: 'Our CNN-LSTM neural network analyzed the last 50 candles and confirms this pattern with 92% confidence (+15% boost).',
            details: 'Model version v2.1 trained on 1,247 historical patterns.'
          },
          {
            icon: '📊',
            status: 'moderate',
            title: 'Multi-Timeframe Alignment',
            description: 'Pattern confirmed across 1h (75%), 4h (82%), and 1d (80%) timeframes. High alignment score (0.85) indicates strong consensus.',
            details: 'Higher timeframes show stronger signals, indicating trend continuation.'
          },
          {
            icon: '💬',
            status: 'strong',
            title: 'Positive Sentiment',
            description: 'Market sentiment is bullish (88%). 45 news articles and 1,250 social mentions support this direction (+10% boost).',
            details: 'Sentiment analysis from Twitter, Reddit, and financial news sources.'
          }
        ],
        recommendation: {
          action: 'BUY',
          confidence: 85.2,
          target_price: 195.50,
          stop_loss: 172.25,
          risk_score: 42.3,
          risk_level: 'Medium'
        },
        historical_accuracy: {
          pattern_type: 'Bullish Engulfing',
          accuracy: 72.3,
          sample_size: 150,
          avg_return: 3.2
        }
      }
    ),

  // Get ML learning status
  getMLLearningStatus: () =>
    withFallback(
      () => apiClient.get('/api/ml/learning-status'),
      {
        is_learning: true,
        recent_updates: [
          {
            timestamp: new Date(Date.now() - 120000).toISOString(),
            description: 'Model updated: Bullish Engulfing accuracy improved from 71.2% → 72.3%',
            impact: '+1.1%',
            type: 'improvement'
          },
          {
            timestamp: new Date(Date.now() - 300000).toISOString(),
            description: 'New pattern learned: Evening Star now has 68% accuracy (15 samples)',
            impact: 'New',
            type: 'new'
          }
        ],
        model_stats: {
          total_patterns_learned: 15,
          training_samples: 1247,
          last_update: new Date(Date.now() - 120000).toISOString(),
          next_update_seconds: 178,
          accuracy_trend: 2.1
        }
      }
    ),

  // Get model performance metrics
  getModelPerformance: () =>
    withFallback(
      () => apiClient.get('/api/ml/model-performance'),
      {
        models: [
          {
            name: 'CNN-LSTM Pattern Detector',
            version: 'v2.1',
            status: 'active',
            last_updated: new Date(Date.now() - 7200000).toISOString(),
            metrics: {
              accuracy: 87.3,
              precision: 84.5,
              recall: 89.2,
              f1_score: 86.8
            },
            accuracy_history: [
              { date: '2024-10-01', accuracy: 85.2 },
              { date: '2024-10-08', accuracy: 86.1 },
              { date: '2024-10-14', accuracy: 87.3 }
            ]
          }
        ]
      }
    ),

  // Get performance attribution
  getPerformanceAttribution: (period: string = '30d') =>
    withFallback(
      () => apiClient.get(`/api/analytics/attribution?period=${period}`),
      {
        total_return: 12450,
        return_pct: 12.45,
        period,
        layers: [
          {
            name: 'Rule-Based Patterns',
            contribution: 3200,
            percentage: 25.7,
            trades: 12,
            win_rate: 67,
            avg_return: 2.8
          },
          {
            name: 'Deep Learning Boost',
            contribution: 4100,
            percentage: 32.9,
            trades: 15,
            win_rate: 80,
            avg_return: 3.5
          },
          {
            name: 'Multi-Timeframe Alignment',
            contribution: 3800,
            percentage: 30.5,
            trades: 18,
            win_rate: 78,
            avg_return: 3.1
          },
          {
            name: 'Sentiment Boost',
            contribution: 1350,
            percentage: 10.9,
            trades: 8,
            win_rate: 75,
            avg_return: 4.2
          }
        ]
      }
    ),

  // Get predictive forecast
  getPredictiveForecast: (period: string = '7d') =>
    withFallback(
      () => apiClient.get(`/api/analytics/forecast?period=${period}`),
      {
        period,
        predictions: [
          {
            metric: 'Expected Opportunities',
            value: '8-12 ELITE patterns',
            confidence: 78,
            basis: 'Historical pattern frequency + market conditions'
          },
          {
            metric: 'Predicted Win Rate',
            value: '72-76%',
            confidence: 82,
            trend: '+3% vs last week'
          },
          {
            metric: 'Expected Return',
            value: '+$2,100 - $2,800',
            confidence: 68,
            basis: 'Based on 34 similar market conditions'
          }
        ],
        upcoming_setups: [
          {
            symbol: 'AAPL',
            pattern: 'Bullish Engulfing',
            expected_date: '2024-10-15',
            probability: 72,
            reasoning: 'Strong uptrend + oversold conditions + positive sentiment'
          }
        ]
      }
    ),
};

// Gamification APIs
export const gamificationApi = {
  // Get achievements
  getAchievements: () =>
    withFallback(
      () => apiClient.get('/api/achievements'),
      {
        achievements: [
          {
            id: 'first_elite',
            icon: '🎯',
            title: 'First ELITE Alert',
            description: 'Received your first ELITE quality alert',
            reward_xp: 100,
            badge: 'bronze',
            unlocked: true,
            unlocked_at: new Date(Date.now() - 86400000 * 5).toISOString()
          },
          {
            id: 'profitable_week',
            icon: '💰',
            title: 'Profitable Week',
            description: '7 consecutive days of positive returns',
            reward_xp: 250,
            badge: 'gold',
            unlocked: false,
            progress: 4,
            progress_max: 7
          },
          {
            id: 'pattern_master',
            icon: '🏆',
            title: 'Pattern Master',
            description: 'Successfully trade 50 ELITE patterns',
            reward_xp: 500,
            badge: 'platinum',
            unlocked: false,
            progress: 12,
            progress_max: 50
          }
        ],
        user_stats: {
          level: 12,
          title: 'Advanced Trader',
          current_xp: 2450,
          next_level_xp: 3000,
          total_achievements: 15,
          unlocked_achievements: 8,
          leaderboard_rank: 47,
          total_users: 1250
        }
      }
    ),

  // Get trading streak
  getTradingStreak: () =>
    withFallback(
      () => apiClient.get('/api/streak'),
      {
        current_streak: 7,
        longest_streak: 14,
        total_trading_days: 87,
        profitable_days: 63,
        calendar: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
          traded: Math.random() > 0.3,
          profitable: Math.random() > 0.4
        })),
        milestones: [
          { days: 3, reward_xp: 50, reached: true },
          { days: 7, reward_xp: 150, reached: true },
          { days: 14, reward_xp: 300, reached: false },
          { days: 30, reward_xp: 750, reached: false }
        ]
      }
    ),
};

// User Profile APIs (not supported by backend) — removed

export default apiClient;

// Status helpers
export const isBackendAvailable = (): boolean => backendAvailable;
export const isDemoMode = (): boolean => !!config.demoMode || !backendAvailable;