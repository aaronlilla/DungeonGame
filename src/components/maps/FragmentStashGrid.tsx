import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { Fragment } from '../../types/maps';
import { FragmentGridItem } from './FragmentGridItem';
import { STASH_GRID_SIZE } from '../../store/gameStore';

interface FragmentStashGridProps {
  fragments: Fragment[];
  selectedFragmentId: string | null;
  onSelectFragment: (fragmentId: string | null) => void;
  cellSize?: number;
  heldFragmentId: string | null;
  setHeldFragmentId: (id: string | null) => void;
  onDragStart?: (fragment: Fragment) => void;
  onDragEnd?: () => void;
}

export function FragmentStashGrid({
  fragments,
  selectedFragmentId,
  onSelectFragment,
  cellSize = 28,
  heldFragmentId,
  setHeldFragmentId,
  onDragStart,
  onDragEnd,
}: FragmentStashGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Track mouse position for held item
  useEffect(() => {
    if (!heldFragmentId) {
      setDragOffset({ x: 0, y: 0 });
      return;
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [heldFragmentId]);

  const handleFragmentClick = (fragment: Fragment) => {
    if (heldFragmentId) {
      setHeldFragmentId(null);
      onDragEnd?.();
    } else {
      onSelectFragment(selectedFragmentId === fragment.id ? null : fragment.id);
    }
  };

  const handleFragmentDragStart = (fragment: Fragment) => (e: React.MouseEvent) => {
    // Calculate the offset from where the user clicked on the item
    const targetElement = e.currentTarget as HTMLElement;
    const rect = targetElement.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setDragOffset({ x: offsetX, y: offsetY });
    setMousePos({ x: e.clientX, y: e.clientY });
    setHeldFragmentId(fragment.id);
    onDragStart?.(fragment);
  };

  // Handle mouse up globally to end dragging
  useEffect(() => {
    if (!heldFragmentId) return;
    
    const handleMouseUp = () => {
      setHeldFragmentId(null);
      onDragEnd?.();
    };
    
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [heldFragmentId, onDragEnd]);

  const handleRightClick = (fragment: Fragment) => (e: React.MouseEvent) => {
    e.preventDefault();
    onSelectFragment(selectedFragmentId === fragment.id ? null : fragment.id);
  };

  const heldFragment = heldFragmentId ? fragments.find(f => f.id === heldFragmentId) : null;
  const visibleFragments = fragments.filter(f => f.id !== heldFragmentId);

  const gridWidth = STASH_GRID_SIZE * cellSize;
  const gridHeight = STASH_GRID_SIZE * cellSize;

  return (
    <>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div
          ref={gridRef}
          style={{
          position: 'relative',
          width: gridWidth,
          height: gridHeight,
          background: 'linear-gradient(180deg, rgba(20, 18, 14, 0.95) 0%, rgba(12, 10, 8, 0.98) 100%)',
          border: '1px solid rgba(90, 80, 60, 0.4)',
          borderRadius: '4px',
          overflow: 'hidden',
          margin: '0 auto',
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
        
        {/* Render fragments - auto-place in grid */}
        {visibleFragments.map((fragment, index) => {
          const x = index % STASH_GRID_SIZE;
          const y = Math.floor(index / STASH_GRID_SIZE);
          
          // Skip if would overflow
          if (x >= STASH_GRID_SIZE || y >= STASH_GRID_SIZE) {
            return null;
          }
          
          return (
            <FragmentGridItem
              key={fragment.id}
              fragment={fragment}
              cellSize={cellSize}
              selected={selectedFragmentId === fragment.id}
              isHeld={false}
              onClick={() => handleFragmentClick(fragment)}
              onDragStart={(e) => handleFragmentDragStart(fragment)(e)}
              onRightClick={handleRightClick(fragment)}
              style={{
                position: 'absolute',
                left: x * cellSize,
                top: y * cellSize,
              }}
            />
          );
        })}
        </div>
      </div>

      {/* Floating held fragment - rendered via portal */}
      {heldFragment && ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            left: mousePos.x - dragOffset.x,
            top: mousePos.y - dragOffset.y,
            width: cellSize,
            height: cellSize,
            pointerEvents: 'none',
            zIndex: 1000,
            transform: 'scale(1.1)',
            transformOrigin: 'top left',
          }}
        >
          <FragmentGridItem
            fragment={heldFragment}
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
