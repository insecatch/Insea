import { Clock, Sparkles, Bug, Zap, Gift, Trophy } from 'lucide-react';

interface Update {
  version: string;
  date: string;
  changes: { icon: 'feature' | 'fix' | 'balance' | 'system'; text: string }[];
}

const UPDATES: Update[] = [
  {
    version: '2.4.0',
    date: 'Feb 6, 2026',
    changes: [
      { icon: 'feature', text: 'All insects now based on real-life species with accurate scientific names' },
      { icon: 'feature', text: 'Goliath Beetle added as new MYTHIC insect - among the largest on Earth!' },
      { icon: 'feature', text: 'Chan\'s Megastick added as EXOTIC insect - longest insect in the world!' },
      { icon: 'system', text: 'Updated boss insects with real species (Hercules Beetle, Titan Beetle, etc.)' },
      { icon: 'balance', text: 'Improved accessibility and mobile touch optimization' },
    ],
  },
  {
    version: '2.3.0',
    date: 'Feb 5, 2026',
    changes: [
      { icon: 'system', text: 'Redesigned Collection tab with compact upgrade interface' },
      { icon: 'system', text: 'Reorganized Profile tab for single-page view' },
      { icon: 'feature', text: 'Added Update Log to track game changes' },
      { icon: 'balance', text: 'Improved UI/UX for better mobile experience' },
    ],
  },
  {
    version: '2.2.0',
    date: 'Feb 4, 2026',
    changes: [
      { icon: 'feature', text: 'Complete coin collection and insect upgrade system' },
      { icon: 'feature', text: 'Exponential cost scaling for level upgrades (100 × 1.1^level)' },
      { icon: 'feature', text: 'Earn 10-1000 coins based on insect rarity' },
      { icon: 'system', text: 'Toast notifications for user feedback' },
    ],
  },
  {
    version: '2.1.0',
    date: 'Feb 3, 2026',
    changes: [
      { icon: 'feature', text: 'Free Battle Pass system with quests and tier rewards' },
      { icon: 'feature', text: 'Special promo code "4141" rewards Chan\'s Megastick exotic' },
      { icon: 'feature', text: 'Save/Load functionality for game progress' },
      { icon: 'fix', text: 'Fixed passive ability equipping system' },
    ],
  },
  {
    version: '2.0.0',
    date: 'Feb 2, 2026',
    changes: [
      { icon: 'feature', text: 'Insect Chest system with luck-based rewards' },
      { icon: 'feature', text: 'Working level up functionality (levels 1-100)' },
      { icon: 'feature', text: 'Cosmic Harbinger - ultimate exotic insect' },
      { icon: 'balance', text: 'Rebalanced battle difficulty and rewards' },
    ],
  },
  {
    version: '1.5.0',
    date: 'Feb 1, 2026',
    changes: [
      { icon: 'feature', text: 'Complete RNG skill system with battle rolls' },
      { icon: 'feature', text: 'Passive abilities for all insects' },
      { icon: 'feature', text: 'Boost potions (luck, XP, energy) with promo codes' },
      { icon: 'system', text: 'World and stage system (5 worlds, 10 stages each)' },
    ],
  },
];

const getIconComponent = (type: 'feature' | 'fix' | 'balance' | 'system') => {
  switch (type) {
    case 'feature':
      return <Sparkles className="w-3.5 h-3.5 text-emerald-600" />;
    case 'fix':
      return <Bug className="w-3.5 h-3.5 text-red-600" />;
    case 'balance':
      return <Zap className="w-3.5 h-3.5 text-amber-600" />;
    case 'system':
      return <Trophy className="w-3.5 h-3.5 text-blue-600" />;
  }
};

export function UpdateLog() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-purple-600" />
        <h3 className="font-bold text-lg">Update History</h3>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {UPDATES.map((update, idx) => (
          <div
            key={update.version}
            className={`bg-gradient-to-br ${
              idx === 0 ? 'from-purple-50 to-pink-50 border-2 border-purple-300' : 'from-gray-50 to-gray-100 border border-gray-200'
            } rounded-xl p-4`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-purple-700">v{update.version}</span>
                {idx === 0 && (
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    LATEST
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">{update.date}</span>
            </div>

            <div className="space-y-1.5">
              {update.changes.map((change, changeIdx) => (
                <div key={changeIdx} className="flex items-start gap-2">
                  <div className="mt-0.5">{getIconComponent(change.icon)}</div>
                  <span className="text-sm text-gray-700 flex-1">{change.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-3 mt-4">
        <p className="text-xs text-emerald-800">
          <Gift className="w-3 h-3 inline mr-1" />
          <strong>Tip:</strong> Use promo code "4141" in the Boost Manager to unlock Chan's Megastick - the longest insect in the world!
        </p>
      </div>
    </div>
  );
}