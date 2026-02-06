import { useState } from 'react';
import { CapturedInsect } from '@/app/utils/storage';
import { getActiveEvents, SpecialEvent, EventChallenge, saveEventProgress, getEventProgress, getEventCompletionCount } from '@/app/data/eventData';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Calendar, Trophy, Lock, CheckCircle, Star, Flame, Zap, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EventBattle } from '@/app/components/EventBattle';

interface EventsProps {
  collection: CapturedInsect[];
  onUpdate: () => void;
}

export function Events({ collection, onUpdate }: EventsProps) {
  const [selectedEvent, setSelectedEvent] = useState<SpecialEvent | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<EventChallenge | null>(null);
  const [showBattle, setShowBattle] = useState(false);

  const activeEvents = getActiveEvents();

  const handleStartChallenge = (event: SpecialEvent, challenge: EventChallenge) => {
    setSelectedEvent(event);
    setSelectedChallenge(challenge);
    setShowBattle(true);
  };

  const handleBattleComplete = (won: boolean) => {
    if (won && selectedEvent && selectedChallenge) {
      saveEventProgress(selectedEvent.id, selectedChallenge.id, true);
      onUpdate();
    }
    setShowBattle(false);
    setSelectedChallenge(null);
  };

  if (showBattle && selectedEvent && selectedChallenge) {
    return (
      <EventBattle
        event={selectedEvent}
        challenge={selectedChallenge}
        collection={collection}
        onComplete={handleBattleComplete}
        onExit={() => {
          setShowBattle(false);
          setSelectedChallenge(null);
        }}
      />
    );
  }

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 text-white p-6 rounded-b-3xl shadow-lg mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="w-8 h-8" />
            Special Events
          </h1>
          <div className="text-5xl">🎉</div>
        </div>
        <p className="text-sm opacity-90">
          Limited-time challenges with exclusive rewards!
        </p>
      </div>

      <div className="p-4">
        {activeEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">No Active Events</h3>
            <p className="text-sm text-gray-500">Check back soon for new limited-time events!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeEvents.map((event) => {
              const daysLeft = getDaysRemaining(event.endDate);
              const completedCount = getEventCompletionCount(event.id);
              const totalChallenges = event.challenges.length;
              const isFullyCompleted = completedCount === totalChallenges;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden"
                >
                  {/* Event Header */}
                  <div
                    className={`bg-gradient-to-r ${event.gradient} text-white p-6`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-4xl">{event.emoji}</span>
                          <div>
                            <h2 className="text-2xl font-bold">{event.name}</h2>
                            <p className="text-xs opacity-90">{event.theme}</p>
                          </div>
                        </div>
                        <p className="text-sm opacity-95 mb-3">{event.description}</p>
                        
                        {/* Progress */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-white/20 rounded-full h-2 flex-1">
                            <div
                              className="bg-white h-2 rounded-full transition-all"
                              style={{ width: `${(completedCount / totalChallenges) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">
                            {completedCount}/{totalChallenges}
                          </span>
                        </div>

                        {isFullyCompleted && (
                          <Badge className="bg-yellow-400 text-yellow-900 font-bold">
                            <Trophy className="w-3 h-3 mr-1" />
                            COMPLETED
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
                          <div className="text-2xl font-bold">{daysLeft}</div>
                          <div className="text-xs">days left</div>
                        </div>
                      </div>
                    </div>

                    {/* Special Mechanics */}
                    {event.specialMechanics && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <div className="text-xs font-semibold mb-2 flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Special Rules
                        </div>
                        <div className="space-y-1">
                          {event.specialMechanics.slice(0, 3).map((mechanic, idx) => (
                            <div key={idx} className="text-xs flex items-start gap-1">
                              <span className="opacity-70">•</span>
                              <span className="opacity-90">{mechanic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Challenges */}
                  <div className="p-4 space-y-3">
                    {event.challenges.map((challenge, idx) => {
                      const isCompleted = getEventProgress(event.id, challenge.id);
                      const isLocked = idx > 0 && !getEventProgress(event.id, event.challenges[idx - 1].id);

                      return (
                        <motion.div
                          key={challenge.id}
                          whileHover={{ scale: isLocked ? 1 : 1.02 }}
                          className={`rounded-2xl p-4 border-2 transition-all ${
                            isCompleted
                              ? 'bg-green-50 border-green-300'
                              : isLocked
                              ? 'bg-gray-50 border-gray-200 opacity-60'
                              : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 cursor-pointer hover:shadow-lg'
                          }`}
                          onClick={() => {
                            if (!isLocked && !isCompleted) {
                              handleStartChallenge(event, challenge);
                            }
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                                {isLocked && <Lock className="w-5 h-5 text-gray-400" />}
                                <h3 className="font-bold text-lg">{challenge.name}</h3>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                              
                              {/* Difficulty */}
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  <Flame className="w-3 h-3 mr-1" />
                                  Difficulty: {challenge.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {challenge.requirement}
                                </Badge>
                              </div>

                              {/* Special Rules */}
                              <div className="bg-white/50 rounded-lg p-2 mb-2">
                                <div className="text-xs font-semibold mb-1 text-purple-900">Special Rules:</div>
                                {challenge.specialRules.map((rule, rIdx) => (
                                  <div key={rIdx} className="text-xs text-gray-700">
                                    • {rule}
                                  </div>
                                ))}
                              </div>

                              {/* Rewards */}
                              <div className="flex flex-wrap gap-2">
                                <Badge className="bg-purple-500 text-white text-xs">
                                  🎲 {challenge.rewards.rolls} Rolls
                                </Badge>
                                {challenge.rewards.potions?.luck && (
                                  <Badge className="bg-green-500 text-white text-xs">
                                    🍀 {challenge.rewards.potions.luck}
                                  </Badge>
                                )}
                                {challenge.rewards.potions?.xp && (
                                  <Badge className="bg-blue-500 text-white text-xs">
                                    ⭐ {challenge.rewards.potions.xp}
                                  </Badge>
                                )}
                                {challenge.rewards.potions?.energy && (
                                  <Badge className="bg-yellow-500 text-white text-xs">
                                    ⚡ {challenge.rewards.potions.energy}
                                  </Badge>
                                )}
                                {challenge.rewards.exclusiveReward && (
                                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold">
                                    <Gift className="w-3 h-3 mr-1" />
                                    {challenge.rewards.exclusiveReward}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          {!isLocked && !isCompleted && (
                            <Button
                              className={`w-full mt-3 bg-gradient-to-r ${event.gradient}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartChallenge(event, challenge);
                              }}
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              Start Challenge
                            </Button>
                          )}
                          
                          {isCompleted && (
                            <div className="text-center mt-3 text-green-600 font-semibold text-sm">
                              ✓ Completed
                            </div>
                          )}
                          
                          {isLocked && (
                            <div className="text-center mt-3 text-gray-500 text-sm">
                              🔒 Complete previous challenge to unlock
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Event Completion Bonus */}
                  {isFullyCompleted && (
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 border-t-2 border-yellow-400">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-yellow-900 mb-1 flex items-center gap-2">
                            <Trophy className="w-5 h-5" />
                            Event Completed!
                          </div>
                          <div className="text-sm text-yellow-800">
                            {event.rewards.exclusiveTitle && (
                              <span className="font-semibold">Title: {event.rewards.exclusiveTitle}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-4xl">{event.rewards.exclusiveBadge || '🏆'}</div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
