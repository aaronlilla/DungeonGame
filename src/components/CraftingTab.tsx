import { useState } from 'react';
import { motion } from 'framer-motion';
import { GiHammerDrop } from 'react-icons/gi';
import { useGameStore } from '../store/gameStore';
import { ItemCraftingStation } from './crafting/ItemCraftingStation';
import { StashGrid } from './gear/StashGrid';
import { StashTabBar } from './gear/StashTabBar';

export function CraftingTab() {
  const {
    inventory,
    stashTabs,
    activeStashTabId,
    setActiveStashTab,
    removeItemFromStash,
  } = useGameStore();

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [heldItemId, setHeldItemId] = useState<string | null>(null);
  const [heldItemSourceTabId, setHeldItemSourceTabId] = useState<string | null>(null);
  const [salvageMode, setSalvageMode] = useState(false);

  const activeTab = stashTabs.find(t => t.id === activeStashTabId) ?? stashTabs[0];

  // Count total items across all tabs
  const totalItems = stashTabs.reduce((sum, tab) => sum + tab.items.length, 0);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '380px 1fr',
      gap: '1rem',
      height: 'calc(100vh - 90px)',
      overflow: 'hidden',
      padding: '0.5rem 1rem'
    }}>
      {/* Left: Item Crafting Station */}
      <ItemCraftingStation
        isDragging={heldItemId !== null}
        heldItemId={heldItemId}
        onItemDropped={() => setHeldItemId(null)}
      />

      {/* Right: Item Stash Grid */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        background: 'linear-gradient(145deg, rgba(20, 18, 15, 0.98) 0%, rgba(12, 10, 8, 0.99) 100%)',
        borderRadius: '14px',
        border: '1px solid rgba(201, 162, 39, 0.15)',
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.5),
          inset 0 1px 0 rgba(255,255,255,0.03),
          inset 0 -1px 0 rgba(0,0,0,0.3)
        `,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Textured background overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/tilebackground.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.025,
          pointerEvents: 'none',
        }} />

        {/* Header */}
        <div style={{
          flexShrink: 0,
          padding: '1.1rem 1rem',
          background: 'linear-gradient(180deg, rgba(201, 162, 39, 0.12) 0%, rgba(201, 162, 39, 0.04) 100%)',
          borderBottom: '1px solid rgba(201, 162, 39, 0.2)',
          textAlign: 'center',
          position: 'relative',
        }}>
          {/* Top gold line with glow */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent 5%, #c9a227 50%, transparent 95%)',
            boxShadow: '0 0 12px rgba(201, 162, 39, 0.4)',
          }} />
          {/* Center diamond decoration */}
          <motion.div
            animate={{
              boxShadow: ['0 0 10px rgba(201, 162, 39, 0.4)', '0 0 20px rgba(201, 162, 39, 0.6)', '0 0 10px rgba(201, 162, 39, 0.4)']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '-5px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '10px',
              height: '10px',
              background: 'linear-gradient(135deg, #d4af37 0%, #c9a227 50%, #8b7019 100%)',
              borderRadius: '2px',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{
              fontSize: '1.1rem',
              margin: 0,
              fontFamily: "'Cinzel', Georgia, serif",
              fontWeight: 700,
              color: '#d4af37',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textShadow: '0 0 20px rgba(201, 162, 39, 0.5), 0 2px 4px rgba(0,0,0,0.5)',
            }}>
              Item Stash
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setSalvageMode(!salvageMode)}
                style={{
                  padding: '0.4rem 0.6rem',
                  background: salvageMode
                    ? 'linear-gradient(180deg, rgba(220, 38, 38, 0.9) 0%, rgba(185, 28, 28, 0.95) 100%)'
                    : 'linear-gradient(180deg, rgba(50, 45, 35, 0.95) 0%, rgba(35, 30, 25, 0.98) 100%)',
                  border: salvageMode
                    ? '1px solid rgba(239, 68, 68, 0.8)'
                    : '1px solid rgba(90, 80, 60, 0.3)',
                  borderRadius: '4px',
                  color: salvageMode ? '#fca5a5' : 'rgba(212, 197, 158, 1)',
                  fontSize: '0.75rem',
                  fontWeight: salvageMode ? 700 : 600,
                  fontFamily: "'Cinzel', Georgia, serif",
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  boxShadow: salvageMode
                    ? '0 0 10px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.03)',
                }}
                title={salvageMode ? 'Salvage Mode Active - Click items to delete them' : 'Activate Salvage Mode - Click to delete items'}
              >
                <GiHammerDrop style={{ fontSize: '0.9rem' }} />
                <span>Salvage</span>
              </button>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'rgba(200, 190, 170, 0.7)',
                padding: '0.2rem 0.5rem',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '4px',
                border: '1px solid rgba(100, 90, 70, 0.3)',
              }}>
                {totalItems} items
              </div>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <StashTabBar
          tabs={stashTabs}
          activeTabId={activeStashTabId ?? stashTabs[0]?.id ?? ''}
          onSelectTab={setActiveStashTab}
        />

        {/* Stash Grid */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          minHeight: 0,
          padding: '0.75rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(201, 162, 39, 0.03) 0%, transparent 50%)',
        }}>
          {activeTab ? (
            <StashGrid
              tab={activeTab}
              items={inventory}
              selectedItemId={selectedItemId}
              onSelectItem={setSelectedItemId}
              cellSize={28}
              heldItemId={heldItemId}
              setHeldItemId={setHeldItemId}
              heldItemSourceTabId={heldItemSourceTabId}
              setHeldItemSourceTabId={setHeldItemSourceTabId}
              characterLevel={99}
              characterStats={{ strength: 999, dexterity: 999, intelligence: 999 }}
              salvageMode={salvageMode}
              onSalvageItem={(itemId) => {
                if (activeTab) {
                  removeItemFromStash(activeTab.id, itemId);
                }
              }}
            />
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'rgba(200, 190, 170, 0.5)',
            }}>
              No stash tabs available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
