import React, { useState, useEffect, useMemo, memo } from 'react';
import { getItemBaseById } from '../../types/items';
import { CRAFTING_ORBS, useGameStore } from '../../store/gameStore';
import { SKILL_GEMS, SUPPORT_GEMS } from '../../types/skills';
import type { DungeonRunResult, CombatLogEntry, PlayerRunStats } from '../../types/dungeon';
import type { Character } from '../../types/character';
import type { MapLootDrop } from '../../types/combat';
import { getRoleIcon as getRoleIconFromClasses, getClassById } from '../../types/classes';
import type { CharacterRole } from '../../types/character';
import { ItemTooltip } from '../shared/ItemTooltip';
import { GiTrophy, GiSkullCrossedBones, GiCrossedSwords, GiDeathSkull, GiUpgrade, GiScrollUnfurled } from 'react-icons/gi';

interface ResultModalProps {
  runResult: DungeonRunResult;
  uncollectedLoot: MapLootDrop[];
  onCollectLoot: (lootId: string) => void;
  onClose: () => void;
}

type TabType = 'summary' | 'players' | 'log';

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getRoleColor(role: string): string {
  switch (role) {
    case 'tank': return 'var(--role-tank)';
    case 'healer': return 'var(--role-healer)';
    case 'dps': return 'var(--role-dps)';
    default: return 'var(--text-secondary)';
  }
}

function getRoleIcon(role: string): React.ReactNode {
  if (role === 'tank' || role === 'healer' || role === 'dps') {
    return getRoleIconFromClasses(role as CharacterRole);
  }
  return null;
}

// Loot rarity styles
const RARITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  orb: { bg: '#2a2419', text: '#c8b88a', border: '#5a4d3a' },
  common: { bg: '#2a2a2a', text: '#c8c8c8', border: '#4a4a4a' },
  uncommon: { bg: '#152d4a', text: '#8888ff', border: '#3a5a8a' },
  magic: { bg: '#152d4a', text: '#8888ff', border: '#3a5a8a' },
  rare: { bg: '#2a2419', text: '#ffff77', border: '#5a4d3a' },
  epic: { bg: '#301810', text: '#af6025', border: '#6a3a2a' },
  unique: { bg: '#301810', text: '#af6025', border: '#6a3a2a' },
  legendary: { bg: '#251030', text: '#b35dff', border: '#5a3a6a' },
  map: { bg: '#302a20', text: '#d4af37', border: '#6a5a3a' },
  fragment: { bg: '#102525', text: '#5fd4d4', border: '#3a5a5a' },
};

const ORB_NAMES: Record<string, string> = {
  transmutation: 'Orb of Transmutation',
  alteration: 'Orb of Alteration',
  augmentation: 'Orb of Augmentation',
  alchemy: 'Orb of Alchemy',
  chaos: 'Chaos Orb',
  exalted: 'Exalted Orb',
  annulment: 'Orb of Annulment',
  chance: 'Orb of Chance',
  scouring: 'Orb of Scouring',
  regret: 'Orb of Regret',
  divine: 'Divine Orb',
  blessed: 'Blessed Orb',
  chromatic: 'Chromatic Orb',
  jeweller: "Jeweller's Orb",
  fusing: 'Orb of Fusing',
  vaal: 'Vaal Orb',
};

// Ember particle component - optimized with fewer particles and GPU acceleration
const EmberParticles = memo(function EmberParticles({ count = 15, color = '#ff6b35' }: { count?: number; color?: string }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 3,
      size: 2 + Math.random() * 3,
      drift: (Math.random() - 0.5) * 80,
    }));
  }, [count]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: color,
            borderRadius: '50%',
            boxShadow: `0 0 ${p.size}px ${color}`,
            opacity: 0,
            animation: `ember-rise ${p.duration}s ease-out infinite`,
            animationDelay: `${p.delay}s`,
            willChange: 'transform, opacity',
            '--drift': `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}
      <style>{`
        @keyframes ember-rise {
          0% { 
            opacity: 0; 
            transform: translateY(0) translateX(0) scale(1); 
          }
          10% { 
            opacity: 0.7; 
          }
          90% { 
            opacity: 0.2; 
          }
          100% { 
            opacity: 0; 
            transform: translateY(-350px) translateX(var(--drift)) scale(0.4); 
          }
        }
      `}</style>
    </div>
  );
});

// Uncollected Loot Tile Component
function LootTile({ 
  drop, 
  onCollect,
  onHover,
  onLeave 
}: { 
  drop: MapLootDrop; 
  onCollect: () => void;
  onHover: (e: React.MouseEvent) => void;
  onLeave: () => void;
}) {
  const getStyle = () => {
    if (drop.type === 'map') return RARITY_STYLES.map;
    if (drop.type === 'fragment') return RARITY_STYLES.fragment;
    if (drop.type === 'orb') return RARITY_STYLES.orb;
    return RARITY_STYLES[drop.rarity] || RARITY_STYLES.common;
  };

  const getLabel = (): string => {
    switch (drop.type) {
      case 'map': return drop.map?.name || 'Unknown Map';
      case 'fragment': return drop.fragment?.name || 'Fragment';
      case 'orb': 
        const orbName = ORB_NAMES[drop.orbType || ''] || `Orb of ${(drop.orbType || 'Unknown').charAt(0).toUpperCase() + (drop.orbType || '').slice(1)}`;
        const count = drop.orbCount || 1;
        return count > 1 ? `${count}x ${orbName}` : orbName;
      case 'item': return drop.item?.name || 'Item';
      default: return 'Loot';
    }
  };

  const getIndicator = (): string => {
    switch (drop.type) {
      case 'map': return '🗺️';
      case 'fragment': return '💎';
      case 'orb': return '⚪';
      default: return '';
    }
  };

  const style = getStyle();
  
  return (
    <div
      onClick={onCollect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        userSelect: 'none',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = `0 4px 12px rgba(0,0,0,0.4)`;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {getIndicator() && (
        <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>{getIndicator()}</span>
      )}
      <span style={{
        color: style.text,
        fontSize: '0.8rem',
        fontWeight: 600,
        fontFamily: '"Fontin", "Palatino Linotype", serif',
        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
      }}>
        {getLabel()}
      </span>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, subValue, color, icon }: { 
  label: string; 
  value: string | number; 
  subValue?: string; 
  color: string;
  icon?: React.ReactNode;
}) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '8px',
      padding: '1rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`
      }} />
      <div style={{ 
        fontSize: '0.7rem', 
        color: 'rgba(255,255,255,0.5)', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        marginBottom: '0.375rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.375rem'
      }}>
        {icon && <span style={{ fontSize: '0.9rem', color }}>{icon}</span>}
        {label}
      </div>
      <div style={{ 
        fontSize: '1.75rem', 
        fontWeight: 700, 
        color,
        fontFamily: 'JetBrains Mono, monospace',
        textShadow: `0 0 30px ${color}60`
      }}>
        {value}
      </div>
      {subValue && (
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
          {subValue}
        </div>
      )}
    </div>
  );
}

// Player Stats Tab Component
function PlayerStatsTab({ playerStats, team }: { playerStats: PlayerRunStats[]; team: Character[] }) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(playerStats[0]?.id || null);
  const selectedStats = playerStats.find(p => p.id === selectedPlayer);
  
  const sortedByDamage = [...playerStats].sort((a, b) => b.totalDamage - a.totalDamage);
  const maxDamage = Math.max(...playerStats.map(p => p.totalDamage), 1);
  const maxHealing = Math.max(...playerStats.map(p => p.totalHealing), 1);
  const maxDamageTaken = Math.max(...playerStats.map(p => p.damageTaken), 1);
  
  return (
    <div style={{ display: 'flex', gap: '1rem', height: '100%', minHeight: '350px' }}>
      {/* Player List */}
      <div style={{ width: '180px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '0.25rem', fontWeight: 600 }}>
          Party Members
        </div>
        {sortedByDamage.map((player, idx) => (
          <button
            key={player.id}
            onClick={() => setSelectedPlayer(player.id)}
            style={{
              padding: '0.625rem 0.75rem',
              background: selectedPlayer === player.id ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.3)',
              border: `1px solid ${selectedPlayer === player.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono' }}>#{idx + 1}</span>
              <span style={{ fontSize: '0.9rem' }}>{getRoleIcon(player.role)}</span>
              <span style={{ fontWeight: 600, color: getRoleColor(player.role), fontSize: '0.85rem' }}>
                {(() => {
                  const character = team.find(c => c.id === player.id);
                  const classData = character?.classId ? getClassById(character.classId) : null;
                  return classData?.name || player.role.toUpperCase();
                })()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
              <span style={{ color: 'var(--role-dps)' }}>{formatNumber(player.totalDamage)}</span>
              <span style={{ color: 'var(--role-healer)' }}>{formatNumber(player.totalHealing)}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Selected Player Details */}
      {selectedStats && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              borderRadius: '8px', 
              padding: '0.875rem',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Damage</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--role-dps)', fontFamily: 'JetBrains Mono' }}>{formatNumber(selectedStats.totalDamage)}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{selectedStats.dps} DPS</div>
              <div style={{ marginTop: '0.5rem', height: '3px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '2px' }}>
                <div style={{ width: `${(selectedStats.totalDamage / maxDamage) * 100}%`, height: '100%', background: 'var(--role-dps)', borderRadius: '2px' }} />
              </div>
            </div>
            
            <div style={{ 
              background: 'rgba(34, 197, 94, 0.1)', 
              borderRadius: '8px', 
              padding: '0.875rem',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Healing</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--role-healer)', fontFamily: 'JetBrains Mono' }}>{formatNumber(selectedStats.totalHealing)}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{selectedStats.hps} HPS</div>
              <div style={{ marginTop: '0.5rem', height: '3px', background: 'rgba(34, 197, 94, 0.15)', borderRadius: '2px' }}>
                <div style={{ width: `${(selectedStats.totalHealing / maxHealing) * 100}%`, height: '100%', background: 'var(--role-healer)', borderRadius: '2px' }} />
              </div>
            </div>
            
            <div style={{ 
              background: 'rgba(168, 85, 247, 0.1)', 
              borderRadius: '8px', 
              padding: '0.875rem',
              border: '1px solid rgba(168, 85, 247, 0.2)'
            }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Damage Taken</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-secondary)', fontFamily: 'JetBrains Mono' }}>{formatNumber(selectedStats.damageTaken)}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{selectedStats.dtps} DTPS</div>
              <div style={{ marginTop: '0.5rem', height: '3px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '2px' }}>
                <div style={{ width: `${(selectedStats.damageTaken / maxDamageTaken) * 100}%`, height: '100%', background: 'var(--accent-secondary)', borderRadius: '2px' }} />
              </div>
            </div>
          </div>
          
          {/* Breakdown Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <BreakdownPanel title="Damage by Ability" icon="⚔️" color="var(--role-dps)" data={selectedStats.damageBySpell} emptyText="No damage dealt" />
            <BreakdownPanel title="Healing by Ability" icon="💚" color="var(--role-healer)" data={selectedStats.healingBySpell} emptyText="No healing done" />
            <BreakdownPanel title="Damage by Source" icon="👹" color="var(--accent-secondary)" data={selectedStats.damageTakenBySource} emptyText="No damage taken" />
            <BreakdownPanel title="Damage by Ability" icon="💥" color="var(--accent-fire)" data={selectedStats.damageTakenByAbility} emptyText="No damage taken" />
          </div>
        </div>
      )}
    </div>
  );
}

// Breakdown Panel Component
function BreakdownPanel({ title, icon, color, data, emptyText }: {
  title: string;
  icon: string;
  color: string;
  data: Record<string, number>;
  emptyText: string;
}) {
  const entries = Object.entries(data).sort(([, a], [, b]) => b - a);
  const maxValue = entries.length > 0 ? entries[0][1] : 1;
  
  return (
    <div style={{ 
      background: 'rgba(0,0,0,0.3)', 
      borderRadius: '8px', 
      padding: '0.75rem',
      border: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.625rem', color, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        <span>{icon}</span> {title}
      </div>
      <div style={{ maxHeight: '100px', overflow: 'auto' }}>
        {entries.length > 0 ? entries.map(([name, value]) => (
          <div key={name} style={{ marginBottom: '0.375rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.125rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{name}</span>
              <span style={{ color, fontWeight: 500, fontFamily: 'JetBrains Mono' }}>{formatNumber(value)}</span>
            </div>
            <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px' }}>
              <div style={{ width: `${(value / maxValue) * 100}%`, height: '100%', background: color, borderRadius: '1px', opacity: 0.7 }} />
            </div>
          </div>
        )) : (
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontStyle: 'italic' }}>{emptyText}</div>
        )}
      </div>
    </div>
  );
}

// Combat Log Tab
function CombatLogTab({ combatLog }: { combatLog: CombatLogEntry[] }) {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  
  const filteredLog = combatLog.filter(entry => {
    if (filter !== 'all' && entry.type !== filter) return false;
    if (search && !entry.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  
  const getEntryColor = (type: string): string => {
    switch (type) {
      case 'damage': return 'var(--role-dps)';
      case 'heal': return 'var(--role-healer)';
      case 'death': return '#ef4444';
      case 'ability': return 'var(--role-tank)';
      case 'buff': return '#fbbf24';
      case 'debuff': return '#a855f7';
      case 'pull': return '#22d3ee';
      case 'phase': return '#f97316';
      case 'boss': return '#c084fc';
      case 'travel': return 'rgba(255,255,255,0.4)';
      case 'loot': return '#fbbf24';
      default: return 'rgba(255,255,255,0.6)';
    }
  };
  
  const filters = ['all', 'damage', 'heal', 'death', 'ability', 'phase'];
  
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '350px' }}>
      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '0.375rem 0.625rem',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            color: 'white',
            fontSize: '0.75rem',
            width: '150px',
            outline: 'none'
          }}
        />
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.25rem 0.5rem',
              background: filter === f ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.3)',
              border: `1px solid ${filter === f ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'}`,
              borderRadius: '4px',
              color: filter === f ? 'white' : 'rgba(255,255,255,0.5)',
              fontSize: '0.7rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {f}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono' }}>
          {filteredLog.length}/{combatLog.length}
        </span>
      </div>
      
      <div style={{
        flex: 1,
        overflow: 'auto',
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '6px',
        border: '1px solid rgba(255,255,255,0.05)',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.7rem'
      }}>
        {filteredLog.length > 0 ? filteredLog.map((entry, idx) => (
          <div
            key={idx}
            style={{
              padding: '0.375rem 0.625rem',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              display: 'flex',
              gap: '0.625rem',
              alignItems: 'flex-start'
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.4)', minWidth: '42px', fontSize: '0.65rem' }}>
              {formatTime(entry.timestamp)}
            </span>
            <span style={{
              color: getEntryColor(entry.type),
              minWidth: '55px',
              textTransform: 'uppercase',
              fontSize: '0.6rem',
              fontWeight: 600,
              opacity: 0.9
            }}>
              {entry.type}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.8)', flex: 1, fontSize: '0.7rem' }}>
              {entry.message}
            </span>
            {entry.value !== undefined && entry.value > 0 && (
              <span style={{ color: getEntryColor(entry.type), fontWeight: 600 }}>
                {formatNumber(entry.value)}
              </span>
            )}
          </div>
        )) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
            No log entries found
          </div>
        )}
      </div>
    </div>
  );
}

// Build export data
function buildExportData(runResult: DungeonRunResult, team: Character[], inventory: any[]) {
  const characterSnapshots = team.map(char => {
    const equippedItems: Record<string, any> = {};
    Object.entries(char.equippedGear).forEach(([slot, itemId]) => {
      if (itemId) {
        const item = inventory.find((i: any) => i.id === itemId);
        if (item) {
          const base = getItemBaseById(item.baseId);
          equippedItems[slot] = {
            id: item.id,
            name: item.name,
            baseId: item.baseId,
            baseName: base?.name || 'Unknown',
            slot: base?.slot || slot,
            rarity: item.rarity,
            itemLevel: item.itemLevel,
            affixes: item.affixes || [],
            implicitMods: item.implicitMods || [],
            explicitMods: item.explicitMods || []
          };
        }
      }
    });
    
    const skillSetup = char.skillGems.map(equipped => {
      const skillGem = SKILL_GEMS.find(s => s.id === equipped.skillGemId);
      const supportGems = equipped.supportGemIds.map(sgId => {
        const sg = SUPPORT_GEMS.find(s => s.id === sgId);
        return sg ? { id: sg.id, name: sg.name, requiredTags: sg.requiredTags, multipliers: sg.multipliers, manaCostMultiplier: sg.manaCostMultiplier, addedEffects: sg.addedEffects } : null;
      }).filter(Boolean);
      
      return {
        slotIndex: equipped.slotIndex,
        keybind: equipped.keybind,
        usageConfig: equipped.usageConfig,
        skill: skillGem ? { id: skillGem.id, name: skillGem.name, tags: skillGem.tags, baseDamage: skillGem.baseDamage, damageEffectiveness: skillGem.damageEffectiveness, castTime: skillGem.castTime, manaCost: skillGem.manaCost, cooldown: skillGem.cooldown, targetType: skillGem.targetType, damageType: skillGem.damageType, description: skillGem.description } : null,
        supportGems
      };
    });
    
    return { id: char.id, name: char.name, role: char.role, level: char.level, experience: char.experience, portrait: char.portrait, baseStats: char.baseStats, allocatedPassives: char.allocatedPassives, equippedItems, skillSetup };
  });
  
  return {
    ...runResult,
    exportedAt: new Date().toISOString(),
    version: '2.0',
    teamSnapshot: characterSnapshots,
    gameConstants: { tickMs: 100, tickDuration: 0.1, gcdSeconds: 1.0, gcdTicks: 10 }
  };
}

export function ResultModal({ runResult, uncollectedLoot, onCollectLoot, onClose }: ResultModalProps) {
  const isSuccess = runResult.success;
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [isVisible, setIsVisible] = useState(false);
  const [collectedIds, setCollectedIds] = useState<Set<string>>(new Set());
  
  // Tooltip state
  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  
  const team = useGameStore(state => state.team);
  const inventory = useGameStore(state => state.inventory);
  
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);
  
  // Filter out already collected items
  const displayLoot = uncollectedLoot.filter(l => !collectedIds.has(l.id));
  
  const handleCollectLoot = (lootId: string) => {
    setHoveredItem(null);
    setCollectedIds(prev => new Set([...prev, lootId]));
    onCollectLoot(lootId);
  };
  
  const handleCollectAll = () => {
    displayLoot.forEach(loot => {
      onCollectLoot(loot.id);
    });
    setCollectedIds(new Set([...collectedIds, ...displayLoot.map(l => l.id)]));
  };
  
  const exportLog = () => {
    const exportData = buildExportData(runResult, team, inventory);
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dungeon-log-${runResult.dungeonName?.replace(/\s+/g, '-').toLowerCase() || 'unknown'}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const copyLogToClipboard = () => {
    const exportData = buildExportData(runResult, team, inventory);
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
  };
  
  // Calculate total stats from player stats
  const totalDamage = runResult.playerStats?.reduce((sum, p) => sum + p.totalDamage, 0) || 0;
  const totalHealing = runResult.playerStats?.reduce((sum, p) => sum + p.totalHealing, 0) || 0;
  
  const accentColor = isSuccess ? '#22c55e' : '#ef4444';
  const emberColor = isSuccess ? '#22c55e' : '#ff6b35';
  
  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-out'
      }}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={{ 
          maxWidth: '900px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          background: `
            linear-gradient(180deg, rgba(20,20,25,0.98) 0%, rgba(15,15,20,0.99) 100%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")
          `,
          border: `1px solid ${isSuccess ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          boxShadow: `
            0 0 100px ${isSuccess ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'},
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255,255,255,0.05)
          `,
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Ember Particles */}
        <EmberParticles count={isSuccess ? 25 : 40} color={emberColor} />
        
        {/* Header */}
        <div style={{ 
          flexShrink: 0,
          padding: '1.5rem 2rem',
          background: `linear-gradient(135deg, ${isSuccess ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'} 0%, transparent 60%)`,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              fontSize: '3rem',
              filter: `drop-shadow(0 0 20px ${accentColor})`,
              animation: 'pulse-glow 2s ease-in-out infinite'
            }}>
              {isSuccess ? <GiTrophy style={{ color: '#fbbf24' }} /> : <GiSkullCrossedBones style={{ color: '#ef4444' }} />}
            </div>
            <div>
              <h2 style={{ 
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 700,
                color: accentColor,
                letterSpacing: '-0.02em',
                textShadow: `0 0 30px ${accentColor}40`
              }}>
                {isSuccess ? 'DUNGEON COMPLETE' : 'DUNGEON FAILED'}
              </h2>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
                {runResult.dungeonName || 'Unknown'} 
                <span style={{ color: '#fbbf24', fontWeight: 600, marginLeft: '0.5rem' }}>+{runResult.keyLevel}</span>
                {runResult.mapTier && (
                  <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: '0.75rem' }}>Tier {runResult.mapTier}</span>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '1.25rem',
              cursor: 'pointer',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            }}
          >
            ×
          </button>
        </div>

        {/* Stats Bar */}
        <div style={{ 
          flexShrink: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0.75rem',
          padding: '1rem 2rem',
          background: 'rgba(0,0,0,0.3)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          position: 'relative',
          zIndex: 1
        }}>
          <StatCard label="Time" value={formatTime(runResult.timeElapsed)} subValue={`/ ${formatTime(runResult.timeLimit)}`} color="#22d3ee" icon="⏱️" />
          <StatCard label="Forces" value={`${runResult.forcesCleared}/${runResult.forcesRequired}`} subValue={`${Math.floor((runResult.forcesCleared / runResult.forcesRequired) * 100)}%`} color="#3b82f6" icon={<GiCrossedSwords />} />
          <StatCard label="Deaths" value={runResult.deaths} color={runResult.deaths > 0 ? '#ef4444' : '#22c55e'} icon={<GiDeathSkull />} />
          <StatCard label="Damage" value={formatNumber(totalDamage)} color="#ef4444" icon="⚔️" />
          {isSuccess ? (
            <StatCard label="Key Upgrade" value={`+${runResult.upgradeLevel}`} color="#fbbf24" icon={<GiUpgrade />} />
          ) : (
            <StatCard label="Result" value={runResult.failReason === 'timeout' ? 'Timeout' : 'Wipe'} color="#ef4444" icon={runResult.failReason === 'timeout' ? '⏰' : '💀'} />
          )}
        </div>

        {/* Tabs */}
        <div style={{ 
          flexShrink: 0,
          display: 'flex', 
          alignItems: 'center',
          gap: '0.25rem', 
          padding: '0.75rem 2rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(0,0,0,0.2)',
          position: 'relative',
          zIndex: 1
        }}>
          {[
            { id: 'summary' as TabType, label: 'Summary', icon: '📊' },
            { id: 'players' as TabType, label: 'Players', icon: '👥' },
            { id: 'log' as TabType, label: 'Combat Log', icon: <GiScrollUnfurled /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.5rem 1rem',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? `2px solid ${accentColor}` : '2px solid transparent',
                borderRadius: '4px 4px 0 0',
                color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.5)',
                fontSize: '0.85rem',
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}
            >
              <span style={{ fontSize: '1rem' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
          
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.375rem' }}>
            <button onClick={copyLogToClipboard} style={{ padding: '0.375rem 0.625rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              📋 Copy
            </button>
            <button onClick={exportLog} style={{ padding: '0.375rem 0.625rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              💾 Export
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto', 
          padding: '1.25rem 2rem',
          minHeight: 0,
          position: 'relative',
          zIndex: 1
        }}>
          {activeTab === 'summary' && (
            <div style={{ display: 'grid', gridTemplateColumns: displayLoot.length > 0 ? '1fr 1fr' : '1fr', gap: '1.25rem' }}>
              {/* Left Column - Stats & Orbs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Failure Banner */}
                {!isSuccess && (
                  <div style={{ 
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)', 
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                      {runResult.failReason === 'timeout' ? '⏰' : '💀'}
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef4444' }}>
                      {runResult.failReason === 'timeout' ? 'TIME EXPIRED' : 'PARTY WIPED'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>
                      Failed on Pull #{(runResult.failedPullIndex ?? 0) + 1}
                    </div>
                  </div>
                )}
                
                {/* Death Causes */}
                {runResult.deathCauses && Object.keys(runResult.deathCauses).length > 0 && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      ⚔️ Death Causes
                    </h4>
                    {Object.entries(runResult.deathCauses).map(([member, killer]) => (
                      <div key={member} style={{ fontSize: '0.8rem', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#ef4444', fontWeight: 500 }}>{member}</span>
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>
                        <span style={{ color: '#f97316', fontWeight: 500 }}>{killer}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Run Stats */}
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                    📊 Run Statistics
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Duration</span>
                      <span style={{ color: 'white', fontWeight: 500, fontFamily: 'JetBrains Mono' }}>{formatTime(runResult.timeElapsed)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Total Damage</span>
                      <span style={{ color: '#ef4444', fontWeight: 600 }}>{formatNumber(totalDamage)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Total Healing</span>
                      <span style={{ color: '#22c55e', fontWeight: 600 }}>{formatNumber(totalHealing)}</span>
                    </div>
                    {isSuccess && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Key Upgrade</span>
                        <span style={{ color: '#22c55e', fontWeight: 600 }}>+{runResult.upgradeLevel}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Orb Drops */}
                {Object.keys(runResult.orbDrops || {}).length > 0 && (
                  <div style={{ background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                    <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      💎 Completion Bonus Orbs
                    </h4>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {Object.entries(runResult.orbDrops).map(([type, count]) => {
                        const orb = CRAFTING_ORBS.find(o => o.type === type);
                        return (
                          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#fbbf24', fontSize: '0.85rem', background: 'rgba(0,0,0,0.3)', padding: '0.375rem 0.75rem', borderRadius: '4px' }}>
                            <span>{orb?.icon || '💎'}</span>
                            <span style={{ fontWeight: 600 }}>+{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column - Uncollected Loot */}
              {displayLoot.length > 0 && (
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.85rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      🎁 Uncollected Loot ({displayLoot.length})
                    </h4>
                    <button
                      onClick={handleCollectAll}
                      style={{
                        padding: '0.375rem 0.75rem',
                        background: 'rgba(251, 191, 36, 0.2)',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        borderRadius: '4px',
                        color: '#fbbf24',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      Collect All
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflow: 'auto', flex: 1 }}>
                    {displayLoot.map((loot) => (
                      <LootTile 
                        key={loot.id} 
                        drop={loot} 
                        onCollect={() => handleCollectLoot(loot.id)}
                        onHover={(e) => {
                          if (loot.type === 'item' && loot.item) {
                            setHoveredItem(loot.item);
                            setTooltipPos({ x: e.clientX, y: e.clientY });
                          }
                        }}
                        onLeave={() => setHoveredItem(null)}
                      />
                    ))}
                  </div>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                    Click items to collect, or use "Collect All"
                  </div>
                </div>
              )}
              
              {/* No loot message */}
              {displayLoot.length === 0 && (
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.5 }}>✓</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>All loot collected!</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Check your stash for items</div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'players' && runResult.playerStats && (
            <PlayerStatsTab playerStats={runResult.playerStats} team={team} />
          )}
          
          {activeTab === 'players' && !runResult.playerStats && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.4)' }}>
              Player stats not available
            </div>
          )}
          
          {activeTab === 'log' && (
            <CombatLogTab combatLog={runResult.combatLog} />
          )}
        </div>

        {/* Footer */}
        <div style={{ 
          flexShrink: 0,
          padding: '1rem 2rem', 
          background: 'rgba(0,0,0,0.4)', 
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <button 
            onClick={onClose}
            style={{ 
              padding: '0.875rem 3rem',
              fontSize: '1rem',
              fontWeight: 600,
              background: isSuccess 
                ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' 
                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: isSuccess 
                ? '0 0 30px rgba(34, 197, 94, 0.4)' 
                : '0 0 30px rgba(59, 130, 246, 0.4)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '0.02em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = isSuccess 
                ? '0 8px 40px rgba(34, 197, 94, 0.5)' 
                : '0 8px 40px rgba(59, 130, 246, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isSuccess 
                ? '0 0 30px rgba(34, 197, 94, 0.4)' 
                : '0 0 30px rgba(59, 130, 246, 0.4)';
            }}
          >
            {isSuccess ? '🎉 Continue' : '🔄 Try Again'}
          </button>
        </div>
        
        {/* Pulse glow animation */}
        <style>{`
          @keyframes pulse-glow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}</style>
      </div>
      
      {/* Item Tooltip */}
      {hoveredItem && (
        <ItemTooltip item={hoveredItem} position={tooltipPos} />
      )}
    </div>
  );
}
