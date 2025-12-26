# Comprehensive System Documentation
## DungeonGame - Complete Mechanics Deep Dive

**Last Updated:** December 26, 2025  
**Version:** 3.0  
**Author:** System Analysis

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Game Systems](#core-game-systems)
3. [Character System](#character-system)
4. [Combat System](#combat-system)
5. [Item & Crafting System](#item--crafting-system)
6. [Progression Systems](#progression-systems)
7. [Map & Dungeon System](#map--dungeon-system)
8. [Loot System](#loot-system)
9. [Performance & Optimization](#performance--optimization)
10. [Data Flow & State Management](#data-flow--state-management)

---

## Architecture Overview

### Technology Stack

**Frontend Framework:**
- **React 18.2** - Component-based UI
- **TypeScript 5.3** - Type-safe development
- **Vite 5.0** - Build tool and dev server
- **Framer Motion 12.23** - Animation library

**State Management:**
- **Zustand 4.4** with Immer middleware - Global state
- **Persist middleware** - LocalStorage persistence

**Audio:**
- **Howler.js 2.2** - Sound management

**Styling:**
- **Tailwind CSS 4.1** - Utility-first CSS
- **Custom CSS** - PoE-inspired theming

### Project Structure

```
src/
├── components/          # React components (UI)
│   ├── dungeon/        # Combat & dungeon UI
│   ├── gear/           # Equipment management
│   ├── maps/           # Map device & stash
│   ├── passives/       # Passive tree (deprecated)
│   ├── shared/         # Reusable components
│   ├── skills/         # Skill gem management
│   ├── stash/          # Inventory grid
│   ├── team/           # Character roster
│   └── ui/             # Core UI elements
├── systems/            # Game logic (no UI)
│   ├── combat/         # Combat calculations
│   ├── crafting.ts     # Item crafting
│   ├── equipmentStats.ts # Stat calculations
│   └── poeCrafting.ts  # PoE item generation
├── types/              # TypeScript definitions
│   ├── character.ts    # Character data
│   ├── items.ts        # Item data
│   ├── skills.ts       # Skill gems
│   ├── maps.ts         # Map system
│   └── poeItems.ts     # PoE item types
├── utils/              # Helper functions
│   ├── leveling.ts     # XP calculations
│   ├── combat.ts       # Combat helpers
│   └── lootFilter*.ts  # Filter engine
├── store/              # Zustand store
│   └── gameStore.ts    # Global state
└── data/               # Game data (JSON)
    ├── base_items.json # PoE base items
    ├── mods.json       # PoE affixes
    └── gems.json       # Skill gems
```

### Key Design Patterns

1. **Separation of Concerns:** UI components in `components/`, logic in `systems/`
2. **Type Safety:** Comprehensive TypeScript types in `types/`
3. **Immutable State:** Zustand with Immer for state updates
4. **Code Splitting:** Lazy loading for tab components
5. **Performance First:** Memoization, debouncing, and optimization utilities

---

## Core Game Systems

### State Management (gameStore.ts)

The entire game state is managed through Zustand with persistence:

```typescript
interface GameState {
  // Team Management
  team: Character[]                    // 5-character roster
  teamSlotAssignments: Record<number, string>  // Slot -> CharacterId
  selectedCharacterId: string | null
  
  // Inventory & Storage
  inventory: Item[]                    // Master item list
  stashTabs: StashTab[]               // 12 tabs, 24x24 grid each
  
  // Currency
  gold: number
  orbs: Record<OrbType, number>       // Crafting orbs
  
  // Skills
  ownedSkillGems: string[]
  ownedSupportGems: string[]
  
  // Map System (Endgame)
  mapStash: MapItem[]                 // All owned maps
  fragmentCounts: Record<string, number>
  mapDeviceMap: MapItem | null
  mapDeviceFragments: (Fragment | null)[]
  activatedMap: MapItem | null
  pendingLoot: LootDrop[]
  
  // Progression
  highestKeyCompleted: number
  highestMapTierCompleted: number
  dungeonHistory: DungeonRunResult[]
  
  // UI State
  activeTab: string
  volume: number
  lootFilter: LootFilterConfig | null
  lootFilterEnabled: boolean
}
```

**Key Features:**
- **Persistence:** Auto-saves to localStorage as `mythic-delve-save`
- **Migration:** Version system handles save file upgrades
- **Duplicate Prevention:** Built-in checks prevent item duplication bugs
- **Immer Integration:** Draft-based mutations for clean updates

---

## Character System

### Character Creation (character.ts)

Characters are created with **Path of Exile-inspired stat systems**:

#### Base Stats Structure

```typescript
interface BaseStats {
  // Core Attributes (PoE)
  strength: number        // +1 Life per 2 STR, +1% Melee Damage per 5 STR
  dexterity: number       // +2 Accuracy per DEX, +1% Evasion per 5 DEX
  intelligence: number    // +1 Mana per 2 INT, +1% ES per 5 INT
  
  // Resources
  life: number
  maxLife: number
  mana: number
  maxMana: number
  
  // Defenses
  armor: number           // Physical damage reduction
  evasion: number         // Chance to avoid attacks
  energyShield: number    // Secondary health pool
  
  // Regeneration
  lifeRegeneration: number          // % of max life per second
  manaRegeneration: number          // % of max mana per second (base 1.75%)
  energyShieldRechargeRate: number  // % of max ES per second (base 33.3%)
  energyShieldRechargeDelay: number // Seconds before recharge (base 2.0s)
  
  // Offense
  accuracy: number
  criticalStrikeChance: number      // Base 5%
  criticalStrikeMultiplier: number  // Base 150%
  increasedDamage: number           // Additive damage modifier
  
  // Resistances (capped at 75%)
  fireResistance: number
  coldResistance: number
  lightningResistance: number
  chaosResistance: number
  
  // Block & Suppression
  blockChance: number               // Physical attack block (cap 75%)
  spellBlockChance: number          // Spell block (cap 75%)
  spellSuppressionChance: number    // 50% spell damage reduction (cap 100%)
  
  // Speed
  increasedAttackSpeed: number
  increasedCastSpeed: number
  
  // Flat Added Spell Damage
  addedPhysicalSpellDamageMin/Max: number
  addedFireSpellDamageMin/Max: number
  addedColdSpellDamageMin/Max: number
  addedLightningSpellDamageMin/Max: number
  addedChaosSpellDamageMin/Max: number
}
```

#### Character Roles

Three core archetypes with distinct stat distributions:

1. **Tank**
   - High Strength (+3 per level)
   - Armor-focused defense
   - Block chance scaling (+0.3% per level, cap 75%)
   - +25 armor per level

2. **DPS**
   - High Dexterity (+3 per level)
   - Crit-focused offense
   - Evasion defense
   - +0.2% crit chance per level
   - +15 evasion per level

3. **Healer**
   - High Intelligence (+3 per level)
   - Energy Shield defense
   - Spell Suppression (+0.5% per level, cap 100%)
   - +8 armor per level

#### Character Classes

Characters can be assigned to one of **25+ classes** from the PoE passive tree system. Classes provide:
- **Stat Modifiers:** Bonus attributes, defenses, and offense
- **Defense Pool:** Armor, Evasion, or Energy Shield preference
- **Mitigation Types:** Block, dodge, spell suppression
- **Scaling:** Bonuses scale from 10% at level 1 to 100% at level 100

Example class (Juggernaut - Tank):
```typescript
{
  id: 'juggernaut',
  name: 'Juggernaut',
  defensePool: 'armor',
  statModifiers: {
    strength: 50,
    armor: 300,
    life: 100,
    blockChance: 10,
    fireResistance: 10,
    coldResistance: 10,
    lightningResistance: 10
  },
  mitigationTypes: ['block', 'armor']
}
```

### Leveling System (leveling.ts)

**Path of Exile Experience System** - exact replica of PoE's XP table:

#### XP Calculation

```typescript
// Base XP from monster
baseXP = 10 * (1.1 ^ monsterLevel) * typeMultiplier

// Type multipliers
normal: 1.0x
elite: 2.5x
miniboss: 5.0x
boss: 10.0x

// Level difference penalty
safeZone = floor(3 + playerLevel / 16)
effectiveDiff = max(|playerLevel - monsterLevel| - safeZone, 0)

// XP multiplier (levels 1-94)
xpMultiplier = max(
  ((playerLevel + 5) / (playerLevel + 5 + effectiveDiff^2.5))^1.5,
  0.01
)

// Additional penalties for level 95+
if (playerLevel >= 95) {
  level95Penalty = 1 / (1 + 0.1 * (playerLevel - 94))
  xp31Penalty = [1.0, 1.15, 1.32, 1.52, 1.75, 2.01][playerLevel - 95]
  xpMultiplier *= level95Penalty * (1 / xp31Penalty)
}

finalXP = baseXP * xpMultiplier
```

**Key Features:**
- Level cap: 100
- Safe zone prevents over-penalization
- Minimum 1% XP even with heavy penalties
- Exponential XP requirements (Level 99→100 requires 342,703,697 XP)

#### Level-Up Bonuses

**Per Level Gains:**
- **Attributes:** +2 to all, +3 to primary (role-dependent)
- **Life:** +12 base per level (PoE formula: 38 + (level-1) * 12)
- **Mana:** +6 base per level (PoE formula: 34 + (level-1) * 6)
- **Accuracy:** +2 base per level
- **Evasion:** +3 base per level

**Resistance Penalty:**
- At level 40: -30% to all resistances (permanent)

### Starter Items (gameStore.ts)

When a character is created, they receive a full set of **PoE-based starter items**:

**Generation Logic:**
1. **Defense Type Selection:** Based on class or role
   - Armor classes → Armor gear
   - Evasion classes → Evasion gear
   - ES classes → Energy Shield gear
   - Hybrid → Mixed defenses

2. **Weapon Selection:**
   - Casters → Staff or Wand
   - Ranged → Bow + Quiver
   - Melee → One-handed, Two-handed, or Dual Wield
   - Two-handed weapons prevent offhand

3. **Rarity Distribution:**
   - 11 items: All normal (white)
   - 1 item: Magic (blue) with 1-2 affixes

4. **Item Level:** Character level + 3 (for variety)

---

## Combat System

### Combat Flow (runDungeonCombat/)

The combat system is split into modular components:

```
main.ts              → Orchestrates combat flow
initialization.ts    → Sets up combat state
pullProcessor.ts     → Handles trash pulls
bossFight.ts         → Boss encounter logic
resultGenerator.ts   → Generates loot & results
wipeHandler.ts       → Handles party wipes
```

#### Combat Loop Structure

```typescript
1. Initialize Combat
   - Load team stats
   - Calculate total stats (base + equipment + talents)
   - Set up abilities with cooldowns
   - Apply map modifiers

2. Process Route Pulls
   For each pull:
     a. Travel Phase (movement time)
     b. Combat Phase
        - Tick-based simulation (0.1s ticks)
        - Player actions (skills, heals, taunts)
        - Enemy actions (attacks, abilities)
        - Apply buffs/debuffs
        - Check for deaths
     c. Recovery Phase (heal to full)
     
3. Boss Fight
   - Enhanced enemy with abilities
   - Phase transitions
   - Increased rewards
   
4. Generate Results
   - Calculate loot based on performance
   - Award experience to all characters
   - Drop maps, fragments, orbs
   - Apply death penalties if needed
```

### Damage Calculation (combat/playerCombat.ts)

#### Spell Damage

```typescript
// 1. Base damage from skill
baseDamage = random(skill.baseDamage, skill.baseDamageMax)

// 2. Apply damage effectiveness
effectiveDamage = baseDamage * (skill.damageEffectiveness / 100)

// 3. Add flat spell damage from gear
effectiveDamage += addedFireSpellDamageMin/Max (averaged)
effectiveDamage += addedColdSpellDamageMin/Max
// ... for each element

// 4. Apply support gem multipliers
// "Increased" modifiers (additive)
increasedTotal = 1.0 + sum(increasedModifiers)
// "More" modifiers (multiplicative)
moreTotal = product(moreModifiers)

damage = effectiveDamage * increasedTotal * moreTotal

// 5. Apply character's increased damage
damage *= (1 + character.increasedDamage / 100)

// 6. Apply talent bonuses (e.g., 20% more damage)
damage *= (1 + talentDamageMultiplier / 100)

// 7. Apply map modifiers (e.g., -7% player damage)
damage *= (1 - mapPlayerDamageReduction)

// 8. Critical strike check
if (random() < critChance / 100) {
  damage *= (critMultiplier / 100)
}

// 9. Apply level scaling (for melee skills)
if (skill.levelScaling) {
  levelScale = 0.4 + (level - 1) / 90 * 0.6  // 40% at L1, 100% at L90
  damage *= levelScale
}
```

#### Attack Damage (Weapon-Based)

```typescript
// 1. Get weapon damage
weaponDamage = {
  physicalMin/Max,
  fireMin/Max,
  coldMin/Max,
  lightningMin/Max,
  chaosMin/Max
}

// 2. Calculate average damage per element
for each element:
  avgDamage = (min + max) / 2

// 3. Apply damage effectiveness
effectiveDamage = avgDamage * (skill.damageEffectiveness / 100)

// 4. Apply support gems, character stats, talents (same as spells)

// 5. Sum all elemental damage types
totalDamage = physical + fire + cold + lightning + chaos

// 6. Apply attack speed for DPS calculation
dps = totalDamage * attackSpeed * (1 + increasedAttackSpeed / 100)
```

### Defense Mechanics

#### Armor (PoE Formula)

```typescript
// Physical damage reduction
reduction = armor / (armor + 25 * incomingDamage)
reduction = min(reduction, 0.90)  // Cap at 90%

damageMultiplier = 1 - reduction
finalDamage = incomingDamage * damageMultiplier

// Example: 2000 armor vs 500 damage
// reduction = 2000 / (2000 + 12500) = 13.8%
// finalDamage = 500 * 0.862 = 431 damage

// Armor is MORE effective vs small hits, LESS effective vs big hits
```

#### Evasion (PoE Formula)

```typescript
// Chance to evade
evasionFactor = (evasion / 4) ^ 0.8
chanceToHit = accuracy / (accuracy + evasionFactor)
chanceToEvade = 1 - chanceToHit

// Cap: 5% minimum hit chance (95% max evasion)
chanceToEvade = min(chanceToEvade, 0.95)

// Example: 1000 evasion vs 500 accuracy
// evasionFactor = (250) ^ 0.8 = 89.1
// chanceToHit = 500 / (500 + 89.1) = 85%
// chanceToEvade = 15%
```

#### Energy Shield

```typescript
// ES protects against ALL damage types
// Damage hits ES first, then life

if (energyShield > 0) {
  damageToES = min(incomingDamage, energyShield)
  damageToLife = max(0, incomingDamage - energyShield)
  energyShield -= damageToES
} else {
  damageToLife = incomingDamage
}

// ES Recharge
// After taking damage, ES doesn't recharge for 2 seconds (base)
// Then recharges at 33.3% of max ES per second (base)
if (timeSinceLastHit >= esRechargeDelay) {
  esRecharge = maxES * (esRechargeRate / 100) * deltaTime
  energyShield = min(energyShield + esRecharge, maxES)
}
```

#### Block

```typescript
// Block chance (capped at 75%)
if (random() < blockChance / 100) {
  // Blocked attacks deal 20% damage
  damage *= 0.20
}

// Spell Block (separate roll)
if (isSpell && random() < spellBlockChance / 100) {
  damage *= 0.20
}
```

#### Spell Suppression

```typescript
// Chance to suppress spell damage (capped at 100%)
if (isSpell && random() < spellSuppressionChance / 100) {
  // Suppressed spells deal 50% damage
  damage *= 0.50
}
```

#### Resistances

```typescript
// Elemental resistances (capped at 75%)
if (damageType === 'fire') {
  resistance = min(fireResistance, 75)
  damage *= (1 - resistance / 100)
}
// Same for cold, lightning, chaos

// Chaos resistance can go negative (harder to cap)
```

### Skill System (skills.ts)

**65+ Skills** across three roles:

#### Skill Properties

```typescript
interface SkillGem {
  baseDamage/baseHealing: number
  manaCost: number
  cooldown: number
  castTime: number
  
  // PoE-style mechanics
  damageEffectiveness: number    // 100 = 100%, affects added damage
  baseCriticalStrikeChance: number
  maxTargets?: number            // AoE target cap
  
  // Multi-hit mechanics
  chainCount?: number            // Chains to N additional targets
  chainDamageBonus?: number      // +X% more damage per chain remaining
  projectileCount?: number       // Fires N projectiles
  hitCount?: number              // Hits N times per cast
  pierceCount?: number           // Pierces N enemies
  
  // Channeling
  isChanneled?: boolean
  channelTickRate?: number       // Time between ticks
  channelDuration?: number       // Max duration (0 = until cancelled)
  manaPerTick?: number           // Mana drain per tick
  channelRampUp?: number         // % more damage per second
  maxChannelStacks?: number      // Max ramp-up stacks
  
  // Support compatibility
  supportTags: string[]          // Tags for support gem matching
  maxSupportSlots: number        // Max supports (1-5)
}
```

#### Support Gems

**10+ Support Gems** that modify skills:

```typescript
interface SupportGem {
  requiredTags: string[]         // Must match skill tags
  
  multipliers: {
    stat: string                 // 'damage', 'castTime', 'critChance'
    multiplier: number           // 1.3 = 30% more
    isMore: boolean              // true = multiplicative, false = additive
  }[]
  
  addedEffects: SkillEffect[]    // Additional effects
  manaCostMultiplier?: number    // Mana cost modifier
  cooldownMultiplier?: number    // Cooldown modifier
}
```

**Examples:**
- **Faster Casting:** 30% more cast speed, +15% mana cost
- **Spell Echo:** Repeat once, 20% less damage per repeat, +40% mana
- **Greater Multiple Projectiles:** +4 projectiles, 26% less damage, +50% mana
- **Controlled Destruction:** 44% more spell damage, 50% less crit chance
- **Lifetap:** Skills cost life instead of mana, 20% more damage

#### Skill Usage AI

Characters automatically use skills based on **smart usage configs**:

```typescript
interface SkillUsageConfig {
  priority: number               // Higher = used first
  targetType: 'self' | 'ally' | 'enemy' | 'allAllies' | 'allEnemies'
  
  conditions: {
    healthThreshold?: number     // Use when target HP < X%
    manaThreshold?: number       // Use when mana > X%
    cooldownReady?: boolean      // Wait for cooldown
    enemyCount?: number          // Use when enemies >= X
    allyNeedsHealing?: boolean   // For heals
  }
}
```

**Default Behaviors:**
- **Tanks:** Taunt on cooldown, use AoE for packs, single-target for bosses
- **Healers:** Heal lowest HP ally, use AoE heal when multiple injured
- **DPS:** Use AoE for 3+ enemies, single-target for bosses, maintain DoTs

---

## Item & Crafting System

### Item Generation (poeCrafting.ts)

The game uses **real Path of Exile base items and affixes**:

#### Item Structure

```typescript
interface PoeItem {
  id: string
  baseItem: PoeBaseItem          // From PoE data
  rarity: 'normal' | 'magic' | 'rare' | 'unique'
  itemLevel: number              // Affects which affixes can roll
  
  implicits: RolledAffix[]       // Built-in mods (from base)
  prefixes: RolledAffix[]        // Up to 3 prefixes
  suffixes: RolledAffix[]        // Up to 3 suffixes
  
  corrupted: boolean
  quality: number                // 0-20%
}

interface RolledAffix {
  affixId: string
  tier: number
  stats: RolledStat[]
}

interface RolledStat {
  statId: string                 // PoE stat ID
  text: string                   // Display text
  value: number | [number, number]  // Rolled value(s)
}
```

#### Affix Rolling

```typescript
// 1. Select affix pool based on item class and level
availableAffixes = affixes.filter(a => 
  a.spawnWeights[itemClass] > 0 &&
  a.levelRequirement <= itemLevel
)

// 2. Weight-based selection
totalWeight = sum(affix.spawnWeights[itemClass])
roll = random() * totalWeight
selectedAffix = /* weighted random */

// 3. Roll tier based on item level
availableTiers = affix.tiers.filter(t => t.requiredLevel <= itemLevel)
selectedTier = max(availableTiers)  // Always best tier available

// 4. Roll values within tier range
for each stat in tier:
  if (stat.min === stat.max):
    value = stat.min
  else:
    value = random(stat.min, stat.max)
```

#### Rarity Distribution

**Normal (White):** No affixes, clean base
**Magic (Blue):** 1-2 affixes (1 prefix, 1 suffix max)
**Rare (Yellow):** 3-6 affixes (3 prefix, 3 suffix max)
**Unique (Orange):** Fixed affixes, special effects

### Crafting Orbs (crafting.ts)

**10 Crafting Orbs** modify items:

| Orb | Effect | Cost |
|-----|--------|------|
| **Transmutation** | Normal → Magic | Common |
| **Alteration** | Reroll magic affixes | Common |
| **Augmentation** | Add affix to magic (if space) | Uncommon |
| **Alchemy** | Normal → Rare | Uncommon |
| **Chaos** | Reroll rare affixes | Rare |
| **Exalted** | Add affix to rare (if space) | Very Rare |
| **Annulment** | Remove random affix | Rare |
| **Scouring** | Remove all affixes → Normal | Uncommon |
| **Regal** | Magic → Rare, keep mods, add 1 | Rare |
| **Divine** | Reroll affix values | Rare |

#### Crafting Strategy

**Basic Crafting:**
1. Use **Transmutation** on white item → magic
2. Use **Alteration** to reroll until desired prefix/suffix
3. Use **Augmentation** to fill second affix slot
4. Use **Regal** to upgrade to rare (keeps mods, adds 1)
5. Use **Exalted** to add more affixes (if lucky)

**Advanced Crafting:**
1. Use **Alchemy** on white item → rare (3-6 mods)
2. Use **Chaos** to reroll until good base mods
3. Use **Annulment** to remove bad mods (risky!)
4. Use **Exalted** to add specific mods
5. Use **Divine** to perfect roll values

### Equipment Stats (equipmentStats.ts)

Equipment bonuses are calculated by parsing **PoE stat text**:

```typescript
// Example stat parsing
"+50 to maximum Life" → life: +50
"+15% to Fire Resistance" → fireResistance: +15
"Adds 10 to 20 Fire Damage to Spells" → addedFireSpellDamageMin: +10, Max: +20
"10% increased Spell Damage" → increasedDamage: +10
```

**Stat Aggregation:**
1. Parse all implicits, prefixes, suffixes
2. Sum flat bonuses (life, resistances, attributes)
3. Apply attribute-derived stats:
   - +1 Life per 2 STR from equipment
   - +1 Mana per 2 INT from equipment
   - +2 Accuracy per DEX from equipment
4. Apply talent bonuses
5. Cap resistances at 75%, block at 75%

---

## Progression Systems

### Talent System (talents.ts)

**MoP-style talent trees** with 7 tiers (every 15 levels):

```typescript
interface TalentTier {
  tierLevel: 15 | 30 | 45 | 60 | 75 | 90 | 100
  talents: Talent[]              // 3-4 choices per tier
}

interface Talent {
  id: string
  name: string
  description: string
  icon: string
  
  effects: TalentEffect[]
}

interface TalentEffect {
  type: 'stat' | 'ability' | 'passive'
  stat?: keyof BaseStats
  value: number
  isMultiplier?: boolean         // % increase vs flat
}
```

**Example Talents:**

**Tier 15 (Tank):**
- **Iron Skin:** +20% armor
- **Shield Master:** +5% block chance
- **Fortified:** +10% max life

**Tier 30 (Healer):**
- **Efficient Healing:** -20% heal mana cost
- **Overhealing:** Heals grant 50% overheal as shield
- **Triage:** +30% healing on targets below 50% HP

**Tier 45 (DPS):**
- **Critical Focus:** +50% crit chance
- **Elemental Mastery:** +20% elemental damage
- **Rapid Fire:** +15% cast/attack speed

### Passive Tree (DEPRECATED)

The old PoE-style passive tree is deprecated in favor of talents. Legacy characters may still have allocated passives, but new characters use talents only.

---

## Map & Dungeon System

### Map System (maps.ts)

**Endgame progression** through an infinite map system:

#### Map Structure

```typescript
interface MapItem {
  id: string
  baseId: string                 // Map layout/boss
  tier: number                   // 1-16+ (infinite scaling)
  rarity: 'normal' | 'magic' | 'rare' | 'corrupted'
  affixes: MapAffix[]            // Difficulty modifiers
  
  // Aggregate bonuses
  quantityBonus: number          // +X% item quantity
  rarityBonus: number            // +X% item rarity
  packSize: number               // +X% monster pack size
  
  corrupted: boolean
  itemLevel: number
}
```

#### Map Affixes

**15+ Affixes** that modify difficulty and rewards:

| Affix | Effect | Quantity | Rarity | Difficulty |
|-------|--------|----------|--------|------------|
| **Bountiful** | More items | +10% | 0% | 1.0x |
| **Enriched** | Better items | +2.5% | +12.5% | 1.0x |
| **Deadly** | +12% monster damage | +7.5% | +5% | 1.125x |
| **Massive** | +15% monster life | +9% | +4% | 1.15x |
| **Swift** | +10% monster speed | +6% | +3% | 1.10x |
| **Twinned** | 2 bosses! | +100% | +100% | 1.5x |

**Affix Limits:**
- **Normal:** 0 affixes
- **Magic:** 1-2 affixes
- **Rare:** 3-6 affixes
- **Corrupted:** 4-7 affixes

#### Map Device

**6-slot device** for activating maps:

```typescript
// 1 Map slot + 6 Fragment slots
mapDevice = {
  map: MapItem | null
  fragments: [Fragment | null] × 6
}

// Fragments boost rewards
totalQuantity = map.quantityBonus + sum(fragment.quantityBonus)
totalRarity = map.rarityBonus + sum(fragment.rarityBonus)
```

**Fragments:**
- **The Sixth Fragment:** +15% quantity, +15% rarity
- **The Fragment That Remembers:** +15% quantity, +15% rarity
- **The Broken Constant:** +20% quantity, +20% rarity
- **The Uncounted Shard:** +20% quantity, +20% rarity
- **The Final Partial:** +25% quantity, +25% rarity

#### Map Progression

**Tier Scaling:**
- **Tier 1:** Level 2 monsters, 4 starter maps
- **Tier 2+:** Level = tier, drops from previous tier
- **Tier 16+:** Infinite scaling

**Map Drops:**
- **Normal Monsters:** 2% chance
- **Elite Monsters:** 2% chance
- **Minibosses:** 25% chance
- **Final Boss:** 100% chance

**Drop Tier:**
- Base: Current tier (minimum tier 2)
- 50% chance: +1 tier
- Boss only: 20% chance for +2 tiers
- Cap: Highest completed + 1

### Dungeon Combat (runDungeonCombat/)

**Tick-based simulation** (0.1s ticks):

```typescript
// Combat loop
while (enemiesAlive && teamAlive && !timeout) {
  // 1. Player actions
  for each character:
    if (canAct(character)):
      selectSkill(character)
      executeSkill(character, skill, targets)
      updateCooldowns(character)
  
  // 2. Enemy actions
  for each enemy:
    if (canAct(enemy)):
      selectTarget(enemy)
      executeAttack(enemy, target)
  
  // 3. Apply DoTs, buffs, debuffs
  processDamageOverTime()
  processBuffs()
  processDebuffs()
  
  // 4. Check for deaths
  checkDeaths()
  
  // 5. Regeneration
  processRegeneration()
  
  // 6. Advance time
  currentTick += 1
  timeElapsed += 0.1
}
```

**Boss Mechanics:**
- **Phase Transitions:** At 75%, 50%, 25% HP
- **Special Abilities:** Unique attacks per boss
- **Enrage Timer:** Increases damage over time
- **Twin Boss:** Twinned affix spawns 2 bosses

---

## Loot System

### Loot Generation (crafting.ts)

#### Real-Time Drops

**Loot drops during combat** when enemies die:

```typescript
// Drop rates per enemy type
itemDropChance = {
  normal: 5%,
  elite: 25%,
  miniboss: 50%,
  boss: 80%
}

orbDropChance = {
  normal: 4%,
  elite: 20%,
  miniboss: 40%,
  boss: 70%
}

mapDropChance = {
  normal: 2%,
  elite: 2%,
  miniboss: 25%,
  boss: 100%
}

fragmentDropChance = {
  normal: 0.05%,
  elite: 0.375%,
  miniboss: 2%,
  boss: 6.25%
}
```

**Item Level:**
- Normal monsters: Map tier
- Elite monsters: Map tier + 1
- Miniboss/Boss: Map tier + 2
- Cap: 86 (PoE max)

**Rarity Distribution:**
```typescript
// Base rates (modified by map rarity bonus)
normalChance = 60% - rarityBonus
magicChance = 30% + rarityBonus * 0.3
rareChance = 10% + rarityBonus * 0.7
```

#### Currency Drops

**PoE-accurate currency rates** (10x boosted for gameplay):

| Currency | Base Rate | Boosted Rate |
|----------|-----------|--------------|
| Transmutation | 20.83% | 20.83% |
| Augmentation | 10.33% | 10.33% |
| Alteration | 5.51% | 5.51% |
| Alchemy | 2.75% | **27.54%** |
| Chaos | 1.65% | **16.52%** |
| Scouring | 1.38% | **13.77%** |
| Regal | 0.21% | **2.07%** |
| Exalted | 0.06% | **0.55%** |
| Annulment | 0.06% | **0.55%** |
| Divine | 0.03% | **0.34%** |

### Loot Filter (lootFilter.ts)

**PoE-style loot filter** for customizing item visibility:

```typescript
interface FilterRule {
  action: 'Show' | 'Hide'
  
  conditions: {
    rarity?: string[]            // 'Normal', 'Magic', 'Rare', 'Unique'
    baseType?: string[]          // Base item names
    itemClass?: string[]         // Item classes
    itemLevel?: { min?, max? }
    sockets?: { min?, max? }
    mapTier?: { min?, max? }
  }
  
  style: {
    fontSize?: number
    textColor?: string           // rgba(r,g,b,a)
    borderColor?: string
    backgroundColor?: string
    playAlertSound?: { id: number, volume: number }
    playEffect?: string          // 'Red', 'Blue', 'Green'
    minimapIcon?: { size, color, shape }
  }
}
```

**Filter Engine:**
1. Evaluate rules in order (priority)
2. First matching rule applies
3. Apply visual styling
4. Play sound effects (Howler.js)
5. Show/hide based on action

**Sound Tiers:**
- **Common:** White/normal items
- **Uncommon:** Blue/magic items
- **Rare:** Yellow/rare items
- **Epic:** High ilvl rares
- **Legendary:** Unique items

---

## Performance & Optimization

### Performance Monitoring (performanceMonitor.ts)

**Built-in performance tracking:**

```typescript
interface PerformanceMetrics {
  fps: number                    // Current FPS
  avgFps: number                 // Average FPS
  memoryUsage: number            // MB used
  renderTime: number             // ms per frame
  
  // Component timings
  componentRenderTimes: Map<string, number>
  
  // Warnings
  warnings: PerformanceWarning[]
}
```

**Optimization Techniques:**

1. **Code Splitting:**
   - Lazy load tab components
   - Dynamic imports for heavy systems
   - Reduce initial bundle size

2. **Memoization:**
   - `React.memo()` for expensive components
   - `useMemo()` for heavy calculations
   - `useCallback()` for stable functions

3. **Animation Optimization:**
   - Framer Motion with `layoutId` for smooth transitions
   - CSS transforms over position changes
   - `will-change` hints for GPU acceleration

4. **Asset Optimization:**
   - Compressed PNGs (compressPngs.mjs)
   - WebP for portraits
   - Lazy image loading

5. **State Updates:**
   - Immer for efficient immutable updates
   - Batch updates where possible
   - Debounce frequent updates

### Sound System (lootSoundsHowler.ts)

**Howler.js integration** for audio:

```typescript
// Preload sounds
preloadLootSounds() {
  sounds = {
    common: new Howl({ src: ['common.wav'] }),
    uncommon: new Howl({ src: ['uncommon.wav'] }),
    rare: new Howl({ src: ['rare.wav'] }),
    epic: new Howl({ src: ['epic.wav'] }),
    legendary: new Howl({ src: ['legendary.wav'] }),
    fragment: new Howl({ src: ['fragment.wav'] })
  }
}

// Play with volume control
playLootSound(tier: string, volume: number) {
  sounds[tier].volume(volume)
  sounds[tier].play()
}
```

---

## Data Flow & State Management

### State Update Flow

```
User Action (UI)
  ↓
Component Handler
  ↓
Zustand Action (gameStore.ts)
  ↓
Immer Draft Mutation
  ↓
State Update
  ↓
Persist to LocalStorage
  ↓
Re-render Components (React)
```

### Key State Patterns

**1. Equipment Management:**
```typescript
// Equip item
equipItem(characterId, slot, itemId) {
  1. Find character and item
  2. Validate equipment (two-handed, requirements)
  3. Auto-unequip conflicting items
  4. Remove item from stash
  5. Equip to character
  6. Place unequipped item in stash
}
```

**2. Stash Management:**
```typescript
// Add item to stash
addItemToStash(tabId, itemId, x, y) {
  1. Check for duplicates (prevent duplication bug)
  2. Get item grid size
  3. Build occupancy grid
  4. Check if position is valid
  5. Place item at position
}
```

**3. Combat State:**
```typescript
// Combat state is separate from main store
combatState = {
  phase: 'idle' | 'combat' | 'victory' | 'defeat'
  teamStates: TeamMemberState[]
  enemies: Enemy[]
  combatLog: LogEntry[]
  timeElapsed: number
  lootDrops: LootDrop[]
}

// Updated via callbacks during combat
updateCombatState(updater: (prev) => next)
```

**4. Map Activation:**
```typescript
// Activate map
activateMap() {
  1. Calculate fragment bonuses
  2. Store activated map with combined bonuses
  3. Clear map device
  4. Consume fragments
  5. Generate dungeon with modifiers
}
```

### Data Persistence

**LocalStorage Schema:**
```json
{
  "mythic-delve-save": {
    "state": {
      "team": [...],
      "inventory": [...],
      "stashTabs": [...],
      "mapStash": [...],
      "orbs": {...},
      // ... all game state
    },
    "version": 3
  }
}
```

**Migration System:**
```typescript
// Version 1 → 2: Stash grid system
// Version 2 → 3: Map system
migrate(persistedState, version) {
  if (version < 2) {
    // Convert old stash to grid
  }
  if (version < 3) {
    // Add map system fields
  }
  // Always run duplicate removal
  removeDuplicateItems()
}
```

---

## Appendix: Key Formulas Reference

### Character Stats

```typescript
// Life
baseLife = 38 + (level - 1) * 12
lifeFromStrength = floor(strength / 2)
totalLife = baseLife + lifeFromStrength + equipment + talents

// Mana
baseMana = 34 + (level - 1) * 6
manaFromIntelligence = floor(intelligence / 2)
totalMana = baseMana + manaFromIntelligence + equipment + talents

// Accuracy
baseAccuracy = 100 + (level - 1) * 2
accuracyFromDexterity = dexterity * 2
totalAccuracy = baseAccuracy + accuracyFromDexterity + equipment

// Evasion
baseEvasion = 50 + (level - 1) * 3
evasionBonus = baseEvasion * (dexterity * 0.002)
totalEvasion = baseEvasion + evasionBonus + equipment

// Energy Shield
esMultiplier = 1 + (intelligence * 0.002)
totalES = baseES * esMultiplier + equipment
```

### Combat Formulas

```typescript
// Armor Reduction
reduction = armor / (armor + 25 * damage)
reduction = min(reduction, 0.90)
damageMultiplier = 1 - reduction

// Evasion Chance
evasionFactor = (evasion / 4) ^ 0.8
chanceToHit = accuracy / (accuracy + evasionFactor)
chanceToEvade = min(1 - chanceToHit, 0.95)

// Critical Strike
finalCritChance = baseCritChance * (1 + increasedCrit / 100)
if (crit) damage *= (critMultiplier / 100)

// Damage Calculation
damage = baseDamage * effectiveness * (1 + increased) * product(more)
damage *= (1 + characterIncreasedDamage / 100)
damage *= (1 + talentMultiplier / 100)
damage *= (1 - mapPenalty)
```

### Experience Formula

```typescript
// Base XP
baseXP = 10 * (1.1 ^ monsterLevel) * typeMultiplier

// Level Penalty
safeZone = floor(3 + playerLevel / 16)
effectiveDiff = max(abs(playerLevel - monsterLevel) - safeZone, 0)

// XP Multiplier (< 95)
xpMult = max(
  ((playerLevel + 5) / (playerLevel + 5 + effectiveDiff^2.5))^1.5,
  0.01
)

// XP Multiplier (>= 95)
level95Penalty = 1 / (1 + 0.1 * (playerLevel - 94))
xp31Penalty = [1.0, 1.15, 1.32, 1.52, 1.75, 2.01][playerLevel - 95]
xpMult *= level95Penalty * (1 / xp31Penalty)

// Final XP
finalXP = baseXP * xpMult
```

---

## Conclusion

This document provides a comprehensive overview of all game mechanics, calculations, and systems in DungeonGame. The game is heavily inspired by Path of Exile's systems, with:

- **PoE-accurate stat calculations** (armor, evasion, ES, resistances)
- **Real PoE base items and affixes** (from PoE data files)
- **PoE experience system** (exact XP table and penalties)
- **PoE-style crafting** (10 orb types with accurate behavior)
- **Infinite map scaling** (PoE's endgame map system)
- **Loot filter system** (PoE-style filter rules and sounds)

The codebase is well-structured with clear separation between UI (`components/`), logic (`systems/`), and data (`types/`, `data/`). State management is handled through Zustand with persistence, and the combat system uses a tick-based simulation for deterministic results.

For future reference, this document should be updated when:
- New systems are added (e.g., league mechanics, crafting bench)
- Major balance changes occur
- New character classes or skills are implemented
- Core formulas are modified

**Last Updated:** December 26, 2025  
**Version:** 3.0


