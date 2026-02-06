import { useState, useEffect } from 'react';
import { Camera, Trophy, Swords, User, Info, Gift, Award, Calendar, Bug, Coins } from 'lucide-react';
import { CameraCapture } from '@/app/components/CameraCapture';
import { Collection } from '@/app/components/Collection';
import { Battle } from '@/app/components/Battle';
import { Profile } from '@/app/components/Profile';
import { Achievements } from '@/app/components/Achievements';
import { DailyRewards } from '@/app/components/DailyRewards';
import { Events } from '@/app/components/Events';
import { InsectChest } from '@/app/components/InsectChest';
import { BattlePass } from '@/app/components/BattlePass';
import { UpdateLog } from '@/app/components/UpdateLog';
import { storage } from '@/app/utils/storage';
import { Button } from '@/app/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { WorldMap } from '@/app/components/WorldMap';
import { Toaster } from '@/app/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { InsectEncyclopedia } from '@/app/components/InsectEncyclopedia';
import { BookOpen } from 'lucide-react';

type Tab = 'home' | 'collection' | 'battle' | 'events' | 'rewards' | 'achievements' | 'profile' | 'encyclopedia';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showCamera, setShowCamera] = useState(false);
  const [collection, setCollection] = useState(storage.getCollection());
  const [profile, setProfile] = useState(storage.getProfile());
  const [showInfo, setShowInfo] = useState(false);
  const [battleStage, setBattleStage] = useState<{ worldId: number; stageId: number } | null>(null);
  const [showBattlePass, setShowBattlePass] = useState(false);

  const refreshData = () => {
    setCollection(storage.getCollection());
    setProfile(storage.getProfile());
  };

  const handleDelete = (id: string) => {
    storage.removeFromCollection(id);
    refreshData();
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Bug className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Insecatch</h1>
              <p className="text-xs text-gray-600">Catch & Battle</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-gray-600">Coins</div>
              <div className="font-bold text-lg text-amber-600 flex items-center gap-1">
                <Coins className="w-4 h-4" />
                {profile.coins || 0}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-600">Rank</div>
              <div className="font-bold text-lg text-purple-600">{profile.rank}</div>
            </div>
            <Button
              onClick={() => setShowInfo(true)}
              variant="ghost"
              size="icon"
            >
              <Info className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 pb-24"
            >
              {/* Welcome Card */}
              <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-500 rounded-3xl p-6 text-white mb-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{profile.avatarEmoji}</div>
                  <div>
                    <h2 className="text-2xl font-bold">Welcome back!</h2>
                    <p className="text-sm opacity-90">{profile.username}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 bg-white/10 rounded-2xl p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{collection.length}</div>
                    <div className="text-xs opacity-90">Captured</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{profile.battlesWon}</div>
                    <div className="text-xs opacity-90">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{profile.rank}</div>
                    <div className="text-xs opacity-90">Rank</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 mb-6">
                {/* Events Banner */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('events')}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white rounded-2xl p-4 shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-bl-xl font-bold text-xs">
                    NEW!
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Calendar className="w-8 h-8" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-bold text-lg">Special Events 🎉</div>
                      <div className="text-sm opacity-90">Limited-time challenges & rewards!</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCamera(true)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-bold text-lg">Start Hunting</div>
                      <div className="text-sm opacity-90">Use camera to capture insects</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('battle')}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Swords className="w-8 h-8" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-bold text-lg">Battle Arena</div>
                      <div className="text-sm opacity-90">Fight with AI opponents</div>
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* Insect Chest */}
              <InsectChest onUpdate={refreshData} />

              {/* Recent Captures */}
              {collection.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">Recent Captures</h3>
                    <Button
                      onClick={() => setActiveTab('collection')}
                      variant="ghost"
                      size="sm"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {collection.slice(0, 6).map((captured) => (
                      <div
                        key={captured.id}
                        className="bg-white rounded-xl p-3 shadow-md text-center"
                      >
                        <div className="text-3xl mb-1">
                          {captured.insect.emoji}
                        </div>
                        <div className="text-xs font-medium line-clamp-1">
                          {captured.insect.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {collection.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center shadow-md">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="font-bold text-lg mb-2">No Insects Yet</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Start your adventure by capturing your first insect!
                  </p>
                  <Button
                    onClick={() => setShowCamera(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Start Capturing
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'collection' && (
            <motion.div
              key="collection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Collection onUpdate={refreshData} />
            </motion.div>
          )}

          {activeTab === 'battle' && (
            <motion.div
              key="battle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {!battleStage ? (
                <WorldMap 
                  onStartBattle={(worldId, stageId) => {
                    setBattleStage({ worldId, stageId });
                  }}
                />
              ) : (
                <Battle 
                  collection={collection} 
                  onUpdate={refreshData}
                  worldId={battleStage.worldId}
                  stageId={battleStage.stageId}
                  onExit={() => setBattleStage(null)}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Events collection={collection} onUpdate={refreshData} />
            </motion.div>
          )}

          {activeTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DailyRewards />
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Achievements />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Profile profile={profile} onUpdate={refreshData} />
            </motion.div>
          )}

          {activeTab === 'encyclopedia' && (
            <motion.div
              key="encyclopedia"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <InsectEncyclopedia />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        {/* Battle Pass Floating Button */}
        <motion.button
          onClick={() => setShowBattlePass(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-20 left-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-2xl px-4 py-3 shadow-lg flex items-center gap-2 font-bold z-50"
        >
          <Trophy className="w-5 h-5" />
          <span className="text-sm">Battle Pass</span>
          <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs">
            FREE
          </span>
        </motion.button>

        <div className="grid grid-cols-6 gap-1 p-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors ${
              activeTab === 'home'
                ? 'bg-emerald-100 text-emerald-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Camera className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('collection')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors relative ${
              activeTab === 'collection'
                ? 'bg-emerald-100 text-emerald-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Trophy className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Bugs</span>
            {collection.length > 0 && (
              <span 
                className={`absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold ${
                  collection.length > 99 ? 'w-7 h-5 px-1' : collection.length > 9 ? 'w-6 h-5 px-1' : 'w-5 h-5'
                }`}
              >
                {collection.length > 99 ? '99+' : collection.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('encyclopedia')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors ${
              activeTab === 'encyclopedia'
                ? 'bg-emerald-100 text-emerald-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Learn</span>
          </button>
          <button
            onClick={() => setActiveTab('battle')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors ${
              activeTab === 'battle'
                ? 'bg-emerald-100 text-emerald-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Swords className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Battle</span>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors relative ${
              activeTab === 'events'
                ? 'bg-emerald-100 text-emerald-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Events</span>
            <span className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold animate-pulse">
              NEW
            </span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors ${
              activeTab === 'profile'
                ? 'bg-emerald-100 text-emerald-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={() => {
            setShowCamera(false);
            refreshData();
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Info Dialog */}
      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">Insecatch Info</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="about" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="overflow-y-auto flex-1 mt-4 space-y-4 text-sm">
              <p>
                Insecatch is an immersive insect collection and battle game. Use your camera to
                discover and capture insects in the wild!
              </p>
              
              <div>
                <h4 className="font-semibold mb-2">🎯 How to Play:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Use your camera to capture insects</li>
                  <li>• AI identifies the insect species automatically</li>
                  <li>• Collect rare insects to increase your rank</li>
                  <li>• Battle with AI opponents using your collection</li>
                  <li>• Watch out for dangerous insects!</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">⭐ Rarity Levels:</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#94a3b8' }}></div>
                    <span className="text-gray-600">Common - Easy to find</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }}></div>
                    <span className="text-gray-600">Uncommon - Fairly rare</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
                    <span className="text-gray-600">Rare - Hard to find</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#a855f7' }}></div>
                    <span className="text-gray-600">Epic - Very rare</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }}></div>
                    <span className="text-gray-600">Legendary - Extremely rare</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">🏆 Ranking System:</h4>
                <p className="text-gray-600">
                  Collect more insects to rank up! Your rank determines your status in the
                  Insecatch community. Reach Rank 10 to become an Ultimate Champion!
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-xs">
                  ⚠️ <strong>Safety Note:</strong> This app is for entertainment purposes. Always
                  be cautious around real insects, especially dangerous ones. Never attempt to
                  handle unfamiliar insects without proper knowledge and equipment.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="updates" className="overflow-y-auto flex-1 mt-4">
              <UpdateLog />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Battle Pass Modal */}
      {showBattlePass && (
        <BattlePass
          onClose={() => setShowBattlePass(false)}
          onUpdate={refreshData}
        />
      )}

      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;