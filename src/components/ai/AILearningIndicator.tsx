import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Brain, TrendingUp, Sparkles, Clock } from 'lucide-react';

interface ModelUpdate {
  timestamp: string;
  description: string;
  impact: string;
  type: 'improvement' | 'new' | 'update';
}

interface ModelStats {
  total_patterns_learned: number;
  training_samples: number;
  last_update: string;
  next_update_seconds: number;
  accuracy_trend: number;
}

interface AILearningIndicatorProps {
  isLearning: boolean;
  recentUpdates: ModelUpdate[];
  modelStats: ModelStats;
  compact?: boolean;
}

export function AILearningIndicator({
  isLearning,
  recentUpdates,
  modelStats,
  compact = false
}: AILearningIndicatorProps) {
  const [countdown, setCountdown] = useState(modelStats.next_update_seconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCountdown(modelStats.next_update_seconds);
  }, [modelStats.next_update_seconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getImpactColor = (impact: string) => {
    if (impact.startsWith('+')) return 'text-green-400';
    if (impact.startsWith('-')) return 'text-red-400';
    return 'text-sky-400';
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'improvement': return '📈';
      case 'new': return '✨';
      case 'update': return '🔄';
      default: return '📊';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
        <div className={`flex items-center gap-2 ${isLearning ? 'animate-pulse' : ''}`}>
          <Brain className="h-5 w-5 text-purple-400" />
          <span className="text-sm text-white font-medium">
            {isLearning ? 'AI Learning...' : 'AI Ready'}
          </span>
        </div>
        
        {isLearning && (
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            Processing {modelStats.training_samples} samples
          </Badge>
        )}

        <div className="ml-auto text-sm text-gray-400">
          Next update: {formatTime(countdown)}
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className={`h-6 w-6 text-purple-400 ${isLearning ? 'animate-pulse' : ''}`} />
            AI Learning Status
          </CardTitle>
          <Badge 
            variant={isLearning ? 'default' : 'outline'}
            className={isLearning ? 'bg-purple-600 text-white' : 'text-purple-400 border-purple-400'}
          >
            {isLearning ? 'Learning Active' : 'Monitoring'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status */}
        {isLearning && (
          <div className="p-4 bg-purple-900/20 border border-purple-700/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
              <span className="text-white font-medium">
                AI is learning from {modelStats.training_samples} new outcomes...
              </span>
            </div>
            <p className="text-sm text-purple-200">
              The model is continuously improving its predictions based on real market outcomes.
            </p>
          </div>
        )}

        {/* Recent Updates */}
        {recentUpdates.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-white font-medium text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-sky-400" />
              Recent Model Updates
            </h3>

            <div className="space-y-2">
              {recentUpdates.slice(0, 3).map((update, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">{getUpdateIcon(update.type)}</span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400">
                          {new Date(update.timestamp).toLocaleTimeString()}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getImpactColor(update.impact)}`}
                        >
                          {update.impact}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-white">
                        {update.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Model Statistics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-800 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">Patterns Learned</div>
            <div className="text-2xl font-bold text-white">
              {modelStats.total_patterns_learned}
            </div>
          </div>

          <div className="p-3 bg-gray-800 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">Training Samples</div>
            <div className="text-2xl font-bold text-white">
              {modelStats.training_samples.toLocaleString()}
            </div>
          </div>

          <div className="p-3 bg-gray-800 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">Last Update</div>
            <div className="text-sm font-medium text-white">
              {new Date(modelStats.last_update).toLocaleTimeString()}
            </div>
          </div>

          <div className="p-3 bg-gray-800 rounded-lg">
            <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Next Update
            </div>
            <div className="text-sm font-medium text-sky-400">
              {formatTime(countdown)}
            </div>
          </div>
        </div>

        {/* Accuracy Trend */}
        {modelStats.accuracy_trend !== 0 && (
          <div className="p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Accuracy Trend (7 days)</span>
              <div className={`flex items-center gap-1 font-medium ${
                modelStats.accuracy_trend > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {modelStats.accuracy_trend > 0 ? '↑' : '↓'}
                {Math.abs(modelStats.accuracy_trend).toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-3 bg-sky-900/20 border border-sky-700/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Brain className="h-4 w-4 text-sky-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-sky-200">
              Our AI continuously learns from market outcomes to improve prediction accuracy. 
              The model retrains every 3 minutes with new data, ensuring you always get the 
              most up-to-date intelligence.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
