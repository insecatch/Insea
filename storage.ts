import { Insect, INSECT_DATABASE } from '@/app/data/insectDatabase';
import { getInsectBaseSkills } from '@/app/data/insectBaseSkills';

export interface CapturedInsect {
  id: string;
  insect: Insect;
  capturedAt: number;
  location: string;
  level?: number; // New: insect level (1-100)
  experience?: number; // New: experience points for leveling
  equippedSkills?: {
    normal: string[]; // skill IDs (max 3)
    ultimate?: string; // skill ID (max 1)
  };
  equippedPassives?: string[]; // passive IDs (max 3)
}

export interface BoostPotion {
  type: 'luck' | 'xp' | 'energy';
  multiplier: number;
  expiresAt: number;
}

export interface OwnedSkill {
  skillId: string;
  obtainedAt: number;
}

export interface ProtectionItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  effect: string;
  damageReduction: number; // percentage (e.g., 10 = 10% reduction)
  price: number; // in coins
}

interface UserProfile {
  username: string;
  avatarEmoji: string;
  rank: number;
  totalCaptures: number;
  battlesWon: number;
  battlesLost: number;
  coins?: number; // New: currency for upgrades and shop
}

export interface BattleResult {
  won: boolean;
  opponentName: string;
  timestamp: number;
  rewardXP: number;
}

const STORAGE_KEYS = {
  COLLECTION: 'insect_collection',
  PROFILE: 'user_profile',
  BATTLE_HISTORY: 'battle_history',
  BOOSTS_DATA: 'boosts_data'
};

export const storage = {
  // Collection methods
  getCollection(): CapturedInsect[] {
    const data = localStorage.getItem(STORAGE_KEYS.COLLECTION);
    return data ? JSON.parse(data) : [];
  },

  getActiveBoosts(): BoostPotion[] {
    const data = this.getData();
    const now = Date.now();
    // Filter out expired boosts
    const activeBoosts = (data.activeBoosts || []).filter(boost => boost.expiresAt > now);
    
    // Update storage if boosts changed
    if (activeBoosts.length !== (data.activeBoosts || []).length) {
      data.activeBoosts = activeBoosts;
      this.setData(data);
    }
    
    return activeBoosts;
  },

  getLuckMultiplier(): number {
    const boosts = this.getActiveBoosts();
    const luckBoosts = boosts.filter(b => b.type === 'luck');
    
    if (luckBoosts.length === 0) return 1;
    
    // Sum all multipliers
    return luckBoosts.reduce((total, boost) => total + boost.multiplier, 0);
  },

  getPotions() {
    const data = this.getData();
    return data.potions || { luck: 0, xp: 0, energy: 0 };
  },

  addPotion(type: 'luck' | 'xp' | 'energy', amount: number = 1) {
    const data = this.getData();
    if (!data.potions) {
      data.potions = { luck: 0, xp: 0, energy: 0 };
    }
    data.potions[type] = (data.potions[type] || 0) + amount;
    this.setData(data);
  },

  usePotion(type: 'luck' | 'xp' | 'energy', duration: number = 30 * 60 * 1000): boolean {
    const data = this.getData();
    if (!data.potions || !data.potions[type] || data.potions[type] <= 0) {
      return false;
    }

    // Deduct potion
    data.potions[type]--;

    // Add boost
    if (!data.activeBoosts) {
      data.activeBoosts = [];
    }

    const multiplier = type === 'luck' ? 2 : type === 'xp' ? 2 : 1.5;
    
    data.activeBoosts.push({
      type,
      multiplier,
      expiresAt: Date.now() + duration
    });

    this.setData(data);
    return true;
  },

  redeemPromoCode(code: string): { success: boolean; message: string; rewards?: any } {
    const data = this.getData();
    
    if (!data.redeemedCodes) {
      data.redeemedCodes = [];
    }

    // Check if already redeemed
    if (data.redeemedCodes.some(c => c.code === code)) {
      return { success: false, message: 'Code already redeemed!' };
    }

    // Admin code - special handling (can add best insects)
    if (code.toUpperCase() === 'ADM1') {
      // Mark as redeemed
      data.redeemedCodes.push({
        code: code.toUpperCase(),
        redeemedAt: Date.now()
      });

      // Set max rank
      const profile = this.getProfile();
      profile.rank = 10;
      profile.totalCaptures = 500;
      this.saveProfile(profile);

      // Add best legendary insects
      const legendaryInsects = INSECT_DATABASE.filter((i: any) => i.rarity === 'legendary');
      const epicInsects = INSECT_DATABASE.filter((i: any) => i.rarity === 'epic');
      
      // Add all legendary insects
      legendaryInsects.forEach((insect: any) => {
        this.addToCollection(insect, 'Admin Code');
      });

      // Add some epic insects
      epicInsects.slice(0, 10).forEach((insect: any) => {
        this.addToCollection(insect, 'Admin Code');
      });

      // Add massive luck boost
      if (!data.activeBoosts) {
        data.activeBoosts = [];
      }
      
      data.activeBoosts.push({
        type: 'luck',
        multiplier: 100, // 10000% luck
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      });

      // Add tons of potions
      if (!data.potions) {
        data.potions = { luck: 0, xp: 0, energy: 0 };
      }
      
      data.potions.luck += 50;
      data.potions.xp += 50;
      data.potions.energy += 50;

      // Add lots of rolls
      data.rolls = (data.rolls || 0) + 100;

      this.setData(data);

      return {
        success: true,
        message: '🔥 ADMIN CODE ACTIVATED! Rank 10 + All Legendary Insects + 10000% Luck (24h) + 150 Potions + 100 Rolls!',
        rewards: {
          rank: 10,
          insects: legendaryInsects.length + 10,
          luckBoost: 100,
          potions: { luck: 50, xp: 50, energy: 50 },
          rolls: 100
        }
      };
    }

    // Check valid codes
    const validCodes: Record<string, any> = {
      'RELEASE': {
        luckBoost: 50, // 5000% = 50x multiplier
        duration: 60 * 60 * 1000, // 1 hour
        potions: { luck: 5, xp: 5, energy: 5 },
        message: '🎉 RELEASE Code Activated! +5000% Luck for 1 hour + 15 Potions!'
      },
      'WELCOME': {
        luckBoost: 2,
        duration: 30 * 60 * 1000,
        potions: { luck: 1, xp: 1, energy: 1 },
        message: '👋 Welcome! +100% Luck for 30 min + 3 Potions!'
      },
      'INSECATCH': {
        luckBoost: 5,
        duration: 45 * 60 * 1000,
        potions: { luck: 3, xp: 2, energy: 2 },
        message: '🐛 Insecatch Bonus! +400% Luck for 45 min + 7 Potions!'
      },
      'LWTOPSPS': {
        special: 'god-mode',
        message: '👑 GOD MODE ACTIVATED! Level 5000 + All Insects Unlocked!'
      },
      'LSCISGAY': {
        special: 'skill-rolls',
        rolls: 1000,
        message: '🎲 1000 Skill Rolls Added to your account!'
      },
      '4141': {
        special: 'exotic-insect',
        insectId: 'chans_megastick',
        message: '👑🦗 EXOTIC UNLOCKED! Chan\'s Megastick added to your collection! The longest insect in the world!'
      },
      'FREEMONEY': {
        special: 'mega-coins',
        coins: 6660000000,
        message: '💰🔥 JACKPOT! 6.66 BILLION COINS added to your account!'
      },
      'UPDLOG': {
        special: 'update-log',
        message: '📋 Opening v2.5.0 Update Log...'
      }
    };

    const rewardData = validCodes[code.toUpperCase()];
    
    if (!rewardData) {
      return { success: false, message: 'Invalid promo code!' };
    }

    // Mark as redeemed
    data.redeemedCodes.push({
      code: code.toUpperCase(),
      redeemedAt: Date.now()
    });

    // Handle special codes
    if (rewardData.special === 'god-mode') {
      // LWTOPSPS - Level 5000 + All insects
      const profile = this.getProfile();
      
      // Add all insects to collection at level 5000
      INSECT_DATABASE.forEach((insect: any) => {
        const baseSkills = getInsectBaseSkills(insect.id);
        const captured: CapturedInsect = {
          insect,
          capturedAt: Date.now(),
          id: `${insect.id}_godmode_${Date.now()}_${Math.random()}`,
          location: 'GOD MODE',
          level: 5000, // Level 5000!
          experience: 0,
          equippedSkills: {
            normal: [...baseSkills.normal],
            ultimate: baseSkills.ultimate
          }
        };
        
        const collection = this.getCollection();
        collection.push(captured);
        localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collection));
      });
      
      // Set max rank
      profile.rank = 10;
      profile.totalCaptures = INSECT_DATABASE.length;
      profile.coins = 999999999; // Infinite coins
      this.saveProfile(profile);
      
      this.setData(data);
      
      return {
        success: true,
        message: rewardData.message,
        rewards: { 
          level: 5000, 
          insects: INSECT_DATABASE.length,
          coins: 999999999
        }
      };
    }
    
    if (rewardData.special === 'skill-rolls') {
      // LSCISGAY - 1000 rolls
      data.rolls = (data.rolls || 0) + rewardData.rolls;
      this.setData(data);
      
      return {
        success: true,
        message: rewardData.message,
        rewards: { rolls: rewardData.rolls }
      };
    }

    if (rewardData.special === 'exotic-insect') {
      // 4141 - Add a specific exotic insect
      const insectId = rewardData.insectId;
      const insect = INSECT_DATABASE.find((i: any) => i.id === insectId);
      
      if (insect) {
        this.addToCollection(insect, 'Exotic Insect Code');
      }
      
      this.setData(data);
      
      return {
        success: true,
        message: rewardData.message,
        rewards: { insect: insectId }
      };
    }

    if (rewardData.special === 'mega-coins') {
      // FREEMONEY - Add a huge amount of coins
      const coins = rewardData.coins;
      const profile = this.getProfile();
      profile.coins = (profile.coins || 0) + coins;
      this.saveProfile(profile);
      
      this.setData(data);
      
      return {
        success: true,
        message: rewardData.message,
        rewards: { coins }
      };
    }

    if (rewardData.special === 'update-log') {
      // UPDLOG - Open update log
      return {
        success: true,
        message: rewardData.message
      };
    }

    // Normal code handling (luck boosts, potions, etc.)
    // Add luck boost
    if (!data.activeBoosts) {
      data.activeBoosts = [];
    }
    
    if (rewardData.luckBoost) {
      data.activeBoosts.push({
        type: 'luck',
        multiplier: rewardData.luckBoost,
        expiresAt: Date.now() + rewardData.duration
      });
    }

    // Add potions
    if (!data.potions) {
      data.potions = { luck: 0, xp: 0, energy: 0 };
    }
    
    if (rewardData.potions) {
      data.potions.luck += rewardData.potions.luck;
      data.potions.xp += rewardData.potions.xp;
      data.potions.energy += rewardData.potions.energy;
    }

    // Add rolls
    if (rewardData.rolls) {
      data.rolls = (data.rolls || 0) + rewardData.rolls;
    }

    this.setData(data);

    return {
      success: true,
      message: rewardData.message,
      rewards: rewardData
    };
  },

  addToCollection(insect: Insect, location: string): CapturedInsect {
    const collection = this.getCollection();
    
    // Get base skills for this insect
    const baseSkills = getInsectBaseSkills(insect.id);
    
    const captured: CapturedInsect = {
      insect,
      capturedAt: Date.now(),
      id: `${insect.id}_${Date.now()}_${Math.random()}`,
      location,
      level: 1, // Start at level 1
      experience: 0,
      equippedSkills: {
        normal: [...baseSkills.normal], // Clone the base skills array
        ultimate: baseSkills.ultimate
      }
    };
    
    // Add base skills to owned skills if not already owned
    if (baseSkills.normal.length > 0) {
      baseSkills.normal.forEach(skillId => {
        this.addSkill(skillId);
      });
    }
    if (baseSkills.ultimate) {
      this.addSkill(baseSkills.ultimate);
    }
    
    collection.push(captured);
    localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collection));
    
    // Update profile stats
    const profile = this.getProfile();
    profile.totalCaptures++;
    profile.rank = this.calculateRank(profile.totalCaptures);
    this.saveProfile(profile);
    
    // Track capture quest
    this.trackCaptureQuest();
    
    // Track collection quest (in case unique count increased)
    this.trackCollectionQuest();
    
    return captured;
  },

  removeFromCollection(capturedId: string): void {
    const collection = this.getCollection();
    const filtered = collection.filter(c => c.id !== capturedId);
    localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(filtered));
  },

  // Profile methods
  getProfile(): UserProfile {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (data) {
      return JSON.parse(data);
    }
    // Default profile
    return {
      username: 'BugHunter',
      avatarEmoji: '🐛',
      rank: 1,
      totalCaptures: 0,
      battlesWon: 0,
      battlesLost: 0
    };
  },

  saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  updateUsername(username: string): boolean {
    if (username.length < 3) return false;
    const profile = this.getProfile();
    profile.username = username;
    this.saveProfile(profile);
    return true;
  },

  updateAvatar(emoji: string): void {
    const profile = this.getProfile();
    profile.avatarEmoji = emoji;
    this.saveProfile(profile);
  },

  calculateRank(totalCaptures: number): number {
    // Rank calculation based on captures
    if (totalCaptures < 5) return 1;
    if (totalCaptures < 10) return 2;
    if (totalCaptures < 20) return 3;
    if (totalCaptures < 35) return 4;
    if (totalCaptures < 50) return 5;
    if (totalCaptures < 75) return 6;
    if (totalCaptures < 100) return 7;
    if (totalCaptures < 150) return 8;
    if (totalCaptures < 200) return 9;
    return 10;
  },

  // Battle methods
  recordBattle(result: BattleResult): void {
    const history = this.getBattleHistory();
    history.unshift(result);
    // Keep only last 50 battles
    if (history.length > 50) {
      history.length = 50;
    }
    localStorage.setItem(STORAGE_KEYS.BATTLE_HISTORY, JSON.stringify(history));

    // Update profile
    const profile = this.getProfile();
    if (result.won) {
      profile.battlesWon++;
      // Track battle win quest (only on wins)
      this.trackBattleWinQuest();
    } else {
      profile.battlesLost++;
    }
    this.saveProfile(profile);
  },

  getBattleHistory(): BattleResult[] {
    const data = localStorage.getItem(STORAGE_KEYS.BATTLE_HISTORY);
    return data ? JSON.parse(data) : [];
  },

  // Stats
  getStats() {
    const collection = this.getCollection();
    const profile = this.getProfile();
    
    // Count unique insects
    const uniqueInsects = new Set(collection.map(c => c.insect.id));
    
    // Count by rarity
    const rarityCount = collection.reduce((acc, c) => {
      acc[c.insect.rarity] = (acc[c.insect.rarity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count by type
    const typeCount = collection.reduce((acc, c) => {
      acc[c.insect.type] = (acc[c.insect.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCaptures: collection.length,
      uniqueSpecies: uniqueInsects.size,
      rarityCount,
      typeCount,
      rank: profile.rank,
      battlesWon: profile.battlesWon,
      battlesLost: profile.battlesLost,
      winRate: profile.battlesWon + profile.battlesLost > 0
        ? Math.round((profile.battlesWon / (profile.battlesWon + profile.battlesLost)) * 100)
        : 0
    };
  },

  // Helper methods
  getData() {
    const data = localStorage.getItem(STORAGE_KEYS.BOOSTS_DATA);
    return data ? JSON.parse(data) : {};
  },

  setData(data: any) {
    localStorage.setItem(STORAGE_KEYS.BOOSTS_DATA, JSON.stringify(data));
  },

  // Skill system methods
  getRolls(): number {
    const data = this.getData();
    // Give 3 starting rolls if none exist
    if (data.rolls === undefined) {
      data.rolls = 3;
      this.setData(data);
    }
    return data.rolls || 0;
  },

  addRolls(amount: number) {
    const data = this.getData();
    data.rolls = (data.rolls || 0) + amount;
    this.setData(data);
  },

  useRoll(): boolean {
    const data = this.getData();
    if (!data.rolls || data.rolls <= 0) {
      return false;
    }
    data.rolls--;
    this.setData(data);
    return true;
  },

  getOwnedSkills(): OwnedSkill[] {
    const data = this.getData();
    return data.ownedSkills || [];
  },

  addSkill(skillId: string) {
    const data = this.getData();
    if (!data.ownedSkills) {
      data.ownedSkills = [];
    }
    // Check if already owned
    if (!data.ownedSkills.some((s: OwnedSkill) => s.skillId === skillId)) {
      data.ownedSkills.push({
        skillId,
        obtainedAt: Date.now()
      });
    }
    this.setData(data);
  },

  equipSkill(capturedId: string, skillId: string, slot: 'normal' | 'ultimate') {
    const collection = this.getCollection();
    const captured = collection.find(c => c.id === capturedId);
    
    if (!captured) return false;

    if (!captured.equippedSkills) {
      captured.equippedSkills = { normal: [] };
    }

    if (slot === 'normal') {
      // Max 3 normal skills
      if (!captured.equippedSkills.normal.includes(skillId)) {
        if (captured.equippedSkills.normal.length < 3) {
          captured.equippedSkills.normal.push(skillId);
        }
      }
    } else {
      // 1 ultimate skill
      captured.equippedSkills.ultimate = skillId;
    }

    localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collection));
    return true;
  },

  unequipSkill(capturedId: string, skillId: string) {
    const collection = this.getCollection();
    const captured = collection.find(c => c.id === capturedId);
    
    if (!captured || !captured.equippedSkills) return false;

    // Remove from normal skills
    captured.equippedSkills.normal = captured.equippedSkills.normal.filter(id => id !== skillId);
    
    // Remove from ultimate
    if (captured.equippedSkills.ultimate === skillId) {
      captured.equippedSkills.ultimate = undefined;
    }

    localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collection));
    return true;
  },

  // Coin system methods
  getCoins(): number {
    const profile = this.getProfile();
    return profile.coins || 0;
  },

  addCoins(amount: number) {
    const profile = this.getProfile();
    profile.coins = (profile.coins || 0) + amount;
    this.saveProfile(profile);
  },

  spendCoins(amount: number): boolean {
    const profile = this.getProfile();
    if ((profile.coins || 0) < amount) {
      return false;
    }
    profile.coins = (profile.coins || 0) - amount;
    this.saveProfile(profile);
    return true;
  },

  // Insect upgrade methods
  getUpgradeCost(level: number): number {
    return Math.floor(100 * Math.pow(1.1, level - 1));
  },

  upgradeInsect(capturedId: string): { success: boolean; message: string; newLevel?: number } {
    const collection = this.getCollection();
    const captured = collection.find(c => c.id === capturedId);
    
    if (!captured) {
      return { success: false, message: 'Insect not found!' };
    }

    const currentLevel = captured.level || 1;
    
    if (currentLevel >= 100) {
      return { success: false, message: 'Already at max level!' };
    }

    const cost = this.getUpgradeCost(currentLevel);
    
    if (!this.spendCoins(cost)) {
      return { success: false, message: `Not enough coins! Need ${cost} coins.` };
    }

    // Level up the insect
    captured.level = currentLevel + 1;
    
    // Reset experience for the new level
    captured.experience = 0;

    localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collection));
    
    // Track upgrade quest
    this.trackUpgradeQuest();
    
    return { 
      success: true, 
      message: `🎉 Leveled up to ${captured.level}!`,
      newLevel: captured.level 
    };
  },

  // EXP system methods
  getExpForLevel(level: number): number {
    // Exponential EXP requirement: 100 * (level^1.5)
    return Math.floor(100 * Math.pow(level, 1.5));
  },

  addExperience(capturedId: string, exp: number): { leveledUp: boolean; newLevel?: number; overflow?: number } {
    const collection = this.getCollection();
    const captured = collection.find(c => c.id === capturedId);
    
    if (!captured) {
      return { leveledUp: false };
    }

    const currentLevel = captured.level || 1;
    
    if (currentLevel >= 100) {
      return { leveledUp: false };
    }

    // Initialize experience if not present
    captured.experience = (captured.experience || 0) + exp;
    
    let leveledUp = false;
    let levelsGained = 0;
    
    // Check for level up(s)
    while (currentLevel + levelsGained < 100) {
      const expNeeded = this.getExpForLevel(currentLevel + levelsGained + 1);
      if (captured.experience >= expNeeded) {
        captured.experience -= expNeeded;
        levelsGained++;
        leveledUp = true;
      } else {
        break;
      }
    }
    
    if (leveledUp) {
      captured.level = (currentLevel + levelsGained);
    }

    localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collection));
    
    return { 
      leveledUp, 
      newLevel: leveledUp ? captured.level : undefined,
      overflow: captured.experience 
    };
  },

  getInsectStats(captured: CapturedInsect) {
    const level = captured.level || 1;
    const baseStats = captured.insect.stats;
    
    // Stat scaling: +2% per level
    const multiplier = 1 + ((level - 1) * 0.02);
    
    return {
      health: Math.floor(baseStats.health * multiplier),
      attack: Math.floor(baseStats.attack * multiplier),
      defense: Math.floor(baseStats.defense * multiplier),
      speed: Math.floor(baseStats.speed * multiplier)
    };
  },

  // Protection items methods
  getOwnedProtection(): string[] {
    const data = this.getData();
    return data.ownedProtection || [];
  },

  getEquippedProtection(): string | null {
    const data = this.getData();
    return data.equippedProtection || null;
  },

  buyProtection(protectionId: string, price: number): boolean {
    if (!this.spendCoins(price)) {
      return false;
    }

    const data = this.getData();
    if (!data.ownedProtection) {
      data.ownedProtection = [];
    }

    if (!data.ownedProtection.includes(protectionId)) {
      data.ownedProtection.push(protectionId);
    }

    this.setData(data);
    return true;
  },

  equipProtection(protectionId: string) {
    const data = this.getData();
    data.equippedProtection = protectionId;
    this.setData(data);
  },

  unequipProtection() {
    const data = this.getData();
    data.equippedProtection = null;
    this.setData(data);
  },

  // Passive skills methods
  getOwnedPassives(): string[] {
    const data = this.getData();
    return data.ownedPassives || [];
  },

  addPassive(passiveId: string) {
    const data = this.getData();
    if (!data.ownedPassives) {
      data.ownedPassives = [];
    }
    if (!data.ownedPassives.includes(passiveId)) {
      data.ownedPassives.push(passiveId);
    }
    this.setData(data);
  },

  equipPassive(capturedId: string, passiveId: string): boolean {
    const collection = this.getCollection();
    const captured = collection.find(c => c.id === capturedId);
    
    if (!captured) return false;

    if (!captured.equippedPassives) {
      captured.equippedPassives = [];
    }

    // Max 3 passives
    if (!captured.equippedPassives.includes(passiveId) && captured.equippedPassives.length < 3) {
      captured.equippedPassives.push(passiveId);
      localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collection));
      return true;
    }
    
    return false;
  },

  unequipPassive(capturedId: string, passiveId: string): boolean {
    const collection = this.getCollection();
    const captured = collection.find(c => c.id === capturedId);
    
    if (!captured || !captured.equippedPassives) return false;

    captured.equippedPassives = captured.equippedPassives.filter(id => id !== passiveId);
    localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collection));
    return true;
  },

  // Insect Chest system
  getChests(): number {
    const data = this.getData();
    // Give 5 starting chests if none exist
    if (data.chests === undefined) {
      data.chests = 5;
      this.setData(data);
    }
    return data.chests || 0;
  },

  addChests(amount: number) {
    const data = this.getData();
    data.chests = (data.chests || 0) + amount;
    this.setData(data);
  },

  openChest() {
    const data = this.getData();
    if (!data.chests || data.chests <= 0) {
      return null;
    }

    data.chests--;
    this.setData(data);

    // Random number of insects (1-3)
    const count = Math.floor(Math.random() * 3) + 1;
    const insects: Insect[] = [];

    for (let i = 0; i < count; i++) {
      // Weighted random selection - More balanced with much rarer mythic
      const rarityRoll = Math.random() * 100;
      let selectedRarity: string;

      if (rarityRoll < 45) selectedRarity = 'common'; // 45%
      else if (rarityRoll < 73) selectedRarity = 'uncommon'; // 28%
      else if (rarityRoll < 88) selectedRarity = 'rare'; // 15%
      else if (rarityRoll < 96) selectedRarity = 'epic'; // 8%
      else if (rarityRoll < 99.9) selectedRarity = 'legendary'; // 3.9%
      else selectedRarity = 'mythic'; // 0.1% (1 in 1000)

      const availableInsects = INSECT_DATABASE.filter((i: any) => i.rarity === selectedRarity);
      if (availableInsects.length > 0) {
        const randomInsect = availableInsects[Math.floor(Math.random() * availableInsects.length)];
        insects.push(randomInsect);
        this.addToCollection(randomInsect, 'Insect Chest');
      }
    }

    return {
      insects,
      message: `You got ${count} insect${count > 1 ? 's' : ''}!`
    };
  },

  // Battle Pass system
  getBattlePassData() {
    const data = this.getData();
    if (!data.battlePass) {
      data.battlePass = {
        points: 0,
        currentTier: 1,
        claimedTiers: [],
        claimedPremiumTiers: [], // New: track premium tier claims
        isPremium: false, // New: premium battle pass status
        quests: {
          daily: [],
          weekly: [],
          premium: [] // New: premium quests
        },
        lastDailyReset: Date.now(),
        lastWeeklyReset: Date.now()
      };
      this.setData(data);
    }
    return data.battlePass;
  },

  // New: Purchase premium battle pass
  purchasePremiumBattlePass(): boolean {
    const data = this.getData();
    if (!data.battlePass) {
      data.battlePass = this.getBattlePassData();
    }
    
    if (data.battlePass.isPremium) {
      return false; // Already premium
    }

    if (!this.spendCoins(200000)) {
      return false; // Not enough coins
    }

    data.battlePass.isPremium = true;
    this.setData(data);
    return true;
  },

  // New: Check if has premium battle pass
  hasPremiumBattlePass(): boolean {
    const data = this.getBattlePassData();
    return data.isPremium || false;
  },

  // New: PRO subscription
  getPROStatus(): boolean {
    const data = this.getData();
    return data.isPRO || false;
  },

  purchasePRO(): boolean {
    const data = this.getData();
    if (data.isPRO) {
      return false; // Already PRO
    }

    if (!this.spendCoins(1500000)) {
      return false; // Not enough coins
    }

    data.isPRO = true;
    this.setData(data);
    return true;
  },

  addBattlePassPoints(amount: number) {
    const data = this.getData();
    if (!data.battlePass) {
      data.battlePass = this.getBattlePassData();
    }
    data.battlePass.points += amount;
    this.setData(data);
  },

  // New: Track quest progress
  trackCaptureQuest() {
    const data = this.getData();
    if (!data.battlePass) {
      data.battlePass = this.getBattlePassData();
    }

    // Update all capture-type quests
    [...data.battlePass.quests.daily, ...data.battlePass.quests.weekly, ...data.battlePass.quests.premium].forEach((quest: any) => {
      if (quest.type === 'capture' && !quest.completed) {
        quest.progress = Math.min((quest.progress || 0) + 1, quest.target);
      }
    });

    this.setData(data);
  },

  trackBattleWinQuest() {
    const data = this.getData();
    if (!data.battlePass) {
      data.battlePass = this.getBattlePassData();
    }

    // Update all battle-type quests
    [...data.battlePass.quests.daily, ...data.battlePass.quests.weekly, ...data.battlePass.quests.premium].forEach((quest: any) => {
      if (quest.type === 'battle' && !quest.completed) {
        quest.progress = Math.min((quest.progress || 0) + 1, quest.target);
      }
    });

    this.setData(data);
  },

  trackUpgradeQuest() {
    const data = this.getData();
    if (!data.battlePass) {
      data.battlePass = this.getBattlePassData();
    }

    // Update all upgrade-type quests
    [...data.battlePass.quests.daily, ...data.battlePass.quests.weekly, ...data.battlePass.quests.premium].forEach((quest: any) => {
      if (quest.type === 'upgrade' && !quest.completed) {
        quest.progress = Math.min((quest.progress || 0) + 1, quest.target);
      }
    });

    this.setData(data);
  },

  trackCollectionQuest() {
    const data = this.getData();
    if (!data.battlePass) {
      data.battlePass = this.getBattlePassData();
    }

    const uniqueCount = new Set(this.getCollection().map(c => c.insect.id)).size;

    // Update all collection-type quests
    [...data.battlePass.quests.daily, ...data.battlePass.quests.weekly, ...data.battlePass.quests.premium].forEach((quest: any) => {
      if (quest.type === 'collection' && !quest.completed) {
        quest.progress = Math.min(uniqueCount, quest.target);
      }
    });

    this.setData(data);
  },

  completeQuest(questId: string): number {
    const data = this.getData();
    if (!data.battlePass) {
      data.battlePass = this.getBattlePassData();
    }

    // Find and complete quest
    let quest = data.battlePass.quests.daily.find((q: any) => q.id === questId);
    let questList = data.battlePass.quests.daily;
    
    if (!quest) {
      quest = data.battlePass.quests.weekly.find((q: any) => q.id === questId);
      questList = data.battlePass.quests.weekly;
    }

    if (quest && quest.progress >= quest.target && !quest.completed) {
      quest.completed = true;
      data.battlePass.points += quest.reward;
      this.setData(data);
      return quest.reward;
    }

    return 0;
  },

  claimBattlePassReward(tier: number): boolean {
    const data = this.getData();
    if (!data.battlePass) {
      data.battlePass = this.getBattlePassData();
    }

    if (!data.battlePass.claimedTiers.includes(tier)) {
      data.battlePass.claimedTiers.push(tier);
      this.setData(data);
      return true;
    }

    return false;
  },

  resetDailyQuests() {
    const data = this.getData();
    if (!data.battlePass) {
      data.battlePass = this.getBattlePassData();
    }

    // Reset daily quests
    data.battlePass.lastDailyReset = Date.now();
    this.setData(data);
  },

  resetWeeklyQuests() {
    const data = this.getData();
    if (!data.battlePass) {
      data.battlePass = this.getBattlePassData();
    }

    // Reset weekly quests
    data.battlePass.lastWeeklyReset = Date.now();
    this.setData(data);
  }
};