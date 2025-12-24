import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Item } from '../../types/items';
import { getItemGridSize } from '../../types/items';
import type { StashTab } from '../../store/gameStore';
import { STASH_GRID_SIZE, useGameStore } from '../../store/gameStore';
import { 
  canPlaceItem, 
  buildOccupancyGrid, 
  pixelToGridPosition,
  getOccupiedCells 
} from '../../utils/gridUtils';
import { StashGridItem } from './StashGridItem';

interface StashGridProps {
  tab: StashTab;
  items: Item[];
  selectedItemId: string | null;
  onSelectItem: (itemId: string | null) => void;
  cellSize?: number;
  // Lifted held item state for cross-tab dragging
  heldItemId: string | null;
  setHeldItemId: (id: string | null) => void;
  heldItemSourceTabId: string | null;
  setHeldItemSourceTabId: (id: string | null) => void;
  // Right-click equip handler
  onRightClickEquip?: (itemId: string) => void;
  // Character stats for requirement checking
  characterLevel: number;
  characterStats: { strength: number; dexterity: number; intelligence: number };
  // Current equipment for slot validation
  currentMainHand?: Item | null;
  currentOffHand?: Item | null;
  // Salvage mode
  salvageMode?: boolean;
  onSalvageItem?: (itemId: string) => void;
}

export function StashGrid({
  tab,
  items,
  selectedItemId: _selectedItemId,
  onSelectItem,
  cellSize = 28,
  heldItemId,
  setHeldItemId,
  heldItemSourceTabId,
  setHeldItemSourceTabId,
  onRightClickEquip,
  characterLevel,
  characterStats,
  currentMainHand,
  currentOffHand,
  salvageMode = false,
  onSalvageItem,
}: StashGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Local UI state for held item display
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [gridMousePos, setGridMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isValidDrop, setIsValidDrop] = useState(false);
  const [itemToSwap, setItemToSwap] = useState<string | null>(null);
  
  // Track items being salvaged for animation
  const [salvagingItems, setSalvagingItems] = useState<Set<string>>(new Set());
  
  const moveItemInStash = useGameStore(state => state.moveItemInStash);
  const removeItemFromStash = useGameStore(state => state.removeItemFromStash);
  const addItemToStash = useGameStore(state => state.addItemToStash);
  
  // Get the held item data
  const heldItem = heldItemId ? items.find(i => i.id === heldItemId) : null;
  const heldItemSize = heldItem ? getItemGridSize(heldItem) : null;
  
  // Find all items that overlap with a given area
  const findItemsInArea = useCallback((x: number, y: number, width: number, height: number, excludeItemId?: string): string[] => {
    const foundItems: Set<string> = new Set();
    
    for (const stashItem of tab.items) {
      if (stashItem.itemId === excludeItemId) continue;
      
      const item = items.find(i => i.id === stashItem.itemId);
      if (!item) continue;
      
      const size = getItemGridSize(item);
      
      // Check if this item overlaps with the area
      const overlapsX = x < stashItem.x + size.width && x + width > stashItem.x;
      const overlapsY = y < stashItem.y + size.height && y + height > stashItem.y;
      
      if (overlapsX && overlapsY) {
        foundItems.add(stashItem.itemId);
      }
    }
    
    return Array.from(foundItems);
  }, [tab.items, items]);
  
  // Check if we can place the held item at position, or swap with an overlapping item
  const checkPlacement = useCallback((dropX: number, dropY: number) => {
    if (!heldItem || !heldItemSize) {
      setIsValidDrop(false);
      setItemToSwap(null);
      return;
    }
    
    // Find all items in the drop zone
    const itemsInZone = findItemsInArea(dropX, dropY, heldItemSize.width, heldItemSize.height, heldItemId!);
    
    if (itemsInZone.length === 0) {
      // Empty space - check if we can place normally
      const otherItems = tab.items.filter(i => i.itemId !== heldItemId);
      const grid = buildOccupancyGrid(otherItems, items);
      const canPlace = canPlaceItem(grid, heldItemSize, dropX, dropY);
      setIsValidDrop(canPlace);
      setItemToSwap(null);
    } else if (itemsInZone.length === 1) {
      // Exactly one item touched - check if held item can fit at drop position
      const targetItemId = itemsInZone[0];
      
      // Build grid excluding both held item and the touched item
      const otherItems = tab.items.filter(i => i.itemId !== heldItemId && i.itemId !== targetItemId);
      const grid = buildOccupancyGrid(otherItems, items);
      
      // Check if held item can fit at the drop position
      const canPlace = canPlaceItem(grid, heldItemSize, dropX, dropY);
      
      if (canPlace) {
        setIsValidDrop(true);
        setItemToSwap(targetItemId);
      } else {
        // Can't fit - invalid drop
        setIsValidDrop(false);
        setItemToSwap(null);
      }
    } else {
      // Multiple items in zone - can't place or swap
      setIsValidDrop(false);
      setItemToSwap(null);
    }
  }, [heldItem, heldItemSize, heldItemId, tab.items, items, findItemsInArea]);
  
  // Track mouse movement globally when holding an item
  useEffect(() => {
    if (!heldItemId) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Calculate grid position
      if (gridRef.current && heldItemSize) {
        const rect = gridRef.current.getBoundingClientRect();
        // Center the item on cursor
        const offsetX = (heldItemSize.width * cellSize) / 2;
        const offsetY = (heldItemSize.height * cellSize) / 2;
        const x = e.clientX - rect.left - offsetX;
        const y = e.clientY - rect.top - offsetY;
        const pos = pixelToGridPosition(x, y, cellSize);
        
        if (pos.x >= 0 && pos.y >= 0 && 
            pos.x + heldItemSize.width <= STASH_GRID_SIZE && 
            pos.y + heldItemSize.height <= STASH_GRID_SIZE) {
          setGridMousePos(pos);
          checkPlacement(pos.x, pos.y);
        } else {
          setGridMousePos(null);
          setIsValidDrop(false);
          setItemToSwap(null);
        }
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Press Escape to drop item back
      if (e.key === 'Escape') {
        setHeldItemId(null);
        setHeldItemSourceTabId(null);
        setGridMousePos(null);
        setIsValidDrop(false);
        setItemToSwap(null);
      }
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      // On mouse up, try to place the item at the current position
      if (e.button === 0 && gridMousePos && isValidDrop) { // Left button only
        if (itemToSwap) {
          // Swapping with existing item
          const swapItem = tab.items.find(i => i.itemId === itemToSwap);
          const swapItemData = items.find(i => i.id === itemToSwap);
          
          if (swapItem && swapItemData && heldItemSize) {
            // Check if this is a cross-tab swap
            if (heldItemSourceTabId && heldItemSourceTabId !== tab.id) {
              // Cross-tab swap: remove from source, add to dest, move swap item to cursor
              removeItemFromStash(heldItemSourceTabId, heldItemId);
              addItemToStash(tab.id, heldItemId, gridMousePos.x, gridMousePos.y);
              setHeldItemId(itemToSwap);
              setHeldItemSourceTabId(tab.id);
            } else {
              // Same tab swap
              moveItemInStash(tab.id, heldItemId, gridMousePos.x, gridMousePos.y, itemToSwap);
              setHeldItemId(itemToSwap);
              setHeldItemSourceTabId(tab.id);
            }
            setGridMousePos(null);
            setIsValidDrop(false);
            setItemToSwap(null);
          }
        } else {
          // Placing in empty space
          if (heldItemSourceTabId && heldItemSourceTabId !== tab.id) {
            // Moving from another tab
            removeItemFromStash(heldItemSourceTabId, heldItemId);
            addItemToStash(tab.id, heldItemId, gridMousePos.x, gridMousePos.y);
          } else if (heldItemSourceTabId) {
            // Moving within same tab  
            moveItemInStash(tab.id, heldItemId, gridMousePos.x, gridMousePos.y);
          } else {
            // New item placement (from outside stash)
            addItemToStash(tab.id, heldItemId, gridMousePos.x, gridMousePos.y);
          }
          setHeldItemId(null);
          setHeldItemSourceTabId(null);
          setGridMousePos(null);
          setIsValidDrop(false);
        }
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [heldItemId, heldItemSize, cellSize, checkPlacement, gridMousePos, isValidDrop, itemToSwap, tab.items, tab.id, items, heldItemSourceTabId, removeItemFromStash, addItemToStash, moveItemInStash, setHeldItemId, setHeldItemSourceTabId]);
  
  // Handle clicking on an item to pick it up
  const handleItemClick = useCallback((itemId: string, clickEvent?: React.MouseEvent) => {
    // Salvage mode - animate destruction then delete item
    if (salvageMode && onSalvageItem) {
      // Mark item as salvaging to trigger animation
      setSalvagingItems(prev => new Set(prev).add(itemId));
      
      // Remove item after animation completes
      setTimeout(() => {
        onSalvageItem(itemId);
        setSalvagingItems(prev => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
      }, 400); // Match animation duration
      return;
    }
    
    // Ctrl+click to equip directly
    if (clickEvent?.ctrlKey && onRightClickEquip) {
      onRightClickEquip(itemId);
      return;
    }
    
    if (heldItemId && heldItemSize && gridMousePos) {
      // Already holding an item
      if (itemId === heldItemId) {
        // Clicking the same item - just drop it back (it's already in position)
        setHeldItemId(null);
        setHeldItemSourceTabId(null);
        setGridMousePos(null);
        setIsValidDrop(false);
        setItemToSwap(null);
        return;
      }
      
      // Use the cursor position (gridMousePos) as the drop target
      const dropX = gridMousePos.x;
      const dropY = gridMousePos.y;
      
      // Check if held item can fit at the CURSOR position (excluding both held and clicked items from grid)
      const otherItems = tab.items.filter(i => i.itemId !== heldItemId && i.itemId !== itemId);
      const grid = buildOccupancyGrid(otherItems, items);
      const canPlaceHeld = canPlaceItem(grid, heldItemSize, dropX, dropY);
      
      if (canPlaceHeld) {
        // Check if this is a cross-tab move
        if (heldItemSourceTabId && heldItemSourceTabId !== tab.id) {
          // Remove from source tab, add to this tab
          removeItemFromStash(heldItemSourceTabId, heldItemId);
          addItemToStash(tab.id, heldItemId, dropX, dropY);
        } else {
          // Same tab move
          moveItemInStash(tab.id, heldItemId, dropX, dropY, itemId);
        }
        
        // Pick up the clicked item (it goes on cursor, no position check needed)
        setHeldItemId(itemId);
        setHeldItemSourceTabId(tab.id);
        setIsValidDrop(false);
        setItemToSwap(null);
        onSelectItem(itemId);
      }
      // If can't place, do nothing - keep holding the current item
    } else if (!heldItemId) {
      // Pick up the item - capture mouse position immediately to avoid cursor jump
      if (clickEvent) {
        setMousePos({ x: clickEvent.clientX, y: clickEvent.clientY });
      }
      setHeldItemId(itemId);
      setHeldItemSourceTabId(tab.id);
      onSelectItem(itemId);
    }
  }, [heldItemId, heldItemSize, gridMousePos, tab.items, tab.id, items, moveItemInStash, onSelectItem, heldItemSourceTabId, removeItemFromStash, addItemToStash, setHeldItemId, setHeldItemSourceTabId, onRightClickEquip, salvageMode, onSalvageItem]);
  
  // Handle clicking on grid space (empty or with item to swap)
  const handleGridClick = useCallback((e: React.MouseEvent) => {
    if (!heldItemId || !heldItemSize || !gridMousePos) return;
    
    // Check if we clicked on an item (handled by handleItemClick)
    const target = e.target as HTMLElement;
    if (target !== gridRef.current && !target.classList.contains('stash-grid-bg')) {
      return; // Click was on an item, not the grid background
    }
    
    if (isValidDrop) {
      const isCrossTab = heldItemSourceTabId && heldItemSourceTabId !== tab.id;
      
      if (itemToSwap) {
        if (isCrossTab) {
          // Cross-tab with swap: remove from source, add to this tab, pick up swapped item
          removeItemFromStash(heldItemSourceTabId, heldItemId);
          addItemToStash(tab.id, heldItemId, gridMousePos.x, gridMousePos.y);
        } else if (heldItemSourceTabId === null) {
          // Item is from equipped gear, not a stash tab
          // Just add it to this tab (the swap item will be picked up)
          addItemToStash(tab.id, heldItemId, gridMousePos.x, gridMousePos.y);
        } else {
          // Same tab swap
          moveItemInStash(tab.id, heldItemId, gridMousePos.x, gridMousePos.y, itemToSwap);
        }
        setHeldItemId(itemToSwap);
        setHeldItemSourceTabId(tab.id);
        setIsValidDrop(false);
        setItemToSwap(null);
      } else {
        // Place item in empty space
        if (isCrossTab) {
          // Cross-tab move to empty space
          removeItemFromStash(heldItemSourceTabId, heldItemId);
          addItemToStash(tab.id, heldItemId, gridMousePos.x, gridMousePos.y);
        } else if (heldItemSourceTabId === null) {
          // Item is not from a stash tab (e.g., from equipped gear)
          // Just add it to this tab
          addItemToStash(tab.id, heldItemId, gridMousePos.x, gridMousePos.y);
        } else {
          // Same tab move
          moveItemInStash(tab.id, heldItemId, gridMousePos.x, gridMousePos.y);
        }
        setHeldItemId(null);
        setHeldItemSourceTabId(null);
        setGridMousePos(null);
        setIsValidDrop(false);
      }
    }
  }, [heldItemId, heldItemSize, gridMousePos, isValidDrop, itemToSwap, tab.id, moveItemInStash, heldItemSourceTabId, removeItemFromStash, addItemToStash, setHeldItemId, setHeldItemSourceTabId]);
  
  const gridWidth = STASH_GRID_SIZE * cellSize;
  const gridHeight = STASH_GRID_SIZE * cellSize;
  
  // Get cells to highlight for drop preview
  const previewCells = gridMousePos && heldItemSize 
    ? getOccupiedCells(gridMousePos.x, gridMousePos.y, heldItemSize)
    : [];

  return (
    <>
      <div
        ref={gridRef}
        onClick={handleGridClick}
        style={{
          position: 'relative',
          width: gridWidth,
          height: gridHeight,
          background: 'linear-gradient(180deg, rgba(20, 18, 14, 0.95) 0%, rgba(12, 10, 8, 0.98) 100%)',
          border: '1px solid rgba(90, 80, 60, 0.4)',
          borderRadius: '4px',
          overflow: 'hidden',
          cursor: heldItemId ? 'none' : 'default',
        }}
      >
        {/* Grid lines */}
        <div 
          className="stash-grid-bg"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(80, 70, 50, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(80, 70, 50, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`,
          }} 
        />
        
        {/* Textured overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/tilebackground.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.02,
          pointerEvents: 'none',
        }} />
        
        {/* Drop preview cells */}
        {heldItemId && previewCells.map((cell, i) => (
          <motion.div
            key={`preview-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              left: cell.x * cellSize,
              top: cell.y * cellSize,
              width: cellSize,
              height: cellSize,
              background: isValidDrop 
                ? 'rgba(74, 222, 128, 0.25)' 
                : 'rgba(248, 113, 113, 0.25)',
              border: `1px solid ${isValidDrop ? 'rgba(74, 222, 128, 0.5)' : 'rgba(248, 113, 113, 0.5)'}`,
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />
        ))}
        
        {/* Render items */}
        {tab.items.map(stashItem => {
          const item = items.find(i => i.id === stashItem.itemId);
          if (!item) return null;
          
          const size = getItemGridSize(item);
          const isHeld = heldItemId === item.id;
          
          // Don't render held item in the grid
          if (isHeld) return null;
          
          // Use a unique key combining itemId, x, and y to handle duplicate items
          const uniqueKey = `${stashItem.itemId}-${stashItem.x}-${stashItem.y}`;
          
          const isSalvaging = salvagingItems.has(item.id);
          
          return (
            <StashGridItem
              key={uniqueKey}
              item={item}
              stashItem={stashItem}
              cellSize={cellSize}
              size={size}
              onClick={(e) => handleItemClick(item.id, e)}
              onRightClick={() => onRightClickEquip?.(item.id)}
              characterLevel={characterLevel}
              characterStats={characterStats}
              currentMainHand={currentMainHand}
              currentOffHand={currentOffHand}
              salvageMode={salvageMode}
              isSalvaging={isSalvaging}
            />
          );
        })}
      </div>
      
      {/* Floating item attached to cursor */}
      <AnimatePresence>
        {heldItem && heldItemSize && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{
              position: 'fixed',
              left: mousePos.x - (heldItemSize.width * cellSize) / 2,
              top: mousePos.y - (heldItemSize.height * cellSize) / 2,
              width: heldItemSize.width * cellSize,
              height: heldItemSize.height * cellSize,
              pointerEvents: 'none',
              zIndex: 9999,
            }}
          >
            <StashGridItem
              item={heldItem}
              stashItem={{ itemId: heldItem.id, x: 0, y: 0 }}
              cellSize={cellSize}
              size={heldItemSize}
              isFloating={true}
              onClick={() => {}}
              characterLevel={characterLevel}
              characterStats={characterStats}
              currentMainHand={currentMainHand}
              currentOffHand={currentOffHand}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
