import { useState, useEffect } from 'react';
import { storage } from '@/app/utils/storage';
import { Button } from '@/app/components/ui/button';
import { SKILL_DATABASE, Skill, SKILL_RARITY_WEIGHTS, SKILL_RARITY_COLORS } from '@/app/data/skillDatabase';
import { PASSIVE_ABILITIES, PassiveAbility } from '@/app/data/passiveAbilities';
import { Sparkles, Ticket, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SkillRollerProps {
  onUpdate?: () => void;
}

type RollResult = {
  type: 'skill' | 'passive';
  skill?: Skill;
  passive?: PassiveAbility;
  rarity: string;
  icon: string;
  name: string;
  description: string;
};

export function SkillRoller({ onUpdate }: SkillRollerProps) {
  const [rolls, setRolls] = useState(0);
  const [ownedSkills, setOwnedSkills] = useState<string[]>([]);
  const [ownedPassives, setOwnedPassives] = useState<string[]>([]);
  const [rolling, setRolling] = useState(false);
  const [rolledResult, setRolledResult] = useState<RollResult | null>(null);
  const [isNew, setIsNew] = useState(false);

  const loadData = () => {
    setRolls(storage.getRolls());
    setOwnedSkills(storage.getOwnedSkills().map(s => s.skillId));
    setOwnedPassives(storage.getOwnedPassives());
  };

  useEffect(() => {
    loadData();
  }, []);

  const rollReward = (): RollResult => {
    // 60% chance for passive, 40% chance for skill (making passives much easier to get)
    const isPassive = Math.random() < 0.6;

    if (isPassive) {
      // Roll a random passive ability
      const passiveList = Object.values(PASSIVE_ABILITIES);
      const randomPassive = passiveList[Math.floor(Math.random() * passiveList.length)];
      
      // Determine rarity based on the passive's effects
      let rarity = 'common';
      const effectCount = Object.keys(randomPassive.effects).length;
      if (effectCount >= 3) rarity = 'legendary';
      else if (effectCount >= 2) rarity = 'epic';
      else if (randomPassive.effects.damageBonus && randomPassive.effects.damageBonus >= 15) rarity = 'rare';
      
      return {
        type: 'passive',
        passive: randomPassive,
        rarity,
        icon: randomPassive.icon,
        name: randomPassive.name,
        description: randomPassive.description
      };
    } else {
      // Roll a skill (original logic)
      const totalWeight = Object.values(SKILL_RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
      const random = Math.random() * totalWeight;
      
      let currentWeight = 0;
      let selectedRarity: keyof typeof SKILL_RARITY_WEIGHTS = 'common';
      
      for (const [rarity, weight] of Object.entries(SKILL_RARITY_WEIGHTS)) {
        currentWeight += weight;
        if (random <= currentWeight) {
          selectedRarity = rarity as keyof typeof SKILL_RARITY_WEIGHTS;
          break;
        }
      }
      
      const skillsOfRarity = SKILL_DATABASE.filter(s => s.rarity === selectedRarity);
      const randomSkill = skillsOfRarity[Math.floor(Math.random() * skillsOfRarity.length)];
      
      return {
        type: 'skill',
        skill: randomSkill,
        rarity: randomSkill.rarity,
        icon: randomSkill.icon,
        name: randomSkill.name,
        description: randomSkill.description
      };
    }
  };

  const handleRoll = async () => {
    if (rolls <= 0 || rolling) return;

    const success = storage.useRoll();
    if (!success) return;

    setRolling(true);
    setRolledResult(null);

    // Animate rolling
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = rollReward();
    let wasNew = false;
    
    if (result.type === 'passive' && result.passive) {
      wasNew = !ownedPassives.includes(result.passive.id);
      storage.addPassive(result.passive.id);
    } else if (result.type === 'skill' && result.skill) {
      wasNew = !ownedSkills.includes(result.skill.id);
      storage.addSkill(result.skill.id);
    }
    
    setRolledResult(result);
    setIsNew(wasNew);
    
    loadData();
    onUpdate?.();

    setTimeout(() => {
      setRolling(false);
    }, 3000);
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Rolls Display */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90 mb-1">Available Rolls</div>
            <div className="text-4xl font-bold flex items-center gap-2">
              <Ticket className="w-8 h-8" />
              {rolls}
            </div>
          </div>
          <Sparkles className="w-12 h-12 opacity-50" />
        </div>
        <div className="mt-3 text-xs opacity-90">
          Win battles to earn more rolls!
        </div>
      </div>

      {/* Roll Button */}
      <Button
        onClick={handleRoll}
        disabled={rolls <= 0 || rolling}
        className="w-full h-20 text-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {rolling ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        ) : (
          <>
            <Trophy className="w-6 h-6 mr-2" />
            Roll for Skills & Passives!
          </>
        )}
      </Button>

      {/* Roll Result */}
      <AnimatePresence>
        {rolledResult && (
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="relative"
          >
            <div
              className={`bg-gradient-to-br ${getRarityGradient(rolledResult.rarity)} rounded-3xl p-8 text-white shadow-2xl border-4 border-white`}
            >
              {isNew && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold"
                >
                  ✨ NEW!
                </motion.div>
              )}
              
              <div className="text-center">
                <div className="text-xs uppercase tracking-wider mb-2 opacity-90 bg-white/20 rounded-full px-3 py-1 inline-block">
                  {rolledResult.type === 'passive' ? '🛡️ Passive Ability' : '⚔️ Active Skill'}
                </div>
                
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-7xl mb-4"
                >
                  {rolledResult.icon}
                </motion.div>
                
                <div className="text-2xl font-bold mb-2">{rolledResult.name}</div>
                <div className="text-sm uppercase tracking-wider mb-4 opacity-90">
                  {rolledResult.rarity} {rolledResult.type === 'skill' && rolledResult.skill ? rolledResult.skill.type : ''}
                </div>
                
                <div className="bg-white/20 rounded-xl p-4 mb-4">
                  <p className="text-sm">{rolledResult.description}</p>
                </div>
                
                {rolledResult.type === 'skill' && rolledResult.skill && (
                  <div className="flex justify-center gap-4 text-sm">
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      ⚡ Cost: {rolledResult.skill.energyCost}
                    </div>
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      💪 Power: {(rolledResult.skill.damageMultiplier * 100).toFixed(0)}%
                    </div>
                  </div>
                )}
                
                {rolledResult.type === 'passive' && rolledResult.passive && (
                  <div className="flex justify-center gap-2 text-xs flex-wrap">
                    {rolledResult.passive.effects.damageBonus && (
                      <div className="bg-white/20 rounded-lg px-3 py-1">
                        ⚔️ +{rolledResult.passive.effects.damageBonus}% DMG
                      </div>
                    )}
                    {rolledResult.passive.effects.defenseBonus && (
                      <div className="bg-white/20 rounded-lg px-3 py-1">
                        🛡️ +{rolledResult.passive.effects.defenseBonus}% DEF
                      </div>
                    )}
                    {rolledResult.passive.effects.speedBonus && (
                      <div className="bg-white/20 rounded-lg px-3 py-1">
                        ⚡ +{rolledResult.passive.effects.speedBonus} SPD
                      </div>
                    )}
                    {rolledResult.passive.effects.heal && (
                      <div className="bg-white/20 rounded-lg px-3 py-1">
                        💚 +{rolledResult.passive.effects.heal} HP
                      </div>
                    )}
                    {rolledResult.passive.effects.dodge && (
                      <div className="bg-white/20 rounded-lg px-3 py-1">
                        👻 {rolledResult.passive.effects.dodge}% Dodge
                      </div>
                    )}
                    {rolledResult.passive.effects.crit && (
                      <div className="bg-white/20 rounded-lg px-3 py-1">
                        🎯 {rolledResult.passive.effects.crit}% Crit
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop Rates */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <h3 className="font-bold mb-3 text-sm">Drop Rates</h3>
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-green-600">🛡️ Passive Abilities</span>
            <span className="text-gray-600">60%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-blue-600">⚔️ Active Skills</span>
            <span className="text-gray-600">40%</span>
          </div>
        </div>
        <div className="border-t pt-3 space-y-2">
          <div className="text-xs font-semibold text-gray-700 mb-2">Skill Rarities:</div>
          {Object.entries(SKILL_RARITY_WEIGHTS).map(([rarity, weight]) => {
            const percentage = (weight / Object.values(SKILL_RARITY_WEIGHTS).reduce((a, b) => a + b, 0)) * 100;
            return (
              <div key={rarity} className="flex items-center justify-between text-xs">
                <span className="font-medium capitalize" style={{ color: SKILL_RARITY_COLORS[rarity as keyof typeof SKILL_RARITY_COLORS] }}>
                  {rarity}
                </span>
                <span className="text-gray-600">{percentage.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Owned Skills Count */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-blue-900">Skills Collected</span>
          <span className="text-2xl font-bold text-blue-600">
            {ownedSkills.length} / {SKILL_DATABASE.length}
          </span>
        </div>
      </div>
    </div>
  );
}