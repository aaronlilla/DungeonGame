import type { Dungeon, RoutePull } from '../../types/dungeon';

/**
 * Generates an auto route for dungeon simulation
 * Uses the same logic as handleAutoRoute in DungeonTab
 */
export function generateAutoRoute(dungeon: Dungeon): RoutePull[] {
  const newPulls: RoutePull[] = [];
  const usedPacks = new Set<string>();
  
  // Process each gate
  [1, 2, 3].forEach(gateNum => {
    const gate = dungeon.gates[gateNum - 1];
    const requiredForces = gate.requiredForces;
    let currentGateForces = 0;
    let bossPulled = false;
    
    // Get packs for this gate, sorted by x position (left to right)
    const gatePacks = dungeon.enemyPacks
      .filter(p => p.gate === gateNum)
      .sort((a, b) => a.position.x - b.position.x);
    
    // Check if this gate has a boss
    const bossPack = gatePacks.find(p => p.isGateBoss);
    const needsBoss = bossPack !== undefined;
    
    // Create pulls until we meet requirements
    while (true) {
      // Check if we're done with this gate
      const forcesMet = currentGateForces >= requiredForces;
      const bossHandled = !needsBoss || bossPulled;
      if (forcesMet && bossHandled) break;
      
      // Find available packs
      const availablePacks = gatePacks.filter(p => !usedPacks.has(p.id));
      if (availablePacks.length === 0) break;
      
      // Pick which pack to start with
      let startPack: typeof gatePacks[0];
      if (needsBoss && !bossPulled && forcesMet) {
        // Forces met but need boss - go get the boss
        startPack = bossPack!;
      } else if (needsBoss && !bossPulled && currentGateForces >= requiredForces * 0.5) {
        // Halfway there and haven't pulled boss - consider getting it
        startPack = bossPack!;
      } else {
        // Normal progression - pick leftmost available
        startPack = availablePacks[0];
      }
      
      // Start the pull
      const pullPacks: string[] = [startPack.id];
      usedPacks.add(startPack.id);
      let pullForces = startPack.totalForces;
      if (startPack.isGateBoss) bossPulled = true;
      
      // Try to combine with ONE nearby pack
      const remainingPacks = availablePacks.filter(p => p.id !== startPack.id);
      const nearbyPack = remainingPacks.find(p => {
        const dist = Math.sqrt(Math.pow(p.position.x - startPack.position.x, 2) + Math.pow(p.position.y - startPack.position.y, 2));
        return dist <= startPack.pullRadius;
      });
      
      if (nearbyPack) {
        // Only add if we still need forces or it's the boss
        const wouldOvershoot = currentGateForces + pullForces + nearbyPack.totalForces > requiredForces + 10;
        if (!wouldOvershoot || nearbyPack.isGateBoss) {
          pullPacks.push(nearbyPack.id);
          usedPacks.add(nearbyPack.id);
          pullForces += nearbyPack.totalForces;
          if (nearbyPack.isGateBoss) bossPulled = true;
        }
      }
      
      currentGateForces += pullForces;
      newPulls.push({ 
        pullNumber: newPulls.length + 1, 
        packIds: pullPacks, 
        gate: gateNum as 1 | 2 | 3 
      });
    }
  });
  
  return newPulls;
}
