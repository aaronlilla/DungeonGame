import { getPassiveNodeById, getDefaultClassForRole } from '../../types/passives';
import { getClassById } from '../../types/classes';
import type { Character } from '../../types/character';

interface PassiveBonusesProps {
  character: Character;
  allocatedNodes: string[];
  bonuses: {
    stats: Record<string, number>;
    effects: Array<{ type: string; value: number; condition?: string }>;
  };
}

export function PassiveBonuses({ character, allocatedNodes, bonuses }: PassiveBonusesProps) {
  const classId = character.classId || getDefaultClassForRole(character.role);
  const classData = classId ? getClassById(classId) : null;

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Current Bonuses</h3>
      </div>
      <div className="panel-content">
        {classData && (
          <div style={{ 
            marginBottom: '1rem', 
            padding: '0.5rem', 
            background: `${classData.primaryColor}15`,
            border: `1px solid ${classData.primaryColor}40`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.25rem' }}>{classData.icon}</span>
            <div>
              <div style={{ fontWeight: 600, color: classData.primaryColor, fontSize: '0.9rem' }}>
                {classData.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                {classData.theme}
              </div>
            </div>
          </div>
        )}
        
        <h4 style={{ marginBottom: '0.75rem' }}>📈 Stat Bonuses</h4>
        {Object.keys(bonuses.stats).length > 0 ? (
          <div className="stats-grid" style={{ gridTemplateColumns: '1fr' }}>
            {Object.entries(bonuses.stats).map(([key, value]) => (
              <div key={key} className="stat-row">
                <span className="stat-name">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                </span>
                <span className="stat-value" style={{ color: classData?.primaryColor || 'var(--accent-gold)' }}>
                  {value > 0 ? '+' : ''}{value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', padding: '0.5rem', background: 'var(--bg-dark)', borderRadius: '6px' }}>
            No stat bonuses yet
          </div>
        )}

        <h4 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>✨ Special Effects</h4>
        {bonuses.effects.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {bonuses.effects.map((effect, i) => (
              <div 
                key={i}
                style={{ 
                  padding: '0.5rem', 
                  background: 'var(--bg-dark)', 
                  borderRadius: '6px',
                  fontSize: '0.85rem'
                }}
              >
                <span style={{ color: classData?.primaryColor || 'var(--accent-gold)' }}>
                  {effect.type.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:
                </span>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>
                  {effect.value > 0 ? '+' : ''}{effect.value}%
                  {effect.condition && (
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                      {' '}({effect.condition.replace(/_/g, ' ')})
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', padding: '0.5rem', background: 'var(--bg-dark)', borderRadius: '6px' }}>
            No special effects yet
          </div>
        )}

        <h4 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>📍 Allocated Nodes</h4>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.25rem', 
          fontSize: '0.85rem',
          maxHeight: '150px',
          overflowY: 'auto',
          padding: '0.5rem',
          background: 'var(--bg-dark)',
          borderRadius: '6px'
        }}>
          {allocatedNodes.map(nodeId => {
            const node = classId ? getPassiveNodeById(classId, nodeId) : null;
            return node ? (
              <div key={nodeId} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{node.icon}</span>
                <span>{node.name}</span>
                <span style={{ color: 'var(--text-dim)', marginLeft: 'auto' }}>({node.pointCost}pt)</span>
              </div>
            ) : null;
          })}
          {allocatedNodes.length === 0 && (
            <div style={{ color: 'var(--text-dim)' }}>Click nodes on the tree to allocate</div>
          )}
        </div>
      </div>
    </div>
  );
}
