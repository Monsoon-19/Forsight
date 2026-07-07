/**
 * Calculates a simple moving average to smooth input data.
 * @param {Array<number>} data - Array of numeric data points.
 * @param {number} windowSize - Number of data points to include in the average.
 * @returns {Array<number>} Smoothed array of data points.
 */
const calculateMovingAverage = (data, windowSize) => {
  if (data.length === 0) return [];
  if (windowSize <= 1) return [...data];

  const smoothed = [];
  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let count = 0;
    // Look back up to windowSize - 1 elements
    for (let j = Math.max(0, i - windowSize + 1); j <= i; j++) {
      sum += data[j];
      count++;
    }
    smoothed.push(sum / count);
  }
  return smoothed;
};

module.exports = {
  calculateMovingAverage
};
