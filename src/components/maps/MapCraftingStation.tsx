import { motion } from 'framer-motion';

interface MapCraftingStationProps {
  // Add props as needed for crafting functionality
}

export function MapCraftingStation({}: MapCraftingStationProps) {
  return (
    <motion.div 
      className="map-crafting-station"
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
          Map Crafting
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
        <div style={{
          textAlign: 'center',
          color: 'rgba(200, 190, 170, 0.5)',
          fontSize: '0.9rem',
          padding: '2rem 1rem',
          fontStyle: 'italic',
        }}>
          Crafting functionality coming soon
        </div>
      </div>
    </motion.div>
  );
}

