import type { Item } from '../types/items';
import { getItemGridSize, type ItemGridSize } from '../types/items';
import type { StashItem } from '../store/gameStore';
import { STASH_GRID_SIZE } from '../store/gameStore';

/**
 * Check if an item can be placed at the given position in the grid
 */
export function canPlaceItem(
  grid: boolean[][],
  itemSize: ItemGridSize,
  x: number,
  y: number
): boolean {
  // Check bounds
  if (x < 0 || y < 0) return false;
  if (x + itemSize.width > STASH_GRID_SIZE) return false;
  if (y + itemSize.height > STASH_GRID_SIZE) return false;
  
  // Check for collisions
  for (let dy = 0; dy < itemSize.height; dy++) {
    for (let dx = 0; dx < itemSize.width; dx++) {
      if (grid[y + dy]?.[x + dx]) {
        return false; // Cell is occupied
      }
    }
  }
  
  return true;
}

/**
 * Build an occupancy grid from stash items
 * Returns a 24x24 grid where true = occupied, false = empty
 */
export function buildOccupancyGrid(
  stashItems: StashItem[],
  allItems: Item[]
): boolean[][] {
  // Initialize empty grid
  const grid: boolean[][] = Array.from({ length: STASH_GRID_SIZE }, () =>
    Array.from({ length: STASH_GRID_SIZE }, () => false)
  );
  
  // Mark occupied cells
  for (const stashItem of stashItems) {
    const item = allItems.find(i => i.id === stashItem.itemId);
    if (!item) continue;
    
    const size = getItemGridSize(item);
    
    for (let dy = 0; dy < size.height; dy++) {
      for (let dx = 0; dx < size.width; dx++) {
        const gridY = stashItem.y + dy;
        const gridX = stashItem.x + dx;
        if (gridY < STASH_GRID_SIZE && gridX < STASH_GRID_SIZE) {
          grid[gridY][gridX] = true;
        }
      }
    }
  }
  
  return grid;
}

/**
 * Build an occupancy grid from maps with grid positions
 * Maps are always 1x1, so we just mark their grid positions
 */
export function buildMapOccupancyGrid(
  maps: Array<{ id: string; gridPosition?: { x: number; y: number } }>,
  excludeMapId?: string
): boolean[][] {
  // Initialize empty grid
  const grid: boolean[][] = Array.from({ length: STASH_GRID_SIZE }, () =>
    Array.from({ length: STASH_GRID_SIZE }, () => false)
  );
  
  // Mark occupied cells
  for (const map of maps) {
    if (map.id === excludeMapId || !map.gridPosition) continue;
    
    const { x, y } = map.gridPosition;
    if (x >= 0 && x < STASH_GRID_SIZE && y >= 0 && y < STASH_GRID_SIZE) {
      grid[y][x] = true;
    }
  }
  
  return grid;
}

/**
 * Find the first available position for an item in the grid
 * Scans left-to-right, top-to-bottom
 */
export function findAvailablePosition(
  grid: boolean[][],
  itemSize: ItemGridSize
): { x: number; y: number } | null {
  for (let y = 0; y <= STASH_GRID_SIZE - itemSize.height; y++) {
    for (let x = 0; x <= STASH_GRID_SIZE - itemSize.width; x++) {
      if (canPlaceItem(grid, itemSize, x, y)) {
        return { x, y };
      }
    }
  }
  return null;
}

/**
 * Get the grid cell coordinates from a pixel position within the grid container
 */
export function pixelToGridPosition(
  pixelX: number,
  pixelY: number,
  cellSize: number
): { x: number; y: number } {
  return {
    x: Math.floor(pixelX / cellSize),
    y: Math.floor(pixelY / cellSize),
  };
}

/**
 * Get the pixel position of a grid cell (top-left corner)
 */
export function gridToPixelPosition(
  gridX: number,
  gridY: number,
  cellSize: number
): { x: number; y: number } {
  return {
    x: gridX * cellSize,
    y: gridY * cellSize,
  };
}

/**
 * Check if a grid position is within bounds
 */
export function isValidGridPosition(x: number, y: number): boolean {
  return x >= 0 && x < STASH_GRID_SIZE && y >= 0 && y < STASH_GRID_SIZE;
}

/**
 * Get all cells that an item occupies at a given position
 */
export function getOccupiedCells(
  x: number,
  y: number,
  itemSize: ItemGridSize
): { x: number; y: number }[] {
  const cells: { x: number; y: number }[] = [];
  for (let dy = 0; dy < itemSize.height; dy++) {
    for (let dx = 0; dx < itemSize.width; dx++) {
      cells.push({ x: x + dx, y: y + dy });
    }
  }
  return cells;
}
