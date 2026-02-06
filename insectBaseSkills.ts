// Base skills that insects start with (no need to unlock)
export interface InsectBaseSkill {
  insectId: string;
  skills: {
    normal: string[]; // skill IDs from SKILL_DATABASE (1-2 skills)
    ultimate?: string; // optional ultimate skill ID
  };
}

// Common skills used by many insects
const COMMON_SKILLS = {
  // Basic attacks
  bite: 'power-hit',
  tackle: 'quick-strike',
  slash: 'heavy-slam',
  
  // Movement/utility
  'swift-strike': 'quick-strike',
  'leap-attack': 'quick-strike',
  
  // Elemental
  'poison-sting': 'sting',
  'pollen-burst': 'power-hit',
  'sonic-chirp': 'power-hit',
  
  // Defense/support
  'armor-up': 'shield-bash',
  'camouflage': 'quick-strike',
  'drain': 'drain-bite',
  
  // Special abilities that map to real skills
  'illuminate': 'quick-strike',
  'flash-bomb': 'power-hit',
  'flutter-strike': 'quick-strike',
  'powder-cloud': 'sting',
  'pincer-grip': 'power-hit',
  'ambush': 'heavy-slam',
  'horn-slam': 'crushing-blow',
  'fortify': 'shield-bash',
  'power-strike': 'heavy-slam',
  'venom-fang': 'poison-fang',
  'web-trap': 'shield-bash',
  'tail-strike': 'heavy-slam',
  'multi-bite': 'triple-strike',
  'coil-defense': 'shield-bash',
  'toxic-spray': 'sting',
  'molting-shield': 'shield-bash',
  'wing-slash': 'heavy-slam',
  'hypnotic-pattern': 'sting',
  'mega-slam': 'crushing-blow',
  'aerial-assault': 'quick-strike',
  'dragon-dive': 'meteor-crash',
  'petal-dance': 'triple-strike',
  'floral-fury': 'solar-strike',
  'dazzle': 'power-hit',
  'prismatic-blast': 'solar-strike',
  'charge': 'heavy-slam',
  'rhino-impact': 'crushing-blow',
  'paralyze-sting': 'sting',
  'venom-lance': 'poison-fang',
  'aqua-strike': 'power-hit',
  'grip': 'power-hit',
  'tidal-crush': 'crushing-blow',
  'mega-bite': 'crushing-blow',
  'intimidate': 'power-hit',
  'titan-rage': 'apocalypse',
  'moonbeam': 'solar-strike',
  'celestial-wings': 'triple-strike',
  'lunar-eclipse': 'divine-judgment',
  'prism-horn': 'solar-strike',
  'rainbow-nova': 'meteor-crash',
  'flame-wings': 'solar-strike',
  'rebirth': 'phoenix-rebirth',
  'inferno': 'poison-fang',
  'phoenix-blaze': 'apocalypse',
  'diamond-slash': 'crushing-blow',
  'refract': 'shield-bash',
  'precision-strike': 'heavy-slam',
  'crystal-storm': 'meteor-crash',
  'dark-sting': 'poison-fang',
  'shadow-step': 'quick-strike',
  'void-strike': 'black-hole',
  'lightning-bolt': 'solar-strike',
  'shock-wave': 'heavy-slam',
  'thunder-crash': 'divine-judgment',
  'frost-breath': 'sting',
  'freeze': 'absolute-zero',
  'absolute-zero': 'absolute-zero',
  'deadly-bite': 'poison-fang',
  'widow-venom': 'black-hole',
  'trap-door': 'shield-bash',
  'neurotoxin': 'apocalypse',
  'mega-sting': 'crushing-blow',
  'swarm': 'triple-strike',
  'bullet-barrage': 'meteor-crash',
  'disease-bite': 'poison-fang',
  'stealth': 'quick-strike',
  'parasitic-plague': 'black-hole',
  'relentless': 'heavy-slam',
  'army-march': 'apocalypse',
  'burning-sting': 'sting',
  'inferno-swarm': 'meteor-crash',
  'venom-spray': 'sting',
  'hornet-fury': 'divine-judgment',
  'lethal-sting': 'poison-fang',
  'death-venom': 'apocalypse',
  'mantis-strike': 'crushing-blow',
  'titan-charge': 'meteor-crash',
  'spider-fury': 'divine-judgment',
  'deadly-venom': 'black-hole',
  'moonlight-beam': 'solar-strike',
  'earthquake-stomp': 'apocalypse'
};

// Map of insect IDs to their base skills
export const INSECT_BASE_SKILLS: Record<string, { normal: string[]; ultimate?: string }> = {
  // Common insects - basic skills
  'ant': { normal: ['power-hit'] },
  'ladybug': { normal: ['quick-strike'] },
  'housefly': { normal: ['quick-strike'] },
  'mosquito': { normal: ['sting'] },
  'grasshopper': { normal: ['quick-strike'] },
  'cricket': { normal: ['power-hit'] },
  'common-beetle': { normal: ['quick-strike'] },
  'aphid': { normal: ['drain-bite'] },
  
  // Uncommon insects - 1-2 skills
  'butterfly': { normal: ['quick-strike', 'power-hit'] },
  'dragonfly': { normal: ['quick-strike', 'heavy-slam'] },
  'bumblebee': { normal: ['sting', 'power-hit'] },
  'firefly': { normal: ['power-hit', 'quick-strike'] },
  'walking-stick': { normal: ['quick-strike', 'shield-bash'] },
  'moth': { normal: ['sting', 'quick-strike'] },
  'weevil': { normal: ['power-hit', 'shield-bash'] },
  'earwig': { normal: ['power-hit'] },
  
  // Rare insects - 2 skills
  'praying-mantis': { normal: ['heavy-slam', 'triple-strike'], ultimate: 'mantis-strike' },
  'stag-beetle': { normal: ['crushing-blow', 'shield-bash'], ultimate: 'titan-charge' },
  'hercules-beetle': { normal: ['heavy-slam', 'shield-bash'] },
  'tarantula': { normal: ['poison-fang', 'shield-bash'], ultimate: 'spider-fury' },
  'scorpion': { normal: ['sting', 'heavy-slam'], ultimate: 'deadly-venom' },
  'centipede': { normal: ['triple-strike', 'sting'] },
  'millipede': { normal: ['shield-bash', 'sting'] },
  'cicada': { normal: ['power-hit', 'shield-bash'] },
  
  // Epic insects - 2 skills + ultimate
  'atlas-moth': { normal: ['heavy-slam', 'sting'], ultimate: 'solar-strike' },
  'goliath-beetle': { normal: ['crushing-blow', 'shield-bash'], ultimate: 'meteor-crash' },
  'emperor-dragonfly': { normal: ['triple-strike', 'quick-strike'], ultimate: 'dragon-dive' },
  'orchid-mantis': { normal: ['triple-strike', 'heavy-slam'], ultimate: 'floral-fury' },
  'jewel-beetle': { normal: ['heavy-slam', 'shield-bash'], ultimate: 'solar-strike' },
  'rhinoceros-beetle': { normal: ['crushing-blow', 'heavy-slam'], ultimate: 'meteor-crash' },
  'tarantula-hawk': { normal: ['sting', 'triple-strike'], ultimate: 'poison-fang' },
  'giant-water-bug': { normal: ['power-hit', 'heavy-slam'], ultimate: 'crushing-blow' },
  
  // Legendary insects - 2-3 skills + ultimate
  'titan-beetle': { normal: ['crushing-blow', 'shield-bash', 'heavy-slam'], ultimate: 'apocalypse' },
  'luna-moth': { normal: ['solar-strike', 'sting', 'triple-strike'], ultimate: 'divine-judgment' },
  'rainbow-stag': { normal: ['solar-strike', 'heavy-slam', 'crushing-blow'], ultimate: 'meteor-crash' },
  'phoenix-butterfly': { normal: ['solar-strike', 'phoenix-rebirth', 'poison-fang'], ultimate: 'apocalypse' },
  'crystal-mantis': { normal: ['crushing-blow', 'shield-bash', 'heavy-slam'], ultimate: 'meteor-crash' },
  'shadow-scorpion': { normal: ['poison-fang', 'quick-strike', 'sting'], ultimate: 'black-hole' },
  'thunder-beetle': { normal: ['solar-strike', 'heavy-slam', 'crushing-blow'], ultimate: 'divine-judgment' },
  'ice-dragonfly': { normal: ['sting', 'absolute-zero', 'triple-strike'], ultimate: 'absolute-zero' },
  
  // Dangerous insects - strong skills
  'black-widow': { normal: ['poison-fang', 'shield-bash'], ultimate: 'black-hole' },
  'funnel-web-spider': { normal: ['poison-fang', 'shield-bash'], ultimate: 'apocalypse' },
  'bullet-ant': { normal: ['crushing-blow', 'triple-strike'], ultimate: 'meteor-crash' },
  'kissing-bug': { normal: ['poison-fang', 'quick-strike'], ultimate: 'black-hole' },
  'driver-ant': { normal: ['triple-strike', 'heavy-slam'], ultimate: 'apocalypse' },
  'fire-ant': { normal: ['sting', 'triple-strike'], ultimate: 'meteor-crash' },
  'asian-hornet': { normal: ['crushing-blow', 'sting'], ultimate: 'divine-judgment' },
  'deathstalker-scorpion': { normal: ['poison-fang', 'heavy-slam'], ultimate: 'black-hole' },

  // BOSS INSECTS - Extra powerful passives
  'garden_guardian': { normal: ['crushing-blow', 'regenerative-bite'], ultimate: 'meteor-crash' },
  'forest_king': { normal: ['crushing-blow', 'triple-strike'], ultimate: 'meteor-crash' },
  'desert_pharaoh': { normal: ['omega-strike', 'poison-fang'], ultimate: 'divine-judgment' },
  'swamp_tyrant': { normal: ['poison-fang', 'chaos-burst'], ultimate: 'black-hole' },
  'volcanic_emperor': { normal: ['chaos-burst', 'solar-strike'], ultimate: 'apocalypse' },

  // MYTHIC INSECT - Goliath Beetle
  'goliath_beetle': { normal: ['omega-strike', 'chaos-burst', 'solar-strike'], ultimate: 'apocalypse' },

  // EXOTIC INSECT - Chan's Megastick
  'chans_megastick': { normal: ['shadow-strike', 'healing-wave', 'barrier'], ultimate: 'ultimate-defense' }
};

// Get base skills for an insect
export function getInsectBaseSkills(insectId: string): { normal: string[]; ultimate?: string } {
  return INSECT_BASE_SKILLS[insectId] || { normal: [] };
}