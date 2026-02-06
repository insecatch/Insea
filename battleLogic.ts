import { Insect } from '@/app/data/insectDatabase';
import { CapturedInsect, storage } from '@/app/utils/storage';
import { EventEnemy } from '@/app/data/eventData';

export interface BattleState {
  playerHP: number;
  opponentHP: number;
  playerEnergy: number;
  opponentEnergy: number;
  maxEnergy: number;
  battleLog: string[];
  isPlayerTurn: boolean;
  turnCount: number;
}

export interface AttackResult {
  damage: number;
  newHP: number;
  message: string;
  energyUsed: number;
}

// Calculate skill-based damage
export function calculateSkillDamage(
  attackerAtk: number,
  defenderDef: number,
  attackerSpd: number,
  defenderSpd: number,
  damageMultiplier: number,
  extraBoost: number = 1
): number {
  const baseDamage = attackerAtk;
  const speedBonus = attackerSpd > defenderSpd ? 5 : 0;
  
  const damage = Math.max(5, (baseDamage * damageMultiplier - defenderDef * 0.3 + speedBonus) * extraBoost);
  return Math.round(damage + Math.random() * 5);
}

// Calculate basic attack damage
export function calculateBasicDamage(
  attackerAtk: number,
  defenderDef: number,
  attackerSpd: number,
  defenderSpd: number
): number {
  const baseDamage = attackerAtk;
  const speedBonus = attackerSpd > defenderSpd ? 3 : 0;
  const defense = defenderDef;
  
  const damage = Math.max(5, baseDamage - defense * 0.3 + speedBonus);
  return Math.round(damage + Math.random() * 5);
}

// Execute player attack
export function executePlayerAttack(
  playerInsect: CapturedInsect,
  opponent: Insect | EventEnemy,
  opponentHP: number,
  playerEnergy: number,
  skill?: { name: string; damageMultiplier: number; energyCost: number },
  extraBoost: number = 1
): AttackResult {
  const energyCost = skill ? skill.energyCost : 15;
  
  if (playerEnergy < energyCost) {
    return {
      damage: 0,
      newHP: opponentHP,
      message: `Not enough energy! Need ${energyCost} energy.`,
      energyUsed: 0
    };
  }

  // Get the upgraded stats from storage
  const playerStats = storage.getInsectStats(playerInsect);

  let damage: number;
  let message: string;

  if (skill) {
    damage = calculateSkillDamage(
      playerStats.attack, // Use upgraded attack
      opponent.stats.defense,
      playerStats.speed, // Use upgraded speed
      opponent.stats.speed,
      skill.damageMultiplier,
      extraBoost
    );
    message = `${playerInsect.insect.name} used ${skill.name}! ${damage} damage!`;
  } else {
    damage = calculateBasicDamage(
      playerStats.attack, // Use upgraded attack
      opponent.stats.defense,
      playerStats.speed, // Use upgraded speed
      opponent.stats.speed
    );
    message = `${playerInsect.insect.name} used Basic Attack! ${damage} damage!`;
  }

  const newHP = Math.max(0, opponentHP - damage);

  return {
    damage,
    newHP,
    message,
    energyUsed: energyCost
  };
}

// Execute opponent attack - THIS IS THE KEY FUNCTION
export function executeOpponentAttack(
  opponent: Insect | EventEnemy,
  playerInsect: CapturedInsect,
  playerHP: number,
  opponentEnergy: number,
  extraBoost: number = 1,
  specialAbility?: string
): AttackResult {
  // Opponent AI: Choose energy cost based on available energy
  const maxEnergyCost = Math.min(opponentEnergy, 50); // Use up to 50 energy
  const minEnergyCost = 15;
  
  // Random energy cost between min and available
  const energyCost = Math.floor(Math.random() * (maxEnergyCost - minEnergyCost + 1)) + minEnergyCost;
  
  if (opponentEnergy < minEnergyCost) {
    return {
      damage: 0,
      newHP: playerHP,
      message: `${opponent.name} has no energy to attack!`,
      energyUsed: 0
    };
  }

  // Calculate damage based on energy spent (more energy = more damage)
  const powerMultiplier = energyCost / 20; // 15 energy = 0.75x, 50 energy = 2.5x
  
  let baseDamage = opponent.stats.attack * powerMultiplier * extraBoost;
  const defense = playerInsect.insect.stats.defense;
  const damage = Math.max(5, baseDamage - defense * 0.3);
  
  let totalDamage = Math.round(damage + Math.random() * 5);
  let message = `${opponent.name} attacks! ${totalDamage} damage! (Used ${energyCost} energy)`;

  // Apply special ability damage if exists
  if (specialAbility) {
    if (specialAbility.includes('Malevolent Shrine')) {
      totalDamage += 50;
      message = `${opponent.name} uses Malevolent Shrine! ${totalDamage} total damage!`;
    } else if (specialAbility.includes('Venom Strike')) {
      totalDamage += 20;
      message = `${opponent.name} uses Venom Strike! ${totalDamage} damage with poison!`;
    } else if (specialAbility.includes('Shadow Strike')) {
      totalDamage = Math.round(totalDamage * 1.5);
      message = `${opponent.name} uses Shadow Strike! ${totalDamage} damage (ignores defense)!`;
    }
  }

  const newHP = Math.max(0, playerHP - totalDamage);

  return {
    damage: totalDamage,
    newHP,
    message,
    energyUsed: energyCost
  };
}

// Calculate initiative roll
export function rollInitiative(
  playerSpeed: number,
  opponentSpeed: number
): { playerRoll: number; opponentRoll: number; playerGoesFirst: boolean } {
  const playerRoll = Math.floor(Math.random() * 20) + 1 + playerSpeed / 10;
  const opponentRoll = Math.floor(Math.random() * 20) + 1 + opponentSpeed / 10;
  
  return {
    playerRoll: Math.floor(playerRoll),
    opponentRoll: Math.floor(opponentRoll),
    playerGoesFirst: playerRoll > opponentRoll
  };
}

// Regenerate energy
export function regenerateEnergy(
  currentEnergy: number,
  maxEnergy: number,
  regenAmount: number = 10
): number {
  return Math.min(maxEnergy, currentEnergy + regenAmount);
}

// Check if battle should end
export function checkBattleEnd(
  playerHP: number,
  opponentHP: number
): 'player_win' | 'opponent_win' | 'continue' {
  if (playerHP <= 0) return 'opponent_win';
  if (opponentHP <= 0) return 'player_win';
  return 'continue';
}