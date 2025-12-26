# Healer effectContext Fix

## Problem

The healer AI was not properly maintaining HoT effects (like Rejuvenation) on allies because the `effectContext` was missing from the skill condition checking logic.

### Issues Identified

1. **Missing effectContext**: The healer combat logic didn't build the `effectContext` needed for `effectApplication` conditions to work
2. **Rejuvenation not refreshing**: Without `effectContext`, the healer couldn't check "how many allies have Rejuvenation" and wouldn't maintain it proactively
3. **Priority issues**: Rejuvenation (priority 10) was always selected over Healing Wave (priority 5) when both conditions were met

### Root Cause

In `src/systems/combat/playerCombat.ts`, the `conditionContext` object passed to `checkSkillConditions()` was missing the `effectContext` property:

```typescript
// OLD CODE - Missing effectContext
const conditionContext = {
  enemyCount: 0,
  enemyTypes: [] as ('normal' | 'elite' | 'miniboss' | 'boss')[],
  selfHealthPercent: ...,
  // ... other properties
  inCombat: true
  // effectContext was missing!
};
```

This meant that when a skill had `effectApplication.enabled: true`, the condition check would fail because `context.effectContext` was `undefined`.

## Solution

Added logic to build the `effectContext` for each skill during the filtering phase:

### For Healers (HoT effects)

```typescript
// Build effectContext for this specific skill if effectApplication is enabled
let effectContext = undefined;
if (config.effectApplication?.enabled) {
  if (skill.id === 'rejuvenation' || skill.effects?.some((e: any) => e.type === 'hot')) {
    // Count allies with Rejuvenation HoT
    const alliesWithRejuv = aliveTeam.filter(m => m.hasRejuv).length;
    effectContext = {
      alliesWithEffect: alliesWithRejuv,
      totalAllies: aliveTeam.length,
      enemiesWithEffect: 0,
      totalEnemies: 0
    };
  }
}

return checkSkillConditions(config, { ...conditionContext, effectContext });
```

### For DPS (DOT effects)

```typescript
// Build effectContext for this specific skill if effectApplication is enabled
let effectContext = undefined;
if (config.effectApplication?.enabled) {
  // For DOT effects, count enemies with the effect
  if (skill.effects?.some((e: any) => e.type === 'dot')) {
    const dotName = skill.name;
    const enemiesWithDot = tickAliveEnemies.filter(e => 
      e.dotEffects?.some(dot => dot.name === dotName)
    ).length;
    effectContext = {
      enemiesWithEffect: enemiesWithDot,
      totalEnemies: tickAliveEnemies.length,
      alliesWithEffect: 0,
      totalAllies: 0
    };
  }
}

return checkSkillConditions(config, { ...conditionContext, effectContext });
```

## Impact

With this fix, the `effectApplication` conditions now work properly:

### Example: Rejuvenation Configuration
```json
{
  "effectApplication": {
    "enabled": true,
    "targetGroup": "allies",
    "operator": "less_than",
    "count": 5,
    "prioritizeWithout": true
  }
}
```

**Before Fix**: This condition was always skipped (effectContext was undefined)
**After Fix**: The healer will cast Rejuvenation when fewer than 5 allies have it, prioritizing those without it

### Benefits

1. **Proactive HoT maintenance**: Healers will now properly maintain Rejuvenation on multiple allies
2. **Better skill prioritization**: The `effectApplication` condition can now influence which skill gets selected
3. **DOT management**: DPS can now properly manage DOT effects on enemies
4. **Configurable behavior**: Players can use `effectApplication` settings to control when HoTs/DOTs are cast

## Testing Recommendations

1. Test with Rejuvenation configured with `effectApplication.enabled: true` and `count: 5`
2. Verify that the healer maintains Rejuvenation on multiple allies
3. Test priority interactions between Rejuvenation and Healing Wave
4. Test DOT effects for DPS classes with `effectApplication` enabled

## Related Files

- `src/systems/combat/playerCombat.ts` - Main fix location
- `src/types/skillUsage.ts` - Interface definitions for `EffectApplicationContext`
- `src/systems/combat/buffs.ts` - Where `hasRejuv` is calculated from active HoT effects


