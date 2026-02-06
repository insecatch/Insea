import { useState, useEffect } from 'react';
import { storage, BoostPotion } from '@/app/utils/storage';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Sparkles, Zap, Battery, Clock, Gift, Ticket, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UpdateLogModal } from '@/app/components/UpdateLogModal';

interface BoostManagerProps {
  onUpdate?: () => void;
}

export function BoostManager({ onUpdate }: BoostManagerProps) {
  const [potions, setPotions] = useState({ luck: 0, xp: 0, energy: 0 });
  const [activeBoosts, setActiveBoosts] = useState<BoostPotion[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [codeMessage, setCodeMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showUpdateLog, setShowUpdateLog] = useState(false);

  const loadData = () => {
    setPotions(storage.getPotions());
    setActiveBoosts(storage.getActiveBoosts());
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 1000); // Update every second for timer
    return () => clearInterval(interval);
  }, []);

  const handleUsePotion = (type: 'luck' | 'xp' | 'energy') => {
    const success = storage.usePotion(type);
    if (success) {
      loadData();
      onUpdate?.();
      showMessage(`${type.toUpperCase()} Boost activated for 30 minutes!`, 'success');
    } else {
      showMessage(`No ${type} potions available!`, 'error');
    }
  };

  const handleRedeemCode = () => {
    if (!promoCode.trim()) {
      showMessage('Please enter a promo code!', 'error');
      return;
    }

    const result = storage.redeemPromoCode(promoCode.trim());
    
    if (result.success) {
      showMessage(result.message, 'success');
      setPromoCode('');
      loadData();
      onUpdate?.();
      
      // Check if it's the update log code
      if (promoCode.trim().toUpperCase() === 'UPDLOG') {
        setTimeout(() => {
          setShowUpdateLog(true);
        }, 500);
      }
    } else {
      showMessage(result.message, 'error');
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setCodeMessage({ text, type });
    setTimeout(() => setCodeMessage(null), 5000);
  };

  const getTimeRemaining = (expiresAt: number): string => {
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) return 'Expired';
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const getPotionIcon = (type: string) => {
    switch (type) {
      case 'luck': return '🍀';
      case 'xp': return '⭐';
      case 'energy': return '⚡';
      default: return '💊';
    }
  };

  const getPotionColor = (type: string) => {
    switch (type) {
      case 'luck': return 'from-green-500 to-emerald-500';
      case 'xp': return 'from-yellow-500 to-orange-500';
      case 'energy': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Boosts */}
      {activeBoosts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Active Boosts
          </h3>
          <div className="space-y-2">
            {activeBoosts.map((boost, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{getPotionIcon(boost.type)}</div>
                    <div>
                      <div className="font-semibold text-sm">
                        {boost.type === 'luck' ? `${(boost.multiplier * 100).toFixed(0)}% Luck Boost` :
                         boost.type === 'xp' ? `${(boost.multiplier * 100).toFixed(0)}% XP Boost` :
                         `${(boost.multiplier * 100).toFixed(0)}% Energy Boost`}
                      </div>
                      <div className="text-xs opacity-90 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getTimeRemaining(boost.expiresAt)}
                      </div>
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Potions Inventory */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Gift className="w-5 h-5 text-blue-500" />
          Boost Potions
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {/* Luck Potion */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🍀</div>
              <div className="text-xs font-semibold text-gray-600 mb-1">Luck</div>
              <div className="text-2xl font-bold text-green-600 mb-2">{potions.luck}</div>
              <Button
                onClick={() => handleUsePotion('luck')}
                disabled={potions.luck <= 0}
                className={`w-full text-xs bg-gradient-to-r ${getPotionColor('luck')} disabled:opacity-40 disabled:cursor-not-allowed`}
                size="sm"
              >
                Use
              </Button>
              <div className="text-[10px] text-gray-500 mt-1">+100% luck</div>
            </div>
          </motion.div>

          {/* XP Potion */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">⭐</div>
              <div className="text-xs font-semibold text-gray-600 mb-1">XP</div>
              <div className="text-2xl font-bold text-yellow-600 mb-2">{potions.xp}</div>
              <Button
                onClick={() => handleUsePotion('xp')}
                disabled={potions.xp <= 0}
                className={`w-full text-xs bg-gradient-to-r ${getPotionColor('xp')} disabled:opacity-40 disabled:cursor-not-allowed`}
                size="sm"
              >
                Use
              </Button>
              <div className="text-[10px] text-gray-500 mt-1">+100% XP</div>
            </div>
          </motion.div>

          {/* Energy Potion */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-xs font-semibold text-gray-600 mb-1">Energy</div>
              <div className="text-2xl font-bold text-blue-600 mb-2">{potions.energy}</div>
              <Button
                onClick={() => handleUsePotion('energy')}
                disabled={potions.energy <= 0}
                className={`w-full text-xs bg-gradient-to-r ${getPotionColor('energy')} disabled:opacity-40 disabled:cursor-not-allowed`}
                size="sm"
              >
                Use
              </Button>
              <div className="text-[10px] text-gray-500 mt-1">+50% energy</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Promo Code Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Ticket className="w-5 h-5 text-purple-500" />
          Promo Codes
        </h3>
        
        {!showCodeInput ? (
          <Button
            onClick={() => setShowCodeInput(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
          >
            <Gift className="w-4 h-4 mr-2" />
            Enter Promo Code
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-xl p-4 shadow-md space-y-3"
          >
            <Input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Enter code (e.g. RELEASE)"
              className="text-center font-bold text-lg uppercase"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleRedeemCode();
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleRedeemCode}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Redeem
              </Button>
              <Button
                onClick={() => {
                  setShowCodeInput(false);
                  setPromoCode('');
                  setCodeMessage(null);
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
            
            {/* Hint */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs text-purple-800 text-center">
                💡 Try codes like: <span className="font-bold">RELEASE</span>, <span className="font-bold">WELCOME</span>, <span className="font-bold">INSECATCH</span>, <span className="font-bold">4141</span>
              </p>
            </div>
          </motion.div>
        )}

        {/* Message Display */}
        <AnimatePresence>
          {codeMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-xl p-4 text-center font-semibold ${
                codeMessage.type === 'success'
                  ? 'bg-green-100 text-green-800 border-2 border-green-300'
                  : 'bg-red-100 text-red-800 border-2 border-red-300'
              }`}
            >
              {codeMessage.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2 text-sm">How to get potions?</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Claim daily rewards for free potions</li>
          <li>• Win battles to earn random potions</li>
          <li>• Use promo codes for bonus potions</li>
          <li>• Unlock achievements for rewards</li>
        </ul>
      </div>

      {/* Update Log Modal */}
      <UpdateLogModal
        isOpen={showUpdateLog}
        onClose={() => setShowUpdateLog(false)}
      />
    </div>
  );
}