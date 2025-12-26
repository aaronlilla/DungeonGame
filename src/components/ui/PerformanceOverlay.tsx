import React, { useState, useEffect } from 'react';
import { performanceMonitor } from '../../utils/performanceMonitor';
import type { PerformanceMetric } from '../../utils/performanceMonitor';

interface PerformanceOverlayProps {
  visible?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  updateInterval?: number;
}

export const PerformanceOverlay: React.FC<PerformanceOverlayProps> = ({
  visible = true,
  position = 'top-right',
  updateInterval = 1000
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [frameStats, setFrameStats] = useState<any>(null);
  const [memoryUsage, setMemoryUsage] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<'total' | 'average' | 'count'>('total');

  useEffect(() => {
    if (!visible) return;

    const updateStats = () => {
      let sortedMetrics: PerformanceMetric[] = [];
      
      switch (sortBy) {
        case 'total':
          sortedMetrics = performanceMonitor.getMetricsByTotalTime();
          break;
        case 'average':
          sortedMetrics = performanceMonitor.getMetricsByAverageTime();
          break;
        case 'count':
          sortedMetrics = performanceMonitor.getMetricsByCallCount();
          break;
      }

      setMetrics(sortedMetrics.slice(0, 20));
      setFrameStats(performanceMonitor.getFrameStats());

      if ((performance as any).memory) {
        setMemoryUsage({
          used: (performance as any).memory.usedJSHeapSize / 1024 / 1024,
          total: (performance as any).memory.totalJSHeapSize / 1024 / 1024,
          limit: (performance as any).memory.jsHeapSizeLimit / 1024 / 1024
        });
      }
    };

    updateStats();
    const interval = setInterval(updateStats, updateInterval);

    return () => clearInterval(interval);
  }, [visible, updateInterval, sortBy]);

  if (!visible) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const getFpsColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMemoryColor = (used: number, limit: number) => {
    const percent = (used / limit) * 100;
    if (percent < 50) return 'text-green-400';
    if (percent < 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-[9999] pointer-events-auto`}
      style={{ maxHeight: '90vh', overflow: 'auto' }}
    >
      <div className="text-white p-3 rounded-lg shadow-2xl border border-gray-700 font-mono text-xs" style={{
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(8px)'
      }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-700">
          <div className="font-bold text-sm">Performance Monitor</div>
          <div className="flex gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            >
              {expanded ? 'Collapse' : 'Expand'}
            </button>
            <button
              onClick={() => performanceMonitor.clear()}
              className="px-2 py-1 bg-red-700 hover:bg-red-600 rounded text-xs"
            >
              Clear
            </button>
            <button
              onClick={() => performanceMonitor.downloadReport()}
              className="px-2 py-1 bg-blue-700 hover:bg-blue-600 rounded text-xs"
            >
              Export
            </button>
          </div>
        </div>

        {/* Frame Stats */}
        {frameStats && (
          <div className="mb-3 pb-2 border-b border-gray-700">
            <div className="font-semibold mb-1 text-gray-300">Frame Stats</div>
            <div className={`${getFpsColor(frameStats.averageFps)}`}>
              FPS: {frameStats.averageFps.toFixed(1)} (min: {frameStats.minFps.toFixed(1)}, max: {frameStats.maxFps.toFixed(1)})
            </div>
            <div className="text-gray-400">
              Frame Time: {frameStats.averageFrameTime.toFixed(2)}ms
            </div>
            <div className="text-gray-400">
              95th: {frameStats.percentile95.toFixed(2)}ms, 99th: {frameStats.percentile99.toFixed(2)}ms
            </div>
          </div>
        )}

        {/* Memory Usage */}
        {memoryUsage && (
          <div className="mb-3 pb-2 border-b border-gray-700">
            <div className="font-semibold mb-1 text-gray-300">Memory</div>
            <div className={getMemoryColor(memoryUsage.used, memoryUsage.limit)}>
              {memoryUsage.used.toFixed(1)} MB / {memoryUsage.limit.toFixed(1)} MB
            </div>
            <div className="text-gray-400">
              ({((memoryUsage.used / memoryUsage.limit) * 100).toFixed(1)}% used)
            </div>
          </div>
        )}

        {/* Metrics */}
        {expanded && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-300">Top Metrics</div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-700 text-white px-2 py-1 rounded text-xs"
              >
                <option value="total">Total Time</option>
                <option value="average">Avg Time</option>
                <option value="count">Call Count</option>
              </select>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {metrics.map((metric, i) => (
                <div key={metric.name} className="p-2 rounded" style={{
                  backgroundColor: 'rgba(30, 30, 30, 0.8)'
                }}>
                  <div className="flex items-start justify-between">
                    <div className="font-semibold text-blue-300 flex-1 mr-2 break-all">
                      {i + 1}. {metric.name}
                    </div>
                    <div className="text-yellow-300 whitespace-nowrap">
                      {metric.averageTime.toFixed(2)}ms
                    </div>
                  </div>
                  <div className="text-gray-400 text-[10px] mt-1 grid grid-cols-2 gap-1">
                    <div>Total: {metric.totalTime.toFixed(2)}ms</div>
                    <div>Calls: {metric.callCount}</div>
                    <div>Min: {metric.minTime.toFixed(2)}ms</div>
                    <div>Max: {metric.maxTime.toFixed(2)}ms</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats (when collapsed) */}
        {!expanded && metrics.length > 0 && (
          <div className="text-gray-400">
            Tracking {metrics.length} metrics
          </div>
        )}
      </div>
    </div>
  );
};

