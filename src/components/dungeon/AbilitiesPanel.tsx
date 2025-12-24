import { memo } from 'react';
import type { CombatState } from '../../types/combat';

interface AbilitiesPanelProps {
  combatState: CombatState;
  onUseAbility: (abilityId: string) => void;
}

export const AbilitiesPanel = memo(function AbilitiesPanel({ combatState, onUseAbility }: AbilitiesPanelProps) {
  if (combatState.phase !== 'combat') {
    return null;
  }

  return (
    <div 
      className="abilities-panel-jrpg"
      style={{ 
        flexShrink: 0,
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(30, 26, 22, 0.98) 0%, rgba(20, 17, 14, 0.99) 100%)',
        borderRadius: '2px',
        border: '1px solid rgba(90, 70, 50, 0.4)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.02), 0 2px 8px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        animation: 'fade-in 0.2s ease-out',
      }}
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      {/* Header */}
      <div style={{ 
        padding: '0.35rem 0.6rem',
        background: 'linear-gradient(180deg, rgba(139, 90, 43, 0.08) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(90, 70, 50, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h3 style={{ 
          fontSize: '0.7rem',
          margin: 0,
          fontFamily: "'Cinzel', Georgia, serif",
          fontWeight: 600,
          color: '#8b6914',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
        }}>
          <span style={{ opacity: 0.7 }}>⚔</span>
          Skills
        </h3>

        {/* Haste indicator */}
        {combatState.bloodlustActive && combatState.bloodlustTimer > 0.1 && (
          <div style={{ 
            fontSize: '0.55rem', 
            color: '#8b6914', 
            fontWeight: 600,
            padding: '0.1rem 0.4rem',
            background: 'rgba(139, 105, 20, 0.15)',
            border: '1px solid rgba(139, 105, 20, 0.4)',
            borderRadius: '2px',
            fontFamily: "'Cinzel', Georgia, serif",
          }}>
            HASTE {Math.max(1, Math.ceil(combatState.bloodlustTimer))}s
          </div>
        )}
      </div>

      {/* Abilities Grid */}
      <div style={{ 
        padding: '0.35rem', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '0.3rem',
      }}>
        {combatState.abilities.map((ability) => {
          const onCD = ability.currentCooldown > 0;
          const canUse = !onCD && 
            (ability.id !== 'battlerez' || combatState.teamStates.some(m => m.isDead)) && 
            (ability.id !== 'interrupt' || combatState.enemies.some(e => e.isCasting));
          
          return (
            <button 
              key={ability.id}
              onClick={() => canUse && onUseAbility(ability.id)}
              disabled={!canUse}
              title={`${ability.name}: ${ability.description}`}
              style={{ 
                width: '100%', 
                height: '36px',
                borderRadius: '2px',
                border: canUse 
                  ? '1px solid rgba(139, 105, 20, 0.6)'
                  : '1px solid rgba(60, 50, 40, 0.4)',
                background: canUse
                  ? 'linear-gradient(180deg, rgba(40, 35, 28, 0.95) 0%, rgba(28, 24, 20, 0.98) 100%)'
                  : 'linear-gradient(180deg, rgba(25, 22, 18, 0.95) 0%, rgba(18, 15, 12, 0.98) 100%)',
                cursor: canUse ? 'pointer' : 'not-allowed',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02), 0 1px 3px rgba(0,0,0,0.2)',
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'center', 
                position: 'relative', 
                gap: '0.3rem', 
                padding: '0.2rem 0.4rem',
                opacity: canUse ? 1 : 0.5,
                transition: 'opacity 0.15s, border-color 0.15s',
              }}
            >
              {/* Icon */}
              <div style={{
                fontSize: '0.9rem',
                filter: onCD ? 'grayscale(1) brightness(0.5)' : 'none',
                transition: 'filter 0.15s',
              }}>
                {ability.icon}
              </div>

              {/* Ability name */}
              <span style={{ 
                fontSize: '0.55rem', 
                color: canUse ? '#b8a88c' : '#5a4a3a',
                textAlign: 'center', 
                lineHeight: 1.1,
                fontWeight: 500,
                fontFamily: "'Cinzel', Georgia, serif",
              }}>
                {ability.name}
              </span>

              {/* Cooldown overlay - pure CSS */}
              {onCD && (
                <div
                  style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: 'rgba(0,0,0,0.7)',
                    borderRadius: '2px',
                  }}
                >
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    fontFamily: "'Cinzel', Georgia, serif",
                    color: '#7a6c56',
                  }}>
                    {Math.ceil(ability.currentCooldown)}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});
