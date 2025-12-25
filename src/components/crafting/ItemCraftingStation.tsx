import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, CRAFTING_ORBS, type OrbType } from '../../store/gameStore';
import type { Item } from '../../types/items';
import { CurrencyTooltip } from '../shared/CurrencyTooltip';
import { InlineItemTooltip } from '../shared/InlineItemTooltip';
import { legacyItemToPoeItem } from '../../systems/poeItemAdapter';
import type { PoeItem } from '../../systems/poeCrafting';

// Import orb images
import transmutationOrbImg from '../../assets/orbs/transmutation_original.png';
import alterationOrbImg from '../../assets/orbs/alteration_original.webp';
import augmentationOrbImg from '../../assets/orbs/augmentation_original.png';
import alchemyOrbImg from '../../assets/orbs/alchemy_original.webp';
import chaosOrbImg from '../../assets/orbs/chaos_original.webp';
import exaltedOrbImg from '../../assets/orbs/exalt_original.webp';
import annulmentOrbImg from '../../assets/orbs/annul_original.png';
import scouringOrbImg from '../../assets/orbs/scouring_original.webp';
import regalOrbImg from '../../assets/orbs/regal_original.webp';
import divineOrbImg from '../../assets/orbs/divine_original.webp';

// Map orb types to images
const ORB_IMAGES: Record<OrbType, string> = {
  transmutation: transmutationOrbImg,
  alteration: alterationOrbImg,
  augmentation: augmentationOrbImg,
  alchemy: alchemyOrbImg,
  chaos: chaosOrbImg,
  exalted: exaltedOrbImg,
  annulment: annulmentOrbImg,
  scouring: scouringOrbImg,
  regal: regalOrbImg,
  divine: divineOrbImg,
};

// Item craftable orbs (all orbs work on items)
const ITEM_CRAFTABLE_ORBS: OrbType[] = [
  'transmutation',
  'alteration',
  'augmentation',
  'regal',
  'scouring',
  'chaos',
  'alchemy',
  'exalted',
  'annulment',
  'divine',
];

// Helper function to check if an orb can be used on an item
function canUseOrbOnItem(item: Item | null, orbType: OrbType): boolean {
  if (!item) return false;
  
  // Check if this is a PoE item
  const poeItem = legacyItemToPoeItem(item as Item & { _poeItem?: PoeItem });
  
  if (poeItem) {
    // PoE item logic
    if (poeItem.corrupted) {
      return false; // Corrupted items cannot be modified
    }
    
    switch (orbType) {
      case 'transmutation':
        return poeItem.rarity === 'normal';
      case 'alteration':
        return poeItem.rarity === 'magic';
      case 'augmentation':
        return poeItem.rarity === 'magic' && 
               (poeItem.prefixes.length < 1 || poeItem.suffixes.length < 1);
      case 'regal':
        return poeItem.rarity === 'magic';
      case 'scouring':
        return poeItem.rarity !== 'normal' && poeItem.rarity !== 'unique';
      case 'chaos':
        return poeItem.rarity === 'rare';
      case 'alchemy':
        return poeItem.rarity === 'normal';
      case 'exalted':
        return poeItem.rarity === 'rare' && 
               (poeItem.prefixes.length < 3 || poeItem.suffixes.length < 3);
      case 'annulment':
        return (poeItem.prefixes.length + poeItem.suffixes.length) > 0;
      case 'divine':
        // Divine orb not yet supported for PoE items
        return false;
      default:
        return false;
    }
  }
  
  // Legacy item logic
  if (item.corrupted) {
    return false; // Corrupted items cannot be modified
  }
  
  const totalAffixes = (item.prefixes?.length || 0) + (item.suffixes?.length || 0);
  
  switch (orbType) {
    case 'transmutation':
      return item.rarity === 'normal';
    case 'alteration':
      return item.rarity === 'magic';
    case 'augmentation':
      return item.rarity === 'magic' && 
             (item.prefixes?.length || 0) < 1 && (item.suffixes?.length || 0) < 1;
    case 'regal':
      return item.rarity === 'magic';
    case 'scouring':
      return item.rarity !== 'normal' && item.rarity !== 'unique';
    case 'chaos':
      return item.rarity === 'rare';
    case 'alchemy':
      return item.rarity === 'normal';
    case 'exalted':
      return item.rarity === 'rare' && 
             ((item.prefixes?.length || 0) < 3 || (item.suffixes?.length || 0) < 3);
    case 'annulment':
      return totalAffixes > 0;
    case 'divine':
      // Divine orb might work on legacy items, but we'll be conservative
      return false;
    default:
      return false;
  }
}

interface ItemCraftingStationProps {
  isDragging?: boolean;
  heldItemId?: string | null;
  onItemDropped?: () => void;
}

export function ItemCraftingStation({ isDragging = false, heldItemId: externalHeldItemId = null, onItemDropped }: ItemCraftingStationProps) {
  const inventory = useGameStore(state => state.inventory);
  const orbs = useGameStore(state => state.orbs);
  const applyOrbToItemAction = useGameStore(state => state.applyOrbToItemAction);

  const [craftingStationItem, setCraftingStationItem] = useState<Item | null>(null);
  const [lastCraftMessage, setLastCraftMessage] = useState<string | null>(null);
  const [hoveredOrb, setHoveredOrb] = useState<{ orbType: OrbType; position: { x: number; y: number } } | null>(null);

  // Animation states
  const [shouldShake, setShouldShake] = useState(false);
  const previousItemId = React.useRef<string | null>(null);

  // Use external heldItemId
  const heldItemId = externalHeldItemId;

  // Track if we're applying an orb to prevent sync loop
  const isApplyingOrb = React.useRef(false);

  // Trigger shake animation when item is slotted
  useEffect(() => {
    if (craftingStationItem && (!previousItemId.current || previousItemId.current !== craftingStationItem.id)) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 400);
    }
    previousItemId.current = craftingStationItem?.id || null;
  }, [craftingStationItem]);

  // Handle dropping an item into the crafting station
  const handleDropItemInStation = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (item) {
      // Create a copy to work with
      setCraftingStationItem({ ...item });
      // Notify parent that item was dropped
      onItemDropped?.();
    }
  };

  // Sync crafting station item with inventory when it changes
  useEffect(() => {
    if (craftingStationItem && !isApplyingOrb.current) {
      const updatedItem = inventory.find(i => i.id === craftingStationItem.id);
      if (updatedItem) {
        // Always update from inventory to get latest changes
        const currentSig = JSON.stringify({
          rarity: craftingStationItem.rarity,
          prefixes: craftingStationItem.prefixes?.map(a => a.definitionId).sort(),
          suffixes: craftingStationItem.suffixes?.map(a => a.definitionId).sort(),
        });
        const updatedSig = JSON.stringify({
          rarity: updatedItem.rarity,
          prefixes: updatedItem.prefixes?.map(a => a.definitionId).sort(),
          suffixes: updatedItem.suffixes?.map(a => a.definitionId).sort(),
        });
        if (currentSig !== updatedSig) {
          setCraftingStationItem({ ...updatedItem });
        }
      } else {
        // Item was removed from inventory, clear crafting station
        setCraftingStationItem(null);
      }
    }
  }, [inventory, craftingStationItem]);

  // Handle applying an orb to the item
  const handleApplyOrb = (orbType: OrbType) => {
    if (!craftingStationItem) return;

    isApplyingOrb.current = true;

    // Apply the orb using the store action (handles orb consumption and inventory update)
    const result = applyOrbToItemAction(craftingStationItem.id, orbType);

    if (result.success) {
      setLastCraftMessage(result.message);
      // Trigger shake effect on successful craft
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 400);
      // Update local state from inventory after a short delay
      setTimeout(() => {
        isApplyingOrb.current = false;
        const updatedItem = useGameStore.getState().inventory.find(i => i.id === craftingStationItem.id);
        if (updatedItem) {
          setCraftingStationItem({ ...updatedItem });
        }
      }, 50);
    } else {
      setLastCraftMessage(result.message);
      isApplyingOrb.current = false;
    }

    setTimeout(() => setLastCraftMessage(null), 3000);
  };

  // Handle removing item from crafting station
  const handleRemoveItem = () => {
    setCraftingStationItem(null);
  };

  // Expose the crafting station item ID
  useEffect(() => {
    (window as any).__itemCraftingStationItemId = craftingStationItem?.id || null;
    return () => {
      (window as any).__itemCraftingStationItemId = null;
    };
  }, [craftingStationItem]);

  return (
    <motion.div
      className="item-crafting-station"
      animate={shouldShake ? {
        x: [0, -4, 4, -3, 3, -2, 2, 0],
        y: [0, -2, 2, -1.5, 1.5, -1, 1, 0],
      } : {}}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        minWidth: 0,
        background: 'linear-gradient(145deg, rgba(20, 18, 15, 0.98) 0%, rgba(12, 10, 8, 0.99) 100%)',
        borderRadius: '14px',
        border: '1px solid rgba(201, 162, 39, 0.15)',
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.5),
          inset 0 1px 0 rgba(255,255,255,0.03),
          inset 0 -1px 0 rgba(0,0,0,0.3),
          0 0 40px rgba(201, 162, 39, ${craftingStationItem ? '0.15' : '0.05'})
        `,
        backdropFilter: 'blur(12px)',
        position: 'relative',
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

      {/* Ambient glow effect */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '100%',
        background: 'radial-gradient(ellipse at center, rgba(201, 162, 39, 0.03) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      {/* Corner ornaments */}
      <div style={{ position: 'absolute', top: 8, left: 8, width: 20, height: 20, borderTop: '2px solid #c9a227', borderLeft: '2px solid #c9a227', borderRadius: '6px 0 0 0', pointerEvents: 'none', zIndex: 10, boxShadow: '-2px -2px 8px rgba(201, 162, 39, 0.15)' }} />
      <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderTop: '2px solid #c9a227', borderRight: '2px solid #c9a227', borderRadius: '0 6px 0 0', pointerEvents: 'none', zIndex: 10, boxShadow: '2px -2px 8px rgba(201, 162, 39, 0.15)' }} />
      <div style={{ position: 'absolute', bottom: 8, left: 8, width: 20, height: 20, borderBottom: '2px solid #c9a227', borderLeft: '2px solid #c9a227', borderRadius: '0 0 0 6px', pointerEvents: 'none', zIndex: 10, boxShadow: '-2px 2px 8px rgba(201, 162, 39, 0.15)' }} />
      <div style={{ position: 'absolute', bottom: 8, right: 8, width: 20, height: 20, borderBottom: '2px solid #c9a227', borderRight: '2px solid #c9a227', borderRadius: '0 0 6px 0', pointerEvents: 'none', zIndex: 10, boxShadow: '2px 2px 8px rgba(201, 162, 39, 0.15)' }} />

      {/* Header */}
      <div style={{
        flexShrink: 0,
        padding: '1.1rem 1rem',
        background: 'linear-gradient(180deg, rgba(201, 162, 39, 0.1) 0%, rgba(201, 162, 39, 0.02) 100%)',
        borderBottom: '1px solid rgba(201, 162, 39, 0.15)',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Top gold line with glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent 5%, #c9a227 50%, transparent 95%)',
          boxShadow: '0 0 12px rgba(201, 162, 39, 0.4)',
        }} />
        {/* Center diamond decoration */}
        <motion.div
          animate={{
            boxShadow: ['0 0 10px rgba(201, 162, 39, 0.4)', '0 0 20px rgba(201, 162, 39, 0.6)', '0 0 10px rgba(201, 162, 39, 0.4)']
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '-5px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '10px',
            height: '10px',
            background: 'linear-gradient(135deg, #d4af37 0%, #c9a227 50%, #8b7019 100%)',
            borderRadius: '2px',
          }}
        />
        <h3 style={{
          fontSize: '1rem',
          margin: 0,
          fontFamily: "'Cinzel', Georgia, serif",
          fontWeight: 700,
          color: '#d4af37',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          textShadow: '0 0 20px rgba(201, 162, 39, 0.5), 0 2px 4px rgba(0,0,0,0.5)',
        }}>
          Item Crafting
        </h3>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Item Slot */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: craftingStationItem ? 'auto' : '120px',
            background: isDragging && heldItemId
              ? 'rgba(201, 162, 39, 0.15)'
              : 'rgba(0, 0, 0, 0.2)',
            border: `3px ${craftingStationItem ? 'solid' : 'dashed'} ${
              isDragging && heldItemId
                ? 'rgba(201, 162, 39, 0.6)'
                : craftingStationItem
                  ? 'rgba(201, 162, 39, 0.5)'
                  : 'rgba(201, 162, 39, 0.3)'
            }`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            overflow: 'hidden',
            boxShadow: craftingStationItem
              ? '0 0 30px rgba(201, 162, 39, 0.3), inset 0 0 20px rgba(0,0,0,0.3)'
              : 'inset 0 0 20px rgba(0,0,0,0.3)',
          }}
          onMouseUp={() => {
            if (isDragging && heldItemId) {
              handleDropItemInStation(heldItemId);
            }
          }}
        >
          {/* Glowing border when item is slotted */}
          {craftingStationItem && (
            <motion.div
              animate={{
                opacity: [0.6, 1, 0.6],
                boxShadow: [
                  '0 0 15px rgba(201, 162, 39, 0.4)',
                  '0 0 30px rgba(201, 162, 39, 0.6)',
                  '0 0 15px rgba(201, 162, 39, 0.4)'
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                inset: -3,
                borderRadius: '8px',
                border: '3px solid #c9a227',
                pointerEvents: 'none',
                zIndex: 3,
              }}
            />
          )}

          {craftingStationItem ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={craftingStationItem.id + craftingStationItem.rarity + (craftingStationItem.prefixes?.length || 0) + (craftingStationItem.suffixes?.length || 0)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'relative',
                  width: '100%',
                  padding: '0.5rem',
                }}
              >
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem();
                  }}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: '20px',
                    height: '20px',
                    background: 'rgba(200, 50, 50, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                  }}
                  title="Remove item"
                >
                  ×
                </button>

                {/* Full inline item tooltip */}
                <InlineItemTooltip item={craftingStationItem} />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div style={{
              textAlign: 'center',
              color: 'rgba(200, 190, 170, 0.5)',
              fontSize: '0.85rem',
              padding: '2rem',
            }}>
              Drag an item here to craft
            </div>
          )}
        </div>

        {/* Craft Message */}
        <AnimatePresence>
          {lastCraftMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                padding: '0.5rem',
                background: 'rgba(201, 162, 39, 0.2)',
                border: '1px solid rgba(201, 162, 39, 0.4)',
                borderRadius: '4px',
                fontSize: '0.8rem',
                color: '#c9a227',
                textAlign: 'center',
              }}
            >
              {lastCraftMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Currency Orbs */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#c8b68d',
            fontWeight: 600,
            marginBottom: '0.25rem',
          }}>
            Currency
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '0.5rem',
            justifyItems: 'center',
          }}>
            {ITEM_CRAFTABLE_ORBS.map(orbType => {
              const orb = CRAFTING_ORBS.find(o => o.type === orbType);
              const count = orbs[orbType] || 0;
              const hasOrb = count > 0;
              const canUse = canUseOrbOnItem(craftingStationItem, orbType);
              const isUsable = hasOrb && canUse;

              return (
                <motion.div
                  key={orbType}
                  whileHover={{ scale: isUsable ? 1.1 : 1 }}
                  whileTap={{ scale: isUsable ? 0.95 : 1 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isUsable ? 'pointer' : 'not-allowed',
                    opacity: isUsable ? 1 : 0.3,
                    gap: '0.25rem',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isUsable) {
                      handleApplyOrb(orbType);
                    }
                  }}
                  onMouseEnter={(e) => {
                    setHoveredOrb({ orbType, position: { x: e.clientX, y: e.clientY } });
                  }}
                  onMouseLeave={() => {
                    setHoveredOrb(null);
                  }}
                  onMouseMove={(e) => {
                    if (hoveredOrb?.orbType === orbType) {
                      setHoveredOrb({ orbType, position: { x: e.clientX, y: e.clientY } });
                    }
                  }}
                >
                  <img
                    src={ORB_IMAGES[orbType]}
                    alt={orb?.name || orbType}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain',
                      filter: isUsable ? 'none' : 'grayscale(100%)',
                      imageRendering: 'auto',
                    }}
                  />
                  <div style={{
                    fontSize: '0.7rem',
                    color: isUsable ? '#c9a227' : '#666',
                    fontWeight: 600,
                    textShadow: isUsable ? '0 0 4px rgba(201, 162, 39, 0.5)' : 'none',
                  }}>
                    {count}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Currency Tooltip */}
      {hoveredOrb && (
        <CurrencyTooltip
          orbType={hoveredOrb.orbType}
          count={orbs[hoveredOrb.orbType] || 0}
          position={hoveredOrb.position}
        />
      )}
    </motion.div>
  );
}
