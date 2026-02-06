import { Trophy, Award, Star, Target, Zap, Crown, Heart, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { storage } from '@/app/utils/storage';
import { useEffect, useState } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'award' | 'star' | 'target' | 'zap' | 'crown' | 'heart' | 'shield';
  requirement: number;
  currentProgress: number;
  category: 'collection' | 'battle' | 'capture' | 'special';
  reward: number;
}

const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 'first_catch',
    title: 'First Catch',
    description: 'Capture your first insect',
    icon: 'star' as const,
    requirement: 1,
    category: 'capture' as const,
    reward: 50
  },
  {
    id: 'collector_10',
    title: 'Novice Collector',
    description: 'Collect 10 different insects',
    icon: 'trophy' as const,
    requirement: 10,
    category: 'collection' as const,
    reward: 100
  },
  {
    id: 'collector_25',
    title: 'Expert Collector',
    description: 'Collect 25 different insects',
    icon: 'crown' as const,
    requirement: 25,
    category: 'collection' as const,
    reward: 250
  },
  {
    id: 'first_battle',
    title: 'Battle Ready',
    description: 'Win your first battle',
    icon: 'shield' as const,
    requirement: 1,
    category: 'battle' as const,
    reward: 75
  },
  {
    id: 'warrior_10',
    title: 'Skilled Warrior',
    description: 'Win 10 battles',
    icon: 'award' as const,
    requirement: 10,
    category: 'battle' as const,
    reward: 200
  },
  {
    id: 'warrior_50',
    title: 'Battle Master',
    description: 'Win 50 battles',
    icon: 'zap' as const,
    requirement: 50,
    category: 'battle' as const,
    reward: 500
  },
  {
    id: 'rare_collector',
    title: 'Rare Hunter',
    description: 'Collect a rare, epic, or legendary insect',
    icon: 'target' as const,
    requirement: 1,
    category: 'special' as const,
    reward: 150
  },
  {
    id: 'perfect_collection',
    title: 'Perfect Collection',
    description: 'Collect all insects in the database',
    icon: 'heart' as const,
    requirement: 25,
    category: 'special' as const,
    reward: 1000
  },
  {
    id: 'world_1_complete',
    title: 'Garden Master',
    description: 'Complete all stages in Garden Meadows',
    icon: 'trophy' as const,
    requirement: 10,
    category: 'battle' as const,
    reward: 300
  },
  {
    id: 'world_2_complete',
    title: 'Forest Conqueror',
    description: 'Complete all stages in Forest Depths',
    icon: 'trophy' as const,
    requirement: 10,
    category: 'battle' as const,
    reward: 500
  },
  {
    id: 'world_3_complete',
    title: 'Desert Emperor',
    description: 'Complete all stages in Desert Dunes',
    icon: 'crown' as const,
    requirement: 10,
    category: 'battle' as const,
    reward: 700
  },
  {
    id: 'world_4_complete',
    title: 'Swamp Tyrant',
    description: 'Complete all stages in Swamp Marshes',
    icon: 'crown' as const,
    requirement: 10,
    category: 'battle' as const,
    reward: 900
  },
  {
    id: 'world_5_complete',
    title: 'Volcanic Legend',
    description: 'Complete all stages in Volcanic Peaks',
    icon: 'crown' as const,
    requirement: 10,
    category: 'battle' as const,
    reward: 1200
  }
];

export function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(0);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = () => {
    const profile = storage.getProfile();
    const collection = storage.getCollection();
    const battleHistory = storage.getBattleHistory();

    const wins = battleHistory.filter(b => b.won).length;
    const uniqueInsects = new Set(collection.map(c => c.insect.id)).size;
    const hasRareInsect = collection.some(c => ['rare', 'epic', 'legendary'].includes(c.insect.rarity));

    // Get world progress
    const worldProgressData = localStorage.getItem('all_world_progress');
    const worldProgress = worldProgressData ? JSON.parse(worldProgressData) : {};

    const achievementsWithProgress = ACHIEVEMENT_DEFINITIONS.map(def => {
      let currentProgress = 0;

      switch (def.id) {
        case 'first_catch':
          currentProgress = collection.length > 0 ? 1 : 0;
          break;
        case 'collector_10':
          currentProgress = uniqueInsects;
          break;
        case 'collector_25':
          currentProgress = uniqueInsects;
          break;
        case 'first_battle':
          currentProgress = wins > 0 ? 1 : 0;
          break;
        case 'warrior_10':
          currentProgress = wins;
          break;
        case 'warrior_50':
          currentProgress = wins;
          break;
        case 'rare_collector':
          currentProgress = hasRareInsect ? 1 : 0;
          break;
        case 'perfect_collection':
          currentProgress = uniqueInsects;
          break;
        case 'world_1_complete':
          currentProgress = (worldProgress[1] || []).length;
          break;
        case 'world_2_complete':
          currentProgress = (worldProgress[2] || []).length;
          break;
        case 'world_3_complete':
          currentProgress = (worldProgress[3] || []).length;
          break;
        case 'world_4_complete':
          currentProgress = (worldProgress[4] || []).length;
          break;
        case 'world_5_complete':
          currentProgress = (worldProgress[5] || []).length;
          break;
      }

      return {
        ...def,
        currentProgress
      };
    });

    const unlocked = achievementsWithProgress.filter(a => a.currentProgress >= a.requirement).length;
    setUnlockedCount(unlocked);
    setAchievements(achievementsWithProgress);
  };

  const getIcon = (iconName: Achievement['icon']) => {
    const iconProps = { className: 'w-6 h-6' };
    switch (iconName) {
      case 'trophy': return <Trophy {...iconProps} />;
      case 'award': return <Award {...iconProps} />;
      case 'star': return <Star {...iconProps} />;
      case 'target': return <Target {...iconProps} />;
      case 'zap': return <Zap {...iconProps} />;
      case 'crown': return <Crown {...iconProps} />;
      case 'heart': return <Heart {...iconProps} />;
      case 'shield': return <Shield {...iconProps} />;
    }
  };

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'collection': return 'from-blue-500 to-cyan-500';
      case 'battle': return 'from-red-500 to-orange-500';
      case 'capture': return 'from-green-500 to-emerald-500';
      case 'special': return 'from-purple-500 to-pink-500';
    }
  };

  return (
    <div className="p-4 pb-24">
      <div className="mb-6 text-center">
        <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
        <h2 className="text-2xl font-bold mb-2">Achievements</h2>
        <p className="text-gray-600">
          {unlockedCount} of {achievements.length} unlocked
        </p>
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
          <div
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {achievements.map((achievement, index) => {
          const isUnlocked = achievement.currentProgress >= achievement.requirement;
          const progress = Math.min(100, (achievement.currentProgress / achievement.requirement) * 100);

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl shadow-md overflow-hidden ${isUnlocked ? 'ring-2 ring-yellow-400' : ''}`}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${getCategoryColor(achievement.category)} ${!isUnlocked ? 'opacity-40' : ''}`}
                  >
                    <div className="text-white">
                      {getIcon(achievement.icon)}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className={`font-semibold ${!isUnlocked ? 'text-gray-500' : ''}`}>
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                      {isUnlocked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 10 }}
                          className="ml-2"
                        >
                          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                            <Trophy className="w-4 h-4 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={isUnlocked ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                          {achievement.currentProgress} / {achievement.requirement}
                        </span>
                        {isUnlocked && (
                          <span className="text-yellow-600 font-semibold">
                            +{achievement.reward} XP
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <motion.div
                          className={`h-1.5 rounded-full ${isUnlocked ? 'bg-green-500' : 'bg-gray-400'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}