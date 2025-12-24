import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GiScrollUnfurled, GiCrossedSwords } from 'react-icons/gi';
import type { Item } from '../../types/items';
import { getItemBaseName, type ExtendedItem } from '../../systems/poeItemAdapter';
import type { RolledAffix } from '../../types/poeAffixes';
import type { WeaponProperties, ArmourProperties } from '../../types/poeItems';
import { ALL_POE_BASE_ITEMS } from '../../data/poeBaseItems';

interface ItemContextMenuProps {
  item: Item;
  position: { x: number; y: number };
  onClose: () => void;
  onEquip?: () => void;
}

// Format item data for copying to clipboard
function formatItemData(item: Item): string {
  const lines: string[] = [];
  const separator = '--------';
  
  const extItem = item as ExtendedItem;
  const poeItem = extItem._poeItem;
  const baseName = getItemBaseName(item);
  
  // Header
  lines.push(separator);
  lines.push(`Rarity: ${item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}`);
  lines.push(item.name);
  lines.push(baseName);
  lines.push(separator);
  
  // Item class and type
  if (poeItem?.baseItem) {
    lines.push(`Item Class: ${poeItem.baseItem.itemClass}`);
  }
  
  // Weapon properties
  if (poeItem?.baseItem.properties) {
    const props = poeItem.baseItem.properties;
    
    // Check if weapon
    if ('physical_damage_min' in props) {
      const weaponProps = props as WeaponProperties;
      const quality = poeItem.quality || 0;
      const qualityMultiplier = 1 + (quality / 100);
      const minDmg = Math.round(weaponProps.physical_damage_min * qualityMultiplier);
      const maxDmg = Math.round(weaponProps.physical_damage_max * qualityMultiplier);
      const aps = (1000 / weaponProps.attack_time).toFixed(2);
      const critChance = (weaponProps.critical_strike_chance / 100).toFixed(2);
      
      lines.push(`Physical Damage: ${minDmg}-${maxDmg}`);
      lines.push(`Critical Strike Chance: ${critChance}%`);
      lines.push(`Attacks per Second: ${aps}`);
      if (weaponProps.range && weaponProps.range < 50) {
        lines.push(`Weapon Range: ${weaponProps.range}`);
      }
    }
    
    // Check if armour
    if ('armour' in props || 'evasion' in props || 'energy_shield' in props) {
      const armourProps = props as ArmourProperties;
      const quality = poeItem.quality || 0;
      const qualityMultiplier = 1 + (quality / 100);
      
      if (armourProps.armour) {
        const value = Math.round(((armourProps.armour.min + armourProps.armour.max) / 2) * qualityMultiplier);
        lines.push(`Armour: ${value}`);
      }
      if (armourProps.evasion) {
        const value = Math.round(((armourProps.evasion.min + armourProps.evasion.max) / 2) * qualityMultiplier);
        lines.push(`Evasion Rating: ${value}`);
      }
      if (armourProps.energy_shield) {
        const value = Math.round(((armourProps.energy_shield.min + armourProps.energy_shield.max) / 2) * qualityMultiplier);
        lines.push(`Energy Shield: ${value}`);
      }
      if (armourProps.block) {
        lines.push(`Chance to Block: ${armourProps.block}%`);
      }
    }
    
    lines.push(separator);
  }
  
  // Requirements
  if (poeItem?.baseItem.requirements) {
    const reqs = poeItem.baseItem.requirements;
    const reqParts: string[] = [];
    if (reqs.level > 0) reqParts.push(`Level: ${reqs.level}`);
    if (reqs.strength > 0) reqParts.push(`Str: ${reqs.strength}`);
    if (reqs.dexterity > 0) reqParts.push(`Dex: ${reqs.dexterity}`);
    if (reqs.intelligence > 0) reqParts.push(`Int: ${reqs.intelligence}`);
    
    if (reqParts.length > 0) {
      lines.push(`Requirements: ${reqParts.join(', ')}`);
      lines.push(separator);
    }
  }
  
  // Quality
  if (poeItem?.quality && poeItem.quality > 0) {
    lines.push(`Quality: +${poeItem.quality}%`);
  }
  
  // Item Level
  lines.push(`Item Level: ${item.itemLevel}`);
  lines.push(separator);
  
  // Implicits
  const implicits = poeItem?.implicits || [];
  if (implicits.length > 0) {
    for (const implicit of implicits) {
      for (const stat of implicit.stats) {
        lines.push(stat.text);
      }
    }
    lines.push(separator);
  }
  
  // Prefixes
  const prefixes: RolledAffix[] = poeItem?.prefixes || [];
  for (const prefix of prefixes) {
    for (const stat of prefix.stats) {
      if (prefix.tier) {
        // Pad the stat text and add tier on the right
        const tierLabel = `[T${prefix.tier}]`;
        lines.push(`${stat.text}  ${tierLabel}`);
      } else {
        lines.push(stat.text);
      }
    }
    if (prefix.name && prefix.name !== 'Unknown') {
      lines.push(`  (Prefix — "${prefix.name}" [iLvl ${prefix.ilvl}+])`);
    }
  }
  
  // Suffixes
  const suffixes: RolledAffix[] = poeItem?.suffixes || [];
  for (const suffix of suffixes) {
    for (const stat of suffix.stats) {
      if (suffix.tier) {
        // Pad the stat text and add tier on the right
        const tierLabel = `[T${suffix.tier}]`;
        lines.push(`${stat.text}  ${tierLabel}`);
      } else {
        lines.push(stat.text);
      }
    }
    if (suffix.name && suffix.name !== 'Unknown') {
      lines.push(`  (Suffix — "${suffix.name}" [iLvl ${suffix.ilvl}+])`);
    }
  }
  
  // Legacy affixes (if no poeItem)
  if (!poeItem && (item.prefixes.length > 0 || item.suffixes.length > 0)) {
    for (const prefix of item.prefixes) {
      lines.push(`+${prefix.value} (Prefix)`);
    }
    for (const suffix of item.suffixes) {
      lines.push(`+${suffix.value} (Suffix)`);
    }
  }
  
  if (prefixes.length > 0 || suffixes.length > 0 || item.prefixes.length > 0 || item.suffixes.length > 0) {
    lines.push(separator);
  }
  
  // Corrupted
  if (item.corrupted) {
    lines.push('Corrupted');
    lines.push(separator);
  }
  
  // Technical Data
  lines.push('--- Technical Data ---');
  const baseId = poeItem?.baseItem?.id || item.baseId;
  lines.push(`ID: ${item.id}`);
  lines.push(`Base ID: ${baseId}`);
  
  // Look up fresh base item data (in case stored item predates visualIdentity)
  const currentBaseItem = ALL_POE_BASE_ITEMS.find(b => b.id === baseId);
  const base = currentBaseItem || poeItem?.baseItem;
  
  if (base) {
    lines.push(`Drop Level: ${base.dropLevel}`);
    lines.push(`Inventory Size: ${base.inventoryWidth}x${base.inventoryHeight}`);
    
    if (base.tags && base.tags.length > 0) {
      lines.push(`Tags: ${base.tags.join(', ')}`);
    }
    
    // Visual identity / artwork (prefer fresh data)
    const visualIdentity = currentBaseItem?.visualIdentity || (poeItem?.baseItem as { visualIdentity?: { ddsFile?: string; id?: string } })?.visualIdentity;
    if (visualIdentity) {
      lines.push(`Artwork: ${visualIdentity.ddsFile}`);
      lines.push(`Art ID: ${visualIdentity.id}`);
    }
  }
  
  lines.push(separator);
  
  return lines.join('\n');
}

export function ItemContextMenu({ item, position, onClose, onEquip }: ItemContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    // Small delay to prevent immediate close from the same click
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }, 10);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  
  // Calculate position to keep menu on screen
  const menuWidth = 200;
  const menuHeight = 120;
  
  let x = position.x;
  let y = position.y;
  
  if (x + menuWidth > window.innerWidth - 10) {
    x = window.innerWidth - menuWidth - 10;
  }
  if (y + menuHeight > window.innerHeight - 10) {
    y = window.innerHeight - menuHeight - 10;
  }
  if (x < 10) x = 10;
  if (y < 10) y = 10;
  
  const handleCopyItem = async () => {
    const formattedData = formatItemData(item);
    
    try {
      await navigator.clipboard.writeText(formattedData);
      setCopied(true);
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error('Failed to copy item data:', err);
    }
  };
  
  const handleEquip = () => {
    onEquip?.();
    onClose();
  };
  
  const menuItems = [
    { 
      label: copied ? 'Copied!' : 'Copy Item Data', 
      icon: <GiScrollUnfurled />, 
      onClick: handleCopyItem,
      color: copied ? '#4ade80' : '#c9a227',
    },
    ...(onEquip ? [{
      label: 'Equip',
      icon: <GiCrossedSwords />,
      onClick: handleEquip,
      color: '#60a5fa',
    }] : []),
  ];
  
  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95, y: -5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -5 }}
        transition={{ duration: 0.1 }}
        style={{
          position: 'fixed',
          left: x,
          top: y,
          zIndex: 100001,
          minWidth: menuWidth,
        }}
      >
        <div style={{
          background: 'linear-gradient(180deg, rgba(30, 26, 20, 0.98) 0%, rgba(18, 15, 12, 0.99) 100%)',
          border: '1px solid rgba(120, 100, 70, 0.6)',
          borderRadius: '6px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '6px 10px',
            background: 'rgba(0,0,0,0.3)',
            borderBottom: '1px solid rgba(120, 100, 70, 0.3)',
            fontSize: '11px',
            color: 'rgba(180, 170, 150, 0.7)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {item.name}
          </div>
          
          {/* Menu Items */}
          <div style={{ padding: '4px 0' }}>
            {menuItems.map((menuItem, index) => (
              <button
                key={index}
                onClick={menuItem.onClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(200, 190, 170, 0.9)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(201, 162, 39, 0.15)';
                  e.currentTarget.style.color = menuItem.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(200, 190, 170, 0.9)';
                }}
              >
                <span style={{ 
                  fontSize: '14px', 
                  color: menuItem.color,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  {menuItem.icon}
                </span>
                {menuItem.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

