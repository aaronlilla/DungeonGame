# Performance Monitoring Tools - Summary

## What Was Added

A comprehensive performance monitoring system has been integrated into your game to help identify and fix performance bottlenecks.

## Files Created

### Core System
- **`src/utils/performanceMonitor.ts`** - Main performance monitoring engine
  - Tracks execution time, call counts, and memory usage
  - Provides frame timing statistics
  - Exports data as text reports or JSON

### UI Components
- **`src/components/ui/PerformanceOverlay.tsx`** - Visual overlay component
  - Shows real-time FPS, frame time, and memory usage
  - Displays top metrics sorted by total time, average time, or call count
  - Expandable/collapsible interface
  - Export functionality

### Developer Tools
- **`src/utils/performanceConsole.ts`** - Browser console utilities
  - Exposes `window.perf` object with easy-to-use commands
  - Snapshot and comparison tools
  - Report generation

### Documentation
- **`PERFORMANCE_MONITORING.md`** - Comprehensive guide
- **`PERFORMANCE_QUICK_START.md`** - Quick reference
- **`PERFORMANCE_TOOLS_SUMMARY.md`** - This file

### Tests/Examples
- **`src/utils/performanceMonitor.test.ts`** - Example usage and tests

## Files Modified

### Integration Points
- **`src/App.tsx`** - Added performance overlay and keyboard shortcut (Ctrl+Shift+P)
- **`src/main.tsx`** - Auto-loads performance console tools
- **`src/systems/combat/runDungeonCombat/combatLoop.ts`** - Instrumented combat loop
- **`src/systems/combat/playerCombat.ts`** - Added performance imports
- **`src/utils/enemyDamage.ts`** - Instrumented damage calculations

## How to Use

### Visual Overlay (Easiest)

1. Press **`Ctrl+Shift+P`** to toggle the overlay
2. Run a dungeon for 30-60 seconds
3. Check the metrics in the overlay
4. Click "Export" to download a report

### Browser Console (Most Powerful)

Open the browser console (F12) and use:

```javascript
// Show help
window.perf.help()

// Show top metrics
window.perf.show('total', 10)

// Check FPS
window.perf.fps()

// Check memory
window.perf.memory()

// Download report
window.perf.download()
```

### In Code (For Developers)

```typescript
import { startTimer, endTimer, measure } from './utils/performanceMonitor';

// Manual timing
startTimer('myFunction');
// ... your code ...
endTimer('myFunction');

// Automatic timing
const result = measure('myFunction', () => {
  // ... your code ...
  return value;
});
```

## What's Being Tracked

### Combat System
- `combat.tick.{N}` - Overall tick processing
- `combat.processBuffsAndRegen` - Buff processing
- `combat.processEnemyAttacks` - Enemy AI
- `combat.processPlayerActions` - Player abilities
- `combat.updateCombatState` - State updates

### Damage System
- `damage.calculatePlayerDamageToEnemy` - Damage calculations

### Frame Metrics
- FPS (frames per second)
- Frame time (ms per frame)
- 95th and 99th percentile frame times

### Memory Metrics
- Used heap size
- Total heap size
- Heap size limit

## Performance Targets

### Excellent Performance ✅
- **FPS**: 58-60
- **Frame Time**: <17ms
- **Memory**: <50% of limit

### Acceptable Performance ⚡
- **FPS**: 45-58
- **Frame Time**: 17-22ms
- **Memory**: 50-75% of limit

### Needs Optimization 🔴
- **FPS**: <45
- **Frame Time**: >22ms
- **Memory**: >75% of limit

## Common Issues and Solutions

### Low FPS in Combat

**Symptoms:**
- FPS drops below 45 during dungeons
- High frame times (>22ms)

**Diagnosis:**
```javascript
window.perf.show('total', 20)
```

**Common Causes:**
- Too many state updates per tick
- Expensive damage calculations
- Too many floating numbers/log entries

**Solutions:**
- Batch state updates
- Cache calculation results
- Limit visual effects

### Memory Leaks

**Symptoms:**
- Memory usage increases over time
- Game slows down after extended play

**Diagnosis:**
```javascript
window.perf.memory()
// Play for 5 minutes
window.perf.memory()
// Compare values
```

**Common Causes:**
- Combat log not being cleared
- Event listeners not removed
- References held in closures

**Solutions:**
- Limit log size (already implemented)
- Clean up event listeners
- Use WeakMap/WeakSet where appropriate

### Frame Stuttering

**Symptoms:**
- Inconsistent frame times
- High 99th percentile

**Diagnosis:**
```javascript
window.perf.fps()
```

**Common Causes:**
- Garbage collection pauses
- Synchronous operations
- Large DOM updates

**Solutions:**
- Reduce object allocations
- Use async operations
- Virtualize long lists

## Adding More Instrumentation

To track additional functions:

```typescript
import { startTimer, endTimer } from '../utils/performanceMonitor';

function myFunction() {
  startTimer('myFunction');
  try {
    // Your code
  } finally {
    endTimer('myFunction');
  }
}
```

Or use the automatic wrapper:

```typescript
import { measure } from '../utils/performanceMonitor';

const result = measure('myFunction', () => {
  // Your code
  return value;
});
```

## Exporting Data

### Text Report
- Click "Export" in overlay
- Or use `window.perf.download()`
- Contains top metrics, frame stats, memory usage

### JSON Export
- Use `window.perf.downloadJSON()`
- Contains all metrics with full details
- Useful for programmatic analysis

### Console Output
- Use `window.perf.report()`
- Prints formatted report to console
- Good for quick checks

## Performance Monitoring Best Practices

1. **Profile First**: Always measure before optimizing
2. **Focus on Hotspots**: Optimize the slowest functions first
3. **Measure Impact**: Verify optimizations actually help
4. **Test Realistically**: Use real game scenarios
5. **Consider Trade-offs**: Don't sacrifice code quality for micro-optimizations

## Disabling Performance Monitoring

Performance monitoring has minimal overhead, but if needed:

```javascript
window.perf.disable()
```

To re-enable:

```javascript
window.perf.enable()
```

## Future Enhancements

Potential additions:
- React component render tracking
- Network request monitoring
- Asset loading metrics
- User interaction latency
- Custom performance marks
- Historical trend analysis
- Automated regression detection

## Support

For issues or questions:
1. Check `PERFORMANCE_MONITORING.md` for detailed docs
2. Check `PERFORMANCE_QUICK_START.md` for quick reference
3. Use `window.perf.help()` for console commands
4. Export data with `window.perf.download()` for analysis

## Summary

You now have professional-grade performance monitoring tools integrated into your game:

✅ **Visual overlay** with real-time metrics (Ctrl+Shift+P)
✅ **Console commands** for detailed analysis (window.perf.*)
✅ **Automatic instrumentation** in critical code paths
✅ **Export functionality** for reports and data
✅ **Comprehensive documentation** for reference

Start by pressing **Ctrl+Shift+P** and running a dungeon to see the tools in action!



