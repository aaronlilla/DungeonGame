import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import type { MapItem } from '../../types/maps';
import { MapGridItem } from './MapGridItem';
import { STASH_GRID_SIZE } from '../../store/gameStore';

interface MapStashGridProps {
  maps: MapItem[];
  selectedMapId: string | null;
  onSelectMap: (mapId: string | null) => void;
  cellSize?: number;
  heldMapId: string | null;
  setHeldMapId: (id: string | null) => void;
  onDragStart?: (map: MapItem) => void;
  onDragEnd?: () => void;
  onMoveMap?: (mapId: string, x: number, y: number) => void;
}

export function MapStashGrid({
  maps,
  selectedMapId,
  onSelectMap,
  cellSize = 28,
  heldMapId,
  setHeldMapId,
  onDragStart,
  onDragEnd,
  onMoveMap,
}: MapStashGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [gridMousePos, setGridMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isValidDrop, setIsValidDrop] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Create display positions for maps WITHOUT stacking
  const displayMaps = React.useMemo(() => {
    const display: Array<{ map: MapItem; x: number; y: number; stackCount: number }> = [];
    
    // Sort maps by tier (highest first) then by name
    const sortedMaps = [...maps].sort((a, b) => {
      const tierDiff = b.tier - a.tier;
      if (tierDiff !== 0) return tierDiff;
      return a.name.localeCompare(b.name);
    });
    
    // Place each map individually in the grid
    sortedMaps.forEach((map, index) => {
      const x = index % STASH_GRID_SIZE;
      const y = Math.floor(index / STASH_GRID_SIZE);
      
      // Only show if within grid bounds
      if (y < STASH_GRID_SIZE) {
        display.push({
          map,
          x,
          y,
          stackCount: 1 // Always 1 since we're not stacking
        });
      }
    });
    
    return display;
  }, [maps]);

  // Reset drag offset when no item is held
  useEffect(() => {
    if (!heldMapId) {
      setDragOffset({ x: 0, y: 0 });
    }
  }, [heldMapId]);

  // Track mouse position for held item
  useEffect(() => {
    if (!heldMapId) {
      setGridMousePos(null);
      setIsValidDrop(false);
      return;
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // For now, disable grid placement since maps don't use grid positions
      setGridMousePos(null);
      setIsValidDrop(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [heldMapId, cellSize]); // Removed dragOffset from dependencies

  const handleMapClick = (map: MapItem) => {
    if (heldMapId) {
      // If holding a map, clicking another map should place it at the clicked map's position (swap)
      if (map.id !== heldMapId && map.gridPosition && onMoveMap) {
        const heldMap = maps.find(m => m.id === heldMapId);
        if (heldMap && heldMap.gridPosition) {
          // Swap positions
          onMoveMap(heldMapId, map.gridPosition.x, map.gridPosition.y);
          onMoveMap(map.id, heldMap.gridPosition.x, heldMap.gridPosition.y);
          setHeldMapId(null);
          setDragOffset({ x: 0, y: 0 });
          onDragEnd?.();
        }
      } else {
        setHeldMapId(null);
        setDragOffset({ x: 0, y: 0 });
        onDragEnd?.();
      }
    } else {
      onSelectMap(selectedMapId === map.id ? null : map.id);
    }
  };

  const handleMapDragStart = (map: MapItem) => (e: React.MouseEvent) => {
    // Calculate the offset from where the user clicked on the item
    const targetElement = e.currentTarget as HTMLElement;
    const rect = targetElement.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setDragOffset({ x: offsetX, y: offsetY });
    // Initialize mouse position at drag start
    setMousePos({ x: e.clientX, y: e.clientY });
    setHeldMapId(map.id);
    onDragStart?.(map);
  };

  // Handle clicking on grid space (empty)
  const handleGridClick = useCallback((e: React.MouseEvent) => {
    if (!heldMapId || !gridMousePos || !isValidDrop) return;
    
    // Check if we clicked on an item (handled by handleMapClick)
    const target = e.target as HTMLElement;
    if (target !== gridRef.current && !target.classList.contains('stash-grid-bg')) {
      return; // Click was on an item, not the grid background
    }
    
    // Place map at grid position
    if (onMoveMap) {
      onMoveMap(heldMapId, gridMousePos.x, gridMousePos.y);
      setHeldMapId(null);
      setGridMousePos(null);
      setIsValidDrop(false);
      setDragOffset({ x: 0, y: 0 });
      onDragEnd?.();
    }
  }, [heldMapId, gridMousePos, isValidDrop, onMoveMap, onDragEnd]);

  // Handle mouse up globally to end dragging or place on grid
  useEffect(() => {
    if (!heldMapId) return;
    
    const handleMouseUp = () => {
      if (gridMousePos && isValidDrop && onMoveMap) {
        // Place map at grid position
        onMoveMap(heldMapId, gridMousePos.x, gridMousePos.y);
      }
      setHeldMapId(null);
      setGridMousePos(null);
      setIsValidDrop(false);
      onDragEnd?.();
    };
    
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [heldMapId, gridMousePos, isValidDrop, onMoveMap, onDragEnd]);

  const handleRightClick = (map: MapItem) => (e: React.MouseEvent) => {
    e.preventDefault();
    onSelectMap(selectedMapId === map.id ? null : map.id);
  };

  const heldMap = heldMapId ? maps.find(m => m.id === heldMapId) : null;

  const gridWidth = STASH_GRID_SIZE * cellSize;
  const gridHeight = STASH_GRID_SIZE * cellSize;
  

  return (
    <>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
            margin: '0 auto',
            cursor: heldMapId && isValidDrop ? 'pointer' : 'default',
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
        
        {/* Render maps individually */}
        {displayMaps.map(({ map, x, y, stackCount }) => (
          <div
            key={map.id}
            style={{
              position: 'absolute',
              left: x * cellSize,
              top: y * cellSize,
            }}
          >
            <MapGridItem
              map={map}
              cellSize={cellSize}
              selected={selectedMapId === map.id}
              isHeld={false}
              onClick={() => handleMapClick(map)}
              onDragStart={(e) => handleMapDragStart(map)(e)}
              onRightClick={handleRightClick(map)}
              style={{
                position: 'relative',
                top: 0,
                left: 0,
              }}
            />
            {stackCount > 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '1px 4px',
                  borderRadius: '3px',
                  minWidth: '16px',
                  textAlign: 'center',
                  pointerEvents: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                {stackCount}
              </div>
            )}
          </div>
        ))}

        </div>
      </div>

      {/* Floating held map - rendered via portal to avoid CSS interference */}
      {heldMap && ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            left: mousePos.x - dragOffset.x,
            top: mousePos.y - dragOffset.y,
            width: cellSize,
            height: cellSize,
            pointerEvents: 'none',
            zIndex: 9999,
            transform: 'scale(1.1)',
            transformOrigin: 'top left',
          }}
        >
          <MapGridItem
            map={heldMap}
            cellSize={cellSize}
            selected={false}
            isHeld={true}
            onClick={() => {}}
            style={{
              position: 'relative',
              top: 0,
              left: 0,
            }}
          />
        </div>,
        document.body
      )}
    </>
  );
}
