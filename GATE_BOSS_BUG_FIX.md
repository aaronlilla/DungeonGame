# Gate Boss Combat Hang Bug Fix

## Issue Description

Combat would hang when encountering gate bosses (minibosses), showing the boss announcement but never starting combat. The dungeon would immediately fail with a "wipe" status despite no combat occurring and the team being at full health.

### Example from Combat Log
```json
{
  "timestamp": 35,
  "type": "boss",
  "message": "👑 GATE BOSS: Zha'karoth, The Fold Between Stars (1 enemies)!"
}
// Combat log ends here - no combat actions occurred
```

### Result
- `success: false`
- `failReason: "wipe"`
- `deaths: 0`
- `forcesCleared: 62/225`
- Team at full health

## Root Cause

The miniboss and final boss enemy definitions in `src/types/dungeon.ts` had **`baseHealth: 0` and `baseDamage: 0`**:

```typescript
{ 
  id: 'bone_golem', 
  name: 'Bone Golem', 
  type: 'miniboss', 
  baseHealth: 0,  // ❌ BUG: 0 health
  baseDamage: 0,  // ❌ BUG: 0 damage
  // ...
}
```

### Why This Caused the Hang

1. When `createPullEnemies()` creates the gate boss enemy, it calculates:
   ```typescript
   health: enemyDef.baseHealth * scaling.healthMultiplier
   // 0 * any_multiplier = 0
   ```

2. The enemy is created with `health: 0` and `maxHealth: 0`

3. The combat loop condition checks:
   ```typescript
   while ((currentEnemies.some(e => e.health > 0) || queuedEnemies.length > 0) && ...)
   ```

4. Since the boss has 0 health, it's considered dead before combat starts

5. The loop never executes, combat ends immediately, triggering wipe detection

## Solution

Fixed by assigning proper base stats to all miniboss and boss enemies:

### Minibosses (Gate Bosses)
- `baseHealth: 540` (~3x elite HP)
- `baseDamage: 3.6` (~1.5x elite damage)

### Final Boss
- `baseHealth: 900` (~5x elite HP)  
- `baseDamage: 4.8` (~2x elite damage)

These base values are then scaled by key level multipliers to create appropriately challenging encounters.

## Affected Enemies

### Fixed Minibosses
- `bone_golem` (Gate 1 Boss)
- `death_knight` (Gate 2 Boss)
- `lich` (unused gate boss)

### Fixed Final Boss
- `necromancer_lord`

## Testing

After the fix:
1. Gate boss encounters should start combat normally
2. Boss should have scaled HP based on key level
3. Combat should progress with boss abilities executing
4. No more instant "wipe" failures on boss pulls

## Files Modified

- `src/types/dungeon.ts` - Updated enemy definitions with proper base stats



