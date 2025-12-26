# Performance Monitoring - Quick Start

## 🚀 Getting Started (30 seconds)

1. **Open the game** in your browser
2. **Press `Ctrl+Shift+P`** to show the performance overlay
3. **Play the game** for 30-60 seconds (run a dungeon for best results)
4. **Check the overlay** to see performance metrics

## 🎯 What to Look For

### Good Performance ✅
- **FPS**: 55-60 (green)
- **Frame Time**: <17ms
- **Memory**: <50% used

### Needs Attention ⚠️
- **FPS**: 30-55 (yellow)
- **Frame Time**: 17-30ms
- **Memory**: 50-75% used

### Critical Issues 🔴
- **FPS**: <30 (red)
- **Frame Time**: >30ms
- **Memory**: >75% used

## 🔧 Browser Console Commands

Open the browser console (F12) and type:

```javascript
// Show help
window.perf.help()

// Show top 10 slowest functions
window.perf.show('total', 10)

// Show FPS statistics
window.perf.fps()

// Show memory usage
window.perf.memory()

// Download full report
window.perf.download()

// Clear metrics and start fresh
window.perf.clear()
```

## 📊 Common Performance Issues

### Issue: Low FPS during combat

**Diagnosis:**
```javascript
window.perf.show('total', 20)
```

**Look for:**
- `combat.processPlayerActions` - Player ability processing
- `combat.processEnemyAttacks` - Enemy AI and attacks
- `combat.updateCombatState` - React state updates

**Solutions:**
- Reduce visual effects
- Batch state updates
- Optimize damage calculations

### Issue: High memory usage

**Diagnosis:**
```javascript
window.perf.memory()
```

**Look for:**
- Memory usage >75%
- Increasing over time (memory leak)

**Solutions:**
- Clear combat logs more frequently
- Limit floating numbers
- Check for unreleased references

### Issue: Stuttering/frame drops

**Diagnosis:**
```javascript
window.perf.fps()
```

**Look for:**
- High 99th percentile frame time
- Large difference between min and max FPS

**Solutions:**
- Find functions called every frame
- Reduce DOM updates
- Use requestAnimationFrame properly

## 🎮 Performance Overlay Controls

**Toggle**: `Ctrl+Shift+P`

**Buttons:**
- **Expand/Collapse**: Show/hide detailed metrics
- **Clear**: Reset all metrics
- **Export**: Download performance report

**Sort Options:**
- **Total Time**: Find overall bottlenecks
- **Avg Time**: Find slow individual calls
- **Call Count**: Find excessive calls

## 📈 Before/After Comparison

```javascript
// Take snapshot before optimization
const before = window.perf.snapshot();

// Make your changes...

// Take snapshot after
const after = window.perf.snapshot();

// Compare
window.perf.compare(before, after);
```

## 🐛 Debugging Workflow

1. **Enable monitoring**: `window.perf.enable()`
2. **Clear metrics**: `window.perf.clear()`
3. **Reproduce issue**: Play the game
4. **Check metrics**: `window.perf.show()`
5. **Export data**: `window.perf.download()`
6. **Fix issue**: Optimize code
7. **Verify**: Clear and test again

## 💡 Pro Tips

- **Run dungeons** for best performance data (most intensive)
- **Wait 30-60 seconds** before checking metrics
- **Compare different scenarios** (different dungeons, team sizes, etc.)
- **Export data** before making changes for comparison
- **Test on different devices** to find device-specific issues

## 📚 More Information

See [PERFORMANCE_MONITORING.md](./PERFORMANCE_MONITORING.md) for detailed documentation.



