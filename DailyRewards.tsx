import { Gift, Calendar, Check, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import { useState, useEffect } from 'react';

interface DailyReward {
  day: number;
  reward: {
    type: 'xp' | 'bonus';
    amount: number;
  };
  claimed: boolean;
}

export function DailyRewards() {
  const [rewards, setRewards] = useState<DailyReward[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [canClaim, setCanClaim] = useState(false);
  const [showClaimed, setShowClaimed] = useState(false);

  useEffect(() => {
    loadDailyRewards();
  }, []);

  const loadDailyRewards = () => {
    const lastClaimKey = 'lastDailyClaim';
    const streakKey = 'dailyStreak';
    
    const lastClaim = localStorage.getItem(lastClaimKey);
    const streak = parseInt(localStorage.getItem(streakKey) || '0');

    const today = new Date().toDateString();
    const canClaimToday = lastClaim !== today;

    setCanClaim(canClaimToday);
    setCurrentDay(streak + 1);

    // Generate 7 days of rewards
    const rewardList: DailyReward[] = [];
    for (let i = 1; i <= 7; i++) {
      rewardList.push({
        day: i,
        reward: {
          type: i === 7 ? 'bonus' : 'xp',
          amount: i === 7 ? 1000 : i * 50
        },
        claimed: i <= streak
      });
    }

    setRewards(rewardList);
  };

  const claimReward = () => {
    const lastClaimKey = 'lastDailyClaim';
    const streakKey = 'dailyStreak';
    
    const today = new Date().toDateString();
    const streak = parseInt(localStorage.getItem(streakKey) || '0');
    
    const newStreak = (streak + 1) % 7;
    if (newStreak === 0) {
      // Cycle back to day 1 after day 7
      localStorage.setItem(streakKey, '0');
    } else {
      localStorage.setItem(streakKey, newStreak.toString());
    }
    
    localStorage.setItem(lastClaimKey, today);

    setShowClaimed(true);
    setTimeout(() => {
      setShowClaimed(false);
      loadDailyRewards();
    }, 2000);
  };

  return (
    <div className="p-4 pb-24">
      <div className="mb-6 text-center">
        <Gift className="w-12 h-12 mx-auto mb-3 text-purple-500" />
        <h2 className="text-2xl font-bold mb-2">Daily Rewards</h2>
        <p className="text-gray-600">Log in every day for amazing rewards!</p>
      </div>

      {showClaimed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1 }}
            >
              <Gift className="w-20 h-20 mx-auto mb-4 text-purple-500" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2">Reward Claimed!</h3>
            <p className="text-gray-600">
              You've received your daily reward. Come back tomorrow for more!
            </p>
          </div>
        </motion.div>
      )}

      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm opacity-90">Current Streak</div>
            <div className="text-3xl font-bold">Day {currentDay}</div>
          </div>
          <Calendar className="w-12 h-12 opacity-80" />
        </div>
        
        {canClaim && (
          <Button
            onClick={claimReward}
            className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold"
          >
            <Gift className="w-4 h-4 mr-2" />
            Claim Today's Reward
          </Button>
        )}

        {!canClaim && (
          <div className="text-center py-3 bg-white/20 rounded-xl">
            <Check className="w-6 h-6 mx-auto mb-1" />
            <p className="text-sm">Come back tomorrow!</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {rewards.map((reward, index) => {
          const isToday = reward.day === currentDay && canClaim;
          const isLocked = reward.day > currentDay;
          const isClaimed = reward.claimed;

          return (
            <motion.div
              key={reward.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                bg-white rounded-2xl shadow-md p-4 flex items-center gap-4
                ${isToday ? 'ring-2 ring-purple-500 shadow-lg' : ''}
                ${isLocked ? 'opacity-50' : ''}
              `}
            >
              <div
                className={`
                  w-16 h-16 rounded-xl flex items-center justify-center
                  ${isClaimed ? 'bg-green-100' : isToday ? 'bg-purple-100' : 'bg-gray-100'}
                `}
              >
                {isClaimed ? (
                  <Check className="w-8 h-8 text-green-600" />
                ) : isLocked ? (
                  <Lock className="w-8 h-8 text-gray-400" />
                ) : (
                  <Gift className={`w-8 h-8 ${isToday ? 'text-purple-600' : 'text-gray-600'}`} />
                )}
              </div>

              <div className="flex-1">
                <div className="font-semibold">Day {reward.day}</div>
                <div className={`text-sm ${isToday ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}>
                  {reward.reward.type === 'bonus' ? (
                    <>🎁 Bonus Reward: {reward.reward.amount} XP</>
                  ) : (
                    <>{reward.reward.amount} XP</>
                  )}
                </div>
              </div>

              {isToday && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full"
                >
                  TODAY
                </motion.div>
              )}

              {isClaimed && (
                <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  CLAIMED
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-amber-900 mb-1">Pro Tip!</div>
            <p className="text-sm text-amber-800">
              Log in every day to maintain your streak. Day 7 gives you a special bonus reward!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
