import { useState } from 'react';
import { storage } from '@/app/utils/storage';
import { Insect, RARITY_COLORS, RARITY_LABELS } from '@/app/data/insectDatabase';
import { Button } from '@/app/components/ui/button';
import { Package, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/app/components/ui/badge';

interface InsectChestProps {
  onUpdate: () => void;
}

export function InsectChest({ onUpdate }: InsectChestProps) {
  const [chestCount, setChestCount] = useState(storage.getChests());
  const [showReward, setShowReward] = useState(false);
  const [rewardedInsects, setRewardedInsects] = useState<Insect[]>([]);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenChest = () => {
    const result = storage.openChest();
    
    if (!result) {
      alert('You don\'t have any chests!');
      return;
    }

    setIsOpening(true);
    
    // Show opening animation
    setTimeout(() => {
      setRewardedInsects(result.insects);
      
      // Award coins for each insect in the chest
      const rarityRewards: Record<string, number> = {
        'common': 10,
        'uncommon': 25,
        'rare': 50,
        'epic': 100,
        'legendary': 250,
        'mythic': 500,
        'exotic': 1000
      };
      
      let totalCoins = 0;
      result.insects.forEach(insect => {
        const coinReward = rarityRewards[insect.rarity] || 10;
        totalCoins += coinReward;
      });
      storage.addCoins(totalCoins);
      
      setShowReward(true);
      setIsOpening(false);
      setChestCount(storage.getChests());
      onUpdate();
    }, 1500);
  };

  const closeReward = () => {
    setShowReward(false);
    setRewardedInsects([]);
  };

  return (
    <div className="p-4">
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Package className="w-7 h-7" />
              Insect Chests
            </h2>
            <p className="text-sm opacity-90 mt-1">
              Open chests to get random insects!
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
            <div className="text-3xl font-bold">{chestCount}</div>
            <div className="text-xs opacity-90">Available</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <div className="text-sm font-semibold mb-2">📦 Chest Contents:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>• 1-3 Random Insects</div>
            <div>• All Rarities Possible</div>
            <div>• 0.1% Mythic Chance!</div>
            <div>• Instant Collection</div>
          </div>
        </div>

        <Button
          onClick={handleOpenChest}
          disabled={chestCount === 0 || isOpening}
          className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold py-6 text-lg rounded-xl shadow-lg"
        >
          {isOpening ? (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 animate-spin" />
              Opening...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Open Chest
            </span>
          )}
        </Button>

        {chestCount === 0 && (
          <div className="mt-3 bg-yellow-500/20 rounded-xl p-3 text-center text-sm">
            💡 Earn chests by winning battles and completing stages!
          </div>
        )}
      </div>

      {/* Opening Animation */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: 3,
              }}
              className="text-9xl"
            >
              📦
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Modal */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={closeReward}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-3">🎉</div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Chest Opened!
                </h2>
                <p className="text-gray-600 mt-2">
                  You got {rewardedInsects.length} insect{rewardedInsects.length > 1 ? 's' : ''}!
                </p>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {rewardedInsects.map((insect, index) => (
                  <motion.div
                    key={`${insect.id}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-2"
                    style={{ borderColor: RARITY_COLORS[insect.rarity] }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{insect.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{insect.name}</h3>
                          <Badge
                            style={{ backgroundColor: RARITY_COLORS[insect.rarity] }}
                            className="text-white text-xs"
                          >
                            {RARITY_LABELS[insect.rarity]}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 italic">{insect.scientificName}</p>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {Object.entries(insect.stats).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div className="text-xs text-gray-500 uppercase">
                                {key.substring(0, 3)}
                              </div>
                              <div className="text-sm font-bold">{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={closeReward}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg rounded-xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}