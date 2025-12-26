/**
 * Performance Monitoring System
 * Tracks execution time, memory usage, and call counts for performance analysis
 */

export interface PerformanceMetric {
  name: string;
  totalTime: number;
  callCount: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  lastCallTime: number;
  memoryDelta?: number;
}

export interface PerformanceSnapshot {
  timestamp: number;
  metrics: Map<string, PerformanceMetric>;
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private activeTimers: Map<string, { startTime: number; startMemory?: number }> = new Map();
  private snapshots: PerformanceSnapshot[] = [];
  private enabled: boolean = true;
  private maxSnapshots: number = 100;
  private frameTimings: number[] = [];
  private maxFrameTimings: number = 120; // Track last 120 frames (2 seconds at 60fps)
  
  constructor() {
    // Start frame timing monitoring
    this.startFrameMonitoring();
  }

  /**
   * Enable or disable performance monitoring
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.activeTimers.clear();
    }
  }

  /**
   * Start timing a code section
   */
  startTimer(name: string, trackMemory: boolean = false): void {
    if (!this.enabled) return;

    const startTime = performance.now();
    const startMemory = trackMemory && (performance as any).memory 
      ? (performance as any).memory.usedJSHeapSize 
      : undefined;

    this.activeTimers.set(name, { startTime, startMemory });
  }

  /**
   * End timing a code section and record metrics
   */
  endTimer(name: string): number | null {
    if (!this.enabled) return null;

    const timer = this.activeTimers.get(name);
    if (!timer) {
      console.warn(`PerformanceMonitor: No active timer found for "${name}"`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - timer.startTime;
    
    let memoryDelta: number | undefined;
    if (timer.startMemory !== undefined && (performance as any).memory) {
      const endMemory = (performance as any).memory.usedJSHeapSize;
      memoryDelta = endMemory - timer.startMemory;
    }

    this.activeTimers.delete(name);
    this.recordMetric(name, duration, memoryDelta);

    return duration;
  }

  /**
   * Record a metric manually
   */
  recordMetric(name: string, duration: number, memoryDelta?: number): void {
    if (!this.enabled) return;

    const existing = this.metrics.get(name);
    
    if (existing) {
      existing.totalTime += duration;
      existing.callCount += 1;
      existing.averageTime = existing.totalTime / existing.callCount;
      existing.minTime = Math.min(existing.minTime, duration);
      existing.maxTime = Math.max(existing.maxTime, duration);
      existing.lastCallTime = duration;
      if (memoryDelta !== undefined) {
        existing.memoryDelta = (existing.memoryDelta || 0) + memoryDelta;
      }
    } else {
      this.metrics.set(name, {
        name,
        totalTime: duration,
        callCount: 1,
        averageTime: duration,
        minTime: duration,
        maxTime: duration,
        lastCallTime: duration,
        memoryDelta
      });
    }
  }

  /**
   * Measure a synchronous function
   */
  measure<T>(name: string, fn: () => T, trackMemory: boolean = false): T {
    if (!this.enabled) return fn();

    this.startTimer(name, trackMemory);
    try {
      const result = fn();
      return result;
    } finally {
      this.endTimer(name);
    }
  }

  /**
   * Measure an async function
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>, trackMemory: boolean = false): Promise<T> {
    if (!this.enabled) return fn();

    this.startTimer(name, trackMemory);
    try {
      const result = await fn();
      return result;
    } finally {
      this.endTimer(name);
    }
  }

  /**
   * Take a snapshot of current metrics
   */
  takeSnapshot(): PerformanceSnapshot {
    const snapshot: PerformanceSnapshot = {
      timestamp: Date.now(),
      metrics: new Map(this.metrics)
    };

    // Add memory usage if available
    if ((performance as any).memory) {
      snapshot.memoryUsage = {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      };
    }

    this.snapshots.push(snapshot);
    
    // Keep only the last N snapshots
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }

    return snapshot;
  }

  /**
   * Get all metrics
   */
  getMetrics(): Map<string, PerformanceMetric> {
    return new Map(this.metrics);
  }

  /**
   * Get a specific metric
   */
  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  /**
   * Get all snapshots
   */
  getSnapshots(): PerformanceSnapshot[] {
    return [...this.snapshots];
  }

  /**
   * Get metrics sorted by total time (slowest first)
   */
  getMetricsByTotalTime(): PerformanceMetric[] {
    return Array.from(this.metrics.values())
      .sort((a, b) => b.totalTime - a.totalTime);
  }

  /**
   * Get metrics sorted by average time (slowest first)
   */
  getMetricsByAverageTime(): PerformanceMetric[] {
    return Array.from(this.metrics.values())
      .sort((a, b) => b.averageTime - a.averageTime);
  }

  /**
   * Get metrics sorted by call count (most frequent first)
   */
  getMetricsByCallCount(): PerformanceMetric[] {
    return Array.from(this.metrics.values())
      .sort((a, b) => b.callCount - a.callCount);
  }

  /**
   * Get frame timing statistics
   */
  getFrameStats(): {
    averageFps: number;
    minFps: number;
    maxFps: number;
    frameCount: number;
    averageFrameTime: number;
    percentile95: number;
    percentile99: number;
  } {
    if (this.frameTimings.length === 0) {
      return {
        averageFps: 0,
        minFps: 0,
        maxFps: 0,
        frameCount: 0,
        averageFrameTime: 0,
        percentile95: 0,
        percentile99: 0
      };
    }

    const sorted = [...this.frameTimings].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    const avg = sum / sorted.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    
    const p95Index = Math.floor(sorted.length * 0.95);
    const p99Index = Math.floor(sorted.length * 0.99);

    return {
      averageFps: 1000 / avg,
      minFps: 1000 / max,
      maxFps: 1000 / min,
      frameCount: this.frameTimings.length,
      averageFrameTime: avg,
      percentile95: sorted[p95Index],
      percentile99: sorted[p99Index]
    };
  }

  /**
   * Start monitoring frame timings
   */
  private startFrameMonitoring(): void {
    let lastFrameTime = performance.now();
    
    const measureFrame = () => {
      if (!this.enabled) {
        requestAnimationFrame(measureFrame);
        return;
      }

      const now = performance.now();
      const frameTime = now - lastFrameTime;
      lastFrameTime = now;

      this.frameTimings.push(frameTime);
      if (this.frameTimings.length > this.maxFrameTimings) {
        this.frameTimings.shift();
      }

      requestAnimationFrame(measureFrame);
    };

    requestAnimationFrame(measureFrame);
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
    this.activeTimers.clear();
    this.snapshots = [];
    this.frameTimings = [];
  }

  /**
   * Generate a performance report
   */
  generateReport(): string {
    const lines: string[] = [];
    lines.push('=== PERFORMANCE REPORT ===\n');
    
    // Frame stats
    const frameStats = this.getFrameStats();
    lines.push('Frame Statistics:');
    lines.push(`  Average FPS: ${frameStats.averageFps.toFixed(2)}`);
    lines.push(`  Min FPS: ${frameStats.minFps.toFixed(2)}`);
    lines.push(`  Max FPS: ${frameStats.maxFps.toFixed(2)}`);
    lines.push(`  Average Frame Time: ${frameStats.averageFrameTime.toFixed(2)}ms`);
    lines.push(`  95th Percentile: ${frameStats.percentile95.toFixed(2)}ms`);
    lines.push(`  99th Percentile: ${frameStats.percentile99.toFixed(2)}ms`);
    lines.push('');

    // Memory usage
    if ((performance as any).memory) {
      const mem = (performance as any).memory;
      lines.push('Memory Usage:');
      lines.push(`  Used: ${(mem.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
      lines.push(`  Total: ${(mem.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
      lines.push(`  Limit: ${(mem.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`);
      lines.push('');
    }

    // Top 20 by total time
    lines.push('Top 20 Slowest (by total time):');
    this.getMetricsByTotalTime().slice(0, 20).forEach((metric, i) => {
      lines.push(`  ${i + 1}. ${metric.name}`);
      lines.push(`     Total: ${metric.totalTime.toFixed(2)}ms, Avg: ${metric.averageTime.toFixed(2)}ms, Calls: ${metric.callCount}`);
      lines.push(`     Min: ${metric.minTime.toFixed(2)}ms, Max: ${metric.maxTime.toFixed(2)}ms`);
    });
    lines.push('');

    // Top 20 by average time
    lines.push('Top 20 Slowest (by average time):');
    this.getMetricsByAverageTime().slice(0, 20).forEach((metric, i) => {
      lines.push(`  ${i + 1}. ${metric.name}`);
      lines.push(`     Avg: ${metric.averageTime.toFixed(2)}ms, Total: ${metric.totalTime.toFixed(2)}ms, Calls: ${metric.callCount}`);
    });
    lines.push('');

    // Top 20 most frequent
    lines.push('Top 20 Most Frequent:');
    this.getMetricsByCallCount().slice(0, 20).forEach((metric, i) => {
      lines.push(`  ${i + 1}. ${metric.name}`);
      lines.push(`     Calls: ${metric.callCount}, Total: ${metric.totalTime.toFixed(2)}ms, Avg: ${metric.averageTime.toFixed(2)}ms`);
    });

    return lines.join('\n');
  }

  /**
   * Export metrics as JSON
   */
  exportJSON(): string {
    return JSON.stringify({
      timestamp: Date.now(),
      frameStats: this.getFrameStats(),
      memoryUsage: (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : null,
      metrics: Array.from(this.metrics.entries()).map(([, metric]) => ({
        ...metric
      })),
      snapshots: this.snapshots.map(s => ({
        timestamp: s.timestamp,
        memoryUsage: s.memoryUsage,
        metrics: Array.from(s.metrics.entries()).map(([, metric]) => ({
          ...metric
        }))
      }))
    }, null, 2);
  }

  /**
   * Download performance report as a file
   */
  downloadReport(filename: string = 'performance-report.txt'): void {
    const report = this.generateReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Download metrics as JSON
   */
  downloadJSON(filename: string = 'performance-metrics.json'): void {
    const json = this.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Global singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Convenience functions
export const startTimer = (name: string, trackMemory?: boolean) => performanceMonitor.startTimer(name, trackMemory);
export const endTimer = (name: string) => performanceMonitor.endTimer(name);
export const measure = <T>(name: string, fn: () => T, trackMemory?: boolean) => performanceMonitor.measure(name, fn, trackMemory);
export const measureAsync = <T>(name: string, fn: () => Promise<T>, trackMemory?: boolean) => performanceMonitor.measureAsync(name, fn, trackMemory);

