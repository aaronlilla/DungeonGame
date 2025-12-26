import React, { useEffect, Suspense, lazy, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { GiCrossedSwords, GiCastle, GiShieldBash, GiHealthPotion, GiWizardStaff, GiTreasureMap, GiAnvil } from 'react-icons/gi';
import { EmberBackground } from './components/shared/EmberBackground';
import { LoadingScreen } from './components/LoadingScreen';
import { getAvailableTalentPoints, countSelectedTalents } from './types/talents';
import { getEnabledSkillSlots } from './types/character';
import { PerformanceOverlay } from './components/ui/PerformanceOverlay';
import { PatchNotesDialog } from './components/ui/PatchNotesDialog';
import { VolumeControl } from './components/ui/VolumeControl';
import { LootFilterSettings } from './components/ui/LootFilterSettings';
import { unloadLootSounds } from './utils/lootSoundsHowler';

// Lazy load all tab components for code splitting
const TeamTab = lazy(() => import('./components/TeamTab').then(module => ({ default: module.TeamTab })));
const SkillsTab = lazy(() => import('./components/SkillsTab').then(module => ({ default: module.SkillsTab })));
const GearTab = lazy(() => import('./components/GearTab').then(module => ({ default: module.GearTab })));
const TalentsTab = lazy(() => import('./components/TalentsTab').then(module => ({ default: module.TalentsTab })));
const DungeonTab = lazy(() => import('./components/DungeonTab').then(module => ({ default: module.DungeonTab })));
const MapsTab = lazy(() => import('./components/MapsTab').then(module => ({ default: module.MapsTab })));
const CraftingTab = lazy(() => import('./components/CraftingTab').then(module => ({ default: module.CraftingTab })));

const TABS = [
  { id: 'team', label: 'Team', icon: <GiShieldBash /> },
  { id: 'skills', label: 'Skills', icon: <GiWizardStaff /> },
  { id: 'gear', label: 'Equipment', icon: <GiCrossedSwords /> },
  { id: 'crafting', label: 'Crafting', icon: <GiAnvil /> },
  { id: 'talents', label: 'Talents', icon: <GiHealthPotion /> },
  { id: 'maps', label: 'Maps', icon: <GiTreasureMap /> },
  { id: 'dungeon', label: 'Dungeon', icon: <GiCastle /> },
] as const;

function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const volume = useGameStore(state => state.volume);
  const setVolume = useGameStore(state => state.setVolume);
  const [showPerformanceOverlay, setShowPerformanceOverlay] = useState(false);
  
  const { 
    team, 
    activeTab, 
    setActiveTab,
    initializeNewGame,
    clearStash
  } = useGameStore();
  
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showPatchNotes, setShowPatchNotes] = useState(false);
  const [showFilterSettings, setShowFilterSettings] = useState(false);

  // Keyboard shortcut to toggle performance overlay (Ctrl+Shift+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowPerformanceOverlay(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cleanup sounds on unmount
  useEffect(() => {
    return () => {
      unloadLootSounds();
    };
  }, []);

  // Calculate total unassigned talents across all characters
  const calculateUnassignedTalents = (): number => {
    return team.reduce((total, char) => {
      // Skip characters without a class (temporary DPS characters)
      if (!char.classId) return total;
      
      const availablePoints = getAvailableTalentPoints(char.level);
      const selectedCount = countSelectedTalents(char.selectedTalents || {});
      return total + (availablePoints - selectedCount);
    }, 0);
  };

  // Calculate total unassigned skill slots across all characters
  const calculateUnassignedSkills = (): number => {
    return team.reduce((total, char) => {
      // Include all characters (including temporary DPS) since they all have skill slots
      const enabledSlots = getEnabledSkillSlots(char.level);
      const assignedSkills = char.skillGems.filter(gem => gem.skillGemId && gem.skillGemId !== '').length;
      return total + (enabledSlots - assignedSkills);
    }, 0);
  };

  const unassignedTalentCount = calculateUnassignedTalents();
  const unassignedSkillCount = calculateUnassignedSkills();

  // Initialize game only on first load if no saved data exists
  const hasCheckedInit = React.useRef(false);
  const lastRedirectRef = React.useRef<string>('');
  
  useEffect(() => {
    if (!hasCheckedInit.current) {
      // Check if there's already saved data - Zustand persist stores data in localStorage
      // Check if the persisted state exists before initializing
      const savedData = localStorage.getItem('mythic-delve-save');
      if (!savedData) {
        // Only initialize if there's no saved data at all (truly new game)
        initializeNewGame();
      }
      // If savedData exists, Zustand persist middleware will restore it automatically
      hasCheckedInit.current = true;
    }
  }, [initializeNewGame]); // Only run once on mount

  // One-time migration: clear stash to fix old items with bad data
  useEffect(() => {
    const MIGRATION_VERSION = 'stash-clear-v3';
    if (!localStorage.getItem(MIGRATION_VERSION)) {
      clearStash();
      localStorage.setItem(MIGRATION_VERSION, 'done');
      console.log('Stash cleared: migration complete');
    }
  }, [clearStash]);

  // Redirect to team tab if team is incomplete and user tries to access other tabs
  useEffect(() => {
    // Only redirect if team is incomplete AND we're not already on the team tab
    // Use a ref to prevent infinite loops by tracking the last redirect attempt
    const redirectKey = `${team.length}-${activeTab}`;
    if (team.length < 5 && activeTab !== 'team' && lastRedirectRef.current !== redirectKey) {
      lastRedirectRef.current = redirectKey;
      // Use setTimeout to avoid state update during render
      setTimeout(() => {
        setActiveTab('team');
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team.length, activeTab]); // setActiveTab is stable from Zustand, no need to include it

  // Show loading screen until assets are loaded
  if (!assetsLoaded) {
    return <LoadingScreen onLoadComplete={() => setAssetsLoaded(true)} />;
  }

  const renderTabContent = () => {
    const LoadingFallback = () => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)' }}>
        Loading...
      </div>
    );

    switch (activeTab) {
      case 'team': return <Suspense fallback={<LoadingFallback />}><TeamTab /></Suspense>;
      case 'skills': return <Suspense fallback={<LoadingFallback />}><SkillsTab /></Suspense>;
      case 'gear': return <Suspense fallback={<LoadingFallback />}><GearTab /></Suspense>;
      case 'crafting': return <Suspense fallback={<LoadingFallback />}><CraftingTab /></Suspense>;
      case 'talents': return <Suspense fallback={<LoadingFallback />}><TalentsTab /></Suspense>;
      case 'maps': return <Suspense fallback={<LoadingFallback />}><MapsTab /></Suspense>;
      case 'dungeon': return <Suspense fallback={<LoadingFallback />}><DungeonTab /></Suspense>;
      default: return <Suspense fallback={<LoadingFallback />}><TeamTab /></Suspense>;
    }
  };

  // Show embers on most tabs (not dungeon - it has its own effects)
  const showEmbers = activeTab !== 'dungeon';

  const handleResetData = () => {
    setShowResetDialog(true);
  };

  const confirmReset = () => {
    // Clear all localStorage
    localStorage.clear();
    // Reload the page
    window.location.reload();
  };

  return (
    <div className="app-container">
      {/* Ember particle background */}
      {showEmbers && <EmberBackground intensity="high" colorScheme="fire" />}
      
      {/* Performance Overlay */}
      <PerformanceOverlay 
        visible={showPerformanceOverlay} 
        position="top-right"
        updateInterval={500}
      />
      
      
      {/* Loot Filter Settings Modal */}
      <AnimatePresence>
        {showFilterSettings && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setShowFilterSettings(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <LootFilterSettings />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <nav className="nav-tabs">
        <div className="nav-tabs-texture" />
        {/* Ember particles */}
        <div className="nav-ember nav-ember-1" />
        <div className="nav-ember nav-ember-2" />
        <div className="nav-ember nav-ember-3" />
        <div className="nav-ember nav-ember-4" />
        <div className="nav-ember nav-ember-5" />
        <div className="nav-ember nav-ember-6" />
        <div className="nav-ember nav-ember-7" />
        <div className="nav-ember nav-ember-8" />
        {TABS.map(tab => {
          // Prevent navigation to other tabs until team has 5 members
          const isDisabled = team.length < 5 && tab.id !== 'team';
          const showTalentBadge = tab.id === 'talents' && unassignedTalentCount > 0;
          const showSkillBadge = tab.id === 'skills' && unassignedSkillCount > 0;
          const badgeCount = showTalentBadge ? unassignedTalentCount : showSkillBadge ? unassignedSkillCount : 0;
          const showBadge = showTalentBadge || showSkillBadge;
          
          return (
            <button
              key={tab.id}
              type="button"
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isDisabled) {
                  setActiveTab(tab.id as typeof activeTab);
                }
              }}
              disabled={isDisabled}
              title={isDisabled ? 'Complete your team (5 members) to unlock this tab' : ''}
              style={{ position: 'relative', zIndex: 101 }}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
              {showBadge && (
                <span style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(220, 100, 100, 0.85)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  border: '2px solid rgba(30, 26, 22, 0.95)',
                  boxShadow: '0 2px 8px rgba(220, 100, 100, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
                  zIndex: 102,
                }}>
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        
        {/* Action Buttons Container */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          marginRight: '1rem',
        }}>
          {/* Patch Notes Button */}
          <motion.button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPatchNotes(true);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              fontFamily: "'Cinzel', Georgia, serif",
              background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0.04) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '8px',
              color: '#e9d5ff',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
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

            {/* Top purple line with glow */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent 5%, #a855f7 50%, transparent 95%)',
              boxShadow: '0 0 12px rgba(168, 85, 247, 0.4)',
            }} />

            {/* Bottom purple line with glow */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent 5%, #a855f7 50%, transparent 95%)',
              boxShadow: '0 0 12px rgba(168, 85, 247, 0.4)',
            }} />

            <span style={{ 
              position: 'relative', 
              zIndex: 1,
              textShadow: '0 0 20px rgba(168, 85, 247, 0.5), 0 2px 4px rgba(0,0,0,0.5)',
            }}>
              Patch Notes
            </span>
          </motion.button>

          {/* Reset All Data Button */}
          <motion.button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleResetData();
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              fontFamily: "'Cinzel', Georgia, serif",
              background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0.04) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '8px',
              color: '#e9d5ff',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
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

            {/* Top purple line with glow */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent 5%, #a855f7 50%, transparent 95%)',
              boxShadow: '0 0 12px rgba(168, 85, 247, 0.4)',
            }} />

            {/* Bottom purple line with glow */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent 5%, #a855f7 50%, transparent 95%)',
              boxShadow: '0 0 12px rgba(168, 85, 247, 0.4)',
            }} />

            <span style={{ 
              position: 'relative', 
              zIndex: 1,
              textShadow: '0 0 20px rgba(168, 85, 247, 0.5), 0 2px 4px rgba(0,0,0,0.5)',
            }}>
              Reset All Data
            </span>
          </motion.button>
        </div>
      </nav>

      {/* Patch Notes Dialog */}
      <PatchNotesDialog 
        isOpen={showPatchNotes} 
        onClose={() => setShowPatchNotes(false)} 
      />

      {/* Reset Confirmation Dialog */}
      {showResetDialog && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
        }} onClick={() => setShowResetDialog(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(30, 26, 22, 0.95) 0%, rgba(20, 18, 15, 0.98) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 40px rgba(168, 85, 247, 0.2)',
            }}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#e9d5ff',
              fontFamily: "'Cinzel', Georgia, serif",
              marginBottom: '1rem',
              textAlign: 'center',
            }}>
              Reset All Data?
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(200, 190, 170, 0.9)',
              marginBottom: '2rem',
              lineHeight: 1.6,
              textAlign: 'center',
            }}>
              This will permanently delete all your saved progress, including your team, items, currency, and maps. This action cannot be undone.
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
            }}>
              <motion.button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowResetDialog(false);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: "'Cinzel', Georgia, serif",
                  background: 'linear-gradient(135deg, rgba(60, 50, 40, 0.8) 0%, rgba(40, 35, 30, 0.9) 100%)',
                  border: '1px solid rgba(100, 90, 80, 0.5)',
                  borderRadius: '8px',
                  color: 'rgba(200, 190, 170, 0.9)',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  confirmReset();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: "'Cinzel', Georgia, serif",
                  background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(185, 28, 28, 0.9) 100%)',
                  border: '1px solid rgba(220, 38, 38, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                }}
              >
                Yes, Reset
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      <main className="main-content">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default App;

