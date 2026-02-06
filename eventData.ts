export interface SpecialEvent {
  id: number;
  name: string;
  description: string;
  theme: string;
  emoji: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  color: string;
  gradient: string;
  
  challenges: EventChallenge[];
  rewards: EventRewards;
  specialMechanics?: string[];
}

export interface EventChallenge {
  id: number;
  name: string;
  description: string;
  difficulty: number;
  requirement: string;
  
  enemyTeam: EventEnemy[];
  specialRules: string[];
  
  rewards: {
    rolls: number;
    potions?: {
      luck?: number;
      xp?: number;
      energy?: number;
    };
    exclusiveReward?: string;
  };
}

export interface EventEnemy {
  name: string;
  emoji: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stats: {
    health: number;
    attack: number;
    defense: number;
    speed: number;
  };
  specialAbility?: string;
}

export interface EventRewards {
  completionBonus: {
    rolls: number;
    potions: {
      luck: number;
      xp: number;
      energy: number;
    };
  };
  exclusiveTitle?: string;
  exclusiveBadge?: string;
}

// Helper to check if event is currently active
export function isEventActive(event: SpecialEvent): boolean {
  const now = new Date();
  return now >= event.startDate && now <= event.endDate;
}

// Current Events Database
export const SPECIAL_EVENTS: SpecialEvent[] = [
  {
    id: 1,
    name: "Cursed Insect Domain",
    description: "A mysterious domain has opened, filled with cursed insects! Face powerful enemies in a gauntlet-style battle. Defeat all waves without healing!",
    theme: "Jujutsu Kaisen Inspired",
    emoji: "👻",
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-02-28'),
    isActive: true,
    color: '#9333ea',
    gradient: 'from-purple-600 via-violet-600 to-indigo-600',
    
    specialMechanics: [
      'No healing between waves',
      'Enemies deal 50% more damage',
      'Energy regenerates 2x faster',
      'All enemies have special cursed abilities',
      'Boss wave at the end with triple stats'
    ],
    
    challenges: [
      {
        id: 1,
        name: "Domain Expansion: First Wave",
        description: "Face the first wave of cursed insects. They're faster and deadlier than normal bugs!",
        difficulty: 15,
        requirement: "Rank 5+",
        
        specialRules: [
          'No HP regeneration between fights',
          'Enemies have 1.5x speed',
          'Energy regenerates 20 per turn instead of 10'
        ],
        
        enemyTeam: [
          {
            name: "Cursed Mantis",
            emoji: "🦗",
            rarity: "epic",
            stats: { health: 150, attack: 80, defense: 40, speed: 90 },
            specialAbility: "Shadow Strike - Ignores 50% defense"
          },
          {
            name: "Void Beetle",
            emoji: "🪲",
            rarity: "epic",
            stats: { health: 180, attack: 70, defense: 60, speed: 70 },
            specialAbility: "Void Shield - Reduces damage by 20"
          }
        ],
        
        rewards: {
          rolls: 10,
          potions: { luck: 2, xp: 3, energy: 2 },
          exclusiveReward: "Cursed Domain Badge"
        }
      },
      {
        id: 2,
        name: "Domain Expansion: Second Wave",
        description: "The domain intensifies! More powerful cursed insects appear!",
        difficulty: 25,
        requirement: "Complete First Wave",
        
        specialRules: [
          'No HP regeneration (carries from previous wave)',
          'Enemies have 1.8x all stats',
          'Energy regenerates 20 per turn',
          'Enemies attack twice per turn'
        ],
        
        enemyTeam: [
          {
            name: "Cursed Dragonfly",
            emoji: "🦋",
            rarity: "legendary",
            stats: { health: 200, attack: 95, defense: 50, speed: 120 },
            specialAbility: "Rapid Assault - Attacks twice per turn"
          },
          {
            name: "Shadow Wasp",
            emoji: "🐝",
            rarity: "epic",
            stats: { health: 160, attack: 100, defense: 40, speed: 110 },
            specialAbility: "Venom Strike - 20 damage per turn DOT"
          },
          {
            name: "Cursed Moth",
            emoji: "🦋",
            rarity: "epic",
            stats: { health: 140, attack: 75, defense: 70, speed: 80 },
            specialAbility: "Curse Shield - Reflects 30% damage"
          }
        ],
        
        rewards: {
          rolls: 15,
          potions: { luck: 3, xp: 5, energy: 3 },
          exclusiveReward: "Domain Survivor Badge"
        }
      },
      {
        id: 3,
        name: "Domain Expansion: BOSS BATTLE",
        description: "The Domain Master appears! An ancient cursed insect with overwhelming power!",
        difficulty: 40,
        requirement: "Complete Second Wave",
        
        specialRules: [
          'No HP regeneration (carries from previous waves)',
          'Boss has 3x stats',
          'Boss has multiple special abilities',
          'Energy regenerates 25 per turn',
          'Boss can use ultimate skills'
        ],
        
        enemyTeam: [
          {
            name: "Ryomen Sukuna Beetle",
            emoji: "👹",
            rarity: "legendary",
            stats: { health: 500, attack: 150, defense: 100, speed: 130 },
            specialAbility: "Malevolent Shrine - Deals 50 damage to you each turn + normal attack"
          }
        ],
        
        rewards: {
          rolls: 30,
          potions: { luck: 10, xp: 15, energy: 10 },
          exclusiveReward: "Domain Master Title + 🏆 Domain Conqueror Badge"
        }
      }
    ],
    
    rewards: {
      completionBonus: {
        rolls: 50,
        potions: { luck: 20, xp: 30, energy: 20 }
      },
      exclusiveTitle: "Domain Conqueror",
      exclusiveBadge: "🏆"
    }
  },
  
  {
    id: 2,
    name: "Valentine's Love Bug Festival",
    description: "Celebrate Valentine's Day by catching rare love-themed insects! Increased luck for pink and red bugs!",
    theme: "Valentine's Special",
    emoji: "💕",
    startDate: new Date('2026-02-10'),
    endDate: new Date('2026-02-20'),
    isActive: true,
    color: '#ec4899',
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    
    specialMechanics: [
      'Butterflies and Ladybugs have 3x spawn rate',
      '2x luck boost for all captures',
      'Special "Cupid\'s Arrow" skill available during event',
      'Chance to catch exclusive "Love Bug" variant'
    ],
    
    challenges: [
      {
        id: 1,
        name: "Capture 10 Love Bugs",
        description: "Find and capture butterflies or ladybugs to spread the love!",
        difficulty: 5,
        requirement: "None",
        
        specialRules: [
          'Only butterflies and ladybugs count',
          '2x capture luck bonus active'
        ],
        
        enemyTeam: [],
        
        rewards: {
          rolls: 5,
          potions: { luck: 5, xp: 3 },
          exclusiveReward: "💝 Love Bug Collector Badge"
        }
      },
      {
        id: 2,
        name: "Valentine Battle Royale",
        description: "Face a team of love-powered insects in battle!",
        difficulty: 10,
        requirement: "Rank 3+",
        
        specialRules: [
          'All enemies heal 5 HP per turn',
          'Love energy - All attacks have hearts visual effect'
        ],
        
        enemyTeam: [
          {
            name: "Cupid Butterfly",
            emoji: "🦋",
            rarity: "rare",
            stats: { health: 120, attack: 60, defense: 40, speed: 85 },
            specialAbility: "Love Beam - Heals 10 HP after attacking"
          },
          {
            name: "Valentine Ladybug",
            emoji: "🐞",
            rarity: "rare",
            stats: { health: 100, attack: 70, defense: 50, speed: 75 }
          }
        ],
        
        rewards: {
          rolls: 10,
          potions: { luck: 8, xp: 5, energy: 5 },
          exclusiveReward: "💖 Valentine Champion Badge"
        }
      }
    ],
    
    rewards: {
      completionBonus: {
        rolls: 20,
        potions: { luck: 15, xp: 10, energy: 10 }
      },
      exclusiveTitle: "Love Bug Master",
      exclusiveBadge: "💖"
    }
  },

  {
    id: 3,
    name: "Legendary Raid: Giant Ant Queen",
    description: "A massive Ant Queen has been spotted! Team up (solo in this version) to take down this colossal boss!",
    theme: "Raid Boss Event",
    emoji: "👑",
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-03-01'),
    isActive: true,
    color: '#f59e0b',
    gradient: 'from-amber-500 via-orange-500 to-yellow-600',
    
    specialMechanics: [
      'Boss has 1000+ HP',
      'Boss summons minions every 3 turns',
      'Must defeat all minions before damaging boss again',
      'Boss enrages at 50% HP - double damage',
      'Time limit: 20 turns to win'
    ],
    
    challenges: [
      {
        id: 1,
        name: "Giant Ant Queen Raid",
        description: "Face the legendary Ant Queen in an epic battle! Can you survive her swarm?",
        difficulty: 50,
        requirement: "Rank 10+",
        
        specialRules: [
          'Boss has 1000 HP',
          'Summons 2 minions every 3 turns',
          'Must clear minions to damage boss',
          'Enrages at 50% HP (2x damage)',
          '20 turn time limit'
        ],
        
        enemyTeam: [
          {
            name: "Ant Queen Monarch",
            emoji: "👑🐜",
            rarity: "legendary",
            stats: { health: 1000, attack: 120, defense: 80, speed: 60 },
            specialAbility: "Royal Command - Summons 2 soldier ants every 3 turns"
          }
        ],
        
        rewards: {
          rolls: 50,
          potions: { luck: 20, xp: 30, energy: 20 },
          exclusiveReward: "👑 Raid Champion Title + Queen Slayer Badge"
        }
      }
    ],
    
    rewards: {
      completionBonus: {
        rolls: 100,
        potions: { luck: 50, xp: 50, energy: 50 }
      },
      exclusiveTitle: "Queen Slayer",
      exclusiveBadge: "👑"
    }
  }
];

// Get currently active events
export function getActiveEvents(): SpecialEvent[] {
  return SPECIAL_EVENTS.filter(event => isEventActive(event));
}

// Storage for event progress
export function saveEventProgress(eventId: number, challengeId: number, completed: boolean) {
  const key = `event_${eventId}_challenge_${challengeId}`;
  localStorage.setItem(key, completed ? 'true' : 'false');
}

export function getEventProgress(eventId: number, challengeId: number): boolean {
  const key = `event_${eventId}_challenge_${challengeId}`;
  return localStorage.getItem(key) === 'true';
}

export function getEventCompletionCount(eventId: number): number {
  const event = SPECIAL_EVENTS.find(e => e.id === eventId);
  if (!event) return 0;
  
  let completed = 0;
  for (const challenge of event.challenges) {
    if (getEventProgress(eventId, challenge.id)) {
      completed++;
    }
  }
  return completed;
}
