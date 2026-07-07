/**
 * Classifies trend based on slope.
 * @param {number} slope 
 * @returns {'Rising' | 'Falling' | 'Stable'}
 */
const classifyTrend = (slope) => {
  if (slope > 0.05) return 'Rising';
  if (slope < -0.05) return 'Falling';
  return 'Stable';
};

/**
 * Classifies risk based on predicted value for a specific metric.
 * @param {string} metric - 'cpu' | 'memory' | 'disk' | 'network'
 * @param {number} predictedValue 
 * @returns {'Low' | 'Moderate' | 'High' | 'Critical'}
 */
const classifyRisk = (metric, predictedValue) => {
  // Assuming predicted values are percentages for cpu, memory, disk
  if (metric === 'cpu' || metric === 'memory' || metric === 'disk') {
    if (predictedValue >= 90) return 'Critical';
    if (predictedValue >= 75) return 'High';
    if (predictedValue >= 60) return 'Moderate';
    return 'Low';
  }

  if (metric === 'network') {
    // Arbitrary threshold for network, assuming MB/s or similar
    if (predictedValue >= 1000) return 'Critical';
    if (predictedValue >= 500) return 'High';
    if (predictedValue >= 100) return 'Moderate';
    return 'Low';
  }

  return 'Low';
};

module.exports = {
  classifyTrend,
  classifyRisk
};
