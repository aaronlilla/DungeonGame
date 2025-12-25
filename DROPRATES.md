# Current Drop Rates Summary

## ITEM DROPS

### Item Drop Chance (from enemies during combat)
- **Normal monsters**: 5% base chance
  - Drops: 1 item
- **Elite monsters**: 25% base chance
  - Drops: 1-2 items
  - Item level: current tier + 1
- **Miniboss**: 50% base chance
  - Drops: 1-3 items
  - Item level: current tier + 2
- **Boss**: 80% base chance
  - Drops: 2-4 items
  - Item level: current tier + 2

*Note: Item drop chance is multiplied by `(1 + quantityBonus * 0.5)`*

### Item Rarity Distribution (from enemies)
Base distribution (affected by rarityBonus):
- **Normal**: 60% base (reduced by rarityBonus, minimum 10%)
- **Magic**: 30% base (increased by rarityBonus * 0.3)
- **Rare**: Remaining chance (10% base, increases as normal chance decreases)

Formula:
- `normalChance = max(0.1, 0.6 - rarityBonus)`
- `magicChance = 0.3 + (rarityBonus * 0.3)`
- `rareChance = 1 - normalChance - magicChance`

### Item Rarity Distribution (end-of-dungeon rewards)
Base distribution (at +2 tier with 0% rarity bonus):
- **Normal**: 70%
- **Magic**: 25%
- **Rare**: 5%

With rarity bonus scaling (at +10 tier with 64% rarity):
- **Normal**: 20% (scales from 70% → 5% minimum)
- **Magic**: 50% (scales from 25% → 50%)
- **Rare**: 30% (scales from 5% → ~30%)

Formula:
- `normalChance = max(0.05, 0.70 - (itemRarity * 0.78))`
- `magicChance = 0.25 + (itemRarity * 0.39)`
- `rareChance = 1 - normalChance - magicChance`

---

## ORB/CURRENCY DROPS

### Orb Drop Chance (from enemies during combat)
- **Normal monsters**: 4% base chance
- **Elite monsters**: 20% base chance
- **Miniboss**: 40% base chance
- **Boss**: 70% base chance

*Note: Orb drop chance is multiplied by `(1 + quantityBonus * 0.3)`*

### Orb Type Distribution (when an orb drops)
Weighted probabilities (normalized):
- **Orb of Transmutation**: 20.831% (common)
- **Orb of Augmentation**: 10.328% (common)
- **Orb of Alteration**: 5.508% (uncommon)
- **Orb of Alchemy**: 27.54% (rare) - *10x increased*
- **Chaos Orb**: 16.52% (rare) - *10x increased*
- **Orb of Scouring**: 13.77% (uncommon) - *10x increased*
- **Regal Orb**: 2.07% (rare) - *10x increased*
- **Exalted Orb**: 0.55% (epic) - *10x increased*
- **Orb of Annulment**: 0.55% (epic)
- **Divine Orb**: 0.34% (epic) - *10x increased*

### End-of-Dungeon Orb Drops (successful runs)
- **Transmutation**: Always drops (1-3 + keyLevel/5, minimum 1)
- **Alteration**: Always drops (0-2 + keyLevel/5)
- **Augmentation**: 30% + keyLevel * 2% chance (drops 1-2 if successful)
- **Alchemy**: 20% + keyLevel * 2% chance (drops 1 if successful)
- **Chaos**: Requires keyLevel >= 5, 10% + keyLevel * 1% chance (drops 1 if successful)
- **Exalted**: Requires keyLevel >= 10, 5% + keyLevel * 0.5% chance (drops 1 if successful)
- **Annulment**: Requires keyLevel >= 10, 5% + keyLevel * 0.5% chance (drops 1 if successful)

---

## MAP DROPS

### Map Drop Chance (from enemies during combat)
- **Normal monsters**: 2% base chance
- **Elite monsters**: 2% base chance
- **Miniboss**: 25% base chance
- **Boss**: 100% base chance (guaranteed)

*Note: Map drop chance is multiplied by `(1 + quantityBonus)`, capped at 100%*

### Map Tier Upgrade Chances
- **Normal/Elite/Miniboss**: 50% chance to drop +1 tier above current
- **Boss**: 
  - 20% chance to drop +2 tiers above current
  - Otherwise, 50% chance to drop +1 tier above current
- Maps cannot drop above `highestCompleted + 1`

### End-of-Dungeon Map Drops (from boss kill)
- **Base drop chance**: 60% + (currentTier * 5%) + (quantityBonus * 50%)
- **Number of maps**: 1-3 maps
  - 1 map: 70% chance
  - 2 maps: 20% chance (roll > 0.7)
  - 3 maps: 10% chance (roll > 0.9)
  - Additional map: If quantityBonus > 0.3, chance to add 1 more map
- **Tier distribution**:
  - 30% chance to drop +1 tier
  - 20% chance to drop -1 or -2 tiers (if tier > 1)
  - Otherwise drops at current tier

### Failed Run Map Drops
- 10% chance to drop 1 map at current tier

---

## FRAGMENT DROPS

### Fragment Drop Chance (from enemies during combat)
- **Normal monsters**: 0.05% base chance (0.0005)
- **Elite monsters**: 0.375% base chance (0.00375)
- **Miniboss**: 2% base chance (0.02)
- **Boss**: 6.25% base chance (0.0625)

*Note: Fragment drop chance is affected by:*
- `tierMultiplier = 1 + (currentTier - 1) * 0.1` (+10% per tier)
- `quantityBonus` multiplier: `(1 + quantityBonus * 0.5)`
- Final formula: `fragmentBaseChance[enemyType] * tierMultiplier * (1 + quantityBonus * 0.5)`

### End-of-Dungeon Fragment Drops (successful runs)
- **Base chance**: 3.75% + (keyLevel / 100) + (upgradeLevel * 0.1)
- **Number of rolls**: 1 + floor(keyLevel / 10) (extra roll every 10 levels)
- **Guaranteed drop**: If upgradeLevel >= 3 AND keyLevel >= 10, guaranteed 1 fragment
- **Failed runs**: 1.25% chance (0.0125) to drop 1 fragment

*Note: Fragment rarity is determined by the fragment's quantityBonus value:*
- `quantityBonus >= 0.25`: Epic rarity
- `quantityBonus >= 0.20`: Rare rarity
- Otherwise: Uncommon rarity

---

## SUMMARY TABLES

### Enemy Drop Rates Summary

| Enemy Type | Item Drop | Orb Drop | Map Drop | Fragment Drop |
|------------|-----------|----------|----------|---------------|
| Normal     | 5%        | 4%       | 2%       | 0.05%         |
| Elite      | 25%       | 20%      | 2%       | 0.375%        |
| Miniboss   | 50%       | 40%      | 25%      | 2%            |
| Boss       | 80%       | 70%      | 100%     | 6.25%         |

### Item Quantity Per Drop

| Enemy Type | Item Count Range |
|------------|------------------|
| Normal     | 1                |
| Elite      | 1-2              |
| Miniboss   | 1-3              |
| Boss       | 2-4              |

---

*All drop rates are affected by quantity and rarity bonuses from map modifiers. The formulas shown include these multipliers where applicable.*

