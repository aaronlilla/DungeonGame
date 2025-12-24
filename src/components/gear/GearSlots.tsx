import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GiCrossedSwords, GiRoundShield, GiRing, 
  GiHelmet, GiChestArmor, GiGloves, GiBelt, GiBoots,
  GiNecklace, GiSwordWound, GiShield, GiSparkles
} from 'react-icons/gi';
import type { GearSlot, Item, ItemGridSize } from '../../types/items';
import { getItemGridSize, getItemSlot, SLOT_GRID_SIZES } from '../../types/items';
import type { Character, BaseStats } from '../../types/character';
import { calculateLifeFromStrength, calculateManaFromIntelligence, calculateAccuracyFromDexterity, calculateArmorReduction, calculateEvasionChance, calculateClassBonusMultiplier, calculateBaseLifeFromLevel, calculateBaseManaFromLevel, calculateBaseAccuracyFromLevel, calculateBaseEvasionFromLevel } from '../../types/character';
import { getClassColor, getClassById } from '../../types/classes';
import { useGameStore } from '../../store/gameStore';
import { ItemTooltip } from '../shared/ItemTooltip';
import { calculateEquipmentStats, calculateTotalCharacterStats } from '../../systems/equipmentStats';
import { getItemArtUrl, getFallbackArtUrl } from '../../utils/itemArt';
import { getMonsterStatsForLevel } from '../../utils/monsterStats';
import type { ExtendedItem } from '../../systems/poeItemAdapter';
import { ALL_POE_BASE_ITEMS } from '../../data/poeBaseItems';
import { validateEquipment } from '../../utils/equipmentValidation';

// Stat source types for breakdown
interface StatSource {
  source: string;
  value: number;
  color?: string;
}

interface StatBreakdown {
  total: number;
  sources: StatSource[];
}

// Get stat breakdown for a specific stat
function getStatBreakdown(
  statKey: keyof BaseStats,
  character: Character,
  inventory: Item[]
): StatBreakdown {
  const sources: StatSource[] = [];
  let total = 0;
  
  // IMPORTANT: This breakdown must match calculateTotalCharacterStats exactly!
  // calculateTotalCharacterStats does: character.baseStats + equipment bonuses
  // So we do the same here to ensure the totals match.
  
  // 1. Start with character's base stats (includes base values, class bonuses, level scaling, attributes)
  const baseValue = (character.baseStats[statKey] as number) || 0;
  if (baseValue !== 0) {
    sources.push({ source: 'Character Base', value: baseValue, color: 'rgba(150, 140, 120, 0.9)' });
    total += baseValue;
  }
  
  // 2. Equipment contributions (this is what gets added on top of baseStats in calculateTotalCharacterStats)
  const equippedItems: { item: Item; slot: string }[] = [];
  for (const [slot, itemId] of Object.entries(character.equippedGear)) {
    if (itemId) {
      const item = inventory.find(i => i.id === itemId);
      if (item) {
        equippedItems.push({ item, slot });
      }
    }
  }
  
  // Calculate per-item contributions
  for (const { item, slot } of equippedItems) {
    const itemStats = calculateEquipmentStats([item]);
    const itemValue = (itemStats[statKey] as number) || 0;
    if (itemValue !== 0) {
      const slotLabel = slot.charAt(0).toUpperCase() + slot.slice(1).replace(/([A-Z])/g, ' $1');
      sources.push({ 
        source: item.name || slotLabel, 
        value: itemValue, 
        color: item.rarity === 'unique' ? '#f97316' : 
               item.rarity === 'rare' ? '#fbbf24' : 
               item.rarity === 'magic' ? '#60a5fa' : '#9ca3af'
      });
      total += itemValue;
    }
  }
  
  // 3. Verify total matches calculateTotalCharacterStats (for debugging)
  // This ensures the breakdown is accurate
  const expectedTotal = calculateTotalCharacterStats(character, inventory)[statKey] as number;
  if (Math.abs(total - expectedTotal) > 0.01) {
    // If there's a mismatch, use the expected total (this shouldn't happen, but ensures accuracy)
    console.warn(`Stat breakdown mismatch for ${statKey}: calculated ${total}, expected ${expectedTotal}`);
    total = expectedTotal;
  }
  
  return { total, sources };
}

// Get formula description for a stat
function getStatFormula(statKey: keyof BaseStats, character: Character, enemyDamageForLevel?: number, totalValue?: number): string {
  switch (statKey) {
    case 'armor':
      if (enemyDamageForLevel && totalValue !== undefined) {
        const dr = Math.round((1 - calculateArmorReduction(totalValue, enemyDamageForLevel)) * 100);
        return `Phys DR = Armor / (Armor + 25 × Damage)\nAt level ${character.level} (${enemyDamageForLevel.toFixed(1)} damage): ${dr}% reduction`;
      }
      return 'Phys DR = Armor / (Armor + 25 × Damage)\nMore effective against smaller hits';
    case 'evasion':
      return 'Evade Chance = 1 - (Accuracy / (Accuracy + (Evasion/4)^0.8))\nCapped at 95%';
    case 'life':
      return 'Life = Base (38) + Level Bonus (12/level) + Strength/2 + Class + Equipment';
    case 'mana':
      return 'Mana = Base (34) + Level Bonus (6/level) + Intelligence/2 + Class + Equipment';
    case 'accuracy':
      return 'Accuracy = Base (100) + Level Bonus (2/level) + Dexterity × 2 + Class + Equipment';
    case 'energyShield':
      return 'Energy Shield = Base × (1 + Intelligence × 0.002) + Equipment\nES protects against all damage types';
    case 'blockChance':
      return 'Block Chance = Sum of all sources\nCapped at 75%\nBlock reduces damage by 30%';
    case 'spellBlockChance':
      return 'Spell Block Chance = Sum of all sources\nCapped at 75%\nSpell Block reduces spell damage by 30%';
    case 'spellSuppressionChance':
      return 'Spell Suppression Chance = Sum of all sources\nCapped at 100%\nSuppressed spells deal 50% less damage';
    case 'fireResistance':
    case 'coldResistance':
    case 'lightningResistance':
      return 'Resistance = Sum of all sources\nCapped at 75% (can be increased)\nReduces damage of that element by the percentage';
    case 'chaosResistance':
      return 'Chaos Resistance = Sum of all sources\nCapped at 75% (can be increased)\nCan go negative, harder to cap';
    case 'criticalStrikeChance':
      return 'Crit Chance = Sum of all sources\nBase: 5%\nChance to deal critical hits';
    case 'criticalStrikeMultiplier':
      return 'Crit Multiplier = Sum of all sources\nBase: 150%\nDamage multiplier when critting';
    case 'lifeRegeneration':
      return 'Life Regen = % of max life per second\nRegenerates continuously';
    case 'manaRegeneration':
      return 'Mana Regen = % of max mana per second\nBase: 1.75%/s\nRegenerates continuously';
    case 'strength':
      return 'Strength = Base (20) + Class + Equipment\n+1 Life per 2 Strength\n+1% Melee Physical Damage per 5 Strength';
    case 'dexterity':
      return 'Dexterity = Base (20) + Class + Equipment\n+2 Accuracy per Dexterity\n+1% Evasion Rating per 5 Dexterity';
    case 'intelligence':
      return 'Intelligence = Base (20) + Class + Equipment\n+1 Mana per 2 Intelligence\n+1% Maximum Energy Shield per 5 Intelligence';
    case 'increasedDamage':
      return 'Increased Damage = Sum of all "increased damage" modifiers\nStacks additively\nSeparate from "more" damage (multiplicative)';
    default:
      return `${statKey} = Sum of all sources`;
  }
}

// Generate copyable text for a stat
function generateStatCopyText(
  statKey: keyof BaseStats,
  label: string,
  breakdown: StatBreakdown,
  character: Character,
  enemyDamageForLevel?: number
): string {
  const formula = getStatFormula(statKey, character, enemyDamageForLevel, breakdown.total);
  const lines: string[] = [];
  
  lines.push(`=== ${label} ===`);
  lines.push('');
  lines.push('FORMULA:');
  lines.push(formula);
  lines.push('');
  lines.push('BREAKDOWN:');
  
  if (breakdown.sources.length === 0) {
    lines.push('  No modifiers');
  } else {
    breakdown.sources.forEach(source => {
      lines.push(`  ${source.source}: ${source.value >= 0 ? '+' : ''}${source.value}`);
    });
  }
  
  lines.push('');
  lines.push(`TOTAL: ${breakdown.total}`);
  
  if (statKey === 'armor' && enemyDamageForLevel) {
    const dr = Math.round((1 - calculateArmorReduction(breakdown.total, enemyDamageForLevel)) * 100);
    lines.push(`PHYSICAL DAMAGE REDUCTION: ${dr}% (vs ${enemyDamageForLevel.toFixed(1)} damage at level ${character.level})`);
  } else if (statKey === 'evasion') {
    const evadeChance = Math.round(calculateEvasionChance(breakdown.total, 500) * 100);
    lines.push(`EVADE CHANCE: ${evadeChance}% (vs 500 accuracy)`);
  }
  
  lines.push('');
  lines.push(`Character: ${character.name} (Level ${character.level})`);
  lines.push(`Class: ${character.classId || character.role}`);
  
  return lines.join('\n');
}

// Stat breakdown tooltip component
function StatBreakdownTooltip({ 
  breakdown, 
  label, 
  position,
  valueFormatter,
  statKey,
  character,
  enemyDamageForLevel
}: { 
  breakdown: StatBreakdown; 
  label: string;
  position: { x: number; y: number };
  valueFormatter?: (val: number) => string;
  statKey?: keyof BaseStats;
  character?: Character;
  enemyDamageForLevel?: number;
}) {
  const formatValue = valueFormatter || ((v: number) => v >= 0 ? `+${v}` : `${v}`);
  
  // Calculate position to stay on screen
  const tooltipWidth = 280;
  const estimatedHeight = 200;
  
  let x = position.x + 15;
  let y = position.y - 10;
  
  // Keep on screen horizontally
  if (x + tooltipWidth > window.innerWidth - 10) {
    x = position.x - tooltipWidth - 15;
  }
  if (x < 10) x = 10;
  
  // Keep on screen vertically
  if (y + estimatedHeight > window.innerHeight - 10) {
    y = window.innerHeight - estimatedHeight - 10;
  }
  if (y < 10) y = 10;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 5 }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        zIndex: 10000,
        background: 'linear-gradient(180deg, rgba(25, 22, 18, 0.98) 0%, rgba(15, 12, 10, 0.99) 100%)',
        border: '1px solid rgba(120, 100, 70, 0.6)',
        borderRadius: '6px',
        padding: '0.6rem 0.8rem',
        minWidth: '180px',
        maxWidth: '280px',
        maxHeight: 'calc(100vh - 20px)',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
        pointerEvents: 'none',
      }}
    >
      {/* Header */}
      <div style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        color: '#c9a227',
        borderBottom: '1px solid rgba(120, 100, 70, 0.3)',
        paddingBottom: '0.4rem',
        marginBottom: '0.4rem',
        fontFamily: "'Cinzel', Georgia, serif",
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {label} Breakdown
      </div>
      
      {/* Formula */}
      {statKey && character && (
        <div style={{
          fontSize: '0.65rem',
          color: 'rgba(150, 140, 120, 0.8)',
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: '1.4',
          padding: '0.4rem',
          background: 'rgba(20, 18, 14, 0.5)',
          borderRadius: '4px',
          marginBottom: '0.4rem',
          whiteSpace: 'pre-line',
          border: '1px solid rgba(120, 100, 70, 0.2)',
        }}>
          {getStatFormula(statKey, character, enemyDamageForLevel, breakdown.total)}
        </div>
      )}
      
      {/* Sources */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        {breakdown.sources.length === 0 ? (
          <div style={{ fontSize: '0.7rem', color: 'rgba(150, 140, 120, 0.6)', fontStyle: 'italic' }}>
            No modifiers
          </div>
        ) : (
          breakdown.sources.map((source, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.7rem',
              gap: '0.5rem',
            }}>
              <span style={{ 
                color: 'rgba(180, 170, 150, 0.9)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}>
                {source.source}
              </span>
              <span style={{ 
                color: source.color || '#4ade80',
                fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.68rem',
              }}>
                {formatValue(source.value)}
              </span>
            </div>
          ))
        )}
      </div>
      
      {/* Total line */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(120, 100, 70, 0.3)',
        paddingTop: '0.4rem',
        marginTop: '0.4rem',
        fontSize: '0.72rem',
        fontWeight: 700,
      }}>
        <span style={{ color: 'rgba(200, 190, 170, 0.9)' }}>Total</span>
        <span style={{ 
          color: '#c9a227',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {breakdown.total}
        </span>
      </div>
    </motion.div>
  );
}

// Slot configuration with icons (shown only when empty)
const SLOT_CONFIG: Partial<Record<GearSlot, { label: string; icon: React.ReactNode }>> = {
  head: { label: 'Helm', icon: <GiHelmet /> },
  chest: { label: 'Body', icon: <GiChestArmor /> },
  hands: { label: 'Gloves', icon: <GiGloves /> },
  waist: { label: 'Belt', icon: <GiBelt /> },
  feet: { label: 'Boots', icon: <GiBoots /> },
  mainHand: { label: 'Weapon', icon: <GiCrossedSwords /> },
  offHand: { label: 'Off Hand', icon: <GiRoundShield /> },
  neck: { label: 'Amulet', icon: <GiNecklace /> },
  ring1: { label: 'Ring', icon: <GiRing /> },
  ring2: { label: 'Ring', icon: <GiRing /> },
};

const RARITY_COLORS: Record<string, { primary: string; glow: string; bg: string }> = {
  normal: { primary: '#9ca3af', glow: 'rgba(156, 163, 175, 0.4)', bg: 'rgba(156, 163, 175, 0.08)' },
  common: { primary: '#9ca3af', glow: 'rgba(156, 163, 175, 0.4)', bg: 'rgba(156, 163, 175, 0.08)' },
  magic: { primary: '#60a5fa', glow: 'rgba(96, 165, 250, 0.5)', bg: 'rgba(96, 165, 250, 0.1)' },
  rare: { primary: '#fbbf24', glow: 'rgba(251, 191, 36, 0.5)', bg: 'rgba(251, 191, 36, 0.1)' },
  unique: { primary: '#f97316', glow: 'rgba(249, 115, 22, 0.5)', bg: 'rgba(249, 115, 22, 0.1)' },
  legendary: { primary: '#a855f7', glow: 'rgba(168, 85, 247, 0.5)', bg: 'rgba(168, 85, 247, 0.12)' },
};

// Cell size for equipment slots
const CELL_SIZE = 52;

// Get slot size in grid cells
function getSlotGridSize(slot: GearSlot): ItemGridSize {
  return SLOT_GRID_SIZES[slot] || { width: 1, height: 1 };
}

// Equipment slot component
function EquipmentSlot({
  slot,
  equippedItem,
  inventory,
  onEquip,
  onUnequip,
  heldItemId,
  onEquipHeldItem,
  onPickupEquipped,
  equippedGear,
  characterLevel,
  characterStats,
}: {
  slot: GearSlot;
  equippedItem: string | undefined;
  inventory: Item[];
  onEquip: (slot: GearSlot, itemId: string) => void;
  onUnequip: (slot: GearSlot) => void;
  heldItemId?: string | null;
  onEquipHeldItem?: (slot: GearSlot) => void;
  onPickupEquipped?: (slot: GearSlot, itemId: string) => void;
  equippedGear?: Partial<Record<GearSlot, string>>;
  characterLevel: number;
  characterStats: { strength: number; dexterity: number; intelligence: number };
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);
  
  const item = equippedItem ? inventory.find(i => i.id === equippedItem) : null;
  const config = SLOT_CONFIG[slot] || { label: slot, icon: null };
  
  // Get stable base ID for art lookup
  const extItem = item as ExtendedItem | null;
  const baseId = extItem?._poeItem?.baseItem?.id || item?.baseId;
  
  // Get item art URL - look up fresh base item data for visualIdentity
  // Memoize on baseId to prevent unnecessary recalculations
  const artUrl = useMemo(() => {
    if (!item || !baseId) return null;
    
    // Look up fresh base item data (in case stored item predates visualIdentity)
    const currentBaseItem = ALL_POE_BASE_ITEMS.find(b => b.id === baseId);
    
    if (currentBaseItem?.visualIdentity) {
      const url = getItemArtUrl(currentBaseItem.visualIdentity);
      if (url) return url;
    }
    
    // Fallback: try stored visualIdentity
    if (extItem?._poeItem?.baseItem?.visualIdentity) {
      const url = getItemArtUrl(extItem._poeItem.baseItem.visualIdentity);
      if (url) return url;
    }
    
    // Try to get fallback art based on item class
    const itemClass = currentBaseItem?.itemClass || extItem?._poeItem?.baseItem?.itemClass;
    if (itemClass) {
      return getFallbackArtUrl(itemClass);
    }
    return null;
  }, [item, baseId, extItem?._poeItem?.baseItem?.visualIdentity, extItem?._poeItem?.baseItem?.itemClass]);
  
  // Get fallback art URL for when main image fails
  const fallbackArtUrl = useMemo(() => {
    if (!item) return null;
    const extItem = item as ExtendedItem | null;
    const itemClass = extItem?._poeItem?.baseItem?.itemClass;
    if (itemClass) {
      return getFallbackArtUrl(itemClass);
    }
    return null;
  }, [item]);
  
  // Track if we should use fallback URL
  const [useFallback, setUseFallback] = React.useState(false);
  
  // Reset image error and fallback state when item changes
  React.useEffect(() => {
    setImageError(false);
    setUseFallback(false);
  }, [item?.id]);
  
  // Use fallback if main image failed, otherwise use main art URL
  const effectiveArtUrl = (useFallback && fallbackArtUrl) ? fallbackArtUrl : (artUrl || null);
  const showArt = effectiveArtUrl && !imageError;
  
  const slotSize = getSlotGridSize(slot);
  const isWeaponSlot = slot === 'mainHand' || slot === 'offHand';
  const isChestSlot = slot === 'chest';
  // Chest slot displays taller (2x4) in equipment area for better visuals
  const chestDisplaySize = { width: 2, height: 4 };
  const displaySize = isWeaponSlot ? slotSize 
    : isChestSlot ? chestDisplaySize 
    : (item ? getItemGridSize(item) : slotSize);
  const boxWidth = displaySize.width * CELL_SIZE;
  const boxHeight = displaySize.height * CELL_SIZE;
  
  // Check if the held item can be placed in this slot
  const heldItemData = heldItemId ? inventory.find(i => i.id === heldItemId) : null;
  
  // Check slot type compatibility
  const slotTypeMatches = (() => {
    if (!heldItemData) return false;
    const itemSlot = getItemSlot(heldItemData);
    if (!itemSlot) return false;
    // Handle rings - they can go in either ring slot
    const isRingSlot = slot === 'ring1' || slot === 'ring2';
    const isRingItem = itemSlot === 'ring1' || itemSlot === 'ring2';
    return itemSlot === slot || (isRingSlot && isRingItem);
  })();
  
  // Check equipment validation (2H/bow/quiver/shield rules)
  const equipmentValidation = useMemo(() => {
    if (!heldItemData || !slotTypeMatches) return { canEquip: true };
    
    // Get current main hand and off hand for validation
    const mainHandId = equippedGear?.mainHand;
    const offHandId = equippedGear?.offHand;
    const mainHand = mainHandId ? inventory.find(i => i.id === mainHandId) : null;
    const offHand = offHandId ? inventory.find(i => i.id === offHandId) : null;
    
    return validateEquipment(heldItemData, slot, mainHand || null, offHand || null);
  }, [heldItemData, slotTypeMatches, equippedGear, inventory, slot]);
  
  // Can accept = slot matches AND validation passes
  const canAcceptHeldItem = slotTypeMatches && equipmentValidation.canEquip;
  
  // Blocked = slot matches but validation fails (show red)
  const isBlockedSlot = slotTypeMatches && !equipmentValidation.canEquip;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const itemId = e.dataTransfer.getData('text/plain');
    console.log('[EquipmentSlot] handleDrop - itemId:', itemId, 'slot:', slot);
    if (itemId) {
      const droppedItem = inventory.find(i => i.id === itemId);
      console.log('[EquipmentSlot] droppedItem:', droppedItem?.name, 'itemSlot:', droppedItem ? getItemSlot(droppedItem) : null);
      if (droppedItem) {
        const itemSlot = getItemSlot(droppedItem);
        const isValidSlot = itemSlot === slot ||
          (itemSlot === 'ring1' && (slot === 'ring1' || slot === 'ring2')) ||
          (itemSlot === 'ring2' && (slot === 'ring1' || slot === 'ring2')) ||
          (slot === 'ring1' && itemSlot?.startsWith('ring')) ||
          (slot === 'ring2' && itemSlot?.startsWith('ring'));

        console.log('[EquipmentSlot] isValidSlot:', isValidSlot);
        if (isValidSlot) {
          onEquip(slot, itemId);
        }
      }
    }
  }, [inventory, slot, onEquip]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // If we're holding an item, try to equip it
    if (heldItemId && onEquipHeldItem) {
      onEquipHeldItem(slot);
      return;
    }
    
    // If there's an equipped item
    if (item) {
      if (e.ctrlKey) {
        // Ctrl+click: unequip directly to stash
        onUnequip(slot);
      } else {
        // Normal click: pick up the item (put on mouse)
        // Call onPickupEquipped if provided
        onPickupEquipped?.(slot, item.id);
      }
    }
  }, [item, slot, onUnequip, heldItemId, onEquipHeldItem, onPickupEquipped]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        title={item ? `${item.name} (click to pick up, ctrl+click to unequip)` : config.label}
        style={{
          position: 'relative',
          width: boxWidth,
          height: boxHeight,
          cursor: item ? 'pointer' : 'default',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          transition: 'transform 0.15s ease',
        }}
      >
        {/* Empty slot */}
        {!item && (
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '3px',
            background: isBlockedSlot 
              ? 'rgba(71, 19, 19, 0.5)' // Red background when blocked (same style as stash blue but red)
              : (isHovered && canAcceptHeldItem) 
                ? 'rgba(30, 40, 30, 1)' 
                : '#080808',
            border: isBlockedSlot
              ? '2px solid rgba(180, 60, 60, 0.7)'
              : (isHovered && canAcceptHeldItem)
                ? '2px solid rgba(74, 222, 128, 0.7)'
                : isHovered 
                  ? '2px solid rgba(100, 85, 60, 0.6)' 
                  : '2px solid rgba(50, 42, 30, 0.7)',
            boxShadow: isBlockedSlot
              ? '0 0 15px rgba(180, 60, 60, 0.4), inset 0 0 12px rgba(180, 60, 60, 0.2)'
              : (isHovered && canAcceptHeldItem)
                ? '0 0 15px rgba(74, 222, 128, 0.4), inset 0 0 12px rgba(74, 222, 128, 0.2)'
                : `
                  inset 0 0 0 1px rgba(0, 0, 0, 0.9),
                  inset 0 0 0 3px rgba(70, 55, 35, 0.3),
                  inset 0 0 12px rgba(0,0,0,0.9)
                `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
            cursor: canAcceptHeldItem ? 'pointer' : (item ? 'pointer' : 'default'),
          }}>
            <div style={{
              position: 'absolute',
              inset: 3,
              border: isBlockedSlot 
                ? '1px solid rgba(180, 60, 60, 0.25)' 
                : '1px solid rgba(80, 65, 45, 0.25)',
              borderRadius: '1px',
              pointerEvents: 'none',
            }} />
            {(isHovered || canAcceptHeldItem || isBlockedSlot) && (
              <div style={{
                fontSize: Math.min(boxWidth, boxHeight) * 0.32,
                color: isBlockedSlot 
                  ? 'rgba(180, 60, 60, 0.6)' 
                  : canAcceptHeldItem 
                    ? 'rgba(74, 222, 128, 0.6)' 
                    : 'rgba(100, 85, 60, 0.35)',
                transition: 'color 0.15s ease',
              }}>
                {config.icon}
              </div>
            )}
          </div>
        )}

        {/* Equipped item - with slot border */}
        {item && (
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '3px',
            background: '#080808',
            border: '2px solid rgba(60, 50, 40, 0.7)',
            boxShadow: `
              inset 0 0 0 1px rgba(0, 0, 0, 0.9),
              inset 0 0 0 3px rgba(70, 55, 35, 0.3),
              inset 0 0 12px rgba(0,0,0,0.8)
            `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {/* Inner border detail */}
            <div style={{
              position: 'absolute',
              inset: 3,
              border: '1px solid rgba(80, 65, 45, 0.25)',
              borderRadius: '1px',
              pointerEvents: 'none',
            }} />
            
            {/* Item Art or Fallback Icon */}
            {showArt && effectiveArtUrl ? (
              <img
                src={effectiveArtUrl}
                alt={item.name}
                onError={() => {
                  // If main image fails and we have a fallback, try that
                  if (artUrl && fallbackArtUrl && !useFallback) {
                    setUseFallback(true);
                    setImageError(false); // Reset error to try fallback
                  } else {
                    // If fallback also fails or no fallback, hide image
                    setImageError(true);
                  }
                }}
                style={{
                  width: '85%',
                  height: '85%',
                  objectFit: 'contain',
                  imageRendering: 'auto',
                  zIndex: 1,
                }}
                draggable={false}
              />
            ) : (
              <div
                style={{ 
                  fontSize: Math.min(boxWidth, boxHeight) * 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(150, 140, 130, 0.7)',
                  zIndex: 1,
                }}
              >
                {config.icon}
              </div>
            )}
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {isHovered && item && (
          <ItemTooltip 
            item={item} 
            position={mousePos} 
            characterLevel={characterLevel}
            characterStats={characterStats}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Base stats section showing inherent stats and level scaling
function BaseStatsSection({ character }: { character: Character }) {
  const [isSectionExpanded, setIsSectionExpanded] = useState(false);
  const [isBaseStatsExpanded, setIsBaseStatsExpanded] = useState(false);
  const [isLevelScalingExpanded, setIsLevelScalingExpanded] = useState(false);
  const [isBonusesExpanded, setIsBonusesExpanded] = useState(false);
  
  // Early return with visible fallback
  if (!character) {
    return (
      <div style={{
        marginBottom: '0.75rem',
        padding: '0.6rem',
        background: 'rgba(139, 107, 246, 0.3)',
        borderRadius: '6px',
        border: '2px solid #8b5cf6',
        color: '#8b5cf6',
        fontSize: '0.75rem',
        fontWeight: 700,
      }}>
        Base Stats & Scaling (No Character)
      </div>
    );
  }
  
  try {
    const classData = character.classId ? getClassById(character.classId) : null;
    const level = character.level || 1;
    const classMultiplier = calculateClassBonusMultiplier(level);
    
    // Calculate current level scaling
    const currentLife = calculateBaseLifeFromLevel(level);
    const currentMana = calculateBaseManaFromLevel(level);
    const currentAccuracy = calculateBaseAccuracyFromLevel(level);
    const currentEvasion = calculateBaseEvasionFromLevel(level);
    
    // Get class bonuses (at 100% scaling for display)
    const classBonuses = classData?.statModifiers || {};

    // Calculate which stats scale and which don't
    const noScaleStats: (keyof BaseStats)[] = [
      'blockChance', 'spellBlockChance', 'spellSuppressionChance',
      'fireResistance', 'coldResistance', 'lightningResistance', 'chaosResistance',
      'criticalStrikeChance', 'criticalStrikeMultiplier',
      'lifeRegeneration', 'manaRegeneration', 'energyShieldRechargeRate', 'energyShieldRechargeDelay',
      'increasedDamage',
    ];
    
    const formatStatValue = (key: string, value: number): string => {
      if (noScaleStats.includes(key as keyof BaseStats)) {
        return `${value >= 0 ? '+' : ''}${value}${key.includes('Chance') || key.includes('Resistance') || key.includes('Regeneration') || key.includes('Rate') || key.includes('Delay') || key.includes('Multiplier') || key.includes('Damage') ? '%' : ''}`;
      }
      const scaledAtLevel = Math.floor(value * classMultiplier);
      const scaledAt100 = value;
      if (scaledAtLevel === scaledAt100) {
        return `${scaledAtLevel >= 0 ? '+' : ''}${scaledAtLevel}`;
      }
      return `${scaledAtLevel >= 0 ? '+' : ''}${scaledAtLevel} (${scaledAt100 >= 0 ? '+' : ''}${scaledAt100} at 100)`;
    };
    
    const formatStatName = (key: string): string => {
      return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    };
    
    return (
      <div style={{
        marginBottom: '0.75rem',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '6px',
        border: '1px solid rgba(139, 107, 246, 0.5)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 200px)',
      }}>
        {/* Main Section Header - Always Visible */}
        <div
          onClick={() => setIsSectionExpanded(!isSectionExpanded)}
          style={{
            padding: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: isSectionExpanded 
              ? 'rgba(139, 107, 246, 0.25)' 
              : 'rgba(139, 107, 246, 0.2)',
            transition: 'background 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            borderBottom: isSectionExpanded ? '1px solid rgba(139, 107, 246, 0.4)' : 'none',
            minHeight: '48px',
            height: 'auto',
            width: '100%',
            boxSizing: 'border-box',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (!isSectionExpanded) {
              e.currentTarget.style.background = 'rgba(139, 107, 246, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSectionExpanded) {
              e.currentTarget.style.background = 'rgba(139, 107, 246, 0.2)';
            }
          }}
        >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <div style={{
            fontSize: '0.8rem',
            color: '#8b5cf6',
            display: 'flex',
            alignItems: 'center',
          }}>
            <GiSparkles />
          </div>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#8b5cf6',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontFamily: "'Cinzel', Georgia, serif",
          }}>
            Base Stats & Scaling
          </div>
        </div>
        <motion.div
          animate={{ rotate: isSectionExpanded ? 180 : 0 }}
          transition={{ 
            type: 'spring',
            stiffness: 300,
            damping: 25,
            mass: 0.8
          }}
          style={{
            fontSize: '0.8rem',
            color: '#8b5cf6',
            userSelect: 'none',
            flexShrink: 0,
            transformOrigin: 'center',
          }}
        >
          ▼
        </motion.div>
      </div>
      
      <AnimatePresence initial={false}>
        {isSectionExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              height: {
                type: 'spring',
                stiffness: 400,
                damping: 30,
                mass: 0.6
              },
              opacity: {
                duration: 0.15,
                ease: [0.4, 0, 0.2, 1]
              }
            }}
            style={{ 
              overflowY: 'auto',
              overflowX: 'hidden',
              maxHeight: 'calc(100vh - 300px)',
            }}
          >
            <div style={{ 
              padding: '0.6rem',
              width: '100%',
              boxSizing: 'border-box',
            }}>
              {/* Universal Base Stats - Accordion */}
              <div style={{
                marginBottom: '0.75rem',
                padding: '0',
                background: 'linear-gradient(135deg, rgba(20, 18, 15, 0.4) 0%, rgba(15, 12, 10, 0.4) 100%)',
                borderRadius: '6px',
                border: '1px solid rgba(120, 100, 70, 0.4)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
                overflow: 'hidden',
              }}>
                <div
                  onClick={() => setIsBaseStatsExpanded(!isBaseStatsExpanded)}
                  style={{
                    padding: '0.6rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isBaseStatsExpanded 
                      ? 'rgba(201, 162, 39, 0.2)' 
                      : 'transparent',
                    transition: 'background 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#c9a227',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontFamily: "'Cinzel', Georgia, serif",
                  }}>
                    Universal Base Stats (Level 1)
                  </div>
                  <motion.div
                    animate={{ rotate: isBaseStatsExpanded ? 180 : 0 }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                      mass: 0.8
                    }}
                    style={{
                      fontSize: '0.8rem',
                      color: '#c9a227',
                      transformOrigin: 'center',
                    }}
                  >
                    ▼
                  </motion.div>
                </div>
                
                <AnimatePresence initial={false}>
                  {isBaseStatsExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ 
                        height: {
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                          mass: 0.6
                        },
                        opacity: {
                          duration: 0.15,
                          ease: [0.4, 0, 0.2, 1]
                        }
                      }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0.6rem', paddingTop: '0' }}>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.4rem',
                        }}>
                          {[
                            { label: 'Life', value: '38', color: '#ef5350' },
                            { label: 'Mana', value: '34', color: '#42a5f5' },
                            { label: 'Accuracy', value: '100', color: '#f87171' },
                            { label: 'Evasion', value: '50', color: '#4ade80' },
                            { label: 'Strength / Dexterity / Intelligence', value: '20 each', color: '#ffd54f' },
                            { label: 'Critical Strike Chance', value: '5%', color: '#fbbf24' },
                            { label: 'Critical Strike Multiplier', value: '150%', color: '#fbbf24' },
                            { label: 'Mana Regeneration', value: '1.75% / s', color: '#60a5fa' },
                          ].map((stat) => (
                            <div key={stat.label} style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.15rem',
                              padding: '0.3rem 0.4rem',
                              background: 'rgba(0, 0, 0, 0.2)',
                              borderRadius: '3px',
                              border: '1px solid rgba(60, 50, 40, 0.2)',
                            }}>
                              <div style={{
                                fontSize: '0.6rem',
                                color: 'rgba(180, 170, 150, 0.8)',
                                fontWeight: 500,
                              }}>
                                {stat.label}
                              </div>
                              <div style={{
                                fontSize: '0.7rem',
                                color: stat.color,
                                fontWeight: 600,
                                fontFamily: "'JetBrains Mono', monospace",
                              }}>
                                {stat.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Level Scaling - Accordion */}
              <div style={{
                marginBottom: '0.75rem',
                padding: '0',
                background: 'linear-gradient(135deg, rgba(20, 18, 15, 0.4) 0%, rgba(15, 12, 10, 0.4) 100%)',
                borderRadius: '6px',
                border: '1px solid rgba(120, 100, 70, 0.4)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
                overflow: 'hidden',
              }}>
                <div
                  onClick={() => setIsLevelScalingExpanded(!isLevelScalingExpanded)}
                  style={{
                    padding: '0.6rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isLevelScalingExpanded 
                      ? 'rgba(201, 162, 39, 0.2)' 
                      : 'transparent',
                    transition: 'background 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#c9a227',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontFamily: "'Cinzel', Georgia, serif",
                  }}>
                    Level Scaling (Per Level)
                  </div>
                  <motion.div
                    animate={{ rotate: isLevelScalingExpanded ? 180 : 0 }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                      mass: 0.8
                    }}
                    style={{
                      fontSize: '0.8rem',
                      color: '#c9a227',
                      transformOrigin: 'center',
                    }}
                  >
                    ▼
                  </motion.div>
                </div>
                
                <AnimatePresence initial={false}>
                  {isLevelScalingExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ 
                        height: {
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                          mass: 0.6
                        },
                        opacity: {
                          duration: 0.15,
                          ease: [0.4, 0, 0.2, 1]
                        }
                      }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0.6rem', paddingTop: '0' }}>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.4rem',
                          marginBottom: '0.5rem',
                        }}>
                          {[
                            { label: 'Life', perLevel: '+12', formula: '38 + (level-1) × 12', color: '#ef5350' },
                            { label: 'Mana', perLevel: '+6', formula: '34 + (level-1) × 6', color: '#42a5f5' },
                            { label: 'Accuracy', perLevel: '+2', formula: '100 + (level-1) × 2', color: '#f87171' },
                            { label: 'Evasion', perLevel: '+3', formula: '50 + (level-1) × 3', color: '#4ade80' },
                          ].map((stat) => (
                            <div key={stat.label} style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.15rem',
                              padding: '0.3rem 0.4rem',
                              background: 'rgba(0, 0, 0, 0.2)',
                              borderRadius: '3px',
                              border: '1px solid rgba(60, 50, 40, 0.2)',
                            }}>
                              <div style={{
                                fontSize: '0.6rem',
                                color: 'rgba(180, 170, 150, 0.8)',
                                fontWeight: 500,
                              }}>
                                {stat.label}
                              </div>
                              <div style={{
                                fontSize: '0.7rem',
                                color: stat.color,
                                fontWeight: 600,
                                fontFamily: "'JetBrains Mono', monospace",
                              }}>
                                {stat.perLevel}
                              </div>
                              <div style={{
                                fontSize: '0.55rem',
                                color: 'rgba(140, 130, 110, 0.7)',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontStyle: 'italic',
                              }}>
                                {stat.formula}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div style={{
                          padding: '0.4rem',
                          background: 'rgba(139, 69, 19, 0.15)',
                          borderRadius: '4px',
                          border: '1px solid rgba(139, 69, 19, 0.3)',
                        }}>
                          <div style={{
                            fontSize: '0.6rem',
                            color: 'rgba(200, 190, 170, 0.9)',
                            fontWeight: 600,
                            marginBottom: '0.2rem',
                          }}>
                            At Level {level}:
                          </div>
                          <div style={{
                            fontSize: '0.65rem',
                            color: 'rgba(150, 140, 120, 0.9)',
                            fontFamily: "'JetBrains Mono', monospace",
                            lineHeight: '1.5',
                          }}>
                            Life <span style={{ color: '#ef5350' }}>{currentLife}</span> • 
                            Mana <span style={{ color: '#42a5f5' }}>{currentMana}</span> • 
                            Accuracy <span style={{ color: '#f87171' }}>{currentAccuracy}</span> • 
                            Evasion <span style={{ color: '#4ade80' }}>{currentEvasion}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Class Bonuses - Accordion */}
              {classData && (
                <div style={{
                  padding: '0',
                  background: 'linear-gradient(135deg, rgba(20, 18, 15, 0.4) 0%, rgba(15, 12, 10, 0.4) 100%)',
                  borderRadius: '6px',
                  border: '1px solid rgba(120, 100, 70, 0.4)',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                }}>
                  <div
                    onClick={() => setIsBonusesExpanded(!isBonusesExpanded)}
                    style={{
                      padding: '0.6rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isBonusesExpanded 
                        ? 'rgba(139, 69, 19, 0.2)' 
                        : 'transparent',
                      transition: 'background 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <div style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: classData.primaryColor || '#c9a227',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontFamily: "'Cinzel', Georgia, serif",
                    }}>
                      {classData.name} Bonuses
                    </div>
                    <motion.div
                      animate={{ rotate: isBonusesExpanded ? 180 : 0 }}
                      transition={{ 
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                        mass: 0.8
                      }}
                      style={{
                        fontSize: '0.8rem',
                        color: classData.primaryColor || '#c9a227',
                        transformOrigin: 'center',
                      }}
                    >
                      ▼
                    </motion.div>
                  </div>
                  
                  <AnimatePresence initial={false}>
                    {isBonusesExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ 
                          height: {
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                            mass: 0.6
                          },
                          opacity: {
                            duration: 0.15,
                            ease: [0.4, 0, 0.2, 1]
                          }
                        }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          padding: '0.6rem',
                          paddingTop: '0',
                        }}>
                          <div style={{
                            fontSize: '0.55rem',
                            color: 'rgba(150, 140, 120, 0.8)',
                            marginBottom: '0.5rem',
                            fontStyle: 'italic',
                            padding: '0.3rem 0.4rem',
                            background: 'rgba(0, 0, 0, 0.2)',
                            borderRadius: '3px',
                            border: '1px solid rgba(60, 50, 40, 0.2)',
                          }}>
                            Scaling: <span style={{ color: classData.primaryColor || '#c9a227', fontWeight: 600 }}>{Math.round(classMultiplier * 100)}%</span> at level {level} (10% at 1, 100% at 100)
                          </div>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.4rem',
                          }}>
                            {Object.entries(classBonuses)
                              .filter(([_, value]) => value !== 0 && value !== undefined)
                              .map(([key, value]) => {
                                const statKey = key as keyof BaseStats;
                                const isNoScale = noScaleStats.includes(statKey);
                                
                                return (
                                  <div key={key} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.15rem',
                                    padding: '0.3rem 0.4rem',
                                    background: 'rgba(0, 0, 0, 0.2)',
                                    borderRadius: '3px',
                                    border: '1px solid rgba(60, 50, 40, 0.2)',
                                  }}>
                                    <div style={{
                                      fontSize: '0.6rem',
                                      color: 'rgba(180, 170, 150, 0.8)',
                                      fontWeight: 500,
                                    }}>
                                      {formatStatName(key)}
                                    </div>
                                    <div style={{
                                      fontSize: '0.7rem',
                                      color: isNoScale ? '#c084fc' : classData.primaryColor || '#8b5cf6',
                                      fontWeight: 600,
                                      fontFamily: "'JetBrains Mono', monospace",
                                    }}>
                                      {formatStatValue(key, value)}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    );
  } catch (error) {
    console.error('Error in BaseStatsSection:', error);
    return (
      <div style={{
        marginBottom: '0.75rem',
        padding: '0.6rem',
        background: 'rgba(239, 68, 68, 0.3)',
        borderRadius: '6px',
        border: '2px solid #ef4444',
        color: '#ef4444',
        fontSize: '0.75rem',
        fontWeight: 700,
      }}>
        Base Stats & Scaling (Error: {error instanceof Error ? error.message : 'Unknown'})
      </div>
    );
  }
}

// Attribute circle with bonuses tooltip
function AttributeCircleWithBonuses({
  value,
  label,
  color,
  textColor,
  labelColor,
  bonuses,
  character,
}: {
  value: number;
  label: string;
  color: string;
  textColor: string;
  labelColor: string;
  bonuses: Array<{ label: string; value: string; formula: string }>;
  character: Character;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);
  
  // Calculate tooltip position to stay on screen
  const tooltipPos = useMemo(() => {
    if (!isHovered) return { x: 0, y: 0 };
    
    const tooltipWidth = 280;
    const estimatedHeight = 200;
    
    let x = mousePos.x + 15;
    let y = mousePos.y - 10;
    
    // Keep on screen horizontally
    if (x + tooltipWidth > window.innerWidth - 10) {
      x = mousePos.x - tooltipWidth - 15;
    }
    if (x < 10) x = 10;
    
    // Keep on screen vertically
    if (y + estimatedHeight > window.innerHeight - 10) {
      y = window.innerHeight - estimatedHeight - 10;
    }
    if (y < 10) y = 10;
    
    return { x, y };
  }, [isHovered, mousePos]);
  
  // Get darker shade for gradient
  const darkColor = color === '#8b4513' ? '#5d2e0a' : 
                    color === '#1e88e5' ? '#0d47a1' : 
                    '#1b5e20';
  
  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.15rem',
          cursor: 'help',
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${color}, ${darkColor})`,
          border: `2px solid ${color}cc`,
          boxShadow: `0 0 8px ${color}66, inset 0 -4px 8px rgba(0,0,0,0.4)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: textColor,
          fontFamily: "'JetBrains Mono', monospace",
          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}>
          {value}
        </div>
        <span style={{ 
          fontSize: '0.5rem', 
          color: labelColor, 
          fontWeight: 600, 
          textTransform: 'uppercase' 
        }}>
          {label}
        </span>
        {/* Compact bonus display below label */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.1rem',
          marginTop: '0.1rem',
          fontSize: '0.5rem',
          color: 'rgba(150, 140, 120, 0.7)',
          textAlign: 'center',
          lineHeight: '1.2',
        }}>
          {bonuses.map((bonus, idx) => (
            <div key={idx} style={{ whiteSpace: 'nowrap' }}>
              {bonus.value}
            </div>
          ))}
        </div>
      </div>
      
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            key={`attribute-${label}-tooltip`}
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              left: tooltipPos.x,
              top: tooltipPos.y,
              zIndex: 10000,
              background: 'linear-gradient(180deg, rgba(25, 22, 18, 0.98) 0%, rgba(15, 12, 10, 0.99) 100%)',
              border: '1px solid rgba(120, 100, 70, 0.6)',
              borderRadius: '6px',
              padding: '0.6rem 0.8rem',
              minWidth: '200px',
              maxWidth: '280px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
              pointerEvents: 'none',
            }}
          >
            <div style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#c9a227',
              borderBottom: '1px solid rgba(120, 100, 70, 0.3)',
              paddingBottom: '0.3rem',
              marginBottom: '0.4rem',
              fontFamily: "'Cinzel', Georgia, serif",
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {label} ({value})
            </div>
            
            {bonuses.map((bonus, idx) => (
              <div key={idx} style={{ marginBottom: idx < bonuses.length - 1 ? '0.5rem' : 0 }}>
                <div style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: 'rgba(200, 190, 170, 0.9)',
                  marginBottom: '0.2rem',
                }}>
                  {bonus.label}: {bonus.value}
                </div>
                <div style={{
                  fontSize: '0.6rem',
                  color: 'rgba(150, 140, 120, 0.8)',
                  fontFamily: "'JetBrains Mono', monospace",
                  lineHeight: '1.4',
                  whiteSpace: 'pre-line',
                  paddingLeft: '0.3rem',
                  borderLeft: '2px solid rgba(120, 100, 70, 0.3)',
                }}>
                  {bonus.formula}
                </div>
              </div>
            ))}
            
            <div style={{
              marginTop: '0.4rem',
              paddingTop: '0.4rem',
              borderTop: '1px solid rgba(120, 100, 70, 0.3)',
              fontSize: '0.6rem',
              color: 'rgba(160, 150, 130, 0.6)',
              fontStyle: 'italic',
            }}>
              Character: {character.name} (Level {character.level})
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


// Stat row component with tooltip support
function StatRow({ 
  label, 
  value, 
  color = 'rgba(200, 190, 170, 0.9)',
  breakdown,
  valueFormatter,
  statKey,
  character,
  enemyDamageForLevel,
}: { 
  label: string; 
  value: string | number; 
  color?: string;
  breakdown?: StatBreakdown;
  valueFormatter?: (val: number) => string;
  statKey?: keyof BaseStats;
  character?: Character;
  enemyDamageForLevel?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [copyFeedback, setCopyFeedback] = useState(false);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);
  
  const handleClick = useCallback(() => {
    if (breakdown && statKey && character) {
      const copyText = generateStatCopyText(statKey, label, breakdown, character, enemyDamageForLevel);
      navigator.clipboard.writeText(copyText).then(() => {
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    }
  }, [breakdown, statKey, character, label, enemyDamageForLevel]);
  
  return (
    <>
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.2rem 0',
          fontSize: '0.72rem',
          borderBottom: '1px solid rgba(60, 50, 40, 0.2)',
          cursor: breakdown ? 'pointer' : 'default',
          background: isHovered && breakdown ? 'rgba(201, 162, 39, 0.05)' : 'transparent',
          marginLeft: '-0.25rem',
          marginRight: '-0.25rem',
          paddingLeft: '0.25rem',
          paddingRight: '0.25rem',
          borderRadius: '2px',
          transition: 'background 0.1s ease',
          position: 'relative',
        }}
        title={breakdown ? 'Click to copy all stat information' : undefined}
      >
        {copyFeedback && (
          <div style={{
            position: 'absolute',
            top: '-1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(20, 18, 14, 0.95)',
            border: '1px solid rgba(201, 162, 39, 0.6)',
            borderRadius: '4px',
            padding: '0.2rem 0.4rem',
            fontSize: '0.65rem',
            color: '#c9a227',
            whiteSpace: 'nowrap',
            zIndex: 10001,
            pointerEvents: 'none',
          }}>
            Copied to clipboard!
          </div>
        )}
        <span style={{ 
          color: isHovered && breakdown ? 'rgba(200, 190, 170, 0.95)' : 'rgba(160, 150, 130, 0.8)',
          transition: 'color 0.1s ease',
        }}>
          {label}
        </span>
        <span style={{ color, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{value}</span>
      </div>
      
      {/* Breakdown tooltip */}
      <AnimatePresence>
        {isHovered && breakdown && (
          <StatBreakdownTooltip 
            breakdown={breakdown} 
            label={label} 
            position={mousePos}
            valueFormatter={valueFormatter}
            statKey={statKey}
            character={character}
            enemyDamageForLevel={enemyDamageForLevel}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Stats section component
function StatsSection({ title, icon, children, color = '#c9a227' }: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        marginBottom: '0.4rem',
        paddingBottom: '0.3rem',
        borderBottom: `1px solid ${color}40`,
      }}>
        <span style={{ color, fontSize: '0.85rem' }}>{icon}</span>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontFamily: "'Cinzel', Georgia, serif",
        }}>{title}</span>
      </div>
      <div style={{ paddingLeft: '0.25rem' }}>
        {children}
      </div>
    </div>
  );
}

interface GearSlotsProps {
  character: Character;
  inventory: Item[];
  heldItemId?: string | null;
  onEquipHeldItem?: (slot: GearSlot) => void;
  onPickupEquipped?: (slot: GearSlot, itemId: string) => void;
}

export function GearSlots({ character, inventory, heldItemId, onEquipHeldItem, onPickupEquipped }: GearSlotsProps) {
  const classData = character.classId ? getClassById(character.classId) : null;
  const classColors = character.classId ? getClassColor(character.classId) : null;
  const primaryColor = classColors?.primary || '#c9a227';
  const equippedCount = Object.values(character.equippedGear).filter(Boolean).length;
  const gear = character.equippedGear;
  
  // Calculate total stats for requirement checking on tooltips
  const totalStats = useMemo(() => 
    calculateTotalCharacterStats(character, inventory),
    [character, inventory]
  );
  
  // Get enemy damage for this character's level (for Phys DR display)
  const enemyDamageForLevel = useMemo(() => {
    const monsterStats = getMonsterStatsForLevel(character.level);
    return monsterStats.physical_damage;
  }, [character.level]);
  
  const equipItem = useGameStore(state => state.equipItem);
  const unequipItem = useGameStore(state => state.unequipItem);

  const handleEquip = useCallback((slot: GearSlot, itemId: string) => {
    equipItem(character.id, slot, itemId);
  }, [character.id, equipItem]);

  const handleUnequip = useCallback((slot: GearSlot) => {
    unequipItem(character.id, slot);
  }, [character.id, unequipItem]);
  
  // Calculate total stats (this is the source of truth - matches calculateTotalCharacterStats)
  const calculatedTotalStats = useMemo(() => 
    calculateTotalCharacterStats(character, inventory),
    [character, inventory]
  );
  
  // Calculate stat breakdowns (for tooltip display)
  // Note: breakdowns.total should match calculatedTotalStats for each stat
  const breakdowns = useMemo(() => ({
    // Offensive
    accuracy: getStatBreakdown('accuracy', character, inventory),
    criticalStrikeChance: getStatBreakdown('criticalStrikeChance', character, inventory),
    criticalStrikeMultiplier: getStatBreakdown('criticalStrikeMultiplier', character, inventory),
    increasedDamage: getStatBreakdown('increasedDamage', character, inventory),
    // Defensive
    life: getStatBreakdown('life', character, inventory),
    mana: getStatBreakdown('mana', character, inventory),
    energyShield: getStatBreakdown('energyShield', character, inventory),
    armor: getStatBreakdown('armor', character, inventory),
    evasion: getStatBreakdown('evasion', character, inventory),
    blockChance: getStatBreakdown('blockChance', character, inventory),
    spellBlockChance: getStatBreakdown('spellBlockChance', character, inventory),
    spellSuppressionChance: getStatBreakdown('spellSuppressionChance', character, inventory),
    // Resistances
    fireResistance: getStatBreakdown('fireResistance', character, inventory),
    coldResistance: getStatBreakdown('coldResistance', character, inventory),
    lightningResistance: getStatBreakdown('lightningResistance', character, inventory),
    chaosResistance: getStatBreakdown('chaosResistance', character, inventory),
    // Attributes
    strength: getStatBreakdown('strength', character, inventory),
    dexterity: getStatBreakdown('dexterity', character, inventory),
    intelligence: getStatBreakdown('intelligence', character, inventory),
    lifeRegeneration: getStatBreakdown('lifeRegeneration', character, inventory),
    manaRegeneration: getStatBreakdown('manaRegeneration', character, inventory),
  }), [character, inventory]);

  return (
    <div 
      style={{ 
        position: 'relative',
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        minHeight: 0,
        background: 'linear-gradient(180deg, rgba(18, 15, 12, 0.99) 0%, rgba(12, 10, 8, 0.99) 100%)',
        border: '1px solid rgba(80, 65, 50, 0.5)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Velvety textured background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/tilebackground.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.04,
        pointerEvents: 'none',
      }} />
      
      {/* Vignette overlay for depth */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 30%, transparent 20%, rgba(0,0,0,0.4) 100%)',
        pointerEvents: 'none',
      }} />
      
      {/* Character Info Header - PoE2 Style */}
      <div style={{ 
        flexShrink: 0, 
        padding: '0.75rem 1rem',
        background: 'linear-gradient(180deg, rgba(25, 20, 15, 0.98) 0%, rgba(15, 12, 10, 0.98) 100%)',
        borderBottom: '1px solid rgba(90, 75, 50, 0.4)',
        position: 'relative',
      }}>
        {/* Top bar with "Character" label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.6rem',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(120, 100, 70, 0.4), transparent)',
          }} />
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#c9a227',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontFamily: "'Cinzel', Georgia, serif",
            background: 'rgba(15, 12, 10, 1)',
            padding: '0 0.75rem',
            position: 'relative',
          }}>Character</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Character Info */}
          <div style={{ flex: 1 }}>
            {/* Class Name (prominent) */}
            <div style={{ marginBottom: '0.4rem' }}>
              <div style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: primaryColor,
                fontFamily: "'Cinzel', Georgia, serif",
                textShadow: `0 0 10px ${primaryColor}40`,
                marginBottom: '0.1rem',
              }}>
                {classData?.name || character.role.toUpperCase()}
              </div>
              <div style={{
                fontSize: '0.65rem',
                color: 'rgba(160, 140, 100, 0.8)',
                fontStyle: 'italic',
              }}>
                Level {character.level}
              </div>
            </div>
            
            {/* Core Resources - Life, Mana, ES */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {/* Life */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, #ef5350, #b71c1c)',
                  border: '1px solid rgba(180, 30, 30, 0.6)',
                  boxShadow: '0 0 6px rgba(239, 68, 68, 0.5)',
                }} />
                <span style={{ fontSize: '0.7rem', color: '#ef5350', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                  {breakdowns.life.total}
                </span>
              </div>
              
              {/* Mana */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, #42a5f5, #1565c0)',
                  border: '1px solid rgba(30, 100, 180, 0.6)',
                  boxShadow: '0 0 6px rgba(66, 165, 245, 0.5)',
                }} />
                <span style={{ fontSize: '0.7rem', color: '#42a5f5', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                  {breakdowns.mana.total}
                </span>
              </div>
              
              {/* Energy Shield */}
              {breakdowns.energyShield.total > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, #ab47bc, #6a1b9a)',
                    border: '1px solid rgba(120, 40, 140, 0.6)',
                    boxShadow: '0 0 6px rgba(171, 71, 188, 0.5)',
                  }} />
                  <span style={{ fontSize: '0.7rem', color: '#ab47bc', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                    {breakdowns.energyShield.total}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Attributes - circular orbs with bonuses */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            {/* Strength */}
            <AttributeCircleWithBonuses
              value={breakdowns.strength.total}
              label="Str"
              color="#8b4513"
              textColor="#ffd54f"
              labelColor="rgba(139, 69, 19, 0.9)"
              bonuses={[
                {
                  label: 'Life Bonus',
                  value: `+${calculateLifeFromStrength(calculatedTotalStats.strength)}`,
                  formula: `+1 Life per 2 Strength\nCurrent: ${calculatedTotalStats.strength} Str = +${calculateLifeFromStrength(calculatedTotalStats.strength)} Life`
                },
                {
                  label: 'Melee Damage',
                  value: `+${Math.round(calculatedTotalStats.strength / 5)}%`,
                  formula: `+1% Melee Physical Damage per 5 Strength\nCurrent: ${calculatedTotalStats.strength} Str = +${Math.round(calculatedTotalStats.strength / 5)}%`
                }
              ]}
              character={character}
            />
            
            {/* Intelligence */}
            <AttributeCircleWithBonuses
              value={breakdowns.intelligence.total}
              label="Int"
              color="#1e88e5"
              textColor="#bbdefb"
              labelColor="rgba(30, 136, 229, 0.9)"
              bonuses={[
                {
                  label: 'Mana Bonus',
                  value: `+${calculateManaFromIntelligence(calculatedTotalStats.intelligence)}`,
                  formula: `+1 Mana per 2 Intelligence\nCurrent: ${calculatedTotalStats.intelligence} Int = +${calculateManaFromIntelligence(calculatedTotalStats.intelligence)} Mana`
                },
                {
                  label: 'Energy Shield',
                  value: `+${Math.round(calculatedTotalStats.intelligence / 5)}%`,
                  formula: `+1% Maximum Energy Shield per 5 Intelligence\nCurrent: ${calculatedTotalStats.intelligence} Int = +${Math.round(calculatedTotalStats.intelligence / 5)}%`
                }
              ]}
              character={character}
            />
            
            {/* Dexterity */}
            <AttributeCircleWithBonuses
              value={breakdowns.dexterity.total}
              label="Dex"
              color="#43a047"
              textColor="#c8e6c9"
              labelColor="rgba(67, 160, 71, 0.9)"
              bonuses={[
                {
                  label: 'Accuracy Bonus',
                  value: `+${calculateAccuracyFromDexterity(calculatedTotalStats.dexterity)}`,
                  formula: `+2 Accuracy per Dexterity\nCurrent: ${calculatedTotalStats.dexterity} Dex = +${calculateAccuracyFromDexterity(calculatedTotalStats.dexterity)} Accuracy`
                },
                {
                  label: 'Evasion Rating',
                  value: `+${Math.round(calculatedTotalStats.dexterity / 5)}%`,
                  formula: `+1% Evasion Rating per 5 Dexterity\nCurrent: ${calculatedTotalStats.dexterity} Dex = +${Math.round(calculatedTotalStats.dexterity / 5)}%`
                }
              ]}
              character={character}
            />
          </div>
        </div>
      </div>
      
      {/* Two-column layout */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        minHeight: 0, 
        padding: '0.75rem', 
        display: 'flex',
        gap: '0.75rem',
      }}>
        {/* Left column - Equipment */}
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1rem',
          minWidth: '460px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '6px',
          border: '1px solid rgba(60, 50, 40, 0.3)',
        }}>
          {/* Equipment header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: '0.75rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid rgba(60, 50, 40, 0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <GiChestArmor style={{ fontSize: '0.85rem', color: '#c9a227' }} />
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#c9a227',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: "'Cinzel', Georgia, serif",
              }}>Equipment</span>
            </div>
            <div style={{
              fontSize: '0.6rem',
              fontWeight: 700,
              color: equippedCount === 10 ? '#4ade80' : 'rgba(180, 170, 150, 0.7)',
              padding: '0.15rem 0.4rem',
              background: equippedCount === 10 
                ? 'rgba(74, 222, 128, 0.15)'
                : 'rgba(0,0,0,0.3)',
              borderRadius: '3px',
              border: `1px solid ${equippedCount === 10 ? 'rgba(74, 222, 128, 0.4)' : 'rgba(100, 90, 70, 0.3)'}`,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {equippedCount}/10
            </div>
          </div>
          
          {/* Equipment grid */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            flex: 1,
            justifyContent: 'center',
          }}>
            {/* Helmet */}
            <EquipmentSlot slot="head" equippedItem={gear.head} inventory={inventory} onEquip={handleEquip} onUnequip={handleUnequip} heldItemId={heldItemId} onEquipHeldItem={onEquipHeldItem} onPickupEquipped={onPickupEquipped} equippedGear={gear} characterLevel={character.level} characterStats={totalStats} />
            
            {/* Main row: Weapon | Ring | Chest | Amulet+Ring | Offhand */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <EquipmentSlot slot="mainHand" equippedItem={gear.mainHand} inventory={inventory} onEquip={handleEquip} onUnequip={handleUnequip} heldItemId={heldItemId} onEquipHeldItem={onEquipHeldItem} onPickupEquipped={onPickupEquipped} equippedGear={gear} characterLevel={character.level} characterStats={totalStats} />
              
              {/* Left ring */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                <EquipmentSlot slot="ring1" equippedItem={gear.ring1} inventory={inventory} onEquip={handleEquip} onUnequip={handleUnequip} heldItemId={heldItemId} onEquipHeldItem={onEquipHeldItem} onPickupEquipped={onPickupEquipped} equippedGear={gear} characterLevel={character.level} characterStats={totalStats} />
              </div>
              
              <EquipmentSlot slot="chest" equippedItem={gear.chest} inventory={inventory} onEquip={handleEquip} onUnequip={handleUnequip} heldItemId={heldItemId} onEquipHeldItem={onEquipHeldItem} onPickupEquipped={onPickupEquipped} equippedGear={gear} characterLevel={character.level} characterStats={totalStats} />
              
              {/* Right side: Amulet on top of Ring */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <EquipmentSlot slot="neck" equippedItem={gear.neck} inventory={inventory} onEquip={handleEquip} onUnequip={handleUnequip} heldItemId={heldItemId} onEquipHeldItem={onEquipHeldItem} onPickupEquipped={onPickupEquipped} equippedGear={gear} characterLevel={character.level} characterStats={totalStats} />
                <EquipmentSlot slot="ring2" equippedItem={gear.ring2} inventory={inventory} onEquip={handleEquip} onUnequip={handleUnequip} heldItemId={heldItemId} onEquipHeldItem={onEquipHeldItem} onPickupEquipped={onPickupEquipped} equippedGear={gear} characterLevel={character.level} characterStats={totalStats} />
              </div>
              
              <EquipmentSlot slot="offHand" equippedItem={gear.offHand} inventory={inventory} onEquip={handleEquip} onUnequip={handleUnequip} heldItemId={heldItemId} onEquipHeldItem={onEquipHeldItem} onPickupEquipped={onPickupEquipped} equippedGear={gear} characterLevel={character.level} characterStats={totalStats} />
            </div>
            
            {/* Bottom row: Gloves | Belt | Boots */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <EquipmentSlot slot="hands" equippedItem={gear.hands} inventory={inventory} onEquip={handleEquip} onUnequip={handleUnequip} heldItemId={heldItemId} onEquipHeldItem={onEquipHeldItem} onPickupEquipped={onPickupEquipped} equippedGear={gear} characterLevel={character.level} characterStats={totalStats} />
              <EquipmentSlot slot="waist" equippedItem={gear.waist} inventory={inventory} onEquip={handleEquip} onUnequip={handleUnequip} heldItemId={heldItemId} onEquipHeldItem={onEquipHeldItem} onPickupEquipped={onPickupEquipped} equippedGear={gear} characterLevel={character.level} characterStats={totalStats} />
              <EquipmentSlot slot="feet" equippedItem={gear.feet} inventory={inventory} onEquip={handleEquip} onUnequip={handleUnequip} heldItemId={heldItemId} onEquipHeldItem={onEquipHeldItem} onPickupEquipped={onPickupEquipped} equippedGear={gear} characterLevel={character.level} characterStats={totalStats} />
            </div>
          </div>
        </div>
        
        {/* Right column - Stats */}
        <div style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
        }}>
          {/* Base Stats & Level Scaling */}
          <div style={{ flexShrink: 0, marginBottom: '0.75rem' }}>
            <BaseStatsSection character={character} />
          </div>
          
          {/* Scrollable stats container */}
          <div style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '0.6rem',
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: '6px',
            border: '1px solid rgba(60, 50, 40, 0.3)',
            minHeight: 0,
          }}>
          
          {/* Stats container */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            marginTop: '0.75rem',
          }}>
            {/* Offensive Stats */}
          <StatsSection title="Offensive" icon={<GiSwordWound />} color="#ef4444">
            <StatRow label="Accuracy" value={breakdowns.accuracy.total} color="#f87171" breakdown={breakdowns.accuracy} statKey="accuracy" character={character} />
            <StatRow label="Crit Chance" value={`${breakdowns.criticalStrikeChance.total.toFixed(1)}%`} color="#fbbf24" breakdown={breakdowns.criticalStrikeChance} valueFormatter={(v) => `+${v.toFixed(1)}%`} statKey="criticalStrikeChance" character={character} />
            <StatRow label="Crit Multi" value={`${breakdowns.criticalStrikeMultiplier.total}%`} color="#fbbf24" breakdown={breakdowns.criticalStrikeMultiplier} valueFormatter={(v) => `+${v}%`} statKey="criticalStrikeMultiplier" character={character} />
            <StatRow label="Increased Damage" value={`${breakdowns.increasedDamage.total}%`} color="#f87171" breakdown={breakdowns.increasedDamage} valueFormatter={(v) => `+${v}%`} statKey="increasedDamage" character={character} />
          </StatsSection>
          
          {/* Defensive Stats */}
          <StatsSection title="Defensive" icon={<GiShield />} color="#3b82f6">
            <StatRow label="Life" value={breakdowns.life.total} color="#ef4444" breakdown={breakdowns.life} statKey="life" character={character} />
            <StatRow label="Energy Shield" value={breakdowns.energyShield.total} color="#60a5fa" breakdown={breakdowns.energyShield} statKey="energyShield" character={character} />
            <StatRow 
              label="Phys DR" 
              value={`${Math.round((1 - calculateArmorReduction(calculatedTotalStats.armor, enemyDamageForLevel)) * 100)}%`} 
              color="#a8a29e" 
              breakdown={breakdowns.armor} 
              valueFormatter={(v) => `+${v} armor`}
              statKey="armor"
              character={character}
              enemyDamageForLevel={enemyDamageForLevel}
            />
            <StatRow 
              label="Evade" 
              value={`${Math.round(calculateEvasionChance(calculatedTotalStats.evasion, 500) * 100)}%`} 
              color="#4ade80" 
              breakdown={breakdowns.evasion}
              valueFormatter={(v) => `+${v} evasion`}
              statKey="evasion"
              character={character}
            />
            <StatRow label="Block" value={`${breakdowns.blockChance.total}%`} color="#a8a29e" breakdown={breakdowns.blockChance} valueFormatter={(v) => `+${v}%`} statKey="blockChance" character={character} />
            <StatRow label="Spell Block" value={`${breakdowns.spellBlockChance.total}%`} color="#60a5fa" breakdown={breakdowns.spellBlockChance} valueFormatter={(v) => `+${v}%`} statKey="spellBlockChance" character={character} />
            <StatRow label="Spell Suppress" value={`${breakdowns.spellSuppressionChance.total}%`} color="#c084fc" breakdown={breakdowns.spellSuppressionChance} valueFormatter={(v) => `+${v}%`} statKey="spellSuppressionChance" character={character} />
          </StatsSection>
          
          {/* Resistances - shows capped% (total%) */}
          <StatsSection title="Resistances" icon={<GiSparkles />} color="#a855f7">
            <StatRow 
              label="Fire" 
              value={`${Math.min(75, breakdowns.fireResistance.total)}% (${breakdowns.fireResistance.total}%)`} 
              color="#f97316" 
              breakdown={breakdowns.fireResistance} 
              valueFormatter={(v) => `+${v}%`}
              statKey="fireResistance"
              character={character}
            />
            <StatRow 
              label="Cold" 
              value={`${Math.min(75, breakdowns.coldResistance.total)}% (${breakdowns.coldResistance.total}%)`} 
              color="#38bdf8" 
              breakdown={breakdowns.coldResistance} 
              valueFormatter={(v) => `+${v}%`}
              statKey="coldResistance"
              character={character}
            />
            <StatRow 
              label="Lightning" 
              value={`${Math.min(75, breakdowns.lightningResistance.total)}% (${breakdowns.lightningResistance.total}%)`} 
              color="#facc15" 
              breakdown={breakdowns.lightningResistance} 
              valueFormatter={(v) => `+${v}%`}
              statKey="lightningResistance"
              character={character}
            />
            <StatRow 
              label="Chaos" 
              value={`${Math.min(75, breakdowns.chaosResistance.total)}% (${breakdowns.chaosResistance.total}%)`} 
              color="#a855f7" 
              breakdown={breakdowns.chaosResistance} 
              valueFormatter={(v) => `+${v}%`}
              statKey="chaosResistance"
              character={character}
            />
          </StatsSection>
          
          {/* Attributes & Regen */}
          <StatsSection title="Attributes" icon={<GiSparkles />} color="#22c55e">
            <StatRow label="Strength" value={breakdowns.strength.total} color="#ef4444" breakdown={breakdowns.strength} statKey="strength" character={character} />
            <StatRow label="Dexterity" value={breakdowns.dexterity.total} color="#4ade80" breakdown={breakdowns.dexterity} statKey="dexterity" character={character} />
            <StatRow label="Intelligence" value={breakdowns.intelligence.total} color="#60a5fa" breakdown={breakdowns.intelligence} statKey="intelligence" character={character} />
            <StatRow label="Life Regen" value={`${breakdowns.lifeRegeneration.total.toFixed(1)}%/s`} color="#f87171" breakdown={breakdowns.lifeRegeneration} valueFormatter={(v) => `+${v.toFixed(1)}%`} statKey="lifeRegeneration" character={character} />
            <StatRow label="Mana Regen" value={`${breakdowns.manaRegeneration.total.toFixed(1)}%/s`} color="#60a5fa" breakdown={breakdowns.manaRegeneration} valueFormatter={(v) => `+${v.toFixed(2)}%`} statKey="manaRegeneration" character={character} />
          </StatsSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
