/**
 * y = mx + b
 * @returns {[number, number]} - [m, b]
 */
function lineOfBestFit(x: number[], y: number[]) {
  // b = sum of (x - mean x) * (y - mean y) / sum of (x - mean x) squared
  const n = y.length;
  let sum_x = 0;
  let sum_y = 0;
  let sum_xy = 0;
  let sum_xx = 0;

  for (let i = 0; i < n; i++) {
    sum_x += x[i];
    sum_y += y[i];
    sum_xy += x[i] * y[i];
    sum_xx += x[i] * x[i];
  }

  const slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
  const intercept = (sum_y - slope * sum_x) / n;

  return [slope, intercept];
}

export default lineOfBestFit;
