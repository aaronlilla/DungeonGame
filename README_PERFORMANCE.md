# 🚀 Performance Monitoring System

A comprehensive, production-ready performance monitoring system for identifying and fixing performance bottlenecks in your game.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Usage](#usage)
- [Documentation](#documentation)
- [Architecture](#architecture)
- [Examples](#examples)

## ⚡ Quick Start

### 1. Visual Overlay (Easiest)

Press **`Ctrl+Shift+P`** to toggle the performance overlay.

![Performance Overlay](https://via.placeholder.com/400x300?text=Performance+Overlay)

The overlay shows:
- Real-time FPS and frame timing
- Memory usage
- Top performance metrics
- Export functionality

### 2. Browser Console (Most Powerful)

Open the browser console (F12) and type:

```javascript
// Show help
window.perf.help()

// Show top 10 slowest functions
window.perf.show('total', 10)

// Check FPS
window.perf.fps()

// Check memory
window.perf.memory()

// Show recent warnings
window.perf.warnings()
```

### 3. In Code (For Developers)

```typescript
import { startTimer, endTimer, measure } from './utils/performanceMonitor';

// Manual timing
function myFunction() {
  startTimer('myFunction');
  try {
    // Your code
  } finally {
    endTimer('myFunction');
  }
}

// Automatic timing
const result = measure('myFunction', () => {
  // Your code
  return value;
});
```

## ✨ Features

### Core Monitoring
- ✅ **Execution Time Tracking** - Measure function execution time
- ✅ **Call Count Tracking** - Track how often functions are called
- ✅ **Memory Monitoring** - Track heap usage and detect leaks
- ✅ **Frame Timing** - Monitor FPS and frame time
- ✅ **Percentile Statistics** - 95th and 99th percentile metrics

### User Interface
- ✅ **Visual Overlay** - Real-time performance display
- ✅ **Keyboard Shortcut** - Toggle with Ctrl+Shift+P
- ✅ **Multiple Sort Options** - Sort by total time, average time, or call count
- ✅ **Expandable Details** - Show/hide detailed metrics
- ✅ **Color-Coded Warnings** - Visual indicators for performance issues

### Developer Tools
- ✅ **Console Commands** - Easy-to-use browser console API
- ✅ **Snapshot System** - Take snapshots for before/after comparison
- ✅ **Export Functionality** - Download reports as text or JSON
- ✅ **Automatic Warnings** - Detect performance issues automatically
- ✅ **Customizable Thresholds** - Set your own performance targets

### Integration
- ✅ **Combat System** - Fully instrumented combat loop
- ✅ **Damage Calculations** - Track damage calculation performance
- ✅ **State Updates** - Monitor React state update costs
- ✅ **Easy to Extend** - Simple API for adding more instrumentation

## 📖 Usage

### Visual Overlay

**Toggle**: Press `Ctrl+Shift+P`

**Features:**
- Real-time FPS display with color coding (green/yellow/red)
- Memory usage percentage
- Top 20 performance metrics
- Sort by total time, average time, or call count
- Expand/collapse for detailed view
- Clear metrics button
- Export report button

**Color Coding:**
- 🟢 Green: Good performance (FPS ≥55, Memory <50%)
- 🟡 Yellow: Acceptable (FPS 30-55, Memory 50-75%)
- 🔴 Red: Poor (FPS <30, Memory >75%)

### Console Commands

All commands are available via `window.perf`:

#### Basic Commands
```javascript
window.perf.help()              // Show help
window.perf.enable()            // Enable monitoring
window.perf.disable()           // Disable monitoring
window.perf.clear()             // Clear all metrics
```

#### Viewing Metrics
```javascript
window.perf.show('total', 20)   // Show top 20 by total time
window.perf.show('average', 10) // Show top 10 by average time
window.perf.show('count', 15)   // Show top 15 by call count
window.perf.fps()               // Show FPS statistics
window.perf.memory()            // Show memory usage
window.perf.get('functionName') // Get specific metric
window.perf.list()              // List all tracked metrics
```

#### Warnings
```javascript
window.perf.warnings()          // Show recent warnings (last 60s)
window.perf.warnings(120)       // Show warnings from last 120s
window.perf.warningSummary()    // Show warning summary
window.perf.checkNow()          // Check performance now
window.perf.startWarnings(5000) // Start auto-warnings (every 5s)
window.perf.stopWarnings()      // Stop auto-warnings
```

#### Snapshots & Comparison
```javascript
const before = window.perf.snapshot()
// ... make changes ...
const after = window.perf.snapshot()
window.perf.compare(before, after)
```

#### Export
```javascript
window.perf.report()            // Print report to console
window.perf.download()          // Download text report
window.perf.downloadJSON()      // Download JSON data
```

### Code Integration

#### Synchronous Functions
```typescript
import { startTimer, endTimer, measure } from './utils/performanceMonitor';

// Method 1: Manual timing
function processData() {
  startTimer('processData');
  try {
    // Your code
  } finally {
    endTimer('processData');
  }
}

// Method 2: Automatic timing
const result = measure('processData', () => {
  // Your code
  return value;
});
```

#### Async Functions
```typescript
import { measureAsync } from './utils/performanceMonitor';

async function fetchData() {
  return measureAsync('fetchData', async () => {
    const response = await fetch('/api/data');
    return response.json();
  });
}
```

#### Loops
```typescript
import { startTimer, endTimer } from './utils/performanceMonitor';

for (const item of items) {
  startTimer('processItem');
  processItem(item);
  endTimer('processItem');
}
```

## 📚 Documentation

- **[PERFORMANCE_QUICK_START.md](./PERFORMANCE_QUICK_START.md)** - Quick reference guide
- **[PERFORMANCE_MONITORING.md](./PERFORMANCE_MONITORING.md)** - Comprehensive documentation
- **[PERFORMANCE_TOOLS_SUMMARY.md](./PERFORMANCE_TOOLS_SUMMARY.md)** - Feature summary

## 🏗️ Architecture

### Components

```
src/utils/
├── performanceMonitor.ts      # Core monitoring engine
├── performanceWarnings.ts     # Automatic warning system
├── performanceConsole.ts      # Browser console API
└── performanceMonitor.test.ts # Examples and tests

src/components/ui/
└── PerformanceOverlay.tsx     # Visual overlay component

Documentation/
├── README_PERFORMANCE.md      # This file
├── PERFORMANCE_QUICK_START.md # Quick reference
├── PERFORMANCE_MONITORING.md  # Detailed guide
└── PERFORMANCE_TOOLS_SUMMARY.md # Summary
```

### Data Flow

```
┌─────────────────┐
│  Game Code      │
│  (instrumented) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Performance     │
│ Monitor         │
│ (collects data) │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌─────────────────┐  ┌──────────────┐
│ Visual Overlay  │  │ Console API  │
│ (real-time UI)  │  │ (window.perf)│
└─────────────────┘  └──────────────┘
         │                 │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ Warning System  │
         │ (auto-detect)   │
         └─────────────────┘
```

### Instrumented Areas

Currently instrumented:
- ✅ Combat tick processing
- ✅ Buff and regeneration
- ✅ Enemy attacks
- ✅ Player actions
- ✅ State updates
- ✅ Damage calculations

Easy to add more:
```typescript
import { startTimer, endTimer } from './utils/performanceMonitor';

function yourFunction() {
  startTimer('yourFunction');
  // ... code ...
  endTimer('yourFunction');
}
```

## 💡 Examples

### Example 1: Finding a Slow Function

```javascript
// 1. Clear metrics and start fresh
window.perf.clear()

// 2. Run the game (e.g., start a dungeon)
// ... play for 30-60 seconds ...

// 3. Check top slowest functions
window.perf.show('total', 10)

// Output:
// 1. combat.processPlayerActions - 450ms total, 9ms avg, 50 calls
// 2. damage.calculatePlayerDamageToEnemy - 320ms total, 0.8ms avg, 400 calls
// ...

// 4. Focus on optimizing combat.processPlayerActions first
```

### Example 2: Detecting Memory Leaks

```javascript
// 1. Check initial memory
window.perf.memory()
// Output: Used: 45.2 MB / Limit: 2048 MB (2.2% used)

// 2. Play for 5 minutes
// ... gameplay ...

// 3. Check memory again
window.perf.memory()
// Output: Used: 850.5 MB / Limit: 2048 MB (41.5% used)

// If memory keeps growing, you have a leak!
```

### Example 3: Before/After Optimization

```javascript
// 1. Take snapshot before optimization
const before = window.perf.snapshot()

// 2. Make your optimization changes
// ... edit code, reload page ...

// 3. Clear metrics and test
window.perf.clear()
// ... play for 30 seconds ...

// 4. Take snapshot after
const after = window.perf.snapshot()

// 5. Compare
window.perf.compare(before, after)
// Shows which functions improved/worsened
```

### Example 4: Monitoring Specific Function

```javascript
// Add to your code:
import { measure } from './utils/performanceMonitor';

function expensiveCalculation(data) {
  return measure('expensiveCalculation', () => {
    // Your calculation
    return result;
  });
}

// Then in console:
window.perf.get('expensiveCalculation')
// Shows detailed stats for that function
```

## 🎯 Performance Targets

### Excellent ✅
- **FPS**: 58-60
- **Frame Time**: <17ms
- **Memory**: <50% of limit
- **Function Time**: <10ms per call

### Acceptable ⚡
- **FPS**: 45-58
- **Frame Time**: 17-22ms
- **Memory**: 50-75% of limit
- **Function Time**: 10-20ms per call

### Needs Work 🔴
- **FPS**: <45
- **Frame Time**: >22ms
- **Memory**: >75% of limit
- **Function Time**: >20ms per call

## 🐛 Troubleshooting

### Overlay Not Showing
1. Press `Ctrl+Shift+P` (not just Ctrl+P)
2. Check browser console for errors
3. Try refreshing the page

### No Metrics Showing
1. Run a dungeon (most intensive scenario)
2. Wait 30-60 seconds for metrics to accumulate
3. Check monitoring is enabled: `window.perf.enable()`

### High Memory Usage
1. Check for growing arrays/objects
2. Verify event listeners are cleaned up
3. Use browser DevTools memory profiler

### Low FPS
1. Check `window.perf.show('total', 20)`
2. Optimize functions with highest total time
3. Reduce visual effects if needed

## 🚀 Next Steps

1. **Try it out**: Press `Ctrl+Shift+P` and run a dungeon
2. **Check metrics**: See which functions are slowest
3. **Export data**: Download a report for analysis
4. **Optimize**: Focus on the biggest bottlenecks first
5. **Measure again**: Verify your optimizations helped

## 📊 Sample Output

### Console Report
```
=== PERFORMANCE REPORT ===

Frame Statistics:
  Average FPS: 58.5
  Min FPS: 45.2
  Max FPS: 60.0
  Average Frame Time: 17.1ms
  95th Percentile: 20.5ms
  99th Percentile: 24.2ms

Memory Usage:
  Used: 125.5 MB
  Total: 180.2 MB
  Limit: 2048.0 MB

Top 20 Slowest (by total time):
  1. combat.processPlayerActions
     Total: 450.25ms, Avg: 9.01ms, Calls: 50
     Min: 5.20ms, Max: 15.80ms
  2. damage.calculatePlayerDamageToEnemy
     Total: 320.15ms, Avg: 0.80ms, Calls: 400
     Min: 0.40ms, Max: 2.10ms
  ...
```

## 🤝 Contributing

To add more instrumentation:

1. Import the performance monitor
2. Wrap your function with timing
3. Test and verify metrics appear

```typescript
import { startTimer, endTimer } from './utils/performanceMonitor';

function myNewFunction() {
  startTimer('myNewFunction');
  try {
    // Your code
  } finally {
    endTimer('myNewFunction');
  }
}
```

## 📝 License

Part of the DungeonGame project.

---

**Ready to find those bottlenecks?** Press `Ctrl+Shift+P` and start monitoring! 🚀




