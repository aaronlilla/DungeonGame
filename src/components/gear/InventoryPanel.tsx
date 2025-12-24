import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { GiSwapBag, GiTreasureMap, GiTrashCan, GiHammerDrop } from 'react-icons/gi';
import type { Item, ItemRarity, ItemGridSize } from '../../types/items';
import { getItemGridSize, getItemSlot } from '../../types/items';
import { useGameStore, STASH_GRID_SIZE, type StashTab } from '../../store/gameStore';
import { StashGrid } from './StashGrid';
import { StashTabBar } from './StashTabBar';
import { PanelOrnaments, HeaderOrnament } from '../shared/PanelOrnaments';
import { generateRandomItem } from '../../systems/crafting';
import { calculateItemLevel } from '../../systems/poeCrafting';
import { canPlaceItem, buildOccupancyGrid } from '../../utils/gridUtils';

interface InventoryPanelProps {
  inventory: Item[];
  selectedItem: string | null;
  onSelectItem: (itemId: string | null) => void;
  characterId: string;
  // Lifted held item state for cross-component dragging
  heldItemId: string | null;
  setHeldItemId: (id: string | null) => void;
  heldItemSourceTabId: string | null;
  setHeldItemSourceTabId: (id: string | null) => void;
  // Character stats for requirement checking
  characterLevel: number;
  characterStats: { strength: number; dexterity: number; intelligence: number };
  // Current equipment for slot validation
  currentMainHand?: Item | null;
  currentOffHand?: Item | null;
}

// Find an available position in the stash grid for an item
function findAvailablePosition(
  tab: StashTab, 
  inventory: Item[], 
  itemSize: ItemGridSize
): { x: number; y: number } | null {
  const grid = buildOccupancyGrid(tab.items, inventory);
  
  // Scan from top-left, row by row
  for (let y = 0; y <= STASH_GRID_SIZE - itemSize.height; y++) {
    for (let x = 0; x <= STASH_GRID_SIZE - itemSize.width; x++) {
      if (canPlaceItem(grid, itemSize, x, y)) {
        return { x, y };
      }
    }
  }
  
  return null; // No space available
}

export function InventoryPanel({ 
  inventory, 
  selectedItem, 
  onSelectItem, 
  characterId,
  heldItemId,
  setHeldItemId,
  heldItemSourceTabId,
  setHeldItemSourceTabId,
  characterLevel,
  characterStats,
  currentMainHand,
  currentOffHand,
}: InventoryPanelProps) {
  const stashTabs = useGameStore(state => state.stashTabs);
  const activeStashTabId = useGameStore(state => state.activeStashTabId);
  const setActiveStashTab = useGameStore(state => state.setActiveStashTab);
  const addItemToInventory = useGameStore(state => state.addItemToInventory);
  const addItemToStash = useGameStore(state => state.addItemToStash);
  const equipItem = useGameStore(state => state.equipItem);
  const removeItemFromStash = useGameStore(state => state.removeItemFromStash);
  const clearStash = useGameStore(state => state.clearStash);
  const team = useGameStore(state => state.team);
  
  const [salvageMode, setSalvageMode] = useState(false);
  
  // Two-step confirmation for clearing stash
  const [clearConfirmStep, setClearConfirmStep] = useState<0 | 1 | 2>(0);
  
  const character = team.find(c => c.id === characterId);
  
  // Get active tab
  const activeTab = stashTabs.find(t => t.id === activeStashTabId) ?? stashTabs[0];
  
  // Handle right-click to equip an item
  const handleRightClickEquip = useCallback((itemId: string) => {
    if (!character || !activeTab) return;
    
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;
    
    // Determine which slot this item goes into
    let targetSlot = getItemSlot(item);
    if (!targetSlot) return;
    
    // For rings, check which slot is empty or use ring1 if both occupied
    if (targetSlot === 'ring1') {
      if (!character.equippedGear.ring1) {
        targetSlot = 'ring1';
      } else if (!character.equippedGear.ring2) {
        targetSlot = 'ring2';
      } else {
        targetSlot = 'ring1'; // Default to ring1 for swap
      }
    }
    
    // Get the stash item position for the new item
    const stashItem = activeTab.items.find(si => si.itemId === itemId);
    if (!stashItem) return;
    
    const oldItemPosition = { x: stashItem.x, y: stashItem.y };
    
    // Check if there's an existing item in the slot
    const existingItemId = character.equippedGear[targetSlot];
    
    // Equip the new item (this also removes it from stash)
    equipItem(characterId, targetSlot, itemId);
    
    // If there was an existing item, check if it can go where the new item was
    if (existingItemId) {
      const existingItem = inventory.find(i => i.id === existingItemId);
      if (existingItem) {
        const existingSize = getItemGridSize(existingItem);
        
        // Build grid without the new item (it's been removed from stash by equipItem)
        const otherItems = activeTab.items.filter(si => si.itemId !== itemId);
        const grid = buildOccupancyGrid(otherItems, inventory);
        
        if (canPlaceItem(grid, existingSize, oldItemPosition.x, oldItemPosition.y)) {
          // Place the old item where the new item was
          addItemToStash(activeTab.id, existingItemId, oldItemPosition.x, oldItemPosition.y);
        } else {
          // Can't fit - pick it up on cursor
          setHeldItemId(existingItemId);
          setHeldItemSourceTabId(null); // It's not in a stash tab
        }
      }
    }
  }, [character, activeTab, inventory, characterId, equipItem, addItemToStash, setHeldItemId, setHeldItemSourceTabId]);
  
  // Count total items across all tabs
  const totalItems = stashTabs.reduce((sum, tab) => sum + tab.items.length, 0);
  
  // Handle clear stash with two-step confirmation
  const handleClearClick = useCallback(() => {
    if (clearConfirmStep === 0) {
      setClearConfirmStep(1);
      // Auto-reset after 3 seconds if not confirmed
      setTimeout(() => setClearConfirmStep(prev => prev === 1 ? 0 : prev), 3000);
    } else if (clearConfirmStep === 1) {
      setClearConfirmStep(2);
      // Auto-reset after 3 seconds if not confirmed
      setTimeout(() => setClearConfirmStep(prev => prev === 2 ? 0 : prev), 3000);
    } else if (clearConfirmStep === 2) {
      clearStash();
      setClearConfirmStep(0);
    }
  }, [clearConfirmStep, clearStash]);
  
  // Generate 4 random PoE items and place them in the stash
  // Uses the highest key level completed to determine item level
  const handleGenerateItems = () => {
    const rarities: ItemRarity[] = ['normal', 'magic', 'magic', 'rare', 'rare', 'rare'];
    
    if (!activeTab) {
      console.warn('No active stash tab');
      return;
    }
    
    // Get the highest key completed to determine item level
    const gameStore = useGameStore.getState();
    const highestKey = gameStore.highestKeyCompleted || 2; // Default to +2 if not set
    
    // We need to track what we've added to find positions correctly
    let currentInventory = [...gameStore.inventory];
    let currentTabItems = [...(gameStore.stashTabs.find(t => t.id === activeTab.id)?.items || [])];
    
    for (let i = 0; i < 4; i++) {
      const rarity = rarities[Math.floor(Math.random() * rarities.length)];
      // Use the key-level-based item level calculation (each item gets variance)
      const itemLevel = calculateItemLevel(highestKey);
      
      const item = generateRandomItem(itemLevel, rarity);
      if (!item) {
        console.warn('Failed to generate item');
        continue;
      }
      
      const itemSize = getItemGridSize(item);
      
      // Build a temporary tab object with current items for position finding
      const tempTab: StashTab = {
        ...activeTab,
        items: currentTabItems
      };
      
      const position = findAvailablePosition(tempTab, currentInventory, itemSize);
      
      if (!position) {
        console.warn('No space available in stash for item', item.name);
        continue;
      }
      
      // Add to inventory first
      addItemToInventory(item);
      
      // Then add to stash at the found position
      addItemToStash(activeTab.id, item.id, position.x, position.y);
      
      // Update our tracking arrays for the next iteration
      currentInventory.push(item);
      currentTabItems.push({ itemId: item.id, x: position.x, y: position.y });
    }
  };

  return (
    <div 
      style={{ 
        position: 'relative',
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        minHeight: 0,
        background: 'linear-gradient(180deg, rgba(25, 22, 18, 0.98) 0%, rgba(15, 13, 10, 0.99) 100%)',
        border: '1px solid rgba(90, 75, 55, 0.5)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Textured background overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/tilebackground.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.025,
        pointerEvents: 'none',
      }} />
      
      {/* Decorative corner ornaments */}
      <PanelOrnaments color="#c9a227" size="medium" />
      
      {/* Header */}
      <div style={{ 
        flexShrink: 0, 
        padding: '0.85rem 1rem',
        background: 'linear-gradient(180deg, rgba(201, 162, 39, 0.12) 0%, rgba(201, 162, 39, 0.02) 100%)',
        borderBottom: '1px solid rgba(201, 162, 39, 0.2)',
        position: 'relative',
      }}>
        <HeaderOrnament color="#c9a227" />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <GiSwapBag style={{ fontSize: '1.1rem', color: '#c9a227' }} />
            <h3 style={{ 
              fontSize: '0.9rem', 
              margin: 0, 
              fontFamily: "'Cinzel', Georgia, serif",
              fontWeight: 700,
              color: '#c9a227',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              textShadow: '0 0 12px rgba(201, 162, 39, 0.4)',
            }}>Stash</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setSalvageMode(!salvageMode)}
              style={{
                padding: '0.4rem 0.6rem',
                background: salvageMode
                  ? 'linear-gradient(180deg, rgba(220, 38, 38, 0.9) 0%, rgba(185, 28, 28, 0.95) 100%)'
                  : 'linear-gradient(180deg, rgba(50, 45, 35, 0.95) 0%, rgba(35, 30, 25, 0.98) 100%)',
                border: salvageMode
                  ? '1px solid rgba(239, 68, 68, 0.8)'
                  : '1px solid rgba(90, 80, 60, 0.3)',
                borderRadius: '4px',
                color: salvageMode ? '#fca5a5' : 'rgba(212, 197, 158, 1)',
                fontSize: '0.75rem',
                fontWeight: salvageMode ? 700 : 600,
                fontFamily: "'Cinzel', Georgia, serif",
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: salvageMode
                  ? '0 0 10px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.03)',
              }}
              title={salvageMode ? 'Salvage Mode Active - Click items to delete them' : 'Activate Salvage Mode - Click to delete items'}
            >
              <GiHammerDrop style={{ fontSize: '0.9rem' }} />
              <span>Salvage</span>
            </button>
            <div style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'rgba(200, 190, 170, 0.7)',
              padding: '0.2rem 0.5rem',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '4px',
              border: '1px solid rgba(100, 90, 70, 0.3)',
            }}>
              {totalItems} items
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Bar */}
      <StashTabBar
        tabs={stashTabs}
        activeTabId={activeStashTabId ?? stashTabs[0]?.id ?? ''}
        onSelectTab={setActiveStashTab}
      />
      
      {/* Stash Grid */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto', 
        minHeight: 0, 
        padding: '0.75rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(201, 162, 39, 0.03) 0%, transparent 50%)',
      }}>
        {activeTab ? (
          <StashGrid
            tab={activeTab}
            items={inventory}
            selectedItemId={selectedItem}
            onSelectItem={onSelectItem}
            cellSize={28}
            heldItemId={heldItemId}
            setHeldItemId={setHeldItemId}
            heldItemSourceTabId={heldItemSourceTabId}
            setHeldItemSourceTabId={setHeldItemSourceTabId}
            onRightClickEquip={handleRightClickEquip}
            characterLevel={characterLevel}
            characterStats={characterStats}
            currentMainHand={currentMainHand}
            currentOffHand={currentOffHand}
            salvageMode={salvageMode}
            onSalvageItem={(itemId) => {
              if (activeTab) {
                removeItemFromStash(activeTab.id, itemId);
              }
            }}
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: '200px',
              textAlign: 'center', 
              padding: '2rem',
            }}
          >
            {/* Decorative frame */}
            <div style={{
              position: 'absolute',
              inset: '20%',
              border: '1px solid rgba(201, 162, 39, 0.15)',
              borderRadius: '12px',
              pointerEvents: 'none',
            }} />
            
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 2, -2, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(145deg, rgba(201, 162, 39, 0.12) 0%, rgba(139, 112, 25, 0.05) 100%)',
                border: '2px solid rgba(201, 162, 39, 0.2)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <GiTreasureMap style={{ fontSize: '2rem', color: 'rgba(201, 162, 39, 0.4)' }} />
            </motion.div>
            
            <div style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              marginBottom: '0.35rem',
              color: 'rgba(200, 190, 170, 0.6)',
              fontFamily: "'Cinzel', Georgia, serif",
            }}>
              No Stash Tabs
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Bottom decorative line */}
      <div style={{
        height: '1px',
        margin: '0 1rem 0.5rem 1rem',
        background: 'linear-gradient(90deg, transparent, rgba(120, 100, 70, 0.3), transparent)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) rotate(45deg)',
          width: '4px',
          height: '4px',
          background: '#c9a227',
          opacity: 0.4,
          borderRadius: '1px',
        }} />
      </div>
    </div>
  );
}
