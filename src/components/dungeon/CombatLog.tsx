import { useEffect, useRef } from 'react';
import type { CombatLogEntry } from '../../types/dungeon';

interface CombatLogProps {
  combatLog: CombatLogEntry[];
  onTestCombat?: () => void;
  isRunning?: boolean;
}

export function CombatLog({ combatLog }: CombatLogProps) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [combatLog]);

  return (
    <div className="panel" style={{ height: '200px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div className="panel-header" style={{ padding: '0.4rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.9rem' }}>📜 Log</h3>
      </div>
      <div ref={logRef} style={{ flex: 1, overflow: 'auto', padding: '0.4rem', background: 'var(--bg-darkest)', fontSize: '0.7rem' }}>
        {combatLog.map((entry, i) => (
          <div 
            key={i} 
            style={{ 
              padding: '0.1rem 0.2rem', 
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              color: entry.type === 'damage' ? 'var(--accent-red)' : 
                     entry.type === 'heal' ? '#27ae60' : 
                     entry.type === 'death' ? '#ff6b6b' : 
                     entry.type === 'boss' ? 'var(--accent-purple)' : 
                     entry.type === 'phase' || entry.type === 'loot' || entry.type === 'buff' ? 'var(--accent-gold)' : 
                     'var(--text-secondary)' 
            }}
          >
            {entry.message}
          </div>
        ))}
        {combatLog.length === 0 && (
          <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '0.5rem' }}>Log...</div>
        )}
      </div>
    </div>
  );
}

