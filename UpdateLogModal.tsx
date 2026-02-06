import { X, Copy, CheckCircle2, MessageSquare, Gamepad2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useState } from 'react';

interface UpdateLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateLogModal({ isOpen, onClose }: UpdateLogModalProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'ingame' | 'discord'>('ingame');

  if (!isOpen) return null;

  const discordUpdateLog = `🌳 INSECATCH UPDATE v2.5.0 - BATTLE PASS REVOLUTION! 🦜

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎨 COMPLETE BATTLE PASS REDESIGN

The Amazon Forest Battle Pass has been completely overhauled with a brand new visual identity and massively improved user experience!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ WHAT'S NEW:

🌅 Sunset Theme Colorway
• Replaced jungle green with warm Orange, Amber & Yellow gradients
• Daily Quests: Cyan/Blue accents for crystal-clear visibility
• Weekly Quests: Vibrant Pink/Rose highlights
• Premium Quests: Luxurious Golden Yellow shine
• All reward tiers updated with matching sunset palette

🗂️ Three-Tab Navigation System
• Overview Tab - Quick summary showing your top quests and progress
• Rainforest Quests Tab - All daily, weekly, and premium missions organized
• Jungle Rewards Tab - Clean reward tier progression system

🎁 Connected Reward System
• Premium and Free rewards now visually connected with gradient lines
• Separate "Claim Premium" and "Claim Free" buttons
• Clean, realistic card design with proper shadows and depth
• Each tier feels like one cohesive unit

🏆 Enhanced Visual Design
• Crown badge for Premium rewards
• Trophy badge for Free rewards
• BP requirement displayed on each tier
• Smooth animations and hover effects
• Backdrop blur for professional polish
• Color-coded glow effects (yellow for premium, orange for free)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛠️ TECHNICAL IMPROVEMENTS

✅ Fixed tier overlapping issues
✅ Improved container heights and spacing
✅ Better scroll behavior for horizontal reward track
✅ Enhanced mobile/tablet touch responsiveness
✅ Cleaner layout architecture
✅ Optimized rendering performance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 USER EXPERIENCE UPGRADES

• Easier navigation with intuitive three-tab system
• Quick access to ready-to-claim quests in Overview
• Better visual hierarchy for tracking progress
• Clearer separation between quest types
• Simplified reward claiming process
• Brawl Stars-inspired sideways scrolling rewards

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Enjoy the new Battle Pass experience! 🐛🌴
Good luck hunting in the Amazon Forest! 🦋✨`;

  const inGameUpdateLog = `INSECATCH v2.5.0 - BATTLE PASS REVOLUTION

═══════════════════════════════════════

🎨 COMPLETE BATTLE PASS REDESIGN

The Amazon Forest Battle Pass has been completely overhauled! We've replaced the old jungle green theme with a stunning new sunset colorway featuring warm orange, amber, and yellow gradients.

═══════════════════════════════════════

NEW FEATURES:

🌅 Sunset Theme Colorway
The entire battle pass now features a beautiful sunset-inspired color palette. Daily Quests have crystal-clear cyan/blue accents, Weekly Quests shine with vibrant pink/rose highlights, and Premium Quests glow with luxurious golden yellow tones.

🗂️ Three-Tab Navigation System
We've reorganized everything into three easy-to-navigate tabs:
  
  • Overview - See your top quests and overall progress at a glance
  • Rainforest Quests - Browse all your daily, weekly, and premium missions
  • Jungle Rewards - Track your reward tier progression

🎁 Connected Reward System
Premium and Free rewards are now visually connected with beautiful gradient lines, making it crystal clear what you're earning. Each tier has separate "Claim Premium" and "Claim Free" buttons with clean card designs and realistic shadows.

🏆 Enhanced Visual Polish
Every reward tier now features special badges - crowns for Premium rewards and trophies for Free rewards. You can see exactly how many BP points you need for each tier, with smooth animations and satisfying hover effects.

═══════════════════════════════════════

TECHNICAL IMPROVEMENTS:

• Fixed tier overlapping issues for cleaner presentation
• Improved container heights and spacing for better readability
• Enhanced scroll behavior for the horizontal reward track
• Better mobile and tablet touch responsiveness
• Completely rebuilt layout architecture
• Optimized rendering performance

═══════════════════════════════════════

USER EXPERIENCE UPGRADES:

The new three-tab system makes navigation incredibly intuitive. You can quickly access ready-to-claim quests in the Overview tab, better track your progress with improved visual hierarchy, and enjoy a simplified reward claiming process. We've taken inspiration from Brawl Stars' sideways scrolling reward system to make claiming rewards feel even more satisfying!

═══════════════════════════════════════

Enjoy the new Battle Pass experience!
Good luck hunting insects in the Amazon Forest!`;

  const currentText = viewMode === 'discord' ? discordUpdateLog : inGameUpdateLog;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    toast.success('Update log copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col border-2 border-orange-500"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">📋 Update Log v2.5.0</h2>
              <p className="text-sm opacity-90 mt-1">Battle Pass Revolution</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleCopy}
                className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40"
                size="sm"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </>
                )}
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-white hover:bg-white/20"
                size="sm"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Mode Toggle Buttons */}
          <div className="flex gap-3 mb-4">
            <Button
              onClick={() => setViewMode('ingame')}
              className={`flex-1 ${
                viewMode === 'ingame'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              In-Game View
            </Button>
            <Button
              onClick={() => setViewMode('discord')}
              className={`flex-1 ${
                viewMode === 'discord'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Discord Script
            </Button>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap leading-relaxed select-text">
              {currentText}
            </pre>
          </div>

          {/* Tips */}
          <div className="mt-6 bg-blue-900/30 border border-blue-500/50 rounded-xl p-4">
            <h4 className="font-semibold text-blue-300 mb-2 text-sm">
              {viewMode === 'discord' ? '💬 Discord Posting Tips:' : '🎮 In-Game Reading:'}
            </h4>
            <ul className="text-xs text-blue-200 space-y-1">
              {viewMode === 'discord' ? (
                <>
                  <li>• Click "Copy All" to copy the Discord-formatted script</li>
                  <li>• Paste directly into Discord for perfect emoji formatting</li>
                  <li>• All emojis and formatting are Discord-optimized</li>
                  <li>• Switch to "In-Game View" for a cleaner reading experience</li>
                </>
              ) : (
                <>
                  <li>• This view is optimized for in-game reading</li>
                  <li>• Cleaner format without excessive emojis</li>
                  <li>• More detailed explanations of each feature</li>
                  <li>• Switch to "Discord Script" to get the shareable version</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}