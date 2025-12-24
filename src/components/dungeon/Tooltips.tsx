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

export function StatsTooltip({ member, x, y }: StatsTooltipProps) {
  const damage = member.totalDamage || 0;
  const healing = member.totalHealing || 0;
  const damageSpells = Object.entries(member.damageBySpell || {}).sort((a, b) => b[1] - a[1]);
  const healingSpells = Object.entries(member.healingBySpell || {}).sort((a, b) => b[1] - a[1]);
  
  if (damageSpells.length === 0 && healingSpells.length === 0) return null;
  
  const roleBorder = member.role === 'tank' ? '#3498db' : member.role === 'healer' ? '#27ae60' : '#e67e22';
  const roleGlow = member.role === 'tank' ? 'rgba(52, 152, 219, 0.4)' : member.role === 'healer' ? 'rgba(39, 174, 96, 0.4)' : 'rgba(230, 126, 34, 0.4)';
  
  return (
    <div style={{
      position: 'fixed',
      left: x - 15,
      top: y - 15,
      transform: 'translate(-100%, -100%)',
      background: 'linear-gradient(135deg, rgba(15, 15, 25, 0.98) 0%, rgba(25, 25, 40, 0.98) 100%)',
      border: `2px solid ${roleBorder}`,
      borderRadius: '10px',
      padding: '1rem 1.2rem',
      minWidth: '220px',
      zIndex: 100000,
      boxShadow: `0 8px 32px rgba(0,0,0,0.7), 0 0 20px ${roleGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
      pointerEvents: 'none'
    }}>
      <div style={{ fontWeight: 'bold', color: roleBorder, marginBottom: '0.6rem', fontSize: '1.1rem', borderBottom: `2px solid ${roleBorder}`, paddingBottom: '0.4rem', textAlign: 'center' }}>
        {member.name}
      </div>
      
      {damageSpells.length > 0 && (
        <div style={{ marginBottom: healingSpells.length > 0 ? '0.8rem' : 0 }}>
          <div style={{ fontSize: '0.85rem', color: '#ff6b6b', fontWeight: 'bold', marginBottom: '0.4rem' }}>DAMAGE</div>
          {damageSpells.map(([spell, dmg]) => {
            const pct = damage > 0 ? Math.round((dmg / damage) * 100) : 0;
            return (
              <div key={spell} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '0.15rem 0', gap: '1rem' }}>
                <span style={{ color: '#ddd' }}>{spell}</span>
                <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>{dmg.toLocaleString()} <span style={{ color: '#999', fontSize: '0.8rem' }}>({pct}%)</span></span>
              </div>
            );
          })}
        </div>
      )}
      
      {healingSpells.length > 0 && (
        <div>
          <div style={{ fontSize: '0.85rem', color: '#5dff8f', fontWeight: 'bold', marginBottom: '0.4rem' }}>HEALING</div>
          {healingSpells.map(([spell, heal]) => {
            const pct = healing > 0 ? Math.round((heal / healing) * 100) : 0;
            return (
              <div key={spell} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '0.15rem 0', gap: '1rem' }}>
                <span style={{ color: '#ddd' }}>{spell}</span>
                <span style={{ color: '#5dff8f', fontWeight: 'bold' }}>{heal.toLocaleString()} <span style={{ color: '#999', fontSize: '0.8rem' }}>({pct}%)</span></span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

