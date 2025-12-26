import { useMemo, useState, useEffect } from 'react';
import type { Item, ItemAffix } from '../../types/items';
import type { RolledAffix } from '../../types/poeAffixes';
import type { ExtendedItem } from '../../systems/poeItemAdapter';
import type { WeaponProperties, ArmourProperties } from '../../types/poeItems';
import { ALL_POE_BASE_ITEMS } from '../../data/poeBaseItems';
import { getItemArtUrl, getFallbackArtUrl } from '../../utils/itemArt';
import { AFFIX_DEFINITIONS } from '../../types/items';

// Rarity colors matching ItemTooltip
const RARITY_COLORS: Record<string, {
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
    header: 'linear-gradient(180deg, rgba(100, 60, 30, 0.9) 0%, rgba(60, 35, 15, 0.85) 100%)',
    border: '#8b4513',
  },
};

function Separator() {
  return (
    <div style={{
      height: '1px',
      margin: '6px 0',
      background: 'linear-gradient(90deg, transparent 0%, rgba(120, 100, 80, 0.6) 15%, rgba(120, 100, 80, 0.6) 85%, transparent 100%)',
    }} />
  );
}

// Parse stat text for value highlighting
function StatText({ text, color }: { text: string; color: string }) {
  const parts = text.split(/(\d+(?:\.\d+)?%?)/g);
  return (
    <div style={{ fontSize: '13px', color, lineHeight: 1.4, textAlign: 'center' }}>
      {parts.map((part, i) => {
        if (/^\d+(?:\.\d+)?%?$/.test(part)) {
          return <span key={i} style={{ color: '#fff', fontWeight: 600 }}>{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
}

// Mod line component with advanced view support
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
        {rolled.stats.map((stat: { text: string }, i: number) => (
          <StatText key={i} text={stat.text} color={modColor} />
        ))}
        {showAdvanced && (
          <div style={{
            fontSize: '10px',
            color: '#9a8a7a',
            fontStyle: 'italic',
            marginTop: '1px',
            marginBottom: '2px',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px',
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
                fontSize: '11px',
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
  const def = AFFIX_DEFINITIONS.find((d: { id: string }) => d.id === legacyAffix.definitionId);
  
  const statText = legacyAffix._poeStats?.[0] || 
    (def ? `+${legacyAffix.value} ${def.statModified.replace(/([A-Z])/g, ' $1').trim()}` : `+${legacyAffix.value}`);

  return (
    <>
      <StatText text={statText} color={modColor} />
      {showAdvanced && legacyAffix._poeName && (
        <div style={{
          fontSize: '10px',
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

function getItemBaseName(item: Item): string {
  const extItem = item as ExtendedItem;
  if (extItem._poeItem?.baseItem?.name) {
    return extItem._poeItem.baseItem.name;
  }
  const baseItem = ALL_POE_BASE_ITEMS.find(b => b.id === item.baseId);
  return baseItem?.name || item.baseId;
}

// Property line component for base stats
function PropertyLine({ label, value, valueColor = '#fff' }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{
      fontSize: '12px',
      color: '#9a9a9a',
      textAlign: 'center',
      lineHeight: 1.5,
    }}>
      {label}: <span style={{ color: valueColor, fontWeight: 600 }}>{value}</span>
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
  const baseAps = 1000 / props.attack_time;
  const aps = baseAps.toFixed(2);
  
  const qualityMultiplier = 1 + (quality / 100);
  const minDmg = Math.round(props.physical_damage_min * qualityMultiplier);
  const maxDmg = Math.round(props.physical_damage_max * qualityMultiplier);
  const avgDmg = (minDmg + maxDmg) / 2;
  
  const pdps = (avgDmg * baseAps).toFixed(1);
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
        fontSize: '11px',
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

interface InlineItemTooltipProps {
  item: Item;
}

export function InlineItemTooltip({ item }: InlineItemTooltipProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
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

  const artUrl = useMemo(() => {
    const baseId = poeItem?.baseItem?.id || item.baseId;
    const currentBaseItem = ALL_POE_BASE_ITEMS.find(b => b.id === baseId);

    if (currentBaseItem?.visualIdentity) {
      const url = getItemArtUrl(currentBaseItem.visualIdentity);
      if (url) return url;
    }

    if (poeItem?.baseItem?.visualIdentity) {
      const url = getItemArtUrl(poeItem.baseItem.visualIdentity);
      if (url) return url;
    }

    const itemClass = currentBaseItem?.itemClass || poeItem?.baseItem?.itemClass;
    if (itemClass) {
      return getFallbackArtUrl(itemClass);
    }
    return null;
  }, [poeItem, item.baseId]);

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

  // Get base item for properties
  const baseId = poeItem?.baseItem?.id || item.baseId;
  const baseItem = ALL_POE_BASE_ITEMS.find(b => b.id === baseId);
  const itemClass = poeItem?.baseItem?.itemClass || baseItem?.itemClass || '';
  const quality = poeItem?.quality || item.quality || 0;
  
  // Get properties from poeItem if available, otherwise from base item
  const weaponProps = poeItem?.baseItem?.properties as WeaponProperties | undefined;
  const armourProps = poeItem?.baseItem?.properties as ArmourProperties | undefined;
  
  // Check if item has weapon or armour properties
  const hasWeaponProps = isWeapon(itemClass) && (weaponProps || baseItem?.properties?.weapon);
  const hasArmourProps = isArmour(itemClass) && (armourProps || baseItem?.properties?.armour);

  return (
    <div style={{
      width: '100%',
      maxHeight: '600px',
      background: 'rgba(0, 0, 0, 0.9)',
      border: `1px solid ${colors.border}`,
      borderRadius: '6px',
      overflow: 'auto',
    }}>
      {/* Header */}
      <div style={{
        background: colors.header,
        padding: '8px 12px',
        textAlign: 'center',
        borderBottom: `1px solid ${colors.border}`,
        position: 'relative',
      }}>
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
                maxWidth: '48px',
                maxHeight: '72px',
                objectFit: 'contain',
                filter: `drop-shadow(0 0 4px ${colors.name}40)`,
              }}
              draggable={false}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          color: colors.name,
          fontFamily: "'Cormorant', 'Cinzel', Georgia, serif",
          letterSpacing: '0.02em',
          lineHeight: 1.2,
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        }}>
          {item.name}
        </div>

        <div style={{
          fontSize: '12px',
          color: '#9a9a9a',
          marginTop: '2px',
        }}>
          {baseName}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '8px 10px' }}>
        {/* Item Class */}
        {itemClass && (
          <div style={{
            fontSize: '11px',
            color: '#9a9a9a',
            textAlign: 'center',
            marginBottom: '4px',
          }}>
            {itemClass}
          </div>
        )}

        {/* Quality */}
        {quality > 0 && (
          <div style={{
            fontSize: '12px',
            color: '#8888ff',
            textAlign: 'center',
            marginBottom: '4px',
          }}>
            Quality: +{quality}%
          </div>
        )}

        {/* Weapon Properties */}
        {hasWeaponProps && (weaponProps || baseItem?.properties?.weapon) && (
          <>
            <Separator />
            <WeaponPropertiesDisplay 
              props={(weaponProps || baseItem?.properties?.weapon) as WeaponProperties} 
              quality={quality} 
            />
          </>
        )}

        {/* Armour Properties */}
        {hasArmourProps && (armourProps || baseItem?.properties?.armour) && (
          <>
            <Separator />
            <ArmourPropertiesDisplay 
              props={(armourProps || baseItem?.properties?.armour) as ArmourProperties} 
              quality={quality} 
            />
          </>
        )}

        {/* Requirements */}
        {(poeItem?.baseItem?.requirements || baseItem?.requirements) && (() => {
          const requirements = poeItem?.baseItem?.requirements || baseItem?.requirements;
          if (!requirements) return null;
          
          const reqs: string[] = [];
          
          // Check for level requirement
          const level = requirements.level || 0;
          if (level > 1) {
            reqs.push(`Level ${level}`);
          }
          
          // Check for stat requirements - handle both formats
          const str = requirements.strength || (requirements as any).str || 0;
          const dex = requirements.dexterity || (requirements as any).dex || 0;
          const int = requirements.intelligence || (requirements as any).int || 0;
          
          if (str > 0) {
            reqs.push(`${str} Str`);
          }
          if (dex > 0) {
            reqs.push(`${dex} Dex`);
          }
          if (int > 0) {
            reqs.push(`${int} Int`);
          }
          
          if (reqs.length === 0) return null;
          
          return (
            <>
              <Separator />
              <div style={{
                fontSize: '12px',
                color: '#9a9a9a',
                textAlign: 'center',
                lineHeight: 1.5,
              }}>
                Requires {reqs.join(', ')}
              </div>
            </>
          );
        })()}

        {/* Item Level */}
        <Separator />
        <div style={{
          fontSize: '11px',
          color: '#7a7a7a',
          textAlign: 'center',
        }}>
          Item Level: {item.itemLevel}
        </div>

        {/* Implicits */}
        {implicits.length > 0 && (
          <>
            <Separator />
            {implicits.map((imp, i) => (
              <ModLine 
                key={`imp-${i}`} 
                affix={imp} 
                showAdvanced={showAdvanced}
                type="implicit"
              />
            ))}
          </>
        )}

        {/* Explicit Mods */}
        {(prefixes.length > 0 || suffixes.length > 0) && (
          <>
            <Separator />
            {prefixes.length > 0 && (
              <>
                {showAdvanced && (
                  <div style={{
                    fontSize: '9px',
                    color: '#5a6a7a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '2px',
                    textAlign: 'center',
                  }}>
                    Prefixes
                  </div>
                )}
                {prefixes.map((prefix, i) => (
                  <ModLine 
                    key={`pre-${i}`} 
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
                  <div style={{ height: '4px' }} />
                )}
                {showAdvanced && (
                  <div style={{
                    fontSize: '9px',
                    color: '#7a6a5a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '2px',
                    textAlign: 'center',
                  }}>
                    Suffixes
                  </div>
                )}
                {suffixes.map((suffix, i) => (
                  <ModLine 
                    key={`suf-${i}`} 
                    affix={suffix} 
                    showAdvanced={showAdvanced}
                    type="suffix"
                  />
                ))}
              </>
            )}
          </>
        )}

        {/* Rarity indicator at bottom */}
        <div style={{
          fontSize: '10px',
          color: '#5a5a5a',
          textAlign: 'center',
          marginTop: '6px',
          textTransform: 'capitalize',
        }}>
          {item.rarity} Item
        </div>
      </div>
    </div>
  );
}
