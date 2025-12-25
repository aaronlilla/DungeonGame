import type { Dungeon, RoutePull, EnemyPack } from '../../types/dungeon';

/**
 * Calculates distance between two packs
 */
function getDistance(pack1: EnemyPack, pack2: EnemyPack): number {
  return Math.sqrt(
    Math.pow(pack2.position.x - pack1.position.x, 2) + 
    Math.pow(pack2.position.y - pack1.position.y, 2)
  );
}

/**
 * Finds all packs that can be pulled together (within pull radius of any pack in the cluster)
 * Maximum of 3 packs per pull
 */
function findPullCluster(
  startPack: EnemyPack,
  availablePacks: EnemyPack[],
  usedPacks: Set<string>,
  maxForcesNeeded: number,
  currentForces: number
): EnemyPack[] {
  const MAX_PACKS_PER_PULL = 3;
  const cluster: EnemyPack[] = [startPack];
  const clusterIds = new Set([startPack.id]);
  let clusterForces = startPack.totalForces;
  
  // Keep expanding the cluster until we can't add more packs or reach the limit
  let changed = true;
  while (changed && cluster.length < MAX_PACKS_PER_PULL) {
    changed = false;
    
    // Try to add packs that are within pull radius of ANY pack in the cluster
    for (const pack of availablePacks) {
      if (usedPacks.has(pack.id) || clusterIds.has(pack.id)) continue;
      if (cluster.length >= MAX_PACKS_PER_PULL) break;
      
      // Check if this pack is within pull radius of any pack in the cluster
      const canPull = cluster.some(clusterPack => {
        const dist = getDistance(clusterPack, pack);
        return dist <= Math.max(clusterPack.pullRadius, pack.pullRadius);
      });
      
      if (canPull) {
        // Only add if we need more forces, or if it's a boss (always include bosses)
        const wouldOvershoot = currentForces + clusterForces + pack.totalForces > maxForcesNeeded + 15;
        if (!wouldOvershoot || pack.isGateBoss) {
          cluster.push(pack);
          clusterIds.add(pack.id);
          clusterForces += pack.totalForces;
          changed = true;
          // Stop if we've reached the maximum
          if (cluster.length >= MAX_PACKS_PER_PULL) break;
        }
      }
    }
  }
  
  return cluster;
}

/**
 * Finds the best next pack to pull based on pathing efficiency
 * Considers distance from last pull position and remaining forces needed
 */
function findBestNextPack(
  availablePacks: EnemyPack[],
  lastPosition: { x: number; y: number } | null,
  requiredForces: number,
  currentForces: number,
  bossPack: EnemyPack | undefined,
  bossPulled: boolean
): EnemyPack | null {
  if (availablePacks.length === 0) return null;
  
  // If we need the boss and haven't pulled it, prioritize it
  if (bossPack && !bossPulled) {
    const forcesMet = currentForces >= requiredForces;
    const forcesClose = currentForces >= requiredForces * 0.7;
    
    if (forcesMet || forcesClose) {
      // If boss is available, pull it now
      if (availablePacks.some(p => p.id === bossPack.id)) {
        return bossPack;
      }
    }
  }
  
  // Score packs based on:
  // 1. Distance from last position (closer is better)
  // 2. Forces value (higher is better, but not if we'd overshoot too much)
  // 3. Prefer packs that are part of clusters
  
  const scoredPacks = availablePacks.map(pack => {
    let score = 0;
    
    // Distance score (closer = better, but normalize)
    if (lastPosition) {
      const dist = Math.sqrt(
        Math.pow(pack.position.x - lastPosition.x, 2) + 
        Math.pow(pack.position.y - lastPosition.y, 2)
      );
      // Prefer packs within 200 units (normal pathing distance)
      score += dist < 200 ? 100 - dist : Math.max(0, 200 - dist * 0.5);
    } else {
      // No last position - prefer leftmost (start of gate)
      score += 100 - pack.position.x * 0.1;
    }
    
    // Forces score - prefer packs that get us closer to goal without overshooting
    // const forcesNeeded = requiredForces - currentForces;
    const overshoot = currentForces + pack.totalForces - requiredForces;
    
    if (overshoot <= 20) {
      // Good - close to target without much overshoot
      score += 50 + pack.totalForces * 2;
    } else if (overshoot <= 50) {
      // Acceptable overshoot
      score += 30 + pack.totalForces;
    } else {
      // Too much overshoot - penalize
      score -= overshoot * 0.5;
    }
    
    // Bonus for boss packs (when appropriate)
    if (pack.isGateBoss && currentForces >= requiredForces * 0.7) {
      score += 100;
    }
    
    // Bonus for packs that have nearby packs (cluster potential)
    const nearbyCount = availablePacks.filter(p => {
      if (p.id === pack.id) return false;
      const dist = getDistance(pack, p);
      return dist <= Math.max(pack.pullRadius, p.pullRadius);
    }).length;
    score += nearbyCount * 10;
    
    return { pack, score };
  });
  
  // Sort by score and return best
  scoredPacks.sort((a, b) => b.score - a.score);
  return scoredPacks[0]?.pack || null;
}

/**
 * Generates an auto route for dungeon simulation
 * Improved algorithm that:
 * - Combines multiple nearby packs intelligently
 * - Optimizes pathing to minimize backtracking
 * - Better boss timing
 * - Creates larger, more efficient pulls
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
    let lastPullPosition: { x: number; y: number } | null = null;
    
    // Get packs for this gate
    const gatePacks = dungeon.enemyPacks.filter(p => p.gate === gateNum);
    
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
      
      // Find the best next pack to start a pull from
      const startPack = findBestNextPack(
        availablePacks,
        lastPullPosition,
        requiredForces,
        currentGateForces,
        bossPack,
        bossPulled
      );
      
      if (!startPack) break;
      
      // Find all packs that can be pulled together with this one
      const pullCluster = findPullCluster(
        startPack,
        availablePacks,
        usedPacks,
        requiredForces,
        currentGateForces
      );
      
      // Mark all packs in cluster as used
      const pullPacks: string[] = [];
      let pullForces = 0;
      
      for (const pack of pullCluster) {
        pullPacks.push(pack.id);
        usedPacks.add(pack.id);
        pullForces += pack.totalForces;
        if (pack.isGateBoss) {
          bossPulled = true;
        }
      }
      
      // Update last pull position (use centroid of cluster)
      if (pullCluster.length > 0) {
        const avgX = pullCluster.reduce((sum, p) => sum + p.position.x, 0) / pullCluster.length;
        const avgY = pullCluster.reduce((sum, p) => sum + p.position.y, 0) / pullCluster.length;
        lastPullPosition = { x: avgX, y: avgY };
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
