import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  GiCrossedSwords, GiRoundShield, GiRing, 
  GiHelmet, GiChestArmor, GiGloves, GiBelt, GiBoots,
  GiNecklace, GiGemPendant
} from 'react-icons/gi';
import type { Item, ItemGridSize } from '../../types/items';
import type { GearSlot } from '../../types/character';
import type { StashItem } from '../../store/gameStore';
import { ItemTooltip } from '../shared/ItemTooltip';
import { ItemContextMenu } from '../shared/ItemContextMenu';
import { getItemArtUrl, getFallbackArtUrl } from '../../utils/itemArt';
import type { ExtendedItem } from '../../systems/poeItemAdapter';
import { ALL_POE_BASE_ITEMS } from '../../data/poeBaseItems';
import { checkItemRequirements, validateEquipment } from '../../utils/equipmentValidation';
import { getItemSlot } from '../../types/items';

// Slot to icon mapping (fallback when no art available)
const SLOT_ICONS: Record<GearSlot, React.ReactNode> = {
  head: <GiHelmet />,
  chest: <GiChestArmor />,
  hands: <GiGloves />,
  waist: <GiBelt />,
  feet: <GiBoots />,
  mainHand: <GiCrossedSwords />,
  offHand: <GiRoundShield />,
  neck: <GiNecklace />,
  ring1: <GiRing />,
  ring2: <GiRing />,
  trinket1: <GiGemPendant />,
  trinket2: <GiGemPendant />,
};

// Occupied cell background color - with 0.5 alpha (blue)
const OCCUPIED_CELL_BG = 'rgba(19, 37, 71, 0.5)';
// Unequippable (requirements not met) background color (red)
const UNEQUIPPABLE_CELL_BG = 'rgba(71, 19, 19, 0.5)';

interface StashGridItemProps {
  item: Item;
  stashItem: StashItem;
  cellSize: number;
  size: ItemGridSize;
  isFloating?: boolean;
  onClick: (e?: React.MouseEvent) => void;
  onRightClick?: () => void;
  // Character stats for requirement checking
  characterLevel: number;
  characterStats: { strength: number; dexterity: number; intelligence: number };
  // Current equipment for slot validation (quiver/bow rules)
  currentMainHand?: Item | null;
  currentOffHand?: Item | null;
  // Salvage mode indicator
  salvageMode?: boolean;
  // Is currently being salvaged (for animation)
  isSalvaging?: boolean;
}

export function StashGridItem({
  item,
  stashItem,
  cellSize,
  size,
  isFloating = false,
  onClick,
  onRightClick,
  characterLevel,
  characterStats,
  currentMainHand,
  currentOffHand,
  salvageMode = false,
  isSalvaging = false,
}: StashGridItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Check if character meets stat requirements for this item
  const requirementsCheck = useMemo(() => 
    checkItemRequirements(item, characterLevel, characterStats),
    [item, characterLevel, characterStats]
  );
  
  // Check if item can be equipped based on slot validation (quiver/bow, 2H, etc.)
  const equipmentValidation = useMemo(() => {
    const itemSlot = getItemSlot(item);
    if (!itemSlot) return { canEquip: true };
    return validateEquipment(item, itemSlot, currentMainHand || null, currentOffHand || null);
  }, [item, currentMainHand, currentOffHand]);
  
  // Item is equippable if both stat requirements AND slot validation pass
  const meetsRequirements = requirementsCheck.meetsRequirements && equipmentValidation.canEquip;
  
  const itemSlot = getItemSlot(item);
  const slotIcon = itemSlot ? SLOT_ICONS[itemSlot] : null;
  
  // Get stable base ID for art lookup
  const extItem = item as ExtendedItem;
  const baseId = extItem._poeItem?.baseItem?.id || item.baseId;
  
  // Get item art URL from PoE data - each base item has unique art
  // Look up current base item data to ensure we have visualIdentity even for older items
  // Memoize on baseId to prevent unnecessary recalculations
  const artUrl = useMemo(() => {
    if (!baseId) return null;
    
    // Look up fresh base item data (in case stored item predates visualIdentity)
    const currentBaseItem = ALL_POE_BASE_ITEMS.find(b => b.id === baseId);
    
    if (currentBaseItem?.visualIdentity) {
      const url = getItemArtUrl(currentBaseItem.visualIdentity);
      if (url) return url;
    }
    
    // Fallback: try stored visualIdentity
    if (extItem._poeItem?.baseItem?.visualIdentity) {
      const url = getItemArtUrl(extItem._poeItem.baseItem.visualIdentity);
      if (url) return url;
    }
    
    // Try to get fallback art based on item class
    const itemClass = currentBaseItem?.itemClass || extItem._poeItem?.baseItem?.itemClass;
    if (itemClass) {
      return getFallbackArtUrl(itemClass);
    }
    return null;
  }, [baseId, extItem._poeItem?.baseItem?.visualIdentity, extItem._poeItem?.baseItem?.itemClass]);
  
  // Preload image when art URL changes
  React.useEffect(() => {
    if (!artUrl) {
      setImageLoaded(false);
      setImageError(false);
      return;
    }
    
    // Reset state
    setImageLoaded(false);
    setImageError(false);
    
    // Preload the image immediately
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
    };
    img.src = artUrl;
    
    // Cleanup: abort loading if component unmounts or URL changes
    return () => {
      img.onload = null;
      img.onerror = null;
      img.src = '';
    };
  }, [artUrl]);
  
  const width = size.width * cellSize;
  const height = size.height * cellSize;
  const left = isFloating ? 0 : stashItem.x * cellSize;
  const top = isFloating ? 0 : stashItem.y * cellSize;
  
  // Calculate icon size based on item dimensions
  const iconSize = Math.min(width, height) * 0.5;
  
  // Show artwork if available and loaded successfully
  const showArt = artUrl && !imageError;
  
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <div
        draggable={false}
        onMouseDown={(e) => {
          // On mouse down, immediately pick up the item
          if (e.button === 0 && !isFloating) { // Left click only
            e.preventDefault();
            e.stopPropagation();
            // Call onClick to pick up the item
            onClick(e);
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setContextMenuPos({ x: e.clientX, y: e.clientY });
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        style={{
          position: isFloating ? 'relative' : 'absolute',
          left: isFloating ? 0 : left,
          top: isFloating ? 0 : top,
          width,
          height,
          // Background with grid lines overlay - red if requirements not met
          background: `
            linear-gradient(to right, rgba(0,0,0,0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.4) 1px, transparent 1px),
            ${meetsRequirements ? OCCUPIED_CELL_BG : UNEQUIPPABLE_CELL_BG}
          `,
          backgroundSize: `${cellSize}px ${cellSize}px`,
          border: salvageMode ? '2px solid rgba(239, 68, 68, 0.8)' : 'none',
          cursor: isFloating ? 'none' : 'pointer',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: isFloating ? 9999 : isHovered ? 10 : 1,
          pointerEvents: isFloating || isSalvaging ? 'none' : 'auto',
          // Destruction animation with jiggle
          opacity: isSalvaging ? 0 : 1,
          animation: isSalvaging ? 'itemBreakJiggle 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none',
          filter: isSalvaging ? 'brightness(2) blur(6px) saturate(200%)' : 'none',
          boxShadow: isSalvaging 
            ? '0 0 30px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.5), inset 0 0 40px rgba(239, 68, 68, 0.6)'
            : salvageMode 
              ? '0 0 8px rgba(239, 68, 68, 0.6), inset 0 0 20px rgba(239, 68, 68, 0.3)' 
              : 'none',
        }}
      >
        {/* Destruction overlay effect */}
        {isSalvaging && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.6) 0%, transparent 70%)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
        )}
        
        {/* Item Art or Fallback Icon */}
        {showArt ? (
          <img
            src={artUrl}
            alt={item.name}
            loading="eager"
            onLoad={() => {
              // Double-check: if preload succeeded, this should also succeed
              if (!imageLoaded) {
                setImageLoaded(true);
              }
            }}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
            style={{
              width: '90%',
              height: '90%',
              objectFit: 'contain',
              opacity: imageLoaded ? (isSalvaging ? 0.3 : 1) : 0,
              transition: isSalvaging ? 'opacity 0.4s ease' : 'opacity 0.15s ease',
              imageRendering: 'auto',
              filter: isSalvaging ? 'brightness(2) contrast(1.5) saturate(200%)' : 'none',
            }}
            draggable={false}
          />
        ) : (
          <div
            style={{ 
              fontSize: iconSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isSalvaging ? 'rgba(239, 68, 68, 1)' : 'rgba(180, 170, 160, 0.6)',
              transition: isSalvaging ? 'all 0.4s ease' : 'none',
              filter: isSalvaging ? 'brightness(2) drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))' : 'none',
            }}
          >
            {slotIcon}
          </div>
        )}
        
        {/* Loading placeholder while art loads */}
        {showArt && !imageLoaded && (
          <div
            style={{
              position: 'absolute',
              fontSize: iconSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(180, 170, 160, 0.4)',
            }}
          >
            {slotIcon}
          </div>
        )}
      </div>
      
      {/* Tooltip - don't show for floating items or when context menu is open */}
      <AnimatePresence>
        {isHovered && !isFloating && !contextMenuPos && (
          <ItemTooltip 
            item={item} 
            position={mousePos} 
            characterLevel={characterLevel}
            characterStats={characterStats}
          />
        )}
      </AnimatePresence>
      
      {/* Context Menu */}
      {contextMenuPos && (
        <ItemContextMenu
          item={item}
          position={contextMenuPos}
          onClose={() => setContextMenuPos(null)}
          onEquip={onRightClick}
        />
      )}
    </>
  );
}
