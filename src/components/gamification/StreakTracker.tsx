import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Flame, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';

interface DayData {
  date: string;
  traded: boolean;
  profitable: boolean;
}

interface Milestone {
  days: number;
  reward_xp: number;
  reached: boolean;
}

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
  totalTradingDays: number;
  profitableDays: number;
  calendar: DayData[];
  milestones: Milestone[];
}

export function StreakTracker({
  currentStreak,
  longestStreak,
  totalTradingDays,
  profitableDays,
  calendar,
  milestones
}: StreakTrackerProps) {
  
  const profitableRate = totalTradingDays > 0 ? (profitableDays / totalTradingDays) * 100 : 0;

  const getDayColor = (day: DayData) => {
    if (!day.traded) return 'bg-gray-800 border-gray-700';
    if (day.profitable) return 'bg-green-600 border-green-500';
    return 'bg-red-600 border-red-500';
  };

  const getDayTooltip = (day: DayData) => {
    if (!day.traded) return 'No trade';
    if (day.profitable) return 'Profitable';
    return 'Loss';
  };

  const getEncouragement = () => {
    if (currentStreak === 0) return 'Start your streak today!';
    if (currentStreak < 3) return 'Keep it going!';
    if (currentStreak < 7) return 'Great momentum!';
    if (currentStreak < 14) return 'You\'re on fire! 🔥';
    return 'Legendary streak! 🏆';
  };

  const nextMilestone = milestones.find(m => !m.reached);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Flame className={`h-6 w-6 ${currentStreak > 0 ? 'text-orange-400 animate-pulse' : 'text-gray-400'}`} />
          Trading Streak
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Streak */}
        <div className="text-center p-6 bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-700/30 rounded-lg">
          <Flame className={`h-12 w-12 mx-auto mb-3 ${currentStreak > 0 ? 'text-orange-400' : 'text-gray-500'}`} />
          <div className="text-5xl font-bold text-white mb-2">
            {currentStreak}
          </div>
          <div className="text-lg text-gray-300 mb-1">
            {currentStreak === 1 ? 'Day' : 'Days'} Current Streak
          </div>
          <div className="text-sm text-orange-300 font-medium">
            {getEncouragement()}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {longestStreak}
            </div>
            <div className="text-xs text-gray-400">Longest Streak</div>
          </div>

          <div className="p-3 bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {totalTradingDays}
            </div>
            <div className="text-xs text-gray-400">Trading Days</div>
          </div>

          <div className="p-3 bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {profitableRate.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-400">Profitable</div>
          </div>
        </div>

        {/* Calendar Heatmap */}
        <div className="space-y-3">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Calendar className="h-5 w-5 text-sky-400" />
            Last 30 Days
          </h3>

          <div className="grid grid-cols-10 gap-1">
            {calendar.slice(-30).map((day, index) => (
              <div
                key={index}
                className={`aspect-square rounded ${getDayColor(day)} border transition-all hover:scale-110 cursor-pointer`}
                title={`${day.date}: ${getDayTooltip(day)}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span>Profitable</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-600 rounded"></div>
              <span>Loss</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-800 border border-gray-700 rounded"></div>
              <span>No Trade</span>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-3">
          <h3 className="text-white font-medium flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-sky-400" />
            Streak Milestones
          </h3>

          <div className="space-y-2">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  milestone.reached
                    ? 'bg-green-900/20 border-green-700/30'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {milestone.reached ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-600"></div>
                    )}
                    
                    <div>
                      <div className={`font-medium ${
                        milestone.reached ? 'text-white' : 'text-gray-400'
                      }`}>
                        {milestone.days}-Day Streak
                      </div>
                      {!milestone.reached && nextMilestone?.days === milestone.days && (
                        <div className="text-xs text-sky-400">
                          {milestone.days - currentStreak} days to go
                        </div>
                      )}
                    </div>
                  </div>

                  <Badge 
                    variant={milestone.reached ? 'default' : 'outline'}
                    className={milestone.reached ? 'bg-green-600' : 'text-gray-500 border-gray-600'}
                  >
                    +{milestone.reward_xp} XP
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivation */}
        <div className="p-3 bg-orange-900/20 border border-orange-700/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Flame className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-orange-200">
              {currentStreak > 0 ? (
                <>
                  <strong>Keep your streak alive!</strong> Trade today to maintain your {currentStreak}-day streak 
                  and earn bonus XP.
                </>
              ) : (
                <>
                  <strong>Start a new streak!</strong> Execute a trade today to begin building your 
                  trading consistency and earn milestone rewards.
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
