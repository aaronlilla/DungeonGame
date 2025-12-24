import React, { useEffect, useState } from 'react';

interface LevelUpFrameAnimationProps {
  newLevel: number;
  onComplete: () => void;
}

export const LevelUpFrameAnimation: React.FC<LevelUpFrameAnimationProps> = ({ newLevel, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Simple fade in
    const timer1 = setTimeout(() => {
      setOpacity(1);
    }, 50);

    // Fade out and complete
    const timer2 = setTimeout(() => {
      setOpacity(0);
      setIsVisible(false);
    }, 1800);

    const timer3 = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  if (!isVisible) return null;

  return (
    <>
      {/* Simple border highlight */}
      <div
        style={{
          position: 'absolute',
          inset: '-2px',
          borderRadius: '3px',
          border: '2px solid #8b6914',
          opacity,
          pointerEvents: 'none',
          zIndex: 100,
          transition: 'opacity 0.3s ease-out',
        }}
      />

      {/* Level up text */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity,
          zIndex: 103,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease-out',
        }}
      >
        <div
          style={{
            color: '#8b6914',
            fontSize: '0.9rem',
            fontWeight: 700,
            fontFamily: "'Cinzel', Georgia, serif",
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            letterSpacing: '0.05em',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          ★ LEVEL {newLevel} ★
        </div>
      </div>
    </>
  );
};
