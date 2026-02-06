export type SkillRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type SkillType = 'normal' | 'ultimate';

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  rarity: SkillRarity;
  description: string;
  energyCost: number;
  damageMultiplier: number;
  effects?: {
    healing?: number;
    shield?: number;
    lifesteal?: number;
    burn?: number; // damage over time
    stun?: boolean;
    energyRestore?: number;
  };
  icon: string;
}

export const SKILL_DATABASE: Skill[] = [
  // Common Normal Skills - REDUCED POWER
  {
    id: 'quick-strike',
    name: 'Quick Strike',
    type: 'normal',
    rarity: 'common',
    description: 'A fast attack that costs little energy',
    energyCost: 1,
    damageMultiplier: 0.5, // Was 0.8
    icon: '⚡'
  },
  {
    id: 'power-hit',
    name: 'Power Hit',
    type: 'normal',
    rarity: 'common',
    description: 'A balanced attack with decent power',
    energyCost: 2,
    damageMultiplier: 0.7, // Was 1.0
    icon: '👊'
  },
  {
    id: 'heavy-slam',
    name: 'Heavy Slam',
    type: 'normal',
    rarity: 'common',
    description: 'A powerful but energy-costly attack',
    energyCost: 3,
    damageMultiplier: 1.0, // Was 1.5
    icon: '💥'
  },
  {
    id: 'sting',
    name: 'Venomous Sting',
    type: 'normal',
    rarity: 'common',
    description: 'Inject venom that burns the enemy',
    energyCost: 2,
    damageMultiplier: 0.6, // Was 0.9
    effects: { burn: 3 }, // Was 5
    icon: '🦂'
  },

  // Rare Normal Skills - REDUCED POWER
  {
    id: 'drain-bite',
    name: 'Drain Bite',
    type: 'normal',
    rarity: 'rare',
    description: 'Attack and restore HP',
    energyCost: 2,
    damageMultiplier: 0.7, // Was 1.0
    effects: { lifesteal: 20 }, // Was 30
    icon: '🧛'
  },
  {
    id: 'triple-strike',
    name: 'Triple Strike',
    type: 'normal',
    rarity: 'rare',
    description: 'Three rapid attacks',
    energyCost: 3,
    damageMultiplier: 1.2, // Was 1.8
    icon: '⚔️'
  },
  {
    id: 'shield-bash',
    name: 'Shield Bash',
    type: 'normal',
    rarity: 'rare',
    description: 'Attack and gain temporary shield',
    energyCost: 2,
    damageMultiplier: 0.6, // Was 0.8
    effects: { shield: 10 }, // Was 15
    icon: '🛡️'
  },
  {
    id: 'energy-siphon',
    name: 'Energy Siphon',
    type: 'normal',
    rarity: 'rare',
    description: 'Weak attack but restores energy',
    energyCost: 1,
    damageMultiplier: 0.4, // Was 0.6
    effects: { energyRestore: 1 },
    icon: '🔋'
  },

  // Epic Normal Skills - REDUCED POWER
  {
    id: 'crushing-blow',
    name: 'Crushing Blow',
    type: 'normal',
    rarity: 'epic',
    description: 'Massive damage with high energy cost',
    energyCost: 4,
    damageMultiplier: 1.8, // Was 2.5
    icon: '🔨'
  },
  {
    id: 'poison-fang',
    name: 'Poison Fang',
    type: 'normal',
    rarity: 'epic',
    description: 'Heavy poison damage over time',
    energyCost: 3,
    damageMultiplier: 0.9, // Was 1.2
    effects: { burn: 7 }, // Was 10
    icon: '☠️'
  },
  {
    id: 'solar-strike',
    name: 'Solar Strike',
    type: 'normal',
    rarity: 'epic',
    description: 'Powerful energy-infused attack',
    energyCost: 3,
    damageMultiplier: 1.5, // Was 2.0
    icon: '☀️'
  },
  {
    id: 'regenerative-bite',
    name: 'Regenerative Bite',
    type: 'normal',
    rarity: 'epic',
    description: 'Powerful lifesteal attack',
    energyCost: 3,
    damageMultiplier: 1.1, // Was 1.5
    effects: { lifesteal: 35 }, // Was 50
    icon: '💚'
  },

  // Legendary Normal Skills - EXOTIC POWER (STRONGER!)
  {
    id: 'omega-strike',
    name: 'Omega Strike',
    type: 'normal',
    rarity: 'legendary',
    description: 'The ultimate normal attack',
    energyCost: 4,
    damageMultiplier: 2.8, // Was 3.0, slightly reduced but still very strong
    icon: '💫'
  },
  {
    id: 'chaos-burst',
    name: 'Chaos Burst',
    type: 'normal',
    rarity: 'legendary',
    description: 'Unpredictable massive damage',
    energyCost: 3,
    damageMultiplier: 2.5, // Was 2.8, still very strong
    effects: { burn: 10 }, // Was 8, INCREASED for exotic
    icon: '🌪️'
  },

  // Common Ultimate Skills - REDUCED POWER
  {
    id: 'mega-impact',
    name: 'Mega Impact',
    type: 'ultimate',
    rarity: 'common',
    description: 'Unleash massive power',
    energyCost: 5,
    damageMultiplier: 2.0, // Was 3.0
    icon: '💢'
  },

  // Rare Ultimate Skills - REDUCED POWER
  {
    id: 'final-sting',
    name: 'Final Sting',
    type: 'ultimate',
    rarity: 'rare',
    description: 'All-out attack with poison',
    energyCost: 5,
    damageMultiplier: 2.5, // Was 3.5
    effects: { burn: 10 }, // Was 15
    icon: '🐝'
  },
  {
    id: 'life-drain',
    name: 'Ultimate Life Drain',
    type: 'ultimate',
    rarity: 'rare',
    description: 'Massive damage and healing',
    energyCost: 5,
    damageMultiplier: 2.2, // Was 3.0
    effects: { lifesteal: 60 }, // Was 80
    icon: '💀'
  },

  // Epic Ultimate Skills - REDUCED POWER
  {
    id: 'meteor-crash',
    name: 'Meteor Crash',
    type: 'ultimate',
    rarity: 'epic',
    description: 'Call down devastating meteor',
    energyCost: 5,
    damageMultiplier: 3.2, // Was 4.5
    icon: '☄️'
  },
  {
    id: 'absolute-zero',
    name: 'Absolute Zero',
    type: 'ultimate',
    rarity: 'epic',
    description: 'Freeze and shatter the enemy',
    energyCost: 5,
    damageMultiplier: 2.8, // Was 4.0
    effects: { stun: true },
    icon: '❄️'
  },
  {
    id: 'phoenix-rebirth',
    name: 'Phoenix Rebirth',
    type: 'ultimate',
    rarity: 'epic',
    description: 'Powerful attack with full heal',
    energyCost: 5,
    damageMultiplier: 2.5, // Was 3.5
    effects: { healing: 40 }, // Was 50
    icon: '🔥'
  },

  // Legendary Ultimate Skills - EXOTIC POWER (VERY STRONG!)
  {
    id: 'apocalypse',
    name: 'Apocalypse',
    type: 'ultimate',
    rarity: 'legendary',
    description: 'End all things',
    energyCost: 5,
    damageMultiplier: 5.5, // Was 6.0, still VERY powerful
    icon: '💥'
  },
  {
    id: 'divine-judgment',
    name: 'Divine Judgment',
    type: 'ultimate',
    rarity: 'legendary',
    description: 'Holy power destroys all',
    energyCost: 5,
    damageMultiplier: 5.0, // Was 5.5, still VERY powerful
    effects: { healing: 50 }, // Was 40, INCREASED for exotic
    icon: '⚡'
  },
  {
    id: 'black-hole',
    name: 'Black Hole',
    type: 'ultimate',
    rarity: 'legendary',
    description: 'Consume everything',
    energyCost: 5,
    damageMultiplier: 4.5, // Was 5.0, still VERY powerful
    effects: { lifesteal: 120 }, // Was 100, INCREASED for exotic
    icon: '🌑'
  }
];

export const SKILL_RARITY_COLORS: Record<SkillRarity, string> = {
  common: '#94a3b8',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b'
};

export const SKILL_RARITY_WEIGHTS: Record<SkillRarity, number> = {
  common: 50,
  rare: 30,
  epic: 15,
  legendary: 5
};

// Default basic attack that every bug has
export const BASIC_ATTACK: Skill = {
  id: 'basic-attack',
  name: 'Basic Attack',
  type: 'normal',
  rarity: 'common',
  description: 'A simple attack',
  energyCost: 2,
  damageMultiplier: 0.7, // Reduced from 1.0 to match rebalancing
  icon: '👊'
};