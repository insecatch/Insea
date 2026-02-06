// Passive abilities that trigger automatically during battle
export type PassiveTrigger = 'battle-start' | 'turn-start' | 'on-hit' | 'on-attacked' | 'low-health' | 'always';

export interface PassiveAbility {
  id: string;
  name: string;
  description: string;
  trigger: PassiveTrigger;
  effects: {
    // Stat modifiers (always active)
    damageBonus?: number; // % increase to damage dealt
    defenseBonus?: number; // % reduction to damage taken
    speedBonus?: number; // flat bonus to initiative rolls
    
    // Triggered effects
    heal?: number; // HP restored
    counterDamage?: number; // % of damage taken is reflected
    energyRestore?: number; // energy restored
    bonusDamage?: number; // extra damage dealt
    
    // Status effects
    poison?: number; // damage per turn to opponent
    regen?: number; // healing per turn
    dodge?: number; // % chance to dodge attacks
    crit?: number; // % chance for critical hits (2x damage)
  };
  icon: string;
}

// Passive abilities database
export const PASSIVE_ABILITIES: Record<string, PassiveAbility> = {
  // Common insect passives
  'tough-exoskeleton': {
    id: 'tough-exoskeleton',
    name: 'Tough Exoskeleton',
    description: 'Natural armor reduces damage taken by 5%',
    trigger: 'always',
    effects: { defenseBonus: 5 },
    icon: '🛡️'
  },
  
  'swift-wings': {
    id: 'swift-wings',
    name: 'Swift Wings',
    description: '+2 to initiative rolls',
    trigger: 'always',
    effects: { speedBonus: 2 },
    icon: '💨'
  },
  
  'venomous-body': {
    id: 'venomous-body',
    name: 'Venomous Body',
    description: 'Poison attackers when hit (3 damage per turn)',
    trigger: 'on-attacked',
    effects: { poison: 3 },
    icon: '☠️'
  },
  
  'regeneration': {
    id: 'regeneration',
    name: 'Regeneration',
    description: 'Heal 5 HP at the start of each turn',
    trigger: 'turn-start',
    effects: { heal: 5 },
    icon: '💚'
  },
  
  'energy-efficient': {
    id: 'energy-efficient',
    name: 'Energy Efficient',
    description: 'Restore 1 energy at the start of each turn',
    trigger: 'turn-start',
    effects: { energyRestore: 1 },
    icon: '⚡'
  },
  
  'aggressive': {
    id: 'aggressive',
    name: 'Aggressive',
    description: 'Deal 10% bonus damage',
    trigger: 'always',
    effects: { damageBonus: 10 },
    icon: '⚔️'
  },
  
  'thorns': {
    id: 'thorns',
    name: 'Thorns',
    description: 'Reflect 15% of damage taken',
    trigger: 'on-attacked',
    effects: { counterDamage: 15 },
    icon: '🌵'
  },
  
  'evasive': {
    id: 'evasive',
    name: 'Evasive',
    description: '10% chance to dodge attacks',
    trigger: 'always',
    effects: { dodge: 10 },
    icon: '👻'
  },
  
  'battle-hardened': {
    id: 'battle-hardened',
    name: 'Battle Hardened',
    description: 'Restore 15 HP when battle starts',
    trigger: 'battle-start',
    effects: { heal: 15 },
    icon: '💪'
  },
  
  'last-stand': {
    id: 'last-stand',
    name: 'Last Stand',
    description: 'When HP drops below 30%, deal 20% bonus damage',
    trigger: 'low-health',
    effects: { damageBonus: 20 },
    icon: '🔥'
  },
  
  'predator': {
    id: 'predator',
    name: 'Predator',
    description: '15% chance for critical hits (2x damage)',
    trigger: 'always',
    effects: { crit: 15 },
    icon: '🎯'
  },
  
  'fortified': {
    id: 'fortified',
    name: 'Fortified',
    description: 'Reduce all damage taken by 10%',
    trigger: 'always',
    effects: { defenseBonus: 10 },
    icon: '🏰'
  },
  
  'toxic-aura': {
    id: 'toxic-aura',
    name: 'Toxic Aura',
    description: 'Poison opponent at start of battle (5 damage per turn)',
    trigger: 'battle-start',
    effects: { poison: 5 },
    icon: '💀'
  },
  
  'rapid-metabolism': {
    id: 'rapid-metabolism',
    name: 'Rapid Metabolism',
    description: 'Heal 8 HP per turn',
    trigger: 'turn-start',
    effects: { heal: 8 },
    icon: '🌿'
  },
  
  'armored': {
    id: 'armored',
    name: 'Armored',
    description: 'Reduce damage taken by 15%',
    trigger: 'always',
    effects: { defenseBonus: 15 },
    icon: '🛡️'
  },
  
  'berserker': {
    id: 'berserker',
    name: 'Berserker',
    description: 'Deal 15% bonus damage',
    trigger: 'always',
    effects: { damageBonus: 15 },
    icon: '💥'
  },
  
  'lightning-reflexes': {
    id: 'lightning-reflexes',
    name: 'Lightning Reflexes',
    description: '+5 to initiative rolls',
    trigger: 'always',
    effects: { speedBonus: 5 },
    icon: '⚡'
  },
  
  'venom-master': {
    id: 'venom-master',
    name: 'Venom Master',
    description: 'Poison attackers for 8 damage per turn',
    trigger: 'on-attacked',
    effects: { poison: 8 },
    icon: '🐍'
  },
  
  'unstoppable': {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: '20% chance to dodge, 20% bonus damage',
    trigger: 'always',
    effects: { dodge: 20, damageBonus: 20 },
    icon: '👑'
  },
  
  'legendary-aura': {
    id: 'legendary-aura',
    name: 'Legendary Aura',
    description: 'Reduce damage by 20%, deal 25% bonus damage',
    trigger: 'always',
    effects: { defenseBonus: 20, damageBonus: 25 },
    icon: '✨'
  },

  // BOSS-EXCLUSIVE PASSIVES
  'sandstorm': {
    id: 'sandstorm',
    name: 'Sandstorm',
    description: '25% dodge chance and poison attackers for 5 damage per turn',
    trigger: 'always',
    effects: { dodge: 25, poison: 5 },
    icon: '🌪️'
  },

  'poison': {
    id: 'poison',
    name: 'Poison Mastery',
    description: 'All attacks poison the enemy for 10 damage per turn',
    trigger: 'on-hit',
    effects: { poison: 10 },
    icon: '☠️'
  },

  'lava': {
    id: 'lava',
    name: 'Lava Armor',
    description: '30% damage reduction and burn attackers for 12 damage per turn',
    trigger: 'always',
    effects: { defenseBonus: 30, poison: 12 },
    icon: '🔥'
  },

  // MYTHIC EXCLUSIVE PASSIVES
  'cosmic-supremacy': {
    id: 'cosmic-supremacy',
    name: 'Cosmic Supremacy',
    description: '50% damage boost, 40% damage reduction, 30% dodge, 50% crit chance',
    trigger: 'always',
    effects: { damageBonus: 50, defenseBonus: 40, dodge: 30, crit: 50 },
    icon: '👁️'
  },

  'reality-warp': {
    id: 'reality-warp',
    name: 'Reality Warp',
    description: 'Heal 20 HP per turn and poison enemies for 20 damage per turn',
    trigger: 'turn-start',
    effects: { heal: 20, poison: 20 },
    icon: '🌀'
  },

  'omnipotent': {
    id: 'omnipotent',
    name: 'Omnipotent',
    description: '+10 to initiative rolls, 100% counter damage reflection',
    trigger: 'always',
    effects: { speedBonus: 10, counterDamage: 100 },
    icon: '✨'
  },

  // GOLIATH BEETLE EXCLUSIVE PASSIVES
  'titan-strength': {
    id: 'titan-strength',
    name: 'Titan Strength',
    description: 'Deal 30% bonus damage',
    trigger: 'always',
    effects: { damageBonus: 30 },
    icon: '💪'
  },

  // CHAN'S MEGASTICK EXCLUSIVE PASSIVES
  'camouflage-master': {
    id: 'camouflage-master',
    name: 'Camouflage Master',
    description: '50% chance to dodge attacks',
    trigger: 'always',
    effects: { dodge: 50 },
    icon: '👻'
  }
};

// Map insects to their passive abilities
export const INSECT_PASSIVES: Record<string, string[]> = {
  // Common insects - 1 passive
  'ant': ['tough-exoskeleton'],
  'ladybug': ['evasive'],
  'housefly': ['swift-wings'],
  'mosquito': ['venomous-body'],
  'grasshopper': ['swift-wings'],
  'cricket': ['energy-efficient'],
  'common-beetle': ['tough-exoskeleton'],
  'aphid': ['regeneration'],
  
  // Uncommon insects - 1-2 passives
  'butterfly': ['swift-wings', 'evasive'],
  'dragonfly': ['swift-wings', 'aggressive'],
  'bumblebee': ['venomous-body', 'energy-efficient'],
  'firefly': ['energy-efficient', 'evasive'],
  'walking-stick': ['tough-exoskeleton', 'regeneration'],
  'moth': ['evasive'],
  'weevil': ['tough-exoskeleton'],
  'earwig': ['aggressive'],
  
  // Rare insects - 2 passives
  'praying-mantis': ['predator', 'aggressive'],
  'stag-beetle': ['tough-exoskeleton', 'aggressive'],
  'hercules-beetle': ['fortified', 'battle-hardened'],
  'tarantula': ['venomous-body', 'predator'],
  'scorpion': ['toxic-aura', 'thorns'],
  'centipede': ['venomous-body', 'swift-wings'],
  'millipede': ['tough-exoskeleton', 'regeneration'],
  'cicada': ['energy-efficient', 'evasive'],
  
  // Epic insects - 2-3 passives
  'atlas-moth': ['evasive', 'regeneration', 'energy-efficient'],
  'goliath-beetle': ['armored', 'battle-hardened', 'aggressive'],
  'emperor-dragonfly': ['lightning-reflexes', 'predator', 'aggressive'],
  'orchid-mantis': ['predator', 'evasive', 'aggressive'],
  'jewel-beetle': ['fortified', 'thorns', 'regeneration'],
  'rhinoceros-beetle': ['armored', 'berserker', 'battle-hardened'],
  'tarantula-hawk': ['venom-master', 'predator', 'lightning-reflexes'],
  'giant-water-bug': ['fortified', 'predator', 'aggressive'],
  
  // Legendary insects - 3 passives
  'titan-beetle': ['legendary-aura', 'berserker', 'battle-hardened'],
  'luna-moth': ['rapid-metabolism', 'energy-efficient', 'evasive'],
  'rainbow-stag': ['unstoppable', 'predator', 'lightning-reflexes'],
  'phoenix-butterfly': ['rapid-metabolism', 'last-stand', 'berserker'],
  'crystal-mantis': ['predator', 'armored', 'lightning-reflexes'],
  'shadow-scorpion': ['toxic-aura', 'venom-master', 'evasive'],
  'thunder-beetle': ['lightning-reflexes', 'berserker', 'energy-efficient'],
  'ice-dragonfly': ['armored', 'predator', 'lightning-reflexes'],
  
  // Dangerous insects - strong passives
  'black-widow': ['venom-master', 'predator'],
  'funnel-web-spider': ['toxic-aura', 'venomous-body'],
  'bullet-ant': ['aggressive', 'venomous-body'],
  'kissing-bug': ['venomous-body', 'evasive'],
  'driver-ant': ['aggressive', 'battle-hardened'],
  'fire-ant': ['venomous-body', 'aggressive'],
  'asian-hornet': ['venom-master', 'aggressive'],
  'deathstalker-scorpion': ['toxic-aura', 'venom-master'],

  // BOSS INSECTS - Extra powerful passives
  'garden_guardian': ['legendary-aura', 'regeneration', 'battle-hardened'],
  'forest_king': ['unstoppable', 'thorns', 'berserker'],
  'desert_pharaoh': ['sandstorm', 'armored', 'predator'],
  'swamp_tyrant': ['poison', 'venom-master', 'fortified'],
  'volcanic_emperor': ['lava', 'legendary-aura', 'berserker'],

  // MYTHIC INSECT - Goliath Beetle
  'goliath_beetle': ['legendary-aura', 'titan-strength', 'berserker'],

  // EXOTIC INSECT - Chan's Megastick
  'chans_megastick': ['camouflage-master', 'evasive', 'legendary-aura']
};

// Get passives for an insect
export function getInsectPassives(insectId: string): PassiveAbility[] {
  const passiveIds = INSECT_PASSIVES[insectId] || [];
  return passiveIds.map(id => PASSIVE_ABILITIES[id]).filter(Boolean);
}