# Tank HP Buff - Making Tanks More Survivable

## Problem

Null Templar (and tanks in general) were dying too quickly because they had insufficient HP pools compared to the damage they were taking.

**Previous Stats (Level 2 Null Templar):**
- Base HP: 70 (38 base + 20 role bonus + 12 from level)
- With ES: 70 HP + 94 ES = 164 effective HP
- Result: Dies in 4-8 seconds against 10 enemies

**Root Causes:**
1. Null Templar class had only +100 HP modifier (vs 400-600 for other tanks)
2. ROLE_BONUSES gave tanks only +20 HP fallback
3. Energy Shield tanks are inherently squishier than armor tanks

## Solution Applied

### 1. Buffed Null Templar Class Stats

**File:** `src/types/classes.ts`

Changed Null Templar's `statModifiers`:
```typescript
// BEFORE
life: 100,
maxLife: 100,

// AFTER  
life: 250,  // +150 HP buff
maxLife: 250,
```

**New Level 2 Null Templar Stats:**
- Base: 38 HP
- Level bonus: 12 HP (level 2)
- Class modifier: 250 HP (buffed from 100)
- **Total: 300 HP** (vs previous 70 HP)
- With ES: 300 HP + 94 ES = **394 effective HP** (vs previous 164)

**Result:** 2.4x more survivability!

### 2. Buffed Tank Role Fallback Bonus

**File:** `src/types/character.ts`

Changed `ROLE_BONUSES` for tanks:
```typescript
// BEFORE
tank: {
  life: 20,
  maxLife: 20,
  armor: 50,
}

// AFTER
tank: {
  life: 150,    // +130 HP buff
  maxLife: 150,
  armor: 100,   // +50 armor buff
}
```

This ensures even tanks without a class selected get decent HP.

### 3. Also Buffed Healer and DPS Fallbacks (Minor)

For consistency:
- Healer: 10 → 30 HP (+20)
- DPS: 10 → 20 HP (+10)

## Impact by Level

**Null Templar HP Progression (with new buffs):**
- Level 1: 288 HP (38 base + 250 class)
- Level 2: 300 HP (+12 per level)
- Level 3: 312 HP
- Level 4: 324 HP
- Level 5: 336 HP
- Level 10: 396 HP

**With Energy Shield from gear:**
- Level 2: 300 HP + 94 ES = **394 EHP**
- Level 5: 336 HP + 150 ES = **486 EHP** (estimated with better gear)

## Comparison to Other Tanks

**Base HP at Level 1 (class modifiers only):**
- Bastion Knight: 638 HP (600 class + 38 base)
- Wardbreaker: 538 HP (500 class + 38 base)
- Iron Skirmisher: 488 HP (450 class + 38 base)
- Duel Warden: 438 HP (400 class + 38 base)
- **Null Templar: 288 HP (250 class + 38 base)** ← Still lowest, but reasonable

**Why Null Templar has less HP:**
- ES-based tank (ES acts as second HP pool)
- Has 550 base ES from class (vs 0 for armor tanks)
- 55% spell suppression (reduces magic damage by 50%)
- Faster ES recharge rate
- **Total EHP with ES is competitive with armor tanks**

## Testing Recommendations

1. **Create a new Level 2 Null Templar** - should have ~300 HP now
2. **Run Tier 1 dungeon** - should survive significantly longer
3. **Level to 5** - should have ~336 HP + better ES gear
4. **Compare survivability** - tank should take 60-70% of enemy attacks (targeting fix) and survive

## Expected Results

**Before Buffs:**
- Level 2 Null Templar: 70 HP → Dies in 4-8 seconds
- Team wipes quickly

**After Buffs:**
- Level 2 Null Templar: 300 HP → Should survive 12-24 seconds
- Level 5 Null Templar: 336 HP → Should survive 20-40 seconds
- With proper healing: Should complete tier 1-2 dungeons

## Notes

- This buff makes Null Templar viable at low levels
- Still requires proper gear and leveling for higher tiers
- ES recharge mechanics mean tank needs brief breaks from damage
- Healer must keep tank topped up during heavy combat
- Tank will still be squishier than armor-based tanks, but that's by design

## Files Modified

1. `src/types/classes.ts` - Buffed Null Templar life from 100 to 250
2. `src/types/character.ts` - Buffed tank role bonus from 20 to 150 HP
3. `src/systems/combat/enemyCombat.ts` - (Previous fix) Added tank targeting priority


