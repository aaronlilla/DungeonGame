
interface PanelOrnamentsProps {
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

// Simple L-shaped corner brackets - subtle and clean
export function PanelOrnaments({ 
  color = '#c9a227', 
  size = 'medium',
}: PanelOrnamentsProps) {
  const sizeMap = {
    small: { width: 12, offset: 4, border: 1, opacity: 0.2 },
    medium: { width: 16, offset: 6, border: 1.5, opacity: 0.15 },
    large: { width: 20, offset: 8, border: 2, opacity: 0.15 },
  };
  const s = sizeMap[size];

  return (
    <>
      {/* Top-left */}
      <div style={{
        position: 'absolute',
        top: s.offset,
        left: s.offset,
        width: s.width,
        height: s.width,
        borderTop: `${s.border}px solid ${color}`,
        borderLeft: `${s.border}px solid ${color}`,
        opacity: s.opacity,
        pointerEvents: 'none',
        zIndex: 10,
      }} />
      {/* Top-right */}
      <div style={{
        position: 'absolute',
        top: s.offset,
        right: s.offset,
        width: s.width,
        height: s.width,
        borderTop: `${s.border}px solid ${color}`,
        borderRight: `${s.border}px solid ${color}`,
        opacity: s.opacity,
        pointerEvents: 'none',
        zIndex: 10,
      }} />
      {/* Bottom-left */}
      <div style={{
        position: 'absolute',
        bottom: s.offset,
        left: s.offset,
        width: s.width,
        height: s.width,
        borderBottom: `${s.border}px solid ${color}`,
        borderLeft: `${s.border}px solid ${color}`,
        opacity: s.opacity,
        pointerEvents: 'none',
        zIndex: 10,
      }} />
      {/* Bottom-right */}
      <div style={{
        position: 'absolute',
        bottom: s.offset,
        right: s.offset,
        width: s.width,
        height: s.width,
        borderBottom: `${s.border}px solid ${color}`,
        borderRight: `${s.border}px solid ${color}`,
        opacity: s.opacity,
        pointerEvents: 'none',
        zIndex: 10,
      }} />
    </>
  );
}

// Decorative header line - subtle gold accent
export function HeaderOrnament({ color = '#c9a227' }: { color?: string }) {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: `linear-gradient(90deg, transparent 10%, ${color}50 50%, transparent 90%)`,
    }} />
  );
}

// Decorative divider line - simple and elegant
export function DividerOrnament({ color = '#c9a227', width = '80%' }: { color?: string; width?: string }) {
  return (
    <div style={{
      width,
      height: '1px',
      background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
      margin: '0 auto',
    }} />
  );
}
