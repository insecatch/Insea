export type InsectRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'exotic';
export type InsectType = 'good' | 'bad' | 'dangerous';

export interface Insect {
  id: string;
  name: string;
  scientificName: string;
  type: InsectType;
  rarity: InsectRarity;
  description: string;
  habitat: string;
  warningMessage?: string;
  emoji: string;
  stats: {
    attack: number;
    defense: number;
    speed: number;
    health: number;
  };
  imageQuery: string;
  customIcon?: boolean;
}

export const INSECT_DATABASE: Insect[] = [
  // Common insects
  {
    id: 'ladybug',
    name: 'Ladybug',
    scientificName: 'Coccinellidae',
    type: 'good',
    rarity: 'common',
    description: 'A beneficial beetle that eats aphids and other plant pests.',
    habitat: 'Gardens, fields, forests',
    emoji: '🐞',
    stats: { attack: 45, defense: 60, speed: 50, health: 70 },
    imageQuery: 'ladybug insect'
  },
  {
    id: 'honeybee',
    name: 'Honey Bee',
    scientificName: 'Apis mellifera',
    type: 'good',
    rarity: 'common',
    description: 'Essential pollinator that produces honey.',
    habitat: 'Gardens, meadows',
    emoji: '🐝',
    stats: { attack: 55, defense: 40, speed: 65, health: 60 },
    imageQuery: 'honey bee'
  },
  {
    id: 'ant',
    name: 'Garden Ant',
    scientificName: 'Lasius niger',
    type: 'good',
    rarity: 'common',
    description: 'Hardworking social insect that aerates soil.',
    habitat: 'Gardens, forests, urban areas',
    emoji: '🐜',
    stats: { attack: 35, defense: 55, speed: 45, health: 65 },
    imageQuery: 'black garden ant'
  },
  {
    id: 'butterfly',
    name: 'Monarch Butterfly',
    scientificName: 'Danaus plexippus',
    type: 'good',
    rarity: 'uncommon',
    description: 'Beautiful pollinator known for long migrations.',
    habitat: 'Gardens, meadows',
    emoji: '🦋',
    stats: { attack: 30, defense: 35, speed: 70, health: 50 },
    imageQuery: 'monarch butterfly'
  },
  {
    id: 'dragonfly',
    name: 'Dragonfly',
    scientificName: 'Anisoptera',
    type: 'good',
    rarity: 'uncommon',
    description: 'Aerial predator that controls mosquito populations.',
    habitat: 'Near water bodies',
    emoji: '🐉',
    stats: { attack: 70, defense: 50, speed: 85, health: 65 },
    imageQuery: 'dragonfly insect'
  },
  {
    id: 'firefly',
    name: 'Firefly',
    scientificName: 'Lampyridae',
    type: 'good',
    rarity: 'uncommon',
    description: 'Bioluminescent beetle that lights up summer nights.',
    habitat: 'Meadows, forests',
    emoji: '✨',
    stats: { attack: 40, defense: 45, speed: 55, health: 60 },
    imageQuery: 'firefly lightning bug'
  },
  {
    id: 'praying-mantis',
    name: 'Praying Mantis',
    scientificName: 'Mantis religiosa',
    type: 'good',
    rarity: 'rare',
    description: 'Patient predator that controls garden pests.',
    habitat: 'Gardens, shrubs',
    emoji: '🦗',
    stats: { attack: 85, defense: 60, speed: 60, health: 80 },
    imageQuery: 'praying mantis'
  },
  {
    id: 'green-lacewing',
    name: 'Green Lacewing',
    scientificName: 'Chrysoperla carnea',
    type: 'good',
    rarity: 'rare',
    description: 'Delicate predator with voracious larvae.',
    habitat: 'Gardens, forests',
    emoji: '🦟',
    stats: { attack: 55, defense: 40, speed: 65, health: 55 },
    imageQuery: 'green lacewing'
  },
  
  // Bad insects
  {
    id: 'aphid',
    name: 'Aphid',
    scientificName: 'Aphidoidea',
    type: 'bad',
    rarity: 'common',
    description: 'Plant pest that sucks sap from plants.',
    habitat: 'Gardens, crops',
    emoji: '🐛',
    stats: { attack: 25, defense: 30, speed: 20, health: 40 },
    imageQuery: 'aphid pest'
  },
  {
    id: 'mosquito',
    name: 'Mosquito',
    scientificName: 'Culicidae',
    type: 'bad',
    rarity: 'common',
    description: 'Blood-feeding pest that can transmit diseases.',
    habitat: 'Near water, urban areas',
    emoji: '🦟',
    stats: { attack: 40, defense: 25, speed: 75, health: 35 },
    imageQuery: 'mosquito insect'
  },
  {
    id: 'termite',
    name: 'Termite',
    scientificName: 'Isoptera',
    type: 'bad',
    rarity: 'uncommon',
    description: 'Wood-eating pest that damages structures.',
    habitat: 'Wood, soil',
    emoji: '🐜',
    stats: { attack: 45, defense: 50, speed: 30, health: 60 },
    imageQuery: 'termite insect'
  },
  {
    id: 'cockroach',
    name: 'Cockroach',
    scientificName: 'Blattodea',
    type: 'bad',
    rarity: 'uncommon',
    description: 'Resilient pest that spreads bacteria.',
    habitat: 'Urban areas, dark spaces',
    emoji: '🪳',
    stats: { attack: 50, defense: 70, speed: 60, health: 85 },
    imageQuery: 'cockroach insect'
  },
  {
    id: 'japanese-beetle',
    name: 'Japanese Beetle',
    scientificName: 'Popillia japonica',
    type: 'bad',
    rarity: 'rare',
    description: 'Invasive species that destroys plants.',
    habitat: 'Gardens, crops',
    emoji: '🪲',
    stats: { attack: 60, defense: 65, speed: 45, health: 70 },
    imageQuery: 'japanese beetle'
  },
  
  // Dangerous insects
  {
    id: 'black-widow',
    name: 'Black Widow Spider',
    scientificName: 'Latrodectus',
    type: 'dangerous',
    rarity: 'rare',
    description: 'Venomous spider with a painful bite.',
    habitat: 'Dark areas, woodpiles',
    warningMessage: '⚠️ DANGER! Black Widow Spider detected. This spider is highly venomous. Do not touch and keep your distance!',
    emoji: '🕷️',
    stats: { attack: 90, defense: 55, speed: 55, health: 65 },
    imageQuery: 'black widow spider'
  },
  {
    id: 'brown-recluse',
    name: 'Brown Recluse Spider',
    scientificName: 'Loxosceles reclusa',
    type: 'dangerous',
    rarity: 'rare',
    description: 'Venomous spider whose bite can cause severe reactions.',
    habitat: 'Dark corners, closets',
    warningMessage: '⚠️ DANGER! Brown Recluse Spider detected. This spider has a necrotic venom. Stay away and contact pest control!',
    emoji: '🕸️',
    stats: { attack: 85, defense: 50, speed: 50, health: 60 },
    imageQuery: 'brown recluse spider'
  },
  {
    id: 'killer-bee',
    name: 'Africanized Honey Bee',
    scientificName: 'Apis mellifera scutellata',
    type: 'dangerous',
    rarity: 'epic',
    description: 'Aggressive bee that attacks in swarms.',
    habitat: 'Various outdoor areas',
    warningMessage: '⚠️ DANGER! Killer Bee detected. These bees are extremely aggressive. Leave the area immediately!',
    emoji: '🐝',
    stats: { attack: 95, defense: 60, speed: 90, health: 75 },
    imageQuery: 'africanized honey bee'
  },
  {
    id: 'bullet-ant',
    name: 'Bullet Ant',
    scientificName: 'Paraponera clavata',
    type: 'dangerous',
    rarity: 'epic',
    description: 'Has the most painful insect sting in the world.',
    habitat: 'Rainforests',
    warningMessage: '⚠️ EXTREME DANGER! Bullet Ant detected. This ant has the most painful sting known. Do not approach!',
    emoji: '🐜',
    stats: { attack: 100, defense: 70, speed: 55, health: 80 },
    imageQuery: 'bullet ant'
  },
  {
    id: 'asian-giant-hornet',
    name: 'Asian Giant Hornet',
    scientificName: 'Vespa mandarinia',
    type: 'dangerous',
    rarity: 'legendary',
    description: 'World\'s largest hornet with powerful venom.',
    habitat: 'Forests, mountains',
    warningMessage: '⚠️ EXTREME DANGER! Murder Hornet detected. This is the world\'s largest hornet with deadly venom. Run away immediately!',
    emoji: '🐝',
    stats: { attack: 110, defense: 85, speed: 80, health: 100 },
    imageQuery: 'asian giant hornet'
  },
  {
    id: 'sydney-funnel-web',
    name: 'Sydney Funnel-web Spider',
    scientificName: 'Atrax robustus',
    type: 'dangerous',
    rarity: 'legendary',
    description: 'One of the world\'s most venomous spiders.',
    habitat: 'Eastern Australia',
    warningMessage: '⚠️ EXTREME DANGER! Funnel-web Spider detected. One of the deadliest spiders on Earth. Evacuate immediately and call emergency services!',
    emoji: '🕷️',
    stats: { attack: 120, defense: 75, speed: 65, health: 90 },
    imageQuery: 'sydney funnel web spider'
  },
  
  // More good insects
  {
    id: 'bumblebee',
    name: 'Bumblebee',
    scientificName: 'Bombus',
    type: 'good',
    rarity: 'common',
    description: 'Fuzzy pollinator that works even in cold weather.',
    habitat: 'Gardens, meadows',
    emoji: '🐝',
    stats: { attack: 50, defense: 55, speed: 50, health: 75 },
    imageQuery: 'bumblebee'
  },
  {
    id: 'beetle',
    name: 'Ground Beetle',
    scientificName: 'Carabidae',
    type: 'good',
    rarity: 'common',
    description: 'Nocturnal predator that eats slugs and pests.',
    habitat: 'Gardens, under stones',
    emoji: '🪲',
    stats: { attack: 55, defense: 70, speed: 40, health: 70 },
    imageQuery: 'ground beetle'
  },
  {
    id: 'damselfly',
    name: 'Damselfly',
    scientificName: 'Zygoptera',
    type: 'good',
    rarity: 'uncommon',
    description: 'Graceful flier that hunts small insects.',
    habitat: 'Near ponds and streams',
    emoji: '🦋',
    stats: { attack: 60, defense: 40, speed: 75, health: 55 },
    imageQuery: 'damselfly'
  },
  {
    id: 'stag-beetle',
    name: 'Stag Beetle',
    scientificName: 'Lucanidae',
    type: 'good',
    rarity: 'epic',
    description: 'Impressive beetle with large mandibles.',
    habitat: 'Oak forests',
    emoji: '🪲',
    stats: { attack: 95, defense: 80, speed: 35, health: 90 },
    imageQuery: 'stag beetle'
  },
  {
    id: 'atlas-moth',
    name: 'Atlas Moth',
    scientificName: 'Attacus atlas',
    type: 'good',
    rarity: 'legendary',
    description: 'One of the largest moths in the world.',
    habitat: 'Tropical forests',
    emoji: '🦋',
    stats: { attack: 50, defense: 60, speed: 45, health: 95 },
    imageQuery: 'atlas moth'
  },

  // BOSS INSECTS - Special encounters in stages
  {
    id: 'garden_guardian',
    name: 'Hercules Beetle',
    scientificName: 'Dynastes hercules',
    type: 'good',
    rarity: 'epic',
    description: 'One of the largest and strongest beetles on Earth. Can lift 850 times its own weight.',
    habitat: 'Rainforests of Central and South America',
    emoji: '🪲',
    stats: { attack: 90, defense: 85, speed: 70, health: 150 },
    imageQuery: 'hercules beetle'
  },
  {
    id: 'forest_king',
    name: 'European Stag Beetle',
    scientificName: 'Lucanus cervus',
    type: 'good',
    rarity: 'epic',
    description: 'The largest stag beetle in Europe, with impressive mandibles used for fighting.',
    habitat: 'Oak forests of Europe',
    emoji: '🪲',
    stats: { attack: 110, defense: 100, speed: 80, health: 200 },
    imageQuery: 'european stag beetle'
  },
  {
    id: 'desert_pharaoh',
    name: 'Sacred Scarab Beetle',
    scientificName: 'Scarabaeus sacer',
    type: 'good',
    rarity: 'legendary',
    description: 'Ancient Egyptian sacred beetle known for rolling dung balls. Symbol of rebirth.',
    habitat: 'Mediterranean and Middle Eastern deserts',
    emoji: '🪲',
    stats: { attack: 130, defense: 120, speed: 90, health: 250 },
    imageQuery: 'sacred scarab beetle'
  },
  {
    id: 'swamp_tyrant',
    name: 'Giant Water Bug',
    scientificName: 'Lethocerus americanus',
    type: 'dangerous',
    rarity: 'legendary',
    description: 'Largest true bug in North America. Predator that can catch fish, frogs, and even small snakes.',
    habitat: 'Freshwater ponds and slow streams',
    warningMessage: '⚠️ DANGER! Giant water bug can deliver a painful bite. Handle with extreme caution!',
    emoji: '🦟',
    stats: { attack: 150, defense: 130, speed: 95, health: 300 },
    imageQuery: 'giant water bug'
  },
  {
    id: 'volcanic_emperor',
    name: 'Titan Beetle',
    scientificName: 'Titanus giganteus',
    type: 'good',
    rarity: 'legendary',
    description: 'One of the largest beetles in the world, reaching up to 6.6 inches. Found in Amazon rainforest.',
    habitat: 'Amazon rainforest',
    emoji: '🪲',
    stats: { attack: 200, defense: 180, speed: 120, health: 400 },
    imageQuery: 'titan beetle'
  },

  // MYTHIC INSECT - Extremely Rare Real Insect
  {
    id: 'goliath_beetle',
    name: 'Goliath Beetle',
    scientificName: 'Goliathus goliatus',
    type: 'good',
    rarity: 'mythic',
    description: 'Among the largest insects on Earth, these magnificent beetles can weigh up to 100 grams. They are incredibly powerful and can lift up to 850 times their own weight. Found in African tropical forests.',
    habitat: 'African tropical rainforests',
    emoji: '🪲',
    stats: { attack: 500, defense: 450, speed: 300, health: 1000 },
    imageQuery: 'goliath beetle'
  },

  // EXOTIC INSECT - Chan's Megastick
  {
    id: 'chans_megastick',
    name: 'Chan\'s Megastick',
    scientificName: 'Phobaeticus chani',
    type: 'good',
    rarity: 'exotic',
    description: 'The longest insect in the world, measuring over 22 inches with legs extended. This incredible stick insect is one of the rarest insects on the planet, found only in the rainforests of Borneo. Masters of camouflage and nearly impossible to find.',
    habitat: 'Borneo rainforests',
    emoji: '🦗',
    stats: { attack: 300, defense: 400, speed: 250, health: 800 },
    imageQuery: 'chan megastick insect',
    customIcon: false
  }
];

export const RARITY_COLORS: Record<InsectRarity, string> = {
  common: '#94a3b8',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
  mythic: '#e91e63', // Vibrant pink/magenta for mythic
  exotic: '#ffffff' // White/rainbow for exotic
};

export const RARITY_LABELS: Record<InsectRarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'MYTHIC',
  exotic: 'EXOTIC'
};

export const TYPE_COLORS: Record<InsectType, string> = {
  good: '#10b981',
  bad: '#ef4444',
  dangerous: '#dc2626'
};

export const TYPE_LABELS: Record<InsectType, string> = {
  good: 'Beneficial',
  bad: 'Pest',
  dangerous: 'Dangerous'
};