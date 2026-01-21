import type { Distribution } from './base';

function bernoulliProbabilities(params: number[]): number[] {
  if (params.length !== 1) {
    return [1, 0];
  }
  const p = params[0];
  if (p < 0) {
    return [1, 0];
  }
  if (p > 1) {
    return [0, 1];
  }
  return [1 - p, p];
}

export const bernoulli: Distribution = {
  type: 'bernoulli',
  name: 'bernoulli',
  probabilities: bernoulliProbabilities,
  params: [
    {
      name: 'p',
      type: 'number',
      min: 0.05,
      max: 0.95,
      step: 0.05,
      defaultValue: 0.75,
    },
  ],
};
