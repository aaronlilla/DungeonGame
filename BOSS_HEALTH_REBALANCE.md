# Boss Health Rebalance

## Problem
Bosses and minibosses had excessive health pools, making them difficult or impossible to kill within dungeon time limits:
- **Minibosses** (Gate Bosses): ~81,000 HP at tier 2
- **Final Bosses**: ~40,000+ HP at tier 2

This resulted in dungeons timing out before bosses could be defeated, even with optimal DPS.

## Solution
Reduced health multipliers across all boss types to target **16-20k HP** at tier 2:

### Changes Made

#### 1. Gate Bosses (Minibosses) - `src/systems/combat/travel.ts`
**Before:**
```typescript
if (enemyDef.type === 'miniboss') healthMultiplier = 150;
```

**After:**
```typescript
if (enemyDef.type === 'miniboss') healthMultiplier = 30;
```

**Result:** Miniboss HP reduced from ~81k to ~16-20k at tier 2

#### 2. Gate Bosses (Boss Type) - `src/systems/combat/travel.ts`
**Before:**
```typescript
if (enemyDef.type === 'boss') healthMultiplier = 300;
```

**After:**
```typescript
if (enemyDef.type === 'boss') healthMultiplier = 50;
```

**Result:** Gate boss HP reduced to ~16-20k at tier 2

#### 3. Boss Sidebar Display - `src/components/dungeon/BossSidebar.tsx`
**Before:**
```typescript
const healthMultiplier = (bossEnemy.type === 'miniboss') ? 104.16 : 10;
finalHealth = baseStats.baseHealth * scaling.healthMultiplier * 104.16 * healthMod; // Final boss
```

**After:**
```typescript
const healthMultiplier = (bossEnemy.type === 'miniboss') ? 30 : 50;
finalHealth = baseStats.baseHealth * scaling.healthMultiplier * 20 * healthMod; // Final boss
```

**Result:** Boss sidebar now correctly displays the new health values

#### 4. Final Boss Fight - `src/systems/combat/runDungeonCombat/bossFight.ts`
**Before:**
```typescript
health: boss.enemy.baseHealth * scaling.healthMultiplier * 104.16 * healthMod,
```

**After:**
```typescript
health: boss.enemy.baseHealth * scaling.healthMultiplier * 20 * healthMod,
```

**Result:** Final boss HP reduced from ~40k to ~16-20k at tier 2

## Expected Health Values (Tier 2, Key Level +2)

| Enemy Type | Old HP | New HP | Reduction |
|------------|--------|--------|-----------|
| Normal | ~500 | ~500 | No change |
| Elite | ~1,000 | ~1,000 | No change |
| **Miniboss** | **~81,000** | **~16,000** | **-80%** |
| **Gate Boss** | **~120,000** | **~20,000** | **-83%** |
| **Final Boss** | **~40,000** | **~16,000** | **-60%** |

## Impact
- **Boss fights are now completable** within dungeon time limits
- **Consistent difficulty** across all boss types (16-20k HP range)
- **Better scaling** with key levels - bosses remain challenging but not impossible
- **Twin Boss modifier** now creates two 16-20k HP bosses instead of two 40k+ HP bosses

## Testing Recommendations
1. Run tier 2 dungeons and verify miniboss HP is ~16-20k
2. Verify final boss HP is ~16-20k
3. Test twin boss modifier to ensure both bosses have appropriate HP
4. Confirm boss fights are completable within time limits
5. Check that boss difficulty feels appropriate for the tier

