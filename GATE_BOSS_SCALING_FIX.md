# Gate Boss Scaling Fix

## Problem
Gate bosses (minibosses) were spawning with **72,900 HP**, making them unkillable within the dungeon time limit. The team was only dealing ~200-300 DPS, meaning it would take 4-5 minutes to kill the boss, but dungeons time out at 60 seconds.

## Root Cause
The enemy scaling system has two layers:

1. **Base Stats**: Small values (e.g., 3-4 for health) calculated from PoE monster data
2. **Type Multipliers**: Applied in `travel.ts` to scale enemies by type:
   - Normal: 15x health
   - Elite: 30x health
   - Miniboss: 150x health
   - Boss: 300x health

The previous fix manually set `baseHealth: 540` and `baseDamage: 3.6` for minibosses, which was **way too high** because:
- 540 × 150 (miniboss multiplier) = **81,000 HP**
- This was intended for when baseHealth was ~3-4, not 540!

## Solution
Reverted miniboss and boss `baseHealth` and `baseDamage` back to `0`, which triggers the automatic calculation system in `assignEnemyDefensiveStats()`:

```typescript
// src/types/dungeon.ts
{ id: 'bone_golem', name: 'Bone Golem', icon: React.createElement(GiShieldBash), 
  type: 'miniboss', 
  baseHealth: 0,  // ← Auto-calculated from PoE data
  baseDamage: 0,  // ← Auto-calculated from PoE data
  enemyForces: 0, dangerLevel: 5, abilities: [...] 
}
```

## Expected Values (Key Level +1)

### Miniboss (Danger Level 5)
- **Character Level**: 5
- **PoE Monster Stats**: Life = 31, Damage = 9.375
- **Type Multiplier**: Health 1.33x, Damage 1.5x
- **Base Stats**: Health = 41, Damage = 14
- **Final Stats** (after scaling):
  - Health = 41 × 0.9 (key level) × 150 (miniboss mult) = **~5,500 HP**
  - Damage = 14 × 0.9 × 1.5 × 1.3 = **~25 damage**

### Boss (Danger Level 5)
- **Type Multiplier**: Health 2.67x, Damage 2.0x
- **Base Stats**: Health = 83, Damage = 19
- **Final Stats** (after scaling):
  - Health = 83 × 0.9 × 300 = **~22,000 HP**
  - Damage = 19 × 0.9 × 2.0 × 1.3 = **~44 damage**

## Testing
With team DPS of ~200-300:
- **Miniboss**: 5,500 HP ÷ 250 DPS = **~22 seconds** ✅
- **Boss**: 22,000 HP ÷ 250 DPS = **~88 seconds** (challenging but doable)

## Files Changed
- `src/types/dungeon.ts`: Reverted `baseHealth` and `baseDamage` to 0 for minibosses and boss

## Related Systems
- `src/utils/monsterStats.ts`: Calculates base stats from PoE data
- `src/utils/enemyStats.ts`: Assigns defensive stats automatically
- `src/systems/combat/travel.ts`: Applies type multipliers (15x, 30x, 150x, 300x)



