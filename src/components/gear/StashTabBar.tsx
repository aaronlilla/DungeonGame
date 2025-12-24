import { motion } from 'framer-motion';
import type { StashTab } from '../../store/gameStore';

interface StashTabBarProps {
  tabs: StashTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
}

export function StashTabBar({ tabs, activeTabId, onSelectTab }: StashTabBarProps) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2px',
      padding: '0.5rem',
      background: 'linear-gradient(180deg, rgba(30, 28, 24, 0.9) 0%, rgba(20, 18, 14, 0.95) 100%)',
      borderRadius: '6px 6px 0 0',
      borderBottom: '1px solid rgba(90, 80, 60, 0.3)',
    }}>
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTabId;
        const hasItems = tab.items.length > 0;
        
        return (
          <motion.button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            style={{
              position: 'relative',
              padding: '0.4rem 0.75rem',
              minWidth: '50px',
              background: isActive 
                ? 'linear-gradient(180deg, rgba(50, 45, 35, 0.95) 0%, rgba(35, 30, 25, 0.98) 100%)'
                : 'linear-gradient(180deg, rgba(25, 23, 18, 0.9) 0%, rgba(18, 16, 12, 0.95) 100%)',
              border: isActive 
                ? '1px solid rgba(201, 162, 39, 0.5)'
                : '1px solid rgba(90, 80, 60, 0.3)',
              borderBottom: isActive ? 'none' : '1px solid rgba(90, 80, 60, 0.3)',
              borderRadius: '4px 4px 0 0',
              color: isActive ? 'rgba(212, 197, 158, 1)' : 'rgba(160, 150, 130, 0.8)',
              fontSize: '0.7rem',
              fontWeight: isActive ? 600 : 500,
              fontFamily: "'Cinzel', Georgia, serif",
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: isActive 
                ? 'inset 0 2px 4px rgba(201, 162, 39, 0.1), 0 -2px 8px rgba(201, 162, 39, 0.1)'
                : 'none',
              overflow: 'hidden',
            }}
          >
            {/* Active tab glow */}
            {isActive && (
              <motion.div
                layoutId="activeTabGlow"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '15%',
                  right: '15%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.8), transparent)',
                }}
              />
            )}
            
            {/* Item indicator dot */}
            {hasItems && (
              <div style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: isActive ? 'rgba(201, 162, 39, 0.8)' : 'rgba(160, 150, 130, 0.5)',
              }} />
            )}
            
            {/* Tab number or name */}
            <span style={{ position: 'relative', zIndex: 1 }}>
              {index + 1}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
