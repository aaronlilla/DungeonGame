/**
 * Generates distinct colors for dungeon pulls
 * Uses a palette of visually distinct colors that work well on dark backgrounds
 */

export interface PullColor {
  primary: string;      // Main color
  bg: string;          // Background with opacity
  border: string;      // Border color
  glow: string;        // Glow effect color
  shadow: string;      // Shadow color
}

// Palette of distinct, vibrant colors that work well on dark backgrounds
const PULL_COLOR_PALETTE: PullColor[] = [
  // Cyan
  {
    primary: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.15)',
    border: 'rgba(6, 182, 212, 0.6)',
    glow: 'rgba(6, 182, 212, 0.4)',
    shadow: '0 0 12px rgba(6, 182, 212, 0.3)'
  },
  // Pink
  {
    primary: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.15)',
    border: 'rgba(236, 72, 153, 0.6)',
    glow: 'rgba(236, 72, 153, 0.4)',
    shadow: '0 0 12px rgba(236, 72, 153, 0.3)'
  },
  // Lime
  {
    primary: '#84cc16',
    bg: 'rgba(132, 204, 22, 0.15)',
    border: 'rgba(132, 204, 22, 0.6)',
    glow: 'rgba(132, 204, 22, 0.4)',
    shadow: '0 0 12px rgba(132, 204, 22, 0.3)'
  },
  // Orange
  {
    primary: '#f97316',
    bg: 'rgba(249, 115, 22, 0.15)',
    border: 'rgba(249, 115, 22, 0.6)',
    glow: 'rgba(249, 115, 22, 0.4)',
    shadow: '0 0 12px rgba(249, 115, 22, 0.3)'
  },
  // Purple
  {
    primary: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.15)',
    border: 'rgba(168, 85, 247, 0.6)',
    glow: 'rgba(168, 85, 247, 0.4)',
    shadow: '0 0 12px rgba(168, 85, 247, 0.3)'
  },
  // Teal
  {
    primary: '#14b8a6',
    bg: 'rgba(20, 184, 166, 0.15)',
    border: 'rgba(20, 184, 166, 0.6)',
    glow: 'rgba(20, 184, 166, 0.4)',
    shadow: '0 0 12px rgba(20, 184, 166, 0.3)'
  },
  // Yellow
  {
    primary: '#eab308',
    bg: 'rgba(234, 179, 8, 0.15)',
    border: 'rgba(234, 179, 8, 0.6)',
    glow: 'rgba(234, 179, 8, 0.4)',
    shadow: '0 0 12px rgba(234, 179, 8, 0.3)'
  },
  // Red
  {
    primary: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.6)',
    glow: 'rgba(239, 68, 68, 0.4)',
    shadow: '0 0 12px rgba(239, 68, 68, 0.3)'
  },
  // Indigo
  {
    primary: '#6366f1',
    bg: 'rgba(99, 102, 241, 0.15)',
    border: 'rgba(99, 102, 241, 0.6)',
    glow: 'rgba(99, 102, 241, 0.4)',
    shadow: '0 0 12px rgba(99, 102, 241, 0.3)'
  },
  // Emerald
  {
    primary: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.6)',
    glow: 'rgba(16, 185, 129, 0.4)',
    shadow: '0 0 12px rgba(16, 185, 129, 0.3)'
  },
  // Rose
  {
    primary: '#f43f5e',
    bg: 'rgba(244, 63, 94, 0.15)',
    border: 'rgba(244, 63, 94, 0.6)',
    glow: 'rgba(244, 63, 94, 0.4)',
    shadow: '0 0 12px rgba(244, 63, 94, 0.3)'
  },
  // Violet
  {
    primary: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.15)',
    border: 'rgba(139, 92, 246, 0.6)',
    glow: 'rgba(139, 92, 246, 0.4)',
    shadow: '0 0 12px rgba(139, 92, 246, 0.3)'
  },
  // Amber
  {
    primary: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.6)',
    glow: 'rgba(245, 158, 11, 0.4)',
    shadow: '0 0 12px rgba(245, 158, 11, 0.3)'
  },
  // Sky
  {
    primary: '#0ea5e9',
    bg: 'rgba(14, 165, 233, 0.15)',
    border: 'rgba(14, 165, 233, 0.6)',
    glow: 'rgba(14, 165, 233, 0.4)',
    shadow: '0 0 12px rgba(14, 165, 233, 0.3)'
  },
  // Fuchsia
  {
    primary: '#d946ef',
    bg: 'rgba(217, 70, 239, 0.15)',
    border: 'rgba(217, 70, 239, 0.6)',
    glow: 'rgba(217, 70, 239, 0.4)',
    shadow: '0 0 12px rgba(217, 70, 239, 0.3)'
  }
];

/**
 * Gets a color for a specific pull number
 * Cycles through the palette if there are more pulls than colors
 */
export function getPullColor(pullNumber: number): PullColor {
  const index = (pullNumber - 1) % PULL_COLOR_PALETTE.length;
  return PULL_COLOR_PALETTE[index];
}

/**
 * Gets the pull number for a specific pack ID from the route
 */
export function getPullNumberForPack(packId: string, routePulls: { pullNumber: number; packIds: string[] }[]): number | null {
  const pull = routePulls.find(p => p.packIds.includes(packId));
  return pull ? pull.pullNumber : null;
}





