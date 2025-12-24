import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { preloadAllAssets } from '../utils/assetPreloader';
// Import all loading screen images (base + 0, 2, 3, 4, 5 - note: loadingscreen1.png doesn't exist)
import loadingScreenBase from '../assets/loadingscreen.png';
import loadingScreen0 from '../assets/loadingscreen0.png';
import loadingScreen2 from '../assets/loadingscreen2.png';
import loadingScreen3 from '../assets/loadingscreen3.png';
import loadingScreen4 from '../assets/loadingscreen4.png';
import loadingScreen5 from '../assets/loadingscreen5.png';

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

export function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [loadingPhase, setLoadingPhase] = useState<'fadein' | 'loading' | 'fadeout' | 'done'>('fadein');
  const [progress, setProgress] = useState(0);
  
  // Randomly select a loading screen image from all available (base + 0, 2, 3, 4, 5)
  const loadingScreenImage = useMemo(() => {
    const screens = [
      loadingScreenBase,
      loadingScreen0,
      loadingScreen2,
      loadingScreen3,
      loadingScreen4,
      loadingScreen5
    ];
    const randomIndex = Math.floor(Math.random() * screens.length);
    return screens[randomIndex];
  }, []); // Only select once when component mounts

  const preloadAssets = useCallback(async () => {
    // Preload all assets (static images + item art)
    await preloadAllAssets((progress) => {
      setProgress(progress);
    });
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const MIN_DISPLAY_TIME = 5000; // Minimum 5 seconds
    
    // Start with fade in
    const fadeInTimer = setTimeout(() => {
      setLoadingPhase('loading');
      
      // Start preloading assets
      preloadAssets().then(() => {
        // Calculate how long we've been showing the loading screen
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);
        
        // Wait for remaining time before fading out
        setTimeout(() => {
          setLoadingPhase('fadeout');
          
          // After fade out, complete
          setTimeout(() => {
            setLoadingPhase('done');
            onLoadComplete();
          }, 800);
        }, remainingTime);
      });
    }, 600);
    
    return () => clearTimeout(fadeInTimer);
  }, [preloadAssets, onLoadComplete]);

  if (loadingPhase === 'done') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: loadingPhase === 'fadein' ? 0 : loadingPhase === 'fadeout' ? 0 : 1 
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100000,
          background: '#000',
        }}
      >
        {/* Background image with vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${loadingScreenImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        {/* Vignette overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
            pointerEvents: 'none',
          }}
        />
        
        {/* Animated glow overlay - pulsing mystical effect */}
        <motion.div
          animate={{
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(180, 140, 80, 0.15) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        
        {/* Floating dust/particle effect */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, -200],
                x: [0, Math.sin(i) * 30, Math.sin(i * 2) * 20],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 8,
                ease: 'linear',
              }}
              style={{
                position: 'absolute',
                left: `${10 + Math.random() * 80}%`,
                bottom: '-20px',
                width: '2px',
                height: '2px',
                background: 'rgba(255, 220, 150, 0.8)',
                borderRadius: '50%',
                boxShadow: '0 0 4px rgba(255, 200, 100, 0.5)',
              }}
            />
          ))}
        </div>
        
        {/* Ember effect at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '150px',
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          {/* Glowing bottom edge */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent 5%, rgba(255, 100, 30, 0.6) 20%, rgba(255, 140, 50, 0.8) 50%, rgba(255, 100, 30, 0.6) 80%, transparent 95%)',
              boxShadow: '0 0 20px rgba(255, 80, 20, 0.5), 0 0 40px rgba(255, 100, 30, 0.3), 0 -10px 30px rgba(255, 120, 40, 0.2)',
            }}
          />
          
          {/* Heat shimmer glow */}
          <motion.div
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: '10%',
              right: '10%',
              height: '60px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(255, 100, 30, 0.15) 100%)',
              filter: 'blur(10px)',
            }}
          />
          
          {/* Rising ember particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`ember-${i}`}
              animate={{
                y: [0, -80, -140],
                x: [0, Math.sin(i * 0.7) * 15, Math.sin(i * 1.3) * 10],
                opacity: [0, 0.9, 0],
                scale: [0.5, 1, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                left: `${5 + Math.random() * 90}%`,
                bottom: '0px',
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${Math.random() > 0.3 ? '#ff6b35' : '#ffaa44'} 0%, #ff4500 100%)`,
                boxShadow: '0 0 6px rgba(255, 100, 30, 0.8), 0 0 12px rgba(255, 80, 20, 0.4)',
              }}
            />
          ))}
        </div>
        
        {/* Loading indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '12%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          {/* Animated loading runes/orbs */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff6b35, #ff4500)',
                  boxShadow: '0 0 10px rgba(255, 100, 30, 0.6)',
                }}
              />
            ))}
          </div>
          
          {/* Progress bar - ember styled */}
          <div
            style={{
              width: '200px',
              height: '3px',
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '2px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 100, 30, 0.3)',
            }}
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #ff4500, #ff6b35, #ffaa44)',
                boxShadow: '0 0 8px rgba(255, 100, 30, 0.6)',
              }}
            />
          </div>
        </div>
        
        {/* Scanline/aged effect overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.03) 2px,
              rgba(0,0,0,0.03) 4px
            )`,
            pointerEvents: 'none',
          }}
        />
        
        {/* Noise texture for aged paper look */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            pointerEvents: 'none',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
