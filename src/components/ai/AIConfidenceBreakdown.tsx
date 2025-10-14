import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Info, TrendingUp, Brain, BarChart3, MessageSquare, Award } from 'lucide-react';

interface ConfidenceLayer {
  name: string;
  score: number;
  weight: number;
  contribution: number;
  status: 'strong' | 'moderate' | 'weak';
  details: string;
  boost?: number;
  icon?: React.ReactNode;
}

interface AIConfidenceBreakdownProps {
  compositeScore: number;
  qualityBadge: 'ELITE' | 'HIGH' | 'GOOD' | 'MODERATE' | 'LOW';
  layers: {
    rule_based?: ConfidenceLayer;
    deep_learning?: ConfidenceLayer & { model_version?: string };
    multi_timeframe?: ConfidenceLayer & { 
      alignment?: number;
      timeframes?: Record<string, { score: number; weight: number }>;
    };
    sentiment?: ConfidenceLayer & {
      sources?: Record<string, { score: number; reliability: number; count?: number }>;
    };
  };
}

export function AIConfidenceBreakdown({ compositeScore, qualityBadge, layers }: AIConfidenceBreakdownProps) {
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'strong': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'weak': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'ELITE': return 'bg-purple-600 text-white';
      case 'HIGH': return 'bg-green-600 text-white';
      case 'GOOD': return 'bg-blue-600 text-white';
      case 'MODERATE': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getLayerIcon = (layerName: string) => {
    switch (layerName) {
      case 'rule_based': return <TrendingUp className="h-5 w-5" />;
      case 'deep_learning': return <Brain className="h-5 w-5" />;
      case 'multi_timeframe': return <BarChart3 className="h-5 w-5" />;
      case 'sentiment': return <MessageSquare className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const formatLayerName = (name: string) => {
    return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-sky-400" />
            AI Confidence Analysis
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge className={getBadgeColor(qualityBadge)}>
              {qualityBadge}
            </Badge>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{compositeScore.toFixed(1)}%</div>
              <div className="text-xs text-gray-400">Composite Score</div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Layer Breakdown */}
        <div className="space-y-3">
          {Object.entries(layers).map(([key, layer]) => {
            if (!layer) return null;
            
            const isExpanded = expandedLayer === key;
            
            return (
              <div key={key} className="space-y-2">
                {/* Layer Header */}
                <div 
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-800 p-3 rounded-lg transition-colors"
                  onClick={() => setExpandedLayer(isExpanded ? null : key)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${getStatusColor(layer.status)} bg-opacity-20`}>
                      {getLayerIcon(key)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{formatLayerName(key)}</span>
                        {layer.boost && (
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            +{layer.boost}% boost
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-400">
                          Score: <span className="text-white font-medium">{layer.score}%</span>
                        </span>
                        <span className="text-sm text-gray-400">
                          Weight: <span className="text-white font-medium">{layer.weight}%</span>
                        </span>
                        <span className="text-sm text-gray-400">
                          Contribution: <span className="text-white font-medium">{layer.contribution.toFixed(1)}</span>
                        </span>
                      </div>
                    </div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{layer.details}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="px-3">
                  <Progress 
                    value={layer.score} 
                    className="h-2"
                    indicatorClassName={getStatusColor(layer.status)}
                  />
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-3 pb-2 space-y-2 animate-in slide-in-from-top-2">
                    {/* Multi-Timeframe Details */}
                    {key === 'multi_timeframe' && 'timeframes' in layer && layer.timeframes && (
                      <div className="bg-gray-800 p-3 rounded-lg space-y-2">
                        <div className="text-sm font-medium text-white">Timeframe Breakdown</div>
                        {Object.entries(layer.timeframes).map(([tf, data]) => (
                          <div key={tf} className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">{tf}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white">{data.score}%</span>
                              <span className="text-gray-500">({data.weight}% weight)</span>
                            </div>
                          </div>
                        ))}
                        {layer.alignment !== undefined && (
                          <div className="pt-2 border-t border-gray-700">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Alignment Score</span>
                              <span className="text-green-400 font-medium">{layer.alignment.toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sentiment Sources */}
                    {key === 'sentiment' && 'sources' in layer && layer.sources && (
                      <div className="bg-gray-800 p-3 rounded-lg space-y-2">
                        <div className="text-sm font-medium text-white">Sentiment Sources</div>
                        {Object.entries(layer.sources).map(([source, data]) => (
                          <div key={source} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400 capitalize">{source}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-white">{data.score}%</span>
                                <span className="text-gray-500">({data.reliability}% reliable)</span>
                              </div>
                            </div>
                            {data.count && (
                              <div className="text-xs text-gray-500 pl-2">
                                {data.count.toLocaleString()} mentions
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Deep Learning Model Version */}
                    {key === 'deep_learning' && 'model_version' in layer && layer.model_version && (
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">
                          Model: <span className="text-white font-mono">{layer.model_version}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 text-center">
            This composite score combines {Object.keys(layers).length} AI validation layers
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
