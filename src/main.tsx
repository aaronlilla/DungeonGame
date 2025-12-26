import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.css';
import './styles/poe-tree.css';
import { useGameStore } from './store/gameStore';
import './utils/performanceConsole'; // Load performance console tools

// Expose store to window for debugging
if (import.meta.env.MODE !== 'production') {
  (window as any).useGameStore = useGameStore;
  (window as any).debugMaps = function debugMaps() {
    const state = useGameStore.getState();
    console.log('=== MAP DEBUG INFO ===');
    console.log('Total maps in stash:', state.mapStash.length);
    const tier1Count = state.mapStash.filter(function(m) { return m.tier === 1; }).length;
    console.log('Tier 1 maps:', tier1Count);
    console.log('Map in device:', state.mapDeviceMap ? { id: state.mapDeviceMap.id, tier: state.mapDeviceMap.tier } : 'NONE');
    console.log('Activated map:', state.activatedMap ? { id: state.activatedMap.id, tier: state.activatedMap.tier } : 'NONE');
    const mapList = state.mapStash.map(function(m) { 
      return { 
        id: m.id.substring(0, 8) + '...', 
        tier: m.tier, 
        name: m.name,
        baseId: m.baseId 
      };
    });
    console.log('All maps:', mapList);
    console.log('===================');
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

