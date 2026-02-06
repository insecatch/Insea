import { useState, useEffect } from 'react';
import { CapturedInsect, storage } from '@/app/utils/storage';
import { SpecialEvent, EventChallenge, EventEnemy } from '@/app/data/eventData';
import { RARITY_COLORS } from '@/app/data/insectDatabase';
import { SKILL_DATABASE } from '@/app/data/skillDatabase';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Swords, Heart, Zap, Trophy, X, Star, Flame, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  executePlayerAttack, 
  executeOpponentAttack
} from '@/app/utils/battleLogic';

interface EventBattleProps {
  event: SpecialEvent;
  challenge: EventChallenge;
  collection: CapturedInsect[];
  onComplete: (won: boolean) => void;
  onExit: () => void;
}

type BattlePhase = 'selection' | 'starting' | 'initiative' | 'battle' | 'result';

export function EventBattle({ event, challenge, collection, onComplete, onExit }: EventBattleProps) {
  const [phase, setPhase] = useState<BattlePhase>('selection');
  const [selectedInsect, setSelectedInsect] = useState<CapturedInsect | null>(null);
  const [opponentTeam, setOpponentTeam] = useState<EventEnemy[]>([]);
  const [currentOpponentIndex, setCurrentOpponentIndex] = useState(0);
  const [playerHP, setPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [playerEnergy, setPlayerEnergy] = useState(100);
  const [opponentEnergy, setOpponentEnergy] = useState(100);
  const maxEnergy = 100;
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [damageIndicator, setDamageIndicator] = useState<{ type: 'player' | 'opponent', damage: number } | null>(null);
  const [playerInitiativeRoll, setPlayerInitiativeRoll] = useState(0);
  const [opponentInitiativeRoll, setOpponentInitiativeRoll] = useState(0);
  const [showInitiativeRoll, setShowInitiativeRoll] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [minionSummonCounter, setMinionSummonCounter] = useState(0);

  const currentOpponent = opponentTeam[currentOpponentIndex];

  // Get equipped skills for the selected insect
  const getInsectSkills = (insect: CapturedInsect) => {
    const equipped = insect.equippedSkills || { normal: [], ultimate: undefined };
    const normalSkills = equipped.normal.map(id => SKILL_DATABASE.find(s => s.id === id)).filter(Boolean);
    const ultimateSkill = equipped.ultimate ? SKILL_DATABASE.find(s => s.id === equipped.ultimate) : null;
    return { normalSkills, ultimateSkill };
  };

  // Auto-trigger opponent turn when it's their turn
  useEffect(() => {
    if (phase === 'battle' && !isPlayerTurn && !isAnimating && selectedInsect && currentOpponent) {
      console.log('EventBattle: useEffect triggering opponent turn');
      const timer = setTimeout(() => {
        opponentTurn();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [phase, isPlayerTurn, isAnimating, selectedInsect, currentOpponent]);

  const startBattle = (insect: CapturedInsect) => {
    setSelectedInsect(insect);
    setPhase('starting');
    setOpponentTeam(challenge.enemyTeam);
    setCurrentOpponentIndex(0);

    setTimeout(() => {
      setPhase('initiative');
      setBattleLog([`${challenge.name} - START!`]);
      
      // Use upgraded stats for player HP
      const playerStats = storage.getInsectStats(insect);
      setPlayerHP(playerStats.health);
      setOpponentHP(challenge.enemyTeam[0].stats.health);
      setPlayerEnergy(100);
      setOpponentEnergy(100);
      
      // Initiative roll
      setTimeout(() => {
        const playerRoll = Math.floor(Math.random() * 20) + 1 + insect.insect.stats.speed / 10;
        const opponentRoll = Math.floor(Math.random() * 20) + 1 + challenge.enemyTeam[0].stats.speed / 10;
        
        setPlayerInitiativeRoll(Math.floor(playerRoll));
        setOpponentInitiativeRoll(Math.floor(opponentRoll));
        setShowInitiativeRoll(true);
        
        const playerGoesFirst = playerRoll > opponentRoll;
        setIsPlayerTurn(playerGoesFirst);
        
        setBattleLog(prev => [
          ...prev,
          `Initiative Roll: You rolled ${Math.floor(playerRoll)}, Enemy rolled ${Math.floor(opponentRoll)}`,
          playerGoesFirst ? 'You go first!' : 'Enemy goes first!'
        ]);
        
        setTimeout(() => {
          setPhase('battle');
          if (!playerGoesFirst) {
            setTimeout(() => opponentTurn(), 500);
          }
        }, 3000);
      }, 500);
    }, 1500);
  };

  const handleVictory = () => {
    setWinner('player');
    setPhase('result');
    
    // Award rewards
    storage.addRolls(challenge.rewards.rolls);
    if (challenge.rewards.potions) {
      if (challenge.rewards.potions.luck) storage.addPotion('luck', challenge.rewards.potions.luck);
      if (challenge.rewards.potions.xp) storage.addPotion('xp', challenge.rewards.potions.xp);
      if (challenge.rewards.potions.energy) storage.addPotion('energy', challenge.rewards.potions.energy);
    }
    
    setIsAnimating(false);
    onComplete(true);
  };

  const executeSkillAttack = (skill: any) => {
    if (!selectedInsect || !currentOpponent || isAnimating || !isPlayerTurn) return;

    setIsAnimating(true);

    const result = executePlayerAttack(
      selectedInsect,
      currentOpponent,
      opponentHP,
      playerEnergy,
      skill,
      challenge.specialRules.includes('Enemies deal 50% more damage') ? 1.5 : 1
    );

    if (result.energyUsed === 0) {
      setBattleLog(prev => [...prev, result.message]);
      setIsAnimating(false);
      return;
    }

    setPlayerEnergy(prev => Math.max(0, prev - result.energyUsed));
    setOpponentHP(result.newHP);
    
    setDamageIndicator({ type: 'opponent', damage: result.damage });
    setTimeout(() => setDamageIndicator(null), 1000);
    
    setBattleLog(prev => [...prev, result.message]);

    if (result.newHP <= 0) {
      if (currentOpponentIndex < opponentTeam.length - 1) {
        setTimeout(() => {
          setCurrentOpponentIndex(prev => prev + 1);
          setOpponentHP(opponentTeam[currentOpponentIndex + 1].stats.health);
          setOpponentEnergy(100);
          setBattleLog(prev => [...prev, `${currentOpponent.name} defeated! Next: ${opponentTeam[currentOpponentIndex + 1].name}!`]);
          setIsAnimating(false);
        }, 1500);
      } else {
        setTimeout(() => {
          handleVictory();
        }, 1500);
      }
    } else {
      setTimeout(() => {
        setIsPlayerTurn(false);
        setIsAnimating(false);
        setTimeout(() => opponentTurn(), 1000);
      }, 1000);
    }
  };

  const executeBasicAttack = () => {
    if (!selectedInsect || !currentOpponent || isAnimating || !isPlayerTurn) return;

    setIsAnimating(true);

    const result = executePlayerAttack(
      selectedInsect,
      currentOpponent,
      opponentHP,
      playerEnergy
    );

    if (result.energyUsed === 0) {
      setBattleLog(prev => [...prev, result.message]);
      setIsAnimating(false);
      return;
    }

    setPlayerEnergy(prev => Math.max(0, prev - result.energyUsed));
    setOpponentHP(result.newHP);
    
    setDamageIndicator({ type: 'opponent', damage: result.damage });
    setTimeout(() => setDamageIndicator(null), 1000);
    
    setBattleLog(prev => [...prev, result.message]);

    if (result.newHP <= 0) {
      if (currentOpponentIndex < opponentTeam.length - 1) {
        setTimeout(() => {
          setCurrentOpponentIndex(prev => prev + 1);
          setOpponentHP(opponentTeam[currentOpponentIndex + 1].stats.health);
          setOpponentEnergy(100);
          setBattleLog(prev => [...prev, `${currentOpponent.name} defeated!`]);
          setIsAnimating(false);
        }, 1500);
      } else {
        setTimeout(() => {
          handleVictory();
        }, 1500);
      }
    } else {
      setTimeout(() => {
        setIsPlayerTurn(false);
        setIsAnimating(false);
        setTimeout(() => opponentTurn(), 1000);
      }, 1000);
    }
  };

  const opponentTurn = () => {
    if (!selectedInsect || !currentOpponent) return;

    setIsAnimating(true);

    // Use the new battle logic with special ability support
    const extraBoost = challenge.specialRules.includes('Enemies deal 50% more damage') ? 1.5 : 1;
    const result = executeOpponentAttack(
      currentOpponent,
      selectedInsect,
      playerHP,
      opponentEnergy,
      extraBoost,
      currentOpponent.specialAbility
    );

    if (result.energyUsed === 0) {
      setBattleLog(prev => [...prev, result.message]);
      setTimeout(() => {
        // Energy regen - faster for events
        const regenAmount = challenge.specialRules.includes('Energy regenerates 20 per turn') ? 20 : 
                           challenge.specialRules.includes('Energy regenerates 25 per turn') ? 25 : 10;
        
        setPlayerEnergy(prev => Math.min(100, prev + regenAmount));
        setOpponentEnergy(prev => Math.min(100, prev + regenAmount));
        setIsPlayerTurn(true);
        setIsAnimating(false);
      }, 1500);
      return;
    }

    // Apply energy cost
    setOpponentEnergy(prev => Math.max(0, prev - result.energyUsed));
    
    // Apply damage
    setPlayerHP(result.newHP);
    
    // Show damage indicator
    setDamageIndicator({ type: 'player', damage: result.damage });
    setTimeout(() => setDamageIndicator(null), 1000);
    
    // Add to battle log
    setBattleLog(prev => [...prev, result.message]);

    // Check if player is defeated
    if (result.newHP <= 0) {
      setTimeout(() => {
        setWinner('opponent');
        setPhase('result');
        setIsAnimating(false);
        onComplete(false);
      }, 1500);
      return;
    }

    // Continue battle - regenerate energy and switch to player turn
    setTimeout(() => {
      // Energy regen - faster for events
      const regenAmount = challenge.specialRules.includes('Energy regenerates 20 per turn') ? 20 : 
                         challenge.specialRules.includes('Energy regenerates 25 per turn') ? 25 : 10;
      
      setPlayerEnergy(prev => Math.min(100, prev + regenAmount));
      setOpponentEnergy(prev => Math.min(100, prev + regenAmount));
      setIsPlayerTurn(true);
      setIsAnimating(false);
    }, 1500);
  };

  const { normalSkills, ultimateSkill } = selectedInsect ? getInsectSkills(selectedInsect) : { normalSkills: [], ultimateSkill: null };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div 
        className={`sticky top-0 z-10 p-4 shadow-md bg-gradient-to-r ${event.gradient} text-white`}
      >
        <div className="flex items-center justify-between">
          <Button onClick={onExit} variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <X className="w-4 h-4 mr-1" />
            Exit
          </Button>
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold">
              <span>{event.emoji}</span>
              <span>{challenge.name}</span>
            </div>
            <div className="text-xs opacity-90">
              Difficulty: {challenge.difficulty}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, Math.ceil(challenge.difficulty / 10)) }).map((_, i) => (
              <Star key={i} className="w-3 h-3" fill="white" stroke="white" />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4"
          >
            <div className="bg-purple-50 rounded-2xl p-4 mb-4">
              <h3 className="font-bold mb-2">Special Rules:</h3>
              {challenge.specialRules.map((rule, idx) => (
                <div key={idx} className="text-sm text-gray-700 mb-1">
                  • {rule}
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold mb-4">Select Your Insect</h2>
            <div className="grid grid-cols-2 gap-3">
              {collection.map((captured) => (
                <motion.div
                  key={captured.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startBattle(captured)}
                  className="bg-white rounded-xl p-4 shadow-md cursor-pointer hover:shadow-lg"
                  style={{ borderTop: `4px solid ${RARITY_COLORS[captured.insect.rarity]}` }}
                >
                  <div className="text-4xl mb-2 text-center">{captured.insect.emoji}</div>
                  <div className="text-sm font-bold text-center mb-2">{captured.insect.name}</div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="bg-red-50 rounded px-2 py-1">
                      <Heart className="w-3 h-3 inline mr-1" />
                      {captured.insect.stats.health}
                    </div>
                    <div className="bg-orange-50 rounded px-2 py-1">
                      <Swords className="w-3 h-3 inline mr-1" />
                      {captured.insect.stats.attack}
                    </div>
                  </div>
                </motion.div>
              ))}</div>
          </motion.div>
        )}

        {phase === 'starting' && (
          <motion.div
            key="starting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                {event.emoji}
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Entering Challenge...</h2>
              <p className="text-gray-600">{challenge.name}</p>
            </div>
          </motion.div>
        )}

        {phase === 'initiative' && (
          <motion.div
            key="initiative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-4"
              >
                ⚔️
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Initiative Roll...</h2>
              {showInitiativeRoll && (
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-4">
                    <div className="bg-blue-50 rounded-2xl p-4">
                      <div className="text-4xl font-bold text-blue-600">{playerInitiativeRoll}</div>
                      <div className="text-sm text-gray-600">Your Roll</div>
                    </div>
                    <div className="bg-red-50 rounded-2xl p-4">
                      <div className="text-4xl font-bold text-red-600">{opponentInitiativeRoll}</div>
                      <div className="text-sm text-gray-600">Enemy Roll</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {phase === 'battle' && selectedInsect && currentOpponent && (
          <motion.div
            key="battle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4"
          >
            {/* Battle Arena - Similar to regular battle but with event styling */}
            <div className="mb-4">
              {/* Opponent */}
              <div className="bg-gradient-to-br from-red-100 to-purple-100 rounded-2xl p-4 mb-4 relative border-2 border-red-300">
                <AnimatePresence>
                  {damageIndicator?.type === 'opponent' && (
                    <motion.div
                      initial={{ opacity: 0, y: 0, scale: 1 }}
                      animate={{ opacity: 1, y: -30, scale: 1.5 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-red-600 z-10"
                    >
                      -{damageIndicator.damage}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-lg">{currentOpponent.name}</div>
                    <Badge style={{ backgroundColor: RARITY_COLORS[currentOpponent.rarity] }}>
                      {currentOpponent.rarity}
                    </Badge>
                    {currentOpponent.specialAbility && (
                      <div className="text-xs text-purple-700 mt-1 flex items-center gap-1">
                        <Skull className="w-3 h-3" />
                        {currentOpponent.specialAbility}
                      </div>
                    )}
                  </div>
                  <div className="text-5xl">{currentOpponent.emoji}</div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold">HP</span>
                    <span>{opponentHP} / {currentOpponent.stats.health}</span>
                  </div>
                  <div className="w-full bg-red-200 rounded-full h-3">
                    <motion.div
                      animate={{ width: `${(opponentHP / currentOpponent.stats.health) * 100}%` }}
                      className="bg-red-500 h-3 rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold">Energy</span>
                    <span>{opponentEnergy} / {maxEnergy}</span>
                  </div>
                  <div className="w-full bg-yellow-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all"
                      style={{ width: `${(opponentEnergy / maxEnergy) * 100}%` }}
                    />
                  </div>
                </div>

                {opponentTeam.length > 1 && (
                  <div className="mt-3 flex gap-1">
                    {opponentTeam.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 flex-1 rounded-full ${
                          idx < currentOpponentIndex ? 'bg-gray-300' :
                          idx === currentOpponentIndex ? 'bg-red-500' :
                          'bg-red-200'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="text-center text-2xl font-bold text-gray-400 my-2">⚔️</div>

              {/* Player */}
              <div className="bg-blue-50 rounded-2xl p-4 relative border-2 border-blue-300">
                <AnimatePresence>
                  {damageIndicator?.type === 'player' && (
                    <motion.div
                      initial={{ opacity: 0, y: 0, scale: 1 }}
                      animate={{ opacity: 1, y: -30, scale: 1.5 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-red-600 z-10"
                    >
                      -{damageIndicator.damage}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-5xl">{selectedInsect.insect.emoji}</div>
                  <div className="text-right">
                    <div className="font-bold">{selectedInsect.insect.name}</div>
                    <Badge style={{ backgroundColor: RARITY_COLORS[selectedInsect.insect.rarity] }}>
                      {selectedInsect.insect.rarity}
                    </Badge>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold">HP</span>
                    <span>{playerHP} / {selectedInsect.insect.stats.health}</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-3">
                    <motion.div
                      animate={{ width: `${(playerHP / selectedInsect.insect.stats.health) * 100}%` }}
                      className="bg-green-500 h-3 rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold">Energy</span>
                    <span>{playerEnergy} / {maxEnergy}</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(playerEnergy / maxEnergy) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Battle Actions */}
            {isPlayerTurn && !isAnimating && (
              <div className="space-y-3 mb-4">
                <div className="text-sm font-semibold text-center text-green-600">Your Turn!</div>
                
                {normalSkills.length > 0 && (
                  <div className="space-y-2">
                    {normalSkills.map((skill: any) => (
                      <Button
                        key={skill.id}
                        onClick={() => executeSkillAttack(skill)}
                        disabled={playerEnergy < skill.energyCost}
                        className="w-full flex items-center justify-between"
                        style={{ 
                          backgroundColor: playerEnergy >= skill.energyCost ? '#3b82f6' : '#9ca3af',
                          opacity: playerEnergy >= skill.energyCost ? 1 : 0.5
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          {skill.name}
                        </span>
                        <span className="text-xs">
                          ⚡{skill.energyCost} | 💥{skill.damageMultiplier}x
                        </span>
                      </Button>
                    ))}
                  </div>
                )}

                {ultimateSkill && (
                  <Button
                    onClick={() => executeSkillAttack(ultimateSkill)}
                    disabled={playerEnergy < ultimateSkill.energyCost}
                    className="w-full flex items-center justify-between"
                    style={{ 
                      backgroundColor: playerEnergy >= ultimateSkill.energyCost ? '#f59e0b' : '#9ca3af'
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      {ultimateSkill.name}
                    </span>
                    <span className="text-xs">
                      ⚡{ultimateSkill.energyCost} | 💥{ultimateSkill.damageMultiplier}x
                    </span>
                  </Button>
                )}

                <div className="pt-2 border-t">
                  <Button
                    onClick={executeBasicAttack}
                    disabled={playerEnergy < 15}
                    variant="outline"
                    className="w-full"
                  >
                    <Swords className="w-4 h-4 mr-2" />
                    Basic Attack (⚡15)
                  </Button>
                </div>
              </div>
            )}

            {!isPlayerTurn && (
              <div className="text-center text-sm font-semibold text-red-600 mb-4">
                Enemy's Turn...
              </div>
            )}

            {/* Battle Log */}
            <div className="bg-gray-100 rounded-xl p-3 max-h-40 overflow-y-auto">
              <div className="text-xs font-semibold mb-2">Battle Log</div>
              {battleLog.slice(-5).map((log, idx) => (
                <div key={idx} className="text-xs text-gray-700 mb-1">
                  • {log}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 flex items-center justify-center min-h-[60vh]"
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md w-full">
              {winner === 'player' ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="text-8xl mb-4"
                  >
                    🏆
                  </motion.div>
                  <h2 className="text-3xl font-bold text-green-600 mb-2">Victory!</h2>
                  <p className="text-gray-600 mb-6">You completed the challenge!</p>
                  
                  <div className={`bg-gradient-to-r ${event.gradient} bg-opacity-10 rounded-xl p-4 mb-6`}>
                    <div className="text-sm font-semibold mb-3">Rewards</div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge className="bg-purple-500 text-white">
                        🎲 {challenge.rewards.rolls} Rolls
                      </Badge>
                      {challenge.rewards.potions?.luck && (
                        <Badge className="bg-green-500 text-white">
                          🍀 {challenge.rewards.potions.luck}
                        </Badge>
                      )}
                      {challenge.rewards.potions?.xp && (
                        <Badge className="bg-blue-500 text-white">
                          ⭐ {challenge.rewards.potions.xp}
                        </Badge>
                      )}
                      {challenge.rewards.potions?.energy && (
                        <Badge className="bg-yellow-500 text-white">
                          ⚡ {challenge.rewards.potions.energy}
                        </Badge>
                      )}
                    </div>
                    {challenge.rewards.exclusiveReward && (
                      <div className="mt-3 text-sm font-bold text-yellow-600">
                        🎁 {challenge.rewards.exclusiveReward}
                      </div>
                    )}
                  </div>

                  <Button onClick={onExit} className={`w-full bg-gradient-to-r ${event.gradient}`}>
                    Back to Events
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-8xl mb-4">💔</div>
                  <h2 className="text-3xl font-bold text-red-600 mb-2">Defeat</h2>
                  <p className="text-gray-600 mb-6">Try again!</p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        setPhase('selection');
                        setWinner(null);
                        setSelectedInsect(null);
                        setBattleLog([]);
                      }}
                      className="w-full bg-red-500"
                    >
                      Try Again
                    </Button>
                    <Button onClick={onExit} variant="outline" className="w-full">
                      Back to Events
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}