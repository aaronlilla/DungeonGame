import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { MapDevice } from './maps/MapDevice';
import { MapStashGrid } from './maps/MapStashGrid';
import { MapModsPanel } from './maps/MapModsPanel';
import { MapCraftingStation } from './maps/MapCraftingStation';
import type { MapItem, Fragment } from '../types/maps';
import { FRAGMENT_BASES, generateMap } from '../types/maps';

export function MapsTab() {
  const {
    mapStash,
    fragmentCounts,
    mapDeviceMap,
    mapDeviceFragments,
    setMapDeviceMap,
    setMapDeviceFragment,
    clearMapDevice,
    setActiveTab,
    activateMap,
    addMap
  } = useGameStore();

  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  const [heldMapId, setHeldMapId] = useState<string | null>(null);
  const [mapTierFilter, setMapTierFilter] = useState<number | null>(null);

  // Auto-fill map stash with tier 1 maps (maintain minimum of 4)
  useEffect(() => {
    // Skip if there are no maps at all (initialization might not be complete yet)
    if (mapStash.length === 0) return;
    
    console.log('[MAPS TAB] Auto-fill effect running. Total maps:', mapStash.length);
    
    // Count tier 1 maps in stash only (not in device or activated)
    const tier1MapsInStash = mapStash.filter(m => m.tier === 1).length;
    const tier1MapInDevice = mapDeviceMap?.tier === 1 ? 1 : 0;
    const totalT1Maps = tier1MapsInStash + tier1MapInDevice;
    
    console.log('[MAPS TAB] T1 maps - In stash:', tier1MapsInStash, 'In device:', tier1MapInDevice, 'Total:', totalT1Maps);
    
    const desiredTier1Maps = 4; // Keep just 4 tier 1 maps available
    const tier1MapsNeeded = Math.max(0, desiredTier1Maps - totalT1Maps);
    console.log('[MAPS TAB] Tier 1 maps needed:', tier1MapsNeeded);
    
    // Generate tier 1 maps if needed (only if less than desired amount)
    if (tier1MapsNeeded > 0 && tier1MapsNeeded <= desiredTier1Maps) {
      console.log('[MAPS TAB] Generating', tier1MapsNeeded, 'tier 1 maps...');
      // Use setTimeout to break out of the render cycle
      const timeout = setTimeout(() => {
        for (let i = 0; i < tier1MapsNeeded; i++) {
          const newMap = generateMap(1, 'normal'); // Generate white tier 1 map with no mods
          console.log(`[MAPS TAB] Generating map ${i+1}/${tier1MapsNeeded}:`, { id: newMap.id, name: newMap.name });
          addMap(newMap);
        }
      }, 0);
      
      return () => clearTimeout(timeout);
    }
  }, [mapStash.length, mapDeviceMap?.tier, addMap]); // Include device map tier in dependencies


  // Handle dropping a map into the device
  const handleDropMapOnDevice = () => {
    if (heldMapId) {
      // Check if it's from crafting station
      const craftingStationMapId = (window as any).__craftingStationMapId;
      const map = mapStash.find(m => m.id === heldMapId) || 
                  (craftingStationMapId === heldMapId ? mapStash.find(m => m.id === heldMapId) : null);
      
      if (map) {
        setMapDeviceMap(map);
        setHeldMapId(null);
      }
    }
  };


  // Handle dragging a map
  const handleMapDragStart = (map: MapItem) => {
    setHeldMapId(map.id);
  };

  const handleMapDragEnd = () => {
    setHeldMapId(null);
  };

  const handleFragmentClick = (slotIndex: number) => {
    const targetFragment = FRAGMENT_BASES[slotIndex];
    if (targetFragment && fragmentCounts[targetFragment.id] > 0) {
      // Create a new fragment instance
      const fragment: Fragment = {
        id: crypto.randomUUID(),
        baseId: targetFragment.id,
        name: targetFragment.name,
        icon: targetFragment.icon,
        image: targetFragment.image,
        description: targetFragment.description,
        quantityBonus: targetFragment.quantityBonus,
        rarityBonus: targetFragment.rarityBonus,
      };
      setMapDeviceFragment(slotIndex, fragment);
    }
  };

  // Handle dragging a fragment


  const [fadeOverlay, setFadeOverlay] = useState(false);

  // Handle starting a map run with fade transition
  const handleStartMap = () => {
    if (!mapDeviceMap) return;
    
    // Start fade to black
    setFadeOverlay(true);
    
    // After fade completes, activate map and switch to dungeon tab
    setTimeout(() => {
      // Activate the map (moves from device to activated state)
      activateMap();
      
      // Don't remove the map here - it's already removed from stash when placed in device
      // and will be consumed when activated
      
      // Switch to dungeon tab
      setActiveTab('dungeon');
      
      // Fade back in
      setTimeout(() => {
        setFadeOverlay(false);
      }, 100);
    }, 500); // Half second fade out
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr 320px 720px',
      gap: '1rem',
      height: 'calc(100vh - 90px)',
      overflow: 'hidden',
      padding: '0.5rem 1rem'
    }}>
      {/* Left: Map Mods Panel */}
      <MapModsPanel map={mapDeviceMap} fragments={mapDeviceFragments} />

      {/* Middle: Map Device */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
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
          zIndex: 0,
        }} />
        <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
          <MapDevice
          mapSlot={mapDeviceMap}
          fragmentSlots={mapDeviceFragments}
          onDropMap={handleDropMapOnDevice}
          onDropFragment={() => {}}
          onRemoveMap={() => setMapDeviceMap(null)}
          onRemoveFragment={(idx) => setMapDeviceFragment(idx, null)}
          onClear={clearMapDevice}
          onStart={handleStartMap}
          isDragging={heldMapId !== null}
          draggedItemType={heldMapId ? 'map' : null}
          fragmentCounts={fragmentCounts}
          onFragmentClick={handleFragmentClick}
          />
        </div>
      </div>

      {/* Map Crafting */}
      <MapCraftingStation 
        isDragging={heldMapId !== null}
        heldMapId={heldMapId}
        onMapDropped={() => setHeldMapId(null)}
      />

      {/* Right: Map & Fragment Stash Grid */}
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
        backdropFilter: 'blur(12px)',
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
        {/* Maps Section */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}>
          {/* Maps Header */}
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
              Maps
            </h2>
          </div>

          {/* Filter Controls */}
          <div style={{
            padding: '0.75rem 1rem',
            borderBottom: '1px solid rgba(201, 162, 39, 0.1)',
            background: 'rgba(20, 18, 15, 0.5)',
          }}>
            <select
              value={mapTierFilter ?? 'all'}
              onChange={(e) => setMapTierFilter(e.target.value === 'all' ? null : parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                fontSize: '0.85rem',
                background: 'rgba(20, 18, 15, 0.8)',
                border: '1px solid rgba(201, 162, 39, 0.3)',
                borderRadius: '6px',
                color: '#c8b68d',
                cursor: 'pointer',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            >
              <option value="all">Show All Maps</option>
              {/* Generate tier options from highest to lowest */}
              {mapStash.length > 0 && 
                Array.from({ length: Math.max(...mapStash.map(m => m.tier)) }, (_, i) => i + 1)
                  .reverse()
                  .map(tier => (
                    <option key={tier} value={tier}>
                      Tier {tier}
                    </option>
                  ))}
            </select>
          </div>

          {/* Maps Grid */}
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
            <MapStashGrid
              maps={mapTierFilter ? mapStash.filter(m => m.tier === mapTierFilter) : mapStash}
              selectedMapId={selectedMapId}
              onSelectMap={setSelectedMapId}
              cellSize={28}
              heldMapId={heldMapId}
              setHeldMapId={setHeldMapId}
              onDragStart={handleMapDragStart}
              onDragEnd={handleMapDragEnd}
              onMoveMap={(mapId, x, y) => useGameStore.getState().moveMapInStash(mapId, x, y)}
            />
          </div>
        </div>

      </div>

      {/* Fade overlay */}
      <AnimatePresence>
        {fadeOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: '#000',
              zIndex: 10000,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

