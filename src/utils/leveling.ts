import type { DungeonEnemy, EnemyType } from '../types/dungeon';
import type { Character } from '../types/character';

// Path of Exile experience system
// Source: https://pathofexile.fandom.com/wiki/Experience

// PoE Experience Table - Total experience required to reach each level
const POE_EXPERIENCE_TABLE: Array<{ total: number; toGain: number }> = [
  { total: 0, toGain: 525 },           // Level 1
  { total: 525, toGain: 1235 },        // Level 2
  { total: 1760, toGain: 2021 },       // Level 3
  { total: 3781, toGain: 3403 },       // Level 4
  { total: 7184, toGain: 5002 },        // Level 5
  { total: 12186, toGain: 7138 },      // Level 6
  { total: 19324, toGain: 10053 },     // Level 7
  { total: 29377, toGain: 13804 },     // Level 8
  { total: 43181, toGain: 18512 },     // Level 9
  { total: 61693, toGain: 24297 },     // Level 10
  { total: 85990, toGain: 31516 },     // Level 11
  { total: 117506, toGain: 39878 },    // Level 12
  { total: 157384, toGain: 50352 },    // Level 13
  { total: 207736, toGain: 62261 },    // Level 14
  { total: 269997, toGain: 76465 },    // Level 15
  { total: 346462, toGain: 92806 },    // Level 16
  { total: 439268, toGain: 112027 },   // Level 17
  { total: 551295, toGain: 133876 },   // Level 18
  { total: 685171, toGain: 158538 },   // Level 19
  { total: 843709, toGain: 187025 },   // Level 20
  { total: 1030734, toGain: 218895 },  // Level 21
  { total: 1249629, toGain: 255366 },  // Level 22
  { total: 1504995, toGain: 295852 },  // Level 23
  { total: 1800847, toGain: 341805 },  // Level 24
  { total: 2142652, toGain: 392470 },  // Level 25
  { total: 2535122, toGain: 449555 },  // Level 26
  { total: 2984677, toGain: 512121 },   // Level 27
  { total: 3496798, toGain: 583857 },  // Level 28
  { total: 4080655, toGain: 662181 },  // Level 29
  { total: 4742836, toGain: 747411 },  // Level 30
  { total: 5490247, toGain: 844146 },  // Level 31
  { total: 6334393, toGain: 949053 },  // Level 32
  { total: 7283446, toGain: 1064952 }, // Level 33
  { total: 8384398, toGain: 1192712 }, // Level 34
  { total: 9541110, toGain: 1333241 }, // Level 35
  { total: 10874351, toGain: 1487491 }, // Level 36
  { total: 12361842, toGain: 1656447 }, // Level 37
  { total: 14018289, toGain: 1841143 }, // Level 38
  { total: 15859432, toGain: 2046202 }, // Level 39
  { total: 17905634, toGain: 2265837 }, // Level 40
  { total: 20171471, toGain: 2508528 }, // Level 41
  { total: 22679999, toGain: 2776124 }, // Level 42
  { total: 25456123, toGain: 3061734 }, // Level 43
  { total: 28517857, toGain: 3379914 }, // Level 44
  { total: 31897771, toGain: 3723676 }, // Level 45
  { total: 35621447, toGain: 4099570 }, // Level 46
  { total: 39721017, toGain: 4504444 }, // Level 47
  { total: 44225461, toGain: 4951099 }, // Level 48
  { total: 49176560, toGain: 5430907 }, // Level 49
  { total: 54607467, toGain: 5957868 }, // Level 50
  { total: 60565335, toGain: 6528910 }, // Level 51
  { total: 67094245, toGain: 7153414 }, // Level 52
  { total: 74247659, toGain: 7827968 }, // Level 53
  { total: 82075627, toGain: 8555414 }, // Level 54
  { total: 90631041, toGain: 9353933 }, // Level 55
  { total: 99984974, toGain: 10212541 }, // Level 56
  { total: 110197515, toGain: 11142646 }, // Level 57
  { total: 121340161, toGain: 12157041 }, // Level 58
  { total: 133497202, toGain: 13252160 }, // Level 59
  { total: 146749362, toGain: 14441758 }, // Level 60
  { total: 161191120, toGain: 15731508 }, // Level 61
  { total: 176922628, toGain: 17127265 }, // Level 62
  { total: 194049893, toGain: 18635053 }, // Level 63
  { total: 212684946, toGain: 20271765 }, // Level 64
  { total: 232956711, toGain: 22044909 }, // Level 65
  { total: 255001620, toGain: 23950783 }, // Level 66
  { total: 278952403, toGain: 26019833 }, // Level 67
  { total: 304972236, toGain: 28261412 }, // Level 68
  { total: 333233648, toGain: 30672515 }, // Level 69
  { total: 363906163, toGain: 33287878 }, // Level 70
  { total: 397194041, toGain: 36118904 }, // Level 71
  { total: 433312945, toGain: 39163425 }, // Level 72
  { total: 472476370, toGain: 42460810 }, // Level 73
  { total: 514937180, toGain: 46024718 }, // Level 74
  { total: 560961898, toGain: 49853964 }, // Level 75
  { total: 610815862, toGain: 54008554 }, // Level 76
  { total: 664824416, toGain: 58473753 }, // Level 77
  { total: 723298169, toGain: 63314495 }, // Level 78
  { total: 786612664, toGain: 68516464 }, // Level 79
  { total: 855129128, toGain: 80182477 }, // Level 80
  { total: 929261318, toGain: 86725730 }, // Level 81
  { total: 1009443795, toGain: 93748717 }, // Level 82
  { total: 1096918525, toGain: 101352108 }, // Level 83
  { total: 1189918242, toGain: 109524907 }, // Level 84
  { total: 1291270350, toGain: 118335069 }, // Level 85
  { total: 1400795257, toGain: 127813148 }, // Level 86
  { total: 1519130474, toGain: 138033822 }, // Level 87
  { total: 1644977296, toGain: 149032822 }, // Level 88
  { total: 1779009118, toGain: 160890604 }, // Level 89
  { total: 1934002918, toGain: 173648795 }, // Level 90
  { total: 2107651713, toGain: 187372170 }, // Level 91
  { total: 2295023883, toGain: 202153736 }, // Level 92
  { total: 2497177619, toGain: 218041909 }, // Level 93
  { total: 2715219528, toGain: 235163399 }, // Level 94
  { total: 2950382927, toGain: 253547862 }, // Level 95
  { total: 3203930789, toGain: 273358532 }, // Level 96
  { total: 3477289321, toGain: 294631836 }, // Level 97
  { total: 3771921157, toGain: 317515914 }, // Level 98
  { total: 4089437071, toGain: 342703697 }, // Level 99
  { total: 4432140768, toGain: 0 },          // Level 100 (max level, no more XP needed)
];

// Get the experience required to gain a specific level
export function getExperienceRequiredForLevel(level: number): number {
  if (level <= 0) return 0;
  if (level >= 100) return 0; // Max level
  
  const tableIndex = level - 1;
  if (tableIndex >= 0 && tableIndex < POE_EXPERIENCE_TABLE.length) {
    return POE_EXPERIENCE_TABLE[tableIndex].toGain;
  }
  
  return 0;
}

// Get total experience required to reach a level
export function getTotalExperienceForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level > 100) return POE_EXPERIENCE_TABLE[99].total; // Level 100 total
  
  const tableIndex = level - 1;
  if (tableIndex >= 0 && tableIndex < POE_EXPERIENCE_TABLE.length) {
    return POE_EXPERIENCE_TABLE[tableIndex].total;
  }
  
  return 0;
}

// Calculate total experience needed from current level to target level
export function getTotalExperienceForLevelRange(currentLevel: number, targetLevel: number): number {
  if (currentLevel >= targetLevel) return 0;
  if (currentLevel >= 100) return 0;
  
  const currentTotal = getTotalExperienceForLevel(currentLevel);
  const targetTotal = getTotalExperienceForLevel(targetLevel);
  
  return targetTotal - currentTotal;
}

// Calculate monster level from key level or map tier
// +2 key = level 2, +83 key = level 83
export function getMonsterLevelFromKeyLevel(keyLevel: number): number {
  return Math.min(Math.max(keyLevel, 1), 83);
}

// Calculate effective monster level for experience penalty calculations
// For areas with monster level above 70, the effective level is reduced
// Formula: EffectiveMonsterLevel = -0.03 * MonsterLevel^2 + 5.17 * MonsterLevel - 144.9
export function getEffectiveMonsterLevel(monsterLevel: number): number {
  if (monsterLevel <= 70) {
    return monsterLevel;
  }
  
  // Apply effective level formula for areas above level 70
  const effectiveLevel = -0.03 * Math.pow(monsterLevel, 2) + 5.17 * monsterLevel - 144.9;
  return Math.max(1, Math.round(effectiveLevel * 100) / 100); // Round to 2 decimal places
}

// Calculate PoE safe zone: floor(3 + PlayerLevel / 16)
export function calculateSafeZone(playerLevel: number): number {
  return Math.floor(3 + playerLevel / 16);
}

// Calculate effective difference: max(|PlayerLevel - MonsterLevel| - SafeZone, 0)
export function calculateEffectiveDifference(playerLevel: number, monsterLevel: number): number {
  const safeZone = calculateSafeZone(playerLevel);
  const levelDiff = Math.abs(playerLevel - monsterLevel);
  return Math.max(levelDiff - safeZone, 0);
}

// Get 3.1 XP Penalty for levels 95+
const XP_31_PENALTY: Record<number, number> = {
  95: 1.0,
  96: 1.15,
  97: 1.32,
  98: 1.52,
  99: 1.75,
  100: 2.01
};

function getXp31Penalty(playerLevel: number): number {
  if (playerLevel < 95) return 1.0;
  if (playerLevel >= 100) return XP_31_PENALTY[100];
  return XP_31_PENALTY[playerLevel] || 1.0;
}

// Calculate experience multiplier based on PoE formulas
// For player levels below 95:
// XPMultiplier = max(((PlayerLevel + 5) / (PlayerLevel + 5 + EffectiveDifference^2.5))^1.5, 0.01)
// For player levels equal to or higher than 95:
// XPMultiplier = max(((PlayerLevel + 5) / (PlayerLevel + 5 + EffectiveDifference^2.5))^1.5 * (1 / (1 + 0.1 * (PlayerLevel - 94))) * (1 / 3.1_XP_Penalty), 0.01)
export function calculateExperienceMultiplier(playerLevel: number, monsterLevel: number): number {
  const effectiveMonsterLevel = getEffectiveMonsterLevel(monsterLevel);
  const effectiveDiff = calculateEffectiveDifference(playerLevel, effectiveMonsterLevel);
  
  if (effectiveDiff === 0) {
    // Within safe zone, full experience (unless level 95+ penalty applies)
    if (playerLevel >= 95) {
      const level95PlusPenalty = 1 / (1 + 0.1 * (playerLevel - 94));
      const xp31Penalty = getXp31Penalty(playerLevel);
      return Math.max(level95PlusPenalty * (1 / xp31Penalty), 0.01);
    }
    return 1.0;
  }
  
  // Calculate base multiplier
  const baseMultiplier = Math.pow(
    (playerLevel + 5) / (playerLevel + 5 + Math.pow(effectiveDiff, 2.5)),
    1.5
  );
  
  // Apply level 95+ penalties if applicable
  if (playerLevel >= 95) {
    const level95PlusPenalty = 1 / (1 + 0.1 * (playerLevel - 94));
    const xp31Penalty = getXp31Penalty(playerLevel);
    return Math.max(baseMultiplier * level95PlusPenalty * (1 / xp31Penalty), 0.01);
  }
  
  // Minimum 1% of raw experience
  return Math.max(baseMultiplier, 0.01);
}

// Calculate base experience from a monster based on its level
// PoE has base XP values per monster level, but we'll approximate based on monster stats
// Base XP scales with monster level, with multipliers for enemy type
export function calculateBaseExperienceFromMonster(
  monsterLevel: number,
  enemyType: EnemyType
): number {
  // Base XP per monster level (approximate PoE values)
  // Level 1 monsters give ~10 XP, level 83 monsters give ~1000+ XP
  // Scaling is roughly exponential: baseXP ≈ 10 * (1.1^monsterLevel)
  const baseXP = 10 * Math.pow(1.1, monsterLevel);
  
  // Type multipliers (bosses/minibosses give more)
  const typeMultipliers: Record<EnemyType, number> = {
    normal: 1.0,
    elite: 2.5,
    miniboss: 5.0,
    boss: 10.0
  };
  
  const typeMultiplier = typeMultipliers[enemyType] || 1.0;
  
  return Math.floor(baseXP * typeMultiplier);
}

// Calculate experience gained from killing an enemy (Path of Exile system)
export function calculateExperienceFromEnemy(
  enemy: DungeonEnemy,
  keyLevel: number,
  _healthMultiplier: number,
  playerLevel: number
): number {
  // Calculate monster level from key level
  const monsterLevel = getMonsterLevelFromKeyLevel(keyLevel);
  
  // Calculate base experience from monster
  const baseXP = calculateBaseExperienceFromMonster(monsterLevel, enemy.type);
  
  // Calculate experience multiplier based on level difference
  const xpMultiplier = calculateExperienceMultiplier(playerLevel, monsterLevel);
  
  // Apply multiplier
  const finalXP = Math.floor(baseXP * xpMultiplier);
  
  // Ensure minimum 1% of base XP (even with heavy penalty)
  const minXP = Math.max(Math.floor(baseXP * 0.01), 1);
  
  return Math.max(finalXP, minXP);
}

// Add experience to a character and check for level ups
export interface LevelUpResult {
  newLevel: number;
  levelsGained: number;
  remainingExp: number;
}

export function addExperienceToCharacter(
  character: Character,
  experience: number
): LevelUpResult {
  let currentExp = character.experience;
  let currentLevel = character.level;
  let totalExp = currentExp + experience;
  let levelsGained = 0;
  
  // Check for level ups
  while (currentLevel < 100) {
    const expForNextLevel = getExperienceRequiredForLevel(currentLevel + 1);
    
    if (totalExp >= expForNextLevel) {
      totalExp -= expForNextLevel;
      currentLevel++;
      levelsGained++;
    } else {
      break;
    }
  }
  
  // Cap at level 100
  if (currentLevel > 100) {
    currentLevel = 100;
    totalExp = 0;
  }
  
  return {
    newLevel: currentLevel,
    levelsGained,
    remainingExp: totalExp
  };
}

// Get experience progress percentage for current level
export function getExperienceProgress(character: Character): {
  current: number;
  required: number;
  percentage: number;
} {
  const current = character.experience;
  const required = getExperienceRequiredForLevel(character.level + 1);
  const percentage = character.level >= 100 ? 100 : (current / required) * 100;
  
  return { current, required, percentage };
}
