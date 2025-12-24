import type { RoutePull, EnemyPack, Dungeon } from '../../types/dungeon';
import { getPackMobCount } from '../../utils/combat';

interface RoutePlannerProps {
  isRunning: boolean;
  isCreatingPull: boolean;
  routePulls: RoutePull[];
  dungeon: Dungeon;
  totalForces: number;
  onAutoRoute: () => void;
  onClearRoute: () => void;
  onNewPull: () => void;
  onRemovePull: (pullNumber: number) => void;
}

export function RoutePlanner({
  isRunning,
  isCreatingPull,
  routePulls,
  dungeon,
  totalForces,
  onAutoRoute,
  onClearRoute,
  onNewPull,
  onRemovePull
}: RoutePlannerProps) {
  if (isRunning) return null;

  const sharpButtonStyle = {
    flex: 1,
    padding: '0.5rem 0.75rem',
    background: 'linear-gradient(135deg, #2e261d 0%, #1a1510 100%)',
    border: '1px solid rgba(139, 90, 43, 0.4)',
    borderRadius: '2px',
    color: '#b8a88c',
    cursor: 'pointer',
    fontSize: '0.7rem',
    fontWeight: '600',
    fontFamily: "'Cinzel', Georgia, serif",
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  return (
    <>
      {/* Route Controls */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          style={sharpButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.5)';
            e.currentTarget.style.color = '#c9a227';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(201, 162, 39, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(139, 90, 43, 0.4)';
            e.currentTarget.style.color = '#b8a88c';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={onAutoRoute}
        >
          🔄 Auto
        </button>
        <button 
          style={{
            ...sharpButtonStyle,
            borderColor: 'rgba(139, 26, 26, 0.4)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(139, 26, 26, 0.6)';
            e.currentTarget.style.color = '#a83030';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 26, 26, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(139, 26, 26, 0.4)';
            e.currentTarget.style.color = '#b8a88c';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={onClearRoute}
        >
          🗑️ Clear
        </button>
      </div>

      {!isCreatingPull && (
        <button 
          style={{
            width: '100%',
            padding: '0.6rem 1rem',
            background: 'linear-gradient(135deg, #8b6914 0%, #5a4510 100%)',
            border: '1px solid #c9a227',
            borderRadius: '2px',
            color: '#f5edd8',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '700',
            fontFamily: "'Cinzel', Georgia, serif",
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: '0 0 15px rgba(201, 162, 39, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 20px rgba(201, 162, 39, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 15px rgba(201, 162, 39, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onClick={onNewPull}
        >
          ➕ New Pull
        </button>
      )}

      {/* Route List */}
      <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div className="panel-header" style={{ padding: '0.4rem 0.75rem' }}>
          <h3 style={{ fontSize: '0.8rem' }}>📋 Route ({routePulls.length})</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: "'JetBrains Mono', monospace" }}>{totalForces} forces</span>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '0.4rem' }}>
          {routePulls.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '1rem', fontSize: '0.8rem' }}>Click "New Pull"</div>
          ) : (
            routePulls.map(pull => {
              const packs = pull.packIds.map(id => dungeon.enemyPacks.find(p => p.id === id)).filter(Boolean) as EnemyPack[];
              const forces = packs.reduce((s, p) => s + p.totalForces, 0);
              const mobCount = packs.reduce((s, p) => s + getPackMobCount(p), 0);
              const hasGateBoss = packs.some(p => p.isGateBoss);
              return (
                <div key={pull.pullNumber} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  padding: '0.45rem 0.6rem', 
                  background: hasGateBoss ? 'rgba(124, 90, 166, 0.12)' : 'linear-gradient(135deg, #2e261d 0%, #1a1510 100%)', 
                  borderRadius: '2px', 
                  marginBottom: '0.3rem', 
                  border: `1px solid ${hasGateBoss ? 'rgba(124, 90, 166, 0.4)' : 'rgba(90, 70, 50, 0.4)'}`, 
                  fontSize: '0.8rem',
                  position: 'relative',
                }}>
                  <span style={{ 
                    width: '22px', 
                    height: '22px', 
                    borderRadius: '2px', 
                    background: hasGateBoss ? 'linear-gradient(135deg, #7c5aa6 0%, #5a4080 100%)' : 'linear-gradient(135deg, #8b6914 0%, #5a4510 100%)', 
                    color: '#f5edd8', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 'bold', 
                    fontSize: '0.7rem',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>{pull.pullNumber}</span>
                  <span style={{ flex: 1, color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{hasGateBoss ? '👑 ' : ''}{mobCount}👤</span>
                  <span style={{ color: '#2d6b3a', fontWeight: 'bold', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace" }}>+{forces}</span>
                  <button 
                    onClick={() => onRemovePull(pull.pullNumber)} 
                    style={{ 
                      background: 'linear-gradient(135deg, #2e261d 0%, #1a1510 100%)', 
                      border: '1px solid rgba(139, 26, 26, 0.4)', 
                      borderRadius: '2px',
                      color: '#8b1a1a', 
                      cursor: 'pointer', 
                      padding: '0.15rem 0.4rem', 
                      fontSize: '0.85rem', 
                      lineHeight: 1,
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(139, 26, 26, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(139, 26, 26, 0.6)';
                      e.currentTarget.style.boxShadow = '0 0 8px rgba(139, 26, 26, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #2e261d 0%, #1a1510 100%)';
                      e.currentTarget.style.borderColor = 'rgba(139, 26, 26, 0.4)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >×</button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

