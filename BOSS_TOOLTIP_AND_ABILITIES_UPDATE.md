# Boss Tooltip and Abilities Update

## Summary
Fixed the boss tooltip not appearing during dungeon runs and added complete ability definitions for all bosses.

## Changes Made

### 1. Boss Tooltip Click Fix
**File:** `src/components/DungeonTab.tsx`

**Problem:** Boss tooltips were blocked during dungeon runs due to `!isRunning` check.

**Solution:** Removed the `!isRunning` condition from both `onBossClick` and `onGateBossClick` handlers, allowing players to click on bosses and minibosses at any time to view their stats and abilities.

```typescript
// Before:
onBossClick={(boss) => {
  if (!isRunning) {
    setSelectedBoss(boss);
  }
}}

// After:
onBossClick={(boss) => {
  setSelectedBoss(boss);
}}
```

### 2. Added Missing Boss Abilities
**File:** `src/types/bossAbilities.ts`

Added complete ability definitions for 9 bosses that were missing them:

#### New Boss Abilities Added:

1. **Sable Hierophant Malverin**
   - Shadow Liturgy (AoE chaos damage + Vitality Drain DoT)
   - Profane Blessing (Self-heal + damage buff)
   - Dark Communion (AoE damage + Dark Link debuff)
   - Hierophant's Decree (Signature: Massive chaos damage scaling with debuffs)

2. **Orryx of the Shattered Crown**
   - Crown Shard (AoE physical + Bleeding DoT)
   - Royal Decree (Tank stun)
   - Shattered Majesty (Multi-hit random targets)
   - Crown of Ruin (Signature: AoE explosion + remove armor buffs)

3. **Virexa, Blood-Archivist Eternal**
   - Blood Script (AoE chaos + life steal)
   - Crimson Archive (Reflect damage buff)
   - Exsanguinate (Single target drain)
   - Eternal Ledger (Signature: Once per fight massive damage)

4. **The Pale Confluence**
   - Pale Touch (AoE cold + Frostbite DoT)
   - Merging Streams (AoE cold + strength buff)
   - Frozen Convergence (AoE cold + stun)
   - Absolute Zero (Signature: Massive cold + DoT)

5. **Ichorion, Dream-Leech Prime**
   - Dream Siphon (AoE chaos + mana drain)
   - Nightmare Weave (AoE chaos + confusion)
   - Leech Swarm (DoT on random targets)
   - Eternal Slumber (Signature: AoE sleep stun)

6. **Qel'Thuun the Infinite Murmur**
   - Whispered Curse (AoE stacking curse)
   - Echo Chamber (Repeat last ability)
   - Infinite Recursion (Recursive hits)
   - The Final Murmur (Signature: Once per fight, triggers all curses)

7. **The Spiral Witness**
   - Spiral Gaze (AoE stat reduction)
   - Witness Mark (High DPS target debuff)
   - Spiral Descent (AoE increasing damage)
   - Infinite Spiral (Signature: AoE DoT)

8. **Voruun, Born of Unlight**
   - Unlight Beam (AoE chaos piercing)
   - Void Embrace (Self damage reduction buff)
   - Birth of Darkness (AoE DoT)
   - Unlight Apocalypse (Signature: Massive AoE)

9. **Cenotaph Omega**
   - Monument Strike (Tank armor break)
   - Eternal Remembrance (Reflect damage)
   - Tomb Seal (Stun random target)
   - Omega Protocol (Signature: Duration-based damage)

### 3. Added Missing Kill Buffs
**File:** `src/types/bossAbilities.ts`

Added kill buffs for all 9 new bosses:

- **Sable Hierophant Malverin**: Shadow Blessing (+10% Damage, +5% Damage Reduction)
- **Orryx of the Shattered Crown**: Royal Authority (+12% Armor)
- **Virexa, Blood-Archivist Eternal**: Blood Knowledge (+1.5% Life Regen/sec)
- **The Pale Confluence**: Pale Blessing (+8% Damage Reduction)
- **Ichorion, Dream-Leech Prime**: Dream Power (+10% Cast Speed)
- **Qel'Thuun the Infinite Murmur**: Infinite Echo (+12% Damage)
- **The Spiral Witness**: Spiral Power (+10% Damage, +5% Cast Speed)
- **Voruun, Born of Unlight**: Unlight Blessing (+15% Damage)
- **Cenotaph Omega**: Omega Power (+10% Max Health, +8% Armor)

## Verification

### All Bosses Now Have Complete Definitions:
✅ **Final Bosses (19 total):**
1. Vaelrix the Gilded Ruin
2. Morchant, Bell-Bearer of the Last Toll
3. Xyra Noctyss, Widow of the Black Sun
4. Thalos Grimmwake
5. Eidolon Kareth, the Unremembered
6. The Ashbound Regent
7. Kaelthorne, He Who Will Not Fall
8. Ulthraxis of the Hungering Quiet
9. Nyxavel, Mouth of the Void Choir
10. Zha'karoth, The Fold Between Stars
11. Sable Hierophant Malverin ⭐ NEW
12. Orryx of the Shattered Crown ⭐ NEW
13. Virexa, Blood-Archivist Eternal ⭐ NEW
14. The Pale Confluence ⭐ NEW
15. Ichorion, Dream-Leech Prime ⭐ NEW
16. Qel'Thuun the Infinite Murmur ⭐ NEW
17. The Spiral Witness ⭐ NEW
18. Voruun, Born of Unlight ⭐ NEW
19. Cenotaph Omega ⭐ NEW

✅ **Minibosses (3 total):**
1. Bone Golem
2. Death Knight
3. Undying Lich

### All Kill Buffs Defined:
- ✅ All 19 final bosses have kill buffs
- ✅ All 3 minibosses have kill buffs

## Testing
Players can now:
1. Click on any boss or miniboss during a dungeon run
2. View the boss sidebar with complete information:
   - Boss name and image
   - All stats (Health, Damage, Armor, Evasion, Resistances)
   - Complete ability journal with descriptions, cast times, cooldowns, and effects
   - Kill buff information
3. Close the sidebar and continue playing

## Impact
- **User Experience**: Players can now inspect boss mechanics during combat to make informed decisions
- **Game Balance**: All bosses now have unique, thematic abilities that match their lore
- **Completeness**: 100% of bosses and minibosses have complete ability definitions

