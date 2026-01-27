import type { Distribution } from './base';

function normalProbabilities(params: number[]): number[] {
  if (params.length !== 2) {
    return [1];
  }
  const mean = params[0];
  const std = params[1];
  if (std <= 0) {
    return [1];
  }

  // Normal distribution: 101 samples (0～100)
  // P(X = i) ∝ exp(-(i - mean)^2 / (2 * std^2))
  const arr = Array.from({ length: 101 }, (_, i) =>
    Math.exp(-((i - mean) * (i - mean)) / (2 * std * std)),
  );
  const sum = arr.reduce((sum, val) => sum + val, 0);
  return arr.map((val) => val / sum);
}

export const normal: Distribution = {
  type: 'normal',
  name: 'normal',
  probabilities: normalProbabilities,
  xAxisLabelKey: 'distribution.xAxisValue',
  params: [
    {
      name: 'mean',
      type: 'number',
      min: 10,
      max: 90,
      step: 1,
      defaultValue: 50,
    },
    {
      name: 'std',
      type: 'number',
      min: 0.1,
      max: 5.0,
      step: 0.1,
      defaultValue: 3.0,
    },
  ],
};
