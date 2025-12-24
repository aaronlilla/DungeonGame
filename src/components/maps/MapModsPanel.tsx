import { motion } from 'framer-motion';
import type { MapItem, Fragment } from '../../types/maps';

interface MapModsPanelProps {
  map: MapItem | null;
  fragments?: (Fragment | null)[];
}

export function MapModsPanel({ map, fragments = [] }: MapModsPanelProps) {
  return (
    <motion.div 
      className="map-mods-panel"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        minHeight: 0,
        minWidth: 0,
        background: 'linear-gradient(145deg, rgba(20, 18, 15, 0.98) 0%, rgba(12, 10, 8, 0.99) 100%)',
        borderRadius: '14px',
        border: '1px solid rgba(201, 162, 39, 0.15)',
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.5),
          inset 0 1px 0 rgba(255,255,255,0.03),
          inset 0 -1px 0 rgba(0,0,0,0.3)
        `,
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Textured background overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/tilebackground.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.025,
        pointerEvents: 'none',
      }} />

      {/* Ambient glow effect */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '100%',
        background: 'radial-gradient(ellipse at center, rgba(201, 162, 39, 0.03) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      {/* Corner ornaments */}
      <div style={{ position: 'absolute', top: 8, left: 8, width: 20, height: 20, borderTop: '2px solid #c9a227', borderLeft: '2px solid #c9a227', borderRadius: '6px 0 0 0', pointerEvents: 'none', zIndex: 10, boxShadow: '-2px -2px 8px rgba(201, 162, 39, 0.15)' }} />
      <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderTop: '2px solid #c9a227', borderRight: '2px solid #c9a227', borderRadius: '0 6px 0 0', pointerEvents: 'none', zIndex: 10, boxShadow: '2px -2px 8px rgba(201, 162, 39, 0.15)' }} />
      <div style={{ position: 'absolute', bottom: 8, left: 8, width: 20, height: 20, borderBottom: '2px solid #c9a227', borderLeft: '2px solid #c9a227', borderRadius: '0 0 0 6px', pointerEvents: 'none', zIndex: 10, boxShadow: '-2px 2px 8px rgba(201, 162, 39, 0.15)' }} />
      <div style={{ position: 'absolute', bottom: 8, right: 8, width: 20, height: 20, borderBottom: '2px solid #c9a227', borderRight: '2px solid #c9a227', borderRadius: '0 0 6px 0', pointerEvents: 'none', zIndex: 10, boxShadow: '2px 2px 8px rgba(201, 162, 39, 0.15)' }} />
      
      {/* Header */}
      <div style={{ 
        flexShrink: 0, 
        padding: '1.1rem 1rem',
        background: 'linear-gradient(180deg, rgba(201, 162, 39, 0.1) 0%, rgba(201, 162, 39, 0.02) 100%)',
        borderBottom: '1px solid rgba(201, 162, 39, 0.15)',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Top gold line with glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent 5%, #c9a227 50%, transparent 95%)',
          boxShadow: '0 0 12px rgba(201, 162, 39, 0.4)',
        }} />
        {/* Center diamond decoration */}
        <motion.div 
          animate={{ 
            boxShadow: ['0 0 10px rgba(201, 162, 39, 0.4)', '0 0 20px rgba(201, 162, 39, 0.6)', '0 0 10px rgba(201, 162, 39, 0.4)']
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '-5px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '10px',
            height: '10px',
            background: 'linear-gradient(135deg, #d4af37 0%, #c9a227 50%, #8b7019 100%)',
            borderRadius: '2px',
          }}
        />
        <h3 style={{
          fontSize: '1rem',
          margin: 0,
          fontFamily: "'Cinzel', Georgia, serif",
          fontWeight: 700,
          color: '#d4af37',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          textShadow: '0 0 20px rgba(201, 162, 39, 0.5), 0 2px 4px rgba(0,0,0,0.5)',
        }}>
          Map Modifiers
        </h3>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        {!map ? (
          <div style={{
            textAlign: 'center',
            color: 'rgba(200, 190, 170, 0.5)',
            fontSize: '0.9rem',
            padding: '2rem 1rem',
            fontStyle: 'italic',
          }}>
            Insert a map to view modifiers
          </div>
        ) : (
          <>
            {/* Map Affixes */}
            {map.affixes.length === 0 && fragments.filter(f => f !== null).length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: 'rgba(200, 190, 170, 0.6)',
                fontSize: '0.9rem',
                padding: '2rem 1rem',
              }}>
                Normal Map<br />
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>No modifiers</span>
              </div>
            ) : (
              <>
                {/* Map modifiers */}
                {map.affixes.map((affix, idx) => (
            <div
              key={affix.id || idx}
              style={{
                background: 'linear-gradient(135deg, rgba(30, 26, 22, 0.6) 0%, rgba(20, 18, 15, 0.7) 100%)',
                border: '1px solid rgba(60, 50, 40, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem',
                position: 'relative',
              }}
            >
              {/* Textured background overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/tilebackground.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.025,
                pointerEvents: 'none',
                borderRadius: '8px',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#d4af37',
                  marginBottom: '0.25rem',
                  textShadow: '0 0 10px rgba(212, 175, 55, 0.3)',
                }}>
                  {affix.name}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'rgba(200, 190, 170, 0.8)',
                  lineHeight: 1.4,
                }}>
                  {affix.description}
                </div>
                {affix.quantityBonus > 0 && (
                  <div style={{
                    fontSize: '0.7rem',
                    color: '#22c55e',
                    marginTop: '0.5rem',
                    fontWeight: 500,
                  }}>
                    +{Math.round(affix.quantityBonus * 100)}% Item Quantity
                  </div>
                )}
                {affix.rarityBonus > 0 && (
                  <div style={{
                    fontSize: '0.7rem',
                    color: '#a855f7',
                    marginTop: affix.quantityBonus > 0 ? '0.25rem' : '0.5rem',
                    fontWeight: 500,
                  }}>
                    +{Math.round(affix.rarityBonus * 100)}% Item Rarity
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Fragment modifiers */}
          {fragments.filter(f => f !== null).length > 0 && (
            <>
              {/* Separator */}
              <div style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.2) 20%, rgba(201, 162, 39, 0.2) 80%, transparent)',
                margin: '0.5rem 0',
              }} />
              
              {/* Fragment header */}
              <div style={{
                fontSize: '0.8rem',
                color: 'rgba(201, 162, 39, 0.8)',
                textAlign: 'center',
                marginBottom: '0.5rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                Active Fragments
              </div>
              
              {/* Fragment effects */}
              {fragments.filter(f => f !== null).map((fragment, idx) => fragment && (
                <div
                  key={fragment.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 112, 25, 0.2) 0%, rgba(90, 70, 50, 0.3) 100%)',
                    border: '1px solid rgba(201, 162, 39, 0.3)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    position: 'relative',
                  }}
                >
                  {/* Textured background overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url(/tilebackground.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.025,
                    pointerEvents: 'none',
                    borderRadius: '8px',
                  }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#e9d5ff',
                      marginBottom: '0.25rem',
                      textShadow: '0 0 10px rgba(168, 85, 247, 0.4)',
                    }}>
                      {fragment.name}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'rgba(200, 190, 170, 0.7)',
                      lineHeight: 1.3,
                      fontStyle: 'italic',
                    }}>
                      {fragment.description}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '0.75rem',
                      marginTop: '0.5rem',
                    }}>
                      {fragment.quantityBonus > 0 && (
                        <div style={{
                          fontSize: '0.7rem',
                          color: '#22c55e',
                          fontWeight: 500,
                        }}>
                          +{Math.round(fragment.quantityBonus * 100)}% Quantity
                        </div>
                      )}
                      {fragment.rarityBonus > 0 && (
                        <div style={{
                          fontSize: '0.7rem',
                          color: '#a855f7',
                          fontWeight: 500,
                        }}>
                          +{Math.round(fragment.rarityBonus * 100)}% Rarity
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Total Bonuses Summary */}
          {map && (map.quantityBonus > 0 || map.rarityBonus > 0 || fragments.filter(f => f !== null).length > 0) && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.15) 0%, rgba(139, 112, 25, 0.2) 100%)',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              borderRadius: '8px',
              position: 'relative',
            }}>
              {/* Textured background overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/tilebackground.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.025,
                pointerEvents: 'none',
                borderRadius: '8px',
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#d4af37',
                  marginBottom: '0.5rem',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textShadow: '0 0 10px rgba(212, 175, 55, 0.3)',
                }}>
                  Total Bonuses
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '2rem',
                }}>
                  <div style={{
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'rgba(200, 190, 170, 0.7)',
                      marginBottom: '0.125rem',
                    }}>Quantity</div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#22c55e',
                      textShadow: '0 0 10px rgba(34, 197, 94, 0.4)',
                    }}>
                      +{Math.round((map.quantityBonus + fragments.reduce((sum, f) => sum + (f?.quantityBonus || 0), 0)) * 100)}%
                    </div>
                  </div>
                  
                  <div style={{
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'rgba(200, 190, 170, 0.7)',
                      marginBottom: '0.125rem',
                    }}>Rarity</div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#a855f7',
                      textShadow: '0 0 10px rgba(168, 85, 247, 0.4)',
                    }}>
                      +{Math.round((map.rarityBonus + fragments.reduce((sum, f) => sum + (f?.rarityBonus || 0), 0)) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
              </>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

