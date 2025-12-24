import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { PassiveTreeData, PassiveNode } from '../../data/PassiveTreeData';
import { canAllocateNode, getClassThemeColors } from '../../data/PassiveTreeData';

interface POEPassiveTreeProps {
  treeData: PassiveTreeData;
  allocatedNodes: Set<string>;
  onNodeClick: (nodeId: string) => void;
  maxPoints: number;
  usedPoints: number;
}

interface TooltipState {
  node: PassiveNode;
  x: number;
  y: number;
}

// ============================================================================
// Main Component  
// ============================================================================

export function POEPassiveTree({
  treeData,
  allocatedNodes,
  onNodeClick,
  maxPoints,
  usedPoints,
}: POEPassiveTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hoveredNode, setHoveredNode] = useState<PassiveNode | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  
  const themeColors = getClassThemeColors(treeData.classId);
  
  const nodeArray = useMemo(() => Array.from(treeData.nodes.values()), [treeData]);
  
  // Pre-calculate unique connections
  const connections = useMemo(() => {
    const conns: Array<{ from: PassiveNode; to: PassiveNode }> = [];
    const seen = new Set<string>();
    
    for (const node of nodeArray) {
      for (const connId of node.connections) {
        const key = [node.id, connId].sort().join('-');
        if (seen.has(key)) continue;
        seen.add(key);
        
        const connNode = treeData.nodes.get(connId);
        if (connNode) {
          conns.push({ from: node, to: connNode });
        }
      }
    }
    return conns;
  }, [nodeArray, treeData]);
  
  // ============================================================================
  // Initialize View - Center on tree
  // ============================================================================
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    setCanvasSize({ width, height });
    
    const treeWidth = treeData.bounds.maxX - treeData.bounds.minX;
    const treeHeight = treeData.bounds.maxY - treeData.bounds.minY;
    
    // Fit tree in view with padding
    const fitZoom = Math.min(
      (width * 0.85) / treeWidth,
      (height * 0.85) / treeHeight
    );
    const initialZoom = Math.max(0.5, Math.min(2.5, fitZoom));
    
    setZoom(initialZoom);
    // Center on origin (where start node is)
    setPan({
      x: width / 2,
      y: height / 2,
    });
  }, [treeData.classId]);
  
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setCanvasSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // ============================================================================
  // Canvas Rendering
  // ============================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Dark background with subtle radial gradient
    const bgGradient = ctx.createRadialGradient(
      canvasSize.width / 2, canvasSize.height / 2, 0,
      canvasSize.width / 2, canvasSize.height / 2, Math.max(canvasSize.width, canvasSize.height)
    );
    bgGradient.addColorStop(0, '#151210');
    bgGradient.addColorStop(1, '#0a0806');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);
    
    // ========== Draw Ring Guidelines and Radial Spokes ==========
    const maxRing = Math.max(...nodeArray.map(n => n.ring));
    const ringSpacing = 100;
    
    // Draw subtle radial spokes (every 60 degrees for hexagonal feel)
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const outerRadius = (maxRing + 0.5) * ringSpacing;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
      ctx.strokeStyle = 'rgba(45, 40, 35, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Draw concentric ring circles
    for (let ring = 1; ring <= maxRing; ring++) {
      const radius = ring * ringSpacing;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      // Make outer rings slightly more visible
      const alpha = 0.12 + (ring / maxRing) * 0.08;
      ctx.strokeStyle = `rgba(55, 50, 45, ${alpha})`;
      ctx.lineWidth = ring === maxRing ? 1.5 : 1;
      ctx.stroke();
    }
    
    // Draw very subtle inner glow at center
    const centerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, ringSpacing * 0.8);
    centerGlow.addColorStop(0, `rgba(${parseInt(themeColors.primary.slice(1,3), 16)}, ${parseInt(themeColors.primary.slice(3,5), 16)}, ${parseInt(themeColors.primary.slice(5,7), 16)}, 0.08)`);
    centerGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = centerGlow;
    ctx.beginPath();
    ctx.arc(0, 0, ringSpacing * 0.8, 0, Math.PI * 2);
    ctx.fill();
    
    // ========== Draw Connections with Curves ==========
    for (const conn of connections) {
      const bothAllocated = allocatedNodes.has(conn.from.id) && allocatedNodes.has(conn.to.id);
      const isPath = !bothAllocated && (
        (allocatedNodes.has(conn.from.id) && canAllocateNode(treeData, conn.to.id, allocatedNodes)) ||
        (allocatedNodes.has(conn.to.id) && canAllocateNode(treeData, conn.from.id, allocatedNodes))
      );
      const isHovered = hoveredNode && 
        (hoveredNode.id === conn.from.id || hoveredNode.id === conn.to.id);
      
      // Calculate curve control point
      const midX = (conn.from.x + conn.to.x) / 2;
      const midY = (conn.from.y + conn.to.y) / 2;
      
      // Distance from origin to midpoint
      const distFromCenter = Math.sqrt(midX * midX + midY * midY);
      
      // Direction from origin to midpoint (normalized)
      const dirX = distFromCenter > 0 ? midX / distFromCenter : 0;
      const dirY = distFromCenter > 0 ? midY / distFromCenter : 0;
      
      // Line length determines curve intensity
      const dx = conn.to.x - conn.from.x;
      const dy = conn.to.y - conn.from.y;
      const lineLength = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate angle difference between nodes (for same-ring connections)
      const angle1 = Math.atan2(conn.from.y, conn.from.x);
      const angle2 = Math.atan2(conn.to.y, conn.to.x);
      let angleDiff = Math.abs(angle1 - angle2);
      if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
      
      // Same ring connections curve outward along the arc
      const sameRing = Math.abs(conn.from.ring - conn.to.ring) === 0;
      const adjacentRing = Math.abs(conn.from.ring - conn.to.ring) === 1;
      
      // Curve amount based on connection type
      let curveAmount = 0;
      if (sameRing && angleDiff > 0.1) {
        // Same ring: curve outward (like arc segments)
        curveAmount = lineLength * 0.35;
      } else if (adjacentRing && angleDiff > 0.3) {
        // Adjacent rings with angle difference: gentle curve
        curveAmount = lineLength * 0.2;
      } else if (!sameRing && !adjacentRing) {
        // Long connections: subtle curve
        curveAmount = lineLength * 0.12;
      }
      
      // Control point curves outward from center
      const ctrlX = midX + dirX * curveAmount;
      const ctrlY = midY + dirY * curveAmount;
      
      // Draw the curved line
      ctx.beginPath();
      ctx.moveTo(conn.from.x, conn.from.y);
      
      if (curveAmount > 5) {
        // Quadratic bezier curve
        ctx.quadraticCurveTo(ctrlX, ctrlY, conn.to.x, conn.to.y);
      } else {
        // Straight line for very short connections
        ctx.lineTo(conn.to.x, conn.to.y);
      }
      
      if (bothAllocated) {
        ctx.strokeStyle = themeColors.secondary;
        ctx.lineWidth = 4;
        ctx.shadowColor = themeColors.primary;
        ctx.shadowBlur = 10;
      } else if (isPath) {
        ctx.strokeStyle = 'rgba(200, 180, 120, 0.85)';
        ctx.lineWidth = 3;
        ctx.shadowColor = 'rgba(200, 180, 120, 0.3)';
        ctx.shadowBlur = 4;
      } else if (isHovered) {
        ctx.strokeStyle = 'rgba(255, 220, 150, 0.7)';
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 0;
      } else {
        ctx.strokeStyle = 'rgba(80, 72, 60, 0.55)';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
      }
      
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    
    // ========== Draw Nodes ==========
    for (const node of nodeArray) {
      const isAllocated = allocatedNodes.has(node.id);
      const canAlloc = canAllocateNode(treeData, node.id, allocatedNodes);
      const isHovered = hoveredNode?.id === node.id;
      const isConnectedToHover = hoveredNode && node.connections.includes(hoveredNode.id);
      
      // Size based on type
      let size = 14;
      if (node.isStart) size = 28;
      else if (node.isKeystone) size = 32;
      else if (node.isNotable) size = 22;
      
      // Outer glow for allocated/hovered nodes
      if (isAllocated || isHovered) {
        const glowSize = size * 1.8;
        const gradient = ctx.createRadialGradient(node.x, node.y, size * 0.5, node.x, node.y, glowSize);
        gradient.addColorStop(0, isHovered ? 'rgba(255, 220, 150, 0.6)' : themeColors.glow);
        gradient.addColorStop(0.5, isHovered ? 'rgba(255, 220, 150, 0.2)' : `rgba(${parseInt(themeColors.primary.slice(1,3), 16)}, ${parseInt(themeColors.primary.slice(3,5), 16)}, ${parseInt(themeColors.primary.slice(5,7), 16)}, 0.15)`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Node shape - different for keystones
      ctx.beginPath();
      if (node.isKeystone) {
        // Hexagonal shape for keystones
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI * 2) / 6 - Math.PI / 2;
          const px = node.x + Math.cos(angle) * size;
          const py = node.y + Math.sin(angle) * size;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else if (node.isNotable) {
        // Diamond shape for notables
        ctx.moveTo(node.x, node.y - size);
        ctx.lineTo(node.x + size, node.y);
        ctx.lineTo(node.x, node.y + size);
        ctx.lineTo(node.x - size, node.y);
        ctx.closePath();
      } else {
        // Circle for regular nodes
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
      }
      
      // Fill
      if (isAllocated) {
        const nodeGradient = ctx.createRadialGradient(
          node.x - size * 0.3, node.y - size * 0.3, 0,
          node.x, node.y, size * 1.2
        );
        nodeGradient.addColorStop(0, themeColors.secondary);
        nodeGradient.addColorStop(1, themeColors.primary);
        ctx.fillStyle = nodeGradient;
      } else if (isHovered) {
        ctx.fillStyle = 'rgba(120, 110, 95, 0.95)';
      } else if (isConnectedToHover) {
        ctx.fillStyle = 'rgba(100, 92, 80, 0.9)';
      } else if (canAlloc) {
        ctx.fillStyle = 'rgba(65, 60, 52, 0.92)';
      } else {
        ctx.fillStyle = 'rgba(40, 36, 32, 0.88)';
      }
      ctx.fill();
      
      // Border
      ctx.lineWidth = node.isKeystone ? 3.5 : node.isNotable ? 3 : node.isStart ? 3.5 : 2;
      if (node.isStart) {
        ctx.strokeStyle = isAllocated ? themeColors.secondary : '#ccaa44';
      } else if (isAllocated) {
        ctx.strokeStyle = themeColors.secondary;
      } else if (isHovered || isConnectedToHover) {
        ctx.strokeStyle = '#ddbb66';
      } else if (node.isKeystone) {
        ctx.strokeStyle = canAlloc ? '#dd7777' : '#663333';
      } else if (node.isNotable) {
        ctx.strokeStyle = canAlloc ? '#7799dd' : '#334466';
      } else {
        ctx.strokeStyle = canAlloc ? '#887766' : '#443322';
      }
      ctx.stroke();
      
      // Inner detail for start node
      if (node.isStart) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = isAllocated ? themeColors.secondary : '#998855';
        ctx.fill();
      }
    }
    
    ctx.restore();
  }, [nodeArray, connections, allocatedNodes, hoveredNode, zoom, pan, canvasSize, treeData, themeColors]);
  
  // ============================================================================
  // Event Handlers
  // ============================================================================
  
  const findNodeAt = useCallback((clientX: number, clientY: number): PassiveNode | null => {
    if (!containerRef.current) return null;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    const worldX = (mouseX - pan.x) / zoom;
    const worldY = (mouseY - pan.y) / zoom;
    
    let closest: PassiveNode | null = null;
    let closestDist = Infinity;
    
    for (const node of nodeArray) {
      const dx = node.x - worldX;
      const dy = node.y - worldY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      let hitRadius = 18;
      if (node.isStart) hitRadius = 32;
      else if (node.isKeystone) hitRadius = 36;
      else if (node.isNotable) hitRadius = 26;
      
      if (dist < hitRadius && dist < closestDist) {
        closest = node;
        closestDist = dist;
      }
    }
    
    return closest;
  }, [pan, zoom, nodeArray]);
  
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.88 : 1.14;
    const newZoom = Math.min(5, Math.max(0.3, zoom * delta));
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      setPan({
        x: mouseX - (mouseX - pan.x) * (newZoom / zoom),
        y: mouseY - (mouseY - pan.y) * (newZoom / zoom),
      });
    }
    setZoom(newZoom);
  }, [zoom, pan]);
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      const node = findNodeAt(e.clientX, e.clientY);
      if (node) {
        onNodeClick(node.id);
        return;
      }
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y });
    }
  }, [pan, findNodeAt, onNodeClick]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: dragStart.panX + (e.clientX - dragStart.x),
        y: dragStart.panY + (e.clientY - dragStart.y),
      });
      setHoveredNode(null);
      setTooltip(null);
    } else {
      const node = findNodeAt(e.clientX, e.clientY);
      setHoveredNode(node);
      
      if (node) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltip({
            node,
            x: e.clientX - rect.left + 15,
            y: e.clientY - rect.top + 15,
          });
        }
      } else {
        setTooltip(null);
      }
    }
  }, [isDragging, dragStart, findNodeAt]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const zoomIn = () => setZoom(z => Math.min(5, z * 1.3));
  const zoomOut = () => setZoom(z => Math.max(0.3, z / 1.3));
  const resetView = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const treeWidth = treeData.bounds.maxX - treeData.bounds.minX;
      const treeHeight = treeData.bounds.maxY - treeData.bounds.minY;
      
      const fitZoom = Math.min(
        (container.clientWidth * 0.85) / treeWidth,
        (container.clientHeight * 0.85) / treeHeight
      );
      const newZoom = Math.max(0.5, Math.min(2.5, fitZoom));
      
      setZoom(newZoom);
      setPan({
        x: container.clientWidth / 2,
        y: container.clientHeight / 2,
      });
    }
  };
  
  // ============================================================================
  // Render
  // ============================================================================
  return (
    <div className="poe-tree-wrapper">
      <div className="poe-tree-header">
        <div className="poe-tree-title">
          <span className="tree-class-icon" style={{ color: themeColors.secondary }}>⬡</span>
          <span className="tree-class-name" style={{ color: themeColors.secondary }}>
            {treeData.displayName}
          </span>
        </div>
        <div className="poe-tree-stats">
          <span className="tree-stat">
            <span style={{ color: themeColors.secondary }}>{usedPoints}</span>
            <span className="tree-stat-label"> / {maxPoints} Points</span>
          </span>
          <span className="tree-stat-divider">|</span>
          <span className="tree-stat">
            <span className="tree-stat-label">Nodes: </span>
            <span>{allocatedNodes.size}</span>
          </span>
        </div>
      </div>
      
      <div className="poe-tree-controls">
        <button className="poe-zoom-btn" onClick={zoomIn} title="Zoom In">+</button>
        <span className="poe-zoom-level">{Math.round(zoom * 100)}%</span>
        <button className="poe-zoom-btn" onClick={zoomOut} title="Zoom Out">−</button>
        <button className="poe-zoom-btn poe-reset-btn" onClick={resetView} title="Reset View">⟲</button>
      </div>
      
      <div
        ref={containerRef}
        className="poe-tree-container"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp();
          setHoveredNode(null);
          setTooltip(null);
        }}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: canvasSize.width, height: canvasSize.height }}
        />
        
        {tooltip && (
          <div
            className="poe-tooltip"
            style={{
              left: Math.min(tooltip.x, canvasSize.width - 280),
              top: Math.min(tooltip.y, canvasSize.height - 150),
              borderColor: tooltip.node.isKeystone ? '#dd6666' :
                           tooltip.node.isNotable ? themeColors.secondary :
                           'rgba(90, 70, 50, 0.8)',
            }}
          >
            <div className="poe-tooltip-header">
              <span
                className="poe-tooltip-name"
                style={{
                  color: tooltip.node.isKeystone ? '#ff7777' :
                         tooltip.node.isNotable ? themeColors.secondary :
                         tooltip.node.isStart ? themeColors.secondary :
                         '#d4af37',
                }}
              >
                {tooltip.node.name}
              </span>
              {tooltip.node.isKeystone && <span className="poe-tooltip-tag keystone">Keystone</span>}
              {tooltip.node.isNotable && <span className="poe-tooltip-tag notable">Notable</span>}
              {tooltip.node.isStart && <span className="poe-tooltip-tag start">Start</span>}
            </div>
            <div className="poe-tooltip-stats">
              {tooltip.node.stats.map((stat, i) => (
                <div key={i} className="poe-tooltip-stat">{stat}</div>
              ))}
            </div>
            <div className="poe-tooltip-footer">
              {allocatedNodes.has(tooltip.node.id) ? (
                <span className="poe-tooltip-hint allocated">Click to deallocate</span>
              ) : canAllocateNode(treeData, tooltip.node.id, allocatedNodes) ? (
                <span className="poe-tooltip-hint available">Click to allocate</span>
              ) : (
                <span className="poe-tooltip-hint locked">Connect from allocated node</span>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="poe-tree-legend">
        <div className="legend-item">
          <div className="legend-shape circle" style={{ 
            background: themeColors.primary,
            borderColor: themeColors.secondary, 
            boxShadow: `0 0 8px ${themeColors.glow}` 
          }} />
          <span>Allocated</span>
        </div>
        <div className="legend-item">
          <div className="legend-shape circle available" />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-shape diamond notable" />
          <span>Notable</span>
        </div>
        <div className="legend-item">
          <div className="legend-shape hexagon keystone" />
          <span>Keystone</span>
        </div>
      </div>
    </div>
  );
}
