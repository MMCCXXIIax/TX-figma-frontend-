import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { AIConfidenceBreakdown } from '../components/ai/AIConfidenceBreakdown';
import { PatternHeatmap } from '../components/ai/PatternHeatmap';
import { AIExplanationPanel } from '../components/ai/AIExplanationPanel';
import { AILearningIndicator } from '../components/ai/AILearningIndicator';
import { AchievementsPanel } from '../components/gamification/AchievementsPanel';
import { StreakTracker } from '../components/gamification/StreakTracker';
import { PerformanceAttribution } from '../components/analytics/PerformanceAttribution';
import { PredictiveAnalytics } from '../components/analytics/PredictiveAnalytics';
import { enhancedAIApi, gamificationApi } from '../lib/api-client';
import { Brain, TrendingUp, Trophy, Sparkles } from 'lucide-react';

export function AIInsights() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [aiData, setAiData] = useState<any>(null);
  const [heatmapData, setHeatmapData] = useState<any>(null);
  const [learningStatus, setLearningStatus] = useState<any>(null);
  const [achievements, setAchievements] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);
  const [attribution, setAttribution] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, [selectedSymbol]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        aiResponse,
        heatmapResponse,
        learningResponse,
        achievementsResponse,
        streakResponse,
        attributionResponse,
        forecastResponse
      ] = await Promise.all([
        enhancedAIApi.getAIReasoning({ symbol: selectedSymbol, pattern_name: 'Bullish Engulfing' }),
        enhancedAIApi.getPatternHeatmap(selectedSymbol),
        enhancedAIApi.getMLLearningStatus(),
        gamificationApi.getAchievements(),
        gamificationApi.getTradingStreak(),
        enhancedAIApi.getPerformanceAttribution('30d'),
        enhancedAIApi.getPredictiveForecast('7d')
      ]);

      setAiData(aiResponse.data);
      setHeatmapData(heatmapResponse.data);
      setLearningStatus(learningResponse.data);
      setAchievements(achievementsResponse.data);
      setStreak(streakResponse.data);
      setAttribution(attributionResponse.data);
      setForecast(forecastResponse.data);
    } catch (error) {
      console.error('Failed to load AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Brain className="h-12 w-12 text-purple-400 animate-pulse mx-auto mb-4" />
          <div className="text-white text-lg">Loading AI Insights...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-400" />
            AI Intelligence Center
          </h1>
          <p className="text-gray-400 mt-1">
            Advanced AI analysis, predictions, and performance insights
          </p>
        </div>
      </div>

      {/* Symbol Selector */}
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">Symbol:</span>
        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"
        >
          <option value="AAPL">AAPL</option>
          <option value="GOOGL">GOOGL</option>
          <option value="MSFT">MSFT</option>
          <option value="TSLA">TSLA</option>
          <option value="NVDA">NVDA</option>
        </select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ai-analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="ai-analysis" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Analysis
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="gamification" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Progress
          </TabsTrigger>
        </TabsList>

        {/* AI Analysis Tab */}
        <TabsContent value="ai-analysis" className="space-y-6 mt-6">
          {/* AI Learning Status */}
          {learningStatus && (
            <AILearningIndicator
              isLearning={learningStatus.is_learning}
              recentUpdates={learningStatus.recent_updates}
              modelStats={learningStatus.model_stats}
            />
          )}

          {/* AI Confidence Breakdown */}
          {aiData && (
            <AIConfidenceBreakdown
              compositeScore={aiData.composite_score}
              qualityBadge={aiData.quality_badge}
              layers={{
                rule_based: {
                  name: 'Rule-Based',
                  score: 85,
                  weight: 40,
                  contribution: 34,
                  status: 'strong',
                  details: 'Traditional technical analysis detected strong bullish pattern'
                },
                deep_learning: {
                  name: 'Deep Learning',
                  score: 92,
                  weight: 15,
                  contribution: 13.8,
                  status: 'strong',
                  details: 'CNN-LSTM neural network confirms pattern with 92% confidence',
                  boost: 15,
                  model_version: 'v2.1'
                },
                multi_timeframe: {
                  name: 'Multi-Timeframe',
                  score: 78,
                  weight: 60,
                  contribution: 46.8,
                  status: 'moderate',
                  details: 'Pattern confirmed across multiple timeframes',
                  alignment: 0.85,
                  timeframes: {
                    '1h': { score: 75, weight: 25 },
                    '4h': { score: 82, weight: 35 },
                    '1d': { score: 80, weight: 40 }
                  }
                },
                sentiment: {
                  name: 'Sentiment',
                  score: 88,
                  weight: 10,
                  contribution: 8.8,
                  status: 'strong',
                  details: 'Positive market sentiment supports the pattern',
                  boost: 10,
                  sources: {
                    news: { score: 90, reliability: 85, count: 45 },
                    social: { score: 85, reliability: 65, count: 1250 },
                    technical: { score: 88, reliability: 90 }
                  }
                }
              }}
            />
          )}

          {/* Pattern Heatmap */}
          {heatmapData && (
            <PatternHeatmap
              symbol={heatmapData.symbol}
              patterns={heatmapData.patterns}
              timeframes={heatmapData.timeframes}
            />
          )}

          {/* AI Explanation */}
          {aiData && (
            <AIExplanationPanel
              symbol={aiData.symbol}
              pattern={aiData.pattern}
              compositeScore={aiData.composite_score}
              qualityBadge={aiData.quality_badge}
              reasoning={aiData.reasoning}
              recommendation={aiData.recommendation}
              historicalAccuracy={aiData.historical_accuracy}
            />
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          {/* Performance Attribution */}
          {attribution && (
            <PerformanceAttribution
              totalReturn={attribution.total_return}
              returnPct={attribution.return_pct}
              period={attribution.period}
              layers={attribution.layers}
            />
          )}
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6 mt-6">
          {/* Predictive Analytics */}
          {forecast && (
            <PredictiveAnalytics
              period={forecast.period}
              predictions={forecast.predictions}
              upcomingSetups={forecast.upcoming_setups}
            />
          )}
        </TabsContent>

        {/* Gamification Tab */}
        <TabsContent value="gamification" className="space-y-6 mt-6">
          {/* Achievements */}
          {achievements && (
            <AchievementsPanel
              achievements={achievements.achievements}
              userStats={achievements.user_stats}
            />
          )}

          {/* Trading Streak */}
          {streak && (
            <StreakTracker
              currentStreak={streak.current_streak}
              longestStreak={streak.longest_streak}
              totalTradingDays={streak.total_trading_days}
              profitableDays={streak.profitable_days}
              calendar={streak.calendar}
              milestones={streak.milestones}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
