import { memo } from 'react';

interface LootBeamProps {
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  type: 'item' | 'orb' | 'map' | 'fragment';
  intensity?: number; // 0-1, for stacking multiple beams
  delay?: number; // Animation delay in ms
  isTemp?: boolean; // Temp beams are more subtle
}

// PoE-style beam colors - matching the exact filter colors
// Based on PlayEffect colors: Red, Blue, Green, Brown, White, Yellow, Purple, Orange, Pink
const BEAM_COLORS: Record<string, { primary: string; secondary: string; glow: string; name: string }> = {
  // Common - White beam (subtle)
  common: {
    primary: 'rgba(255, 255, 255, 0.25)',
    secondary: 'rgba(200, 200, 200, 0.15)',
    glow: 'rgba(255, 255, 255, 0.3)',
    name: 'White',
  },
  // Magic/Uncommon - Blue beam
  uncommon: {
    primary: 'rgba(136, 136, 255, 0.5)',
    secondary: 'rgba(100, 150, 255, 0.3)',
    glow: 'rgba(136, 136, 255, 0.7)',
    name: 'Blue',
  },
  // Rare - Yellow beam (bright gold)
  rare: {
    primary: 'rgba(255, 255, 119, 0.6)',
    secondary: 'rgba(255, 215, 0, 0.4)',
    glow: 'rgba(255, 255, 119, 0.8)',
    name: 'Yellow',
  },
  // Epic/Unique - Orange/Brown beam
  epic: {
    primary: 'rgba(175, 96, 37, 0.7)',
    secondary: 'rgba(255, 140, 0, 0.4)',
    glow: 'rgba(175, 96, 37, 0.9)',
    name: 'Brown',
  },
  // Legendary - Purple beam (vivid)
  legendary: {
    primary: 'rgba(179, 93, 255, 0.8)',
    secondary: 'rgba(145, 30, 220, 0.5)',
    glow: 'rgba(179, 93, 255, 1)',
    name: 'Purple',
  },
  // Currency/Orbs - Orange beam (like PoE currency)
  orb: {
    primary: 'rgba(235, 200, 110, 0.6)',
    secondary: 'rgba(255, 215, 0, 0.4)',
    glow: 'rgba(235, 200, 110, 0.8)',
    name: 'Orange',
  },
  // Maps - Yellow beam (high value)
  map: {
    primary: 'rgba(255, 255, 119, 0.7)',
    secondary: 'rgba(212, 175, 55, 0.4)',
    glow: 'rgba(255, 255, 119, 0.9)',
    name: 'Yellow',
  },
  // Fragments - Purple/Pink beam
  fragment: {
    primary: 'rgba(145, 30, 220, 0.6)',
    secondary: 'rgba(179, 93, 255, 0.4)',
    glow: 'rgba(145, 30, 220, 0.8)',
    name: 'Purple',
  },
};

export const LootBeam = memo(function LootBeam({ 
  rarity, 
  type,
  intensity = 1,
  delay = 0,
  isTemp = false
}: LootBeamProps) {
  // Determine color based on type first, then rarity
  const colorKey = type === 'orb' ? 'orb' : 
                   type === 'map' ? 'map' : 
                   type === 'fragment' ? 'fragment' : 
                   rarity;
  
  const colors = BEAM_COLORS[colorKey] || BEAM_COLORS.common;
  
  // Scale intensity - Temp beams are more subtle (50% intensity)
  const scaledIntensity = Math.min(intensity, 1) * (isTemp ? 0.5 : 1);
  
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 1,
        width: '100%',
        height: '100%',
      }}
    >
      <style>{`
        @keyframes loot-beam-pulse {
          0%, 100% {
            opacity: 0.4;
            transform: translateY(0) scaleY(1);
          }
          50% {
            opacity: 0.7;
            transform: translateY(-2px) scaleY(1.05);
          }
        }
        
        @keyframes loot-beam-glow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
        
        @keyframes loot-beam-shimmer {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 0% 200%;
          }
        }
      `}</style>
      
      {/* Main beam - vertical pillar (PoE style - tall and prominent) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '0',
          transform: 'translateX(-50%)',
          width: '8px',
          height: '300px',
          background: `linear-gradient(to top, 
            ${colors.primary} 0%,
            ${colors.secondary} 40%,
            transparent 100%
          )`,
          filter: `blur(2px)`,
          opacity: scaledIntensity * 0.7,
          animation: `loot-beam-pulse 2s ease-in-out infinite`,
          animationDelay: `${delay}ms`,
        }}
      />
      
      {/* Inner bright core (sharp center) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '0',
          transform: 'translateX(-50%)',
          width: '3px',
          height: '280px',
          background: `linear-gradient(to top, 
            ${colors.glow} 0%,
            ${colors.primary} 30%,
            transparent 100%
          )`,
          filter: `blur(1px)`,
          opacity: scaledIntensity * 0.9,
          animation: `loot-beam-pulse 2s ease-in-out infinite`,
          animationDelay: `${delay + 100}ms`,
        }}
      />
      
      {/* Outer glow aura (narrower soft glow) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '0',
          transform: 'translateX(-50%)',
          width: '20px',
          height: '250px',
          background: `linear-gradient(to top, 
            ${colors.secondary} 0%,
            transparent 50%
          )`,
          filter: `blur(10px)`,
          opacity: scaledIntensity * 0.5,
          animation: `loot-beam-pulse 2.5s ease-in-out infinite`,
          animationDelay: `${delay + 200}ms`,
        }}
      />
      
      {/* Ground glow effect (PoE style - bright base) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '-15px',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '25px',
          borderRadius: '50%',
          background: `radial-gradient(ellipse at center, 
            ${colors.glow} 0%,
            ${colors.primary} 25%,
            transparent 60%
          )`,
          filter: `blur(6px)`,
          opacity: scaledIntensity * 0.7,
          animation: `loot-beam-glow 2s ease-in-out infinite`,
          animationDelay: `${delay}ms`,
        }}
      />
      
      {/* Shimmer effect for rare+ items (PoE style sparkle) */}
      {(rarity === 'rare' || rarity === 'epic' || rarity === 'legendary' || type === 'map' || type === 'fragment') && !isTemp && (
        <>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '0',
              transform: 'translateX(-50%)',
              width: '5px',
              height: '300px',
              background: `linear-gradient(to top, 
                transparent 0%,
                ${colors.glow} 15%,
                transparent 30%,
                ${colors.glow} 50%,
                transparent 65%,
                ${colors.glow} 85%,
                transparent 100%
              )`,
              backgroundSize: '100% 200%',
              filter: `blur(2px)`,
              opacity: scaledIntensity * 0.7,
              animation: `loot-beam-shimmer 3s linear infinite`,
              animationDelay: `${delay}ms`,
            }}
          />
          {/* Extra sparkle for legendary */}
          {rarity === 'legendary' && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '0',
                transform: 'translateX(-50%)',
                width: '2px',
                height: '300px',
                background: `linear-gradient(to top, 
                  ${colors.glow} 0%,
                  transparent 50%,
                  ${colors.glow} 100%
                )`,
                filter: `blur(1px)`,
                opacity: scaledIntensity * 0.9,
                animation: `loot-beam-shimmer 1.5s linear infinite`,
                animationDelay: `${delay + 500}ms`,
              }}
            />
          )}
        </>
      )}
    </div>
  );
});

