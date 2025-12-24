import type { 
  Character, 
  DungeonRoute, 
  Dungeon, 
  DungeonRunResult, 
  CombatLogEntry,
  EnemyPack,
  DungeonEnemy,
  DungeonBoss,
  KeyLevel
} from '../types';
import { 
  calculateKeyScaling, 
  calculateTimerUpgrade,
  SAMPLE_DUNGEON 
} from '../types/dungeon';
import { calculatePassiveBonuses, getDefaultClassForRole } from '../types/passives';
import { generateDungeonLoot, generateOrbDrops, generateFragmentDrops } from './crafting';

// Combat state for a single entity
interface CombatEntity {
  id: string;
  name: string;
  isPlayer: boolean;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  damage: number;
  armor: number;
  cooldowns: Record<string, number>;
  effects: ActiveEffect[];
  isDead: boolean;
}

interface ActiveEffect {
  id: string;
  name: string;
  type: 'dot' | 'hot' | 'buff' | 'debuff' | 'shield';
  value: number;
  duration: number;
  tickRate: number;
  lastTick: number;
  stacks: number;
}

// Full simulation state
interface SimulationState {
  players: CombatEntity[];
  enemies: CombatEntity[];
  currentTime: number;
  combatLog: CombatLogEntry[];
  forcesCleared: number;
  currentPull: number;
  isInCombat: boolean;
}

// Calculate effective stats for a character including gear, passives, etc.
function calculateEffectiveStats(character: Character): {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  damage: number;
  healing: number;
  armor: number;
} {
  const base = character.baseStats;
  
  // Get passive bonuses (use classId if available, fall back to role default)
  const classId = character.classId || getDefaultClassForRole(character.role);
  const passiveBonuses = classId 
    ? calculatePassiveBonuses(classId, character.allocatedPassives)
    : { stats: {}, effects: [] };
  
  // Combine base stats with passive bonuses
  // BaseStats uses 'life' and 'maxLife', not 'health' and 'maxHealth'
  const health = base.life + (passiveBonuses.stats.life || 0);
  const maxHealth = base.maxLife + (passiveBonuses.stats.maxLife || 0);
  const mana = base.mana + (passiveBonuses.stats.mana || 0);
  const maxMana = base.maxMana + (passiveBonuses.stats.maxMana || 0);
  // BaseStats doesn't have attackPower/spellPower, calculate from attributes
  const attackPower = (base.strength * 0.1) + (passiveBonuses.stats.strength || 0) * 0.1;
  const spellPower = (base.intelligence * 0.1) + (passiveBonuses.stats.intelligence || 0) * 0.1;
  const armor = base.armor + (passiveBonuses.stats.armor || 0);
  
  // Calculate damage based on role
  let damage = character.role === 'dps' 
    ? Math.max(attackPower, spellPower) * 1.5
    : character.role === 'tank'
      ? attackPower * 0.8
      : spellPower * 0.5;
  
  // Calculate healing (for healers)
  const healing = spellPower * 1.2;
  
  return { health, maxHealth, mana, maxMana, damage, healing, armor };
}

// Create combat entity from character
function createPlayerEntity(character: Character): CombatEntity {
  const stats = calculateEffectiveStats(character);
  
  return {
    id: character.id,
    name: character.name,
    isPlayer: true,
    health: stats.health,
    maxHealth: stats.maxHealth,
    mana: stats.mana,
    maxMana: stats.maxMana,
    damage: stats.damage,
    armor: stats.armor,
    cooldowns: {},
    effects: [],
    isDead: false
  };
}

// Create combat entity from dungeon enemy
function createEnemyEntity(enemy: DungeonEnemy, scaling: KeyLevel, isFortified: boolean): CombatEntity {
  const healthMult = isFortified && enemy.type !== 'boss' ? 1.2 : 1;
  const damageMult = isFortified && enemy.type !== 'boss' ? 1.3 : 1;
  
  // Apply type-based damage adjustments: +20% for bosses/minibosses, -20% for trash
  const isBossType = enemy.type === 'boss' || enemy.type === 'miniboss';
  const typeDamageModifier = isBossType ? 1.2 : 0.8; // Bosses/minibosses +20%, trash -20%
  
  return {
    id: `${enemy.id}_${Math.random().toString(36).substr(2, 9)}`,
    name: enemy.name,
    isPlayer: false,
    health: enemy.baseHealth * scaling.healthMultiplier * healthMult,
    maxHealth: enemy.baseHealth * scaling.healthMultiplier * healthMult,
    mana: 100,
    maxMana: 100,
    damage: enemy.baseDamage * scaling.damageMultiplier * damageMult * typeDamageModifier,
    armor: 0,
    cooldowns: {},
    effects: [],
    isDead: false
  };
}

// Get target player - tanks are prioritized as they're in front
function getTargetPlayer(players: CombatEntity[]): CombatEntity | null {
  const livingPlayers = players.filter(p => !p.isDead);
  if (livingPlayers.length === 0) return null;
  
  // Tank is in front, so enemies target them first
  const tank = livingPlayers.find(p => p.name.toLowerCase().includes('defender') || p.name.toLowerCase().includes('tank'));
  if (tank) return tank;
  
  // Otherwise random target
  return livingPlayers[Math.floor(Math.random() * livingPlayers.length)];
}

// Get lowest health ally
function getLowestHealthAlly(players: CombatEntity[]): CombatEntity | null {
  const living = players.filter(p => !p.isDead);
  if (living.length === 0) return null;
  
  return living.reduce((lowest, p) => 
    (p.health / p.maxHealth) < (lowest.health / lowest.maxHealth) ? p : lowest
  );
}

// Process a combat tick
function processCombatTick(state: SimulationState, deltaTime: number): void {
  const { players, enemies, combatLog } = state;
  
  // Process effects (DoTs, HoTs, etc.)
  [...players, ...enemies].forEach(entity => {
    entity.effects = entity.effects.filter(effect => {
      if (effect.duration <= 0) return false;
      
      // Tick damage/healing
      if (state.currentTime - effect.lastTick >= effect.tickRate) {
        effect.lastTick = state.currentTime;
        
        if (effect.type === 'dot') {
          entity.health -= effect.value * effect.stacks;
          combatLog.push({
            timestamp: state.currentTime,
            type: 'damage',
            source: effect.name,
            target: entity.name,
            value: effect.value * effect.stacks,
            message: `${entity.name} takes ${effect.value * effect.stacks} ${effect.name} damage`
          });
        } else if (effect.type === 'hot') {
          const healAmount = Math.min(effect.value * effect.stacks, entity.maxHealth - entity.health);
          entity.health += healAmount;
          combatLog.push({
            timestamp: state.currentTime,
            type: 'heal',
            source: effect.name,
            target: entity.name,
            value: healAmount,
            message: `${entity.name} heals for ${healAmount} from ${effect.name}`
          });
        }
      }
      
      effect.duration -= deltaTime;
      return effect.duration > 0;
    });
    
    // Check for death
    if (entity.health <= 0 && !entity.isDead) {
      entity.isDead = true;
      entity.health = 0;
      combatLog.push({
        timestamp: state.currentTime,
        type: 'death',
        source: '',
        target: entity.name,
        message: `${entity.name} has died!`
      });
    }
  });
  
  // Player actions
  players.filter(p => !p.isDead).forEach(player => {
    const isHealer = player.name.toLowerCase().includes('mender') || player.name.toLowerCase().includes('healer');
    const isTank = player.name.toLowerCase().includes('defender') || player.name.toLowerCase().includes('tank');
    
    // Reduce all cooldowns
    Object.keys(player.cooldowns).forEach(skill => {
      player.cooldowns[skill] = Math.max(0, player.cooldowns[skill] - deltaTime);
    });
    
    const livingEnemies = enemies.filter(e => !e.isDead);
    if (livingEnemies.length === 0) return;
    
    if (isHealer) {
      // Healer logic
      const lowestAlly = getLowestHealthAlly(players);
      if (lowestAlly && lowestAlly.health / lowestAlly.maxHealth < 0.9) {
        // Cast heal
        const healAmount = player.damage * 1.5;
        lowestAlly.health = Math.min(lowestAlly.maxHealth, lowestAlly.health + healAmount);
        combatLog.push({
          timestamp: state.currentTime,
          type: 'heal',
          source: player.name,
          target: lowestAlly.name,
          value: healAmount,
          ability: 'Healing Wave',
          message: `${player.name} heals ${lowestAlly.name} for ${Math.floor(healAmount)}`
        });
      }
    } else {
      // DPS/Tank logic - attack enemies
      const target = livingEnemies[0];
      let damage = player.damage;
      
      // Tanks deal less damage but are more durable
      if (isTank) {
        damage *= 0.7;
      }
      
      target.health -= damage;
      combatLog.push({
        timestamp: state.currentTime,
        type: 'damage',
        source: player.name,
        target: target.name,
        value: damage,
        ability: isTank ? 'Shield Slam' : 'Attack',
        message: `${player.name} hits ${target.name} for ${Math.floor(damage)} damage`
      });
    }
  });
  
  // Enemy actions
  enemies.filter(e => !e.isDead).forEach(enemy => {
    // Reduce cooldowns
    Object.keys(enemy.cooldowns).forEach(skill => {
      enemy.cooldowns[skill] = Math.max(0, enemy.cooldowns[skill] - deltaTime);
    });
    
    // Basic attack - tanks are prioritized as frontline
    const target = getTargetPlayer(players);
    if (!target) return;
    
    // Calculate damage reduction from armor
    const damageReduction = target.armor / (target.armor + 1000);
    const finalDamage = enemy.damage * (1 - damageReduction);
    
    target.health -= finalDamage;
    combatLog.push({
      timestamp: state.currentTime,
      type: 'damage',
      source: enemy.name,
      target: target.name,
      value: finalDamage,
      message: `${enemy.name} attacks ${target.name} for ${Math.floor(finalDamage)} damage`
    });
  });
}

// Simulate a single pull
function simulatePull(
  state: SimulationState,
  pack: EnemyPack,
  dungeon: Dungeon,
  scaling: KeyLevel,
  affixes: string[]
): void {
  const isFortified = affixes.includes('fortified');
  
  // Log pull start
  state.combatLog.push({
    timestamp: state.currentTime,
    type: 'pull',
    source: '',
    target: '',
    message: `--- Pull ${state.currentPull}: ${pack.enemies.map(e => `${e.count}x ${dungeon.availableEnemies.find(ae => ae.id === e.enemyId)?.name}`).join(', ')} ---`
  });
  
  // Create enemy entities
  pack.enemies.forEach(({ enemyId, count }) => {
    const enemyDef = dungeon.availableEnemies.find(e => e.id === enemyId);
    if (!enemyDef) return;
    
    for (let i = 0; i < count; i++) {
      state.enemies.push(createEnemyEntity(enemyDef, scaling, isFortified));
    }
  });
  
  state.isInCombat = true;
  
  // Combat loop
  const tickRate = 1; // 1 second ticks
  while (state.enemies.some(e => !e.isDead) && state.players.some(p => !p.isDead)) {
    processCombatTick(state, tickRate);
    state.currentTime += tickRate;
    
    // Timeout safety
    if (state.currentTime > 3600) break;
  }
  
  // Add forces if successful
  if (state.players.some(p => !p.isDead)) {
    state.forcesCleared += pack.totalForces;
  }
  
  // Clear dead enemies
  state.enemies = [];
  state.isInCombat = false;
  
  // Regenerate between pulls
  state.players.forEach(player => {
    if (!player.isDead) {
      player.health = Math.min(player.maxHealth, player.health + player.maxHealth * 0.2);
      player.mana = Math.min(player.maxMana, player.mana + player.maxMana * 0.3);
    }
  });
  
  state.currentPull++;
}

// Simulate boss encounter
function simulateBoss(
  state: SimulationState,
  boss: DungeonBoss,
  scaling: KeyLevel,
  affixes: string[]
): void {
  const isTyrannical = affixes.includes('tyrannical');
  
  state.combatLog.push({
    timestamp: state.currentTime,
    type: 'boss',
    source: '',
    target: '',
    message: `=== BOSS: ${boss.enemy.name} ===`
  });
  
  // Create boss entity with tyrannical scaling
  const bossEntity = createEnemyEntity(boss.enemy, scaling, false);
  if (isTyrannical) {
    bossEntity.maxHealth *= 1.4;
    bossEntity.health = bossEntity.maxHealth;
    bossEntity.damage *= 1.15;
  }
  
  state.enemies.push(bossEntity);
  state.isInCombat = true;
  
  // Combat loop
  const tickRate = 1;
  let phaseIndex = 0;
  
  while (state.enemies.some(e => !e.isDead) && state.players.some(p => !p.isDead)) {
    // Check phase transitions
    if (boss.phases && phaseIndex < boss.phases.length) {
      const healthPercent = (bossEntity.health / bossEntity.maxHealth) * 100;
      const nextPhase = boss.phases[phaseIndex];
      
      if (healthPercent <= nextPhase.healthThreshold) {
        state.combatLog.push({
          timestamp: state.currentTime,
          type: 'phase',
          source: boss.enemy.name,
          target: '',
          message: `${boss.enemy.name} enters ${nextPhase.description}`
        });
        phaseIndex++;
      }
    }
    
    processCombatTick(state, tickRate);
    state.currentTime += tickRate;
    
    if (state.currentTime > 3600) break;
  }
  
  state.enemies = [];
  state.isInCombat = false;
}

// Main simulation function
export function simulateDungeonRun(
  team: Character[],
  route: DungeonRoute,
  keyLevel: number
): DungeonRunResult {
  const dungeon = SAMPLE_DUNGEON; // For now, just use the sample dungeon
  const scaling = calculateKeyScaling(keyLevel);
  // TODO: Implement dungeon affix selection
  const affixes: string[] = [];
  
  // Initialize simulation state
  const state: SimulationState = {
    players: team.map(createPlayerEntity),
    enemies: [],
    currentTime: 0,
    combatLog: [],
    forcesCleared: 0,
    currentPull: 1,
    isInCombat: false
  };
  
  // Log start
  state.combatLog.push({
    timestamp: 0,
    type: 'phase',
    source: '',
    target: '',
    message: `Starting ${dungeon.name} +${keyLevel} with affixes: ${affixes.join(', ')}`
  });
  
  // Execute route pulls
  for (const pull of route.pulls) {
    // Check if party wiped
    if (state.players.every(p => p.isDead)) {
      state.combatLog.push({
        timestamp: state.currentTime,
        type: 'death',
        source: '',
        target: '',
        message: '!!! PARTY WIPE !!!'
      });
      break;
    }
    
    // Get packs for this pull
    const packs = pull.packIds
      .map(id => dungeon.enemyPacks.find(p => p.id === id))
      .filter((p): p is EnemyPack => p !== undefined);
    
    // Combine into one mega-pull
    const combinedPack: EnemyPack = {
      id: `pull_${pull.pullNumber}`,
      enemies: packs.flatMap(p => p.enemies),
      position: packs[0]?.position || { x: 0, y: 0 },
      pullRadius: 0,
      totalForces: packs.reduce((sum, p) => sum + p.totalForces, 0),
      gate: pull.gate,
      difficulty: packs[0]?.difficulty || 1
    };
    
    simulatePull(state, combinedPack, dungeon, scaling, affixes);
    
    // Add travel time between pulls
    state.currentTime += 5;
  }
  
  // Fight bosses
  if (state.players.some(p => !p.isDead)) {
    for (const boss of dungeon.bosses) {
      if (state.players.every(p => p.isDead)) break;
      
      // Travel to boss
      state.currentTime += 10;
      
      simulateBoss(state, boss, scaling, affixes);
    }
  }
  
  // Calculate results
  const success = state.players.some(p => !p.isDead) && 
                  state.forcesCleared >= dungeon.requiredForces * 0.9;
  const deaths = state.players.filter(p => p.isDead).length;
  const upgradeLevel = success ? calculateTimerUpgrade(state.currentTime, dungeon.timeLimitSeconds) : 0;
  
  // Generate loot
  const loot = generateDungeonLoot(keyLevel, success, upgradeLevel, scaling.itemQuantity, scaling.itemRarity);
  const orbDrops = generateOrbDrops(keyLevel, success);
  const fragmentDrops = generateFragmentDrops(keyLevel, success, upgradeLevel, scaling.itemQuantity);
  
  // Calculate experience
  const experienceGained = success 
    ? Math.floor(1000 * scaling.rewardMultiplier * (1 + upgradeLevel * 0.25))
    : Math.floor(200 * scaling.rewardMultiplier);
  
  state.combatLog.push({
    timestamp: state.currentTime,
    type: 'phase',
    source: '',
    target: '',
    message: success 
      ? `=== DUNGEON COMPLETE! +${upgradeLevel} upgrade ===`
      : `=== DUNGEON FAILED ===`
  });
  
  return {
    success,
    keyLevel,
    timeElapsed: state.currentTime,
    timeLimit: dungeon.timeLimitSeconds,
    upgradeLevel,
    loot,
    orbDrops,
    fragmentDrops,
    experienceGained,
    deaths,
    forcesCleared: state.forcesCleared,
    forcesRequired: dungeon.requiredForces,
    combatLog: state.combatLog
  };
}

// Quick simulation without full combat (for testing)
export function quickSimulate(team: Character[], keyLevel: number): DungeonRunResult {
  // Create a simple route that pulls all packs
  const dungeon = SAMPLE_DUNGEON;
  const route: DungeonRoute = {
    id: 'auto',
    dungeonId: dungeon.id,
    name: 'Auto Route',
    author: 'System',
    pulls: dungeon.enemyPacks.map((pack, i) => ({
      pullNumber: i + 1,
      packIds: [pack.id],
      gate: pack.gate
    }))
  };
  
  return simulateDungeonRun(team, route, keyLevel);
}

