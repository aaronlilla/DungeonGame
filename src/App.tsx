import React, { useEffect, Suspense, lazy, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { GiCrossedSwords, GiCastle, GiTwoCoins, GiShieldBash, GiHealthPotion, GiWizardStaff, GiTreasureMap } from 'react-icons/gi';
import { EmberBackground } from './components/shared/EmberBackground';
import { LoadingScreen } from './components/LoadingScreen';

// Lazy load all tab components for code splitting
const TeamTab = lazy(() => import('./components/TeamTab').then(module => ({ default: module.TeamTab })));
const SkillsTab = lazy(() => import('./components/SkillsTab').then(module => ({ default: module.SkillsTab })));
const GearTab = lazy(() => import('./components/GearTab').then(module => ({ default: module.GearTab })));
const TalentsTab = lazy(() => import('./components/TalentsTab').then(module => ({ default: module.TalentsTab })));
const DungeonTab = lazy(() => import('./components/DungeonTab').then(module => ({ default: module.DungeonTab })));
const MapsTab = lazy(() => import('./components/MapsTab').then(module => ({ default: module.MapsTab })));

const TABS = [
  { id: 'team', label: 'Team', icon: <GiShieldBash /> },
  { id: 'skills', label: 'Skills', icon: <GiWizardStaff /> },
  { id: 'gear', label: 'Equipment', icon: <GiCrossedSwords /> },
  { id: 'talents', label: 'Talents', icon: <GiHealthPotion /> },
  { id: 'maps', label: 'Maps', icon: <GiTreasureMap /> },
  { id: 'dungeon', label: 'Dungeon', icon: <GiCastle /> },
] as const;

function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  
  const { 
    team, 
    gold, 
    highestKeyCompleted,
    highestMapTierCompleted,
    activeTab, 
    setActiveTab,
    initializeNewGame,
    clearStash
  } = useGameStore();

  // Initialize game only on first load if no team exists (not when team is cleared)
  const hasCheckedInit = React.useRef(false);
  useEffect(() => {
    if (!hasCheckedInit.current) {
      initializeNewGame();
      hasCheckedInit.current = true;
    }
  }, []); // Only run once on mount

  // One-time migration: clear stash to fix old items with bad data
  useEffect(() => {
    const MIGRATION_VERSION = 'stash-clear-v3';
    if (!localStorage.getItem(MIGRATION_VERSION)) {
      clearStash();
      localStorage.setItem(MIGRATION_VERSION, 'done');
      console.log('Stash cleared: migration complete');
    }
  }, [clearStash]);

  // Show loading screen until assets are loaded
  if (!assetsLoaded) {
    return <LoadingScreen onLoadComplete={() => setAssetsLoaded(true)} />;
  }

  // Redirect to team tab if team is incomplete and user tries to access other tabs
  useEffect(() => {
    if (team.length < 5 && activeTab !== 'team') {
      setActiveTab('team');
    }
  }, [team.length, activeTab, setActiveTab]);

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
      case 'talents': return <Suspense fallback={<LoadingFallback />}><TalentsTab /></Suspense>;
      case 'maps': return <Suspense fallback={<LoadingFallback />}><MapsTab /></Suspense>;
      case 'dungeon': return <Suspense fallback={<LoadingFallback />}><DungeonTab /></Suspense>;
      default: return <Suspense fallback={<LoadingFallback />}><TeamTab /></Suspense>;
    }
  };

  // Show embers on most tabs (not dungeon - it has its own effects)
  const showEmbers = activeTab !== 'dungeon';

  return (
    <div className="app-container">
      {/* Ember particle background */}
      {showEmbers && <EmberBackground intensity="high" colorScheme="fire" />}
      
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
          return (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => {
                if (!isDisabled) {
                  setActiveTab(tab.id as typeof activeTab);
                }
              }}
              disabled={isDisabled}
              title={isDisabled ? 'Complete your team (5 members) to unlock this tab' : ''}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <div className="nav-stats">
          <div className="stat-display">
            <span className="icon" style={{ display: 'flex', alignItems: 'center' }}><GiTwoCoins /></span>
            <span className="value">{gold.toLocaleString()}</span>
          </div>
          <div className="stat-display" title="Highest Map Tier Completed">
            <span className="icon" style={{ display: 'flex', alignItems: 'center' }}><GiTreasureMap /></span>
            <span className="value">T{highestMapTierCompleted || highestKeyCompleted}</span>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default App;

