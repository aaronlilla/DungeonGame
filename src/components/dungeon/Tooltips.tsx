import type { TeamMemberState } from '../../types/combat';

interface BuffTooltipProps {
  text: string;
  x: number;
  y: number;
}

export function BuffTooltip({ text, x, y }: BuffTooltipProps) {
  return (
    <div style={{
      position: 'fixed',
      left: x - 15,
      top: y - 15,
      transform: 'translate(-100%, -100%)',
      background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.98) 0%, rgba(30, 30, 45, 0.98) 100%)',
      border: '1px solid rgba(200, 170, 110, 0.5)',
      borderRadius: '6px',
      padding: '8px 12px',
      fontSize: '0.8rem',
      color: '#fff',
      zIndex: 100000,
      pointerEvents: 'none',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
      whiteSpace: 'pre-line',
      maxWidth: '250px',
      lineHeight: 1.4
    }}>
      {text.split('\n').map((line, i) => (
        <div key={i} style={{ 
          fontWeight: i === 0 ? '700' : '400',
          color: i === 0 ? '#f1c40f' : i === 1 ? '#5dff8f' : '#aaa',
          marginBottom: i === 0 ? '4px' : 0
        }}>{line}</div>
      ))}
    </div>
  );
}

interface StatsTooltipProps {
  member: TeamMemberState;
  x: number;
  y: number;
}

// Separator component for tooltip sections
function Separator() {
  return (
    <div style={{
      height: '1px',
      margin: '8px 0',
      background: 'linear-gradient(90deg, transparent 0%, rgba(120, 100, 80, 0.3) 15%, rgba(120, 100, 80, 0.3) 85%, transparent 100%)',
    }} />
  );
}

export function StatsTooltip({ member, x, y }: StatsTooltipProps) {
  const damage = member.totalDamage || 0;
  const healing = member.totalHealing || 0;
  const damageSpells = Object.entries(member.damageBySpell || {}).sort((a, b) => b[1] - a[1]);
  const healingSpells = Object.entries(member.healingBySpell || {}).sort((a, b) => b[1] - a[1]);
  
  if (damageSpells.length === 0 && healingSpells.length === 0) return null;
  
  // More refined role colors - muted and elegant
  const roleColors = member.role === 'tank' 
    ? { border: 'rgba(52, 152, 219, 0.6)', name: '#5dade2', glow: 'rgba(52, 152, 219, 0.15)' }
    : member.role === 'healer' 
    ? { border: 'rgba(39, 174, 96, 0.6)', name: '#52c97a', glow: 'rgba(39, 174, 96, 0.15)' }
    : { border: 'rgba(230, 126, 34, 0.6)', name: '#f39c12', glow: 'rgba(230, 126, 34, 0.15)' };
  
  return (
    <div style={{
      position: 'fixed',
      left: x - 15,
      top: y - 15,
      transform: 'translate(-100%, -100%)',
      background: 'rgba(0, 0, 0, 0.94)',
      border: `1px solid ${roleColors.border}`,
      borderRadius: '4px',
      padding: '10px 14px',
      minWidth: '240px',
      maxWidth: '320px',
      zIndex: 100000,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 0, 0, 0.5)',
      pointerEvents: 'none'
    }}>
      {/* Header with name */}
      <div style={{
        fontSize: '15px',
        fontWeight: 600,
        color: roleColors.name,
        marginBottom: '10px',
        paddingBottom: '8px',
        borderBottom: `1px solid ${roleColors.border}`,
        textAlign: 'center',
        fontFamily: "'Cormorant', 'Cinzel', Georgia, serif",
        letterSpacing: '0.02em',
        textShadow: '0 0 8px rgba(0,0,0,0.5)'
      }}>
        {member.name}
      </div>
      
      {damageSpells.length > 0 && (
        <div style={{ marginBottom: healingSpells.length > 0 ? '12px' : 0 }}>
          <div style={{
            fontSize: '11px',
            color: '#ef4444',
            fontWeight: 600,
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            opacity: 0.9
          }}>
            Damage
          </div>
          {damageSpells.map(([spell, dmg]) => {
            const pct = damage > 0 ? Math.round((dmg / damage) * 100) : 0;
            return (
              <div key={spell} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '13px',
                padding: '4px 0',
                gap: '12px'
              }}>
                <span style={{
                  color: 'rgba(200, 190, 170, 0.9)',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {spell}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <span style={{
                    color: '#ef4444',
                    fontWeight: 600,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px'
                  }}>
                    {dmg.toLocaleString()}
                  </span>
                  <span style={{
                    color: 'rgba(150, 150, 150, 0.7)',
                    fontSize: '11px',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}>
                    ({pct}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {healingSpells.length > 0 && damageSpells.length > 0 && <Separator />}
      
      {healingSpells.length > 0 && (
        <div>
          <div style={{
            fontSize: '11px',
            color: '#22c55e',
            fontWeight: 600,
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            opacity: 0.9
          }}>
            Healing
          </div>
          {healingSpells.map(([spell, heal]) => {
            const pct = healing > 0 ? Math.round((heal / healing) * 100) : 0;
            return (
              <div key={spell} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '13px',
                padding: '4px 0',
                gap: '12px'
              }}>
                <span style={{
                  color: 'rgba(200, 190, 170, 0.9)',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {spell}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <span style={{
                    color: '#22c55e',
                    fontWeight: 600,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px'
                  }}>
                    {heal.toLocaleString()}
                  </span>
                  <span style={{
                    color: 'rgba(150, 150, 150, 0.7)',
                    fontSize: '11px',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}>
                    ({pct}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

