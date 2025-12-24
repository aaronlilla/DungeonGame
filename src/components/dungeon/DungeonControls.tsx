import type { Dungeon } from '../../types/dungeon';
import type { CombatState } from '../../types/combat';
import type { MapItem } from '../../types/maps';

interface DungeonControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  combatState: CombatState;
  dungeon: Dungeon;
  selectedKeyLevel: number;
  highestKeyCompleted: number;
  routePulls: unknown[];
  teamLength: number;
  activeMap: MapItem | null;
  onPauseToggle: () => void;
  onStop: () => void;
  onStart: () => void;
  onKeyLevelChange: (delta: number) => void;
}

export function DungeonControls({
  isRunning,
  isPaused,
  combatState,
  dungeon,
  selectedKeyLevel: _selectedKeyLevel,
  highestKeyCompleted,
  routePulls,
  teamLength,
  activeMap,
  onPauseToggle,
  onStop,
  onStart,
  onKeyLevelChange: _onKeyLevelChange
}: DungeonControlsProps) {
  const canStart = routePulls.length > 0 && teamLength >= 5 && activeMap !== null;
  const timerColor = isRunning && combatState.timeElapsed > dungeon.timeLimitSeconds ? '#8b1a1a' : 
                     isRunning && combatState.timeElapsed > dungeon.timeLimitSeconds * 0.8 ? '#c45c2a' : '#c9a227';
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1.5rem',
      padding: '0 1.25rem',
      height: '52px',
      background: 'linear-gradient(180deg, rgba(35, 28, 20, 0.95) 0%, rgba(22, 18, 14, 0.98) 100%)',
      border: '1px solid rgba(90, 70, 50, 0.5)',
      borderRadius: '2px',
      flexShrink: 0,
      position: 'relative',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,240,200,0.03)'
    }}>
      {/* Corner accents - brass/gold */}
      <div style={{ position: 'absolute', top: -1, left: -1, width: '12px', height: '12px', borderTop: '2px solid rgba(139, 90, 43, 0.6)', borderLeft: '2px solid rgba(139, 90, 43, 0.6)' }} />
      <div style={{ position: 'absolute', top: -1, right: -1, width: '12px', height: '12px', borderTop: '2px solid rgba(139, 90, 43, 0.6)', borderRight: '2px solid rgba(139, 90, 43, 0.6)' }} />
      <div style={{ position: 'absolute', bottom: -1, left: -1, width: '12px', height: '12px', borderBottom: '2px solid rgba(139, 90, 43, 0.6)', borderLeft: '2px solid rgba(139, 90, 43, 0.6)' }} />
      <div style={{ position: 'absolute', bottom: -1, right: -1, width: '12px', height: '12px', borderBottom: '2px solid rgba(139, 90, 43, 0.6)', borderRight: '2px solid rgba(139, 90, 43, 0.6)' }} />
      
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: '20px', right: '20px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(139, 90, 43, 0.4), transparent)' }} />
      
      {/* Timer */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
        <span style={{ 
          fontSize: '1.5rem', 
          fontFamily: "'JetBrains Mono', monospace", 
          fontWeight: '700',
          color: timerColor,
          textShadow: `0 0 15px ${timerColor}40`,
          minWidth: '5ch',
          textAlign: 'right',
          display: 'inline-block',
          letterSpacing: '-0.02em'
        }}>
          {Math.floor(combatState.timeElapsed / 60)}:{Math.floor(combatState.timeElapsed % 60).toString().padStart(2, '0')}
        </span>
        <span style={{ fontSize: '0.9rem', color: '#5a4a3a' }}>/</span>
        <span style={{ fontSize: '0.9rem', color: '#7a6c56', fontFamily: "'JetBrains Mono', monospace" }}>
          {Math.floor(dungeon.timeLimitSeconds / 60)}:{Math.floor(dungeon.timeLimitSeconds % 60).toString().padStart(2, '0')}
        </span>
      </div>
      
      {/* Divider */}
      <div style={{ width: '1px', height: '28px', background: 'linear-gradient(180deg, transparent, rgba(139, 90, 43, 0.4), transparent)' }} />

      {/* Controls */}
      {isRunning ? (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={onPauseToggle}
            style={{ 
              padding: '0.55rem 1.1rem', 
              background: isPaused 
                ? 'linear-gradient(135deg, #c45c2a 0%, #8b4520 100%)' 
                : 'linear-gradient(135deg, #2e261d 0%, #1a1510 100%)', 
              border: isPaused ? '1px solid #d67d4a' : '1px solid rgba(90, 70, 50, 0.5)', 
              borderRadius: '2px',
              color: isPaused ? '#f5edd8' : '#b8a88c', 
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontWeight: '600',
              fontFamily: "'Cinzel', Georgia, serif",
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              boxShadow: isPaused ? '0 0 15px rgba(196, 92, 42, 0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button 
            onClick={onStop}
            style={{ 
              padding: '0.55rem 1.1rem', 
              background: 'linear-gradient(135deg, #8b1a1a 0%, #6d1414 100%)', 
              border: '1px solid #a83030', 
              borderRadius: '2px',
              color: '#f5edd8', 
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontWeight: '600',
              fontFamily: "'Cinzel', Georgia, serif",
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              boxShadow: '0 0 12px rgba(139, 26, 26, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            ⏹ Stop
          </button>
        </div>
      ) : (
        <button 
          onClick={onStart}
          disabled={!canStart}
          style={{ 
            padding: '0.6rem 1.6rem', 
            background: canStart 
              ? 'linear-gradient(135deg, #8b6914 0%, #5a4510 100%)' 
              : 'linear-gradient(135deg, #2e261d 0%, #1a1510 100%)', 
            border: canStart ? '1px solid #c9a227' : '1px solid rgba(90, 70, 50, 0.5)', 
            borderRadius: '2px',
            color: canStart ? '#f5edd8' : '#7a6c56', 
            cursor: canStart ? 'pointer' : 'default',
            fontSize: '0.75rem',
            fontWeight: '700',
            fontFamily: "'Cinzel', Georgia, serif",
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            opacity: canStart ? 1 : 0.5,
            boxShadow: canStart ? '0 0 20px rgba(201, 162, 39, 0.3), inset 0 1px 0 rgba(255,255,255,0.15)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          ▶ Start Run
        </button>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Active Map Display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: '200px' }}>
        {activeMap ? (
          <>
            <span style={{ 
              fontSize: '1.2rem'
            }}>
              📜
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: '600',
                color: activeMap.rarity === 'rare' ? '#ffd700' : 
                       activeMap.rarity === 'magic' ? '#8888ff' : 
                       activeMap.rarity === 'corrupted' ? '#d02090' : '#c9a227',
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {activeMap.name}
              </span>
              {(activeMap.quantityBonus > 0 || activeMap.rarityBonus > 0) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {activeMap.quantityBonus > 0 && (
                    <span style={{ fontSize: '0.6rem', color: '#4ade80', whiteSpace: 'nowrap' }}>
                      +{Math.round(activeMap.quantityBonus * 100)}%Q
                    </span>
                  )}
                  {activeMap.rarityBonus > 0 && (
                    <span style={{ fontSize: '0.6rem', color: '#a855f7', whiteSpace: 'nowrap' }}>
                      +{Math.round(activeMap.rarityBonus * 100)}%R
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <span style={{ 
            fontSize: '0.75rem', 
            color: '#7a6c56',
            fontStyle: 'italic'
          }}>
            No map activated
          </span>
        )}
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '28px', background: 'linear-gradient(180deg, transparent, rgba(139, 90, 43, 0.4), transparent)' }} />

      {/* Best */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '0.7rem', color: '#7a6c56', fontFamily: "'Cinzel', Georgia, serif", textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>Best</span>
        <span style={{ 
          fontSize: '1.3rem', 
          fontWeight: '700', 
          fontFamily: "'JetBrains Mono', monospace", 
          background: 'linear-gradient(135deg, #c9a227 0%, #8b6914 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 8px rgba(201, 162, 39, 0.4))'
        }}>+{highestKeyCompleted}</span>
      </div>
    </div>
  );
}

