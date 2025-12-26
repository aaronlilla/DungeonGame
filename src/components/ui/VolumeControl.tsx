import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMuted = volume === 0;

  // Close slider when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      onVolumeChange(0.5); // Restore to 50% if muted
    } else {
      onVolumeChange(0); // Mute
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {/* Volume Icon Button */}
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isMuted ? 'rgba(255, 100, 100, 0.8)' : 'rgba(230, 188, 47, 0.9)',
          fontSize: '1.5rem',
          transition: 'color 0.2s ease',
          position: 'relative',
          zIndex: 101,
        }}
        title={isMuted ? 'Unmute' : `Volume: ${Math.round(volume * 100)}%`}
      >
        {isMuted ? <HiVolumeOff /> : <HiVolumeUp />}
      </motion.button>

      {/* Volume Slider Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: 0,
              background: 'linear-gradient(180deg, rgba(35, 29, 22, 0.98) 0%, rgba(20, 16, 12, 0.99) 100%)',
              border: '2px solid rgba(139, 90, 43, 0.6)',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7), 0 0 40px rgba(139, 90, 43, 0.2)',
              minWidth: '200px',
              zIndex: 1000,
            }}
          >
            {/* Title */}
            <div
              style={{
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'rgba(230, 188, 47, 0.9)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '0.75rem',
                textAlign: 'center',
              }}
            >
              Volume
            </div>

            {/* Volume Percentage Display */}
            <div
              style={{
                textAlign: 'center',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: isMuted ? 'rgba(255, 100, 100, 0.8)' : 'rgba(230, 188, 47, 1)',
                marginBottom: '0.75rem',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {Math.round(volume * 100)}%
            </div>

            {/* Slider */}
            <div style={{ marginBottom: '0.75rem' }}>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  accentColor: 'rgba(230, 188, 47, 0.9)',
                }}
              />
            </div>

            {/* Mute/Unmute Button */}
            <motion.button
              onClick={handleMuteToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: isMuted
                  ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.6) 0%, rgba(185, 28, 28, 0.7) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 90, 43, 0.6) 0%, rgba(101, 67, 33, 0.7) 100%)',
                border: isMuted
                  ? '1px solid rgba(220, 38, 38, 0.5)'
                  : '1px solid rgba(139, 90, 43, 0.5)',
                borderRadius: '6px',
                color: '#fff',
                cursor: 'pointer',
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                transition: 'all 0.2s ease',
              }}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </motion.button>

            {/* Quick Presets */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '0.75rem',
                justifyContent: 'space-between',
              }}
            >
              {[25, 50, 75, 100].map((preset) => (
                <motion.button
                  key={preset}
                  onClick={() => onVolumeChange(preset / 100)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    flex: 1,
                    padding: '0.35rem',
                    background:
                      Math.round(volume * 100) === preset
                        ? 'rgba(230, 188, 47, 0.3)'
                        : 'rgba(139, 90, 43, 0.2)',
                    border:
                      Math.round(volume * 100) === preset
                        ? '1px solid rgba(230, 188, 47, 0.6)'
                        : '1px solid rgba(139, 90, 43, 0.3)',
                    borderRadius: '4px',
                    color:
                      Math.round(volume * 100) === preset
                        ? 'rgba(230, 188, 47, 1)'
                        : 'rgba(200, 200, 200, 0.7)',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    fontFamily: "'JetBrains Mono', monospace",
                    transition: 'all 0.2s ease',
                  }}
                >
                  {preset}%
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* Custom slider styling */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          background: linear-gradient(
            to right,
            rgba(230, 188, 47, 0.3) 0%,
            rgba(230, 188, 47, 0.3) ${volume * 100}%,
            rgba(60, 50, 40, 0.5) ${volume * 100}%,
            rgba(60, 50, 40, 0.5) 100%
          );
          border-radius: 3px;
          outline: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, rgba(230, 188, 47, 1) 0%, rgba(180, 140, 30, 1) 100%);
          border: 2px solid rgba(139, 90, 43, 0.8);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
          transition: all 0.2s ease;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 3px 10px rgba(230, 188, 47, 0.4);
        }

        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, rgba(230, 188, 47, 1) 0%, rgba(180, 140, 30, 1) 100%);
          border: 2px solid rgba(139, 90, 43, 0.8);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
          transition: all 0.2s ease;
        }

        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 3px 10px rgba(230, 188, 47, 0.4);
        }
      `}</style>
    </div>
  );
}


