const { detectZScoreAnomaly, detectMonotonicTrend } = require('../anomalyDetector');

describe('Anomaly Detector', () => {
  it('detects a z-score anomaly (spike)', () => {
    const data = [10, 11, 10, 12, 10, 11, 10, 12, 10, 11, 100]; // 100 is a clear anomaly
    const isAnomaly = detectZScoreAnomaly(data, 3);
    expect(isAnomaly).toBe(true);
  });

  it('does not flag normal variations', () => {
    const data = [10, 11, 10, 12, 10, 11, 10, 12, 10, 11, 13];
    const isAnomaly = detectZScoreAnomaly(data, 3);
    expect(isAnomaly).toBe(false);
  });

  it('detects a monotonic rising trend', () => {
    const data = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const isMonotonic = detectMonotonicTrend(data);
    expect(isMonotonic).toBe(true);
  });

  it('does not flag a fluctuating trend as monotonic', () => {
    const data = [10, 12, 11, 13, 12, 14, 13, 15];
    const isMonotonic = detectMonotonicTrend(data);
    expect(isMonotonic).toBe(false);
  });
});
