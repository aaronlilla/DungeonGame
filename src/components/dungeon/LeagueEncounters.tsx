import type { LeagueEncounter } from '../../types/maps';

interface LeagueEncountersProps {
  encounters: LeagueEncounter[];
  teamPosition: { x: number; y: number };
  onEngageEncounter: (encounterId: string) => void;
  isRunning: boolean;
}

export function LeagueEncounters({
  encounters,
  teamPosition,
  onEngageEncounter,
  isRunning
}: LeagueEncountersProps) {
  if (!encounters || encounters.length === 0) return null;
  
  // Filter to show only non-completed encounters with valid mechanics
  const activeEncounters = encounters.filter(e => !e.completed && e.mechanic);
  
  if (activeEncounters.length === 0) return null;
  
  // Check if encounter is near the team (can be engaged)
  const isNearTeam = (encounter: LeagueEncounter) => {
    const dx = encounter.position.x - teamPosition.x;
    const dy = encounter.position.y - teamPosition.y;
    return Math.sqrt(dx * dx + dy * dy) < 120;
  };
  
  // Get colors based on encounter type
  const getEncounterColors = (type: string) => {
    switch (type) {
      case 'breach': return { bg: '#8b5cf6', border: '#a78bfa', glow: 'rgba(139, 92, 246, 0.6)' };
      case 'ritual': return { bg: '#ef4444', border: '#f87171', glow: 'rgba(239, 68, 68, 0.6)' };
      case 'essence': return { bg: '#22c55e', border: '#4ade80', glow: 'rgba(34, 197, 94, 0.6)' };
      case 'delirium': return { bg: '#6b7280', border: '#9ca3af', glow: 'rgba(107, 114, 128, 0.6)' };
      default: return { bg: '#3b82f6', border: '#60a5fa', glow: 'rgba(59, 130, 246, 0.6)' };
    }
  };
  
  return (
    <>
      {activeEncounters.map(encounter => {
        const colors = getEncounterColors(encounter.mechanic.encounterType);
        const canEngage = isRunning && isNearTeam(encounter) && !encounter.engaged;
        const isEngaged = encounter.engaged;
        
        return (
          <div
            key={encounter.id}
            onClick={() => canEngage && onEngageEncounter(encounter.id)}
            style={{
              position: 'absolute',
              left: `${encounter.position.x}px`,
              top: `${encounter.position.y}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: 35,
              cursor: canEngage ? 'pointer' : 'default',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Outer glow ring */}
            <div style={{
              position: 'absolute',
              width: '80px',
              height: '80px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
              animation: isEngaged ? 'pulse 0.5s infinite' : 'pulse 2s infinite',
              pointerEvents: 'none'
            }} />
            
            {/* Main icon container */}
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.bg}dd 0%, ${colors.bg}99 100%)`,
              border: `3px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: `0 0 20px ${colors.glow}, inset 0 0 10px rgba(255,255,255,0.1)`,
              opacity: isEngaged ? 0.6 : canEngage ? 1 : 0.8,
              transform: canEngage ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s ease'
            }}>
              {encounter.mechanic.icon}
              
              {/* Engage indicator */}
              {canEngage && !isEngaged && (
                <div style={{
                  position: 'absolute',
                  inset: -6,
                  border: `2px solid #22c55e`,
                  borderRadius: '50%',
                  animation: 'pulse 0.5s infinite'
                }} />
              )}
            </div>
            
            {/* Label */}
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '8px',
              padding: '4px 10px',
              background: 'rgba(0,0,0,0.9)',
              border: `1px solid ${colors.border}50`,
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: colors.border,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {encounter.mechanic.name}
              </div>
              <div style={{
                fontSize: '0.6rem',
                color: 'var(--text-dim)',
                marginTop: '2px'
              }}>
                {isEngaged ? '⚔️ In Progress' : 
                 canEngage ? '🎯 Click to engage' : 
                 `+${Math.round(encounter.mechanic.bonusQuantity * 100)}% Quantity`}
              </div>
            </div>
            
            {/* Timer penalty indicator */}
            {!isEngaged && (
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '2px 6px',
                background: 'rgba(239, 68, 68, 0.9)',
                borderRadius: '3px',
                fontSize: '0.6rem',
                fontWeight: 600,
                color: '#fff',
                whiteSpace: 'nowrap'
              }}>
                ⏱️ -{encounter.mechanic.timerPenalty}s
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

