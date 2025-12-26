# Tank Targeting Fix - Null Templar Death Analysis

## Problem Summary

Null Templar (and tanks in general) were dying extremely fast due to **two critical issues**:

### Issue 1: Enemy Targeting Logic (FIXED)

**Root Cause:** Casters and Archers were completely ignoring the tank and targeting random party members.

**Evidence from Combat Log:**
```
- Dark Sorcerer hits Kai Thunderstrike (not tank)
- Tomb Smasher hits Kai Thunderstrike (not tank)
- Shadow Assassins spread damage across Gareth, High Cleric, Cedric, Kai
- Tank (Null Templar) barely gets hit
```

**The Bug:**
- `processMeleeAttack()`: ✅ Correctly targets tank first
- `processCasterAttack()`: ❌ Random target from all alive members
- `processArcherAttack()`: ❌ Random target from all alive members
- `processTankbusterAttack()`: ✅ Correctly targets tank

**Fix Applied:**
```typescript
// Casters: 70% chance to target tank, 30% random
const tank = targetPool.find(m => m.role === 'tank');
const shouldTargetTank = tank && Math.random() < 0.7;
const casterTarget = shouldTargetTank ? tank : targetPool[Math.floor(Math.random() * targetPool.length)];

// Archers: 60% chance to target tank, 40% random
const shouldTargetTank = tank && Math.random() < 0.6;
const target = shouldTargetTank ? tank : targetPool[Math.floor(Math.random() * targetPool.length)];
```

**Why Not 100% Tank Targeting?**
- Maintains some challenge and unpredictability
- Prevents tanks from being the ONLY target (unrealistic)
- Allows for occasional "threat breaks" where DPS/healers need to survive
- Casters get higher tank priority (70%) than archers (60%) for balance

### Issue 2: Level Disparity (USER ACTION REQUIRED)

**Root Cause:** Null Templar is level 2 while the rest of the team is level 5.

**Stats Comparison:**
```
Null Templar (Level 2, Tank):
- HP: 70
- ES: 118.5 (from gear)
- Total EHP: 188.5
- Armor: 21
- Evasion: 77

Other Characters (Level 5):
- High Cleric: 99 HP + 119 ES = 218 EHP
- Gareth: 100 HP + 17 ES = 117 HP (but has 656 evasion)
- Kai: 87 HP + 50.5 ES = 137.5 EHP (but has 652.5 evasion)
- Cedric: 87 HP + 52.5 ES = 139.5 EHP (but has 650 evasion)
```

**The Problem:**
- Null Templar has the LOWEST effective HP of any character
- Extremely low armor (21) and evasion (77) compared to DPS characters (650+ evasion)
- Level 2 vs Level 5 means missing 3 levels worth of stat scaling:
  - -36 HP from level scaling (12 HP per level in PoE)
  - -6 Strength (2 per level) = -3 HP
  - -30 Armor (10 per level for tanks)
  - Missing passive tree nodes
  - Missing talent points

**Why This Matters:**
Even with the targeting fix, a level 2 tank in a tier 2+ dungeon with level 5 teammates will struggle because:
1. Enemies scale with dungeon tier/key level
2. Tank has significantly lower defensive stats
3. Tank has lower HP pool to absorb damage
4. Missing critical defensive talents

## Solution

### Immediate (Applied):
✅ Fixed enemy targeting so tanks actually get hit by casters and archers

### User Action Required:
⚠️ **Level up Null Templar to match the team level (5)**
- Run lower-tier dungeons with Null Templar to gain XP
- Or manually adjust level in save file if needed for testing

### Long-term Recommendations:

1. **Add Level Requirements for Dungeons:**
   - Warn players if team members are underleveled
   - Suggest minimum level = (dungeon tier * 2) or team average level

2. **Improve Tank Base Stats:**
   - Consider giving tanks higher base HP multiplier
   - Tanks should have ~30-50% more HP than DPS at same level
   - Currently tanks rely too heavily on Energy Shield from gear

3. **Add Threat/Aggro System:**
   - Current system: enemies just prefer tanks (probabilistic)
   - Better: tanks generate "threat" that increases targeting priority
   - Tank abilities could generate extra threat
   - Would make tanking more active and strategic

4. **Visual Feedback:**
   - Show when tank is being targeted (aggro indicator)
   - Show when enemies "break threat" and target others
   - Help players understand the targeting system

## Testing

To verify the fix works:
1. Level Null Templar to 5
2. Run the same tier 2 dungeon
3. Check combat log - tank should be taking 60-70% of enemy attacks
4. Tank should survive significantly longer

## Files Modified

- `src/systems/combat/enemyCombat.ts`:
  - `processCasterAttack()`: Added 70% tank targeting
  - `processArcherAttack()`: Added 60% tank targeting


