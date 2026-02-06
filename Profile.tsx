import { useState } from 'react';
import { storage, UserProfile } from '@/app/utils/storage';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Trophy, Award, TrendingUp, Target, Edit2, Check, X, Sparkles, ChevronDown, ChevronUp, Ticket, Crown, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BoostManager } from '@/app/components/BoostManager';
import { SkillRoller } from '@/app/components/SkillRoller';
import { SaveLoadManager } from '@/app/components/SaveLoadManager';
import { toast } from 'sonner';

interface ProfileProps {
  profile: UserProfile;
  onUpdate: () => void;
}

const AVATAR_EMOJIS = [
  '🐛', '🦋', '🐝', '🐞', '🦗', '🦟', '🪲', '🪳',
  '🕷️', '🦂', '🐜', '🪰', '🦅', '🦉', '🐺', '🦊'
];

export function Profile({ profile, onUpdate }: ProfileProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [newUsername, setNewUsername] = useState(profile.username);
  const [showBoosts, setShowBoosts] = useState(false);
  const [showSkillRoller, setShowSkillRoller] = useState(false);
  const [showRarity, setShowRarity] = useState(false);
  const stats = storage.getStats();

  const handleSaveName = () => {
    if (newUsername.length >= 3) {
      storage.updateUsername(newUsername);
      setIsEditingName(false);
      onUpdate();
    } else {
      toast.error('Username must be at least 3 characters long');
    }
  };

  const handleSelectAvatar = (emoji: string) => {
    storage.updateAvatar(emoji);
    setIsEditingAvatar(false);
    onUpdate();
  };

  const getRankTitle = (rank: number): string => {
    if (rank === 1) return 'Novice Hunter';
    if (rank === 2) return 'Bug Seeker';
    if (rank === 3) return 'Insect Tracker';
    if (rank === 4) return 'Bug Collector';
    if (rank === 5) return 'Species Expert';
    if (rank === 6) return 'Master Tracker';
    if (rank === 7) return 'Elite Hunter';
    if (rank === 8) return 'Legendary Seeker';
    if (rank === 9) return 'Grand Master';
    return 'Ultimate Champion';
  };

  const getNextRankProgress = (): { current: number; next: number; percentage: number } => {
    const thresholds = [0, 5, 10, 20, 35, 50, 75, 100, 150, 200];
    const currentThreshold = thresholds[profile.rank - 1] || 0;
    const nextThreshold = thresholds[profile.rank] || 250;
    const progress = ((stats.totalCaptures - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

    return {
      current: stats.totalCaptures,
      next: nextThreshold,
      percentage: Math.min(100, Math.max(0, progress))
    };
  };

  const rankProgress = getNextRankProgress();

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Profile Header - Compact */}
      <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl p-4 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <div
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl cursor-pointer"
              onClick={() => setIsEditingAvatar(true)}
            >
              {profile.avatarEmoji}
            </div>
            <button
              onClick={() => setIsEditingAvatar(true)}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center border-2 border-white"
            >
              <Edit2 className="w-2.5 h-2.5" />
            </button>
          </div>

          <div className="flex-1">
            {isEditingName ? (
              <div className="flex gap-1">
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50 h-8 text-sm"
                  placeholder="Username (min 3 chars)"
                  maxLength={20}
                />
                <Button onClick={handleSaveName} size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/20">
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    setNewUsername(profile.username);
                    setIsEditingName(false);
                  }}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <h2 className="font-bold text-lg">{profile.username}</h2>
                {storage.getPROStatus() && (
                  <div className="inline-block ml-1">
                    <div className="bg-gradient-to-r from-yellow-400 via-white to-yellow-400 rounded px-2 py-0.5 shadow">
                      <span className="text-xs font-black bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent" style={{
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        letterSpacing: '0.05em'
                      }}>
                        PRO
                      </span>
                    </div>
                  </div>
                )}
                <Button onClick={() => setIsEditingName(true)} size="icon" variant="ghost" className="w-6 h-6 hover:bg-white/20">
                  <Edit2 className="w-2.5 h-2.5" />
                </Button>
              </div>
            )}
            <p className="text-xs opacity-90">{getRankTitle(profile.rank)}</p>
          </div>
        </div>

        {/* Rank Progress - Compact */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span className="text-xs font-semibold">Rank {profile.rank}</span>
            </div>
            <span className="text-xs">{rankProgress.current} / {rankProgress.next}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-full rounded-full transition-all" style={{ width: `${rankProgress.percentage}%` }} />
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {isEditingAvatar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsEditingAvatar(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-4 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold mb-3">Choose Avatar</h3>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {AVATAR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleSelectAvatar(emoji)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-3xl ${
                      profile.avatarEmoji === emoji
                        ? 'bg-purple-100 ring-2 ring-purple-500'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <Button onClick={() => setIsEditingAvatar(false)} variant="outline" className="w-full" size="sm">
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats - Compact Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-xl p-3 shadow text-center">
          <Trophy className="w-5 h-5 mx-auto mb-1 text-blue-600" />
          <div className="text-xl font-bold">{stats.totalCaptures}</div>
          <div className="text-xs text-gray-600">Captures</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow text-center">
          <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-600" />
          <div className="text-xl font-bold">{stats.uniqueSpecies}</div>
          <div className="text-xs text-gray-600">Species</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow text-center">
          <Target className="w-5 h-5 mx-auto mb-1 text-purple-600" />
          <div className="text-xl font-bold">{stats.winRate}%</div>
          <div className="text-xs text-gray-600">Win Rate</div>
        </div>
      </div>

      {/* Rarity Collection - Collapsible */}
      <div className="bg-white rounded-xl p-3 shadow">
        <button
          onClick={() => setShowRarity(!showRarity)}
          className="w-full flex items-center justify-between font-bold text-sm"
        >
          <span>Collection by Rarity</span>
          {showRarity ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showRarity && (
          <div className="space-y-2 mt-3">
            {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as const).map((rarity) => {
              const count = stats.rarityCount[rarity] || 0;
              const color =
                rarity === 'common' ? '#94a3b8' :
                rarity === 'uncommon' ? '#22c55e' :
                rarity === 'rare' ? '#3b82f6' :
                rarity === 'epic' ? '#a855f7' : '#f59e0b';

              return (
                <div key={rarity}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium capitalize" style={{ color }}>{rarity}</span>
                    <span className="text-xs font-bold">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (count / Math.max(1, stats.totalCaptures)) * 100)}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Skill Roller - Inline */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-3 text-white shadow">
        <button
          onClick={() => setShowSkillRoller(!showSkillRoller)}
          className="w-full flex items-center justify-between font-bold text-sm mb-2"
        >
          <span className="flex items-center gap-1.5">
            <Ticket className="w-4 h-4" />
            Skill Roller ({storage.getRolls()} rolls)
          </span>
          {showSkillRoller ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showSkillRoller && (
          <div className="pt-2 border-t border-white/20">
            <SkillRoller onUpdate={onUpdate} />
          </div>
        )}
      </div>

      {/* PRO Subscription */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-xl p-4 text-white shadow-xl border-2 border-indigo-500/30">
        {storage.getPROStatus() ? (
          <div className="text-center space-y-2">
            <div className="inline-block">
              <div className="relative">
                {/* PRO Logo - Discord Nitro Style */}
                <div className="bg-white rounded-lg px-8 py-3 shadow-2xl relative overflow-hidden">
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-10"></div>
                  <div className="relative">
                    <span className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent" style={{
                      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      letterSpacing: '-0.02em',
                      fontWeight: '900'
                    }}>
                      PRO
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm font-semibold">🎉 You're a PRO member!</p>
            <p className="text-xs opacity-90">Show it off on your profile!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-center">
              {/* PRO Logo - Discord Nitro Style (preview) */}
              <div className="inline-block mb-2">
                <div className="bg-white rounded-lg px-8 py-3 shadow-2xl relative overflow-hidden">
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-10"></div>
                  <div className="relative">
                    <span className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent" style={{
                      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      letterSpacing: '-0.02em',
                      fontWeight: '900'
                    }}>
                      PRO
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-1">Upgrade to PRO</h3>
              <p className="text-xs opacity-90 mb-3">Exclusive PRO badge for your profile!</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">💎 PRO Benefits:</span>
              </div>
              <ul className="text-xs space-y-1 opacity-90">
                <li>✨ Exclusive PRO badge</li>
                <li>👑 Show your status</li>
                <li>💫 Stand out from the crowd</li>
              </ul>
            </div>
            <Button
              onClick={() => {
                if (storage.purchasePRO()) {
                  toast.success('🎉 Welcome to PRO! Your exclusive badge is ready!');
                  onUpdate();
                } else {
                  toast.error('Not enough coins! Need 1.5M coins.');
                }
              }}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 font-bold hover:from-yellow-500 hover:to-yellow-700"
            >
              <Crown className="w-4 h-4 mr-2" />
              Buy PRO (1.5M 🪙)
            </Button>
          </div>
        )}
      </div>

      {/* Boosts - Inline */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3 text-white shadow">
        <button
          onClick={() => setShowBoosts(!showBoosts)}
          className="w-full flex items-center justify-between font-bold text-sm mb-2"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Boosts & Promo Codes
          </span>
          {showBoosts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showBoosts && (
          <div className="pt-2 border-t border-white/20">
            <BoostManager onUpdate={onUpdate} />
          </div>
        )}
      </div>

      {/* Save/Load Manager */}
      <div className="bg-white rounded-xl p-3 shadow">
        <SaveLoadManager onUpdate={onUpdate} />
      </div>
    </div>
  );
}