import { useMemo } from 'react';
import type { Item, ItemAffix } from '../../types/items';
import type { RolledAffix } from '../../types/poeAffixes';
import type { ExtendedItem } from '../../systems/poeItemAdapter';
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

function AffixDisplay({
  affix,
}: {
  affix: RolledAffix | (ItemAffix & { _poeStats?: string[]; _poeName?: string });
}) {
  const isRolledAffix = 'stats' in affix && Array.isArray((affix as RolledAffix).stats);
  const modColor = '#a0a0ff';

  if (isRolledAffix) {
    const rolled = affix as RolledAffix;
    return (
      <>
        {rolled.stats.map((stat: { text: string }, i: number) => (
          <StatText key={i} text={stat.text} color={modColor} />
        ))}
      </>
    );
  }

  const legacyAffix = affix as ItemAffix & { _poeStats?: string[]; _poeName?: string };
  const def = AFFIX_DEFINITIONS.find((d: { id: string }) => d.id === legacyAffix.definitionId);
  const statText = legacyAffix._poeStats?.[0] ||
    (def ? `+${legacyAffix.value} ${def.statModified.replace(/([A-Z])/g, ' $1').trim()}` : `+${legacyAffix.value}`);

  return <StatText text={statText} color={modColor} />;
}

function getItemBaseName(item: Item): string {
  const extItem = item as ExtendedItem;
  if (extItem._poeItem?.baseItem?.name) {
    return extItem._poeItem.baseItem.name;
  }
  const baseItem = ALL_POE_BASE_ITEMS.find(b => b.id === item.baseId);
  return baseItem?.name || item.baseId;
}

interface InlineItemTooltipProps {
  item: Item;
}

export function InlineItemTooltip({ item }: InlineItemTooltipProps) {
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

  return (
    <div style={{
      width: '100%',
      background: 'rgba(0, 0, 0, 0.9)',
      border: `1px solid ${colors.border}`,
      borderRadius: '6px',
      overflow: 'hidden',
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
        {/* Item Level */}
        <div style={{
          fontSize: '11px',
          color: '#7a7a7a',
          textAlign: 'center',
          marginBottom: '4px',
        }}>
          Item Level: {item.itemLevel}
        </div>

        {/* Implicits */}
        {implicits.length > 0 && (
          <>
            <Separator />
            {implicits.map((imp, i) => (
              <AffixDisplay key={`imp-${i}`} affix={imp} />
            ))}
          </>
        )}

        {/* Explicit Mods */}
        {(prefixes.length > 0 || suffixes.length > 0) && (
          <>
            <Separator />
            {prefixes.map((prefix, i) => (
              <AffixDisplay key={`pre-${i}`} affix={prefix} />
            ))}
            {suffixes.map((suffix, i) => (
              <AffixDisplay key={`suf-${i}`} affix={suffix} />
            ))}
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
