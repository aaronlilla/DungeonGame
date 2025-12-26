/**
 * Performance Monitor Test/Demo
 * This file demonstrates how to use the performance monitoring tools
 */

import { performanceMonitor, startTimer, endTimer, measure, measureAsync } from './performanceMonitor';

// Example 1: Manual timing
function exampleManualTiming() {
  startTimer('exampleFunction');
  
  // Simulate some work
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }
  
  endTimer('exampleFunction');
  return sum;
}

// Example 2: Automatic timing (synchronous)
function exampleAutoTiming() {
  return measure('exampleAutoFunction', () => {
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += i;
    }
    return sum;
  });
}

// Example 3: Automatic timing (async)
async function exampleAsyncTiming() {
  return measureAsync('exampleAsyncFunction', async () => {
    // Simulate async work
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += i;
    }
    return sum;
  });
}

// Example 4: Measuring a loop
function exampleLoopTiming() {
  const items = Array.from({ length: 100 }, (_, i) => i);
  
  for (const item of items) {
    startTimer('processItem');
    
    // Simulate processing
    let sum = 0;
    for (let i = 0; i < 10000; i++) {
      sum += item * i;
    }
    
    endTimer('processItem');
  }
}

// Example 5: Nested timing
function exampleNestedTiming() {
  startTimer('outerFunction');
  
  startTimer('innerFunction1');
  let sum1 = 0;
  for (let i = 0; i < 500000; i++) {
    sum1 += i;
  }
  endTimer('innerFunction1');
  
  startTimer('innerFunction2');
  let sum2 = 0;
  for (let i = 0; i < 500000; i++) {
    sum2 += i;
  }
  endTimer('innerFunction2');
  
  endTimer('outerFunction');
  
  return sum1 + sum2;
}

// Run all examples
export async function runPerformanceDemo() {
  console.log('=== Performance Monitor Demo ===\n');
  
  // Clear any existing metrics
  performanceMonitor.clear();
  
  console.log('Running examples...');
  
  // Run examples multiple times to get meaningful averages
  for (let i = 0; i < 10; i++) {
    exampleManualTiming();
    exampleAutoTiming();
    await exampleAsyncTiming();
    exampleLoopTiming();
    exampleNestedTiming();
  }
  
  console.log('Done! Generating report...\n');
  
  // Get metrics
  const metrics = performanceMonitor.getMetrics();
  console.log(`Total metrics tracked: ${metrics.size}`);
  
  // Show top 5 by total time
  console.log('\nTop 5 by Total Time:');
  performanceMonitor.getMetricsByTotalTime().slice(0, 5).forEach((metric, i) => {
    console.log(`  ${i + 1}. ${metric.name}`);
    console.log(`     Total: ${metric.totalTime.toFixed(2)}ms, Avg: ${metric.averageTime.toFixed(2)}ms, Calls: ${metric.callCount}`);
  });
  
  // Show top 5 by average time
  console.log('\nTop 5 by Average Time:');
  performanceMonitor.getMetricsByAverageTime().slice(0, 5).forEach((metric, i) => {
    console.log(`  ${i + 1}. ${metric.name}`);
    console.log(`     Avg: ${metric.averageTime.toFixed(2)}ms, Total: ${metric.totalTime.toFixed(2)}ms, Calls: ${metric.callCount}`);
  });
  
  // Show top 5 by call count
  console.log('\nTop 5 by Call Count:');
  performanceMonitor.getMetricsByCallCount().slice(0, 5).forEach((metric, i) => {
    console.log(`  ${i + 1}. ${metric.name}`);
    console.log(`     Calls: ${metric.callCount}, Total: ${metric.totalTime.toFixed(2)}ms, Avg: ${metric.averageTime.toFixed(2)}ms`);
  });
  
  // Show frame stats
  const frameStats = performanceMonitor.getFrameStats();
  console.log('\nFrame Statistics:');
  console.log(`  Average FPS: ${frameStats.averageFps.toFixed(2)}`);
  console.log(`  Min FPS: ${frameStats.minFps.toFixed(2)}`);
  console.log(`  Max FPS: ${frameStats.maxFps.toFixed(2)}`);
  console.log(`  Average Frame Time: ${frameStats.averageFrameTime.toFixed(2)}ms`);
  
  // Generate full report
  console.log('\n' + performanceMonitor.generateReport());
}

// To run this demo in the browser console:
// import { runPerformanceDemo } from './utils/performanceMonitor.test';
// runPerformanceDemo();




