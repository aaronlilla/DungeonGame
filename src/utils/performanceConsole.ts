/**
 * Performance Console Utilities
 * Exposes performance monitoring tools to the browser console for easy debugging
 */

import { performanceMonitor } from './performanceMonitor';
import { performanceWarnings } from './performanceWarnings';

// Expose performance tools to window for console access
declare global {
  interface Window {
    perf: typeof performanceTools;
  }
}

export const performanceTools = {
  /**
   * Enable performance monitoring
   */
  enable() {
    performanceMonitor.setEnabled(true);
    console.log('✅ Performance monitoring enabled');
  },

  /**
   * Disable performance monitoring
   */
  disable() {
    performanceMonitor.setEnabled(false);
    console.log('❌ Performance monitoring disabled');
  },

  /**
   * Clear all metrics
   */
  clear() {
    performanceMonitor.clear();
    console.log('🗑️ All metrics cleared');
  },

  /**
   * Show current metrics
   */
  show(sortBy: 'total' | 'average' | 'count' = 'total', limit: number = 20) {
    let metrics;
    switch (sortBy) {
      case 'total':
        metrics = performanceMonitor.getMetricsByTotalTime();
        break;
      case 'average':
        metrics = performanceMonitor.getMetricsByAverageTime();
        break;
      case 'count':
        metrics = performanceMonitor.getMetricsByCallCount();
        break;
    }

    console.log(`\n📊 Top ${limit} metrics (sorted by ${sortBy}):\n`);
    metrics.slice(0, limit).forEach((metric, i) => {
      console.log(`${i + 1}. ${metric.name}`);
      console.log(`   Total: ${metric.totalTime.toFixed(2)}ms | Avg: ${metric.averageTime.toFixed(2)}ms | Calls: ${metric.callCount}`);
      console.log(`   Min: ${metric.minTime.toFixed(2)}ms | Max: ${metric.maxTime.toFixed(2)}ms`);
    });
  },

  /**
   * Show frame statistics
   */
  fps() {
    const stats = performanceMonitor.getFrameStats();
    console.log('\n🎮 Frame Statistics:');
    console.log(`   Average FPS: ${stats.averageFps.toFixed(2)}`);
    console.log(`   Min FPS: ${stats.minFps.toFixed(2)}`);
    console.log(`   Max FPS: ${stats.maxFps.toFixed(2)}`);
    console.log(`   Average Frame Time: ${stats.averageFrameTime.toFixed(2)}ms`);
    console.log(`   95th Percentile: ${stats.percentile95.toFixed(2)}ms`);
    console.log(`   99th Percentile: ${stats.percentile99.toFixed(2)}ms`);
    
    // Color-coded FPS warning
    if (stats.averageFps < 30) {
      console.warn('⚠️ Low FPS detected! Consider optimizing.');
    } else if (stats.averageFps < 55) {
      console.log('⚡ FPS could be improved.');
    } else {
      console.log('✅ FPS is good!');
    }
  },

  /**
   * Show memory usage
   */
  memory() {
    if ((performance as any).memory) {
      const mem = (performance as any).memory;
      const used = mem.usedJSHeapSize / 1024 / 1024;
      const total = mem.totalJSHeapSize / 1024 / 1024;
      const limit = mem.jsHeapSizeLimit / 1024 / 1024;
      const percent = (used / limit) * 100;

      console.log('\n💾 Memory Usage:');
      console.log(`   Used: ${used.toFixed(2)} MB`);
      console.log(`   Total: ${total.toFixed(2)} MB`);
      console.log(`   Limit: ${limit.toFixed(2)} MB`);
      console.log(`   Usage: ${percent.toFixed(1)}%`);

      if (percent > 75) {
        console.warn('⚠️ High memory usage detected!');
      } else if (percent > 50) {
        console.log('⚡ Memory usage is moderate.');
      } else {
        console.log('✅ Memory usage is good!');
      }
    } else {
      console.log('❌ Memory API not available in this browser');
    }
  },

  /**
   * Get a specific metric
   */
  get(name: string) {
    const metric = performanceMonitor.getMetric(name);
    if (metric) {
      console.log(`\n📊 Metric: ${metric.name}`);
      console.log(`   Total Time: ${metric.totalTime.toFixed(2)}ms`);
      console.log(`   Average Time: ${metric.averageTime.toFixed(2)}ms`);
      console.log(`   Call Count: ${metric.callCount}`);
      console.log(`   Min Time: ${metric.minTime.toFixed(2)}ms`);
      console.log(`   Max Time: ${metric.maxTime.toFixed(2)}ms`);
      console.log(`   Last Call: ${metric.lastCallTime.toFixed(2)}ms`);
      return metric;
    } else {
      console.log(`❌ Metric "${name}" not found`);
      return null;
    }
  },

  /**
   * List all tracked metrics
   */
  list() {
    const metrics = performanceMonitor.getMetrics();
    console.log(`\n📋 All tracked metrics (${metrics.size} total):\n`);
    Array.from(metrics.keys()).sort().forEach((name, i) => {
      console.log(`${i + 1}. ${name}`);
    });
  },

  /**
   * Generate and print a full report
   */
  report() {
    console.log('\n' + performanceMonitor.generateReport());
  },

  /**
   * Download report as text file
   */
  download(filename?: string) {
    performanceMonitor.downloadReport(filename);
    console.log(`📥 Report downloaded as ${filename || 'performance-report.txt'}`);
  },

  /**
   * Download metrics as JSON
   */
  downloadJSON(filename?: string) {
    performanceMonitor.downloadJSON(filename);
    console.log(`📥 Metrics downloaded as ${filename || 'performance-metrics.json'}`);
  },

  /**
   * Take a snapshot for comparison
   */
  snapshot() {
    const snapshot = performanceMonitor.takeSnapshot();
    console.log(`📸 Snapshot taken at ${new Date(snapshot.timestamp).toLocaleTimeString()}`);
    return snapshot;
  },

  /**
   * Compare two snapshots
   */
  compare(snapshot1: any, snapshot2: any) {
    console.log('\n📊 Snapshot Comparison:\n');
    
    const metrics1 = new Map(snapshot1.metrics);
    const metrics2 = new Map(snapshot2.metrics);
    
    const allKeys = new Set([...metrics1.keys(), ...metrics2.keys()]);
    
    const changes: Array<{
      name: string;
      totalDiff: number;
      avgDiff: number;
      countDiff: number;
    }> = [];
    
    allKeys.forEach((key) => {
      const m1 = metrics1.get(key as string) as any;
      const m2 = metrics2.get(key as string) as any;
      
      if (m1 && m2) {
        changes.push({
          name: String(key),
          totalDiff: (m2.totalTime || 0) - (m1.totalTime || 0),
          avgDiff: (m2.averageTime || 0) - (m1.averageTime || 0),
          countDiff: (m2.callCount || 0) - (m1.callCount || 0)
        });
      }
    });
    
    // Sort by total time difference
    changes.sort((a, b) => Math.abs(b.totalDiff) - Math.abs(a.totalDiff));
    
    console.log('Top 10 changes (by total time):');
    changes.slice(0, 10).forEach((change, i) => {
      const sign = change.totalDiff >= 0 ? '+' : '';
      console.log(`${i + 1}. ${change.name}`);
      console.log(`   Total: ${sign}${change.totalDiff.toFixed(2)}ms | Avg: ${sign}${change.avgDiff.toFixed(2)}ms | Calls: ${sign}${change.countDiff}`);
    });
  },

  /**
   * Show performance warnings
   */
  warnings(seconds: number = 60) {
    const recent = performanceWarnings.getRecentWarnings(seconds);
    if (recent.length === 0) {
      console.log(`✅ No performance warnings in the last ${seconds} seconds`);
      return;
    }

    console.log(`\n⚠️ Performance Warnings (last ${seconds}s):\n`);
    recent.forEach((w, i) => {
      const emoji = w.severity === 'critical' ? '🔴' : '⚠️';
      const time = new Date(w.timestamp).toLocaleTimeString();
      console.log(`${i + 1}. [${time}] ${emoji} ${w.message}`);
    });

    const critical = recent.filter(w => w.severity === 'critical').length;
    const warnings = recent.filter(w => w.severity === 'warning').length;
    console.log(`\nSummary: ${critical} critical, ${warnings} warnings`);
  },

  /**
   * Show warning summary
   */
  warningSummary() {
    console.log('\n' + performanceWarnings.getSummary());
  },

  /**
   * Start automatic warning checks
   */
  startWarnings(intervalMs: number = 5000) {
    performanceWarnings.start(intervalMs);
    console.log(`✅ Automatic performance warnings enabled (checking every ${intervalMs}ms)`);
  },

  /**
   * Stop automatic warning checks
   */
  stopWarnings() {
    performanceWarnings.stop();
    console.log('❌ Automatic performance warnings disabled');
  },

  /**
   * Check performance now
   */
  checkNow() {
    performanceWarnings.checkPerformance();
    console.log('✅ Performance check complete. Use window.perf.warnings() to see results.');
  },

  /**
   * Show help
   */
  help() {
    console.log(`
🔧 Performance Console Tools

Available commands (use window.perf.<command>):

  enable()              - Enable performance monitoring
  disable()             - Disable performance monitoring
  clear()               - Clear all metrics
  show(sortBy, limit)   - Show top metrics
                          sortBy: 'total' | 'average' | 'count' (default: 'total')
                          limit: number of metrics to show (default: 20)
  fps()                 - Show frame statistics
  memory()              - Show memory usage
  get(name)             - Get a specific metric by name
  list()                - List all tracked metrics
  report()              - Print full performance report
  download(filename)    - Download report as text file
  downloadJSON(filename)- Download metrics as JSON
  snapshot()            - Take a snapshot for comparison
  compare(s1, s2)       - Compare two snapshots
  warnings(seconds)     - Show recent warnings (default: 60s)
  warningSummary()      - Show warning summary
  startWarnings(ms)     - Start automatic warnings (default: 5000ms)
  stopWarnings()        - Stop automatic warnings
  checkNow()            - Check performance now
  help()                - Show this help message

Examples:

  window.perf.show('total', 10)  - Show top 10 by total time
  window.perf.fps()              - Show FPS stats
  window.perf.memory()           - Show memory usage
  window.perf.get('combat.tick') - Get specific metric
  
  const s1 = window.perf.snapshot();
  // ... do something ...
  const s2 = window.perf.snapshot();
  window.perf.compare(s1, s2);   - Compare before/after

Keyboard Shortcuts:

  Ctrl+Shift+P          - Toggle performance overlay
    `);
  }
};

// Auto-expose to window when module loads
if (typeof window !== 'undefined') {
  window.perf = performanceTools;
  console.log('🔧 Performance tools loaded! Type "window.perf.help()" for commands.');
}

