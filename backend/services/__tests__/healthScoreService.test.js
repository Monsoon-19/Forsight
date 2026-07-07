const { calculateHealthScore, getHealthStatus } = require('../healthScoreService');

describe('Health Score Service', () => {
  it('calculates 100 for perfect health (0 load)', () => {
    const metrics = { cpu: 0, memory: 0, disk: 0, networkUp: 0, networkDown: 0, responseTime: 0 };
    const score = calculateHealthScore(metrics);
    expect(score).toBe(100);
  });

  it('reduces score correctly under load', () => {
    const metrics = { cpu: 100, memory: 100, disk: 100, networkUp: 500, networkDown: 500, responseTime: 1000 };
    // Penalty:
    // CPU: 100 * 0.3 = 30
    // Mem: 100 * 0.25 = 25
    // Disk: 100 * 0.2 = 20
    // Net: 1000MB/s is 100% * 0.15 = 15
    // Res: 1000ms is 100% * 0.1 = 10
    // Total penalty: 30 + 25 + 20 + 15 + 10 = 100
    // Score should be 0
    const score = calculateHealthScore(metrics);
    expect(score).toBe(0);
  });

  it('returns appropriate health statuses', () => {
    expect(getHealthStatus(95)).toBe('Excellent');
    expect(getHealthStatus(75)).toBe('Healthy');
    expect(getHealthStatus(50)).toBe('Warning');
    expect(getHealthStatus(20)).toBe('Critical');
  });
});
