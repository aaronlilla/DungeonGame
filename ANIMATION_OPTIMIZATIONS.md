# Animation Performance Optimizations

## Summary

This document describes the animation performance optimizations applied to improve the smoothness of the dungeon combat interface.

## Changes Made

### 1. Framer Motion Optimizations

- **Added `MotionConfig` with `reducedMotion="user"`**: Respects user's system preferences for reduced motion
- **Reduced animation durations**: Changed from 0.25s to 0.15-0.2s for faster, snappier animations
- **Changed easing functions**: Using `easeOut` instead of default for better perceived performance
- **Added `mode="popLayout"`** to `AnimatePresence`: Prevents layout shifts during enemy death animations

### 2. GPU Acceleration

All animations now use `translate3d()` and `scale3d()` instead of `translate()` and `scale()`:

```css
/* Before */
transform: translateX(-50%) translateY(-10px) scale(1);

/* After */
transform: translate3d(-50%, -10px, 0) scale3d(1, 1, 1);
```

This forces GPU acceleration, making animations significantly smoother.

### 3. CSS Containment

Added `contain: layout style paint` to frequently animated elements:
- `.party-frame`
- `.enemy-container`

This tells the browser that these elements are isolated, reducing repaints and reflows.

### 4. RequestAnimationFrame for Smooth Updates

**Cast Bar Updates**: Replaced `setInterval` with `requestAnimationFrame`
- **30 FPS updates** - perfectly smooth and frame-synced
- Uses browser's native animation timing
- Automatically pauses when tab is inactive (saves CPU)
- **Ultra-smooth cast bars** with 0.033s transition duration (one frame)
- Applies to both `CombatPanel` and `TeamStatusPanel`

### 5. Spring Physics for Health Bars

**Health/Mana Bars**: Now use spring physics instead of linear transitions
- **Natural, bouncy feel** that's more satisfying
- Settings: `stiffness: 300, damping: 30, mass: 0.5`
- Mana bars slightly snappier: `stiffness: 350, damping: 35, mass: 0.4`
- Feels responsive and alive, not robotic

### 6. Floating Number Limits

- **Maximum visible numbers**: Limited to 20 simultaneous floating damage/heal numbers
- Keeps only the most recent numbers when limit is exceeded
- Prevents performance degradation during intense combat

### 7. Additional Optimizations

- Added `backface-visibility: hidden` to all animated elements
- Added `transform: translateZ(0)` to force GPU layer creation
- Added `perspective: 1000px` for better 3D transform performance
- Optimized all keyframe animations to use 3D transforms

## Performance Impact

### Before
- Multiple layout recalculations per frame
- CPU-based 2D transforms
- Unlimited floating numbers causing slowdown
- 20 render calls per second for cast bars (setInterval)
- Linear health bar transitions

### After
- GPU-accelerated 3D transforms
- Isolated paint regions with CSS containment
- Maximum 20 floating numbers at once
- **30 FPS frame-synced updates** with requestAnimationFrame
- **Spring physics** for health/mana bars (natural, smooth feel)
- **Ultra-smooth cast bars** with per-frame updates
- Smoother animations with reduced CPU load

## Browser Compatibility

All optimizations are supported in:
- Chrome/Edge 60+
- Firefox 65+
- Safari 12+

## Future Improvements

If further optimization is needed, consider:

1. **Performance Mode Toggle**: Add a user setting to disable non-essential animations
2. **Reduce Particle Effects**: Limit ember/glow effects during combat
3. **Virtual Scrolling**: For large enemy lists (currently not needed)
4. **RequestAnimationFrame**: Replace setInterval with RAF for cast bars
5. **Web Workers**: Offload combat calculations to a worker thread

## Testing

To verify improvements:

1. Open Chrome DevTools Performance tab
2. Start recording
3. Run a dungeon with multiple enemies
4. Stop recording
5. Check for:
   - Reduced "Rendering" time (should be lower)
   - Fewer "Layout" and "Paint" events
   - Smoother FPS graph (should be closer to 60fps)

## Notes

- These optimizations maintain visual quality while improving performance
- No gameplay mechanics were changed
- All animations remain responsive and smooth
- The optimizations are especially noticeable on lower-end hardware

