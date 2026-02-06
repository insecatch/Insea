import { useState } from 'react';
import { INSECT_DATABASE, Insect, RARITY_COLORS, RARITY_LABELS, TYPE_COLORS, TYPE_LABELS } from '@/app/data/insectDatabase';
import { getInsectUniqueAbility } from '@/app/data/uniqueAbilities';
import { getInsectPassives } from '@/app/data/passiveAbilities';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { BookOpen, Search, X, Info, Sparkles, Shield, Zap, MapPin, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function InsectEncyclopedia() {
  const [selectedInsect, setSelectedInsect] = useState<Insect | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'good' | 'bad' | 'dangerous'>('all');

  const filteredInsects = INSECT_DATABASE.filter(insect => {
    const matchesSearch = insect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insect.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || insect.type === filterType;
    return matchesSearch && matchesType;
  });

  const uniqueAbility = selectedInsect ? getInsectUniqueAbility(selectedInsect.id) : null;
  const passiveAbilities = selectedInsect ? getInsectPassives(selectedInsect.id) : [];

  return (
    <div className="p-4 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl p-6 text-white mb-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Insect Encyclopedia</h1>
        </div>
        <p className="text-sm opacity-90">
          Learn about real insects and their fascinating behaviors!
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or scientific name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 py-6 text-base rounded-2xl"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            onClick={() => setFilterType('all')}
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            className="whitespace-nowrap"
          >
            All ({INSECT_DATABASE.length})
          </Button>
          <Button
            onClick={() => setFilterType('good')}
            variant={filterType === 'good' ? 'default' : 'outline'}
            size="sm"
            className="whitespace-nowrap"
          >
            Beneficial
          </Button>
          <Button
            onClick={() => setFilterType('bad')}
            variant={filterType === 'bad' ? 'default' : 'outline'}
            size="sm"
            className="whitespace-nowrap"
          >
            Pests
          </Button>
          <Button
            onClick={() => setFilterType('dangerous')}
            variant={filterType === 'dangerous' ? 'default' : 'outline'}
            size="sm"
            className="whitespace-nowrap"
          >
            Dangerous
          </Button>
        </div>
      </div>

      {/* Insect Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {filteredInsects.map((insect) => (
          <motion.div
            key={insect.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedInsect(insect)}
            className="bg-white rounded-2xl p-4 shadow-md border-2 cursor-pointer hover:shadow-lg transition-shadow"
            style={{ borderColor: RARITY_COLORS[insect.rarity] }}
          >
            <div className="text-4xl mb-2 text-center">{insect.emoji}</div>
            <h3 className="font-bold text-sm text-center mb-1">{insect.name}</h3>
            <p className="text-xs text-gray-500 text-center italic mb-2">{insect.scientificName}</p>
            <div className="flex gap-1 justify-center">
              <Badge
                style={{ backgroundColor: TYPE_COLORS[insect.type] }}
                className="text-white text-xs"
              >
                {TYPE_LABELS[insect.type]}
              </Badge>
              <Badge
                style={{ backgroundColor: RARITY_COLORS[insect.rarity] }}
                className="text-white text-xs"
              >
                {RARITY_LABELS[insect.rarity]}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredInsects.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>No insects found matching your search.</p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedInsect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedInsect(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <ScrollArea className="h-full max-h-[90vh]">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-6xl">{selectedInsect.emoji}</div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedInsect.name}</h2>
                        <p className="text-gray-600 italic">{selectedInsect.scientificName}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge
                            style={{ backgroundColor: TYPE_COLORS[selectedInsect.type] }}
                            className="text-white"
                          >
                            {TYPE_LABELS[selectedInsect.type]}
                          </Badge>
                          <Badge
                            style={{ backgroundColor: RARITY_COLORS[selectedInsect.rarity] }}
                            className="text-white"
                          >
                            {RARITY_LABELS[selectedInsect.rarity]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedInsect(null)}
                    >
                      <X className="w-6 h-6" />
                    </Button>
                  </div>

                  {/* Warning Message */}
                  {selectedInsect.warningMessage && (
                    <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800 font-medium">
                          {selectedInsect.warningMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="bg-blue-50 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-blue-900">About This Insect</h3>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedInsect.description}
                    </p>
                  </div>

                  {/* Habitat */}
                  <div className="bg-green-50 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <h3 className="font-bold text-green-900">Habitat</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      {selectedInsect.habitat}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="bg-purple-50 rounded-2xl p-4 mb-4">
                    <h3 className="font-bold text-purple-900 mb-3">Base Stats</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedInsect.stats).map(([stat, value]) => (
                        <div key={stat} className="bg-white rounded-xl p-3">
                          <div className="text-xs text-gray-500 uppercase mb-1">
                            {stat}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-lg font-bold text-purple-900">{value}</div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-purple-500 h-full"
                                style={{ width: `${Math.min((value / 200) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Unique Ability */}
                  {uniqueAbility && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 mb-4 border-2 border-amber-300">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                        <h3 className="font-bold text-amber-900">Unique Ability</h3>
                        <Badge className="bg-amber-600 text-white text-xs">
                          Species-Specific
                        </Badge>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{uniqueAbility.icon}</span>
                          <h4 className="font-bold text-lg">{uniqueAbility.name}</h4>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {uniqueAbility.description}
                        </p>
                        <div className="text-xs text-gray-600 bg-white rounded-lg p-2">
                          <span className="font-semibold">Cooldown:</span> {uniqueAbility.cooldown} turns
                        </div>
                      </div>
                      <div className="bg-amber-100/50 rounded-xl p-3">
                        <div className="text-xs font-semibold text-amber-900 mb-1 flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          Real-Life Behavior:
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {uniqueAbility.realLifeBehavior}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Passive Abilities */}
                  {passiveAbilities.length > 0 && (
                    <div className="bg-indigo-50 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-bold text-indigo-900">Natural Passive Abilities</h3>
                      </div>
                      <div className="space-y-2">
                        {passiveAbilities.map((passive) => (
                          <div key={passive.id} className="bg-white rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{passive.icon}</span>
                              <h4 className="font-bold text-sm">{passive.name}</h4>
                            </div>
                            <p className="text-xs text-gray-600">
                              {passive.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Educational Note */}
                  <div className="mt-6 bg-gradient-to-r from-blue-100 to-green-100 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-blue-900 mb-1">Did You Know?</h4>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          This encyclopedia is designed to help you learn about real insects and their behaviors. 
                          {selectedInsect.type === 'good' && " This insect is beneficial to ecosystems and humans, helping with pollination, pest control, or soil health."}
                          {selectedInsect.type === 'bad' && " While considered a pest, this insect plays a role in nature's balance. Understanding them helps us manage them better."}
                          {selectedInsect.type === 'dangerous' && " This insect can be dangerous to humans. Always maintain a safe distance and never attempt to handle dangerous insects in real life."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
