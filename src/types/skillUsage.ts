// Skill Usage Configuration System
// Allows players to configure when each skill should be used in combat

// Comparison operators for numeric conditions
export type ComparisonOperator = 'less_than' | 'less_equal' | 'greater_than' | 'greater_equal' | 'equal';

// Target count conditions
export type TargetCountCondition = 
  | 'any'           // Use regardless of target count
  | 'single'        // Only 1 target
  | 'two_plus'      // 2 or more targets
  | 'three_plus'    // 3 or more targets  
  | 'five_plus'     // 5 or more targets
  | 'aoe';          // Maximum enemies (use when most enemies)

// Target type conditions
export type TargetTypeCondition =
  | 'any'           // Use on any target
  | 'normal'        // Only normal enemies
  | 'elite'         // Only elite enemies
  | 'elite_plus'    // Elite or higher (elite, miniboss, boss)
  | 'boss'          // Only bosses (miniboss or final boss)
  | 'lowest_health' // Target with lowest health
  | 'highest_health'; // Target with highest health

// Health threshold conditions
export interface HealthCondition {
  enabled: boolean;
  target: 'self' | 'tank' | 'healer' | 'lowest_ally' | 'any_ally' | 'target';
  operator: ComparisonOperator;
  threshold: number; // Percentage (0-100)
}

// Mana threshold condition
export interface ManaCondition {
  enabled: boolean;
  operator: ComparisonOperator;
  threshold: number; // Percentage (0-100)
}

// Party members hurt condition (for AoE heals)
export interface PartyHurtCondition {
  enabled: boolean;
  minCount: number;      // Minimum party members that must be hurt
  healthThreshold: number; // Health % threshold to count as "hurt" (e.g., 90 means below 90%)
}

// Combat state conditions
export interface CombatStateCondition {
  enabled: boolean;
  state: 'in_combat' | 'out_of_combat' | 'bloodlust_active' | 'any';
}

// Buff/Debuff conditions
export interface BuffCondition {
  enabled: boolean;
  type: 'has_buff' | 'missing_buff' | 'has_debuff' | 'missing_debuff';
  buffId: string; // ID of the buff to check
}

// Cooldown-based condition (use on cooldown)
export interface CooldownCondition {
  enabled: boolean;
  mode: 'on_cooldown' | 'save_for_burst' | 'normal';
  // 'on_cooldown' = use immediately when available
  // 'save_for_burst' = save for bloodlust or boss fights
  // 'normal' = use when conditions met, don't prioritize
}

// Effect application condition (for DOTs/HOTs)
// Controls when to apply effects based on how many targets already have the effect
export interface EffectApplicationCondition {
  enabled: boolean;
  // What type of targets to check
  targetGroup: 'enemies' | 'allies';
  // The comparison to make
  operator: ComparisonOperator;
  // How many targets should have the effect for this condition to pass
  // e.g., "cast if less_than 3 enemies have this DOT" means keep casting until 3 have it
  count: number;
  // If true, prioritize targets that don't have the effect
  prioritizeWithout: boolean;
}

// Complete skill usage configuration
export interface SkillUsageConfig {
  // Is this skill enabled for auto-use?
  enabled: boolean;
  
  // Priority (1-10, higher = check first)
  priority: number;
  
  // Target conditions
  targetCount: TargetCountCondition;
  targetType: TargetTypeCondition;
  
  // Health conditions
  selfHealth: HealthCondition;
  targetHealth: HealthCondition;
  tankHealth: HealthCondition;     // For healers
  allyHealth: HealthCondition;     // For healers
  
  // Mana condition
  mana: ManaCondition;
  
  // Party condition (for AoE heals)
  partyHurt: PartyHurtCondition;
  
  // Combat state
  combatState: CombatStateCondition;
  
  // Cooldown behavior
  cooldown: CooldownCondition;
  
  // Effect application condition (for DOTs/HOTs)
  // Controls casting based on how many targets have the effect applied
  effectApplication: EffectApplicationCondition;
}

// Default configurations by skill type
export function createDefaultSkillConfig(skillType: 'damage' | 'heal' | 'buff' | 'debuff' | 'dot' | 'hot', _skillId?: string): SkillUsageConfig {
  const baseConfig: SkillUsageConfig = {
    enabled: true,
    priority: 5,
    targetCount: 'any',
    targetType: 'any',
    selfHealth: { enabled: false, target: 'self', operator: 'less_than', threshold: 50 },
    targetHealth: { enabled: false, target: 'target', operator: 'less_than', threshold: 100 },
    tankHealth: { enabled: false, target: 'tank', operator: 'less_than', threshold: 50 },
    allyHealth: { enabled: false, target: 'lowest_ally', operator: 'less_than', threshold: 50 },
    mana: { enabled: false, operator: 'greater_than', threshold: 20 },
    partyHurt: { enabled: false, minCount: 2, healthThreshold: 80 },
    combatState: { enabled: false, state: 'any' },
    cooldown: { enabled: true, mode: 'normal' },
    effectApplication: { enabled: false, targetGroup: 'enemies', operator: 'less_than', count: 3, prioritizeWithout: true }
  };
  
  // Customize based on skill type
  switch (skillType) {
    case 'damage':
      return {
        ...baseConfig,
        targetCount: 'any',
        targetType: 'any',
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
      
    case 'heal':
      return {
        ...baseConfig,
        priority: 7,
        allyHealth: { enabled: true, target: 'lowest_ally', operator: 'less_than', threshold: 90 },
        cooldown: { enabled: true, mode: 'normal' }
      };
      
    case 'buff':
      return {
        ...baseConfig,
        priority: 8,
        cooldown: { enabled: true, mode: 'normal' }
      };
      
    case 'debuff':
      return {
        ...baseConfig,
        priority: 6,
        targetType: 'elite_plus',
        cooldown: { enabled: true, mode: 'normal' }
      };
      
    case 'dot':
      return {
        ...baseConfig,
        priority: 6,
        effectApplication: { 
          enabled: true, 
          targetGroup: 'enemies', 
          operator: 'less_than', 
          count: 99, // Apply to all enemies by default
          prioritizeWithout: true 
        },
        cooldown: { enabled: true, mode: 'normal' }
      };
      
    case 'hot':
      return {
        ...baseConfig,
        priority: 4,
        allyHealth: { enabled: true, target: 'lowest_ally', operator: 'less_than', threshold: 95 },
        effectApplication: { 
          enabled: true, 
          targetGroup: 'allies', 
          operator: 'less_than', 
          count: 4, // Apply to all party members
          prioritizeWithout: true 
        },
        cooldown: { enabled: true, mode: 'normal' }
      };
  }
}

// Smart defaults based on specific skill IDs
export function createSmartSkillConfig(skillId: string): SkillUsageConfig {
  switch (skillId) {
    // === DPS SKILLS ===
    case 'fireball':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 5,
        targetCount: 'any',
        targetType: 'any'
      };
      
    case 'shadow_bolt':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 6,
        targetCount: 'two_plus', // Good for cleave
        targetType: 'lowest_health'
      };
      
    case 'blow_up':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 7,
        targetCount: 'three_plus', // AoE ability
        targetType: 'any',
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
      
    case 'ice_lance':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 5,
        targetCount: 'any', // Fast single-target spell
        targetType: 'any',
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
      
    case 'lightning_bolt':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 6,
        targetCount: 'two_plus', // Chaining spell - better with multiple targets
        targetType: 'any',
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
      
    case 'blizzard':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 7,
        targetCount: 'three_plus', // AoE DoT - best with many targets
        targetType: 'any',
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
      
    case 'meteor':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 8,
        targetCount: 'three_plus', // Big AoE nuke
        targetType: 'any',
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
      
    case 'arcane_missiles':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 5,
        targetCount: 'any', // Channeled single-target
        targetType: 'elite_plus', // Good for sustained damage on tough enemies
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
      
    case 'disintegrate':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 6,
        targetCount: 'any', // Ramping channeled single-target
        targetType: 'elite_plus', // Best on bosses/elites due to ramp-up
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
      
    case 'soul_siphon':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 5,
        targetCount: 'any', // Channeled drain - provides sustain
        targetType: 'any',
        selfHealth: { enabled: true, target: 'self', operator: 'less_than', threshold: 80 }, // Use when need healing
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
      
    case 'storm_call':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 7,
        targetCount: 'three_plus', // Channeled AoE - best with many targets
        targetType: 'any',
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
      
    case 'incinerate':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 6,
        targetCount: 'two_plus', // Channeled cone AoE
        targetType: 'any',
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
      
    // === HEALING SKILLS ===
    case 'healing_wave':
      return {
        ...createDefaultSkillConfig('heal'),
        priority: 5,
        allyHealth: { enabled: true, target: 'lowest_ally', operator: 'less_than', threshold: 85 }
      };
      
    case 'massive_heal':
      return {
        ...createDefaultSkillConfig('heal'),
        priority: 9, // Emergency heal - high priority
        allyHealth: { enabled: true, target: 'lowest_ally', operator: 'less_than', threshold: 40 },
        cooldown: { enabled: true, mode: 'normal' }
      };
      
    case 'rejuvenation':
      return {
        ...createDefaultSkillConfig('hot'),
        priority: 4,
        allyHealth: { enabled: true, target: 'lowest_ally', operator: 'less_than', threshold: 95 },
        effectApplication: { 
          enabled: true, 
          targetGroup: 'allies', 
          operator: 'less_than', 
          count: 4, // Apply to all party members
          prioritizeWithout: true 
        }
      };
      
    case 'circle_of_healing':
      return {
        ...createDefaultSkillConfig('heal'),
        priority: 6, // Higher priority than single-target heals when party is hurt
        partyHurt: { enabled: true, minCount: 2, healthThreshold: 85 }, // Cast when 2+ allies below 85% HP
        allyHealth: { enabled: false, target: 'lowest_ally', operator: 'less_than', threshold: 50 }, // Disable single-target check since this is AoE
        cooldown: { enabled: true, mode: 'normal' }
      };
      
    case 'corruption':
      return {
        ...createDefaultSkillConfig('dot'),
        priority: 7,
        effectApplication: { 
          enabled: true, 
          targetGroup: 'enemies', 
          operator: 'less_than', 
          count: 99, // Apply to all enemies
          prioritizeWithout: true 
        }
      };
      
    case 'immolate':
      return {
        ...createDefaultSkillConfig('dot'),
        priority: 6,
        effectApplication: { 
          enabled: true, 
          targetGroup: 'enemies', 
          operator: 'less_than', 
          count: 99, // Apply to all enemies
          prioritizeWithout: true 
        }
      };
      
    case 'pain_suppression':
      return {
        ...createDefaultSkillConfig('buff'),
        priority: 10, // Highest priority - emergency defensive
        tankHealth: { enabled: true, target: 'tank', operator: 'less_than', threshold: 35 },
        cooldown: { enabled: true, mode: 'save_for_burst' }
      };
      
    // === TANK SKILLS ===
    case 'shield_slam':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 5,
        targetCount: 'any', // Single-target skill but can be used regardless of enemy count
        targetType: 'elite_plus', // Prioritize dangerous enemies with high single-target damage
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
      
    case 'thunder_clap':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 6,
        targetCount: 'two_plus',
        targetType: 'any',
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
      
    case 'shield_block':
      return {
        ...createDefaultSkillConfig('buff'),
        priority: 8,
        selfHealth: { enabled: true, target: 'self', operator: 'less_than', threshold: 70 },
        cooldown: { enabled: true, mode: 'normal' }
      };
      
    case 'defensive_stance':
      return {
        ...createDefaultSkillConfig('buff'),
        priority: 7,
        selfHealth: { enabled: true, target: 'self', operator: 'less_than', threshold: 80 },
        targetType: 'elite_plus', // Use against dangerous enemies
        cooldown: { enabled: true, mode: 'normal' }
      };
    
    // === RANGED ATTACK SKILLS ===
    case 'split_arrow':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 5,
        targetCount: 'two_plus', // AoE skill - better with multiple targets
        targetType: 'any',
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
    
    case 'rain_of_arrows':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 6,
        targetCount: 'three_plus', // AoE skill - best with many targets
        targetType: 'any',
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
    
    case 'barrage':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 5,
        targetCount: 'any', // Single-target focused skill but can be used anytime
        targetType: 'elite_plus', // High single-target damage best on dangerous enemies
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
    
    case 'tornado_shot':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 6,
        targetCount: 'two_plus', // Chaining skill - better with multiple targets
        targetType: 'any',
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
    
    case 'ice_shot':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 5,
        targetCount: 'any', // Can be used on any target count
        targetType: 'any', // Flexible single-target skill
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
    
    case 'lightning_arrow':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 6,
        targetCount: 'two_plus', // Chaining skill - better with multiple targets
        targetType: 'any',
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
    
    // === MELEE ATTACK SKILLS ===
    case 'cleave':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 5,
        targetCount: 'two_plus', // AoE skill - better with multiple targets
        targetType: 'any',
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
    
    case 'heavy_strike':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 5,
        targetCount: 'any', // Single-target high damage skill - use on any target
        targetType: 'any',
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
    
    case 'double_strike':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 5,
        targetCount: 'any', // Flexible single-target skill
        targetType: 'any', // Fast attacks - use on any target
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
    
    case 'cyclone':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 7,
        targetCount: 'three_plus', // Channeled AoE - best with many targets
        targetType: 'any',
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
    
    case 'reave':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 6,
        targetCount: 'two_plus', // AoE skill - better with multiple targets
        targetType: 'any',
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
    
    case 'lacerate':
      return {
        ...createDefaultSkillConfig('damage'),
        priority: 5,
        targetCount: 'any', // Can apply DoT to any target
        targetType: 'any', // Flexible single-target with DoT
        cooldown: { enabled: true, mode: 'on_cooldown' }
      };
    
    default:
      return createDefaultSkillConfig('damage');
  }
}

// Context for effect application checks
export interface EffectApplicationContext {
  // For DOTs: how many enemies currently have this effect
  enemiesWithEffect: number;
  totalEnemies: number;
  // For HOTs: how many allies currently have this effect
  alliesWithEffect: number;
  totalAllies: number;
}

// Check if a skill's conditions are met
export function checkSkillConditions(
  config: SkillUsageConfig,
  context: {
    enemyCount: number;
    enemyTypes: ('normal' | 'elite' | 'miniboss' | 'boss')[];
    selfHealthPercent: number;
    selfManaPercent: number;
    tankHealthPercent: number;
    lowestAllyHealthPercent: number;
    partyHealthPercents: number[];
    isBloodlustActive: boolean;
    inCombat: boolean;
    hasBuff?: (buffId: string) => boolean;
    effectContext?: EffectApplicationContext;
  }
): boolean {
  if (!config.enabled) return false;
  
  // Check target count
  if (!checkTargetCount(config.targetCount, context.enemyCount)) return false;
  
  // Check self health
  if (config.selfHealth.enabled) {
    if (!checkHealthCondition(config.selfHealth.operator, context.selfHealthPercent, config.selfHealth.threshold)) {
      return false;
    }
  }
  
  // Check mana
  if (config.mana.enabled) {
    if (!checkHealthCondition(config.mana.operator, context.selfManaPercent, config.mana.threshold)) {
      return false;
    }
  }
  
  // Check tank health (for healers)
  if (config.tankHealth.enabled) {
    if (!checkHealthCondition(config.tankHealth.operator, context.tankHealthPercent, config.tankHealth.threshold)) {
      return false;
    }
  }
  
  // Check ally health (for healers)
  if (config.allyHealth.enabled) {
    if (!checkHealthCondition(config.allyHealth.operator, context.lowestAllyHealthPercent, config.allyHealth.threshold)) {
      return false;
    }
  }
  
  // Check party hurt condition
  if (config.partyHurt.enabled) {
    const hurtCount = context.partyHealthPercents.filter(hp => hp < config.partyHurt.healthThreshold).length;
    if (hurtCount < config.partyHurt.minCount) return false;
  }
  
  // Check effect application condition (for DOTs/HOTs)
  if (config.effectApplication?.enabled && context.effectContext) {
    const effectCount = config.effectApplication.targetGroup === 'enemies' 
      ? context.effectContext.enemiesWithEffect 
      : context.effectContext.alliesWithEffect;
    
    if (!checkHealthCondition(config.effectApplication.operator, effectCount, config.effectApplication.count)) {
      return false;
    }
  }
  
  // Check target type
  if (!checkTargetType(config.targetType, context.enemyTypes)) return false;
  
  return true;
}

function checkTargetCount(condition: TargetCountCondition, count: number): boolean {
  switch (condition) {
    case 'any': return count >= 0; // 'any' means any number including 0 (for healing skills)
    case 'single': return count === 1;
    case 'two_plus': return count >= 2;
    case 'three_plus': return count >= 3;
    case 'five_plus': return count >= 5;
    case 'aoe': return count >= 3; // Same as three_plus for now
    default: return true;
  }
}

function checkTargetType(condition: TargetTypeCondition, types: ('normal' | 'elite' | 'miniboss' | 'boss')[]): boolean {
  if (condition === 'any' || condition === 'lowest_health' || condition === 'highest_health') return true;
  
  const hasNormal = types.includes('normal');
  const hasElite = types.includes('elite');
  const hasMiniboss = types.includes('miniboss');
  const hasBoss = types.includes('boss');
  
  switch (condition) {
    case 'normal': return hasNormal;
    case 'elite': return hasElite;
    case 'elite_plus': return hasElite || hasMiniboss || hasBoss;
    case 'boss': return hasMiniboss || hasBoss;
    default: return true;
  }
}

function checkHealthCondition(operator: ComparisonOperator, value: number, threshold: number): boolean {
  switch (operator) {
    case 'less_than': return value < threshold;
    case 'less_equal': return value <= threshold;
    case 'greater_than': return value > threshold;
    case 'greater_equal': return value >= threshold;
    case 'equal': return Math.abs(value - threshold) < 1;
    default: return true;
  }
}

// Human-readable description of a skill config (compact version for tooltips)
export function describeSkillConfig(config: SkillUsageConfig): string {
  const conditions: string[] = [];
  
  if (!config.enabled) return 'Disabled';
  
  // Target count
  switch (config.targetCount) {
    case 'single': conditions.push('1 target'); break;
    case 'two_plus': conditions.push('2+ targets'); break;
    case 'three_plus': conditions.push('3+ targets'); break;
    case 'five_plus': conditions.push('5+ targets'); break;
    case 'aoe': conditions.push('max targets'); break;
  }
  
  // Target type
  switch (config.targetType) {
    case 'elite': conditions.push('elite only'); break;
    case 'elite_plus': conditions.push('elite+'); break;
    case 'boss': conditions.push('boss only'); break;
    case 'lowest_health': conditions.push('lowest HP'); break;
    case 'highest_health': conditions.push('highest HP'); break;
  }
  
  // Health conditions
  if (config.selfHealth.enabled) {
    conditions.push(`self HP ${operatorSymbol(config.selfHealth.operator)} ${config.selfHealth.threshold}%`);
  }
  if (config.tankHealth.enabled) {
    conditions.push(`tank HP ${operatorSymbol(config.tankHealth.operator)} ${config.tankHealth.threshold}%`);
  }
  if (config.allyHealth.enabled) {
    conditions.push(`ally HP ${operatorSymbol(config.allyHealth.operator)} ${config.allyHealth.threshold}%`);
  }
  
  // Mana
  if (config.mana.enabled) {
    conditions.push(`mana ${operatorSymbol(config.mana.operator)} ${config.mana.threshold}%`);
  }
  
  // Party hurt
  if (config.partyHurt.enabled) {
    conditions.push(`${config.partyHurt.minCount}+ allies < ${config.partyHurt.healthThreshold}% HP`);
  }
  
  // Effect application (DOT/HOT)
  if (config.effectApplication?.enabled) {
    const targetName = config.effectApplication.targetGroup === 'enemies' ? 'enemies' : 'allies';
    const effectType = config.effectApplication.targetGroup === 'enemies' ? 'DOT' : 'HOT';
    if (config.effectApplication.count >= 99) {
      conditions.push(`apply ${effectType} to all`);
    } else {
      conditions.push(`${effectType} on ${operatorSymbol(config.effectApplication.operator)} ${config.effectApplication.count} ${targetName}`);
    }
  }
  
  // Cooldown mode
  if (config.cooldown.mode === 'on_cooldown') {
    conditions.push('use on CD');
  } else if (config.cooldown.mode === 'save_for_burst') {
    conditions.push('save for burst');
  }
  
  return conditions.length > 0 ? conditions.join(', ') : 'Always';
}

// Detailed, descriptive version for UI display
export function describeSkillConfigDetailed(config: SkillUsageConfig): string {
  if (!config.enabled) return 'Skill is disabled and will not be cast';
  
  const conditions: string[] = [];
  
  // Cooldown mode first (most important behavior)
  if (config.cooldown.mode === 'on_cooldown') {
    conditions.push('⚡ Uses immediately when available');
  } else if (config.cooldown.mode === 'save_for_burst') {
    conditions.push('💾 Saves for boss fights or Bloodlust');
  }
  
  // Target count
  switch (config.targetCount) {
    case 'single': conditions.push('🎯 Only when exactly 1 enemy'); break;
    case 'two_plus': conditions.push('👥 When 2 or more enemies'); break;
    case 'three_plus': conditions.push('👥👥👥 When 3 or more enemies'); break;
    case 'five_plus': conditions.push('👥👥👥👥👥 When 5 or more enemies'); break;
    case 'aoe': conditions.push('💥 When maximum enemies present'); break;
  }
  
  // Target type
  switch (config.targetType) {
    case 'elite': conditions.push('⭐ Only on elite enemies'); break;
    case 'elite_plus': conditions.push('⭐ Only on elite+ enemies (elite, miniboss, boss)'); break;
    case 'boss': conditions.push('👑 Only on bosses'); break;
    case 'lowest_health': conditions.push('🎯 Targets lowest health enemy'); break;
    case 'highest_health': conditions.push('🎯 Targets highest health enemy'); break;
  }
  
  // Health conditions
  if (config.selfHealth.enabled) {
    const opDesc = operatorDescription(config.selfHealth.operator);
    conditions.push(`❤️ When self HP ${opDesc} ${config.selfHealth.threshold}%`);
  }
  if (config.tankHealth.enabled) {
    const opDesc = operatorDescription(config.tankHealth.operator);
    conditions.push(`🛡️ When tank HP ${opDesc} ${config.tankHealth.threshold}%`);
  }
  if (config.allyHealth.enabled) {
    const opDesc = operatorDescription(config.allyHealth.operator);
    conditions.push(`🤝 When lowest ally HP ${opDesc} ${config.allyHealth.threshold}%`);
  }
  
  // Mana
  if (config.mana.enabled) {
    const opDesc = operatorDescription(config.mana.operator);
    conditions.push(`💧 When mana ${opDesc} ${config.mana.threshold}%`);
  }
  
  // Party hurt
  if (config.partyHurt.enabled) {
    conditions.push(`👨‍👩‍👧‍👦 When ${config.partyHurt.minCount}+ allies below ${config.partyHurt.healthThreshold}% HP`);
  }
  
  // Effect application (DOT/HOT)
  if (config.effectApplication?.enabled) {
    const targetName = config.effectApplication.targetGroup === 'enemies' ? 'enemies' : 'allies';
    const effectType = config.effectApplication.targetGroup === 'enemies' ? 'DOT' : 'HOT';
    if (config.effectApplication.count >= 99) {
      conditions.push(`🔥 Keeps ${effectType} applied to all ${targetName}`);
    } else {
      const opDesc = operatorDescription(config.effectApplication.operator);
      conditions.push(`🔥 When ${opDesc} ${config.effectApplication.count} ${targetName} have ${effectType}`);
    }
    if (config.effectApplication.prioritizeWithout) {
      conditions.push(`   └ Prioritizes ${targetName} without the effect`);
    }
  }
  
  return conditions.length > 0 ? conditions.join('\n') : '✅ Always casts when available';
}

function operatorDescription(op: ComparisonOperator): string {
  switch (op) {
    case 'less_than': return 'is below';
    case 'less_equal': return 'is at or below';
    case 'greater_than': return 'is above';
    case 'greater_equal': return 'is at or above';
    case 'equal': return 'equals';
    default: return '?';
  }
}

function operatorSymbol(op: ComparisonOperator): string {
  switch (op) {
    case 'less_than': return '<';
    case 'less_equal': return '≤';
    case 'greater_than': return '>';
    case 'greater_equal': return '≥';
    case 'equal': return '=';
    default: return '?';
  }
}

