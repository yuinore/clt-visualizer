import type { Distribution } from './base';

function zetaProbabilities(params: number[]): number[] {
  if (params.length !== 1) {
    return [1];
  }
  const s = params[0];
  if (s <= 1) {
    return [1];
  }

  // Zeta distribution: P(X = k) = k^(-s) / ζ(s)
  // We compute probabilities for k = 1, 2, 3, ...
  // and normalize by the sum (which approximates ζ(s))
  const arr = [];
  let sum = 0;
  const THRESHOLD = 0.0002;
  const MAX_LENGTH = 1000;
  for (let i = 1; i <= MAX_LENGTH; i++) {
    // push item i until n / sum <= 0.01
    const n = 1 / Math.pow(i, s);
    arr.push(n);
    sum += n;
    if (n / sum <= THRESHOLD) {
      break;
    }
  }
  // sum is approximately ζ(s)
  return arr.map((val) => val / sum);
}

export const zeta: Distribution = {
  type: 'zeta',
  name: 'zeta',
  probabilities: zetaProbabilities,
  xAxisLabelKey: 'distribution.xAxisValue',
  params: [
    {
      name: 's',
      type: 'number',
      min: 1.5,
      max: 5,
      step: 0.1,
      defaultValue: 3,
    },
  ],
};
