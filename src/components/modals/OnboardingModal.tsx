import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, TrendingUp, BarChart3, DollarSign, Activity, TestTube, Brain, Shield } from 'lucide-react';

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

const onboardingSteps = [
  {
    title: 'Welcome to TX Predictive Intelligence',
    description: 'Your comprehensive trading platform with real-time market data, pattern detection, and intelligent insights.',
    icon: TrendingUp,
    features: [
      'Real-time market scanning',
      'Advanced pattern detection',
      'Paper trading simulation',
      'Risk management tools',
    ],
  },
  {
    title: 'Pattern Detection & Analysis',
    description: 'Our AI-powered system detects candlestick patterns and provides confidence scores for trading decisions.',
    icon: BarChart3,
    features: [
      'Bullish and bearish pattern recognition',
      'Confidence scoring (0-100%)',
      'Real-time pattern alerts',
      'Historical pattern performance',
    ],
  },
  {
    title: 'Paper Trading',
    description: 'Practice your trading strategies with virtual money before risking real capital.',
    icon: DollarSign,
    features: [
      'Virtual portfolio management',
      'Real market prices',
      'Performance tracking',
      'Risk-free environment',
    ],
  },
  {
    title: 'Live Scanning & Alerts',
    description: 'Monitor multiple assets simultaneously and receive instant alerts when patterns are detected.',
    icon: Activity,
    features: [
      'Multi-symbol scanning',
      'WebSocket real-time updates',
      'Customizable alert conditions',
      'Pattern-based notifications',
    ],
  },
  {
    title: 'Backtesting & Strategy',
    description: 'Test your trading strategies against historical data to validate their effectiveness.',
    icon: TestTube,
    features: [
      'Historical strategy testing',
      'Pattern-based backtesting',
      'Performance metrics',
      'Equity curve analysis',
    ],
  },
  {
    title: 'Sentiment & Signals',
    description: 'Analyze market sentiment from news and social media to make informed trading decisions.',
    icon: Brain,
    features: [
      'News sentiment analysis',
      'Social media monitoring',
      'Entry/exit signal generation',
      'Correlation analysis',
    ],
  },
  {
    title: 'Risk Management',
    description: 'Comprehensive risk controls to protect your capital and optimize position sizing.',
    icon: Shield,
    features: [
      'Pre-trade risk assessment',
      'Position sizing recommendations',
      'Stop-loss automation',
      'Portfolio risk monitoring',
    ],
  },
];

export function OnboardingModal({ open, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentStepData = onboardingSteps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="bg-gray-900 border-gray-700 text-white max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-sky-600">
              <Icon className="h-6 w-6 text-white" />
            </div>
            {currentStepData.title}
          </DialogTitle>
          <DialogDescription className="text-gray-300 leading-relaxed">
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full ${
                    index <= currentStep ? 'bg-sky-500' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
            <Badge variant="secondary" className="bg-gray-800">
              {currentStep + 1} of {onboardingSteps.length}
            </Badge>
          </div>

          {/* Content Card */}
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <h4 className="text-white">Key Features:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {currentStepData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special content for first step */}
              {currentStep === 0 && (
                <div className="mt-6 p-4 bg-sky-900/20 border border-sky-700 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-sky-400 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sky-400 text-sm">Getting Started</p>
                      <p className="text-xs text-gray-300">
                        This platform uses paper trading by default - no real money is at risk. 
                        You can explore all features safely and learn how pattern detection works.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Special content for last step */}
              {currentStep === onboardingSteps.length - 1 && (
                <div className="mt-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-green-400 text-sm">Ready to Start</p>
                      <p className="text-xs text-gray-300">
                        You're all set! Start by exploring the Dashboard to see market movers and live alerts, 
                        then try the Charts page to detect patterns on your favorite stocks.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-gray-400 hover:text-white"
              >
                Skip Tour
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="bg-sky-600 hover:bg-sky-700"
              >
                {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}