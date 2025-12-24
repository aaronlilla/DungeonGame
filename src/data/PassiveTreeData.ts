/**
 * Passive Tree Data System
 * Loads tree data from individual JSON files per class
 */

// ============================================================================
// Import tree JSON files
// ============================================================================

import bastionKnightTree from '../assets/trees/bastion_knight.json';
import wardBreakerTree from '../assets/trees/wardbreaker.json';
import ironSkirmisherTree from '../assets/trees/iron_skirmisher.json';
import duelWardenTree from '../assets/trees/duel_warden.json';
import shadowWardenTree from '../assets/trees/shadow_warden.json';
import ghostbladeTree from '../assets/trees/ghostblade.json';
import arcaneBulwarkTree from '../assets/trees/arcane_bulwark.json';
import nullTemplarTree from '../assets/trees/null_templar.json';
import phaseGuardianTree from '../assets/trees/phase_guardian.json';
import highClericTree from '../assets/trees/high_cleric.json';
import bloodConfessorTree from '../assets/trees/blood_confessor.json';
import tacticianTree from '../assets/trees/tactician.json';
import groveHealerTree from '../assets/trees/grove_healer.json';
import vitalistTree from '../assets/trees/vitalist.json';
import ritualWardenTree from '../assets/trees/ritual_warden.json';
import aegisKeeperTree from '../assets/trees/aegis_keeper.json';
import martyrTree from '../assets/trees/martyr.json';
import bastionStrategistTree from '../assets/trees/bastion_strategist.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const treeDataMap: Record<string, any> = {
  bastion_knight: bastionKnightTree,
  wardbreaker: wardBreakerTree,
  iron_skirmisher: ironSkirmisherTree,
  duel_warden: duelWardenTree,
  shadow_warden: shadowWardenTree,
  ghostblade: ghostbladeTree,
  arcane_bulwark: arcaneBulwarkTree,
  null_templar: nullTemplarTree,
  phase_guardian: phaseGuardianTree,
  high_cleric: highClericTree,
  blood_confessor: bloodConfessorTree,
  tactician: tacticianTree,
  grove_healer: groveHealerTree,
  vitalist: vitalistTree,
  ritual_warden: ritualWardenTree,
  aegis_keeper: aegisKeeperTree,
  martyr: martyrTree,
  bastion_strategist: bastionStrategistTree,
};

// ============================================================================
// Types
// ============================================================================

export interface PassiveNode {
  id: string;
  name: string;
  stats: string[];
  x: number;
  y: number;
  ring: number;
  angle: number;
  isKeystone: boolean;
  isNotable: boolean;
  isStart: boolean;
  connections: string[];
}

export interface PassiveGroup {
  id: number;
  x: number;
  y: number;
  orbits: number[];
}

export interface PassiveTreeData {
  classId: string;
  displayName: string;
  nodes: Map<string, PassiveNode>;
  groups: Map<number, PassiveGroup>;
  startNodeId: string;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  orbitRadii: number[];
}

// ============================================================================
// JSON Node structure
// ============================================================================

interface RawNode {
  id: string;
  name: string;
  ring: number;
  angle: number;
  stats: string[];
  connections: string[];
  isStart?: boolean;
  isNotable?: boolean;
  isKeystone?: boolean;
}

interface RawTree {
  name: string;
  color: string;
  nodes: RawNode[];
}

// ============================================================================
// Parsing
// ============================================================================

const RING_SPACING = 100; // Distance between rings

function parseTree(classId: string, rawTree: RawTree): PassiveTreeData {
  const nodes = new Map<string, PassiveNode>();
  const groups = new Map<number, PassiveGroup>();
  
  let startNodeId = '';
  
  // Parse nodes
  for (const rawNode of rawTree.nodes) {
    // Convert polar (ring, angle) to cartesian (x, y)
    const angleRad = (rawNode.angle * Math.PI) / 180;
    const radius = rawNode.ring * RING_SPACING;
    
    const x = Math.cos(angleRad) * radius;
    const y = Math.sin(angleRad) * radius;
    
    const node: PassiveNode = {
      id: rawNode.id,
      name: rawNode.name,
      stats: rawNode.stats,
      x,
      y,
      ring: rawNode.ring,
      angle: rawNode.angle,
      isKeystone: rawNode.isKeystone || false,
      isNotable: rawNode.isNotable || false,
      isStart: rawNode.isStart || false,
      connections: rawNode.connections,
    };
    
    nodes.set(rawNode.id, node);
    
    if (rawNode.isStart) {
      startNodeId = rawNode.id;
    }
  }
  
  // Calculate bounds
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  for (const node of nodes.values()) {
    minX = Math.min(minX, node.x);
    maxX = Math.max(maxX, node.x);
    minY = Math.min(minY, node.y);
    maxY = Math.max(maxY, node.y);
  }
  
  const padding = 150;
  
  return {
    classId,
    displayName: rawTree.name,
    nodes,
    groups,
    startNodeId,
    bounds: {
      minX: minX - padding,
      maxX: maxX + padding,
      minY: minY - padding,
      maxY: maxY + padding,
    },
    orbitRadii: [0, 100, 200, 300, 400, 500, 600],
  };
}

// ============================================================================
// Cache and API
// ============================================================================

// Simple cache that gets cleared on HMR
const treeCache = new Map<string, PassiveTreeData>();

export function getPassiveTree(classId?: string): PassiveTreeData | null {
  const normalizedId = (classId || 'bastion_knight').toLowerCase().replace(/-/g, '_');
  const validId = treeDataMap[normalizedId] ? normalizedId : 'bastion_knight';
  
  // Check cache first
  if (treeCache.has(validId)) {
    return treeCache.get(validId)!;
  }
  
  const rawTree = treeDataMap[validId];
  if (!rawTree) return null;
  
  const tree = parseTree(validId, rawTree as RawTree);
  treeCache.set(validId, tree);
  return tree;
}

// Clear cache - called on HMR or when needed
export function clearTreeCache(): void {
  treeCache.clear();
}

// Vite HMR: clear cache when this module is hot-reloaded
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    treeCache.clear();
  });
}

export function mapClassIdToTreeId(classId: string): string {
  const normalized = classId.toLowerCase().replace(/-/g, '_');
  return treeDataMap[normalized] ? normalized : 'bastion_knight';
}

export function getAllClassIds(): { id: string; name: string }[] {
  return Object.entries(treeDataMap).map(([id, tree]) => ({
    id,
    name: (tree as RawTree).name,
  }));
}

// ============================================================================
// Allocation Helpers
// ============================================================================

export function canAllocateNode(
  tree: PassiveTreeData,
  nodeId: string,
  allocated: Set<string>
): boolean {
  if (allocated.has(nodeId)) return false;
  
  const node = tree.nodes.get(nodeId);
  if (!node) return false;
  
  // Start node is always allocatable first
  if (node.isStart && allocated.size === 0) return true;
  
  // Node is allocatable if connected to an allocated node
  for (const connId of node.connections) {
    if (allocated.has(connId)) return true;
  }
  
  return false;
}

export function canDeallocateNode(
  tree: PassiveTreeData,
  nodeId: string,
  allocated: Set<string>
): boolean {
  const node = tree.nodes.get(nodeId);
  if (!node) return false;
  if (!allocated.has(nodeId)) return false;
  
  // Can always deallocate if it's the only node
  if (allocated.size === 1) return true;
  
  // Can't deallocate start node if other nodes depend on it
  if (node.isStart) return false;
  
  // Check if removing this node would disconnect the tree
  const remaining = new Set(allocated);
  remaining.delete(nodeId);
  
  // Find start node
  let startId = tree.startNodeId;
  if (!remaining.has(startId)) {
    // If start isn't allocated, find any allocated node to start from
    startId = remaining.values().next().value;
  }
  
  // BFS to check connectivity
  const visited = new Set<string>();
  const queue = [startId];
  visited.add(startId);
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentNode = tree.nodes.get(current);
    if (!currentNode) continue;
    
    for (const connId of currentNode.connections) {
      if (remaining.has(connId) && !visited.has(connId)) {
        visited.add(connId);
        queue.push(connId);
      }
    }
  }
  
  return visited.size === remaining.size;
}

// ============================================================================
// Theme Colors
// ============================================================================

export function getClassThemeColors(classId: string): { primary: string; secondary: string; glow: string } {
  const normalized = classId.toLowerCase().replace(/-/g, '_');
  const tree = treeDataMap[normalized] as RawTree | undefined;
  const color = tree?.color || '#c9a227';
  
  // Parse color to create variations
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  
  return {
    primary: color,
    secondary: `rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)})`,
    glow: `rgba(${r}, ${g}, ${b}, 0.4)`,
  };
}

export function getClassBackgroundImage(classId: string): string {
  const normalized = classId.toLowerCase().replace(/_/g, '');
  return `/src/assets/backgrounds/${normalized}.png`;
}
