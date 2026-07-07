const { calculateLinearRegression, predictFutureValue } = require('../linearRegression');

describe('Linear Regression', () => {
  it('should calculate slope and intercept correctly for a perfect line', () => {
    const data = [1, 2, 3, 4, 5]; // y = x + 1 (where x is index 0,1,2,3,4)
    // slope should be 1
    // intercept should be 1
    const result = calculateLinearRegression(data);
    expect(result.slope).toBeCloseTo(1);
    expect(result.intercept).toBeCloseTo(1);
    expect(result.rSquared).toBeCloseTo(1);
  });

  it('should handle constant values', () => {
    const data = [10, 10, 10, 10];
    const result = calculateLinearRegression(data);
    expect(result.slope).toBeCloseTo(0);
    expect(result.intercept).toBeCloseTo(10);
    expect(result.rSquared).toBe(0);
  });

  it('should predict future values correctly', () => {
    const slope = 2;
    const intercept = 5;
    // index for current length = 10, future step = 5 means x = 10 - 1 + 5 = 14
    const predicted = predictFutureValue(slope, intercept, 10, 5);
    expect(predicted).toBe(2 * 14 + 5); // 33
  });
});
