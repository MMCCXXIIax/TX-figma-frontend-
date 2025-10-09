import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Search, TrendingUp, TrendingDown, AlertTriangle, Heart, MessageCircle, BarChart3, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { usePoll } from '../hooks/usePoll';
import { sentimentApi, signalsApi } from '../lib/api-client';
import config from '../lib/config';

interface SentimentData {
  symbol: string;
  overall_sentiment: number;
  sentiment_score: number;
  sentiment_label: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;
  sources: {
    news: number;
    social: number;
    technical: number;
  };
  metrics: {
    volume_buzz: number;
    social_mentions: number;
    news_articles: number;
    analyst_ratings: {
      buy: number;
      hold: number;
      sell: number;
    };
  };
  historical: Array<{
    date: string;
    sentiment: number;
    volume: number;
  }>;
  keywords: Array<{
    keyword: string;
    sentiment: number;
    mentions: number;
  }>;
  price_correlation: number;
  last_updated: string;
}

interface SignalData {
  symbol: string;
  signals: Array<{
    type: 'entry' | 'exit';
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    price_target?: number;
    stop_loss?: number;
    timeframe: string;
    reasoning: string;
  }>;
  last_updated: string;
}

interface TwitterHealth {
  status: 'healthy' | 'degraded' | 'down';
  last_update: string;
  rate_limit_remaining: number;
  rate_limit_reset: string;
  api_version: string;
  errors?: string[];
}

export function Sentiment() {
  const [symbol, setSymbol] = useState('AAPL');
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [signalData, setSignalData] = useState<SignalData | null>(null);
  const [twitterHealth, setTwitterHealth] = useState<TwitterHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadTwitterHealth();
  }, []);

  useEffect(() => {
    if (symbol) {
      loadSentimentData();
      loadSignalData();
    }
  }, [symbol]);

  // Poll every 180s (3 minutes)
  usePoll(() => {
    if (!symbol) return;
    loadSentimentData();
    loadSignalData();
  }, config.pollIntervalMs, { immediate: false });

  const loadSentimentData = async () => {
    if (!symbol) return;
    
    setLoading(true);
    try {
      const response = await sentimentApi.getSentiment(symbol);
      
      if (response.data.success) {
        setSentimentData(response.data.data);
      } else {
        toast.error('Failed to load sentiment data');
      }
    } catch (error) {
      console.error('Failed to load sentiment data:', error);
      toast.error('Failed to load sentiment data');
    } finally {
      setLoading(false);
    }
  };

  const loadSignalData = async () => {
    if (!symbol) return;
    
    try {
      const response = await signalsApi.getEntryExitSignals(symbol, '1d', 'all');
      
      if (response.data.success) {
        setSignalData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load signal data:', error);
    }
  };

  const loadTwitterHealth = async () => {
    try {
      const response = await sentimentApi.getTwitterHealth();
      
      if (response.data.success) {
        setTwitterHealth(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load Twitter health:', error);
    }
  };

  const enhanceConfidence = async () => {
    setAnalyzing(true);
    try {
      const baseConfidence = sentimentData?.confidence ?? 0.5;
      const response = await sentimentApi.enhanceConfidence(symbol, baseConfidence, 'AUTO');
      
      if (response.data.success) {
        toast.success('Sentiment confidence enhanced');
        loadSentimentData(); // Reload data
      } else {
        toast.error('Failed to enhance confidence');
      }
    } catch (error) {
      console.error('Failed to enhance confidence:', error);
      toast.error('Failed to enhance confidence');
    } finally {
      setAnalyzing(false);
    }
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.1) return 'text-green-400';
    if (sentiment < -0.1) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getSentimentBadgeColor = (label: string) => {
    switch (label) {
      case 'BULLISH': return 'bg-green-600';
      case 'BEARISH': return 'bg-red-600';
      default: return 'bg-yellow-600';
    }
  };

  const formatPercentage = (value: number | undefined | null) => {
    const v = typeof value === 'number' && isFinite(value) ? value : 0;
    return `${(v * 100).toFixed(1)}%`;
  };

  const sentimentDistributionData = sentimentData ? [
    { name: 'News', value: sentimentData.sources?.news ?? 0, fill: '#0ea5e9' },
    { name: 'Social', value: sentimentData.sources?.social ?? 0, fill: '#10b981' },
    { name: 'Technical', value: sentimentData.sources?.technical ?? 0, fill: '#f59e0b' },
  ] : [];

  const analystRatingsData = sentimentData ? [
    { name: 'Buy', value: sentimentData.metrics?.analyst_ratings?.buy ?? 0, fill: '#10b981' },
    { name: 'Hold', value: sentimentData.metrics?.analyst_ratings?.hold ?? 0, fill: '#f59e0b' },
    { name: 'Sell', value: sentimentData.metrics?.analyst_ratings?.sell ?? 0, fill: '#ef4444' },
  ] : [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl">Sentiment Analysis</h1>
        
        {/* Twitter Health Status */}
        {twitterHealth && (
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${
              twitterHealth.status === 'healthy' ? 'bg-green-500' :
              twitterHealth.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-gray-400">
              Twitter API: {twitterHealth.status}
            </span>
          </div>
        )}
      </div>

      {/* Search */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="symbol" className="text-gray-300">Symbol</Label>
              <div className="relative mt-2">
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
            <div className="flex items-end gap-2">
              <Button
                onClick={loadSentimentData}
                disabled={loading || !symbol}
                className="bg-sky-600 hover:bg-sky-700"
              >
                {loading ? 'Loading...' : 'Analyze'}
              </Button>
              <Button
                onClick={enhanceConfidence}
                disabled={analyzing || !sentimentData}
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                {analyzing ? 'Enhancing...' : 'Enhance'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {sentimentData && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Overall Sentiment</p>
                    <p className={`text-2xl ${getSentimentColor(sentimentData.overall_sentiment ?? 0)}`}>
                      {(sentimentData.overall_sentiment ?? 0).toFixed(3)}
                    </p>
                    <Badge className={getSentimentBadgeColor(sentimentData.sentiment_label)}>
                      {sentimentData.sentiment_label}
                    </Badge>
                  </div>
                  <Heart className={`h-8 w-8 ${getSentimentColor(sentimentData.overall_sentiment)}`} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Confidence</p>
                    <p className="text-2xl text-white">{formatPercentage(sentimentData.confidence)}</p>
                    <Progress value={sentimentData.confidence * 100} className="mt-2" />
                  </div>
                  <BarChart3 className="h-8 w-8 text-sky-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Social Mentions</p>
                    <p className="text-2xl text-white">{sentimentData.metrics.social_mentions.toLocaleString()}</p>
                  </div>
                  <MessageCircle className="h-8 w-8 text-sky-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Price Correlation</p>
                    <p className={`text-2xl ${(sentimentData.price_correlation ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(sentimentData.price_correlation ?? 0).toFixed(3)}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-sky-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="bg-gray-800">
              <TabsTrigger value="overview" className="data-[state=active]:bg-sky-600">
                Overview
              </TabsTrigger>
              <TabsTrigger value="sources" className="data-[state=active]:bg-sky-600">
                Sources
              </TabsTrigger>
              <TabsTrigger value="historical" className="data-[state=active]:bg-sky-600">
                Historical
              </TabsTrigger>
              <TabsTrigger value="signals" className="data-[state=active]:bg-sky-600">
                Signals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sentiment Distribution */}
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Sentiment Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sentimentDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            dataKey="value"
                            startAngle={90}
                            endAngle={450}
                          >
                            {sentimentDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1f2937',
                              border: '1px solid #374151',
                              borderRadius: '8px',
                            }}
                            formatter={(value: number) => [formatPercentage(value), 'Sentiment']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Analyst Ratings */}
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Analyst Ratings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analystRatingsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="name" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1f2937',
                              border: '1px solid #374151',
                              borderRadius: '8px',
                            }}
                          />
                          <Bar dataKey="value" fill="#0ea5e9" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Keywords */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Trending Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {sentimentData.keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={`${getSentimentColor(keyword.sentiment)} bg-gray-800`}
                      >
                        {keyword.keyword} ({keyword.mentions})
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sources">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">News Sentiment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className={`text-3xl ${getSentimentColor(sentimentData.sources?.news ?? 0)}`}>
                          {(sentimentData.sources?.news ?? 0).toFixed(3)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Articles:</span>
                          <span className="text-white">{sentimentData.metrics.news_articles}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Social Sentiment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className={`text-3xl ${getSentimentColor(sentimentData.sources?.social ?? 0)}`}>
                          {(sentimentData.sources?.social ?? 0).toFixed(3)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Mentions:</span>
                          <span className="text-white">{sentimentData.metrics.social_mentions}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Volume Buzz:</span>
                          <span className="text-white">{formatPercentage(sentimentData.metrics?.volume_buzz)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Technical Sentiment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className={`text-3xl ${getSentimentColor(sentimentData.sources?.technical ?? 0)}`}>
                          {(sentimentData.sources?.technical ?? 0).toFixed(3)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Correlation:</span>
                          <span className="text-white">{(sentimentData.price_correlation ?? 0).toFixed(3)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="historical">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Historical Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sentimentData.historical}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#9ca3af"
                          tickFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                          }}
                          labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <Line
                          type="monotone"
                          dataKey="sentiment"
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

            <TabsContent value="signals">
              {signalData ? (
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Entry/Exit Signals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {signalData.signals.map((signal, index) => (
                        <div key={index} className="p-4 rounded-lg bg-gray-800 border-l-4 border-sky-500">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={
                                signal.action === 'BUY' ? 'bg-green-600' :
                                signal.action === 'SELL' ? 'bg-red-600' : 'bg-yellow-600'
                              }>
                                {signal.action}
                              </Badge>
                              <Badge variant="outline">
                                {signal.type.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-white">{signal.confidence}% confidence</p>
                              <p className="text-xs text-gray-400">{signal.timeframe}</p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-300 mb-2">{signal.reasoning}</p>
                          
                          {signal.price_target && (
                            <div className="flex gap-4 text-xs text-gray-400">
                              <span>Target: ${signal.price_target.toFixed(2)}</span>
                              {signal.stop_loss && (
                                <span>Stop Loss: ${signal.stop_loss.toFixed(2)}</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="p-12 text-center">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400">No signal data available for this symbol</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Twitter API Health Alert */}
      {twitterHealth && twitterHealth.status !== 'healthy' && (
        <Alert className="bg-yellow-900/20 border-yellow-700">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-white">
            <div className="space-y-1">
              <p>Twitter API Status: {twitterHealth.status}</p>
              {twitterHealth.errors && twitterHealth.errors.map((error, index) => (
                <p key={index} className="text-sm">• {error}</p>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}