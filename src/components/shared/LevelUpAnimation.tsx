import React, { useEffect, useState } from 'react';
import type { Character } from '../../types/character';

interface LevelUpAnimationProps {
  character: Character;
  newLevel: number;
  onDismiss: () => void;
}

export const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({ character, newLevel, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [scale, setScale] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      delay: Math.random() * 0.3
    }));
    setParticles(newParticles);

    // Animation sequence
    const timer1 = setTimeout(() => {
      setScale(1.2);
      setOpacity(1);
    }, 50);

    const timer2 = setTimeout(() => {
      setScale(1);
    }, 200);

    const timer3 = setTimeout(() => {
      setScale(1.1);
    }, 400);

    const timer4 = setTimeout(() => {
      setScale(1);
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const handleClick = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      tabIndex={0}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        cursor: 'pointer',
        animation: 'fadeIn 0.3s ease-in',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes levelUpPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes particleFloat {
          0% { 
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% { 
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
          }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.8; transform: scale(1.2) rotate(180deg); }
        }
        @keyframes levelUpGlow {
          0%, 100% { 
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 165, 0, 0.6);
          }
          50% { 
            box-shadow: 0 0 60px rgba(255, 215, 0, 1), 0 0 120px rgba(255, 165, 0, 0.8), 0 0 160px rgba(255, 100, 0, 0.4);
          }
        }
      `}</style>
      
      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '8px',
            height: '8px',
            backgroundColor: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#95E1D3'][particle.id % 5],
            borderRadius: '50%',
            pointerEvents: 'none',
            '--tx': `${particle.x * 3}px`,
            '--ty': `${particle.y * 3 - 100}px`,
            animation: `particleFloat 1.5s ease-out ${particle.delay}s forwards`,
            animationName: 'particleFloat',
          } as React.CSSProperties}
        />
      ))}

      {/* Main Level Up Card */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '4px solid #FFD700',
          borderRadius: '20px',
          padding: '3rem 4rem',
          textAlign: 'center',
          transform: `scale(${scale})`,
          opacity: opacity,
          transition: 'transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.3s ease-in',
          animation: 'levelUpGlow 2s ease-in-out infinite',
          minWidth: '400px',
          boxShadow: '0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 165, 0, 0.6)',
        }}
      >
        {/* Sparkle effects */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${20 + (i * 12.5)}%`,
              top: i % 2 === 0 ? '10%' : '90%',
              width: '20px',
              height: '20px',
              background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
              animation: `sparkle 1.5s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}

        {/* Level Up Text */}
        <div
          style={{
            fontSize: '4rem',
            fontWeight: 900,
            background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF6B6B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            textShadow: '0 0 30px rgba(255, 215, 0, 0.8)',
            animation: 'levelUpPulse 0.6s ease-in-out',
            letterSpacing: '0.1em',
          }}
        >
          LEVEL UP!
        </div>

        {/* Character Name */}
        <div
          style={{
            fontSize: '1.5rem',
            color: '#FFD700',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
          }}
        >
          {character.name}
        </div>

        {/* New Level */}
        <div
          style={{
            fontSize: '6rem',
            fontWeight: 900,
            color: '#FFD700',
            marginTop: '1rem',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 165, 0, 0.6)',
            animation: 'levelUpPulse 0.6s ease-in-out 0.2s',
          }}
        >
          {newLevel}
        </div>

        {/* Click to dismiss hint */}
        <div
          style={{
            marginTop: '2rem',
            fontSize: '0.9rem',
            color: '#aaa',
            fontStyle: 'italic',
          }}
        >
          Click anywhere to continue
        </div>
      </div>
    </div>
  );
};

