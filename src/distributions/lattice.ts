import type { Distribution } from './base';
import type { DiscreteDistribution } from '../types/discreteDistribution';

function latticeProbabilities(params: number[]): DiscreteDistribution {
  if (params.length !== 3) {
    return {
      offset: 0,
      distribution: [1],
    };
  }
  const xMin = Math.round(params[0]);

  // If xMin is negative, add an extra zero element to the left of the distribution
  // If xMin >= 0, add an extra zero element only for the right side of the distribution
  const xStart = xMin >= 0 ? xMin : 1;

  const xShift = xMin - xStart;
  const step = Math.round(params[1]);
  const count = Math.round(params[2]);

  if (count < 1 || step <= 0 || xStart < 0) {
    return {
      offset: 0,
      distribution: [1],
    };
  }

  // Calculate the maximum X value
  const xMax = xStart + (count - 1) * step;

  // Array indices correspond to X values (index i = X value i)
  const arraySize = xMax + 2;
  const probabilities = new Array(arraySize).fill(0);

  // Set uniform probability at each lattice point
  const prob = 1 / count;
  for (let i = 0; i < count; i++) {
    const x = xStart + i * step;
    if (x >= 0 && x < arraySize) {
      probabilities[x] = prob;
    }
  }

  return {
    offset: xShift,
    distribution: probabilities,
  };
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
      min: -10,
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
