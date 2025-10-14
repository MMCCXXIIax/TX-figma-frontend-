import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Sparkles, TrendingUp, Calendar, Bell } from 'lucide-react';

interface Prediction {
  metric: string;
  value: string;
  confidence: number;
  trend?: string;
  basis?: string;
}

interface UpcomingSetup {
  symbol: string;
  pattern: string;
  expected_date: string;
  probability: number;
  reasoning: string;
}

interface PredictiveAnalyticsProps {
  period: string;
  predictions: Prediction[];
  upcomingSetups: UpcomingSetup[];
}

export function PredictiveAnalytics({
  period,
  predictions,
  upcomingSetups
}: PredictiveAnalyticsProps) {
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return 'bg-green-600';
    if (probability >= 65) return 'bg-yellow-600';
    return 'bg-orange-600';
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            Predictive Analytics
          </CardTitle>
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            {period}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Forecast */}
        <div className="space-y-3">
          <h3 className="text-white font-medium flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-sky-400" />
            AI Forecast
          </h3>

          <div className="space-y-3">
            {predictions.map((prediction, index) => (
              <div
                key={index}
                className="p-4 bg-gray-800 border border-gray-700 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-white font-medium mb-1">
                      {prediction.metric}
                    </div>
                    <div className="text-2xl font-bold text-sky-400">
                      {prediction.value}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 mb-1">Confidence</div>
                    <div className={`text-lg font-bold ${getConfidenceColor(prediction.confidence)}`}>
                      {prediction.confidence}%
                    </div>
                  </div>
                </div>

                {prediction.trend && (
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {prediction.trend}
                    </Badge>
                  </div>
                )}

                {prediction.basis && (
                  <p className="text-xs text-gray-400">
                    {prediction.basis}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Setups */}
        {upcomingSetups.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-white font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5 text-sky-400" />
              High-Probability Setups
            </h3>

            <div className="space-y-2">
              {upcomingSetups.map((setup, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-700/30 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-bold text-lg">
                          {setup.symbol}
                        </span>
                        <Badge variant="outline" className="text-purple-400 border-purple-400">
                          {setup.pattern}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-400">
                        Expected: {new Date(setup.expected_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 mb-1">Probability</div>
                      <Badge className={`${getProbabilityColor(setup.probability)} text-white`}>
                        {setup.probability}%
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-3">
                    {setup.reasoning}
                  </p>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-purple-600 text-purple-400 hover:bg-purple-900/30"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Set Alert
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-3 bg-purple-900/20 border border-purple-700/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-purple-200">
              Our AI analyzes historical patterns, market conditions, and sentiment trends to predict 
              upcoming trading opportunities. Set alerts to be notified when high-probability setups form.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
