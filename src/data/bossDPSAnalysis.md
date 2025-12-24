# Boss DPS Analysis and Baseline Values

## DPS Calculation Methodology
- Base attack speed: 1 attack per 2 seconds (0.5 attacks/sec)
- GCD: 1.0 seconds between abilities
- Calculations assume continuous uptime on tank

## Boss Analysis

### Vaelrix the Gilded Ruin
**Abilities:**
- Coinlash Barrage: 25 damage to all, 2s CD, instant cast
- Molten Treasury: 40 damage to tank, 6s CD, 2s cast
- Tax of Excess: 0 damage, 4s CD, instant cast (utility)
- Ruin Interest (Signature): 15 base + 5 per buff to all, 10s CD, 3s cast

**DPS Calculation:**
- Rotation: Coinlash → Auto → Molten (cast) → Auto → Tax → Auto → Coinlash → Auto → Ruin (cast)
- Per 10s cycle: 25 (Coinlash) + 25 (Coinlash) + 40 (Molten) + ~30 (Ruin avg) + 4 autos (120)
- Total: 240 damage / 10s = **24 DPS base**
- With Gilded stacks: Up to **36 DPS**

**Recommended Base Damage: 30**

---

### Morchant, Bell-Bearer of the Last Toll
**Abilities:**
- Funeral Bell: 30 damage to all + Doom, 3s CD, instant
- Ominous Chime: 40 damage to tank + stacking debuff, 5s CD, 2s cast
- Silence the Living: 0 damage + Silence 2s, 4s CD, instant
- Mourning Dirge (Signature): 60 damage to all, 10s CD, 3s cast

**DPS Calculation:**
- Rotation: Bell → Auto → Chime (cast) → Auto → Silence → Bell → Auto → Dirge (cast)
- Per 10s: 30 (Bell) + 30 (Bell) + 40 (Chime) + 60 (Dirge) + 3 autos (90)
- Total: 250 damage / 10s = **25 DPS base**
- Doom adds significant pressure

**Recommended Base Damage: 30**

---

### Thalos Grimmwake
**Abilities:**
- Grave Rend: 35 damage + Maim, 2s CD, instant
- Rotting Covenant: 30 damage to all + life regen buff, 6s CD, 2s cast
- Corpse Echo: Repeats last ability at 50%, 4s CD, instant
- March of the Unburied (Signature): Stacking DoT (12/stack), 10s CD, 3s cast

**DPS Calculation:**
- Rotation: Rend → Auto → Covenant (cast) → Echo → Auto → Rend → Auto → March (cast)
- Per 10s: 35 + 35 + 30 + 15 (echo) + DoT buildup + 3 autos (90)
- Total without DoT: 205 / 10s = **20.5 DPS base**
- With DoT stacks: Up to **32+ DPS**

**Recommended Base Damage: 30**

---

### Eidolon Kareth, the Unremembered
**Abilities:**
- Memory Fracture: 25 damage + random debuff, 3s CD, instant
- Forgotten Strike: 45 damage to lowest HP, 5s CD, 2s cast
- Erasure: Removes buffs/debuffs, 6s CD, instant
- Amnesia Wave (Signature): 50 damage + 30s Memory Leak, 10s CD, 3s cast

**DPS Calculation:**
- Complex due to Memory Leak interactions
- Base rotation: 205 damage / 10s = **20.5 DPS**
- With Memory Leak escalation: **30-40 DPS**

**Recommended Base Damage: 35**

---

### The Ashbound Regent
**Abilities:**
- Cinder Strike: 30 fire damage + burn, 2s CD, instant
- Ash Storm: 25 damage to all + blind, 6s CD, 2s cast
- Pyroclastic Flow: Line attack 50 damage, 4s CD, 1s cast
- Inferno Cascade (Signature): Massive AoE, 12s CD, 3s cast

**DPS Calculation:**
- High burst potential
- Base: ~25 DPS
- With burns: **35+ DPS**

**Recommended Base Damage: 35**

---

### Sable Hierophant Malverin
**Abilities:**
- Dark Sermon: 20 damage + heal absorb, 3s CD, instant
- Void Touch: 40 chaos damage + heal reduction, 5s CD, 2s cast
- Shadow Word: 0 damage + damage amp debuff, 4s CD, instant
- Damnation (Signature): Reduces healing by 100%, 10s CD, 3s cast

**DPS Calculation:**
- Anti-healing focused
- Base: ~22 DPS
- With debuffs: **28-30 DPS**

**Recommended Base Damage: 25**

---

### Xyra Noctyss, Widow of the Black Sun
**Abilities:**
- Widow's Kiss: 35 damage + poison, 2s CD, instant
- Web of Shadows: Root + 20 damage, 6s CD, 2s cast
- Venom Spray: 30 damage cone, 4s CD, instant
- Eclipse (Signature): Darkness + 60 damage, 10s CD, 3s cast

**DPS Calculation:**
- High mobility disruption
- Base: ~28 DPS
- With poison: **35+ DPS**

**Recommended Base Damage: 35**

---

### Ulthraxis of the Hungering Quiet
**Abilities:**
- Void Hunger: 25 damage + mana burn, 3s CD, instant
- Silence of the Stars: AoE silence + 20 damage, 5s CD, 2s cast
- Consume Light: 40 damage + blind, 4s CD, instant
- The Final Quiet (Signature): Reduces all healing, 10s CD, 3s cast

**DPS Calculation:**
- Mana burn focus
- Base: ~24 DPS
- Utility over damage

**Recommended Base Damage: 25**

---

### Qel'Thuun the Infinite Murmur
**Abilities:**
- Murmur: 20 damage + confuse, 2s CD, instant
- Echoing Madness: 35 damage random target, 4s CD, 1s cast
- Whisper of Insanity: Damage based on buffs, 5s CD, instant
- Cacophony (Signature): Mass confuse + damage, 10s CD, 3s cast

**DPS Calculation:**
- Chaos and disruption
- Base: ~22 DPS
- Situational spikes

**Recommended Base Damage: 25**

---

### Zha'karoth, The Fold Between Stars
**Abilities:**
- Rift Strike: 30 damage + teleport enemy, 2s CD, instant
- Dimensional Tear: 40 damage + phase shift, 5s CD, 2s cast
- Fold Reality: Swap HP percentages, 8s CD, instant
- Collapse (Signature): Massive damage based on missing HP, 12s CD, 4s cast

**DPS Calculation:**
- Execution focused
- Base: ~26 DPS
- Scales with fight length

**Recommended Base Damage: 30**

---

## Final Boss Recommendations

### The Pale Confluence
**Abilities:**
- Confluence Strike: 40 damage + debuff, 2s CD, instant
- Gather Souls: AoE pull + 30 damage, 5s CD, 2s cast
- Soul Burn: DoT to all, 4s CD, instant
- The Joining (Signature): Merges with adds, 15s CD, 5s cast

**DPS Calculation:**
- Add management critical
- Base: ~30 DPS
- With adds: **45+ DPS**

**Recommended Base Damage: 40**

---

### Cenotaph Omega
**Abilities:**
- Null Strike: 45 damage + null zone, 2s CD, instant
- Void Cascade: Chain damage 35 per jump, 5s CD, 2s cast
- Reality Fracture: Teleport + 40 damage, 6s CD, instant
- Omega Protocol (Signature): Raid-wide increasing damage, Once per fight

**DPS Calculation:**
- Highest base damage
- Base: ~35 DPS
- With Omega Protocol: **50+ DPS**

**Recommended Base Damage: 45**

---

## Summary of Base Damage Recommendations

**Tier 1 Bosses (Early):** 25-30 base damage
- Focus on teaching mechanics

**Tier 2 Bosses (Mid):** 30-35 base damage
- Increased pressure, debuff management

**Tier 3 Bosses (Late):** 35-40 base damage
- High damage, complex mechanics

**Final Bosses:** 40-45 base damage
- Extreme pressure, perfect execution required

## Key Implementation Notes

1. **Debuff Implementation Required:**
   - Gilded (damage amplification)
   - Doom (death timer)
   - Maim (damage reduction)
   - Memory Leak (escalating damage)
   - Burn/Poison DoTs
   - Healing reduction effects

2. **Boss AI Improvements Needed:**
   - Remove GCD for bosses (they should cast continuously)
   - Implement proper ability priority system
   - Add phase transitions at HP thresholds
   - Ensure signature abilities are used strategically

3. **Special Mechanics:**
   - Corpse Echo needs to track last ability
   - Ruin Interest needs to count party buffs
   - Memory Leak needs escalation logic
   - Fold Reality needs HP swap implementation
