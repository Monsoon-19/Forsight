/**
 * Computes linear regression (slope and intercept) using ordinary least squares.
 * @param {Array<number>} data - Array of numeric data points.
 * @returns {Object} { slope, intercept, rSquared }
 */
const calculateLinearRegression = (data) => {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: data[0] || 0, rSquared: 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = data[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
    sumYY += y * y;
  }

  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) return { slope: 0, intercept: sumY / n, rSquared: 0 };

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-squared
  const meanY = sumY / n;
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const x = i;
    const y = data[i];
    const yPred = slope * x + intercept;
    ssTot += Math.pow(y - meanY, 2);
    ssRes += Math.pow(y - yPred, 2);
  }

  const rSquared = ssTot === 0 ? 0 : 1 - (ssRes / ssTot);

  return { slope, intercept, rSquared };
};

/**
 * Predicts future value based on slope and intercept.
 * @param {number} slope
 * @param {number} intercept
 * @param {number} currentLength - The current number of data points (which acts as the current x-coordinate).
 * @param {number} futureSteps - Number of steps into the future.
 */
const predictFutureValue = (slope, intercept, currentLength, futureSteps) => {
  const futureX = currentLength - 1 + futureSteps;
  return slope * futureX + intercept;
};

module.exports = {
  calculateLinearRegression,
  predictFutureValue
};
