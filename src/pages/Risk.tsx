import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Shield, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Target, Search } from 'lucide-react';
import { toast } from 'sonner';
import { riskApi } from '../lib/api-client';

interface RiskSettings {
  max_position_size: number;
  max_portfolio_risk: number;
  stop_loss_percentage: number;
  max_daily_trades: number;
  max_drawdown_limit: number;
  require_confirmation: boolean;
  enable_auto_stop_loss: boolean;
  enable_position_sizing: boolean;
  risk_free_rate: number;
  correlation_threshold: number;
}

interface RiskCheck {
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  warnings: string[];
  recommendations: string[];
  position_size_recommended: number;
  stop_loss_recommended: number;
  max_loss_amount: number;
  portfolio_impact: number;
  confirmation_required: boolean;
  risk_confirmation_token?: string;
}

interface Recommendation {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  target_price: number;
  stop_loss: number;
  reasoning: string;
  risk_assessment: {
    risk_score: number;
    risk_factors: string[];
    risk_mitigation: string[];
  };
  position_sizing: {
    recommended_size: number;
    max_size: number;
    kelly_criterion: number;
  };
  timeframe: string;
  last_updated: string;
}

export function Risk() {
  const [riskSettings, setRiskSettings] = useState<RiskSettings | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);
  const [riskCheck, setRiskCheck] = useState<RiskCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Risk check form
  const [checkSymbol, setCheckSymbol] = useState('');
  const [checkSide, setCheckSide] = useState<'BUY' | 'SELL'>('BUY');
  const [checkQuantity, setCheckQuantity] = useState('');
  const [checkPrice, setCheckPrice] = useState('');

  // Recommendations form
  const [recommendSymbol, setRecommendSymbol] = useState('');

  useEffect(() => {
    loadRiskSettings();
  }, []);

  const loadRiskSettings = async () => {
    setLoading(true);
    try {
      const response = await riskApi.getRiskSettings();
      
      if (response.data.success) {
        setRiskSettings(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load risk settings:', error);
      toast.error('Failed to load risk settings');
    } finally {
      setLoading(false);
    }
  };

  const saveRiskSettings = async () => {
    if (!riskSettings) return;

    setSaving(true);
    try {
      const response = await riskApi.updateRiskSettings(riskSettings);
      
      if (response.data.success) {
        toast.success('Risk settings saved successfully');
      } else {
        toast.error('Failed to save risk settings');
      }
    } catch (error) {
      console.error('Failed to save risk settings:', error);
      toast.error('Failed to save risk settings');
    } finally {
      setSaving(false);
    }
  };

  const performRiskCheck = async () => {
    if (!checkSymbol || !checkQuantity || !checkPrice) {
      toast.error('Please fill in all fields');
      return;
    }

    setChecking(true);
    try {
      const tradeData = {
        symbol: checkSymbol.toUpperCase(),
        side: checkSide,
        quantity: parseInt(checkQuantity),
        price: parseFloat(checkPrice),
      };

      const response = await riskApi.preTradeCheck(tradeData);
      
      if (response.data.success) {
        setRiskCheck(response.data.data);
        toast.success('Risk check completed');
      } else {
        toast.error('Risk check failed');
      }
    } catch (error) {
      console.error('Risk check failed:', error);
      toast.error('Risk check failed');
    } finally {
      setChecking(false);
    }
  };

  const loadRecommendations = async () => {
    if (!recommendSymbol) {
      toast.error('Please enter a symbol');
      return;
    }

    setLoadingRecommendations(true);
    try {
      const response = await riskApi.getRecommendations(recommendSymbol.toUpperCase());
      
      if (response.data.success) {
        setRecommendations(response.data.data);
        toast.success('Recommendations loaded');
      } else {
        toast.error('Failed to load recommendations');
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-600';
      case 'MEDIUM': return 'bg-yellow-600';
      case 'HIGH': return 'bg-orange-600';
      case 'CRITICAL': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 25) return 'text-green-400';
    if (score <= 50) return 'text-yellow-400';
    if (score <= 75) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl">Risk Management & Recommendations</h1>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-sky-400" />
          <span className="text-sm text-gray-400">Risk Management Active</span>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="settings" className="data-[state=active]:bg-sky-600">
            Risk Settings
          </TabsTrigger>
          <TabsTrigger value="check" className="data-[state=active]:bg-sky-600">
            Pre-Trade Check
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-sky-600">
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          {riskSettings && (
            <div className="space-y-6">
              {/* Risk Parameters */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Risk Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="max-position-size" className="text-gray-300">
                        Max Position Size (% of portfolio)
                      </Label>
                      <Input
                        id="max-position-size"
                        type="number"
                        min="1"
                        max="100"
                        value={riskSettings.max_position_size}
                        onChange={(e) => setRiskSettings({
                          ...riskSettings,
                          max_position_size: parseFloat(e.target.value) || 0
                        })}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-portfolio-risk" className="text-gray-300">
                        Max Portfolio Risk (% of capital)
                      </Label>
                      <Input
                        id="max-portfolio-risk"
                        type="number"
                        min="1"
                        max="20"
                        value={riskSettings.max_portfolio_risk}
                        onChange={(e) => setRiskSettings({
                          ...riskSettings,
                          max_portfolio_risk: parseFloat(e.target.value) || 0
                        })}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stop-loss" className="text-gray-300">
                        Default Stop Loss (%)
                      </Label>
                      <Input
                        id="stop-loss"
                        type="number"
                        min="1"
                        max="50"
                        value={riskSettings.stop_loss_percentage}
                        onChange={(e) => setRiskSettings({
                          ...riskSettings,
                          stop_loss_percentage: parseFloat(e.target.value) || 0
                        })}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-daily-trades" className="text-gray-300">
                        Max Daily Trades
                      </Label>
                      <Input
                        id="max-daily-trades"
                        type="number"
                        min="1"
                        max="100"
                        value={riskSettings.max_daily_trades}
                        onChange={(e) => setRiskSettings({
                          ...riskSettings,
                          max_daily_trades: parseInt(e.target.value) || 0
                        })}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-drawdown" className="text-gray-300">
                        Max Drawdown Limit (%)
                      </Label>
                      <Input
                        id="max-drawdown"
                        type="number"
                        min="5"
                        max="50"
                        value={riskSettings.max_drawdown_limit}
                        onChange={(e) => setRiskSettings({
                          ...riskSettings,
                          max_drawdown_limit: parseFloat(e.target.value) || 0
                        })}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="risk-free-rate" className="text-gray-300">
                        Risk-Free Rate (%)
                      </Label>
                      <Input
                        id="risk-free-rate"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={riskSettings.risk_free_rate}
                        onChange={(e) => setRiskSettings({
                          ...riskSettings,
                          risk_free_rate: parseFloat(e.target.value) || 0
                        })}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Risk Controls */}
                  <div className="space-y-4">
                    <h3 className="text-lg text-white">Risk Controls</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="require-confirmation"
                          checked={riskSettings.require_confirmation}
                          onCheckedChange={(checked) => setRiskSettings({
                            ...riskSettings,
                            require_confirmation: checked
                          })}
                        />
                        <Label htmlFor="require-confirmation" className="text-gray-300">
                          Require trade confirmation
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="auto-stop-loss"
                          checked={riskSettings.enable_auto_stop_loss}
                          onCheckedChange={(checked) => setRiskSettings({
                            ...riskSettings,
                            enable_auto_stop_loss: checked
                          })}
                        />
                        <Label htmlFor="auto-stop-loss" className="text-gray-300">
                          Enable automatic stop loss
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="position-sizing"
                          checked={riskSettings.enable_position_sizing}
                          onCheckedChange={(checked) => setRiskSettings({
                            ...riskSettings,
                            enable_position_sizing: checked
                          })}
                        />
                        <Label htmlFor="position-sizing" className="text-gray-300">
                          Enable intelligent position sizing
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={saveRiskSettings}
                    disabled={saving}
                    className="w-full bg-sky-600 hover:bg-sky-700"
                  >
                    {saving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="check">
          <div className="space-y-6">
            {/* Risk Check Form */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Pre-Trade Risk Check</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="check-symbol" className="text-gray-300">Symbol</Label>
                    <Input
                      id="check-symbol"
                      value={checkSymbol}
                      onChange={(e) => setCheckSymbol(e.target.value.toUpperCase())}
                      placeholder="AAPL"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Side</Label>
                    <Select value={checkSide} onValueChange={(value: 'BUY' | 'SELL') => setCheckSide(value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="BUY">BUY</SelectItem>
                        <SelectItem value="SELL">SELL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="check-quantity" className="text-gray-300">Quantity</Label>
                    <Input
                      id="check-quantity"
                      type="number"
                      value={checkQuantity}
                      onChange={(e) => setCheckQuantity(e.target.value)}
                      placeholder="100"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="check-price" className="text-gray-300">Price</Label>
                    <Input
                      id="check-price"
                      type="number"
                      step="0.01"
                      value={checkPrice}
                      onChange={(e) => setCheckPrice(e.target.value)}
                      placeholder="150.00"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <Button
                  onClick={performRiskCheck}
                  disabled={checking}
                  className="w-full bg-sky-600 hover:bg-sky-700"
                >
                  {checking ? 'Checking...' : 'Perform Risk Check'}
                </Button>
              </CardContent>
            </Card>

            {/* Risk Check Results */}
            {riskCheck && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Risk Assessment Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Risk Score */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Risk Score</p>
                      <p className={`text-3xl ${getRiskScoreColor(riskCheck.risk_score)}`}>
                        {riskCheck.risk_score.toFixed(1)}
                      </p>
                    </div>
                    <Badge className={getRiskLevelColor(riskCheck.risk_level)}>
                      {riskCheck.risk_level} RISK
                    </Badge>
                  </div>

                  <Progress value={riskCheck.risk_score} className="mt-2" />

                  {/* Risk Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Recommended Position Size</p>
                      <p className="text-lg text-white">{riskCheck.position_size_recommended} shares</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Recommended Stop Loss</p>
                      <p className="text-lg text-white">${riskCheck.stop_loss_recommended.toFixed(2)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Max Loss Amount</p>
                      <p className="text-lg text-red-400">${riskCheck.max_loss_amount.toFixed(2)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Portfolio Impact</p>
                      <p className="text-lg text-white">{riskCheck.portfolio_impact.toFixed(2)}%</p>
                    </div>
                  </div>

                  {/* Warnings */}
                  {riskCheck.warnings.length > 0 && (
                    <Alert className="bg-red-900/20 border-red-700">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-white">
                        <p className="mb-2">Risk Warnings:</p>
                        <ul className="space-y-1">
                          {riskCheck.warnings.map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Recommendations */}
                  {riskCheck.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Recommendations:</p>
                      <ul className="space-y-1 text-sm text-gray-300">
                        {riskCheck.recommendations.map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="space-y-6">
            {/* Recommendations Search */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="recommend-symbol" className="text-gray-300">Symbol</Label>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="recommend-symbol"
                        value={recommendSymbol}
                        onChange={(e) => setRecommendSymbol(e.target.value.toUpperCase())}
                        placeholder="AAPL"
                        className="pl-10 bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={loadRecommendations}
                      disabled={loadingRecommendations || !recommendSymbol}
                      className="bg-sky-600 hover:bg-sky-700"
                    >
                      {loadingRecommendations ? 'Loading...' : 'Get Recommendations'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations Results */}
            {recommendations && (
              <div className="space-y-6">
                {/* Action Card */}
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{recommendations.symbol} Recommendation</CardTitle>
                      <Badge className={
                        recommendations.action === 'BUY' ? 'bg-green-600' :
                        recommendations.action === 'SELL' ? 'bg-red-600' : 'bg-yellow-600'
                      }>
                        {recommendations.action}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Confidence</p>
                          <p className="text-2xl text-white">{recommendations.confidence}%</p>
                          <Progress value={recommendations.confidence} className="mt-2 w-24" />
                        </div>
                        <Target className="h-8 w-8 text-sky-400" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Target Price</p>
                          <p className="text-2xl text-green-400">${recommendations.target_price.toFixed(2)}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-400" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Stop Loss</p>
                          <p className="text-2xl text-red-400">${recommendations.stop_loss.toFixed(2)}</p>
                        </div>
                        <TrendingDown className="h-8 w-8 text-red-400" />
                      </div>
                    </div>

                    {/* Reasoning */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">Reasoning:</p>
                      <p className="text-gray-300">{recommendations.reasoning}</p>
                    </div>

                    {/* Risk Assessment */}
                    <div className="space-y-4">
                      <h3 className="text-lg text-white">Risk Assessment</h3>
                      
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-gray-400">Risk Score:</p>
                        <p className={`text-lg ${getRiskScoreColor(recommendations.risk_assessment.risk_score)}`}>
                          {recommendations.risk_assessment.risk_score.toFixed(1)}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">Risk Factors:</p>
                        <ul className="space-y-1 text-sm text-gray-300">
                          {recommendations.risk_assessment.risk_factors.map((factor, index) => (
                            <li key={index}>• {factor}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">Risk Mitigation:</p>
                        <ul className="space-y-1 text-sm text-gray-300">
                          {recommendations.risk_assessment.risk_mitigation.map((mitigation, index) => (
                            <li key={index}>• {mitigation}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Position Sizing */}
                    <div className="space-y-4">
                      <h3 className="text-lg text-white">Position Sizing</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-400">Recommended Size</p>
                          <p className="text-lg text-white">{recommendations.position_sizing.recommended_size} shares</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-400">Maximum Size</p>
                          <p className="text-lg text-white">{recommendations.position_sizing.max_size} shares</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-400">Kelly Criterion</p>
                          <p className="text-lg text-white">{(recommendations.position_sizing.kelly_criterion * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex justify-between text-xs text-gray-400 pt-4 border-t border-gray-700">
                      <span>Timeframe: {recommendations.timeframe}</span>
                      <span>Updated: {new Date(recommendations.last_updated).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}