import { useState, useEffect, useRef } from 'react';
import { storage } from '@/app/utils/storage';
import { DAILY_QUESTS, WEEKLY_QUESTS, PREMIUM_QUESTS, BATTLE_PASS_TIERS, Quest, BattlePassTier } from '@/app/data/battlePassData';
import { Button } from '@/app/components/ui/button';
import { Trophy, Gift, CheckCircle2, Lock, Sparkles, Target, Calendar, X, Crown, ChevronLeft, ChevronRight, Leaf, Trees } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/app/components/ui/badge';
import { toast } from 'sonner';

interface BattlePassProps {
  onClose: () => void;
  onUpdate?: () => void;
}

export function BattlePass({ onClose, onUpdate }: BattlePassProps) {
  const [battlePassData, setBattlePassData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'quests' | 'rewards'>('overview');
  const [questTab, setQuestTab] = useState<'daily' | 'weekly' | 'premium'>('daily');
  const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
  const [weeklyQuests, setWeeklyQuests] = useState<Quest[]>([]);
  const [premiumQuests, setPremiumQuests] = useState<Quest[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [coins, setCoins] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = storage.getBattlePassData();
    setBattlePassData(data);
    setIsPremium(storage.hasPremiumBattlePass());
    setCoins(storage.getCoins());

    // Initialize quests if empty
    if (!data.quests.daily || data.quests.daily.length === 0) {
      const initDaily = DAILY_QUESTS.map(q => ({ ...q, progress: 0, completed: false }));
      data.quests.daily = initDaily;
      const storageData = storage.getData();
      storageData.battlePass = data;
      storage.setData(storageData);
    }
    if (!data.quests.weekly || data.quests.weekly.length === 0) {
      const initWeekly = WEEKLY_QUESTS.map(q => ({ ...q, progress: 0, completed: false }));
      data.quests.weekly = initWeekly;
      const storageData = storage.getData();
      storageData.battlePass = data;
      storage.setData(storageData);
    }
    if (!data.quests.premium || data.quests.premium.length === 0) {
      const initPremium = PREMIUM_QUESTS.map(q => ({ ...q, progress: 0, completed: false }));
      data.quests.premium = initPremium;
      const storageData = storage.getData();
      storageData.battlePass = data;
      storage.setData(storageData);
    }

    setDailyQuests(data.quests.daily || []);
    setWeeklyQuests(data.quests.weekly || []);
    setPremiumQuests(data.quests.premium || []);
  };

  const handlePurchasePremium = () => {
    if (storage.purchasePremiumBattlePass()) {
      toast.success('🌟 Premium Battle Pass Activated!');
      loadData();
      onUpdate?.();
    } else {
      toast.error('Not enough coins! Need 200,000 coins.');
    }
  };

  const handleClaimReward = (tier: number, rewards: BattlePassTier['rewards'], isPremiumReward: boolean = false) => {
    if (storage.claimBattlePassReward(tier)) {
      // Give rewards
      rewards.forEach(reward => {
        if (reward.type === 'coins' && reward.amount) {
          storage.addCoins(reward.amount);
        } else if (reward.type === 'potion' && reward.amount && reward.potionType) {
          storage.addPotion(reward.potionType, reward.amount);
        } else if (reward.type === 'skill-roll' && reward.amount) {
          storage.addRolls(reward.amount);
        } else if (reward.type === 'special') {
          storage.addChests(1);
        }
      });

      toast.success(`🎁 Claimed ${isPremiumReward ? 'Premium ' : ''}Tier ${tier} rewards!`);
      loadData();
      onUpdate?.();
    }
  };

  const handleClaimQuest = (questId: string) => {
    const points = storage.completeQuest(questId);
    if (points > 0) {
      toast.success(`✅ Quest completed! +${points} BP`);
      loadData();
      onUpdate?.();
    }
  };

  const getCurrentTier = () => {
    if (!battlePassData) return 1;
    const points = battlePassData.points;
    
    for (let i = BATTLE_PASS_TIERS.length - 1; i >= 0; i--) {
      if (points >= BATTLE_PASS_TIERS[i].requiredPoints) {
        return BATTLE_PASS_TIERS[i].tier;
      }
    }
    return 1;
  };

  const getProgressToNextTier = () => {
    if (!battlePassData) return { current: 0, needed: 100, percent: 0 };
    const currentTier = getCurrentTier();
    const nextTier = BATTLE_PASS_TIERS.find(t => t.tier === currentTier + 1);
    
    if (!nextTier) {
      return { current: battlePassData.points, needed: battlePassData.points, percent: 100 };
    }

    const currentTierData = BATTLE_PASS_TIERS.find(t => t.tier === currentTier);
    const currentPoints = currentTierData ? currentTierData.requiredPoints : 0;
    const progress = battlePassData.points - currentPoints;
    const needed = nextTier.requiredPoints - currentPoints;
    const percent = (progress / needed) * 100;

    return { current: progress, needed, percent };
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (!battlePassData) return null;

  const currentTier = getCurrentTier();
  const progress = getProgressToNextTier();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-orange-900 via-amber-800 to-yellow-900 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Amazon Forest Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 p-6 text-white relative overflow-hidden flex-shrink-0">
          {/* Jungle Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <Trees className="absolute top-2 left-4 w-16 h-16" />
            <Leaf className="absolute bottom-2 right-8 w-12 h-12 rotate-45" />
            <Trees className="absolute top-4 right-20 w-20 h-20" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-500 p-3 rounded-full">
                  <Trophy className="w-8 h-8 text-orange-900" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold flex items-center gap-2">
                    🌳 AMAZON FOREST! 🦜
                  </h2>
                  <p className="text-sm opacity-90 flex items-center gap-2">
                    {isPremium ? (
                      <>
                        <Crown className="w-4 h-4 text-yellow-300" />
                        <span className="text-yellow-200 font-bold">Premium Battle Pass</span>
                      </>
                    ) : (
                      <>Free Battle Pass</>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isPremium && (
                  <Button
                    onClick={handlePurchasePremium}
                    className="bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 font-bold hover:from-yellow-400 hover:to-orange-500"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Premium (200K 🪙)
                  </Button>
                )}
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Tier Progress */}
            <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border-2 border-yellow-400">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg">🏆 Tier {currentTier}</span>
                <span className="text-sm">{battlePassData.points} BP</span>
              </div>
              <div className="w-full bg-orange-950/50 rounded-full h-4 mb-2 border-2 border-yellow-500">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress.percent, 100)}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 h-full rounded-full"
                />
              </div>
              <p className="text-xs opacity-90">
                {currentTier < 15 
                  ? `${Math.floor(progress.current)}/${progress.needed} to Tier ${currentTier + 1}`
                  : '🎉 Max Tier Reached!'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-orange-800 bg-orange-900 flex-shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 font-bold transition-all ${ 
              activeTab === 'overview'
                ? 'text-white bg-orange-700 border-b-4 border-yellow-400'
                : 'text-orange-300 hover:text-white hover:bg-orange-800'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            className={`flex-1 py-3 px-4 font-bold transition-all ${ 
              activeTab === 'quests'
                ? 'text-white bg-orange-700 border-b-4 border-yellow-400'
                : 'text-orange-300 hover:text-white hover:bg-orange-800'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Rainforest Quests
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-3 px-4 font-bold transition-all ${
              activeTab === 'rewards'
                ? 'text-white bg-orange-700 border-b-4 border-yellow-400'
                : 'text-orange-300 hover:text-white hover:bg-orange-800'
            }`}
          >
            <Gift className="w-4 h-4 inline mr-2" />
            Jungle Rewards
          </button>
        </div>

        {/* Content - with fixed height */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 space-y-6"
              >
                <div className="text-xl font-bold text-white">Welcome to the Amazon Forest Battle Pass!</div>
                <p className="text-sm text-gray-300">Complete daily, weekly, and premium quests to earn Battle Points (BP) and unlock exclusive rewards.</p>
                <div className="mt-4">
                  <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-white">
                    <Calendar className="w-6 h-6 text-cyan-400" />
                    Daily Jungle Missions
                  </h3>
                  <div className="space-y-3">
                    {dailyQuests.slice(0, 3).map((quest) => (
                      <motion.div
                        key={quest.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-xl p-4 border-2 border-cyan-500/50 backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="text-4xl">{quest.icon}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-white">{quest.name}</h4>
                              <p className="text-sm text-cyan-200">{quest.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="w-full bg-cyan-950/50 rounded-full h-2.5 border border-cyan-400">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(quest.progress / quest.target) * 100}%` }}
                                    className="bg-gradient-to-r from-cyan-400 to-blue-400 h-full rounded-full"
                                  />
                                </div>
                                <span className="text-xs font-bold text-cyan-200 whitespace-nowrap">
                                  {quest.progress}/{quest.target}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-3 flex-shrink-0">
                            <div className="text-yellow-300 font-bold text-sm mb-2">
                              +{quest.reward} BP
                            </div>
                            {quest.completed ? (
                              <Badge className="bg-green-500 text-white">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Done
                              </Badge>
                            ) : quest.progress >= quest.target ? (
                              <Button
                                size="sm"
                                onClick={() => handleClaimQuest(quest.id)}
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold"
                              >
                                Claim
                              </Button>
                            ) : (
                              <Badge variant="outline" className="bg-cyan-900/30 text-cyan-200 border-cyan-400">
                                In Progress
                              </Badge>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'quests' && (
              <motion.div
                key="quests"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 space-y-6"
              >
                {/* Daily Quests */}
                <div>
                  <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-white">
                    <Calendar className="w-6 h-6 text-cyan-400" />
                    Daily Jungle Missions
                  </h3>
                  <div className="space-y-3">
                    {dailyQuests.map((quest) => (
                      <motion.div
                        key={quest.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-xl p-4 border-2 border-cyan-500/50 backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="text-4xl">{quest.icon}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-white">{quest.name}</h4>
                              <p className="text-sm text-cyan-200">{quest.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="w-full bg-cyan-950/50 rounded-full h-2.5 border border-cyan-400">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(quest.progress / quest.target) * 100}%` }}
                                    className="bg-gradient-to-r from-cyan-400 to-blue-400 h-full rounded-full"
                                  />
                                </div>
                                <span className="text-xs font-bold text-cyan-200 whitespace-nowrap">
                                  {quest.progress}/{quest.target}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-3 flex-shrink-0">
                            <div className="text-yellow-300 font-bold text-sm mb-2">
                              +{quest.reward} BP
                            </div>
                            {quest.completed ? (
                              <Badge className="bg-green-500 text-white">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Done
                              </Badge>
                            ) : quest.progress >= quest.target ? (
                              <Button
                                size="sm"
                                onClick={() => handleClaimQuest(quest.id)}
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold"
                              >
                                Claim
                              </Button>
                            ) : (
                              <Badge variant="outline" className="bg-cyan-900/30 text-cyan-200 border-cyan-400">
                                In Progress
                              </Badge>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Weekly Quests */}
                <div>
                  <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-white">
                    <Sparkles className="w-6 h-6 text-pink-400" />
                    Weekly Canopy Challenges
                  </h3>
                  <div className="space-y-3">
                    {weeklyQuests.map((quest) => (
                      <motion.div
                        key={quest.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-r from-pink-900/40 to-rose-900/40 rounded-xl p-4 border-2 border-pink-500/50 backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="text-4xl">{quest.icon}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-white">{quest.name}</h4>
                              <p className="text-sm text-pink-200">{quest.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="w-full bg-pink-950/50 rounded-full h-2.5 border border-pink-400">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(quest.progress / quest.target) * 100}%` }}
                                    className="bg-gradient-to-r from-pink-400 to-rose-400 h-full rounded-full"
                                  />
                                </div>
                                <span className="text-xs font-bold text-pink-200 whitespace-nowrap">
                                  {quest.progress}/{quest.target}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-3 flex-shrink-0">
                            <div className="text-yellow-300 font-bold text-sm mb-2">
                              +{quest.reward} BP
                            </div>
                            {quest.completed ? (
                              <Badge className="bg-green-500 text-white">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Done
                              </Badge>
                            ) : quest.progress >= quest.target ? (
                              <Button
                                size="sm"
                                onClick={() => handleClaimQuest(quest.id)}
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold"
                              >
                                Claim
                              </Button>
                            ) : (
                              <Badge variant="outline" className="bg-pink-900/30 text-pink-200 border-pink-400">
                                In Progress
                              </Badge>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Premium Quests */}
                {isPremium && (
                  <div>
                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-white">
                      <Crown className="w-6 h-6 text-yellow-300" />
                      Premium Apex Missions
                    </h3>
                    <div className="space-y-3">
                      {premiumQuests.map((quest) => (
                        <motion.div
                          key={quest.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-gradient-to-r from-yellow-900/40 to-amber-900/40 rounded-xl p-4 border-2 border-yellow-400 backdrop-blur-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="text-4xl">{quest.icon}</div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-white flex items-center gap-2">
                                  {quest.name}
                                  <Crown className="w-4 h-4 text-yellow-300" />
                                </h4>
                                <p className="text-sm text-yellow-200">{quest.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="w-full bg-yellow-950/50 rounded-full h-2.5 border border-yellow-400">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(quest.progress / quest.target) * 100}%` }}
                                      className="bg-gradient-to-r from-yellow-300 to-orange-400 h-full rounded-full"
                                    />
                                  </div>
                                  <span className="text-xs font-bold text-yellow-200 whitespace-nowrap">
                                    {quest.progress}/{quest.target}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-3 flex-shrink-0">
                              <div className="text-yellow-300 font-bold text-sm mb-2">
                                +{quest.reward} BP
                              </div>
                              {quest.completed ? (
                                <Badge className="bg-green-500 text-white">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Done
                                </Badge>
                              ) : quest.progress >= quest.target ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleClaimQuest(quest.id)}
                                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold"
                                >
                                  Claim
                                </Button>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-900/30 text-yellow-200 border-yellow-400">
                                  In Progress
                                </Badge>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'rewards' && (
              <motion.div
                key="rewards"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="relative h-full"
              >
                {/* Scroll Arrows */}
                <button
                  onClick={scrollLeft}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-orange-700 hover:bg-orange-600 text-white p-3 rounded-full shadow-xl"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={scrollRight}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-orange-700 hover:bg-orange-600 text-white p-3 rounded-full shadow-xl"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Sideways Scrolling Tiers - Brawl Stars Style */}
                <div
                  ref={scrollContainerRef}
                  className="h-full overflow-x-auto overflow-y-hidden flex gap-6 items-start px-12 py-8"
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                  }}
                >
                  <style>{`
                    div[style*="scrollbarWidth"]::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  {BATTLE_PASS_TIERS.map((tier) => {
                    const isUnlocked = battlePassData.points >= tier.requiredPoints;
                    const isClaimed = battlePassData.claimedTiers.includes(tier.tier);
                    const isPremiumClaimed = battlePassData.claimedPremiumTiers?.includes(tier.tier);

                    return (
                      <motion.div
                        key={tier.tier}
                        whileHover={{ scale: 1.05 }}
                        className="flex-shrink-0 w-[320px] relative"
                      >
                        {/* Tier Number */}
                        <div className={`text-center font-bold text-2xl mb-3 ${
                          isUnlocked ? 'text-yellow-300 drop-shadow-[0_2px_8px_rgba(253,224,71,0.5)]' : 'text-gray-500'
                        }`}>
                          TIER {tier.tier}
                        </div>

                        {/* Connected Reward Container */}
                        <div className="relative">
                          {/* Connecting Line */}
                          {tier.premiumRewards && (
                            <div className={`absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 z-0 ${
                              isUnlocked && isPremium 
                                ? 'bg-gradient-to-b from-yellow-400 via-orange-400 to-orange-500' 
                                : 'bg-gray-600'
                            }`} />
                          )}

                          {/* Premium Rewards (Top) */}
                          {tier.premiumRewards && (
                            <div className="relative z-10 mb-4">
                              <div className={`rounded-2xl p-4 border-3 shadow-xl backdrop-blur-sm ${
                                isUnlocked && isPremium
                                  ? 'bg-gradient-to-br from-yellow-700/90 to-amber-700/90 border-yellow-400 shadow-yellow-500/50'
                                  : 'bg-gray-900/80 border-gray-600'
                              }`}>
                                {/* Premium Badge */}
                                <div className="flex items-center justify-center mb-3">
                                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
                                    isUnlocked && isPremium
                                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900'
                                      : 'bg-gray-700 text-gray-400'
                                  }`}>
                                    <Crown className="w-4 h-4" />
                                    <span>PREMIUM</span>
                                  </div>
                                </div>

                                {/* Rewards List */}
                                <div className="space-y-2 mb-4 min-h-[80px]">
                                  {tier.premiumRewards.map((reward, idx) => (
                                    <div key={idx} className={`text-sm font-semibold flex items-center gap-2 ${
                                      isUnlocked && isPremium ? 'text-yellow-100' : 'text-gray-500'
                                    }`}>
                                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                      {reward.description}
                                    </div>
                                  ))}
                                </div>

                                {/* Premium Claim Button */}
                                <div>
                                  {!isPremium ? (
                                    <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gray-800/80 text-gray-400 border-2 border-gray-600 text-sm font-bold">
                                      <Lock className="w-4 h-4" />
                                      <span>Premium Only</span>
                                    </div>
                                  ) : isPremiumClaimed ? (
                                    <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold shadow-lg">
                                      <CheckCircle2 className="w-4 h-4" />
                                      <span>Claimed</span>
                                    </div>
                                  ) : isUnlocked ? (
                                    <Button
                                      onClick={() => handleClaimReward(tier.tier, tier.premiumRewards || [], true)}
                                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                                      size="sm"
                                    >
                                      <Gift className="w-4 h-4 mr-2" />
                                      Claim Premium
                                    </Button>
                                  ) : (
                                    <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gray-800/80 text-gray-400 border-2 border-gray-600 text-sm font-bold">
                                      <Lock className="w-4 h-4" />
                                      <span>Locked</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Free Rewards (Bottom) */}
                          <div className="relative z-10">
                            <div className={`rounded-2xl p-4 border-3 shadow-xl backdrop-blur-sm ${
                              isUnlocked
                                ? 'bg-gradient-to-br from-orange-600/90 to-amber-600/90 border-orange-400 shadow-orange-500/50'
                                : 'bg-gray-900/80 border-gray-600'
                            }`}>
                              {/* Free Badge */}
                              <div className="flex items-center justify-between mb-3">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
                                  isUnlocked
                                    ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-white'
                                    : 'bg-gray-700 text-gray-400'
                                }`}>
                                  <Trophy className="w-4 h-4" />
                                  <span>FREE</span>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                  isUnlocked ? 'bg-black/30 text-orange-200' : 'bg-gray-800 text-gray-500'
                                }`}>
                                  {tier.requiredPoints} BP
                                </span>
                              </div>

                              {/* Rewards List */}
                              <div className="space-y-2 mb-4 min-h-[80px]">
                                {tier.rewards.map((reward, idx) => (
                                  <div key={idx} className={`text-sm font-semibold flex items-center gap-2 ${
                                    isUnlocked ? 'text-orange-100' : 'text-gray-500'
                                  }`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {reward.description}
                                  </div>
                                ))}
                              </div>

                              {/* Free Claim Button */}
                              <div>
                                {isClaimed ? (
                                  <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold shadow-lg">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Claimed</span>
                                  </div>
                                ) : isUnlocked ? (
                                  <Button
                                    onClick={() => handleClaimReward(tier.tier, tier.rewards)}
                                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                                    size="sm"
                                  >
                                    <Gift className="w-4 h-4 mr-2" />
                                    Claim Free
                                  </Button>
                                ) : (
                                  <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gray-800/80 text-gray-400 border-2 border-gray-600 text-sm font-bold">
                                    <Lock className="w-4 h-4" />
                                    <span>Locked</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}