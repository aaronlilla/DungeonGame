import { useState } from 'react';
import type { MapItem, Fragment } from '../../types/maps';
import { getMapBaseById, generateMap } from '../../types/maps';
import { useGameStore } from '../../store/gameStore';
import whiteMap from '../../assets/maps/whitemap.png';
import blueMap from '../../assets/maps/bluemap.png';
import greenMap from '../../assets/maps/greenmap.png';
import purpleMap from '../../assets/maps/purplemap.png';
import blackMap from '../../assets/maps/blackmap.png';

interface MapStashProps {
  maps: MapItem[];
  fragments: Fragment[];
  selectedMap: MapItem | null;
  selectedFragment: Fragment | null;
  onSelectMap: (map: MapItem | null) => void;
  onSelectFragment: (fragment: Fragment | null) => void;
  onDragStart: (type: 'map' | 'fragment', item: MapItem | Fragment) => void;
  onDragEnd: () => void;
  highestTierCompleted: number;
}

type TabType = 'maps' | 'fragments';
type SortType = 'tier' | 'rarity' | 'name';

/**
 * Get the map item image based on tier
 * Tier 1-15: white, 16-30: blue, 31-45: green, 46-60: purple, 61+: black
 */
function getMapItemImage(tier: number): string {
  if (tier <= 15) return whiteMap;
  if (tier <= 30) return blueMap;
  if (tier <= 45) return greenMap;
  if (tier <= 60) return purpleMap;
  return blackMap;
}

export function MapStash({
  maps,
  fragments,
  selectedMap,
  selectedFragment,
  onSelectMap,
  onSelectFragment,
  onDragStart,
  onDragEnd,
  highestTierCompleted
}: MapStashProps) {
  const [activeTab, setActiveTab] = useState<TabType>('maps');
  const [sortBy, setSortBy] = useState<SortType>('tier');
  const [filterTier, setFilterTier] = useState<number | null>(null);
  
  const { addMap } = useGameStore();

  // Get unique tiers for filter
  const uniqueTiers = [...new Set(maps.map(m => m.tier))].sort((a, b) => a - b);

  // Sort and filter maps
  const sortedMaps = [...maps]
    .filter(m => filterTier === null || m.tier === filterTier)
    .sort((a, b) => {
      switch (sortBy) {
        case 'tier': return b.tier - a.tier;
        case 'rarity': {
          const order = ['normal', 'magic', 'rare', 'corrupted'];
          return order.indexOf(b.rarity) - order.indexOf(a.rarity);
        }
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const getMapRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'normal': return 'var(--rarity-normal)';
      case 'magic': return 'var(--rarity-magic)';
      case 'rare': return 'var(--rarity-rare)';
      case 'corrupted': return 'var(--rarity-unique)';
      default: return 'var(--text-primary)';
    }
  };

  const getMapRarityBg = (rarity: string): string => {
    switch (rarity) {
      case 'normal': return 'rgba(200, 200, 200, 0.05)';
      case 'magic': return 'rgba(59, 130, 246, 0.08)';
      case 'rare': return 'rgba(255, 215, 0, 0.08)';
      case 'corrupted': return 'rgba(220, 38, 38, 0.08)';
      default: return 'var(--bg-dark)';
    }
  };


  // DEV: Generate test maps
  const handleGenerateTestMaps = () => {
    const maxTier = Math.max(1, highestTierCompleted + 1);
    for (let i = 0; i < 5; i++) {
      const tier = Math.max(1, Math.floor(Math.random() * maxTier) + 1);
      const rarities = ['normal', 'magic', 'magic', 'rare'] as const;
      const rarity = rarities[Math.floor(Math.random() * rarities.length)];
      addMap(generateMap(tier, rarity));
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '0.75rem 1rem',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-dark)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}>
          <h2 style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text-primary)'
          }}>
            📦 Map Stash
          </h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            {maps.length} maps • {fragments.length} fragments
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => setActiveTab('maps')}
            style={{
              flex: 1,
              padding: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: activeTab === 'maps' ? 600 : 400,
              background: activeTab === 'maps' ? 'var(--bg-hover)' : 'transparent',
              border: `1px solid ${activeTab === 'maps' ? 'var(--accent-primary-dim)' : 'var(--border-dim)'}`,
              borderRadius: '4px',
              color: activeTab === 'maps' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            🗺️ Maps ({maps.length})
          </button>
          <button
            onClick={() => setActiveTab('fragments')}
            style={{
              flex: 1,
              padding: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: activeTab === 'fragments' ? 600 : 400,
              background: activeTab === 'fragments' ? 'var(--bg-hover)' : 'transparent',
              border: `1px solid ${activeTab === 'fragments' ? 'var(--accent-arcane)' : 'var(--border-dim)'}`,
              borderRadius: '4px',
              color: activeTab === 'fragments' ? 'var(--accent-arcane)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            🔮 Fragments ({fragments.length})
          </button>
        </div>
      </div>

      {/* Controls */}
      {activeTab === 'maps' && (
        <div style={{
          padding: '0.5rem 1rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.7rem',
              background: 'var(--bg-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              color: 'var(--text-primary)'
            }}
          >
            <option value="tier">Sort: Tier</option>
            <option value="rarity">Sort: Rarity</option>
            <option value="name">Sort: Name</option>
          </select>

          <select
            value={filterTier ?? ''}
            onChange={(e) => setFilterTier(e.target.value ? parseInt(e.target.value) : null)}
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.7rem',
              background: 'var(--bg-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              color: 'var(--text-primary)'
            }}
          >
            <option value="">All Tiers</option>
            {uniqueTiers.map(tier => (
              <option key={tier} value={tier}>Tier {tier}</option>
            ))}
          </select>

          <button
            onClick={handleGenerateTestMaps}
            style={{
              marginLeft: 'auto',
              padding: '0.25rem 0.5rem',
              fontSize: '0.65rem',
              background: 'var(--bg-dark)',
              border: '1px solid var(--border-dim)',
              borderRadius: '4px',
              color: 'var(--text-dim)',
              cursor: 'pointer'
            }}
          >
            + Test Maps
          </button>
        </div>
      )}

      {/* Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '0.75rem'
      }}>
        {activeTab === 'maps' ? (
          <>
            {sortedMaps.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--text-dim)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗺️</div>
                <div>No maps in stash</div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  Maps drop from dungeon bosses
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '0.5rem'
              }}>
                {sortedMaps.map(map => {
                  const base = getMapBaseById(map.baseId);
                  const isSelected = selectedMap?.id === map.id;
                  
                  return (
                    <div
                      key={map.id}
                      draggable
                      onDragStart={() => {
                        onSelectMap(map);
                        onDragStart('map', map);
                      }}
                      onDragEnd={onDragEnd}
                      onClick={() => onSelectMap(isSelected ? null : map)}
                      style={{
                        padding: '0.625rem',
                        background: isSelected ? 'var(--bg-hover)' : getMapRarityBg(map.rarity),
                        border: `1px solid ${isSelected ? getMapRarityColor(map.rarity) : 'var(--border-dim)'}`,
                        borderRadius: '6px',
                        cursor: 'grab',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {/* Tier Badge */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.375rem'
                      }}>
                        <span style={{
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          padding: '0.125rem 0.375rem',
                          background: 'var(--bg-darkest)',
                          borderRadius: '3px',
                          color: 'var(--accent-gold)'
                        }}>
                          T{map.tier}
                        </span>
                        <img 
                          src={getMapItemImage(map.tier)} 
                          alt={base?.name || 'Map'}
                          style={{
                            width: '1.5rem',
                            height: '1.5rem',
                            objectFit: 'contain',
                            imageRendering: 'auto'
                          }}
                        />
                      </div>

                      {/* Map Name */}
                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: getMapRarityColor(map.rarity),
                        marginBottom: '0.25rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {base?.name || 'Map'}
                      </div>

                      {/* Affix Count */}
                      {map.affixes.length > 0 && (
                        <div style={{
                          fontSize: '0.6rem',
                          color: 'var(--text-dim)'
                        }}>
                          {map.affixes.length} affix{map.affixes.length !== 1 ? 'es' : ''}
                        </div>
                      )}

                      {/* Bonuses */}
                      <div style={{
                        display: 'flex',
                        gap: '0.375rem',
                        marginTop: '0.25rem',
                        fontSize: '0.55rem'
                      }}>
                        {map.quantityBonus > 0 && (
                          <span style={{ color: 'var(--accent-success)' }}>
                            +{Math.round(map.quantityBonus * 100)}% Q
                          </span>
                        )}
                        {map.rarityBonus > 0 && (
                          <span style={{ color: 'var(--accent-arcane)' }}>
                            +{Math.round(map.rarityBonus * 100)}% R
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            {fragments.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--text-dim)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔮</div>
                <div>No fragments in stash</div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  Fragments drop from high-tier maps
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '0.5rem'
              }}>
                {fragments.map(fragment => {
                  const isSelected = selectedFragment?.id === fragment.id;
                  
                  return (
                    <div
                      key={fragment.id}
                      draggable
                      onDragStart={() => {
                        onSelectFragment(fragment);
                        onDragStart('fragment', fragment);
                      }}
                      onDragEnd={onDragEnd}
                      onClick={() => onSelectFragment(isSelected ? null : fragment)}
                      style={{
                        padding: '0.75rem',
                        background: isSelected ? 'var(--bg-hover)' : 'rgba(168, 85, 247, 0.05)',
                        border: `1px solid ${isSelected ? 'var(--accent-arcane)' : 'var(--border-dim)'}`,
                        borderRadius: '6px',
                        cursor: 'grab',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                        {fragment.icon}
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        color: 'var(--accent-arcane)',
                        marginBottom: '0.25rem'
                      }}>
                        {fragment.name}
                      </div>
                      <div style={{
                        fontSize: '0.55rem',
                        color: 'var(--text-dim)'
                      }}>
                        +{Math.round((fragment.quantityBonus + fragment.rarityBonus) * 100)}% bonus
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Stats */}
      <div style={{
        padding: '0.625rem 1rem',
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-dark)',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.7rem'
      }}>
        <span style={{ color: 'var(--text-dim)' }}>
          Highest Tier: <span style={{ color: 'var(--accent-gold)' }}>T{highestTierCompleted || 0}</span>
        </span>
        <span style={{ color: 'var(--text-dim)' }}>
          Max Drop: <span style={{ color: 'var(--accent-success)' }}>T{highestTierCompleted + 1}</span>
        </span>
      </div>
    </div>
  );
}

