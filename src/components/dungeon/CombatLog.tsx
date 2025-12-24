import { useEffect, useRef } from 'react';
import type { CombatLogEntry } from '../../types/dungeon';

interface CombatLogProps {
  combatLog: CombatLogEntry[];
  onTestCombat?: () => void;
  isRunning?: boolean;
}

export function CombatLog({ combatLog, onTestCombat, isRunning }: CombatLogProps) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [combatLog]);

  const exportLog = () => {
    if (combatLog.length === 0) {
      alert('No combat log to export');
      return;
    }

    // Format log entries with timestamps
    const formattedLog = combatLog.map(entry => {
      const timestamp = entry.timestamp ? `${(entry.timestamp / 1000).toFixed(2)}s` : '0.00s';
      const type = entry.type.toUpperCase().padEnd(10);
      const source = entry.source ? `[${entry.source}]` : '';
      const target = entry.target ? `-> ${entry.target}` : '';
      const value = entry.value !== undefined ? ` (${entry.value})` : '';
      return `[${timestamp}] ${type} ${source} ${target}${value}: ${entry.message}`;
    }).join('\n');

    // Create blob and download
    const blob = new Blob([formattedLog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `combat-log-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="panel" style={{ height: '200px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div className="panel-header" style={{ padding: '0.4rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.9rem' }}>📜 Log</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {combatLog.length > 0 && (
            <button
              onClick={exportLog}
              style={{
                padding: '0.25rem 0.5rem',
                background: 'linear-gradient(180deg, #27ae60 0%, #229954 100%)',
                border: '1px solid #2ecc71',
                borderRadius: '3px',
                color: '#fff',
                fontWeight: '600',
                fontSize: '0.65rem',
                fontFamily: "'Cinzel', serif",
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                boxShadow: '0 0 6px rgba(39, 174, 96, 0.3)',
                transition: 'all 0.2s ease'
              }}
              title="Export full combat log (includes all stats and events)"
            >
              📥 Export
            </button>
          )}
          {false && onTestCombat && !isRunning && (
            <button
              onClick={onTestCombat}
              style={{
                padding: '0.25rem 0.5rem',
                background: 'linear-gradient(180deg, #3498db 0%, #2980b9 100%)',
                border: '1px solid #5dade2',
                borderRadius: '3px',
                color: '#fff',
                fontWeight: '600',
                fontSize: '0.65rem',
                fontFamily: "'Cinzel', serif",
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                boxShadow: '0 0 6px rgba(52, 152, 219, 0.3)',
                transition: 'all 0.2s ease'
              }}
              title="Run combat simulation tests"
            >
              🧪 Test
            </button>
          )}
        </div>
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

