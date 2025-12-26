import type { AnimatedEnemy } from '../../types/combat';
import { getEnemyImage } from '../../utils/enemyImages';
import { getEnemyById } from '../../types/dungeon';

interface BossHealthBarProps {
  bossEnemy: AnimatedEnemy | undefined;
  bossEnemies?: AnimatedEnemy[]; // For twin bosses
  isRunning: boolean;
  phase: 'idle' | 'traveling' | 'combat' | 'victory' | 'defeat';
}

export function BossHealthBar({ bossEnemy, bossEnemies, isRunning, phase }: BossHealthBarProps) {
  // Support both single boss and twin bosses
  const bosses = bossEnemies && bossEnemies.length > 0 ? bossEnemies : (bossEnemy ? [bossEnemy] : []);
  
  if (bosses.length === 0 || !isRunning || phase !== 'combat') {
    return null;
  }

  const isTwinBoss = bosses.length === 2;
  const mainBoss = bosses[0];
  const secondBoss = bosses[1];
  
  // Calculate combined health for twin bosses, or single boss health
  const totalHealth = bosses.reduce((sum, b) => sum + b.health, 0);
  const totalMaxHealth = bosses.reduce((sum, b) => sum + b.maxHealth, 0);
  const bossHealthPercent = (totalHealth / totalMaxHealth) * 100;
  
  // Get boss image for background
  const getBossImage = (enemy: AnimatedEnemy) => {
    const isMiniboss = enemy.type === 'miniboss';
    let imageKey = enemy.name;
    
    if (isMiniboss && enemy.enemyId) {
      // Get the original enemy definition to use its name for the image
      const originalEnemy = getEnemyById(enemy.enemyId);
      if (originalEnemy) {
        imageKey = originalEnemy.name;
      }
    }
    
    return getEnemyImage(imageKey);
  };
  
  const mainBossImage = getBossImage(mainBoss);
  const secondBossImage = secondBoss ? getBossImage(secondBoss) : null;

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
        {/* Boss Image Background - handle twin bosses */}
        {isTwinBoss && mainBossImage && secondBossImage ? (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '-40px', // Overlap them
            opacity: 0.15,
            filter: 'blur(1px)',
            zIndex: 0
          }}>
            <div style={{
              backgroundImage: `url(${mainBossImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '50%',
              height: '100%',
              marginRight: '-20%' // Overlap
            }} />
            <div style={{
              backgroundImage: `url(${secondBossImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '50%',
              height: '100%',
              marginLeft: '-20%' // Overlap
            }} />
          </div>
        ) : mainBossImage && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${mainBossImage})`,
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
        
        {/* Boss Name(s) */}
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
          zIndex: 1,
          flexWrap: 'wrap'
        }}>
          {isTwinBoss ? (
            <>
              {/* First boss image and name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {mainBossImage ? (
                  <img 
                    src={mainBossImage} 
                    alt={mainBoss.name}
                    style={{
                      width: '64px', // Bigger for final boss
                      height: '64px',
                      objectFit: 'contain',
                      imageRendering: 'crisp-edges',
                      border: '2px solid #8b0000',
                      borderRadius: '4px',
                      background: 'rgba(0,0,0,0.5)',
                      padding: '4px',
                      boxShadow: '0 0 10px rgba(139, 0, 0, 0.4)',
                      position: 'relative',
                      zIndex: 2
                    }}
                  />
                ) : (
                  <span style={{
                    fontSize: '48px',
                    filter: 'drop-shadow(0 0 5px rgba(139, 0, 0, 0.6))'
                  }}>{mainBoss.icon}</span>
                )}
                <span>{mainBoss.name}</span>
              </div>
              <span style={{ fontSize: '24px', opacity: 0.7 }}>&</span>
              {/* Second boss image and name - overlapped */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '-30px' }}>
                {secondBossImage ? (
                  <img 
                    src={secondBossImage} 
                    alt={secondBoss.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      objectFit: 'contain',
                      imageRendering: 'crisp-edges',
                      border: '2px solid #8b0000',
                      borderRadius: '4px',
                      background: 'rgba(0,0,0,0.5)',
                      padding: '4px',
                      boxShadow: '0 0 10px rgba(139, 0, 0, 0.4)',
                      position: 'relative',
                      zIndex: 1
                    }}
                  />
                ) : (
                  <span style={{
                    fontSize: '48px',
                    filter: 'drop-shadow(0 0 5px rgba(139, 0, 0, 0.6))'
                  }}>{secondBoss.icon}</span>
                )}
                <span>{secondBoss.name}</span>
              </div>
            </>
          ) : (
            <>
              {mainBossImage ? (
                <img 
                  src={mainBossImage} 
                  alt={mainBoss.name}
                  style={{
                    width: '64px', // Bigger for final boss
                    height: '64px',
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
                  fontSize: '48px',
                  filter: 'drop-shadow(0 0 5px rgba(139, 0, 0, 0.6))'
                }}>{mainBoss.icon}</span>
              )}
              <span>{mainBoss.name}</span>
            </>
          )}
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
              transition: 'width 0.15s linear, background 0.3s ease',
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
            {isTwinBoss 
              ? `${Math.round(totalHealth).toLocaleString()} / ${Math.round(totalMaxHealth).toLocaleString()} (${bosses.length} bosses)`
              : `${Math.round(mainBoss.health).toLocaleString()} / ${Math.round(mainBoss.maxHealth).toLocaleString()}`
            }
          </div>
        </div>
      </div>
    </div>
  );
}

