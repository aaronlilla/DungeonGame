import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.css';
import './styles/poe-tree.css';
import { useGameStore } from './store/gameStore';

// Expose store to window for debugging
if (import.meta.env.DEV) {
  (window as any).useGameStore = useGameStore;
  (window as any).debugMaps = () => {
    const state = useGameStore.getState();
    console.log('=== MAP DEBUG INFO ===');
    console.log('Total maps in stash:', state.mapStash.length);
    console.log('Tier 1 maps:', state.mapStash.filter(m => m.tier === 1).length);
    console.log('Map in device:', state.mapDeviceMap ? { id: state.mapDeviceMap.id, tier: state.mapDeviceMap.tier } : 'NONE');
    console.log('Activated map:', state.activatedMap ? { id: state.activatedMap.id, tier: state.activatedMap.tier } : 'NONE');
    console.log('All maps:', state.mapStash.map(m => ({ 
      id: m.id.substring(0, 8) + '...', 
      tier: m.tier, 
      name: m.name,
      baseId: m.baseId 
    })));
    console.log('===================');
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

