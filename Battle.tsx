import { useState, useEffect } from 'react';
import { CapturedInsect } from '@/app/utils/storage';
import { INSECT_DATABASE, Insect, RARITY_COLORS } from '@/app/data/insectDatabase';
import { WORLDS, saveStageCompletion, isStageUnlocked } from '@/app/data/worldData';
import { SKILL_DATABASE } from '@/app/data/skillDatabase';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Swords, Heart, Zap, Trophy, X, ChevronRight, Star, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { storage } from '@/app/utils/storage';
import { 
  executePlayerAttack, 
  executeOpponentAttack, 
  rollInitiative,
  regenerateEnergy,
  checkBattleEnd
} from '@/app/utils/battleLogic';

interface BattleProps {
  collection: CapturedInsect[];
  worldId: number;
  stageId: number;
  onUpdate: () => void;
  onExit: () => void;
}

type BattlePhase = 'selection' | 'matching' | 'initiative' | 'battle' | 'result';

export function Battle({ collection, worldId, stageId, onUpdate, onExit }: BattleProps) {
  const [phase, setPhase] = useState<BattlePhase>('selection');
  const [selectedInsect, setSelectedInsect] = useState<CapturedInsect | null>(null);
  const [opponentTeam, setOpponentTeam] = useState<Insect[]>([]);
  const [currentOpponentIndex, setCurrentOpponentIndex] = useState(0);
  const [opponentName, setOpponentName] = useState('');
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

  const world = WORLDS.find(w => w.id === worldId);
  const stage = world?.stages.find(s => s.id === stageId);

  const opponentNames = [
    'Bug Master Alex', 'Insect Hunter Maya', 'The Collector', 'Nature Guardian',
    'Wild Tracker', 'Bug Whisperer Sam', 'Forest Ranger Jo', 'Insect Sage Lee'
  ];

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
      console.log('useEffect triggering opponent turn');
      const timer = setTimeout(() => {
        opponentTurn();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [phase, isPlayerTurn, isAnimating, selectedInsect, currentOpponent]);

  const startBattle = (insect: CapturedInsect) => {
    if (!stage) return;
    
    setSelectedInsect(insect);
    setPhase('matching');

    // Select random opponent name
    const randomName = opponentNames[Math.floor(Math.random() * opponentNames.length)];
    setOpponentName(randomName);

    // Generate opponent team based on stage difficulty
    const team: Insect[] = [];
    const rarityPool = stage.opponentLevel > 30 ? ['legendary', 'epic'] :
                       stage.opponentLevel > 20 ? ['epic', 'rare'] :
                       stage.opponentLevel > 10 ? ['rare', 'uncommon'] :
                       ['uncommon', 'common'];

    // Difficulty multiplier - makes opponents stronger based on stage
    const difficultyBoost = 1 + (stage.difficulty / 20); // 1.0 to 2.0 boost

    for (let i = 0; i < stage.opponentCount; i++) {
      const eligibleInsects = INSECT_DATABASE.filter(ins => 
        rarityPool.includes(ins.rarity)
      );
      const randomInsect = eligibleInsects[Math.floor(Math.random() * eligibleInsects.length)];
      
      // Boost opponent stats for difficulty
      const boostedInsect: Insect = {
        ...randomInsect,
        stats: {
          health: Math.round(randomInsect.stats.health * difficultyBoost),
          attack: Math.round(randomInsect.stats.attack * difficultyBoost),
          defense: Math.round(randomInsect.stats.defense * difficultyBoost),
          speed: Math.round(randomInsect.stats.speed * difficultyBoost)
        }
      };
      
      team.push(boostedInsect);
    }

    setOpponentTeam(team);
    setCurrentOpponentIndex(0);

    setTimeout(() => {
      setPhase('initiative');
      setBattleLog([`Battle started! ${insect.insect.name} vs ${randomName}'s team!`]);
      
      // Use upgraded stats for player HP
      const playerStats = storage.getInsectStats(insect);
      setPlayerHP(playerStats.health);
      setOpponentHP(team[0].stats.health);
      setPlayerEnergy(100);
      setOpponentEnergy(100);
      
      // Roll for initiative after a short delay
      setTimeout(() => {
        const playerRoll = Math.floor(Math.random() * 20) + 1 + playerStats.speed / 10;
        const opponentRoll = Math.floor(Math.random() * 20) + 1 + team[0].stats.speed / 10;
        
        setPlayerInitiativeRoll(Math.floor(playerRoll));
        setOpponentInitiativeRoll(Math.floor(opponentRoll));
        setShowInitiativeRoll(true);
        
        const playerGoesFirst = playerRoll > opponentRoll;
        setIsPlayerTurn(playerGoesFirst);
        
        setBattleLog(prev => [
          ...prev,
          `Initiative Roll: You rolled ${Math.floor(playerRoll)}, ${randomName} rolled ${Math.floor(opponentRoll)}`,
          playerGoesFirst ? 'You go first!' : `${randomName} goes first!`
        ]);
        
        // Start battle after showing roll
        setTimeout(() => {
          setPhase('battle');
          if (!playerGoesFirst) {
            setTimeout(() => opponentTurn(), 500);
          }
        }, 3000);
      }, 500);
    }, 2000);
  };

  const opponentTurn = () => {
    if (!selectedInsect || !currentOpponent) {
      console.log('OpponentTurn early return:', { selectedInsect, currentOpponent });
      return;
    }

    console.log('OpponentTurn executing:', { 
      opponentName: currentOpponent.name, 
      opponentEnergy,
      playerHP 
    });

    setIsAnimating(true);

    // Use the new battle logic
    const result = executeOpponentAttack(
      currentOpponent,
      selectedInsect,
      playerHP,
      opponentEnergy
    );

    console.log('OpponentTurn result:', result);

    if (result.energyUsed === 0) {
      setBattleLog(prev => [...prev, result.message]);
      setTimeout(() => {
        // Regenerate energy even if no attack
        setPlayerEnergy(prev => Math.min(100, prev + 10));
        setOpponentEnergy(prev => Math.min(100, prev + 10));
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
        storage.recordBattle({
          won: false,
          opponentName,
          insectUsed: selectedInsect.insect.name,
          xpEarned: 0
        });
        setIsAnimating(false);
      }, 1500);
      return;
    }

    // Continue battle - regenerate energy and switch to player turn
    setTimeout(() => {
      setPlayerEnergy(prev => Math.min(100, prev + 10));
      setOpponentEnergy(prev => Math.min(100, prev + 10));
      setIsPlayerTurn(true);
      setIsAnimating(false);
    }, 1500);
  };

  const handleVictory = () => {
    if (!selectedInsect || !stage) return;
    
    setWinner('player');
    setPhase('result');
    
    // Save stage completion
    saveStageCompletion(worldId, stageId);
    
    // Calculate coin rewards based on stage difficulty
    const coinReward = Math.floor(50 + (stage.difficulty * 10) + (stage.opponentLevel * 5));
    storage.addCoins(coinReward);
    
    // Calculate and award EXP
    const expReward = stage.opponentLevel * 10;
    const expResult = storage.addExperience(selectedInsect.id, expReward);
    
    // Award rewards
    storage.addRolls(stage.rewards.rolls);
    if (stage.rewards.potions) {
      if (stage.rewards.potions.luck) storage.addPotion('luck', stage.rewards.potions.luck);
      if (stage.rewards.potions.xp) storage.addPotion('xp', stage.rewards.potions.xp);
      if (stage.rewards.potions.energy) storage.addPotion('energy', stage.rewards.potions.energy);
    }
    
    storage.recordBattle({
      won: true,
      opponentName,
      insectUsed: selectedInsect!.insect.name,
      xpEarned: expReward
    });
    
    // Add battle log messages
    setBattleLog(prev => [
      ...prev, 
      `Victory! Earned ${coinReward} coins!`,
      `${selectedInsect.insect.name} gained ${expReward} EXP!`
    ]);
    
    if (expResult.leveledUp) {
      setBattleLog(prev => [
        ...prev,
        `🎉 ${selectedInsect.insect.name} leveled up to Level ${expResult.newLevel}!`
      ]);
    }
    
    onUpdate();
    setIsAnimating(false);
  };

  const handleNextStage = () => {
    if (!world || !stage) return;
    
    const currentStageIndex = world.stages.findIndex(s => s.id === stageId);
    if (currentStageIndex < world.stages.length - 1) {
      const nextStage = world.stages[currentStageIndex + 1];
      const profile = storage.getProfile();
      
      if (isStageUnlocked(worldId, nextStage.id, profile.rank)) {
        // Reset battle and start next stage
        setPhase('selection');
        setWinner(null);
        setSelectedInsect(null);
        setBattleLog([]);
        // Update parent to use next stage
        onExit(); // This will close battle and return to world map
        // User can manually select next stage
      } else {
        setBattleLog(prev => [...prev, 'Next stage is locked! Increase your rank first.']);
      }
    } else {
      setBattleLog(prev => [...prev, 'You completed all stages in this world!']);
    }
  };

  const executeSkillAttack = (skill: any) => {
    if (!selectedInsect || !currentOpponent || isAnimating || !isPlayerTurn) return;

    setIsAnimating(true);

    const result = executePlayerAttack(
      selectedInsect,
      currentOpponent,
      opponentHP,
      playerEnergy,
      skill
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
          setBattleLog(prev => [...prev, `${currentOpponent.name} defeated! Next opponent: ${opponentTeam[currentOpponentIndex + 1].name}!`]);
          setIsAnimating(false);
        }, 1500);
      } else {
        setTimeout(() => {
          handleVictory();
        }, 1500);
      }
    } else {
      setTimeout(() => {
        // Regenerate energy before switching turns
        setPlayerEnergy(prev => Math.min(100, prev + 10));
        setOpponentEnergy(prev => Math.min(100, prev + 10));
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
        // Regenerate energy before switching turns
        setPlayerEnergy(prev => Math.min(100, prev + 10));
        setOpponentEnergy(prev => Math.min(100, prev + 10));
        setIsPlayerTurn(false);
        setIsAnimating(false);
        setTimeout(() => opponentTurn(), 1000);
      }, 1000);
    }
  };

  const { normalSkills, ultimateSkill } = selectedInsect ? getInsectSkills(selectedInsect) : { normalSkills: [], ultimateSkill: null };

  if (!world || !stage) {
    return (
      <div className="p-4">
        <p>Stage not found!</p>
        <Button onClick={onExit}>Back to World Map</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header with Stage Info */}
      <div 
        className="sticky top-0 z-10 p-4 shadow-md"
        style={{ background: `linear-gradient(135deg, ${world.color}22, ${world.color}44)` }}
      >
        <div className="flex items-center justify-between mb-2">
          <Button onClick={onExit} variant="ghost" size="sm">
            <X className="w-4 h-4 mr-1" />
            Exit
          </Button>
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold">
              <span>{world.emoji}</span>
              <span>{world.name}</span>
            </div>
            <div className="text-xs text-gray-600">
              Stage {stageId} - {stage.name}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, Math.ceil(stage.difficulty / 4)) }).map((_, i) => (
              <Star key={i} className="w-3 h-3" fill={world.color} stroke={world.color} />
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
            <h2 className="text-xl font-bold mb-4">Select Your Insect</h2>
            <div className="grid grid-cols-2 gap-3">
              {collection.map((captured) => (
                <motion.div
                  key={captured.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startBattle(captured)}
                  className="bg-white rounded-xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-all"
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
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'matching' && (
          <motion.div
            key="matching"
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
              <h2 className="text-2xl font-bold mb-2">Finding Opponent...</h2>
              <p className="text-gray-600">{opponentName}</p>
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
              <p className="text-gray-600">{opponentName}</p>
              {showInitiativeRoll && (
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-4">
                    <div className="bg-blue-50 rounded-2xl p-4">
                      <div className="text-4xl font-bold text-blue-600">{playerInitiativeRoll}</div>
                      <div className="text-sm text-gray-600">Your Roll</div>
                    </div>
                    <div className="bg-red-50 rounded-2xl p-4">
                      <div className="text-4xl font-bold text-red-600">{opponentInitiativeRoll}</div>
                      <div className="text-sm text-gray-600">Opponent Roll</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    {playerInitiativeRoll > opponentInitiativeRoll ? (
                      <div className="text-xl font-bold text-green-600">You go first!</div>
                    ) : (
                      <div className="text-xl font-bold text-red-600">Opponent goes first!</div>
                    )}
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
            {/* Battle Arena */}
            <div className="mb-4">
              {/* Opponent */}
              <div className="bg-red-50 rounded-2xl p-4 mb-4 relative">
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
                    <div className="text-xs text-gray-600">{opponentName}</div>
                    <div className="font-bold">{currentOpponent.name}</div>
                    <Badge className="text-xs mt-1" style={{ backgroundColor: RARITY_COLORS[currentOpponent.rarity] }}>
                      {currentOpponent.rarity}
                    </Badge>
                  </div>
                  <div className="text-5xl">{currentOpponent.emoji}</div>
                </div>
                
                {/* HP Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold">HP</span>
                    <span>{opponentHP} / {currentOpponent.stats.health}</span>
                  </div>
                  <div className="w-full bg-red-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: `${(opponentHP / currentOpponent.stats.health) * 100}%` }}
                      className="bg-red-500 h-3 rounded-full"
                    />
                  </div>
                </div>

                {/* Energy Bar */}
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

                {/* Team indicator */}
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

              {/* VS */}
              <div className="text-center text-2xl font-bold text-gray-400 my-2">��️</div>

              {/* Player */}
              <div className="bg-blue-50 rounded-2xl p-4 relative">
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
                    <div className="text-xs text-gray-600">Your Insect</div>
                    <div className="font-bold">{selectedInsect.insect.name}</div>
                    <Badge className="text-xs mt-1" style={{ backgroundColor: RARITY_COLORS[selectedInsect.insect.rarity] }}>
                      {selectedInsect.insect.rarity}
                    </Badge>
                  </div>
                </div>

                {/* HP Bar */}
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

                {/* Energy Bar */}
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
                
                {/* Equipped Skills */}
                {normalSkills.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-600">Normal Skills</div>
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
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-600">Ultimate Skill</div>
                    <Button
                      onClick={() => executeSkillAttack(ultimateSkill)}
                      disabled={playerEnergy < ultimateSkill.energyCost}
                      className="w-full flex items-center justify-between"
                      style={{ 
                        backgroundColor: playerEnergy >= ultimateSkill.energyCost ? '#f59e0b' : '#9ca3af',
                        opacity: playerEnergy >= ultimateSkill.energyCost ? 1 : 0.5
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
                  </div>
                )}

                {/* Basic Attack */}
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
                Opponent's Turn...
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
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="text-8xl mb-4"
                  >
                    🏆
                  </motion.div>
                  <h2 className="text-3xl font-bold text-green-600 mb-2">Victory!</h2>
                  <p className="text-gray-600 mb-6">You defeated {opponentName}!</p>
                  
                  {stage && (
                    <div className="bg-purple-50 rounded-xl p-4 mb-6">
                      <div className="text-sm font-semibold text-purple-900 mb-3">Rewards</div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Badge className="bg-purple-500 text-white">
                          🎲 {stage.rewards.rolls} Rolls
                        </Badge>
                        {stage.rewards.potions?.luck && (
                          <Badge className="bg-green-500 text-white">
                            🍀 {stage.rewards.potions.luck} Luck
                          </Badge>
                        )}
                        {stage.rewards.potions?.xp && (
                          <Badge className="bg-blue-500 text-white">
                            ⭐ {stage.rewards.potions.xp} XP
                          </Badge>
                        )}
                        {stage.rewards.potions?.energy && (
                          <Badge className="bg-yellow-500 text-white">
                            ⚡ {stage.rewards.potions.energy} Energy
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {world && stage && world.stages.findIndex(s => s.id === stageId) < world.stages.length - 1 && (
                      <Button
                        onClick={onExit}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500"
                      >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        Next Stage
                      </Button>
                    )}
                    <Button onClick={onExit} variant="outline" className="w-full">
                      Back to World Map
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-8xl mb-4">💔</div>
                  <h2 className="text-3xl font-bold text-red-600 mb-2">Defeat</h2>
                  <p className="text-gray-600 mb-6">{opponentName} won this time...</p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        setPhase('selection');
                        setWinner(null);
                        setSelectedInsect(null);
                        setBattleLog([]);
                      }}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500"
                    >
                      Try Again
                    </Button>
                    <Button onClick={onExit} variant="outline" className="w-full">
                      Back to World Map
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