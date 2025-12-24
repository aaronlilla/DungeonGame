import type { Item, ItemRarity } from '../../types/items';
import { ItemCard } from '../shared/ItemCard';
import { generateRandomItem } from '../../systems/crafting';
import { calculateItemLevel } from '../../systems/poeCrafting';
import { useGameStore } from '../../store/gameStore';

interface StashGridProps {
  filteredItems: Item[];
  filter: 'all' | 'normal' | 'magic' | 'rare' | 'unique';
  sortBy: 'name' | 'level' | 'rarity';
  onFilterChange: (filter: 'all' | 'normal' | 'magic' | 'rare' | 'unique') => void;
  onSortChange: (sortBy: 'name' | 'level' | 'rarity') => void;
}

export function StashGrid({ filteredItems, filter, sortBy, onFilterChange, onSortChange }: StashGridProps) {
  const addItemToInventory = useGameStore(state => state.addItemToInventory);
  const highestKeyCompleted = useGameStore(state => state.highestKeyCompleted);
  
  const handleGenerateItems = () => {
    const rarities: ItemRarity[] = ['normal', 'magic', 'magic', 'rare', 'rare', 'rare'];
    const keyLevel = highestKeyCompleted || 2; // Default to +2 if not set
    
    for (let i = 0; i < 4; i++) {
      const rarity = rarities[Math.floor(Math.random() * rarities.length)];
      // Use key-level-based item level calculation (each item gets variance)
      const itemLevel = calculateItemLevel(keyLevel);
      addItemToInventory(generateRandomItem(itemLevel, rarity));
    }
  };
  
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Stash ({filteredItems.length} items)</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={handleGenerateItems}
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.3))',
              border: '1px solid rgba(34, 197, 94, 0.5)',
              borderRadius: '6px',
              padding: '0.4rem 0.75rem',
              color: '#4ade80',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.5), rgba(22, 163, 74, 0.5))';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(22, 163, 74, 0.3))';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            🎲 +4 Items
          </button>
          <select 
            className="form-input form-select"
            value={filter}
            onChange={e => onFilterChange(e.target.value as any)}
            style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 0.6rem' }}
          >
            <option value="all">All Rarities</option>
            <option value="normal">Normal</option>
            <option value="magic">Magic</option>
            <option value="rare">Rare</option>
            <option value="unique">Unique</option>
          </select>
          <select 
            className="form-input form-select"
            value={sortBy}
            onChange={e => onSortChange(e.target.value as any)}
            style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 0.6rem' }}
          >
            <option value="level">Sort by Level</option>
            <option value="name">Sort by Name</option>
            <option value="rarity">Sort by Rarity</option>
          </select>
        </div>
      </div>
      <div className="panel-content" style={{ maxHeight: '700px', overflowY: 'auto' }}>
        <div className="item-grid">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '3rem' }}>
            No items match the current filter
          </div>
        )}
      </div>
    </div>
  );
}

