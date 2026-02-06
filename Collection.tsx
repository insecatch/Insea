import { useState, useMemo, useEffect } from 'react';
import { storage, CapturedInsect } from '@/app/utils/storage';
import { RARITY_COLORS, RARITY_LABELS, TYPE_LABELS } from '@/app/data/insectDatabase';
import { SKILL_DATABASE, BASIC_ATTACK, Skill, SKILL_RARITY_COLORS } from '@/app/data/skillDatabase';
import { PASSIVE_ABILITIES } from '@/app/data/passiveAbilities';
import { Trash2, Trophy, TrendingUp, Swords, X, Plus, Shield, ArrowUp, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/app/components/ui/badge';
import { toast } from 'sonner';

interface CollectionProps {
  onUpdate: () => void;
}

export function Collection({ onUpdate }: CollectionProps) {
  const [collection, setCollection] = useState<CapturedInsect[]>([]);
  const [selectedInsect, setSelectedInsect] = useState<CapturedInsect | null>(null);
  const [filter, setFilter] = useState<'all' | 'good' | 'bad' | 'dangerous'>('all');
  const [showSkills, setShowSkills] = useState(false);
  const [showPassives, setShowPassives] = useState(false);
  const [ownedSkills, setOwnedSkills] = useState<string[]>([]);

  // Load data on mount
  useEffect(() => {
    try {
      setCollection(storage.getCollection());
      setOwnedSkills(storage.getOwnedSkills().map(s => s.skillId));
    } catch (error) {
      console.error('Error loading collection:', error);
      setCollection([]);
      setOwnedSkills([]);
    }
  }, []);

  const refreshData = () => {
    setCollection(storage.getCollection());
    setOwnedSkills(storage.getOwnedSkills().map(s => s.skillId));
    onUpdate();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to release this insect?')) {
      storage.removeFromCollection(id);
      setSelectedInsect(null);
      refreshData();
    }
  };

  const getSkillById = (skillId: string): Skill | null => {
    return SKILL_DATABASE.find(s => s.id === skillId) || null;
  };

  const handleEquipSkill = (skillId: string, type: 'normal' | 'ultimate') => {
    if (!selectedInsect) return;
    storage.equipSkill(selectedInsect.id, skillId, type);
    refreshData();
    const updated = storage.getCollection().find(c => c.id === selectedInsect.id);
    if (updated) setSelectedInsect(updated);
  };

  const handleUnequipSkill = (skillId: string) => {
    if (!selectedInsect) return;
    storage.unequipSkill(selectedInsect.id, skillId);
    refreshData();
    const updated = storage.getCollection().find(c => c.id === selectedInsect.id);
    if (updated) setSelectedInsect(updated);
  };

  const filteredCollection = filter === 'all'
    ? collection
    : collection.filter(c => c.insect.type === filter);

  const uniqueCount = new Set(collection.map(c => c.insect.id)).size;
  const rarityCount = collection.reduce((acc, c) => {
    acc[c.insect.rarity] = (acc[c.insect.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const equippedNormalSkills = selectedInsect?.equippedSkills?.normal || [];
  const equippedUltimateSkill = selectedInsect?.equippedSkills?.ultimate;
  
  const ownedNormalSkills = ownedSkills
    .map(id => getSkillById(id))
    .filter((s): s is Skill => s !== null && s.type === 'normal' && !equippedNormalSkills.includes(s.id));
  
  const ownedUltimateSkills = ownedSkills
    .map(id => getSkillById(id))
    .filter((s): s is Skill => s !== null && s.type === 'ultimate' && s.id !== equippedUltimateSkill);

  return (
    <div className="p-4 pb-24">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white">
          <Trophy className="w-6 h-6 mb-2 opacity-75" />
          <div className="text-2xl font-bold">{collection.length}</div>
          <div className="text-xs opacity-90">Total Caught</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
          <TrendingUp className="w-6 h-6 mb-2 opacity-75" />
          <div className="text-2xl font-bold">{uniqueCount}</div>
          <div className="text-xs opacity-90">Species</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-white">
          <Trophy className="w-6 h-6 mb-2 opacity-75" />
          <div className="text-2xl font-bold">{rarityCount.legendary || 0}</div>
          <div className="text-xs opacity-90">Legendary</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          className="whitespace-nowrap"
        >
          All ({collection.length})
        </Button>
        <Button
          onClick={() => setFilter('good')}
          variant={filter === 'good' ? 'default' : 'outline'}
          size="sm"
          className="whitespace-nowrap"
        >
          Beneficial ({collection.filter(c => c.insect.type === 'good').length})
        </Button>
        <Button
          onClick={() => setFilter('bad')}
          variant={filter === 'bad' ? 'default' : 'outline'}
          size="sm"
          className="whitespace-nowrap"
        >
          Pests ({collection.filter(c => c.insect.type === 'bad').length})
        </Button>
        <Button
          onClick={() => setFilter('dangerous')}
          variant={filter === 'dangerous' ? 'default' : 'outline'}
          size="sm"
          className="whitespace-nowrap"
        >
          Dangerous ({collection.filter(c => c.insect.type === 'dangerous').length})
        </Button>
      </div>

      {/* Collection Grid */}
      {filteredCollection.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Trophy className="w-16 h-16 mx-auto mb-4 opacity-25" />
          <p className="text-lg font-medium">No insects yet</p>
          <p className="text-sm">Start capturing to build your collection!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredCollection.map((captured, index) => (
            <motion.div
              key={captured.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setSelectedInsect(captured);
                setShowSkills(false);
                setShowPassives(false);
              }}
              className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div
                className="h-32 bg-gradient-to-br flex items-center justify-center relative"
                style={{
                  background: captured.insect.rarity === 'exotic'
                    ? 'linear-gradient(135deg, #ffffff 0%, #f0f0ff 15%, #ffe0f0 30%, #fff0e0 45%, #f0ffe0 60%, #e0f0ff 75%, #f0e0ff 90%, #ffffff 100%)'
                    : `linear-gradient(135deg, ${RARITY_COLORS[captured.insect.rarity]}22, ${RARITY_COLORS[captured.insect.rarity]}44)`
                }}
              >
                <div className="text-5xl">
                  {captured.insect.emoji}
                </div>
                {captured.equippedSkills && (captured.equippedSkills.normal.length > 0 || captured.equippedSkills.ultimate) && (
                  <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    <Swords className="w-3 h-3" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-sm line-clamp-1">{captured.insect.name}</h3>
                  <Badge
                    variant="outline"
                    className="text-xs px-1.5 py-0"
                    style={{
                      borderColor: RARITY_COLORS[captured.insect.rarity],
                      color: RARITY_COLORS[captured.insect.rarity]
                    }}
                  >
                    {RARITY_LABELS[captured.insect.rarity]}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 italic line-clamp-1">
                  {captured.insect.scientificName}
                </p>
                <div className="grid grid-cols-4 gap-1 mt-2">
                  {(['attack', 'defense', 'speed', 'health'] as const).map(stat => (
                    <div key={stat} className="text-center">
                      <div className="text-xs text-gray-400 uppercase">
                        {stat.substring(0, 3)}
                      </div>
                      <div className="text-sm font-bold">{captured.insect.stats[stat]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}\
</div>
      )}

      {/* Compact Detail Modal */}
      <AnimatePresence>
        {selectedInsect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2"
            onClick={() => setSelectedInsect(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg max-h-[95vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Compact Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 flex items-center gap-3">
                <div className="text-4xl shrink-0">
                  {selectedInsect.insect.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold truncate">{selectedInsect.insect.name}</h2>
                  <p className="text-xs opacity-90 truncate">{selectedInsect.insect.scientificName}</p>
                  <div className="flex gap-1 mt-1">
                    <Badge className="text-xs px-1.5 py-0" style={{ backgroundColor: RARITY_COLORS[selectedInsect.insect.rarity] }}>
                      {RARITY_LABELS[selectedInsect.insect.rarity]}
                    </Badge>
                    <Badge className="bg-amber-500 text-xs px-1.5 py-0">Lv.{selectedInsect.level || 1}</Badge>
                  </div>
                </div>
                <Button onClick={() => setSelectedInsect(null)} variant="ghost" size="icon" className="text-white hover:bg-white/20 shrink-0">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 p-3 space-y-3">
                {/* UPGRADE SECTION - TOP PRIORITY */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-3 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold flex items-center gap-1.5">
                      <ArrowUp className="w-4 h-4" />
                      Upgrade
                    </h3>
                    <div className="text-right">
                      <div className="text-xs opacity-90">Coins</div>
                      <div className="font-bold">{storage.getCoins()}</div>
                    </div>
                  </div>

                  {selectedInsect.level && selectedInsect.level < 100 ? (
                    <>
                      {(() => {
                        const currentExp = selectedInsect.experience || 0;
                        const expNeeded = storage.getExpForLevel((selectedInsect.level || 1) + 1);
                        const expPercent = Math.min(100, (currentExp / expNeeded) * 100);
                        const scaledStats = storage.getInsectStats(selectedInsect);
                        
                        return (
                          <>
                            <div className="grid grid-cols-4 gap-1.5 mb-2">
                              {Object.entries(scaledStats).map(([key, value]) => (
                                <div key={key} className="bg-white/20 rounded p-1.5 text-center">
                                  <div className="text-xs opacity-75 uppercase text-[10px]">{key.substring(0, 3)}</div>
                                  <div className="font-bold text-sm">{value}</div>
                                </div>
                              ))}
                            </div>
                            <div className="text-xs mb-1">EXP: {currentExp}/{expNeeded} ({Math.floor(expPercent)}%)</div>
                            <div className="w-full bg-amber-900/30 rounded-full h-1.5 mb-2">
                              <div className="bg-white h-1.5 rounded-full" style={{ width: `${expPercent}%` }} />
                            </div>
                            <Button
                              onClick={() => {
                                const result = storage.upgradeInsect(selectedInsect.id);
                                if (result.success) {
                                  toast.success(result.message);
                                  refreshData();
                                  const updated = storage.getCollection().find(c => c.id === selectedInsect.id);
                                  if (updated) setSelectedInsect(updated);
                                } else {
                                  toast.error(result.message);
                                }
                              }}
                              className="w-full bg-white text-amber-600 hover:bg-amber-50 font-bold h-8 text-sm"
                            >
                              <ArrowUp className="w-3 h-3 mr-1" />
                              Upgrade ({storage.getUpgradeCost(selectedInsect.level || 1)} coins)
                            </Button>
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    <div className="bg-white/20 rounded p-2 text-center text-xs font-bold">⭐ MAX LEVEL ⭐</div>
                  )}
                </div>

                {/* Info Row */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="font-semibold text-gray-500 mb-0.5">Type</div>
                    <div>{TYPE_LABELS[selectedInsect.insect.type]}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="font-semibold text-gray-500 mb-0.5">Captured</div>
                    <div>{new Date(selectedInsect.capturedAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-blue-50 rounded-lg p-2 text-xs border border-blue-200">
                  {selectedInsect.insect.description}
                </div>

                {/* Skills - Collapsible */}
                <div className="bg-purple-50 rounded-lg p-2 border border-purple-200">
                  <button
                    onClick={() => setShowSkills(!showSkills)}
                    className="w-full flex items-center justify-between text-sm font-bold mb-2"
                  >
                    <span className="flex items-center gap-1.5">
                      <Swords className="w-3.5 h-3.5 text-purple-600" />
                      Skills ({equippedNormalSkills.length + (equippedUltimateSkill ? 1 : 0)}/4)
                    </span>
                    {showSkills ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  {showSkills && (
                    <div className="space-y-1.5 text-xs">
                      {/* Basic */}
                      <div className="bg-gray-100 rounded p-1.5 flex items-center gap-2">
                        <span className="text-base">{BASIC_ATTACK.icon}</span>
                        <span className="flex-1 font-semibold truncate">{BASIC_ATTACK.name}</span>
                        <Badge variant="outline" className="text-[10px] h-4">Basic</Badge>
                      </div>
                      
                      {/* Normal Skills */}
                      {equippedNormalSkills.map(skillId => {
                        const skill = getSkillById(skillId);
                        if (!skill) return null;
                        return (
                          <div key={skillId} className="rounded p-1.5 flex items-center gap-2" style={{ backgroundColor: `${SKILL_RARITY_COLORS[skill.rarity]}22`, border: `1px solid ${SKILL_RARITY_COLORS[skill.rarity]}` }}>
                            <span className="text-base">{skill.icon}</span>
                            <span className="flex-1 font-semibold truncate">{skill.name}</span>
                            <Button onClick={() => handleUnequipSkill(skillId)} size="sm" variant="ghost" className="h-5 w-5 p-0">
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        );
                      })}
                      
                      {/* Add slots */}
                      {equippedNormalSkills.length < 3 && ownedNormalSkills.length > 0 && (
                        <div className="pt-1 border-t space-y-1">
                          {ownedNormalSkills.slice(0, 2).map(skill => (
                            <div key={skill.id} className="rounded p-1.5 flex items-center gap-2 cursor-pointer hover:shadow" style={{ backgroundColor: `${SKILL_RARITY_COLORS[skill.rarity]}11`, border: `1px solid ${SKILL_RARITY_COLORS[skill.rarity]}` }} onClick={() => handleEquipSkill(skill.id, 'normal')}>
                              <span className="text-base">{skill.icon}</span>
                              <span className="flex-1 truncate">{skill.name}</span>
                              <Plus className="w-3 h-3 text-green-600" />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Ultimate */}
                      <div className="pt-1 border-t">
                        {equippedUltimateSkill ? (
                          (() => {
                            const skill = getSkillById(equippedUltimateSkill);
                            if (!skill) return null;
                            return (
                              <div className="rounded p-1.5 flex items-center gap-2" style={{ backgroundColor: `${SKILL_RARITY_COLORS[skill.rarity]}22`, border: `2px solid ${SKILL_RARITY_COLORS[skill.rarity]}` }}>
                                <Shield className="w-3.5 h-3.5" />
                                <span className="text-base">{skill.icon}</span>
                                <span className="flex-1 font-semibold truncate">{skill.name}</span>
                                <Button onClick={() => handleUnequipSkill(equippedUltimateSkill)} size="sm" variant="ghost" className="h-5 w-5 p-0">
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            );
                          })()
                        ) : ownedUltimateSkills.length > 0 ? (
                          <div className="rounded p-1.5 flex items-center gap-2 cursor-pointer hover:shadow" style={{ backgroundColor: `${SKILL_RARITY_COLORS[ownedUltimateSkills[0].rarity]}11`, border: `1px solid ${SKILL_RARITY_COLORS[ownedUltimateSkills[0].rarity]}` }} onClick={() => handleEquipSkill(ownedUltimateSkills[0].id, 'ultimate')}>
                            <Shield className="w-3.5 h-3.5" />
                            <span className="text-base">{ownedUltimateSkills[0].icon}</span>
                            <span className="flex-1 truncate">{ownedUltimateSkills[0].name}</span>
                            <Plus className="w-3 h-3 text-green-600" />
                          </div>
                        ) : (
                          <div className="text-center text-gray-400 py-1">No ultimate skill</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Passives - Collapsible */}
                <div className="bg-indigo-50 rounded-lg p-2 border border-indigo-200">
                  <button
                    onClick={() => setShowPassives(!showPassives)}
                    className="w-full flex items-center justify-between text-sm font-bold mb-2"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Passives ({selectedInsect.equippedPassives?.length || 0}/3)
                    </span>
                    {showPassives ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  {showPassives && (
                    <div className="space-y-1.5 text-xs">
                      {selectedInsect.equippedPassives && selectedInsect.equippedPassives.length > 0 ? (
                        selectedInsect.equippedPassives.map(passiveId => {
                          const passive = PASSIVE_ABILITIES[passiveId];
                          if (!passive) return null;
                          return (
                            <div key={passiveId} className="bg-white rounded p-1.5 flex items-center gap-2">
                              <span className="text-base">{passive.icon}</span>
                              <span className="flex-1 truncate font-semibold">{passive.name}</span>
                              <Button
                                onClick={() => {
                                  storage.unequipPassive(selectedInsect.id, passiveId);
                                  refreshData();
                                  const updated = storage.getCollection().find(c => c.id === selectedInsect.id);
                                  if (updated) setSelectedInsect(updated);
                                }}
                                size="sm"
                                variant="ghost"
                                className="h-5 w-5 p-0"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center text-gray-400 py-1">No passives equipped</div>
                      )}
                      
                      {(selectedInsect.equippedPassives?.length || 0) < 3 && storage.getOwnedPassives().length > 0 && (
                        <div className="pt-1 border-t space-y-1">
                          {storage.getOwnedPassives().filter(pId => !selectedInsect.equippedPassives?.includes(pId)).slice(0, 2).map(passiveId => {
                            const passive = PASSIVE_ABILITIES[passiveId];
                            if (!passive) return null;
                            return (
                              <div
                                key={passiveId}
                                className="bg-white rounded p-1.5 flex items-center gap-2 cursor-pointer hover:shadow"
                                onClick={() => {
                                  const success = storage.equipPassive(selectedInsect.id, passiveId);
                                  if (success) {
                                    refreshData();
                                    const updated = storage.getCollection().find(c => c.id === selectedInsect.id);
                                    if (updated) setSelectedInsect(updated);
                                  } else {
                                    toast.error('All slots full!');
                                  }
                                }}
                              >
                                <span className="text-base">{passive.icon}</span>
                                <span className="flex-1 truncate">{passive.name}</span>
                                <Plus className="w-3 h-3 text-green-600" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Delete */}
                <Button onClick={() => handleDelete(selectedInsect.id)} variant="destructive" size="sm" className="w-full h-8 text-xs">
                  <Trash2 className="w-3 h-3 mr-1" />
                  Release
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}