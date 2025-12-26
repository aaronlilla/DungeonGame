# Performance Monitoring Guide

This document describes the performance monitoring tools available in the game and how to use them to identify and fix performance bottlenecks.

## Quick Start

### Enabling the Performance Overlay

Press **Ctrl+Shift+P** to toggle the performance overlay on/off.

The overlay shows:
- **FPS (Frames Per Second)**: Current, min, and max FPS
- **Frame Time**: Average time to render a frame
- **Memory Usage**: Current memory consumption
- **Top Metrics**: Slowest functions and most frequently called functions

### Understanding the Metrics

The performance overlay tracks three types of metrics:

1. **Total Time**: Total cumulative time spent in a function (best for finding overall bottlenecks)
2. **Average Time**: Average time per call (best for finding inefficient individual calls)
3. **Call Count**: Number of times a function was called (best for finding excessive calls)

Use the dropdown in the overlay to switch between these views.

## Performance Monitor API

### Basic Usage

```typescript
import { startTimer, endTimer, measure, measureAsync } from './utils/performanceMonitor';

// Manual timing
startTimer('myFunction');
// ... your code ...
endTimer('myFunction');

// Automatic timing (synchronous)
const result = measure('myFunction', () => {
  // ... your code ...
  return someValue;
});

// Automatic timing (async)
const result = await measureAsync('myAsyncFunction', async () => {
  // ... your async code ...
  return someValue;
});
```

### Advanced Usage

```typescript
import { performanceMonitor } from './utils/performanceMonitor';

// Enable/disable monitoring
performanceMonitor.setEnabled(true);

// Get specific metric
const metric = performanceMonitor.getMetric('combat.processPlayerActions');
console.log(`Average time: ${metric.averageTime}ms`);

// Get all metrics sorted by total time
const slowest = performanceMonitor.getMetricsByTotalTime();

// Get frame statistics
const frameStats = performanceMonitor.getFrameStats();
console.log(`Average FPS: ${frameStats.averageFps}`);

// Take a snapshot for later comparison
const snapshot = performanceMonitor.takeSnapshot();

// Generate and download a report
performanceMonitor.downloadReport('performance-report.txt');
performanceMonitor.downloadJSON('performance-metrics.json');

// Clear all metrics
performanceMonitor.clear();
```

## Instrumented Areas

The following areas of the codebase are currently instrumented:

### Combat System

- `combat.tick.{N}` - Overall tick processing time
- `combat.processBuffsAndRegen` - Buff and regeneration processing
- `combat.processEnemyAttacks` - Enemy attack processing
- `combat.processPlayerActions` - Player action processing
- `combat.updateCombatState` - State update time

### Damage Calculation

- `damage.calculatePlayerDamageToEnemy` - Damage calculation for player attacks

## Adding Performance Monitoring to Your Code

### For Synchronous Code

```typescript
import { startTimer, endTimer } from '../utils/performanceMonitor';

function myFunction() {
  startTimer('myFunction');
  
  try {
    // Your code here
  } finally {
    endTimer('myFunction');
  }
}
```

### For Async Code

```typescript
import { measureAsync } from '../utils/performanceMonitor';

async function myAsyncFunction() {
  return measureAsync('myAsyncFunction', async () => {
    // Your async code here
    await someAsyncOperation();
    return result;
  });
}
```

### For Loops

```typescript
import { startTimer, endTimer } from '../utils/performanceMonitor';

for (let i = 0; i < items.length; i++) {
  startTimer('processItem');
  processItem(items[i]);
  endTimer('processItem');
}
```

## Interpreting Results

### High Total Time, Low Call Count
This indicates a function that's slow but not called often. Optimize the function itself.

### High Total Time, High Call Count
This indicates a function that's called frequently. Consider:
1. Reducing the number of calls
2. Caching results
3. Optimizing the function

### Low Average Time, High Call Count
This indicates a fast function that's called too often. Consider:
1. Batching operations
2. Debouncing/throttling
3. Caching results

### Frame Time > 16.67ms
This means you're running below 60 FPS. Look for:
1. Functions with high total time
2. Functions called every frame
3. Unnecessary re-renders in React components

## Performance Best Practices

### Combat System

1. **Batch State Updates**: Update React state in batches rather than on every tick
2. **Limit Log Entries**: Keep combat log entries to a reasonable size (currently 50)
3. **Limit Floating Numbers**: Cap the number of floating damage numbers (currently 15)
4. **Use Tick-Based Timing**: Process in 100ms ticks rather than every frame

### React Components

1. **Use React.memo**: Memoize expensive components
2. **Use useMemo/useCallback**: Memoize expensive calculations and callbacks
3. **Avoid Inline Functions**: Don't create new functions on every render
4. **Virtualize Long Lists**: Use react-window or similar for long lists

### General

1. **Profile Before Optimizing**: Use the performance monitor to find real bottlenecks
2. **Measure After Changes**: Verify that optimizations actually help
3. **Consider Trade-offs**: Sometimes code clarity is more important than micro-optimizations

## Troubleshooting

### Performance Overlay Not Showing

1. Make sure you pressed **Ctrl+Shift+P** (not just Ctrl+P)
2. Check browser console for errors
3. Try refreshing the page

### No Metrics Showing

1. Make sure you're in a performance-intensive area (e.g., running a dungeon)
2. Wait a few seconds for metrics to accumulate
3. Check that monitoring is enabled: `performanceMonitor.setEnabled(true)`

### High Memory Usage

1. Check for memory leaks (objects not being garbage collected)
2. Look for large arrays or objects being created repeatedly
3. Use the memory profiler in browser DevTools

### Low FPS

1. Check frame stats in the overlay
2. Look for functions with high total time
3. Check for excessive DOM updates
4. Consider reducing visual effects

## Exporting Data

### Text Report

Click the "Export" button in the overlay or use:

```typescript
performanceMonitor.downloadReport('my-report.txt');
```

The report includes:
- Frame statistics
- Memory usage
- Top 20 slowest functions (by total time)
- Top 20 slowest functions (by average time)
- Top 20 most frequently called functions

### JSON Export

For programmatic analysis:

```typescript
performanceMonitor.downloadJSON('my-metrics.json');
```

The JSON includes:
- All metrics with full details
- Frame statistics
- Memory usage snapshots
- Historical snapshots

## Example: Finding a Performance Issue

1. **Enable the overlay**: Press Ctrl+Shift+P
2. **Run the game**: Start a dungeon and play for 30-60 seconds
3. **Check FPS**: If below 60, you have a performance issue
4. **Sort by Total Time**: Look at the top functions
5. **Identify the culprit**: Find functions taking >100ms total
6. **Export data**: Click "Export" to save detailed metrics
7. **Optimize**: Add caching, reduce calls, or optimize the function
8. **Measure again**: Clear metrics and test to verify improvement

## Example Results

Here's what good performance looks like:

```
Frame Statistics:
  Average FPS: 58.5
  Frame Time: 17.1ms
  95th Percentile: 20.5ms

Top Functions:
  1. combat.processPlayerActions - 45ms total, 0.9ms avg, 50 calls
  2. combat.processEnemyAttacks - 30ms total, 0.6ms avg, 50 calls
  3. combat.updateCombatState - 15ms total, 1.5ms avg, 10 calls
```

And here's what needs optimization:

```
Frame Statistics:
  Average FPS: 25.3
  Frame Time: 39.5ms
  95th Percentile: 55.2ms

Top Functions:
  1. combat.processPlayerActions - 1250ms total, 25ms avg, 50 calls ⚠️
  2. damage.calculatePlayerDamageToEnemy - 800ms total, 2ms avg, 400 calls ⚠️
  3. combat.updateCombatState - 450ms total, 45ms avg, 10 calls ⚠️
```

The second example shows functions taking too long. Focus on optimizing `combat.processPlayerActions` first (highest total time).




