import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { generateRandomItem } from '../systems/crafting';
import { calculateItemLevel } from '../systems/poeCrafting';
import { StashGrid } from './stash/StashGrid';
import { StashSidebar } from './stash/StashSidebar';
import type { ItemRarity } from '../types/items';

export function StashTab() {
  const { 
    inventory, 
    gold, 
    orbs,
    highestKeyCompleted,
    dungeonHistory,
    addItemToInventory
  } = useGameStore();

  const [filter, setFilter] = useState<'all' | 'normal' | 'magic' | 'rare' | 'unique'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'rarity'>('level');

  const filteredItems = inventory
    .filter(item => filter === 'all' || item.rarity === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'level': return b.itemLevel - a.itemLevel;
        case 'rarity': {
          const order = ['normal', 'magic', 'rare', 'unique', 'legendary'];
          return order.indexOf(b.rarity) - order.indexOf(a.rarity);
        }
        default: return 0;
      }
    });

  const stats = {
    totalItems: inventory.length,
    normalItems: inventory.filter(i => i.rarity === 'normal').length,
    magicItems: inventory.filter(i => i.rarity === 'magic').length,
    rareItems: inventory.filter(i => i.rarity === 'rare').length,
    uniqueItems: inventory.filter(i => i.rarity === 'unique').length,
    corruptedItems: inventory.filter(i => i.corrupted).length,
    totalRuns: dungeonHistory.length,
    successfulRuns: dungeonHistory.filter(r => r.success).length
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 380px', 
      gap: '1rem',
      height: 'calc(100vh - 90px)',
      overflow: 'hidden',
      padding: '0.5rem 1rem'
    }}>
      <StashGrid
        filteredItems={filteredItems}
        filter={filter}
        sortBy={sortBy}
        onFilterChange={setFilter}
        onSortChange={setSortBy}
      />
      <StashSidebar
        gold={gold}
        orbs={orbs}
        highestKeyCompleted={highestKeyCompleted}
        stats={stats}
        onGenerateTestItems={() => {
          // Generate items at the appropriate level based on highest key completed
          const rarities: ItemRarity[] = ['normal', 'magic', 'magic', 'rare', 'rare', 'rare'];
          const keyLevel = highestKeyCompleted || 2; // Default to +2 if not set
          
          for (let i = 0; i < 10; i++) {
            const rarity = rarities[Math.floor(Math.random() * rarities.length)];
            // Each item gets its own ilvl roll with variance (key level = zone level)
            const itemLevel = calculateItemLevel(keyLevel);
            addItemToInventory(generateRandomItem(itemLevel, rarity));
          }
        }}
      />
    </div>
  );
}
