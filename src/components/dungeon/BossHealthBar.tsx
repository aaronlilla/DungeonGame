import type { AnimatedEnemy } from '../../types/combat';
import { getEnemyImage } from '../../utils/enemyImages';
import { getEnemyById } from '../../types/dungeon';

interface BossHealthBarProps {
  bossEnemy: AnimatedEnemy | undefined;
  isRunning: boolean;
  phase: 'idle' | 'traveling' | 'combat' | 'victory' | 'defeat';
}

export function BossHealthBar({ bossEnemy, isRunning, phase }: BossHealthBarProps) {
  if (!bossEnemy || !isRunning || phase !== 'combat') {
    return null;
  }

  const bossHealthPercent = (bossEnemy.health / bossEnemy.maxHealth) * 100;
  
  // Get boss image for background
  const getBossImage = () => {
    const isMiniboss = bossEnemy.type === 'miniboss';
    let imageKey = bossEnemy.name;
    
    if (isMiniboss && bossEnemy.enemyId) {
      // Get the original enemy definition to use its name for the image
      const originalEnemy = getEnemyById(bossEnemy.enemyId);
      if (originalEnemy) {
        imageKey = originalEnemy.name;
      }
    }
    
    return getEnemyImage(imageKey);
  };
  
  const bossImage = getBossImage();

  return (
    <div 
      className="boss-health-bar-container" 
      style={{
        position: 'fixed',
        top: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        maxWidth: '90vw',
        zIndex: 1000,
        pointerEvents: 'none',
        animation: 'bossHealthBarAppear 0.6s ease-out'
      }}
    >
      <div style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(20,10,5,0.98) 100%)',
        border: '3px solid #8b0000',
        borderRadius: '8px',
        padding: '16px 24px',
        boxShadow: '0 0 30px rgba(139, 0, 0, 0.6), inset 0 0 20px rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Boss Image Background */}
        {bossImage && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${bossImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            filter: 'blur(1px)',
            zIndex: 0
          }} />
        )}
        {/* Decorative corner elements */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '20px',
          height: '20px',
          borderTop: '2px solid #cc2222',
          borderLeft: '2px solid #cc2222',
          opacity: 0.7,
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderTop: '2px solid #cc2222',
          borderRight: '2px solid #cc2222',
          opacity: 0.7,
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          width: '20px',
          height: '20px',
          borderBottom: '2px solid #cc2222',
          borderLeft: '2px solid #cc2222',
          opacity: 0.7,
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderBottom: '2px solid #cc2222',
          borderRight: '2px solid #cc2222',
          opacity: 0.7,
          zIndex: 1
        }} />
        
        {/* Boss Name */}
        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#f0e6d2',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(204,34,34,0.5)',
          marginBottom: '12px',
          textAlign: 'center',
          letterSpacing: '2px',
          fontFamily: 'Cinzel, serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          position: 'relative',
          zIndex: 1
        }}>
          {bossImage ? (
            <img 
              src={bossImage} 
              alt={bossEnemy.name}
              style={{
                width: '48px',
                height: '48px',
                objectFit: 'contain',
                imageRendering: 'crisp-edges',
                border: '2px solid #8b0000',
                borderRadius: '4px',
                background: 'rgba(0,0,0,0.5)',
                padding: '4px',
                boxShadow: '0 0 10px rgba(139, 0, 0, 0.4)'
              }}
            />
          ) : (
            <span style={{
              fontSize: '36px',
              filter: 'drop-shadow(0 0 5px rgba(139, 0, 0, 0.6))'
            }}>{bossEnemy.icon}</span>
          )}
          <span>{bossEnemy.name}</span>
        </div>
        
        {/* Health Bar Container */}
        <div style={{
          height: '32px',
          background: 'rgba(0,0,0,0.8)',
          border: '2px solid #3d3529',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6)',
          zIndex: 1
        }}>
          {/* Health Bar Fill */}
          <div 
            className="boss-health-fill"
            style={{
              height: '100%',
              width: `${bossHealthPercent}%`,
              background: bossHealthPercent > 60 
                ? 'linear-gradient(90deg, #8b0000 0%, #cc2222 50%, #8b0000 100%)'
                : bossHealthPercent > 30
                ? 'linear-gradient(90deg, #cc2222 0%, #ff4444 50%, #cc2222 100%)'
                : 'linear-gradient(90deg, #ff4444 0%, #ff6666 50%, #ff4444 100%)',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease',
              boxShadow: '0 0 20px rgba(204,34,34,0.6), inset 0 0 10px rgba(255,255,255,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Animated shine effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: 'bossHealthShine 3s infinite'
            }} />
          </div>
          
          {/* Health Text Overlay */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#f0e6d2',
            fontSize: '16px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
            pointerEvents: 'none',
            fontFamily: 'Cinzel, serif'
          }}>
            {Math.floor(bossEnemy.health).toLocaleString()} / {Math.floor(bossEnemy.maxHealth).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

