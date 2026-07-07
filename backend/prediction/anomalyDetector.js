/**
 * Calculates rolling z-score.
 * Returns true if an anomaly is detected (|z| > threshold).
 * @param {Array<number>} data - Recent data points (e.g. last 60).
 * @param {number} threshold - Z-score threshold (default 3).
 * @returns {boolean} True if the most recent point is an anomaly.
 */
const detectZScoreAnomaly = (data, threshold = 3) => {
  if (data.length < 2) return false;

  const latestValue = data[data.length - 1];
  const history = data.slice(0, data.length - 1);

  const mean = history.reduce((acc, val) => acc + val, 0) / history.length;
  const variance = history.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / history.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) {
     // If standard deviation is 0, only flag if value is significantly different from mean
     return Math.abs(latestValue - mean) > 0;
  }

  const zScore = (latestValue - mean) / stdDev;
  return Math.abs(zScore) > threshold;
};

/**
 * Checks for monotonic trend (e.g. steady memory leak).
 * @param {Array<number>} data - Recent data points (e.g. 5-minute window).
 * @returns {boolean} True if consistently rising.
 */
const detectMonotonicTrend = (data) => {
  if (data.length < 5) return false;
  
  let increasingCount = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i] > data[i-1]) {
      increasingCount++;
    }
  }

  // If 90% of points are increasing, flag as monotonic trend
  return (increasingCount / (data.length - 1)) >= 0.9;
};

module.exports = {
  detectZScoreAnomaly,
  detectMonotonicTrend
};
