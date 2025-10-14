import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { TrendingUp, Info } from 'lucide-react';

interface TimeframeData {
  timeframe: string;
  confidence: number;
  detected: boolean;
}

interface PatternData {
  pattern_name: string;
  pattern_type: 'bullish' | 'bearish' | 'neutral';
  timeframes: TimeframeData[];
  max_confidence: number;
  avg_confidence: number;
}

interface PatternHeatmapProps {
  symbol: string;
  patterns: PatternData[];
  timeframes: string[];
}

export function PatternHeatmap({ symbol, patterns, timeframes }: PatternHeatmapProps) {
  const [selectedCell, setSelectedCell] = useState<{ pattern: string; timeframe: string } | null>(null);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'bg-green-700 hover:bg-green-600';
    if (confidence >= 75) return 'bg-green-600 hover:bg-green-500';
    if (confidence >= 65) return 'bg-yellow-600 hover:bg-yellow-500';
    if (confidence >= 55) return 'bg-orange-600 hover:bg-orange-500';
    if (confidence >= 45) return 'bg-red-600 hover:bg-red-500';
    return 'bg-gray-700 hover:bg-gray-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 85) return 'ELITE';
    if (confidence >= 75) return 'HIGH';
    if (confidence >= 65) return 'GOOD';
    if (confidence >= 55) return 'MODERATE';
    if (confidence >= 45) return 'WEAK';
    return 'NONE';
  };

  const getPatternTypeIcon = (type: string) => {
    switch (type) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      default: return '➡️';
    }
  };

  const getCellData = (pattern: PatternData, timeframe: string) => {
    return pattern.timeframes.find(tf => tf.timeframe === timeframe);
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-sky-400" />
            Pattern Confidence Heatmap
          </CardTitle>
          <Badge variant="outline" className="text-sky-400 border-sky-400">
            {symbol}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Legend */}
        <div className="mb-4 flex items-center gap-4 text-xs flex-wrap">
          <span className="text-gray-400">Confidence:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-700 rounded"></div>
            <span className="text-gray-300">85-100% (ELITE)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span className="text-gray-300">75-85% (HIGH)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-600 rounded"></div>
            <span className="text-gray-300">65-75% (GOOD)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-600 rounded"></div>
            <span className="text-gray-300">55-65% (MODERATE)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-700 rounded"></div>
            <span className="text-gray-300">&lt;55% (WEAK)</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Header Row */}
            <div className="flex items-center mb-2">
              <div className="w-40 flex-shrink-0"></div>
              {timeframes.map(tf => (
                <div key={tf} className="w-24 text-center text-sm font-medium text-gray-300">
                  {tf}
                </div>
              ))}
              <div className="w-24 text-center text-sm font-medium text-gray-300">
                Avg
              </div>
            </div>

            {/* Pattern Rows */}
            {patterns.map(pattern => (
              <div key={pattern.pattern_name} className="flex items-center mb-2">
                {/* Pattern Name */}
                <div className="w-40 flex-shrink-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getPatternTypeIcon(pattern.pattern_type)}</span>
                    <div>
                      <div className="text-sm text-white font-medium truncate">
                        {pattern.pattern_name}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {pattern.pattern_type}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confidence Cells */}
                {timeframes.map(tf => {
                  const cellData = getCellData(pattern, tf);
                  const confidence = cellData?.confidence || 0;
                  const detected = cellData?.detected || false;

                  return (
                    <TooltipProvider key={tf}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-24 h-16 mx-1 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                              getConfidenceColor(confidence)
                            } ${
                              selectedCell?.pattern === pattern.pattern_name && selectedCell?.timeframe === tf
                                ? 'ring-2 ring-sky-400 scale-105'
                                : ''
                            }`}
                            onClick={() => setSelectedCell({ pattern: pattern.pattern_name, timeframe: tf })}
                          >
                            <div className="text-center">
                              {detected ? (
                                <>
                                  <div className="text-white font-bold text-lg">
                                    {confidence.toFixed(0)}%
                                  </div>
                                  <div className="text-xs text-white opacity-75">
                                    {getConfidenceLabel(confidence)}
                                  </div>
                                </>
                              ) : (
                                <div className="text-gray-500 text-sm">—</div>
                              )}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <div className="font-medium">{pattern.pattern_name}</div>
                            <div className="text-sm">Timeframe: {tf}</div>
                            <div className="text-sm">
                              Confidence: {detected ? `${confidence.toFixed(1)}%` : 'Not detected'}
                            </div>
                            {detected && (
                              <div className="text-sm">
                                Quality: {getConfidenceLabel(confidence)}
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}

                {/* Average Confidence */}
                <div className="w-24 mx-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white font-medium">
                      {pattern.avg_confidence.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-400">avg</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Cell Details */}
        {selectedCell && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white font-medium">
                {selectedCell.pattern} @ {selectedCell.timeframe}
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-gray-400">
              Click on cells to see detailed pattern information
            </div>
          </div>
        )}

        {/* Insights */}
        {patterns.length > 0 && (
          <div className="mt-4 p-3 bg-sky-900/20 border border-sky-700/30 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-sky-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-sky-200">
                <strong>Multi-Timeframe Consensus:</strong> Patterns with high confidence across multiple 
                timeframes (bright green columns) indicate stronger signals with higher probability of success.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
