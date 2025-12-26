/**
 * Performance Warning System
 * Automatically detects and warns about performance issues
 */

import { performanceMonitor } from './performanceMonitor';

interface PerformanceThresholds {
  minFps: number;
  maxFrameTime: number;
  maxMemoryPercent: number;
  maxFunctionTime: number;
  maxFunctionCalls: number;
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  minFps: 45,
  maxFrameTime: 22, // ms
  maxMemoryPercent: 75,
  maxFunctionTime: 50, // ms total time
  maxFunctionCalls: 1000
};

export interface PerformanceWarning {
  type: 'fps' | 'frameTime' | 'memory' | 'function' | 'calls';
  severity: 'warning' | 'critical';
  message: string;
  details: any;
  timestamp: number;
}

class PerformanceWarningSystem {
  private warnings: PerformanceWarning[] = [];
  private thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS;
  private enabled: boolean = true;
  private checkInterval: number | null = null;
  private onWarningCallback?: (warning: PerformanceWarning) => void;

  /**
   * Start monitoring for performance issues
   */
  start(intervalMs: number = 5000): void {
    if (this.checkInterval !== null) {
      return; // Already running
    }

    this.checkInterval = window.setInterval(() => {
      this.checkPerformance();
    }, intervalMs);

    console.log(`🔍 Performance warning system started (checking every ${intervalMs}ms)`);
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('🔍 Performance warning system stopped');
    }
  }

  /**
   * Set custom thresholds
   */
  setThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  /**
   * Set callback for when warnings are detected
   */
  onWarning(callback: (warning: PerformanceWarning) => void): void {
    this.onWarningCallback = callback;
  }

  /**
   * Check current performance and generate warnings
   */
  checkPerformance(): void {
    if (!this.enabled) return;

    const now = Date.now();

    // Check FPS
    const frameStats = performanceMonitor.getFrameStats();
    if (frameStats.averageFps < this.thresholds.minFps) {
      this.addWarning({
        type: 'fps',
        severity: frameStats.averageFps < 30 ? 'critical' : 'warning',
        message: `Low FPS detected: ${frameStats.averageFps.toFixed(1)} FPS`,
        details: frameStats,
        timestamp: now
      });
    }

    // Check frame time
    if (frameStats.averageFrameTime > this.thresholds.maxFrameTime) {
      this.addWarning({
        type: 'frameTime',
        severity: frameStats.averageFrameTime > 30 ? 'critical' : 'warning',
        message: `High frame time: ${frameStats.averageFrameTime.toFixed(2)}ms`,
        details: frameStats,
        timestamp: now
      });
    }

    // Check memory
    if ((performance as any).memory) {
      const mem = (performance as any).memory;
      const percent = (mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100;
      if (percent > this.thresholds.maxMemoryPercent) {
        this.addWarning({
          type: 'memory',
          severity: percent > 85 ? 'critical' : 'warning',
          message: `High memory usage: ${percent.toFixed(1)}%`,
          details: {
            used: mem.usedJSHeapSize / 1024 / 1024,
            limit: mem.jsHeapSizeLimit / 1024 / 1024,
            percent
          },
          timestamp: now
        });
      }
    }

    // Check slow functions
    const slowFunctions = performanceMonitor
      .getMetricsByTotalTime()
      .filter(m => m.totalTime > this.thresholds.maxFunctionTime);

    slowFunctions.slice(0, 5).forEach(metric => {
      this.addWarning({
        type: 'function',
        severity: metric.totalTime > 100 ? 'critical' : 'warning',
        message: `Slow function: ${metric.name} (${metric.totalTime.toFixed(2)}ms total)`,
        details: metric,
        timestamp: now
      });
    });

    // Check frequently called functions
    const frequentFunctions = performanceMonitor
      .getMetricsByCallCount()
      .filter(m => m.callCount > this.thresholds.maxFunctionCalls);

    frequentFunctions.slice(0, 5).forEach(metric => {
      this.addWarning({
        type: 'calls',
        severity: metric.callCount > 5000 ? 'critical' : 'warning',
        message: `Frequently called: ${metric.name} (${metric.callCount} calls)`,
        details: metric,
        timestamp: now
      });
    });
  }

  /**
   * Add a warning
   */
  private addWarning(warning: PerformanceWarning): void {
    // Avoid duplicate warnings (same type and message within 10 seconds)
    const isDuplicate = this.warnings.some(w => 
      w.type === warning.type && 
      w.message === warning.message &&
      (warning.timestamp - w.timestamp) < 10000
    );

    if (isDuplicate) return;

    this.warnings.push(warning);

    // Keep only last 100 warnings
    if (this.warnings.length > 100) {
      this.warnings.shift();
    }

    // Log to console
    const emoji = warning.severity === 'critical' ? '🔴' : '⚠️';
    console.warn(`${emoji} Performance ${warning.severity}: ${warning.message}`, warning.details);

    // Call callback if set
    if (this.onWarningCallback) {
      this.onWarningCallback(warning);
    }
  }

  /**
   * Get all warnings
   */
  getWarnings(): PerformanceWarning[] {
    return [...this.warnings];
  }

  /**
   * Get warnings by type
   */
  getWarningsByType(type: PerformanceWarning['type']): PerformanceWarning[] {
    return this.warnings.filter(w => w.type === type);
  }

  /**
   * Get warnings by severity
   */
  getWarningsBySeverity(severity: PerformanceWarning['severity']): PerformanceWarning[] {
    return this.warnings.filter(w => w.severity === severity);
  }

  /**
   * Get recent warnings (last N seconds)
   */
  getRecentWarnings(seconds: number = 60): PerformanceWarning[] {
    const cutoff = Date.now() - (seconds * 1000);
    return this.warnings.filter(w => w.timestamp > cutoff);
  }

  /**
   * Clear all warnings
   */
  clearWarnings(): void {
    this.warnings = [];
  }

  /**
   * Generate a warning summary
   */
  getSummary(): string {
    const recent = this.getRecentWarnings(60);
    const critical = recent.filter(w => w.severity === 'critical').length;
    const warnings = recent.filter(w => w.severity === 'warning').length;

    const lines: string[] = [];
    lines.push('=== Performance Warning Summary (Last 60s) ===\n');
    lines.push(`Critical Issues: ${critical}`);
    lines.push(`Warnings: ${warnings}`);
    lines.push(`Total: ${recent.length}\n`);

    if (recent.length > 0) {
      lines.push('Recent Issues:');
      recent.slice(-10).forEach((w, i) => {
        const emoji = w.severity === 'critical' ? '🔴' : '⚠️';
        const time = new Date(w.timestamp).toLocaleTimeString();
        lines.push(`  ${i + 1}. [${time}] ${emoji} ${w.message}`);
      });
    } else {
      lines.push('✅ No performance issues detected!');
    }

    return lines.join('\n');
  }

  /**
   * Enable/disable the warning system
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Global singleton
export const performanceWarnings = new PerformanceWarningSystem();

// Auto-start in development mode
if (import.meta.env.MODE !== 'production') {
  // Start checking every 5 seconds
  performanceWarnings.start(5000);
}

