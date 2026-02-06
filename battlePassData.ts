export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'capture' | 'battle' | 'collection' | 'upgrade' | 'daily';
  target: number;
  progress: number;
  reward: number; // Battle pass points
  icon: string;
  completed?: boolean;
  premium?: boolean; // New: premium-only quests
}

export interface BattlePassTier {
  tier: number;
  requiredPoints: number;
  rewards: {
    type: 'coins' | 'potion' | 'skill-roll' | 'insect' | 'special';
    amount?: number;
    potionType?: 'luck' | 'xp' | 'energy';
    insectId?: string;
    description: string;
  }[];
  premiumRewards?: { // New: premium tier rewards
    type: 'coins' | 'potion' | 'skill-roll' | 'insect' | 'special';
    amount?: number;
    potionType?: 'luck' | 'xp' | 'energy';
    insectId?: string;
    description: string;
  }[];
}

// AMAZON FOREST! Battle Pass - Daily Quests
export const DAILY_QUESTS: Omit<Quest, 'progress'>[] = [
  {
    id: 'daily_capture_3',
    name: 'Rainforest Explorer',
    description: 'Capture 3 insects in the Amazon',
    type: 'capture',
    target: 3,
    reward: 50,
    icon: '🌿'
  },
  {
    id: 'daily_battle_2',
    name: 'Jungle Warrior',
    description: 'Win 2 battles in the rainforest',
    type: 'battle',
    target: 2,
    reward: 75,
    icon: '🦜'
  },
  {
    id: 'daily_upgrade_1',
    name: 'Amazon Trainer',
    description: 'Upgrade an insect to survive the jungle',
    type: 'upgrade',
    target: 1,
    reward: 40,
    icon: '🌴'
  }
];

// AMAZON FOREST! Battle Pass - Weekly Quests
export const WEEKLY_QUESTS: Omit<Quest, 'progress'>[] = [
  {
    id: 'weekly_capture_20',
    name: 'Canopy Master',
    description: 'Capture 20 insects from the rainforest',
    type: 'capture',
    target: 20,
    reward: 300,
    icon: '🦋'
  },
  {
    id: 'weekly_battle_10',
    name: 'Amazon Champion',
    description: 'Win 10 battles in the jungle',
    type: 'battle',
    target: 10,
    reward: 400,
    icon: '🐆'
  },
  {
    id: 'weekly_collection_25',
    name: 'Biodiversity Expert',
    description: 'Collect 25+ unique rainforest species',
    type: 'collection',
    target: 25,
    reward: 500,
    icon: '🌺'
  }
];

// AMAZON FOREST! Battle Pass - Premium Quests
export const PREMIUM_QUESTS: Omit<Quest, 'progress'>[] = [
  {
    id: 'premium_daily_capture_5',
    name: 'Elite Rainforest Hunter',
    description: 'Capture 5 rare Amazon insects',
    type: 'capture',
    target: 5,
    reward: 100,
    icon: '🦅',
    premium: true
  },
  {
    id: 'premium_daily_battle_5',
    name: 'Apex Predator',
    description: 'Win 5 battles without losing',
    type: 'battle',
    target: 5,
    reward: 150,
    icon: '🐍',
    premium: true
  },
  {
    id: 'premium_weekly_upgrade_10',
    name: 'Jungle Evolution',
    description: 'Upgrade insects 10 times',
    type: 'upgrade',
    target: 10,
    reward: 600,
    icon: '🌳',
    premium: true
  }
];

export const BATTLE_PASS_TIERS: BattlePassTier[] = [
  {
    tier: 1,
    requiredPoints: 0,
    rewards: [
      { type: 'coins', amount: 500, description: '500 Coins' }
    ],
    premiumRewards: [
      { type: 'coins', amount: 2000, description: '2000 Coins' },
      { type: 'potion', amount: 2, potionType: 'luck', description: '2 Luck Potions' }
    ]
  },
  {
    tier: 2,
    requiredPoints: 100,
    rewards: [
      { type: 'potion', amount: 1, potionType: 'luck', description: '1 Luck Potion' }
    ],
    premiumRewards: [
      { type: 'potion', amount: 3, potionType: 'luck', description: '3 Luck Potions' },
      { type: 'skill-roll', amount: 5, description: '5 Skill Rolls' }
    ]
  },
  {
    tier: 3,
    requiredPoints: 250,
    rewards: [
      { type: 'coins', amount: 1000, description: '1000 Coins' }
    ],
    premiumRewards: [
      { type: 'coins', amount: 5000, description: '5000 Coins' },
      { type: 'potion', amount: 2, potionType: 'xp', description: '2 XP Potions' }
    ]
  },
  {
    tier: 4,
    requiredPoints: 450,
    rewards: [
      { type: 'skill-roll', amount: 3, description: '3 Skill Rolls' }
    ],
    premiumRewards: [
      { type: 'skill-roll', amount: 10, description: '10 Skill Rolls' },
      { type: 'coins', amount: 7500, description: '7500 Coins' }
    ]
  },
  {
    tier: 5,
    requiredPoints: 700,
    rewards: [
      { type: 'potion', amount: 2, potionType: 'xp', description: '2 XP Potions' }
    ],
    premiumRewards: [
      { type: 'potion', amount: 5, potionType: 'xp', description: '5 XP Potions' },
      { type: 'potion', amount: 3, potionType: 'energy', description: '3 Energy Potions' }
    ]
  },
  {
    tier: 6,
    requiredPoints: 1000,
    rewards: [
      { type: 'coins', amount: 2000, description: '2000 Coins' }
    ],
    premiumRewards: [
      { type: 'coins', amount: 10000, description: '10000 Coins' },
      { type: 'special', description: 'Amazon Insect Chest' }
    ]
  },
  {
    tier: 7,
    requiredPoints: 1350,
    rewards: [
      { type: 'potion', amount: 2, potionType: 'energy', description: '2 Energy Potions' }
    ],
    premiumRewards: [
      { type: 'potion', amount: 5, potionType: 'energy', description: '5 Energy Potions' },
      { type: 'skill-roll', amount: 15, description: '15 Skill Rolls' }
    ]
  },
  {
    tier: 8,
    requiredPoints: 1750,
    rewards: [
      { type: 'skill-roll', amount: 5, description: '5 Skill Rolls' }
    ],
    premiumRewards: [
      { type: 'skill-roll', amount: 20, description: '20 Skill Rolls' },
      { type: 'coins', amount: 15000, description: '15000 Coins' }
    ]
  },
  {
    tier: 9,
    requiredPoints: 2200,
    rewards: [
      { type: 'coins', amount: 5000, description: '5000 Coins' }
    ],
    premiumRewards: [
      { type: 'coins', amount: 20000, description: '20000 Coins' },
      { type: 'potion', amount: 10, potionType: 'luck', description: '10 Luck Potions' }
    ]
  },
  {
    tier: 10,
    requiredPoints: 2700,
    rewards: [
      { type: 'potion', amount: 3, potionType: 'luck', description: '3 Luck Potions' },
      { type: 'potion', amount: 3, potionType: 'xp', description: '3 XP Potions' },
      { type: 'potion', amount: 3, potionType: 'energy', description: '3 Energy Potions' }
    ],
    premiumRewards: [
      { type: 'potion', amount: 10, potionType: 'luck', description: '10 Luck Potions' },
      { type: 'potion', amount: 10, potionType: 'xp', description: '10 XP Potions' },
      { type: 'potion', amount: 10, potionType: 'energy', description: '10 Energy Potions' },
      { type: 'special', description: 'Legendary Amazon Chest' }
    ]
  },
  {
    tier: 11,
    requiredPoints: 3300,
    rewards: [
      { type: 'coins', amount: 7500, description: '7500 Coins' }
    ],
    premiumRewards: [
      { type: 'coins', amount: 30000, description: '30000 Coins' },
      { type: 'skill-roll', amount: 25, description: '25 Skill Rolls' }
    ]
  },
  {
    tier: 12,
    requiredPoints: 4000,
    rewards: [
      { type: 'skill-roll', amount: 10, description: '10 Skill Rolls' }
    ],
    premiumRewards: [
      { type: 'skill-roll', amount: 35, description: '35 Skill Rolls' },
      { type: 'special', description: 'Epic Amazon Chest' }
    ]
  },
  {
    tier: 13,
    requiredPoints: 4800,
    rewards: [
      { type: 'coins', amount: 10000, description: '10000 Coins' }
    ],
    premiumRewards: [
      { type: 'coins', amount: 50000, description: '50000 Coins' },
      { type: 'potion', amount: 15, potionType: 'xp', description: '15 XP Potions' }
    ]
  },
  {
    tier: 14,
    requiredPoints: 5700,
    rewards: [
      { type: 'potion', amount: 5, potionType: 'luck', description: '5 Luck Potions' }
    ],
    premiumRewards: [
      { type: 'potion', amount: 20, potionType: 'luck', description: '20 Luck Potions' },
      { type: 'skill-roll', amount: 50, description: '50 Skill Rolls' }
    ]
  },
  {
    tier: 15,
    requiredPoints: 6700,
    rewards: [
      { type: 'special', description: 'Legendary Insect Chest' },
      { type: 'coins', amount: 15000, description: '15000 Coins' }
    ],
    premiumRewards: [
      { type: 'special', description: 'Mythic Amazon Chest' },
      { type: 'coins', amount: 100000, description: '100000 Coins' },
      { type: 'potion', amount: 25, potionType: 'luck', description: '25 Luck Potions' },
      { type: 'potion', amount: 25, potionType: 'xp', description: '25 XP Potions' },
      { type: 'potion', amount: 25, potionType: 'energy', description: '25 Energy Potions' },
      { type: 'skill-roll', amount: 100, description: '100 Skill Rolls' }
    ]
  }
];