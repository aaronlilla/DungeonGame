import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Item, ItemAffix, ItemRarity } from '../../types/items';
import { AFFIX_DEFINITIONS } from '../../types/items';
import { getItemBaseName, type ExtendedItem } from '../../systems/poeItemAdapter';
import type { RolledAffix } from '../../types/poeAffixes';
import type { WeaponProperties, ArmourProperties, PoeBaseItem } from '../../types/poeItems';
import { getItemArtUrl, getFallbackArtUrl } from '../../utils/itemArt';
import { ALL_POE_BASE_ITEMS } from '../../data/poeBaseItems';

// PoE-style rarity colors
const RARITY_COLORS: Record<ItemRarity | string, {
  name: string;
  header: string;
  border: string;
}> = {
  normal: {
    name: '#c8c8c8',
    header: 'linear-gradient(180deg, rgba(100, 100, 100, 0.85) 0%, rgba(60, 60, 60, 0.75) 100%)',
    border: '#5a5a5a',
  },
  magic: {
    name: '#8888ff',
    header: 'linear-gradient(180deg, rgba(50, 50, 120, 0.9) 0%, rgba(30, 30, 80, 0.8) 100%)',
    border: '#4444aa',
  },
  rare: {
    name: '#ffff77',
    header: 'linear-gradient(180deg, rgba(90, 80, 40, 0.9) 0%, rgba(50, 45, 20, 0.85) 100%)',
    border: '#8c7a30',
  },
  unique: {
    name: '#af6025',
    header: 'linear-gradient(180deg, rgba(80, 45, 20, 0.9) 0%, rgba(50, 28, 12, 0.85) 100%)',
    border: '#6b3a12',
  },
  legendary: {
    name: '#be5eff',
    header: 'linear-gradient(180deg, rgba(80, 40, 100, 0.9) 0%, rgba(50, 25, 65, 0.85) 100%)',
    border: '#6b3a8a',
  },
};

// Simple separator line like PoE
function Separator() {
  return (
    <div style={{
      height: '1px',
      margin: '6px 0',
      background: 'linear-gradient(90deg, transparent 0%, rgba(120, 100, 80, 0.6) 15%, rgba(120, 100, 80, 0.6) 85%, transparent 100%)',
    }} />
  );
}

// Property line component for base stats
function PropertyLine({ label, value, valueColor = '#fff' }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{
      fontSize: '13px',
      color: '#9a9a9a',
      textAlign: 'center',
      lineHeight: 1.5,
    }}>
      {label}: <span style={{ color: valueColor }}>{value}</span>
    </div>
  );
}

// Check if item is a weapon
function isWeapon(itemClass: string): boolean {
  const weaponClasses = [
    'One Hand Sword', 'Two Hand Sword', 'Thrusting One Hand Sword',
    'One Hand Axe', 'Two Hand Axe',
    'One Hand Mace', 'Two Hand Mace', 'Sceptre',
    'Dagger', 'Rune Dagger',
    'Claw', 'Wand', 'Staff', 'Warstaff', 'Bow'
  ];
  return weaponClasses.includes(itemClass);
}

// Check if item is armour/shield
function isArmour(itemClass: string): boolean {
  const armourClasses = [
    'Body Armour', 'Helmet', 'Gloves', 'Boots', 'Shield'
  ];
  return armourClasses.includes(itemClass);
}

// Weapon properties display
function WeaponPropertiesDisplay({ props, quality = 0 }: { props: WeaponProperties; quality?: number }) {
  // Calculate attacks per second from attack_time (ms)
  const baseAps = 1000 / props.attack_time;
  const aps = baseAps.toFixed(2);
  
  // Calculate physical damage with quality
  const qualityMultiplier = 1 + (quality / 100);
  const minDmg = Math.round(props.physical_damage_min * qualityMultiplier);
  const maxDmg = Math.round(props.physical_damage_max * qualityMultiplier);
  const avgDmg = (minDmg + maxDmg) / 2;
  
  // Calculate DPS
  const pdps = (avgDmg * baseAps).toFixed(1);
  
  // Critical strike chance (stored as * 100)
  const critChance = (props.critical_strike_chance / 100).toFixed(2);
  
  return (
    <>
      <PropertyLine label="Physical Damage" value={`${minDmg}-${maxDmg}`} />
      <PropertyLine label="Critical Strike Chance" value={`${critChance}%`} />
      <PropertyLine label="Attacks per Second" value={aps} />
      {props.range && props.range < 50 && (
        <PropertyLine label="Weapon Range" value={String(props.range)} />
      )}
      <div style={{
        fontSize: '12px',
        color: '#a0a0a0',
        textAlign: 'center',
        marginTop: '2px',
        fontStyle: 'italic',
      }}>
        Physical DPS: {pdps}
      </div>
    </>
  );
}

// Armour properties display
function ArmourPropertiesDisplay({ props, quality = 0 }: { props: ArmourProperties; quality?: number }) {
  const qualityMultiplier = 1 + (quality / 100);
  const lines: JSX.Element[] = [];
  
  if (props.armour) {
    const value = Math.round(((props.armour.min + props.armour.max) / 2) * qualityMultiplier);
    lines.push(<PropertyLine key="armour" label="Armour" value={String(value)} />);
  }
  
  if (props.evasion) {
    const value = Math.round(((props.evasion.min + props.evasion.max) / 2) * qualityMultiplier);
    lines.push(<PropertyLine key="evasion" label="Evasion Rating" value={String(value)} />);
  }
  
  if (props.energy_shield) {
    const value = Math.round(((props.energy_shield.min + props.energy_shield.max) / 2) * qualityMultiplier);
    lines.push(<PropertyLine key="es" label="Energy Shield" value={String(value)} />);
  }
  
  if (props.ward) {
    const value = Math.round(((props.ward.min + props.ward.max) / 2) * qualityMultiplier);
    lines.push(<PropertyLine key="ward" label="Ward" value={String(value)} />);
  }
  
  if (props.block) {
    lines.push(<PropertyLine key="block" label="Chance to Block" value={`${props.block}%`} />);
  }
  
  return <>{lines}</>;
}

// Get item type category for display
function getItemTypeDisplay(baseItem: PoeBaseItem): string {
  const itemClass = baseItem.itemClass;
  
  // For weapons, add "One Handed" or "Two Handed" prefix based on item class
  if (itemClass.includes('One Hand')) return 'One Handed ' + itemClass.replace('One Hand ', '');
  if (itemClass.includes('Two Hand')) return 'Two Handed ' + itemClass.replace('Two Hand ', '');
  
  return itemClass;
}

// Helper to render stat text with newline support
function StatText({ text, color }: { text: string; color: string }) {
  // Split text on newlines and render each line separately
  const lines = text.split('\n');
  
  return (
    <>
      {lines.map((line, i) => (
        <div key={i} style={{
          fontSize: '14px',
          color: color,
          lineHeight: 1.4,
          fontFamily: "'Cormorant', 'Crimson Text', Georgia, serif",
          textAlign: 'center',
        }}>
          {line}
        </div>
      ))}
    </>
  );
}

// Mod line component
function ModLine({ 
  affix, 
  showAdvanced,
  type,
}: { 
  affix: RolledAffix | (ItemAffix & { _poeStats?: string[]; _poeName?: string });
  showAdvanced: boolean;
  type: 'prefix' | 'suffix' | 'implicit';
}) {
  const isRolledAffix = 'stats' in affix && Array.isArray((affix as RolledAffix).stats);
  
  // PoE uses different colors for implicit vs explicit
  // Using lighter blue for better readability
  const modColor = type === 'implicit' ? '#a0a0ff' : '#a0a0ff';
  
  if (isRolledAffix) {
    const rolled = affix as RolledAffix;
    
    // Determine tier color based on tier number
    const getTierColor = (tier: number | undefined) => {
      if (!tier) return '#7a6a5a';
      if (tier === 1) return '#ffcc00'; // Gold for T1
      if (tier === 2) return '#c9a227'; // Yellow for T2
      if (tier === 3) return '#a0a0a0'; // Silver for T3
      return '#6a5a4a'; // Dimmer for lower tiers
    };
    
    const tierColor = getTierColor(rolled.tier);
    
    return (
      <>
        {rolled.stats.map((stat, i) => (
          <StatText key={i} text={stat.text} color={modColor} />
        ))}
        {showAdvanced && (
          <div style={{
            fontSize: '11px',
            color: '#9a8a7a',
            fontStyle: 'italic',
            marginTop: '1px',
            marginBottom: '2px',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>
              {type === 'prefix' ? 'Prefix' : type === 'suffix' ? 'Suffix' : 'Implicit'}
              {rolled.name && rolled.name !== 'Unknown' && ` — "${rolled.name}"`}
              {' '}
              <span style={{ color: '#7a7a7a' }}>
                [iLvl {rolled.ilvl}+]
              </span>
            </span>
            {rolled.tier && (
              <span style={{ 
                color: tierColor, 
                fontWeight: 700,
                fontStyle: 'normal',
                fontSize: '12px',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                T{rolled.tier}
              </span>
            )}
          </div>
        )}
      </>
    );
  }
  
  // Legacy affix format
  const legacyAffix = affix as ItemAffix & { _poeStats?: string[]; _poeName?: string };
  const def = AFFIX_DEFINITIONS.find(d => d.id === legacyAffix.definitionId);
  
  const statText = legacyAffix._poeStats?.[0] || 
    (def ? `+${legacyAffix.value} ${def.statModified.replace(/([A-Z])/g, ' $1').trim()}` : `+${legacyAffix.value}`);
  
  return (
    <>
      <StatText text={statText} color={modColor} />
      {showAdvanced && legacyAffix._poeName && (
        <div style={{
          fontSize: '11px',
          color: '#9a8a7a',
          fontStyle: 'italic',
          marginTop: '1px',
          marginBottom: '2px',
          textAlign: 'center',
        }}>
          ({type === 'prefix' ? 'Prefix' : 'Suffix'}) — "{legacyAffix._poeName}"
        </div>
      )}
    </>
  );
}

interface ItemTooltipProps {
  item: Item;
  position: { x: number; y: number };
  // Optional character info for requirement checking
  characterLevel?: number;
  characterStats?: { strength: number; dexterity: number; intelligence: number };
}

export function ItemTooltip({ item, position, characterLevel, characterStats }: ItemTooltipProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipHeight, setTooltipHeight] = useState(400); // Initial estimate
  
  // Measure actual tooltip height after render
  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const height = tooltipRef.current.getBoundingClientRect().height;
      if (height > 0) {
        setTooltipHeight(height);
      }
    }
  });
  
  // Listen for ALT key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        e.preventDefault();
        setShowAdvanced(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setShowAdvanced(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  const colors = RARITY_COLORS[item.rarity] || RARITY_COLORS.normal;
  const baseName = getItemBaseName(item);
  const extItem = item as ExtendedItem;
  const poeItem = extItem._poeItem;
  
  // Get item art URL - look up fresh base item data for visualIdentity
  const artUrl = useMemo(() => {
    const baseId = poeItem?.baseItem?.id || item.baseId;
    
    // Look up fresh base item data (in case stored item predates visualIdentity)
    const currentBaseItem = ALL_POE_BASE_ITEMS.find(b => b.id === baseId);
    
    if (currentBaseItem?.visualIdentity) {
      const url = getItemArtUrl(currentBaseItem.visualIdentity);
      if (url) return url;
    }
    
    // Fallback: try stored visualIdentity
    if (poeItem?.baseItem?.visualIdentity) {
      const url = getItemArtUrl(poeItem.baseItem.visualIdentity);
      if (url) return url;
    }
    
    // Try to get fallback art based on item class
    const itemClass = currentBaseItem?.itemClass || poeItem?.baseItem?.itemClass;
    if (itemClass) {
      return getFallbackArtUrl(itemClass);
    }
    return null;
  }, [poeItem, item.baseId]);
  
  // Get prefixes, suffixes, and implicits
  let prefixes: (RolledAffix | ItemAffix)[] = [];
  let suffixes: (RolledAffix | ItemAffix)[] = [];
  let implicits: RolledAffix[] = [];
  
  if (poeItem) {
    prefixes = poeItem.prefixes;
    suffixes = poeItem.suffixes;
    implicits = poeItem.implicits;
  } else {
    prefixes = item.prefixes;
    suffixes = item.suffixes;
  }
  
  // Calculate tooltip position
  const tooltipWidth = 340;
  
  let x = position.x + 15;
  let y = position.y + 10;
  
  // Keep tooltip on screen horizontally
  if (x + tooltipWidth > window.innerWidth - 10) {
    x = position.x - tooltipWidth - 15;
  }
  if (x < 10) x = 10;
  
  // Keep tooltip on screen vertically - use measured height
  if (y + tooltipHeight > window.innerHeight - 10) {
    y = window.innerHeight - tooltipHeight - 10;
  }
  if (y < 10) y = 10;
  
  // If tooltip is taller than viewport, pin to top
  if (tooltipHeight > window.innerHeight - 20) {
    y = 10;
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={tooltipRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
        style={{
          position: 'fixed',
          left: x,
          top: y,
          width: tooltipWidth,
          zIndex: 100000,
          pointerEvents: 'none',
          maxHeight: 'calc(100vh - 20px)',
          overflowY: 'auto',
        }}
      >
        {/* Main container - PoE style dark background */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.94)',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
        }}>
          {/* Header section with name and base type */}
          <div style={{
            background: colors.header,
            padding: '8px 12px',
            textAlign: 'center',
            borderBottom: `1px solid ${colors.border}`,
            position: 'relative',
          }}>
            {/* Decorative header edges */}
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '3px',
              background: `linear-gradient(180deg, ${colors.border} 0%, transparent 50%, ${colors.border} 100%)`,
            }} />
            <div style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '3px',
              background: `linear-gradient(180deg, ${colors.border} 0%, transparent 50%, ${colors.border} 100%)`,
            }} />
            
            {/* Item Art Preview */}
            {artUrl && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '6px',
              }}>
                <img
                  src={artUrl}
                  alt={item.name}
                  style={{
                    maxWidth: '64px',
                    maxHeight: '96px',
                    objectFit: 'contain',
                    filter: `drop-shadow(0 0 4px ${colors.name}40)`,
                    imageRendering: 'auto',
                  }}
                  draggable={false}
                  onError={(e) => {
                    // Hide on error
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            
            {/* Item Name */}
            <div style={{
              fontSize: '17px',
              fontWeight: 600,
              color: colors.name,
              fontFamily: "'Cormorant', 'Cinzel', Georgia, serif",
              letterSpacing: '0.02em',
              lineHeight: 1.2,
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            }}>
              {item.name}
            </div>
            
            {/* Base Type */}
            <div style={{
              fontSize: '15px',
              color: colors.name,
              fontFamily: "'Cormorant', 'Cinzel', Georgia, serif",
              marginTop: '2px',
              opacity: 0.9,
            }}>
              {baseName}
            </div>
          </div>
          
          {/* Body content */}
          <div style={{ padding: '8px 12px' }}>
            {/* Item Type (for weapons) */}
            {poeItem && isWeapon(poeItem.baseItem.itemClass) && (
              <div style={{
                fontSize: '13px',
                color: '#7f7f7f',
                textAlign: 'center',
                marginBottom: '4px',
              }}>
                {getItemTypeDisplay(poeItem.baseItem)}
              </div>
            )}
            
            {/* Weapon Properties */}
            {poeItem && isWeapon(poeItem.baseItem.itemClass) && poeItem.baseItem.properties && (
              <>
                <WeaponPropertiesDisplay 
                  props={poeItem.baseItem.properties as WeaponProperties} 
                  quality={poeItem.quality}
                />
                <Separator />
              </>
            )}
            
            {/* Armour Properties */}
            {poeItem && isArmour(poeItem.baseItem.itemClass) && poeItem.baseItem.properties && (
              <>
                <ArmourPropertiesDisplay 
                  props={poeItem.baseItem.properties as ArmourProperties}
                  quality={poeItem.quality}
                />
                <Separator />
              </>
            )}
            
            {/* Requirements */}
            {poeItem?.baseItem.requirements && (
              (() => {
                const reqs = poeItem.baseItem.requirements;
                // Check which requirements are not met
                const meetsLevel = !characterLevel || reqs.level <= 0 || characterLevel >= reqs.level;
                const meetsStr = !characterStats || reqs.strength <= 0 || characterStats.strength >= reqs.strength;
                const meetsDex = !characterStats || reqs.dexterity <= 0 || characterStats.dexterity >= reqs.dexterity;
                const meetsInt = !characterStats || reqs.intelligence <= 0 || characterStats.intelligence >= reqs.intelligence;
                
                // Red color for unmet requirements
                const metColor = '#fff';
                const unmetColor = '#ff4444';
                
                return (
                  <>
                    <div style={{
                      fontSize: '12px',
                      color: '#7f7f7f',
                      textAlign: 'center',
                    }}>
                      Requires{' '}
                      {reqs.level > 0 && (
                        <span>
                          Level <span style={{ color: meetsLevel ? metColor : unmetColor }}>{reqs.level}</span>
                        </span>
                      )}
                      {reqs.strength > 0 && (
                        <span>
                          , <span style={{ color: meetsStr ? metColor : unmetColor }}>{reqs.strength}</span> Str
                        </span>
                      )}
                      {reqs.dexterity > 0 && (
                        <span>
                          , <span style={{ color: meetsDex ? metColor : unmetColor }}>{reqs.dexterity}</span> Dex
                        </span>
                      )}
                      {reqs.intelligence > 0 && (
                        <span>
                          , <span style={{ color: meetsInt ? metColor : unmetColor }}>{reqs.intelligence}</span> Int
                        </span>
                      )}
                    </div>
                    <Separator />
                  </>
                );
              })()
            )}
            
            {/* Item Level */}
            <div style={{
              fontSize: '13px',
              color: '#7f7f7f',
              marginBottom: '4px',
              textAlign: 'center',
            }}>
              Item Level: <span style={{ color: '#fff' }}>{item.itemLevel}</span>
            </div>
            
            <Separator />
            
            {/* Implicits */}
            {implicits.length > 0 && (
              <>
                {implicits.map((implicit, i) => (
                  <ModLine 
                    key={i} 
                    affix={implicit} 
                    showAdvanced={showAdvanced} 
                    type="implicit" 
                  />
                ))}
                <Separator />
              </>
            )}
            
            {/* Explicit Mods - Prefixes first, then suffixes */}
            {prefixes.length > 0 && (
              <>
                {showAdvanced && (
                  <div style={{
                    fontSize: '10px',
                    color: '#5a6a7a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '3px',
                    textAlign: 'center',
                  }}>
                    Prefixes
                  </div>
                )}
                {prefixes.map((prefix, i) => (
                  <ModLine 
                    key={`p-${i}`} 
                    affix={prefix} 
                    showAdvanced={showAdvanced} 
                    type="prefix" 
                  />
                ))}
              </>
            )}
            
            {suffixes.length > 0 && (
              <>
                {showAdvanced && prefixes.length > 0 && (
                  <div style={{ height: '6px' }} />
                )}
                {showAdvanced && (
                  <div style={{
                    fontSize: '10px',
                    color: '#7a6a5a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '3px',
                    textAlign: 'center',
                  }}>
                    Suffixes
                  </div>
                )}
                {suffixes.map((suffix, i) => (
                  <ModLine 
                    key={`s-${i}`} 
                    affix={suffix} 
                    showAdvanced={showAdvanced} 
                    type="suffix" 
                  />
                ))}
              </>
            )}
            
            {/* Corrupted status */}
            {item.corrupted && (
              <>
                <Separator />
                <div style={{
                  fontSize: '14px',
                  color: '#d20000',
                  fontWeight: 600,
                  textAlign: 'center',
                  fontFamily: "'Cormorant', 'Crimson Text', Georgia, serif",
                }}>
                  Corrupted
                </div>
              </>
            )}
            
            {/* ALT hint */}
            {!showAdvanced && (prefixes.length > 0 || suffixes.length > 0) && (
              <>
                <Separator />
                <div style={{
                  textAlign: 'center',
                  fontSize: '11px',
                  color: '#5a5a5a',
                  fontStyle: 'italic',
                }}>
                  Press Alt for mod info
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// Hook for tooltip state management
export function useItemTooltip() {
  const [tooltipItem, setTooltipItem] = useState<Item | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  const showTooltip = (item: Item, x: number, y: number) => {
    setTooltipItem(item);
    setTooltipPosition({ x, y });
  };
  
  const hideTooltip = () => {
    setTooltipItem(null);
  };
  
  const updatePosition = (x: number, y: number) => {
    setTooltipPosition({ x, y });
  };
  
  return {
    tooltipItem,
    tooltipPosition,
    showTooltip,
    hideTooltip,
    updatePosition,
    TooltipComponent: tooltipItem ? (
      <ItemTooltip item={tooltipItem} position={tooltipPosition} />
    ) : null,
  };
}
