import React from 'react';
import type { PassiveNode, ClassPassiveTree } from '../../types/passives';
import type { Character } from '../../types/character';
import { CLASS_PASSIVE_TREES, getPassiveTreeForClass, canAllocateNode, getDefaultClassForRole } from '../../types/passives';
import { getClassById } from '../../types/classes';

interface PassiveTreeProps {
  character: Character;
  allocatedNodes: string[];
  totalPointsUsed: number;
  onNodeClick: (node: PassiveNode) => void;
  onNodeHover: (node: PassiveNode | null, e?: React.MouseEvent) => void;
}

export function PassiveTree({ 
  character, 
  allocatedNodes, 
  totalPointsUsed, 
  onNodeClick, 
  onNodeHover 
}: PassiveTreeProps) {
  // Get tree based on classId, with fallback to role-based default
  const classId = character.classId || getDefaultClassForRole(character.role);
  const tree = classId ? getPassiveTreeForClass(classId) : null;
  const classData = classId ? getClassById(classId) : null;

  if (!tree || !classId) {
    return (
      <div className="panel-content" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3 style={{ color: 'var(--text-dim)' }}>
          No class selected for this character.
        </h3>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          This character was created before the class system was added.
          <br />Please create a new character with a class.
        </p>
      </div>
    );
  }

  const getConnectionLines = () => {
    const lines: { x1: number; y1: number; x2: number; y2: number; allocated: boolean }[] = [];
    const processed = new Set<string>();

    tree.nodes.forEach(node => {
      node.connections.forEach(connId => {
        const key = [node.id, connId].sort().join('-');
        if (processed.has(key)) return;
        processed.add(key);

        const connNode = tree.nodes.find(n => n.id === connId);
        if (!connNode) return;

        lines.push({
          x1: node.position.x,
          y1: node.position.y,
          x2: connNode.position.x,
          y2: connNode.position.y,
          allocated: allocatedNodes.includes(node.id) && allocatedNodes.includes(connId)
        });
      });
    });

    return lines;
  };

  const getNodeSize = (nodeType: PassiveNode['nodeType']) => {
    switch (nodeType) {
      case 'start': return 52;
      case 'keystone': return 56;
      case 'mastery': return 50;
      case 'notable': return 44;
      default: return 36;
    }
  };

  const getNodeBorderColor = (node: PassiveNode, isAllocated: boolean) => {
    if (isAllocated) {
      return node.glowColor || classData?.primaryColor || 'var(--accent-gold)';
    }
    switch (node.nodeType) {
      case 'keystone': return '#ff6b6b';
      case 'mastery': return '#9b59b6';
      case 'notable': return '#3498db';
      default: return 'var(--border-color)';
    }
  };

  return (
    <div className="panel-content" style={{ padding: 0 }}>
      <div 
        className="passive-tree-container"
        style={{
          background: tree.backgroundColor || '#1a1a1a',
          position: 'relative',
        }}
      >
        {/* Background gradient based on class colors */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, ${classData?.primaryColor}10 0%, transparent 70%)`,
          pointerEvents: 'none'
        }} />
        
        <svg 
          style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          {getConnectionLines().map((line, i) => (
            <line
              key={i}
              x1={`${(line.x1 / tree.treeWidth) * 100}%`}
              y1={`${(line.y1 / tree.treeHeight) * 100}%`}
              x2={`${(line.x2 / tree.treeWidth) * 100}%`}
              y2={`${(line.y2 / tree.treeHeight) * 100}%`}
              stroke={line.allocated ? (tree.connectionColor || 'var(--accent-gold)') : 'rgba(255,255,255,0.15)'}
              strokeWidth={line.allocated ? 3 : 2}
              style={line.allocated ? { filter: `drop-shadow(0 0 6px ${tree.connectionColor || 'var(--accent-gold)'})` } : {}}
            />
          ))}
        </svg>
        
        <div className="passive-tree">
          {tree.nodes.map(node => {
            const isAllocated = allocatedNodes.includes(node.id);
            const canAllocate = canAllocateNode(classId, node.id, allocatedNodes);
            const affordable = totalPointsUsed + node.pointCost <= tree.maxPoints;
            const nodeSize = getNodeSize(node.nodeType);
            const borderColor = getNodeBorderColor(node, isAllocated);

            return (
              <div
                key={node.id}
                className={`passive-node ${node.nodeType} ${isAllocated ? 'allocated' : ''} ${canAllocate && affordable ? 'available' : 'unavailable'}`}
                style={{
                  left: `${(node.position.x / tree.treeWidth) * 100}%`,
                  top: `${(node.position.y / tree.treeHeight) * 100}%`,
                  width: nodeSize,
                  height: nodeSize,
                  transform: 'translate(-50%, -50%)',
                  borderColor: borderColor,
                  boxShadow: isAllocated ? `0 0 12px ${borderColor}, inset 0 0 8px ${borderColor}40` : undefined,
                }}
                onClick={() => onNodeClick(node)}
                onMouseEnter={(e) => onNodeHover(node, e)}
                onMouseLeave={() => onNodeHover(null)}
              >
                <div className="passive-node-inner" style={{ fontSize: nodeSize * 0.5 }}>
                  {node.icon}
                </div>
                {/* Point cost indicator */}
                {node.pointCost > 1 && !isAllocated && (
                  <div style={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    background: 'var(--bg-dark)',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '50%',
                    width: 16,
                    height: 16,
                    fontSize: '0.6rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    color: borderColor
                  }}>
                    {node.pointCost}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
