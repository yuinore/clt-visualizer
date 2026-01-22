import type { Distribution } from './base';

function latticeProbabilities(params: number[]): number[] {
  if (params.length !== 3) {
    return [1];
  }
  const xMin = Math.round(params[0]);
  const step = Math.round(params[1]);
  const count = Math.round(params[2]);

  if (count < 1 || step <= 0 || xMin < 0) {
    return [1];
  }

  // Calculate the maximum X value
  const xMax = xMin + (count - 1) * step;

  // Array indices correspond to X values (index i = X value i)
  const arraySize = xMax + 1;
  const probabilities = new Array(arraySize).fill(0);

  // Set uniform probability at each lattice point
  const prob = 1 / count;
  for (let i = 0; i < count; i++) {
    const x = xMin + i * step;
    if (x >= 0 && x < arraySize) {
      probabilities[x] = prob;
    }
  }

  return probabilities;
}

export const lattice: Distribution = {
  type: 'lattice',
  name: 'lattice',
  probabilities: latticeProbabilities,
  xAxisLabelKey: 'distribution.xAxisValue',
  params: [
    {
      name: 'xMin',
      type: 'number',
      min: 0,
      max: 10,
      step: 1,
      defaultValue: 0,
    },
    {
      name: 'step',
      type: 'number',
      min: 1,
      max: 10,
      step: 1,
      defaultValue: 5,
    },
    {
      name: 'count',
      type: 'number',
      min: 1,
      max: 10,
      step: 1,
      defaultValue: 3,
    },
  ],
};
