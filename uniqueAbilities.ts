// Unique abilities that are specific to each insect species
// Based on real-life behaviors and characteristics
// These abilities are NOT rollable - only the specific insect can use them

export interface UniqueAbility {
  id: string;
  name: string;
  description: string;
  insectId: string; // Which insect this ability belongs to
  realLifeBehavior: string; // Educational explanation
  cooldown: number; // Turns before can use again
  effects: {
    damage?: number;
    heal?: number;
    summon?: {
      name: string;
      emoji: string;
      hp: number;
      attack: number;
    };
    blind?: number; // Turns opponent is blinded (reduced accuracy)
    paralyze?: number; // Turns opponent can't act
    lifeDrain?: number; // Percentage of damage dealt healed
    shield?: number; // Temporary HP shield
    confuse?: number; // Turns opponent might attack self
    poison?: number; // Damage per turn
    buff?: {
      attack?: number;
      defense?: number;
      speed?: number;
      duration: number; // turns
    };
  };
  icon: string;
}

export const UNIQUE_ABILITIES: UniqueAbility[] = [
  // Good Insects
  {
    id: 'cockroach_babies',
    name: 'Rapid Reproduction',
    description: 'Summons 2-3 baby cockroaches to swarm the enemy',
    insectId: 'cockroach',
    realLifeBehavior: 'Cockroaches are notorious for their rapid reproduction rate. A single female can produce up to 300-400 offspring in her lifetime, with babies maturing in just a few weeks.',
    cooldown: 4,
    effects: {
      summon: {
        name: 'Baby Cockroach',
        emoji: '🪳',
        hp: 20,
        attack: 15
      },
      damage: 30 // Initial swarm damage
    },
    icon: '🪳'
  },
  {
    id: 'honeybee_sacrifice',
    name: 'Kamikaze Sting',
    description: 'Sacrifices 50% HP to deal massive damage and poison the enemy',
    insectId: 'honeybee',
    realLifeBehavior: 'When a honey bee stings, its barbed stinger gets stuck in the victim\'s skin. The bee tears away, leaving the stinger and venom sac behind, which ultimately kills the bee but delivers maximum venom.',
    cooldown: 6,
    effects: {
      damage: 150,
      poison: 20
    },
    icon: '💥'
  },
  {
    id: 'ant_colony',
    name: 'Call the Colony',
    description: 'Summons worker ants that provide attack buff and deal continuous damage',
    insectId: 'ant',
    realLifeBehavior: 'Ants are social insects that work together in colonies. When threatened or hunting, they can call reinforcements through chemical pheromones, coordinating group attacks.',
    cooldown: 5,
    effects: {
      damage: 40,
      buff: {
        attack: 25,
        duration: 3
      }
    },
    icon: '🐜'
  },
  {
    id: 'firefly_flash',
    name: 'Bioluminescent Burst',
    description: 'Blinds the opponent with a bright flash, reducing their accuracy',
    insectId: 'firefly',
    realLifeBehavior: 'Fireflies produce light through bioluminescence using luciferin and luciferase. The flash is used for mating signals and can be startlingly bright at close range.',
    cooldown: 3,
    effects: {
      blind: 2,
      damage: 20
    },
    icon: '✨'
  },
  {
    id: 'mantis_decapitation',
    name: 'Predator\'s Strike',
    description: 'Powerful strike that deals critical damage with high crit chance',
    insectId: 'praying-mantis',
    realLifeBehavior: 'Praying mantises are ambush predators with lightning-fast strikes. They\'re famous for sexual cannibalism, where females sometimes eat the male\'s head during or after mating.',
    cooldown: 4,
    effects: {
      damage: 120,
      buff: {
        attack: 30,
        duration: 2
      }
    },
    icon: '🦗'
  },
  {
    id: 'dragonfly_aerial_dodge',
    name: 'Aerial Mastery',
    description: 'Perfect dodge next attack and counter with swift strike',
    insectId: 'dragonfly',
    realLifeBehavior: 'Dragonflies are among the most skilled fliers in the insect world, capable of flying in any direction including backwards. They have a 95% hunting success rate due to their incredible aerial agility.',
    cooldown: 3,
    effects: {
      shield: 100,
      damage: 60
    },
    icon: '🌀'
  },
  {
    id: 'ladybug_reflex_bleeding',
    name: 'Reflex Bleeding',
    description: 'Secretes toxic hemolymph that poisons and reduces enemy attack',
    insectId: 'ladybug',
    realLifeBehavior: 'When threatened, ladybugs secrete a foul-smelling, toxic hemolymph (blood) from their leg joints. This reflex bleeding deters predators with its bitter taste and toxic alkaloids.',
    cooldown: 4,
    effects: {
      poison: 15,
      buff: {
        defense: 40,
        duration: 3
      }
    },
    icon: '🩸'
  },
  {
    id: 'butterfly_wing_pattern',
    name: 'Hypnotic Wings',
    description: 'Confuses opponent with mesmerizing wing patterns',
    insectId: 'butterfly',
    realLifeBehavior: 'Many butterflies have intricate wing patterns that serve multiple purposes: attracting mates, warning predators of toxicity, or creating optical illusions to confuse attackers.',
    cooldown: 4,
    effects: {
      confuse: 2,
      damage: 25
    },
    icon: '🦋'
  },
  {
    id: 'bumblebee_buzz_pollination',
    name: 'Sonic Vibration',
    description: 'Powerful vibrations that damage and disorient the enemy',
    insectId: 'bumblebee',
    realLifeBehavior: 'Bumblebees use buzz pollination (sonication) - rapidly vibrating their flight muscles to shake pollen loose. These vibrations can reach 400 Hz and are powerful enough to damage delicate structures.',
    cooldown: 3,
    effects: {
      damage: 70,
      blind: 1
    },
    icon: '📳'
  },
  {
    id: 'beetle_armor',
    name: 'Hardened Exoskeleton',
    description: 'Hardens shell to create temporary invincibility shield',
    insectId: 'beetle',
    realLifeBehavior: 'Ground beetles have extremely tough exoskeletons made of chitin and proteins. Some species can withstand pressures up to 39,000 times their body weight.',
    cooldown: 5,
    effects: {
      shield: 150,
      buff: {
        defense: 50,
        duration: 2
      }
    },
    icon: '🛡️'
  },

  // Bad/Pest Insects
  {
    id: 'mosquito_blood_drain',
    name: 'Blood Feast',
    description: 'Drains enemy HP and heals self',
    insectId: 'mosquito',
    realLifeBehavior: 'Female mosquitoes feed on blood to obtain proteins needed for egg development. They inject saliva containing anticoagulants and can consume up to 3 times their body weight in blood.',
    cooldown: 3,
    effects: {
      damage: 50,
      lifeDrain: 75, // 75% of damage dealt
      heal: 40
    },
    icon: '🩸'
  },
  {
    id: 'termite_structural_damage',
    name: 'Wood Devastation',
    description: 'Weakens enemy defenses permanently for this battle',
    insectId: 'termite',
    realLifeBehavior: 'Termites can eat through wood at an alarming rate. A colony can consume about one foot of 2x4 wood in six months, causing billions in structural damage annually.',
    cooldown: 4,
    effects: {
      damage: 45,
      buff: {
        attack: 35,
        duration: 99 // Permanent for battle
      }
    },
    icon: '🪵'
  },
  {
    id: 'aphid_sap_drain',
    name: 'Sap Sucker',
    description: 'Drains energy and slows opponent',
    insectId: 'aphid',
    realLifeBehavior: 'Aphids use their piercing mouthparts to tap into plant phloem and extract sap. They can drain so much that plants wilt and become stunted.',
    cooldown: 2,
    effects: {
      damage: 30,
      buff: {
        speed: 20,
        duration: 3
      }
    },
    icon: '💧'
  },

  // Dangerous Insects
  {
    id: 'black_widow_neurotoxin',
    name: 'Latrotoxin Venom',
    description: 'Deadly neurotoxin that paralyzes and poisons',
    insectId: 'black-widow',
    realLifeBehavior: 'Black widow venom contains latrotoxin, a potent neurotoxin 15 times stronger than rattlesnake venom. It causes severe muscle pain and spasms by affecting the nervous system.',
    cooldown: 5,
    effects: {
      damage: 80,
      poison: 25,
      paralyze: 1
    },
    icon: '☠️'
  },
  {
    id: 'bullet_ant_sting',
    name: 'Poneratoxin Sting',
    description: 'The most painful sting in the world - massive damage and paralysis',
    insectId: 'bullet-ant',
    realLifeBehavior: 'The bullet ant has the most painful sting of any insect, rated 4+ on the Schmidt Pain Index. The pain, caused by poneratoxin, is described as "like walking over flaming charcoal with a 3-inch nail in your heel" and can last 24 hours.',
    cooldown: 6,
    effects: {
      damage: 140,
      paralyze: 2,
      poison: 18
    },
    icon: '🔥'
  },
  {
    id: 'killer_bee_swarm',
    name: 'Swarm Attack',
    description: 'Aggressive swarm dealing continuous damage',
    insectId: 'killer-bee',
    realLifeBehavior: 'Africanized honey bees (killer bees) are extremely defensive and will pursue threats for up to a quarter mile. They attack in massive swarms and deliver numerous stings.',
    cooldown: 5,
    effects: {
      damage: 90,
      poison: 20,
      buff: {
        attack: 40,
        duration: 3
      }
    },
    icon: '🐝'
  },
  {
    id: 'hornet_venom_spray',
    name: 'Venom Injection',
    description: 'Powerful venom that deals damage over time',
    insectId: 'asian-giant-hornet',
    realLifeBehavior: 'Asian giant hornets inject a large amount of potent venom with each sting. The venom contains cytolytic peptides that can damage tissue and cause organ failure if stung multiple times.',
    cooldown: 4,
    effects: {
      damage: 100,
      poison: 30,
      blind: 1
    },
    icon: '💉'
  },
  {
    id: 'funnel_web_venom',
    name: 'Atraxotoxin',
    description: 'Lethal venom that severely damages and poisons',
    insectId: 'sydney-funnel-web',
    realLifeBehavior: 'Sydney funnel-web spider venom contains atraxotoxin, one of the most dangerous spider venoms to humans. It attacks the nervous system and can be fatal without antivenom.',
    cooldown: 6,
    effects: {
      damage: 160,
      poison: 35,
      paralyze: 2
    },
    icon: '🕷️'
  },
  {
    id: 'brown_recluse_necrosis',
    name: 'Necrotic Venom',
    description: 'Venom that causes tissue death - increasing damage over time',
    insectId: 'brown-recluse',
    realLifeBehavior: 'Brown recluse venom contains sphingomyelinase D, which causes necrosis (tissue death). The wound can take months to heal and may require skin grafts in severe cases.',
    cooldown: 5,
    effects: {
      damage: 70,
      poison: 40, // High poison damage representing necrosis
      buff: {
        attack: 25,
        duration: 5
      }
    },
    icon: '🕸️'
  },

  // Legendary/Special
  {
    id: 'stag_beetle_throw',
    name: 'Mandible Grip',
    description: 'Grabs and throws opponent dealing massive damage',
    insectId: 'stag-beetle',
    realLifeBehavior: 'Male stag beetles have enormous mandibles used for wrestling rivals. They can lift objects 50 times their weight and use their mandibles like antlers to flip opponents.',
    cooldown: 5,
    effects: {
      damage: 110,
      buff: {
        attack: 35,
        duration: 2
      }
    },
    icon: '💪'
  },
  {
    id: 'atlas_moth_intimidation',
    name: 'Wing Display',
    description: 'Intimidates opponent with massive wing span, reducing their attack',
    insectId: 'atlas-moth',
    realLifeBehavior: 'Atlas moths have the largest wing surface area of any moth. Their wing tips resemble snake heads, used to intimidate predators. They can have wingspans up to 12 inches.',
    cooldown: 4,
    effects: {
      damage: 35,
      buff: {
        defense: 60,
        duration: 4
      }
    },
    icon: '👁️'
  },
  {
    id: 'damselfly_precision',
    name: 'Precision Strike',
    description: 'Accurate strike that never misses',
    insectId: 'damselfly',
    realLifeBehavior: 'Damselflies have exceptional vision with compound eyes that can see in nearly all directions. They can calculate the trajectory of prey and intercept it with precision.',
    cooldown: 3,
    effects: {
      damage: 85,
      buff: {
        speed: 30,
        duration: 2
      }
    },
    icon: '🎯'
  }
];

// Helper function to get unique ability for an insect
export function getInsectUniqueAbility(insectId: string): UniqueAbility | null {
  return UNIQUE_ABILITIES.find(ability => ability.insectId === insectId) || null;
}

// Check if an insect has a unique ability
export function hasUniqueAbility(insectId: string): boolean {
  return UNIQUE_ABILITIES.some(ability => ability.insectId === insectId);
}
