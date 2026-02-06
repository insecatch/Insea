import { useState } from 'react';
import { WORLDS, getAllWorldProgress, isWorldUnlocked, isStageUnlocked, getWorldCompletionPercentage } from '@/app/data/worldData';
import { storage } from '@/app/utils/storage';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Lock, Star, Trophy, ChevronRight, Check, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WorldMapProps {
  onStartBattle: (worldId: number, stageId: number) => void;
}

export function WorldMap({ onStartBattle }: WorldMapProps) {
  const [selectedWorld, setSelectedWorld] = useState<number | null>(null);
  const profile = storage.getProfile();
  const progress = getAllWorldProgress();

  const selectedWorldData = selectedWorld ? WORLDS.find(w => w.id === selectedWorld) : null;

  return (
    <div className="p-4 pb-24">
      <AnimatePresence mode="wait">
        {!selectedWorld ? (
          <motion.div
            key="world-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">World Map</h2>
              <p className="text-sm text-gray-600">
                Complete stages to progress through different worlds
              </p>
            </div>

            <div className="space-y-4">
              {WORLDS.map((world, index) => {
                const unlocked = isWorldUnlocked(world.id, profile.rank);
                const completion = getWorldCompletionPercentage(world.id);
                const isComplete = completion === 100;

                return (
                  <motion.div
                    key={world.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`rounded-2xl overflow-hidden shadow-lg ${
                      unlocked ? 'cursor-pointer hover:shadow-xl' : 'opacity-75'
                    } transition-all`}
                    onClick={() => unlocked && setSelectedWorld(world.id)}
                    style={{
                      background: unlocked
                        ? `linear-gradient(135deg, ${world.color}22, ${world.color}44)`
                        : 'linear-gradient(135deg, #64748b22, #64748b44)'
                    }}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-5xl">{world.emoji}</div>
                          <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                              {world.name}
                              {isComplete && (
                                <Badge className="bg-yellow-500 text-white">
                                  <Trophy className="w-3 h-3 mr-1" />
                                  Complete
                                </Badge>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">{world.description}</p>
                          </div>
                        </div>
                        {!unlocked && (
                          <Lock className="w-6 h-6 text-gray-500" />
                        )}
                        {unlocked && (
                          <ChevronRight className="w-6 h-6" style={{ color: world.color }} />
                        )}
                      </div>

                      {/* Progress Bar */}
                      {unlocked && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-600">
                              Progress
                            </span>
                            <span className="text-xs font-bold" style={{ color: world.color }}>
                              {completion}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${completion}%` }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="h-2 rounded-full"
                              style={{ backgroundColor: world.color }}
                            />
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            {progress[world.id]?.length || 0} / {world.stages.length} stages completed
                          </div>
                        </div>
                      )}

                      {/* Unlock Requirements */}
                      {!unlocked && (
                        <div className="mt-4 bg-white/50 rounded-lg p-3">
                          <div className="text-xs font-semibold text-gray-700 mb-1">
                            Unlock Requirements:
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            {world.unlockRequirement.rank && (
                              <div>• Reach Rank {world.unlockRequirement.rank}</div>
                            )}
                            {world.unlockRequirement.previousWorldCompleted && (
                              <div>
                                • Complete{' '}
                                {WORLDS.find(w => w.id === world.unlockRequirement.previousWorldCompleted)?.name}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="stage-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {selectedWorldData && (
              <>
                {/* World Header */}
                <div className="mb-6">
                  <Button
                    onClick={() => setSelectedWorld(null)}
                    variant="ghost"
                    size="sm"
                    className="mb-3"
                  >
                    ← Back to Worlds
                  </Button>
                  
                  <div
                    className="rounded-2xl p-6 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${selectedWorldData.color}22, ${selectedWorldData.color}44)`
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-5xl">{selectedWorldData.emoji}</div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedWorldData.name}</h2>
                        <p className="text-sm text-gray-600">{selectedWorldData.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 text-sm font-semibold" style={{ color: selectedWorldData.color }}>
                      {progress[selectedWorldData.id]?.length || 0} / {selectedWorldData.stages.length} Stages Completed
                    </div>
                  </div>
                </div>

                {/* Stages */}
                <div className="space-y-3">
                  {selectedWorldData.stages.map((stage, index) => {
                    const unlocked = isStageUnlocked(selectedWorldData.id, stage.id, profile.rank);
                    const completed = progress[selectedWorldData.id]?.includes(stage.id) || false;
                    
                    // Difficulty stars
                    const stars = Math.min(5, Math.ceil(stage.difficulty / 4));

                    return (
                      <motion.div
                        key={stage.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`bg-white rounded-xl shadow-md overflow-hidden ${
                          unlocked && !completed ? 'ring-2' : ''
                        }`}
                        style={{
                          ringColor: unlocked && !completed ? selectedWorldData.color : 'transparent'
                        }}
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                                style={{
                                  backgroundColor: completed ? selectedWorldData.color : unlocked ? `${selectedWorldData.color}22` : '#e5e7eb',
                                  color: completed ? 'white' : unlocked ? selectedWorldData.color : '#9ca3af'
                                }}
                              >
                                {completed ? <Check className="w-6 h-6" /> : stage.id}
                              </div>
                              <div>
                                <h3 className="font-bold flex items-center gap-2">
                                  {stage.name}
                                  {!unlocked && <Lock className="w-4 h-4 text-gray-400" />}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center">
                                    {Array.from({ length: stars }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className="w-3 h-3"
                                        fill={selectedWorldData.color}
                                        stroke={selectedWorldData.color}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    Difficulty {stage.difficulty}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {completed && (
                              <Badge className="bg-green-500 text-white">
                                Cleared
                              </Badge>
                            )}
                          </div>

                          {/* Stage Info */}
                          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                            <div className="bg-gray-50 rounded-lg p-2">
                              <div className="text-gray-500">Opponent Level</div>
                              <div className="font-bold text-sm">Lv. {stage.opponentLevel}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                              <div className="text-gray-500">Enemy Team</div>
                              <div className="font-bold text-sm">{stage.opponentCount} insects</div>
                            </div>
                          </div>

                          {/* Rewards */}
                          <div className="bg-purple-50 rounded-lg p-3 mb-3">
                            <div className="text-xs font-semibold text-purple-900 mb-2">
                              Rewards:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="bg-white">
                                🎲 {stage.rewards.rolls} Rolls
                              </Badge>
                              {stage.rewards.potions?.luck && (
                                <Badge variant="outline" className="bg-white">
                                  🍀 {stage.rewards.potions.luck} Luck
                                </Badge>
                              )}
                              {stage.rewards.potions?.xp && (
                                <Badge variant="outline" className="bg-white">
                                  ⭐ {stage.rewards.potions.xp} XP
                                </Badge>
                              )}
                              {stage.rewards.potions?.energy && (
                                <Badge variant="outline" className="bg-white">
                                  ⚡ {stage.rewards.potions.energy} Energy
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          {unlocked ? (
                            <Button
                              onClick={() => onStartBattle(selectedWorldData.id, stage.id)}
                              className="w-full"
                              style={{
                                backgroundColor: selectedWorldData.color,
                                opacity: completed ? 0.7 : 1
                              }}
                            >
                              <Flame className="w-4 h-4 mr-2" />
                              {completed ? 'Battle Again' : 'Start Battle'}
                            </Button>
                          ) : (
                            <div className="bg-gray-100 rounded-lg p-3 text-center text-sm text-gray-600">
                              {stage.requiredRank > profile.rank ? (
                                <>Requires Rank {stage.requiredRank}</>
                              ) : (
                                <>Complete previous stage to unlock</>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
