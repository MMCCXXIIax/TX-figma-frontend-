import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { CheckCircle2, AlertCircle, Info, TrendingUp, Target, Shield } from 'lucide-react';

interface ReasoningStep {
  icon: string;
  status: 'strong' | 'moderate' | 'weak';
  title: string;
  description: string;
  details?: string;
}

interface Recommendation {
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  target_price?: number;
  stop_loss?: number;
  risk_score?: number;
  risk_level?: string;
}

interface HistoricalAccuracy {
  pattern_type: string;
  accuracy: number;
  sample_size: number;
  avg_return?: number;
}

interface AIExplanationPanelProps {
  symbol: string;
  pattern: string;
  compositeScore: number;
  qualityBadge: string;
  reasoning: ReasoningStep[];
  recommendation: Recommendation;
  historicalAccuracy?: HistoricalAccuracy;
}

export function AIExplanationPanel({
  symbol,
  pattern,
  compositeScore,
  qualityBadge,
  reasoning,
  recommendation,
  historicalAccuracy
}: AIExplanationPanelProps) {
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'strong': return <CheckCircle2 className="h-5 w-5 text-green-400" />;
      case 'moderate': return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      case 'weak': return <Info className="h-5 w-5 text-red-400" />;
      default: return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'strong': return 'border-green-500/30 bg-green-500/10';
      case 'moderate': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'weak': return 'border-red-500/30 bg-red-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-green-600 text-white';
      case 'SELL': return 'bg-red-600 text-white';
      case 'HOLD': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">
            Why This Alert is {qualityBadge} ({compositeScore.toFixed(1)}%)
          </CardTitle>
          <Badge variant="outline" className="text-sky-400 border-sky-400">
            {symbol}
          </Badge>
        </div>
        <div className="text-sm text-gray-400 mt-1">
          {pattern} Pattern Detection
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* AI Reasoning Steps */}
        <div className="space-y-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-sky-400" />
            AI Analysis
          </h3>

          {reasoning.map((step, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getStatusColor(step.status)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <span className="text-2xl">{step.icon}</span>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(step.status)}
                    <h4 className="text-white font-medium">{step.title}</h4>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {step.description}
                  </p>
                  
                  {step.details && (
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {step.details}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="bg-gray-700" />

        {/* Recommendation */}
        <div className="space-y-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Target className="h-5 w-5 text-sky-400" />
            Trading Recommendation
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Action</div>
              <Badge className={getActionColor(recommendation.action)}>
                {recommendation.action}
              </Badge>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Confidence</div>
              <div className="text-lg font-bold text-white">
                {recommendation.confidence.toFixed(1)}%
              </div>
            </div>

            {recommendation.target_price && (
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Target Price</div>
                <div className="text-lg font-bold text-green-400">
                  ${recommendation.target_price.toFixed(2)}
                </div>
              </div>
            )}

            {recommendation.stop_loss && (
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Stop Loss</div>
                <div className="text-lg font-bold text-red-400">
                  ${recommendation.stop_loss.toFixed(2)}
                </div>
              </div>
            )}
          </div>

          {recommendation.risk_score !== undefined && (
            <div className="p-4 bg-gray-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-sky-400" />
                <span className="text-white font-medium">Risk Assessment</span>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${getRiskColor(recommendation.risk_level)}`}>
                  {recommendation.risk_score.toFixed(1)}
                </div>
                <div className="text-xs text-gray-400">
                  {recommendation.risk_level || 'Medium'} Risk
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Historical Accuracy */}
        {historicalAccuracy && (
          <>
            <Separator className="bg-gray-700" />
            
            <div className="space-y-3">
              <h3 className="text-white font-medium flex items-center gap-2">
                <Info className="h-5 w-5 text-sky-400" />
                Historical Performance
              </h3>

              <div className="p-4 bg-sky-900/20 border border-sky-700/30 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Pattern Accuracy</div>
                    <div className="text-xl font-bold text-white">
                      {historicalAccuracy.accuracy.toFixed(1)}%
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400 mb-1">Sample Size</div>
                    <div className="text-xl font-bold text-white">
                      {historicalAccuracy.sample_size}
                    </div>
                  </div>

                  {historicalAccuracy.avg_return !== undefined && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Avg Return</div>
                      <div className={`text-xl font-bold ${
                        historicalAccuracy.avg_return >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {historicalAccuracy.avg_return >= 0 ? '+' : ''}
                        {historicalAccuracy.avg_return.toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-sm text-sky-200 mt-3">
                  This {historicalAccuracy.pattern_type} pattern has been detected{' '}
                  {historicalAccuracy.sample_size} times historically with a{' '}
                  {historicalAccuracy.accuracy.toFixed(1)}% success rate.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Pro Tip */}
        <div className="p-3 bg-purple-900/20 border border-purple-700/30 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-lg">💡</span>
            <div className="text-sm text-purple-200">
              <strong>Pro Tip:</strong> Patterns with {'>'}85% confidence and strong multi-timeframe 
              alignment have historically shown the highest success rates. Always use proper risk 
              management and position sizing.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
