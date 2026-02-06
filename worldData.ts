export interface Stage {
  id: number;
  name: string;
  difficulty: number; // 1-10
  requiredRank: number;
  rewards: {
    rolls: number;
    potions?: { luck?: number; xp?: number; energy?: number };
  };
  opponentLevel: number;
  opponentCount: number; // How many insects the AI has
  boss?: {
    name: string;
    insectId: string; // Specific insect to use as boss
    levelBoost: number; // Extra levels above opponentLevel
    statMultiplier: number; // Multiplier for boss stats (1.5 = 50% stronger)
    passiveBoost?: string[]; // Extra passive abilities
  };
}

export interface World {
  id: number;
  name: string;
  emoji: string;
  description: string;
  theme: string;
  color: string;
  stages: Stage[];
  unlockRequirement: {
    rank?: number;
    previousWorldCompleted?: number;
  };
}

export const WORLDS: World[] = [
  {
    id: 1,
    name: 'Garden Meadows',
    emoji: '🌼',
    description: 'A peaceful garden where your journey begins',
    theme: 'garden',
    color: '#10b981',
    unlockRequirement: {},
    stages: [
      {
        id: 1,
        name: 'First Steps',
        difficulty: 1,
        requiredRank: 1,
        rewards: { rolls: 1 },
        opponentLevel: 1,
        opponentCount: 1
      },
      {
        id: 2,
        name: 'Garden Path',
        difficulty: 1,
        requiredRank: 1,
        rewards: { rolls: 1, potions: { energy: 1 } },
        opponentLevel: 1,
        opponentCount: 2
      },
      {
        id: 3,
        name: 'Flower Beds',
        difficulty: 2,
        requiredRank: 1,
        rewards: { rolls: 2 },
        opponentLevel: 2,
        opponentCount: 2
      },
      {
        id: 4,
        name: 'Butterfly Grove',
        difficulty: 2,
        requiredRank: 2,
        rewards: { rolls: 2, potions: { luck: 1 } },
        opponentLevel: 2,
        opponentCount: 2
      },
      {
        id: 5,
        name: 'Rose Garden',
        difficulty: 3,
        requiredRank: 2,
        rewards: { rolls: 2 },
        opponentLevel: 3,
        opponentCount: 3
      },
      {
        id: 6,
        name: 'Herb Patch',
        difficulty: 3,
        requiredRank: 2,
        rewards: { rolls: 3, potions: { xp: 1 } },
        opponentLevel: 3,
        opponentCount: 3
      },
      {
        id: 7,
        name: 'Vegetable Rows',
        difficulty: 4,
        requiredRank: 3,
        rewards: { rolls: 3 },
        opponentLevel: 4,
        opponentCount: 3
      },
      {
        id: 8,
        name: 'Orchard Edge',
        difficulty: 4,
        requiredRank: 3,
        rewards: { rolls: 3, potions: { energy: 2 } },
        opponentLevel: 4,
        opponentCount: 3
      },
      {
        id: 9,
        name: 'Greenhouse',
        difficulty: 5,
        requiredRank: 3,
        rewards: { rolls: 4 },
        opponentLevel: 5,
        opponentCount: 4
      },
      {
        id: 10,
        name: 'Garden Guardian',
        difficulty: 5,
        requiredRank: 3,
        rewards: { rolls: 5, potions: { luck: 2, xp: 2, energy: 2 } },
        opponentLevel: 6,
        opponentCount: 4,
        boss: {
          name: 'Garden Guardian',
          insectId: 'garden_guardian',
          levelBoost: 2,
          statMultiplier: 1.5,
          passiveBoost: ['regeneration']
        }
      }
    ]
  },
  {
    id: 2,
    name: 'Forest Depths',
    emoji: '🌲',
    description: 'Venture into the mysterious forest',
    theme: 'forest',
    color: '#059669',
    unlockRequirement: { rank: 4, previousWorldCompleted: 1 },
    stages: [
      {
        id: 11,
        name: 'Forest Entrance',
        difficulty: 5,
        requiredRank: 4,
        rewards: { rolls: 3 },
        opponentLevel: 6,
        opponentCount: 3
      },
      {
        id: 12,
        name: 'Mossy Trail',
        difficulty: 5,
        requiredRank: 4,
        rewards: { rolls: 3, potions: { luck: 1 } },
        opponentLevel: 7,
        opponentCount: 4
      },
      {
        id: 13,
        name: 'Mushroom Circle',
        difficulty: 6,
        requiredRank: 4,
        rewards: { rolls: 4 },
        opponentLevel: 7,
        opponentCount: 4
      },
      {
        id: 14,
        name: 'Ancient Trees',
        difficulty: 6,
        requiredRank: 5,
        rewards: { rolls: 4, potions: { xp: 2 } },
        opponentLevel: 8,
        opponentCount: 4
      },
      {
        id: 15,
        name: 'Dark Hollow',
        difficulty: 6,
        requiredRank: 5,
        rewards: { rolls: 4 },
        opponentLevel: 8,
        opponentCount: 5
      },
      {
        id: 16,
        name: 'Spider Webs',
        difficulty: 7,
        requiredRank: 5,
        rewards: { rolls: 5, potions: { energy: 3 } },
        opponentLevel: 9,
        opponentCount: 5
      },
      {
        id: 17,
        name: 'Log Bridge',
        difficulty: 7,
        requiredRank: 5,
        rewards: { rolls: 5 },
        opponentLevel: 9,
        opponentCount: 5
      },
      {
        id: 18,
        name: 'Canopy Heights',
        difficulty: 7,
        requiredRank: 6,
        rewards: { rolls: 5, potions: { luck: 2 } },
        opponentLevel: 10,
        opponentCount: 5
      },
      {
        id: 19,
        name: 'Forest Heart',
        difficulty: 8,
        requiredRank: 6,
        rewards: { rolls: 6 },
        opponentLevel: 11,
        opponentCount: 6
      },
      {
        id: 20,
        name: 'Forest King',
        difficulty: 8,
        requiredRank: 6,
        rewards: { rolls: 8, potions: { luck: 3, xp: 3, energy: 3 } },
        opponentLevel: 12,
        opponentCount: 6,
        boss: {
          name: 'Forest King',
          insectId: 'forest_king',
          levelBoost: 3,
          statMultiplier: 2,
          passiveBoost: ['thorns']
        }
      }
    ]
  },
  {
    id: 3,
    name: 'Desert Dunes',
    emoji: '🏜️',
    description: 'Survive the harsh desert terrain',
    theme: 'desert',
    color: '#f59e0b',
    unlockRequirement: { rank: 6, previousWorldCompleted: 2 },
    stages: [
      {
        id: 21,
        name: 'Sand Entrance',
        difficulty: 8,
        requiredRank: 6,
        rewards: { rolls: 5 },
        opponentLevel: 12,
        opponentCount: 5
      },
      {
        id: 22,
        name: 'Scorching Path',
        difficulty: 8,
        requiredRank: 6,
        rewards: { rolls: 5, potions: { energy: 3 } },
        opponentLevel: 13,
        opponentCount: 5
      },
      {
        id: 23,
        name: 'Cactus Valley',
        difficulty: 9,
        requiredRank: 7,
        rewards: { rolls: 6 },
        opponentLevel: 13,
        opponentCount: 6
      },
      {
        id: 24,
        name: 'Oasis Springs',
        difficulty: 9,
        requiredRank: 7,
        rewards: { rolls: 6, potions: { xp: 3 } },
        opponentLevel: 14,
        opponentCount: 6
      },
      {
        id: 25,
        name: 'Sandstorm Zone',
        difficulty: 9,
        requiredRank: 7,
        rewards: { rolls: 6 },
        opponentLevel: 14,
        opponentCount: 6
      },
      {
        id: 26,
        name: 'Rock Formations',
        difficulty: 10,
        requiredRank: 7,
        rewards: { rolls: 7, potions: { luck: 3 } },
        opponentLevel: 15,
        opponentCount: 6
      },
      {
        id: 27,
        name: 'Scorpion Nest',
        difficulty: 10,
        requiredRank: 8,
        rewards: { rolls: 7 },
        opponentLevel: 15,
        opponentCount: 7
      },
      {
        id: 28,
        name: 'Ancient Ruins',
        difficulty: 10,
        requiredRank: 8,
        rewards: { rolls: 7, potions: { energy: 4 } },
        opponentLevel: 16,
        opponentCount: 7
      },
      {
        id: 29,
        name: 'Dune Summit',
        difficulty: 11,
        requiredRank: 8,
        rewards: { rolls: 8 },
        opponentLevel: 17,
        opponentCount: 7
      },
      {
        id: 30,
        name: 'Desert Pharaoh',
        difficulty: 11,
        requiredRank: 8,
        rewards: { rolls: 10, potions: { luck: 5, xp: 5, energy: 5 } },
        opponentLevel: 18,
        opponentCount: 8,
        boss: {
          name: 'Desert Pharaoh',
          insectId: 'desert_pharaoh',
          levelBoost: 4,
          statMultiplier: 2.5,
          passiveBoost: ['sandstorm']
        }
      }
    ]
  },
  {
    id: 4,
    name: 'Swamp Marshes',
    emoji: '🐊',
    description: 'Navigate the dangerous swamplands',
    theme: 'swamp',
    color: '#065f46',
    unlockRequirement: { rank: 8, previousWorldCompleted: 3 },
    stages: [
      {
        id: 31,
        name: 'Marsh Edge',
        difficulty: 11,
        requiredRank: 8,
        rewards: { rolls: 7 },
        opponentLevel: 18,
        opponentCount: 6
      },
      {
        id: 32,
        name: 'Murky Waters',
        difficulty: 11,
        requiredRank: 8,
        rewards: { rolls: 7, potions: { luck: 4 } },
        opponentLevel: 19,
        opponentCount: 7
      },
      {
        id: 33,
        name: 'Lily Pads',
        difficulty: 12,
        requiredRank: 9,
        rewards: { rolls: 8 },
        opponentLevel: 19,
        opponentCount: 7
      },
      {
        id: 34,
        name: 'Mangrove Maze',
        difficulty: 12,
        requiredRank: 9,
        rewards: { rolls: 8, potions: { xp: 4 } },
        opponentLevel: 20,
        opponentCount: 7
      },
      {
        id: 35,
        name: 'Firefly Swamp',
        difficulty: 12,
        requiredRank: 9,
        rewards: { rolls: 8 },
        opponentLevel: 20,
        opponentCount: 8
      },
      {
        id: 36,
        name: 'Poison Bog',
        difficulty: 13,
        requiredRank: 9,
        rewards: { rolls: 9, potions: { energy: 5 } },
        opponentLevel: 21,
        opponentCount: 8
      },
      {
        id: 37,
        name: 'Crocodile Cove',
        difficulty: 13,
        requiredRank: 9,
        rewards: { rolls: 9 },
        opponentLevel: 21,
        opponentCount: 8
      },
      {
        id: 38,
        name: 'Mosquito Cloud',
        difficulty: 13,
        requiredRank: 10,
        rewards: { rolls: 9, potions: { luck: 4 } },
        opponentLevel: 22,
        opponentCount: 8
      },
      {
        id: 39,
        name: 'Deep Marsh',
        difficulty: 14,
        requiredRank: 10,
        rewards: { rolls: 10 },
        opponentLevel: 23,
        opponentCount: 9
      },
      {
        id: 40,
        name: 'Swamp Tyrant',
        difficulty: 14,
        requiredRank: 10,
        rewards: { rolls: 12, potions: { luck: 6, xp: 6, energy: 6 } },
        opponentLevel: 25,
        opponentCount: 10,
        boss: {
          name: 'Swamp Tyrant',
          insectId: 'swamp_tyrant',
          levelBoost: 5,
          statMultiplier: 3,
          passiveBoost: ['poison']
        }
      }
    ]
  },
  {
    id: 5,
    name: 'Volcanic Peaks',
    emoji: '🌋',
    description: 'Conquer the legendary volcanic mountains',
    theme: 'volcano',
    color: '#dc2626',
    unlockRequirement: { rank: 10, previousWorldCompleted: 4 },
    stages: [
      {
        id: 41,
        name: 'Base Camp',
        difficulty: 14,
        requiredRank: 10,
        rewards: { rolls: 9 },
        opponentLevel: 25,
        opponentCount: 8
      },
      {
        id: 42,
        name: 'Lava Flow',
        difficulty: 15,
        requiredRank: 10,
        rewards: { rolls: 10, potions: { energy: 6 } },
        opponentLevel: 26,
        opponentCount: 9
      },
      {
        id: 43,
        name: 'Ash Plains',
        difficulty: 15,
        requiredRank: 10,
        rewards: { rolls: 10 },
        opponentLevel: 27,
        opponentCount: 9
      },
      {
        id: 44,
        name: 'Obsidian Cliffs',
        difficulty: 16,
        requiredRank: 10,
        rewards: { rolls: 11, potions: { xp: 6 } },
        opponentLevel: 28,
        opponentCount: 9
      },
      {
        id: 45,
        name: 'Molten Caves',
        difficulty: 16,
        requiredRank: 10,
        rewards: { rolls: 11 },
        opponentLevel: 29,
        opponentCount: 10
      },
      {
        id: 46,
        name: 'Fire Beetle Nest',
        difficulty: 17,
        requiredRank: 10,
        rewards: { rolls: 12, potions: { luck: 6 } },
        opponentLevel: 30,
        opponentCount: 10
      },
      {
        id: 47,
        name: 'Eruption Zone',
        difficulty: 17,
        requiredRank: 10,
        rewards: { rolls: 12 },
        opponentLevel: 32,
        opponentCount: 10
      },
      {
        id: 48,
        name: 'Crater Ridge',
        difficulty: 18,
        requiredRank: 10,
        rewards: { rolls: 13, potions: { energy: 7 } },
        opponentLevel: 34,
        opponentCount: 11
      },
      {
        id: 49,
        name: 'Summit Approach',
        difficulty: 19,
        requiredRank: 10,
        rewards: { rolls: 15 },
        opponentLevel: 36,
        opponentCount: 12
      },
      {
        id: 50,
        name: 'Volcanic Emperor',
        difficulty: 20,
        requiredRank: 10,
        rewards: { rolls: 20, potions: { luck: 10, xp: 10, energy: 10 } },
        opponentLevel: 40,
        opponentCount: 15,
        boss: {
          name: 'Volcanic Emperor',
          insectId: 'volcanic_emperor',
          levelBoost: 6,
          statMultiplier: 4,
          passiveBoost: ['lava']
        }
      }
    ]
  }
];

export function getWorldProgress(): { worldId: number; completedStages: number[] } {
  const data = localStorage.getItem('world_progress');
  return data ? JSON.parse(data) : { worldId: 1, completedStages: [] };
}

export function getAllWorldProgress(): Record<number, number[]> {
  const data = localStorage.getItem('all_world_progress');
  return data ? JSON.parse(data) : {};
}

export function saveStageCompletion(worldId: number, stageId: number): void {
  const progress = getAllWorldProgress();
  if (!progress[worldId]) {
    progress[worldId] = [];
  }
  if (!progress[worldId].includes(stageId)) {
    progress[worldId].push(stageId);
  }
  localStorage.setItem('all_world_progress', JSON.stringify(progress));
}

export function isStageUnlocked(worldId: number, stageId: number, userRank: number): boolean {
  const world = WORLDS.find(w => w.id === worldId);
  if (!world) return false;

  const stage = world.stages.find(s => s.id === stageId);
  if (!stage) return false;

  // Check rank requirement
  if (userRank < stage.requiredRank) return false;

  // First stage of first world is always unlocked
  if (worldId === 1 && stageId === 1) return true;

  // Check if previous stage is completed
  const progress = getAllWorldProgress();
  const worldProgress = progress[worldId] || [];
  
  const stageIndex = world.stages.findIndex(s => s.id === stageId);
  if (stageIndex === 0) {
    // First stage of world - check if world is unlocked
    return isWorldUnlocked(worldId, userRank);
  }

  // Check if previous stage is completed
  const previousStage = world.stages[stageIndex - 1];
  return worldProgress.includes(previousStage.id);
}

export function isWorldUnlocked(worldId: number, userRank: number): boolean {
  const world = WORLDS.find(w => w.id === worldId);
  if (!world) return false;

  // First world always unlocked
  if (worldId === 1) return true;

  // Check rank requirement
  if (world.unlockRequirement.rank && userRank < world.unlockRequirement.rank) {
    return false;
  }

  // Check if previous world is completed
  if (world.unlockRequirement.previousWorldCompleted) {
    const previousWorldId = world.unlockRequirement.previousWorldCompleted;
    const previousWorld = WORLDS.find(w => w.id === previousWorldId);
    if (!previousWorld) return false;

    const progress = getAllWorldProgress();
    const previousProgress = progress[previousWorldId] || [];
    
    // Check if all stages of previous world are completed
    const allStagesCompleted = previousWorld.stages.every(stage => 
      previousProgress.includes(stage.id)
    );
    
    return allStagesCompleted;
  }

  return true;
}

export function getWorldCompletionPercentage(worldId: number): number {
  const world = WORLDS.find(w => w.id === worldId);
  if (!world) return 0;

  const progress = getAllWorldProgress();
  const worldProgress = progress[worldId] || [];
  
  return Math.round((worldProgress.length / world.stages.length) * 100);
}