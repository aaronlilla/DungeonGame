import { CRAFTING_ORBS } from '../../store/gameStore';
import type { OrbType } from '../../store/gameStore';

interface StashSidebarProps {
  gold: number;
  orbs: Record<OrbType, number>;
  highestKeyCompleted: number;
  stats: {
    totalItems: number;
    normalItems: number;
    magicItems: number;
    rareItems: number;
    uniqueItems: number;
    corruptedItems: number;
    totalRuns: number;
    successfulRuns: number;
  };
  onGenerateTestItems: () => void;
}

export function StashSidebar({ gold, orbs, highestKeyCompleted, stats, onGenerateTestItems }: StashSidebarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Currency */}
      <div className="panel">
        <div className="panel-header">
          <h3>Currency</h3>
        </div>
        <div className="panel-content">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '0.75rem',
            background: 'var(--bg-dark)',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>🪙</span>
            <span style={{ fontSize: '1.2rem', color: 'var(--accent-gold)', fontFamily: 'Fira Code' }}>
              {gold.toLocaleString()} Gold
            </span>
          </div>

          <h4 style={{ marginBottom: '0.75rem' }}>Crafting Orbs</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            {CRAFTING_ORBS.map(orb => (
              <div
                key={orb.type}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  background: 'var(--bg-dark)',
                  borderRadius: '6px',
                  fontSize: '0.85rem'
                }}
                title={orb.description}
              >
                <span>{orb.icon}</span>
                <span style={{ color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {orb.name.replace(' Orb', '').replace(' of ', '')}
                </span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'Fira Code' }}>
                  {orbs[orb.type]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Item Stats */}
      <div className="panel">
        <div className="panel-header">
          <h3>Inventory Stats</h3>
        </div>
        <div className="panel-content">
          <div className="stats-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="stat-row">
              <span className="stat-name">Total Items</span>
              <span className="stat-value">{stats.totalItems}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name" style={{ color: 'var(--rarity-normal)' }}>Normal</span>
              <span className="stat-value">{stats.normalItems}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name" style={{ color: 'var(--rarity-magic)' }}>Magic</span>
              <span className="stat-value">{stats.magicItems}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name" style={{ color: 'var(--rarity-rare)' }}>Rare</span>
              <span className="stat-value">{stats.rareItems}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name" style={{ color: 'var(--rarity-unique)' }}>Unique</span>
              <span className="stat-value">{stats.uniqueItems}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name" style={{ color: 'var(--accent-red)' }}>Corrupted</span>
              <span className="stat-value">{stats.corruptedItems}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="panel">
        <div className="panel-header">
          <h3>Progress</h3>
        </div>
        <div className="panel-content">
          <div className="stats-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="stat-row">
              <span className="stat-name">Highest Key</span>
              <span className="stat-value">+{highestKeyCompleted}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Total Runs</span>
              <span className="stat-value">{stats.totalRuns}</span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Successful</span>
              <span className="stat-value" style={{ color: 'var(--accent-green)' }}>
                {stats.successfulRuns}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-name">Success Rate</span>
              <span className="stat-value">
                {stats.totalRuns > 0 
                  ? Math.round((stats.successfulRuns / stats.totalRuns) * 100) 
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="panel">
        <div className="panel-header">
          <h3>Quick Actions</h3>
        </div>
        <div className="panel-content">
          <button 
            className="btn btn-secondary w-full mb-1"
            onClick={onGenerateTestItems}
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              padding: '0.75rem 1rem',
              fontSize: '0.9rem',
            }}
          >
            🎲 Generate 10 PoE Items
          </button>
          <div style={{ 
            fontSize: '0.7rem', 
            color: 'var(--text-muted)', 
            marginTop: '0.5rem',
            textAlign: 'center' 
          }}>
            Generates items with real PoE mods
          </div>
        </div>
      </div>
    </div>
  );
}

