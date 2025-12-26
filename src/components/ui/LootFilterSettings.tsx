import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { GiSparkles, GiCheckMark, GiCrossedBones, GiTwoCoins } from 'react-icons/gi';
import { useGameStore } from '../../store/gameStore';
import { loadFilterFromFile, saveFilterToStorage, clearFilterFromStorage } from '../../utils/lootFilterLoader';

export function LootFilterSettings() {
  const { lootFilter, lootFilterEnabled, setLootFilter, setLootFilterEnabled } = useGameStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const filter = await loadFilterFromFile(file);
      setLootFilter(filter);
      saveFilterToStorage(filter);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load filter');
      console.error('Filter load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilter = () => {
    setLootFilter(null);
    setLootFilterEnabled(false);
    clearFilterFromStorage();
    setError(null);
  };

  const handleToggleFilter = () => {
    if (!lootFilter) {
      setError('Please load a filter first');
      return;
    }
    setLootFilterEnabled(!lootFilterEnabled);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(30, 26, 22, 0.98) 0%, rgba(20, 18, 15, 0.99) 100%)',
      border: '2px solid rgba(168, 85, 247, 0.4)',
      borderRadius: '16px',
      padding: '0',
      maxWidth: '700px',
      width: '92%',
      maxHeight: '88vh',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 60px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Textured background overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/tilebackground.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.03,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        padding: '2rem 2.5rem 1.5rem',
        borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
        background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.08) 0%, transparent 100%)',
        position: 'relative',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}>
          <GiTwoCoins style={{ fontSize: '2.5rem', color: '#a855f7' }} />
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#e9d5ff',
            fontFamily: "'Cinzel', Georgia, serif",
            margin: 0,
            textShadow: '0 0 20px rgba(168, 85, 247, 0.5), 0 2px 4px rgba(0,0,0,0.8)',
            letterSpacing: '0.05em',
          }}>
            Loot Filter
          </h2>
        </div>
        <p style={{
          fontSize: '0.9rem',
          color: 'rgba(200, 190, 170, 0.7)',
          margin: '0.5rem 0 0',
          textAlign: 'center',
          fontFamily: "'Cinzel', Georgia, serif",
          letterSpacing: '0.05em',
        }}>
          Customize Your Loot Experience
        </p>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '2rem 2.5rem',
        position: 'relative',
      }}>
        {/* Description */}
        <div style={{
          marginBottom: '1.5rem',
          padding: '1.25rem',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(168, 85, 247, 0.03) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          borderRadius: '8px',
        }}>
          <p style={{
            color: 'rgba(200, 190, 170, 0.9)',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            margin: 0,
          }}>
            Load a Path of Exile <strong style={{ color: '#e9d5ff' }}>.filter</strong> file to customize how loot is displayed. 
            The filter will control item visibility, colors, text size, and beam effects.
          </p>
        </div>

        {/* Filter Status */}
        {lootFilter && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}>
              <GiSparkles style={{ fontSize: '1.5rem', color: '#10b981' }} />
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#6ee7b7',
                fontFamily: "'Cinzel', Georgia, serif",
                margin: 0,
              }}>
                Loaded Filter
              </h3>
            </div>
            <div style={{ paddingLeft: '0.5rem' }}>
              <div style={{ color: '#e9d5ff', fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                {lootFilter.name}
              </div>
              {lootFilter.version && (
                <div style={{ color: 'rgba(200, 190, 170, 0.8)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  <strong style={{ color: '#a855f7' }}>Version:</strong> {lootFilter.version}
                </div>
              )}
              {lootFilter.author && (
                <div style={{ color: 'rgba(200, 190, 170, 0.8)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  <strong style={{ color: '#a855f7' }}>Author:</strong> {lootFilter.author}
                </div>
              )}
              {lootFilter.strictness && (
                <div style={{ color: 'rgba(200, 190, 170, 0.8)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  <strong style={{ color: '#a855f7' }}>Strictness:</strong> {lootFilter.strictness}
                </div>
              )}
              <div style={{ color: 'rgba(200, 190, 170, 0.8)', fontSize: '0.85rem' }}>
                <strong style={{ color: '#a855f7' }}>Rules:</strong> {lootFilter.rules.length}
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(220, 38, 38, 0.08) 100%)',
              border: '1px solid rgba(220, 38, 38, 0.4)',
              borderRadius: '8px',
              color: '#fca5a5',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <GiCrossedBones style={{ fontSize: '1.5rem', flexShrink: 0 }} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Load Filter Button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".filter"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <motion.button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              style={{
                width: '100%',
                padding: '0.875rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                fontFamily: "'Cinzel', Georgia, serif",
                background: isLoading 
                  ? 'linear-gradient(135deg, rgba(80, 80, 80, 0.6) 0%, rgba(60, 60, 60, 0.7) 100%)'
                  : 'linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(147, 51, 234, 0.9) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.5)',
                borderRadius: '8px',
                color: isLoading ? '#888' : '#fff',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                boxShadow: isLoading 
                  ? 'none'
                  : '0 4px 12px rgba(168, 85, 247, 0.4)',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                transition: 'all 0.2s',
              }}
            >
              {isLoading ? 'Loading...' : lootFilter ? 'Load Different Filter' : 'Load Filter File'}
            </motion.button>
          </div>

          {/* Enable/Disable Toggle */}
          {lootFilter && (
            <motion.button
              type="button"
              onClick={handleToggleFilter}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                width: '100%',
                padding: '0.875rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                fontFamily: "'Cinzel', Georgia, serif",
                background: lootFilterEnabled 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(5, 150, 105, 0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(75, 85, 99, 0.8) 0%, rgba(55, 65, 81, 0.9) 100%)',
                border: `1px solid ${lootFilterEnabled ? 'rgba(16, 185, 129, 0.5)' : 'rgba(107, 114, 128, 0.5)'}`,
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                boxShadow: lootFilterEnabled 
                  ? '0 4px 12px rgba(16, 185, 129, 0.4)'
                  : '0 4px 12px rgba(0, 0, 0, 0.3)',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              {lootFilterEnabled && <GiCheckMark style={{ fontSize: '1.2rem' }} />}
              {lootFilterEnabled ? 'Filter Enabled' : 'Enable Filter'}
            </motion.button>
          )}

          {/* Clear Filter Button */}
          {lootFilter && (
            <motion.button
              type="button"
              onClick={handleClearFilter}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                fontFamily: "'Cinzel', Georgia, serif",
                background: 'transparent',
                border: '1px solid rgba(220, 38, 38, 0.5)',
                borderRadius: '8px',
                color: '#fca5a5',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.5)';
              }}
            >
              Clear Filter
            </motion.button>
          )}
        </div>

        {/* Info Section */}
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px',
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#93c5fd',
            fontFamily: "'Cinzel', Georgia, serif",
            marginBottom: '0.75rem',
            letterSpacing: '0.02em',
          }}>
            How to Use
          </h3>
          <ul style={{
            color: 'rgba(200, 190, 170, 0.9)',
            fontSize: '0.875rem',
            lineHeight: '1.7',
            paddingLeft: '1.5rem',
            margin: 0,
          }}>
            <li>Download a <strong style={{ color: '#e9d5ff' }}>.filter</strong> file from FilterBlade or use NeverSink's filter</li>
            <li>Click <strong style={{ color: '#e9d5ff' }}>"Load Filter File"</strong> and select your .filter file</li>
            <li>Enable the filter to apply it to loot drops</li>
            <li>The filter will control item colors, visibility, and beam effects</li>
            <li>Disable or clear the filter to return to default display</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

