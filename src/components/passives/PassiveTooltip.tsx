import type { PassiveNode } from '../../types/passives';

interface PassiveTooltipProps {
  node: PassiveNode;
  position: { x: number; y: number };
}

export function PassiveTooltip({ node, position }: PassiveTooltipProps) {
  // Calculate position to keep tooltip on screen
  const tooltipWidth = 300;
  const tooltipHeight = 200;
  
  let x = position.x;
  let y = position.y;
  
  // Keep on screen horizontally
  if (x + tooltipWidth > window.innerWidth - 10) {
    x = window.innerWidth - tooltipWidth - 10;
  }
  if (x < 10) x = 10;
  
  // Keep on screen vertically
  if (y + tooltipHeight > window.innerHeight - 10) {
    y = window.innerHeight - tooltipHeight - 10;
  }
  if (y < 10) y = 10;
  
  return (
    <div 
      className="tooltip"
      style={{ 
        left: x, 
        top: y,
        maxWidth: '280px',
        maxHeight: 'calc(100vh - 20px)',
        overflowY: 'auto',
      }}
    >
      <div className="tooltip-title">{node.name}</div>
      <div style={{ 
        fontSize: '0.75rem', 
        color: 'var(--text-dim)', 
        marginBottom: '0.5rem',
        textTransform: 'uppercase'
      }}>
        {node.nodeType} • {node.pointCost} point{node.pointCost !== 1 ? 's' : ''}
      </div>
      <div className="tooltip-desc">{node.description}</div>
      {Object.keys(node.statBonuses).length > 0 && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-blue)' }}>
          {Object.entries(node.statBonuses).map(([key, value]) => (
            <div key={key}>+{value} {key.replace(/([A-Z])/g, ' $1')}</div>
          ))}
        </div>
      )}
      {node.specialEffects && node.specialEffects.length > 0 && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-gold)' }}>
          {node.specialEffects.map((effect, i) => (
            <div key={i}>
              {effect.type}: {effect.value > 0 ? '+' : ''}{effect.value}
              {effect.condition && ` (${effect.condition})`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

