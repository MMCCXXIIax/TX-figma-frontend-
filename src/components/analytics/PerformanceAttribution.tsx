import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Award, Info, BarChart3 } from 'lucide-react';

interface LayerAttribution {
  name: string;
  contribution: number;
  percentage: number;
  trades: number;
  win_rate: number;
  avg_return: number;
}

interface PerformanceAttributionProps {
  totalReturn: number;
  returnPct: number;
  period: string;
  layers: LayerAttribution[];
}

export function PerformanceAttribution({
  totalReturn,
  returnPct,
  period,
  layers
}: PerformanceAttributionProps) {
  
  const getLayerColor = (name: string) => {
    if (name.includes('Deep Learning')) return 'bg-purple-500';
    if (name.includes('Multi-Timeframe')) return 'bg-blue-500';
    if (name.includes('Sentiment')) return 'bg-green-500';
    return 'bg-sky-500';
  };

  const topPerformer = layers.reduce((max, layer) => 
    layer.contribution > max.contribution ? layer : max
  , layers[0]);

  const insights = [
    {
      type: 'top',
      icon: '🏆',
      message: `${topPerformer.name} added the most value this period (+$${topPerformer.contribution.toLocaleString()})`
    },
    {
      type: 'recommendation',
      icon: '💡',
      message: 'Focus on trades with DL confidence >85% for best results'
    }
  ];

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-yellow-400" />
            Performance Attribution
          </CardTitle>
          <Badge variant="outline" className="text-sky-400 border-sky-400">
            {period}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Total Return */}
        <div className="p-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/30 rounded-lg text-center">
          <div className="text-sm text-gray-400 mb-2">Total Return</div>
          <div className="text-4xl font-bold text-white mb-1">
            ${totalReturn.toLocaleString()}
          </div>
          <div className={`text-xl font-medium ${returnPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {returnPct >= 0 ? '+' : ''}{returnPct.toFixed(2)}%
          </div>
        </div>

        {/* Layer Breakdown */}
        <div className="space-y-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-sky-400" />
            AI Layer Contributions
          </h3>

          {layers.map((layer, index) => (
            <div key={index} className="space-y-2">
              {/* Layer Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getLayerColor(layer.name)}`}></div>
                  <span className="text-white font-medium">{layer.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">
                    ${layer.contribution.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    {layer.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <Progress 
                value={layer.percentage} 
                className="h-3"
                indicatorClassName={getLayerColor(layer.name)}
              />

              {/* Layer Stats */}
              <div className="flex items-center justify-between text-sm text-gray-400 pl-6">
                <span>{layer.trades} trades</span>
                <span>{layer.win_rate}% win rate</span>
                <span className={layer.avg_return >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {layer.avg_return >= 0 ? '+' : ''}{layer.avg_return.toFixed(1)}% avg
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                insight.type === 'top'
                  ? 'bg-yellow-900/20 border-yellow-700/30'
                  : 'bg-sky-900/20 border-sky-700/30'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">{insight.icon}</span>
                <p className={`text-sm ${
                  insight.type === 'top' ? 'text-yellow-200' : 'text-sky-200'
                }`}>
                  {insight.message}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="p-3 bg-gray-800 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-400">
              This analysis shows how each AI validation layer contributed to your overall returns. 
              Layers with higher contributions indicate which AI features are most valuable for your trading style.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
