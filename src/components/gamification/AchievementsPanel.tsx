import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Trophy, Lock, Star, TrendingUp } from 'lucide-react';

interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  reward_xp: number;
  badge: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  unlocked: boolean;
  unlocked_at?: string;
  progress?: number;
  progress_max?: number;
}

interface UserStats {
  level: number;
  title: string;
  current_xp: number;
  next_level_xp: number;
  total_achievements: number;
  unlocked_achievements: number;
  leaderboard_rank?: number;
  total_users?: number;
}

interface AchievementsPanelProps {
  achievements: Achievement[];
  userStats: UserStats;
}

export function AchievementsPanel({ achievements, userStats }: AchievementsPanelProps) {
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'diamond': return 'bg-cyan-500 text-white';
      case 'platinum': return 'bg-purple-500 text-white';
      case 'gold': return 'bg-yellow-500 text-white';
      case 'silver': return 'bg-gray-400 text-white';
      case 'bronze': return 'bg-orange-700 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const xpProgress = (userStats.current_xp / userStats.next_level_xp) * 100;

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-400" />
            Achievements & Progress
          </CardTitle>
          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
            Level {userStats.level}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* User Level Progress */}
        <div className="p-4 bg-gradient-to-r from-purple-900/30 to-sky-900/30 border border-purple-700/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-bold text-white">Level {userStats.level}</div>
              <div className="text-sm text-gray-400">{userStats.title}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                {userStats.current_xp.toLocaleString()} XP
              </div>
              <div className="text-xs text-gray-400">
                / {userStats.next_level_xp.toLocaleString()} XP
              </div>
            </div>
          </div>
          
          <Progress value={xpProgress} className="h-3" />
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
            <span>{xpProgress.toFixed(1)}% to Level {userStats.level + 1}</span>
            <span>{(userStats.next_level_xp - userStats.current_xp).toLocaleString()} XP needed</span>
          </div>

          {userStats.leaderboard_rank && userStats.total_users && (
            <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
              <span className="text-sm text-gray-400">Leaderboard Rank</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-sky-400" />
                <span className="text-white font-medium">
                  #{userStats.leaderboard_rank} of {userStats.total_users.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-800 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">Unlocked</div>
            <div className="text-2xl font-bold text-white">
              {userStats.unlocked_achievements}
            </div>
          </div>
          <div className="p-3 bg-gray-800 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">Total</div>
            <div className="text-2xl font-bold text-white">
              {userStats.total_achievements}
            </div>
          </div>
        </div>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-white font-medium flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Unlocked ({unlockedAchievements.length})
            </h3>

            <div className="space-y-2">
              {unlockedAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className="p-4 bg-gradient-to-r from-yellow-900/20 to-green-900/20 border border-yellow-700/30 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl flex-shrink-0">{achievement.icon}</span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-medium">{achievement.title}</h4>
                        <Badge className={getBadgeColor(achievement.badge)}>
                          {achievement.badge}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-2">
                        {achievement.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-green-400 font-medium">
                          +{achievement.reward_xp} XP
                        </span>
                        {achievement.unlocked_at && (
                          <span className="text-gray-400">
                            Unlocked {new Date(achievement.unlocked_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-white font-medium flex items-center gap-2">
              <Lock className="h-5 w-5 text-gray-400" />
              Locked ({lockedAchievements.length})
            </h3>

            <div className="space-y-2">
              {lockedAchievements.slice(0, 5).map(achievement => (
                <div
                  key={achievement.id}
                  className="p-4 bg-gray-800 border border-gray-700 rounded-lg opacity-75"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <span className="text-3xl grayscale opacity-50">{achievement.icon}</span>
                      <Lock className="h-4 w-4 text-gray-500 absolute -top-1 -right-1" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-gray-300 font-medium">{achievement.title}</h4>
                        <Badge variant="outline" className="text-gray-500 border-gray-600">
                          {achievement.badge}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-2">
                        {achievement.description}
                      </p>
                      
                      {achievement.progress !== undefined && achievement.progress_max !== undefined && (
                        <div className="space-y-1">
                          <Progress 
                            value={(achievement.progress / achievement.progress_max) * 100} 
                            className="h-2"
                          />
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              {achievement.progress} / {achievement.progress_max}
                            </span>
                            <span>+{achievement.reward_xp} XP</span>
                          </div>
                        </div>
                      )}
                      
                      {achievement.progress === undefined && (
                        <div className="text-xs text-gray-500">
                          Reward: +{achievement.reward_xp} XP
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {lockedAchievements.length > 5 && (
              <div className="text-center text-sm text-gray-400">
                +{lockedAchievements.length - 5} more achievements to unlock
              </div>
            )}
          </div>
        )}

        {/* Motivation */}
        <div className="p-3 bg-purple-900/20 border border-purple-700/30 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-lg">🎯</span>
            <p className="text-sm text-purple-200">
              Complete achievements to earn XP and level up! Higher levels unlock exclusive 
              features and give you access to advanced trading tools.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
