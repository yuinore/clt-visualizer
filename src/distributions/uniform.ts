import type { Distribution } from './base';

function uniformProbabilities(params: number[]): number[] {
  if (params.length !== 1) {
    return [1];
  }
  const length = params[0];
  if (length < 1) {
    return [1];
  }
  return Array.from({ length }, () => 1 / length);
}

export const uniform: Distribution = {
  type: 'uniform',
  name: 'uniform',
  probabilities: uniformProbabilities,
  xAxisLabelKey: 'distribution.xAxisValue',
  params: [
    {
      name: 'length',
      type: 'number',
      min: 1,
      max: 10,
      step: 1,
      defaultValue: 5,
    },
  ],
};
